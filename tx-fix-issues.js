'use strict';
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const MODEL = 'claude-sonnet-4-6';
const DISTRICTS_FILE = path.join(__dirname, 'tx-districts.js');
const VALID_TAGS = new Set(['lean-into', 'careful', 'avoid']);
const BATCH_SIZE = 20;

const client = new Anthropic();

const STYLE_REF = `[
  { "name": "Energy & Manufacturing Economy", "tag": "lean-into", "why": "HD-6 is anchored in oil, gas, petrochemical, and manufacturing sectors in the Longview metro. At 29.7% college attainment, regulatory and market forces affecting these industries directly determine household stability. Candidates who speak to specific Gregg and Smith county employer pressures — not generic energy talking points — earn constituency credibility." },
  { "name": "Property Taxes on Working-Class Homeowners", "tag": "lean-into", "why": "At $70,661 median income, HD-6 homeowners feel appraisal increases acutely. East Texas metro owners have watched values rise without commensurate income growth. Specific local framing — citing actual Gregg/Upshur county appraisal trends — outperforms abstract tax-relief commitments every time." },
  { "name": "Rental Housing Pressures", "tag": "careful", "why": "At 33.6% renters in a mid-income metro, housing costs are a live concern for a significant household share. Acknowledging both homeowner property tax burdens and renter affordability earns broader constituency than speaking only to owners in a district where a third of residents rent." },
  { "name": "National Partisan Messaging Over Local Service", "tag": "avoid", "why": "In a 72-28 district where 38% of residents are Black or Hispanic, broad partisan messaging that ignores demographic reality substitutes poorly for constituent service. Voters who feel their representative is focused elsewhere — not on East Texas jobs, housing, and healthcare — can be mobilized by a challenger when structural advantage is taken for granted." },
  { "name": "Treating Minority Communities as Non-Constituency", "tag": "avoid", "why": "At 21% Hispanic and 18% Black, minority residents exceed 38% of the district. Governing as if the margin is the only constituency — skipping outreach, ignoring service gaps, assuming these communities are politically irrelevant — forfeits the constituent-service credibility that keeps a safe seat structurally safe over time." }
]`;

function parseDistricts() {
  const src = fs.readFileSync(DISTRICTS_FILE, 'utf8');
  const fn = new Function(
    src
      .replace('const DEMO_COLORS', 'var DEMO_COLORS')
      .replace('const TX_HOUSE_DISTRICTS', 'var TX_HOUSE_DISTRICTS')
      .replace('const TX_SENATE_DISTRICTS', 'var TX_SENATE_DISTRICTS') +
    '\nreturn TX_HOUSE_DISTRICTS;'
  );
  return fn();
}

function districtCtx(d) {
  const db = d.dashboard;
  const stats = db.stats || [];
  const income  = (stats.find(s => s.label.includes('Income'))  || {}).value || 'N/A';
  const college = (stats.find(s => s.label.includes('College')) || {}).value || 'N/A';
  const age     = (stats.find(s => s.label.includes('Age'))     || {}).value || 'N/A';
  const renter  = (stats.find(s => s.label.includes('Renter'))  || {}).value || 'N/A';
  const demos   = (db.demos || []).map(x => `${x.label} ${x.pct}%`).join(', ');
  return {
    id: d.id, city: d.city, region: d.region,
    party: d.incumbentParty, dem: db.dem, rep: db.rep,
    partisan: db.partisanSub,
    income, college, age, renter, demos,
    memo: db.memoHeadline,
  };
}

function buildPrompt(batch) {
  const lines = batch.map(c =>
    `${c.id} | ${c.city}, ${c.region} | ${c.party} ${c.dem}D-${c.rep}R | ${c.partisan}\n` +
    `  Income:${c.income} College:${c.college} Age:${c.age} Renter:${c.renter}\n` +
    `  Demo: ${c.demos}\n` +
    `  Memo: ${c.memo}`
  ).join('\n\n');

  return `Generate strategic issues arrays for Texas legislative districts. Each district needs exactly 5 issues in this order: 2 "lean-into", 1 "careful", 2 "avoid".

Tag meanings:
- lean-into: Issues to actively champion — local economic strengths, constituent priorities, authentic opportunities
- careful: A real concern requiring nuanced handling — not avoidance or full ownership, requires calibration
- avoid: A specific framing, messaging approach, or position that will backfire given this district's demographics, economy, and political character

Style reference (tx-hd-6):
${STYLE_REF}

Rules:
- name: 3-6 words, concrete and specific (not "Economic Issues")
- why: exactly 2-3 sentences. Reference the specific district's actual data — income, demographics, margin, city/region. No generic talking points.
- avoid items must name a specific messaging risk, not just "don't talk about X"
- Match the analytical, direct tone of the reference

Return ONLY a valid JSON object, no markdown: { "tx-hd-N": [{name, tag, why}, ...], ... }

Districts:
${lines}`;
}

function replaceIssues(content, districtId, newIssues) {
  const idMarker = `    id: "${districtId}"`;
  const idIdx = content.indexOf(idMarker);
  if (idIdx === -1) throw new Error(`${districtId} not found`);

  const issuesMarker = '      issues: [';
  const issuesStart = content.indexOf(issuesMarker, idIdx);
  if (issuesStart === -1) throw new Error(`No issues array for ${districtId}`);

  const memoMarker = '      memoHeadline:';
  const memoStart = content.indexOf(memoMarker, issuesStart);
  if (memoStart === -1) throw new Error(`No memoHeadline for ${districtId}`);

  // Find last ], between issues start and memoHeadline
  const section = content.slice(issuesStart, memoStart);
  const closingIdx = section.lastIndexOf('],');
  if (closingIdx === -1) throw new Error(`No closing ], for ${districtId}`);
  const issuesEnd = issuesStart + closingIdx + 2;

  const serialized = '      issues: [\n' +
    newIssues.map(i =>
      `        { name: ${JSON.stringify(i.name)}, tag: ${JSON.stringify(i.tag)}, why: ${JSON.stringify(i.why)} }`
    ).join(',\n') +
    '\n      ],';

  return content.slice(0, issuesStart) + serialized + content.slice(issuesEnd);
}

async function callClaude(prompt) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  });
  let text = response.content[0].text.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return JSON.parse(text);
}

async function callWithSplit(contexts, minSize = 5) {
  try {
    return await callClaude(buildPrompt(contexts));
  } catch (err) {
    if (err instanceof SyntaxError && contexts.length > minSize) {
      const half = Math.ceil(contexts.length / 2);
      console.log(`  Truncated at ${contexts.length} districts, splitting to ${half}+${contexts.length - half}...`);
      const a = await callWithSplit(contexts.slice(0, half), minSize);
      const b = await callWithSplit(contexts.slice(half), minSize);
      return { ...a, ...b };
    }
    throw err;
  }
}

async function processBatch(batch) {
  return callWithSplit(batch);
}

async function main() {
  const houseDistricts = parseDistricts();
  const bad = houseDistricts.filter(d =>
    (d.dashboard.issues || []).some(i => !VALID_TAGS.has(i.tag))
  );
  console.log(`Found ${bad.length} districts with thematic tags.\n`);

  const batches = [];
  for (let i = 0; i < bad.length; i += BATCH_SIZE) {
    batches.push(bad.slice(i, i + BATCH_SIZE));
  }
  console.log(`Processing ${batches.length} batches of up to ${BATCH_SIZE}.\n`);

  let content = fs.readFileSync(DISTRICTS_FILE, 'utf8');
  let totalUpdated = 0;

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    const label = `Batch ${b + 1}/${batches.length}`;
    console.log(`═══ ${label} — ${batch.map(d => d.id).join(', ')} ═══`);

    const contexts = batch.map(districtCtx);
    const result = await processBatch(contexts);

    let batchUpdated = 0;
    for (const ctx of contexts) {
      const issues = result[ctx.id];
      if (!Array.isArray(issues) || issues.length !== 5) {
        console.warn(`  ✗ ${ctx.id}: missing or wrong-length response`);
        continue;
      }
      const leans  = issues.filter(i => i.tag === 'lean-into').length;
      const careful = issues.filter(i => i.tag === 'careful').length;
      const avoid  = issues.filter(i => i.tag === 'avoid').length;
      if (leans !== 2 || careful !== 1 || avoid !== 2) {
        console.warn(`  ✗ ${ctx.id}: wrong tag counts (lean-into:${leans} careful:${careful} avoid:${avoid})`);
        continue;
      }
      content = replaceIssues(content, ctx.id, issues);
      batchUpdated++;
      console.log(`  ✓ ${ctx.id}`);
    }

    totalUpdated += batchUpdated;
    fs.writeFileSync(DISTRICTS_FILE, content);
    console.log(`  → Saved. ${batchUpdated}/${batch.length} updated this batch. Running total: ${totalUpdated}/${bad.length}\n`);
  }

  console.log(`Complete. ${totalUpdated}/${bad.length} districts updated.`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
