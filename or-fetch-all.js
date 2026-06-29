#!/usr/bin/env node
// or-fetch-all.js
// Fetches ACS 5-year Census data for all 60 Oregon House districts and all
// 30 Oregon Senate districts, merges with pre-extracted election data from
// or-elections-data.json, and saves directly to or-districts.js.
//
// Usage:  node or-fetch-all.js   (reads CENSUS_API_KEY from .env)
// Requires: Node 18+ (native fetch)
// Output:   or-districts.js (created/overwritten in the same directory)

require("dotenv").config();

const path = require("path");
const fs   = require("fs");

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const STATE_FIPS   = "41"; // Oregon
const API_KEY      = process.env.CENSUS_API_KEY ? `&key=${process.env.CENSUS_API_KEY}` : "";
const CENSUS_BASE  = "https://api.census.gov/data/2023/acs/acs5";

const CENSUS_VARS = [
  "B19013_001E", // Median household income
  "B01002_001E", // Median age
  "B02001_001E", // Total population (race universe)
  "B02001_002E", // White alone
  "B02001_003E", // Black or African American alone
  "B02001_005E", // Asian alone
  "B03001_001E", // Total population (Hispanic/Latino universe)
  "B03001_003E", // Hispanic or Latino
  "B03002_003E", // Non-Hispanic White alone
  "B15003_001E", // Population 25+ (education universe)
  "B15003_022E", // Bachelor's degree
  "B15003_023E", // Master's degree
  "B15003_024E", // Professional school degree
  "B15003_025E", // Doctorate degree
  "B25003_001E", // Total occupied housing units
  "B25003_003E", // Renter-occupied units
].join(",");

const CENSUS_MISSING = -666666666;

function parseRaw(raw) {
  const n = parseFloat(raw);
  return isNaN(n) || n === CENSUS_MISSING || n < 0 ? null : n;
}

function pctOf(numerator, denominator) {
  if (numerator === null || denominator === null || denominator === 0) return null;
  return parseFloat(((numerator / denominator) * 100).toFixed(2));
}

async function fetchCensusData(districtNum, chamber) {
  const pad = String(districtNum).padStart(3, "0");
  const url =
    `${CENSUS_BASE}?get=NAME,${CENSUS_VARS}` +
    `&for=state+legislative+district+(${chamber}+chamber):${pad}` +
    `&in=state:${STATE_FIPS}${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  if (!Array.isArray(data) || data.length < 2) {
    throw new Error("Empty response from Census API");
  }

  const headers = data[0];
  const row     = data[1];
  const get     = (key) => parseRaw(row[headers.indexOf(key)]);

  const censusName       = row[headers.indexOf("NAME")];
  const medianIncome     = get("B19013_001E");
  const medianAge        = get("B01002_001E");
  const totalPop         = get("B02001_001E");
  const white            = get("B02001_002E");
  const black            = get("B02001_003E");
  const asian            = get("B02001_005E");
  const hispanicTotal    = get("B03001_001E");
  const hispanic         = get("B03001_003E");
  const nonHispanicWhite = get("B03002_003E");
  const edu25plus        = get("B15003_001E");
  const bachelors        = get("B15003_022E");
  const masters          = get("B15003_023E");
  const professional     = get("B15003_024E");
  const doctorate        = get("B15003_025E");
  const totalUnits       = get("B25003_001E");
  const renterOccupied   = get("B25003_003E");

  const collegeGrad =
    bachelors !== null && masters !== null && professional !== null && doctorate !== null
      ? bachelors + masters + professional + doctorate
      : null;

  return {
    censusName,
    source: "ACS 5-Year 2023 (2019–2023)",
    medianHouseholdIncome: medianIncome,
    medianAge,
    totalPopulation: totalPop !== null ? Math.round(totalPop) : null,
    collegePct:    pctOf(collegeGrad, edu25plus),
    renterRatePct: pctOf(renterOccupied, totalUnits),
    race: {
      whitePct:            pctOf(white, totalPop),
      nonHispanicWhitePct: pctOf(nonHispanicWhite, totalPop),
      blackPct:            pctOf(black, totalPop),
      asianPct:            pctOf(asian, totalPop),
      hispanicPct:         pctOf(hispanic, hispanicTotal),
    },
  };
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithDelay(districtNum, chamber, label, delayMs) {
  await delay(delayMs);
  try {
    const data = await fetchCensusData(districtNum, chamber);
    process.stdout.write(`  [${label}] ✓\n`);
    return { ok: true, data };
  } catch (err) {
    process.stdout.write(`  [${label}] ✗ ${err.message}\n`);
    return { ok: false, error: err.message };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  or-districts.js GENERATION (ported from ar-generate-districts.js's genEntry)
// ══════════════════════════════════════════════════════════════════════════════

// Senate districts on the 2024 ballot; all others (plus SD-18, whose 2022
// result was only a 2-year special term) came from the 2022 general.
const SENATE_2024 = new Set([1, 2, 5, 9, 12, 14, 18, 21, 22, 23, 25, 27, 28, 29, 30]);

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
  if (party === 'REP') return 'Republican';
  if (party === 'DEM') return 'Democrat';
  if (party === 'IND') return 'Independent';
  return party || 'TBD';
}

function getDemRep(elec) {
  if (!elec) return { dem: 0, rep: 0 };
  if (!elec.opposed) {
    if (elec.winnerParty === 'DEM') return { dem: 100, rep: 0 };
    if (elec.winnerParty === 'REP') return { dem: 0, rep: 100 };
    return { dem: 0, rep: 0 };
  }
  const pct = Math.round(elec.winnerPct);
  if (elec.winnerParty === 'DEM') return { dem: pct, rep: 100 - pct };
  if (elec.winnerParty === 'REP') return { dem: 100 - pct, rep: pct };
  return { dem: 0, rep: 0 };
}

// Names in or-elections-data.json are rendered "Surname Given" (the PDF's
// own header order, including multi-word surnames like "Boshart Davis"), not
// "Given Last" like other states' election files -- so unlike ar's model,
// there's no reliable token position to pull just a last name from. Use the
// full incumbent name here instead of guessing at a split point.
function getPartisanSub(elec, incumbentName, year) {
  if (!elec) return 'TBD';
  if (!elec.opposed) return `${incumbentName} won unopposed in ${year}.`;
  return `${incumbentName} won with ${Math.round(elec.winnerPct)}% in ${year}.`;
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

function genEntry(num, districtData, idPrefix, chamberLabel, type, year) {
  const census = districtData && districtData.census && !districtData.census.error
    ? districtData.census : null;
  const elec = districtData && districtData.election && !districtData.election.error
    ? districtData.election : null;

  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec.winnerParty) : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName, year);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "${idPrefix}-${num}",
    name: "Oregon ${chamberLabel} District ${num}",
    type: "${type}",
    incumbentName: ${JSON.stringify(incumbentName)},
    incumbentParty: ${JSON.stringify(incumbentParty)},
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Oregon ${chamberLabel} District ${num}",
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

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  const ELECTION_FILE = path.join(__dirname, "or-elections-data.json");
  const OUTPUT_FILE   = path.join(__dirname, "or-districts.js");

  console.log("Loading election data from or-elections-data.json...");
  if (!fs.existsSync(ELECTION_FILE)) {
    console.error(`or-elections-data.json not found in ${__dirname}.`);
    process.exit(1);
  }
  // or-elections-data.json is a flat array of { districtId: "SD-1"/"HD-1", chamber, ... }
  // records (from or-extract-elections.js), unlike the keyed-object shape some
  // other states' election files use.
  const electionRecords = JSON.parse(fs.readFileSync(ELECTION_FILE, "utf8"));
  const houseElection  = {};
  const senateElection = {};
  for (const rec of electionRecords) {
    const m = /^([SH]D)-(\d+)$/.exec(rec.districtId);
    if (!m) continue;
    (m[1] === 'HD' ? houseElection : senateElection)[m[2]] = rec;
  }
  console.log(
    `  House election districts: ${Object.keys(houseElection).length}`,
    `| Senate election districts: ${Object.keys(senateElection).length}\n`
  );

  console.log("Fetching Census data for House districts 1–60 (lower chamber)...");
  console.log("  200ms delay between each request — est. ~12 seconds\n");

  const houseNums   = Array.from({ length: 60 }, (_, i) => i + 1);
  const houseCensus = {};
  for (const n of houseNums) {
    const label = `HD-${String(n).padStart(2, "0")}`;
    houseCensus[n] = await fetchWithDelay(n, "lower", label, 200);
  }

  console.log("\nFetching Census data for Senate districts 1–30 (upper chamber)...");
  console.log("  200ms delay between each request — est. ~6 seconds\n");

  const senateNums   = Array.from({ length: 30 }, (_, i) => i + 1);
  const senateCensus = {};
  for (const n of senateNums) {
    const label = `SD-${String(n).padStart(2, "0")}`;
    senateCensus[n] = await fetchWithDelay(n, "upper", label, 200);
  }

  console.log("\nCombining and writing or-districts.js...");

  const house = {};
  for (const n of houseNums) {
    house[String(n)] = {
      districtNumber: n,
      districtName:   `Oregon House District ${n}`,
      census: houseCensus[n].ok ? houseCensus[n].data : { error: houseCensus[n].error },
      election: houseElection[String(n)] || { error: "District not found in or-elections-data.json" },
    };
  }

  const senate = {};
  for (const n of senateNums) {
    senate[String(n)] = {
      districtNumber: n,
      districtName:   `Oregon Senate District ${n}`,
      census: senateCensus[n].ok ? senateCensus[n].data : { error: senateCensus[n].error },
      election: senateElection[String(n)] || { error: "District not found in or-elections-data.json" },
    };
  }

  const houseEntries = houseNums.map(n =>
    genEntry(n, house[String(n)], 'or-hd', 'House', 'state house district', 2024)
  );
  const senateEntries = senateNums.map(n => {
    const year = SENATE_2024.has(n) ? 2024 : 2022;
    return genEntry(n, senate[String(n)], 'or-sd', 'Senate', 'state senate district', year);
  });

  const output = `/* or-districts.js — Groundwork Oregon District Data
 *
 * Generated by or-fetch-all.js from or-elections-data.json + Census ACS data.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (OR SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const OR_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const OR_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

  fs.writeFileSync(OUTPUT_FILE, output);

  const houseCensusOk  = houseNums.filter(n => houseCensus[n].ok).length;
  const senateCensusOk = senateNums.filter(n => senateCensus[n].ok).length;
  const houseElecOk    = houseNums.filter(n => !!houseElection[String(n)]).length;
  const senateElecOk   = senateNums.filter(n => !!senateElection[String(n)]).length;

  console.log("\nComplete.");
  console.log(`  House  — Census: ${houseCensusOk}/60  |  Election: ${houseElecOk}/60`);
  console.log(`  Senate — Census: ${senateCensusOk}/30  |  Election: ${senateElecOk}/30`);
  console.log(`  Total  — ${houseElecOk + senateElecOk}/90`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
