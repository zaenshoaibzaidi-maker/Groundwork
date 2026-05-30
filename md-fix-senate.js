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
dpi = int(sys.argv[2]) if len(sys.argv) > 2 else 250
doc = fitz.open(pdf_path)
pages = []
for i in range(len(doc)):
    pix = doc[i].get_pixmap(dpi=dpi)
    img_bytes = pix.tobytes('jpeg')
    pages.append(base64.b64encode(img_bytes).decode())
print(json.dumps(pages))
`);

function extractPdfPages(pdfPath, dpi = 250) {
  const result = spawnSync('python3', [PY_EXTRACT, pdfPath, String(dpi)], {
    maxBuffer: 200 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return JSON.parse(result.stdout.toString());
}

const SENATE_PROMPT = `This is a page from Maryland's 2022 General Election State Senate Results.

Extract EVERY State Senate district race on this page. Be thorough — do not skip any.

For each district:
- The key is the district number as a string ("10", "41", "46", etc.)
- candidates: every real candidate (not headers, not write-in tallies labeled "Write-In Totals") with:
  - name: the candidate's full legal name as printed (e.g. "John J. Smith Jr.")
  - party: "REP", "DEM", "IND", "GRN", "LIB", or "TBD"
  - votes: integer total votes
  - pct: float percentage

IMPORTANT: Do NOT include the district label (e.g. "District 10") as a candidate name. Candidate names are people's names.
IMPORTANT: Include actual vote counts. If you cannot read a number clearly, do your best to transcribe it.

Return raw JSON only (no markdown):
{"senate":{"10":{"candidates":[{"name":"Jane Smith","party":"DEM","votes":23456,"pct":58.3},{"name":"Bob Jones","party":"REP","votes":16789,"pct":41.7}]}}}

If no Senate races appear on this page, return: {"senate":{}}`;

async function extractPage(base64Img, pageNum, attempt = 1) {
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Img } },
          { type: 'text', text: SENATE_PROMPT },
        ],
      }],
    });
    const text = msg.content[0].text.trim();
    const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed.senate || {};
  } catch (err) {
    if (attempt < 3) {
      process.stdout.write(` [retry ${attempt}]`);
      return extractPage(base64Img, pageNum, attempt + 1);
    }
    console.error(`\n  Page ${pageNum} ERROR: ${err.message}`);
    return {};
  }
}

function resolveWinners(data) {
  const candidates = data.candidates || [];
  if (!candidates.length) return null;
  const seats = data.seats || 1;
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const total = sorted.reduce((s, c) => s + c.votes, 0);
  const unopposed = sorted.length <= seats;
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

async function main() {
  const d = __dirname;
  const jsonPath = path.join(d, 'md-elections-data.json');
  const pdfPath = path.join(d, 'md 2022 Genera Election State Senate Results.pdf');

  // Remove the 3 bad entries first
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const badKeys = ['10', '41', '46'].filter(k => {
    const e = data.senate[k];
    return !e || !e.candidates || e.candidates.every(c => !c.votes || c.votes === 0);
  });
  console.log('Removing bad senate entries:', badKeys.join(', '));
  for (const k of badKeys) delete data.senate[k];

  // Extract all senate pages — use Sonnet for full accuracy
  console.log('\nExtracting senate PDF at 250 DPI with Sonnet...');
  const pages = extractPdfPages(pdfPath, 250);
  console.log(`  ${pages.length} pages`);

  const found = {};
  for (let i = 0; i < pages.length; i++) {
    process.stdout.write(`  Page ${i + 1}/${pages.length}...`);
    const result = await extractPage(pages[i], i + 1);
    const hits = Object.keys(result).filter(k => ['10','41','46'].includes(k));
    if (hits.length) {
      process.stdout.write(` HIT: ${hits.join(', ')}\n`);
      for (const k of hits) found[k] = result[k];
    } else {
      process.stdout.write(` -\n`);
    }
  }

  const added = [];
  for (const [k, v] of Object.entries(found)) {
    if (!data.senate[k]) {
      const resolved = resolveWinners(v);
      if (resolved && resolved.winner && resolved.candidates.some(c => c.votes > 0)) {
        data.senate[k] = resolved;
        added.push(k);
      } else {
        console.warn(`  SD-${k}: resolved entry has no valid data, skipping`);
      }
    }
  }

  data.senate = sortedByDistrictId(data.senate);
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

  console.log('\n--- Results ---');
  if (added.length) {
    console.log('Senate districts added:');
    for (const k of added) {
      const e = data.senate[k];
      const cands = e.candidates.map(c => `${c.name} (${c.party}, ${c.votes}v)`).join(', ');
      console.log(`  SD-${k}: winner=${e.winner} | ${cands}`);
    }
  } else {
    console.log('No senate districts added.');
  }

  const stillMissing = ['10','41','46'].filter(k => !data.senate[k]);
  console.log(`\nFinal totals:`);
  console.log(`  House:  ${Object.keys(data.house).length} / 67`);
  console.log(`  Senate: ${Object.keys(data.senate).length} / 47`);
  if (stillMissing.length) console.log(`  Still missing senate: ${stillMissing.join(', ')}`);
  else console.log('  All target senate districts captured.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
