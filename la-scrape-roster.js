'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const MISSING_SENATE = [3, 4, 5, 7, 10, 11, 14, 15, 16, 17, 18, 23, 24, 26, 27, 28, 29, 30, 32, 35];
const MISSING_HOUSE  = [3, 5, 8, 10, 11, 12, 13, 14, 16, 17, 22, 27, 29, 32, 33, 35, 36, 37, 38, 41,
                        46, 47, 51, 52, 54, 55, 56, 58, 59, 60, 61, 67, 69, 77, 78, 79, 80, 82, 84,
                        86, 93, 96, 97, 98, 99, 100, 101, 102];

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function parseMember(html) {
  const nameMatch  = html.match(/id="body_FormView1111_FULLNAME1Label">([^<]+)</);
  const partyMatch = html.match(/id="body_FormView1111_PARTYAFFILIATION1Label">([^<]+)</);
  const distMatch  = html.match(/id="body_FormView1111_DISTRICTNUMBER1Label">([^<]+)</);
  if (!nameMatch) return null;
  const rawParty = (partyMatch?.[1] || '').trim();
  const party = rawParty.startsWith('Rep') ? 'REP'
              : rawParty.startsWith('Dem') ? 'DEM'
              : rawParty.toUpperCase().slice(0, 3) || 'UNK';
  return {
    name:     nameMatch[1].trim(),
    party,
    district: distMatch ? parseInt(distMatch[1].trim(), 10) : null,
  };
}

// Fetch with a small delay to avoid hammering the server
async function fetchWithDelay(url, ms = 150) {
  const html = await fetch(url);
  await new Promise(r => setTimeout(r, ms));
  return html;
}

async function scrapeDistricts(urlFn, districtNums, label) {
  const results = {};
  for (const d of districtNums) {
    const url = urlFn(d);
    try {
      const html = await fetchWithDelay(url);
      const member = parseMember(html);
      if (member) {
        results[d] = member;
        process.stdout.write(`  ${label} ${d}: ${member.name} (${member.party})\n`);
      } else {
        process.stdout.write(`  ${label} ${d}: no data found\n`);
      }
    } catch (err) {
      process.stdout.write(`  ${label} ${d}: fetch error — ${err.message}\n`);
    }
  }
  return results;
}

async function main() {
  const dataPath = path.join(__dirname, 'la-elections-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(`Fetching ${MISSING_SENATE.length} missing Senate districts...`);
  const senateMembers = await scrapeDistricts(
    d => `https://senate.la.gov/smembers?ID=${d}`,
    MISSING_SENATE,
    'SD'
  );

  console.log(`\nFetching ${MISSING_HOUSE.length} missing House districts...`);
  const houseMembers = await scrapeDistricts(
    d => `https://house.louisiana.gov/H_Reps/members?ID=${d}`,
    MISSING_HOUSE,
    'HD'
  );

  // Merge into elections data
  let sFilled = 0, hFilled = 0;

  for (const [d, member] of Object.entries(senateMembers)) {
    const key = String(d);
    if (!data.senate[key]) {
      data.senate[key] = { winner: member.name, party: member.party, pct: 100, unopposed: true };
      sFilled++;
    }
  }

  for (const [d, member] of Object.entries(houseMembers)) {
    const key = String(d);
    if (!data.house[key]) {
      data.house[key] = { winner: member.name, party: member.party, pct: 100, unopposed: true };
      hFilled++;
    }
  }

  // Sort both chambers by district number
  data.senate = Object.fromEntries(
    Object.entries(data.senate).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  );
  data.house = Object.fromEntries(
    Object.entries(data.house).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  );

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log(`\nResults:`);
  console.log(`  Senate districts filled: ${sFilled} / ${MISSING_SENATE.length}`);
  console.log(`  House districts filled:  ${hFilled} / ${MISSING_HOUSE.length}`);
  console.log(`  Senate total: ${Object.keys(data.senate).length} / 39`);
  console.log(`  House total:  ${Object.keys(data.house).length} / 105`);

  const remainS = MISSING_SENATE.filter(d => !data.senate[String(d)]);
  const remainH = MISSING_HOUSE.filter(d => !data.house[String(d)]);
  if (remainS.length) console.log(`  Still missing Senate: SD ${remainS.join(', ')}`);
  if (remainH.length) console.log(`  Still missing House:  HD ${remainH.join(', ')}`);
  if (!remainS.length && !remainH.length) console.log('  All missing districts filled!');

  console.log('\nWritten to la-elections-data.json');
}

main().catch(err => { console.error(err); process.exit(1); });
