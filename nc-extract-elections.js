'use strict';

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Matches the party code, then a thousands-formatted vote count, then pct%
// Vote count uses US comma formatting (e.g. 31,950), so after the last comma
// there are exactly 3 vote digits before the pct integer begins.
const CAND_RE = /(REP|DEM|LIB|GRE|WTP|CST)((?:\d{1,3},)+\d{3})(\d+\.\d{2})%$/;

function parseCandidateLine(line) {
  const m = line.match(CAND_RE);
  if (!m) return null;
  const party = m[1];
  const votes = parseInt(m[2].replace(/,/g, ''), 10);
  const pct = parseFloat(m[3]);
  const name = line.slice(0, m.index).trim();
  if (!name) return null;
  return { name, party, votes, pct };
}

function extractFromText(text, districtRegex) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const districts = {};
  let current = null;

  for (const line of lines) {
    const dm = line.match(districtRegex);
    if (dm) {
      current = String(parseInt(dm[1], 10));
      if (!districts[current]) districts[current] = [];
      continue;
    }
    if (current) {
      const cand = parseCandidateLine(line);
      if (cand) districts[current].push(cand);
    }
  }

  const results = {};
  for (const [distNum, candidates] of Object.entries(districts)) {
    if (!candidates.length) continue;
    candidates.sort((a, b) => b.votes - a.votes);
    const winner = candidates[0];
    results[distNum] = {
      winner: winner.name,
      party: winner.party,
      pct: winner.pct,
      unopposed: candidates.length === 1 && winner.pct === 100,
    };
  }
  return results;
}

function sortedByNumber(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  );
}

async function main() {
  const d = __dirname;

  console.log('Parsing NC House PDF...');
  const houseBuf = fs.readFileSync(path.join(d, 'NC State House 2024 General election.pdf'));
  const houseData = await pdfParse(houseBuf);
  const house = extractFromText(
    houseData.text,
    /NC HOUSE OF REPRESENTATIVES DISTRICT (\d+)/
  );

  console.log('Parsing NC Senate PDF...');
  const senateBuf = fs.readFileSync(path.join(d, 'NC 2024 State Senate General Election.pdf'));
  const senateData = await pdfParse(senateBuf);
  const senate = extractFromText(
    senateData.text,
    /NC STATE SENATE DISTRICT (\d+)/
  );

  const output = {
    house: sortedByNumber(house),
    senate: sortedByNumber(senate),
  };

  fs.writeFileSync(
    path.join(d, 'nc-elections-data.json'),
    JSON.stringify(output, null, 2)
  );

  console.log(`House districts:  ${Object.keys(output.house).length}`);
  console.log(`Senate districts: ${Object.keys(output.senate).length}`);

  const hUnopposed = Object.entries(output.house)
    .filter(([, v]) => v.unopposed).map(([k]) => 'HD-' + k);
  const sUnopposed = Object.entries(output.senate)
    .filter(([, v]) => v.unopposed).map(([k]) => 'SD-' + k);
  if (hUnopposed.length) console.log('House unopposed:', hUnopposed.join(', '));
  if (sUnopposed.length) console.log('Senate unopposed:', sUnopposed.join(', '));
  console.log('Written to nc-elections-data.json');
}

main().catch(console.error);
