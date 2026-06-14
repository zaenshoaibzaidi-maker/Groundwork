'use strict';

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const ASSEMBLY_PDF = 'nj 2025-official-general-results-general-assembly.pdf';
const SENATE_PDF = 'nj 2023 general election state senate results.pdf';

const ASSEMBLY_TOTAL_DISTRICTS = 40;
const SENATE_TOTAL_DISTRICTS = 40;

// New Jersey's 21 counties, longest first so prefix-matching against
// "<COUNTY><PARTY><VOTES>" strings picks the right county.
const NJ_COUNTIES = [
  'ATLANTIC', 'BERGEN', 'BURLINGTON', 'CAMDEN', 'CAPE MAY', 'CUMBERLAND', 'ESSEX', 'GLOUCESTER',
  'HUDSON', 'HUNTERDON', 'MERCER', 'MIDDLESEX', 'MONMOUTH', 'MORRIS', 'OCEAN', 'PASSAIC', 'SALEM',
  'SOMERSET', 'SUSSEX', 'UNION', 'WARREN',
].sort((a, b) => b.length - a.length);

const ORDINAL_ONES = {
  First: 1, Second: 2, Third: 3, Fourth: 4, Fifth: 5, Sixth: 6, Seventh: 7, Eighth: 8, Ninth: 9,
  Tenth: 10, Eleventh: 11, Twelfth: 12, Thirteenth: 13, Fourteenth: 14, Fifteenth: 15,
  Sixteenth: 16, Seventeenth: 17, Eighteenth: 18, Nineteenth: 19, Twentieth: 20,
  Thirtieth: 30, Fortieth: 40,
};
const ORDINAL_TENS = { Twenty: 20, Thirty: 30, Forty: 40 };

function ordinalToNumber(word) {
  if (ORDINAL_ONES[word] != null) return ORDINAL_ONES[word];
  const parts = word.split('-');
  if (parts.length === 2 && ORDINAL_TENS[parts[0]] != null && ORDINAL_ONES[parts[1]] != null) {
    return ORDINAL_TENS[parts[0]] + ORDINAL_ONES[parts[1]];
  }
  return null;
}

// The "Official List" report lays candidate name / address / party / county /
// county-party / "Total" label / vote tally out in fixed x-position columns.
function columnFor(x) {
  if (x < 134) return 'name';
  if (x < 255) return 'addr';
  if (x < 315) return 'party';
  if (x < 365) return 'county';
  if (x < 420) return 'countyParty';
  if (x < 560) return 'label';
  return 'votes';
}

async function extractRows(pdfPath) {
  const data = fs.readFileSync(pdfPath);
  const rows = [];

  function render(pageData) {
    return pageData.getTextContent().then((tc) => {
      const items = tc.items.map((it) => ({ str: it.str, x: it.transform[4], y: it.transform[5] }));
      const pageRows = [];
      for (const it of items) {
        let row = pageRows.find((r) => Math.abs(r.y - it.y) < 1.5);
        if (!row) {
          row = { y: it.y, name: [], addr: [], party: [], county: [], countyParty: [], label: [], votes: [] };
          pageRows.push(row);
        }
        row[columnFor(it.x)].push(it);
      }
      pageRows.sort((a, b) => b.y - a.y);
      for (const row of pageRows) {
        const flat = {};
        for (const col of ['name', 'addr', 'party', 'county', 'countyParty', 'label', 'votes']) {
          flat[col] = row[col].sort((a, b) => a.x - b.x).map((i) => i.str).join('');
        }
        rows.push(flat);
      }
      return '';
    });
  }

  await pdf(data, { pagerender: render });
  return rows;
}

function cleanName(raw) {
  return raw
    .replace(/\s*\(w\)\s*\*?\s*$/i, '')
    .replace(/\s*\*\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveDistrict(candidates, seats) {
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const total = sorted.reduce((s, c) => s + c.votes, 0);
  const unopposed = sorted.length <= seats;

  const withPct = sorted.map((c) => ({
    name: cleanName(c.name),
    party: c.party,
    votes: c.votes,
    pct: total > 0 ? parseFloat(((c.votes / total) * 100).toFixed(2)) : 0,
  }));

  if (seats === 1) {
    const w = withPct[0];
    return {
      winner: w.name,
      party: w.party,
      pct: w.pct,
      seats: 1,
      unopposed,
      candidates: withPct,
    };
  }

  const winners = withPct.slice(0, seats).map(({ name, party, pct }) => ({ name, party, pct }));
  return {
    winners,
    seats,
    unopposed,
    candidates: withPct,
  };
}

function parseDistricts(rows, seats) {
  const districts = {};
  let currentDistrictId = null;
  let currentCandidate = null;
  let candidates = [];

  function flushDistrict() {
    if (currentCandidate) {
      candidates.push(currentCandidate);
      currentCandidate = null;
    }
    if (currentDistrictId != null && candidates.length) {
      districts[currentDistrictId] = resolveDistrict(candidates, seats);
    }
    candidates = [];
  }

  for (const row of rows) {
    const nameTrim = row.name.trim();

    // Skip the repeated report header/footer boilerplate.
    if (nameTrim === 'Name' && row.addr.trim() === 'Address') continue;
    if (nameTrim.startsWith('For GENERAL ELECTION')) continue;

    // The final summary page ("Candidate Totals for Party") - stop parsing.
    if (nameTrim.startsWith('Candidate Totals for Party')) {
      flushDistrict();
      currentDistrictId = null;
      continue;
    }

    // District header, e.g. "Twelfth Legislative District: ... Counties"
    const headerMatch = nameTrim.match(/^([A-Za-z-]+) Legislative District:/);
    if (headerMatch) {
      const num = ordinalToNumber(headerMatch[1]);
      if (num != null) {
        const districtId = String(num);
        if (districtId !== currentDistrictId) {
          flushDistrict();
          currentDistrictId = districtId;
        }
        continue;
      }
    }

    if (currentDistrictId == null) continue;

    // Skip the "Counties" continuation line that follows a wrapped header.
    if (nameTrim.toLowerCase() === 'counties' && !row.party.trim() && !row.county.trim() && !row.votes.trim()) {
      continue;
    }

    const partyTrim = row.party.trim();
    const labelTrim = row.label.trim();
    const votesTrim = row.votes.trim();

    if (nameTrim && partyTrim) {
      // A candidate's record can span a page break, in which case the
      // name/address/party row repeats verbatim on the next page - skip it.
      if (currentCandidate && currentCandidate.votes == null &&
          currentCandidate.name === nameTrim && currentCandidate.party === partyTrim) {
        continue;
      }
      // New candidate row: name + address + party on one line.
      if (currentCandidate) candidates.push(currentCandidate);
      currentCandidate = { name: nameTrim, party: partyTrim, votes: null };
      continue;
    }

    if (labelTrim === 'Total' && votesTrim) {
      const votes = parseInt(votesTrim.replace(/,/g, ''), 10);
      if (currentCandidate && currentCandidate.votes == null) {
        currentCandidate.votes = votes;
        candidates.push(currentCandidate);
        currentCandidate = null;
      }
      // Otherwise this is the district grand total - not needed for output.
      continue;
    }

    // County subtotal rows and name/address continuation lines - ignored.
  }
  flushDistrict();
  return districts;
}

function sortedByDistrictId(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))
  );
}

async function main() {
  const d = __dirname;

  console.log('Extracting Assembly results...');
  const assemblyRows = await extractRows(path.join(d, ASSEMBLY_PDF));
  const assembly = parseDistricts(assemblyRows, 2);

  console.log('Extracting Senate results...');
  const senateRows = await extractRows(path.join(d, SENATE_PDF));
  const senate = parseDistricts(senateRows, 1);

  const output = {
    assembly: sortedByDistrictId(assembly),
    senate: sortedByDistrictId(senate),
  };

  fs.writeFileSync(path.join(d, 'nj-elections-data.json'), JSON.stringify(output, null, 2));

  const assemblyIds = Object.keys(assembly);
  const senateIds = Object.keys(senate);

  console.log('\n--- Results ---');
  console.log(`Assembly districts found: ${assemblyIds.length} / ${ASSEMBLY_TOTAL_DISTRICTS}`);
  console.log(`Senate districts found:   ${senateIds.length} / ${SENATE_TOTAL_DISTRICTS}`);

  const missingAssembly = [];
  for (let i = 1; i <= ASSEMBLY_TOTAL_DISTRICTS; i++) {
    if (!assembly[String(i)]) missingAssembly.push(i);
  }
  const missingSenate = [];
  for (let i = 1; i <= SENATE_TOTAL_DISTRICTS; i++) {
    if (!senate[String(i)]) missingSenate.push(i);
  }

  console.log(`\nMissing Assembly districts: ${missingAssembly.length ? missingAssembly.join(', ') : 'none'}`);
  console.log(`Missing Senate districts:   ${missingSenate.length ? missingSenate.join(', ') : 'none'}`);

  console.log('\nWritten to nj-elections-data.json');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
