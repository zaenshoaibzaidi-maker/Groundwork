'use strict';

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Lines to skip (PDF page headers repeated on every page)
const SKIP_EXACT = new Set([
  'OFFICE NAME', 'CANVASS', 'VOTES', 'PERCENT', 'VOTER',
  'REGISTRATION', 'COUNT', 'TURNOUT',
  'Texas Secretary of State', 'Official Canvass Report',
]);
const SKIP_RE = [
  /^Page \d+ of \d+$/,
  /^\d{2}\/\d{2}\/\d{4} \d{1,2}:\d{2} [AP]M$/,
  /^\d{4} \w+ \d+(ST|ND|RD|TH) GENERAL ELECTION$/i,
  /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{2}, \d{4}$/,
];

function isBoilerplate(line) {
  const l = line.trim();
  if (!l) return true;
  if (SKIP_EXACT.has(l)) return true;
  for (const re of SKIP_RE) if (re.test(l)) return true;
  return false;
}

// After "DISTRICT ", the district number runs directly into the voter
// registration count (e.g. "10018,623,931"). The voter reg is always a
// millions-formatted number whose first comma comes after 1–2 digits
// (e.g. "18," or "17,"). Using a lazy match + lookahead isolates the number.
const HOUSE_HDR_RE  = /^STATE REPRESENTATIVE DISTRICT (\d+?)(?=\d{1,2},)/;
const SENATE_HDR_RE = /^STATE SENATOR,? DISTRICT (\d+?)(?=\d{1,2},)/;

// Candidate line format (no space between name, party, votes, pct):
//   GARY VANDEAVER (I)REP66,843100 %
//   BRENT A. MONEYREP71,22280.56 %
//   NANCY A. NICHOLSWRI9101.21 %
//   BRYAN HUGHES (I)REP00 %         ← zero-vote (off-cycle) districts
//
// Greedy (.+) finds the RIGHTMOST valid party abbreviation, which avoids
// false matches when a party abbreviation appears inside a candidate name.
const CANDIDATE_RE =
  /^(.+)(REP|DEM|LIB|GRE|IND|WRI)(\d{1,3}(?:,\d{3})*)([\d.]+) %$/;

function parseDistricts(text, hdrRe) {
  const results = {};
  let current = null;
  let candidates = [];

  function save() {
    if (current === null || candidates.length === 0) return;
    candidates.sort((a, b) => b.votes - a.votes);
    const winner = candidates[0];
    // Unopposed = no opponent other than write-ins
    const nonWriOpponents = candidates.slice(1).filter(c => c.party !== 'WRI');
    results[current] = {
      winner: winner.name,
      party:  winner.party,
      pct:    winner.pct,
      votes:  winner.votes,           // kept internally for merge logic; stripped before output
      unopposed: nonWriOpponents.length === 0,
    };
  }

  for (const rawLine of text.split('\n')) {
    if (isBoilerplate(rawLine)) continue;
    const line = rawLine.trim();
    if (!line) continue;

    const distMatch = line.match(hdrRe);
    if (distMatch) {
      save();
      current = distMatch[1];
      candidates = [];
      continue;
    }

    if (line.includes('Total Votes') || current === null) continue;

    const m = line.match(CANDIDATE_RE);
    if (m) {
      const name  = m[1].replace(/\s*\(I\)\s*$/, '').trim();
      const party = m[2];
      const votes = parseInt(m[3].replace(/,/g, ''), 10);
      const pct   = parseFloat(m[4]);
      candidates.push({ name, party, votes, pct });
    }
  }
  save();
  return results;
}

function sortedByNumber(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  );
}

async function main() {
  const buf2024 = fs.readFileSync(path.join(__dirname, 'TX Election Results 2024.pdf'));
  const buf2022 = fs.readFileSync(path.join(__dirname, 'TX Election Results 2022.pdf'));

  console.log('Parsing PDFs...');
  const [pdf2024, pdf2022] = await Promise.all([pdfParse(buf2024), pdfParse(buf2022)]);

  // House: 2024 only (all 150 seats are up every two years)
  const houseRaw = parseDistricts(pdf2024.text, HOUSE_HDR_RE);

  // Senate: prefer 2024 where votes > 0, fall back to 2022
  const senate2024 = parseDistricts(pdf2024.text, SENATE_HDR_RE);
  const senate2022 = parseDistricts(pdf2022.text, SENATE_HDR_RE);

  const senateRaw = {};
  const allSDs = new Set([...Object.keys(senate2024), ...Object.keys(senate2022)]);
  for (const d of allSDs) {
    const r24 = senate2024[d];
    const r22 = senate2022[d];
    if (r24 && r24.votes > 0) {
      senateRaw[d] = { ...r24, source: '2024' };
    } else if (r22 && r22.votes > 0) {
      senateRaw[d] = { ...r22, source: '2022' };
    }
  }

  // Strip internal-only fields before writing output
  function clean(raw) {
    const out = {};
    for (const [k, v] of Object.entries(raw)) {
      out[k] = { winner: v.winner, party: v.party, pct: v.pct, unopposed: v.unopposed };
    }
    return out;
  }

  const output = {
    house:  sortedByNumber(clean(houseRaw)),
    senate: sortedByNumber(clean(senateRaw)),
  };

  const outPath = path.join(__dirname, 'tx-elections-data.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log(`House districts parsed:  ${Object.keys(output.house).length}`);
  console.log(`Senate districts parsed: ${Object.keys(output.senate).length}`);

  // Show which senate districts came from 2022
  const from2022 = Object.entries(senateRaw)
    .filter(([, v]) => v.source === '2022')
    .map(([k]) => k)
    .sort((a, b) => parseInt(a) - parseInt(b));
  if (from2022.length) console.log('Senate districts from 2022:', from2022.join(', '));

  console.log('Output written to tx-elections-data.json');
}

main().catch(err => { console.error(err); process.exit(1); });
