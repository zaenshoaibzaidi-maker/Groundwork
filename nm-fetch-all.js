#!/usr/bin/env node
// nm-fetch-all.js
// Fetches ACS 5-year Census data for all 70 New Mexico House districts and all
// 42 New Mexico Senate districts, merges with pre-extracted election data from
// nm-elections-data.json, and saves to nm-all-districts-data.json.
//
// Usage:  node nm-fetch-all.js   (reads CENSUS_API_KEY from .env)
// Requires: Node 18+ (native fetch)
// Output:   nm-all-districts-data.json (created/overwritten in the same directory)

require("dotenv").config();

const path = require("path");
const fs   = require("fs");

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const STATE_FIPS   = "35"; // New Mexico
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

// nm-elections-data.json stores districts as arrays of records with a
// `district` field (not an object keyed by district number), so index them
// here to match the keyed lookup shape the rest of this script expects.
function indexByDistrict(records) {
  const out = {};
  for (const rec of records || []) {
    out[String(rec.district)] = rec;
  }
  return out;
}

async function main() {
  const ELECTION_FILE = path.join(__dirname, "nm-elections-data.json");
  const OUTPUT_FILE   = path.join(__dirname, "nm-all-districts-data.json");

  console.log("Loading election data from nm-elections-data.json...");
  if (!fs.existsSync(ELECTION_FILE)) {
    console.error(`nm-elections-data.json not found in ${__dirname}.`);
    process.exit(1);
  }
  const electionData   = JSON.parse(fs.readFileSync(ELECTION_FILE, "utf8"));
  const houseElection  = indexByDistrict(electionData.house);
  const senateElection = indexByDistrict(electionData.senate);
  console.log(
    `  House election districts: ${Object.keys(houseElection).length}`,
    `| Senate election districts: ${Object.keys(senateElection).length}\n`
  );

  console.log("Fetching Census data for House districts 1–70 (lower chamber)...");
  console.log("  200ms delay between each request — est. ~15 seconds\n");

  const houseNums   = Array.from({ length: 70 }, (_, i) => i + 1);
  const houseCensus = {};
  for (const n of houseNums) {
    const label = `HD-${String(n).padStart(3, "0")}`;
    houseCensus[n] = await fetchWithDelay(n, "lower", label, 200);
  }

  console.log("\nFetching Census data for Senate districts 1–42 (upper chamber)...");
  console.log("  200ms delay between each request — est. ~10 seconds\n");

  const senateNums   = Array.from({ length: 42 }, (_, i) => i + 1);
  const senateCensus = {};
  for (const n of senateNums) {
    const label = `SD-${String(n).padStart(2, "0")}`;
    senateCensus[n] = await fetchWithDelay(n, "upper", label, 200);
  }

  console.log("\nCombining and writing output...");

  const house = {};
  for (const n of houseNums) {
    house[String(n)] = {
      districtNumber: n,
      districtName:   `New Mexico House District ${n}`,
      census: houseCensus[n].ok ? houseCensus[n].data : { error: houseCensus[n].error },
      election: houseElection[String(n)] || { error: "District not found in nm-elections-data.json" },
    };
  }

  const senate = {};
  for (const n of senateNums) {
    senate[String(n)] = {
      districtNumber: n,
      districtName:   `New Mexico Senate District ${n}`,
      census: senateCensus[n].ok ? senateCensus[n].data : { error: senateCensus[n].error },
      election: senateElection[String(n)] || { error: "District not found in nm-elections-data.json" },
    };
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ house, senate }, null, 2));

  const houseCensusOk  = houseNums.filter(n => houseCensus[n].ok).length;
  const senateCensusOk = senateNums.filter(n => senateCensus[n].ok).length;
  const houseElecOk    = houseNums.filter(n => !!houseElection[String(n)]).length;
  const senateElecOk   = senateNums.filter(n => !!senateElection[String(n)]).length;

  console.log("\nComplete.");
  console.log(`  House  — Census: ${houseCensusOk}/70  |  Election: ${houseElecOk}/70`);
  console.log(`  Senate — Census: ${senateCensusOk}/42  |  Election: ${senateElecOk}/42`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
