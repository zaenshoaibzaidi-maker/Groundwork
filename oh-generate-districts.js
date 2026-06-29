#!/usr/bin/env node
// oh-generate-districts.js
// Reads oh-house-data.json and oh-senate-data.json and generates oh-districts.js,
// structured identically to co-districts.js / id-districts.js (the schema all
// other states use, consumed via entry.dashboard by the per-state HTML pages).
//
// Usage: node oh-generate-districts.js
// Output: oh-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const HOUSE_INPUT  = path.join(__dirname, 'oh-house-data.json');
const SENATE_INPUT = path.join(__dirname, 'oh-senate-data.json');
const OUTPUT       = path.join(__dirname, 'oh-districts.js');

if (!fs.existsSync(HOUSE_INPUT))  { console.error('oh-house-data.json not found.');  process.exit(1); }
if (!fs.existsSync(SENATE_INPUT)) { console.error('oh-senate-data.json not found.'); process.exit(1); }

const houseData  = JSON.parse(fs.readFileSync(HOUSE_INPUT, 'utf8'));
const senateData = JSON.parse(fs.readFileSync(SENATE_INPUT, 'utf8'));

// ── helpers ───────────────────────────────────────────────────────────────────

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

function partyFull(code) {
  if (code === 'D') return 'Democrat';
  if (code === 'R') return 'Republican';
  return 'Independent';
}

function stripPartySuffix(name) {
  return name.replace(/\s*\([A-Za-z]+\)\s*$/, '').trim();
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

function renderEntry({ id, name, type, incumbentName, incumbentParty, nextElection, seatStatus,
                        income, college, age, renter, dem, rep, partisanSub, demos }) {
  return `  {
    id: "${id}",
    name: "${name}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: ${JSON.stringify(nextElection)},
    seatStatus: ${JSON.stringify(seatStatus)},
    dashboard: {
      subtitle: "${name}",
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

// ── House ─────────────────────────────────────────────────────────────────────

function getHousePartisanSub(election) {
  const candidates = election.candidates;
  const winner = candidates.reduce((a, b) => (b.votes > a.votes ? b : a));
  const winnerLetter = winner.party === 'D' || winner.party === 'R' ? winner.party : null;

  if (candidates.length === 1) {
    return `${winner.name} (${winnerLetter || winner.party}) ran unopposed in 2024.`;
  }

  const dem = candidates.find(c => c.party === 'D');
  const rep = candidates.find(c => c.party === 'R');

  if (dem && rep) {
    return `${dem.name} (D) ${Math.round(election.demTwoPartyPct)}% / ${rep.name} (R) ${Math.round(election.repTwoPartyPct)}% in 2024.`;
  }
  if (dem && !rep) {
    return `${dem.name} (D) ran without a Republican opponent in 2024.`;
  }
  if (rep && !dem) {
    return `${rep.name} (R) ran without a Democratic opponent in 2024.`;
  }
  return `${winner.name} (${winner.party}) won in 2024.`;
}

function genHouseEntry(district) {
  const { districtNumber, districtName, census, election2024 } = district;
  const candidates = election2024.candidates;
  const winner = candidates.reduce((a, b) => (b.votes > a.votes ? b : a));

  return renderEntry({
    id: `oh-hd-${districtNumber}`,
    name: districtName,
    type: 'state house district',
    incumbentName: stripPartySuffix(winner.name),
    incumbentParty: partyFull(winner.party),
    nextElection: 'November 2026',
    seatStatus: 'TBD',
    income:  formatIncome(census.medianHouseholdIncome),
    college: formatPct(census.collegePct),
    age:     formatAge(census.medianAge),
    renter:  formatPct(census.renterRatePct),
    dem: Math.round(election2024.demTwoPartyPct),
    rep: Math.round(election2024.repTwoPartyPct),
    partisanSub: getHousePartisanSub(election2024),
    demos: getDemosLines(census.race)
  });
}

// ── Senate ────────────────────────────────────────────────────────────────────

function parseWinner(winnerStr) {
  const m = winnerStr.match(/^(.*?)\s*\(([A-Za-z]+)\)\s*$/);
  if (!m) return { name: winnerStr.trim(), party: null };
  return { name: m[1].trim(), party: m[2] };
}

function genSenateEntry(district) {
  const { district: districtNumber, name, census, election } = district;
  const { name: winnerName, party: winnerParty } = parseWinner(election.winner);
  const nextElection = districtNumber % 2 === 1 ? 'November 2026' : 'November 2028';

  const candidates = election.candidates;
  let dem = 0, rep = 0;
  if (candidates.length === 1) {
    dem = winnerParty === 'D' ? 100 : 0;
    rep = winnerParty === 'R' ? 100 : 0;
  } else {
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    const demVotes = candidates.filter(c => parseWinner(c.name).party === 'D').reduce((s, c) => s + c.votes, 0);
    const repVotes = candidates.filter(c => parseWinner(c.name).party === 'R').reduce((s, c) => s + c.votes, 0);
    dem = Math.round((demVotes / totalVotes) * 100);
    rep = Math.round((repVotes / totalVotes) * 100);
  }

  const partisanSub = candidates.length === 1
    ? `${winnerName} (${winnerParty}) ran uncontested in ${election.year}. Next election: ${nextElection}.`
    : `${winnerName} (${winnerParty}) won with ${Math.round(election.winner_pct)}% in ${election.year}. Next election: ${nextElection}.`;

  return renderEntry({
    id: `oh-sd-${districtNumber}`,
    name,
    type: 'state senate district',
    incumbentName: winnerName,
    incumbentParty: partyFull(winnerParty),
    nextElection,
    seatStatus: 'Active',
    income:  formatIncome(census.medianIncome),
    college: formatPct(census.collegePct),
    age:     formatAge(census.medianAge),
    renter:  formatPct(census.renterPct),
    dem, rep,
    partisanSub,
    demos: getDemosLines(census)
  });
}

// ── build output ──────────────────────────────────────────────────────────────

const houseEntries = houseData
  .sort((a, b) => a.districtNumber - b.districtNumber)
  .map(genHouseEntry);

const senateEntries = Object.values(senateData)
  .sort((a, b) => a.district - b.district)
  .map(genSenateEntry);

const output = `/* oh-districts.js — Groundwork Ohio District Data
 *
 * Generated by oh-generate-districts.js from oh-house-data.json and oh-senate-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024 General (House) / 2022–2024 General (Senate), Ohio SoS
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const OH_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const OH_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written -> ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
console.log(`  Total: ${houseEntries.length + senateEntries.length}`);
