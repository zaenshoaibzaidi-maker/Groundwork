#!/usr/bin/env node
// mn-fetch-all.js
// Fetches ACS 5-year Census data for all 134 Minnesota House districts (1A–67B)
// and all 67 Minnesota Senate districts, merges with pre-extracted election data
// from mn-elections-data.json, and saves to mn-all-districts-data.json.
//
// Usage:  node mn-fetch-all.js   (reads CENSUS_API_KEY from .env)
// Requires: Node 18+ (native fetch)
// Output:   mn-all-districts-data.json (created/overwritten in the same directory)

require("dotenv").config();

const path = require("path");
const fs   = require("fs");

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const STATE_FIPS   = "27"; // Minnesota
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

// MN Senate districts are 3-digit-padded numbers ("067"); House districts are
// 2-digit-padded numbers plus an A/B subdistrict letter ("67B" -> "67B", "1A" -> "01A").
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

async function main() {
  const ELECTION_FILE = path.join(__dirname, "mn-elections-data.json");
  const OUTPUT_FILE   = path.join(__dirname, "mn-all-districts-data.json");

  console.log("Loading election data from mn-elections-data.json...");
  if (!fs.existsSync(ELECTION_FILE)) {
    console.error(`mn-elections-data.json not found in ${__dirname}.`);
    process.exit(1);
  }
  const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, "utf8"));

  // mn-elections-data.json stores house/senate as arrays of district objects
  // (districtId like "mn-hd-1a" / "mn-sd-1") rather than keyed objects, so build
  // lookup maps keyed the same way ar-elections-data.json's house/senate objects are used.
  const houseElection  = new Map((electionData.house  || []).map(d => [d.districtId, d]));
  const senateElection = new Map((electionData.senate || []).map(d => [d.districtId, d]));
  console.log(
    `  House election districts: ${houseElection.size}`,
    `| Senate election districts: ${senateElection.size}\n`
  );

  const houseDistricts = [];
  for (let n = 1; n <= 67; n++) {
    for (const letter of ["A", "B"]) {
      houseDistricts.push({
        label:      `${n}${letter}`,
        code:       `${String(n).padStart(2, "0")}${letter}`,
        electionId: `mn-hd-${n}${letter}`.toLowerCase(),
      });
    }
  }

  const senateDistricts = [];
  for (let n = 1; n <= 67; n++) {
    senateDistricts.push({
      label:      `${n}`,
      code:       String(n).padStart(3, "0"),
      electionId: `mn-sd-${n}`,
    });
  }

  console.log(`Fetching Census data for House districts 1A–67B (lower chamber, ${houseDistricts.length} districts)...`);
  console.log("  200ms delay between each request — est. ~27 seconds\n");

  const houseCensus = {};
  for (const d of houseDistricts) {
    const label = `HD-${d.label}`;
    houseCensus[d.label] = await fetchWithDelay(d.code, "lower", label, 200);
  }

  console.log(`\nFetching Census data for Senate districts 1–67 (upper chamber, ${senateDistricts.length} districts)...`);
  console.log("  200ms delay between each request — est. ~13 seconds\n");

  const senateCensus = {};
  for (const d of senateDistricts) {
    const label = `SD-${d.label.padStart(2, "0")}`;
    senateCensus[d.label] = await fetchWithDelay(d.code, "upper", label, 200);
  }

  console.log("\nCombining and writing output...");

  const house = {};
  for (const d of houseDistricts) {
    const result = houseCensus[d.label];
    house[d.label] = {
      districtNumber: d.label,
      districtName:   `Minnesota House District ${d.label}`,
      census:   result.ok ? result.data : { error: result.error },
      election: houseElection.get(d.electionId) || { error: "District not found in mn-elections-data.json" },
    };
  }

  const senate = {};
  for (const d of senateDistricts) {
    const result = senateCensus[d.label];
    senate[d.label] = {
      districtNumber: d.label,
      districtName:   `Minnesota Senate District ${d.label}`,
      census:   result.ok ? result.data : { error: result.error },
      election: senateElection.get(d.electionId) || { error: "District not found in mn-elections-data.json" },
    };
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ house, senate }, null, 2));

  const houseCensusOk  = houseDistricts.filter(d => houseCensus[d.label].ok).length;
  const senateCensusOk = senateDistricts.filter(d => senateCensus[d.label].ok).length;
  const houseElecOk    = houseDistricts.filter(d => houseElection.has(d.electionId)).length;
  const senateElecOk   = senateDistricts.filter(d => senateElection.has(d.electionId)).length;
  const totalCensusOk  = houseCensusOk + senateCensusOk;
  const totalDistricts = houseDistricts.length + senateDistricts.length;

  console.log("\nComplete.");
  console.log(`  House  — Census: ${houseCensusOk}/134  |  Election: ${houseElecOk}/134`);
  console.log(`  Senate — Census: ${senateCensusOk}/67   |  Election: ${senateElecOk}/67`);
  console.log(`  Total  — Census: ${totalCensusOk}/${totalDistricts}`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
