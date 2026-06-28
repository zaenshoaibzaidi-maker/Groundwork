#!/usr/bin/env node
// nd-generate-districts.js
// Reads nd-all-districts-data.json and generates nd-districts.js.
// North Dakota Senate districts are all single-member (winner/winnerParty).
// House districts are dual-member at-large (winners[] of 2), except the 4A/4B
// subdistricts that replace dual-member District 4, which are single-member.
// Election years are mixed per district (2022 or 2024 - whichever cycle most
// recently decided that seat), so the partisan blurb cites elec.electionYear
// rather than a fixed year.
//
// Usage: node nd-generate-districts.js
// Output: nd-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'nd-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'nd-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('nd-all-districts-data.json not found. Run nd-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// ── helpers ───────────────────────────────────────────────────────────────────

// Candidate names already come out of the PDF properly cased (e.g. "Lisa
// Finley-DeVille", "SuAnn Carol Olson") - unlike all-caps source data, so no
// title-casing pass is applied here; it would mangle names like "DeVille".
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
  if (party === 'dem') return 'Democrat';
  if (party === 'rep') return 'Republican';
  if (party === 'ind') return 'Independent';
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

// nd-hd-9 has no matching Census geography (the Bureau's current published
// boundaries still split it into 09A/09B, but the election data reflects the
// district's 2024 unified race) - its demographic fields are left null/0
// rather than the usual "N/A" string fallback, and flagged via a chip.
function censusBlock(census) {
  if (!census) {
    return { income: null, college: null, age: null, renter: null, demos: '' };
  }
  return {
    income:  formatIncome(census.medianHouseholdIncome),
    college: formatPct(census.collegePct),
    age:     formatAge(census.medianAge),
    renter:  formatPct(census.renterRatePct),
    demos:   getDemosLines(census.race),
  };
}

// ── single-seat entry (Senate, and House 4A/4B) ─────────────────────────────

function genSingleEntry(districtId, name, type, census, elec) {
  // Senate records carry a singular winner/winnerParty; House 4A/4B records
  // (still chamber: "house" in the source data) only carry a winners[]
  // array - normalize both shapes to one winner object here.
  const winnerObj = elec
    ? (elec.winner ? { name: elec.winner, party: elec.winnerParty } : (elec.winners && elec.winners[0]) || null)
    : null;
  const winner = winnerObj ? winnerObj.name : null;

  const incumbentName  = winner || 'TBD';
  const incumbentParty = winnerObj ? partyFull(winnerObj.party) : 'TBD';

  const dem = elec ? Math.round(elec.demPct) : 0;
  const rep = elec ? Math.round(elec.repPct) : 0;

  let partisanSub = 'TBD';
  if (elec && winner) {
    const unopposed = elec.candidates.length <= 1;
    const last = lastName(winner);
    if (unopposed) {
      partisanSub = `${last} won unopposed in ${elec.electionYear}.`;
    } else {
      const winnerCand = elec.candidates.find(c => c.name === winner);
      const pct = winnerCand && elec.totalVotes > 0 ? Math.round((winnerCand.votes / elec.totalVotes) * 100) : 0;
      partisanSub = `${last} won with ${pct}% in ${elec.electionYear}.`;
    }
  }

  const { income, college, age, renter, demos } = censusBlock(census);
  const chips = census ? [] : ['Census data unavailable'];

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
      chips: ${JSON.stringify(chips)},
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

// ── multi-seat entry (House, 2 seats) ───────────────────────────────────────

function genMultiEntry(districtId, name, type, census, elec) {
  const winners = elec && elec.winners ? elec.winners : [];
  const seats   = 2;

  const incumbents = winners.map(w => ({ name: w.name, party: partyFull(w.party) }));

  // Partisan bar reflects the district's overall vote share (sum of party
  // votes / total votes), not seat share.
  const dem = elec ? Math.round(elec.demPct) : 0;
  const rep = elec ? Math.round(elec.repPct) : 0;

  let partisanSub = 'TBD';
  if (elec && winners.length) {
    const unopposed = elec.candidates.length <= seats;
    const demWins = winners.filter(w => w.party === 'dem').length;
    const repWins = winners.filter(w => w.party === 'rep').length;
    const year = elec.electionYear;
    if (demWins === seats) {
      partisanSub = unopposed
        ? `Democrats swept both seats unopposed in ${year}.`
        : `Democrats swept both seats in ${year}.`;
    } else if (repWins === seats) {
      partisanSub = unopposed
        ? `Republicans swept both seats unopposed in ${year}.`
        : `Republicans swept both seats in ${year}.`;
    } else {
      const parts = [];
      if (demWins > 0) parts.push(`${demWins} Dem`);
      if (repWins > 0) parts.push(`${repWins} Rep`);
      const otherWins = seats - demWins - repWins;
      if (otherWins > 0) parts.push(`${otherWins} other`);
      partisanSub = `Split result in ${year}: ${parts.join(', ')} of ${seats} seats.`;
    }
  }

  const incumbentsLiteral = incumbents.map(inc =>
    `      { name: ${JSON.stringify(inc.name)}, party: ${JSON.stringify(inc.party)} }`
  ).join(',\n');

  const { income, college, age, renter, demos } = censusBlock(census);
  const chips = census ? [] : ['Census data unavailable'];

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
      chips: ${JSON.stringify(chips)},
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

const SINGLE_SEAT_HOUSE = new Set(['4a', '4b']);

function genHouseEntry(key, districtData) {
  const census = districtData.census && !districtData.census.error ? districtData.census : null;
  const elec   = districtData.election && !districtData.election.error ? districtData.election : null;
  const districtId = `nd-hd-${key}`;
  const name = districtData.districtName;

  if (SINGLE_SEAT_HOUSE.has(key)) {
    return genSingleEntry(districtId, name, 'state house district', census, elec);
  }
  return genMultiEntry(districtId, name, 'state house district', census, elec);
}

function genSenateEntry(key, districtData) {
  const census = districtData.census && !districtData.census.error ? districtData.census : null;
  const elec   = districtData.election && !districtData.election.error ? districtData.election : null;
  const districtId = `nd-sd-${key}`;
  const name = districtData.districtName;

  return genSingleEntry(districtId, name, 'state senate district', census, elec);
}

// ── build output ──────────────────────────────────────────────────────────────

function districtSortKey(key) {
  const m = key.match(/^(\d+)([a-z]?)$/);
  return parseInt(m[1], 10) * 10 + (m[2] ? m[2].charCodeAt(0) - 96 + 1 : 0);
}

const houseKeys  = Object.keys(data.house).sort((a, b) => districtSortKey(a) - districtSortKey(b));
const senateKeys = Object.keys(data.senate).sort((a, b) => districtSortKey(a) - districtSortKey(b));

const houseEntries  = houseKeys.map(k  => genHouseEntry(k,  data.house[k]));
const senateEntries = senateKeys.map(k => genSenateEntry(k, data.senate[k]));

const output = `/* nd-districts.js — Groundwork North Dakota District Data
 *
 * Generated by nd-generate-districts.js from nd-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (ND SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const ND_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const ND_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  House districts:  ${houseEntries.length}`);
console.log(`  Senate districts: ${senateEntries.length}`);
