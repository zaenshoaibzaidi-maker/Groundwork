#!/usr/bin/env node
// wa-fetch-all.js
// Fetches ACS 5-year Census data for all 49 Washington Senate districts and
// all 49 Washington House districts (lower chamber — each elects a
// Representative Pos. 1 and a Representative Pos. 2 from the same district
// geography), merges with pre-extracted election data from
// wa-elections-data.json, and writes wa-districts.js directly.
//
// Usage:  node wa-fetch-all.js   (reads CENSUS_API_KEY from .env)
// Requires: Node 18+ (native fetch)
// Output:   wa-districts.js (created/overwritten in the same directory)

require("dotenv").config();

const path = require("path");
const fs   = require("fs");

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const STATE_FIPS   = "53"; // Washington
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
//  wa-districts.js TEMPLATE HELPERS
// ══════════════════════════════════════════════════════════════════════════════

const DEMO_COLORS = ['#4e9e68', '#2563eb', '#f59e0b', '#ef4444'];
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
  if (party === 'REP') return 'Republican';
  if (party === 'DEM') return 'Democrat';
  return party || 'TBD';
}

function getDemRep(elec) {
  if (!elec || elec.error) return { dem: 0, rep: 0 };
  if (!elec.opposed) {
    return elec.winnerParty === 'DEM' ? { dem: 100, rep: 0 } : { dem: 0, rep: 100 };
  }
  const pct = Math.round(elec.winnerPct);
  if (elec.winnerParty === 'DEM') return { dem: pct, rep: 100 - pct };
  if (elec.winnerParty === 'REP') return { dem: 100 - pct, rep: pct };
  return { dem: 0, rep: 0 };
}

function getPartisanSub(elec, incumbentName) {
  if (!elec || elec.error) return 'TBD';
  const last = lastName(incumbentName);
  if (!elec.opposed) return `${last} won unopposed in 2024.`;
  return `${last} won with ${Math.round(elec.winnerPct)}% in 2024.`;
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

function genEntry(id, name, census, elec, type) {
  const incumbentName  = elec ? toTitleCase(elec.winner) : 'TBD';
  const incumbentParty = elec ? partyFull(elec.winnerParty) : 'TBD';
  const { dem, rep }   = getDemRep(elec);
  const partisanSub    = getPartisanSub(elec, incumbentName);

  const income  = census ? formatIncome(census.medianHouseholdIncome) : 'N/A';
  const college = census ? formatPct(census.collegePct)               : 'N/A';
  const age     = census ? formatAge(census.medianAge)                : 'N/A';
  const renter  = census ? formatPct(census.renterRatePct)            : 'N/A';
  const demos   = census ? getDemosLines(census.race)                 : '';

  return `  {
    id: "${id}",
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
  const ELECTION_FILE = path.join(__dirname, "wa-elections-data.json");
  const OUTPUT_FILE   = path.join(__dirname, "wa-districts.js");

  console.log("Loading election data from wa-elections-data.json...");
  if (!fs.existsSync(ELECTION_FILE)) {
    console.error(`wa-elections-data.json not found in ${__dirname}.`);
    process.exit(1);
  }

  // wa-elections-data.json stores districts as an array of
  // { district, senator, rep1, rep2 }; re-key by district number.
  const electionList = JSON.parse(fs.readFileSync(ELECTION_FILE, "utf8"));
  const election = {};
  for (const d of electionList) {
    election[String(d.district)] = {
      senator: d.senator,
      rep1:    d.rep1,
      rep2:    d.rep2,
    };
  }
  console.log(`  Election districts: ${Object.keys(election).length}\n`);

  const districtNums = Array.from({ length: 49 }, (_, i) => i + 1);

  console.log("Fetching Census data for Senate districts 1–49 (upper chamber)...");
  console.log("  200ms delay between each request — est. ~10 seconds\n");

  const senateCensus = {};
  for (const n of districtNums) {
    const label = `SD-${String(n).padStart(2, "0")}`;
    senateCensus[n] = await fetchWithDelay(n, "upper", label, 200);
  }

  console.log("\nFetching Census data for House districts 1–49 (lower chamber)...");
  console.log("  Shared geography backs both Representative Pos. 1 and Pos. 2 seats — est. ~10 seconds\n");

  const houseCensus = {};
  for (const n of districtNums) {
    const label = `HD-${String(n).padStart(2, "0")}`;
    houseCensus[n] = await fetchWithDelay(n, "lower", label, 200);
  }

  console.log("\nGenerating wa-districts.js...");

  const houseEntries = [];
  const senateEntries = [];

  for (const n of districtNums) {
    const key = String(n);
    const elec = election[key] || {};

    const senateCensusData = senateCensus[n].ok ? senateCensus[n].data : null;
    const houseCensusData  = houseCensus[n].ok  ? houseCensus[n].data  : null;

    const rep1     = elec.rep1    && !elec.rep1.error    ? elec.rep1    : null;
    const rep2     = elec.rep2    && !elec.rep2.error    ? elec.rep2    : null;
    const senator  = elec.senator && !elec.senator.error ? elec.senator : null;

    houseEntries.push(genEntry(
      `wa-hd-${n}1`, `Washington House District ${n} Pos. 1`, houseCensusData, rep1, 'state house district'
    ));
    houseEntries.push(genEntry(
      `wa-hd-${n}2`, `Washington House District ${n} Pos. 2`, houseCensusData, rep2, 'state house district'
    ));
    senateEntries.push(genEntry(
      `wa-sd-${n}`, `Washington Senate District ${n}`, senateCensusData, senator, 'state senate district'
    ));
  }

  const output = `/* wa-districts.js — Groundwork Washington District Data
 *
 * Generated by wa-fetch-all.js from wa-elections-data.json + Census ACS data.
 * Census: ACS 5-Year 2023 (2019–2023) | Elections: 2024/2022 General (WA SoS)
 * ─────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#4e9e68','#2563eb','#f59e0b','#ef4444'];

const WA_HOUSE_DISTRICTS = [
${houseEntries.join(',\n')}
];

const WA_SENATE_DISTRICTS = [
${senateEntries.join(',\n')}
];
`;

  fs.writeFileSync(OUTPUT_FILE, output);

  const senateCensusOk = districtNums.filter(n => senateCensus[n].ok).length;
  const houseCensusOk  = districtNums.filter(n => houseCensus[n].ok).length;
  const elecOk         = districtNums.filter(n => !!election[String(n)]).length;
  const totalCensusOk  = senateCensusOk + houseCensusOk;
  const totalDistricts = senateEntries.length + houseEntries.length;

  console.log("\nComplete.");
  console.log(`  Senate Census: ${senateCensusOk}/49  |  House Census: ${houseCensusOk}/49`);
  console.log(`  Total Census:  ${totalCensusOk}/98`);
  console.log(`  Election:      ${elecOk}/49 districts (senator + rep1 + rep2 each)`);
  console.log(`  Total district entries written: ${totalDistricts}/147`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
