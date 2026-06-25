'use strict';

const fs = require('fs');
const path = require('path');

const SOURCE_CSV = 'NY 2024 General Election Results.csv';
const SENATE_TOTAL_DISTRICTS = 63;
const ASSEMBLY_TOTAL_DISTRICTS = 150;

function parseCSV(filepath) {
  const lines = fs.readFileSync(filepath, 'utf8').split('\n');
  // The export has a leading report-id line before the real header row.
  const headerIdx = lines.findIndex((l) => l.startsWith('contest_id,'));
  const headers = lines[headerIdx].trim().split(',').map((h) => h.trim().replace(/"/g, ''));
  const rows = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = [];
    let inQuote = false, cur = '';
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { cols.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur.trim());
    const row = {};
    headers.forEach((h, idx) => row[h] = (cols[idx] || '').replace(/"/g, ''));
    rows.push(row);
  }
  return rows;
}

// Rows for these candidate_ids are tally bookkeeping (not real candidates).
// "Total Votes" in particular re-sums every other row in the contest, so
// including it would double-count the district's votes.
const NON_CANDIDATE_IDS = new Set(['1', '6', '9', '10']); // Total Votes, Scattering, Void, Blank

// NY rows are county-level and split by ballot/party line (fusion voting), so a
// single candidate can appear multiple times per district: aggregate votes
// across counties and party lines per candidate, and track which party line
// carried the most votes to label the winner's party.
function extractDistricts(rows, districtTypeName) {
  const distMap = {};
  for (const row of rows) {
    if (row['district_type'] !== districtTypeName) continue;
    if (NON_CANDIDATE_IDS.has(row['candidate_id'])) continue;
    const distNum = String(parseInt(row['district_name'], 10));
    const candId = row['candidate_id'];
    const candName = row['candidate_name'];
    const votes = parseInt(row['votes'], 10) || 0;
    const isWinner = row['is_winner'].trim().toUpperCase() === 'TRUE';
    const party = row['candidate_party_name'];

    if (!distMap[distNum]) distMap[distNum] = {};
    if (!distMap[distNum][candId]) {
      distMap[distNum][candId] = { name: candName, votes: 0, isWinner: false, partyVotes: {} };
    }
    const cand = distMap[distNum][candId];
    cand.votes += votes;
    if (isWinner) cand.isWinner = true;
    cand.partyVotes[party] = (cand.partyVotes[party] || 0) + votes;
  }

  const results = {};
  for (const [distNum, candMap] of Object.entries(distMap)) {
    const candidates = Object.values(candMap);
    candidates.sort((a, b) => b.votes - a.votes);
    const winner = candidates.find((c) => c.isWinner) || candidates[0];
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    const pct = totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 10000) / 100 : 100;
    const unopposed = candidates.length === 1;
    const winnerParty = Object.entries(winner.partyVotes).sort((a, b) => b[1] - a[1])[0][0];
    results[distNum] = { winner: winner.name, party: winnerParty, pct, unopposed, votes: winner.votes };
  }
  return results;
}

function sortedByNumber(obj) {
  return Object.fromEntries(Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0])));
}

function clean(raw) {
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    out[k] = { winner: v.winner, party: v.party, pct: v.pct, unopposed: v.unopposed };
  }
  return out;
}

function main() {
  console.log('Parsing CSV...');
  const d = __dirname;
  const rows = parseCSV(path.join(d, SOURCE_CSV));

  const senateRaw = extractDistricts(rows, 'State Senate District');
  const assemblyRaw = extractDistricts(rows, 'State Assembly District');

  const output = {
    senate: sortedByNumber(clean(senateRaw)),
    assembly: sortedByNumber(clean(assemblyRaw)),
  };
  fs.writeFileSync(path.join(d, 'ny-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`Senate districts:   ${Object.keys(output.senate).length} / ${SENATE_TOTAL_DISTRICTS}`);
  console.log(`Assembly districts: ${Object.keys(output.assembly).length} / ${ASSEMBLY_TOTAL_DISTRICTS}`);

  const missingSenate = [];
  for (let i = 1; i <= SENATE_TOTAL_DISTRICTS; i++) {
    if (!output.senate[String(i)]) missingSenate.push(i);
  }
  const missingAssembly = [];
  for (let i = 1; i <= ASSEMBLY_TOTAL_DISTRICTS; i++) {
    if (!output.assembly[String(i)]) missingAssembly.push(i);
  }
  if (missingSenate.length) console.log('Missing Senate districts:', missingSenate.join(', '));
  if (missingAssembly.length) console.log('Missing Assembly districts:', missingAssembly.join(', '));

  console.log('Written to ny-elections-data.json');
}

main();
