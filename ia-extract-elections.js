'use strict';

const fs = require('fs');
const path = require('path');

const FILE_2022 = 'IA 2022 General Election Results.csv';
const FILE_2024 = 'IA 2024 General Election Results.csv';

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

// First row is a junk "summary" label, second row is the real header.
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
  const m = contestName.match(new RegExp(`${label}\\s+District\\s+(\\d+)`, 'i'));
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

// Columns: line number, contest name, choice name, party name, total votes, ...
function extractRaces(rows, contestLabel, districtPrefix) {
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

  const result = new Map();
  for (const [distNum, candidates] of distMap) {
    result.set(distNum, buildDistrict(`${districtPrefix}-${distNum}`, candidates));
  }
  return result;
}

function toSortedList(distMap) {
  return [...distMap.keys()]
    .sort((a, b) => a - b)
    .map((distNum) => distMap.get(distNum));
}

function main() {
  const d = __dirname;

  const rows2022 = readDataRows(path.join(d, FILE_2022));
  const rows2024 = readDataRows(path.join(d, FILE_2024));

  const house = toSortedList(extractRaces(rows2024, 'STATE REPRESENTATIVE', 'ia-hd'));

  // Senate seats are staggered across the two cycles; 2024 results take
  // precedence for any district that appears in both files.
  const senate2022 = extractRaces(rows2022, 'STATE SENATOR', 'ia-sd');
  const senate2024 = extractRaces(rows2024, 'STATE SENATOR', 'ia-sd');
  const senateMap = new Map(senate2022);
  for (const [distNum, district] of senate2024) {
    senateMap.set(distNum, district);
  }
  const senate = toSortedList(senateMap);

  const output = { house, senate };
  fs.writeFileSync(path.join(d, 'ia-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`House districts:  ${house.length} / 100`);
  console.log(`Senate districts: ${senate.length} / 50`);
  console.log(`Total districts:  ${house.length + senate.length} / 150`);

  const missingHouse = [];
  for (let i = 1; i <= 100; i++) {
    if (!house.find((dist) => dist.districtId === `ia-hd-${i}`)) missingHouse.push(i);
  }
  const missingSenate = [];
  for (let i = 1; i <= 50; i++) {
    if (!senate.find((dist) => dist.districtId === `ia-sd-${i}`)) missingSenate.push(i);
  }
  if (missingHouse.length) console.log('Missing House districts:', missingHouse.join(', '));
  if (missingSenate.length) console.log('Missing Senate districts:', missingSenate.join(', '));

  console.log('Written to ia-elections-data.json');
}

main();
