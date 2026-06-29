#!/usr/bin/env node
// ak-fetch-all.js
// Fetches ACS 5-year Census data for all 40 Alaska House districts and all
// 20 Alaska Senate districts (lettered A–T), merges with pre-extracted
// election data from ak-elections-data.json, and saves to
// ak-all-districts-data.json.
//
// Usage:  node ak-fetch-all.js   (reads CENSUS_API_KEY from .env)
// Requires: Node 18+ (native fetch)
// Output:   ak-all-districts-data.json (created/overwritten in the same directory)

require("dotenv").config();

const path = require("path");
const fs   = require("fs");

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const STATE_FIPS   = "02"; // Alaska
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

// Alaska Senate districts are lettered A–T, and the Census API encodes them
// as "00<letter>" rather than a zero-padded number (e.g. district D is
// "00D", not "004"). House districts use the usual 3-digit numeric code.
async function fetchCensusData(districtCode, chamber) {
  const url =
    `${CENSUS_BASE}?get=NAME,${CENSUS_VARS}` +
    `&for=state+legislative+district+(${chamber}+chamber):${districtCode}` +
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

async function fetchWithDelay(districtCode, chamber, label, delayMs) {
  await delay(delayMs);
  try {
    const data = await fetchCensusData(districtCode, chamber);
    process.stdout.write(`  [${label}] ✓\n`);
    return { ok: true, data };
  } catch (err) {
    process.stdout.write(`  [${label}] ✗ ${err.message}\n`);
    return { ok: false, error: err.message };
  }
}

async function main() {
  const ELECTION_FILE = path.join(__dirname, "ak-elections-data.json");
  const OUTPUT_FILE   = path.join(__dirname, "ak-all-districts-data.json");

  console.log("Loading election data from ak-elections-data.json...");
  if (!fs.existsSync(ELECTION_FILE)) {
    console.error(`ak-elections-data.json not found in ${__dirname}.`);
    process.exit(1);
  }

  // ak-elections-data.json stores districts as a flat array of records keyed
  // by districtId ("ak-hd-1".."ak-hd-40", "ak-sd-A".."ak-sd-T"); re-key by
  // the bare district number/letter for lookup below.
  const electionList = JSON.parse(fs.readFileSync(ELECTION_FILE, "utf8"));
  const houseElection  = {};
  const senateElection = {};
  for (const d of electionList) {
    const houseMatch  = d.districtId.match(/^ak-hd-(\d+)$/);
    const senateMatch = d.districtId.match(/^ak-sd-([A-T])$/);
    if (houseMatch)  houseElection[houseMatch[1]]   = d;
    if (senateMatch) senateElection[senateMatch[1]] = d;
  }
  console.log(
    `  House election districts: ${Object.keys(houseElection).length}`,
    `| Senate election districts: ${Object.keys(senateElection).length}\n`
  );

  console.log("Fetching Census data for House districts 1–40 (lower chamber)...");
  console.log("  200ms delay between each request — est. ~10 seconds\n");

  const houseNums   = Array.from({ length: 40 }, (_, i) => i + 1);
  const houseCensus = {};
  for (const n of houseNums) {
    const label = `HD-${String(n).padStart(2, "0")}`;
    houseCensus[n] = await fetchWithDelay(String(n).padStart(3, "0"), "lower", label, 200);
  }

  console.log("\nFetching Census data for Senate districts A–T (upper chamber)...");
  console.log("  200ms delay between each request — est. ~5 seconds\n");

  const senateLetters = "ABCDEFGHIJKLMNOPQRST".split("");
  const senateCensus  = {};
  for (const letter of senateLetters) {
    const label = `SD-${letter}`;
    senateCensus[letter] = await fetchWithDelay(`00${letter}`, "upper", label, 200);
  }

  console.log("\nCombining and writing output...");

  const house = {};
  for (const n of houseNums) {
    house[String(n)] = {
      districtNumber: n,
      districtName:   `Alaska House District ${n}`,
      census: houseCensus[n].ok ? houseCensus[n].data : { error: houseCensus[n].error },
      election: houseElection[String(n)] || { error: "District not found in ak-elections-data.json" },
    };
  }

  const senate = {};
  for (const letter of senateLetters) {
    senate[letter] = {
      districtLetter: letter,
      districtName:   `Alaska Senate District ${letter}`,
      census: senateCensus[letter].ok ? senateCensus[letter].data : { error: senateCensus[letter].error },
      election: senateElection[letter] || { error: "District not found in ak-elections-data.json" },
    };
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ house, senate }, null, 2));

  const houseCensusOk  = houseNums.filter(n => houseCensus[n].ok).length;
  const senateCensusOk = senateLetters.filter(l => senateCensus[l].ok).length;
  const houseElecOk    = houseNums.filter(n => !!houseElection[String(n)]).length;
  const senateElecOk   = senateLetters.filter(l => !!senateElection[l]).length;

  console.log("\nComplete.");
  console.log(`  House  — Census: ${houseCensusOk}/40  |  Election: ${houseElecOk}/40`);
  console.log(`  Senate — Census: ${senateCensusOk}/20  |  Election: ${senateElecOk}/20`);
  console.log(`  Total: ${houseCensusOk + senateCensusOk}/60`);
  console.log(`  Output: ${OUTPUT_FILE}\n`);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
