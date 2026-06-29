#!/usr/bin/env node
// id-generate-districts.js
// Reads id-all-districts-data.json and generates id-districts.js,
// structured identically to ok-districts.js.
//
// Idaho's 35 House districts each elect two separate single-winner seats
// (Representative A and Representative B) from the same district geography,
// so each seat becomes its own district entry ("id-hd-Na" / "id-hd-Nb").
// Senate districts are standard single-winner ("id-sd-N").
//
// Usage: node id-generate-districts.js
// Output: id-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'id-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'id-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('id-all-districts-data.json not found. Run id-fetch-all.js first.');
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
  if (!elec.opposed) {
    return elec.winnerParty === 'DEM' ? { dem: 100, rep: 0 } : { dem: 0, rep: 100 };
  }
  const pct = Math.round(elec.winnerPct);
  if (elec.winnerParty === 'DEM') return { dem: pct, rep: 100 - pct };
  if (elec.winnerParty === 'REP') return { dem: 100 - pct, rep: pct };
  return { dem: 0, rep: 0 };
}

function getPartisanSub(elec, incumbentName) {
  if (!elec || elec.error) return 'TBD';
  const last = lastName(incumbentName);
  if (!elec.opposed) return `${last} won unopposed in 2024.`;
  return `${last} won with ${Math.round(elec.winnerPct)}% in 2024.`;
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

function genEntry(id, name, census, elec, type) {
  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec.winnerParty) : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "${id}",
    name: "${name}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "${name}",
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
const senateEntries = [];

for (let i = 1; i <= 35; i++) {
  const district = data.districts[String(i)];
  const census = district && district.census ? district.census : null;
  const elec   = district && district.election ? district.election : null;

  const houseCensus = census && census.house && !census.house.error ? census.house : null;
  const senateCensus = census && census.senate && !census.senate.error ? census.senate : null;

  const repA = elec && elec.repA && !elec.repA.error ? elec.repA : null;
  const repB = elec && elec.repB && !elec.repB.error ? elec.repB : null;
  const senator = elec && elec.senator && !elec.senator.error ? elec.senator : null;

  houseEntries.push(genEntry(
    `id-hd-${i}a`, `Idaho House District ${i}A`, houseCensus, repA, 'state house district'
  ));
  houseEntries.push(genEntry(
    `id-hd-${i}b`, `Idaho House District ${i}B`, houseCensus, repB, 'state house district'
  ));
  senateEntries.push(genEntry(
    `id-sd-${i}`, `Idaho Senate District ${i}`, senateCensus, senator, 'state senate district'
  ));
}

const output = `/* id-districts.js — Groundwork Idaho District Data
 *
 * Generated by id-generate-districts.js from id-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024 General (Idaho SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const ID_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const ID_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
