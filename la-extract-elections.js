'use strict';

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const HOUSE_TOTAL = 105;
const SENATE_TOTAL = 39;

// Parse candidate string like "\"Ray\" Garofalo (REP)" or "Randall Liles (REP)"
function parseCandidate(raw) {
  if (!raw || typeof raw !== 'string') return null;
  // Remove escaped/literal quotes used for nicknames
  const cleaned = raw.replace(/\\?"/g, '').trim();
  // Extract party from trailing (PARTY)
  const partyMatch = cleaned.match(/\(([A-Z]+)\)\s*$/);
  const party = partyMatch ? partyMatch[1] : 'UNK';
  const name = cleaned.replace(/\([A-Z]+\)\s*$/, '').trim();
  return { name, party };
}

// Normalize party codes
function normalizeParty(p) {
  if (p === 'REP') return 'REP';
  if (p === 'DEM') return 'DEM';
  return p;
}

// Parse district number from race title
function parseDistrict(title) {
  const m = title.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// Extract all State Rep and State Senator results from a Multi-Parish(Parish) sheet
function extractFromSheet(ws) {
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const house = {};
  const senate = {};

  for (let i = 0; i < data.length - 2; i++) {
    const row = data[i];
    if (!row[0] || typeof row[0] !== 'string') continue;

    const isHouse = /State Representative/i.test(row[0]);
    const isSenate = /State Senator/i.test(row[0]);
    if (!isHouse && !isSenate) continue;

    const distNum = parseDistrict(row[0]);
    if (!distNum) continue;

    const candRow = data[i + 1] || [];
    const voteRow = data[i + 2] || [];
    if (voteRow[0] !== 'Total Votes') continue;

    // Collect candidates: candRow[1..n] = names, voteRow[1..n] = vote totals
    const candidates = [];
    for (let c = 1; c < candRow.length; c++) {
      if (candRow[c] == null || candRow[c] === '') continue;
      const parsed = parseCandidate(candRow[c]);
      if (!parsed) continue;
      const votes = Number(voteRow[c]) || 0;
      candidates.push({ ...parsed, votes });
    }

    if (candidates.length === 0) continue;

    candidates.sort((a, b) => b.votes - a.votes);
    const winner = candidates[0];
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    const pct = totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 10000) / 100 : 100;
    const contested = candidates.length > 1;

    const result = {
      winner: winner.name,
      party: normalizeParty(winner.party),
      pct,
      unopposed: !contested,
    };

    const target = isHouse ? house : senate;
    target[distNum] = result;
  }

  return { house, senate };
}

function sortedByNumber(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  );
}

function main() {
  const d = __dirname;

  console.log('Reading primary file (October 2023)...');
  const primaryWb = XLSX.readFile(path.join(d, 'la Election Results 2023 primary.xlsx'));
  const primarySheet = primaryWb.Sheets['Multi-Parish(Parish)'];
  const primary = extractFromSheet(primarySheet);

  console.log('Reading runoff file (November 2023)...');
  const runoffWb = XLSX.readFile(path.join(d, 'la Election Results 2023 general.xlsx'));
  const runoffSheet = runoffWb.Sheets['Multi-Parish(Parish)'];
  const runoff = extractFromSheet(runoffSheet);

  // Merge: primary is base, runoff overrides any district that appears in it
  const house = { ...primary.house };
  const senate = { ...primary.senate };

  let hRunoffOverrides = 0, sRunoffOverrides = 0;
  for (const [k, v] of Object.entries(runoff.house)) {
    if (house[k]) hRunoffOverrides++;
    house[k] = v;
  }
  for (const [k, v] of Object.entries(runoff.senate)) {
    if (senate[k]) sRunoffOverrides++;
    senate[k] = v;
  }

  // Identify missing districts
  const missingHouse = [];
  const missingSenate = [];
  for (let i = 1; i <= HOUSE_TOTAL; i++) {
    if (!house[i]) missingHouse.push(i);
  }
  for (let i = 1; i <= SENATE_TOTAL; i++) {
    if (!senate[i]) missingSenate.push(i);
  }

  // Build output using only found districts
  const output = {
    house: sortedByNumber(Object.fromEntries(Object.entries(house).map(([k, v]) => [k, v]))),
    senate: sortedByNumber(Object.fromEntries(Object.entries(senate).map(([k, v]) => [k, v]))),
  };

  fs.writeFileSync(path.join(d, 'la-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`\nHouse districts found:  ${Object.keys(house).length} / ${HOUSE_TOTAL}`);
  console.log(`Senate districts found: ${Object.keys(senate).length} / ${SENATE_TOTAL}`);
  console.log(`House runoff overrides: ${hRunoffOverrides}`);
  console.log(`Senate runoff overrides: ${sRunoffOverrides}`);

  if (missingHouse.length) {
    console.log(`\nMissing House districts (${missingHouse.length}) — uncontested, not in either file:`);
    console.log('HD: ' + missingHouse.join(', '));
  }
  if (missingSenate.length) {
    console.log(`\nMissing Senate districts (${missingSenate.length}) — uncontested, not in either file:`);
    console.log('SD: ' + missingSenate.join(', '));
  }

  console.log('\nWritten to la-elections-data.json');
}

main();
