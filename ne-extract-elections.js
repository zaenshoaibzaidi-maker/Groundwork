'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PDF_2024 = 'NE 2024 General Election Results.pdf'; // odd districts
const PDF_2022 = 'NE 2022 General Election Results.pdf'; // even districts

const TOTAL_DISTRICTS = 49;

const PARTY_BY_DISTRICT = {
  1: 'rep', 2: 'rep', 3: 'ind', 4: 'rep', 5: 'dem', 6: 'dem', 7: 'dem', 8: 'ind', 9: 'dem', 10: 'dem',
  11: 'dem', 12: 'rep', 13: 'dem', 14: 'rep', 15: 'rep', 16: 'rep', 17: 'rep', 18: 'rep', 19: 'rep', 20: 'dem',
  21: 'rep', 22: 'rep', 23: 'rep', 24: 'rep', 25: 'rep', 26: 'dem', 27: 'dem', 28: 'dem', 29: 'dem', 30: 'rep',
  31: 'rep', 32: 'rep', 33: 'rep', 34: 'rep', 35: 'dem', 36: 'rep', 37: 'rep', 38: 'rep', 39: 'rep', 40: 'rep',
  41: 'rep', 42: 'rep', 43: 'rep', 44: 'rep', 45: 'rep', 46: 'dem', 47: 'rep', 48: 'rep', 49: 'rep',
};

// Each district renders as its own bordered table: a header row of candidate
// names (winner's surname suffixed with a literal checkmark glyph), a Total
// row, then per-county breakdown rows we don't need. Two districts sit
// side-by-side per page, so we recover district numbers from the plain-text
// "Legislative District N" headers (which appear in the same left-to-right,
// top-to-bottom order as extract_tables() returns the tables) and zip them
// together rather than trying to geometrically match table to header.
//
// pdfplumber's line-detection table extractor occasionally slices a single
// vote total in two at a stray column boundary (e.g. "2,965" -> "2,96","5").
// merge_tokens() in the embedded script repairs that by concatenating
// fragments until they match the comma-grouped number format.
const PY_EXTRACT = path.join('/tmp', 'ne_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, re, sys

def merge_tokens(tokens):
    merged = []
    buf = ''
    for t in tokens:
        buf += t
        if re.fullmatch(r'\\d{1,3}(,\\d{3})*', buf):
            merged.append(buf)
            buf = ''
    if buf:
        merged.append(buf)
    return merged

def extract(pdf_path):
    districts = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ''
            headers = re.findall(r'Legislative District (\\d+)', text)
            tables = page.extract_tables()
            if len(headers) != len(tables):
                raise ValueError(f'header/table count mismatch: {len(headers)} vs {len(tables)}')
            for h, t in zip(headers, tables):
                header_row = t[0]
                total_row = next((r for r in t if 'Total' in r), None)
                names = [c.replace('\\n', ' ') for c in header_row if c and c != 'County']
                votes_raw = [c for c in total_row if c not in (None, '', 'Total')]
                votes = merge_tokens(votes_raw)
                if len(names) != len(votes):
                    raise ValueError(f'district {h}: name/vote count mismatch {names} {votes}')
                candidates = [
                    {'name': n, 'votes': int(v.replace(',', ''))}
                    for n, v in zip(names, votes)
                ]
                districts.append({'district': int(h), 'candidates': candidates})
    return districts

if __name__ == '__main__':
    print(json.dumps(extract(sys.argv[1])))
`
);

function extractDistricts(pdfPath) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath], { maxBuffer: 200 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

function isWriteIn(name) {
  return /write-in|scattering/i.test(name);
}

function buildDistrict(raw, electionYear) {
  const districtNum = raw.district;

  // Strip "(By Petition)" suffixes and the checkmark glyph, tracking which
  // raw candidate (if any) was checkmarked before write-ins are dropped.
  const candidates = raw.candidates.map((c) => ({
    name: c.name.replace(/\s*\(By Petition\)\s*/g, '').replace('✔', '').trim(),
    votes: c.votes,
    checked: c.name.includes('✔'),
    writeIn: isWriteIn(c.name),
  }));

  const totalVotes = candidates.reduce((s, c) => s + c.votes, 0);

  // The 2024 PDF marks the winner with a checkmark; the 2022 PDF carries no
  // checkmark glyphs at all, so fall back to the top vote-getter (which is
  // also how Nebraska itself defines the winner: "Elected per Office: Top
  // vote-getter").
  const checkedCandidate = candidates.find((c) => c.checked);
  const winner = checkedCandidate || [...candidates].sort((a, b) => b.votes - a.votes)[0];

  return {
    districtId: `ne-ld-${districtNum}`,
    winner: winner.name,
    winnerParty: PARTY_BY_DISTRICT[districtNum],
    totalVotes,
    candidates: candidates
      .filter((c) => !c.writeIn)
      .map((c) => ({ name: c.name, votes: c.votes })),
    electionYear,
  };
}

function main() {
  const d = __dirname;

  const raw2024 = extractDistricts(path.join(d, PDF_2024));
  const odd = raw2024
    .filter((r) => r.district % 2 === 1)
    .map((r) => buildDistrict(r, 2024));

  const raw2022 = extractDistricts(path.join(d, PDF_2022));
  const even = raw2022
    .filter((r) => r.district % 2 === 0)
    .map((r) => buildDistrict(r, 2022));

  const districts = [...odd, ...even].sort(
    (a, b) => parseInt(a.districtId.split('-')[2], 10) - parseInt(b.districtId.split('-')[2], 10)
  );

  fs.writeFileSync(
    path.join(d, 'ne-elections-data.json'),
    JSON.stringify({ districts }, null, 2)
  );

  console.log(`District count: ${districts.length} / ${TOTAL_DISTRICTS}`);
  const missing = [];
  for (let i = 1; i <= TOTAL_DISTRICTS; i++) {
    if (!districts.find((dd) => dd.districtId === `ne-ld-${i}`)) missing.push(i);
  }
  console.log(`Missing districts: ${missing.length ? missing.join(', ') : 'none'}`);
}

main();
