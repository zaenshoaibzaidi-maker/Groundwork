#!/usr/bin/env node
// tx-generate-districts.js
// Reads tx-all-districts-data.json and generates tx-districts.js,
// structured identically to oh-districts.js.
//
// Usage: node tx-generate-districts.js
// Output: tx-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'tx-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'tx-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('tx-all-districts-data.json not found. Run tx-fetch-all.js first.');
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

function getDemRep(elec) {
  if (!elec || elec.error) return { dem: 0, rep: 0 };
  if (elec.unopposed) {
    return elec.party === 'DEM' ? { dem: 100, rep: 0 } : { dem: 0, rep: 100 };
  }
  const pct = Math.round(elec.pct);
  if (elec.party === 'DEM') return { dem: pct, rep: 100 - pct };
  if (elec.party === 'REP') return { dem: 100 - pct, rep: pct };
  return { dem: 0, rep: 0 };
}

function getPartisanSub(elec, incumbentName) {
  if (!elec || elec.error) return 'TBD';
  const last = lastName(incumbentName);
  if (elec.unopposed) return `${last} won unopposed in 2024.`;
  return `${last} won with ${Math.round(elec.pct)}% in 2024.`;
}

function getDemosLines(race) {
  if (!race) return '';
  const entries = [
    { label: 'White',                    pct: race.nonHispanicWhitePct },
    { label: 'Black / African American', pct: race.blackPct    },
    { label: 'Hispanic / Latino',        pct: race.hispanicPct },
    { label: 'Asian',                    pct: race.asianPct    },
  ]
    .filter(e => e.pct !== null && e.pct !== undefined)
    .sort((a, b) => b.pct - a.pct);

  return entries.map((e, i) =>
    `        { label: "${e.label}", pct: ${e.pct.toFixed(2)}, color: DEMO_COLORS[${i}] }`
  ).join(',\n');
}

// ── district entry generator ──────────────────────────────────────────────────

function genEntry(num, districtData, idPrefix, chamberLabel, type) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec.party) : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "${idPrefix}-${num}",
    name: "Texas ${chamberLabel} District ${num}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Texas ${chamberLabel} District ${num}",
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

const houseEntries = [];
for (let i = 1; i <= 150; i++) {
  houseEntries.push(genEntry(i, data.house[String(i)], 'tx-hd', 'House', 'state house district'));
}

const senateEntries = [];
for (let i = 1; i <= 31; i++) {
  senateEntries.push(genEntry(i, data.senate[String(i)], 'tx-sd', 'Senate', 'state senate district'));
}

const output = `/* tx-districts.js — Groundwork Texas District Data
 *
 * Generated by tx-generate-districts.js from tx-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024 General (TX SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const TX_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const TX_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
