'use strict';

const fs = require('fs');
const path = require('path');

function parseCSV(filepath) {
  const lines = fs.readFileSync(filepath, 'utf8').split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
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

function stripPartyPrefix(choiceName) {
  // choice name format: "REP Bill Whitmire" — leading party code followed by name
  const parts = choiceName.trim().split(/\s+/);
  if (parts.length > 1 && /^[A-Z]{2,4}$/.test(parts[0])) {
    return parts.slice(1).join(' ');
  }
  return choiceName;
}

function extractDistricts(rows, chamberPattern) {
  const districts = {};

  for (const row of rows) {
    // normalize double spaces before matching
    const contestNorm = (row['contest name'] || '').replace(/\s+/g, ' ').toUpperCase();
    if (!chamberPattern.test(contestNorm)) continue;

    const match = contestNorm.match(/DISTRICT\s+(\d+)/);
    if (!match) continue;
    const distNum = String(parseInt(match[1]));

    const choiceName = (row['choice name'] || '').trim();
    const party = (row['party name'] || '').trim();
    const votes = parseInt(row['total votes'], 10) || 0;

    if (!districts[distNum]) districts[distNum] = [];
    districts[distNum].push({ choiceName, party, votes });
  }

  const results = {};
  for (const [distNum, candidates] of Object.entries(districts)) {
    const nonWriteIn = candidates.filter(c => c.choiceName !== 'Write-In');
    nonWriteIn.sort((a, b) => b.votes - a.votes);
    const winner = nonWriteIn[0];
    if (!winner) continue;

    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    const pct = totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 10000) / 100 : 100;

    results[distNum] = {
      winner: stripPartyPrefix(winner.choiceName),
      party: winner.party,
      pct,
      unopposed: nonWriteIn.length === 1,
    };
  }
  return results;
}

function sortedByNumber(obj) {
  return Object.fromEntries(Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0])));
}

function main() {
  console.log('Parsing CSV...');
  const csvPath = path.join(__dirname, 'sc 2024 General election.csv');
  const rows = parseCSV(csvPath);

  const house = sortedByNumber(extractDistricts(rows, /STATE HOUSE OF REPRESENTATIVES/));
  const senate = sortedByNumber(extractDistricts(rows, /STATE SENATE/));

  const output = { house, senate };
  fs.writeFileSync(path.join(__dirname, 'sc-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`House districts:  ${Object.keys(output.house).length}`);
  console.log(`Senate districts: ${Object.keys(output.senate).length}`);
  console.log('Written to sc-elections-data.json');
}

main();
