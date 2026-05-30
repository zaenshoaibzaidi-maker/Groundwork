'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const client = new Anthropic();
const PY_EXTRACT = '/tmp/pa_extract_pages.py';

function extractPdfPages(pdfPath, dpi = 200) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath, String(dpi)], { maxBuffer: 200 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

const SD21_PROMPT = `This is a page from a Pennsylvania General Election results document.
Look carefully for Pennsylvania State Senate District 21 results.
Does this page contain election results for Senate District 21?

If YES, extract ALL candidate names, votes (integer), percentages (float), party ("REP","DEM","IND", or "TBD"), winner, and whether it was unopposed.
If NO, just return {"found":false}.

Return raw JSON only, no markdown fences.
Format when found: {"found":true,"winner":"Name","winnerParty":"DEM","pct":55.1,"votes":12345,"total":22400,"unopposed":false,"candidates":[{"name":"Name","party":"DEM","votes":12345,"pct":55.1}]}
Format when not found: {"found":false}`;

async function tryPage(base64Img, label, attempt = 1) {
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Img } },
          { type: 'text', text: SD21_PROMPT },
        ],
      }],
    });
    const text = msg.content[0].text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(text);
    console.log(label + ':', parsed.found ? 'FOUND SD-21: ' + JSON.stringify(parsed) : 'not here');
    return parsed;
  } catch (err) {
    if (attempt < 3) return tryPage(base64Img, label, attempt + 1);
    console.error(label + ' ERROR:', err.message);
    return { found: false };
  }
}

async function main() {
  const d = __dirname;
  let result = null;

  // SD-21 is odd → should be in 2022; also check 2024 Senate PDF
  for (const [file, label] of [
    ['pa 2022 General Election State Representatives.pdf', '2022-PDF'],
    ['pa 2024 General Election State Senate.pdf', '2024-Senate-PDF'],
  ]) {
    console.log('\nScanning', label, 'at 200 DPI...');
    const pages = extractPdfPages(path.join(d, file), 200);
    for (let i = 0; i < pages.length; i++) {
      const r = await tryPage(pages[i], label + ' p' + (i + 1));
      if (r.found) { result = r; break; }
    }
    if (result) break;
  }

  if (result) {
    console.log('\nSD-21 found:', JSON.stringify(result, null, 2));
    fs.writeFileSync(path.join(d, 'pa-sd21.json'), JSON.stringify(result, null, 2));
  } else {
    console.log('\nSD-21 not found in any PDF page — may be genuinely absent.');
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
