#!/usr/bin/env node
// nh-fetch-all.js
// Fetches ACS 5-year Census data for all New Hampshire House districts (county-
// scoped, e.g. "nh-hd-belknap-1") and all 24 New Hampshire Senate districts,
// merges with pre-extracted election data from nh-elections-data.json, and
// saves to nh-all-districts-data.json.
//
// Usage:  node nh-fetch-all.js   (reads CENSUS_API_KEY from .env)
// Requires: Node 18+ (native fetch)
// Output:   nh-all-districts-data.json (created/overwritten in the same directory)

require("dotenv").config();

const path = require("path");
const fs   = require("fs");

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const STATE_FIPS  = "33"; // New Hampshire
const API_KEY     = process.env.CENSUS_API_KEY ? `&key=${process.env.CENSUS_API_KEY}` : "";
const CENSUS_BASE = "https://api.census.gov/data/2023/acs/acs5";

// NH's SLDL (House) GEOID encodes the county as a hundreds-digit prefix:
// code = countyIndex*100 + the county's local district number (e.g. Belknap 1
// -> "001", Carroll 1 -> "101", Cheshire 1 -> "201", ...). Verified against the
// Census API's full NH lower-chamber district list.
const COUNTY_PREFIX = {
  belknap: 0, carroll: 1, cheshire: 2, coos: 3, grafton: 4,
  hillsborough: 5, merrimack: 6, rockingham: 7, strafford: 8, sullivan: 9,
};

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

function houseGeoCode(county, districtNum) {
  return String(COUNTY_PREFIX[county] * 100 + districtNum).padStart(3, "0");
}

function senateGeoCode(districtNum) {
  return String(districtNum).padStart(3, "0");
}

async function fetchCensusData(geoCode, chamber) {
  const url =
    `${CENSUS_BASE}?get=NAME,${CENSUS_VARS}` +
    `&for=state+legislative+district+(${chamber}+chamber):${geoCode}` +
    `&in=state:${STATE_FIPS}${API_KEY}`;

  const res = await fetch(url);
  if (res.status === 204) {
    throw new Error("No data for this district in Census TIGER (district may not exist in this vintage)");
  }
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

async function fetchWithDelay(geoCode, chamber, label, delayMs) {
  await delay(delayMs);
  try {
    const data = await fetchCensusData(geoCode, chamber);
    process.stdout.write(`  [${label}] ✓\n`);
    return { ok: true, data };
  } catch (err) {
    process.stdout.write(`  [${label}] ✗ ${err.message}\n`);
    return { ok: false, error: err.message };
  }
}

function titleCase(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function main() {
  const ELECTION_FILE = path.join(__dirname, "nh-elections-data.json");
  const OUTPUT_FILE   = path.join(__dirname, "nh-all-districts-data.json");

  console.log("Loading election data from nh-elections-data.json...");
  if (!fs.existsSync(ELECTION_FILE)) {
    console.error(`nh-elections-data.json not found in ${__dirname}.`);
    process.exit(1);
  }
  const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, "utf8"));
  const houseDistricts  = electionData.house  || [];
  const senateDistricts = electionData.senate || [];
  console.log(
    `  House election districts: ${houseDistricts.length}`,
    `| Senate election districts: ${senateDistricts.length}\n`
  );

  console.log(`Fetching Census data for ${houseDistricts.length} House districts (lower chamber)...`);
  console.log(`  200ms delay between each request — est. ~${Math.ceil(houseDistricts.length * 0.2)} seconds\n`);

  const houseCensus = {};
  for (const d of houseDistricts) {
    const [, , county, numStr] = d.districtId.split("-");
    const geoCode = houseGeoCode(county, parseInt(numStr, 10));
    houseCensus[d.districtId] = await fetchWithDelay(geoCode, "lower", d.districtId, 200);
  }

  console.log(`\nFetching Census data for ${senateDistricts.length} Senate districts (upper chamber)...`);
  console.log(`  200ms delay between each request — est. ~${Math.ceil(senateDistricts.length * 0.2)} seconds\n`);

  const senateCensus = {};
  for (const d of senateDistricts) {
    const numStr = d.districtId.split("-")[2];
    const geoCode = senateGeoCode(parseInt(numStr, 10));
    senateCensus[d.districtId] = await fetchWithDelay(geoCode, "upper", d.districtId, 200);
  }

  console.log("\nCombining and writing output...");

  const house = {};
  for (const d of houseDistricts) {
    const [, , county, numStr] = d.districtId.split("-");
    const num = parseInt(numStr, 10);
    house[d.districtId] = {
      districtId: d.districtId,
      county,
      districtNumber: num,
      districtName: `New Hampshire House District ${num} (${titleCase(county)})`,
      census: houseCensus[d.districtId].ok ? houseCensus[d.districtId].data : { error: houseCensus[d.districtId].error },
      election: d,
    };
  }

  const senate = {};
  for (const d of senateDistricts) {
    const num = parseInt(d.districtId.split("-")[2], 10);
    senate[d.districtId] = {
      districtId: d.districtId,
      districtNumber: num,
      districtName: `New Hampshire Senate District ${num}`,
      census: senateCensus[d.districtId].ok ? senateCensus[d.districtId].data : { error: senateCensus[d.districtId].error },
      election: d,
    };
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ house, senate }, null, 2));

  const houseCensusOk  = houseDistricts.filter(d => houseCensus[d.districtId].ok).length;
  const senateCensusOk = senateDistricts.filter(d => senateCensus[d.districtId].ok).length;

  console.log("\nComplete.");
  console.log(`  House  — Census: ${houseCensusOk}/${houseDistricts.length}  |  Election: ${houseDistricts.length}/${houseDistricts.length}`);
  console.log(`  Senate — Census: ${senateCensusOk}/${senateDistricts.length}   |  Election: ${senateDistricts.length}/${senateDistricts.length}`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);

  const houseFailed = houseDistricts.filter(d => !houseCensus[d.districtId].ok);
  if (houseFailed.length) {
    console.log("  House districts with no Census match:");
    for (const d of houseFailed) console.log(`    - ${d.districtId}: ${houseCensus[d.districtId].error}`);
  }
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
