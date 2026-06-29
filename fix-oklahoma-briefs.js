#!/usr/bin/env node
/* fix-oklahoma-briefs.js — Clear AI-generated briefs contaminated with
 * "Oklahoma" references.
 *
 * generate-briefs.js / generate-briefs-batch.js used to few-shot the model
 * with hardcoded examples from ok-districts.js, and the model sometimes
 * echoed Oklahoma-specific framing ("...distinct from rural Oklahoma") into
 * other states' briefs. That bug is fixed in both generator scripts now,
 * but the contaminated output is already on disk in various *-districts.js
 * files. This scans every district data file, finds any district whose
 * issues/memo fields mention "Oklahoma", and resets just those fields to
 * empty so they can be regenerated cleanly.
 *
 * Usage: node fix-oklahoma-briefs.js
 * Writes: each affected *-districts.js file, in place.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const DIR = __dirname;

// ok-districts.js is the (uncontaminated) source of the original few-shot
// examples, not a victim of the bug — it must never be touched. Generator
// scripts (e.g. ia-generate-districts.js) also match the "*-districts.js"
// glob but contain template code, not literal district data, so they're
// excluded too.
const EXCLUDE_FILES = new Set(['ok-districts.js', 'ok-generate-districts.js']);

function isTargetFile(name) {
  if (!name.endsWith('-districts.js')) return false;
  if (name.endsWith('-generate-districts.js')) return false;
  if (EXCLUDE_FILES.has(name)) return false;
  return true;
}

// ── Dashboard block extraction (brace-matched, not full parsing) ──────────────

function findAllIds(src) {
  const ids = [];
  const idRegex = /id:\s*["']([^"']+)["']/g;
  let m;
  while ((m = idRegex.exec(src)) !== null) ids.push(m[1]);
  return ids;
}

function extractDashboardSpan(src, id) {
  let idStart = src.indexOf(`id: "${id}"`);
  if (idStart === -1) idStart = src.indexOf(`id: '${id}'`);
  if (idStart === -1) return null;

  const dashStart = src.indexOf('dashboard: {', idStart);
  if (dashStart === -1) return null;

  let depth = 0, objStart = -1, objEnd = -1;
  for (let i = dashStart + 'dashboard: '.length; i < src.length; i++) {
    if (src[i] === '{') {
      if (depth === 0) objStart = i;
      depth++;
    } else if (src[i] === '}') {
      depth--;
      if (depth === 0) { objEnd = i + 1; break; }
    }
  }
  if (objStart === -1 || objEnd === -1) return null;
  return { objStart, objEnd };
}

function evalDashboard(raw) {
  const DEMO_COLORS = ['#4e9e68', '#2563eb', '#f59e0b', '#ef4444'];
  // eslint-disable-next-line no-new-func
  return new Function('DEMO_COLORS', `return (${raw});`)(DEMO_COLORS);
}

function escapeStr(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// Rebuilds the dashboard object with issues/memo fields cleared, preserving
// stats/demos/dem/rep/partisanSub/subtitle/chips exactly as they were.
function serializeClearedDashboard(dashboard, baseIndent) {
  const p  = ' '.repeat(baseIndent);
  const p2 = ' '.repeat(baseIndent + 2);
  const p3 = ' '.repeat(baseIndent + 4);

  const statsStr = (dashboard.stats || [])
    .map(s => `${p3}{ label: "${escapeStr(s.label)}", value: "${escapeStr(s.value)}", sub: "${escapeStr(s.sub ?? '')}" }`)
    .join(',\n');

  const demosStr = (dashboard.demos || [])
    .map(d => `${p3}{ label: "${escapeStr(d.label)}", pct: ${d.pct}, color: ${JSON.stringify(d.color)} }`)
    .join(',\n');

  const chipsStr = (dashboard.chips || []).length === 0 ? '[]' : JSON.stringify(dashboard.chips);

  return `{
${p2}subtitle: "${escapeStr(dashboard.subtitle ?? '')}",
${p2}chips: ${chipsStr},
${p2}stats: [
${statsStr}
${p2}],
${p2}dem: ${dashboard.dem ?? 0}, rep: ${dashboard.rep ?? 0},
${p2}partisanSub: "${escapeStr(dashboard.partisanSub ?? '')}",
${p2}demos: [
${demosStr}
${p2}],
${p2}issues: [],
${p2}memoHeadline: "",
${p2}memoParagraphs: [],
${p2}memoBullets: []
${p}}`;
}

// ── Per-file processing ────────────────────────────────────────────────────────

function processFile(fileName) {
  const filePath = path.join(DIR, fileName);
  let src = fs.readFileSync(filePath, 'utf8');

  const ids = findAllIds(src);
  const cleared = [];
  const errors  = [];

  for (const id of ids) {
    const span = extractDashboardSpan(src, id);
    if (!span) continue;

    const raw = src.slice(span.objStart, span.objEnd);
    if (!raw.includes('Oklahoma')) continue;

    let dashboard;
    try {
      dashboard = evalDashboard(raw);
    } catch (err) {
      errors.push(`${id}: could not parse dashboard (${err.message})`);
      continue;
    }

    let lineStart = span.objStart;
    while (lineStart > 0 && src[lineStart - 1] !== '\n') lineStart--;
    const dashKeywordPos = src.lastIndexOf('dashboard:', span.objStart);
    const baseIndent = (dashKeywordPos - lineStart) + 2;

    const newObj = serializeClearedDashboard(dashboard, baseIndent);
    src = src.slice(0, span.objStart) + newObj + src.slice(span.objEnd);
    cleared.push(id);
  }

  if (cleared.length > 0) {
    fs.writeFileSync(filePath, src, 'utf8');
  }

  return { fileName, cleared, errors };
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const targetFiles = fs.readdirSync(DIR).filter(isTargetFile).sort();

  console.log(`Scanning ${targetFiles.length} district data file(s) for "Oklahoma" contamination...\n`);

  const results = targetFiles.map(processFile);

  let totalCleared = 0;
  let totalErrors  = 0;

  for (const { fileName, cleared, errors } of results) {
    if (cleared.length === 0 && errors.length === 0) continue;
    if (cleared.length > 0) {
      console.log(`${fileName}: cleared ${cleared.length} — ${cleared.join(', ')}`);
      totalCleared += cleared.length;
    }
    if (errors.length > 0) {
      console.log(`${fileName}: ${errors.length} error(s)`);
      errors.forEach(e => console.log(`  ${e}`));
      totalErrors += errors.length;
    }
  }

  const untouched = results.filter(r => r.cleared.length === 0 && r.errors.length === 0).length;

  console.log(`\nDone. ${totalCleared} district(s) cleared across ${results.filter(r => r.cleared.length > 0).length} file(s).`);
  console.log(`${untouched} file(s) had no "Oklahoma" contamination.`);
  if (totalErrors > 0) console.log(`${totalErrors} error(s) encountered — see above.`);
}

main();
