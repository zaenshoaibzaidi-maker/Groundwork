'use strict';

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Lines have format: <vote_count><ballot_rank><candidate_name> - <party>
// The vote count is comma-formatted; the ballot rank is a single digit.
// Rank-1 candidates appear on the line BEFORE their district header;
// rank 2+ appear AFTER. We use rank to determine placement.
function parseCandidateLine(line) {
  // Greedy match on comma-formatted vote count; backtracking resolves ambiguity
  // e.g. "962Write-In..." → 96 votes, rank 2 (not 962 + rank W)
  const m = line.match(/^(\d{1,3}(?:,\d{3})*)(\d)(.+)$/);
  if (!m) return null;

  const votes = parseInt(m[1].replace(/,/g, ''), 10);
  const rank = parseInt(m[2], 10);
  const rest = m[3].trim();
  if (!rest) return null;

  let name, party;
  if (rest.startsWith('Write-In - ')) {
    name = rest.slice('Write-In - '.length).trim();
    party = 'Write-In';
  } else if (rest === 'Write-In') {
    name = 'Write-In';
    party = 'Write-In';
  } else {
    const lastDash = rest.lastIndexOf(' - ');
    if (lastDash === -1) return null;
    name = rest.slice(0, lastDash).trim();
    party = rest.slice(lastDash + 3).trim();
  }

  if (!name || !party) return null;
  return { rank, votes, name, party };
}

// otherRegex: when a line matches this regex we know we've crossed into a
// different section, so we stop attributing candidates to currentDistrict.
// This prevents the final district from accumulating candidates from the next section.
function parseDistricts(text, districtRegex, otherRegex = null) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const districts = {};
  let currentDistrict = null;
  let pendingCandidate = null; // rank-1 candidate waiting for its district header
  let awaitingTotal = false;

  for (const line of lines) {
    // If we've crossed into the other section, stop tracking
    if (otherRegex && line.match(otherRegex)) {
      currentDistrict = null;
      pendingCandidate = null;
      awaitingTotal = false;
      continue;
    }

    const dm = line.match(districtRegex);
    if (dm) {
      const distNum = String(parseInt(dm[1], 10));
      currentDistrict = distNum;
      if (!districts[distNum]) {
        districts[distNum] = { candidates: [], totalVotes: 0 };
      }
      if (pendingCandidate) {
        districts[distNum].candidates.push(pendingCandidate);
        pendingCandidate = null;
      }
      awaitingTotal = false;
      continue;
    }

    if (line === 'Total Votes') {
      awaitingTotal = true;
      continue;
    }

    if (awaitingTotal) {
      const total = parseInt(line.replace(/,/g, ''), 10);
      if (!isNaN(total) && currentDistrict) {
        districts[currentDistrict].totalVotes = total;
      }
      awaitingTotal = false;
      continue;
    }

    const cand = parseCandidateLine(line);
    if (cand) {
      if (cand.rank === 1) {
        // Always the lead candidate for the next district header
        pendingCandidate = cand;
      } else if (currentDistrict) {
        districts[currentDistrict].candidates.push(cand);
      }
    }
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

  console.log('Parsing TN 2022 PDF...');
  const buf22 = fs.readFileSync(path.join(d, 'tn 2022 General Election Results.pdf'));
  const text22 = (await pdfParse(buf22)).text;

  console.log('Parsing TN 2024 PDF...');
  const buf24 = fs.readFileSync(path.join(d, 'tn 2024 General Election Results.pdf'));
  const text24 = (await pdfParse(buf24)).text;

  const SENATE_RE = /Tennessee Senate District (\d+)/;
  const HOUSE_RE = /Tennessee House of Representatives District (\d+)/;

  const senate22 = parseDistricts(text22, SENATE_RE, HOUSE_RE); // odd districts
  const senate24 = parseDistricts(text24, SENATE_RE, HOUSE_RE); // even districts
  const house24 = parseDistricts(text24, HOUSE_RE, SENATE_RE);  // all 99 districts

  // Build senate: odd → 2022, even → 2024
  const senate = {};
  for (let i = 1; i <= 33; i++) {
    const k = String(i);
    const isOdd = i % 2 === 1;
    const src = isOdd ? senate22 : senate24;
    const year = isOdd ? 2022 : 2024;
    if (!src[k] || !src[k].candidates.length) {
      console.warn(`WARNING: Senate District ${i} missing from ${year} data`);
      continue;
    }
    const out = buildOutput(src[k], k, 'senate', year);
    if (out) senate[k] = out;
  }

  // Build house: all from 2024
  const house = {};
  for (let i = 1; i <= 99; i++) {
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

  if (hCount !== 99) console.error(`ERROR: Expected 99 house districts, got ${hCount}`);
  if (sCount !== 33) console.error(`ERROR: Expected 33 senate districts, got ${sCount}`);

  const output = { house: sortedByNumber(house), senate: sortedByNumber(senate) };

  fs.writeFileSync(
    path.join(d, 'tn-elections-data.json'),
    JSON.stringify(output, null, 2)
  );

  console.log('Written to tn-elections-data.json');

  // Spot-check a few districts
  console.log('\nSpot checks:');
  console.log('Senate 1 (2022, odd):', JSON.stringify(senate['1']?.winner), senate['1']?.winner_party);
  console.log('Senate 2 (2024, even):', JSON.stringify(senate['2']?.winner), senate['2']?.winner_party);
  console.log('House 1 (2024):', JSON.stringify(house['1']?.winner), house['1']?.winner_party);
  console.log('House 99 (2024):', JSON.stringify(house['99']?.winner), house['99']?.winner_party);
}

main().catch(console.error);
