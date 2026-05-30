/* generate-briefs.js — Generate AI strategy briefs for empty districts
 *
 * Usage: node generate-briefs.js <districts-file>
 * Example: node generate-briefs.js ky-districts.js
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
  console.error('Usage: node generate-briefs.js <districts-file>');
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY not set in .env');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), targetFile);
const okPath   = path.resolve(process.cwd(), 'ok-districts.js');

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

// ── Load example briefs from ok-districts.js ─────────────────────────────────

const okSrc = fs.readFileSync(okPath, 'utf8');

function getExampleDashboard(id) {
  const raw = extractDashboardJSON(okSrc, id);
  return raw ? evalDashboard(raw) : null;
}

const exampleHD4  = getExampleDashboard('ok-hd-4');
const exampleHD15 = getExampleDashboard('ok-hd-15');
const exampleHD65 = getExampleDashboard('ok-hd-65');

if (!exampleHD4 || !exampleHD15 || !exampleHD65) {
  console.error('Could not load example briefs from ok-districts.js');
  process.exit(1);
}

function briefToText(label, d) {
  const issueLines = d.issues.map(
    i => `  - name: "${i.name}", tag: "${i.tag}"\n    why: "${i.why}"`
  ).join('\n');
  return `=== ${label} ===
memoHeadline: ${d.memoHeadline}

memoParagraphs:
1. ${d.memoParagraphs[0]}
2. ${d.memoParagraphs[1]}

memoBullets:
- ${d.memoBullets.join('\n- ')}

issues:
${issueLines}
`;
}

const EXAMPLES_TEXT = [
  briefToText('HD-4 (Cherokee Nation / University Town, 68% R)',              exampleHD4),
  briefToText('HD-15 (Most competitive in sequence, 53% R, AIAN swing)',      exampleHD15),
  briefToText('HD-65 (SW Oklahoma, 60% R, largest AIAN gap, youngest dist)',  exampleHD65),
].join('\n');

// ── Scan target file for districts with empty issues ─────────────────────────

function findEmptyDistricts(src) {
  const results = [];
  const idRegex = /id:\s*["']([^"']+)["']/g;
  let match;
  while ((match = idRegex.exec(src)) !== null) {
    const id    = match[1];
    const idPos = match.index;
    const raw   = extractDashboardJSON(src, id);
    if (!raw) continue;
    const dashboard = evalDashboard(raw);
    if (!dashboard) continue;
    if (Array.isArray(dashboard.issues) && dashboard.issues.length === 0) {
      results.push({ id, idPos, dashboard });
    }
  }
  return results;
}

// ── Build the API prompt ──────────────────────────────────────────────────────

function buildPrompt(districtId, dashboard) {
  const stats    = (dashboard.stats  || []).map(s => `${s.label}: ${s.value}`).join('\n');
  const demos    = (dashboard.demos  || []).map(d => `${d.label}: ${d.pct}%`).join('\n');
  const dem      = dashboard.dem ?? '?';
  const rep      = dashboard.rep ?? '?';
  const partisan = dashboard.partisanSub || `${rep}% R / ${dem}% D`;

  return `You are a nonpartisan political strategist producing district intelligence briefs. Optimize for vote-winning strategy specific to each district's competitive context — analyze what the data reveals about the constituency and what a candidate must do to win or hold this seat. Do not apply partisan ideology frames.

Produce a complete brief for ${districtId} based on its demographic and electoral data.

## District Data

Stats:
${stats}

Demographics:
${demos}
(If these categories sum to less than 100%, the gap is almost certainly American Indian / Alaska Native — note it in analysis where relevant)

Partisan result: ${partisan} (Dem: ${dem}%, Rep: ${rep}%)

## Quality Examples — Study and Match

${EXAMPLES_TEXT}

## Output Format

Return ONLY a valid JSON object with exactly these fields. No markdown, no extra text, no code fences:

{
  "city": "...",
  "region": "...",
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
- city: the primary city or town the district covers (replace any existing "TBD" value).
- region: a geographic region label appropriate to the state's geography, e.g. "Charlotte Metro", "Piedmont Triad", "Coastal Plain", "Mississippi Delta", "Texas Panhandle" (replace any existing "TBD" value).
- issues: exactly 2 lean-into, 1 careful, 2 avoid. Each "why" is 3-5 sentences of specific strategic analysis grounded in this district's actual numbers — not generic.
- memoHeadline: one punchy sentence capturing the district's strategic essence.
- memoParagraphs: exactly 2 strings, each 4-6 sentences. Rich analytical prose, not summaries.
- memoBullets: exactly 4 strings, each 1-2 sentences. Actionable strategic guidance.
- Reference specific numbers from the district data (income, margins, percentages) throughout.`;
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

  const parasStr  = brief.memoParagraphs
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

// Replaces `fieldName: "old value"` within [rangeStart, rangeEnd) in src.
function replaceTopLevelField(src, fieldName, newValue, rangeStart, rangeEnd) {
  const before  = src.slice(0, rangeStart);
  const segment = src.slice(rangeStart, rangeEnd);
  const after   = src.slice(rangeEnd);
  const re = new RegExp(`(${fieldName}:\\s*)["'][^"'\\n]*["']`);
  return before + segment.replace(re, `$1"${escapeStr(newValue)}"`) + after;
}

function injectBriefIntoSrc(src, id, brief, existingDashboard) {
  // Locate the id declaration
  let idStart = src.indexOf(`id: "${id}"`);
  if (idStart === -1) idStart = src.indexOf(`id: '${id}'`);
  if (idStart === -1) return src;

  // Locate the dashboard block
  const dashStart = src.indexOf('dashboard: {', idStart);
  if (dashStart === -1) return src;

  // Find the outer braces of the dashboard value
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

  // Measure indentation of the 'dashboard:' keyword
  let lineStart = dashStart;
  while (lineStart > 0 && src[lineStart - 1] !== '\n') lineStart--;
  const baseIndent = (dashStart - lineStart) + 2; // +2 to indent the object body

  // Replace dashboard block. city/region sit before objStart so their positions
  // are unaffected — update them using the original idStart..dashStart range.
  const newObj = serializeDashboard(existingDashboard, brief, baseIndent);
  src = src.slice(0, objStart) + newObj + src.slice(objEnd);

  if (brief.city)   src = replaceTopLevelField(src, 'city',   brief.city,   idStart, dashStart);
  if (brief.region) src = replaceTopLevelField(src, 'region', brief.region, idStart, dashStart);

  return src;
}

// ── Concurrency helpers ───────────────────────────────────────────────────────

const CONCURRENCY = 5;

// Runs `tasks` through `worker` with at most `limit` simultaneous calls.
// Uses a shared queue consumed by `limit` long-running async workers so that
// a new task starts as soon as any slot opens — identical to the fetch scripts.
async function runWithConcurrency(tasks, limit, worker) {
  const queue = [...tasks];
  async function drain() {
    while (queue.length > 0) {
      const task = queue.shift();
      if (task) await worker(task);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, drain));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  const fileSrc = fs.readFileSync(filePath, 'utf8');
  const emptyDistricts = findEmptyDistricts(fileSrc);

  if (emptyDistricts.length === 0) {
    console.log('No districts with empty issues found.');
    return;
  }

  if (isDryRun) {
    console.log(`Found ${emptyDistricts.length} district(s) with empty issues.`);
    console.log(`[DRY RUN] Simulating concurrency=${CONCURRENCY} — no API calls or writes.\n`);

    let inFlight = 0;
    let maxSeen  = 0;

    await runWithConcurrency(emptyDistricts, CONCURRENCY, async ({ id }) => {
      inFlight++;
      maxSeen = Math.max(maxSeen, inFlight);
      console.log(`  [start] ${id}  (in-flight: ${inFlight})`);
      // Simulate variable API latency so slots don't all finish together
      await new Promise(r => setTimeout(r, 40 + Math.random() * 80));
      inFlight--;
      console.log(`  [ end ] ${id}  (in-flight: ${inFlight})`);
    });

    console.log(`\n[DRY RUN] Max observed concurrency: ${maxSeen} / ${CONCURRENCY} (expected ≤ ${CONCURRENCY})`);
    console.log(`[DRY RUN] ${emptyDistricts.length} district(s) would be processed.`);
    console.log('\nAll done.');
    return;
  }

  console.log(`Found ${emptyDistricts.length} district(s) with empty issues.`);
  console.log(`Generating briefs (concurrency=${CONCURRENCY})...\n`);

  const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Writes must be serialized: each write re-reads the file by position, so two
  // simultaneous writes would corrupt each other.  We chain each write onto this
  // promise so they execute one at a time regardless of when API calls finish.
  let writeChain = Promise.resolve();

  await runWithConcurrency(emptyDistricts, CONCURRENCY, async ({ id, dashboard }) => {
    console.log(`[${id}] generating...`);
    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 2000,
        messages: [{ role: 'user', content: buildPrompt(id, dashboard) }],
      });

      const raw     = response.content[0].text.trim();
      const jsonStr = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
      const brief   = JSON.parse(jsonStr);

      // Capture for the closure; enqueue the write and wait for it so this slot
      // doesn't release until the write is committed (keeps progress accurate).
      const savedId        = id;
      const savedBrief     = brief;
      const savedDashboard = dashboard;
      writeChain = writeChain.then(() => {
        // Re-read before every write so positions are always fresh
        let src = fs.readFileSync(filePath, 'utf8');
        src = injectBriefIntoSrc(src, savedId, savedBrief, savedDashboard);
        fs.writeFileSync(filePath, src, 'utf8');
        console.log(`[${savedId}] written`);
      });
      await writeChain;

    } catch (err) {
      console.log(`[${id}] ERROR — ${err.message}`);
    }
  });

  // Ensure the last queued write finishes before we exit
  await writeChain;

  console.log('\nAll done.');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
