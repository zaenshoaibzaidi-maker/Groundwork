'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const pdfParse = require('pdf-parse');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const client = new Anthropic();

const SENATE_PDF = 'https://billstatus.ls.state.ms.us/members/s_roster.pdf';
const HOUSE_PDF  = 'https://billstatus.ls.state.ms.us/members/h_roster.pdf';

// ---------------------------------------------------------------------------
// Download with curl (bypasses Node's TLS cert issue with this server)
// ---------------------------------------------------------------------------
function downloadPdf(url, dest) {
  if (fs.existsSync(dest)) {
    console.log(`  Using cached ${dest}`);
    return;
  }
  execSync(`curl -sSk -o "${dest}" "${url}"`);
  console.log(`  Downloaded ${dest} (${fs.statSync(dest).size} bytes)`);
}

// ---------------------------------------------------------------------------
// Senate: text-based PDF — parse with pdf-parse
// Pattern:  "Senator Name\n...District N\n...committees...\nD Room NNN" or "R Room"
// ---------------------------------------------------------------------------
async function parseSenateRoster(pdfPath) {
  const buf = fs.readFileSync(pdfPath);
  const { text } = await pdfParse(buf);

  const roster = {};
  // Split on page boundaries and senator entries
  // Each senator block ends before the next senator starts.
  // Key signals: "District NN" then later "D Room" or "R Room" (or "D\n" "R\n" variants)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  let currentDistrict = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match "District 34" or "District 34 " style
    const distMatch = line.match(/^District\s+(\d+)/i);
    if (distMatch) {
      currentDistrict = parseInt(distMatch[1], 10);
      continue;
    }

    if (currentDistrict === null) continue;

    // Party line: "D Room 405" or "R Room 212-C" or just "D" or "R" standalone
    // Also handles "D  Room" with multiple spaces
    const partyMatch = line.match(/^([DR])\s+Room\b/i) || line.match(/^([DR])$/);
    if (partyMatch) {
      const party = partyMatch[1].toUpperCase() === 'D' ? 'DEM' : 'REP';
      roster[currentDistrict] = party;
      currentDistrict = null;
    }
  }

  return roster;
}

// ---------------------------------------------------------------------------
// House: scanned PDF — use Claude vision on each page
// ---------------------------------------------------------------------------
const PY_PAGES = path.join('/tmp', 'ms_roster_pages.py');
fs.writeFileSync(PY_PAGES, `
import fitz, base64, json, sys
doc = fitz.open(sys.argv[1])
pages = []
for i in range(len(doc)):
    pix = doc[i].get_pixmap(dpi=180)
    pages.append(base64.b64encode(pix.tobytes('jpeg')).decode())
print(json.dumps(pages))
`);

function extractPdfPages(pdfPath) {
  const r = spawnSync('python3', [PY_PAGES, pdfPath], { maxBuffer: 200 * 1024 * 1024 });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(r.stderr.toString());
  return JSON.parse(r.stdout.toString());
}

const HOUSE_PROMPT = `This is a page from the Mississippi House of Representatives member roster.
It is a table with columns: Name/Address | District/County | Party | Phone (W) | Phone (H) | Capitol Office/Phone/Email.

Extract every row and return JSON — raw JSON only, no markdown fencing:
{
  "members": [
    { "name": "Brent D. Anderson", "district": 122, "party": "Rep" },
    { "name": "Shane Aguirre", "district": 17, "party": "Rep" },
    ...
  ]
}

Rules:
- district is an integer
- party is exactly "Rep" or "Dem" as printed in the Party column
- Skip the header row and any footer rows
- If a row is cut off or unclear, still include what you can see
- If this is a cover/title page with no member data, return {"members": []}
`;

async function parseHouseRoster(pdfPath) {
  const pages = extractPdfPages(pdfPath);
  console.log(`  ${pages.length} pages in House roster`);
  const roster = {};

  for (let i = 0; i < pages.length; i++) {
    process.stdout.write(`  Page ${i + 1}/${pages.length}...`);
    try {
      const msg = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: pages[i] } },
            { type: 'text', text: HOUSE_PROMPT },
          ],
        }],
      });
      const raw = msg.content[0].text.trim()
        .replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      const parsed = JSON.parse(raw);
      const members = parsed.members || [];
      for (const m of members) {
        if (!m.district || !m.party) continue;
        roster[m.district] = m.party.toLowerCase().startsWith('d') ? 'DEM' : 'REP';
      }
      process.stdout.write(` ${members.length} members\n`);
    } catch (err) {
      process.stdout.write(` ERROR: ${err.message}\n`);
    }
  }

  return roster;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const d = __dirname;
  const senPdf = '/tmp/ms_s_roster.pdf';
  const houPdf = '/tmp/ms_h_roster.pdf';

  console.log('Downloading rosters...');
  downloadPdf(SENATE_PDF, senPdf);
  downloadPdf(HOUSE_PDF, houPdf);

  console.log('\nParsing Senate roster (text PDF)...');
  const senateParty = await parseSenateRoster(senPdf);
  console.log(`  Found ${Object.keys(senateParty).length} senate entries`);

  console.log('\nParsing House roster (scanned PDF)...');
  const houseParty = await parseHouseRoster(houPdf);
  console.log(`  Found ${Object.keys(houseParty).length} house entries`);

  // Load and update ms-elections-data.json
  const dataPath = path.join(d, 'ms-elections-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  let houseUpdated = 0, senateUpdated = 0;
  const houseMissed = [], senateMissed = [];

  for (const [distStr, entry] of Object.entries(data.house)) {
    const dist = parseInt(distStr, 10);
    if (houseParty[dist]) {
      entry.party = houseParty[dist];
      houseUpdated++;
    } else {
      houseMissed.push(dist);
    }
  }

  for (const [distStr, entry] of Object.entries(data.senate)) {
    const dist = parseInt(distStr, 10);
    if (senateParty[dist]) {
      entry.party = senateParty[dist];
      senateUpdated++;
    } else {
      senateMissed.push(dist);
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log('\n--- Results ---');
  console.log(`House   updated: ${houseUpdated} / ${Object.keys(data.house).length}`);
  console.log(`Senate  updated: ${senateUpdated} / ${Object.keys(data.senate).length}`);

  if (houseMissed.length)  console.log(`House   unmatched: HD ${houseMissed.join(', ')}`);
  if (senateMissed.length) console.log(`Senate  unmatched: SD ${senateMissed.join(', ')}`);
  if (!houseMissed.length && !senateMissed.length) console.log('All districts matched — no TBD remaining.');

  console.log('\nUpdated ms-elections-data.json');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
