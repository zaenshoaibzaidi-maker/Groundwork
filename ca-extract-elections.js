'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PDF_2022 = 'CA 2022 General Election Results.pdf';
const PDF_2024 = 'CA 2024 General Election Results.pdf';

const SENATE_DISTRICTS = 40;
const ASSEMBLY_DISTRICTS = 80;

// CA's results PDFs render races in a two-column "snake" layout: each page
// is read down the left column, then down the right column, continuing the
// same sequential race list into the next page. pdfplumber's extract_text()
// instead merges the two columns row-by-row into single lines, which
// interleaves unrelated races, so this script splits words by x0 (< 280pt
// = left column) and rebuilds each column's lines independently before
// concatenating left-then-right, page by page, into one ordered text
// stream. Each race then appears as a "<Office> District N Votes
// Percent" header line followed by one "Name[*], PARTY votes pct%" line
// per candidate (first listed = winner; no ** marker is used).
const PY_EXTRACT = path.join('/tmp', 'ca_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, re, sys

def col_lines(words, lo, hi):
    sel = [w for w in words if lo <= w['x0'] < hi]
    sel.sort(key=lambda w: (round(w['top']), w['x0']))
    rows = []
    current = []
    last_top = None
    for w in sel:
        if last_top is not None and abs(w['top'] - last_top) > 3:
            rows.append(current)
            current = []
        current.append(w['text'])
        last_top = w['top']
    if current:
        rows.append(current)
    return [' '.join(r) for r in rows]

def master_text(pdf_path):
    lines = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            words = page.extract_words()
            lines += col_lines(words, 0, 280)
            lines += col_lines(words, 280, 10000)
    return '\\n'.join(lines)

HEADER_RE = re.compile(
    r'^(State Senate District|State Assembly Member District) (\\d+) Votes Percent\$',
    re.MULTILINE,
)
CAND_RE = re.compile(r'^(.+?),\\s*([A-Z/]+)\\s+([\\d,]+)\\s+([\\d.]+)%\$')

def extract(pdf_path):
    text = master_text(pdf_path)
    headers = list(HEADER_RE.finditer(text))
    races = []
    for i, m in enumerate(headers):
        chamber = 'senate' if m.group(1).startswith('State Senate') else 'assembly'
        district = int(m.group(2))
        start = m.end() + 1
        end = headers[i + 1].start() if i + 1 < len(headers) else len(text)
        block_lines = [l.strip() for l in text[start:end].split('\\n') if l.strip()]

        candidates = []
        for line in block_lines:
            cm = CAND_RE.match(line)
            if not cm:
                break
            candidates.append({
                'name': cm.group(1).rstrip('*').strip(),
                'party': cm.group(2),
                'votes': int(cm.group(3).replace(',', '')),
                'pct': float(cm.group(4)),
            })

        if not candidates:
            raise ValueError(f'{chamber} district {district}: no candidates parsed from block: {block_lines[:3]!r}')

        races.append({'chamber': chamber, 'district': district, 'candidates': candidates})

    return races

if __name__ == '__main__':
    print(json.dumps(extract(sys.argv[1])))
`
);

function extractPdf(pdfPath) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath], { maxBuffer: 50 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

const PARTY_MAP = { DEM: 'DEM', REP: 'REP' };

function normalizeParty(party) {
  return PARTY_MAP[party] || 'IND';
}

function buildRecord(districtId, chamber, candidates) {
  const winner = candidates[0];
  const record = {
    districtId,
    chamber,
    winner: winner.name,
    winnerParty: normalizeParty(winner.party),
    winnerPct: winner.pct,
    opposed: candidates.length > 1,
  };
  if (record.opposed) {
    const runnerUp = candidates.slice(1).reduce((a, b) => (b.votes > a.votes ? b : a));
    record.runnerUp = runnerUp.name;
    record.runnerUpParty = normalizeParty(runnerUp.party);
    record.runnerUpPct = runnerUp.pct;
  }
  return record;
}

function checkComplete(records, expected, label) {
  const found = new Set(records.map((r) => r.districtNum));
  const missing = [];
  for (let i = 1; i <= expected; i++) {
    if (!found.has(i)) missing.push(i);
  }
  console.log(`${label}: ${records.length} / ${expected} districts`);
  if (missing.length) console.log(`  missing: ${missing.join(', ')}`);
  return missing.length === 0 && records.length === expected;
}

function main() {
  const d = __dirname;

  const races2022 = extractPdf(path.join(d, PDF_2022));
  const races2024 = extractPdf(path.join(d, PDF_2024));

  const senate2022 = races2022.filter((r) => r.chamber === 'senate' && r.district % 2 === 0);
  const senate2024 = races2024.filter((r) => r.chamber === 'senate' && r.district % 2 === 1);
  const assembly2024 = races2024.filter((r) => r.chamber === 'assembly');

  const senate = senate2022
    .concat(senate2024)
    .map((r) => ({ ...buildRecord(`SD-${r.district}`, 'senate', r.candidates), districtNum: r.district }))
    .sort((a, b) => a.districtNum - b.districtNum);

  const assembly = assembly2024
    .map((r) => ({ ...buildRecord(`AD-${r.district}`, 'assembly', r.candidates), districtNum: r.district }))
    .sort((a, b) => a.districtNum - b.districtNum);

  const senateOk = checkComplete(senate, SENATE_DISTRICTS, 'Senate');
  const assemblyOk = checkComplete(assembly, ASSEMBLY_DISTRICTS, 'Assembly');

  const districts = senate.concat(assembly).map(({ districtNum, ...rest }) => rest);

  fs.writeFileSync(path.join(d, 'ca-elections-data.json'), JSON.stringify(districts, null, 2));
  console.log('Written to ca-elections-data.json');

  if (!senateOk || !assemblyOk) {
    process.exitCode = 1;
  }
}

main();
