#!/usr/bin/env node
// wv-generate-districts.js
// Reads wv-all-districts-data.json and generates wv-districts.js.
// WV Senate districts each hold two seats (seat_a / seat_b); both
// incumbents and both election results are stored on the entry.
//
// Usage: node wv-generate-districts.js
// Output: wv-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'wv-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'wv-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('wv-all-districts-data.json not found. Run wv-fetch-all.js first.');
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
  if (!party) return 'TBD';
  const p = party.toLowerCase();
  if (p === 'rep' || p === 'republican')               return 'Republican';
  if (p === 'dem' || p === 'democratic' || p === 'democrat') return 'Democrat';
  return party;
}

// WV election objects use winner_party / winner_pct (not party / pct)
function getDemRep(elec) {
  if (!elec || elec.error) return { dem: 0, rep: 0 };
  const party      = (elec.winner_party || '').toLowerCase();
  const pct        = Math.round(elec.winner_pct || 0);
  const isUnopposed = elec.winner_votes === elec.total_votes;
  if (isUnopposed) {
    return party.startsWith('dem') ? { dem: 100, rep: 0 } : { dem: 0, rep: 100 };
  }
  if (party.startsWith('dem')) return { dem: pct, rep: 100 - pct };
  if (party.startsWith('rep')) return { dem: 100 - pct, rep: pct };
  return { dem: 0, rep: 0 };
}

function getPartisanSub(elec, incumbentName) {
  if (!elec || elec.error) return 'TBD';
  const last       = lastName(incumbentName);
  const year       = elec.year || '';
  const isUnopposed = elec.winner_votes === elec.total_votes;
  if (isUnopposed) return `${last} won unopposed in ${year}.`;
  return `${last} won with ${Math.round(elec.winner_pct)}% in ${year}.`;
}

function getPartisanSubSeat(elec, incumbentName, seatLabel) {
  if (!elec) return '';
  const last       = lastName(incumbentName);
  const year       = elec.year || '';
  const isUnopposed = elec.winner_votes === elec.total_votes;
  if (isUnopposed) return `${last} won ${seatLabel} unopposed in ${year}.`;
  return `${last} won ${seatLabel} with ${Math.round(elec.winner_pct)}% in ${year}.`;
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

// ── House entry ───────────────────────────────────────────────────────────────

function genHouseEntry(num, districtData) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec.winner_party) : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "wv-hd-${num}",
    name: "West Virginia House District ${num}",
    type: "state house district",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "West Virginia House District ${num}",
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

// ── Senate entry (dual-seat) ──────────────────────────────────────────────────

function genSenateEntry(num, districtData) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec   = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const seatA = elec && elec.seat_a ? elec.seat_a : null;
  const seatB = elec && elec.seat_b ? elec.seat_b : null;

  const nameA  = seatA ? toTitleCase(seatA.winner)     : 'TBD';
  const partyA = seatA ? partyFull(seatA.winner_party) : 'TBD';
  const nameB  = seatB ? toTitleCase(seatB.winner)     : 'TBD';
  const partyB = seatB ? partyFull(seatB.winner_party) : 'TBD';

  // Partisan bar driven by seat_b (2024, more recent)
  const { dem, rep } = getDemRep(seatB);

  const subA = getPartisanSubSeat(seatA, nameA, 'Seat A');
  const subB = getPartisanSubSeat(seatB, nameB, 'Seat B');
  const partisanSub = [subA, subB].filter(Boolean).join(' ');

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "wv-sd-${num}",
    name: "West Virginia Senate District ${num}",
    type: "state senate district",
    seat_a: {
      incumbentName: ${JSON.stringify(nameA)},
      incumbentParty: ${JSON.stringify(partyA)},
      election: ${JSON.stringify(seatA)}
    },
    seat_b: {
      incumbentName: ${JSON.stringify(nameB)},
      incumbentParty: ${JSON.stringify(partyB)},
      election: ${JSON.stringify(seatB)}
    },
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "West Virginia Senate District ${num}",
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
  houseEntries.push(genHouseEntry(i, data.house[String(i)]));
}

const senateEntries = [];
for (let i = 1; i <= 17; i++) {
  senateEntries.push(genSenateEntry(i, data.senate[String(i)]));
}

const output = `/* wv-districts.js — Groundwork West Virginia District Data
 *
 * Generated by wv-generate-districts.js from wv-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (WV SoS)
 * Senate districts each carry two seats (seat_a = 2022, seat_b = 2024).
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const WV_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const WV_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
