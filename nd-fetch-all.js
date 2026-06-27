#!/usr/bin/env node
// nd-fetch-all.js
// Fetches ACS 5-year Census data for all 47 North Dakota Senate districts and
// 48 North Dakota House districts (46 standard + the 4A/4B subdistricts that
// replace dual-member District 4 — each lettered subdistrict is its own
// Census geography with distinct data, queried directly), merges with
// pre-extracted election data from nd-elections-data.json, and saves to
// nd-all-districts-data.json.
//
// Usage:  node nd-fetch-all.js   (reads CENSUS_API_KEY from .env)
// Requires: Node 18+ (native fetch)
// Output:   nd-all-districts-data.json (created/overwritten in the same directory)

require("dotenv").config();

const path = require("path");
const fs   = require("fs");

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const STATE_FIPS   = "38"; // North Dakota
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

// Plain district numbers are zero-padded to the Census Bureau's 3-digit
// geography code ("9" -> "009"); the District 4 subdistrict codes are
// already exact Census geography codes ("4a" -> "04A") and must use a
// 2-digit-plus-letter pad instead, mirroring SD's 26A/26B handling.
function censusCode(key) {
  const m = String(key).match(/^(\d+)([a-zA-Z]?)$/);
  return m[2] ? m[1].padStart(2, "0") + m[2].toUpperCase() : m[1].padStart(3, "0");
}

async function fetchCensusData(districtKey, chamber) {
  const code = censusCode(districtKey);
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

async function fetchWithDelay(districtKey, chamber, label, delayMs) {
  await delay(delayMs);
  try {
    const data = await fetchCensusData(districtKey, chamber);
    process.stdout.write(`  [${label}] ✓\n`);
    return { ok: true, data };
  } catch (err) {
    process.stdout.write(`  [${label}] ✗ ${err.message}\n`);
    return { ok: false, error: err.message };
  }
}

function main() {
  const ELECTION_FILE = path.join(__dirname, "nd-elections-data.json");
  const OUTPUT_FILE   = path.join(__dirname, "nd-all-districts-data.json");

  console.log("Loading election data from nd-elections-data.json...");
  if (!fs.existsSync(ELECTION_FILE)) {
    console.error(`nd-elections-data.json not found in ${__dirname}.`);
    process.exit(1);
  }
  const electionData = JSON.parse(fs.readFileSync(ELECTION_FILE, "utf8"));

  // nd-elections-data.json stores districts as arrays keyed by districtId
  // ("nd-sd-N" / "nd-hd-N" / "nd-hd-4a"); re-key by the bare district
  // number/subdistrict suffix to match the lookup scheme used below.
  const senateElection = {};
  for (const d of electionData.senate || []) {
    senateElection[d.districtId.replace("nd-sd-", "")] = d;
  }
  const houseElection = {};
  for (const d of electionData.house || []) {
    houseElection[d.districtId.replace("nd-hd-", "")] = d;
  }
  console.log(
    `  House election districts: ${Object.keys(houseElection).length}`,
    `| Senate election districts: ${Object.keys(senateElection).length}\n`
  );

  return run(senateElection, houseElection, OUTPUT_FILE);
}

async function run(senateElection, houseElection, OUTPUT_FILE) {
  console.log("Fetching Census data for Senate districts 1–47 (upper chamber)...");
  console.log("  200ms delay between each request — est. ~10 seconds\n");

  const senateNums   = Array.from({ length: 47 }, (_, i) => i + 1);
  const senateCensus = {};
  for (const n of senateNums) {
    const label = `SD-${String(n).padStart(2, "0")}`;
    senateCensus[n] = await fetchWithDelay(n, "upper", label, 200);
  }

  // House District 4 is a dual-member district split into single-member
  // subdistricts (4A/4B) for the legislative election. The Census Bureau
  // publishes no geography under the bare parent number (004 returns
  // HTTP 204) — only under the lettered subdistrict codes, each with its
  // own distinct population data — so each of the 48 House keys is fetched
  // individually.
  console.log("\nFetching Census data for 48 House districts (lower chamber)...");
  console.log("  200ms delay between each request — est. ~10 seconds\n");

  const houseKeys = [
    ...Array.from({ length: 47 }, (_, i) => String(i + 1)).filter((n) => n !== "4"),
    "4a", "4b",
  ];
  const houseCensus = {};
  for (const k of houseKeys) {
    houseCensus[k] = await fetchWithDelay(k, "lower", `HD-${k.toUpperCase()}`, 200);
  }

  console.log("\nCombining and writing output...");

  const senate = {};
  for (const n of senateNums) {
    senate[String(n)] = {
      districtNumber: n,
      districtName:   `North Dakota Senate District ${n}`,
      census: senateCensus[n].ok ? senateCensus[n].data : { error: senateCensus[n].error },
      election: senateElection[String(n)] || { error: "District not found in nd-elections-data.json" },
    };
  }

  const house = {};
  for (const key of houseKeys) {
    const censusResult = houseCensus[key];
    house[key] = {
      districtNumber: /^\d+$/.test(key) ? parseInt(key, 10) : key,
      districtName:   `North Dakota House District ${key.toUpperCase()}`,
      census: censusResult.ok ? censusResult.data : { error: censusResult.error },
      election: houseElection[key] || { error: "District not found in nd-elections-data.json" },
    };
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ house, senate }, null, 2));

  const senateCensusOk = senateNums.filter(n => senateCensus[n].ok).length;
  const houseCensusOk  = houseKeys.filter(k => houseCensus[k].ok).length;
  const senateElecOk   = senateNums.filter(n => !!senateElection[String(n)]).length;
  const houseElecOk    = houseKeys.filter(k => !!houseElection[k]).length;

  console.log("\nComplete.");
  console.log(`  Senate — Census: ${senateCensusOk}/47  |  Election: ${senateElecOk}/47`);
  console.log(`  House  — Census: ${houseCensusOk}/${houseKeys.length}  |  Election: ${houseElecOk}/${houseKeys.length}`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
