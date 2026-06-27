'use strict';

const fs = require('fs');
const path = require('path');

const FILE_2024 = 'KY 2024 General Election Results.csv';
const FILE_2022 = 'KY 2022 General Election Results.csv';

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
  return fields.map((f) => f.replace(/"/g, '').trim());
}

// First row is a junk label (e.g. "Ky_2024g_summary"), second row is the
// real header.
function readDataRows(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.length > 0)
    .slice(2)
    .map(parseCsvLine);
}

function partyCode(party) {
  const p = party.trim().toUpperCase();
  if (p === 'REP') return 'rep';
  if (p === 'DEM') return 'dem';
  return 'ind';
}

function parseVotes(v) {
  const n = parseInt(String(v).replace(/[^0-9-]/g, ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

function districtNumber(contestName, label) {
  const m = contestName.match(new RegExp(`${label}\\s+(\\d+)`, 'i'));
  return m ? parseInt(m[1], 10) : null;
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

// 2024 file: Line, Contest Name, Choice Name, Party Name, Total Votes, Election Day Votes
function extract2024(rows, contestLabel, districtPrefix) {
  const distMap = new Map();
  for (const row of rows) {
    const [, contestName, candidate, party, votesRaw] = row;
    if (!contestName || !contestName.toUpperCase().includes(contestLabel)) continue;

    const distNum = districtNumber(contestName, contestLabel);
    if (distNum === null) continue;

    const votes = parseVotes(votesRaw);
    if (!votes) continue;

    if (!distMap.has(distNum)) distMap.set(distNum, []);
    distMap.get(distNum).push({ name: candidate.trim(), party: partyCode(party), votes });
  }

  return [...distMap.keys()]
    .sort((a, b) => a - b)
    .map((distNum) => buildDistrict(`${districtPrefix}-${distNum}`, distMap.get(distNum)));
}

// 2022 file: line number, county, contest name, choice name, party name, total votes, ...
// Senate only, even districts. Same candidate appears once per county row, so
// votes must be summed across counties for each district.
function extractSenate2022(rows, districtPrefix) {
  const distMap = new Map();
  for (const row of rows) {
    const [, , contestName, candidate, party, votesRaw] = row;
    if (!contestName || !contestName.toUpperCase().includes('STATE SENATOR')) continue;

    const distNum = districtNumber(contestName, 'STATE SENATOR');
    if (distNum === null) continue;

    const votes = parseVotes(votesRaw);
    if (!votes) continue;

    if (!distMap.has(distNum)) distMap.set(distNum, new Map());
    const candMap = distMap.get(distNum);
    const name = candidate.trim();
    const partyC = partyCode(party);
    if (!candMap.has(name)) candMap.set(name, { name, party: partyC, votes: 0 });
    candMap.get(name).votes += votes;
  }

  return [...distMap.keys()]
    .sort((a, b) => a - b)
    .map((distNum) => buildDistrict(`${districtPrefix}-${distNum}`, [...distMap.get(distNum).values()]));
}

function main() {
  const d = __dirname;

  const rows2024 = readDataRows(path.join(d, FILE_2024));
  const rows2022 = readDataRows(path.join(d, FILE_2022));

  const house = extract2024(rows2024, 'STATE REPRESENTATIVE', 'ky-hd');
  const senateOdd = extract2024(rows2024, 'STATE SENATOR', 'ky-sd');
  const senateEven = extractSenate2022(rows2022, 'ky-sd');

  const senate = [...senateOdd, ...senateEven]
    .sort((a, b) => parseInt(a.districtId.split('-').pop(), 10) - parseInt(b.districtId.split('-').pop(), 10));

  const output = { house, senate };
  fs.writeFileSync(path.join(d, 'ky-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`House districts:  ${house.length}`);
  console.log(`Senate districts: ${senate.length}`);
}

main();
