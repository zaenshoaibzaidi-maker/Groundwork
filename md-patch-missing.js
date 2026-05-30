'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const client = new Anthropic();

const PY_EXTRACT = path.join('/tmp', 'md_extract_pages.py');
fs.writeFileSync(PY_EXTRACT, `
import fitz, base64, json, sys
pdf_path = sys.argv[1]
dpi = int(sys.argv[2]) if len(sys.argv) > 2 else 200
doc = fitz.open(pdf_path)
pages = []
for i in range(len(doc)):
    pix = doc[i].get_pixmap(dpi=dpi)
    img_bytes = pix.tobytes('jpeg')
    pages.append(base64.b64encode(img_bytes).decode())
print(json.dumps(pages))
`);

function extractPdfPages(pdfPath, dpi = 200) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath, String(dpi)], {
    maxBuffer: 200 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

const SENATE_MISSING = [10, 41, 46];
const HOUSE_MISSING = ['6', '10', '11B', '23', '28', '39'];

function makeSenatePrompt(targets) {
  return `This is a page from Maryland's 2022 General Election State Senate Results.

I am specifically looking for these Senate districts ONLY: ${targets.join(', ')}

Carefully scan the entire page for any of those district numbers. If you find one:
- districtId: just the number as a string (e.g. "10", "41", "46")
- candidates: ALL candidates listed, with full name (do not truncate or split names), party ("REP","DEM","IND","GRN","LIB" or "TBD"), votes (integer), pct (float)

Return raw JSON only (no markdown). Format:
{"senate":{"10":{"candidates":[{"name":"Full Name","party":"DEM","votes":12345,"pct":65.4}]}}}

If NONE of the target districts appear on this page, return: {"senate":{}}`;
}

function makeHousePrompt(targets) {
  return `This is a page from Maryland's 2022 General Election House of Delegates Results.

I am specifically looking for these House districts/subdistricts ONLY: ${targets.join(', ')}

Maryland district types:
- Plain number (e.g. "6", "23"): undivided district, elects 3 delegates at-large → seats=3
- Letter suffix (e.g. "11B"): subdistrict, usually 1 delegate → seats=1 (or 2 if clearly 2 winners)

Carefully scan the entire page for any of the target districts. If found:
- districtId: number + optional letter uppercase (e.g. "6", "11B", "23") — no "District" prefix
- seats: 1, 2, or 3
- candidates: ALL candidates with full name (do not truncate or split names), party ("REP","DEM","IND","GRN","LIB" or "TBD"), votes (integer), pct (float)

Return raw JSON only (no markdown). Format:
{"house":{"6":{"seats":3,"candidates":[...]},"11B":{"seats":1,"candidates":[...]}}}

If NONE of the target districts appear on this page, return: {"house":{}}`;
}

async function scanPage(base64Img, pageIndex, label, prompt, responseKey, attempt = 1) {
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
      return scanPage(base64Img, pageIndex, label, prompt, responseKey, attempt + 1);
    }
    console.error(`\n  [${label} p${pageIndex}] ERROR: ${err.message}`);
    return {};
  }
}

function normalizeId(id) {
  return String(id).replace(/^district\s*/i, '').replace(/\s+/g, '').toUpperCase();
}

function resolveWinners(data) {
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

async function scanPdf(pdfPath, label, prompt, responseKey) {
  console.log(`\nScanning ${label} PDF (${pdfPath.split('/').pop()})...`);
  const pages = extractPdfPages(pdfPath, 200);
  console.log(`  ${pages.length} pages at 200 DPI`);

  const found = {};

  for (let i = 0; i < pages.length; i++) {
    process.stdout.write(`  Page ${i + 1}/${pages.length}...`);
    const result = await scanPage(pages[i], i + 1, label, prompt, responseKey);
    const hits = Object.keys(result);
    if (hits.length > 0) {
      process.stdout.write(` HIT: ${hits.join(', ')}\n`);
      for (const [k, v] of Object.entries(result)) {
        const id = normalizeId(k);
        if (!found[id]) found[id] = v;
      }
    } else {
      process.stdout.write(` -\n`);
    }
  }

  return found;
}

async function main() {
  const d = __dirname;
  const jsonPath = path.join(d, 'md-elections-data.json');

  const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const addedSenate = [];
  const addedHouse = [];

  // ── Senate pass ──────────────────────────────────────────────────────────────
  const stillMissingSenate = SENATE_MISSING.filter(n => !existing.senate[String(n)]);
  if (stillMissingSenate.length > 0) {
    const senateFound = await scanPdf(
      path.join(d, 'md 2022 Genera Election State Senate Results.pdf'),
      'Senate',
      makeSenatePrompt(stillMissingSenate),
      'senate'
    );

    for (const [k, v] of Object.entries(senateFound)) {
      if (!existing.senate[k]) {
        const resolved = resolveWinners(v);
        if (resolved) {
          existing.senate[k] = resolved;
          addedSenate.push(k);
        }
      }
    }
  } else {
    console.log('\nNo senate districts to re-extract.');
  }

  // ── House pass ────────────────────────────────────────────────────────────────
  const stillMissingHouse = HOUSE_MISSING.filter(id => !existing.house[id]);
  if (stillMissingHouse.length > 0) {
    const houseFound = await scanPdf(
      path.join(d, 'md 2022 General Election State Representative Results.pdf'),
      'House',
      makeHousePrompt(stillMissingHouse),
      'house'
    );

    for (const [k, v] of Object.entries(houseFound)) {
      if (!existing.house[k]) {
        const resolved = resolveWinners(v);
        if (resolved) {
          existing.house[k] = resolved;
          addedHouse.push(k);
        }
      }
    }
  } else {
    console.log('\nNo house districts to re-extract.');
  }

  // ── Re-sort and save ──────────────────────────────────────────────────────────
  existing.house = sortedByDistrictId(existing.house);
  existing.senate = sortedByDistrictId(existing.senate);

  fs.writeFileSync(jsonPath, JSON.stringify(existing, null, 2));

  // ── Report ────────────────────────────────────────────────────────────────────
  console.log('\n--- Patch Results ---');

  if (addedSenate.length > 0) {
    console.log('\nSenate districts added:');
    for (const k of addedSenate) {
      const e = existing.senate[k];
      const summary = e.winner
        ? `${e.winner} (${e.party}, ${e.pct}%)`
        : e.winners.map(w => `${w.name} (${w.party})`).join(' / ');
      console.log(`  SD-${k}: ${summary}`);
    }
  } else {
    console.log('\nNo new senate districts found.');
  }

  if (addedHouse.length > 0) {
    console.log('\nHouse districts added:');
    for (const k of addedHouse) {
      const e = existing.house[k];
      const summary = e.winner
        ? `${e.winner} (${e.party}, ${e.pct}%)`
        : e.winners.map(w => `${w.name} (${w.party})`).join(' / ');
      console.log(`  HD-${k}: ${summary}`);
    }
  } else {
    console.log('\nNo new house districts found.');
  }

  const stillMissS = SENATE_MISSING.filter(n => !existing.senate[String(n)]);
  const stillMissH = HOUSE_MISSING.filter(id => !existing.house[id]);

  console.log(`\n--- Final Totals ---`);
  console.log(`House:  ${Object.keys(existing.house).length} / 67`);
  console.log(`Senate: ${Object.keys(existing.senate).length} / 47`);

  if (stillMissS.length) console.log(`Still missing Senate: ${stillMissS.join(', ')}`);
  if (stillMissH.length) console.log(`Still missing House:  ${stillMissH.join(', ')}`);
  if (!stillMissS.length && !stillMissH.length) console.log('All target districts captured.');

  console.log('\nUpdated md-elections-data.json');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
