#!/usr/bin/env node
// fetch-senate-all.js
// Pulls ACS 5-year demographic data for all 33 Ohio State Senate districts
// and merges with pre-extracted election data.
//
// Usage: node fetch-senate-all.js
// Output: all-senate-districts-data.json

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.CENSUS_API_KEY
  ? `&key=${process.env.CENSUS_API_KEY}`
  : "";

const BASE = "https://api.census.gov/data/2023/acs/acs5";

const VARS = [
  "B19013_001E",
  "B01002_001E",
  "B02001_001E",
  "B02001_002E",
  "B02001_003E",
  "B02001_005E",
  "B03001_001E",
  "B03001_003E",
  "B15003_001E",
  "B15003_022E",
  "B15003_023E",
  "B15003_024E",
  "B15003_025E",
  "B25003_001E",
  "B25003_003E",
].join(",");

const MISSING = -666666666;
function val(raw) {
  const n = parseFloat(raw);
  return isNaN(n) || n === MISSING || n < 0 ? null : n;
}
function pct(num, den) {
  if (num === null || den === null || den === 0) return null;
  return parseFloat((num / den * 100).toFixed(1));
}

async function fetchSenateDistrict(districtNum) {
  const district = String(districtNum).padStart(3, "0");
  const url =
    `${BASE}?get=NAME,${VARS}` +
    `&for=state+legislative+district+(upper+chamber):${district}` +
    `&in=state:39${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Census API error ${res.status} for SD-${districtNum}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length < 2) throw new Error(`No data for SD-${districtNum}`);

  const headers = data[0];
  const row = data[1];
  const get = (key) => val(row[headers.indexOf(key)]);

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
  const collegeGrad = (bachelors !== null && masters !== null && professional !== null && doctorate !== null)
    ? bachelors + masters + professional + doctorate : null;

  return {
    district: districtNum,
    name: `Ohio Senate District ${districtNum}`,
    census: {
      medianIncome: get("B19013_001E"),
      medianAge: get("B01002_001E"),
      totalPopulation: totalPop,
      collegePct: pct(collegeGrad, edu25plus),
      renterPct: pct(renterOccupied, totalUnits),
      whitePct: pct(white, totalPop),
      blackPct: pct(black, totalPop),
      asianPct: pct(asian, totalPop),
      hispanicPct: pct(hispanic, hispanicTotal),
    }
  };
}

async function main() {
  // Load election data
  const electionData = JSON.parse(readFileSync(join(__dirname, 'senate_elections_all.json'), 'utf8'));

  const results = {};
  for (let i = 1; i <= 33; i++) {
    process.stdout.write(`Fetching SD-${i}... `);
    try {
      const demo = await fetchSenateDistrict(i);
      const election = electionData[String(i)] || null;
      results[i] = { ...demo, election };
      console.log('✓');
    } catch (err) {
      console.log(`✗ ${err.message}`);
      results[i] = { district: i, error: err.message };
    }
    // small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  writeFileSync(
    join(__dirname, 'all-senate-districts-data.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('\nDone! Saved to all-senate-districts-data.json');
}

main().catch(console.error);
