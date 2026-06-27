'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PDF_2022 = 'ND 2022 General Election Results.pdf'; // primary source for odd districts
const PDF_2024 = 'ND 2024 General Election Results.pdf'; // primary source for even districts

const SENATE_TOTAL_DISTRICTS = 47;
const HOUSE_TOTAL_DISTRICTS = 48; // 47 numbered districts, with District 4 replaced by 4a/4b

// The ND SOS results are a "print to PDF" of a web results page: each
// candidate's name/vote/percent row is rendered bold when that candidate
// won the race (there's no literal checkmark glyph in the extracted text -
// bold font is the actual winner signal). Words are pulled with their
// fontname and re-clustered into visual rows by y-position (using the most
// recently added word's top, not the row's first word, since a row's
// constituent words drift a few px from each other and anchoring on the
// first word alone causes later words to fall outside tolerance).
//
// Each page also repeats a date/time header and a results.sos.nd.gov footer
// line, and - because this is a browser print render - the page break
// sometimes slices the *first* candidate row of the next page and leaves a
// 1-3 letter duplicate fragment as the last content line of the current
// page (e.g. "S" before "Shawn Vedaa ..." on the next page). That fragment
// is pure noise (the next page already has the full, correct text) and is
// dropped.
const PY_EXTRACT = path.join('/tmp', 'nd_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, re, sys

def cluster_lines(page, tol=2.0):
    words = page.extract_words(extra_attrs=['fontname'])
    if not words:
        return []
    words.sort(key=lambda w: (w['top'], w['x0']))
    lines = []
    for w in words:
        placed = False
        for ln in lines:
            if abs(ln['last_top'] - w['top']) <= tol:
                ln['words'].append(w)
                ln['last_top'] = w['top']
                placed = True
                break
        if not placed:
            lines.append({'last_top': w['top'], 'words': [w]})
    for ln in lines:
        ln['top'] = min(w['top'] for w in ln['words'])
    lines.sort(key=lambda l: l['top'])
    out = []
    for ln in lines:
        ws = sorted(ln['words'], key=lambda w: w['x0'])
        text = ' '.join(w['text'] for w in ws)
        bold = 'Bold' in ws[0]['fontname']
        out.append({'text': text, 'bold': bold})
    return out

HEADER_RE = re.compile(r'^\\d{1,2}/\\d{1,2}/\\d{2,4}, \\d{1,2}:\\d{2} [AP]M North Dakota Secretary of State$')
FOOTER_RE = re.compile(r'^https://results\\.sos\\.nd\\.gov')
FRAGMENT_RE = re.compile(r'^[A-Za-z]{1,3}$')

def extract_doc_lines(pdf_path):
    all_lines = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            lines = cluster_lines(page)
            lines = [l for l in lines if not HEADER_RE.match(l['text']) and not FOOTER_RE.match(l['text'])]
            if lines and FRAGMENT_RE.match(lines[-1]['text']):
                lines.pop()
            all_lines.extend(lines)
    return all_lines

if __name__ == '__main__':
    print(json.dumps(extract_doc_lines(sys.argv[1])))
`
);

function extractLines(pdfPath) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath], { maxBuffer: 200 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

const PARTY_MAP = {
  Republican: 'rep',
  'Democratic-NPL': 'dem',
  'independent nomination': 'ind',
};

function stripBoiler(text) {
  return text.replace(/Bar Graph \| Map/g, ' ').replace(/\s+/g, ' ').trim();
}

// Walks the document's reconstructed lines as a small state machine. Both
// "State Senator/Representative Unexpired 2-Year Term" headers wrap across
// two lines (district number arrives on the second), so a pending header
// kind is tracked until that second line resolves it.
function parseRaces(rawLines) {
  const senate = [];
  const house = [];
  let current = null;
  let pendingHeader = null;

  function flush() {
    if (current && current.candidates.length) {
      (current.chamber === 'senate' ? senate : house).push(current);
    }
    current = null;
  }

  for (const raw of rawLines) {
    const text = stripBoiler(raw.text);
    if (!text) continue;

    if (pendingHeader === 'senate-unexpired') {
      const m = text.match(/^District (\d+)/);
      if (m) {
        flush();
        current = { chamber: 'senate', district: m[1], kind: 'unexpired', seats: null, totalVotes: null, candidates: [] };
        pendingHeader = null;
        continue;
      }
      pendingHeader = null;
    } else if (pendingHeader === 'house-unexpired') {
      const m = text.match(/^Term District (\w+)/);
      if (m) {
        flush();
        current = { chamber: 'house', district: m[1], kind: 'unexpired', seats: null, totalVotes: null, candidates: [] };
        pendingHeader = null;
        continue;
      }
      pendingHeader = null;
    }

    let m;
    if ((m = text.match(/^State Senator District (\d+)\b/))) {
      flush();
      current = { chamber: 'senate', district: m[1], kind: 'regular', seats: null, totalVotes: null, candidates: [] };
      continue;
    }
    if (/^State Senator Unexpired 2-Year Term\b/.test(text)) {
      flush();
      pendingHeader = 'senate-unexpired';
      continue;
    }
    // District 4 and (in 2022 only) District 9 are split into single-member
    // "09a"/"09b"-style subdistricts using this same regular header format,
    // so the trailing letter must be captured here too - otherwise it's
    // silently unmatched and the subdistrict's rows corrupt whatever race
    // was previously active (digit-then-letter is not a \b boundary).
    if ((m = text.match(/^State Representative District (\d+)([a-zA-Z]?)\b/))) {
      flush();
      current = { chamber: 'house', district: m[1] + m[2], kind: 'regular', seats: null, totalVotes: null, candidates: [] };
      continue;
    }
    if (/^State Representative Unexpired 2-Year\b/.test(text)) {
      flush();
      pendingHeader = 'house-unexpired';
      continue;
    }

    if (!current) continue;

    if ((m = text.match(/^Vote For (\d+)/))) {
      current.seats = parseInt(m[1], 10);
      continue;
    }
    if ((m = text.match(/^TOTAL VOTES ([\d,]+)/))) {
      current.totalVotes = parseInt(m[1].replace(/,/g, ''), 10);
      continue;
    }
    if (/^write-in\b/i.test(text)) continue;
    if (text === 'EXPORT' || text === 'COUNTY TOP') continue;

    if (Object.prototype.hasOwnProperty.call(PARTY_MAP, text)) {
      const last = current.candidates[current.candidates.length - 1];
      if (last && last.party == null) last.party = PARTY_MAP[text];
      continue;
    }

    if ((m = text.match(/^(.+?) ([\d,]+) (\d+\.\d+)%$/))) {
      current.candidates.push({
        name: m[1].trim(),
        votes: parseInt(m[2].replace(/,/g, ''), 10),
        bold: raw.bold,
        party: null,
      });
      continue;
    }
    // Unrecognized line within an active race (e.g. stray boilerplate) - ignore.
  }
  flush();

  return { senate, house };
}

function normalizeDistrict(token) {
  const m = token.match(/^0*(\d+)([a-zA-Z]?)$/);
  return m[1] + (m[2] || '').toLowerCase();
}

function buildDistrictRecord(race, idPrefix, year, districtToken) {
  const candidates = race.candidates
    .map((c) => ({ name: c.name, party: c.party, votes: c.votes }))
    .sort((a, b) => b.votes - a.votes);

  const totalVotes = race.totalVotes;
  const demVotes = candidates.filter((c) => c.party === 'dem').reduce((s, c) => s + c.votes, 0);
  const repVotes = candidates.filter((c) => c.party === 'rep').reduce((s, c) => s + c.votes, 0);
  const demPct = totalVotes > 0 ? Math.round((demVotes / totalVotes) * 10000) / 100 : 0;
  const repPct = totalVotes > 0 ? Math.round((repVotes / totalVotes) * 10000) / 100 : 0;

  const districtId = `${idPrefix}-${districtToken}`;
  const base = { districtId, demVotes, repVotes, totalVotes, demPct, repPct, candidates, electionYear: year };

  if (race.chamber === 'senate') {
    const winner = race.candidates.find((c) => c.bold) || [...race.candidates].sort((a, b) => b.votes - a.votes)[0];
    return { ...base, winner: winner.name, winnerParty: winner.party };
  }

  const winners = race.candidates.filter((c) => c.bold).map((c) => ({ name: c.name, party: c.party }));
  return { ...base, winners };
}

function districtSortKey(tok) {
  const m = tok.match(/^(\d+)([a-z]?)$/);
  return parseInt(m[1], 10) * 10 + (m[2] ? m[2].charCodeAt(0) - 96 + 1 : 0);
}

function main() {
  const d = __dirname;

  const races2022 = parseRaces(extractLines(path.join(d, PDF_2022)));
  const races2024 = parseRaces(extractLines(path.join(d, PDF_2024)));

  const senateMap = new Map();
  const houseMap = new Map();

  for (const r of races2022.senate) {
    if (r.kind !== 'regular') continue;
    const tok = normalizeDistrict(r.district);
    if (parseInt(tok, 10) % 2 === 1) senateMap.set(tok, buildDistrictRecord(r, 'nd-sd', 2022, tok));
  }
  for (const r of races2024.senate) {
    if (r.kind !== 'regular') continue;
    const tok = normalizeDistrict(r.district);
    if (parseInt(tok, 10) % 2 === 0) senateMap.set(tok, buildDistrictRecord(r, 'nd-sd', 2024, tok));
  }
  // "Unexpired 2-Year Term" Senate races are the regular seat for that
  // district, just decided by a more recent special election - they
  // override whatever the district's normal-cycle race produced.
  for (const r of races2024.senate) {
    if (r.kind !== 'unexpired') continue;
    const tok = normalizeDistrict(r.district);
    senateMap.set(tok, buildDistrictRecord(r, 'nd-sd', 2024, tok));
  }

  // District 4 always splits into 4a/4b (no plain "District 4" race exists
  // in either file) so it's kept regardless of parity. District 9 also
  // split into 9a/9b in 2022 alone - that's superseded by 2024's unified
  // "District 9" unexpired race below, so 9a/9b are parsed (to avoid
  // corrupting the surrounding races) but intentionally not kept here.
  for (const r of races2022.house) {
    if (r.kind !== 'regular') continue;
    const tok = normalizeDistrict(r.district);
    if (/^4[ab]$/.test(tok)) houseMap.set(tok, buildDistrictRecord(r, 'nd-hd', 2022, tok));
    else if (/^\d+$/.test(tok) && parseInt(tok, 10) % 2 === 1) houseMap.set(tok, buildDistrictRecord(r, 'nd-hd', 2022, tok));
  }
  for (const r of races2022.house) {
    if (r.kind !== 'unexpired') continue;
    const tok = normalizeDistrict(r.district);
    if (/^4[ab]$/.test(tok)) houseMap.set(tok, buildDistrictRecord(r, 'nd-hd', 2022, tok));
  }
  for (const r of races2024.house) {
    if (r.kind !== 'regular') continue;
    const tok = normalizeDistrict(r.district);
    if (/^4[ab]$/.test(tok)) houseMap.set(tok, buildDistrictRecord(r, 'nd-hd', 2024, tok));
    else if (/^\d+$/.test(tok) && parseInt(tok, 10) % 2 === 0) houseMap.set(tok, buildDistrictRecord(r, 'nd-hd', 2024, tok));
  }
  for (const r of races2024.house) {
    if (r.kind !== 'unexpired') continue;
    const tok = normalizeDistrict(r.district);
    houseMap.set(tok, buildDistrictRecord(r, 'nd-hd', 2024, tok));
  }

  const senate = [...senateMap.keys()].sort((a, b) => districtSortKey(a) - districtSortKey(b)).map((k) => senateMap.get(k));
  const house = [...houseMap.keys()].sort((a, b) => districtSortKey(a) - districtSortKey(b)).map((k) => houseMap.get(k));

  fs.writeFileSync(path.join(d, 'nd-elections-data.json'), JSON.stringify({ senate, house }, null, 2));

  console.log(`Senate districts: ${senate.length} / ${SENATE_TOTAL_DISTRICTS}`);
  console.log(`House districts:  ${house.length} / ${HOUSE_TOTAL_DISTRICTS}`);
}

main();
