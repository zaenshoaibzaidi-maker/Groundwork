#!/usr/bin/env node
// wy-generate-districts.js
// Reads wy-all-districts-data.json and generates wy-districts.js,
// structured identically to tx-districts.js.
//
// Usage: node wy-generate-districts.js
// Output: wy-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'wy-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'wy-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('wy-all-districts-data.json not found. Run wy-fetch-all.js first.');
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
    // Skip leading non-letters (e.g. the opening quote in "'Mike'") so the
    // first actual letter gets capitalized instead of the quote itself.
    const m = word.match(/^(\W*)([a-zA-Z])(.*)$/);
    if (!m) return word;
    const [, lead, first, rest] = m;
    return lead + first.toUpperCase() + rest.toLowerCase();
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
  if (party === 'R') return 'Republican';
  if (party === 'D') return 'Democrat';
  if (party === 'I') return 'Independent';
  if (party === 'L') return 'Libertarian';
  if (party === 'C') return 'Constitution Party';
  return party || 'TBD';
}

function getDemRep(elec) {
  if (!elec || elec.error || !elec.candidates || !elec.candidates.length) return { dem: 0, rep: 0 };
  const total = elec.candidates.reduce((sum, c) => sum + c.votes, 0);
  if (total === 0) return { dem: 0, rep: 0 };
  const demVotes = elec.candidates.filter(c => c.party === 'D').reduce((sum, c) => sum + c.votes, 0);
  const repVotes = elec.candidates.filter(c => c.party === 'R').reduce((sum, c) => sum + c.votes, 0);
  return { dem: Math.round((demVotes / total) * 100), rep: Math.round((repVotes / total) * 100) };
}

function getPartisanSub(elec, incumbentName) {
  if (!elec || elec.error || !elec.candidates || !elec.candidates.length) return 'TBD';
  const last = lastName(incumbentName);
  if (elec.candidates.length === 1) return `${last} won unopposed in ${elec.year}.`;
  const total = elec.candidates.reduce((sum, c) => sum + c.votes, 0);
  const winnerVotes = elec.candidates.find(c => c.name === elec.winner).votes;
  const pct = total > 0 ? Math.round((winnerVotes / total) * 100) : 0;
  return `${last} won with ${pct}% in ${elec.year}.`;
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

function genEntry(num, districtData, idPrefix, chamberLabel, type, chamber) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec.candidates.find(c => c.name === elec.winner).party) : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  // House terms are 2 years; Senate terms are 4 years (staggered by district parity).
  const nextElection = elec
    ? `November ${elec.year + (chamber === 'house' ? 2 : 4)}`
    : 'November 2026';

  return `  {
    id: "${idPrefix}-${num}",
    name: "Wyoming ${chamberLabel} District ${num}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "${nextElection}",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Wyoming ${chamberLabel} District ${num}",
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
for (let i = 1; i <= 62; i++) {
  houseEntries.push(genEntry(i, data.house[String(i)], 'wy-hd', 'House', 'state house district', 'house'));
}

const senateEntries = [];
for (let i = 1; i <= 31; i++) {
  senateEntries.push(genEntry(i, data.senate[String(i)], 'wy-sd', 'Senate', 'state senate district', 'senate'));
}

const output = `/* wy-districts.js — Groundwork Wyoming District Data
 *
 * Generated by wy-generate-districts.js from wy-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (WY SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const WY_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const WY_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
