'use strict';

const fs = require('fs');
const path = require('path');

// DE Senate districts that appeared on the 2024 ballot (the other 11 were on 2022)
const SENATE_2024 = new Set([2, 3, 4, 6, 10, 11, 16, 17, 18, 21]);

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

function titleCase(name) {
  return name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function partyAbbr(partyname) {
  const p = (partyname || '').toLowerCase();
  if (p.includes('democratic')) return 'DEM';
  if (p.includes('republican')) return 'REP';
  return 'IND';
}

// DE CSVs are statewide rows — one row per candidate, no county aggregation needed.
function extractDistricts(rows, officeKeyword) {
  const distMap = {};
  for (const row of rows) {
    const office = row['office'] || '';
    if (!office.includes(officeKeyword)) continue;
    const match = office.match(/District\s+(\d+)/i);
    if (!match) continue;
    const distNum = String(parseInt(match[1]));
    const votes = parseInt(row['totalvotessum'], 10) || 0;
    if (!distMap[distNum]) distMap[distNum] = [];
    distMap[distNum].push({
      name: titleCase(row['candidatename'] || ''),
      votes,
      pct: parseFloat(row['totalvotespercentage']) || 0,
      party: partyAbbr(row['partyname']),
    });
  }
  const results = {};
  for (const [distNum, candidates] of Object.entries(distMap)) {
    candidates.sort((a, b) => b.votes - a.votes);
    const winner = candidates[0];
    results[distNum] = {
      winner: winner.name,
      party: winner.party,
      pct: Math.round(winner.pct * 100) / 100,
      unopposed: candidates.length === 1,
    };
  }
  return results;
}

function sortedByNumber(obj) {
  return Object.fromEntries(Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0])));
}

function main() {
  console.log('Parsing CSVs...');
  const d = __dirname;
  const rows2024 = parseCSV(path.join(d, 'DE 2024 General Election Results .csv'));
  const rows2022 = parseCSV(path.join(d, 'DE 2022 General Election Results .csv'));

  // House: all 41 districts from 2024
  const house24 = extractDistricts(rows2024, 'State Representative District');
  const house = {};
  for (let i = 1; i <= 41; i++) {
    const key = String(i);
    if (house24[key]) {
      house[key] = house24[key];
    } else {
      console.warn(`WARNING: House district ${i} not found in 2024 data`);
    }
  }

  // Senate: 10 from 2024, 11 from 2022
  const senate24 = extractDistricts(rows2024, 'State Senator District');
  const senate22 = extractDistricts(rows2022, 'State Senator District');
  const senate = {};
  for (let i = 1; i <= 21; i++) {
    const key = String(i);
    if (senate24[key]) {
      senate[key] = { ...senate24[key], _src: '2024' };
    } else if (senate22[key]) {
      senate[key] = { ...senate22[key], _src: '2022' };
    } else {
      console.warn(`WARNING: Senate district ${i} not found in either year`);
    }
  }

  // Strip internal _src before writing output
  const senateOut = {};
  const s22districts = [];
  for (const [k, v] of Object.entries(senate)) {
    if (v._src === '2022') s22districts.push('SD-' + k);
    const { _src, ...rest } = v;
    senateOut[k] = rest;
  }

  const output = {
    house: sortedByNumber(house),
    senate: sortedByNumber(senateOut),
  };
  fs.writeFileSync(path.join(d, 'de-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`House districts:  ${Object.keys(output.house).length}`);
  console.log(`Senate districts: ${Object.keys(output.senate).length}`);
  if (s22districts.length) console.log('Senate from 2022:', s22districts.join(', '));
  console.log('Written to de-elections-data.json');
}

main();
