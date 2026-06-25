#!/usr/bin/env node
// ma-generate-districts.js
// Reads ma-all-districts-data.json and generates ma-districts.js,
// structured identically to ok-districts.js (single-member districts).
//
// Usage: node ma-generate-districts.js
// Output: ma-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'ma-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'ma-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('ma-all-districts-data.json not found. Run ma-fetch-all.js first.');
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

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

function getDemRep(elec) {
  if (!elec || elec.error) return { dem: 0, rep: 0 };
  if (elec.unopposed) {
    return elec.party === 'Democratic' ? { dem: 100, rep: 0 } : { dem: 0, rep: 100 };
  }
  const pct = Math.round(elec.pct);
  if (elec.party === 'Democratic') return { dem: pct, rep: 100 - pct };
  if (elec.party === 'Republican') return { dem: 100 - pct, rep: pct };
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

// ── district entry generator ──────────────────────────────────────────────────

function genEntry(districtName, districtData, idPrefix, chamberLabel, type) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? elec.party : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  const id = `${idPrefix}-${slugify(districtName)}`;

  return `  {
    id: "${id}",
    name: "Massachusetts ${chamberLabel} District - ${districtName}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Massachusetts ${chamberLabel} District - ${districtName}",
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

const houseNames = Object.keys(data.house);
const houseEntries = houseNames.map(name =>
  genEntry(name, data.house[name], 'ma-house', 'House', 'state house district')
);

const senateNames = Object.keys(data.senate);
const senateEntries = senateNames.map(name =>
  genEntry(name, data.senate[name], 'ma-senate', 'Senate', 'state senate district')
);

const output = `/* ma-districts.js — Groundwork Massachusetts District Data
 *
 * Generated by ma-generate-districts.js from ma-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024 General (MA SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const MA_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const MA_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
