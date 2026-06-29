#!/usr/bin/env node
// ut-generate-districts.js
// Reads ut-all-districts-data.json and generates ut-districts.js,
// structured identically to tx-districts.js.
//
// Usage: node ut-generate-districts.js
// Output: ut-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'ut-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'ut-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('ut-all-districts-data.json not found. Run ut-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// Utah Senate seats are staggered 4-year terms — these 14 districts were
// last elected in 2022 (see ut-extract-elections.js), so they're next up in
// 2026, while the other 15 (elected 2024) are next up in 2028. House seats
// are all 2-year terms, all up again in 2026.
const SENATE_2022_DISTRICTS = new Set([1, 5, 6, 7, 9, 11, 13, 14, 18, 19, 20, 21, 23, 28]);

// ── helpers ───────────────────────────────────────────────────────────────────

const UPPERCASE_SUFFIXES = new Set(['II', 'III', 'IV', 'JR', 'SR']);

// Capitalizes a single name segment (no internal hyphens/apostrophes left),
// special-casing the "Mc" prefix (McCay, McKell) since it's capitalized in
// virtually every English surname that has it. "Mac" is deliberately left
// alone — "Macpherson" vs "MacPherson" is ambiguous, and blindly capitalizing
// the next letter would mangle short names like "Mack" or "Macy".
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
    // Capitalize each hyphen/apostrophe-delimited part on its own so
    // "Dailey-Provost" and "O'Brien" don't get lowercased after the first
    // letter of the whole word.
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
  if (party === 'R') return 'Republican';
  if (party === 'D') return 'Democrat';
  return party || 'TBD';
}

// Races can have 3-4 candidates (major-party winner plus minor parties), so
// the runner-up's share isn't always 100 - winnerPct; use the recorded
// runnerUpPct when there's a major-party runner-up, else 0 for that side.
function getDemRep(elec) {
  if (!elec || elec.error) return { dem: 0, rep: 0 };
  if (!elec.opposed) {
    return elec.party === 'D' ? { dem: 100, rep: 0 } : { dem: 0, rep: 100 };
  }
  const winnerPct = Math.round(elec.pct);
  const otherPct  = elec.runnerUpPct !== undefined ? Math.round(elec.runnerUpPct) : 0;
  if (elec.party === 'D') return { dem: winnerPct, rep: elec.runnerUpParty === 'R' ? otherPct : 0 };
  if (elec.party === 'R') return { dem: elec.runnerUpParty === 'D' ? otherPct : 0, rep: winnerPct };
  return { dem: 0, rep: 0 };
}

function getPartisanSub(elec, incumbentName, year) {
  if (!elec || elec.error) return 'TBD';
  const last = lastName(incumbentName);
  if (!elec.opposed) return `${last} won unopposed in ${year}.`;
  return `${last} won with ${Math.round(elec.pct)}% in ${year}.`;
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

function genEntry(num, districtData, idPrefix, chamberLabel, type, electionYear, nextElectionYear) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec.party) : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName, electionYear);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "${idPrefix}-${num}",
    name: "Utah ${chamberLabel} District ${num}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November ${nextElectionYear}",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Utah ${chamberLabel} District ${num}",
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
for (let i = 1; i <= 75; i++) {
  houseEntries.push(genEntry(i, data.house[String(i)], 'ut-hd', 'House', 'state house district', 2024, 2026));
}

const senateEntries = [];
for (let i = 1; i <= 29; i++) {
  const electionYear     = SENATE_2022_DISTRICTS.has(i) ? 2022 : 2024;
  const nextElectionYear = SENATE_2022_DISTRICTS.has(i) ? 2026 : 2028;
  senateEntries.push(genEntry(i, data.senate[String(i)], 'ut-sd', 'Senate', 'state senate district', electionYear, nextElectionYear));
}

const output = `/* ut-districts.js — Groundwork Utah District Data
 *
 * Generated by ut-generate-districts.js from ut-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (UT LtGov)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const UT_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const UT_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
