#!/usr/bin/env node
// md-generate-districts.js
// Reads md-all-districts-data.json and generates md-districts.js.
// Maryland house districts come in three seat configurations:
//   1-seat subdistricts (e.g. "1A", "1B") → single incumbentName/incumbentParty
//   2-seat subdistricts (e.g. "2A")        → incumbents[] array
//   3-seat at-large districts (e.g. "3")   → incumbents[] array
// Senate districts are all single-member.

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'md-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'md-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('md-all-districts-data.json not found. Run md-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// ── helpers ───────────────────────────────────────────────────────────────────

const UPPERCASE_SUFFIXES = new Set(['II', 'III', 'IV', 'JR', 'SR']);

function toTitleCase(str) {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (!word) return word;
    const upper = word.toUpperCase();
    if (UPPERCASE_SUFFIXES.has(upper)) return upper;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

function lastName(titleCasedName) {
  const parts = titleCasedName.trim().split(/\s+/);
  return parts[parts.length - 1];
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

function partyFull(party) {
  if (party === 'REP') return 'Republican';
  if (party === 'DEM') return 'Democrat';
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

// Sort district keys numerically by base number, then alphabetically by suffix
function sortDistrictKeys(keys) {
  return keys.slice().sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    if (numA !== numB) return numA - numB;
    const sufA = a.replace(/^\d+/, '');
    const sufB = b.replace(/^\d+/, '');
    return sufA.localeCompare(sufB);
  });
}

// ── single-seat entry (1 winner) ──────────────────────────────────────────────

function genSingleEntry(districtId, districtData, chamberLabel, type) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec.party) : 'TBD';

  let dem = 0, rep = 0;
  if (elec) {
    if (elec.unopposed) {
      dem = elec.party === 'DEM' ? 100 : 0;
      rep = elec.party === 'REP' ? 100 : 0;
    } else {
      const pct = Math.round(elec.pct);
      dem = elec.party === 'DEM' ? pct : 100 - pct;
      rep = elec.party === 'REP' ? pct : 100 - pct;
    }
  }

  let partisanSub = 'TBD';
  if (elec) {
    const last = lastName(incumbentName);
    partisanSub = elec.unopposed
      ? `${last} won unopposed in 2024.`
      : `${last} won with ${Math.round(elec.pct)}% in 2024.`;
  }

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "md-${chamberLabel === 'House' ? 'hd' : 'sd'}-${districtId}",
    name: "Maryland ${chamberLabel} District ${districtId}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Maryland ${chamberLabel} District ${districtId}",
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

// ── multi-seat entry (2 or 3 winners) ────────────────────────────────────────

function genMultiEntry(districtId, districtData, chamberLabel, type) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const winners = (elec && elec.winners) ? elec.winners : [];
  const seats   = (elec && elec.seats)   ? elec.seats   : winners.length;

  const incumbents = winners.map(w => ({
    name:  toTitleCase(w.name),
    party: partyFull(w.party),
  }));

  // partisan bar: fraction of winners by party
  const demWins = winners.filter(w => w.party === 'DEM').length;
  const repWins = winners.filter(w => w.party === 'REP').length;
  const total   = seats || 1;
  const dem = Math.round(100 * demWins / total);
  const rep = Math.round(100 * repWins / total);

  // partisanSub: short description of result
  let partisanSub = 'TBD';
  if (winners.length > 0) {
    const unopposed = elec && elec.unopposed;
    if (demWins === seats) {
      partisanSub = unopposed
        ? `Democrats swept all ${seats} seats unopposed in 2024.`
        : `Democrats swept all ${seats} seats in 2024.`;
    } else if (repWins === seats) {
      partisanSub = unopposed
        ? `Republicans swept all ${seats} seats unopposed in 2024.`
        : `Republicans swept all ${seats} seats in 2024.`;
    } else {
      const parts = [];
      if (demWins > 0) parts.push(`${demWins} DEM`);
      if (repWins > 0) parts.push(`${repWins} REP`);
      partisanSub = `Split result in 2024: ${parts.join(', ')} of ${seats} seats.`;
    }
  }

  const incumbentsLiteral = incumbents.map(inc =>
    `      { name: ${JSON.stringify(inc.name)}, party: ${JSON.stringify(inc.party)} }`
  ).join(',\n');

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  const prefix = chamberLabel === 'House' ? 'hd' : 'sd';

  return `  {
    id: "md-${prefix}-${districtId}",
    name: "Maryland ${chamberLabel} District ${districtId}",
    type: "${type}",
    incumbents: [
${incumbentsLiteral}
    ],
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Maryland ${chamberLabel} District ${districtId}",
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

// ── dispatch by seat count ────────────────────────────────────────────────────

function genHouseEntry(districtId, districtData) {
  const elec  = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;
  const seats = elec ? elec.seats : 1;

  if (seats === 1) {
    return genSingleEntry(districtId, districtData, 'House', 'state house district');
  }
  return genMultiEntry(districtId, districtData, 'House', 'state house district');
}

function genSenateEntry(districtId, districtData) {
  return genSingleEntry(districtId, districtData, 'Senate', 'state senate district');
}

// ── build output ──────────────────────────────────────────────────────────────

const houseKeys  = sortDistrictKeys(Object.keys(data.house));
const senateKeys = sortDistrictKeys(Object.keys(data.senate));

const houseEntries  = houseKeys.map(k  => genHouseEntry(k,  data.house[k]));
const senateEntries = senateKeys.map(k => genSenateEntry(k, data.senate[k]));

const output = `/* md-districts.js — Groundwork Maryland District Data
 *
 * Generated by md-generate-districts.js from md-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2022 General (MD SBE)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const MD_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const MD_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
