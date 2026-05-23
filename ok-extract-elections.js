'use strict';
 
const fs = require('fs');
const path = require('path');
 
// Official member roster from okhouse.gov (verified May 2026)
const HOUSE_ROSTER = {
  1:{name:'Eddy Dempsey',party:'REP'}, 2:{name:'Jim Olsen',party:'REP'}, 3:{name:'Rick West',party:'REP'},
  4:{name:'Bob Culver',party:'REP'}, 5:{name:'Josh West',party:'REP'}, 6:{name:'Rusty Cornwell',party:'REP'},
  7:{name:'Steve Bashore',party:'REP'}, 8:{name:'Tom Gann',party:'REP'}, 9:{name:'Mark Lepak',party:'REP'},
  10:{name:'Judd Strom',party:'REP'}, 11:{name:'John Kane',party:'REP'}, 12:{name:'Mark Chapman',party:'REP'},
  13:{name:'Neil Hays',party:'REP'}, 14:{name:'Chris Sneed',party:'REP'}, 15:{name:'Tim Turner',party:'REP'},
  16:{name:'Scott Fetgatter',party:'REP'}, 17:{name:'Jim Grego',party:'REP'}, 18:{name:'David Smith',party:'REP'},
  19:{name:'Justin Humphrey',party:'REP'}, 20:{name:'Jonathan Wilk',party:'REP'}, 21:{name:'Cody Maynard',party:'REP'},
  22:{name:'Ryan Eaves',party:'REP'}, 23:{name:'Derrick Hildebrant',party:'REP'}, 24:{name:'Chris Banning',party:'REP'},
  25:{name:'Ronny Johns',party:'REP'}, 26:{name:'Dell Kerbs',party:'REP'}, 27:{name:'Danny Sterling',party:'REP'},
  28:{name:'Danny Williams',party:'REP'}, 29:{name:'Kyle Hilbert',party:'REP'}, 30:{name:'Mark Lawson',party:'REP'},
  31:{name:'Collin Duel',party:'REP'}, 32:{name:'Jim Shaw',party:'REP'}, 33:{name:'Molly Jenkins',party:'REP'},
  34:{name:'Trish Ranson',party:'DEM'}, 35:{name:'Dillon Travis',party:'REP'}, 36:{name:'John George',party:'REP'},
  37:{name:'Ken Luttrell',party:'REP'}, 38:{name:'John Pfeiffer',party:'REP'}, 39:{name:'Erick Harris',party:'REP'},
  40:{name:'Chad Caldwell',party:'REP'}, 41:{name:'Denise Crosswhite Hader',party:'REP'}, 42:{name:'Cynthia Roe',party:'REP'},
  43:{name:'Jay Steagall',party:'REP'}, 44:{name:'Jared Deck',party:'DEM'}, 45:{name:'Annie Menz',party:'DEM'},
  46:{name:'Jacob Rosecrants',party:'DEM'}, 47:{name:'Brian Hill',party:'REP'}, 48:{name:'Tammy Townley',party:'REP'},
  49:{name:'Josh Cantrell',party:'REP'}, 50:{name:'Stacy Adams',party:'REP'}, 51:{name:'Brad Boles',party:'REP'},
  52:{name:'Gerrid Kendrix',party:'REP'}, 53:{name:'Jason Blair',party:'REP'}, 54:{name:'Kevin West',party:'REP'},
  55:{name:'Nick Archer',party:'REP'}, 56:{name:'Dick Lowe',party:'REP'}, 57:{name:'Anthony Moore',party:'REP'},
  58:{name:'Carl Newton',party:'REP'}, 59:{name:'Mike Dobrinski',party:'REP'}, 60:{name:'Mike Kelley',party:'REP'},
  61:{name:'Kenton Patzkowsky',party:'REP'}, 62:{name:'Daniel Pae',party:'REP'}, 63:{name:'Trey Caldwell',party:'REP'},
  64:{name:'Rande Worthen',party:'REP'}, 65:{name:'Toni Hasenbeck',party:'REP'}, 66:{name:'Clay Staires',party:'REP'},
  67:{name:'Rob Hall',party:'REP'}, 68:{name:'Mike Lay',party:'REP'}, 69:{name:'Mark Tedford',party:'REP'},
  70:{name:'Suzanne Schreiber',party:'DEM'}, 71:{name:'Amanda Clinton',party:'DEM'}, 72:{name:'Michelle McCane',party:'DEM'},
  73:{name:'Ronald Stewart',party:'DEM'}, 74:{name:'Kevin Norwood',party:'REP'}, 75:{name:'T.J. Marti',party:'REP'},
  76:{name:'Ross Ford',party:'REP'}, 77:{name:'John Waldron',party:'DEM'}, 78:{name:'Meloyde Blancett',party:'DEM'},
  79:{name:'Melissa Provenzano',party:'DEM'}, 80:{name:'Stan May',party:'REP'}, 81:{name:'Mike Osburn',party:'REP'},
  82:{name:'Nicole Miller',party:'REP'}, 83:{name:'Eric Roberts',party:'REP'}, 84:{name:'Tammy West',party:'REP'},
  85:{name:'Cyndi Munson',party:'DEM'}, 86:{name:'David Hardin',party:'REP'}, 87:{name:'Ellyn Hefner',party:'DEM'},
  88:{name:'Ellen Pogemiller',party:'DEM'}, 89:{name:'Arturo Alonso Sandoval',party:'DEM'}, 90:{name:'Emily Gise',party:'REP'},
  91:{name:'Chris Kannady',party:'REP'}, 92:{name:'VACANT',party:''}, 93:{name:'Mickey Dollens',party:'DEM'},
  94:{name:'Andy Fugate',party:'DEM'}, 95:{name:'Max Wolfley',party:'REP'}, 96:{name:'Preston Stinson',party:'REP'},
  97:{name:'Aletia Timmons',party:'DEM'}, 98:{name:'Gabe Woolley',party:'REP'}, 99:{name:'VACANT',party:''},
  100:{name:'Marilyn Stark',party:'REP'}, 101:{name:'Robert Manger',party:'REP'},
};
 
// Official member roster from oksenate.gov (verified May 2026)
const SENATE_ROSTER = {
  1:{name:'Micheal Bergstrom',party:'REP'}, 2:{name:'Ally Seifried',party:'REP'},
  3:{name:'Julie McIntosh',party:'REP'}, 4:{name:'Tom Woods',party:'REP'},
  5:{name:'George Burns',party:'REP'}, 6:{name:'David Bullard',party:'REP'},
  7:{name:'Warren Hamilton',party:'REP'}, 8:{name:'Bryan Logan',party:'REP'},
  9:{name:'Avery Frix',party:'REP'}, 10:{name:'Bill Coleman',party:'REP'},
  11:{name:'Regina Goodwin',party:'DEM'}, 12:{name:'Todd Gollihare',party:'REP'},
  13:{name:'Jonathan Wingard',party:'REP'}, 14:{name:'Jerry Alvord',party:'REP'},
  15:{name:'Lisa Standridge',party:'REP'}, 16:{name:'Mary B. Boren',party:'DEM'},
  17:{name:'Shane Jett',party:'REP'}, 18:{name:'Jack Stewart',party:'REP'},
  19:{name:'Roland Pederson',party:'REP'}, 20:{name:'Chuck Hall',party:'REP'},
  21:{name:'Randy Grellner',party:'REP'}, 22:{name:'Kristen Thompson',party:'REP'},
  23:{name:'Lonnie Paxton',party:'REP'}, 24:{name:'Darrell Weaver',party:'REP'},
  25:{name:'Brian Guthrie',party:'REP'}, 26:{name:'Darcy Jech',party:'REP'},
  27:{name:'Casey Murdock',party:'REP'}, 28:{name:'Grant Green',party:'REP'},
  29:{name:'Julie Daniels',party:'REP'}, 30:{name:'Julia Kirt',party:'DEM'},
  31:{name:'Spencer Kern',party:'REP'}, 32:{name:'Dusty Deevers',party:'REP'},
  33:{name:'Christi Gillespie',party:'REP'}, 34:{name:'Dana Prieto',party:'REP'},
  35:{name:'Jo Anna Dossett',party:'DEM'}, 36:{name:'John Haste',party:'REP'},
  37:{name:'Aaron Reinhardt',party:'REP'}, 38:{name:'Brent Howard',party:'REP'},
  39:{name:'Dave Rader',party:'REP'}, 40:{name:'Carri Hicks',party:'DEM'},
  41:{name:'Adam Pugh',party:'REP'}, 42:{name:'Brenda Stanley',party:'REP'},
  43:{name:'Kendal Sacchieri',party:'REP'}, 44:{name:'Michael Brooks',party:'DEM'},
  45:{name:'Paul Rosino',party:'REP'}, 46:{name:'Mark Mann',party:'DEM'},
  47:{name:'Kelly Hines',party:'REP'}, 48:{name:'Nikki Nice',party:'DEM'},
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
    headers.forEach((h, i) => row[h] = (cols[i] || '').replace(/"/g, ''));
    rows.push(row);
  }
  return rows;
}
 
function extractDistricts(rows, chamberKeyword) {
  const districts = {};
  const relevant = rows.filter(r =>
    r.race_description && r.race_description.toUpperCase().includes(chamberKeyword)
  );
  for (const row of relevant) {
    const desc = row.race_description.toUpperCase();
    const match = desc.match(/DISTRICT\s+(\d+)/);
    if (!match) continue;
    const distNum = String(parseInt(match[1]));
    const votes = parseInt(row.cand_tot_votes, 10) || 0;
    const name = row.cand_name.trim();
    const party = row.cand_party.trim();
    if (!districts[distNum]) districts[distNum] = [];
    districts[distNum].push({ name, party, votes });
  }
  const results = {};
  for (const [distNum, candidates] of Object.entries(districts)) {
    candidates.sort((a, b) => b.votes - a.votes);
    const winner = candidates[0];
    const nonWriOpponents = candidates.slice(1).filter(c => c.party !== 'WRI');
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    const pct = totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 10000) / 100 : 100;
    results[distNum] = { winner: winner.name, party: winner.party, pct, unopposed: nonWriOpponents.length === 0, votes: winner.votes };
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
  const gen2024 = parseCSV(path.join(d, 'OK_2024_General_Election_Results.csv'));
  const pri2024 = parseCSV(path.join(d, 'OK_2024_Primary_Election_Results.csv'));
  const run2024 = parseCSV(path.join(d, 'OK_2024_Primary_Runoff_Election_Results.csv'));
  const gen2022 = parseCSV(path.join(d, 'OK_2022_General_Election_Results.csv'));
  const pri2022 = parseCSV(path.join(d, 'OK_2022_Primary_Election_Results.csv'));
  const run2022 = parseCSV(path.join(d, 'OK_2022_Primary_Runoff_Election_Results.csv'));
 
  // HOUSE: priority = 2024 general → 2024 runoff → 2024 primary → official roster
  const hGen = extractDistricts(gen2024, 'STATE REPRESENTATIVE');
  const hRun = extractDistricts(run2024, 'STATE REPRESENTATIVE');
  const hPri = extractDistricts(pri2024, 'STATE REPRESENTATIVE');
 
  const houseRaw = {};
  for (let d = 1; d <= 101; d++) {
    const key = String(d);
    if (hGen[key]?.votes > 0)      houseRaw[key] = { ...hGen[key], source: '2024-general' };
    else if (hRun[key]?.votes > 0) houseRaw[key] = { ...hRun[key], source: '2024-runoff' };
    else if (hPri[key]?.votes > 0) houseRaw[key] = { ...hPri[key], source: '2024-primary' };
    else {
      const r = HOUSE_ROSTER[d];
      houseRaw[key] = { winner: r.name, party: r.party, pct: 100, unopposed: true, votes: 0, source: 'roster-uncontested' };
    }
  }
 
  // SENATE: 2024 cycle = odd + SD-46, SD-48; 2022 cycle = remaining even
  const sGen24 = extractDistricts(gen2024, 'STATE SENATOR');
  const sRun24 = extractDistricts(run2024, 'STATE SENATOR');
  const sPri24 = extractDistricts(pri2024, 'STATE SENATOR');
  const sGen22 = extractDistricts(gen2022, 'STATE SENATOR');
  const sRun22 = extractDistricts(run2022, 'STATE SENATOR');
  const sPri22 = extractDistricts(pri2022, 'STATE SENATOR');
 
  const senateRaw = {};
  for (let d = 1; d <= 48; d++) {
    const key = String(d);
    const in2024 = (d % 2 === 1) || d === 46 || d === 48;
    const [g, ru, p] = in2024 ? [sGen24, sRun24, sPri24] : [sGen22, sRun22, sPri22];
    const yr = in2024 ? '2024' : '2022';
    if (g[key]?.votes > 0)       senateRaw[key] = { ...g[key],  source: `${yr}-general` };
    else if (ru[key]?.votes > 0) senateRaw[key] = { ...ru[key], source: `${yr}-runoff` };
    else if (p[key]?.votes > 0)  senateRaw[key] = { ...p[key],  source: `${yr}-primary` };
    else {
      const r = SENATE_ROSTER[d];
      senateRaw[key] = { winner: r.name, party: r.party, pct: 100, unopposed: true, votes: 0, source: 'roster-uncontested' };
    }
  }
 
  const output = { house: sortedByNumber(clean(houseRaw)), senate: sortedByNumber(clean(senateRaw)) };
  fs.writeFileSync(path.join(__dirname, 'ok-elections-data.json'), JSON.stringify(output, null, 2));
 
  console.log(`House districts:  ${Object.keys(output.house).length}`);
  console.log(`Senate districts: ${Object.keys(output.senate).length}`);
 
  const hRoster = Object.entries(houseRaw).filter(([,v]) => v.source === 'roster-uncontested').map(([k]) => 'HD-'+k);
  const sRoster = Object.entries(senateRaw).filter(([,v]) => v.source === 'roster-uncontested').map(([k]) => 'SD-'+k);
  if (hRoster.length) console.log('House from roster:', hRoster.join(', '));
  if (sRoster.length) console.log('Senate from roster:', sRoster.join(', '));
  console.log('Written to ok-elections-data.json');
}
 
main();