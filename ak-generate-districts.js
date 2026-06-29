#!/usr/bin/env node
// ak-generate-districts.js
// Reads ak-all-districts-data.json and generates ak-districts.js,
// structured identically to tx-districts.js.
//
// Usage: node ak-generate-districts.js
// Output: ak-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'ak-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'ak-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('ak-all-districts-data.json not found. Run ak-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// Alaska Senate seats are staggered 4-year terms — these 10 districts were
// last elected in 2022 (see ak-extract-elections.js), so they're next up in
// 2026, while the other 10 (elected 2024) are next up in 2028. House seats
// are all 2-year terms, all up again in 2026.
const SENATE_2022_LETTERS = new Set(['A', 'C', 'E', 'G', 'I', 'K', 'M', 'O', 'Q', 'S']);

// ── helpers ───────────────────────────────────────────────────────────────────

const UPPERCASE_SUFFIXES = new Set(['II', 'III', 'IV', 'JR', 'SR']);

function capitalizeSegment(segment) {
  if (!segment) return segment;
  let capitalized = segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
  if (/^Mc[a-z]/.test(capitalized)) {
    capitalized = capitalized.slice(0, 2) + capitalized.charAt(2).toUpperCase() + capitalized.slice(3);
  }
  return capitalized;
}

function toTitleCase(str) {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (!word) return word;
    const upper = word.toUpperCase();
    if (UPPERCASE_SUFFIXES.has(upper)) return upper;
    return word.split(/([-'])/).map(part => (part === '-' || part === "'") ? part : capitalizeSegment(part)).join('');
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
  if (party === 'rep') return 'Republican';
  if (party === 'dem') return 'Democrat';
  if (party === 'ind') return 'Independent';
  return party || 'TBD';
}

// ak-elections-data.json already carries demPct/repPct as shares of
// totalVotes (not assumed to sum to 100 — Alaska races often have a
// significant non-major-party/independent share), so these are used as-is
// rather than derived from a winner/runner-up pair.
function getDemRep(elec) {
  if (!elec || elec.error) return { dem: 0, rep: 0 };
  return { dem: Math.round(elec.demPct), rep: Math.round(elec.repPct) };
}

// The winner isn't always DEM/REP (independents win several AK races), so
// their first-round share is read off the matching candidates[] entry
// rather than reused from demPct/repPct.
function getWinnerPct(elec) {
  const winner = elec.candidates.find(c => c.name === elec.winner);
  return winner ? Math.round((winner.votes / elec.totalVotes) * 100) : 0;
}

function getPartisanSub(elec, incumbentName, year) {
  if (!elec || elec.error) return 'TBD';
  const last = lastName(incumbentName);
  if (elec.candidates.length === 1) return `${last} won unopposed in ${year}.`;
  return `${last} won with ${getWinnerPct(elec)}% in ${year}.`;
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

function genEntry(id, districtData, label, type, electionYear, nextElectionYear) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec.winnerParty) : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName, electionYear);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "${id}",
    name: "Alaska ${label}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November ${nextElectionYear}",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Alaska ${label}",
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
for (let i = 1; i <= 40; i++) {
  houseEntries.push(genEntry(`ak-hd-${i}`, data.house[String(i)], `House District ${i}`, 'state house district', 2024, 2026));
}

const SENATE_LETTERS = 'ABCDEFGHIJKLMNOPQRST'.split('');

const senateEntries = [];
for (const letter of SENATE_LETTERS) {
  const electionYear     = SENATE_2022_LETTERS.has(letter) ? 2022 : 2024;
  const nextElectionYear = SENATE_2022_LETTERS.has(letter) ? 2026 : 2028;
  senateEntries.push(genEntry(`ak-sd-${letter}`, data.senate[letter], `Senate District ${letter}`, 'state senate district', electionYear, nextElectionYear));
}

const output = `/* ak-districts.js — Groundwork Alaska District Data
 *
 * Generated by ak-generate-districts.js from ak-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (AK Division of Elections)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const AK_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const AK_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
