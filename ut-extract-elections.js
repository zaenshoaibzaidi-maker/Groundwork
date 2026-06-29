'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PDF_2024 = 'UT 2024 General Election Results.pdf';

const HOUSE_DISTRICTS = 75;
const SENATE_DISTRICTS = 29;

// UT's results PDF renders each race as
// "State Senate 2 (Multi-County) <icon>Follow\nCandidate Percentage Votes\n"
// followed by one (NAME, PARTY, "PCT% VOTES") triplet per candidate, ending
// at "Localities reporting ...". The icon before "Follow" is a private-use
// glyph (), hence the \S* in the header regex rather than a literal
// space.
const PY_EXTRACT = path.join('/tmp', 'ut_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, re, sys

def extract(pdf_path, chamber):
    with pdfplumber.open(pdf_path) as pdf:
        text = '\\n'.join((page.extract_text() or '') for page in pdf.pages)

    header_re = re.compile(
        r'State ' + chamber + r' (\\d+)(?: \\([^)]*\\))?\\s*\\S*Follow\\nCandidate Percentage Votes\\n'
    )
    headers = list(header_re.finditer(text))

    races = []
    for i, m in enumerate(headers):
        district = int(m.group(1))
        start = m.end()
        end = headers[i + 1].start() if i + 1 < len(headers) else len(text)
        block = text[start:end].split('Localities reporting')[0]
        lines = [l.strip() for l in block.split('\\n') if l.strip()]

        candidates = []
        j = 0
        while j < len(lines):
            if j + 2 < len(lines) and re.match(r'^[\\d.]+%\\s+[\\d,]+\$', lines[j + 2]):
                name, party, votes_line = lines[j], lines[j + 1], lines[j + 2]
                pct = float(votes_line.split('%')[0])
                candidates.append({'name': name, 'party': party, 'pct': pct})
                j += 3
            else:
                j += 1

        if not candidates:
            raise ValueError(f'{chamber} {district}: no candidates parsed from block: {block!r}')

        races.append({'district': district, 'candidates': candidates})

    return races

if __name__ == '__main__':
    print(json.dumps(extract(sys.argv[1], sys.argv[2])))
`
);

function extractChamber(pdfPath, chamber) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath, chamber], { maxBuffer: 50 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

const PARTY_MAP = {
  Republican: 'R',
  Democratic: 'D',
  Libertarian: 'LIB',
  Unaffiliated: 'UNA',
  Constitution: 'CON',
  'United Utah Party': 'UUP',
  'Utah Forward': 'IND',
};

function partyLetter(party) {
  return PARTY_MAP[party] || party;
}

const MAJOR_PARTIES = new Set(['R', 'D']);

// Names are rendered ALL CAPS as "FIRST M. LAST" with occasional quoted
// nicknames ('SGT SAM') and trailing generational suffixes (LAUDE JR), so
// the surname is the last token once those are stripped.
function lastName(rawName) {
  const stripped = rawName.replace(/'[^']*'/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = stripped.split(' ');
  while (tokens.length > 1 && /^(Jr\.?|Sr\.?|II|III|IV|V)$/i.test(tokens[tokens.length - 1])) {
    tokens.pop();
  }
  const last = tokens[tokens.length - 1];
  return last.toLowerCase().replace(/(^|['-])([a-z])/g, (_, sep, c) => sep + c.toUpperCase());
}

function buildRecord(district, rawCandidates) {
  const candidates = rawCandidates.map((c) => ({ ...c, partyCode: partyLetter(c.party) }));
  const winner = candidates.reduce((a, b) => (b.pct > a.pct ? b : a));
  const record = {
    district,
    winner: lastName(winner.name),
    party: winner.partyCode,
    pct: winner.pct,
    opposed: candidates.length > 1,
  };
  if (record.opposed) {
    const runnerUp = candidates
      .filter((c) => c !== winner && MAJOR_PARTIES.has(c.partyCode))
      .sort((a, b) => b.pct - a.pct)[0];
    if (runnerUp) {
      record.runnerUp = lastName(runnerUp.name);
      record.runnerUpParty = runnerUp.partyCode;
      record.runnerUpPct = runnerUp.pct;
    }
  }
  return record;
}

function extractFrom2024(pdfPath) {
  const senate = extractChamber(pdfPath, 'Senate').map((r) => buildRecord(r.district, r.candidates));
  const house = extractChamber(pdfPath, 'House').map((r) => buildRecord(r.district, r.candidates));
  return { senate, house };
}

// UT 2022 General Election Results.pdf has no text layer at all (every page
// is a rasterized image of the canvass spreadsheet, 0 chars per page in
// pdfplumber), so it can't be parsed with the regex approach used above.
// Its "Multi-County Districts" tab was read visually (pages rendered to PNG
// and rotated into a normal landscape table) and covers only 8 of the 14
// senate seats up in 2022: 1, 5, 7, 11, 18, 19, 20, 28. The other 6 seats
// (6, 9, 13, 14, 21, 23) are single-county races that the statewide PDF
// explicitly excludes ("contact the appropriate county clerk's office"),
// and were supplied separately from county-level canvass results.
const SENATE_2022 = [
  { district: 1, winner: 'Sandall', party: 'R', pct: 100.0, opposed: false },
  { district: 5, winner: 'Millner', party: 'R', pct: 59.32, opposed: true, runnerUp: 'Blodgett', runnerUpParty: 'D', runnerUpPct: 35.61 },
  { district: 6, winner: 'Stevenson', party: 'R', pct: 100.0, opposed: false },
  { district: 7, winner: 'Adams', party: 'R', pct: 71.94, opposed: true },
  { district: 9, winner: 'Plumb', party: 'D', pct: 99.36, opposed: true },
  { district: 11, winner: 'Thatcher', party: 'R', pct: 100.0, opposed: false },
  { district: 13, winner: 'Blouin', party: 'D', pct: 71.76, opposed: true, runnerUp: 'Stout', runnerUpParty: 'R', runnerUpPct: 28.24 },
  { district: 14, winner: 'Pitcher', party: 'D', pct: 62.21, opposed: true, runnerUp: 'Sorensen', runnerUpParty: 'R', runnerUpPct: 36.01 },
  { district: 18, winner: 'McCay', party: 'R', pct: 66.39, opposed: true, runnerUp: 'Voutaz', runnerUpParty: 'D', runnerUpPct: 28.49 },
  { district: 19, winner: 'Cullimore', party: 'R', pct: 58.44, opposed: true, runnerUp: 'Bond', runnerUpParty: 'D', runnerUpPct: 34.68 },
  { district: 20, winner: 'Winterton', party: 'R', pct: 68.69, opposed: true, runnerUp: 'Fellow', runnerUpParty: 'D', runnerUpPct: 31.31 },
  { district: 21, winner: 'Kennedy', party: 'R', pct: 100.0, opposed: false },
  { district: 23, winner: 'Grover', party: 'R', pct: 100.0, opposed: false },
  { district: 28, winner: 'Vickers', party: 'R', pct: 80.89, opposed: true },
];

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

  const { senate: senate2024, house } = extractFrom2024(path.join(d, PDF_2024));

  const senate = senate2024.concat(SENATE_2022).sort((a, b) => a.district - b.district);
  house.sort((a, b) => a.district - b.district);

  checkComplete(senate, SENATE_DISTRICTS, 'Senate');
  checkComplete(house, HOUSE_DISTRICTS, 'House');

  fs.writeFileSync(path.join(d, 'ut-elections-data.json'), JSON.stringify({ senate, house }, null, 2));
  console.log('Written to ut-elections-data.json');
}

main();
