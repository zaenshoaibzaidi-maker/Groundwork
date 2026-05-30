#!/usr/bin/env node
// nc-set-cities.js
// Fills city and region in nc-districts.js for all 170 NC districts.
// Based on 2022 NC House/Senate maps (post-2021 redistricting).
// Touches only the city and region fields — nothing else.

'use strict';

const fs   = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'nc-districts.js');

// ── Geographic lookup (county compositions from NC General Assembly) ──────────

const HOUSE = {
   1: { city: 'Edenton',        region: 'Outer Banks'           },  // Chowan/Currituck/Dare/Perquimans/Tyrrell/Washington
   2: { city: 'Durham',         region: 'Research Triangle'     },  // Durham/Person
   3: { city: 'New Bern',       region: 'Coastal Plain'         },  // Craven
   4: { city: 'Goldsboro',      region: 'Eastern NC'            },  // Duplin/Wayne
   5: { city: 'Elizabeth City', region: 'Northeastern NC'       },  // Camden/Gates/Hertford/Pasquotank
   6: { city: 'Dunn',           region: 'South-Central NC'      },  // Harnett
   7: { city: 'Henderson',      region: 'Northern Piedmont'     },  // Franklin/Vance
   8: { city: 'Greenville',     region: 'Eastern NC'            },  // Pitt
   9: { city: 'Greenville',     region: 'Eastern NC'            },  // Pitt
  10: { city: 'Goldsboro',      region: 'Eastern NC'            },  // Wayne
  11: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  12: { city: 'Kinston',        region: 'Eastern NC'            },  // Greene/Jones/Lenoir
  13: { city: 'New Bern',       region: 'Coastal Plain'         },  // Carteret/Craven
  14: { city: 'Jacksonville',   region: 'Coastal NC'            },  // Onslow
  15: { city: 'Jacksonville',   region: 'Coastal NC'            },  // Onslow
  16: { city: 'Jacksonville',   region: 'Coastal NC'            },  // Onslow/Pender
  17: { city: 'Leland',         region: 'Cape Fear Coast'       },  // Brunswick
  18: { city: 'Wilmington',     region: 'Cape Fear Coast'       },  // New Hanover
  19: { city: 'Wilmington',     region: 'Cape Fear Coast'       },  // Brunswick/New Hanover
  20: { city: 'Wilmington',     region: 'Cape Fear Coast'       },  // New Hanover
  21: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  22: { city: 'Clinton',        region: 'Southeastern NC'       },  // Bladen/Sampson
  23: { city: 'Tarboro',        region: 'Eastern NC'            },  // Bertie/Edgecombe/Martin
  24: { city: 'Rocky Mount',    region: 'Eastern NC'            },  // Nash/Wilson
  25: { city: 'Rocky Mount',    region: 'Eastern NC'            },  // Nash
  26: { city: 'Smithfield',     region: 'Johnston County'       },  // Johnston
  27: { city: 'Roanoke Rapids', region: 'Northeastern NC'       },  // Halifax/Northampton/Warren
  28: { city: 'Smithfield',     region: 'Johnston County'       },  // Johnston
  29: { city: 'Durham',         region: 'Research Triangle'     },  // Durham
  30: { city: 'Durham',         region: 'Research Triangle'     },  // Durham
  31: { city: 'Durham',         region: 'Research Triangle'     },  // Durham
  32: { city: 'Henderson',      region: 'Northern Piedmont'     },  // Granville/Vance
  33: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  34: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  35: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  36: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  37: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  38: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  39: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  40: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  41: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  42: { city: 'Fayetteville',   region: 'Sandhills'             },  // Cumberland
  43: { city: 'Fayetteville',   region: 'Sandhills'             },  // Cumberland
  44: { city: 'Fayetteville',   region: 'Sandhills'             },  // Cumberland
  45: { city: 'Fayetteville',   region: 'Sandhills'             },  // Cumberland
  46: { city: 'Whiteville',     region: 'Southeastern NC'       },  // Columbus/Robeson
  47: { city: 'Lumberton',      region: 'Southeastern NC'       },  // Robeson
  48: { city: 'Laurinburg',     region: 'Sandhills'             },  // Hoke/Scotland
  49: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  50: { city: 'Chapel Hill',    region: 'Research Triangle'     },  // Caswell/Orange
  51: { city: 'Sanford',        region: 'Sandhills'             },  // Lee/Moore
  52: { city: 'Southern Pines', region: 'Sandhills'             },  // Moore/Richmond
  53: { city: 'Dunn',           region: 'South-Central NC'      },  // Harnett/Johnston
  54: { city: 'Pittsboro',      region: 'Central Piedmont'      },  // Chatham/Randolph
  55: { city: 'Monroe',         region: 'Charlotte Metro'       },  // Anson/Union
  56: { city: 'Chapel Hill',    region: 'Research Triangle'     },  // Orange
  57: { city: 'Greensboro',     region: 'Piedmont Triad'        },  // Guilford
  58: { city: 'Greensboro',     region: 'Piedmont Triad'        },  // Guilford
  59: { city: 'Greensboro',     region: 'Piedmont Triad'        },  // Guilford
  60: { city: 'Greensboro',     region: 'Piedmont Triad'        },  // Guilford
  61: { city: 'Greensboro',     region: 'Piedmont Triad'        },  // Guilford
  62: { city: 'High Point',     region: 'Piedmont Triad'        },  // Guilford
  63: { city: 'Burlington',     region: 'Piedmont Triad'        },  // Alamance
  64: { city: 'Burlington',     region: 'Piedmont Triad'        },  // Alamance
  65: { city: 'Eden',           region: 'Northern Piedmont'     },  // Rockingham
  66: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  67: { city: 'Albemarle',      region: 'Piedmont'              },  // Montgomery/Stanly
  68: { city: 'Monroe',         region: 'Charlotte Metro'       },  // Union
  69: { city: 'Monroe',         region: 'Charlotte Metro'       },  // Union
  70: { city: 'Asheboro',       region: 'Piedmont'              },  // Randolph
  71: { city: 'Winston-Salem',  region: 'Piedmont Triad'        },  // Forsyth
  72: { city: 'Winston-Salem',  region: 'Piedmont Triad'        },  // Forsyth
  73: { city: 'Concord',        region: 'Charlotte Metro'       },  // Cabarrus
  74: { city: 'Winston-Salem',  region: 'Piedmont Triad'        },  // Forsyth
  75: { city: 'Winston-Salem',  region: 'Piedmont Triad'        },  // Forsyth
  76: { city: 'Salisbury',      region: 'Piedmont'              },  // Rowan
  77: { city: 'Mocksville',     region: 'Piedmont'              },  // Davie/Rowan/Yadkin
  78: { city: 'Southern Pines', region: 'Sandhills'             },  // Moore/Randolph
  79: { city: 'Washington',     region: 'Inner Banks'           },  // Beaufort/Dare/Hyde/Pamlico
  80: { city: 'Lexington',      region: 'Piedmont Triad'        },  // Davidson
  81: { city: 'Lexington',      region: 'Piedmont Triad'        },  // Davidson
  82: { city: 'Concord',        region: 'Charlotte Metro'       },  // Cabarrus
  83: { city: 'Concord',        region: 'Charlotte Metro'       },  // Cabarrus/Rowan
  84: { city: 'Statesville',    region: 'Piedmont Foothills'    },  // Iredell
  85: { city: 'Marion',         region: 'Blue Ridge Mountains'  },  // Avery/McDowell/Mitchell/Yancey
  86: { city: 'Morganton',      region: 'Foothills'             },  // Burke
  87: { city: 'Lenoir',         region: 'Foothills'             },  // Caldwell/Watauga
  88: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
  89: { city: 'Mooresville',    region: 'Piedmont Foothills'    },  // Catawba/Iredell
  90: { city: 'Mount Airy',     region: 'Northern Foothills'    },  // Surry/Wilkes
  91: { city: 'Kernersville',   region: 'Piedmont Triad'        },  // Forsyth/Stokes
  92: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
  93: { city: 'Boone',          region: 'Blue Ridge Mountains'  },  // Alleghany/Ashe/Watauga
  94: { city: 'Wilkesboro',     region: 'Foothills'             },  // Alexander/Wilkes
  95: { city: 'Mooresville',    region: 'Piedmont Foothills'    },  // Iredell
  96: { city: 'Hickory',        region: 'Catawba Valley'        },  // Catawba
  97: { city: 'Lincolnton',     region: 'Piedmont Foothills'    },  // Lincoln
  98: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
  99: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
 100: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
 101: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
 102: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
 103: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
 104: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
 105: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
 106: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
 107: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
 108: { city: 'Gastonia',       region: 'Charlotte Metro'       },  // Gaston
 109: { city: 'Gastonia',       region: 'Charlotte Metro'       },  // Gaston
 110: { city: 'Shelby',         region: 'Piedmont Foothills'    },  // Cleveland/Gaston
 111: { city: 'Shelby',         region: 'Piedmont Foothills'    },  // Cleveland/Rutherford
 112: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
 113: { city: 'Hendersonville', region: 'Blue Ridge Mountains'  },  // Henderson/McDowell/Polk/Rutherford
 114: { city: 'Asheville',      region: 'Blue Ridge Mountains'  },  // Buncombe
 115: { city: 'Asheville',      region: 'Blue Ridge Mountains'  },  // Buncombe
 116: { city: 'Asheville',      region: 'Blue Ridge Mountains'  },  // Buncombe
 117: { city: 'Hendersonville', region: 'Blue Ridge Mountains'  },  // Henderson
 118: { city: 'Waynesville',    region: 'Western NC Mountains'  },  // Haywood/Madison
 119: { city: 'Brevard',        region: 'Western NC Mountains'  },  // Jackson/Swain/Transylvania
 120: { city: 'Franklin',       region: 'Western NC'            },  // Cherokee/Clay/Graham/Macon
};

const SENATE = {
   1: { city: 'Elizabeth City', region: 'Northeastern NC'       },  // Bertie/Camden/Currituck/Dare/Gates/Hertford/Northampton/Pasquotank/Perquimans/Tyrrell
   2: { city: 'Roanoke Rapids', region: 'Northeastern NC'       },  // Carteret/Chowan/Halifax/Hyde/Martin/Pamlico/Warren/Washington
   3: { city: 'New Bern',       region: 'Coastal Plain'         },  // Beaufort/Craven/Lenoir
   4: { city: 'Goldsboro',      region: 'Eastern NC'            },  // Greene/Wayne/Wilson
   5: { city: 'Greenville',     region: 'Eastern NC'            },  // Edgecombe/Pitt
   6: { city: 'Jacksonville',   region: 'Coastal NC'            },  // Onslow
   7: { city: 'Wilmington',     region: 'Cape Fear Coast'       },  // New Hanover
   8: { city: 'Wilmington',     region: 'Cape Fear Coast'       },  // Brunswick/Columbus/New Hanover
   9: { city: 'Clinton',        region: 'Southeastern NC'       },  // Bladen/Duplin/Jones/Pender/Sampson
  10: { city: 'Smithfield',     region: 'Johnston County'       },  // Johnston
  11: { city: 'Rocky Mount',    region: 'Eastern NC'            },  // Franklin/Nash/Vance
  12: { city: 'Sanford',        region: 'Sandhills'             },  // Harnett/Lee/Sampson
  13: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  14: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  15: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  16: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  17: { city: 'Raleigh',        region: 'Research Triangle'     },  // Wake
  18: { city: 'Wake Forest',    region: 'Research Triangle'     },  // Granville/Wake
  19: { city: 'Fayetteville',   region: 'Sandhills'             },  // Cumberland
  20: { city: 'Durham',         region: 'Research Triangle'     },  // Chatham/Durham
  21: { city: 'Fayetteville',   region: 'Sandhills'             },  // Cumberland/Moore
  22: { city: 'Durham',         region: 'Research Triangle'     },  // Durham
  23: { city: 'Chapel Hill',    region: 'Research Triangle'     },  // Caswell/Orange/Person
  24: { city: 'Lumberton',      region: 'Southeastern NC'       },  // Hoke/Robeson/Scotland
  25: { city: 'Burlington',     region: 'Piedmont Triad'        },  // Alamance/Randolph
  26: { city: 'Greensboro',     region: 'Piedmont Triad'        },  // Guilford/Rockingham
  27: { city: 'Greensboro',     region: 'Piedmont Triad'        },  // Guilford
  28: { city: 'High Point',     region: 'Piedmont Triad'        },  // Guilford
  29: { city: 'Rockingham',     region: 'Sandhills'             },  // Anson/Montgomery/Randolph/Richmond/Union
  30: { city: 'Lexington',      region: 'Piedmont Triad'        },  // Davidson/Davie
  31: { city: 'Winston-Salem',  region: 'Piedmont Triad'        },  // Forsyth/Stokes
  32: { city: 'Winston-Salem',  region: 'Piedmont Triad'        },  // Forsyth
  33: { city: 'Salisbury',      region: 'Piedmont'              },  // Rowan/Stanly
  34: { city: 'Concord',        region: 'Charlotte Metro'       },  // Cabarrus
  35: { city: 'Concord',        region: 'Charlotte Metro'       },  // Cabarrus/Union
  36: { city: 'Mount Airy',     region: 'Northwestern Foothills' }, // Alexander/Surry/Wilkes/Yadkin
  37: { city: 'Mooresville',    region: 'Piedmont Foothills'    },  // Iredell/Mecklenburg
  38: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
  39: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
  40: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
  41: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
  42: { city: 'Charlotte',      region: 'Charlotte Metro'       },  // Mecklenburg
  43: { city: 'Gastonia',       region: 'Charlotte Metro'       },  // Gaston
  44: { city: 'Shelby',         region: 'Piedmont Foothills'    },  // Cleveland/Gaston/Lincoln
  45: { city: 'Hickory',        region: 'Catawba Valley'        },  // Caldwell/Catawba
  46: { city: 'Morganton',      region: 'Foothills'             },  // Buncombe/Burke/McDowell
  47: { city: 'Boone',          region: 'Blue Ridge Mountains'  },  // Alleghany/Ashe/Avery/Caldwell/Haywood/Madison/Mitchell/Watauga/Yancey
  48: { city: 'Hendersonville', region: 'Blue Ridge Mountains'  },  // Henderson/Polk/Rutherford
  49: { city: 'Asheville',      region: 'Blue Ridge Mountains'  },  // Buncombe
  50: { city: 'Franklin',       region: 'Western NC'            },  // Cherokee/Clay/Graham/Haywood/Jackson/Macon/Swain/Transylvania
};

// ── Replace a field value within a bounded slice of source ───────────────────

function replaceField(src, fieldName, newValue, rangeStart, rangeEnd) {
  const before  = src.slice(0, rangeStart);
  const segment = src.slice(rangeStart, rangeEnd);
  const after   = src.slice(rangeEnd);
  const escaped = newValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const re = new RegExp(`(${fieldName}:\\s*)["'][^"'\\n]*["']`);
  return before + segment.replace(re, `$1"${escaped}"`) + after;
}

// ── Apply a city/region update for one district ──────────────────────────────

function applyUpdate(src, id, city, region) {
  let idStart = src.indexOf(`id: "${id}"`);
  if (idStart === -1) idStart = src.indexOf(`id: '${id}'`);
  if (idStart === -1) { console.warn(`  [WARN] id not found: ${id}`); return src; }

  const dashStart = src.indexOf('dashboard: {', idStart);
  if (dashStart === -1) { console.warn(`  [WARN] no dashboard for: ${id}`); return src; }

  src = replaceField(src, 'city',   city,   idStart, dashStart);
  src = replaceField(src, 'region', region, idStart, dashStart);
  return src;
}

// ── Main ─────────────────────────────────────────────────────────────────────

let src = fs.readFileSync(FILE, 'utf8');

let houseUpdated = 0, senateUpdated = 0;

for (const [num, geo] of Object.entries(HOUSE)) {
  const id = `nc-hd-${num}`;
  src = applyUpdate(src, id, geo.city, geo.region);
  houseUpdated++;
}

for (const [num, geo] of Object.entries(SENATE)) {
  const id = `nc-sd-${num}`;
  src = applyUpdate(src, id, geo.city, geo.region);
  senateUpdated++;
}

fs.writeFileSync(FILE, src, 'utf8');

console.log(`Updated nc-districts.js`);
console.log(`  House districts:  ${houseUpdated}/120`);
console.log(`  Senate districts: ${senateUpdated}/50`);
console.log(`  Total: ${houseUpdated + senateUpdated}/170`);
