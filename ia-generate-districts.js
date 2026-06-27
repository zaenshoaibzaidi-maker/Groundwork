#!/usr/bin/env node
// ia-generate-districts.js
// Reads ia-all-districts-data.json and generates ia-districts.js,
// structured identically to ky-districts.js. All Iowa House and Senate
// districts are single-seat, single-winner — no multi-member complexity.
//
// Usage: node ia-generate-districts.js
// Output: ia-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'ia-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'ia-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('ia-all-districts-data.json not found. Run ia-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// Senate districts up for election in 2024 (even); the rest (odd) were up in
// 2022 — Iowa Senate seats are staggered across the two cycles.

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
    name: "Iowa ${chamberLabel} District ${num}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Iowa ${chamberLabel} District ${num}",
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
  houseEntries.push(genEntry(i, data.house[String(i)], 'ia-hd', 'House', 'state house district', 2024));
}

const senateEntries = [];
for (let i = 1; i <= 50; i++) {
  const year = i % 2 === 1 ? 2022 : 2024;
  senateEntries.push(genEntry(i, data.senate[String(i)], 'ia-sd', 'Senate', 'state senate district', year));
}

const output = `/* ia-districts.js — Groundwork Iowa District Data
 *
 * Generated by ia-generate-districts.js from ia-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (IA SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const IA_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const IA_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
