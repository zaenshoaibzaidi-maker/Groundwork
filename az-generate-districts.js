#!/usr/bin/env node
// az-generate-districts.js
// Reads az-all-districts-data.json and generates az-districts.js.
// Arizona House districts are all fixed 2-seat (Elect 2) races -> incumbents[]
// array (the two winners by vote count). Senate districts are all
// single-member -> single incumbentName/incumbentParty.
//
// Usage: node az-generate-districts.js
// Output: az-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'az-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'az-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('az-all-districts-data.json not found. Run az-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// ── helpers ───────────────────────────────────────────────────────────────────

function partyFull(party) {
  if (party === 'R') return 'Republican';
  if (party === 'D') return 'Democrat';
  if (party === 'G') return 'Green';
  if (party === 'L') return 'Libertarian';
  if (party === 'I') return 'Independent';
  return party || 'TBD';
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

function censusBlock(census) {
  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';
  return { income, college, age, renter, demos };
}

// ── Senate: single-winner entry ───────────────────────────────────────────────

function genSenateEntry(num, districtData) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? elec.winner : 'TBD';
  const incumbentParty = elec ? partyFull(elec.party) : 'TBD';

  let dem = 0, rep = 0;
  if (elec) {
    if (!elec.opposed) {
      dem = elec.party === 'D' ? 100 : 0;
      rep = elec.party === 'R' ? 100 : 0;
    } else {
      const pct = Math.round(elec.pct);
      dem = elec.party === 'D' ? pct : 100 - pct;
      rep = elec.party === 'R' ? pct : 100 - pct;
    }
  }

  let partisanSub = 'TBD';
  if (elec) {
    partisanSub = !elec.opposed
      ? `${incumbentName} won unopposed in 2024.`
      : `${incumbentName} won with ${Math.round(elec.pct)}% in 2024.`;
  }

  const { income, college, age, renter, demos } = censusBlock(census);

  return `  {
    id: "az-sd-${num}",
    name: "Arizona Senate District ${num}",
    type: "state senate district",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Arizona Senate District ${num}",
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

// ── House: 2-seat multi-winner entry ──────────────────────────────────────────

function genHouseEntry(num, districtData) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const winners = elec && elec.winners ? elec.winners : [];
  const incumbents = winners.map(w => ({ name: w.lastName, party: partyFull(w.party) }));

  // partisanPct (sum of Democratic candidates' vote share in the race) drives
  // the partisan-lean bar; the remainder is attributed to Republicans, the
  // same two-party approximation used elsewhere in this dataset.
  const dem = elec ? Math.round(elec.partisanPct) : 0;
  const rep = elec ? 100 - dem : 0;

  const demWins = winners.filter(w => w.party === 'D').length;
  const repWins = winners.filter(w => w.party === 'R').length;

  let partisanSub = 'TBD';
  if (winners.length === 2) {
    if (demWins === 2) {
      partisanSub = 'Democrats swept both seats in 2024.';
    } else if (repWins === 2) {
      partisanSub = 'Republicans swept both seats in 2024.';
    } else {
      partisanSub = 'Split result in 2024: 1 Democrat, 1 Republican seat.';
    }
  }

  const incumbentsLiteral = incumbents.map(inc =>
    `      { name: ${JSON.stringify(inc.name)}, party: ${JSON.stringify(inc.party)} }`
  ).join(',\n');

  const { income, college, age, renter, demos } = censusBlock(census);

  return `  {
    id: "az-hd-${num}",
    name: "Arizona House District ${num}",
    type: "state house district",
    incumbents: [
${incumbentsLiteral}
    ],
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Arizona House District ${num}",
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

// ── build output ──────────────────────────────────────────────────────────────

const houseEntries = [];
for (let i = 1; i <= 30; i++) {
  houseEntries.push(genHouseEntry(i, data.house[String(i)]));
}

const senateEntries = [];
for (let i = 1; i <= 30; i++) {
  senateEntries.push(genSenateEntry(i, data.senate[String(i)]));
}

const output = `/* az-districts.js — Groundwork Arizona District Data
 *
 * Generated by az-generate-districts.js from az-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024 General (AZ SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const AZ_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const AZ_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
