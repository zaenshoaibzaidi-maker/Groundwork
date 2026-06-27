'use strict';

const fs = require('fs');
const path = require('path');

function parseTSV(filepath) {
  const lines = fs.readFileSync(filepath, 'utf8').split('\n');
  // Line 0 is "TOTAL VOTER TURNOUT: ...", line 1 is the header row.
  const headers = lines[1].split('\t').map(h => h.trim());
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, '');
    if (!line || line.startsWith('RECORDS:')) continue;
    const cols = line.split('\t');
    if (cols.length < headers.length) continue;
    const row = {};
    headers.forEach((h, idx) => row[h] = (cols[idx] || '').trim());
    rows.push(row);
  }
  return rows;
}

function titleCase(name) {
  return name
    .toLowerCase()
    .replace(/(^|[\s\-'])([a-z])/g, (m, sep, ch) => sep + ch.toUpperCase());
}

function partyCode(partyDescription) {
  const p = partyDescription.toUpperCase();
  if (p === 'DEMOCRATIC') return 'dem';
  if (p === 'REPUBLICAN') return 'rep';
  return 'ind';
}

// MI TSVs are county-level rows: aggregate Candidate Votes across counties per district.
function extractDistricts(rows, chamberKeyword, districtDivisor, districtPrefix) {
  const distMap = {};
  for (const row of rows) {
    const officeDescription = row['OfficeDescription'] || '';
    if (!officeDescription.toUpperCase().includes(chamberKeyword)) continue;
    if ((row['WriteIn(W)/Uncommitted(Z)'] || '').trim()) continue; // skip write-ins

    const distNum = String(parseInt(row['DistrictCode(Text)'], 10) / districtDivisor);
    const candId = row['CandidateID'];
    const name = `${titleCase(row['CandidateFirstName'] || '')} ${titleCase(row['CandidateLastName'] || '')}`.trim();
    const party = partyCode(row['PartyDescription'] || '');
    const votes = parseInt(row['CandidateVotes'], 10) || 0;

    if (!distMap[distNum]) distMap[distNum] = {};
    if (!distMap[distNum][candId]) distMap[distNum][candId] = { name, party, votes: 0 };
    distMap[distNum][candId].votes += votes;
  }

  const results = [];
  for (const distNum of Object.keys(distMap).sort((a, b) => parseInt(a, 10) - parseInt(b, 10))) {
    const candidates = Object.values(distMap[distNum]).sort((a, b) => b.votes - a.votes);
    const winner = candidates[0];
    const demVotes = candidates.filter(c => c.party === 'dem').reduce((sum, c) => sum + c.votes, 0);
    const repVotes = candidates.filter(c => c.party === 'rep').reduce((sum, c) => sum + c.votes, 0);
    const totalVotes = demVotes + repVotes;
    const demPct = totalVotes > 0 ? Math.round((demVotes / totalVotes) * 10000) / 100 : 0;
    const repPct = totalVotes > 0 ? Math.round((repVotes / totalVotes) * 10000) / 100 : 0;

    results.push({
      districtId: `${districtPrefix}-${distNum}`,
      winner: winner.name,
      winnerParty: winner.party,
      demVotes,
      repVotes,
      totalVotes,
      demPct,
      repPct,
      candidates,
    });
  }
  return results;
}

function main() {
  console.log('Parsing MI election files...');
  const d = __dirname;
  const houseRows = parseTSV(path.join(d, 'MI 2024 General Election State Representative Results.txt'));
  const senateRows = parseTSV(path.join(d, 'MI 2024 General Election State Senator Results.txt'));

  const house = extractDistricts(houseRows, 'REPRESENTATIVE IN STATE LEGISLATURE', 1, 'mi-hd');
  const senate = extractDistricts(senateRows, 'STATE SENATOR', 100, 'mi-sd');

  const output = { house, senate };

  fs.writeFileSync(path.join(d, 'mi-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`House districts:  ${Object.keys(house).length}`);
  console.log(`Senate districts: ${Object.keys(senate).length}`);
  console.log('Written to mi-elections-data.json');
}

main();
