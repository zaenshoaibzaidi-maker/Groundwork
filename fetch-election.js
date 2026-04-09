#!/usr/bin/env node
// fetch-election.js
// Reads statewide-race-summary.xlsx and extracts Ohio State Representative
// election results for a given district from the "General Assembly" sheet.
//
// Usage:  node fetch-election.js <district_number>
// Example: node fetch-election.js 3
//
// The xlsx file must be in the same directory as this script.
// Requires: npm install xlsx

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

// ── args ──────────────────────────────────────────────────────────────────────
const districtArg = process.argv[2];

if (!districtArg) {
  console.error("Usage: node fetch-election.js <district_number>");
  console.error("Example: node fetch-election.js 3");
  process.exit(1);
}

const districtNum = parseInt(districtArg, 10);
if (isNaN(districtNum) || districtNum < 1 || districtNum > 99) {
  console.error(`Invalid district number: "${districtArg}". Must be 1–99.`);
  process.exit(1);
}

// ── file ──────────────────────────────────────────────────────────────────────
const XLSX_FILE  = path.join(__dirname, "statewide-race-summary.xlsx");
const SHEET_NAME = "General Assembly";

if (!fs.existsSync(XLSX_FILE)) {
  console.error(`File not found: ${XLSX_FILE}`);
  console.error("Place statewide-race-summary.xlsx in the same directory as this script.");
  process.exit(1);
}

// ── load ──────────────────────────────────────────────────────────────────────
const workbook = XLSX.readFile(XLSX_FILE);

if (!workbook.SheetNames.includes(SHEET_NAME)) {
  console.error(`Sheet "${SHEET_NAME}" not found.`);
  console.error("Available sheets:", workbook.SheetNames.join(", "));
  process.exit(1);
}

const ws    = workbook.Sheets[SHEET_NAME];
const range = XLSX.utils.decode_range(ws["!ref"]);

// ── helpers ───────────────────────────────────────────────────────────────────
function cellVal(row, col) {
  const ref  = XLSX.utils.encode_cell({ r: row, c: col });
  const cell = ws[ref];
  return cell !== undefined ? cell.v : null;
}

// Row indices (0-based): Row 1 = 0, Row 2 = 1, Row 3 = 2, Row 4 = 3
const ROW_HEADERS    = 0; // race title:  "State Representative - District XX"
const ROW_CANDIDATES = 1; // names:       "Jane Smith (D)"
const ROW_TOTALS     = 2; // vote counts: 28838
const ROW_PERCENTS   = 3; // decimals:    0.573...

// ── find all State Representative district columns ────────────────────────────
// Each district's header appears in Row 1 at its start column.
// Candidate columns run from that start column up to (but not including)
// the start column of the next district.

const districtStartCol = {}; // districtNumber → column index

for (let c = range.s.c; c <= range.e.c; c++) {
  const v = cellVal(ROW_HEADERS, c);
  if (typeof v !== "string") continue;
  const m = v.match(/State\s+Representative\s*[-–]\s*District\s+(\d+)/i);
  if (m) districtStartCol[parseInt(m[1], 10)] = c;
}

if (Object.keys(districtStartCol).length === 0) {
  console.error('No "State Representative" races found in the sheet header row.');
  process.exit(1);
}

if (!(districtNum in districtStartCol)) {
  console.error(
    `State Representative District ${districtNum} not found in the sheet.`
  );
  console.error(
    "Available districts:",
    Object.keys(districtStartCol).sort((a, b) => a - b).join(", ")
  );
  process.exit(1);
}

// Determine the column range for this district
const sortedByCol = Object.entries(districtStartCol)
  .sort((a, b) => a[1] - b[1]); // sort by col index

const thisIdx  = sortedByCol.findIndex(([d]) => parseInt(d, 10) === districtNum);
const startCol = sortedByCol[thisIdx][1];
const endCol   =
  thisIdx < sortedByCol.length - 1
    ? sortedByCol[thisIdx + 1][1] - 1
    : range.e.c;

// ── read candidates ───────────────────────────────────────────────────────────
// "Jane Smith (D)" or "Bob Jones (WI)*"  or  "Alice Brown (L)"
const PARTY_RE = /\(([^)]+)\)\s*\*?\s*$/;

const candidates = [];

for (let c = startCol; c <= endCol; c++) {
  const raw = cellVal(ROW_CANDIDATES, c);
  if (!raw || typeof raw !== "string") continue;

  const partyMatch = raw.match(PARTY_RE);
  const party      = partyMatch ? partyMatch[1].toUpperCase() : "?";
  const name       = raw.replace(PARTY_RE, "").trim();

  const rawVotes = cellVal(ROW_TOTALS, c);
  const votes    = rawVotes !== null ? Math.round(Number(rawVotes)) : null;

  const rawPct = cellVal(ROW_PERCENTS, c);
  const pct    = rawPct !== null ? parseFloat(rawPct) : null;

  candidates.push({ name, party, votes, pct });
}

if (candidates.length === 0) {
  console.error(`No candidate data found for District ${districtNum}.`);
  process.exit(1);
}

// ── D/R split (two-party only) ────────────────────────────────────────────────
const dVotes = candidates
  .filter((c) => c.party === "D")
  .reduce((s, c) => s + (c.votes || 0), 0);
const rVotes = candidates
  .filter((c) => c.party === "R")
  .reduce((s, c) => s + (c.votes || 0), 0);
const drTotal   = dVotes + rVotes;
const dTwoParty = drTotal > 0 ? (dVotes / drTotal) * 100 : null;
const rTwoParty = drTotal > 0 ? (rVotes / drTotal) * 100 : null;

// ── output ────────────────────────────────────────────────────────────────────
const totalVotes = candidates.reduce((s, c) => s + (c.votes || 0), 0);
const uncontested = candidates.length === 1;

const LINE = "═".repeat(52);
const THIN = "─".repeat(52);

console.log();
console.log(LINE);
console.log(` Ohio State Representative — District ${districtNum}`);
console.log(` November 5, 2024 General Election`);
console.log(LINE);

console.log("\n CANDIDATES\n");

const PAD_NAME  = 28;
const PAD_PARTY =  6;

candidates.forEach((c) => {
  const pctDisplay =
    c.pct !== null
      ? (c.pct * 100).toFixed(1).padStart(5) + "%"
      : "    ?";
  const votesDisplay =
    c.votes !== null ? c.votes.toLocaleString("en-US").padStart(8) : "       ?";
  const isWinner =
    !uncontested && c.votes === Math.max(...candidates.map((x) => x.votes || 0));

  console.log(
    `  ${c.name.padEnd(PAD_NAME)} (${c.party.padEnd(PAD_PARTY - 2)})` +
      `  ${pctDisplay}  ${votesDisplay} votes${isWinner ? "  ✓" : ""}`
  );
});

console.log();
console.log(THIN);
console.log(
  ` Total votes cast: ${totalVotes.toLocaleString("en-US")}`
);

if (uncontested) {
  console.log(` Uncontested — single candidate ran.`);
} else if (drTotal > 0) {
  console.log(
    ` D/R two-party split:  D ${dTwoParty.toFixed(1)}%  /  R ${rTwoParty.toFixed(1)}%`
  );
  if (candidates.some((c) => c.party !== "D" && c.party !== "R")) {
    const other = totalVotes - drTotal;
    const otherPct = ((other / totalVotes) * 100).toFixed(1);
    console.log(
      ` Other / third-party:  ${other.toLocaleString("en-US")} votes (${otherPct}% of total)`
    );
  }
}

console.log(LINE);
console.log();
