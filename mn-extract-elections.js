'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SENATE_PDF = 'MN 2022 General Election State Senate Results.pdf';
const HOUSE_PDF = 'MN 2024 General Election State Representative Results.pdf';

const SENATE_TOTAL_DISTRICTS = 67;
const HOUSE_TOTAL_DISTRICTS = 134;

// The SOS report lays the results table out in fixed x-position columns:
// Party | Candidate | Totals | Percent | Graph. Splitting words by column
// (rather than regexing the flattened line) is the only reliable way to
// separate multi-word party names (e.g. "Democratic-Farmer-Labor",
// "Forward Party Independent") from multi-word candidate names.
const PY_EXTRACT = path.join('/tmp', 'mn_extract_rows.py');
fs.writeFileSync(PY_EXTRACT, `
import pdfplumber, sys, json

PARTY_MAX_X = 172.7
NAME_MAX_X = 343
TOTALS_MAX_X = 431

pdf_path = sys.argv[1]
rows = []
with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        words = page.extract_words()
        lines = []
        for w in words:
            line = None
            for l in lines:
                if abs(l['top'] - w['top']) < 2:
                    line = l
                    break
            if line is None:
                line = {'top': w['top'], 'words': []}
                lines.append(line)
            line['words'].append(w)
        lines.sort(key=lambda l: l['top'])
        for l in lines:
            ws = sorted(l['words'], key=lambda w: w['x0'])
            text = ' '.join(w['text'] for w in ws)
            party = ' '.join(w['text'] for w in ws if w['x0'] < PARTY_MAX_X)
            name = ' '.join(w['text'] for w in ws if PARTY_MAX_X <= w['x0'] < NAME_MAX_X)
            totals = ' '.join(w['text'] for w in ws if NAME_MAX_X <= w['x0'] < TOTALS_MAX_X)
            rows.append({'text': text, 'party': party, 'name': name, 'totals': totals})

print(json.dumps(rows))
`);

function extractRows(pdfPath) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath], { maxBuffer: 200 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

const SENATE_HEADER_RE = /^State Senator District (\d+)\s/;
const HOUSE_HEADER_RE = /^State Representative District (\d+[AB])\s/;
const VOTES_RE = /^[\d,]+$/;

function normalizeParty(raw) {
  const p = raw.trim();
  return p === 'Democratic-Farmer-Labor' ? 'Democratic' : p;
}

function parseVotes(v) {
  return parseInt(v.replace(/,/g, ''), 10);
}

function buildDistrict(districtId, candidates) {
  const winners = [...candidates].sort((a, b) => b.votes - a.votes).slice(0, 1);
  const demVotes = candidates.filter((c) => c.party === 'Democratic').reduce((s, c) => s + c.votes, 0);
  const repVotes = candidates.filter((c) => c.party === 'Republican').reduce((s, c) => s + c.votes, 0);
  const totalVotes = demVotes + repVotes;
  return {
    districtId,
    seats: 1,
    candidates,
    winners,
    demVotes,
    repVotes,
    totalVotes,
    demPct: totalVotes > 0 ? Math.round((demVotes / totalVotes) * 10000) / 100 : 0,
    repPct: totalVotes > 0 ? Math.round((repVotes / totalVotes) * 10000) / 100 : 0,
  };
}

// Races run continuously across page breaks - the district header is not
// repeated, only the "Party Candidate Totals Percent Graph" column header is.
function parseRaces(rows, headerRe, idPrefix) {
  const districts = [];
  let currentId = null;
  let candidates = [];

  function flush() {
    if (currentId != null && candidates.length) {
      districts.push(buildDistrict(`${idPrefix}-${currentId.toLowerCase()}`, candidates));
    }
    candidates = [];
  }

  for (const row of rows) {
    const text = row.text.trim();
    if (!text) continue;

    const header = text.match(headerRe);
    if (header) {
      flush();
      currentId = header[1];
      continue;
    }

    if (currentId == null) continue;
    if (text === 'Party Candidate Totals Percent Graph') continue;

    const party = row.party.trim();
    const name = row.name.trim();
    const totalsStr = row.totals.trim();
    if (!party || !name || !VOTES_RE.test(totalsStr)) continue;

    candidates.push({ name, party: normalizeParty(party), votes: parseVotes(totalsStr) });
  }
  flush();

  return districts;
}

function main() {
  const d = __dirname;

  console.log('Extracting Senate results...');
  const senateRows = extractRows(path.join(d, SENATE_PDF));
  const senate = parseRaces(senateRows, SENATE_HEADER_RE, 'mn-sd')
    .sort((a, b) => parseInt(a.districtId.split('-')[2], 10) - parseInt(b.districtId.split('-')[2], 10));

  console.log('Extracting House results...');
  const houseRows = extractRows(path.join(d, HOUSE_PDF));
  const house = parseRaces(houseRows, HOUSE_HEADER_RE, 'mn-hd')
    .sort((a, b) => {
      const ma = a.districtId.match(/mn-hd-(\d+)([ab])/);
      const mb = b.districtId.match(/mn-hd-(\d+)([ab])/);
      return parseInt(ma[1], 10) - parseInt(mb[1], 10) || ma[2].localeCompare(mb[2]);
    });

  const output = { house, senate };
  fs.writeFileSync(path.join(d, 'mn-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`\nSenate districts found: ${senate.length} / ${SENATE_TOTAL_DISTRICTS}`);
  console.log(`House districts found:  ${house.length} / ${HOUSE_TOTAL_DISTRICTS}`);

  const missingSenate = [];
  for (let i = 1; i <= SENATE_TOTAL_DISTRICTS; i++) {
    if (!senate.find((dd) => dd.districtId === `mn-sd-${i}`)) missingSenate.push(i);
  }
  console.log(`Missing Senate districts: ${missingSenate.length ? missingSenate.join(', ') : 'none'}`);
}

main();
