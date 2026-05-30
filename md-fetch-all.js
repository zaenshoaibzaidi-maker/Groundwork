#!/usr/bin/env node
// md-fetch-all.js
// Fetches ACS 5-year Census data for all Maryland House and Senate districts,
// merges with pre-extracted election data from md-elections-data.json,
// and saves to md-all-districts-data.json.
//
// Maryland House districts include lettered sub-districts (e.g. 1A, 27C).
// District IDs are derived from md-elections-data.json keys and converted
// to the correct Census FIPS codes (e.g. "1A" → "01A", "3" → "003").
//
// Usage:  node md-fetch-all.js   (reads CENSUS_API_KEY from .env)
// Requires: Node 18+ (native fetch)
// Output:   md-all-districts-data.json (created/overwritten in the same directory)

require("dotenv").config();

const path = require("path");
const fs   = require("fs");

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const STATE_FIPS  = "24"; // Maryland
const API_KEY     = process.env.CENSUS_API_KEY ? `&key=${process.env.CENSUS_API_KEY}` : "";
const CENSUS_BASE = "https://api.census.gov/data/2023/acs/acs5";

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

// Convert election data key to Census FIPS code.
// Pure numeric (e.g. "3") → 3-digit padded ("003").
// Lettered sub-district (e.g. "1A", "27C") → 2-digit number + letter ("01A", "27C").
function toCensusCode(key) {
  const m = key.match(/^(\d+)([A-Z]?)$/);
  const num    = m[1];
  const letter = m[2] || "";
  return letter
    ? num.padStart(2, "0") + letter
    : num.padStart(3, "0");
}

// Sort district keys naturally: by numeric part first, then letter.
function sortDistrictKeys(keys) {
  return [...keys].sort((a, b) => {
    const ma = a.match(/^(\d+)([A-Z]?)$/);
    const mb = b.match(/^(\d+)([A-Z]?)$/);
    const numDiff = parseInt(ma[1]) - parseInt(mb[1]);
    return numDiff !== 0 ? numDiff : (ma[2] || "").localeCompare(mb[2] || "");
  });
}

function parseRaw(raw) {
  const n = parseFloat(raw);
  return isNaN(n) || n === CENSUS_MISSING || n < 0 ? null : n;
}

function pctOf(numerator, denominator) {
  if (numerator === null || denominator === null || denominator === 0) return null;
  return parseFloat(((numerator / denominator) * 100).toFixed(2));
}

async function fetchCensusData(censusCode, chamber) {
  const url =
    `${CENSUS_BASE}?get=NAME,${CENSUS_VARS}` +
    `&for=state+legislative+district+(${chamber}+chamber):${censusCode}` +
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

async function fetchWithRetry(censusCode, chamber, label) {
  await delay(200);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const data = await fetchCensusData(censusCode, chamber);
      process.stdout.write(`  [${label}] ✓\n`);
      return { ok: true, data };
    } catch (err) {
      if (attempt < 3) {
        process.stdout.write(`  [${label}] retry ${attempt} — ${err.message}\n`);
        await delay(5000);
      } else {
        process.stdout.write(`  [${label}] ✗ ${err.message}\n`);
        return { ok: false, error: err.message };
      }
    }
  }
}

async function main() {
  const ELECTION_FILE = path.join(__dirname, "md-elections-data.json");
  const OUTPUT_FILE   = path.join(__dirname, "md-all-districts-data.json");

  console.log("Loading election data from md-elections-data.json...");
  if (!fs.existsSync(ELECTION_FILE)) {
    console.error(`md-elections-data.json not found in ${__dirname}.`);
    process.exit(1);
  }
  const electionData   = JSON.parse(fs.readFileSync(ELECTION_FILE, "utf8"));
  const houseElection  = electionData.house  || {};
  const senateElection = electionData.senate || {};

  const houseKeys  = sortDistrictKeys(Object.keys(houseElection));
  const senateKeys = sortDistrictKeys(Object.keys(senateElection));

  console.log(
    `  House election districts:  ${houseKeys.length}`,
    `| Senate election districts: ${senateKeys.length}\n`
  );

  // ── House ──────────────────────────────────────────────────────────────────
  console.log(`Fetching Census data for ${houseKeys.length} House districts (lower chamber)...`);
  console.log("  200ms delay between requests, 5s retry delay on failure\n");

  const houseCensus = {};
  for (const key of houseKeys) {
    const code  = toCensusCode(key);
    const label = `HD-${key}`;
    houseCensus[key] = await fetchWithRetry(code, "lower", label);
  }

  // ── Senate ─────────────────────────────────────────────────────────────────
  console.log(`\nFetching Census data for ${senateKeys.length} Senate districts (upper chamber)...`);
  console.log("  200ms delay between requests, 5s retry delay on failure\n");

  const senateCensus = {};
  for (const key of senateKeys) {
    const code  = toCensusCode(key);
    const label = `SD-${key.padStart(2, "0")}`;
    senateCensus[key] = await fetchWithRetry(code, "upper", label);
  }

  // ── Combine & write ────────────────────────────────────────────────────────
  console.log("\nCombining and writing output...");

  const house = {};
  for (const key of houseKeys) {
    house[key] = {
      districtId:   key,
      districtName: `Maryland House District ${key}`,
      census:   houseCensus[key].ok ? houseCensus[key].data : { error: houseCensus[key].error },
      election: houseElection[key],
    };
  }

  const senate = {};
  for (const key of senateKeys) {
    senate[key] = {
      districtId:   key,
      districtName: `Maryland Senate District ${key}`,
      census:   senateCensus[key].ok ? senateCensus[key].data : { error: senateCensus[key].error },
      election: senateElection[key],
    };
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ house, senate }, null, 2));

  const houseCensusOk  = houseKeys.filter(k => houseCensus[k].ok).length;
  const senateCensusOk = senateKeys.filter(k => senateCensus[k].ok).length;
  const total = houseKeys.length + senateKeys.length;
  const totalOk = houseCensusOk + senateCensusOk;

  console.log("\nComplete.");
  console.log(`  House  — Census: ${houseCensusOk}/${houseKeys.length}`);
  console.log(`  Senate — Census: ${senateCensusOk}/${senateKeys.length}`);
  console.log(`  Total  — Census: ${totalOk}/${total}`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
