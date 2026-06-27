#!/usr/bin/env node
// ne-fetch-all.js
// Fetches ACS 5-year Census data for all 49 Nebraska Legislature districts
// (unicameral — Census classifies it under "upper chamber"), merges with
// pre-extracted election data from ne-elections-data.json, and saves to
// ne-all-districts-data.json.
//
// Usage:  node ne-fetch-all.js   (reads CENSUS_API_KEY from .env)
// Requires: Node 18+ (native fetch)
// Output:   ne-all-districts-data.json (created/overwritten in the same directory)

require("dotenv").config();

const path = require("path");
const fs   = require("fs");

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const STATE_FIPS   = "31"; // Nebraska
const API_KEY      = process.env.CENSUS_API_KEY ? `&key=${process.env.CENSUS_API_KEY}` : "";
const CENSUS_BASE  = "https://api.census.gov/data/2023/acs/acs5";
const TOTAL_DISTRICTS = 49;

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

// Nebraska's unicameral Legislature is filed under "upper chamber" in Census
// geography — there is no "lower chamber" entry for state:31.
async function fetchCensusData(districtNum) {
  const pad = String(districtNum).padStart(3, "0");
  const url =
    `${CENSUS_BASE}?get=NAME,${CENSUS_VARS}` +
    `&for=state+legislative+district+(upper+chamber):${pad}` +
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

async function fetchWithDelay(districtNum, label, delayMs) {
  await delay(delayMs);
  try {
    const data = await fetchCensusData(districtNum);
    process.stdout.write(`  [${label}] ✓\n`);
    return { ok: true, data };
  } catch (err) {
    process.stdout.write(`  [${label}] ✗ ${err.message}\n`);
    return { ok: false, error: err.message };
  }
}

async function main() {
  const ELECTION_FILE = path.join(__dirname, "ne-elections-data.json");
  const OUTPUT_FILE   = path.join(__dirname, "ne-all-districts-data.json");

  console.log("Loading election data from ne-elections-data.json...");
  if (!fs.existsSync(ELECTION_FILE)) {
    console.error(`ne-elections-data.json not found in ${__dirname}.`);
    process.exit(1);
  }
  const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, "utf8"));
  const electionByNum = {};
  for (const d of electionData.districts || []) {
    const num = parseInt(d.districtId.split("-")[2], 10);
    electionByNum[num] = d;
  }
  console.log(`  Election districts: ${Object.keys(electionByNum).length}\n`);

  console.log(`Fetching Census data for districts 1–${TOTAL_DISTRICTS} (unicameral)...`);
  console.log("  200ms delay between each request — est. ~10 seconds\n");

  const districtNums = Array.from({ length: TOTAL_DISTRICTS }, (_, i) => i + 1);
  const census = {};
  for (const n of districtNums) {
    const label = `LD-${String(n).padStart(2, "0")}`;
    census[n] = await fetchWithDelay(n, label, 200);
  }

  console.log("\nCombining and writing output...");

  const districts = {};
  for (const n of districtNums) {
    districts[String(n)] = {
      districtNumber: n,
      districtName:   `Nebraska Legislative District ${n}`,
      census: census[n].ok ? census[n].data : { error: census[n].error },
      election: electionByNum[n] || { error: "District not found in ne-elections-data.json" },
    };
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ districts }, null, 2));

  const censusOk = districtNums.filter(n => census[n].ok).length;
  const elecOk   = districtNums.filter(n => !!electionByNum[n]).length;

  console.log("\nComplete.");
  console.log(`  Districts — Census: ${censusOk}/${TOTAL_DISTRICTS}  |  Election: ${elecOk}/${TOTAL_DISTRICTS}`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
