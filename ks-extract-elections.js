'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PDF_FILE = 'KS 2024 General Election Results.pdf';

const SENATE_TOTAL_DISTRICTS = 40;
const HOUSE_TOTAL_DISTRICTS = 125;

// The KS Secretary of State canvass renders cleanly as one candidate per
// line ("R-Name 12,345 67.89%"), so pdfplumber's plain extract_text() is
// enough - no word-position reconstruction needed like WI/MN.
const PY_EXTRACT = path.join('/tmp', 'ks_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, sys

def extract(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        return '\\n'.join(page.extract_text() or '' for page in pdf.pages)

if __name__ == '__main__':
    print(json.dumps({'text': extract(sys.argv[1])}))
`
);

function extractText(pdfPath) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath], {
    maxBuffer: 200 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString()).text;
}

const SENATE_RE = /^Kansas Senate (\d+)$/;
const HOUSE_RE = /^Kansas House of Representatives (\d+)$/;
const CANDIDATE_RE = /^([A-Za-z]{1,3})-(.+) ([\d,]+) (\d+\.\d+)%$/;

function partyCode(prefix) {
  if (prefix === 'R') return 'rep';
  if (prefix === 'D') return 'dem';
  if (prefix === 'L') return 'lib';
  return 'ind'; // UK, i
}

// Races run continuously across page breaks; only the "Kansas Secretary of
// State / <year> General Election / Official Vote Totals / Page N of M /
// Race Candidate Votes Percent" footer-header block repeats, so it's
// ignored rather than treated as a race boundary.
function parseRaces(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const districts = { senate: new Map(), house: new Map() };
  let current = null; // { chamber, district, candidates }

  function flush() {
    if (current && current.candidates.length) {
      districts[current.chamber].set(current.district, current.candidates);
    }
    current = null;
  }

  for (const line of lines) {
    const sm = line.match(SENATE_RE);
    if (sm) {
      flush();
      current = { chamber: 'senate', district: parseInt(sm[1], 10), candidates: [] };
      continue;
    }

    const hm = line.match(HOUSE_RE);
    if (hm) {
      flush();
      current = { chamber: 'house', district: parseInt(hm[1], 10), candidates: [] };
      continue;
    }

    const cm = line.match(CANDIDATE_RE);
    if (cm) {
      if (current) {
        current.candidates.push({
          name: cm[2].trim(),
          party: partyCode(cm[1]),
          votes: parseInt(cm[3].replace(/,/g, ''), 10),
        });
      }
      continue;
    }

    // Any other line (US House, judges, Board of Education, DA, page
    // footers/headers, etc.) ends the current target race, if any.
    flush();
  }
  flush();

  return districts;
}

function buildDistrict(districtId, candidates) {
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const winner = sorted[0];
  const totalVotes = candidates.reduce((s, c) => s + c.votes, 0);
  const demVotes = candidates.filter((c) => c.party === 'dem').reduce((s, c) => s + c.votes, 0);
  const repVotes = candidates.filter((c) => c.party === 'rep').reduce((s, c) => s + c.votes, 0);
  return {
    districtId,
    winner: winner.name,
    winnerParty: winner.party,
    demVotes,
    repVotes,
    totalVotes,
    demPct: totalVotes > 0 ? Math.round((demVotes / totalVotes) * 10000) / 100 : 0,
    repPct: totalVotes > 0 ? Math.round((repVotes / totalVotes) * 10000) / 100 : 0,
    candidates: sorted,
  };
}

function toDistrictList(distMap, prefix) {
  return [...distMap.keys()]
    .sort((a, b) => a - b)
    .map((num) => buildDistrict(`${prefix}-${num}`, distMap.get(num)));
}

function main() {
  const d = __dirname;

  const text = extractText(path.join(d, PDF_FILE));
  const { senate: senateMap, house: houseMap } = parseRaces(text);

  const senate = toDistrictList(senateMap, 'ks-sd');
  const house = toDistrictList(houseMap, 'ks-hd');

  const output = { house, senate };
  fs.writeFileSync(path.join(d, 'ks-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`House districts:  ${house.length} / ${HOUSE_TOTAL_DISTRICTS}`);
  console.log(`Senate districts: ${senate.length} / ${SENATE_TOTAL_DISTRICTS}`);
}

main();
