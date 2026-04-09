/* districts.js — Groundwork Ohio City District Data
 *
 * DATA SCHEMA (each entry):
 *   id             — unique kebab-case string used by showDistrict()
 *   name           — display name shown in search and dashboard
 *   city           — "Akron" | "Cleveland" | "Columbus" | "Cincinnati" | "Toledo"
 *   region         — neighborhood / area description (shown in search dropdown)
 *   type           — "ward" | "council district" | "state house district"
 *   incumbentName  — current officeholder, or "TBD"
 *   incumbentParty — "Democrat" | "Republican" | "Independent" | "TBD"
 *   nextElection   — e.g. "November 2025"
 *   seatStatus     — "Active" | "Open" | "TBD"
 *   dashboard      — full brief object, or null (shows "Coming Soon" screen)
 *
 * HOW TO ADD MORE DISTRICTS:
 *   1. Add a new object to the DISTRICTS array in the right city section.
 *   2. Fill in all fields above. Set dashboard: null if the brief isn't ready.
 *   3. To add a full brief, copy an existing dashboard object and fill it in.
 *   4. The district will automatically appear in search and (if dashboard exists)
 *      be linkable from the featured grid via showDistrict('your-id').
 * ─────────────────────────────────────────────────────────────────────────────── */

const DEMO_COLORS = ['#3a7d50','#5a9e72','#7abe94','#9dd4b0','#c0e8cc','#d8f2e0'];

const DISTRICTS = [

  // ══════════════════════════════════════════════
  //  OHIO STATE HOUSE DISTRICTS
  // ══════════════════════════════════════════════

  {
    id: "oh-hd-1",
    name: "Ohio House District 1",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 1",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$57,046", sub: "" },
        { label: "College-Educated Adults",  value: "38.6%",  sub: "" },
        { label: "Median Age",               value: "34.4",   sub: "" },
        { label: "Renter Rate",              value: "58.0%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Uncontested in 2024. Dontavius Jarrells (D) ran with no opponent.",
      demos: [
        { label: "White",                    pct: 49.7, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 36.9, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  6.9, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  1.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-2",
    name: "Ohio House District 2",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 2",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$56,806", sub: "" },
        { label: "College-Educated Adults",  value: "20.6%",  sub: "" },
        { label: "Median Age",               value: "35.6",   sub: "" },
        { label: "Renter Rate",              value: "55.5%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Latyna M. Humphrey (D) ran without a Republican opponent in 2024.",
      demos: [
        { label: "Black / African American", pct: 50.5, color: DEMO_COLORS[0] },
        { label: "White",                    pct: 34.1, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  8.0, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  3.2, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-3",
    name: "Ohio House District 3",
    city: "Columbus",
    region: "Columbus Urban Core",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Columbus Urban Core — Ohio House District 3, Franklin County",
      chips: ["Majority-Minority District", "High Renter Concentration", "Young Median Age", "Economically Diverse", "Growing Hispanic Population"],
      stats: [
        { label: "Median Household Income", value: "$55,038", sub: "Near Ohio median" },
        { label: "College-Educated Adults",  value: "34.1%",  sub: "Slightly above statewide avg" },
        { label: "Median Age",               value: "30.2",   sub: "Younger than Ohio avg" },
        { label: "Renter Rate",              value: "63.3%",  sub: "Predominantly renting" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Uncontested in 2024. Safe Democratic seat — turnout is the only variable.",
      demos: [
        { label: "White",                    pct: 42.6, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 41.8, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  8.3, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  3.4, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Affordable Housing",           tag: "lean-into", why: "63% of residents rent in a city with rapid rent growth. Housing cost burden is a daily lived reality — frame every housing vote around keeping people in their homes." },
        { name: "Economic Opportunity & Wages", tag: "lean-into", why: "Median income near the state median masks deep inequality between renters and owners. Workforce investment and wage floors are concrete asks that cut across racial lines in this district." },
        { name: "Education Funding",            tag: "lean-into", why: "A young median age (30.2) means many households include school-age children. Columbus City Schools' funding battles resonate directly on the doors." },
        { name: "Immigration & Equity",         tag: "lean-into", why: "A growing Hispanic population (8.3%) and majority-minority composition make inclusive policy framing important. Speak to the whole coalition, not just the plurality." },
        { name: "Public Safety",                tag: "careful",   why: "Safety is a concern across racial groups but carries different valences. Lead with community investment and accountability structures rather than enforcement headcount." },
        { name: "Business Tax Incentives",      tag: "avoid",     why: "Broad corporate tax relief reads as favoring developers and employers over working renters. Tie any business-support language explicitly to local jobs and affordable unit requirements." }
      ],
      memoHeadline: "A multiracial coalition district. Win it by speaking to everyone — not just the plurality.",
      memoParagraphs: [
        "HD-3 is one of Ohio's most diverse legislative districts, split nearly evenly between Black and white residents with a growing Hispanic community. No single group is large enough to win alone — your coalition must be genuinely multiracial, and voters will notice if your outreach isn't.",
        "Housing is the unifying issue. With 63% renters and a Columbus rental market under sustained pressure, affordability is not an ideological position here — it's an economic survival question. Lead with it on every door.",
        "Turnout among younger voters and Hispanic residents is the variable that decides this seat. Your field operation should prioritize registration and GOTV in those communities, not just traditional high-propensity voter contact."
      ],
      memoBullets: [
        "Spanish-language outreach is not optional — it's a margin issue. Budget for it from day one.",
        "Distinguish your housing position from general Democratic messaging: name specific developments, specific affordability commitments, specific zoning votes.",
        "Younger voters (median age 30.2) respond to digital-first organizing. Pair door-knocking with a sustained social media presence in the district."
      ]
    }
  },
  {
    id: "oh-hd-4",
    name: "Ohio House District 4",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 4",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$108,648", sub: "" },
        { label: "College-Educated Adults",  value: "56.6%",   sub: "" },
        { label: "Median Age",               value: "39.2",    sub: "" },
        { label: "Renter Rate",              value: "27.3%",   sub: "" }
      ],
      dem: 57, rep: 43,
      partisanSub: "Beryl Brown Piccolantonio (D) 57% / Jason Allevato (R) 43% in 2024.",
      demos: [
        { label: "White",                    pct: 72.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 13.4, color: DEMO_COLORS[1] },
        { label: "Asian",                    pct:  5.6, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino",        pct:  3.3, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-5",
    name: "Ohio House District 5",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 5",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$74,071", sub: "" },
        { label: "College-Educated Adults",  value: "28.7%",  sub: "" },
        { label: "Median Age",               value: "36",     sub: "" },
        { label: "Renter Rate",              value: "32.7%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Uncontested in 2024. Meredith Lawson-Rowe (D) ran with no opponent.",
      demos: [
        { label: "White",                    pct: 63.7, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 22.9, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  6.0, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  2.7, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-6",
    name: "Ohio House District 6",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 6",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$67,868", sub: "" },
        { label: "College-Educated Adults",  value: "31.2%",  sub: "" },
        { label: "Median Age",               value: "33.6",   sub: "" },
        { label: "Renter Rate",              value: "47.0%",  sub: "" }
      ],
      dem: 60, rep: 40,
      partisanSub: "Christine Cockley (D) 60% / Hussein Jabiri (R) 40% in 2024.",
      demos: [
        { label: "White",                    pct: 63.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 16.1, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct: 13.0, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  3.9, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-7",
    name: "Ohio House District 7",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 7",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$83,034", sub: "" },
        { label: "College-Educated Adults",  value: "72.6%",  sub: "" },
        { label: "Median Age",               value: "29.7",   sub: "" },
        { label: "Renter Rate",              value: "52.4%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Allison Russo (D) ran without a Republican opponent in 2024.",
      demos: [
        { label: "White",                    pct: 79.3, color: DEMO_COLORS[0] },
        { label: "Asian",                    pct:  8.6, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  5.4, color: DEMO_COLORS[2] },
        { label: "Black / African American", pct:  4.3, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-8",
    name: "Ohio House District 8",
    city: "Columbus",
    region: "Columbus Suburbs",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Columbus Suburbs — Ohio House District 8, Franklin County",
      chips: ["High Education Attainment", "Suburban Owner Class", "Competitive Lean-D", "Growing Asian Population", "Professional Workforce"],
      stats: [
        { label: "Median Household Income", value: "$84,218", sub: "Well above Ohio avg" },
        { label: "College-Educated Adults",  value: "56.9%",  sub: "Among highest in Ohio" },
        { label: "Median Age",               value: "36.5",   sub: "Near Ohio avg" },
        { label: "Renter Rate",              value: "47.3%",  sub: "Near even split" }
      ],
      dem: 65, rep: 35,
      partisanSub: "Leans Democratic. Somani won by 29 points in 2024.",
      demos: [
        { label: "White",                    pct: 71.2, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 11.2, color: DEMO_COLORS[1] },
        { label: "Asian",                    pct:  7.3, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino",        pct:  6.4, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Education Quality & Funding",          tag: "lean-into", why: "A 56.9% college-education rate means this district is full of parents who expect strong public schools and will vote on it. School funding equity is both a values issue and a property-value issue here." },
        { name: "Housing Affordability & Zoning",       tag: "lean-into", why: "47% of residents rent in a suburban market under price pressure. Affordability resonates with renters and with younger homeowners worried about whether their kids can afford to stay nearby." },
        { name: "Reproductive Rights",                  tag: "lean-into", why: "The suburban college-educated shift toward Democrats is substantially driven by reproductive rights. Don't soften the message — this is a motivating issue for the coalition you need to turn out." },
        { name: "Economic Development & Infrastructure", tag: "lean-into", why: "High-income, educated suburban voters reward candidates who connect infrastructure investment to quality of life and competitiveness. Frame it around schools, roads, and broadband — not abstract growth." },
        { name: "Crime & Public Safety",                tag: "careful",   why: "Suburban voters want safety but are not looking for punitive rhetoric. Focus on community investment and response times. Avoid anything that sounds like a culture-war framing." },
        { name: "Immigration",                          tag: "careful",   why: "A growing Asian (7.3%) and Hispanic (6.4%) population means the district is diversifying. Immigration rhetoric that plays to fear will alienate exactly the swing voters you need." },
        { name: "Anti-Institutional Populism",          tag: "avoid",     why: "High-education districts distrust candidate messaging that attacks expertise, institutions, or 'elites.' This is not MAGA country even among Republican-leaning voters. Stay substantive." }
      ],
      memoHeadline: "A suburban seat won on competence and values — not base mobilization.",
      memoParagraphs: [
        "HD-8 is a high-education, high-income suburban district that is trending Democratic on the strength of the college-educated swing. Your base already leans toward you — the task is preventing ticket-splitting and defection among persuadable suburban independents.",
        "Education and reproductive rights are your two strongest issues. Both work across the coalition: they motivate your base, they appeal to the college-educated independents you need, and they put your opponent on defense in a district where cultural-war positioning is a liability.",
        "The district's growing Asian and Hispanic populations are underregistered relative to their share of the population. Early investment in outreach to these communities is a force multiplier — these are not yet captured votes."
      ],
      memoBullets: [
        "Host town halls focused on education policy — this is the issue that cuts across partisan lines most cleanly in a high-education suburban district.",
        "Voter registration drives targeting Asian American and Hispanic residents are a low-cost, high-upside investment given current underregistration.",
        "Be prepared to draw a sharp contrast on reproductive rights. Your opponent will try to muddy the message — don't let them."
      ]
    }
  },
  {
    id: "oh-hd-9",
    name: "Ohio House District 9",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 9",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$69,465", sub: "" },
        { label: "College-Educated Adults",  value: "35.6%",  sub: "" },
        { label: "Median Age",               value: "34.2",   sub: "" },
        { label: "Renter Rate",              value: "51.7%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Munira Yasin Abdullahi (D) ran without a Republican opponent in 2024.",
      demos: [
        { label: "White",                    pct: 46.9, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 33.8, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  8.5, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  6.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-10",
    name: "Ohio House District 10",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 10",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$69,482", sub: "" },
        { label: "College-Educated Adults",  value: "22.9%",  sub: "" },
        { label: "Median Age",               value: "37.7",   sub: "" },
        { label: "Renter Rate",              value: "38.8%",  sub: "" }
      ],
      dem: 52, rep: 48,
      partisanSub: "Mark Sigrist (D) 52% / Brian M. Garvine (R) 48% in 2024.",
      demos: [
        { label: "White",                    pct: 68.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 18.4, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  6.8, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  2.0, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-11",
    name: "Ohio House District 11",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 11",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$114,821", sub: "" },
        { label: "College-Educated Adults",  value: "63.6%",   sub: "" },
        { label: "Median Age",               value: "37.2",    sub: "" },
        { label: "Renter Rate",              value: "38.9%",   sub: "" }
      ],
      dem: 52, rep: 48,
      partisanSub: "Crystal Lett (D) 52% / Stephanie L. Kunze (R) 48% in 2024.",
      demos: [
        { label: "White",                    pct: 74.7, color: DEMO_COLORS[0] },
        { label: "Asian",                    pct: 13.1, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  5.6, color: DEMO_COLORS[2] },
        { label: "Black / African American", pct:  4.1, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-12",
    name: "Ohio House District 12",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 12",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$77,804", sub: "" },
        { label: "College-Educated Adults",  value: "25.3%",  sub: "" },
        { label: "Median Age",               value: "39.6",   sub: "" },
        { label: "Renter Rate",              value: "28.8%",  sub: "" }
      ],
      dem: 27, rep: 73,
      partisanSub: "Brian Stewart (R) 73% / Brad W. Cotton (D) 27% in 2024.",
      demos: [
        { label: "White",                    pct: 88.8, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  3.7, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  2.5, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  1.9, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-13",
    name: "Ohio House District 13",
    city: "Cleveland",
    region: "Lakewood / West Cleveland",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Lakewood & West Cleveland — Ohio House District 13, Cuyahoga County",
      chips: ["Majority Renter District", "Growing Hispanic Population", "Middle-Income Urban Suburb", "Competitive Lean-D", "Dense Neighborhood Character"],
      stats: [
        { label: "Median Household Income", value: "$55,660", sub: "Near Ohio median" },
        { label: "College-Educated Adults",  value: "36.8%",  sub: "Above statewide avg" },
        { label: "Median Age",               value: "35.7",   sub: "Near Ohio avg" },
        { label: "Renter Rate",              value: "55.4%",  sub: "Majority renting" }
      ],
      dem: 77, rep: 23,
      partisanSub: "Reliably Democratic. Rader won by 53 points in 2024.",
      demos: [
        { label: "White",                    pct: 69.8, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino",        pct: 15.1, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 13.0, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  1.9, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Affordable Housing & Rent Stability",  tag: "lean-into", why: "55% of residents rent in a market where Lakewood's density and desirability have pushed rents up. Rent burden is broad-based across the district — it's not a low-income issue, it's a middle-income squeeze." },
        { name: "Immigration & Latino Community",       tag: "lean-into", why: "Hispanic residents are 15.1% of the district and growing. This is a meaningful margin-deciding constituency. Outreach, Spanish-language materials, and policy that speaks to immigrant families is not optional." },
        { name: "Neighborhood Infrastructure",          tag: "lean-into", why: "Lakewood and West Cleveland voters care about the physical quality of dense urban neighborhoods — sidewalks, transit, parks, and street safety. These are direct votes on quality of life." },
        { name: "Education & School Quality",           tag: "lean-into", why: "A median age of 35.7 and mixed-income renters means many households have school-age children across income levels. Education funding resonates with both working-class and professional families." },
        { name: "Economic Anxiety & Jobs",              tag: "careful",   why: "The district spans working-class and professional households. Messaging that sounds overly progressive on economic policy can lose blue-collar white voters. Lead with tangible local investment, not ideological framing." },
        { name: "Crime & Public Safety",                tag: "careful",   why: "Lakewood has a community-policing culture. Residents want safety and neighborhood stability — not a defund debate. Focus on response times, community policing, and lighting." },
        { name: "Anti-Suburban Development",            tag: "avoid",     why: "Lakewood is famously pro-density and urbanist for a suburb. But West Cleveland voters are more skeptical of large-scale development. Don't overpromise on upzoning without knowing which blocks you're on." }
      ],
      memoHeadline: "A majority-renter, multiethnic district held together by neighborhood identity — speak to it.",
      memoParagraphs: [
        "HD-13 is not a base-mobilization district — it's a coalition district. Your white working-class voters, your Hispanic families, and your college-educated renters all live here and vote here, and they are not reading from the same ideological script. Your job is to find the issues that bind them, not the ones that split them.",
        "Housing affordability is your strongest unifier. At 55% renters with incomes near the state median, cost burden is a kitchen-table issue regardless of race or ideology. Every door conversation should start there.",
        "The Hispanic community at 15.1% of the district is the fastest-growing constituency and the one most likely to be underregistered. A dedicated bilingual field program paying attention to this community is the single highest-ROI investment in a close race."
      ],
      memoBullets: [
        "Invest in Spanish-language outreach early — not as an afterthought. The Hispanic margin here is large enough to decide a close race.",
        "Lakewood voters respond to neighborhood-level specificity. Know the ward boundaries, the park names, the transit lines. Generic regional messaging falls flat.",
        "Do not run a base-only campaign. The district's competitive flank requires a message that holds working-class voters who may otherwise ticket-split."
      ]
    }
  },
  {
    id: "oh-hd-14",
    name: "Ohio House District 14",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 14",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$63,788", sub: "" },
        { label: "College-Educated Adults",  value: "23.8%",  sub: "" },
        { label: "Median Age",               value: "41.9",   sub: "" },
        { label: "Renter Rate",              value: "31.6%",  sub: "" }
      ],
      dem: 58, rep: 42,
      partisanSub: "Sean Patrick Brennan (D) 58% / David Morgan (R) 42% in 2024.",
      demos: [
        { label: "White",                    pct: 78.0, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino",        pct:  9.7, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct:  8.0, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  2.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-15",
    name: "Ohio House District 15",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 15",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$67,884", sub: "" },
        { label: "College-Educated Adults",  value: "31.3%",  sub: "" },
        { label: "Median Age",               value: "42.1",   sub: "" },
        { label: "Renter Rate",              value: "34.2%",  sub: "" }
      ],
      dem: 55, rep: 45,
      partisanSub: "Chris Glassburn (D) 55% / Aaron L. Borowski (R) 45% in 2024.",
      demos: [
        { label: "White",                    pct: 74.5, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino",        pct: 13.3, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct:  8.1, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  3.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-16",
    name: "Ohio House District 16",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 16",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$94,770", sub: "" },
        { label: "College-Educated Adults",  value: "47.2%",  sub: "" },
        { label: "Median Age",               value: "43.5",   sub: "" },
        { label: "Renter Rate",              value: "23.0%",  sub: "" }
      ],
      dem: 61, rep: 39,
      partisanSub: "Bride Rose Sweeney (D) 61% / Daniel James Harrington (R) 39% in 2024.",
      demos: [
        { label: "White",                    pct: 86.7, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino",        pct:  5.5, color: DEMO_COLORS[1] },
        { label: "Asian",                    pct:  3.3, color: DEMO_COLORS[2] },
        { label: "Black / African American", pct:  3.1, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-17",
    name: "Ohio House District 17",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 17",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$84,536", sub: "" },
        { label: "College-Educated Adults",  value: "42.9%",  sub: "" },
        { label: "Median Age",               value: "44.8",   sub: "" },
        { label: "Renter Rate",              value: "24.5%",  sub: "" }
      ],
      dem: 45, rep: 55,
      partisanSub: "Mike Dovilla (R) 55% / Jessica Sutherland (D) 45% in 2024.",
      demos: [
        { label: "White",                    pct: 84.8, color: DEMO_COLORS[0] },
        { label: "Asian",                    pct:  5.2, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  4.8, color: DEMO_COLORS[2] },
        { label: "Black / African American", pct:  3.9, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-18",
    name: "Ohio House District 18",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 18",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$40,659", sub: "" },
        { label: "College-Educated Adults",  value: "15.5%",  sub: "" },
        { label: "Median Age",               value: "40",     sub: "" },
        { label: "Renter Rate",              value: "48.9%",  sub: "" }
      ],
      dem: 89, rep: 11,
      partisanSub: "Juanita O. Brent (D) 89% / Justyn Anderson (R) 11% in 2024.",
      demos: [
        { label: "Black / African American", pct: 74.5, color: DEMO_COLORS[0] },
        { label: "White",                    pct: 17.3, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  3.3, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  0.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-19",
    name: "Ohio House District 19",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 19",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$86,637", sub: "" },
        { label: "College-Educated Adults",  value: "47.0%",  sub: "" },
        { label: "Median Age",               value: "44.5",   sub: "" },
        { label: "Renter Rate",              value: "30.6%",  sub: "" }
      ],
      dem: 57, rep: 43,
      partisanSub: "Phil Robinson (D) 57% / Kenny Godnavec (R) 43% in 2024.",
      demos: [
        { label: "White",                    pct: 63.6, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 22.4, color: DEMO_COLORS[1] },
        { label: "Asian",                    pct:  5.8, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino",        pct:  3.7, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-20",
    name: "Ohio House District 20",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 20",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$34,655", sub: "" },
        { label: "College-Educated Adults",  value: "27.3%",  sub: "" },
        { label: "Median Age",               value: "32.2",   sub: "" },
        { label: "Renter Rate",              value: "71.0%",  sub: "" }
      ],
      dem: 85, rep: 15,
      partisanSub: "Terrence Upchurch (D) 85% / Donna Walker-Brown (R) 15% in 2024.",
      demos: [
        { label: "Black / African American", pct: 55.3, color: DEMO_COLORS[0] },
        { label: "White",                    pct: 29.5, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  8.8, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  4.3, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-21",
    name: "Ohio House District 21",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 21",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$60,152", sub: "" },
        { label: "College-Educated Adults",  value: "36.2%",  sub: "" },
        { label: "Median Age",               value: "42.7",   sub: "" },
        { label: "Renter Rate",              value: "42.1%",  sub: "" }
      ],
      dem: 79, rep: 21,
      partisanSub: "Eric Synenberg (D) 79% / Joshua Malovasic (R) 21% in 2024.",
      demos: [
        { label: "Black / African American", pct: 47.8, color: DEMO_COLORS[0] },
        { label: "White",                    pct: 44.4, color: DEMO_COLORS[1] },
        { label: "Asian",                    pct:  2.3, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino",        pct:  2.3, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-22",
    name: "Ohio House District 22",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 22",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$64,860", sub: "" },
        { label: "College-Educated Adults",  value: "49.5%",  sub: "" },
        { label: "Median Age",               value: "37.7",   sub: "" },
        { label: "Renter Rate",              value: "45.4%",  sub: "" }
      ],
      dem: 86, rep: 14,
      partisanSub: "Darnell T. Brewer (D) 86% / Milan Wesley (R) 14% in 2024.",
      demos: [
        { label: "Black / African American", pct: 51.5, color: DEMO_COLORS[0] },
        { label: "White",                    pct: 39.6, color: DEMO_COLORS[1] },
        { label: "Asian",                    pct:  3.2, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino",        pct:  2.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-23",
    name: "Ohio House District 23",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 23",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$71,114", sub: "" },
        { label: "College-Educated Adults",  value: "31.7%",  sub: "" },
        { label: "Median Age",               value: "44.6",   sub: "" },
        { label: "Renter Rate",              value: "30.5%",  sub: "" }
      ],
      dem: 53, rep: 47,
      partisanSub: "Daniel P. Troy (D) 53% / Tony Hocevar (R) 47% in 2024.",
      demos: [
        { label: "White",                    pct: 81.6, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 11.5, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  2.6, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  1.7, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-24",
    name: "Ohio House District 24",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 24",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$50,135", sub: "" },
        { label: "College-Educated Adults",  value: "36.3%",  sub: "" },
        { label: "Median Age",               value: "31.6",   sub: "" },
        { label: "Renter Rate",              value: "65.0%",  sub: "" }
      ],
      dem: 73, rep: 27,
      partisanSub: "Dani Isaacsohn (D) 73% / John Sess (R) 27% in 2024.",
      demos: [
        { label: "White",                    pct: 49.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 38.1, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  6.2, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  2.3, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-25",
    name: "Ohio House District 25",
    city: "Cincinnati",
    region: "Cincinnati East Side",
    type: "state house district",
    incumbentName: "Cecil Thomas",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
    seatStatus: "Incumbent",
    dashboard: {
      subtitle: "Cincinnati East Side — Ohio House District 25, Hamilton County",
      chips: ["Reliably Democratic", "Majority Renter District", "Below-Median Income", "Young Median Age", "Multiracial Urban District"],
      stats: [
        { label: "Median Household Income", value: "$46,655", sub: "Below Ohio median" },
        { label: "College-Educated Adults",  value: "36.2%",  sub: "Above statewide avg" },
        { label: "Median Age",               value: "31.6",   sub: "Younger than Ohio avg" },
        { label: "Renter Rate",              value: "60.8%",  sub: "Majority renting" }
      ],
      dem: 84, rep: 16,
      partisanSub: "Reliably Democratic. Thomas won by 68 points in 2024.",
      demos: [
        { label: "White",                    pct: 53.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 34.8, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  6.1, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  3.3, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Affordable Housing",           tag: "lean-into", why: "61% of residents rent in a market where Cincinnati rents have climbed sharply. With household income below the state median, cost burden is not a policy abstraction — it's a monthly crisis for a large share of the district." },
        { name: "Economic Opportunity & Wages", tag: "lean-into", why: "Income sits well below the Ohio median despite a college-education rate above the state average — a gap that signals under-employment and wage compression. Workforce development and living-wage policy are galvanizing asks." },
        { name: "Education Funding",            tag: "lean-into", why: "A young median age of 31.6 means many households have school-age children. Cincinnati Public Schools' chronic funding battles translate directly into votes when framed around specific school closures and resource gaps." },
        { name: "Public Health & Environmental Justice", tag: "lean-into", why: "Hamilton County has documented lead exposure and air quality disparities concentrated in lower-income urban neighborhoods. Tying infrastructure investment to public health outcomes is both accurate and effective." },
        { name: "Public Safety",                tag: "careful",   why: "The district is multiracial and spans neighborhoods with different relationships to policing. Lead with community investment, mental health response, and accountability — avoid rhetoric that lands differently across racial lines." },
        { name: "Business Tax Incentives",      tag: "avoid",     why: "In a below-median-income district where residents rent and struggle with wages, broad corporate tax relief reads as the wrong priority. Anchor any economic policy in direct community benefit and local hiring requirements." }
      ],
      memoHeadline: "An 84-point margin tells you the base is there. The job is mobilization, not persuasion.",
      memoParagraphs: [
        "HD-25 is one of the safest Democratic seats in Ohio — Thomas's 84-16 margin in 2024 is not a fluke, it's a structural feature of a district built around a reliable multiracial coalition. The strategic challenge here is not winning over persuadables; it's making sure every eligible voter actually shows up.",
        "The economic story is the unifying thread. Despite a college-education rate above the state average, household income is well below the median — a signal of a district where education hasn't translated to economic security for a large share of residents. Every issue, from housing to jobs to schools, connects to that gap.",
        "The district's diversity (53% white, 35% Black, 6% Hispanic) requires a campaign that speaks fluently across communities. No single group is dominant enough to win alone without the others. The coalition only holds if every part of it feels genuinely addressed."
      ],
      memoBullets: [
        "Turnout operations — not persuasion mail — are the right investment here. Focus field resources on low-propensity registered voters, not ticket-splitters.",
        "Frame economic policy around the income-education gap: voters in this district are educated but not economically secure, and they know it. Speak to that specific frustration.",
        "Invest in consistent constituent services and community presence between elections. In a safe seat, long-term trust is the asset — don't let it erode through absence."
      ]
    }
  },
,
  {
    id: "oh-hd-26",
    name: "Ohio House District 26",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 26",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$70,332", sub: "" },
        { label: "College-Educated Adults",  value: "44.4%",  sub: "" },
        { label: "Median Age",               value: "38.7",   sub: "" },
        { label: "Renter Rate",              value: "40.8%",  sub: "" }
      ],
      dem: 69, rep: 31,
      partisanSub: "D 69.1% / R 30.9% in 2024. Sedrick Denson (D) won.",
      demos: [
        { label: "White", pct: 54.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 36.7, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 3.5, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.9, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-27",
    name: "Ohio House District 27",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 27",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$97,883", sub: "" },
        { label: "College-Educated Adults",  value: "59.1%",  sub: "" },
        { label: "Median Age",               value: "39.6",   sub: "" },
        { label: "Renter Rate",              value: "33.5%",  sub: "" }
      ],
      dem: 56, rep: 44,
      partisanSub: "D 55.8% / R 44.2% in 2024. Rachel Baker (D) won.",
      demos: [
        { label: "White", pct: 73.5, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 15.4, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 4.5, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 4.1, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-28",
    name: "Ohio House District 28",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 28",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$84,764", sub: "" },
        { label: "College-Educated Adults",  value: "48.3%",  sub: "" },
        { label: "Median Age",               value: "41.5",   sub: "" },
        { label: "Renter Rate",              value: "32.9%",  sub: "" }
      ],
      dem: 56, rep: 44,
      partisanSub: "D 55.9% / R 44.1% in 2024. Karen Brownlee (D) won.",
      demos: [
        { label: "White", pct: 68.6, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 17.7, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 6.9, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 4.9, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-29",
    name: "Ohio House District 29",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 29",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$73,352", sub: "" },
        { label: "College-Educated Adults",  value: "26.7%",  sub: "" },
        { label: "Median Age",               value: "38.1",   sub: "" },
        { label: "Renter Rate",              value: "28.3%",  sub: "" }
      ],
      dem: 43, rep: 57,
      partisanSub: "D 42.8% / R 57.2% in 2024. Cindy Abrams (R) won.",
      demos: [
        { label: "White", pct: 66.6, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 25.0, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 2.6, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.5, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-30",
    name: "Ohio House District 30",
    city: "Akron",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 30",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$82,325", sub: "" },
        { label: "College-Educated Adults",  value: "35.0%",  sub: "" },
        { label: "Median Age",               value: "38.9",   sub: "" },
        { label: "Renter Rate",              value: "20.1%",  sub: "" }
      ],
      dem: 31, rep: 69,
      partisanSub: "D 31.2% / R 68.8% in 2024. Mike Odioso (R) won.",
      demos: [
        { label: "White", pct: 86.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 7.5, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 1.7, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.9, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-31",
    name: "Ohio House District 31",
    city: "Akron",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 31",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$105,167", sub: "" },
        { label: "College-Educated Adults",  value: "49.0%",  sub: "" },
        { label: "Median Age",               value: "45.4",   sub: "" },
        { label: "Renter Rate",              value: "15.5%",  sub: "" }
      ],
      dem: 47, rep: 53,
      partisanSub: "D 47.0% / R 53.0% in 2024. Bill Roemer (R) won.",
      demos: [
        { label: "White", pct: 80.1, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 9.0, color: DEMO_COLORS[1] },
        { label: "Asian", pct: 5.2, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino", pct: 1.9, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-32",
    name: "Ohio House District 32",
    city: "Akron",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 32",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$60,896", sub: "" },
        { label: "College-Educated Adults",  value: "22.6%",  sub: "" },
        { label: "Median Age",               value: "40.3",   sub: "" },
        { label: "Renter Rate",              value: "35.6%",  sub: "" }
      ],
      dem: 43, rep: 57,
      partisanSub: "D 42.8% / R 57.2% in 2024. Jack K. Daniels (R) won.",
      demos: [
        { label: "White", pct: 80.4, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 11.3, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 2.1, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.2, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-33",
    name: "Ohio House District 33",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 33",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$46,120", sub: "" },
        { label: "College-Educated Adults",  value: "23.9%",  sub: "" },
        { label: "Median Age",               value: "36.5",   sub: "" },
        { label: "Renter Rate",              value: "52.4%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Uncontested in 2024. Veronica Sims (D) ran with no opponent.",
      demos: [
        { label: "White", pct: 48.8, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 34.7, color: DEMO_COLORS[1] },
        { label: "Asian", pct: 6.1, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino", pct: 4.7, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-34",
    name: "Ohio House District 34",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 34",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$84,963", sub: "" },
        { label: "College-Educated Adults",  value: "48.6%",  sub: "" },
        { label: "Median Age",               value: "39.6",   sub: "" },
        { label: "Renter Rate",              value: "31.4%",  sub: "" }
      ],
      dem: 53, rep: 47,
      partisanSub: "D 53.2% / R 46.8% in 2024. Derrick Hall (D) won.",
      demos: [
        { label: "White", pct: 84.8, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 5.3, color: DEMO_COLORS[1] },
        { label: "Asian", pct: 4.2, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino", pct: 1.7, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-35",
    name: "Ohio House District 35",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 35",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$81,888", sub: "" },
        { label: "College-Educated Adults",  value: "29.6%",  sub: "" },
        { label: "Median Age",               value: "45.4",   sub: "" },
        { label: "Renter Rate",              value: "18.4%",  sub: "" }
      ],
      dem: 47, rep: 53,
      partisanSub: "D 47.5% / R 52.5% in 2024. Steve Demetriou (R) won.",
      demos: [
        { label: "White", pct: 92.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 1.9, color: DEMO_COLORS[1] },
        { label: "Asian", pct: 1.8, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino", pct: 1.8, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-36",
    name: "Ohio House District 36",
    city: "Akron",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 36",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$62,126", sub: "" },
        { label: "College-Educated Adults",  value: "34.8%",  sub: "" },
        { label: "Median Age",               value: "37.5",   sub: "" },
        { label: "Renter Rate",              value: "38.6%",  sub: "" }
      ],
      dem: 48, rep: 52,
      partisanSub: "D 47.6% / R 52.4% in 2024. Andrea White (R) won.",
      demos: [
        { label: "White", pct: 77.4, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 11.7, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 4.4, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.8, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-37",
    name: "Ohio House District 37",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 37",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$88,817", sub: "" },
        { label: "College-Educated Adults",  value: "44.1%",  sub: "" },
        { label: "Median Age",               value: "41.3",   sub: "" },
        { label: "Renter Rate",              value: "30.6%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Uncontested in 2024. Tom Young (R) ran with no opponent.",
      demos: [
        { label: "White", pct: 83.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 6.0, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 4.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 4.2, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-38",
    name: "Ohio House District 38",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 38",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$45,074", sub: "" },
        { label: "College-Educated Adults",  value: "20.9%",  sub: "" },
        { label: "Median Age",               value: "33.4",   sub: "" },
        { label: "Renter Rate",              value: "52.8%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Uncontested in 2024. Desiree Tims (D) ran with no opponent.",
      demos: [
        { label: "White", pct: 51.5, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 38.2, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 5.0, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.5, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-39",
    name: "Ohio House District 39",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 39",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$62,144", sub: "" },
        { label: "College-Educated Adults",  value: "24.8%",  sub: "" },
        { label: "Median Age",               value: "42.7",   sub: "" },
        { label: "Renter Rate",              value: "35.5%",  sub: "" }
      ],
      dem: 41, rep: 59,
      partisanSub: "D 41.2% / R 58.8% in 2024. Phil Plummer (R) won.",
      demos: [
        { label: "White", pct: 61.5, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 29.3, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 2.7, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.2, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-40",
    name: "Ohio House District 40",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 40",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$74,986", sub: "" },
        { label: "College-Educated Adults",  value: "20.9%",  sub: "" },
        { label: "Median Age",               value: "41.0",   sub: "" },
        { label: "Renter Rate",              value: "21.7%",  sub: "" }
      ],
      dem: 23, rep: 77,
      partisanSub: "D 22.9% / R 77.1% in 2024. Rodney Creech (R) won.",
      demos: [
        { label: "White", pct: 87.9, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 5.5, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 2.5, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.0, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-41",
    name: "Ohio House District 41",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 41",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$80,900", sub: "" },
        { label: "College-Educated Adults",  value: "34.1%",  sub: "" },
        { label: "Median Age",               value: "41.5",   sub: "" },
        { label: "Renter Rate",              value: "23.8%",  sub: "" }
      ],
      dem: 61, rep: 39,
      partisanSub: "D 61.0% / R 39.0% in 2024. Erika White (D) won.",
      demos: [
        { label: "White", pct: 85.9, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 5.8, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 4.2, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 2.2, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-42",
    name: "Ohio House District 42",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 42",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$71,269", sub: "" },
        { label: "College-Educated Adults",  value: "32.2%",  sub: "" },
        { label: "Median Age",               value: "41.1",   sub: "" },
        { label: "Renter Rate",              value: "33.3%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Uncontested in 2024. Elgin Rogers Jr. (D) ran with no opponent.",
      demos: [
        { label: "White", pct: 78.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 11.4, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 8.4, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.5, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-43",
    name: "Ohio House District 43",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 43",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$59,031", sub: "" },
        { label: "College-Educated Adults",  value: "29.4%",  sub: "" },
        { label: "Median Age",               value: "35.9",   sub: "" },
        { label: "Renter Rate",              value: "43.3%",  sub: "" }
      ],
      dem: 60, rep: 40,
      partisanSub: "D 60.4% / R 39.6% in 2024. Michele Grim (D) won.",
      demos: [
        { label: "White", pct: 66.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 23.0, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 6.2, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.9, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-44",
    name: "Ohio House District 44",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 44",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$40,703", sub: "" },
        { label: "College-Educated Adults",  value: "16.3%",  sub: "" },
        { label: "Median Age",               value: "35.1",   sub: "" },
        { label: "Renter Rate",              value: "47.6%",  sub: "" }
      ],
      dem: 42, rep: 58,
      partisanSub: "D 42.3% / R 57.7% in 2024. Josh Williams (R) won.",
      demos: [
        { label: "White", pct: 51.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 34.9, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 10.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.2, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-45",
    name: "Ohio House District 45",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 45",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$95,275", sub: "" },
        { label: "College-Educated Adults",  value: "41.9%",  sub: "" },
        { label: "Median Age",               value: "38.7",   sub: "" },
        { label: "Renter Rate",              value: "27.0%",  sub: "" }
      ],
      dem: 38, rep: 62,
      partisanSub: "D 38.1% / R 61.9% in 2024. Jennifer Gross (R) won.",
      demos: [
        { label: "White", pct: 71.9, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 11.2, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 7.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 7.3, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-46",
    name: "Ohio House District 46",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 46",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$84,845", sub: "" },
        { label: "College-Educated Adults",  value: "32.2%",  sub: "" },
        { label: "Median Age",               value: "38.3",   sub: "" },
        { label: "Renter Rate",              value: "28.6%",  sub: "" }
      ],
      dem: 34, rep: 66,
      partisanSub: "D 33.7% / R 66.3% in 2024. Thomas Hall (R) won.",
      demos: [
        { label: "White", pct: 79.6, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 8.0, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 6.0, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 2.2, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-47",
    name: "Ohio House District 47",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 47",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$64,784", sub: "" },
        { label: "College-Educated Adults",  value: "24.6%",  sub: "" },
        { label: "Median Age",               value: "33.0",   sub: "" },
        { label: "Renter Rate",              value: "36.9%",  sub: "" }
      ],
      dem: 38, rep: 62,
      partisanSub: "D 38.4% / R 61.6% in 2024. Diane Mullins (R) won.",
      demos: [
        { label: "White", pct: 79.0, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 7.4, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 7.1, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 3.5, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-48",
    name: "Ohio House District 48",
    city: "Akron",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 48",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$75,990", sub: "" },
        { label: "College-Educated Adults",  value: "31.2%",  sub: "" },
        { label: "Median Age",               value: "42.3",   sub: "" },
        { label: "Renter Rate",              value: "27.4%",  sub: "" }
      ],
      dem: 31, rep: 69,
      partisanSub: "D 31.1% / R 68.9% in 2024. Scott Oelslager (R) won.",
      demos: [
        { label: "White", pct: 91.1, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 3.6, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 1.7, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-49",
    name: "Ohio House District 49",
    city: "Akron",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 49",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$52,213", sub: "" },
        { label: "College-Educated Adults",  value: "25.8%",  sub: "" },
        { label: "Median Age",               value: "39.4",   sub: "" },
        { label: "Renter Rate",              value: "43.7%",  sub: "" }
      ],
      dem: 48, rep: 52,
      partisanSub: "D 47.6% / R 52.4% in 2024. Jim Thomas (R) won.",
      demos: [
        { label: "White", pct: 71.4, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 16.6, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 5.2, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-50",
    name: "Ohio House District 50",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 50",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$66,807", sub: "" },
        { label: "College-Educated Adults",  value: "19.4%",  sub: "" },
        { label: "Median Age",               value: "43.3",   sub: "" },
        { label: "Renter Rate",              value: "25.1%",  sub: "" }
      ],
      dem: 33, rep: 67,
      partisanSub: "D 33.4% / R 66.6% in 2024. Matthew Kishman (R) won.",
      demos: [
        { label: "White", pct: 91.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 3.8, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 2.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-51",
    name: "Ohio House District 51",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 51",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$65,820", sub: "" },
        { label: "College-Educated Adults",  value: "18.9%",  sub: "" },
        { label: "Median Age",               value: "42.0",   sub: "" },
        { label: "Renter Rate",              value: "29.2%",  sub: "" }
      ],
      dem: 28, rep: 72,
      partisanSub: "D 27.5% / R 72.5% in 2024. Jodi Salvo (R) won.",
      demos: [
        { label: "White", pct: 94.8, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 3.7, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 0.7, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.3, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-52",
    name: "Ohio House District 52",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 52",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$71,852", sub: "" },
        { label: "College-Educated Adults",  value: "29.6%",  sub: "" },
        { label: "Median Age",               value: "40.7",   sub: "" },
        { label: "Renter Rate",              value: "25.8%",  sub: "" }
      ],
      dem: 43, rep: 57,
      partisanSub: "D 42.8% / R 57.2% in 2024. Gayle Manning (R) won.",
      demos: [
        { label: "White", pct: 80.5, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 8.2, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 7.6, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.7, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-53",
    name: "Ohio House District 53",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 53",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$64,536", sub: "" },
        { label: "College-Educated Adults",  value: "27.3%",  sub: "" },
        { label: "Median Age",               value: "41.5",   sub: "" },
        { label: "Renter Rate",              value: "31.8%",  sub: "" }
      ],
      dem: 56, rep: 44,
      partisanSub: "D 56.3% / R 43.7% in 2024. Joe Miller (D) won.",
      demos: [
        { label: "White", pct: 73.5, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 17.0, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 9.6, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.2, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-54",
    name: "Ohio House District 54",
    city: "Akron",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 54",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$76,496", sub: "" },
        { label: "College-Educated Adults",  value: "25.9%",  sub: "" },
        { label: "Median Age",               value: "45.3",   sub: "" },
        { label: "Renter Rate",              value: "20.1%",  sub: "" }
      ],
      dem: 34, rep: 66,
      partisanSub: "D 34.5% / R 65.5% in 2024. Kellie Deeter (R) won.",
      demos: [
        { label: "White", pct: 89.9, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 4.9, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 2.5, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-55",
    name: "Ohio House District 55",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 55",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$102,160", sub: "" },
        { label: "College-Educated Adults",  value: "38.1%",  sub: "" },
        { label: "Median Age",               value: "40.2",   sub: "" },
        { label: "Renter Rate",              value: "15.8%",  sub: "" }
      ],
      dem: 27, rep: 73,
      partisanSub: "D 27.5% / R 72.5% in 2024. C. Michelle Teska (R) won.",
      demos: [
        { label: "White", pct: 90.3, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 3.6, color: DEMO_COLORS[1] },
        { label: "Asian", pct: 2.4, color: DEMO_COLORS[2] },
        { label: "Black / African American", pct: 1.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-56",
    name: "Ohio House District 56",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 56",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$112,829", sub: "" },
        { label: "College-Educated Adults",  value: "52.9%",  sub: "" },
        { label: "Median Age",               value: "39.4",   sub: "" },
        { label: "Renter Rate",              value: "25.0%",  sub: "" }
      ],
      dem: 37, rep: 63,
      partisanSub: "D 37.4% / R 62.6% in 2024. Adam Mathews (R) won.",
      demos: [
        { label: "White", pct: 77.2, color: DEMO_COLORS[0] },
        { label: "Asian", pct: 11.2, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 5.1, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino", pct: 3.0, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-57",
    name: "Ohio House District 57",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 57",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$85,836", sub: "" },
        { label: "College-Educated Adults",  value: "30.8%",  sub: "" },
        { label: "Median Age",               value: "44.0",   sub: "" },
        { label: "Renter Rate",              value: "19.1%",  sub: "" }
      ],
      dem: 37, rep: 63,
      partisanSub: "D 37.4% / R 62.6% in 2024. Jamie Callender (R) won.",
      demos: [
        { label: "White", pct: 87.8, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 7.2, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 3.2, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.2, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-58",
    name: "Ohio House District 58",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 58",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$62,621", sub: "" },
        { label: "College-Educated Adults",  value: "29.7%",  sub: "" },
        { label: "Median Age",               value: "43.9",   sub: "" },
        { label: "Renter Rate",              value: "27.5%",  sub: "" }
      ],
      dem: 58, rep: 42,
      partisanSub: "D 58.0% / R 42.0% in 2024. Lauren McNally (D) won.",
      demos: [
        { label: "White", pct: 84.6, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 6.0, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 5.9, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-59",
    name: "Ohio House District 59",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 59",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$49,959", sub: "" },
        { label: "College-Educated Adults",  value: "21.7%",  sub: "" },
        { label: "Median Age",               value: "43.4",   sub: "" },
        { label: "Renter Rate",              value: "30.3%",  sub: "" }
      ],
      dem: 43, rep: 57,
      partisanSub: "D 42.9% / R 57.1% in 2024. Tex Fischer (R) won.",
      demos: [
        { label: "White", pct: 70.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 20.8, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 6.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-60",
    name: "Ohio House District 60",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 60",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$126,785", sub: "" },
        { label: "College-Educated Adults",  value: "55.2%",  sub: "" },
        { label: "Median Age",               value: "40.8",   sub: "" },
        { label: "Renter Rate",              value: "21.0%",  sub: "" }
      ],
      dem: 46, rep: 54,
      partisanSub: "D 45.8% / R 54.2% in 2024. Brian Lorenz (R) won.",
      demos: [
        { label: "White", pct: 83.3, color: DEMO_COLORS[0] },
        { label: "Asian", pct: 6.5, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 3.4, color: DEMO_COLORS[2] },
        { label: "Black / African American", pct: 2.8, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-61",
    name: "Ohio House District 61",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 61",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$122,085", sub: "" },
        { label: "College-Educated Adults",  value: "54.5%",  sub: "" },
        { label: "Median Age",               value: "39.1",   sub: "" },
        { label: "Renter Rate",              value: "21.4%",  sub: "" }
      ],
      dem: 38, rep: 62,
      partisanSub: "D 38.2% / R 61.8% in 2024. Beth Lear (R) won.",
      demos: [
        { label: "White", pct: 82.0, color: DEMO_COLORS[0] },
        { label: "Asian", pct: 7.8, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 4.8, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino", pct: 2.9, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-62",
    name: "Ohio House District 62",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 62",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$86,998", sub: "" },
        { label: "College-Educated Adults",  value: "36.9%",  sub: "" },
        { label: "Median Age",               value: "40.8",   sub: "" },
        { label: "Renter Rate",              value: "27.7%",  sub: "" }
      ],
      dem: 37, rep: 63,
      partisanSub: "D 36.5% / R 63.5% in 2024. Jean Schmidt (R) won.",
      demos: [
        { label: "White", pct: 91.4, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 2.8, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 1.7, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-63",
    name: "Ohio House District 63",
    city: "Cincinnati",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 63",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$76,261", sub: "" },
        { label: "College-Educated Adults",  value: "21.1%",  sub: "" },
        { label: "Median Age",               value: "41.0",   sub: "" },
        { label: "Renter Rate",              value: "24.7%",  sub: "" }
      ],
      dem: 25, rep: 75,
      partisanSub: "D 24.5% / R 75.5% in 2024. Adam C. Bird (R) won.",
      demos: [
        { label: "White", pct: 94.7, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 1.6, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 1.1, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-64",
    name: "Ohio House District 64",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 64",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$50,905", sub: "" },
        { label: "College-Educated Adults",  value: "21.4%",  sub: "" },
        { label: "Median Age",               value: "42.7",   sub: "" },
        { label: "Renter Rate",              value: "34.0%",  sub: "" }
      ],
      dem: 44, rep: 56,
      partisanSub: "D 43.8% / R 56.2% in 2024. Nick Santucci (R) won.",
      demos: [
        { label: "White", pct: 80.7, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 12.0, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 2.8, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.8, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-65",
    name: "Ohio House District 65",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 65",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$61,965", sub: "" },
        { label: "College-Educated Adults",  value: "17.6%",  sub: "" },
        { label: "Median Age",               value: "44.4",   sub: "" },
        { label: "Renter Rate",              value: "18.8%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Uncontested in 2024. David Thomas (R) ran with no opponent.",
      demos: [
        { label: "White", pct: 94.8, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 1.3, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 1.2, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.2, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-66",
    name: "Ohio House District 66",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 66",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$95,405", sub: "" },
        { label: "College-Educated Adults",  value: "40.2%",  sub: "" },
        { label: "Median Age",               value: "43.2",   sub: "" },
        { label: "Renter Rate",              value: "20.1%",  sub: "" }
      ],
      dem: 35, rep: 65,
      partisanSub: "D 34.6% / R 65.4% in 2024. Sharon A. Ray (R) won.",
      demos: [
        { label: "White", pct: 93.2, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 2.4, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 1.4, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.0, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-67",
    name: "Ohio House District 67",
    city: "Akron",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 67",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$77,295", sub: "" },
        { label: "College-Educated Adults",  value: "26.2%",  sub: "" },
        { label: "Median Age",               value: "42.4",   sub: "" },
        { label: "Renter Rate",              value: "20.4%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Uncontested in 2024. Melanie Miller (R) ran with no opponent.",
      demos: [
        { label: "White", pct: 93.2, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 2.5, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 1.2, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.8, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-68",
    name: "Ohio House District 68",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 68",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$74,914", sub: "" },
        { label: "College-Educated Adults",  value: "29.5%",  sub: "" },
        { label: "Median Age",               value: "40.2",   sub: "" },
        { label: "Renter Rate",              value: "31.4%",  sub: "" }
      ],
      dem: 41, rep: 59,
      partisanSub: "D 41.1% / R 58.9% in 2024. Thad Claggett (R) won.",
      demos: [
        { label: "White", pct: 88.1, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 2.9, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 2.5, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 2.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-69",
    name: "Ohio House District 69",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 69",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$86,989", sub: "" },
        { label: "College-Educated Adults",  value: "25.5%",  sub: "" },
        { label: "Median Age",               value: "40.9",   sub: "" },
        { label: "Renter Rate",              value: "16.4%",  sub: "" }
      ],
      dem: 23, rep: 77,
      partisanSub: "D 23.2% / R 76.8% in 2024. Kevin Miller (R) won.",
      demos: [
        { label: "White", pct: 89.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 3.8, color: DEMO_COLORS[1] },
        { label: "Asian", pct: 2.5, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino", pct: 1.8, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-70",
    name: "Ohio House District 70",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 70",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$94,388", sub: "" },
        { label: "College-Educated Adults",  value: "46.4%",  sub: "" },
        { label: "Median Age",               value: "38.7",   sub: "" },
        { label: "Renter Rate",              value: "33.3%",  sub: "" }
      ],
      dem: 38, rep: 62,
      partisanSub: "D 38.5% / R 61.5% in 2024. Brian Lampton (R) won.",
      demos: [
        { label: "White", pct: 82.5, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 4.7, color: DEMO_COLORS[1] },
        { label: "Asian", pct: 3.7, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino", pct: 3.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-71",
    name: "Ohio House District 71",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 71",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$70,099", sub: "" },
        { label: "College-Educated Adults",  value: "25.0%",  sub: "" },
        { label: "Median Age",               value: "41.1",   sub: "" },
        { label: "Renter Rate",              value: "27.6%",  sub: "" }
      ],
      dem: 30, rep: 70,
      partisanSub: "D 29.6% / R 70.4% in 2024. Levi P. Dean (R) won.",
      demos: [
        { label: "White", pct: 88.7, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 4.7, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 2.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.8, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-72",
    name: "Ohio House District 72",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 72",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$70,531", sub: "" },
        { label: "College-Educated Adults",  value: "34.5%",  sub: "" },
        { label: "Median Age",               value: "37.9",   sub: "" },
        { label: "Renter Rate",              value: "33.1%",  sub: "" }
      ],
      dem: 41, rep: 59,
      partisanSub: "D 41.3% / R 58.7% in 2024. Heidi Workman (R) won.",
      demos: [
        { label: "White", pct: 85.8, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 5.8, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 2.6, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 2.0, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-73",
    name: "Ohio House District 73",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 73",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$86,628", sub: "" },
        { label: "College-Educated Adults",  value: "34.0%",  sub: "" },
        { label: "Median Age",               value: "39.0",   sub: "" },
        { label: "Renter Rate",              value: "28.7%",  sub: "" }
      ],
      dem: 39, rep: 61,
      partisanSub: "D 39.0% / R 61.0% in 2024. Jeff LaRe (R) won.",
      demos: [
        { label: "White", pct: 79.8, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 10.7, color: DEMO_COLORS[1] },
        { label: "Asian", pct: 3.2, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino", pct: 2.9, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-74",
    name: "Ohio House District 74",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 74",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$57,698", sub: "" },
        { label: "College-Educated Adults",  value: "17.7%",  sub: "" },
        { label: "Median Age",               value: "40.2",   sub: "" },
        { label: "Renter Rate",              value: "33.2%",  sub: "" }
      ],
      dem: 36, rep: 64,
      partisanSub: "D 35.8% / R 64.2% in 2024. Bernard Willis (R) won.",
      demos: [
        { label: "White", pct: 81.8, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 9.5, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 4.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-75",
    name: "Ohio House District 75",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 75",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$73,315", sub: "" },
        { label: "College-Educated Adults",  value: "39.4%",  sub: "" },
        { label: "Median Age",               value: "34.8",   sub: "" },
        { label: "Renter Rate",              value: "37.6%",  sub: "" }
      ],
      dem: 41, rep: 59,
      partisanSub: "D 40.6% / R 59.4% in 2024. Haraz N. Ghanbari (R) won.",
      demos: [
        { label: "White", pct: 87.8, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 6.2, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 2.2, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 2.1, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-76",
    name: "Ohio House District 76",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 76",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$57,649", sub: "" },
        { label: "College-Educated Adults",  value: "17.9%",  sub: "" },
        { label: "Median Age",               value: "40.9",   sub: "" },
        { label: "Renter Rate",              value: "31.5%",  sub: "" }
      ],
      dem: 28, rep: 72,
      partisanSub: "D 28.1% / R 71.9% in 2024. Marilyn S. John (R) won.",
      demos: [
        { label: "White", pct: 85.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 7.4, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 2.2, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.9, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-77",
    name: "Ohio House District 77",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 77",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$71,769", sub: "" },
        { label: "College-Educated Adults",  value: "24.7%",  sub: "" },
        { label: "Median Age",               value: "38.9",   sub: "" },
        { label: "Renter Rate",              value: "23.9%",  sub: "" }
      ],
      dem: 31, rep: 69,
      partisanSub: "D 30.7% / R 69.3% in 2024. Meredith Craig (R) won.",
      demos: [
        { label: "White", pct: 93.2, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 2.4, color: DEMO_COLORS[1] },
        { label: "Asian", pct: 1.2, color: DEMO_COLORS[2] },
        { label: "Black / African American", pct: 1.2, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-78",
    name: "Ohio House District 78",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 78",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$63,938", sub: "" },
        { label: "College-Educated Adults",  value: "19.7%",  sub: "" },
        { label: "Median Age",               value: "39.9",   sub: "" },
        { label: "Renter Rate",              value: "30.2%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Uncontested in 2024. Matt Huffman (R) ran with no opponent.",
      demos: [
        { label: "White", pct: 82.4, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 9.7, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 3.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.8, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-79",
    name: "Ohio House District 79",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 79",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$58,803", sub: "" },
        { label: "College-Educated Adults",  value: "15.6%",  sub: "" },
        { label: "Median Age",               value: "44.4",   sub: "" },
        { label: "Renter Rate",              value: "27.3%",  sub: "" }
      ],
      dem: 25, rep: 75,
      partisanSub: "D 25.4% / R 74.6% in 2024. Monica Robb Blasdel (R) won.",
      demos: [
        { label: "White", pct: 93.2, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 1.9, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 1.9, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-80",
    name: "Ohio House District 80",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 80",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$73,774", sub: "" },
        { label: "College-Educated Adults",  value: "23.9%",  sub: "" },
        { label: "Median Age",               value: "41.3",   sub: "" },
        { label: "Renter Rate",              value: "26.0%",  sub: "" }
      ],
      dem: 25, rep: 75,
      partisanSub: "D 25.1% / R 74.9% in 2024. Johnathan Newman (R) won.",
      demos: [
        { label: "White", pct: 91.7, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 2.0, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 1.8, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-81",
    name: "Ohio House District 81",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 81",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$70,880", sub: "" },
        { label: "College-Educated Adults",  value: "17.4%",  sub: "" },
        { label: "Median Age",               value: "41.5",   sub: "" },
        { label: "Renter Rate",              value: "20.1%",  sub: "" }
      ],
      dem: 23, rep: 77,
      partisanSub: "D 23.0% / R 77.0% in 2024. James M. Hoops (R) won.",
      demos: [
        { label: "White", pct: 91.2, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 7.2, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 0.7, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-82",
    name: "Ohio House District 82",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 82",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$72,051", sub: "" },
        { label: "College-Educated Adults",  value: "20.3%",  sub: "" },
        { label: "Median Age",               value: "41.1",   sub: "" },
        { label: "Renter Rate",              value: "19.1%",  sub: "" }
      ],
      dem: 21, rep: 79,
      partisanSub: "D 20.6% / R 79.4% in 2024. Roy W. Klopfenstein (R) won.",
      demos: [
        { label: "White", pct: 91.1, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 7.4, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 1.1, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.3, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-83",
    name: "Ohio House District 83",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 83",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$65,061", sub: "" },
        { label: "College-Educated Adults",  value: "25.8%",  sub: "" },
        { label: "Median Age",               value: "39.7",   sub: "" },
        { label: "Renter Rate",              value: "27.6%",  sub: "" }
      ],
      dem: 25, rep: 75,
      partisanSub: "D 24.9% / R 75.1% in 2024. Ty Mathews (R) won.",
      demos: [
        { label: "White", pct: 91.4, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 4.5, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 1.5, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.5, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-84",
    name: "Ohio House District 84",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 84",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$71,305", sub: "" },
        { label: "College-Educated Adults",  value: "20.3%",  sub: "" },
        { label: "Median Age",               value: "40.4",   sub: "" },
        { label: "Renter Rate",              value: "25.6%",  sub: "" }
      ],
      dem: 16, rep: 84,
      partisanSub: "D 15.7% / R 84.3% in 2024. Angie King (R) won.",
      demos: [
        { label: "White", pct: 95.3, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 2.0, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 0.7, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-85",
    name: "Ohio House District 85",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 85",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$73,207", sub: "" },
        { label: "College-Educated Adults",  value: "19.4%",  sub: "" },
        { label: "Median Age",               value: "40.6",   sub: "" },
        { label: "Renter Rate",              value: "25.4%",  sub: "" }
      ],
      dem: 20, rep: 80,
      partisanSub: "D 19.9% / R 80.1% in 2024. Tim Barhorst (R) won.",
      demos: [
        { label: "White", pct: 92.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 2.0, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 1.9, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.7, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-86",
    name: "Ohio House District 86",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 86",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$79,228", sub: "" },
        { label: "College-Educated Adults",  value: "27.6%",  sub: "" },
        { label: "Median Age",               value: "38.7",   sub: "" },
        { label: "Renter Rate",              value: "28.6%",  sub: "" }
      ],
      dem: 31, rep: 69,
      partisanSub: "D 31.1% / R 68.9% in 2024. Tracy Richardson (R) won.",
      demos: [
        { label: "White", pct: 86.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 4.3, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 3.2, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 3.1, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-87",
    name: "Ohio House District 87",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 87",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$67,040", sub: "" },
        { label: "College-Educated Adults",  value: "17.4%",  sub: "" },
        { label: "Median Age",               value: "43.4",   sub: "" },
        { label: "Renter Rate",              value: "23.2%",  sub: "" }
      ],
      dem: 24, rep: 76,
      partisanSub: "D 23.5% / R 76.5% in 2024. Riordan T. McClain (R) won.",
      demos: [
        { label: "White", pct: 95.3, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 2.0, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 0.5, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-88",
    name: "Ohio House District 88",
    city: "Toledo",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 88",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$63,770", sub: "" },
        { label: "College-Educated Adults",  value: "19.9%",  sub: "" },
        { label: "Median Age",               value: "41.5",   sub: "" },
        { label: "Renter Rate",              value: "26.1%",  sub: "" }
      ],
      dem: 33, rep: 67,
      partisanSub: "D 33.4% / R 66.6% in 2024. Gary Click (R) won.",
      demos: [
        { label: "White", pct: 88.0, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 8.2, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 3.0, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.5, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-89",
    name: "Ohio House District 89",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 89",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$66,007", sub: "" },
        { label: "College-Educated Adults",  value: "23.9%",  sub: "" },
        { label: "Median Age",               value: "44.9",   sub: "" },
        { label: "Renter Rate",              value: "26.3%",  sub: "" }
      ],
      dem: 41, rep: 59,
      partisanSub: "D 41.3% / R 58.7% in 2024. D.J. Swearingen (R) won.",
      demos: [
        { label: "White", pct: 85.8, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 6.0, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 5.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.7, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-90",
    name: "Ohio House District 90",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 90",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$51,565", sub: "" },
        { label: "College-Educated Adults",  value: "16.9%",  sub: "" },
        { label: "Median Age",               value: "41.3",   sub: "" },
        { label: "Renter Rate",              value: "29.6%",  sub: "" }
      ],
      dem: 23, rep: 77,
      partisanSub: "D 23.2% / R 76.8% in 2024. Justin Pizzulli (R) won.",
      demos: [
        { label: "White", pct: 94.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 1.8, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 1.4, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-91",
    name: "Ohio House District 91",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 91",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$58,793", sub: "" },
        { label: "College-Educated Adults",  value: "14.9%",  sub: "" },
        { label: "Median Age",               value: "40.9",   sub: "" },
        { label: "Renter Rate",              value: "31.1%",  sub: "" }
      ],
      dem: 20, rep: 80,
      partisanSub: "D 20.3% / R 79.7% in 2024. Bob Peterson (R) won.",
      demos: [
        { label: "White", pct: 94.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 1.5, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 1.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.3, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-92",
    name: "Ohio House District 92",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 92",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$58,791", sub: "" },
        { label: "College-Educated Adults",  value: "15.7%",  sub: "" },
        { label: "Median Age",               value: "41.6",   sub: "" },
        { label: "Renter Rate",              value: "27.2%",  sub: "" }
      ],
      dem: 28, rep: 72,
      partisanSub: "D 28.4% / R 71.6% in 2024. Mark Johnson (R) won.",
      demos: [
        { label: "White", pct: 91.2, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 3.6, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 1.2, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-93",
    name: "Ohio House District 93",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 93",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$56,158", sub: "" },
        { label: "College-Educated Adults",  value: "17.9%",  sub: "" },
        { label: "Median Age",               value: "41.2",   sub: "" },
        { label: "Renter Rate",              value: "26.3%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Uncontested in 2024. Jason Stephens (R) ran with no opponent.",
      demos: [
        { label: "White", pct: 94.2, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 1.6, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 1.0, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-94",
    name: "Ohio House District 94",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 94",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$53,247", sub: "" },
        { label: "College-Educated Adults",  value: "24.9%",  sub: "" },
        { label: "Median Age",               value: "38.5",   sub: "" },
        { label: "Renter Rate",              value: "31.2%",  sub: "" }
      ],
      dem: 31, rep: 69,
      partisanSub: "D 30.6% / R 69.4% in 2024. Kevin Ritter (R) won.",
      demos: [
        { label: "White", pct: 92.5, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 2.0, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 1.7, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 1.3, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-95",
    name: "Ohio House District 95",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 95",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$61,069", sub: "" },
        { label: "College-Educated Adults",  value: "18.6%",  sub: "" },
        { label: "Median Age",               value: "44.5",   sub: "" },
        { label: "Renter Rate",              value: "23.1%",  sub: "" }
      ],
      dem: 33, rep: 67,
      partisanSub: "D 32.7% / R 67.3% in 2024. Don Jones (R) won.",
      demos: [
        { label: "White", pct: 93.7, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 2.2, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 1.4, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.4, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-96",
    name: "Ohio House District 96",
    city: "Cleveland",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 96",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$55,508", sub: "" },
        { label: "College-Educated Adults",  value: "18.2%",  sub: "" },
        { label: "Median Age",               value: "44.6",   sub: "" },
        { label: "Renter Rate",              value: "26.8%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Uncontested in 2024. Ron Ferguson (R) ran with no opponent.",
      demos: [
        { label: "White", pct: 90.9, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 4.0, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 1.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.6, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-97",
    name: "Ohio House District 97",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 97",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$57,285", sub: "" },
        { label: "College-Educated Adults",  value: "19.1%",  sub: "" },
        { label: "Median Age",               value: "40.6",   sub: "" },
        { label: "Renter Rate",              value: "31.7%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Adam P. Holmes (R) ran without a Democratic opponent in 2024.",
      demos: [
        { label: "White", pct: 91.5, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 2.9, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino", pct: 1.3, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.5, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-98",
    name: "Ohio House District 98",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 98",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$65,126", sub: "" },
        { label: "College-Educated Adults",  value: "17.7%",  sub: "" },
        { label: "Median Age",               value: "37.3",   sub: "" },
        { label: "Renter Rate",              value: "26.2%",  sub: "" }
      ],
      dem: 25, rep: 75,
      partisanSub: "D 24.5% / R 75.5% in 2024. Mark Hiner (R) won.",
      demos: [
        { label: "White", pct: 95.3, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 1.3, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 0.7, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.5, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  },
  {
    id: "oh-hd-99",
    name: "Ohio House District 99",
    city: "Columbus",
    region: "TBD",
    type: "state house district",
    incumbentName: "TBD",
    incumbentParty: "TBD",
    nextElection: "TBD",
    seatStatus: "TBD",
    dashboard: {
      subtitle: "Ohio House District 99",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$71,708", sub: "" },
        { label: "College-Educated Adults",  value: "26.8%",  sub: "" },
        { label: "Median Age",               value: "44.7",   sub: "" },
        { label: "Renter Rate",              value: "21.8%",  sub: "" }
      ],
      dem: 35, rep: 65,
      partisanSub: "D 35.5% / R 64.5% in 2024. Sarah Fowler Arthur (R) won.",
      demos: [
        { label: "White", pct: 89.9, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino", pct: 4.2, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct: 3.1, color: DEMO_COLORS[2] },
        { label: "Asian", pct: 0.5, color: DEMO_COLORS[3] }
      ],
      issues: [],
      memoHeadline: "TBD",
      memoParagraphs: ["TBD"],
      memoBullets: ["TBD"]
    }
  }

];
