'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PDF = 'AZ 2024 General Election Results.pdf';

const SENATE_DISTRICTS = 30;
const HOUSE_DISTRICTS = 30;

// The AZ SOS results page renders each race one of two ways:
//   1. Table layout ("Choice Votes Percent" header, one row per candidate) —
//      used for Senate races with 3+ candidates and any unopposed race.
//   2. Side-by-side layout (two "Name (PARTY)" pairs, then a percent line,
//      then a votes line) — used whenever exactly 2 candidates ran, for
//      both Senate (1 seat) and House (2 seats) races.
// House races almost always use the table layout because 3 candidates run
// for 2 seats; the percent column there is votes / total ballots cast for
// the race, which is the same denominator across all candidates in that
// table, so partisanPct is just the sum of the Democratic candidates'
// listed percentages (no need to re-derive a total from raw vote counts).
const PY_EXTRACT = path.join('/tmp', 'az_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, re, sys

def extract(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = '\\n'.join((page.extract_text() or '') for page in pdf.pages)

    # Drop the repeated page header/footer chrome so it can't land inside a
    # district block (it sits between the last race on one page and the
    # first on the next).
    lines = text.split('\\n')
    noise_prefixes = (
        '6/28/26', 'County Results', 'Precincts Reporting', 'Featured',
        'Last Updated', 'Help (', 'Contact (', '\\u00a9',
    )
    lines = [
        l for l in lines
        if not l.startswith(noise_prefixes) and 'results.arizona.vote' not in l and l != 'LEGISLATIVE'
    ]
    text = '\\n'.join(lines)

    header_re = re.compile(
        r'State (Senator|Representative) - District No\\. (\\d+) .*?View More\\n2 Year Term \\| Elect (\\d)'
    )
    headers = list(header_re.finditer(text))

    races = []
    for i, m in enumerate(headers):
        chamber, district, elect = m.group(1), int(m.group(2)), int(m.group(3))
        start = m.end()
        end = headers[i + 1].start() if i + 1 < len(headers) else len(text)
        block_lines = [l.strip() for l in text[start:end].split('\\n') if l.strip()]

        candidates = []
        if block_lines and block_lines[0] == 'Choice Votes Percent':
            for row in block_lines[1:]:
                rm = re.match(r'^(.+?)\\s+\\(([A-Z]+)\\)\\s+([\\d,]+)\\s+([\\d.]+)%\$', row)
                if not rm:
                    raise ValueError(f'{chamber} {district}: could not parse table row: {row!r}')
                candidates.append({
                    'name': rm.group(1).strip(),
                    'party': rm.group(2),
                    'votes': int(rm.group(3).replace(',', '')),
                    'pct': float(rm.group(4)),
                })
        else:
            if len(block_lines) != 3:
                raise ValueError(f'{chamber} {district}: unexpected block shape: {block_lines!r}')
            names_re = re.match(r'^(.+?)\\s+\\(([A-Z]+)\\)\\s+(.+?)\\s+\\(([A-Z]+)\\)\$', block_lines[0])
            pct_re = re.match(r'^([\\d.]+)%\\s+([\\d.]+)%\$', block_lines[1])
            if not names_re or not pct_re:
                raise ValueError(f'{chamber} {district}: could not parse side-by-side block: {block_lines!r}')
            candidates.append({'name': names_re.group(1).strip(), 'party': names_re.group(2), 'pct': float(pct_re.group(1))})
            candidates.append({'name': names_re.group(3).strip(), 'party': names_re.group(4), 'pct': float(pct_re.group(2))})

        races.append({'chamber': chamber, 'district': district, 'elect': elect, 'candidates': candidates})

    return races

if __name__ == '__main__':
    print(json.dumps(extract(sys.argv[1])))
`
);

function extractRaces(pdfPath) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath], { maxBuffer: 50 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

const PARTY_MAP = { REP: 'R', DEM: 'D', GRN: 'G', LIB: 'L', IND: 'I' };

function partyLetter(code) {
  return PARTY_MAP[code] || code[0];
}

// Names are rendered "Last, First Middle "Nickname", Suffix (PARTY)", so the
// surname is always the text before the first comma.
function lastName(rawName) {
  return rawName.split(',')[0].trim();
}

function buildSenate(race) {
  const candidates = race.candidates;
  const winner = candidates[0];
  const record = {
    district: race.district,
    winner: lastName(winner.name),
    party: partyLetter(winner.party),
    pct: winner.pct,
    opposed: candidates.length > 1,
  };
  if (record.opposed) {
    const runnerUp = candidates[1];
    record.runnerUp = { lastName: lastName(runnerUp.name), party: partyLetter(runnerUp.party) };
  }
  return record;
}

function buildHouse(race) {
  const candidates = race.candidates;
  const winners = candidates.slice(0, 2).map((c) => ({
    lastName: lastName(c.name),
    party: partyLetter(c.party),
    pct: c.pct,
  }));
  const demPctSum = candidates.filter((c) => c.party === 'DEM').reduce((s, c) => s + c.pct, 0);
  return {
    district: race.district,
    winners,
    partisanPct: Math.round(demPctSum * 100) / 100,
  };
}

function checkComplete(records, expected, label) {
  const found = new Set(records.map((r) => r.district));
  const missing = [];
  for (let i = 1; i <= expected; i++) {
    if (!found.has(i)) missing.push(i);
  }
  console.log(`${label}: ${records.length} / ${expected} districts`);
  if (missing.length) console.log(`  missing: ${missing.join(', ')}`);
}

function main() {
  const d = __dirname;

  const races = extractRaces(path.join(d, PDF));

  const senate = races
    .filter((r) => r.chamber === 'Senator')
    .map(buildSenate)
    .sort((a, b) => a.district - b.district);

  const house = races
    .filter((r) => r.chamber === 'Representative')
    .map(buildHouse)
    .sort((a, b) => a.district - b.district);

  checkComplete(senate, SENATE_DISTRICTS, 'Senate');
  checkComplete(house, HOUSE_DISTRICTS, 'House');

  fs.writeFileSync(path.join(d, 'az-elections-data.json'), JSON.stringify({ senate, house }, null, 2));
  console.log('Written to az-elections-data.json');
}

main();
