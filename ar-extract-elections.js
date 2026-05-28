'use strict';

const fs = require('fs');
const path = require('path');

// Official member roster from arkansashouse.org (95th General Assembly, 2025 session)
const HOUSE_ROSTER = {
  1:{name:'Jeremy Wooldridge',party:'REP'}, 2:{name:'Trey Steimel',party:'REP'},
  3:{name:'Stetson Painter',party:'REP'}, 4:{name:'Jason Nazarenko',party:'REP'},
  5:{name:'Ron McNair',party:'REP'}, 6:{name:'Harlan Breaux',party:'REP'},
  7:{name:'Brit McKenzie',party:'REP'}, 8:{name:'Austin McCollum',party:'REP'},
  9:{name:'Diana Gonzales Worthen',party:'DEM'}, 10:{name:'Mindy McAlindon',party:'REP'},
  11:{name:'Rebecca Burkes',party:'REP'}, 12:{name:'Hope Hendren Duke',party:'REP'},
  13:{name:'R. Scott Richardson',party:'REP'}, 14:{name:'Nick Burkes',party:'REP'},
  15:{name:'John P. Carr',party:'REP'}, 16:{name:'Kendon Underwood',party:'REP'},
  17:{name:'Randy Torres',party:'REP'}, 18:{name:'Robin Lundstrum',party:'REP'},
  19:{name:'Steve Unger',party:'REP'}, 20:{name:'Denise Garner',party:'DEM'},
  21:{name:'Nicole Clowney',party:'DEM'}, 22:{name:'David Whitaker',party:'DEM'},
  23:{name:'Kendra Moore',party:'REP'}, 24:{name:'Brad Hall',party:'REP'},
  25:{name:'Chad Puryear',party:'REP'}, 26:{name:'James P. Eaton',party:'REP'},
  27:{name:'Steven Walker',party:'REP'}, 28:{name:'Bart Schulz',party:'REP'},
  29:{name:'Rick McClure',party:'REP'}, 30:{name:'Frances Cavenaugh',party:'REP'},
  31:{name:'Jimmy Gazaway',party:'REP'}, 32:{name:'Jack Ladyman',party:'REP'},
  33:{name:'Jon Milligan',party:'REP'}, 34:{name:'Joey L. Carr',party:'REP'},
  35:{name:'Jessie McGruder',party:'DEM'}, 36:{name:'Johnny Rye',party:'REP'},
  37:{name:'Steve Hollowell',party:'REP'}, 38:{name:'Dwight Tosh',party:'REP'},
  39:{name:'Wayne Long',party:'REP'}, 40:{name:'Shad Pearce',party:'REP'},
  41:{name:'Alyssa R. Brown',party:'REP'}, 42:{name:'Stephen Meeks',party:'REP'},
  43:{name:'Rick Beck',party:'REP'}, 44:{name:'Stan Berry',party:'REP'},
  45:{name:'Aaron Pilkington',party:'REP'}, 46:{name:'Jon S. Eubanks',party:'REP'},
  47:{name:'Lee Johnson',party:'REP'}, 48:{name:'Ryan A. Rose',party:'REP'},
  49:{name:'Jay Richardson',party:'DEM'}, 50:{name:'Zack Gramlich',party:'REP'},
  51:{name:'Cindy Crawford',party:'REP'}, 52:{name:'Marcus E. Richmond',party:'REP'},
  53:{name:'Matt Duffield',party:'REP'}, 54:{name:'Mary Bentley',party:'REP'},
  55:{name:'Matthew Brown',party:'REP'}, 56:{name:'Stephen Magie',party:'DEM'},
  57:{name:'Cameron Cooper',party:'REP'}, 58:{name:'Les D. Eaves',party:'REP'},
  59:{name:'Jim Wooten',party:'REP'}, 60:{name:'Roger D. Lynch',party:'REP'},
  61:{name:'Jeremiah Moore',party:'REP'}, 62:{name:'Mark D. McElroy',party:'REP'},
  63:{name:'Lincoln E. Barnett',party:'DEM'}, 64:{name:'Kenneth B. Ferguson',party:'DEM'},
  65:{name:'Glenn Barnes',party:'DEM'}, 66:{name:'Mark Perry',party:'DEM'},
  67:{name:'Karilyn Brown',party:'REP'}, 68:{name:'Brian S. Evans',party:'REP'},
  69:{name:'David Ray',party:'REP'}, 70:{name:'Alex B. Holladay',party:'DEM'},
  71:{name:'Brandon C. Achor',party:'REP'}, 72:{name:'Tracy Steele',party:'DEM'},
  73:{name:'Andrew Collins',party:'DEM'}, 74:{name:'Tippi McCullough',party:'DEM'},
  75:{name:'Ashley Hudson',party:'DEM'}, 76:{name:'Joy C. Springer',party:'DEM'},
  77:{name:'Fred Allen',party:'DEM'}, 78:{name:'Keith Brooks',party:'REP'},
  79:{name:'Tara Shephard',party:'DEM'}, 80:{name:'Denise Jones Ennett',party:'DEM'},
  81:{name:'RJ Hawk',party:'REP'}, 82:{name:'Tony Furman',party:'REP'},
  83:{name:'Paul Childress',party:'REP'}, 84:{name:'Les Warren',party:'REP'},
  85:{name:'Richard McGrew',party:'REP'}, 86:{name:'John Maddox',party:'REP'},
  87:{name:'DeAnn Vaught',party:'REP'}, 88:{name:'Dolly Henley',party:'REP'},
  89:{name:'Justin Gonzales',party:'REP'}, 90:{name:'Richard Womack',party:'REP'},
  91:{name:'Bruce Cozart',party:'REP'}, 92:{name:'Julie Mayberry',party:'REP'},
  93:{name:'Mike Holcomb',party:'REP'}, 94:{name:'Jeffrey Wardlaw',party:'REP'},
  95:{name:'Howard M. Beaty, Jr.',party:'REP'}, 96:{name:'Sonia Eubanks Barker',party:'REP'},
  97:{name:'Matthew J. Shepherd',party:'REP'}, 98:{name:'Wade Andrews',party:'REP'},
  99:{name:'Lane Jean',party:'REP'}, 100:{name:'Carol Dalby',party:'REP'},
};

// Official member roster from senate.arkansas.gov (95th General Assembly, 2025 session)
const SENATE_ROSTER = {
  1:{name:'Ben Gilmore',party:'REP'}, 2:{name:'Matt Stone',party:'REP'},
  3:{name:'Steve Crowell',party:'REP'}, 4:{name:'Jimmy Hickey, Jr.',party:'REP'},
  5:{name:'Terry Rice',party:'REP'}, 6:{name:'Matt McKee',party:'REP'},
  7:{name:'Alan Clark',party:'REP'}, 8:{name:'Stephanie Flowers',party:'DEM'},
  9:{name:'Reginald Murdock',party:'DEM'}, 10:{name:'Ronald Caldwell',party:'REP'},
  11:{name:'Ricky Hill',party:'REP'}, 12:{name:'Jamie Scott',party:'DEM'},
  13:{name:'Jane English',party:'REP'}, 14:{name:'Clarke Tucker',party:'DEM'},
  15:{name:'Fredrick J. Love',party:'DEM'}, 16:{name:'Kim Hammer',party:'REP'},
  17:{name:'Mark Johnson',party:'REP'}, 18:{name:'Jonathan Dismang',party:'REP'},
  19:{name:'Dave Wallace',party:'REP'}, 20:{name:'Dan Sullivan',party:'REP'},
  21:{name:'Blake Johnson',party:'REP'}, 22:{name:'John Payton',party:'REP'},
  23:{name:'Scott Flippo',party:'REP'}, 24:{name:'Missy Irvin',party:'REP'},
  25:{name:'Breanne Davis',party:'REP'}, 26:{name:'Brad Simon',party:'REP'},
  27:{name:'Justin Boyd',party:'REP'}, 28:{name:'Bryan King',party:'REP'},
  29:{name:'Jim Petty',party:'REP'}, 30:{name:'Greg Leding',party:'DEM'},
  31:{name:'Clint Penzo',party:'REP'}, 32:{name:'Joshua Bryant',party:'REP'},
  33:{name:'Bart Hester',party:'REP'}, 34:{name:'Jim Dotson',party:'REP'},
  35:{name:'Tyler Dees',party:'REP'},
};

function parseCSV(filepath) {
  const lines = fs.readFileSync(filepath, 'utf8').split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = [];
    let inQuote = false, cur = '';
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { cols.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur.trim());
    const row = {};
    headers.forEach((h, idx) => row[h] = (cols[idx] || '').replace(/"/g, ''));
    rows.push(row);
  }
  return rows;
}

function cleanName(name) {
  return name
    .replace(/^State\s+Representative\s+/i, '')
    .replace(/^State\s+Senator\s+/i, '')
    .replace(/^Senator\s+/i, '')
    .replace(/^(?:REP|DEM)\s+/i, '')
    .trim();
}

// AR CSVs are county-level rows: aggregate Candidate Votes across counties per district.
function extractDistricts(rows, chamberKeyword) {
  const distMap = {};
  for (const row of rows) {
    const contestName = row['Contest Name'] || '';
    if (!contestName.toUpperCase().includes(chamberKeyword)) continue;
    const match = contestName.match(/District\s+(\d+)/i);
    if (!match) continue;
    const distNum = String(parseInt(match[1]));
    const candId = row['Candidate ID'];
    const candName = cleanName(row['Candidate Name'] || '');
    const candVotes = parseInt(row['Candidate Votes'], 10) || 0;
    if (!distMap[distNum]) distMap[distNum] = {};
    if (!distMap[distNum][candId]) distMap[distNum][candId] = { name: candName, votes: 0 };
    distMap[distNum][candId].votes += candVotes;
  }
  const results = {};
  for (const [distNum, candMap] of Object.entries(distMap)) {
    const candidates = Object.values(candMap);
    candidates.sort((a, b) => b.votes - a.votes);
    const winner = candidates[0];
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    const pct = totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 10000) / 100 : 100;
    const unopposed = candidates.length === 1;
    results[distNum] = { winner: winner.name, votes: winner.votes, pct, unopposed };
  }
  return results;
}

function sortedByNumber(obj) {
  return Object.fromEntries(Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0])));
}

function clean(raw) {
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    out[k] = { winner: v.winner, party: v.party, pct: v.pct, unopposed: v.unopposed };
  }
  return out;
}

function main() {
  console.log('Parsing CSVs...');
  const d = __dirname;
  const house22 = parseCSV(path.join(d, 'ar-2022_General_State Representative.csv'));
  const senate22 = parseCSV(path.join(d, 'ar-2022_General_State Senate.csv'));
  const house24 = parseCSV(path.join(d, 'ar-2024_General_State Representative.csv'));
  const senate24 = parseCSV(path.join(d, 'ar-2024_General_State Senate.csv'));

  // HOUSE: prefer 2024 general; fall back to 2022; last resort: roster
  const hGen24 = extractDistricts(house24, 'STATE REPRESENTATIVE');
  const hGen22 = extractDistricts(house22, 'STATE REPRESENTATIVE');

  const houseRaw = {};
  for (let i = 1; i <= 100; i++) {
    const key = String(i);
    const roster = HOUSE_ROSTER[i];
    if (hGen24[key]?.votes > 0) {
      houseRaw[key] = { ...hGen24[key], party: roster.party, source: '2024-general' };
    } else if (hGen22[key]?.votes > 0) {
      houseRaw[key] = { ...hGen22[key], party: roster.party, source: '2022-general' };
    } else {
      houseRaw[key] = { winner: roster.name, party: roster.party, pct: 100, unopposed: true, votes: 0, source: 'roster-uncontested' };
    }
  }

  // SENATE: prefer 2024 general (18 districts); fall back to 2022 general; last resort: roster
  const sGen24 = extractDistricts(senate24, 'STATE SENATE');
  const sGen22 = extractDistricts(senate22, 'STATE SENATE');

  const senateRaw = {};
  for (let i = 1; i <= 35; i++) {
    const key = String(i);
    const roster = SENATE_ROSTER[i];
    if (sGen24[key]?.votes > 0) {
      senateRaw[key] = { ...sGen24[key], party: roster.party, source: '2024-general' };
    } else if (sGen22[key]?.votes > 0) {
      senateRaw[key] = { ...sGen22[key], party: roster.party, source: '2022-general' };
    } else {
      senateRaw[key] = { winner: roster.name, party: roster.party, pct: 100, unopposed: true, votes: 0, source: 'roster-uncontested' };
    }
  }

  const output = {
    house: sortedByNumber(clean(houseRaw)),
    senate: sortedByNumber(clean(senateRaw)),
  };
  fs.writeFileSync(path.join(__dirname, 'ar-elections-data.json'), JSON.stringify(output, null, 2));

  console.log(`House districts:  ${Object.keys(output.house).length}`);
  console.log(`Senate districts: ${Object.keys(output.senate).length}`);

  const hRoster = Object.entries(houseRaw).filter(([, v]) => v.source === 'roster-uncontested').map(([k]) => 'HD-' + k);
  const sRoster = Object.entries(senateRaw).filter(([, v]) => v.source === 'roster-uncontested').map(([k]) => 'SD-' + k);
  if (hRoster.length) console.log('House from roster:', hRoster.join(', '));
  if (sRoster.length) console.log('Senate from roster:', sRoster.join(', '));

  const s22 = Object.entries(senateRaw).filter(([, v]) => v.source === '2022-general').map(([k]) => 'SD-' + k);
  if (s22.length) console.log('Senate from 2022:', s22.join(', '));

  console.log('Written to ar-elections-data.json');
}

main();
