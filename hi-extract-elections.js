'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PDF_2022 = 'HI 2022 General Election Results.pdf';
const PDF_2024 = 'HI 2024 General Election Results.pdf';

const HOUSE_DISTRICTS = 51;
const SENATE_DISTRICTS = 25;

const SENATE_2024_DISTRICTS = [1, 3, 4, 6, 7, 12, 16, 18, 19, 22, 23, 24];
const SENATE_2022_DISTRICTS = [2, 5, 8, 9, 10, 11, 13, 14, 15, 17, 20, 21, 25];

// Hawaii's results PDFs are laid out as 3 newspaper-style columns per page
// (each ~1/3 of page width, flowing independently top-to-bottom), which
// pdfplumber's plain extract_text() jumbles together because it reads by
// row position across the full page width. Splitting words into columns by
// x0 first, then reconstructing rows within each column by clustering on
// 'top', recovers each column's correct internal order. Each race renders as
// "State Senator/Representative, Dist N" followed by "(PARTY) NAME, First
// votes pct%" lines, terminated by "Blank Votes:"/"Over Votes:" lines.
const PY_EXTRACT = path.join('/tmp', 'hi_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, re, sys

HEADER_RE = re.compile(r'^State (Senator|Representative), Dist (\\d+)\$')
CANDIDATE_RE = re.compile(r'^\\(([A-Z]{1,4})\\)\\s+(.+?)\\s+([\\d,]+)\\s+[\\d.]+%\$')

def get_rows(words):
    words = sorted(words, key=lambda w: (w['top'], w['x0']))
    rows, current, last_top = [], [], None
    for w in words:
        if last_top is not None and abs(w['top'] - last_top) > 3:
            rows.append(current)
            current = []
        current.append(w)
        last_top = w['top']
    if current:
        rows.append(current)
    return rows

def extract(pdf_path):
    races = []
    pending = None

    def finalize():
        nonlocal pending
        if pending is not None:
            races.append(pending)
        pending = None

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            colw = page.width / 3
            cols = {0: [], 1: [], 2: []}
            for w in page.extract_words():
                ci = min(2, int(w['x0'] // colw))
                cols[ci].append(w)
            for ci in range(3):
                for row in get_rows(cols[ci]):
                    text = ' '.join(w['text'] for w in row)
                    m = HEADER_RE.match(text)
                    if m:
                        finalize()
                        pending = {'chamber': 'senate' if m.group(1) == 'Senator' else 'house',
                                   'district': int(m.group(2)), 'candidates': []}
                        continue
                    if pending is None:
                        continue
                    if text.startswith('Blank Votes:') or text.startswith('Over Votes:'):
                        continue
                    cm = CANDIDATE_RE.match(text)
                    if cm:
                        pending['candidates'].append({
                            'party': cm.group(1),
                            'name': cm.group(2),
                            'votes': int(cm.group(3).replace(',', '')),
                        })
                        continue
                    # any other line ends the race block (next section, footer, etc.)
                    finalize()
                # a race never spans columns -- each column is an independent
                # top-to-bottom flow, so anything still pending here is done.
                finalize()
        finalize()

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
  if (raw === 'D') return 'dem';
  if (raw === 'R') return 'rep';
  return 'ind';
}

function buildRecord(districtId, candidates) {
  const demVotes = candidates.filter((c) => c.party === 'dem').reduce((sum, c) => sum + c.votes, 0);
  const repVotes = candidates.filter((c) => c.party === 'rep').reduce((sum, c) => sum + c.votes, 0);
  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
  const winner = candidates.reduce((a, b) => (b.votes > a.votes ? b : a));

  return {
    districtId,
    winner: winner.name,
    winnerParty: winner.party,
    demVotes,
    repVotes,
    totalVotes,
    demPct: Math.round((demVotes / totalVotes) * 10000) / 100,
    repPct: Math.round((repVotes / totalVotes) * 10000) / 100,
    candidates: candidates.map((c) => ({ name: c.name, party: c.party, votes: c.votes })),
  };
}

function uncontestedRecord(districtId, winner, winnerParty) {
  return {
    districtId,
    winner,
    winnerParty,
    demVotes: 0,
    repVotes: 0,
    totalVotes: 0,
    demPct: 0,
    repPct: 0,
    candidates: [],
  };
}

// Surnames render in ALL CAPS, e.g. "TODD, Christopher L.T." or "DE LA CRUZ,
// Donovan M." -- title-case the surname and keep only the first token of the
// given name, dropping middle initials/suffixes/nicknames (e.g. "MARTIN,
// Austin D. (Shiloh)" -> "Austin Martin").
function titleCase(s) {
  return s.toLowerCase().replace(/(^|[\s'-])([a-z])/g, (m, sep, ch) => sep + ch.toUpperCase());
}

function displayName(rawName) {
  const commaIdx = rawName.indexOf(',');
  if (commaIdx === -1) return titleCase(rawName);
  const last = rawName.slice(0, commaIdx).trim();
  const rest = rawName.slice(commaIdx + 1).trim();
  const first = rest.split(/\s+/)[0] || '';
  return `${first} ${titleCase(last)}`.trim();
}

const HOUSE_UNCONTESTED = {
  1: ['Mark Nakashima', 'dem'],
  2: ['Sue Lee Loy', 'dem'],
  9: ['Justin Woodson', 'dem'],
  10: ['Tyson Miyake', 'dem'],
  18: ['Gene Ward', 'rep'],
  19: ['Mark Hashem', 'dem'],
  23: ['Ikaika Olds', 'dem'],
  25: ['Kim Coco Iwamoto', 'dem'],
  26: ['Della Au Belatti', 'dem'],
  28: ['Daniel Holt', 'dem'],
  33: ['Sam Satoru Kong', 'dem'],
  35: ['Cory Chun', 'dem'],
  36: ['Rachele Lamosao', 'dem'],
  43: ['Kanani Souza', 'rep'],
  44: ['Darius Kila', 'dem'],
  51: ['Lisa Marten', 'dem'],
};

const SENATE_UNCONTESTED = {
  1: ['Lorraine Inouye', 'dem'],
  4: ['Tim Richards', 'dem'],
  5: ['Gilbert Keith-Agaran', 'dem'],
  19: ['Henry Aquino', 'dem'],
  24: ['Jarrett Keohokalole', 'dem'],
  20: ['Kurt Fevella', 'rep'],
};

function checkComplete(found, expected, label) {
  const missing = [];
  for (let i = 1; i <= expected; i++) {
    if (!found.has(i)) missing.push(i);
  }
  console.log(`${label}: ${found.size} / ${expected} districts`);
  if (missing.length) console.log(`  missing: ${missing.join(', ')}`);
}

function main() {
  const d = __dirname;

  const races2022 = extractRaces(path.join(d, PDF_2022));
  const races2024 = extractRaces(path.join(d, PDF_2024));

  const houseByDistrict = new Map(races2024.filter((r) => r.chamber === 'house').map((r) => [r.district, r]));

  const senateByDistrict = new Map();
  for (const r of races2022.filter((r) => r.chamber === 'senate' && SENATE_2022_DISTRICTS.includes(r.district))) {
    senateByDistrict.set(r.district, r);
  }
  for (const r of races2024.filter((r) => r.chamber === 'senate' && SENATE_2024_DISTRICTS.includes(r.district))) {
    senateByDistrict.set(r.district, r);
  }

  const districts = [];

  for (let i = 1; i <= HOUSE_DISTRICTS; i++) {
    const districtId = `hi-hd-${i}`;
    if (HOUSE_UNCONTESTED[i]) {
      const [winner, winnerParty] = HOUSE_UNCONTESTED[i];
      districts.push(uncontestedRecord(districtId, winner, winnerParty));
      continue;
    }
    const race = houseByDistrict.get(i);
    if (!race) {
      console.log(`MISSING House district ${i}`);
      continue;
    }
    const candidates = race.candidates.map((c) => ({ ...c, name: displayName(c.name), party: normalizeParty(c.party) }));
    districts.push(buildRecord(districtId, candidates));
  }

  for (let i = 1; i <= SENATE_DISTRICTS; i++) {
    const districtId = `hi-sd-${i}`;
    if (SENATE_UNCONTESTED[i]) {
      const [winner, winnerParty] = SENATE_UNCONTESTED[i];
      districts.push(uncontestedRecord(districtId, winner, winnerParty));
      continue;
    }
    const race = senateByDistrict.get(i);
    if (!race) {
      console.log(`MISSING Senate district ${i}`);
      continue;
    }
    const candidates = race.candidates.map((c) => ({ ...c, name: displayName(c.name), party: normalizeParty(c.party) }));
    districts.push(buildRecord(districtId, candidates));
  }

  checkComplete(new Set(districts.filter((r) => r.districtId.startsWith('hi-hd-')).map((r) => Number(r.districtId.split('-')[2]))), HOUSE_DISTRICTS, 'House');
  checkComplete(new Set(districts.filter((r) => r.districtId.startsWith('hi-sd-')).map((r) => Number(r.districtId.split('-')[2]))), SENATE_DISTRICTS, 'Senate');

  fs.writeFileSync(path.join(d, 'hi-elections-data.json'), JSON.stringify(districts, null, 2));
  console.log('Written to hi-elections-data.json');
}

main();
