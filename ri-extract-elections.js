'use strict';

const fs = require('fs');
const path = require('path');

const HOUSE_SOURCE = 'ri-house-results.json';
const SENATE_SOURCE = 'ri-senate-results.json';
const HOUSE_TOTAL_DISTRICTS = 75;
const SENATE_TOTAL_DISTRICTS = 38;

// Candidate names are prefixed with their party code (e.g. "DEM John Smith");
// strip it so the stored name is plain text.
function stripPartyPrefix(name, partyCode) {
  const prefix = `${partyCode} `;
  return name.startsWith(prefix) ? name.slice(prefix.length) : name;
}

function normalizeParty(partyCode) {
  return partyCode === 'Ind' ? 'IND' : partyCode;
}

function districtNumber(contestName) {
  const match = contestName.match(/District (\d+)/);
  return match[1];
}

function extractDistricts(contests) {
  const results = {};
  for (const contest of contests) {
    const distNum = districtNumber(contest.name);
    const candidates = contest.candidates.map((c) => ({
      name: c.name,
      party: normalizeParty(c.party_code),
      votes: parseInt(c.votes, 10) || 0,
    }));

    const realCandidates = candidates.filter((c) => c.name !== 'Write-in');
    const winner = realCandidates.reduce((best, c) => (c.votes > best.votes ? c : best));
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    const pct = totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 10000) / 100 : 100;

    results[distNum] = {
      winner: stripPartyPrefix(winner.name, contest.candidates.find((c) => c.name === winner.name).party_code),
      party: winner.party,
      pct,
      unopposed: realCandidates.length === 1,
    };
  }
  return results;
}

function sortedByNumber(obj) {
  return Object.fromEntries(Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0])));
}

function main() {
  const d = __dirname;

  const houseData = JSON.parse(fs.readFileSync(path.join(d, HOUSE_SOURCE), 'utf8'));
  const senateData = JSON.parse(fs.readFileSync(path.join(d, SENATE_SOURCE), 'utf8'));

  const house = sortedByNumber(extractDistricts(houseData.contests));
  const senate = sortedByNumber(extractDistricts(senateData.contests));

  const output = { house, senate };
  fs.writeFileSync(path.join(d, 'ri-elections-data.json'), JSON.stringify(output, null, 2));

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

  console.log('Written to ri-elections-data.json');
}

main();
