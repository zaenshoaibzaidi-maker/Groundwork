'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PDF_2024 = 'WA 2024 General Election Results.pdf';
const PDF_2022 = 'WA 2022 General Election Results.pdf';

const TOTAL_DISTRICTS = 49;

// Washington's results pages render each race as
// "Legislative District N - State Senator County Results & Map" (or
// "...Representative Pos. 1/2...") in either all-caps or title-case,
// followed by "Candidate Vote Vote %", then one (Name (Party), "Votes
// Pct%") pair per candidate (WRITE-IN has no party and is skipped), ending
// at "Total Votes <n>". Page boundaries inject a repeated date/title line
// and a footer URL line mid-block, which are stripped before parsing.
const PY_EXTRACT = path.join('/tmp', 'wa_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, re, sys

NOISE_RES = [
    re.compile(r'^\\d{1,2}/\\d{1,2}/\\d{2,4},\\s*\\d{1,2}:\\d{2}\\s*[AP]M Legislative - All Results\$'),
    re.compile(r'^https://results\\.vote\\.wa\\.gov/'),
]

def extract(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = '\\n'.join((page.extract_text() or '') for page in pdf.pages)

    lines = text.split('\\n')
    lines = [l for l in lines if not any(r.match(l) for r in NOISE_RES)]
    text = '\\n'.join(lines)

    header_re = re.compile(
        r'Legislative District (\\d+) - State (Senator|Representative Pos\\. ([12]))'
        r' County Results & Map\\nCandidate Vote Vote %\\n',
        re.IGNORECASE,
    )
    headers = list(header_re.finditer(text))

    races = []
    for i, m in enumerate(headers):
        district = int(m.group(1))
        chamber = 'senate' if m.group(2).lower().startswith('senator') else f'house{m.group(3)}'
        start = m.end()
        end = headers[i + 1].start() if i + 1 < len(headers) else len(text)
        block = text[start:end].split('Total Votes')[0]
        block_lines = [l.strip() for l in block.split('\\n') if l.strip()]

        candidates = []
        j = 0
        while j < len(block_lines):
            if block_lines[j] == 'WRITE-IN':
                j += 2
                continue
            name_party = re.match(r'^(.+?)\\s+\\(([^)]+)\\)\$', block_lines[j])
            if not name_party:
                raise ValueError(f'{chamber} district {district}: unexpected line: {block_lines[j]!r}')
            votes_line = block_lines[j + 1]
            votes_m = re.match(r'^[\\d,]+\\s+([\\d.]+)%\$', votes_line)
            if not votes_m:
                raise ValueError(f'{chamber} district {district}: unexpected votes line: {votes_line!r}')
            candidates.append({
                'name': name_party.group(1).strip(),
                'party': name_party.group(2).strip(),
                'pct': float(votes_m.group(1)),
            })
            j += 2

        if not candidates:
            raise ValueError(f'{chamber} district {district}: no candidates parsed from block: {block!r}')

        races.append({'chamber': chamber, 'district': district, 'candidates': candidates})

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

// "Prefers Democratic Party" -> DEM, "Prefers Republican Party" /
// "Prefers GOP Party" -> REP, anything else (third-party preferences,
// "States No Party Preference", off-spelling self-descriptions like
// "Prefers Democrat Party") -> IND. Washington's top-two primary lets
// candidates write their own party-preference text, so this is read
// literally rather than inferred from D/R assumptions.
function normalizeParty(raw) {
  if (raw === 'Prefers Democratic Party') return 'DEM';
  if (raw === 'Prefers Republican Party' || raw === 'Prefers GOP Party') return 'REP';
  return 'IND';
}

function buildRace(candidates) {
  const sorted = candidates.slice().sort((a, b) => b.pct - a.pct);
  const winner = sorted[0];
  const record = {
    winner: winner.name,
    winnerParty: normalizeParty(winner.party),
    winnerPct: winner.pct,
    opposed: sorted.length > 1,
  };
  if (record.opposed) {
    const runnerUp = sorted[1];
    record.runnerUp = runnerUp.name;
    record.runnerUpParty = normalizeParty(runnerUp.party);
    record.runnerUpPct = runnerUp.pct;
  }
  return record;
}

function checkComplete(found, expected, label) {
  const missing = [];
  for (let i = 1; i <= expected; i++) {
    if (!found.has(i)) missing.push(i);
  }
  console.log(`${label}: ${found.size} / ${expected} districts`);
  if (missing.length) console.log(`  missing: ${missing.join(', ')}`);
  return missing.length === 0;
}

function main() {
  const d = __dirname;

  const races2024 = extractRaces(path.join(d, PDF_2024));
  const races2022 = extractRaces(path.join(d, PDF_2022));

  // Senate seats are elected on staggered 4-year terms, so each district's
  // Senate race shows up in only one of the two cycles -- except district 27,
  // which had races in both (a special election in 2022 followed by the
  // regular 2024 cycle). Prefer the more recent (2024) result when both exist.
  const senateByDistrict = new Map();
  for (const r of races2022.filter((r) => r.chamber === 'senate')) senateByDistrict.set(r.district, r);
  for (const r of races2024.filter((r) => r.chamber === 'senate')) senateByDistrict.set(r.district, r);

  const house1ByDistrict = new Map(
    races2024.filter((r) => r.chamber === 'house1').map((r) => [r.district, r])
  );
  const house2ByDistrict = new Map(
    races2024.filter((r) => r.chamber === 'house2').map((r) => [r.district, r])
  );

  checkComplete(senateByDistrict, TOTAL_DISTRICTS, 'Senate');
  checkComplete(house1ByDistrict, TOTAL_DISTRICTS, 'House Pos. 1');
  checkComplete(house2ByDistrict, TOTAL_DISTRICTS, 'House Pos. 2');

  const districts = [];
  for (let i = 1; i <= TOTAL_DISTRICTS; i++) {
    const senateRace = senateByDistrict.get(i);
    const house1Race = house1ByDistrict.get(i);
    const house2Race = house2ByDistrict.get(i);
    if (!senateRace || !house1Race || !house2Race) continue;
    districts.push({
      district: i,
      senator: buildRace(senateRace.candidates),
      rep1: buildRace(house1Race.candidates),
      rep2: buildRace(house2Race.candidates),
    });
  }

  console.log(`Districts complete: ${districts.length} / ${TOTAL_DISTRICTS}`);

  fs.writeFileSync(path.join(d, 'wa-elections-data.json'), JSON.stringify(districts, null, 2));
  console.log('Written to wa-elections-data.json');
}

main();
