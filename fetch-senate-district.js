#!/usr/bin/env node
// fetch-district.js
// Pulls ACS 5-year demographic data for any Ohio State House district.
//
// Usage:  node fetch-district.js <district_number>
// Example: node fetch-district.js 8
//
// Optional: set CENSUS_API_KEY env var to avoid rate limits.
// Requires Node 18+ (native fetch).

const districtArg = process.argv[2];

if (!districtArg) {
  console.error("Usage: node fetch-district.js <district_number>");
  console.error("Example: node fetch-district.js 8");
  process.exit(1);
}

const districtNum = parseInt(districtArg, 10);
if (isNaN(districtNum) || districtNum < 1 || districtNum > 33) {
  console.error(`Invalid district number: "${districtArg}". Must be 1–99.`);
  process.exit(1);
}

// Census zero-pads state legislative district codes to 3 digits.
const district = String(districtNum).padStart(3, "0");

const API_KEY = process.env.CENSUS_API_KEY
  ? `&key=${process.env.CENSUS_API_KEY}`
  : "";

// ACS 5-year 2023 (covering 2019–2023), the most recent available release.
const BASE = "https://api.census.gov/data/2023/acs/acs5";

// Variable codes — see: https://api.census.gov/data/2023/acs/acs5/variables.html
const VARS = [
  "B19013_001E", // Median household income (past 12 months, inflation-adjusted)
  "B01002_001E", // Median age
  "B02001_001E", // Total population (race universe)
  "B02001_002E", // White alone
  "B02001_003E", // Black or African American alone
  "B02001_005E", // Asian alone
  "B03001_001E", // Total population (Hispanic/Latino universe)
  "B03001_003E", // Hispanic or Latino
  "B15003_001E", // Population 25+ (educational attainment universe)
  "B15003_022E", // Bachelor's degree
  "B15003_023E", // Master's degree
  "B15003_024E", // Professional school degree
  "B15003_025E", // Doctorate degree
  "B25003_001E", // Total occupied housing units
  "B25003_003E", // Renter-occupied units
].join(",");

// Ohio state FIPS = 39; lower chamber = state house
const url =
  `${BASE}?get=NAME,${VARS}` +
  `&for=state+legislative+district+(upper+chamber):${district}` +
  `&in=state:39${API_KEY}`;

// Census encodes missing/suppressed values as large negatives.
const MISSING = -666666666;
function val(raw) {
  const n = parseFloat(raw);
  return isNaN(n) || n === MISSING || n < 0 ? null : n;
}

function pct(numerator, denominator) {
  if (numerator === null || denominator === null || denominator === 0) return "N/A";
  return (numerator / denominator * 100).toFixed(1) + "%";
}

function fmtIncome(v) {
  if (v === null) return "N/A";
  return "$" + v.toLocaleString("en-US");
}

function pad(label, width = 28) {
  return label.padEnd(width);
}

async function fetchDistrict() {
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    console.error("Network error:", err.message);
    process.exit(1);
  }

  if (!res.ok) {
    const body = await res.text();
    console.error(`Census API error ${res.status}:`, body);
    process.exit(1);
  }

  const data = await res.json();
  if (!Array.isArray(data) || data.length < 2) {
    console.error("No data returned. District may not exist or API year may lack coverage.");
    process.exit(1);
  }

  const headers = data[0];
  const row = data[1];
  const get = (key) => val(row[headers.indexOf(key)]);

  const name           = row[headers.indexOf("NAME")] || `OH House District ${districtNum}`;
  const medianIncome   = get("B19013_001E");
  const medianAge      = get("B01002_001E");
  const totalPop       = get("B02001_001E");
  const white          = get("B02001_002E");
  const black          = get("B02001_003E");
  const asian          = get("B02001_005E");
  const hispanicTotal  = get("B03001_001E");
  const hispanic       = get("B03001_003E");
  const edu25plus      = get("B15003_001E");
  const bachelors      = get("B15003_022E");
  const masters        = get("B15003_023E");
  const professional   = get("B15003_024E");
  const doctorate      = get("B15003_025E");
  const totalUnits     = get("B25003_001E");
  const renterOccupied = get("B25003_003E");

  // College rate = bachelor's or higher among adults 25+
  const collegeGrad =
    bachelors !== null && masters !== null && professional !== null && doctorate !== null
      ? bachelors + masters + professional + doctorate
      : null;

  const LINE = "═".repeat(54);
  const THIN = "─".repeat(54);

  console.log();
  console.log(LINE);
  console.log(` ${name}`);
  console.log(` ACS 5-Year Estimates (2019–2023)`);
  console.log(LINE);

  console.log("\n ECONOMIC");
  console.log(`  ${pad("Median Household Income")} ${fmtIncome(medianIncome)}`);

  console.log("\n AGE");
  console.log(`  ${pad("Median Age")} ${medianAge !== null ? medianAge : "N/A"}`);

  console.log("\n EDUCATION");
  console.log(`  ${pad("Bachelor's or Higher (25+)")} ${pct(collegeGrad, edu25plus)}`);

  console.log("\n HOUSING");
  console.log(`  ${pad("Renter Rate")} ${pct(renterOccupied, totalUnits)}`);

  console.log("\n RACE & ETHNICITY");
  console.log(`  ${pad("White")} ${pct(white, totalPop)}`);
  console.log(`  ${pad("Black / African American")} ${pct(black, totalPop)}`);
  console.log(`  ${pad("Asian")} ${pct(asian, totalPop)}`);
  console.log(`  ${pad("Hispanic / Latino (any race)")} ${pct(hispanic, hispanicTotal)}`);

  console.log();
  console.log(THIN);
  console.log(` Total Population: ${totalPop !== null ? totalPop.toLocaleString("en-US") : "N/A"}`);
  console.log(` Source: U.S. Census Bureau, ACS 5-Year, 2023`);
  console.log(LINE);
  console.log();
}

fetchDistrict();
