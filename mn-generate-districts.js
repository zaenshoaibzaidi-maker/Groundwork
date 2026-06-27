#!/usr/bin/env node
// mn-generate-districts.js
// Reads mn-all-districts-data.json and generates mn-districts.js.
//
// Minnesota has 67 Senate districts (single-member) and 134 House districts:
// each Senate district number is split into two single-member House
// subdistricts ("A"/"B", e.g. 1A/1B ... 67A/67B), each with its own election
// and census data — analogous to how nh-generate-districts.js treats each
// New Hampshire House district as its own entry rather than merging districts
// that happen to share a county or number.
//
// Usage: node mn-generate-districts.js
// Output: mn-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'mn-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'mn-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('mn-all-districts-data.json not found. Run mn-fetch-all.js first.');
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

// MN election data already reports parties as "Democratic" / "Republican"
// (DFL normalized to "Democratic" upstream in mn-extract-elections.js).
function partyFull(party) {
  if (party === 'Democratic') return 'Democrat';
  if (party === 'Republican') return 'Republican';
  return party || 'TBD';
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

function sortSenateKeys(keys) {
  return keys.slice().sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

// House keys are subdistrict labels like "1A", "67B" — sort by number then letter.
function sortHouseKeys(keys) {
  return keys.slice().sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    if (numA !== numB) return numA - numB;
    return a.slice(String(numA).length).localeCompare(b.slice(String(numB).length));
  });
}

// ── Senate entry (1 winner, 2022 General) ────────────────────────────────────

function genSenateEntry(districtId, districtData) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const winner = elec && elec.winners && elec.winners[0] ? elec.winners[0] : null;
  const incumbentName  = winner ? toTitleCase(winner.name) : 'TBD';
  const incumbentParty = winner ? partyFull(winner.party) : 'TBD';

  const dem = elec ? Math.round(elec.demPct) : 0;
  const rep = elec ? Math.round(elec.repPct) : 0;

  let partisanSub = 'TBD';
  if (elec && winner) {
    const last = lastName(incumbentName);
    if (elec.candidates.length === 1) {
      partisanSub = `${last} won unopposed in 2022.`;
    } else {
      const pct = winner.party === 'Democratic' ? elec.demPct : winner.party === 'Republican' ? elec.repPct : null;
      partisanSub = pct === null ? `${last} won in 2022.` : `${last} won with ${Math.round(pct)}% in 2022.`;
    }
  }

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "mn-sd-${districtId}",
    name: "Minnesota Senate District ${districtId}",
    type: "state senate district",
    city: "TBD",
    region: "TBD",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Minnesota Senate District ${districtId}",
      chips: [],
      stats: [
        { label: "Median Household Income", value: ${JSON.stringify(income)},   sub: "" },
        { label: "College-Educated Adults",  value: ${JSON.stringify(college)}, sub: "" },
        { label: "Median Age",               value: ${JSON.stringify(age)},     sub: "" },
        { label: "Renter Rate",              value: ${JSON.stringify(renter)},  sub: "" }
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

// ── House entry (1 winner per A/B subdistrict, 2024 General) ───────────────

function genHouseEntry(districtId, districtData) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const winner = elec && elec.winners && elec.winners[0] ? elec.winners[0] : null;
  const incumbentName  = winner ? toTitleCase(winner.name) : 'TBD';
  const incumbentParty = winner ? partyFull(winner.party) : 'TBD';

  const dem = elec ? Math.round(elec.demPct) : 0;
  const rep = elec ? Math.round(elec.repPct) : 0;

  let partisanSub = 'TBD';
  if (elec && winner) {
    const last = lastName(incumbentName);
    if (elec.candidates.length === 1) {
      partisanSub = `${last} won unopposed in 2024.`;
    } else {
      const pct = winner.party === 'Democratic' ? elec.demPct : winner.party === 'Republican' ? elec.repPct : null;
      partisanSub = pct === null ? `${last} won in 2024.` : `${last} won with ${Math.round(pct)}% in 2024.`;
    }
  }

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "mn-hd-${districtId.toLowerCase()}",
    name: "Minnesota House District ${districtId}",
    type: "state house district",
    city: "TBD",
    region: "TBD",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Minnesota House District ${districtId}",
      chips: [],
      stats: [
        { label: "Median Household Income", value: ${JSON.stringify(income)},   sub: "" },
        { label: "College-Educated Adults",  value: ${JSON.stringify(college)}, sub: "" },
        { label: "Median Age",               value: ${JSON.stringify(age)},     sub: "" },
        { label: "Renter Rate",              value: ${JSON.stringify(renter)},  sub: "" }
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

const senateKeys = sortSenateKeys(Object.keys(data.senate));
const houseKeys  = sortHouseKeys(Object.keys(data.house));

const senateEntries = senateKeys.map(k => genSenateEntry(k, data.senate[k]));
const houseEntries  = houseKeys.map(k => genHouseEntry(k, data.house[k]));

const output = `/* mn-districts.js — Groundwork Minnesota District Data
 *
 * Generated by mn-generate-districts.js from mn-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023)
 * Elections: 2024 General (House, by A/B subdistrict) / 2022 General (Senate) (MN SOS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const MN_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];

const MN_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  Senate districts: ${senateEntries.length}`);
console.log(`  House districts:  ${houseEntries.length}`);
