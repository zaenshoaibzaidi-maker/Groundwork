'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const HOUSE_TOTAL = 100;
const SENATE_TOTAL = 40;

const client = new Anthropic();

const PY_EXTRACT = path.join('/tmp', 'va_extract_pages.py');
fs.writeFileSync(PY_EXTRACT, `
import fitz, base64, json, sys
pdf_path = sys.argv[1]
dpi = int(sys.argv[2]) if len(sys.argv) > 2 else 150
doc = fitz.open(pdf_path)
pages = []
for i in range(len(doc)):
    pix = doc[i].get_pixmap(dpi=dpi)
    img_bytes = pix.tobytes('jpeg')
    pages.append(base64.b64encode(img_bytes).decode())
print(json.dumps(pages))
`);

function extractPdfPages(pdfPath, dpi = 150) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath, String(dpi)], {
    maxBuffer: 200 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

const PAGE_PROMPT = `This is a page from a Virginia General Election results document.

Extract ONLY House of Delegates and State Senate legislative district races from this page.
Ignore all other races (Governor, Lieutenant Governor, Attorney General, Congress, local offices, etc.).

For each legislative district race found, capture:
- The chamber: "senate" or "house"
- The district number (integer)
- All candidates: name (strip any nickname in quotes so the name stays plain text), votes (integer), pct (float), party if shown ("REP","DEM","IND") else "TBD"
- The winner (most votes), total votes, unopposed flag

Return raw JSON only (no markdown fences). Format: {"senate":{"1":{"winner":"Name","winnerParty":"REP","pct":58.23,"votes":37453,"total":64322,"unopposed":false,"candidates":[{"name":"Name","party":"REP","votes":37453,"pct":58.23}]}},"house":{}}

If no House of Delegates or State Senate races on this page, return: {"senate":{},"house":{}}
`;

async function processPage(base64Img, pageIndex, label, attempt = 1) {
  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: base64Img },
            },
            { type: 'text', text: PAGE_PROMPT },
          ],
        },
      ],
    });

    const text = msg.content[0].text.trim();
    const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    if (attempt < 3) {
      process.stdout.write(` [retry ${attempt}]`);
      return processPage(base64Img, pageIndex, label, attempt + 1);
    }
    console.error(`  [${label} page ${pageIndex}] ERROR: ${err.message}`);
    return { senate: {}, house: {} };
  }
}

function mergeResults(target, source) {
  for (const [k, v] of Object.entries(source.senate || {})) {
    target.senate[k] = v;
  }
  for (const [k, v] of Object.entries(source.house || {})) {
    target.house[k] = v;
  }
}

function sortedByNumber(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  );
}

function toOutputEntry(d) {
  return {
    winner: d.winner,
    party: d.winnerParty || 'TBD',
    pct: d.pct,
    unopposed: d.unopposed,
  };
}

async function processPdf(pdfPath, label) {
  console.log(`\nExtracting pages from ${label}...`);
  const pages = extractPdfPages(pdfPath);
  console.log(`  ${pages.length} pages found`);

  const combined = { senate: {}, house: {} };

  for (let i = 0; i < pages.length; i++) {
    process.stdout.write(`  Processing page ${i + 1}/${pages.length}...`);
    const result = await processPage(pages[i], i + 1, label);
    const sCount = Object.keys(result.senate || {}).length;
    const hCount = Object.keys(result.house || {}).length;
    process.stdout.write(
      sCount + hCount > 0
        ? ` found ${sCount} senate, ${hCount} house\n`
        : ` (no legislative races)\n`
    );
    mergeResults(combined, result);
  }

  return combined;
}

async function main() {
  const d = __dirname;

  const pdf2023 = await processPdf(
    path.join(d, 'va 2023 General Election Results.pdf'),
    '2023'
  );

  const pdf2025 = await processPdf(
    path.join(d, 'va 2025 General Election Results.pdf'),
    '2025'
  );

  const senate = {};
  const house = {};

  for (const src of [pdf2023, pdf2025]) {
    for (const [k, v] of Object.entries(src.senate)) senate[k] = toOutputEntry(v);
    for (const [k, v] of Object.entries(src.house)) house[k] = toOutputEntry(v);
  }

  const foundSenate = new Set(Object.keys(senate).map(Number));
  const foundHouse = new Set(Object.keys(house).map(Number));

  const missingSenate = [];
  const missingHouse = [];
  for (let i = 1; i <= SENATE_TOTAL; i++) {
    if (!foundSenate.has(i)) missingSenate.push(i);
  }
  for (let i = 1; i <= HOUSE_TOTAL; i++) {
    if (!foundHouse.has(i)) missingHouse.push(i);
  }

  const output = {
    house: sortedByNumber(house),
    senate: sortedByNumber(senate),
  };

  fs.writeFileSync(path.join(d, 'va-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`\n--- Results ---`);
  console.log(`House districts found:  ${Object.keys(house).length} / ${HOUSE_TOTAL}`);
  console.log(`Senate districts found: ${Object.keys(senate).length} / ${SENATE_TOTAL}`);

  if (missingHouse.length) {
    console.log(`\nMissing House districts (${missingHouse.length}):`);
    console.log('HD: ' + missingHouse.join(', '));
  } else {
    console.log('\nNo missing House districts.');
  }

  if (missingSenate.length) {
    console.log(`\nMissing Senate districts (${missingSenate.length}):`);
    console.log('SD: ' + missingSenate.join(', '));
  } else {
    console.log('\nNo missing Senate districts.');
  }

  console.log('\nWritten to va-elections-data.json');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
