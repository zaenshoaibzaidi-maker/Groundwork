'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const FILE_SENATE_2022 = 'IL 2022 General Election State Senate Results.pdf';
const FILE_SENATE_2024 = 'IL 2024 General Election State Senate Results.pdf';
const FILE_HOUSE_2024 = 'IL 2024 General Election State Representative Results.pdf';

const PY_EXTRACT = path.join('/tmp', 'il_extract_text.py');
fs.writeFileSync(PY_EXTRACT, `
import pdfplumber, sys
pdf_path = sys.argv[1]
with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        text = page.extract_text() or ''
        print(text)
`);

function extractPdfText(pdfPath) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath], {
    maxBuffer: 200 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return result.stdout.toString();
}

const HEADER_RE = /^(\d+)(?:ST|ND|RD|TH)\s+(SENATE|REPRESENTATIVE)$/;
const CANDIDATE_RE = /^(.+?)\s+([\d,]+)\s+(?:<\s*)?[\d.]+%$/;

function partyCode(party) {
  if (party === 'DEMOCRATIC') return 'dem';
  if (party === 'REPUBLICAN') return 'rep';
  return 'ind';
}

function parseVotes(v) {
  return parseInt(v.replace(/,/g, ''), 10);
}

// Returns Map<districtNumber, candidates[]>
function extractDistricts(text, label) {
  const districts = new Map();
  let currentNum = null;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    const header = line.match(HEADER_RE);
    if (header && header[2] === label) {
      currentNum = parseInt(header[1], 10);
      districts.set(currentNum, []);
      continue;
    }
    if (header) {
      // Header for the other race type - stop attributing rows to currentNum.
      currentNum = null;
      continue;
    }

    if (currentNum === null) continue;
    if (line.startsWith('Vote Totals')) continue;

    const m = line.match(CANDIDATE_RE);
    if (!m) continue;

    const votes = parseVotes(m[2]);
    if (!votes) continue;

    const nameAndParty = m[1].trim();
    const tokens = nameAndParty.split(/\s+/);
    const lastToken = tokens[tokens.length - 1];
    let name = nameAndParty;
    let party = 'ind';
    if (lastToken === 'DEMOCRATIC' || lastToken === 'REPUBLICAN') {
      party = partyCode(lastToken);
      name = tokens.slice(0, -1).join(' ');
    }

    districts.get(currentNum).push({ name, party, votes });
  }

  return districts;
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

function toDistrictList(distMap, prefix) {
  return [...distMap.keys()]
    .sort((a, b) => a - b)
    .map((num) => buildDistrict(`${prefix}-${num}`, distMap.get(num)));
}

function main() {
  const d = __dirname;

  const senate2022Text = extractPdfText(path.join(d, FILE_SENATE_2022));
  const senate2024Text = extractPdfText(path.join(d, FILE_SENATE_2024));
  const house2024Text = extractPdfText(path.join(d, FILE_HOUSE_2024));

  const senate2022 = extractDistricts(senate2022Text, 'SENATE');
  const senate2024 = extractDistricts(senate2024Text, 'SENATE');
  const house2024 = extractDistricts(house2024Text, 'REPRESENTATIVE');

  const senateMap = new Map(senate2022);
  for (const [num, candidates] of senate2024) {
    senateMap.set(num, candidates);
  }

  const senate = toDistrictList(senateMap, 'il-sd');
  const house = toDistrictList(house2024, 'il-hd');

  const output = { house, senate };
  fs.writeFileSync(path.join(d, 'il-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`House districts:  ${house.length}`);
  console.log(`Senate districts: ${senate.length}`);
}

main();
