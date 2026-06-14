#!/usr/bin/env node
// nj-generate-districts.js
// Reads nj-all-districts-data.json and generates nj-districts.js.
//
// New Jersey has 40 legislative districts. Each district number maps to:
//   - 1 Senate seat (single winner)
//   - 2 Assembly seats (both elected at-large in the same district — an
//     undivided multi-member district, same shape as Maryland's at-large
//     House districts)
// Census/demographic data is shared across the Senate and Assembly entries
// for a given district number.
//
// Usage: node nj-generate-districts.js
// Output: nj-districts.js (created/overwritten in the same directory)

'use strict';

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'nj-all-districts-data.json');
const OUTPUT = path.join(__dirname, 'nj-districts.js');

if (!fs.existsSync(INPUT)) {
  console.error('nj-all-districts-data.json not found. Run nj-fetch-all.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

// ── helpers ───────────────────────────────────────────────────────────────────

const UPPERCASE_SUFFIXES = new Set(['II', 'III', 'IV', 'JR', 'SR']);

function capitalizeWord(word) {
  if (!word) return word;
  const upper = word.toUpperCase();
  if (UPPERCASE_SUFFIXES.has(upper)) return upper;
  // "Mc" surnames: MCCLELLAN -> McClellan, MCKEON -> McKeon, etc.
  if (/^MC[A-Z]{2,}$/.test(upper)) {
    return 'Mc' + word.charAt(2).toUpperCase() + word.slice(3).toLowerCase();
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function toTitleCase(str) {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (!word) return word;
    return word.split('-').map(capitalizeWord).join('-');
  }).join(' ');
}

function lastName(titleCasedName) {
  const parts = titleCasedName.trim().split(/\s+/);
  let i = parts.length - 1;
  // Skip trailing generational suffixes (e.g. "Testa Jr.") to find the surname.
  while (i > 0 && UPPERCASE_SUFFIXES.has(parts[i].toUpperCase().replace(/\.$/, ''))) {
    i--;
  }
  return parts[i];
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

// NJ election data reports parties as "Republican" / "Democratic" rather than
// the REP/DEM abbreviations other states' source data uses.
function partyAbbr(party) {
  if (!party) return null;
  const p = party.toUpperCase();
  if (p.startsWith('REP')) return 'REP';
  if (p.startsWith('DEM')) return 'DEM';
  return party;
}

function partyFull(party) {
  const abbr = partyAbbr(party);
  if (abbr === 'REP') return 'Republican';
  if (abbr === 'DEM') return 'Democrat';
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

function sortDistrictKeys(keys) {
  return keys.slice().sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

// ── Senate entry (1 winner, 2023 General) ────────────────────────────────────

function genSenateEntry(districtId, districtData) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec.party) : 'TBD';

  let dem = 0, rep = 0;
  if (elec) {
    const party = partyAbbr(elec.party);
    if (elec.unopposed) {
      dem = party === 'DEM' ? 100 : 0;
      rep = party === 'REP' ? 100 : 0;
    } else {
      const pct = Math.round(elec.pct);
      dem = party === 'DEM' ? pct : 100 - pct;
      rep = party === 'REP' ? pct : 100 - pct;
    }
  }

  let partisanSub = 'TBD';
  if (elec) {
    const last = lastName(incumbentName);
    partisanSub = elec.unopposed
      ? `${last} won unopposed in 2023.`
      : `${last} won with ${Math.round(elec.pct)}% in 2023.`;
  }

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "nj-sd-${districtId}",
    name: "New Jersey Senate District ${districtId}",
    type: "state senate district",
    city: "TBD",
    region: "TBD",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2027",
    seatStatus: "Active",
    dashboard: {
      subtitle: "New Jersey Senate District ${districtId}",
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

// ── Assembly entry (2 winners, undivided at-large, 2025 General) ────────────

function genAssemblyEntry(districtId, districtData) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const winners = (elec && elec.winners) ? elec.winners : [];
  const seats   = (elec && elec.seats)   ? elec.seats   : winners.length;

  const incumbents = winners.map(w => ({
    name:  toTitleCase(w.name),
    party: partyFull(w.party),
  }));

  const demWins = winners.filter(w => partyAbbr(w.party) === 'DEM').length;
  const repWins = winners.filter(w => partyAbbr(w.party) === 'REP').length;
  const total   = seats || 1;
  const dem = Math.round(100 * demWins / total);
  const rep = Math.round(100 * repWins / total);

  let partisanSub = 'TBD';
  if (winners.length > 0) {
    const unopposed = elec && elec.unopposed;
    if (demWins === seats) {
      partisanSub = unopposed
        ? `Democrats swept both seats unopposed in 2025.`
        : `Democrats swept both seats in 2025.`;
    } else if (repWins === seats) {
      partisanSub = unopposed
        ? `Republicans swept both seats unopposed in 2025.`
        : `Republicans swept both seats in 2025.`;
    } else {
      const parts = [];
      if (demWins > 0) parts.push(`${demWins} DEM`);
      if (repWins > 0) parts.push(`${repWins} REP`);
      partisanSub = `Split result in 2025: ${parts.join(', ')} of ${seats} seats.`;
    }
  }

  const incumbentsLiteral = incumbents.map(inc =>
    `      { name: ${JSON.stringify(inc.name)}, party: ${JSON.stringify(inc.party)} }`
  ).join(',\n');

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "nj-ad-${districtId}",
    name: "New Jersey Assembly District ${districtId}",
    type: "state assembly district",
    city: "TBD",
    region: "TBD",
    incumbents: [
${incumbentsLiteral}
    ],
    nextElection: "November 2027",
    seatStatus: "Active",
    dashboard: {
      subtitle: "New Jersey Assembly District ${districtId}",
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

const senateKeys   = sortDistrictKeys(Object.keys(data.senate));
const assemblyKeys = sortDistrictKeys(Object.keys(data.house));

const senateEntries   = senateKeys.map(k   => genSenateEntry(k,   data.senate[k]));
const assemblyEntries = assemblyKeys.map(k => genAssemblyEntry(k, data.house[k]));

const output = `/* nj-districts.js — Groundwork New Jersey District Data
 *
 * Generated by nj-generate-districts.js from nj-all-districts-data.json.
 * Census: ACS 5-Year 2023 (2019–2023)
 * Elections: 2025 General (Assembly) / 2023 General (Senate) (NJ DOS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const NJ_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];

const NJ_ASSEMBLY_DISTRICTS = [
${assemblyEntries.join(',\n')}
];
`;

fs.writeFileSync(OUTPUT, output);

console.log(`Written → ${OUTPUT}`);
console.log(`  Senate districts:   ${senateEntries.length}`);
console.log(`  Assembly districts: ${assemblyEntries.length}`);
