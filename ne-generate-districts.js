#!/usr/bin/env node
// ne-generate-districts.js
// Reads ne-all-districts-data.json and generates ne-districts.js, structured
// identically to ia-districts.js. Nebraska's Legislature is unicameral —
// single array, no House/Senate split — and technically nonpartisan, so
// candidates carry no per-candidate party; only the winner's party (assigned
// externally by ne-extract-elections.js) is known.
//
// Usage: node ne-generate-districts.js
// Output: ne-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'ne-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'ne-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('ne-all-districts-data.json not found. Run ne-fetch-all.js first.');
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
  if (party === 'rep') return 'Republican';
  if (party === 'dem') return 'Democrat';
  if (party === 'ind') return 'Independent';
  return party || 'TBD';
}

// elec.candidates preserves ballot order (not vote order), so the winner
// must be looked up by name rather than assumed to be index 0.
function winnerVotesOf(elec) {
  const match = elec.candidates.find(c => c.name === elec.winner);
  return match ? match.votes : 0;
}

// NE candidates carry no per-candidate party (the Legislature is officially
// nonpartisan), so only the winner's assigned party/pct is known. The
// remainder of the vote share is only attributable to "the other major
// party" when the winner is dem/rep; independent winners leave both at 0.
function getDemRep(elec) {
  if (!elec || elec.error) return { dem: 0, rep: 0 };
  const pct = elec.totalVotes > 0 ? (winnerVotesOf(elec) / elec.totalVotes) * 100 : 0;
  if (elec.winnerParty === 'dem') return { dem: Math.round(pct), rep: Math.round(100 - pct) };
  if (elec.winnerParty === 'rep') return { dem: Math.round(100 - pct), rep: Math.round(pct) };
  return { dem: 0, rep: 0 };
}

function getPartisanSub(elec, incumbentName) {
  if (!elec || elec.error) return 'TBD';
  const last = lastName(incumbentName);
  if (elec.candidates.length === 1) return `${last} won unopposed in ${elec.electionYear}.`;
  const pct = elec.totalVotes > 0 ? Math.round((winnerVotesOf(elec) / elec.totalVotes) * 100) : 0;
  return `${last} won with ${pct}% in ${elec.electionYear}.`;
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

function genEntry(num, districtData) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? elec.winner : 'TBD';
  const incumbentParty = elec ? partyFull(elec.winnerParty) : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "ne-ld-${num}",
    name: "Nebraska Legislative District ${num}",
    type: "state legislative district",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Nebraska Legislative District ${num}",
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

const districtEntries = [];
for (let i = 1; i <= 49; i++) {
  districtEntries.push(genEntry(i, data.districts[String(i)]));
}

const output = `/* ne-districts.js — Groundwork Nebraska District Data
 *
 * Generated by ne-generate-districts.js from ne-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (NE SoS)
 * Unicameral Legislature — single district array, no House/Senate split.
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const NE_DISTRICTS = [
${districtEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  Districts: ${districtEntries.length}`);
