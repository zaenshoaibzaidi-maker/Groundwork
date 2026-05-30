'use strict';

const fs   = require('fs');
const path = require('path');

const HOUSE_TOTAL  = 100;
const SENATE_TOTAL = 17;

const PARTY_MAP = {
  REP: 'Republican',
  DEM: 'Democratic',
  IND: 'Independent',
  LBN: 'Libertarian',
  MTN: 'Mountain',
  UPW: 'United',
  GRN: 'Green',
  CON: 'Constitution',
  NPA: 'Non-Partisan',
};

function partyFull(abbr) {
  return PARTY_MAP[abbr] || abbr || 'Other';
}

function toTitleCase(s) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bMr\b/gi, 'Mr.')
    .replace(/\bDr\b/gi, 'Dr.');
}

function parseDistrict(contestName) {
  const m = contestName.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function parseCsvLine(line) {
  const fields = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      fields.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

function parseCsv(filePath) {
  const raw     = fs.readFileSync(filePath, 'latin1');
  const lines   = raw.split(/\r?\n/).filter(l => l.trim());
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map(line => {
    const vals = parseCsvLine(line);
    const row  = {};
    headers.forEach((h, i) => { row[h] = (vals[i] || '').trim(); });
    return row;
  });
}

function buildDistrictMap(rows) {
  const senate = {};
  const house  = {};

  for (const row of rows) {
    const contest = row['contest name'];
    if (!contest) continue;

    const isHouse  = contest.includes('HOUSE OF DELEGATES');
    const isSenate = contest.includes('STATE SENATOR');
    if (!isHouse && !isSenate) continue;

    const distNum = parseDistrict(contest);
    if (!distNum) continue;

    const name   = toTitleCase((row['choice name'] || '').trim());
    const party  = partyFull((row['party name'] || '').trim());
    const votes  = parseInt((row['total votes'] || '0').replace(/,/g, ''), 10) || 0;
    const pct    = parseFloat(row['percent of votes'] || '0') || 0;

    const target = isHouse ? house : senate;
    if (!target[distNum]) target[distNum] = { candidates: [] };
    target[distNum].candidates.push({ name, party, votes, pct });
  }

  return { senate, house };
}

function resolveWinner(candidates) {
  const winner = candidates.reduce((a, b) => (a.votes >= b.votes ? a : b));
  const total  = candidates.reduce((s, c) => s + c.votes, 0);
  const winnerPct = total > 0 ? parseFloat(((winner.votes / total) * 100).toFixed(1)) : 100;
  return {
    candidates: candidates.sort((a, b) => b.votes - a.votes),
    winner:       winner.name,
    winner_party: winner.party,
    winner_votes: winner.votes,
    total_votes:  total,
    winner_pct:   winnerPct,
  };
}

function buildHouseEntry(distNum, raw) {
  return {
    district: distNum,
    chamber:  'house',
    ...resolveWinner(raw.candidates),
  };
}

function main() {
  const d = __dirname;

  console.log('Parsing 2022 CSV...');
  const rows2022 = parseCsv(path.join(d, 'wv 2022 General Election Results.csv'));
  const data2022 = buildDistrictMap(rows2022);

  console.log('Parsing 2024 CSV...');
  const rows2024 = parseCsv(path.join(d, 'wv 2024 General Election Results.csv'));
  const data2024 = buildDistrictMap(rows2024);

  // ── House: use 2024 as primary; backfill any missing from 2022 ─────────────
  const house = {};
  const allHouseNums = new Set([
    ...Object.keys(data2024.house).map(Number),
    ...Object.keys(data2022.house).map(Number),
  ]);

  for (const n of allHouseNums) {
    const raw = data2024.house[n] || data2022.house[n];
    const year = data2024.house[n] ? 2024 : 2022;
    house[n] = { year, ...buildHouseEntry(n, raw) };
  }

  // ── Senate: seat_a = 2022 winner, seat_b = 2024 winner ────────────────────
  const senate = {};
  const allSenateNums = new Set([
    ...Object.keys(data2022.senate).map(Number),
    ...Object.keys(data2024.senate).map(Number),
  ]);

  for (const n of allSenateNums) {
    const entry = { district: n, chamber: 'senate' };

    if (data2022.senate[n]) {
      entry.seat_a = { year: 2022, ...resolveWinner(data2022.senate[n].candidates) };
    }
    if (data2024.senate[n]) {
      entry.seat_b = { year: 2024, ...resolveWinner(data2024.senate[n].candidates) };
    }

    senate[n] = entry;
  }

  // ── Sort by district number ────────────────────────────────────────────────
  function sortedByNum(obj) {
    return Object.fromEntries(
      Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    );
  }

  const output = {
    house:  sortedByNum(house),
    senate: sortedByNum(senate),
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const foundHouse  = Object.keys(house).map(Number);
  const foundSenate = Object.keys(senate).map(Number);

  const missingHouse  = [];
  const missingSenate = [];
  for (let i = 1; i <= HOUSE_TOTAL;  i++) if (!house[i])  missingHouse.push(i);
  for (let i = 1; i <= SENATE_TOTAL; i++) if (!senate[i]) missingSenate.push(i);

  fs.writeFileSync(path.join(d, 'wv-elections-data.json'), JSON.stringify(output, null, 2));

  console.log('\n--- Results ---');
  console.log(`House districts found:  ${foundHouse.length} / ${HOUSE_TOTAL}`);
  console.log(`Senate districts found: ${foundSenate.length} / ${SENATE_TOTAL}`);

  if (missingHouse.length) {
    console.log(`\nMissing House districts (${missingHouse.length}):`);
    console.log('HD: ' + missingHouse.join(', '));
  } else {
    console.log('\nNo missing House districts.');
  }

  if (missingSenate.length) {
    console.log(`\nMissing Senate districts (${missingSenate.length}):`);
    console.log('SD: ' + missingSenate.join(', '));
  } else {
    console.log('\nNo missing Senate districts.');
  }

  console.log('\nWritten to wv-elections-data.json');
}

main();
