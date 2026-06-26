#!/usr/bin/env node
// me-generate-districts.js
// Reads me-all-districts-data.json and generates me-districts.js,
// structured identically to ok-districts.js (standard single-member seats).
//
// Usage: node me-generate-districts.js
// Output: me-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'me-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'me-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('me-all-districts-data.json not found. Run me-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// ── helpers ───────────────────────────────────────────────────────────────────

// Source names come as "Last, First Middle" (already properly cased) — reorder
// to "First Middle Last" for display.
function reorderName(rawName) {
  const [last, rest] = rawName.split(',').map(s => s.trim());
  return rest ? `${rest} ${last}` : last;
}

function lastName(displayName) {
  const parts = displayName.trim().split(/\s+/);
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

// elec.percentage is a 0-1 fraction of non-blank votes; a single-candidate
// race always lands at exactly 1 since the denominator is candidate votes only.
function getPct(elec) {
  return elec.percentage * 100;
}

function isUnopposed(elec) {
  return Math.round(getPct(elec)) >= 100;
}

function getDemRep(elec) {
  if (!elec || elec.error) return { dem: 0, rep: 0 };
  if (isUnopposed(elec)) {
    if (elec.party === 'Democratic') return { dem: 100, rep: 0 };
    if (elec.party === 'Republican') return { dem: 0, rep: 100 };
    return { dem: 0, rep: 0 };
  }
  const pct = Math.round(getPct(elec));
  if (elec.party === 'Democratic') return { dem: pct, rep: 100 - pct };
  if (elec.party === 'Republican') return { dem: 100 - pct, rep: pct };
  return { dem: 0, rep: 0 };
}

function getPartisanSub(elec, incumbentName) {
  if (!elec || elec.error) return 'TBD';
  const last = lastName(incumbentName);
  if (isUnopposed(elec)) return `${last} won unopposed in 2024.`;
  return `${last} won with ${Math.round(getPct(elec))}% in 2024.`;
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

  const incumbentName  = elec ? reorderName(elec.winner) : 'TBD';
  const incumbentParty = elec ? (elec.party || 'TBD') : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "${idPrefix}-${num}",
    name: "Maine ${chamberLabel} District ${num}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Maine ${chamberLabel} District ${num}",
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
for (let i = 1; i <= 151; i++) {
  houseEntries.push(genEntry(i, data.house[String(i)], 'me-hd', 'House', 'state house district'));
}

const senateEntries = [];
for (let i = 1; i <= 35; i++) {
  senateEntries.push(genEntry(i, data.senate[String(i)], 'me-sd', 'Senate', 'state senate district'));
}

const output = `/* me-districts.js — Groundwork Maine District Data
 *
 * Generated by me-generate-districts.js from me-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024 General (ME SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const ME_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const ME_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
