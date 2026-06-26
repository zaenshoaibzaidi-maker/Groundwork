const fs = require('fs');
const path = require('path');

const FILES = [
  { path: 'ME 2024 General Election State Representative Results.csv', chamber: 'House' },
  { path: 'ME 2024 General Election State Senate Results.csv', chamber: 'Senate' },
];

function parseCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
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

function extractDistricts(filePath, chamber) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const rows = raw.split(/\r?\n/).filter((l) => l.length > 0).map(parseCsvLine);

  const districts = [];
  // district number -> { votes: number[], names: string[], parties: string[] }
  let current = null;
  let pendingHeaderRows = [];

  function isDataRow(row) {
    return /^\d+$/.test(row[0] || '');
  }

  function isTotalRow(row) {
    return /^total$/i.test((row[2] || '').trim());
  }

  function isBlankRow(row) {
    return row.every((v) => v === '');
  }

  function finalizeDistrict() {
    if (!current) return;
    const { dist, votes, names, parties } = current;
    let winnerIdx = 0;
    let totalVotes = 0;
    for (let i = 0; i < votes.length; i++) {
      totalVotes += votes[i];
      if (votes[i] > votes[winnerIdx]) winnerIdx = i;
    }
    districts.push({
      district: dist,
      chamber,
      winner: names[winnerIdx],
      party: parties[winnerIdx],
      percentage: totalVotes > 0 ? votes[winnerIdx] / totalVotes : 0,
    });
    current = null;
  }

  for (const row of rows) {
    if (row[0] === 'Table 1' && row.length === 1) continue;

    if (isDataRow(row)) {
      const distNum = parseInt(row[0], 10);

      if (!current || current.dist !== distNum) {
        finalizeDistrict();

        // The 3 header rows (names, city, party) immediately precede this district's
        // first data row, regardless of which one carries the "DIST,CTY,..." label text.
        const [namesRow, , partyRow] = pendingHeaderRows.slice(-3);
        // "Blank" lands in whichever of the 3 header rows happens to carry the label
        // text in this export, so search all of them for its column position.
        let blankIdx = -1;
        for (const r of pendingHeaderRows.slice(-3)) {
          const idx = r.findIndex((v, i) => i >= 3 && /^blank$/i.test(v));
          if (idx !== -1) {
            blankIdx = idx;
            break;
          }
        }
        const candidateCount = blankIdx - 3;

        current = {
          dist: distNum,
          votes: new Array(candidateCount).fill(0),
          names: namesRow.slice(3, 3 + candidateCount),
          parties: partyRow.slice(3, 3 + candidateCount),
        };
      }

      for (let i = 0; i < current.votes.length; i++) {
        const v = parseInt(row[3 + i], 10);
        current.votes[i] += Number.isNaN(v) ? 0 : v;
      }
      pendingHeaderRows = [];
    } else if (isTotalRow(row) || isBlankRow(row)) {
      // Precomputed total rows are skipped (we aggregate from precinct rows
      // ourselves); blank separator rows between blocks carry no information.
      continue;
    } else {
      pendingHeaderRows.push(row);
    }
  }
  finalizeDistrict();

  return districts;
}

const result = { house: [], senate: [] };

for (const { path: relPath, chamber } of FILES) {
  const filePath = path.join(__dirname, relPath);
  const districts = extractDistricts(filePath, chamber);
  if (chamber === 'House') result.house = districts;
  else result.senate = districts;
}

result.house.sort((a, b) => a.district - b.district);
result.senate.sort((a, b) => a.district - b.district);

fs.writeFileSync(
  path.join(__dirname, 'me-elections-data.json'),
  JSON.stringify(result, null, 2)
);

console.log(`Maine House districts: ${result.house.length}`);
console.log(`Maine Senate districts: ${result.senate.length}`);
