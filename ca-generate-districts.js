#!/usr/bin/env node
// ca-generate-districts.js
// Reads ca-all-districts-data.json and generates ca-districts.js,
// structured identically to ok-districts.js.
//
// Usage: node ca-generate-districts.js
// Output: ca-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'ca-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'ca-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('ca-all-districts-data.json not found. Run ca-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

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
  if (party === 'DEM') return 'Democrat';
  if (party === 'REP') return 'Republican';
  return party || 'TBD';
}

// ca-elections-data.json (via ca-fetch-all.js) records winner/runnerUp as
// separate winnerParty+winnerPct / runnerUpParty+runnerUpPct fields (not a
// single party+pct pair), and top-two races are sometimes same-party (e.g.
// REP vs REP), so dem/rep are accumulated per party across both candidates
// rather than derived from one pct via (100 - pct).
function getDemRep(elec) {
  if (!elec || elec.error) return { dem: 0, rep: 0 };
  let dem = 0, rep = 0;
  if (elec.winnerParty === 'DEM') dem += elec.winnerPct;
  else if (elec.winnerParty === 'REP') rep += elec.winnerPct;
  if (elec.opposed) {
    if (elec.runnerUpParty === 'DEM') dem += elec.runnerUpPct;
    else if (elec.runnerUpParty === 'REP') rep += elec.runnerUpPct;
  }
  return { dem: Math.round(dem), rep: Math.round(rep) };
}

function getPartisanSub(elec, incumbentName, year) {
  if (!elec || elec.error) return 'TBD';
  const last = lastName(incumbentName);
  if (!elec.opposed) return `${last} won unopposed in ${year}.`;
  return `${last} won with ${Math.round(elec.winnerPct)}% in ${year}.`;
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

function genEntry(num, districtData, idPrefix, chamberLabel, type, year, nextElection) {
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
    name: "California ${chamberLabel} District ${num}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "${nextElection}",
    seatStatus: "Active",
    dashboard: {
      subtitle: "California ${chamberLabel} District ${num}",
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
for (let i = 1; i <= 80; i++) {
  houseEntries.push(
    genEntry(i, data.house[String(i)], 'ca-hd', 'Assembly', 'state assembly district', 2024, 'November 2026')
  );
}

const senateEntries = [];
for (let i = 1; i <= 40; i++) {
  // CA Senate seats are staggered 4-year terms: odd districts were last up
  // in the 2024 general (next up 2028), even districts in 2022 (next up 2026).
  const year         = i % 2 === 1 ? 2024 : 2022;
  const nextElection = i % 2 === 1 ? 'November 2028' : 'November 2026';
  senateEntries.push(
    genEntry(i, data.senate[String(i)], 'ca-sd', 'Senate', 'state senate district', year, nextElection)
  );
}

const output = `/* ca-districts.js — Groundwork California District Data
 *
 * Generated by ca-generate-districts.js from ca-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (CA SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const CA_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const CA_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
