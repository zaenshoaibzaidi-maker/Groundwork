'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const HOUSE_ENTRIES = 67;
const SENATE_TOTAL = 47;

const client = new Anthropic();

const PY_EXTRACT = path.join('/tmp', 'md_extract_pages.py');
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

const SENATE_PROMPT = `This is a page from Maryland's 2022 General Election State Senate Results.

Extract ONLY State Senate district races. Ignore everything else.

For each Senate district found:
- districtId: just the number as a string, e.g. "1", "12", "47"
- candidates: every candidate with name (strip nicknames in quotes), party ("REP","DEM","IND","GRN","LIB" or "TBD" if absent), votes (integer), pct (float)

Return raw JSON only (no markdown). Format:
{"senate":{"1":{"candidates":[{"name":"...","party":"DEM","votes":12345,"pct":65.4}]}}}

If no Senate races on this page, return: {"senate":{}}
`;

const HOUSE_PROMPT = `This is a page from Maryland's 2022 General Election House of Delegates Results.

Extract ONLY House of Delegates district races. Ignore everything else.

Maryland House districts have two forms:
- UNDIVIDED (plain number, e.g. "District 3"): elects 3 delegates at-large → seats=3
- SUBDISTRICT (letter suffix, e.g. "District 1A", "District 34A"): usually 1 delegate → seats=1
  EXCEPTION: a subdistrict may elect 2 delegates (e.g. "2A" in some areas) — if the results list 2 elected candidates, use seats=2

For each district/subdistrict:
- districtId: number + optional letter only, uppercase (e.g. "1A", "3", "34A") — no "District" prefix
- seats: 1, 2, or 3 as appropriate
- candidates: every candidate with name (strip nicknames in quotes), party ("REP","DEM","IND","GRN","LIB" or "TBD"), votes (integer), pct (float)

Return raw JSON only (no markdown). Format:
{"house":{"1A":{"seats":1,"candidates":[{"name":"...","party":"DEM","votes":5678,"pct":72.1}]},"3":{"seats":3,"candidates":[...]}}}

If no House races on this page, return: {"house":{}}
`;

async function processPage(base64Img, pageIndex, label, prompt, responseKey, attempt = 1) {
  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Img } },
          { type: 'text', text: prompt },
        ],
      }],
    });

    const text = msg.content[0].text.trim();
    const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed[responseKey] || {};
  } catch (err) {
    if (attempt < 3) {
      process.stdout.write(` [retry ${attempt}]`);
      return processPage(base64Img, pageIndex, label, prompt, responseKey, attempt + 1);
    }
    console.error(`\n  [${label} page ${pageIndex}] ERROR: ${err.message}`);
    return {};
  }
}

function normalizeId(id) {
  return String(id).replace(/^district\s*/i, '').replace(/\s+/g, '').toUpperCase();
}

function mergeInto(target, source) {
  for (const [k, v] of Object.entries(source)) {
    const id = normalizeId(k);
    if (!target[id]) target[id] = v;
  }
}

function resolveWinners(id, data) {
  const candidates = data.candidates || [];
  if (!candidates.length) return null;

  const seats = data.seats || 1;
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const total = sorted.reduce((s, c) => s + c.votes, 0);
  const unopposed = sorted.length <= seats;

  if (seats === 1) {
    const w = sorted[0];
    const computedPct = total > 0 ? parseFloat(((w.votes / total) * 100).toFixed(2)) : 100;
    return {
      winner: w.name,
      party: w.party || 'TBD',
      pct: w.pct > 0 ? w.pct : computedPct,
      seats: 1,
      unopposed,
      candidates: sorted,
    };
  }

  const winnerSlice = sorted.slice(0, seats);
  return {
    winners: winnerSlice.map(w => ({
      name: w.name,
      party: w.party || 'TBD',
      pct: w.pct > 0 ? w.pct : (total > 0 ? parseFloat(((w.votes / total) * 100).toFixed(2)) : 0),
    })),
    seats,
    unopposed,
    candidates: sorted,
  };
}

function sortedByDistrictId(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort((a, b) => {
      const parse = id => {
        const m = String(id).match(/^(\d+)([A-Z]*)$/);
        return m ? [parseInt(m[1], 10), m[2]] : [Infinity, id];
      };
      const [an, al] = parse(a[0]);
      const [bn, bl] = parse(b[0]);
      return an !== bn ? an - bn : al.localeCompare(bl);
    })
  );
}

async function processPdf(pdfPath, label, prompt, responseKey) {
  console.log(`\nExtracting pages from ${label}...`);
  const pages = extractPdfPages(pdfPath);
  console.log(`  ${pages.length} pages found`);

  const combined = {};

  for (let i = 0; i < pages.length; i++) {
    process.stdout.write(`  Processing page ${i + 1}/${pages.length}...`);
    const result = await processPage(pages[i], i + 1, label, prompt, responseKey);
    const count = Object.keys(result).length;
    process.stdout.write(count > 0 ? ` found ${count} districts\n` : ` (none)\n`);
    mergeInto(combined, result);
  }

  return combined;
}

async function main() {
  const d = __dirname;

  const senateRaw = await processPdf(
    path.join(d, 'md 2022 Genera Election State Senate Results.pdf'),
    'Senate',
    SENATE_PROMPT,
    'senate'
  );

  const houseRaw = await processPdf(
    path.join(d, 'md 2022 General Election State Representative Results.pdf'),
    'House',
    HOUSE_PROMPT,
    'house'
  );

  const senate = {};
  for (const [k, v] of Object.entries(senateRaw)) {
    const resolved = resolveWinners(k, v);
    if (resolved) senate[k] = resolved;
  }

  const house = {};
  for (const [k, v] of Object.entries(houseRaw)) {
    const resolved = resolveWinners(k, v);
    if (resolved) house[k] = resolved;
  }

  const output = {
    house: sortedByDistrictId(house),
    senate: sortedByDistrictId(senate),
  };

  fs.writeFileSync(path.join(d, 'md-elections-data.json'), JSON.stringify(output, null, 2));

  const houseCount = Object.keys(house).length;
  const senateCount = Object.keys(senate).length;

  console.log('\n--- Results ---');
  console.log(`House entries found:    ${houseCount} / ${HOUSE_ENTRIES}`);
  console.log(`Senate districts found: ${senateCount} / ${SENATE_TOTAL}`);

  const houseIds = Object.keys(sortedByDistrictId(house));
  console.log(`\nHouse IDs found (${houseCount}):\n  ${houseIds.join(', ')}`);

  const missingSenate = [];
  for (let i = 1; i <= SENATE_TOTAL; i++) {
    if (!senate[String(i)]) missingSenate.push(i);
  }
  if (missingSenate.length) {
    console.log(`\nMissing Senate districts (${missingSenate.length}): ${missingSenate.join(', ')}`);
  } else {
    console.log('\nNo missing Senate districts.');
  }

  console.log('\nWritten to md-elections-data.json');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
