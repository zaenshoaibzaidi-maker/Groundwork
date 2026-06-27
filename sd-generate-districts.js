#!/usr/bin/env node
// sd-generate-districts.js
// Reads sd-all-districts-data.json and generates sd-districts.js, structured
// like ok-districts.js but extended for South Dakota's multi-member House:
// every House district elects 2 members at-large (one race, two ✓ winners)
// except the four single-member subdistricts (26A/26B/28A/28B) that replace
// dual-member districts 26 and 28 — each entry carries a `winners` array
// (1 or 2 entries) instead of assuming a single incumbent, the same shape
// nj-generate-districts.js uses for NJ's Assembly.
//
// Usage: node sd-generate-districts.js
// Output: sd-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'sd-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'sd-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('sd-all-districts-data.json not found. Run sd-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// ── helpers ───────────────────────────────────────────────────────────────────

const UPPERCASE_SUFFIXES = new Set(['II', 'III', 'IV', 'JR', 'SR']);

function capitalizeWord(word) {
  if (!word) return word;
  const upper = word.toUpperCase();
  if (UPPERCASE_SUFFIXES.has(upper)) return upper;
  if (/^MC[A-Z]{2,}$/.test(upper)) {
    return 'Mc' + word.charAt(2).toUpperCase() + word.slice(3).toLowerCase();
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function toTitleCase(str) {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (!word) return word;
    return word.split('-').map(capitalizeWord).join('-');
  }).join(' ');
}

function lastName(titleCasedName) {
  const parts = titleCasedName.trim().split(/\s+/);
  let i = parts.length - 1;
  while (i > 0 && UPPERCASE_SUFFIXES.has(parts[i].toUpperCase().replace(/\.$/, ''))) {
    i--;
  }
  return parts[i];
}

function formatIncome(n) {
  if (n === null || n === undefined) return 'N/A';
  return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatPct(n) {
  if (n === null || n === undefined) return 'N/A';
  return n.toFixed(1) + '%';
}

function formatAge(n) {
  if (n === null || n === undefined) return 'N/A';
  return n.toFixed(1);
}

function joinWithAnd(items) {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return items.join(' and ');
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}

// sd-extract-elections.js already normalizes party to short codes.
function partyFull(party) {
  if (party === 'rep') return 'Republican';
  if (party === 'dem') return 'Democrat';
  if (party === 'lib') return 'Libertarian';
  if (party === 'ind') return 'Independent';
  return party || 'TBD';
}

// Each candidate's own vote share, looked up by name in the race's
// candidate list — used for the "won with N%" messaging, distinct from
// elec.demPct/repPct which are party-wide totals across all candidates.
function candidatePct(elec, name) {
  const c = elec.candidates.find(c => c.name === name);
  if (!c || !elec.totalVotes) return 0;
  return Math.round((c.votes / elec.totalVotes) * 100);
}

function getDemosLines(race) {
  if (!race) return '';
  const entries = [
    { label: 'White',                    pct: race.nonHispanicWhitePct },
    { label: 'Black / African American', pct: race.blackPct            },
    { label: 'Hispanic / Latino',        pct: race.hispanicPct         },
    { label: 'Asian',                    pct: race.asianPct            },
  ]
    .filter(e => e.pct !== null && e.pct !== undefined)
    .sort((a, b) => b.pct - a.pct);

  return entries.map((e, i) =>
    `        { label: "${e.label}", pct: ${e.pct.toFixed(2)}, color: DEMO_COLORS[${i}] }`
  ).join(',\n');
}

function sortDistrictKeys(keys) {
  return keys.slice().sort((a, b) => parseInt(a, 10) - parseInt(b, 10) || a.localeCompare(b));
}

// ── Senate entry (1 winner per district) ─────────────────────────────────────

function genSenateEntry(key, districtData) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec.winnerParty) : 'TBD';
  const dem = elec ? Math.round(elec.demPct) : 0;
  const rep = elec ? Math.round(elec.repPct) : 0;

  let partisanSub = 'TBD';
  if (elec) {
    const last = lastName(incumbentName);
    const unopposed = elec.candidates.length === 1;
    const pct = candidatePct(elec, elec.winner);
    partisanSub = unopposed
      ? `${last} won unopposed in 2024.`
      : `${last} won with ${pct}% in 2024.`;
  }

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  const id = elec ? elec.districtId : `sd-sd-${key}`;

  return `  {
    id: "${id}",
    name: "South Dakota Senate District ${key}",
    type: "state senate district",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "South Dakota Senate District ${key}",
      chips: [],
      stats: [
        { label: "Median Household Income", value: ${JSON.stringify(income)}, sub: "" },
        { label: "College-Educated Adults",  value: ${JSON.stringify(college)},  sub: "" },
        { label: "Median Age",               value: ${JSON.stringify(age)},   sub: "" },
        { label: "Renter Rate",              value: ${JSON.stringify(renter)}, sub: "" }
      ],
      dem: ${dem}, rep: ${rep},
      partisanSub: ${JSON.stringify(partisanSub)},
      demos: [
${demos}
      ],
      issues: [],
      memoHeadline: "",
      memoParagraphs: [],
      memoBullets: []
    }
  }`;
}

// ── House entry (2 winners, except 1 for 26A/26B/28A/28B) ────────────────────

function genHouseEntry(key, districtData) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const winners = elec ? elec.winners.map(w => ({ name: toTitleCase(w.name), party: w.party })) : [];

  const incumbentName = winners.length ? winners.map(w => w.name).join(' & ') : 'TBD';
  const incumbentParty = winners.length
    ? (new Set(winners.map(w => w.party)).size === 1 ? partyFull(winners[0].party) : 'Split')
    : 'TBD';

  const dem = elec ? Math.round(elec.demPct) : 0;
  const rep = elec ? Math.round(elec.repPct) : 0;

  let partisanSub = 'TBD';
  if (elec) {
    const unopposed = elec.candidates.length === elec.winners.length;
    const parts = elec.winners.map(w => `${lastName(toTitleCase(w.name))} (${candidatePct(elec, w.name)}%)`);
    partisanSub = unopposed
      ? `${joinWithAnd(elec.winners.map(w => lastName(toTitleCase(w.name))))} won unopposed in 2024.`
      : `${joinWithAnd(parts)} won in 2024.`;
  }

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  const id = elec ? elec.districtId : `sd-hd-${key}`;

  const winnersLiteral = winners.map(w =>
    `      { name: ${JSON.stringify(w.name)}, party: ${JSON.stringify(partyFull(w.party))} }`
  ).join(',\n');

  return `  {
    id: "${id}",
    name: "South Dakota House District ${key}",
    type: "state house district",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    winners: [
${winnersLiteral}
    ],
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "South Dakota House District ${key}",
      chips: [],
      stats: [
        { label: "Median Household Income", value: ${JSON.stringify(income)}, sub: "" },
        { label: "College-Educated Adults",  value: ${JSON.stringify(college)},  sub: "" },
        { label: "Median Age",               value: ${JSON.stringify(age)},   sub: "" },
        { label: "Renter Rate",              value: ${JSON.stringify(renter)}, sub: "" }
      ],
      dem: ${dem}, rep: ${rep},
      partisanSub: ${JSON.stringify(partisanSub)},
      demos: [
${demos}
      ],
      issues: [],
      memoHeadline: "",
      memoParagraphs: [],
      memoBullets: []
    }
  }`;
}

// ── build output ──────────────────────────────────────────────────────────────

const senateKeys = sortDistrictKeys(Object.keys(data.senate));
const houseKeys  = sortDistrictKeys(Object.keys(data.house));

const senateEntries = senateKeys.map(k => genSenateEntry(k, data.senate[k]));
const houseEntries  = houseKeys.map(k => genHouseEntry(k, data.house[k]));

// Verify one complete Senate and one complete House district before writing.
console.log('── Senate sample (district 1) ──');
console.log(senateEntries[0]);
console.log('\n── House sample (district 1) ──');
console.log(houseEntries[0]);

const output = `/* sd-districts.js — Groundwork South Dakota District Data
 *
 * Generated by sd-generate-districts.js from sd-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024 General (SD SOS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const SD_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];

const SD_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`\nWritten → ${OUTPUT}`);
console.log(`  Senate districts: ${senateEntries.length}`);
console.log(`  House districts:  ${houseEntries.length}`);
