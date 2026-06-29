#!/usr/bin/env node
// hi-generate-districts.js
// Reads hi-all-districts-data.json and generates hi-districts.js,
// structured identically to tx-districts.js.
//
// Usage: node hi-generate-districts.js
// Output: hi-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'hi-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'hi-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('hi-all-districts-data.json not found. Run hi-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// Hawaii Senate seats are staggered 4-year terms — these districts were last
// elected in 2022 (see hi-extract-elections.js), so they're next up in 2026,
// while the districts elected in 2024 are next up in 2028. House seats are
// all 2-year terms, all up again in 2026.
const SENATE_2022_DISTRICTS = new Set([2, 5, 8, 9, 10, 11, 13, 14, 15, 17, 20, 21, 25]);

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

// Districts hardcoded as uncontested in hi-extract-elections.js carry
// totalVotes: 0 and an empty candidates[] (no opposing-vote data exists to
// report), so they're treated the same as a single-candidate race below.
function isUnopposed(elec) {
  return elec.candidates.length <= 1;
}

// hi-elections-data.json carries demPct/repPct as shares of totalVotes (not
// assumed to sum to 100 — independents/third parties take a share in some
// races), so these are used as-is rather than derived from a winner/runner-up
// pair. Uncontested races have no vote data at all, so they're shown as a
// 100/0 (or 0/100) split based on the winner's party, matching how contested
// unopposed races would round.
function getDemRep(elec) {
  if (!elec || elec.error) return { dem: 0, rep: 0 };
  if (isUnopposed(elec) && elec.totalVotes === 0) {
    if (elec.winnerParty === 'dem') return { dem: 100, rep: 0 };
    if (elec.winnerParty === 'rep') return { dem: 0, rep: 100 };
    return { dem: 0, rep: 0 };
  }
  return { dem: Math.round(elec.demPct), rep: Math.round(elec.repPct) };
}

function getWinnerPct(elec) {
  const winner = elec.candidates.find(c => c.name === elec.winner);
  return winner ? Math.round((winner.votes / elec.totalVotes) * 100) : 0;
}

function getPartisanSub(elec, incumbentName, year) {
  if (!elec || elec.error) return 'TBD';
  const last = lastName(incumbentName);
  if (isUnopposed(elec)) return `${last} won unopposed in ${year}.`;
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
    name: "Hawaii ${label}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November ${nextElectionYear}",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Hawaii ${label}",
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
for (let i = 1; i <= 51; i++) {
  houseEntries.push(genEntry(`hi-hd-${i}`, data.house[String(i)], `House District ${i}`, 'state house district', 2024, 2026));
}

const senateEntries = [];
for (let i = 1; i <= 25; i++) {
  const electionYear     = SENATE_2022_DISTRICTS.has(i) ? 2022 : 2024;
  const nextElectionYear = SENATE_2022_DISTRICTS.has(i) ? 2026 : 2028;
  senateEntries.push(genEntry(`hi-sd-${i}`, data.senate[String(i)], `Senate District ${i}`, 'state senate district', electionYear, nextElectionYear));
}

const output = `/* hi-districts.js — Groundwork Hawaii District Data
 *
 * Generated by hi-generate-districts.js from hi-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (HI Office of Elections)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const HI_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const HI_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
