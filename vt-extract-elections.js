'use strict';

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// 2024 Vermont General Election results, parsed from the Secretary of
// State's election archive PDF export (one row per district, candidates
// nested below with vote count and %).
//
// The PDF's text layer reorders winning candidates: each winner's
// name+party is a hyperlinked element that the exporter serializes out of
// visual order (it ends up far later in the page's text stream, while its
// vote count/% stay in place). We recover the correct association by
// grouping all text items on a page by their y-coordinate (their visual
// row) instead of trusting stream order, then use the stream-order gap
// between a name and its vote count to tell displaced (winner) rows from
// inline (loser) rows.
const HOUSE_PDF = 'VT 2024 General Election State Representatives Results.pdf';
const SENATE_PDF = 'VT 2024 General Election State Senator Results.pdf';

// Row labels and repeated page furniture (nav/header/footer text reprinted
// on every page) that land in the candidate column's x-range but aren't
// candidate data.
const SKIP_LABELS = new Set([
  'Write-Ins', 'Blanks', 'Total Votes Cast', 'Spoiled', 'Candidate', 'Candidates',
  'VT Elections Database » Search Elections', 'Election Results Archive',
  'Web Policies', 'Accessibility', 'Privacy', 'About the Elections Division',
]);
const DISTRICT_RE = /^\d{4}(State Representative|State Senator)(.*?)General Election$/;
const DISPLACEMENT_THRESHOLD = 15;

function normalizeParty(raw) {
  if (/Rep/.test(raw)) return 'Republican';
  if (/Dem/.test(raw)) return 'Democratic';
  return raw;
}

async function loadPages(pdfPath) {
  const pages = [];
  async function pagerender(pageData) {
    const textContent = await pageData.getTextContent();
    const items = textContent.items.map((it, idx) => ({
      str: it.str,
      x: it.transform[4],
      y: it.transform[5],
      idx,
    }));
    pages.push(items);
    return '';
  }
  const buf = fs.readFileSync(path.join(__dirname, pdfPath));
  await pdfParse(buf, { pagerender });
  return pages;
}

// Column boundaries observed in the source table: district/office label,
// candidate name/party, vote count, then win %. The candidate column starts
// around x=293 on the Senate PDF vs x=311 on the House PDF, so the
// label/mid split sits at 280 — comfortably below both — to avoid clipping
// either one.
function bucketFor(x) {
  if (x < 280) return 'label';
  if (x < 510) return 'mid';
  if (x < 545) return 'votes';
  return 'pct';
}

function rowsForPage(items) {
  const byY = new Map();
  for (const it of items) {
    const key = it.y.toFixed(1);
    if (!byY.has(key)) byY.set(key, []);
    byY.get(key).push(it);
  }

  return [...byY.values()]
    .map((rowItems) => rowItems.sort((a, b) => a.x - b.x))
    .sort((a, b) => b[0].y - a[0].y)
    .map((rowItems) => {
      const cells = { label: [], mid: [], votes: [], pct: [] };
      for (const it of rowItems) cells[bucketFor(it.x)].push(it);
      const join = (arr) => arr.map((i) => i.str).join('').trim();
      const minIdx = (arr) => (arr.length ? Math.min(...arr.map((i) => i.idx)) : null);
      return {
        label: join(cells.label),
        mid: join(cells.mid),
        votes: join(cells.votes),
        pct: join(cells.pct),
        midIdx: minIdx(cells.mid),
        votesIdx: minIdx(cells.votes),
      };
    });
}

function extractChamber(pages, chamberLabel) {
  const districts = {};
  let current = null;
  let pending = null;

  function flushPending() {
    if (pending) {
      current.candidates.push(pending);
      pending = null;
    }
  }

  function flushDistrict() {
    flushPending();
    if (current) {
      const winners = current.candidates.filter((c) => c.winner);
      const losers = current.candidates.length - winners.length;
      districts[current.name] = {
        winners: winners.map((w) => ({
          name: w.name,
          party: normalizeParty(w.party || ''),
          pct: w.pct,
        })),
        unopposed: losers === 0,
      };
    }
    current = null;
  }

  for (const page of pages) {
    for (const row of rowsForPage(page)) {
      const dm = row.label.match(DISTRICT_RE);
      if (dm && dm[1] === chamberLabel) {
        flushDistrict();
        current = { name: dm[2].trim(), candidates: [] };
        continue;
      }
      if (!current || !row.mid) continue;
      if (SKIP_LABELS.has(row.mid) || row.mid.startsWith('See Details')) continue;

      if (row.votes && row.pct) {
        flushPending();
        pending = {
          name: row.mid,
          party: null,
          pct: parseFloat(row.pct.replace('%', '')),
          winner: row.midIdx - row.votesIdx > DISPLACEMENT_THRESHOLD,
        };
      } else if (pending) {
        pending.party = row.mid;
      }
    }
  }
  flushDistrict();
  return districts;
}

async function main() {
  console.log('Parsing VT House PDF...');
  const housePages = await loadPages(HOUSE_PDF);
  const house = extractChamber(housePages, 'State Representative');

  console.log('Parsing VT Senate PDF...');
  const senatePages = await loadPages(SENATE_PDF);
  const senate = extractChamber(senatePages, 'State Senator');

  const output = { house, senate };
  fs.writeFileSync(
    path.join(__dirname, 'vt-elections-data.json'),
    JSON.stringify(output, null, 2)
  );

  console.log(`House districts:  ${Object.keys(house).length}`);
  console.log(`Senate districts: ${Object.keys(senate).length}`);
  console.log('Written to vt-elections-data.json');
}

main();
