#!/usr/bin/env node
// mt-generate-districts.js
// Reads mt-all-districts-data.json and generates mt-districts.js,
// structured identically to tx-districts.js.
//
// Usage: node mt-generate-districts.js
// Output: mt-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'mt-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'mt-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('mt-all-districts-data.json not found. Run mt-fetch-all.js first.');
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

function totalVotes(elec) {
  return (elec.candidates || []).reduce((sum, c) => sum + (c.votes || 0), 0);
}

function findWinnerCandidate(elec) {
  if (!elec || !Array.isArray(elec.candidates)) return null;
  return elec.candidates.find(c => c.name === elec.winner) || null;
}

function partyFull(elec) {
  const c = findWinnerCandidate(elec);
  return (c && c.party) || 'TBD';
}

function getDemRep(elec) {
  if (!elec || elec.error || !Array.isArray(elec.candidates) || elec.candidates.length === 0) {
    return { dem: 0, rep: 0 };
  }
  const total = totalVotes(elec);
  if (total === 0) return { dem: 0, rep: 0 };
  let dem = 0, rep = 0;
  for (const c of elec.candidates) {
    const pct = (c.votes / total) * 100;
    if (c.party === 'Democratic') dem += pct;
    else if (c.party === 'Republican') rep += pct;
  }
  return { dem: Math.round(dem), rep: Math.round(rep) };
}

function getPartisanSub(elec, incumbentName) {
  if (!elec || elec.error) return 'TBD';
  const last = lastName(incumbentName);
  if (elec.candidates && elec.candidates.length === 1) {
    return `${last} won unopposed in ${elec.year}.`;
  }
  const winnerCand = findWinnerCandidate(elec);
  const total = totalVotes(elec);
  if (winnerCand && total > 0) {
    const pct = Math.round((winnerCand.votes / total) * 100);
    return `${last} won with ${pct}% in ${elec.year}.`;
  }
  return 'TBD';
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

function genEntry(num, districtData, idPrefix, chamberLabel, type) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec) : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "${idPrefix}-${num}",
    name: "Montana ${chamberLabel} District ${num}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Montana ${chamberLabel} District ${num}",
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
  houseEntries.push(genEntry(i, data.house[String(i)], 'mt-hd', 'House', 'state house district'));
}

const senateEntries = [];
for (let i = 1; i <= 50; i++) {
  senateEntries.push(genEntry(i, data.senate[String(i)], 'mt-sd', 'Senate', 'state senate district'));
}

const output = `/* mt-districts.js — Groundwork Montana District Data
 *
 * Generated by mt-generate-districts.js from mt-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (MT SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const MT_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const MT_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
