#!/usr/bin/env node
// in-generate-districts.js
// Reads in-all-districts-data.json and generates in-districts.js,
// structured identically to ok-districts.js.
//
// Usage: node in-generate-districts.js
// Output: in-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'in-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'in-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('in-all-districts-data.json not found. Run in-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// Senate districts up for election in 2024 (the rest were up in 2022).
const SENATE_2024_DISTRICTS = new Set([
  2, 3, 5, 7, 8, 9, 10, 12, 13, 16, 18, 20, 24, 28, 30, 32, 33, 34, 35, 36, 37, 40, 42, 44, 50,
]);

// ── helpers ───────────────────────────────────────────────────────────────────

function lastName(name) {
  const parts = name.trim().split(/\s+/);
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
  if (party === 'rep') return 'Republican';
  if (party === 'dem') return 'Democrat';
  return party || 'TBD';
}

function getDemRep(elec) {
  if (!elec || elec.error) return { dem: 0, rep: 0 };
  return { dem: Math.round(elec.demPct), rep: Math.round(elec.repPct) };
}

function getPartisanSub(elec, incumbentName, year) {
  if (!elec || elec.error) return 'TBD';
  const last = lastName(incumbentName);
  const pct = elec.winnerParty === 'dem' ? elec.demPct : elec.winnerParty === 'rep' ? elec.repPct : null;
  if (elec.candidates.length === 1) return `${last} won unopposed in ${year}.`;
  if (pct === null) return `${last} won in ${year}.`;
  return `${last} won with ${Math.round(pct)}% in ${year}.`;
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

function genEntry(num, districtData, idPrefix, chamberLabel, type, year) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? elec.winner : 'TBD';
  const incumbentParty = elec ? partyFull(elec.winnerParty) : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName, year);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "${idPrefix}-${num}",
    name: "Indiana ${chamberLabel} District ${num}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Indiana ${chamberLabel} District ${num}",
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
for (let i = 1; i <= 100; i++) {
  houseEntries.push(genEntry(i, data.house[String(i)], 'in-hd', 'House', 'state house district', 2024));
}

const senateEntries = [];
for (let i = 1; i <= 50; i++) {
  const year = SENATE_2024_DISTRICTS.has(i) ? 2024 : 2022;
  senateEntries.push(genEntry(i, data.senate[String(i)], 'in-sd', 'Senate', 'state senate district', year));
}

const output = `/* in-districts.js — Groundwork Indiana District Data
 *
 * Generated by in-generate-districts.js from in-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (IN SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const IN_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const IN_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
