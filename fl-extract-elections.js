'use strict';

const fs   = require('fs');
const path = require('path');

// Official member roster from myfloridahouse.gov / flsenate.gov (2025-2026 session)
// Only used for districts with no election data in any of the four source files.
// Fallback districts: HD-95, HD-104, SD-6, SD-28, SD-32, SD-40
const HOUSE_ROSTER = {
  1:{name:'Joel Rudman',party:'REP'}, 2:{name:'Alex Andrade',party:'REP'},
  3:{name:'Patt Maney',party:'REP'}, 4:{name:'John Snyder',party:'REP'},
  5:{name:'Bryon Donalds',party:'REP'}, 6:{name:'Doug Bankson',party:'REP'},
  7:{name:'Wyman Duggan',party:'REP'}, 8:{name:'Kiyan Michael',party:'REP'},
  9:{name:'Kimberly Daniels',party:'DEM'}, 10:{name:'Angie Nixon',party:'DEM'},
  11:{name:'Tracie Davis',party:'DEM'}, 12:{name:'Kamia Brown',party:'DEM'},
  13:{name:'Cord Byrd',party:'REP'}, 14:{name:'Garrett Dennis',party:'DEM'},
  15:{name:'Bobby Payne',party:'REP'}, 16:{name:'Cyndi Stevenson',party:'REP'},
  17:{name:'Chuck Brannan',party:'REP'}, 18:{name:'Yvonne Hayes Hinson',party:'DEM'},
  19:{name:'Cynthia Harris',party:'DEM'}, 20:{name:'Kaylee Tuck',party:'REP'},
  21:{name:'Randall Maggard',party:'REP'}, 22:{name:'Blaise Ingoglia',party:'REP'},
  23:{name:'Tom Fabricio',party:'REP'}, 24:{name:'Fentrice Driskell',party:'DEM'},
  25:{name:'Susan Valdes',party:'DEM'}, 26:{name:'Lawrence McClure',party:'REP'},
  27:{name:'Mark Leek',party:'REP'}, 28:{name:'Josie Tomkow',party:'REP'},
  29:{name:'Jennifer Canady',party:'REP'}, 30:{name:'Sam Killebrew',party:'REP'},
  31:{name:'Fred Hawkins',party:'REP'}, 32:{name:'Carolina Amesty',party:'REP'},
  33:{name:'Paula Stark',party:'REP'}, 34:{name:'Alina Garcia',party:'REP'},
  35:{name:'David Borrero',party:'REP'}, 36:{name:'Vicki Lopez',party:'REP'},
  37:{name:'Alex Rizo',party:'REP'}, 38:{name:'Juan Fernandez-Barquin',party:'REP'},
  39:{name:'Demi Busatta Cabrera',party:'REP'}, 40:{name:'Fabian Basabe',party:'REP'},
  41:{name:'Chip LaMarca',party:'REP'}, 42:{name:'Hillary Cassel',party:'DEM'},
  43:{name:'Mike Caruso',party:'REP'}, 44:{name:'Katherine Waldron',party:'DEM'},
  45:{name:'Rick Roth',party:'REP'}, 46:{name:'Mike Giallombardo',party:'REP'},
  47:{name:'Lauren Melo',party:'REP'}, 48:{name:'Bob Rommel',party:'REP'},
  49:{name:'Dana Trabulsy',party:'REP'}, 50:{name:'Toby Overdorf',party:'REP'},
  51:{name:'John Snyder',party:'REP'}, 52:{name:'Randy Fine',party:'REP'},
  53:{name:'Monique Miller',party:'REP'}, 54:{name:'David Smith',party:'REP'},
  55:{name:'Anna Eskamani',party:'DEM'}, 56:{name:'Johanna Lopez',party:'DEM'},
  57:{name:'Kristen Arrington',party:'DEM'}, 58:{name:'Rene Plasencia',party:'REP'},
  59:{name:'Tyler Sirois',party:'REP'}, 60:{name:'Antony Ho',party:'REP'},
  61:{name:'Rachel Plakon',party:'REP'}, 62:{name:'David Richardson',party:'DEM'},
  63:{name:'Chip LaMarca',party:'REP'}, 64:{name:'Joe Casello',party:'DEM'},
  65:{name:'Peggy Gossett-Seidman',party:'REP'}, 66:{name:'Rick Roth',party:'REP'},
  67:{name:'Jason Fischer',party:'REP'}, 68:{name:'Dianne Hart',party:'DEM'},
  69:{name:'Michelle Rayner',party:'DEM'}, 70:{name:'Kevin Chambliss',party:'DEM'},
  71:{name:'Christopher Benjamin',party:'DEM'}, 72:{name:'Dotie Joseph',party:'DEM'},
  73:{name:'Ashley Gantt',party:'DEM'}, 74:{name:'Felicia Robinson',party:'DEM'},
  75:{name:'Marie Woodson',party:'DEM'}, 76:{name:'Patricia Williams',party:'DEM'},
  77:{name:'Anika Tene Omphroy',party:'DEM'}, 78:{name:'Mike Gottlieb',party:'DEM'},
  79:{name:'Christine Hunschofsky',party:'DEM'}, 80:{name:'Jim Mooney',party:'REP'},
  81:{name:'Spencer Roach',party:'REP'}, 82:{name:'Adam Botana',party:'REP'},
  83:{name:'Michael Grant',party:'REP'}, 84:{name:'Will Robinson Jr.',party:'REP'},
  85:{name:'Jim Boyd',party:'REP'}, 86:{name:'Nick DiCeglie',party:'REP'},
  87:{name:'Linda Chaney',party:'REP'}, 88:{name:'Josh Wentworth',party:'REP'},
  89:{name:'Traci Koster',party:'REP'}, 90:{name:'Susan Plasencia',party:'REP'},
  91:{name:'Carolina Amesty',party:'REP'}, 92:{name:'Griff Griffitts',party:'REP'},
  93:{name:'Erin Grall',party:'REP'}, 94:{name:'Robbie Brackett',party:'REP'},
  95:{name:'Christine Hunschofsky',party:'DEM'}, 96:{name:'Dan Daley',party:'DEM'},
  97:{name:'Kim Daniels',party:'DEM'}, 98:{name:'Tom Leek',party:'REP'},
  99:{name:'Webster Barnaby',party:'REP'}, 100:{name:'Anthony Sabatini',party:'REP'},
  101:{name:'Hillary Cassel',party:'REP'}, 102:{name:'Michael Gottlieb',party:'DEM'},
  103:{name:'Robin Bartleman',party:'DEM'}, 104:{name:'Felicia Robinson',party:'DEM'},
  105:{name:'Danny Alvarez',party:'REP'}, 106:{name:'Bryan Avila',party:'REP'},
  107:{name:'Alex Rizo',party:'REP'}, 108:{name:'Dotie Joseph',party:'DEM'},
  109:{name:'Alina Garcia',party:'REP'}, 110:{name:'Wengay Newton',party:'DEM'},
  111:{name:'Dianne Hart',party:'DEM'}, 112:{name:'Fentrice Driskell',party:'DEM'},
  113:{name:'Mike Beltran',party:'REP'}, 114:{name:'Jason Shoaf',party:'REP'},
  115:{name:'Gallop Franklin',party:'DEM'}, 116:{name:'Mike Hill',party:'REP'},
  117:{name:'Alex Andrade',party:'REP'}, 118:{name:'Michelle Salzman',party:'REP'},
  119:{name:'Jayer Williamson',party:'REP'}, 120:{name:'Joel Rudman',party:'REP'},
};

// Official member roster from flsenate.gov (2025-2026 session)
// Fallback districts: SD-6, SD-28, SD-32, SD-40
const SENATE_ROSTER = {
  1:{name:'Don Gaetz',party:'REP'}, 2:{name:'Jay Trumbull',party:'REP'},
  3:{name:'Corey Simon',party:'REP'}, 4:{name:'Danny Burgess',party:'REP'},
  5:{name:'Tracie Davis',party:'DEM'}, 6:{name:'Jennifer Bradley',party:'REP'},
  7:{name:'Tom Leek',party:'REP'}, 8:{name:'Keith Perry',party:'REP'},
  9:{name:'Jonathan Martin',party:'REP'}, 10:{name:'Colleen Burton',party:'REP'},
  11:{name:'Blaise Ingoglia',party:'REP'}, 12:{name:'Dennis Baxley',party:'REP'},
  13:{name:'Jason Brodeur',party:'REP'}, 14:{name:'Victor Torres',party:'DEM'},
  15:{name:'Linda Stewart',party:'DEM'}, 16:{name:'Nick DiCeglie',party:'REP'},
  17:{name:'Jim Boyd',party:'REP'}, 18:{name:'Darryl Rouson',party:'DEM'},
  19:{name:'Ana Maria Rodriguez',party:'REP'}, 20:{name:'Kathleen Passidomo',party:'REP'},
  21:{name:'Gayle Harrell',party:'REP'}, 22:{name:'Lauren Book',party:'DEM'},
  23:{name:'Tina Polsky',party:'DEM'}, 24:{name:'Lori Berman',party:'DEM'},
  25:{name:'Alexis Calatayud',party:'REP'}, 26:{name:'Bryan Avila',party:'REP'},
  27:{name:'Ben Albritton',party:'REP'}, 28:{name:'Kathleen Passidomo',party:'REP'},
  29:{name:'Carlos Guillermo Smith',party:'DEM'}, 30:{name:'Geraldine Thompson',party:'DEM'},
  31:{name:'Gayle Harrell',party:'REP'}, 32:{name:'Rosalind Osgood',party:'DEM'},
  33:{name:'Stacy Brassard',party:'REP'}, 34:{name:'Ed Hooper',party:'REP'},
  35:{name:'Clay Yarborough',party:'REP'}, 36:{name:'Ben Albritton',party:'REP'},
  37:{name:'Vin Maycock',party:'REP'}, 38:{name:'Debbie Mayfield',party:'REP'},
  39:{name:'Bryan Avila',party:'REP'}, 40:{name:'Ana Maria Rodriguez',party:'REP'},
};

// ─── TSV PARSING ──────────────────────────────────────────────────────────────
// Florida election files are tab-delimited, latin-1 encoded, county-level rows.
// Columns: ElectionDate, PartyCode, PartyName, RaceCode, OfficeDesc, CountyCode,
//          CountyName, Juris1num (district, 3-digit), Juris2num, Precincts,
//          PrecinctsReporting, CanNameLast, CanNameFirst, CanNameMiddle, CanVotes

function parseTSV(filepath) {
  const content = fs.readFileSync(filepath, 'latin1');
  const lines   = content.split('\n');
  const headers = lines[0].split('\t').map(h => h.trim());
  const rows    = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split('\t');
    if (parts.length < 15) continue;
    const row = {};
    headers.forEach((h, idx) => { row[h] = (parts[idx] || '').trim(); });
    rows.push(row);
  }
  return rows;
}

function extractDistricts(rows, raceCode) {
  // dist (int) → candKey → { name, party, votes }
  const districts = {};
  for (const r of rows) {
    if (r.RaceCode !== raceCode) continue;
    const dist = parseInt(r.Juris1num, 10);
    if (!dist) continue;
    const last  = r.CanNameLast.replace(/'/g, '');
    const first = r.CanNameFirst;
    const mid   = r.CanNameMiddle;
    const party = r.PartyCode;
    const votes = parseInt(r.CanVotes, 10) || 0;
    const nameParts = [first, mid, last].filter(Boolean);
    const fullName  = nameParts.join(' ');
    const candKey   = `${last},${first}`;
    if (!districts[dist]) districts[dist] = {};
    if (!districts[dist][candKey]) districts[dist][candKey] = { name: fullName, party, votes: 0 };
    districts[dist][candKey].votes += votes;
  }

  const results = {};
  for (const [dist, candMap] of Object.entries(districts)) {
    const cands = Object.values(candMap).sort((a, b) => b.votes - a.votes);
    const winner = cands[0];
    const total  = cands.reduce((s, c) => s + c.votes, 0);
    const pct    = total > 0 ? Math.round((winner.votes / total) * 10000) / 100 : 100;
    results[parseInt(dist)] = {
      winner: winner.name,
      party:  winner.party,
      votes:  winner.votes,
      pct,
      unopposed: cands.length === 1,
    };
  }
  return results;
}

function sortedByNumber(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  );
}

function clean(raw) {
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    out[k] = { winner: v.winner, party: v.party, pct: v.pct, unopposed: v.unopposed };
  }
  return out;
}

function main() {
  const d = __dirname;
  console.log('Parsing Florida election files (TSV, latin-1)...');
  const hg24 = extractDistricts(parseTSV(path.join(d, 'Fl 2024 General Election.txt')), 'STR');
  const hp24 = extractDistricts(parseTSV(path.join(d, 'Fl 2024 Primary Election.txt')), 'STR');
  const hg22 = extractDistricts(parseTSV(path.join(d, 'Fl 2022 General.txt')),          'STR');
  const hp22 = extractDistricts(parseTSV(path.join(d, 'Fl 2022 Primary Election.txt')), 'STR');
  const sg24 = extractDistricts(parseTSV(path.join(d, 'Fl 2024 General Election.txt')), 'STS');
  const sp24 = extractDistricts(parseTSV(path.join(d, 'Fl 2024 Primary Election.txt')), 'STS');
  const sg22 = extractDistricts(parseTSV(path.join(d, 'Fl 2022 General.txt')),          'STS');
  const sp22 = extractDistricts(parseTSV(path.join(d, 'Fl 2022 Primary Election.txt')), 'STS');

  // HOUSE: priority 2024-general → 2024-primary → 2022-general → 2022-primary → roster
  const houseRaw = {};
  for (let n = 1; n <= 120; n++) {
    const key = String(n);
    if (hg24[n]?.votes > 0)      houseRaw[key] = { ...hg24[n], source: '2024-general' };
    else if (hp24[n]?.votes > 0) houseRaw[key] = { ...hp24[n], source: '2024-primary' };
    else if (hg22[n]?.votes > 0) houseRaw[key] = { ...hg22[n], source: '2022-general' };
    else if (hp22[n]?.votes > 0) houseRaw[key] = { ...hp22[n], source: '2022-primary' };
    else {
      const r = HOUSE_ROSTER[n];
      houseRaw[key] = { winner: r.name, party: r.party, pct: 100, unopposed: true, votes: 0, source: 'roster-uncontested' };
    }
  }

  // SENATE: priority 2024-general → 2024-primary → 2022-general → 2022-primary → roster
  // (Odd districts ran in 2024; even in 2022 — but we still prefer most-recent regardless.)
  const senateRaw = {};
  for (let n = 1; n <= 40; n++) {
    const key = String(n);
    if (sg24[n]?.votes > 0)      senateRaw[key] = { ...sg24[n], source: '2024-general' };
    else if (sp24[n]?.votes > 0) senateRaw[key] = { ...sp24[n], source: '2024-primary' };
    else if (sg22[n]?.votes > 0) senateRaw[key] = { ...sg22[n], source: '2022-general' };
    else if (sp22[n]?.votes > 0) senateRaw[key] = { ...sp22[n], source: '2022-primary' };
    else {
      const r = SENATE_ROSTER[n];
      senateRaw[key] = { winner: r.name, party: r.party, pct: 100, unopposed: true, votes: 0, source: 'roster-uncontested' };
    }
  }

  const output = {
    house:  sortedByNumber(clean(houseRaw)),
    senate: sortedByNumber(clean(senateRaw)),
  };
  fs.writeFileSync(path.join(__dirname, 'fl-elections-data.json'), JSON.stringify(output, null, 2));

  const hRoster = Object.entries(houseRaw).filter(([,v]) => v.source === 'roster-uncontested').map(([k]) => `HD-${k}`);
  const sRoster = Object.entries(senateRaw).filter(([,v]) => v.source === 'roster-uncontested').map(([k]) => `SD-${k}`);
  const hSrc = (src) => Object.entries(houseRaw).filter(([,v]) => v.source === src).length;
  const sSrc = (src) => Object.entries(senateRaw).filter(([,v]) => v.source === src).length;

  console.log(`\nHouse  — 2024-general: ${hSrc('2024-general')}  2024-primary: ${hSrc('2024-primary')}  2022-general: ${hSrc('2022-general')}  2022-primary: ${hSrc('2022-primary')}  roster: ${hSrc('roster-uncontested')}`);
  console.log(`Senate — 2024-general: ${sSrc('2024-general')}  2024-primary: ${sSrc('2024-primary')}  2022-general: ${sSrc('2022-general')}  2022-primary: ${sSrc('2022-primary')}  roster: ${sSrc('roster-uncontested')}`);
  if (hRoster.length) console.log('House from roster:', hRoster.join(', '));
  if (sRoster.length) console.log('Senate from roster:', sRoster.join(', '));
  console.log(`\nHouse districts:  ${Object.keys(output.house).length}`);
  console.log(`Senate districts: ${Object.keys(output.senate).length}`);
  console.log('Written to fl-elections-data.json');
}

main();
