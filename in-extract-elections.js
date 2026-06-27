'use strict';

const fs = require('fs');
const path = require('path');

const HOUSE_FILE = 'IN 2024 General Election State Representative Results.csv';
const SENATE_FILES = [
  'IN 2022 General Election State Senate Results.csv',
  'IN 2024 General Election State Senate Results.csv',
];

function parseCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      fields.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields.map((f) => f.trim());
}

// First row is a junk label (e.g. "elections-2024 (2)"), second row is the
// real header: County, Office, Candidate, Party, District, Votes.
function readDataRows(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.length > 0)
    .slice(2)
    .map(parseCsvLine);
}

function partyCode(party) {
  const p = party.trim();
  if (p === 'Democratic') return 'dem';
  if (p === 'Republican') return 'rep';
  return 'ind';
}

function parseVotes(v) {
  const n = parseInt(String(v).replace(/[^0-9-]/g, ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

function buildDistrict(districtId, candidates) {
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const winner = sorted[0];
  const demVotes = candidates.filter((c) => c.party === 'dem').reduce((s, c) => s + c.votes, 0);
  const repVotes = candidates.filter((c) => c.party === 'rep').reduce((s, c) => s + c.votes, 0);
  const totalVotes = demVotes + repVotes;
  return {
    districtId,
    winner: winner.name,
    winnerParty: winner.party,
    demVotes,
    repVotes,
    totalVotes,
    demPct: totalVotes > 0 ? Math.round((demVotes / totalVotes) * 10000) / 100 : 0,
    repPct: totalVotes > 0 ? Math.round((repVotes / totalVotes) * 10000) / 100 : 0,
    candidates,
  };
}

function extractDistricts(rows, districtPrefix) {
  const distMap = new Map();
  for (const row of rows) {
    const [, , candidate, party, district, votesRaw] = row;
    const votes = parseVotes(votesRaw);
    if (!votes) continue;

    const distNum = parseInt(district, 10);
    if (!distMap.has(distNum)) distMap.set(distNum, []);
    distMap.get(distNum).push({ name: candidate.trim(), party: partyCode(party), votes });
  }

  return [...distMap.keys()]
    .sort((a, b) => a - b)
    .map((distNum) => buildDistrict(`${districtPrefix}-${distNum}`, distMap.get(distNum)));
}

function main() {
  const d = __dirname;

  const houseRows = readDataRows(path.join(d, HOUSE_FILE));
  const house = extractDistricts(houseRows, 'in-hd');

  const senateRows = SENATE_FILES.flatMap((f) => readDataRows(path.join(d, f)));
  const senate = extractDistricts(senateRows, 'in-sd');

  const output = { house, senate };
  fs.writeFileSync(path.join(d, 'in-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`House districts:  ${house.length}`);
  console.log(`Senate districts: ${senate.length}`);
}

main();
