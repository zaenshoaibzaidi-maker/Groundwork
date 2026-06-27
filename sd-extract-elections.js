'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PDF = 'SD 2024 General Election Results.pdf';

const SENATE_TOTAL_DISTRICTS = 35;
// House districts 26 and 28 are dual-member districts split into single-
// member subdistricts (26A/26B, 28A/28B) rather than electing 2 at-large,
// so the House total is 35 - 2 + 4 = 37.
const HOUSE_TOTAL_DISTRICTS = 37;

const PARTY_MAP = {
  Republican: 'rep',
  Democratic: 'dem',
  Libertarian: 'lib',
  Independent: 'ind',
};

// pdfplumber's extract_text() renders each candidate row one of two ways
// depending on whether the SOS site's checkmark icon (a small image, not a
// text glyph) sits to the left of the name: a checked winner's name shares
// its line with "PCT% VOTES" and the party sits alone on the next line
// ("NAME 52% 5,050\nDemocratic"); everyone else gets three separate lines
// ("NAME\nPCT%\nParty VOTES"). That layout split is the only signal we have
// for who won, so the parser keys off it directly rather than reading
// checkmark images.
const PY_EXTRACT = path.join('/tmp', 'sd_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, re, sys

NOISE_RES = [
    re.compile(r'^\\d{1,2}/\\d{1,2}/\\d{2,4}, \\d{1,2}:\\d{2} [AP]M South Dakota Secretary of State$'),
    re.compile(r'^HOME MY TRACKED CONTESTS EXPORT$'),
    re.compile(r'^https://electionresults\\.sd\\.gov.*$'),
    re.compile(r'^FOLLOW THIS CONTEST.*$'),
    re.compile(r'^PRECINCTS FULLY:.*$'),
    re.compile(r'^MAP COUNTY RESULTS$'),
    re.compile(r'^STATEWIDE SENATE MAP STATEWIDE HOUSE MAP$'),
    re.compile(r'^LEGISLATIVE RACES$'),
    re.compile(r'^\\d+/\\d+$'),
]

HEADER_RE = re.compile(r'^STATE (SENATOR|REPRESENTATIVE) - DISTRICT (\\d+[AB]?)(?:\\(.*\\))?$')
TOTAL_RE = re.compile(r'^TOTAL VOTES ([\\d,]+)$')
CHECKED_RE = re.compile(r'^(.+?) (\\d+)% ([\\d,]+)$')
PCT_ONLY_RE = re.compile(r'^(\\d+)%$')
PARTY_VOTES_RE = re.compile(r'^([A-Za-z]+) ([\\d,]+)$')

def extract(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        full = '\\n'.join((p.extract_text() or '') for p in pdf.pages)

    lines = [l.strip() for l in full.split('\\n')]
    lines = [l for l in lines if l and not any(r.match(l) for r in NOISE_RES)]
    start = next(i for i, l in enumerate(lines) if l.startswith('STATE SENATOR'))
    lines = lines[start:]

    races = []
    i = 0
    while i < len(lines):
        m = HEADER_RE.match(lines[i])
        if not m:
            raise ValueError(f'expected header at line {i}: {lines[i]!r}')
        chamber, district = m.group(1), m.group(2)
        i += 1
        candidates = []
        pending_name = None
        total_votes = None
        while True:
            line = lines[i]
            tm = TOTAL_RE.match(line)
            if tm:
                total_votes = int(tm.group(1).replace(',', ''))
                i += 1
                break
            cm = CHECKED_RE.match(line)
            pm = PCT_ONLY_RE.match(line)
            vm = PARTY_VOTES_RE.match(line)
            if cm and pending_name is None:
                name, votes = cm.group(1), int(cm.group(3).replace(',', ''))
                i += 1
                party = lines[i]
                candidates.append({'name': name, 'party': party, 'votes': votes, 'checked': True})
                i += 1
            elif pm and pending_name is not None:
                i += 1
            elif vm and pending_name is not None:
                party, votes = vm.group(1), int(vm.group(2).replace(',', ''))
                candidates.append({'name': pending_name, 'party': party, 'votes': votes, 'checked': False})
                pending_name = None
                i += 1
            elif pending_name is None and not cm and not pm and not vm:
                pending_name = line
                i += 1
            else:
                raise ValueError(f'unexpected line {i}: {line!r} pending_name={pending_name!r}')
        races.append({
            'chamber': chamber,
            'district': district,
            'candidates': candidates,
            'totalVotes': total_votes,
        })
    return races

if __name__ == '__main__':
    print(json.dumps(extract(sys.argv[1])))
`
);

function extractRaces(pdfPath) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath], { maxBuffer: 200 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

function pct(votes, total) {
  return total > 0 ? Math.round((votes / total) * 1000) / 10 : 0;
}

function buildSenateDistrict(race) {
  const candidates = race.candidates;
  const winner = candidates.find((c) => c.checked);
  const demVotes = candidates.filter((c) => c.party === 'Democratic').reduce((s, c) => s + c.votes, 0);
  const repVotes = candidates.filter((c) => c.party === 'Republican').reduce((s, c) => s + c.votes, 0);
  const totalVotes = race.totalVotes;

  return {
    districtId: `sd-sd-${parseInt(race.district, 10)}`,
    winner: winner.name,
    winnerParty: PARTY_MAP[winner.party],
    demVotes,
    repVotes,
    totalVotes,
    demPct: pct(demVotes, totalVotes),
    repPct: pct(repVotes, totalVotes),
    candidates: candidates.map((c) => ({ name: c.name, party: PARTY_MAP[c.party], votes: c.votes })),
  };
}

function buildHouseDistrict(race) {
  const candidates = race.candidates;
  const winners = candidates.filter((c) => c.checked);
  const demVotes = candidates.filter((c) => c.party === 'Democratic').reduce((s, c) => s + c.votes, 0);
  const repVotes = candidates.filter((c) => c.party === 'Republican').reduce((s, c) => s + c.votes, 0);
  const totalVotes = race.totalVotes;

  const districtNum = /^\d+$/.test(race.district) ? String(parseInt(race.district, 10)) : race.district;

  return {
    districtId: `sd-hd-${districtNum}`,
    winners: winners.map((c) => ({ name: c.name, party: PARTY_MAP[c.party] })),
    demVotes,
    repVotes,
    totalVotes,
    demPct: pct(demVotes, totalVotes),
    repPct: pct(repVotes, totalVotes),
    candidates: candidates.map((c) => ({ name: c.name, party: PARTY_MAP[c.party], votes: c.votes })),
  };
}

function main() {
  const d = __dirname;
  const races = extractRaces(path.join(d, PDF));

  const senate = races
    .filter((r) => r.chamber === 'SENATOR')
    .map(buildSenateDistrict)
    .sort((a, b) => parseInt(a.districtId.split('-')[2], 10) - parseInt(b.districtId.split('-')[2], 10));

  const house = races
    .filter((r) => r.chamber === 'REPRESENTATIVE')
    .map(buildHouseDistrict)
    .sort((a, b) => a.districtId.localeCompare(b.districtId, undefined, { numeric: true }));

  fs.writeFileSync(
    path.join(d, 'sd-elections-data.json'),
    JSON.stringify({ senate, house }, null, 2)
  );

  console.log(`Senate: ${senate.length} (expected ${SENATE_TOTAL_DISTRICTS})`);
  console.log(`House: ${house.length} (expected ${HOUSE_TOTAL_DISTRICTS})`);
}

main();
