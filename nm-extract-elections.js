'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SENATE_PDF = 'NM 2024 General Election State Senate Results.pdf';
const HOUSE_PDF = 'NM 2024 General Election State Representative Results.pdf';

const SENATE_DISTRICTS = 42;
const HOUSE_DISTRICTS = 70;

// New Mexico's Secretary of State results pages render each district as
// "Nov 2024 General State <Chamber> District N <Winner> <Party> won the
// race|ran (PP.P%), unopposed." or "... against <Runner-up> <Party>." with
// arbitrary line wraps in between, so we flatten to one line and split on
// the district headers before parsing each block.
const PY_EXTRACT = path.join('/tmp', 'nm_extract_elections.py');
fs.writeFileSync(
  PY_EXTRACT,
  `
import pdfplumber, json, re, sys

# Left-nav sidebar labels that pdfplumber interleaves into the results
# column text (it reads the page by vertical position, and the nav sits
# beside the results table). Longer/more specific phrases first so they
# don't leave orphaned fragments behind from a shorter phrase matching part
# of them.
JUNK_PHRASES = [
    'Download the data from this search',
    'Search Results CSV DOWNLOAD',
    'Show Advanced Filters',
    'Ballot Questions',
    'Voter Statistics',
    'Download Data',
    'Share This Search',
    'Search For',
    'Candidates',
    'Contests',
    'Offices',
    'State Senate District',
    'State Representative District',
    'State Senate',
    'State Representative',
    'Date Stage Office District Results',
]

def clean_block(block):
    for phrase in JUNK_PHRASES:
        block = block.replace(phrase, ' ')
    # Page-boundary footer/header noise: result-page URLs, the repeated
    # "<date>, <time> Search Past Elections | ..." banner, and "N/M" page
    # fraction markers.
    block = re.sub(r'https?://\\S+', ' ', block)
    block = re.sub(r'\\d{1,2}/\\d{1,2}/\\d{2,4},\\s*\\d{1,2}:\\d{2}\\s*[AP]M Search Past Elections \\| New Mexico Secretary of State', ' ', block)
    block = re.sub(r'\\b\\d+/\\d+\\b', ' ', block)
    return re.sub(r'\\s+', ' ', block).strip()

def extract(pdf_path, chamber):
    with pdfplumber.open(pdf_path) as pdf:
        text = ' '.join((page.extract_text() or '') for page in pdf.pages)
    text = re.sub(r'\\s+', ' ', text)

    header_re = re.compile(r'Nov 2024 General State ' + chamber + r' District (\\d+)')
    headers = list(header_re.finditer(text))

    results = []
    for i, m in enumerate(headers):
        district = int(m.group(1))
        start = m.end()
        end = headers[i + 1].start() if i + 1 < len(headers) else len(text)
        block = text[start:end].strip()
        block = block.split('Rows per page')[0].strip()
        block = clean_block(block)

        m_unopposed = re.match(
            r'(.+?)\\s+([A-Z]{1,3})\\s+(?:won the race|ran)\\s+\\(([\\d.]+)%\\)\\s*,\\s*unopposed\\.?$',
            block,
        )
        if m_unopposed:
            results.append({
                'district': district,
                'winner': m_unopposed.group(1).strip(),
                'party': m_unopposed.group(2),
                'pct': float(m_unopposed.group(3)),
                'opposed': False,
            })
            continue

        m_unnamed = re.match(
            r'(.+?)\\s+([A-Z]{1,3})\\s+(?:won the race|ran)\\s+\\(([\\d.]+)%\\)\\s+against\\s+(\\d+)\\s+opponents\\.?$',
            block,
        )
        if m_unnamed:
            results.append({
                'district': district,
                'winner': m_unnamed.group(1).strip(),
                'party': m_unnamed.group(2),
                'pct': float(m_unnamed.group(3)),
                'opposed': True,
                'numOpponents': int(m_unnamed.group(4)),
            })
            continue

        m_opposed = re.match(
            r'(.+?)\\s+([A-Z]{1,3})\\s+(?:won the race|ran)\\s+\\(([\\d.]+)%\\)\\s+against\\s+(.+)\\s+([A-Z]{1,3})\\s*\\.?$',
            block,
        )
        if m_opposed:
            results.append({
                'district': district,
                'winner': m_opposed.group(1).strip(),
                'party': m_opposed.group(2),
                'pct': float(m_opposed.group(3)),
                'opposed': True,
                'runnerUp': m_opposed.group(4).strip(),
                'runnerUpParty': m_opposed.group(5),
            })
            continue

        raise ValueError(f'district {district}: could not parse block: {block!r}')

    return results

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

// Removes quoted nicknames and trailing suffixes (Jr, Sr, II-V), then
// returns the title-cased final token as the surname.
function lastName(rawName) {
  let s = rawName.replace(/["“][^"”]*["”]/g, ' ');
  s = s.replace(/,?\s*(Jr\.?|Sr\.?|II|III|IV|V)\s*$/i, '');
  s = s.replace(/\s+/g, ' ').trim();
  const last = s.split(' ').pop();
  return last
    .toLowerCase()
    .replace(/(^|['-])([a-z])/g, (_, sep, c) => sep + c.toUpperCase());
}

function buildRecords(raw) {
  return raw
    .map((r) => {
      const record = {
        district: r.district,
        winner: lastName(r.winner),
        party: r.party,
        pct: r.pct,
        opposed: r.opposed,
      };
      if (r.opposed) {
        if (r.numOpponents != null) {
          record.numOpponents = r.numOpponents;
        } else {
          record.runnerUp = r.runnerUp;
          record.runnerUpParty = r.runnerUpParty;
        }
      }
      return record;
    })
    .sort((a, b) => a.district - b.district);
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

  const senate = buildRecords(extractChamber(path.join(d, SENATE_PDF), 'Senate'));
  const house = buildRecords(extractChamber(path.join(d, HOUSE_PDF), 'Representative'));

  checkComplete(senate, SENATE_DISTRICTS, 'Senate');
  checkComplete(house, HOUSE_DISTRICTS, 'House');

  fs.writeFileSync(
    path.join(d, 'nm-elections-data.json'),
    JSON.stringify({ senate, house }, null, 2)
  );
  console.log('Written to nm-elections-data.json');
}

main();
