'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PDF_2024 = 'AK 2024 General Election Results.pdf';
const PDF_2022 = 'AK 2022 General Election Results.pdf';

const SENATE_LETTERS = 'ABCDEFGHIJKLMNOPQRST'.split('');
const HOUSE_DISTRICTS = 40;

// Alaska Senate seats are on staggered 4-year terms, so each cycle's PDF
// only canvasses half the chamber: the 2024 PDF has B, D, F, H, J, L, N, P,
// R, T, and the 2022 PDF has the rest (including the one seat, T, that
// isn't in 2022 either because it was last contested in 2020). Preferring
// 2024 when present and falling back to 2022 covers all 20 districts.
//
// Alaska's results PDF renders each race as "<Chamber> District <id>\n...
// Candidate Party Total\n<Name, Party, Votes, Pct%>...\nWrite-in <votes>
// <pct>%\nTotal Votes <n>". Page boundaries inject a repeated
// "Page: N of M <timestamp>" line mid-block, which is stripped before
// parsing. Some candidate names wrap their quoted nickname onto its own
// line (before or after the "Last, First" line), so candidate lines are
// reassembled by accumulating text until it matches the full
// name/party/votes/pct pattern -- the Write-in row (and any nickname
// fragment that wrapped onto it) never matches and is discarded as leftover.
const PY_EXTRACT = path.join('/tmp', 'ak_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, re, sys

def extract(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = '\\n'.join((page.extract_text() or '') for page in pdf.pages)
    text = re.sub(r'Page: \\d+ of \\d+ [\\d/: APM]+\\n', '', text)

    header_re = re.compile(r'(Senate|House) District (\\w+)\\n')
    headers = list(header_re.finditer(text))

    races = []
    for i, m in enumerate(headers):
        chamber = 'senate' if m.group(1) == 'Senate' else 'house'
        district = m.group(2)
        start = m.end()
        end = headers[i + 1].start() if i + 1 < len(headers) else len(text)
        block = text[start:end]

        total_m = re.search(r'Total Votes ([\\d,]+)', block)
        if not total_m:
            raise ValueError(f'{chamber} district {district}: no Total Votes line found')
        total_votes = int(total_m.group(1).replace(',', ''))

        cand_block = block.split('Candidate Party Total', 1)[1].split('Total Votes', 1)[0]
        lines = [l.strip() for l in cand_block.split('\\n') if l.strip() and l.strip() != 'Total']

        candidates = []
        buf = ''
        for l in lines:
            buf = f'{buf} {l}'.strip() if buf else l
            cm = re.match(r'^(.+?)\\s+([A-Z]{2,4})\\s+([\\d,]+)\\s+([\\d.]+)%\$', buf)
            if cm:
                candidates.append({
                    'name': cm.group(1),
                    'party': cm.group(2),
                    'votes': int(cm.group(3).replace(',', '')),
                })
                buf = ''

        if not candidates:
            raise ValueError(f'{chamber} district {district}: no candidates parsed from block: {block!r}')

        races.append({'chamber': chamber, 'district': district, 'candidates': candidates, 'totalVotes': total_votes})

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

function normalizeParty(raw) {
  if (raw === 'REP') return 'rep';
  if (raw === 'DEM') return 'dem';
  return 'ind';
}

// Names are rendered "Last, First Middle Suffix" with occasional quoted
// nicknames that can wrap onto either side of the name (e.g. 'Bynum, Jeremy
// T.', '"Putuuqti" Fields, James'). Strip quoted segments, then take the
// first token after the comma as the display first name.
function displayName(rawName) {
  const cleaned = rawName.replace(/"[^"]*"/g, ' ').replace(/\s+/g, ' ').trim();
  const [last, rest] = cleaned.split(',').map((s) => s.trim());
  const first = rest.split(' ')[0];
  return `${first} ${last}`;
}

// HARDCODED_WINNERS overrides the first-round-votes proxy for the two known
// races where Alaska's ranked-choice tabulation produced a different winner
// than the first-round leader.
const HARDCODED_WINNERS = {
  'ak-sd-D': 'Bjorkman, Jesse J.',
  'ak-hd-36': 'Schwanke, Rebecca A.',
};

function buildRecord(districtId, candidates, totalVotes) {
  const demVotes = candidates.filter((c) => c.party === 'DEM').reduce((sum, c) => sum + c.votes, 0);
  const repVotes = candidates.filter((c) => c.party === 'REP').reduce((sum, c) => sum + c.votes, 0);

  const hardcoded = HARDCODED_WINNERS[districtId];
  let winner;
  if (hardcoded) {
    winner = candidates.find((c) => c.name === hardcoded);
    if (!winner) throw new Error(`${districtId}: hardcoded winner ${hardcoded} not found among candidates`);
  } else {
    const majority = candidates.find((c) => c.votes / totalVotes > 0.5);
    winner = majority || candidates.reduce((a, b) => (b.votes > a.votes ? b : a));
  }

  return {
    districtId,
    winner: displayName(winner.name),
    winnerParty: normalizeParty(winner.party),
    demVotes,
    repVotes,
    totalVotes,
    demPct: Math.round((demVotes / totalVotes) * 10000) / 100,
    repPct: Math.round((repVotes / totalVotes) * 10000) / 100,
    candidates: candidates.map((c) => ({ name: displayName(c.name), party: normalizeParty(c.party), votes: c.votes })),
  };
}

function checkComplete(found, expectedIds, label) {
  const missing = expectedIds.filter((id) => !found.has(id));
  console.log(`${label}: ${found.size} / ${expectedIds.length} districts`);
  if (missing.length) console.log(`  missing: ${missing.join(', ')}`);
}

function main() {
  const d = __dirname;

  const races2022 = extractRaces(path.join(d, PDF_2022));
  const races2024 = extractRaces(path.join(d, PDF_2024));

  const senateByLetter = new Map();
  for (const r of races2022.filter((r) => r.chamber === 'senate')) senateByLetter.set(r.district, r);
  for (const r of races2024.filter((r) => r.chamber === 'senate')) senateByLetter.set(r.district, r);

  const houseByDistrict = new Map(races2024.filter((r) => r.chamber === 'house').map((r) => [r.district, r]));

  checkComplete(senateByLetter, SENATE_LETTERS, 'Senate');
  checkComplete(
    new Set(houseByDistrict.keys()),
    Array.from({ length: HOUSE_DISTRICTS }, (_, i) => String(i + 1)),
    'House'
  );

  const districts = [];
  for (let i = 1; i <= HOUSE_DISTRICTS; i++) {
    const race = houseByDistrict.get(String(i));
    if (!race) continue;
    districts.push(buildRecord(`ak-hd-${i}`, race.candidates, race.totalVotes));
  }
  for (const letter of SENATE_LETTERS) {
    const race = senateByLetter.get(letter);
    if (!race) continue;
    districts.push(buildRecord(`ak-sd-${letter}`, race.candidates, race.totalVotes));
  }

  const houseCount = districts.filter((d) => d.districtId.startsWith('ak-hd-')).length;
  const senateCount = districts.filter((d) => d.districtId.startsWith('ak-sd-')).length;
  console.log(`House: ${houseCount} / ${HOUSE_DISTRICTS}`);
  console.log(`Senate: ${senateCount} / ${SENATE_LETTERS.length}`);

  fs.writeFileSync(path.join(d, 'ak-elections-data.json'), JSON.stringify(districts, null, 2));
  console.log('Written to ak-elections-data.json');
}

main();
