#!/usr/bin/env node
// vt-generate-districts.js
// Reads vt-all-districts-data.json and generates vt-districts.js, structured
// like ma-districts.js but extended for Vermont's multi-member districts:
// each entry carries a `winners` array (name/party/pct per seat) instead of
// assuming a single incumbent.
//
// Usage: node vt-generate-districts.js
// Output: vt-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'vt-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'vt-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('vt-all-districts-data.json not found. Run vt-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// ── helpers ───────────────────────────────────────────────────────────────────

function lastName(name) {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1];
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

function joinWithAnd(items) {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return items.join(' and ');
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}

// Vermont elects 1-3 members per district from a single multi-seat race, so
// dem/rep here is seat-share for uncontested races and average vote share
// (per party, among that party's own winners) for contested ones — there's
// no single winner/loser pct to complement against once more than one seat
// is in play.
function getDemRep(elec, winners) {
  if (!elec || !winners.length) return { dem: 0, rep: 0 };

  if (winners.length === 1) {
    const w = winners[0];
    if (elec.unopposed) {
      if (w.party === 'Democratic') return { dem: 100, rep: 0 };
      if (w.party === 'Republican') return { dem: 0, rep: 100 };
      return { dem: 0, rep: 0 };
    }
    const pct = Math.round(w.pct);
    if (w.party === 'Democratic') return { dem: pct, rep: 100 - pct };
    if (w.party === 'Republican') return { dem: 100 - pct, rep: pct };
    return { dem: 0, rep: 0 };
  }

  if (elec.unopposed) {
    const demSeats = winners.filter(w => w.party === 'Democratic').length;
    const repSeats = winners.filter(w => w.party === 'Republican').length;
    return {
      dem: Math.round((demSeats / winners.length) * 100),
      rep: Math.round((repSeats / winners.length) * 100),
    };
  }

  const avg = (party) => {
    const matches = winners.filter(w => w.party === party);
    return matches.length ? Math.round(matches.reduce((s, w) => s + w.pct, 0) / matches.length) : 0;
  };
  return { dem: avg('Democratic'), rep: avg('Republican') };
}

function getPartisanSub(elec, winners) {
  if (!elec || !winners.length) return 'TBD';
  if (winners.length === 1) {
    const last = lastName(winners[0].name);
    return elec.unopposed
      ? `${last} won unopposed in 2024.`
      : `${last} won with ${Math.round(winners[0].pct)}% in 2024.`;
  }
  if (elec.unopposed) {
    return `${joinWithAnd(winners.map(w => lastName(w.name)))} won unopposed in 2024.`;
  }
  const parts = winners.map(w => `${lastName(w.name)} (${Math.round(w.pct)}%)`);
  return `${joinWithAnd(parts)} won in 2024.`;
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

function genEntry(districtName, districtData, idPrefix, chamberLabel, type) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  // Names are already properly cased by the PDF extraction (unlike MA's
  // all-caps source), so they're used as-is — no title-casing pass needed.
  const winners = elec ? elec.winners.map(w => ({ name: w.name, party: w.party, pct: w.pct })) : [];

  const incumbentName = winners.length ? winners.map(w => w.name).join(' & ') : 'TBD';
  const incumbentParty = winners.length
    ? (new Set(winners.map(w => w.party)).size === 1 ? winners[0].party : 'Split')
    : 'TBD';

  const { dem, rep } = getDemRep(elec, winners);
  const partisanSub  = getPartisanSub(elec, winners);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  const id = `${idPrefix}-${slugify(districtName)}`;

  return `  {
    id: "${id}",
    name: "Vermont ${chamberLabel} District - ${districtName}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    winners: ${JSON.stringify(winners)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Vermont ${chamberLabel} District - ${districtName}",
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

const houseNames = Object.keys(data.house);
const houseEntries = houseNames.map(name =>
  genEntry(name, data.house[name], 'vt-hd', 'House', 'state house district')
);

const senateNames = Object.keys(data.senate);
const senateEntries = senateNames.map(name =>
  genEntry(name, data.senate[name], 'vt-sd', 'Senate', 'state senate district')
);

const output = `/* vt-districts.js — Groundwork Vermont District Data
 *
 * Generated by vt-generate-districts.js from vt-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024 General (VT SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const VT_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const VT_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
