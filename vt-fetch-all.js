#!/usr/bin/env node
// vt-fetch-all.js
// Fetches ACS 5-year Census data for all 109 Vermont House districts and
// all 16 Vermont Senate districts, merges with pre-extracted election data
// from vt-elections-data.json, and saves to vt-all-districts-data.json.
//
// Like MA, Vermont legislative districts are identified by name (e.g.
// "Windsor 4", "Chittenden Central") rather than a sequential number, so the
// Census district code for each is resolved via a wildcard NAME lookup first,
// then matched to our names by normalizing both to a bare alphanumeric string
// (Census names use hyphens/spaces and boilerplate like "State House
// District (2022); Vermont" that our names don't have).
//
// Usage:  node vt-fetch-all.js   (reads CENSUS_API_KEY from .env)
// Requires: Node 18+ (native fetch)
// Output:   vt-all-districts-data.json (created/overwritten in the same directory)

require("dotenv").config();

const path = require("path");
const fs   = require("fs");

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const STATE_FIPS   = "50"; // Vermont
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

// ══════════════════════════════════════════════════════════════════════════════
//  NAME NORMALIZATION (matches our district names to Census district names)
// ══════════════════════════════════════════════════════════════════════════════

// Census names carry boilerplate ("State House District (2022); Vermont",
// "Senatorial District") plus hyphens our names render as spaces (e.g.
// "Addison-1" vs "Addison 1") and multi-word directionals our names collapse
// (e.g. "South East" vs "Southeast"). Stripping to a bare alphanumeric string
// sidesteps all of that without needing token-set logic.
function normalize(name) {
  return name
    .replace(/\(\d{4}\)/g, " ")
    .replace(/;\s*Vermont/i, " ")
    .replace(/State House District/gi, " ")
    .replace(/State Senate District/gi, " ")
    .replace(/Senatorial District/gi, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

async function fetchDistrictCodes(chamber) {
  const url =
    `${CENSUS_BASE}?get=NAME` +
    `&for=state+legislative+district+(${chamber}+chamber):*` +
    `&in=state:${STATE_FIPS}${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const headers = data[0];
  const nameIdx = headers.indexOf("NAME");
  const codeIdx = headers.length - 1;

  const map = {};
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rawName = row[nameIdx];
    if (/not defined/i.test(rawName)) continue;
    map[normalize(rawName)] = { code: row[codeIdx], rawName };
  }
  return map;
}

// ══════════════════════════════════════════════════════════════════════════════
//  PER-DISTRICT CENSUS FETCH
// ══════════════════════════════════════════════════════════════════════════════

async function fetchCensusData(code, chamber) {
  const url =
    `${CENSUS_BASE}?get=NAME,${CENSUS_VARS}` +
    `&for=state+legislative+district+(${chamber}+chamber):${code}` +
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

async function fetchWithDelay(code, chamber, label, delayMs) {
  await delay(delayMs);
  try {
    const data = await fetchCensusData(code, chamber);
    process.stdout.write(`  [${label}] ✓\n`);
    return { ok: true, data };
  } catch (err) {
    process.stdout.write(`  [${label}] ✗ ${err.message}\n`);
    return { ok: false, error: err.message };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  const ELECTION_FILE = path.join(__dirname, "vt-elections-data.json");
  const OUTPUT_FILE   = path.join(__dirname, "vt-all-districts-data.json");

  console.log("Loading election data from vt-elections-data.json...");
  if (!fs.existsSync(ELECTION_FILE)) {
    console.error(`vt-elections-data.json not found in ${__dirname}.`);
    process.exit(1);
  }
  const electionData   = JSON.parse(fs.readFileSync(ELECTION_FILE, "utf8"));
  const houseElection  = electionData.house  || {};
  const senateElection = electionData.senate || {};
  const houseNames     = Object.keys(houseElection);
  const senateNames    = Object.keys(senateElection);
  console.log(
    `  House election districts: ${houseNames.length}`,
    `| Senate election districts: ${senateNames.length}\n`
  );

  console.log("Resolving Census district codes for House (lower chamber) and Senate (upper chamber)...");
  const lowerCodeMap = await fetchDistrictCodes("lower");
  const upperCodeMap = await fetchDistrictCodes("upper");
  console.log(`  Lower chamber codes found: ${Object.keys(lowerCodeMap).length}`);
  console.log(`  Upper chamber codes found: ${Object.keys(upperCodeMap).length}\n`);

  function resolveCode(name, codeMap) {
    const match = codeMap[normalize(name)];
    return match ? match.code : null;
  }

  console.log(`Fetching Census data for ${houseNames.length} House districts (lower chamber)...`);
  console.log(`  200ms delay between each request — est. ~${Math.round(houseNames.length * 0.2)} seconds\n`);

  const houseCensus = {};
  for (const name of houseNames) {
    const code = resolveCode(name, lowerCodeMap);
    const label = `HD [${name}]`;
    if (!code) {
      process.stdout.write(`  [${label}] ✗ no matching Census district code\n`);
      houseCensus[name] = { ok: false, error: "No matching Census district code" };
      continue;
    }
    houseCensus[name] = await fetchWithDelay(code, "lower", label, 200);
  }

  console.log(`\nFetching Census data for ${senateNames.length} Senate districts (upper chamber)...`);
  console.log(`  200ms delay between each request — est. ~${Math.round(senateNames.length * 0.2)} seconds\n`);

  const senateCensus = {};
  for (const name of senateNames) {
    const code = resolveCode(name, upperCodeMap);
    const label = `SD [${name}]`;
    if (!code) {
      process.stdout.write(`  [${label}] ✗ no matching Census district code\n`);
      senateCensus[name] = { ok: false, error: "No matching Census district code" };
      continue;
    }
    senateCensus[name] = await fetchWithDelay(code, "upper", label, 200);
  }

  console.log("\nCombining and writing output...");

  const house = {};
  for (const name of houseNames) {
    house[name] = {
      districtName: name,
      census: houseCensus[name].ok ? houseCensus[name].data : { error: houseCensus[name].error },
      election: houseElection[name] || { error: "District not found in vt-elections-data.json" },
    };
  }

  const senate = {};
  for (const name of senateNames) {
    senate[name] = {
      districtName: name,
      census: senateCensus[name].ok ? senateCensus[name].data : { error: senateCensus[name].error },
      election: senateElection[name] || { error: "District not found in vt-elections-data.json" },
    };
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ house, senate }, null, 2));

  const houseCensusOk  = houseNames.filter(n => houseCensus[n].ok).length;
  const senateCensusOk = senateNames.filter(n => senateCensus[n].ok).length;
  const houseElecOk    = houseNames.filter(n => !!houseElection[n]).length;
  const senateElecOk   = senateNames.filter(n => !!senateElection[n]).length;

  console.log("\nComplete.");
  console.log(`  House  — Census: ${houseCensusOk}/${houseNames.length}  |  Election: ${houseElecOk}/${houseNames.length}`);
  console.log(`  Senate — Census: ${senateCensusOk}/${senateNames.length}   |  Election: ${senateElecOk}/${senateNames.length}`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
