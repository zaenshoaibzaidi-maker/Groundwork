'use strict';

const fs = require('fs');
const path = require('path');

const HOUSE_SOURCE = 'ct-house-results.csv';
const SENATE_SOURCE = 'ct-senate-results.csv';
const HOUSE_TOTAL_DISTRICTS = 151;
const SENATE_TOTAL_DISTRICTS = 36;

const NON_CANDIDATE_ROWS = new Set(['Total Votes Cast', 'Total Ballots Cast']);

const PARTY_CODES = {
  Democratic: 'DEM',
  Republican: 'REP',
  Independent: 'IND',
  'Working Families': 'WF',
  Green: 'GRN',
  'New Movement': 'NMP',
  'United Community': 'UCP',
  'We the People': 'WTP',
  'Petitioning Candidate': 'PET',
  'Write In': 'WRITEIN',
};

function normalizeParty(name) {
  return PARTY_CODES[name] || name.toUpperCase();
}

// Quote-aware CSV parser — candidate/division names contain embedded commas
// (e.g. "Alphonse Paolillo, Jr.") that a naive split(',') would mis-tokenize.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== '');
}

function readRows(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = parseCsv(text);
  // Exports are preceded by a stray search-id line before the real header.
  const headerIndex = lines.findIndex((l) => l[0] === 'contest_id');
  const header = lines[headerIndex];
  return lines.slice(headerIndex + 1).map((cols) => {
    const obj = {};
    header.forEach((key, i) => {
      obj[key] = cols[i];
    });
    return obj;
  });
}

// Town-level rows ("City/Town") already sum every precinct in that town;
// the accompanying "Polling Place" rows are a redundant precinct-level
// breakdown of those same votes, so including both would double-count.
function extractDistricts(rows) {
  const districts = {};

  for (const row of rows) {
    if (row.division_type !== 'City/Town') continue;
    if (NON_CANDIDATE_ROWS.has(row.candidate_name)) continue;

    const distNum = row.district_name;
    const votes = parseInt(row.votes, 10) || 0;

    if (!districts[distNum]) districts[distNum] = {};
    const byCandidate = districts[distNum];

    if (!byCandidate[row.candidate_id]) {
      byCandidate[row.candidate_id] = {
        name: row.candidate_name,
        votes: 0,
        partyVotes: {},
      };
    }
    const candidate = byCandidate[row.candidate_id];
    candidate.votes += votes;
    candidate.partyVotes[row.candidate_party_name] =
      (candidate.partyVotes[row.candidate_party_name] || 0) + votes;
  }

  const results = {};
  for (const [distNum, byCandidate] of Object.entries(districts)) {
    const candidates = Object.values(byCandidate);
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    const winner = candidates.reduce((best, c) => (c.votes > best.votes ? c : best));
    // A candidate can run on multiple party lines (fusion voting); credit
    // the line that contributed the most votes.
    const winnerParty = Object.entries(winner.partyVotes).reduce((best, entry) =>
      entry[1] > best[1] ? entry : best
    )[0];
    const pct = totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 10000) / 100 : 100;

    results[distNum] = {
      winner: winner.name,
      party: normalizeParty(winnerParty),
      pct,
      unopposed: candidates.length === 1,
    };
  }
  return results;
}

function sortedByNumber(obj) {
  return Object.fromEntries(Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0])));
}

function main() {
  const d = __dirname;

  const houseRows = readRows(path.join(d, HOUSE_SOURCE));
  const senateRows = readRows(path.join(d, SENATE_SOURCE));

  const house = sortedByNumber(extractDistricts(houseRows));
  const senate = sortedByNumber(extractDistricts(senateRows));

  const output = { house, senate };
  fs.writeFileSync(path.join(d, 'ct-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`House districts:  ${Object.keys(house).length} / ${HOUSE_TOTAL_DISTRICTS}`);
  console.log(`Senate districts: ${Object.keys(senate).length} / ${SENATE_TOTAL_DISTRICTS}`);
  console.log(`Total districts:  ${Object.keys(house).length + Object.keys(senate).length}`);

  const missingHouse = [];
  for (let i = 1; i <= HOUSE_TOTAL_DISTRICTS; i++) {
    if (!house[String(i)]) missingHouse.push(i);
  }
  const missingSenate = [];
  for (let i = 1; i <= SENATE_TOTAL_DISTRICTS; i++) {
    if (!senate[String(i)]) missingSenate.push(i);
  }
  if (missingHouse.length) console.log('Missing House districts:', missingHouse.join(', '));
  if (missingSenate.length) console.log('Missing Senate districts:', missingSenate.join(', '));

  console.log('Written to ct-elections-data.json');
}

main();
