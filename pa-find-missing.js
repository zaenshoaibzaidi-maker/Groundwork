'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const client = new Anthropic();

const PY_EXTRACT = '/tmp/pa_extract_pages.py';

function extractPdfPages(pdfPath, dpi = 150) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath, String(dpi)], {
    maxBuffer: 200 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

const TARGET_PROMPT = `This is a page from a Pennsylvania General Election results document.

I am looking for EXACTLY these four legislative district races — check if ANY of them appear on this page:
- Pennsylvania House of Representatives District 63
- Pennsylvania House of Representatives District 104
- Pennsylvania House of Representatives District 199
- Pennsylvania State Senate District 21

For each found district, capture:
- chamber: "house" or "senate"
- district number (integer)
- ALL candidates: name, votes (integer), pct (float), party if shown ("REP","DEM","IND","GRN","LIB") else "TBD"
- winner (candidate with most votes), winnerParty, total votes, unopposed (boolean)

Return raw JSON only (no markdown fences).
Format: {"found":[{"chamber":"house","district":63,"winner":"Name","winnerParty":"DEM","pct":55.1,"votes":12345,"total":22400,"unopposed":false,"candidates":[{"name":"Name","party":"DEM","votes":12345,"pct":55.1}]}]}

If NONE of those four districts appear on this page, return: {"found":[]}
`;

async function checkPage(base64Img, pageIndex, label, attempt = 1) {
  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Img } },
          { type: 'text', text: TARGET_PROMPT },
        ],
      }],
    });
    const text = msg.content[0].text.trim();
    const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    if (attempt < 3) {
      process.stdout.write(` [retry ${attempt}]`);
      return checkPage(base64Img, pageIndex, label, attempt + 1);
    }
    console.error(`  [${label} p${pageIndex}] ERROR: ${err.message}`);
    return { found: [] };
  }
}

async function scanPdf(pdfPath, label) {
  console.log(`\nScanning ${label}...`);
  const pages = extractPdfPages(pdfPath);
  console.log(`  ${pages.length} pages`);
  const hits = [];
  for (let i = 0; i < pages.length; i++) {
    process.stdout.write(`  Page ${i+1}/${pages.length}...`);
    const result = await checkPage(pages[i], i+1, label);
    if (result.found && result.found.length > 0) {
      process.stdout.write(` FOUND: ${result.found.map(f => (f.chamber==='house'?'HD':'SD')+f.district).join(', ')}\n`);
      hits.push(...result.found);
    } else {
      process.stdout.write(` not here\n`);
    }
  }
  return hits;
}

async function main() {
  const d = __dirname;
  const allHits = [];

  for (const [file, label] of [
    ['pa 2022 General Election State Representatives.pdf', 'PA-2022'],
    ['pa 2024 General Election State Representative.pdf', 'PA-2024-House'],
    ['pa 2024 General Election State Senate.pdf', 'PA-2024-Senate'],
  ]) {
    const hits = await scanPdf(path.join(d, file), label);
    allHits.push(...hits);
  }

  console.log('\n--- Raw hits ---');
  console.log(JSON.stringify(allHits, null, 2));
  fs.writeFileSync(path.join(d, 'pa-missing-hits.json'), JSON.stringify(allHits, null, 2));
  console.log('\nWritten to pa-missing-hits.json');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
