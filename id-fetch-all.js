#!/usr/bin/env node
// id-fetch-all.js
// Fetches ACS 5-year Census data for all 35 Idaho Senate districts and all 35
// Idaho House districts (lower chamber — each elects a Representative A and
// a Representative B from the same district geography), merges with
// pre-extracted election data from id-elections-data.json, and saves to
// id-all-districts-data.json.
//
// Usage:  node id-fetch-all.js   (reads CENSUS_API_KEY from .env)
// Requires: Node 18+ (native fetch)
// Output:   id-all-districts-data.json (created/overwritten in the same directory)

require("dotenv").config();

const path = require("path");
const fs   = require("fs");

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const STATE_FIPS   = "16"; // Idaho
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

async function main() {
  const ELECTION_FILE = path.join(__dirname, "id-elections-data.json");
  const OUTPUT_FILE   = path.join(__dirname, "id-all-districts-data.json");

  console.log("Loading election data from id-elections-data.json...");
  if (!fs.existsSync(ELECTION_FILE)) {
    console.error(`id-elections-data.json not found in ${__dirname}.`);
    process.exit(1);
  }

  // id-elections-data.json stores districts as an array of
  // { district, senator, repA, repB }; re-key by district number.
  const electionList = JSON.parse(fs.readFileSync(ELECTION_FILE, "utf8"));
  const election = {};
  for (const d of electionList) {
    election[String(d.district)] = {
      senator: d.senator,
      repA:    d.repA,
      repB:    d.repB,
    };
  }
  console.log(`  Election districts: ${Object.keys(election).length}\n`);

  console.log("Fetching Census data for Senate districts 1–35 (upper chamber)...");
  console.log("  200ms delay between each request — est. ~10 seconds\n");

  const districtNums = Array.from({ length: 35 }, (_, i) => i + 1);
  const senateCensus = {};
  for (const n of districtNums) {
    const label = `SD-${String(n).padStart(2, "0")}`;
    senateCensus[n] = await fetchWithDelay(n, "upper", label, 200);
  }

  console.log("\nFetching Census data for House districts 1–35 (lower chamber)...");
  console.log("  Shared geography backs both Representative A and B seats — est. ~10 seconds\n");

  const houseCensus = {};
  for (const n of districtNums) {
    const label = `HD-${String(n).padStart(2, "0")}`;
    houseCensus[n] = await fetchWithDelay(n, "lower", label, 200);
  }

  console.log("\nCombining and writing output...");

  const districts = {};
  for (const n of districtNums) {
    const key = String(n);
    districts[key] = {
      districtNumber: n,
      districtName:   `Idaho Legislative District ${n}`,
      census: {
        senate: senateCensus[n].ok ? senateCensus[n].data : { error: senateCensus[n].error },
        house:  houseCensus[n].ok  ? houseCensus[n].data  : { error: houseCensus[n].error },
      },
      election: election[key] || {
        senator: { error: "District not found in id-elections-data.json" },
        repA:    { error: "District not found in id-elections-data.json" },
        repB:    { error: "District not found in id-elections-data.json" },
      },
    };
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ districts }, null, 2));

  const senateCensusOk = districtNums.filter(n => senateCensus[n].ok).length;
  const houseCensusOk  = districtNums.filter(n => houseCensus[n].ok).length;
  const elecOk         = districtNums.filter(n => !!election[String(n)]).length;
  const totalCensusOk  = senateCensusOk + houseCensusOk;

  console.log("\nComplete.");
  console.log(`  Senate Census: ${senateCensusOk}/35  |  House Census: ${houseCensusOk}/35`);
  console.log(`  Total Census:  ${totalCensusOk}/70`);
  console.log(`  Election:      ${elecOk}/35 districts (senator + repA + repB each)`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
