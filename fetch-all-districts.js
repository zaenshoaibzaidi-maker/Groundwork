#!/usr/bin/env node
// fetch-all-districts.js
// Fetches ACS 5-year Census data + 2024 election results for all 99 Ohio
// State House districts and saves them to all-districts-data.json.
//
// Usage:  node fetch-all-districts.js
// Optional: set CENSUS_API_KEY env var to avoid Census API rate limits.
// Requires: npm install xlsx  (same dep as fetch-election.js)
// Requires: Node 18+ (native fetch)
//
// The file statewide-race-summary.xlsx must be in the same directory.
// Output: all-districts-data.json (created/overwritten in the same directory)

const path = require("path");
const fs   = require("fs");

// ── dependency check ──────────────────────────────────────────────────────────
let XLSX;
try {
  XLSX = require("xlsx");
} catch {
  console.error("Missing dependency. Run:  npm install xlsx");
  process.exit(1);
}

// ══════════════════════════════════════════════════════════════════════════════
//  CENSUS LOGIC  (mirrors fetch-district.js, adapted to return data not print)
// ══════════════════════════════════════════════════════════════════════════════

const API_KEY    = process.env.CENSUS_API_KEY ? `&key=${process.env.CENSUS_API_KEY}` : "";
const CENSUS_BASE = "https://api.census.gov/data/2023/acs/acs5";

// Same variable list as fetch-district.js
const CENSUS_VARS = [
  "B19013_001E", // Median household income
  "B01002_001E", // Median age
  "B02001_001E", // Total population (race universe)
  "B02001_002E", // White alone
  "B02001_003E", // Black or African American alone
  "B02001_005E", // Asian alone
  "B03001_001E", // Total population (Hispanic/Latino universe)
  "B03001_003E", // Hispanic or Latino
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

async function fetchCensusData(districtNum) {
  const pad = String(districtNum).padStart(3, "0");
  const url =
    `${CENSUS_BASE}?get=NAME,${CENSUS_VARS}` +
    `&for=state+legislative+district+(lower+chamber):${pad}` +
    `&in=state:39${API_KEY}`;

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

  const censusName     = row[headers.indexOf("NAME")];
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
    collegePct: pctOf(collegeGrad, edu25plus),
    renterRatePct: pctOf(renterOccupied, totalUnits),
    race: {
      whitePct:    pctOf(white, totalPop),
      blackPct:    pctOf(black, totalPop),
      asianPct:    pctOf(asian, totalPop),
      hispanicPct: pctOf(hispanic, hispanicTotal),
    },
  };
}

// ══════════════════════════════════════════════════════════════════════════════
//  ELECTION LOGIC  (mirrors fetch-election.js, parses all 99 districts at once)
// ══════════════════════════════════════════════════════════════════════════════

function loadAllElectionData() {
  const XLSX_FILE  = path.join(__dirname, "statewide-race-summary.xlsx");
  const SHEET_NAME = "General Assembly";

  if (!fs.existsSync(XLSX_FILE)) {
    throw new Error(
      `statewide-race-summary.xlsx not found in ${__dirname}.\n` +
      "Copy it into the project directory before running this script."
    );
  }

  const workbook = XLSX.readFile(XLSX_FILE);
  if (!workbook.SheetNames.includes(SHEET_NAME)) {
    throw new Error(
      `Sheet "${SHEET_NAME}" not found. Available: ${workbook.SheetNames.join(", ")}`
    );
  }

  const ws    = workbook.Sheets[SHEET_NAME];
  const range = XLSX.utils.decode_range(ws["!ref"]);

  // Same row structure as fetch-election.js
  const ROW_HEADERS    = 0; // "State Representative - District XX"
  const ROW_CANDIDATES = 1; // "Jane Smith (D)"
  const ROW_TOTALS     = 2; // statewide vote totals
  const ROW_PERCENTS   = 3; // decimal percentages
  const PARTY_RE       = /\(([^)]+)\)\s*\*?\s*$/;

  function cellVal(row, col) {
    const ref  = XLSX.utils.encode_cell({ r: row, c: col });
    const cell = ws[ref];
    return cell !== undefined ? cell.v : null;
  }

  // Build district-number → start-column map from row 1 headers
  const districtStartCol = {};
  for (let c = range.s.c; c <= range.e.c; c++) {
    const v = cellVal(ROW_HEADERS, c);
    if (typeof v !== "string") continue;
    const m = v.match(/State\s+Representative\s*[-–]\s*District\s+(\d+)/i);
    if (m) districtStartCol[parseInt(m[1], 10)] = c;
  }

  // Sort by column index so we can determine each district's column range
  const sortedByCol = Object.entries(districtStartCol)
    .sort((a, b) => a[1] - b[1]);

  const result = {}; // districtNum → election object

  for (let i = 0; i < sortedByCol.length; i++) {
    const dNum     = parseInt(sortedByCol[i][0], 10);
    const startCol = sortedByCol[i][1];
    const endCol   =
      i < sortedByCol.length - 1 ? sortedByCol[i + 1][1] - 1 : range.e.c;

    const candidates = [];
    for (let c = startCol; c <= endCol; c++) {
      const raw = cellVal(ROW_CANDIDATES, c);
      if (!raw || typeof raw !== "string") continue;

      const partyMatch = raw.match(PARTY_RE);
      const party      = partyMatch ? partyMatch[1].toUpperCase() : "?";
      const name       = raw.replace(PARTY_RE, "").trim();

      const rawVotes = cellVal(ROW_TOTALS, c);
      const votes    = rawVotes !== null ? Math.round(Number(rawVotes)) : null;

      const rawPct   = cellVal(ROW_PERCENTS, c);
      // Store as percentage (0–100), not raw decimal
      const pct      = rawPct !== null ? parseFloat((parseFloat(rawPct) * 100).toFixed(2)) : null;

      candidates.push({ name, party, votes, pct });
    }

    const dVotes   = candidates.filter(c => c.party === "D").reduce((s, c) => s + (c.votes || 0), 0);
    const rVotes   = candidates.filter(c => c.party === "R").reduce((s, c) => s + (c.votes || 0), 0);
    const drTotal  = dVotes + rVotes;
    const allVotes = candidates.reduce((s, c) => s + (c.votes || 0), 0);

    result[dNum] = {
      source: "Ohio Secretary of State, November 2024 General Election",
      uncontested: candidates.length === 1,
      totalVotes: allVotes,
      candidates,
      demTwoPartyPct: drTotal > 0 ? parseFloat(((dVotes / drTotal) * 100).toFixed(2)) : null,
      repTwoPartyPct: drTotal > 0 ? parseFloat(((rVotes / drTotal) * 100).toFixed(2)) : null,
    };
  }

  return result;
}

// ══════════════════════════════════════════════════════════════════════════════
//  CONCURRENCY HELPER
// ══════════════════════════════════════════════════════════════════════════════

// Runs an array of async task functions with at most `limit` running at once.
async function runConcurrent(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }

  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  const OUTPUT_FILE = path.join(__dirname, "all-districts-data.json");

  // ── Step 1: Load election data from Excel (synchronous, one read for all 99) ─
  console.log("Loading election data from statewide-race-summary.xlsx...");
  let electionData;
  try {
    electionData = loadAllElectionData();
    console.log(`  Parsed ${Object.keys(electionData).length} districts from spreadsheet.\n`);
  } catch (err) {
    console.error("Failed to load election data:", err.message);
    process.exit(1);
  }

  // ── Step 2: Fetch Census data for districts 1–99 ──────────────────────────
  console.log("Fetching Census ACS 5-Year data for districts 1–99...");
  console.log("  (5 concurrent requests — estimated ~30–60 seconds)\n");

  const districtNums = Array.from({ length: 99 }, (_, i) => i + 1);
  const censusResults = {};

  const tasks = districtNums.map(n => async () => {
    try {
      const data = await fetchCensusData(n);
      censusResults[n] = { ok: true, data };
      process.stdout.write(`  [${String(n).padStart(2)}] ✓ Census OK\n`);
    } catch (err) {
      censusResults[n] = { ok: false, error: err.message };
      process.stdout.write(`  [${String(n).padStart(2)}] ✗ Census FAILED: ${err.message}\n`);
    }
  });

  await runConcurrent(tasks, 5);

  // ── Step 3: Combine and write ─────────────────────────────────────────────
  console.log("\nCombining and writing output...");

  const output = districtNums.map(n => ({
    districtNumber: n,
    districtName:   `Ohio House District ${n}`,
    census: censusResults[n].ok
      ? censusResults[n].data
      : { error: censusResults[n].error },
    election2024: electionData[n] || { error: "District not found in spreadsheet" },
    incumbent:      "TBD",
    incumbentParty: "TBD",
    nextElection:   "TBD",
    seatStatus:     "TBD",
    strategyMemo:   "TBD",
  }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  const censusOk = districtNums.filter(n => censusResults[n].ok).length;
  const electionOk = districtNums.filter(n => !!electionData[n]).length;

  console.log(`\nComplete.`);
  console.log(`  Census data:   ${censusOk}/99 districts`);
  console.log(`  Election data: ${electionOk}/99 districts`);
  console.log(`  Output:        ${OUTPUT_FILE}\n`);
}

main().catch(err => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
