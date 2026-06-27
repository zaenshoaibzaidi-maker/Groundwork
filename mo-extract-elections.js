'use strict';

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Lines have format: <candidate_name><party><votes><pct>%, all concatenated
// with no separating whitespace, e.g. "Doug BeckDemocratic53,26356.1%".
// Party is matched against a fixed list since there's no delimiter.
const PARTIES = [
  'Republican', 'Democratic', 'Libertarian', 'Green', 'Constitution',
  'Better', 'Independent', 'Write-in', 'Unity', 'Reform', 'Nonpartisan',
];
// Votes use comma-grouped formatting (\d{1,3}(,\d{3})*); anchoring on that
// (rather than a bare [\d,]+) lets backtracking correctly split votes from
// the immediately-following percentage, e.g. "63,076100.0%" -> 63,076 / 100.0%
// and "190.0%" -> 19 / 0.0%, instead of greedily eating digits into votes.
const CANDIDATE_RE = new RegExp(
  `^(.*?)(${PARTIES.join('|')})(\\d{1,3}(?:,\\d{3})*)(\\d+\\.\\d)%$`
);

function parseCandidateLine(line) {
  const m = line.match(CANDIDATE_RE);
  if (!m) return null;

  const name = m[1].trim();
  const party = m[2];
  const votes = parseInt(m[3].replace(/,/g, ''), 10);
  if (!name) return null;

  return { name, party, votes };
}

// Each office block is self-contained: header, optional "(N of N Precincts
// Reported)" line, candidate lines, then a "Total Votes<n>" line that closes
// the block. Closing on Total Votes (rather than waiting for the next
// district header) keeps unrelated downstream races (e.g. Circuit Judge)
// from bleeding into the last tracked district.
function parseDistricts(text, districtRegex) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const districts = {};
  let currentDistrict = null;

  for (const line of lines) {
    const dm = line.match(districtRegex);
    if (dm) {
      currentDistrict = String(parseInt(dm[1], 10));
      if (!districts[currentDistrict]) {
        districts[currentDistrict] = { candidates: [], totalVotes: 0 };
      }
      continue;
    }

    if (!currentDistrict) continue;

    const tv = line.match(/^Total Votes([\d,]+)$/);
    if (tv) {
      districts[currentDistrict].totalVotes = parseInt(tv[1].replace(/,/g, ''), 10);
      currentDistrict = null;
      continue;
    }

    const cand = parseCandidateLine(line);
    if (cand) districts[currentDistrict].candidates.push(cand);
  }

  return districts;
}

function normalizeWinnerParty(party) {
  if (party === 'Republican') return 'Republican';
  if (party === 'Democratic') return 'Democratic';
  return 'Independent';
}

function buildOutput(rawDist, distNum, chamber, year) {
  const { candidates, totalVotes } = rawDist;
  if (!candidates.length) return null;

  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const winner = sorted[0];
  const total = totalVotes || candidates.reduce((s, c) => s + c.votes, 0);
  const winnerPct = total > 0 ? Math.round((winner.votes / total) * 1000) / 10 : 0;

  return {
    district: parseInt(distNum, 10),
    chamber,
    year,
    candidates: sorted.map(c => ({ name: c.name, party: c.party, votes: c.votes })),
    winner: winner.name,
    winner_party: normalizeWinnerParty(winner.party),
    winner_votes: winner.votes,
    total_votes: total,
    winner_pct: winnerPct,
  };
}

function sortedByNumber(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  );
}

async function main() {
  const d = __dirname;

  console.log('Parsing MO 2024 PDF...');
  const buf24 = fs.readFileSync(path.join(d, 'MO 2024 General Election Results.pdf'));
  const text24 = (await pdfParse(buf24)).text;

  console.log('Parsing MO 2022 PDF...');
  const buf22 = fs.readFileSync(path.join(d, 'MO 2022 General Election Results.pdf'));
  const text22 = (await pdfParse(buf22)).text;

  const SENATE_RE = /^State Senator - District (\d+)/;
  const HOUSE_RE = /^State Representative - District (\d+)/;

  const senate24 = parseDistricts(text24, SENATE_RE); // odd districts
  const senate22 = parseDistricts(text22, SENATE_RE); // even districts
  const house24 = parseDistricts(text24, HOUSE_RE);   // all 163 districts

  // Build senate: odd → 2024, even → 2022
  const senate = {};
  for (let i = 1; i <= 34; i++) {
    const k = String(i);
    const isOdd = i % 2 === 1;
    const src = isOdd ? senate24 : senate22;
    const year = isOdd ? 2024 : 2022;
    if (!src[k] || !src[k].candidates.length) {
      console.warn(`WARNING: Senate District ${i} missing from ${year} data`);
      continue;
    }
    const out = buildOutput(src[k], k, 'senate', year);
    if (out) senate[k] = out;
  }

  // Build house: all from 2024
  const house = {};
  for (let i = 1; i <= 163; i++) {
    const k = String(i);
    if (!house24[k] || !house24[k].candidates.length) {
      console.warn(`WARNING: House District ${i} missing from 2024 data`);
      continue;
    }
    const out = buildOutput(house24[k], k, 'house', 2024);
    if (out) house[k] = out;
  }

  const hCount = Object.keys(house).length;
  const sCount = Object.keys(senate).length;
  console.log(`House districts:  ${hCount}`);
  console.log(`Senate districts: ${sCount}`);

  if (hCount !== 163) console.error(`ERROR: Expected 163 house districts, got ${hCount}`);
  if (sCount !== 34) console.error(`ERROR: Expected 34 senate districts, got ${sCount}`);

  const output = { house: sortedByNumber(house), senate: sortedByNumber(senate) };

  fs.writeFileSync(
    path.join(d, 'mo-elections-data.json'),
    JSON.stringify(output, null, 2)
  );

  console.log('Written to mo-elections-data.json');

  // Spot-check a few districts
  console.log('\nSpot checks:');
  console.log('Senate 1 (2024, odd):', JSON.stringify(senate['1']?.winner), senate['1']?.winner_party);
  console.log('Senate 2 (2022, even):', JSON.stringify(senate['2']?.winner), senate['2']?.winner_party);
  console.log('House 1 (2024):', JSON.stringify(house['1']?.winner), house['1']?.winner_party);
  console.log('House 163 (2024):', JSON.stringify(house['163']?.winner), house['163']?.winner_party);
}

main().catch(console.error);
