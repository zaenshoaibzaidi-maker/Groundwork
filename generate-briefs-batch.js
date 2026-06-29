/* generate-briefs-batch.js — Generate AI strategy briefs via Anthropic Batch API
 *
 * Usage: node generate-briefs-batch.js <districts-file>
 * Example: node generate-briefs-batch.js ga-districts.js
 *
 * Submits all empty districts as a single batch job, polls until complete,
 * then writes results back to the districts file.
 */

'use strict';

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fs   = require('fs');
const path = require('path');

const MODEL = 'claude-haiku-4-5-20251001';

// ── Validate CLI args ─────────────────────────────────────────────────────────

const [,, targetFile] = process.argv;
if (!targetFile) {
  console.error('Usage: node generate-briefs-batch.js <districts-file>');
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY not set in .env');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), targetFile);

// ── Extract and evaluate a dashboard block from a districts file ──────────────

function extractDashboardJSON(src, id) {
  const idStr    = `"${id}"`;
  const altIdStr = `'${id}'`;
  let start = src.indexOf(`id: ${idStr}`);
  if (start === -1) start = src.indexOf(`id: ${altIdStr}`);
  if (start === -1) return null;

  const dashStart = src.indexOf('dashboard: {', start);
  if (dashStart === -1) return null;

  let depth = 0;
  let objStart = -1;
  for (let i = dashStart + 'dashboard: '.length; i < src.length; i++) {
    if (src[i] === '{') {
      if (depth === 0) objStart = i;
      depth++;
    } else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(objStart, i + 1);
    }
  }
  return null;
}

function evalDashboard(raw) {
  try {
    const DEMO_COLORS = ['#4e9e68', '#2563eb', '#f59e0b', '#ef4444'];
    // eslint-disable-next-line no-new-func
    return new Function('DEMO_COLORS', `return (${raw});`)(DEMO_COLORS);
  } catch { return null; }
}

// ── Scan target file for districts with empty issues ─────────────────────────

function findEmptyDistricts(src) {
  const results = [];
  const idRegex = /id:\s*["']([^"']+)["']/g;
  let match;
  while ((match = idRegex.exec(src)) !== null) {
    const id    = match[1];
    const raw   = extractDashboardJSON(src, id);
    if (!raw) continue;
    const dashboard = evalDashboard(raw);
    if (!dashboard) continue;
    if (Array.isArray(dashboard.issues) && dashboard.issues.length === 0) {
      const idPos   = match.index;
      const dashPos = src.indexOf('dashboard:', idPos);
      const slice   = dashPos !== -1 ? src.slice(idPos, dashPos) : '';
      let seatCount = 1;
      if (slice.includes('incumbents:')) {
        const partyMatches = slice.slice(slice.indexOf('incumbents:')).match(/\bparty:/g);
        seatCount = partyMatches ? partyMatches.length : 1;
      }
      results.push({ id, dashboard, seatCount });
    }
  }
  return results;
}

// ── Build the API prompt ──────────────────────────────────────────────────────

function buildPrompt(districtId, dashboard, seatCount = 1) {
  const statsLines = (dashboard.stats || []).map(s => `${s.label}: ${s.value}`);
  if (seatCount > 1) {
    statsLines.push(`Seat type: ${seatCount}-seat at-large district (candidate must finish in top ${seatCount} to win)`);
  }
  const stats = statsLines.join('\n');
  const demos    = (dashboard.demos  || []).map(d => `${d.label}: ${d.pct}%`).join('\n');
  const dem      = dashboard.dem ?? '?';
  const rep      = dashboard.rep ?? '?';
  const partisan = dashboard.partisanSub || `${rep}% R / ${dem}% D`;

  return `You are a nonpartisan political strategist producing district intelligence briefs. Optimize for vote-winning strategy specific to each district's competitive context — analyze what the data reveals about the constituency and what a candidate must do to win or hold this seat. Do not apply partisan ideology frames.

Produce a complete brief for ${districtId} based on its demographic and electoral data below. Ground every claim strictly in this district's own numbers — do not invent facts not present in the data, and do not reference or compare to any other state, district, or region by name. Treat this district as a self-contained case: all framing, comparisons, and strategic claims must derive only from the stats, demographics, and partisan result given here.

## District Data

Stats:
${stats}

Demographics:
${demos}
(If these categories sum to less than 100%, the gap is almost certainly American Indian / Alaska Native — note it in analysis where relevant)

Partisan result: ${partisan} (Dem: ${dem}%, Rep: ${rep}%)

## Output Format

Return ONLY a valid JSON object with exactly these fields. No markdown, no extra text, no code fences:

{
  "issues": [
    { "name": "...", "tag": "lean-into", "why": "..." },
    { "name": "...", "tag": "lean-into", "why": "..." },
    { "name": "...", "tag": "careful",   "why": "..." },
    { "name": "...", "tag": "avoid",     "why": "..." },
    { "name": "...", "tag": "avoid",     "why": "..." }
  ],
  "memoHeadline": "...",
  "memoParagraphs": ["paragraph1", "paragraph2"],
  "memoBullets": ["bullet1", "bullet2", "bullet3", "bullet4"]
}

Constraints:
- issues: exactly 2 lean-into, 1 careful, 2 avoid. Each "why" is 3-5 sentences of specific strategic analysis grounded in this district's actual numbers — not generic.
- memoHeadline: one punchy sentence capturing the district's strategic essence.
- memoParagraphs: exactly 2 strings, each 4-6 sentences. Rich analytical prose, not summaries.
- memoBullets: exactly 4 strings, each 1-2 sentences. Actionable strategic guidance.
- Reference specific numbers from the district data (income, margins, percentages) throughout.
- Do not name any other state, district, city, or region anywhere in the output — every comparison must be implicit and grounded in this district's own data, not a named external place.`;
}

// ── Serialize a brief back into JS source ─────────────────────────────────────

function escapeStr(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function serializeDashboard(dashboard, brief, baseIndent) {
  const p  = ' '.repeat(baseIndent);
  const p2 = ' '.repeat(baseIndent + 2);
  const p3 = ' '.repeat(baseIndent + 4);

  const statsStr = (dashboard.stats || [])
    .map(s => `${p3}{ label: "${escapeStr(s.label)}", value: "${escapeStr(s.value)}", sub: "${escapeStr(s.sub ?? '')}" }`)
    .join(',\n');

  const demosStr = (dashboard.demos || [])
    .map(d => `${p3}{ label: "${escapeStr(d.label)}", pct: ${d.pct}, color: ${JSON.stringify(d.color)} }`)
    .join(',\n');

  const issuesStr = brief.issues
    .map(i => `${p3}{ name: "${escapeStr(i.name)}", tag: "${i.tag}", why: "${escapeStr(i.why)}" }`)
    .join(',\n');

  const parasStr = brief.memoParagraphs
    .map(para => `${p3}"${escapeStr(para)}"`)
    .join(',\n');

  const bulletsStr = brief.memoBullets
    .map(b => `${p3}"${escapeStr(b)}"`)
    .join(',\n');

  const chipsStr = (dashboard.chips || []).length === 0
    ? '[]'
    : JSON.stringify(dashboard.chips);

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
${p2}issues: [
${issuesStr}
${p2}],
${p2}memoHeadline: "${escapeStr(brief.memoHeadline)}",
${p2}memoParagraphs: [
${parasStr}
${p2}],
${p2}memoBullets: [
${bulletsStr}
${p2}]
${p}}`;
}

function injectBriefIntoSrc(src, id, brief, existingDashboard) {
  let idStart = src.indexOf(`id: "${id}"`);
  if (idStart === -1) idStart = src.indexOf(`id: '${id}'`);
  if (idStart === -1) return src;

  const dashStart = src.indexOf('dashboard: {', idStart);
  if (dashStart === -1) return src;

  let depth = 0;
  let objStart = -1;
  let objEnd   = -1;
  for (let i = dashStart + 'dashboard: '.length; i < src.length; i++) {
    if (src[i] === '{') {
      if (depth === 0) objStart = i;
      depth++;
    } else if (src[i] === '}') {
      depth--;
      if (depth === 0) { objEnd = i + 1; break; }
    }
  }
  if (objStart === -1 || objEnd === -1) return src;

  let lineStart = dashStart;
  while (lineStart > 0 && src[lineStart - 1] !== '\n') lineStart--;
  const baseIndent = (dashStart - lineStart) + 2;

  const newObj = serializeDashboard(existingDashboard, brief, baseIndent);
  return src.slice(0, objStart) + newObj + src.slice(objEnd);
}

// ── Poll helper ───────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatCounts(counts) {
  return `processing=${counts.processing} succeeded=${counts.succeeded} errored=${counts.errored}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const fileSrc        = fs.readFileSync(filePath, 'utf8');
  const emptyDistricts = findEmptyDistricts(fileSrc);

  if (emptyDistricts.length === 0) {
    console.log('No districts with empty issues found.');
    return;
  }

  console.log(`Found ${emptyDistricts.length} district(s) with empty issues.`);

  const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });

  // ── Build batch requests ──────────────────────────────────────────────────

  const requests = emptyDistricts.map(({ id, dashboard, seatCount }) => ({
    custom_id: id,
    params: {
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: buildPrompt(id, dashboard, seatCount) }],
    },
  }));

  // ── Submit batch ──────────────────────────────────────────────────────────

  console.log('Submitting batch...');
  const batch = await client.messages.batches.create({ requests });

  console.log(`\nBatch ID: ${batch.id}`);
  console.log(`Status:   ${batch.processing_status}`);
  console.log(`Total:    ${requests.length} requests\n`);

  // ── Poll until complete ───────────────────────────────────────────────────

  let status = batch;
  while (status.processing_status !== 'ended') {
    await sleep(60_000);
    status = await client.messages.batches.retrieve(batch.id);
    const counts = status.request_counts;
    console.log(`[${new Date().toISOString()}] ${status.processing_status} — ${formatCounts(counts)}`);
  }

  console.log('\nBatch ended. Writing results...\n');

  // ── Build a lookup map from the district array for fast dashboard access ──

  const dashboardByID = Object.fromEntries(
    emptyDistricts.map(({ id, dashboard }) => [id, dashboard])
  );

  // ── Stream results and write back ─────────────────────────────────────────

  let succeeded = 0;
  let errored   = 0;

  // Collect all results first so we can write sequentially without re-reading
  // the file inside an async iterator (keeps write logic simple).
  const results = [];
  for await (const result of await client.messages.batches.results(batch.id)) {
    results.push(result);
  }

  // Write sequentially: each write re-reads the file so positions stay fresh.
  for (const result of results) {
    const id = result.custom_id;

    if (result.result.type !== 'succeeded') {
      console.log(`[${id}] ERROR — ${result.result.type}`);
      errored++;
      continue;
    }

    try {
      const raw     = result.result.message.content[0].text.trim();
      const jsonStr = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
      const brief   = JSON.parse(jsonStr);
      const dashboard = dashboardByID[id];

      let src = fs.readFileSync(filePath, 'utf8');
      src = injectBriefIntoSrc(src, id, brief, dashboard);
      fs.writeFileSync(filePath, src, 'utf8');

      console.log(`[${id}] written`);
      succeeded++;
    } catch (err) {
      console.log(`[${id}] PARSE ERROR — ${err.message}`);
      errored++;
    }
  }

  console.log(`\nAll done. ${succeeded} written, ${errored} errored.`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
