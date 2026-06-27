'use strict';

const fs = require('fs');
const path = require('path');

// NH House files are county-scoped; district numbers reset per county, so the
// districtId is prefixed with the county to stay unique statewide.
const HOUSE_FILES = [
  { file: 'NH 2024 BELKNAP State Rep General Election.csv', county: 'belknap' },
  { file: 'NH 2024 CARROLL State Rep General Election.csv', county: 'carroll' },
  { file: 'NH 2024 CHESHIRE State Rep General Election.csv', county: 'cheshire' },
  { file: 'NH 2024 COOS State Rep General Election.csv', county: 'coos' },
  { file: 'NH 2024 GRAFTON State Rep General Election.csv', county: 'grafton' },
  { file: 'NH 2024 HILLSBOROUGH State Rep General Election.csv', county: 'hillsborough' },
  { file: 'NH 2024 MERRIMACK State Rep General Election.csv', county: 'merrimack' },
  { file: 'NH 2024 ROCKINGHAM State Rep General Election.csv', county: 'rockingham' },
  { file: 'NH 2024 STAFFORD State Rep General Election.csv', county: 'strafford' },
  { file: 'NH 2024 SULLIVAN State Rep General Election.csv', county: 'sullivan' },
];

const SENATE_FILE = 'NH 2024  State Senate General Election.csv';

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

function readRows(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.length > 0)
    .map(parseCsvLine);
}

function parseVotes(v) {
  if (v == null) return 0;
  const s = String(v).replace(/[^0-9-]/g, '');
  if (s === '' || s === '-') return 0;
  return parseInt(s, 10) || 0;
}

function isAllBlank(row) {
  return row.every((v) => (v || '').trim() === '');
}

function rowHasCandidatePattern(row) {
  return row.slice(1).some((v) => /^.+,\s*[a-zA-Z&]+\s*$/.test((v || '').trim()));
}

// "District No. 1 (1)" / "District No 17 (2)" / "District 16 (1)" / "District No.7 (1)"
// optionally followed by "FL" / "F" (floterial) or "RECOUNT FIGURES" (replacement totals).
function matchDistrictHeader(cell) {
  const m = cell.match(/^District\s*(?:No\.?)?\s*(\d+)\s*\((\d+)\)\s*(.*)$/i);
  if (!m) return null;
  const suffix = m[3].trim();
  return {
    num: parseInt(m[1], 10),
    seats: parseInt(m[2], 10),
    isFloterial: /^FL?$/i.test(suffix),
  };
}

// Scans candidate name cells starting at index 1 until an "Undervotes" cell or
// end of row. A candidate immediately followed by a literal "RECOUNT" cell
// uses that next column's value (the corrected count) instead of its own.
function scanCandidates(row) {
  const candidates = [];
  let i = 1;
  while (i < row.length) {
    const cell = (row[i] || '').trim();
    if (/^undervotes$/i.test(cell)) break;
    const m = cell.match(/^(.+),\s*([a-zA-Z&]+)\s*$/);
    if (m) {
      const next = (row[i + 1] || '').trim();
      if (/^recount$/i.test(next)) {
        candidates.push({ name: m[1].trim(), party: m[2], colIndex: i + 1 });
        i += 2;
        continue;
      }
      candidates.push({ name: m[1].trim(), party: m[2], colIndex: i });
    }
    i += 1;
  }
  return candidates;
}

function sumRows(rows) {
  const sums = [];
  for (const row of rows) {
    for (let i = 0; i < row.length; i++) {
      sums[i] = (sums[i] || 0) + parseVotes(row[i]);
    }
  }
  return sums;
}

function normalizeParty(raw) {
  const p = raw.trim().toLowerCase();
  if (p === 'd') return 'DEM';
  if (p === 'r') return 'REP';
  if (p === 'i') return 'IND';
  return p.toUpperCase();
}

function buildDistrict(districtId, seats, candidates) {
  const winners = [...candidates].sort((a, b) => b.votes - a.votes).slice(0, seats);
  const demVotes = candidates.filter((c) => c.party === 'DEM').reduce((s, c) => s + c.votes, 0);
  const repVotes = candidates.filter((c) => c.party === 'REP').reduce((s, c) => s + c.votes, 0);
  const totalVotes = demVotes + repVotes;
  return {
    districtId,
    seats,
    candidates,
    winners,
    demVotes,
    repVotes,
    totalVotes,
    demPct: totalVotes > 0 ? Math.round((demVotes / totalVotes) * 10000) / 100 : 0,
    repPct: totalVotes > 0 ? Math.round((repVotes / totalVotes) * 10000) / 100 : 0,
  };
}

function parseHouseFile(filePath, county) {
  const rows = readRows(filePath);
  const districtsMap = new Map();
  let i = 0;

  while (i < rows.length) {
    const cell0 = (rows[i][0] || '').trim();
    const hdr = matchDistrictHeader(cell0);
    if (!hdr) { i++; continue; }

    let j = i;
    const candidatesAcc = [];

    while (true) {
      const headerRow = rows[j];
      j++;
      const blockCandidates = scanCandidates(headerRow);
      let totalsValues = null;
      const dataRows = [];

      while (j < rows.length) {
        const c0 = (rows[j][0] || '').trim();
        if (matchDistrictHeader(c0)) break;
        if (c0 === '') {
          if (rowHasCandidatePattern(rows[j])) break;
          if (isAllBlank(rows[j])) { j++; continue; }
        }
        if (/^totals$/i.test(c0)) { totalsValues = rows[j].map(parseVotes); j++; continue; }
        dataRows.push(rows[j]);
        j++;
      }

      const finalValues = totalsValues || sumRows(dataRows);
      for (const c of blockCandidates) {
        candidatesAcc.push({ name: c.name, party: normalizeParty(c.party), votes: finalValues[c.colIndex] || 0 });
      }

      if (j < rows.length && (rows[j][0] || '').trim() === '' && rowHasCandidatePattern(rows[j])) continue;
      break;
    }

    if (!hdr.isFloterial) {
      districtsMap.set(hdr.num, buildDistrict(`nh-hd-${county}-${hdr.num}`, hdr.seats, candidatesAcc));
    }
    i = j;
  }

  return [...districtsMap.values()];
}

function parseSenateFile(filePath) {
  const rows = readRows(filePath);
  const districts = [];
  let i = 0;

  while (i < rows.length) {
    const cell0 = (rows[i][0] || '').trim();
    const m = cell0.match(/^State\s+Senate\s+District\s+(\d+)/i);
    if (!m) { i++; continue; }

    const num = parseInt(m[1], 10);
    let j = i + 1;
    const candidates = scanCandidates(rows[j]);
    j++;

    let totalsValues = null;
    const dataRows = [];
    while (j < rows.length) {
      const c0 = (rows[j][0] || '').trim();
      if (/^State\s+Senate\s+District\s+\d+/i.test(c0)) break;
      if (isAllBlank(rows[j])) { j++; continue; }
      if (/^totals$/i.test(c0)) { totalsValues = rows[j].map(parseVotes); j++; continue; }
      dataRows.push(rows[j]);
      j++;
    }

    const finalValues = totalsValues || sumRows(dataRows);
    const cands = candidates.map((c) => ({ name: c.name, party: normalizeParty(c.party), votes: finalValues[c.colIndex] || 0 }));
    districts.push(buildDistrict(`nh-sd-${num}`, 1, cands));
    i = j;
  }

  return districts;
}

function main() {
  const d = __dirname;
  let house = [];
  for (const { file, county } of HOUSE_FILES) {
    house = house.concat(parseHouseFile(path.join(d, file), county));
  }
  house.sort((a, b) => a.districtId.localeCompare(b.districtId));

  const senate = parseSenateFile(path.join(d, SENATE_FILE))
    .sort((a, b) => parseInt(a.districtId.split('-')[2], 10) - parseInt(b.districtId.split('-')[2], 10));

  const output = { house, senate };
  fs.writeFileSync(path.join(d, 'nh-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`House districts:  ${house.length}`);
  console.log(`Senate districts: ${senate.length}`);
}

main();
