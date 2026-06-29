'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PDF_2022 = 'OR 2022 General Election Results.PDF';
const PDF_2024 = 'OR 2024 General Election Results.PDF';

const SENATE_DISTRICTS = 30;
const HOUSE_DISTRICTS = 60;

// Senate seats are on staggered 4-year terms, so each cycle's PDF only
// canvasses half the chamber. SD-18 is the exception: it ran in both
// (a special 2-year term in 2022, then the regular 2024 cycle), so the
// 2024 result is preferred for it.
const SENATE_2022_DISTRICTS = [3, 4, 6, 7, 8, 10, 11, 13, 15, 16, 17, 19, 20, 24, 26];
const SENATE_2024_DISTRICTS = [1, 2, 5, 9, 12, 14, 18, 21, 22, 23, 25, 27, 28, 29, 30];

// Oregon's abstract-of-votes PDFs render each race as
// "Nth District\n<surnames, winner prefixed with **> Misc.\nCounty <given
// name> (PARTY) <given name> (PARTY) ...\n<county votes rows>\nTotal/TOTAL
// <votes...>". The surname line and the "County" line are two stacked rows
// of the same header cell per candidate, so matching them up requires the
// words' x-coordinates rather than line text alone -- candidates can have
// multi-word surnames (e.g. "Boshart Davis", "Navarro Jr"), and given names
// can carry a parenthetical nickname (e.g. "Charles (Chick)") that looks
// like a party code but isn't all-uppercase. Single-county districts in the
// 2024 PDF omit the redundant Total line entirely, so totals fall back to
// summing the (single) county row in that case.
const PY_EXTRACT = path.join('/tmp', 'or_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, re, sys

def is_noise(text):
    if text == '** Elected':
        return True
    if text.startswith('Key |'):
        return True
    if 'Nonaffiliated' in text or 'Working Families' in text:
        return True
    if text.endswith('General Election Abstract of Votes'):
        return True
    return False

def get_rows(page):
    words = page.extract_words()
    words.sort(key=lambda w: (w['top'], w['x0']))
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

DISTRICT_RE = re.compile(r'^(\\d+)(?:st|nd|rd|th) District(?: \\(2 year term\\))?\$')
PARTY_TOKEN_RE = re.compile(r'^\\(([A-Z]{1,5})\\)\$')

def parse_county_row(row):
    candidates = []
    group_words, group_x0 = [], None
    for w in row[1:]:  # row[0] is the literal word "County"
        m = PARTY_TOKEN_RE.match(w['text'])
        if m:
            candidates.append({'x0': group_x0, 'given': ' '.join(group_words), 'party': m.group(1)})
            group_words, group_x0 = [], None
        else:
            if group_x0 is None:
                group_x0 = w['x0']
            group_words.append(w['text'])
    if group_words:
        raise ValueError(f'leftover words in county row without party: {group_words!r}')
    return candidates

def parse_surname_row(row, candidates):
    if row[-1]['text'] != 'Misc.':
        raise ValueError(f'expected trailing Misc., got {[w["text"] for w in row]!r}')
    groups = {i: [] for i in range(len(candidates))}
    winner_idx = None
    for w in row[:-1]:
        text = w['text']
        is_winner_token = text.startswith('**')
        if is_winner_token:
            text = text[2:]
        best_i = min(range(len(candidates)), key=lambda i: abs(w['x0'] - candidates[i]['x0']))
        groups[best_i].append(text)
        if is_winner_token:
            winner_idx = best_i
    if winner_idx is None:
        raise ValueError(f'no winner marker found in surname row: {[w["text"] for w in row]!r}')
    for i, c in enumerate(candidates):
        c['surname'] = ' '.join(groups[i])
        c['winner'] = (i == winner_idx)
    return candidates

def row_text(row):
    return ' '.join(w['text'] for w in row)

def extract(pdf_path):
    districts = []
    section = None
    pending = None

    def finalize():
        nonlocal pending
        if pending is None:
            return
        if pending['chamber'] not in ('senate', 'house'):
            pending = None
            return
        if pending['totalRow'] is not None:
            nums = [int(w['text'].replace(',', '')) for w in pending['totalRow'][1:]]
        else:
            nums = None
            for row in pending['dataRows']:
                row_nums = [int(w['text'].replace(',', '')) for w in row if re.match(r'^[\\d,]+\$', w['text'])]
                nums = row_nums if nums is None else [a + b for a, b in zip(nums, row_nums)]
        if nums is None:
            raise ValueError(f'no vote data for {pending["chamber"]} district {pending["district"]}')
        candidates = parse_county_row(pending['countyRow'])
        if len(candidates) != len(nums) - 1:
            raise ValueError(
                f'candidate/column mismatch in {pending["chamber"]} district {pending["district"]}: '
                f'{len(candidates)} candidates vs {len(nums)} vote columns'
            )
        candidates = parse_surname_row(pending['surnameRow'], candidates)
        for c, v in zip(candidates, nums[:-1]):
            c['votes'] = v
        districts.append({'chamber': pending['chamber'], 'district': pending['district'], 'candidates': candidates})
        pending = None

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            for row in get_rows(page):
                text = row_text(row)
                if is_noise(text):
                    continue
                if text == 'State Senator':
                    section = 'senate'
                    continue
                if text == 'State Representative':
                    section = 'house'
                    continue
                m = DISTRICT_RE.match(text)
                if m:
                    finalize()
                    pending = {
                        'chamber': section, 'district': int(m.group(1)),
                        'surnameRow': None, 'countyRow': None, 'dataRows': [], 'totalRow': None,
                    }
                    continue
                if pending is None:
                    continue
                if pending['surnameRow'] is None and '**' in text and text.endswith('Misc.'):
                    pending['surnameRow'] = row
                    continue
                if pending['countyRow'] is None and text.startswith('County '):
                    pending['countyRow'] = row
                    continue
                if re.match(r'^total\\b', text, re.IGNORECASE):
                    pending['totalRow'] = row
                    finalize()
                    continue
                pending['dataRows'].append(row)
        finalize()

    return districts

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
  if (raw === 'D') return 'DEM';
  if (raw === 'R') return 'REP';
  return 'IND';
}

function buildRecord(districtId, chamber, candidates) {
  const sorted = candidates.slice().sort((a, b) => b.votes - a.votes);
  const winner = sorted.find((c) => c.winner) || sorted[0];
  const total = candidates.reduce((sum, c) => sum + c.votes, 0);
  const name = (c) => `${c.surname} ${c.given}`.trim();
  const record = {
    districtId,
    chamber,
    winner: name(winner),
    winnerParty: normalizeParty(winner.party),
    winnerPct: Math.round((winner.votes / total) * 10000) / 100,
    opposed: candidates.length > 1,
  };
  if (record.opposed) {
    const runnerUp = sorted.find((c) => c !== winner);
    record.runnerUp = name(runnerUp);
    record.runnerUpParty = normalizeParty(runnerUp.party);
    record.runnerUpPct = Math.round((runnerUp.votes / total) * 10000) / 100;
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

  const races2022 = extractRaces(path.join(d, PDF_2022));
  const races2024 = extractRaces(path.join(d, PDF_2024));

  const senateByDistrict = new Map();
  for (const r of races2022.filter((r) => r.chamber === 'senate' && SENATE_2022_DISTRICTS.includes(r.district))) {
    senateByDistrict.set(r.district, r);
  }
  for (const r of races2024.filter((r) => r.chamber === 'senate' && SENATE_2024_DISTRICTS.includes(r.district))) {
    senateByDistrict.set(r.district, r);
  }
  const houseByDistrict = new Map(races2024.filter((r) => r.chamber === 'house').map((r) => [r.district, r]));

  checkComplete(senateByDistrict, SENATE_DISTRICTS, 'Senate');
  checkComplete(houseByDistrict, HOUSE_DISTRICTS, 'House');

  const districts = [];
  for (let i = 1; i <= SENATE_DISTRICTS; i++) {
    const race = senateByDistrict.get(i);
    if (!race) continue;
    districts.push(buildRecord(`SD-${i}`, 'senate', race.candidates));
  }
  for (let i = 1; i <= HOUSE_DISTRICTS; i++) {
    const race = houseByDistrict.get(i);
    if (!race) continue;
    districts.push(buildRecord(`HD-${i}`, 'house', race.candidates));
  }

  console.log(`Total districts written: ${districts.length} / ${SENATE_DISTRICTS + HOUSE_DISTRICTS}`);

  fs.writeFileSync(path.join(d, 'or-elections-data.json'), JSON.stringify(districts, null, 2));
  console.log('Written to or-elections-data.json');
}

main();
