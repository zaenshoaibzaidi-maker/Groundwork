'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const FILE_SENATE_2022 = 'WI 2022 General Election State Senate Results.pdf';
const FILE_SENATE_2024 = 'WI 2024 General Election State Senate Results.pdf';
const FILE_HOUSE_2024 = 'WI 2024 General Election State Representative Results.pdf';

// WI's WEC canvass reports render each page's column headers (county/total/
// candidate names/scattering) as vertically stacked, rotated text alongside
// upright DEM/REP/NP/IND party-code labels. Reconstructing a candidate's name
// requires grouping rotated words by x-position (one group per stacked line)
// and reading groups right-to-left, top-to-bottom within each group.
const PY_EXTRACT = path.join('/tmp', 'wi_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, re, json, sys

def extract(pdf_path):
    records = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ''

            chamber = None
            district = None
            m = re.search(r'STATE SENATOR DISTRICT (\\d+)', text)
            if m:
                chamber = 'senate'
                district = int(m.group(1))
            else:
                m2 = re.search(r'REPRESENTATIVE TO THE ASSEMBLY DISTRICT (\\d+)', text)
                if m2:
                    chamber = 'assembly'
                    district = int(m2.group(1))
            if chamber is None:
                continue

            totals_match = re.search(r'Office Totals:\\s*(.+)', text)
            if not totals_match:
                continue
            numbers = [int(x.replace(',', '')) for x in re.findall(r'[\\d,]+', totals_match.group(1))]

            words = page.extract_words(extra_attrs=['upright'])

            total_words = [w for w in words if not w['upright'] and w['text'] == 'Total']
            if not total_words:
                continue
            header_top = total_words[0]['top']

            # Party-code labels (DEM/REP/NP/IND...) are upright text sitting just
            # above the rotated candidate-name block, near the 'Total' header's top.
            seen_x = set()
            labels = []
            for w in sorted(words, key=lambda w: w['x0']):
                if not w['upright'] or w['x0'] <= 130 or abs(w['top'] - header_top) > 8:
                    continue
                key = round(w['x0'])
                if key in seen_x:
                    continue
                seen_x.add(key)
                labels.append(w)
            if not labels:
                continue

            # Candidate-name fragments: rotated text, right of the County/Total
            # columns, excluding the SCATTERING (write-in tally) column.
            name_words = [w for w in words if not w['upright'] and w['x0'] > 120 and w['text'] != 'SCATTERING']

            groups = {i: [] for i in range(len(labels))}
            for w in name_words:
                idx = min(range(len(labels)), key=lambda i: abs(labels[i]['x0'] - w['x0']))
                groups[idx].append(w)

            candidates = []
            for i, label in enumerate(labels):
                ws = groups[i]
                if not ws:
                    continue
                cols = {}
                for w in ws:
                    cols.setdefault(round(w['x0']), []).append(w)
                parts = []
                for ck in sorted(cols.keys(), reverse=True):
                    for w in sorted(cols[ck], key=lambda w: w['top']):
                        parts.append(w['text'])
                name = ''
                for p in parts:
                    if name and not name.endswith('-'):
                        name += ' '
                    name += p
                votes = numbers[1 + i] if (1 + i) < len(numbers) else 0
                candidates.append({'name': name, 'party': label['text'], 'votes': votes})

            records.append({'chamber': chamber, 'district': district, 'candidates': candidates})
    return records

if __name__ == '__main__':
    print(json.dumps(extract(sys.argv[1])))
`
);

function extractPdf(pdfPath) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath], {
    maxBuffer: 200 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

function partyCode(party) {
  if (party === 'DEM') return 'dem';
  if (party === 'REP') return 'rep';
  return 'ind';
}

function buildDistrict(districtId, rawCandidates) {
  const candidates = rawCandidates.map((c) => ({
    name: c.name,
    party: partyCode(c.party),
    votes: c.votes,
  }));
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const winner = sorted[0];
  const demVotes = candidates.filter((c) => c.party === 'dem').reduce((s, c) => s + c.votes, 0);
  const repVotes = candidates.filter((c) => c.party === 'rep').reduce((s, c) => s + c.votes, 0);
  const totalVotes = demVotes + repVotes;
  return {
    districtId,
    winner: winner.name,
    winnerParty: winner.party,
    demVotes,
    repVotes,
    totalVotes,
    demPct: totalVotes > 0 ? Math.round((demVotes / totalVotes) * 10000) / 100 : 0,
    repPct: totalVotes > 0 ? Math.round((repVotes / totalVotes) * 10000) / 100 : 0,
    candidates,
  };
}

function toDistrictMap(records, chamber) {
  const map = new Map();
  for (const r of records) {
    if (r.chamber !== chamber) continue;
    map.set(r.district, r.candidates);
  }
  return map;
}

function toDistrictList(distMap, prefix) {
  return [...distMap.keys()]
    .sort((a, b) => a - b)
    .map((num) => buildDistrict(`${prefix}-${num}`, distMap.get(num)));
}

function main() {
  const d = __dirname;

  const senate2022Records = extractPdf(path.join(d, FILE_SENATE_2022));
  const senate2024Records = extractPdf(path.join(d, FILE_SENATE_2024));
  const house2024Records = extractPdf(path.join(d, FILE_HOUSE_2024));

  const senateMap = toDistrictMap(senate2022Records, 'senate');
  for (const [num, candidates] of toDistrictMap(senate2024Records, 'senate')) {
    senateMap.set(num, candidates);
  }
  const houseMap = toDistrictMap(house2024Records, 'assembly');

  const senate = toDistrictList(senateMap, 'wi-sd');
  const house = toDistrictList(houseMap, 'wi-hd');

  const output = { house, senate };
  fs.writeFileSync(path.join(d, 'wi-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`Assembly districts: ${house.length}`);
  console.log(`Senate districts:   ${senate.length}`);
}

main();
