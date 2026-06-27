#!/usr/bin/env node
// nh-generate-districts.js
// Reads nh-all-districts-data.json and generates nh-districts.js.
// New Hampshire House districts are county-scoped (e.g. "nh-hd-belknap-1") and
// have variable seat counts (1-10):
//   1-seat districts  -> single incumbentName/incumbentParty
//   N-seat districts  -> incumbents[] array (top N candidates by votes)
// Senate districts are all single-member.
//
// Usage: node nh-generate-districts.js
// Output: nh-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'nh-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'nh-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('nh-all-districts-data.json not found. Run nh-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// ── helpers ───────────────────────────────────────────────────────────────────

function titleCase(str) {
  if (!str) return '';
  return str.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

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
  if (party === 'DEM') return 'Democrat';
  if (party === 'REP') return 'Republican';
  if (party === 'IND') return 'Independent';
  return party || 'TBD';
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

// Belknap, Carroll, Cheshire, Coos, Grafton, Hillsborough, Merrimack,
// Rockingham, Strafford, Sullivan happen to already be in alphabetical order.
function sortHouseKeys(keys) {
  return keys.slice().sort((a, b) => {
    const [, , countyA, numA] = a.split('-');
    const [, , countyB, numB] = b.split('-');
    if (countyA !== countyB) return countyA.localeCompare(countyB);
    return parseInt(numA, 10) - parseInt(numB, 10);
  });
}

function sortSenateKeys(keys) {
  return keys.slice().sort((a, b) => parseInt(a.split('-')[2], 10) - parseInt(b.split('-')[2], 10));
}

// ── shared census/stats block ────────────────────────────────────────────────

function censusBlock(census) {
  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';
  return { income, college, age, renter, demos };
}

// ── single-seat entry ─────────────────────────────────────────────────────────

function genSingleEntry(districtId, name, type, census, elec) {
  const winner = elec && elec.winners && elec.winners.length ? elec.winners[0] : null;

  const incumbentName  = winner ? winner.name : 'TBD';
  const incumbentParty = winner ? partyFull(winner.party) : 'TBD';

  const dem = elec ? Math.round(elec.demPct) : 0;
  const rep = elec ? Math.round(elec.repPct) : 0;

  let partisanSub = 'TBD';
  if (elec && winner) {
    const unopposed = elec.candidates.length <= elec.seats;
    const last = lastName(incumbentName);
    if (unopposed) {
      partisanSub = `${last} won unopposed in 2024.`;
    } else {
      const totalAllVotes = elec.candidates.reduce((s, c) => s + c.votes, 0);
      const pct = totalAllVotes > 0 ? Math.round((winner.votes / totalAllVotes) * 100) : 0;
      partisanSub = `${last} won with ${pct}% in 2024.`;
    }
  }

  const { income, college, age, renter, demos } = censusBlock(census);

  return `  {
    id: "${districtId}",
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
        { label: "Median Household Income", value: ${JSON.stringify(income)},   sub: "" },
        { label: "College-Educated Adults",  value: ${JSON.stringify(college)}, sub: "" },
        { label: "Median Age",               value: ${JSON.stringify(age)},     sub: "" },
        { label: "Renter Rate",              value: ${JSON.stringify(renter)},  sub: "" }
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

// ── multi-seat entry ──────────────────────────────────────────────────────────

function genMultiEntry(districtId, name, type, census, elec) {
  const winners = elec && elec.winners ? elec.winners : [];
  const seats   = elec ? elec.seats : winners.length;

  const incumbents = winners.map(w => ({ name: w.name, party: partyFull(w.party) }));

  // Partisan bar reflects the district's overall vote share (sum of party
  // votes / total votes), not seat share.
  const dem = elec ? Math.round(elec.demPct) : 0;
  const rep = elec ? Math.round(elec.repPct) : 0;

  let partisanSub = 'TBD';
  if (elec && winners.length) {
    const unopposed = elec.candidates.length <= elec.seats;
    const demWins = winners.filter(w => w.party === 'DEM').length;
    const repWins = winners.filter(w => w.party === 'REP').length;
    if (demWins === seats) {
      partisanSub = unopposed
        ? `Democrats swept all ${seats} seats unopposed in 2024.`
        : `Democrats swept all ${seats} seats in 2024.`;
    } else if (repWins === seats) {
      partisanSub = unopposed
        ? `Republicans swept all ${seats} seats unopposed in 2024.`
        : `Republicans swept all ${seats} seats in 2024.`;
    } else {
      const parts = [];
      if (demWins > 0) parts.push(`${demWins} DEM`);
      if (repWins > 0) parts.push(`${repWins} REP`);
      const otherWins = seats - demWins - repWins;
      if (otherWins > 0) parts.push(`${otherWins} other`);
      partisanSub = `Split result in 2024: ${parts.join(', ')} of ${seats} seats.`;
    }
  }

  const incumbentsLiteral = incumbents.map(inc =>
    `      { name: ${JSON.stringify(inc.name)}, party: ${JSON.stringify(inc.party)} }`
  ).join(',\n');

  const { income, college, age, renter, demos } = censusBlock(census);

  return `  {
    id: "${districtId}",
    name: "${name}",
    type: "${type}",
    incumbents: [
${incumbentsLiteral}
    ],
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "${name}",
      chips: [],
      stats: [
        { label: "Median Household Income", value: ${JSON.stringify(income)},   sub: "" },
        { label: "College-Educated Adults",  value: ${JSON.stringify(college)}, sub: "" },
        { label: "Median Age",               value: ${JSON.stringify(age)},     sub: "" },
        { label: "Renter Rate",              value: ${JSON.stringify(renter)},  sub: "" }
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

// ── dispatch by seat count ────────────────────────────────────────────────────

function genHouseEntry(districtId, districtData) {
  const census = districtData.census && !districtData.census.error ? districtData.census : null;
  const elec   = districtData.election && !districtData.election.error ? districtData.election : null;
  const seats  = elec ? elec.seats : 1;
  const name   = `New Hampshire House District ${titleCase(districtData.county)} ${districtData.districtNumber}`;

  if (seats === 1) {
    return genSingleEntry(districtId, name, 'state house district', census, elec);
  }
  return genMultiEntry(districtId, name, 'state house district', census, elec);
}

function genSenateEntry(districtId, districtData) {
  const census = districtData.census && !districtData.census.error ? districtData.census : null;
  const elec   = districtData.election && !districtData.election.error ? districtData.election : null;
  const name   = `New Hampshire Senate District ${districtData.districtNumber}`;

  return genSingleEntry(districtId, name, 'state senate district', census, elec);
}

// ── build output ──────────────────────────────────────────────────────────────

const houseKeys  = sortHouseKeys(Object.keys(data.house));
const senateKeys = sortSenateKeys(Object.keys(data.senate));

const houseEntries  = houseKeys.map(k  => genHouseEntry(k,  data.house[k]));
const senateEntries = senateKeys.map(k => genSenateEntry(k, data.senate[k]));

const output = `/* nh-districts.js — Groundwork New Hampshire District Data
 *
 * Generated by nh-generate-districts.js from nh-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024 General (NH SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const NH_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const NH_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
