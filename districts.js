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
    region: "Columbus Near East Side / South Linden",
    type: "state house district",
    incumbentName: "Dontavius Jarrells",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 58% renters in a Columbus urban district with rapid rent growth, housing cost burden is the defining daily concern. Turnout in HD-1 depends on residents believing their representative is fighting for them on the most immediate economic issue in their lives." },
        { name: "Economic Opportunity & Wage Growth", tag: "lean-into", why: "A median income of $57K with a multiracial working-class base means economic mobility — workforce investment, wage floors, job access — is a unifying frame across Black, white, and Hispanic communities in the district." },
        { name: "Coalition Turnout Across All Communities", tag: "lean-into", why: "At nearly 50% white, 37% Black, and 7% Hispanic, this is a genuinely multiracial district where no single community delivers the majority alone. Broad coalition turnout — not just Black community GOTV — is what keeps this seat safe and what builds the margin that matters for statewide races." },
        { name: "Public Safety", tag: "careful", why: "Safety concerns are real across all racial groups in this district but carry different valences. Lead with community investment, mental health resources, and accountability structures rather than enforcement headcount. Do not cede the issue — own a community-investment frame." },
        { name: "Candidate or Officeholder Complacency", tag: "avoid", why: "Uncontested seats produce lower turnout. An incumbent who treats HD-1 as a lock without active constituent engagement will see declining participation — which weakens the district's weight in every statewide race and every Columbus-wide coalition." }
      ],
      memoHeadline: "Safe D — but turnout is the only variable, and coalition breadth is the margin that matters beyond this district.",
      memoParagraphs: [
        "HD-1 is a safe Democratic seat that Dontavius Jarrells held uncontested in 2024. At 58% renters, 37% Black, and nearly 50% white in a young Columbus urban district, the electoral math is not in question — the strategic question is how high turnout can be driven and how broadly the coalition can be mobilized for the battles that matter beyond HD-1 itself.",
        "Housing is the unifying issue. In a district where 58% of residents rent and Columbus's housing market has placed sustained upward pressure on rents, the incumbent's record on tenant protections, housing investment, and affordability legislation is the primary tool for maintaining high constituency engagement. Voters in HD-1 should be able to name specific things their representative has done for them.",
        "The Hispanic community at 7% is the underutilized growth variable. Sustained Spanish-language outreach and voter registration investment in HD-1's Hispanic neighborhoods builds coalition depth that pays dividends in presidential cycles and in the districts that surround HD-1."
      ],
      memoBullets: [
        "Hold regular constituent events focused on housing — town halls at apartment complexes, renter rights workshops, direct engagement with landlord accountability issues. This is the issue that keeps voters connected to their representative.",
        "Invest in Spanish-language outreach and Hispanic voter registration. At 7%, this community has room to grow its electoral footprint meaningfully over two cycles.",
        "Partner with civic organizations in Black communities to sustain GOTV infrastructure year-round, not just in October. The turnout floor in HD-1 sets the ceiling for every Democrat running countywide or statewide."
      ]
    }
  },
  {
    id: "oh-hd-2",
    name: "Ohio House District 2",
    city: "Columbus",
    region: "Columbus South Side (Franklinton / Hilltop)",
    type: "state house district",
    incumbentName: "Latyna M. Humphrey",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 55.5% renters in a majority-Black Columbus district with $57K median income, housing cost burden is the most acute and personal policy concern. The incumbent's record on tenant protections, housing investment, and anti-displacement policy is the primary engagement tool with this constituency." },
        { name: "Economic Mobility & Workforce Investment", tag: "lean-into", why: "At 20.6% college attainment with a working-class income base, economic mobility — job training, wage growth, access to good jobs — is a central concern for the majority-Black working-class households that make up the core of this district. Concrete workforce and wage policy wins are the most relevant constituent service." },
        { name: "Black Community Turnout Infrastructure", tag: "lean-into", why: "HD-2 is a majority-Black safe D seat where turnout determines the district's weight in every Franklin County and statewide race. Year-round Black civic infrastructure — not just pre-election GOTV — is the strategic investment that makes this seat a reliable asset rather than a variable." },
        { name: "Hispanic & Asian Community Engagement", tag: "careful", why: "At 8% Hispanic and 3.2% Asian, these communities are growing contributors to the district's coalition. Outreach should be genuine and ongoing — not performative election-season gestures. Spanish-language communication and culturally specific engagement are the baseline expectation." },
        { name: "Neglecting Non-Election-Year Constituent Service", tag: "avoid", why: "Uncontested D seats are at risk of low turnout when voters do not feel connected to their representative between elections. Sustained constituent engagement — housing clinics, economic resource fairs, accessible office hours — is not optional for maintaining the turnout floor this district requires." }
      ],
      memoHeadline: "Majority-Black, 55% renters, uncontested — the seat is safe, but the community's investment in it isn't automatic. Earn it year-round.",
      memoParagraphs: [
        "HD-2 is a majority-Black Columbus seat that Latyna Humphrey held without a Republican opponent in 2024. At 55.5% renters and $57K median income, this is a working-class majority-Black district where housing affordability and economic mobility are daily concerns that the incumbent must visibly address to maintain constituency trust and turnout.",
        "The strategic imperative in a safe uncontested seat is not winning — it is maintaining the turnout floor that makes HD-2 a reliable asset in statewide and countywide races. Black voter turnout in Franklin County's urban core seats directly affects every Democrat running in central Ohio. An engaged, well-organized HD-2 base is a force multiplier beyond the district's boundaries.",
        "The Hispanic community at 8% is a meaningful and growing part of the coalition. Spanish-language outreach, community events, and accessible constituent services for Hispanic households in HD-2 build the kind of loyalty that sustains high turnout across cycles."
      ],
      memoBullets: [
        "Housing is the top constituent service priority. Hold renter rights workshops, connect residents to anti-displacement resources, and make the incumbent's legislative record on housing tangible and visible to people who are actually experiencing rent pressure.",
        "Invest in year-round Black civic infrastructure — community events, local partnerships, and accessible office hours that sustain engagement between election cycles. GOTV should be the harvest of ongoing work, not a cold-start operation.",
        "Spanish-language outreach and culturally specific engagement for the 8% Hispanic community should be a budget line item, not an afterthought. This community's turnout growth is the district's most accessible upside variable."
      ]
    }
  },
  {
    id: "oh-hd-3",
    name: "Ohio House District 3",
    city: "Columbus",
    region: "Columbus Urban Core",
    type: "state house district",
    incumbentName: "Ismail Mohamed",
    incumbentParty: "Democrat",
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
    region: "Columbus Northwest Suburbs (Worthington / Clintonville)",
    type: "state house district",
    incumbentName: "Beryl Brown Piccolantonio",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Reproductive Rights", tag: "lean-into", why: "At $109K median income and 57% college-educated, HD-4 is a high-income Columbus suburb where reproductive rights are the most powerful mobilizing and persuasion issue available. The 57-43 margin was built substantially on this issue in 2024. Don't soften it in 2026 — it is what moved this seat and what keeps it Democratic." },
        { name: "Education Quality & Funding", tag: "lean-into", why: "At 57% college attainment with a professional-class electorate and significant family demographic, public school quality and state education funding are primary concerns. The incumbent's record on education investment is a concrete and values-resonant contrast with the Republican position on school funding and school choice." },
        { name: "Asian & Black Community Outreach", tag: "lean-into", why: "At 5.6% Asian and 13.4% Black in a 57-43 seat, minority communities are not decorative — they are part of the margin. Asian American outreach in particular is underinvested relative to its electoral importance. Sustained, community-specific engagement with both communities is a hold-the-seat priority." },
        { name: "Economic Populism / Class Conflict", tag: "avoid", why: "At $109K median income and 57% college, this is a professional-class district. Wealth-redistribution or anti-elite framing will alienate the persuadable moderate Republicans and independents the incumbent needs to hold the 57-43 margin. Values, rights, and governance quality are the credible frames." },
        { name: "Complacency at 57-43", tag: "avoid", why: "A 57-43 margin in a high-income suburban district is not safe — it is competitive. Republican infrastructure in comparable Columbus suburbs will be working to close this gap in 2026. The incumbent must run a full campaign with active constituent engagement and a sharp issue contrast, not a maintenance operation." }
      ],
      memoHeadline: "57-43 in a $109K, 57%-college Columbus suburb. Reproductive rights built this margin — protect it with a full campaign, not a maintenance operation.",
      memoParagraphs: [
        "HD-4 is a high-income Columbus suburb that Beryl Brown Piccolantonio held 57-43 in 2024. At $109K median income and 57% college-educated, this is a professional-class district where the Democratic margin was built on the college-educated swing toward Democrats on reproductive rights and education — and where that margin is not structurally locked in.",
        "The 43% Republican performance in 2024 means this seat will be a target in 2026. Republican infrastructure will recruit a credible challenger and invest in closing the gap. The incumbent must run a full campaign: active constituent engagement, a sharp reproductive rights and education contrast, and sustained outreach to the Black and Asian communities that are part of the winning coalition.",
        "Asian American outreach at 5.6% is the most underinvested coalition element in HD-4. These voters are often well-educated, high-turnout, and responsive to education and rights-based messaging — exactly the HD-4 profile. A dedicated Asian American community engagement effort is a low-cost, high-upside hold-the-seat investment."
      ],
      memoBullets: [
        "Run a full campaign. HD-4 is not safe at 57-43 in an environment where Republicans are targeting suburban Columbus seats. Treat every cycle as competitive.",
        "Reproductive rights and education quality are the two-issue platform. Pull the opponent's record and make the contrast explicit. These are the issues that moved this seat and that keep it Democratic.",
        "Invest specifically in Asian American community outreach — community events, culturally specific communication, and direct engagement with Asian American civic organizations in the district. This community's turnout and loyalty is part of the margin.",
        "Sustain Black community engagement year-round. At 13.4%, the Black vote is a meaningful contributor to the 57-43 result. It should not be taken for granted."
      ]
    }
  },
  {
    id: "oh-hd-5",
    name: "Ohio House District 5",
    city: "Columbus",
    region: "Columbus East Side / Near Northeast",
    type: "state house district",
    incumbentName: "Meredith Lawson-Rowe",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 32.7% renters and $74K median income in a diverse Columbus district, housing affordability is a live concern for a significant share of households. The incumbent's record on tenant protections and housing investment is the most direct constituent engagement tool in a district where 23% of residents are Black and housing stability is unevenly distributed." },
        { name: "Black Community Turnout & Engagement", tag: "lean-into", why: "At 22.9% Black in a safe D Columbus seat, the Black community is the coalition anchor. Year-round civic infrastructure — not just pre-election GOTV — sustains the turnout floor that makes HD-5 a reliable asset for Franklin County and statewide Democrats. This community's engagement should be earned continuously, not assumed." },
        { name: "Economic Opportunity & Wages", tag: "lean-into", why: "At $74K median income and 28.7% college in a majority-white but significantly Black and Hispanic district, economic opportunity — workforce investment, wage growth, job access — is a cross-community unifying frame. Concrete wins on these issues are the most credible form of constituent service." },
        { name: "Hispanic Community Outreach", tag: "careful", why: "At 6% Hispanic in a safe D seat, the Hispanic community is often underinvested relative to its coalition value. Spanish-language outreach, community events, and accessible constituent services are the baseline expectation for a district with this demographic composition." },
        { name: "Complacency in an Uncontested Seat", tag: "avoid", why: "An uncontested seat is not a permanently safe seat. Republican recruitment in 2026 could change the competitive landscape. More immediately, low turnout in a safe seat weakens the district's contribution to Franklin County margins. Active constituency engagement is the insurance policy against both risks." }
      ],
      memoHeadline: "Uncontested and diverse — the work here is coalition maintenance and turnout depth, not electoral strategy.",
      memoParagraphs: [
        "HD-5 is a safe Democratic Columbus seat that Meredith Lawson-Rowe held uncontested in 2024. At 63.7% white, 22.9% Black, and 6% Hispanic with $74K median income and 32.7% renters, this is a diverse working-to-middle-class district where the Democratic coalition is structurally sound but requires consistent investment to sustain high turnout.",
        "The Black community at 22.9% is the coalition anchor. In a district this size, Black voter turnout directly affects Franklin County margins and the broader Columbus Democratic infrastructure. Year-round constituent engagement — not just October mobilization — is what keeps this community invested in state-level politics and in the incumbent's work specifically.",
        "Housing and economic opportunity are the two issues that unify the district's diversity. At 32.7% renters with a mixed-income population, housing cost burden affects multiple communities simultaneously. A visible legislative record on affordable housing, tenant protections, and wage growth is the most coherent multiracial organizing frame available."
      ],
      memoBullets: [
        "Hold regular constituent events in Black neighborhoods — housing resources, economic opportunity information, accessible office hours. This community's engagement is the district's turnout foundation.",
        "Spanish-language outreach and community-specific events for the 6% Hispanic community should be an ongoing budget commitment, not an election-year add-on.",
        "Housing affordability is the cross-community legislative priority. Make the incumbent's record on this issue tangible and visible — specific developments, specific votes, specific protections — so voters can connect representation to real outcomes."
      ]
    }
  },
  {
    id: "oh-hd-6",
    name: "Ohio House District 6",
    city: "Columbus",
    region: "Columbus Near Westside / Hilltop",
    type: "state house district",
    incumbentName: "Christine Cockley",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Hispanic Community Engagement & GOTV", tag: "lean-into", why: "At 13% Hispanic — one of the highest rates of any Columbus D seat — HD-6 has a substantial Latino community that is central to the 60-40 margin. The 40% Republican performance means this margin must be actively maintained. Spanish-language outreach, community-specific events, and culturally rooted constituent services are not optional — they are the difference between 60-40 and something worse." },
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 47% renters and $68K median income in one of Columbus's younger districts (median age 33.6), housing affordability is the most acute and widely shared concern. A visible legislative record on tenant protections, anti-displacement policy, and housing investment is the primary tool for sustaining engagement across all of HD-6's communities." },
        { name: "Reproductive Rights", tag: "lean-into", why: "At 60-40 in a Columbus district with a young median age and significant college-educated population, reproductive rights are a genuine mobilizing issue. The 40% Republican baseline means the incumbent cannot assume complacency — this issue should be in the active message mix in 2026." },
        { name: "Coalition Siloing", tag: "avoid", why: "With four meaningful communities — white, Black, Hispanic, and Asian — there is a temptation to run separate, targeted messages for each group. This fractures the coalition's sense of shared purpose. Lead with unifying economic and rights issues that speak across communities, and layer in community-specific outreach rather than substituting it for the common frame." },
        { name: "Taking the 60-40 Margin for Granted", tag: "avoid", why: "Sixty percent in a D-held Columbus seat is a strong but not comfortable margin when the opponent hit 40%. A credible 2026 challenger with a local identity could tighten this to 55-45 or worse in an off-year cycle. Run a full campaign, not a maintenance operation." }
      ],
      memoHeadline: "60-40 with 13% Hispanic and 47% renters — the coalition is real but requires active, year-round investment to hold and grow.",
      memoParagraphs: [
        "HD-6 is a Columbus D-held seat that Christine Cockley won 60-40 in 2024. At 47% renters, 13% Hispanic, 16% Black, and median age 33.6, this is one of the younger, more renter-heavy, and more Latino districts in the Columbus Democratic family. The 40% Republican performance is a reminder that this seat requires active work, not passive incumbency.",
        "The Hispanic community at 13% is the margin variable that is most susceptible to neglect. Latino voter registration and turnout in Columbus urban seats is consistently below the community's population share. In a 60-40 seat, a 3-4 point drop in Hispanic turnout or loyalty could meaningfully change the outcome. Sustained Spanish-language outreach, community events, and culturally specific constituent services are the insurance policy.",
        "Housing affordability is the cross-community unifying issue. At 47% renters in a young Columbus district, virtually every community in HD-6 shares exposure to rent increases, displacement pressure, and inadequate housing stock. A visible and specific legislative record on these issues sustains the coalition's investment in the incumbent between elections."
      ],
      memoBullets: [
        "Spanish-language outreach is a hold-the-seat priority, not a nice-to-have. Budget for bilingual canvassers, Spanish-language mail, and community-specific events in Hispanic neighborhoods from the start of the campaign year.",
        "Housing affordability is the top legislative and constituent service priority. Make the record specific and visible: named developments, named protections, named votes. Residents should be able to connect Cockley's work directly to their housing situation.",
        "Reproductive rights belong in the active message mix in 2026. The 40% Republican baseline and younger electorate mean this issue is both a mobilizer and a persuasion tool in HD-6.",
        "Do not run separate siloed messages for each community. Lead with housing and rights across all communities, then layer in specific community engagement. Shared purpose is what sustains a multiracial coalition across off-year cycles."
      ]
    }
  },
  {
    id: "oh-hd-7",
    name: "Ohio House District 7",
    city: "Columbus",
    region: "Columbus University District / Short North",
    type: "state house district",
    incumbentName: "Allison Russo",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Reproductive Rights & Bodily Autonomy", tag: "lean-into", why: "At 72.6% college-educated — the highest of any district in the entire dataset — HD-7 is the most education-saturated district in Ohio. Reproductive rights are a primary mobilizing issue for this highly educated, younger electorate (median age 29.7). The incumbent's record and active advocacy on this issue is the most direct connection to what this community cares about most." },
        { name: "Education Policy & Academic Freedom", tag: "lean-into", why: "In a district anchored by Ohio State University and the Columbus university corridor, education policy — funding, academic freedom, and institutional autonomy — is both a personal and professional concern for a majority of residents. State legislative interference in higher education is a live and activating issue for this electorate." },
        { name: "Housing Affordability for Young Renters", tag: "lean-into", why: "At 52.4% renters and median age 29.7, this is a district of young, educated renters in a Columbus housing market under sustained price pressure. Affordability — for graduate students, young professionals, and academic staff — is an immediate and personal concern that gives the incumbent a concrete and relatable legislative priority." },
        { name: "Asian Community Engagement", tag: "careful", why: "At 8.6% Asian — among the highest for any Columbus D district — the Asian American community is a meaningful and growing part of the HD-7 coalition. This community is often underregistered relative to its population share. Sustained, culturally specific engagement is both the right thing and a force multiplier for turnout in a high-education district." },
        { name: "Preaching Only to the Choir", tag: "avoid", why: "A 72.6%-college, uncontested D seat can become an echo chamber. The strategic value of HD-7 beyond its own borders — its high-education voters showing up for statewide races, its civic infrastructure serving the broader Columbus coalition — requires the incumbent to stay connected to voters across the district, not just the most politically engaged." }
      ],
      memoHeadline: "The most educated district in Ohio. Turnout here sets the ceiling for the Columbus Democratic coalition — and for statewide races.",
      memoParagraphs: [
        "HD-7 is Ohio's most highly educated legislative district at 72.6% college-educated. Allison Russo held it uncontested in 2024. With a 29.7-year median age and 52.4% renter rate in the Ohio State University and Columbus university corridor, this is a district of young, highly educated renters for whom reproductive rights, education policy, and housing affordability are primary motivating concerns.",
        "The strategic value of HD-7 extends far beyond its boundaries. High-education, high-turnout Columbus precincts are a critical resource for every statewide Democratic race. The incumbent's job is not just to represent constituents — it is to sustain the turnout infrastructure and civic engagement that makes this district a reliable asset for the broader Ohio Democratic project.",
        "The Asian American community at 8.6% is the most underutilized coalition element in HD-7. These voters are often highly educated, high-propensity, and responsive to education and rights-based messaging. A dedicated Asian American community engagement effort — community events, culturally specific outreach, sustained relationships with Asian American civic organizations — is a high-upside investment for an incumbent in this seat."
      ],
      memoBullets: [
        "Reproductive rights and education policy are the two issues this electorate cares about most. Be specific: name the Statehouse bills, name the opponents, name what the incumbent has done and will do. Educated voters do their own research — give them something concrete to work with.",
        "Invest in Asian American community outreach as a sustained program, not an election-year initiative. At 8.6%, this community's full engagement would be a meaningful turnout boost.",
        "Housing affordability for young renters is the third pillar. Graduate students, young professionals, and academic staff are experiencing real cost pressure. Connect the incumbent's record to what renters in the university corridor actually experience.",
        "Sustain year-round civic engagement. The high-education voters in HD-7 are civic assets for the entire Ohio Democratic coalition. Keep them connected, informed, and mobilized between elections."
      ]
    }
  },
  {
    id: "oh-hd-8",
    name: "Ohio House District 8",
    city: "Columbus",
    region: "Columbus Suburbs",
    type: "state house district",
    incumbentName: "Somani",
    incumbentParty: "Democrat",
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
    region: "Columbus Near East Side (Linden / Milo-Grogan)",
    type: "state house district",
    incumbentName: "Munira Yasin Abdullahi",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Anti-Displacement", tag: "lean-into", why: "At 51.7% renters and $69K median income in one of Columbus's most diverse districts, housing affordability and anti-displacement are the unifying economic concerns across all four of HD-9's communities. The incumbent's legislative record on tenant protections and housing investment is the most coherent multiracial organizing frame available." },
        { name: "Multiracial Coalition Turnout", tag: "lean-into", why: "HD-9 is among the most demographically diverse districts in Ohio: 47% white, 34% Black, 9% Hispanic, and 7% Asian. No single community delivers the majority. Broad, sustained, community-specific outreach that sustains each community's engagement and turnout is the strategic priority — not a generic get-out-the-vote operation." },
        { name: "Hispanic & Asian Community Engagement", tag: "lean-into", why: "At 8.5% Hispanic and 6.6% Asian — both meaningful and likely underregistered — these communities represent the district's most accessible turnout growth opportunities. Spanish-language outreach, culturally specific communication, and community-rooted engagement for both groups should be sustained year-round commitments, not election-year add-ons." },
        { name: "Single-Community Dominance in Coalition Strategy", tag: "avoid", why: "In a four-community district where no group is a majority, organizing strategy that centers one community at the expense of others produces resentment and coalition fracture. Every community should see itself reflected in the incumbent's outreach, legislative priorities, and constituent services." },
        { name: "Generic Democratic Messaging", tag: "avoid", why: "HD-9's extraordinary diversity requires genuine cultural specificity — not a one-size-fits-all Democratic message. Residents will notice if outreach is authentic versus performative. Invest in community-specific messengers, materials, and relationships across all four groups." }
      ],
      memoHeadline: "Ohio's most diverse Columbus seat — four communities, no majority, one coalition. Keep it together with specific, sustained outreach to each.",
      memoParagraphs: [
        "HD-9 is one of Ohio's most demographically diverse legislative districts: 47% white, 34% Black, 8.5% Hispanic, and 6.6% Asian in a Columbus seat with 51.7% renters and median age 34.2. Munira Yasin Abdullahi held it uncontested in 2024. The strategic challenge is not electoral — it is coalitional: sustaining genuine engagement across four distinct communities who each need to see themselves reflected in their representation.",
        "Housing affordability is the one issue that cuts across all four communities simultaneously. In a district where over half of residents rent and the Columbus housing market has placed sustained upward pressure on costs, the incumbent's record on anti-displacement policy and tenant protections is the most accessible common ground. Lead with it in every community context.",
        "The Hispanic and Asian communities at 8.5% and 6.6% respectively are the turnout growth opportunities that are most systematically underinvested. These communities are often underregistered, and their turnout rates in state legislative races are below their population share. Sustained, culturally specific organizing — not election-year mobilization — is what moves these numbers."
      ],
      memoBullets: [
        "Maintain parallel community engagement tracks for all four groups — white, Black, Hispanic, and Asian — with community-specific messengers, events, and communication for each. No community should feel like an afterthought.",
        "Housing affordability is the common-ground legislative priority. Make the incumbent's record visible and specific across all communities — this is what unifies the coalition's policy interests.",
        "Spanish-language and multilingual outreach for the 8.5% Hispanic and 6.6% Asian communities should be a permanent budget commitment, not a 90-day campaign investment.",
        "Year-round constituency engagement — accessible office hours, community events, direct service — sustains the trust that turns this diverse district into a reliable high-turnout asset for the broader Columbus Democratic coalition."
      ]
    }
  },
  {
    id: "oh-hd-10",
    name: "Ohio House District 10",
    city: "Columbus",
    region: "Columbus South / Southwest Franklin County",
    type: "state house district",
    incumbentName: "Mark Sigrist",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Black Community GOTV — the Decisive Margin", tag: "lean-into", why: "At 18.4% Black in a 52-48 seat, the Black community is not part of the margin — it is the margin. If Black turnout or loyalty drops even 3-4 points, HD-10 flips. Year-round Black civic infrastructure, visible constituent service in Black neighborhoods, and early GOTV investment are the highest-priority hold-the-seat actions." },
        { name: "Economic Security & Working-Class Issues", tag: "lean-into", why: "At $69K income and only 22.9% college — low for a Columbus D seat — this is a working-to-middle-class district with real economic concerns. The incumbent's record on wages, job quality, and economic investment must be specific and locally visible. Generic Democratic economic messaging will not hold white working-class voters at 52%." },
        { name: "Housing Affordability", tag: "lean-into", why: "At 38.8% renters and $69K income, housing cost pressure is real across multiple communities in HD-10. A visible record on tenant protections and housing investment reinforces the economic frame and gives the incumbent a concrete constituent service hook in renter-heavy precincts." },
        { name: "Hispanic Community Engagement", tag: "careful", why: "At 6.8% Hispanic in a 52-48 seat, the Hispanic community is a meaningful contributor to a margin that cannot afford to lose any coalition element. Spanish-language outreach and community-specific engagement are not supplemental — they are load-bearing at this margin level." },
        { name: "National Democratic Framing", tag: "avoid", why: "In a 52-48 Columbus seat with 22.9% college and a significant white working-class electorate, nationalizing the race activates the Republican base without adding Democratic votes. The incumbent must run a hyper-local economic message that grounds the contrast in what Sigrist has done specifically for HD-10 — not in Washington politics." }
      ],
      memoHeadline: "52-48 — the thinnest Democratic hold in Columbus. The Black community is the margin and must be treated like it.",
      memoParagraphs: [
        "HD-10 is the most competitive Democratic-held seat in Columbus, and Mark Sigrist's 52-48 win in 2024 is not a comfortable margin — it is a four-point hold that will require a full campaign effort to repeat in 2026. At $69K income, 22.9% college, 18.4% Black, and 38.8% renters, this is a working-to-middle-class multiracial district where every coalition element is load-bearing.",
        "The Black community at 18.4% is the decisive margin variable. In a seat this close, a 3-4 point drop in Black turnout or loyalty is the difference between holding and losing. This is not a district where Black community engagement is one of several priorities — it is the priority. Year-round investment in Black civic infrastructure, constituent service in Black neighborhoods, and early GOTV planning is what holds HD-10.",
        "The white working-class vote at 68.3% white and 22.9% college is the second variable. A locally grounded economic message — what Sigrist has done specifically for HD-10 workers and families — is what keeps white working-class voters from drifting to the Republican in an off-year cycle. This message cannot be generic; it must be local and specific."
      ],
      memoBullets: [
        "Black community GOTV is the top priority — above all else. Invest in year-round Black civic infrastructure: community events, accessible constituent services in Black neighborhoods, and early GOTV planning that starts in January, not October.",
        "Run a hyper-local economic message. Pull Sigrist's specific record on wages, jobs, and housing in HD-10 and make it visible to working-class voters who are the persuasion-and-retention target.",
        "Spanish-language outreach for the 6.8% Hispanic community is a hold-the-seat investment at this margin level. Every coalition element matters in a 52-48 race.",
        "Do not nationalize the race. Tie every issue to HD-10 specifically. The opponent will try to make this about Biden, Harris, or national Democrats — do not give them the frame."
      ]
    }
  },
  {
    id: "oh-hd-11",
    name: "Ohio House District 11",
    city: "Columbus",
    region: "Columbus Northwest Suburbs (Hilliard / Upper Arlington)",
    type: "state house district",
    incumbentName: "Crystal Lett",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Asian American Community Outreach — the Margin", tag: "lean-into", why: "At 13.1% Asian in a 52-48 seat, the Asian American community is the single most important coalition variable. In a district this close, Asian American turnout and loyalty is not a supplemental priority — it is a hold-the-seat imperative. Sustained, culturally specific engagement with Asian American civic organizations, community events, and multilingual outreach is what separates a 52-48 hold from a loss." },
        { name: "Reproductive Rights", tag: "lean-into", why: "At $115K income and 63.6% college — the highest-income, second-most-educated district in Columbus — reproductive rights are the issue that moved this seat toward Democrats and that must be actively maintained. Crystal Lett's record and advocacy on this issue is the primary contrast with a Republican opponent in a professional-class Columbus suburb." },
        { name: "Education Quality & Funding", tag: "lean-into", why: "At 63.6% college-educated with a professional-class income profile and significant family demographic, public school quality and state education funding are primary concerns. The incumbent's education record is both a values statement and a tangible local issue for the parents and educators who make up a significant share of HD-11's electorate." },
        { name: "Economic Populism / Class Conflict", tag: "avoid", why: "At $115K median income — the highest of any Columbus district — wealth redistribution or anti-elite framing will alienate the moderate Republicans and high-income independents the incumbent needs to hold 52%. Rights, governance quality, and education are the credible frames for this professional-class electorate." },
        { name: "Treating 52-48 as a Safe Hold", tag: "avoid", why: "HD-11 is identical in margin to HD-10 — a four-point hold in a high-income suburb where Republican infrastructure will invest in closing the gap. The opponent in 2026 will be credible and well-funded. A full campaign with active outreach, a sharp issue contrast, and intensive Asian American community engagement is the only way to hold this seat." }
      ],
      memoHeadline: "52-48 in Ohio's highest-income Columbus suburb with 13% Asian. Reproductive rights won this seat — Asian American turnout holds it.",
      memoParagraphs: [
        "HD-11 is tied with HD-10 as the most competitive Democratic-held seat in Columbus. Crystal Lett won 52-48 in 2024 in a district with $115K median income, 63.6% college attainment, and 13.1% Asian population. At four points, this margin will be aggressively contested in 2026 by a well-funded Republican challenger who will argue that a high-income, majority-white professional-class suburb should not be held by Democrats.",
        "The Asian American community at 13.1% is the decisive margin variable — and the one most underinvested by Democratic campaigns in comparable seats. In a 52-48 district, organized and motivated Asian American voters are the difference between holding and losing. This community requires not a token outreach effort but a sustained, culturally specific, year-round engagement program: community events, multilingual communication, and direct relationships with Asian American civic organizations in the district.",
        "Reproductive rights are the issue that moved HD-11 and that must be actively maintained. At 63.6% college-educated, this is exactly the demographic profile where reproductive rights mobilize existing Democrats and persuade soft Republican women to cross over or stay home. Lett's record on this issue must be specific, visible, and constantly reinforced against whatever the Republican candidate tries to do to muddy it."
      ],
      memoBullets: [
        "Asian American community outreach is the top hold-the-seat priority. Build sustained relationships with Asian American civic organizations in HD-11, hold community-specific events, and invest in multilingual outreach year-round. The 13.1% Asian vote at full engagement makes this seat significantly safer.",
        "Reproductive rights lead the contrast campaign. Be specific about Lett's record and the opponent's position. This is the issue that won the seat and that will win it again if it is actively prosecuted, not assumed.",
        "Education quality and school funding are the second frame — pull the opponent's position on school funding and make it a local issue about what it means for HD-11 schools specifically.",
        "Run a full campaign. A well-funded Republican challenger will be coming. Active constituent engagement, community events, and a sharp issue contrast — not passive incumbency — are what hold a 52-48 seat."
      ]
    }
  },
  {
    id: "oh-hd-12",
    name: "Ohio House District 12",
    city: "Columbus",
    region: "Columbus Rural Exurbs (Pickaway / Western Franklin)",
    type: "state house district",
    incumbentName: "Brian Stewart",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $78K income and 25% college in the Columbus rural orbit, trade job quality, economic security, and rural investment are the primary frames. Stewart's Statehouse record on economic and labor policy is the most credible contrast available to a local candidate with the right biography." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Non-college working-class households in this district face real healthcare cost exposure. Drug pricing, Medicaid, and rural hospital access are the most cross-partisan issues available and have demonstrated reach in comparable Columbus-orbit districts." },
        { name: "Candidate Development as First Priority", tag: "lean-into", why: "At R 73-27 with 89% white and 25% college in the Columbus exurban orbit, the immediate strategic task is finding a credible local candidate — a union worker, a rural healthcare professional, or a community figure with standing in the district. Without them, no strategy applies." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "89% white at R+46. Social justice or identity framing will foreclose any persuasion conversation. Strict economic and local-governance messaging is the only viable lane for this electorate." },
        { name: "National Democratic Brand", tag: "avoid", why: "A 73-27 result means the national party brand is a significant liability. The candidate must run entirely on local economic identity — where they live, who they know, what they do — not on party affiliation." }
      ],
      memoHeadline: "73-27 in a Columbus exurban district with 29% renters and a working-class income base. Local candidate first — then the message.",
      memoParagraphs: [
        "HD-12 gave Brian Stewart a 73-27 win in 2024. At $78K income, 25% college, 89% white, and 29% renters in the Columbus exurban orbit, this is a working-to-middle-class district that has moved Republican on cultural identity while real economic concerns remain unaddressed by either party's organizing infrastructure.",
        "The 27% Democratic floor represents voters who pulled a Democratic lever without any candidate infrastructure, any field operation, or any organized messaging. A credible local candidate delivering a tight economic message on wages, healthcare, and rural investment could realistically move that floor to 35% or better in a single cycle.",
        "The 2026 goal is 63-37 with a serious local candidate, an organized renter-precinct strategy, and a voter file that did not exist before. The infrastructure built from this campaign makes HD-12 a different organizing environment heading into 2028."
      ],
      memoBullets: [
        "Candidate first. Contact Columbus-area labor networks, rural civic organizations, and healthcare worker associations. The right local candidate already exists in this community.",
        "Economic message only: Stewart's votes on wages, healthcare, and economic investment versus what HD-12 working families need. No national framing.",
        "Identify and door-knock renter-heavy precincts. At 29% renters and $78K income, housing affordability pressure is present and gives a Democrat a concrete and personal argument.",
        "Set 63-37 as the 2026 goal. Voter file data and precinct maps are the real long-term deliverables."
      ]
    }
  },
  {
    id: "oh-hd-13",
    name: "Ohio House District 13",
    city: "Cleveland",
    region: "Lakewood / West Cleveland",
    type: "state house district",
    incumbentName: "Rader",
    incumbentParty: "Democrat",
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
    region: "Parma / Brooklyn (Southwest Cuyahoga)",
    type: "state house district",
    incumbentName: "Sean Patrick Brennan",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Hispanic Community Engagement & GOTV", tag: "lean-into", why: "At 9.7% Hispanic in a 58-42 Cleveland seat, the Latino community is a meaningful margin contributor that requires active, sustained, and culturally specific engagement. Spanish-language outreach, community events, and direct constituent services for Hispanic households are the investment that keeps this seat at 58-42 rather than sliding toward 54-46." },
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $64K income and 24% college, this is a working-to-middle-class Cleveland district where trade job quality, wages, and economic investment are primary concerns. Brennan's record on economic and labor policy is the primary contrast frame with white working-class voters who are the largest share of the electorate." },
        { name: "Black Community Turnout", tag: "lean-into", why: "At 8% Black in a 58-42 seat, Black voter turnout is a meaningful margin variable. Year-round constituent engagement in Black neighborhoods and early GOTV planning — not last-minute mobilization — sustains this community's contribution to the winning coalition." },
        { name: "Nationalizing the Race", tag: "avoid", why: "In a 58-42 Cleveland seat with 24% college and a significant white working-class electorate, nationalizing the race activates the Republican base without adding Democratic votes. The incumbent must run on local identity and a specific economic record, not Washington politics." },
        { name: "Complacency at 58-42", tag: "avoid", why: "A 42% Republican performance in a D-held Cleveland seat is a real vulnerability in an off-year cycle. Republican infrastructure will recruit a local challenger. The incumbent must run an active campaign with constituent engagement and field presence, not assume the margin is safe." }
      ],
      memoHeadline: "58-42 in a Cleveland district with 10% Hispanic and 8% Black. Coalition maintenance and local economic credibility hold this seat.",
      memoParagraphs: [
        "HD-14 is a working-to-middle-class Cleveland district that Sean Patrick Brennan held 58-42 in 2024. At $64K income, 24% college, 78% white, 9.7% Hispanic, and 8% Black, this is a multiracial working-class seat where the 58-42 margin is maintained by coalition discipline, not structural Democratic advantage.",
        "The Hispanic community at 9.7% is the most underinvested coalition element in HD-14. In a seat this competitive, a 3-4 point drop in Hispanic turnout or loyalty could tighten the margin to a genuine toss-up. Sustained Spanish-language outreach, community-specific events, and accessible constituent services are the insurance policy.",
        "The working-class white vote at 78% of the district and only 24% college is the persuasion-and-retention target. A locally grounded economic message — what Brennan has done specifically for HD-14 workers and families — is what keeps this community from drifting toward a Republican challenger who runs on local identity."
      ],
      memoBullets: [
        "Spanish-language outreach and Hispanic community engagement are the top coalition maintenance priorities. This community's sustained engagement is what keeps HD-14 at 58-42 rather than 54-46.",
        "Run a hyper-local economic message. Pull Brennan's specific record on wages, jobs, and economic investment in this district. Make it impossible for a challenger to claim the economic populist lane.",
        "Black community GOTV requires year-round infrastructure — not October mobilization. At 8%, this community's full turnout is a meaningful margin contributor.",
        "Do not nationalize the race. Make it about HD-14 specifically — local identity, local record, local economic outcomes."
      ]
    }
  },
  {
    id: "oh-hd-15",
    name: "Ohio House District 15",
    city: "Cleveland",
    region: "Parma Heights / Middleburg Heights",
    type: "state house district",
    incumbentName: "Chris Glassburn",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Hispanic Community GOTV — the Decisive Variable", tag: "lean-into", why: "At 13.3% Hispanic in a 55-45 seat, the Latino community is the margin. In a district this close, the difference between winning and losing is whether Hispanic voters are registered, mobilized, and delivered with high loyalty. Spanish-language outreach, community events, and culturally specific constituent services are not supplemental — they are the campaign's most critical investment." },
        { name: "Housing Affordability & Renter Protections", tag: "lean-into", why: "At 34.2% renters and $68K income in a Cleveland district, housing cost pressure is real and widely shared across all three of HD-15's minority communities. A visible record on tenant protections and housing investment is the cross-community economic anchor that sustains coalition cohesion in a district this competitive." },
        { name: "Black Community Turnout", tag: "lean-into", why: "At 8.1% Black in a 55-45 seat, Black voter turnout is not incidental — it is load-bearing. Year-round civic infrastructure in Black neighborhoods, early GOTV planning, and accessible constituent services are what keep this community's contribution at the level the margin requires." },
        { name: "White Working-Class Persuasion", tag: "careful", why: "At 74.5% white and 31% college in a 55-45 seat, white working-class voters are both the largest share of the electorate and the most persuadable in either direction. A locally grounded economic message that speaks to wages, job quality, and cost of living holds this community without triggering the cultural identity responses that send them to the Republican." },
        { name: "National Democratic Brand", tag: "avoid", why: "A 45% Republican performance in a Cleveland D-held seat with a significant white working-class electorate means the national party brand has real drag. Run on Glassburn's local record and local identity. Do not give the opponent a nationalized frame to run against." }
      ],
      memoHeadline: "55-45 with 13% Hispanic — the thinnest comfortable Democratic hold in Cleveland. The Latino community is the margin and must be treated like it.",
      memoParagraphs: [
        "HD-15 is one of the most competitive Democratic-held seats in the Cleveland region. Chris Glassburn won 55-45 in 2024 in a district with $68K income, 31% college, 13.3% Hispanic, 8.1% Black, and 34% renters. At ten points, this margin is defendable — but it requires every coalition element to perform, and the Hispanic community at 13.3% is the variable most at risk of underperforming.",
        "The Latino community in HD-15 is the decisive margin variable. In a 55-45 seat, a 4-5 point drop in Hispanic turnout or loyalty would make this a toss-up. This community requires not a generic GOTV push but a year-round program: Spanish-language constituent services, community-specific events, relationships with local Latino civic organizations, and bilingual field staff who are present in the community between elections.",
        "Housing affordability anchors the cross-community economic message. At 34% renters across a diverse district, the cost of housing is a shared concern that unites white working-class, Hispanic, and Black voters around a common policy priority. The incumbent's specific record on tenant protections and housing investment is the most coherent multiracial organizing frame available."
      ],
      memoBullets: [
        "Hispanic community engagement is the top priority — year-round, community-specific, bilingual. This is not a tactical decision; it is what holds the seat.",
        "Housing affordability is the cross-community anchor issue. Make the incumbent's record specific and visible across all neighborhoods — name the protections, name the investments, name the votes.",
        "Black community GOTV requires sustained infrastructure. At 8.1% in a 55-45 seat, this community's full turnout is the margin between a comfortable hold and a toss-up.",
        "White working-class voters require a locally grounded economic message. Pull Glassburn's specific record on wages, jobs, and economic investment in HD-15. Do not give the opponent the economic populist lane."
      ]
    }
  },
  {
    id: "oh-hd-16",
    name: "Ohio House District 16",
    city: "Cleveland",
    region: "Strongsville / Brecksville (SW Cuyahoga Suburbs)",
    type: "state house district",
    incumbentName: "Bride Rose Sweeney",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Reproductive Rights", tag: "lean-into", why: "At 47% college-educated and $95K median income in a Cleveland suburb, reproductive rights are the issue that moved this seat toward Democrats and that must be actively maintained as the top contrast. Sweeney's record and advocacy on this issue is the primary distinction from any Republican challenger in a professional-class Cleveland suburb." },
        { name: "Education Quality & Funding", tag: "lean-into", why: "At 47% college with a professional-class income profile and significant family demographic, public school quality and state education funding are primary concerns. The incumbent's education record is both a values statement and a tangible local issue for the parents and educators who make up a large share of HD-16's electorate." },
        { name: "Hispanic & Asian Community Outreach", tag: "lean-into", why: "At 5.5% Hispanic and 3.3% Asian, these communities are small but underregistered relative to their population share. In a 61-39 seat, sustained minority community engagement builds coalition depth and the turnout infrastructure that makes this seat more resilient in competitive cycles." },
        { name: "Economic Populism / Class Conflict", tag: "avoid", why: "At $95K median income and 47% college, this is a professional-class Cleveland suburb. Wealth redistribution or anti-elite framing will alienate the moderate Republicans and high-income independents the incumbent needs to sustain a 61-39 margin. Rights and governance quality are the credible frames." },
        { name: "Complacency at 61-39", tag: "avoid", why: "A 39% Republican performance in a high-income Cleveland suburb signals that the seat has a credible Republican constituency. Republican investment in 2026 could narrow this to 56-44 with a well-funded local challenger. Active constituent engagement and a sharp issue contrast are the insurance policy against margin erosion." }
      ],
      memoHeadline: "61-39 in a $95K, 47%-college Cleveland suburb. Reproductive rights and education built this margin — maintain them with an active campaign.",
      memoParagraphs: [
        "HD-16 is a high-income Cleveland suburban seat that Bride Rose Sweeney held 61-39 in 2024. At $95K income and 47% college-educated, this is a professional-class district where the Democratic margin was built on the college-educated swing around reproductive rights and education — and where Republican infrastructure will work to close the gap in 2026 with a well-funded local challenger.",
        "The 22-point margin is comfortable but not structural. Comparable high-income Cleveland suburbs have moved 8-10 points in either direction based on candidate quality and issue salience. The incumbent must sustain active constituent engagement, a sharp reproductive rights contrast, and consistent outreach to the Hispanic and Asian communities that contribute to the coalition.",
        "Hispanic and Asian community engagement at 5.5% and 3.3% respectively is underinvested relative to its coalition value. These communities are often well-educated, relatively high-propensity, and responsive to education and rights-based messaging — exactly the HD-16 profile. Dedicated engagement efforts build coalition depth that makes the seat more resilient against a strong Republican challenge."
      ],
      memoBullets: [
        "Reproductive rights lead the contrast campaign — specific votes, specific impact, specific contrast with the opponent's position. This is the issue that moved HD-16 and that holds it against a competitive challenger.",
        "Education quality and school funding are the second pillar. Connect the incumbent's record on education investment to what it means for HD-16 schools specifically.",
        "Invest in Hispanic and Asian community outreach as a sustained program. At 5.5% and 3.3%, these communities' full engagement adds meaningful coalition resilience.",
        "Run an active campaign. Do not assume 61-39 is safe. Republican infrastructure will invest in this seat in 2026, and a well-funded local challenger can close a professional-class suburban margin quickly."
      ]
    }
  },
  {
    id: "oh-hd-17",
    name: "Ohio House District 17",
    city: "Cleveland",
    region: "Westlake / Bay Village (West Cleveland Suburbs)",
    type: "state house district",
    incumbentName: "Mike Dovilla",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Reproductive Rights", tag: "lean-into", why: "At 43% college-educated and $85K income in a Cleveland suburb, reproductive rights are the highest-value contrast point available. Dovilla's Statehouse voting record on abortion access is out of step with portions of this professional-class electorate. Sutherland held 45% with this issue as a primary driver — a Democratic challenger who prosecutes it more aggressively has a clear path to 51%." },
        { name: "Education Quality & Funding", tag: "lean-into", why: "At 43% college with a professional-class income profile, public school quality and state education funding are primary concerns for families in HD-17. Dovilla's record on education investment is a concrete and values-resonant contrast that appeals to the college-educated suburban households that are the persuasion target." },
        { name: "Asian Community Outreach", tag: "lean-into", why: "At 5.2% Asian in a 55-45 seat, the Asian American community is an underorganized margin variable. In a district this close, organized and motivated Asian American voters — who are often high-propensity, high-education, and responsive to rights-based messaging — could provide 1-2 points of margin shift. Dedicated outreach is a high-ROI investment." },
        { name: "Economic Populism / Class Conflict", tag: "avoid", why: "At $85K income and 43% college, this is a professional-class Cleveland suburb. Wealth redistribution or anti-elite framing will alienate the moderate Republicans and high-income independents the Democrat needs to close the 10-point gap. Rights, governance, and community investment are the credible frames." },
        { name: "National Democratic Brand on the Top Line", tag: "avoid", why: "In a 55-45 R-held suburb, leading with national Democratic identity activates the Republican base. The candidate must run on local biography and Dovilla's specific record — not on party. The contrast is Dovilla-versus-challenger on local issues, not Democrat-versus-Republican." }
      ],
      memoHeadline: "Dovilla at 55-45 in a $85K, 43%-college Cleveland suburb. Reproductive rights and education are the flip formula — the seat is within reach.",
      memoParagraphs: [
        "HD-17 is one of the clearest Democratic pickup opportunities in the Cleveland region. Mike Dovilla won 55-45 in 2024 in a district with $85K income, 43% college-educated, 5.2% Asian, and 4.8% Hispanic. Jessica Sutherland's 45% performance — without the full investment this seat deserves — demonstrates that the district is genuinely competitive and that the right candidate with the right resources can win.",
        "The formula is identical to what has moved comparable Cleveland suburbs: reproductive rights as the primary contrast, education quality as the secondary frame, and Asian American outreach as the margin-setting investment. Dovilla's voting record on abortion access and education funding provides the contrast material. A candidate who can deliver that contrast with local credibility and professional-class values alignment has a path to 51-49 or better.",
        "The Asian community at 5.2% is the most underutilized element in HD-17's coalition math. These voters are often highly educated, high-propensity, and already oriented toward Democratic values on education and rights. A dedicated Asian American engagement effort — community events, culturally specific outreach, direct relationships with Asian American civic organizations — is a low-cost, high-upside investment that could make the difference in a close race."
      ],
      memoBullets: [
        "Reproductive rights lead the contrast campaign. Pull Dovilla's specific votes and connect them to what HD-17 women and families experience. This is the issue that moved 45% in 2024 and that can move 51% in 2026 with a stronger candidate and better resources.",
        "Education quality and school funding are the second pillar. Make Dovilla's record on education investment a local issue about what it means for HD-17 schools and families.",
        "Invest specifically in Asian American community outreach. At 5.2% in a 55-45 seat, organized and motivated Asian American turnout could be the decisive margin. Start early with community relationships, not late with mailers.",
        "Recruit a candidate who reflects the district's professional-class values: a healthcare professional, educator, or local business owner with roots in the Cleveland suburbs. The candidate's biography must match the electorate's identity."
      ]
    }
  },
  {
    id: "oh-hd-18",
    name: "Ohio House District 18",
    city: "Cleveland",
    region: "East Cleveland / Glenville (Urban Core)",
    type: "state house district",
    incumbentName: "Juanita O. Brent",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Anti-Poverty Investment", tag: "lean-into", why: "At $41K median income — the second-lowest of any district in this session — HD-18 is a high-poverty majority-Black Cleveland district where economic security, anti-poverty investment, and job access are the most immediate daily concerns. The incumbent's record on economic investment, workforce development, and direct constituent services must be visible and tangible." },
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 48.9% renters and $41K income, housing cost burden is acute and widespread. Anti-displacement policy, tenant protections, and affordable housing investment are the primary legislative priorities that connect most directly to what HD-18 households are experiencing." },
        { name: "Black Community Turnout Infrastructure", tag: "lean-into", why: "As a 75% Black Cleveland urban seat with an 89-11 margin, HD-18's electoral value to the broader Ohio Democratic coalition is entirely a function of turnout depth. Year-round Black civic infrastructure — not just pre-election GOTV — is what converts this seat's large Democratic majority into a reliable high-participation asset for statewide races." },
        { name: "Policing & Public Safety", tag: "careful", why: "Public safety is a genuine concern in an economically stressed high-poverty district. The incumbent must own a community-investment public safety frame — connecting under-resourced neighborhoods to higher crime rates — rather than ceding the issue to Republican law-and-order framing or leaning into language that alienates working-class Black voters who want both accountability and safety." },
        { name: "Neglecting Constituent Service Between Elections", tag: "avoid", why: "At 89-11, this seat is not electorally at risk — but the community's investment in state-level politics is not automatic. Visible constituent service — housing resources, economic assistance, accessible office hours — is what keeps voters engaged with their representation and what sustains the turnout floor that makes HD-18 a reliable Democratic asset." }
      ],
      memoHeadline: "89-11 in Cleveland's highest-poverty majority-Black district. The seat is safe — the community's trust and turnout are what require constant investment.",
      memoParagraphs: [
        "HD-18 is a majority-Black Cleveland urban district that Juanita Brent held 89-11 in 2024. At $41K median income and 48.9% renters, this is one of the highest-poverty districts in Ohio — a community where economic security, housing stability, and public investment are not policy abstractions but daily survival concerns.",
        "The strategic imperative in a district this safe is not electoral — it is representational. HD-18 voters deserve a legislator who is visibly and tangibly fighting for their economic interests in Columbus. A record on anti-poverty investment, tenant protections, workforce development, and community infrastructure translates directly into constituent trust and turnout depth that matters for every Cuyahoga County and statewide Democratic race.",
        "Black voter turnout in HD-18 is a force multiplier for the entire Northeast Ohio Democratic coalition. When this community is organized, engaged, and invested in political participation, the ripple effects extend to statewide margins, countywide races, and the judicial elections that often determine policy outcomes more directly than legislative votes."
      ],
      memoBullets: [
        "Economic security and housing are the top legislative priorities. Make the incumbent's record on anti-poverty investment and tenant protections specific and visible — residents should be able to name what their representative has done for them.",
        "Year-round constituent service is the turnout infrastructure. Housing clinics, economic resource events, direct access to benefits navigation, and accessible office hours sustain engagement between election cycles.",
        "Partner with Cleveland Black civic organizations year-round, not just in GOTV season. The community organizations that sustain HD-18's political infrastructure deserve ongoing investment and partnership, not transactional election-year relationships.",
        "Public safety must be owned with a community-investment frame. Connect economic disinvestment to public safety outcomes and make the incumbent's record on neighborhood investment the contrast with Republican law-and-order posturing."
      ]
    }
  },
  {
    id: "oh-hd-19",
    name: "Ohio House District 19",
    city: "Cleveland",
    region: "South Euclid / University Heights (East Cuyahoga)",
    type: "state house district",
    incumbentName: "Phil Robinson",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Black Community Turnout — the Coalition Anchor", tag: "lean-into", why: "At 22.4% Black in a 57-43 Cleveland seat, the Black community is the coalition anchor. The incumbent's visible record on economic investment, housing, and community priorities in Black neighborhoods is what sustains the turnout and loyalty that makes HD-19 a reliable Democratic hold. This community's engagement must be earned continuously." },
        { name: "Reproductive Rights", tag: "lean-into", why: "At 47% college-educated and $87K income in a diverse Cleveland suburb, reproductive rights are a primary mobilizing issue for the college-educated and professional households that make up a significant share of the electorate. Robinson's record and active advocacy on this issue sustains the professional-class coalition that produces the 57-43 margin." },
        { name: "Asian Community Outreach", tag: "lean-into", why: "At 5.8% Asian in a 57-43 seat, the Asian American community is an underinvested coalition element. These voters are often high-education, high-propensity, and responsive to rights-based messaging. Dedicated outreach — community events, culturally specific communication, direct civic engagement — builds coalition depth that makes this seat more resilient." },
        { name: "Economic Populism / Class Conflict", tag: "avoid", why: "At $87K income and 47% college, the professional-class plurality in HD-19 is not receptive to wealth redistribution framing. Economic messaging must be about opportunity, investment, and community quality — not class conflict. The Black and white working-class portions of the district respond to economic security framing, not anti-elite populism." },
        { name: "Complacency at 57-43", tag: "avoid", why: "A 43% Republican performance in a Cleveland D-held seat with a significant Black community and 47% college attainment signals a credible Republican constituency. An off-year cycle with a well-funded local challenger and lower Democratic base turnout could tighten this to 53-47. Active constituent engagement and full campaign investment are the insurance policy." }
      ],
      memoHeadline: "57-43 in a diverse $87K Cleveland suburb with 22% Black and 6% Asian. Coalition maintenance across three communities holds this seat.",
      memoParagraphs: [
        "HD-19 is a high-income, highly educated Cleveland suburban district that Phil Robinson held 57-43 in 2024. At $87K income, 47% college, 22.4% Black, 5.8% Asian, and 3.7% Hispanic, this is one of the more demographically diverse D-held suburban seats in Northeast Ohio — and its diversity is what makes the coalition both its greatest strength and its primary management challenge.",
        "The Black community at 22.4% is the coalition anchor. In a 57-43 seat, Black turnout and loyalty is not one priority among several — it is the margin foundation. The incumbent's visible record on economic investment, housing stability, and community priorities in Black neighborhoods is what sustains the turnout level that makes HD-19 a reliable Democratic hold across cycles.",
        "The Asian community at 5.8% is the most underinvested element in the HD-19 coalition. These voters are often highly educated, relatively high-propensity, and responsive to reproductive rights and education messaging — exactly the HD-19 profile. A dedicated Asian American community engagement program builds the coalition resilience that makes this seat safer in competitive cycles."
      ],
      memoBullets: [
        "Black community GOTV is the top priority — year-round infrastructure, not October mobilization. The incumbent's record on economic investment and community priorities in Black neighborhoods must be visible and tangible.",
        "Reproductive rights and education quality are the professional-class contrast issues. Be specific about Robinson's record and the opponent's position. These issues hold the college-educated portion of the coalition.",
        "Asian American community outreach should be a sustained program with dedicated resources. At 5.8%, this community's full engagement adds meaningful coalition depth.",
        "Do not nationalize the race. Run on Robinson's local record and local identity. The 43% Republican baseline means a nationalized frame activates a credible opposing constituency."
      ]
    }
  },
  {
    id: "oh-hd-20",
    name: "Ohio House District 20",
    city: "Cleveland",
    region: "Cleveland Urban Core (Central / Hough)",
    type: "state house district",
    incumbentName: "Terrence Upchurch",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Anti-Displacement", tag: "lean-into", why: "At 71% renters — the highest renter rate in this entire batch — and $35K median income, housing cost burden and displacement risk define daily life in HD-20. The incumbent's record on tenant protections, anti-displacement policy, and affordable housing investment is the most urgent and personal legislative priority for this community." },
        { name: "Economic Security & Anti-Poverty Investment", tag: "lean-into", why: "At $35K median income — the lowest of any Cleveland district in this batch — HD-20 is one of the highest-poverty districts in Ohio. Workforce investment, anti-poverty programs, direct economic assistance, and job access are the daily concerns that a visible legislative record must address." },
        { name: "Multiracial Turnout Infrastructure", tag: "lean-into", why: "HD-20 is majority-Black (55%) but also 30% white and 9% Hispanic. At 85-15, the seat is safe — but turnout across all communities is the asset that extends beyond HD-20's boundaries into Cuyahoga County and statewide races. Year-round civic infrastructure for all three communities sustains the participation rate that makes this district a reliable Democratic stronghold." },
        { name: "Hispanic Community Engagement", tag: "careful", why: "At 8.8% Hispanic in a majority-Black district, the Latino community is a meaningful and likely underorganized component of the coalition. Spanish-language outreach, community events, and culturally specific constituent services build the loyalty and turnout that sustains the 85-15 margin and grows the district's overall participation." },
        { name: "Neglecting Non-Election-Year Constituent Service", tag: "avoid", why: "In a community this economically stressed, the connection between representation and daily material outcomes is immediate. Constituent service — housing resources, benefits navigation, economic assistance, accessible office hours — is not supplemental to political work; it is the foundation of the civic trust that produces high turnout." }
      ],
      memoHeadline: "71% renters, $35K median income, 85-15. The seat is safe — the community's daily needs are what require constant legislative attention.",
      memoParagraphs: [
        "HD-20 is one of the highest-poverty, highest-renter districts in Ohio. Terrence Upchurch held it 85-15 in 2024 in a majority-Black Cleveland district with 71% renters, $35K median income, and a diverse coalition of Black (55%), white (30%), Hispanic (9%), and Asian (4%) residents. The electoral math is not in question — the community's material needs are.",
        "Housing is the defining issue. At 71% renters and $35K income, nearly three quarters of HD-20 residents are renting in conditions of economic stress. The incumbent's record on anti-displacement policy, tenant protections, and affordable housing investment must be visible, specific, and tangible — residents should be able to name what their representative has done to protect them from displacement and make housing more affordable.",
        "The Hispanic community at 8.8% is a meaningful and likely underorganized part of the coalition. In a district this economically stressed, the barriers to civic participation are high — and they require specific, culturally rooted outreach that meets residents where they are, not generic GOTV communications that assume civic engagement as a baseline."
      ],
      memoBullets: [
        "Housing is the top constituent service and legislative priority. Connect the incumbent's record directly to what HD-20 renters experience — specific protections, specific investments, specific votes. This community should know what their representative has done for them.",
        "Year-round economic resource events — benefits navigation, job training access, anti-poverty program outreach — are what sustain civic engagement in a community where daily material needs are acute.",
        "Spanish-language outreach and community-specific engagement for the 9% Hispanic community must be a sustained investment. At 8.8%, this community's full participation adds meaningful coalition depth.",
        "Black civic infrastructure is the turnout foundation — partner with local churches, civic organizations, and community groups year-round, not just in GOTV season."
      ]
    }
  },
  {
    id: "oh-hd-21",
    name: "Ohio House District 21",
    city: "Cleveland",
    region: "Shaker Heights / Cleveland Heights",
    type: "state house district",
    incumbentName: "Eric Synenberg",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 42.1% renters and $60K median income in a nearly evenly split Black-and-white Cleveland district, housing affordability is the primary cross-racial unifying issue. Anti-displacement policy, tenant protections, and affordable housing investment are the concerns that bind the Black and white working-class communities in HD-21 around a common policy priority." },
        { name: "Black Community Turnout — the Margin Foundation", tag: "lean-into", why: "At 47.8% Black in a 79-21 seat, the Black community is the electoral foundation. The 79-21 margin reflects a district where Black voter participation is high — that participation must be sustained year-round through civic infrastructure, visible constituent service, and a legislative record that Black voters can tangibly connect to their lives." },
        { name: "Cross-Racial Coalition Maintenance", tag: "lean-into", why: "At nearly equal Black (48%) and white (44%) populations, HD-21 is one of the most evenly biracial districts in Ohio. The 79-21 margin depends on both communities voting at high Democratic loyalty. The incumbent must speak to each community's specific concerns while sustaining a unifying economic and housing frame that crosses racial lines." },
        { name: "Single-Community Campaign Framing", tag: "avoid", why: "In a district where Black and white communities are nearly equal in population, a campaign that appears to speak primarily to one community at the expense of the other produces resentment that can erode turnout. Lead with the unifying economic and housing frame and layer in community-specific engagement, not the reverse." },
        { name: "Complacency at 79-21", tag: "avoid", why: "A 79-21 margin can mask declining turnout — the real risk in a safe seat is not losing but failing to mobilize the full coalition that makes this district a reliable asset for statewide and countywide races. Active constituent engagement sustains the participation floor that the 79-21 result reflects." }
      ],
      memoHeadline: "Nearly evenly Black and white at 79-21. The biracial coalition holds together on housing and economic security — sustain it deliberately.",
      memoParagraphs: [
        "HD-21 is one of Ohio's most evenly biracial legislative districts: 47.8% Black and 44.4% white in a Cleveland seat that Eric Synenberg held 79-21 in 2024. At $60K income, 36% college, and 42% renters, this is a working-to-middle-class district where the Democratic coalition is built on cross-racial economic solidarity — and where maintaining that coalition requires intentional attention to both communities.",
        "Housing affordability is the primary cross-racial unifier. At 42% renters across a district split nearly evenly between Black and white households, the cost of housing is a shared concern that creates common political ground. The incumbent's record on tenant protections and housing investment must be visible and specific in both Black and white neighborhoods.",
        "The 79-21 margin reflects high Democratic performance across both communities — and sustaining that performance requires more than electoral infrastructure. Year-round constituent engagement, visible legislative work on economic and housing priorities, and accessible district office presence sustain the civic trust that produces the turnout floor this margin represents."
      ],
      memoBullets: [
        "Housing affordability is the cross-community anchor. Make the incumbent's record specific and visible in both Black and white neighborhoods — the same issue, communicated in community-appropriate terms for each constituency.",
        "Black community civic infrastructure is the turnout foundation — partner with local churches, civic organizations, and community institutions year-round.",
        "White working-class constituent engagement must be equally visible. Town halls, economic resource events, and accessible office presence in white working-class neighborhoods sustain cross-racial coalition loyalty.",
        "Sustain year-round engagement. The 79-21 margin is a starting point for statewide coalition-building, not a reason to disengage between elections."
      ]
    }
  },
  {
    id: "oh-hd-22",
    name: "Ohio House District 22",
    city: "Cleveland",
    region: "East Cleveland / Warrensville Heights",
    type: "state house district",
    incumbentName: "Darnell T. Brewer",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 45.4% renters and $65K income in a majority-Black Cleveland district, housing affordability is the most widely shared economic concern. Anti-displacement policy, tenant protections, and affordable housing investment are both the most urgent constituent needs and the most coherent cross-racial organizing frame in a district that is 52% Black and 40% white." },
        { name: "Black Community Turnout Infrastructure", tag: "lean-into", why: "As a majority-Black district with an 86-14 margin, HD-22's electoral value to the broader Ohio Democratic coalition is entirely a function of Black voter participation. Year-round civic infrastructure — community partnerships, accessible constituent service, and non-election-year engagement — is the investment that sustains this seat's contribution to statewide and Cuyahoga County margins." },
        { name: "Economic Opportunity & Workforce Investment", tag: "lean-into", why: "At $65K income and 49.5% college — unusually high for a majority-Black urban district — HD-22 has a working-to-professional class mix where economic mobility and workforce investment are active concerns. The incumbent's legislative record on economic opportunity and workforce development must be specific and locally visible." },
        { name: "White Community Engagement", tag: "careful", why: "At 39.6% white in a majority-Black district, the white community is a meaningful coalition contributor whose engagement should not be taken for granted. Constituent services and outreach in white neighborhoods sustains the cross-racial loyalty that produces 86% Democratic performance across a mixed district." },
        { name: "Neglecting Constituent Service in a Safe Seat", tag: "avoid", why: "An 86-14 margin can produce organizational complacency. The real risk is not losing the seat but failing to sustain the turnout and engagement that makes HD-22 a reliable asset for every race above the district. Active year-round constituent service is the non-negotiable foundation of a high-participation district." }
      ],
      memoHeadline: "86-14 in a majority-Black, 50%-college Cleveland district. High education, high renter rate — sustain the coalition with visible economic and housing work.",
      memoParagraphs: [
        "HD-22 is a majority-Black Cleveland district that Darnell Brewer held 86-14 in 2024. At $65K income, 49.5% college, 45.4% renters, 51.5% Black, and 39.6% white, this is an unusually high-education majority-Black urban district — a profile that reflects both the district's geographic location in the Cleveland university and cultural corridor and its genuinely diverse working-to-professional class composition.",
        "Housing affordability is the primary constituent concern. At 45% renters across a mixed-income district, the cost of housing affects Black, white, and other community members simultaneously. The incumbent's record on anti-displacement policy and tenant protections is the most coherent cross-racial organizing frame and the most tangible evidence of representational effectiveness.",
        "The 49.5% college rate is the distinctive characteristic of HD-22 among majority-Black Cleveland districts. This means a substantial professional class with economic mobility concerns, a higher baseline civic engagement rate, and a community that expects substantive policy engagement from its representative — not just constituency service."
      ],
      memoBullets: [
        "Housing affordability is the top legislative priority. Make the record specific: named protections, named investments, named votes. High-college residents will research the record.",
        "Year-round Black civic infrastructure — church partnerships, community organization relationships, accessible constituent services — sustains the turnout foundation that makes HD-22 a reliable Democratic asset.",
        "White community engagement in a majority-Black district requires intentional presence. Town halls, economic events, and accessible office hours in white neighborhoods sustain the cross-racial coalition loyalty that produces the 86% margin.",
        "Economic opportunity and workforce investment are the professional-class policy priorities. Connect the incumbent's record on these issues to the real economic mobility concerns of a 50%-college district."
      ]
    }
  },
  {
    id: "oh-hd-23",
    name: "Ohio House District 23",
    city: "Cleveland",
    region: "Garfield Heights / Parma (South Cuyahoga)",
    type: "state house district",
    incumbentName: "Daniel P. Troy",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Black Community GOTV — the Decisive Margin", tag: "lean-into", why: "At 11.5% Black in a 53-47 Cleveland seat, the Black community is the margin. In a district this close, a 3-4 point drop in Black turnout or loyalty flips the seat. Year-round civic infrastructure in Black neighborhoods — not October mobilization — and visible constituent service that Black voters can connect to their daily lives is the hold-the-seat priority." },
        { name: "Retirement Security & Healthcare Costs", tag: "lean-into", why: "At median age 44.6 — the oldest district in this batch — a large share of HD-23 voters are approaching or entering retirement. Medicare, Social Security, drug pricing, and pension security are high-salience cross-partisan concerns that can hold soft Republican white voters and mobilize the Democratic base simultaneously. Troy's record on these issues is the primary contrast." },
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $71K income and 32% college in a predominantly white Cleveland suburb, trade job quality, wages, and economic investment are the primary working-class concerns. A locally grounded economic message tied specifically to Troy's record keeps white working-class voters from drifting to a Republican challenger who runs on local identity." },
        { name: "National Democratic Brand", tag: "avoid", why: "A 47% Republican performance in a Cleveland D-held suburb with a significant white working-class electorate means nationalizing the race activates the Republican base without adding Democratic votes. Run on Troy's local record and local identity. The contrast must be Hocevar's record versus what Troy has done for HD-23 specifically." },
        { name: "Neglecting the Older Voter Cohort", tag: "avoid", why: "At median age 44.6, this is the oldest Cleveland district in this batch. Retirement security concerns are not supplemental to the campaign message — they are the primary cross-partisan opening with older white working-class voters who are soft Republicans or soft Democrats. A campaign that does not speak directly to Medicare and drug costs misses the highest-ROI persuasion opportunity in HD-23." }
      ],
      memoHeadline: "53-47 in Cleveland's oldest suburb with 11.5% Black voters and a 44.6-year median age. Black GOTV plus retirement security holds this seat.",
      memoParagraphs: [
        "HD-23 is the most competitive Democratic-held seat in the Cleveland region of this batch. Daniel Troy won 53-47 in 2024 in a predominantly white Cleveland suburb with $71K income, 32% college, 11.5% Black, and median age 44.6. At six points, this is a genuine hold challenge in 2026, and every coalition element is load-bearing.",
        "The Black community at 11.5% is the margin. In a 53-47 seat, Black voter turnout and loyalty is not one priority among several — it is the difference between holding and losing. Year-round Black civic infrastructure, visible constituent service in Black neighborhoods, and early GOTV investment are what hold HD-23. This community must see itself reflected in the incumbent's work year-round, not just in campaign season.",
        "The 44.6-year median age creates a specific and powerful cross-partisan opening: retirement security. Medicare, drug pricing, pension protection, and Social Security are concerns that cut across partisan identity for voters who are 5-15 years from retirement. Troy's record on these issues versus the Republican position is the most credible persuasion frame for white working-class voters who are soft partisans."
      ],
      memoBullets: [
        "Black community GOTV is the top priority — year-round, community-rooted, and treated as the margin variable it actually is. Every coalition element matters in 53-47, but this community's performance is the foundation.",
        "Retirement security is the cross-partisan persuasion frame. Medicare, drug costs, and pension protection are the issues that can hold soft Republican white voters in a 44.6-median-age working-class suburb. Pull Troy's specific record and make it local.",
        "Economic message for white working-class voters must be hyper-local. What has Troy done for HD-23 workers specifically? That's the question the campaign must answer before the opponent does.",
        "Do not nationalize the race. Run on Troy's local record versus the opponent's position on local issues. A nationalized frame in this district activates a credible Republican constituency."
      ]
    }
  },
  {
    id: "oh-hd-24",
    name: "Ohio House District 24",
    city: "Cincinnati",
    region: "Cincinnati Urban Core (Walnut Hills / Avondale)",
    type: "state house district",
    incumbentName: "Dani Isaacsohn",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 65% renters — the highest renter rate in Cincinnati — and $50K median income, housing cost burden is the defining daily reality for the vast majority of HD-24 residents. Anti-displacement policy, tenant protections, and affordable housing investment are simultaneously the most urgent constituent need and the most powerful cross-racial organizing frame in a diverse district where nearly half are Black and nearly half are white." },
        { name: "Black Community Turnout Infrastructure", tag: "lean-into", why: "At 38.1% Black in a 73-27 Cincinnati seat, the Black community is the coalition anchor. The 73-27 margin reflects strong Black Democratic performance — sustaining it requires year-round civic infrastructure, visible constituent service, and a legislative record that Black voters can tangibly connect to housing stability and economic security in their neighborhoods." },
        { name: "Economic Opportunity & Wages", tag: "lean-into", why: "At $50K median income and median age 31.6 — one of the youngest districts in this batch — economic opportunity and wage growth are the defining concerns of a young, working-class, multiracial population that is just beginning to build financial stability. Workforce investment, wage floors, and economic access are unifying frames across the district's racial diversity." },
        { name: "Hispanic Community Engagement", tag: "careful", why: "At 6.2% Hispanic in a Cincinnati urban seat, the Latino community is a meaningful and likely underorganized part of the coalition. Spanish-language outreach and culturally specific constituent services are the investment that sustains this community's contribution to the Democratic margin and builds loyalty that compounds across cycles." },
        { name: "Complacency at 73-27", tag: "avoid", why: "A 73-27 margin can mask declining turnout in an off-year cycle — the real risk in a Cincinnati urban seat is not losing but failing to mobilize the full coalition at the level that makes HD-24 a reliable asset for Hamilton County and statewide races. Active year-round constituency engagement is the insurance policy against participation erosion." }
      ],
      memoHeadline: "65% renters, $50K income, multiracial Cincinnati urban seat. Housing is survival here — lead with it in everything.",
      memoParagraphs: [
        "HD-24 is Cincinnati's highest-renter district at 65% — a multiracial urban seat that Dani Isaacsohn held 73-27 in 2024. At $50K median income, median age 31.6, 38.1% Black, 49.3% white, and 6.2% Hispanic, this is a young, economically stressed, diverse district where housing affordability is not a policy priority but a daily survival concern.",
        "The 65% renter rate at $50K income means a majority of HD-24 residents are renting in conditions of financial stress. Anti-displacement policy, tenant protections, and affordable housing investment are the issues that most directly connect the incumbent's legislative work to what residents experience. In a district this renter-heavy, every housing vote is a constituent service vote.",
        "The Black community at 38.1% is the coalition anchor, and the district's young median age (31.6) means a large proportion of Black, white, and Hispanic residents are in the early stages of economic and residential stability. Economic opportunity, wage growth, and housing security are the generational concerns that unify this diverse young population around a common Democratic agenda."
      ],
      memoBullets: [
        "Housing is the top legislative priority and the top organizing frame. Make the record specific: named anti-displacement protections, named affordable developments, named tenant protection votes. In a 65%-renter district, this is constituent service.",
        "Black community civic infrastructure — church and civic organization partnerships, year-round GOTV, accessible constituent services in Black neighborhoods — sustains the turnout foundation that makes HD-24 a reliable Democratic asset.",
        "Spanish-language outreach for the 6.2% Hispanic community should be an ongoing program. In a young, diverse urban district, this community's engagement builds the coalition depth that compounds over cycles.",
        "Economic opportunity and wage growth are the generational frame for young working-class voters across all three communities. Connect the incumbent's record on wages and workforce investment to what young HD-24 residents are actually earning."
      ]
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
  {
    id: "oh-hd-26",
    name: "Ohio House District 26",
    city: "Cincinnati",
    region: "Cincinnati West Side (Price Hill / Westwood)",
    type: "state house district",
    incumbentName: "Sedrick Denson",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing",             tag: "lean-into", why: "41% of residents rent in a Cincinnati market under sustained price pressure. Cost burden cuts across racial lines here — frame every housing vote around keeping people in their homes and holding landlords accountable." },
        { name: "Economic Opportunity & Wages",   tag: "lean-into", why: "Despite a 44% college-education rate — well above the state average — median income signals wage compression. Voters are educated but not economically secure, and they know it. Workforce investment and living-wage policy speak directly to that gap." },
        { name: "Education Funding",              tag: "lean-into", why: "A multiracial district with families at every income level depends on Cincinnati Public Schools. Connect state education policy to specific local impacts — school closures, program cuts, per-pupil funding — that voters can name." },
        { name: "Public Safety",                  tag: "careful",   why: "A district that is 54% white and 37% Black carries different relationships to policing on different blocks. Lead with community investment, mental health crisis response, and accountability structures. Enforcement-first framing fractures the coalition." },
        { name: "Business Tax Incentives Without Community Strings", tag: "avoid", why: "In a district where education hasn't translated to economic security for many residents, broad corporate tax relief reads as the wrong priority. Any economic development language must be anchored in local hiring requirements, affordable housing commitments, or direct community benefit." }
      ],
      memoHeadline: "A 69-point margin is a mandate, not a guarantee. Coalition discipline wins this seat.",
      memoParagraphs: [
        "HD-26 is a solidly Democratic Cincinnati district whose strength comes from a carefully balanced coalition of white and Black voters, professionals and working families, renters and homeowners. Denson's 69-31 margin in 2024 reflects that coalition holding together — your job is to keep it that way.",
        "The economic story is the district's quiet tension: 44% of residents are college-educated, well above the state average, but median income at $70,000 suggests that education has not fully translated into economic security. That gap is your opening — workforce development, wage floors, and housing affordability connect across racial lines.",
        "With 41% renters in a city where rents have risen sharply, housing is the issue most likely to move low-propensity voters into your column. Every conversation about development, zoning, or city investment should include a concrete affordability commitment."
      ],
      memoBullets: [
        "Coalition discipline is everything here. A campaign that speaks primarily to one racial constituency will underperform — your outreach calendar, coalition partners, and messaging must be genuinely multiracial.",
        "Connect education policy to economic outcomes at the district level: voters who are educated but underemployed know their situation and respond to candidates who name it specifically.",
        "Mobilization, not persuasion, is the primary campaign investment. The votes are here — the task is making sure they show up."
      ]
    }
  },
  {
    id: "oh-hd-27",
    name: "Ohio House District 27",
    city: "Cincinnati",
    region: "Cincinnati Eastern Suburbs (Hyde Park / Mt. Lookout)",
    type: "state house district",
    incumbentName: "Rachel Baker",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Education Quality & Funding",   tag: "lean-into", why: "With 59% of adults holding college degrees, this is a district of parents who vote on school quality. Education funding equity resonates on both values and property-value grounds — what happens to public schools here affects neighborhoods and home values directly." },
        { name: "Reproductive Rights",           tag: "lean-into", why: "The suburban college-educated shift toward Democrats is substantially driven by this issue. Baker's 56-44 win reflects a district that has already moved. Reproductive rights motivate your base and alienate none of your persuadable voters here. Don't soften the message." },
        { name: "Quality-of-Life Infrastructure", tag: "lean-into", why: "High-income suburban homeowners are invested in the quality of their immediate environment — trails, parks, transit, road quality, stormwater management. Frame infrastructure investment around what it does for the neighborhood, not abstract economic growth." },
        { name: "Economic Policy Framing",       tag: "careful",   why: "At $97,883 median income, this is one of Ohio's wealthiest districts. Messaging that sounds punitive toward high earners or successful businesses will push persuadable suburban independents back toward the Republican column. Lead with investment and competitiveness, not redistribution." },
        { name: "Populist Anti-Wealth Rhetoric", tag: "avoid",     why: "A significant share of voters here are business owners, executives, and professionals who are open to Democrats on values but not on economic positioning that sounds hostile to their class. This district moved on rights and governance — campaign there, not on economic grievance." }
      ],
      memoHeadline: "Baker won 56-44 on values, not economics. Don't let the coalition drift back.",
      memoParagraphs: [
        "HD-27 is a wealthy, highly educated Cincinnati suburb that has been moving toward Democrats on the strength of the college-educated suburban shift. Baker's 2024 win is a signal — not a guarantee. At 56-44, this seat is genuinely competitive and will not hold itself.",
        "The path to victory runs through values voters: college-educated suburbanites who crossed over on reproductive rights, education policy, and the character of governance. These are not ideological Democrats — they are competence-and-values voters who can be recaptured by a strong moderate Republican. Your job is to make that difficult.",
        "Economic messaging must be calibrated to a high-income district. Investments in schools, infrastructure, and quality of life land well. Rhetoric that sounds like it's targeting the professional class creates unnecessary friction with exactly the voters you need to hold.",
        "The district's growing diversity — 15.4% Black, 4.5% Hispanic, 4.1% Asian — represents an emerging constituency that is likely underregistered relative to its share of the population. Early investment in outreach to these communities is a low-cost force multiplier in a competitive seat."
      ],
      memoBullets: [
        "Reproductive rights is your strongest mobilizer — lead with it, don't soften it. The suburban coalition you need is already motivated by it.",
        "Host candidate forums on education and school funding. High-education districts reward depth and specificity — generic talking points fall flat with this audience.",
        "Don't run against wealth. Run on competence, investment, and quality of life. That's the message that wins persuadable suburban independents in this district."
      ]
    }
  },
  {
    id: "oh-hd-28",
    name: "Ohio House District 28",
    city: "Cincinnati",
    region: "Cincinnati Northern Suburbs (Blue Ash / Montgomery)",
    type: "state house district",
    incumbentName: "Karen Brownlee",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Education & School Quality",      tag: "lean-into", why: "At 48% college-educated with a median age of 41.5, this is a district of established households with school-age children and strong opinions about public education. Connect state funding policy to local school impacts voters can name — specific buildings, programs, and teacher ratios." },
        { name: "Healthcare Costs & Economic Security", tag: "lean-into", why: "An older median age and diverse household composition mean healthcare costs are a pocketbook concern across income levels. Connect affordability to the stability of working and middle-class families who have built roots here and can't absorb unexpected medical expenses." },
        { name: "Neighborhood Investment & Infrastructure", tag: "lean-into", why: "Homeowners in a diverse suburban district care about the quality of shared public goods — roads, parks, school buildings, broadband. Frame infrastructure spending around neighborhood quality and property values, not abstract economic growth." },
        { name: "Racial Equity Framing",          tag: "careful",   why: "A district that is 69% white but 18% Black and 7% Hispanic requires messaging that addresses equity without signaling that one community's needs outweigh another's. Lead with universal investment — schools, housing, health — that benefits all residents visibly." },
        { name: "Local Zoning & Development Positioning", tag: "avoid", why: "Homeowners in competitive suburban districts are often divided on development — some welcome it, others fear displacement or neighborhood change. Avoid staking out strong positions on local zoning without block-level research. Strong positions cut both ways here." }
      ],
      memoHeadline: "A multiracial homeowner district won on competence. Active maintenance required.",
      memoParagraphs: [
        "HD-28 is a competitive Cincinnati suburban seat with a genuinely diverse population — nearly a third of residents are people of color — spanning a range of household types and economic situations. Brownlee's 56-44 win in 2024 is a floor, not a ceiling, and this seat requires active maintenance.",
        "The district's older median age and homeowner majority shape its issue set. These are voters who have built something — a home, a career, a neighborhood — and their political questions center on protecting and improving that stability. Healthcare costs, school quality, and neighborhood investment all connect to that frame.",
        "The racial diversity of HD-28 is an asset if you manage it well. The district is not a majority-minority seat — it's a majority-white district with a substantial multiracial coalition that you need to turn out and hold. Universal framing around shared investment works better here than targeted equity messaging alone."
      ],
      memoBullets: [
        "Know the neighborhood-level differences in the district — homeowner concerns in a suburb with a 41-year median age are not the same on every block. Local specificity is credibility.",
        "Healthcare is an underused Democratic issue in suburban districts. Connect it to the real pocketbook anxiety of families who have good jobs but face unexpected and unaffordable medical costs.",
        "Keep the multiracial coalition intact through universal investment framing — education, healthcare, infrastructure — that speaks to all communities without creating a hierarchy of priorities."
      ]
    }
  },
  {
    id: "oh-hd-29",
    name: "Ohio House District 29",
    city: "Cincinnati",
    region: "Cincinnati Eastern Exurbs (Clermont County)",
    type: "state house district",
    incumbentName: "Cindy Abrams",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Kitchen-Table Economic Issues",  tag: "lean-into", why: "At $73,352 median income with only 27% college education, this is a district of working and middle-class families whose concerns are immediate — wages, healthcare costs, utility bills. Lead with tangible economic relief, not ideological framing. This is where you have ground." },
        { name: "Healthcare Affordability",       tag: "lean-into", why: "A working-class homeowner district with below-average college education rates has significant exposure to healthcare costs. This is a universal concern that cuts across the racial makeup of the district and gives Democrats a genuine opening even with persuadable Republican voters." },
        { name: "Local Jobs & Economic Security", tag: "lean-into", why: "Concrete commitments to local job creation, workforce training, and economic investment in Hamilton County speak to voters who don't follow policy abstractions but know whether their neighborhood is thriving. Connect economic policy to specific local employers and industries." },
        { name: "Policing & Public Safety",       tag: "careful",   why: "With 25% Black residents and a working-class white majority, policing is a fault line. Don't lead with either community's frame. Focus on community investment, mental health response, and response times — concerns that are genuinely shared across racial lines in working-class suburbs." },
        { name: "Urban Progressive Policy Agenda", tag: "avoid",   why: "This is a working-class suburban seat where urban-coded language — abolition, equity frameworks, progressive cultural positioning — is a liability with the white working-class voters you need to persuade. Keep every message grounded in economic security and local community outcomes." }
      ],
      memoHeadline: "You're in deficit territory. The path is economic, and it runs through voters who are frustrated but persuadable.",
      memoParagraphs: [
        "HD-29 is Republican-held at 57-43 — a genuine lean, but not a blowout. Abrams has a structural advantage in this working-class, predominantly homeowner district where Democrats have struggled with cultural positioning. The gap is closeable with the right economic message and the right candidate who can hold both sides of the racial coalition.",
        "The district's makeup — 67% white, 25% Black — tells you that winning requires two things: running up the score with Black voters who are likely underperforming turnout-wise, and peeling off a slice of working-class white voters who are open to economic arguments but closed to cultural ones. Both require disciplined, separate, and complementary strategies.",
        "Healthcare costs, wages, and economic security are your common ground. These are universally felt concerns in a district where neither group is particularly prosperous. Avoid anything that sounds like it came from a college campus — this district responds to authenticity, local rootedness, and economic specificity."
      ],
      memoBullets: [
        "Black turnout in HD-29 is likely leaving votes on the table. A dedicated GOTV operation in underperforming Black precincts is your clearest path to narrowing the gap without spending resources on unlikely persuasion targets.",
        "Persuadable white working-class voters respond to economic credibility, not party affiliation. Lead with specific, local economic commitments — not national Democratic messaging.",
        "Healthcare is your safest bipartisan opener on the doors. Use it to establish trust before introducing other issues that carry more partisan baggage."
      ]
    }
  },
  {
    id: "oh-hd-30",
    name: "Ohio House District 30",
    city: "Akron",
    region: "Akron Exurbs / Summit County Rural",
    type: "state house district",
    incumbentName: "Mike Odioso",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Local Services & Homeowner Quality of Life", tag: "lean-into", why: "In a district that is 80% homeowners with solid median income, voters are invested in what local and state government delivers — road quality, school funding, broadband, stormwater management. Frame government investment around the tangible return on residents' tax dollars rather than abstract policy." },
        { name: "Economic Security & Retirement",  tag: "lean-into", why: "With a median age of 38.9 and a predominantly homeowner, working-class white population, concerns about retirement security, pension stability, and healthcare costs approaching middle age are genuine and underused by Democrats. Social Security and Medicare cut through where cultural messaging doesn't." },
        { name: "Local Manufacturing & Jobs",      tag: "lean-into", why: "Summit County's manufacturing heritage means voters respond to candidates who speak credibly about protecting local industry and keeping jobs from leaving the region. Connect economic policy to specific employers and industries voters actually work for — not abstract growth metrics." },
        { name: "Social Issues",                   tag: "careful",   why: "At 86% white and 69-31 Republican, this district holds conservative views on cultural issues. Avoid leading with them or being drawn onto that terrain. If pressed, redirect to economic outcomes — that's where you have standing and where persuadable voters are actually reachable." },
        { name: "Progressive Identity Framing",    tag: "avoid",     why: "Urban and cultural progressive messaging is a near-total liability in a district this homogeneous and Republican. Language that signals alignment with urban Democratic orthodoxy — regardless of the underlying policy merit — will cost you votes you cannot afford to lose from a 69-31 deficit." }
      ],
      memoHeadline: "This is Republican terrain. Survive, build, and wait for a wave or a weaker opponent.",
      memoParagraphs: [
        "At 69-31, HD-30 is one of the most challenging districts in this portfolio for a Democratic candidate. Odioso's margin reflects a structural reality: this is a predominantly white, homeowner-majority, working-class suburban district that has moved firmly into the Republican column on cultural grounds. The Democratic path is narrow — but narrow doesn't mean zero.",
        "The playbook in a district this difficult is disciplined economic populism: Medicare and Social Security, prescription drug costs, local infrastructure, good jobs. These are issues where Democratic policy actually delivers for this district's residents and where the Republican Party's national record is a genuine vulnerability — one that can be exploited without triggering cultural alarm bells.",
        "The goal when you are not expected to win is not to run for the center on everything. It is to run a credible, locally grounded campaign that builds name recognition, tests economic messaging, identifies your best precincts, and positions you for a more favorable cycle. Don't chase persuasion targets that aren't there — invest in base turnout and earned media."
      ],
      memoBullets: [
        "Do not run a national Democratic campaign in this district. Every mail piece, door script, and digital ad must be locally grounded and economically focused — nothing that can be branded as coastal or cultural.",
        "Social Security, Medicare, and prescription drug costs are your three strongest openings with persuadable voters. They connect to real economic anxiety in an aging, working-class homeowner district without triggering cultural resistance.",
        "Identify the precincts where Democratic performance has historically been strongest and build outward from that base. Don't burn field resources on precincts that are not reachable — consolidate what you have and make the Republican spend to defend it."
      ]
    }
  },
  {
    id: "oh-hd-31",
    name: "Ohio House District 31",
    city: "Akron",
    region: "Akron Suburbs (Stow / Tallmadge)",
    type: "state house district",
    incumbentName: "Bill Roemer",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Education Quality & Funding",      tag: "lean-into", why: "At 49% college-educated with a median income over $105,000, this is a district of established professional households who vote on school quality as both a values issue and a property-value issue. Connect state education funding policy to Cuyahoga County's specific school districts and outcomes." },
        { name: "Reproductive Rights",              tag: "lean-into", why: "High-income, highly educated suburban districts have moved sharply toward Democrats on this issue. At 47-53, a motivated base and persuadable college-educated women represent your clearest path to flipping the seat. Don't equivocate — this is a mobilizing issue for your coalition." },
        { name: "Healthcare & Retirement Security", tag: "lean-into", why: "A median age of 45.4 means this district is full of households actively planning for retirement and facing peak healthcare costs. Medicare security, prescription drug pricing, and long-term care policy speak directly to where these voters' financial attention is." },
        { name: "Tax & Economic Policy Framing",   tag: "careful",   why: "At $105,000 median income, this is a high-earning district. Messaging that sounds like it targets the professional class economically will push persuadable voters back to Roemer. Frame economic policy around investment, competitiveness, and fairness — not redistribution." },
        { name: "Cultural Populism",               tag: "avoid",     why: "A high-income, highly educated suburban district outside Akron has rejected Trumpian cultural populism at the margin — the 47% Democratic floor here reflects that. But candidates who overcorrect into urban-progressive cultural framing lose the moderate suburban voters who are your pickup opportunity." }
      ],
      memoHeadline: "Three points separates you from flipping this seat. The margin is in college-educated suburban women.",
      memoParagraphs: [
        "HD-31 is a winnable Republican-held suburban district. Harris ran 47-53 in 2024 — that's a competitive baseline, not a structural deficit. This is the profile of a seat that flips in a favorable cycle or with a candidate who out-performs the top of the ticket among suburban swing voters.",
        "The district's profile — $105,000 median income, 49% college-educated, median age 45.4, 85% homeowners — tells you exactly who decides it: educated suburban households, heavily professional, with older children or approaching retirement. These voters crossed for Biden in 2020 and are persuadable on the right issues. Reproductive rights and education quality are where they are moveable.",
        "This is a campaign won through quality of candidate and quality of message, not through base mobilization alone. Your base is already voting for you at a high rate. The incremental votes are persuadables who are open to you on values and closed to you on anything that sounds ideologically extreme.",
        "Roemer won because he held enough college-educated moderates. Your job is to pull them back — on reproductive rights, on school funding, on healthcare security — while not giving them any reason to revert to partisan habit."
      ],
      memoBullets: [
        "Reproductive rights is your sharpest persuasion tool in this district. College-educated suburban women at age 45 in a high-income household are among the voters most moved by this issue — use it deliberately and consistently.",
        "Healthcare and retirement security open doors that economic populism closes. These voters have good jobs and assets to protect — they want security, not redistribution.",
        "Candidate quality matters here more than almost anywhere. A local, credible, non-ideological profile is a prerequisite. This seat is lost by candidates who let the opponent define them as extreme before Labor Day."
      ]
    }
  },
  {
    id: "oh-hd-32",
    name: "Ohio House District 32",
    city: "Akron",
    region: "Akron Southwest (Barberton / Norton)",
    type: "state house district",
    incumbentName: "Jack K. Daniels",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Kitchen-Table Economic Issues",   tag: "lean-into", why: "At $60,896 median income with only 23% college education, this is a working- and middle-class district where economic anxiety is real and immediate — wages, grocery prices, utility costs, healthcare bills. These are the issues that get doors opened and listeners leaning in." },
        { name: "Local Jobs & Manufacturing",      tag: "lean-into", why: "Summit County's industrial legacy means voters in a district like this judge candidates by whether they're credible on protecting local jobs and industry. Specific commitments to Ohio manufacturing, supply chains, and workforce training carry more weight than national economic framing." },
        { name: "Healthcare Affordability",        tag: "lean-into", why: "Working-class households without post-secondary degrees face disproportionate exposure to uninsured and underinsured medical costs. This is a genuine pocketbook vulnerability for the Republican coalition here — and one where Democratic policy is substantively stronger." },
        { name: "Law Enforcement & Public Safety", tag: "careful",   why: "In a majority-white, working-class district that votes Republican, policing is a cultural marker as much as a policy issue. Do not lead with reform framing. Focus on community safety outcomes — response times, resources, local accountability — without the national movement vocabulary." },
        { name: "National Progressive Agenda",    tag: "avoid",     why: "Urban-coded cultural messaging is a disqualifying liability in a district this demographically homogeneous and this far into Republican territory. Anything that signals alignment with national progressive orthodoxy — on policing, identity, or economic redistribution — is a floor-collapsing liability." }
      ],
      memoHeadline: "You're down 14 points in a working-class district. Economic credibility is the only way in.",
      memoParagraphs: [
        "HD-32 is Republican-held at 57-43, and Daniels's margin reflects a structural reality: this is a low-education, majority-homeowner, working-class suburban district outside Akron that has moved firmly toward the Republican Party on cultural grounds over the past decade. The Democratic floor here requires economic arguments, not partisan ones.",
        "The playbook in a district like this is relentless economic specificity. Not general economic populism — specific, local, credible commitments to the employers, industries, and working families that voters here actually know. What's happening to the plant in their town. What prescription drug costs are doing to their parents. What the school levy means for their kids.",
        "Black voters at 11% of the district are likely underperforming their potential turnout. A targeted, respectful GOTV operation in majority-Black precincts — without broadcasting it as a racial organizing strategy in a district where that carries risk — is worth the investment. Find your votes where they exist."
      ],
      memoBullets: [
        "Do not nationalize this race. Every message must be Summit County-specific, candidate-centric, and economically focused. Generic Democratic brand association hurts you here.",
        "Healthcare costs are your strongest bipartisan persuasion issue. Frame it around real families, real bills, and the specific gap between what people pay and what they get — not insurance industry abstractions.",
        "Identify your best precincts early — where has Democratic performance been strongest historically? Invest field resources there and don't burn time on precincts that require a 20-point swing."
      ]
    }
  },
  {
    id: "oh-hd-33",
    name: "Ohio House District 33",
    city: "Columbus",
    region: "Columbus Near East Side (Eastmoor / Near East)",
    type: "state house district",
    incumbentName: "Veronica Sims",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Renter Stability", tag: "lean-into", why: "52% of residents rent in a district where $46,120 median income means cost burden is not a marginal stress — it's a defining feature of daily life. Every conversation about development, zoning, or city investment must include a concrete affordability commitment. This is the unifying issue across the district's racial and income diversity." },
        { name: "Economic Opportunity & Wages",         tag: "lean-into", why: "Below-median income combined with only 24% college education signals a district where many residents are working hard and not getting ahead. Workforce development, apprenticeship programs, and living-wage policy speak to that reality across racial and generational lines." },
        { name: "Education & Youth Investment",         tag: "lean-into", why: "A multiracial district with a median age of 36.5 includes substantial numbers of households with school-age children across income levels. Connect state education funding to what Columbus City Schools can actually deliver for kids in this district — specific programs, staffing levels, building conditions." },
        { name: "Public Safety & Community Investment", tag: "careful",   why: "In a majority-minority-adjacent district where residents span income levels and backgrounds, policing carries different weight on different blocks. Lead with community investment, mental health response, and neighborhood stability — not enforcement rhetoric. Get specific about what safety looks like block by block." },
        { name: "Business Development Without Community Benefit", tag: "avoid", why: "In a below-median-income, majority-renter district, development rhetoric that doesn't include explicit displacement protection and affordability commitments reads as a threat, not an opportunity. Never discuss economic growth without naming its direct benefit to current residents." }
      ],
      memoHeadline: "Uncontested means the base is yours. The job is keeping them engaged between elections.",
      memoParagraphs: [
        "HD-33 is a safe Democratic seat — Sims ran uncontested in 2024, and the district's demographics make it structurally durable. Nearly half renters, below-median income, multiracial composition, and a young median age create a base that reliably votes Democratic when mobilized. The strategic question is not whether you win, but whether your constituents feel served.",
        "The economic story of this district is the gap between effort and security. At $46,120 median income — below the Ohio median — with a significant renter majority, residents are working but not building wealth. Affordable housing, wage floors, and workforce investment are not niche asks here; they are the lived experience of a majority of the district.",
        "A diverse, younger district needs engagement infrastructure that works year-round, not just at election time. Constituent service, visible presence, and responsiveness to neighborhood-level concerns build the kind of trust that turns a good margin into an enduring coalition. The risk in a safe seat isn't losing — it's drifting from the community you represent."
      ],
      memoBullets: [
        "Turnout is your only real variable. Build a year-round constituent engagement operation — events, communication, service visibility — that keeps low-propensity voters connected to the office between election cycles.",
        "Housing is your most concrete policy issue. Take specific positions on local development projects — not just general affordability — so voters know where you stand when it hits their neighborhood.",
        "The Asian population at 6.1% is notable and likely underrepresented in traditional outreach. Invest in multilingual communications and culturally specific engagement as the district's diversity continues to grow."
      ]
    }
  },
  {
    id: "oh-hd-34",
    name: "Ohio House District 34",
    city: "Cleveland",
    region: "Willoughby / Lake County West",
    type: "state house district",
    incumbentName: "Derrick Hall",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Education Quality & Funding",       tag: "lean-into", why: "At 49% college-educated with strong median income, this is a district of professional homeowners who vote on school quality. Connect state education funding decisions to specific impacts on Cuyahoga County schools — per-pupil funding, teacher pay, building conditions — and this issue carries across partisan lines." },
        { name: "Reproductive Rights",               tag: "lean-into", why: "Hall's 53-47 win in a majority-white, high-income suburban district is largely explained by the college-educated suburban shift on reproductive rights. This issue belongs at the center of your campaign — it motivates your base and is the clearest vulnerability for your Republican opponent." },
        { name: "Healthcare & Economic Security",    tag: "lean-into", why: "A median age of 39.6 in a high-income homeowner district means many residents are in peak earning years and actively managing healthcare costs, college tuitions, and retirement planning simultaneously. Policy that speaks to the stability of professional middle-class households resonates here." },
        { name: "Tax Policy & Government Spending",  tag: "careful",   why: "At $84,963 median income with 85% homeowners, voters here are invested in the efficiency of their tax dollars. Be specific and credible about where money goes. Messaging that sounds like it favors blanket spending increases without accountability will create friction with persuadable fiscal moderates." },
        { name: "Culture-War Positioning",           tag: "avoid",     why: "HD-34 is a culturally moderate suburban district. Hall won by holding center-left professional voters — not by mobilizing an ideological base. Any drift toward culture-war terrain, on either side, gives your opponent the contrast they need to pull moderates back. Stay on competence and economic security." }
      ],
      memoHeadline: "Hall won on competence and reproductive rights. Protect the margin by staying exactly there.",
      memoParagraphs: [
        "HD-34 is a competitive Cleveland suburban seat that Hall won 53-47 — a margin that reflects a high-income, educated district that has moved toward Democrats on values while retaining significant Republican affiliation. This is not a safe seat. It requires active defense every cycle.",
        "The district's profile — $84,963 median income, 49% college-educated, 85% homeowners — defines the electorate you're managing. These are professional suburban voters who care about school quality, healthcare stability, and the quality of governance. They are persuadable in both directions and will cross party lines for a candidate they trust and against one they don't.",
        "Reproductive rights is the structural advantage Democrats have built in districts like this. It is your strongest issue with the suburban women who are the margin of this seat. Don't soften it or bury it in a list of concerns — it should be leading, visible, and unequivocal throughout the campaign."
      ],
      memoBullets: [
        "Defend the 53% actively — don't assume the margin holds. A 6-point win in a wealthy suburb is competitive, not comfortable. Treat every cycle as if it can be lost.",
        "Reproductive rights should anchor your campaign's values contrast. Lead with it on mail, on digital, and at the door — it is the issue most responsible for putting this seat in your column.",
        "Fiscal credibility matters in a high-income homeowner district. Be specific about what you fund, what it costs, and what the return is. Vague spending commitments lose suburban moderates who are on your side on values but skeptical on economic management."
      ]
    }
  },
  {
    id: "oh-hd-35",
    name: "Ohio House District 35",
    city: "Cleveland",
    region: "Mayfield Heights / Lyndhurst (East Cuyahoga)",
    type: "state house district",
    incumbentName: "Steve Demetriou",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Retirement & Financial Security",  tag: "lean-into", why: "At median age 45.4 with 82% homeowners, this district is full of established households approaching or in retirement planning. Social Security, Medicare, pension protection, and prescription drug costs are real concerns — and the Republican Party's record on all of them is a vulnerability that rarely gets used aggressively enough." },
        { name: "Local Infrastructure & Services",  tag: "lean-into", why: "High-income homeowners with long roots in a community care intensely about the quality of public goods — road conditions, school buildings, broadband, water systems. Frame state investment around the specific return to taxpayers in this district. This is the kind of government spending these voters actually support." },
        { name: "Healthcare Costs",                tag: "lean-into", why: "A population skewing toward their mid-40s in a predominantly homeowner district has peak exposure to healthcare system failures — aging parents, high-deductible plans, and the proximity of retirement with its attendant healthcare concerns. Prescription drug pricing and Medicare protection are your safest bipartisan openers." },
        { name: "Social & Cultural Issues",        tag: "careful",   why: "At 92% white and already voting 52% Republican, this district's cultural center of gravity is conservative. Don't lead with social issues that sharpen partisan identity. You win persuadables on economic security, not on cultural positioning. Let your opponent take the extreme ground — don't help them define the terrain." },
        { name: "Urban Policy Transfer",           tag: "avoid",     why: "Policy ideas that read as originating in Columbus, Cleveland, or national Democratic circles are a credibility drain in a homogeneous suburban district that already leans Republican. Everything must be locally grounded and economically anchored. The moment you sound like a regional partisan rather than a Geauga or Lake County candidate, you've lost the room." }
      ],
      memoHeadline: "Five points in a homogeneous suburb. The path is narrow, economic, and entirely about candidate quality.",
      memoParagraphs: [
        "HD-35 is a near-miss: Curtis lost 47.5-52.5 in a 92% white, high-income homeowner district in the Cleveland exurbs. That's a competitive deficit, not an impossible one — but it requires a candidate with deep local roots, economic credibility, and no cultural liabilities. The margin to close is five points among suburban voters who are not ideologically fixed but are habitually Republican.",
        "The district's age profile is the strategic key. A median age of 45.4 with nearly all homeowners means the electorate is heavily concentrated in households that are managing retirement timelines, healthcare costs, and family stability simultaneously. Social Security, Medicare, and prescription drug costs are universally felt concerns in this demographic — and they are where the Democratic record is genuinely stronger.",
        "There is no minority coalition to mobilize here. The path to 50%+1 runs entirely through white suburban ticket-splitters who voted Republican for governor or Senate but are open to crossing over on a candidate who seems competent, local, and not threatening. That is a real population — but it requires a campaign discipline that never gives them a reason to revert."
      ],
      memoBullets: [
        "Candidate profile is the campaign. You need a candidate who grew up here, has community roots, and can credibly claim not to be a Columbus or Cleveland import. That identity inoculates against the cultural-outsider attack before it lands.",
        "Retirement security and healthcare costs are your double-barreled economic opener. Lead with them on every piece of mail and every door conversation — they motivate your base and reach persuadable Republican seniors who are not immune to economic anxiety.",
        "Never give the opponent a cultural contrast to run. The moment the race becomes about national Democratic positioning, you've handed Demetriou the only argument he needs to hold the district."
      ]
    }
  },
  {
    id: "oh-hd-36",
    name: "Ohio House District 36",
    city: "Akron",
    region: "Akron Northern Suburbs (Cuyahoga Falls)",
    type: "state house district",
    incumbentName: "Andrea White",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Renter Stability", tag: "lean-into", why: "Nearly 39% of residents rent in a mixed-income Summit County district where $62,000 median income means cost burden is real across the income spectrum. Connect housing policy to neighborhood stability — the concern that unites renters and modest homeowners who can't afford to move either." },
        { name: "Kitchen-Table Economic Issues",         tag: "lean-into", why: "At $62,126 median income with 35% college education, this is a mixed working- and middle-class district where wage levels, grocery prices, and healthcare costs are immediate concerns. Lounsbury's near-win shows economic anxiety here is addressable — lead with the specific, local, and tangible." },
        { name: "Healthcare Affordability",             tag: "lean-into", why: "A younger median age (37.5) with a multiracial working- and middle-class composition means healthcare cost is broadly felt but hits differently across income levels. Prescription drug pricing and Medicaid expansion are concrete asks with no partisan downside in a district this close." },
        { name: "Policing & Community Safety",          tag: "careful",   why: "A district that is 77% white but 12% Black in a mid-size Ohio city carries real tension around policing. Lead with neighborhood safety outcomes — response times, staffing, community presence — not reform framing. The goal is to hold both communities in a coalition without alienating either." },
        { name: "National Cultural Positioning",        tag: "avoid",     why: "Lounsbury lost by 5 in a competitive district. The votes to close that gap are persuadable working-class whites who respond to economic credibility and recoil from cultural liberalism. Any national Democratic brand association that invites a cultural contrast helps White hold the seat." }
      ],
      memoHeadline: "Four-point loss in a winnable mixed district. The economic message just needs to land harder.",
      memoParagraphs: [
        "HD-36 is genuinely competitive — Lounsbury lost 47.6-52.4, which is close enough that this seat flips with a stronger economic message, a better field operation, or a more favorable cycle. The district's profile is Summit County mixed suburban and working-class, multiracial, with a significant renter population for the area. There is a real coalition here.",
        "The path to 50%+1 runs through two groups: Black voters who may be underperforming turnout potential at 12% of the district, and working-class white voters who are economically persuadable but culturally conservative. These are not the same message, but they are compatible campaigns when run with discipline — economic security for everyone, community safety that speaks to both communities.",
        "Housing and healthcare are your unifying economic issues. Both affect renters and modest homeowners, both affect white and Black households, and both give you a concrete contrast with an opponent whose party's record on each is weak."
      ],
      memoBullets: [
        "Run two parallel operations: GOTV targeting underperforming Black precincts, and economic persuasion targeting working-class white precincts that have historically split tickets. Don't let one crowd out the other.",
        "Housing affordability is the issue that connects renters and modest homeowners without triggering cultural alarm. Lead with neighborhood stability framing — people staying in their communities — not equity or redistribution language.",
        "Close the gap on the doors with healthcare cost specificity. Prescription drug prices and medical bills are universally felt here — they open conversations that partisan mail can't."
      ]
    }
  },
  {
    id: "oh-hd-37",
    name: "Ohio House District 37",
    city: "Cincinnati",
    region: "Anderson Township / Clermont County",
    type: "state house district",
    incumbentName: "Tom Young",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Education Quality & School Funding",   tag: "lean-into", why: "At 44% college-educated and $88,817 median income, this is a high-achieving Cincinnati suburb where parents vote on school quality. Connecting state funding decisions to local district impacts — per-pupil spending, teacher pay, program quality — is the safest bipartisan opening in an uncontested district." },
        { name: "Quality-of-Life Infrastructure",       tag: "lean-into", why: "High-income homeowners at median age 41 care about the quality of shared public goods. Roads, parks, trails, broadband, and green space investment speak directly to what brings and keeps families in a suburb like this — and it's a frame that doesn't require partisan alignment." },
        { name: "Healthcare & Retirement Planning",     tag: "lean-into", why: "A median age of 41.3 in an affluent homeowner district means households are entering peak healthcare cost years while simultaneously planning for retirement. Policy that protects Medicare and controls prescription drug costs has genuine bipartisan resonance even in Republican-held suburban territory." },
        { name: "Economic & Tax Policy",                tag: "careful",   why: "Young ran uncontested in part because the district's wealthy, educated suburban profile is fiscally conservative. Any Democratic challenger must be credible on fiscal management — specific about investments, clear about costs, and not easily characterized as a taxer. The economic contrast must be on value, not volume." },
        { name: "National Democratic Brand Association", tag: "avoid",    why: "This district has never fielded a Democratic candidate recently enough to test the floor — which means the first step is showing up credibly, not signaling ideological alignment. A candidate who leads with national Democratic positioning in an 83% white, high-income Cincinnati suburb will define the ceiling before the campaign begins." }
      ],
      memoHeadline: "No Democrat ran here in 2024. Field a candidate, show up credibly, and find out what the floor actually is.",
      memoParagraphs: [
        "HD-37 was uncontested in 2024 — Young ran without opposition in a district whose demographic profile ($88,817 income, 44% college-educated, 83% white homeowners) suggests it is Republican by habit more than by conviction. That distinction matters. High-income, educated suburban Cincinnati has moved measurably toward Democrats in recent cycles on issues like reproductive rights, education, and governance quality.",
        "The strategic priority before any issue positioning is simply fielding a credible candidate. An uncontested seat tells you nothing about the actual floor — the district has never been tested. A credible local candidate with community roots and a moderate economic profile will almost certainly outperform the assumption. Cincinnati suburbs like this have been among the most competitive suburban territories in Ohio.",
        "Issues that open doors in this district: education quality (this is where families chose to settle and they are invested), healthcare and retirement security (the 41-year median age puts these on the near horizon), and infrastructure quality. Reproductive rights is a motivating issue for college-educated suburban women who are registered Republican but persuadable. Start there."
      ],
      memoBullets: [
        "Recruiting a candidate is the entire first task. The seat is not going to flip from the outside — it requires someone with local credibility, community ties, and no cultural liabilities who can build name recognition across a full cycle.",
        "Treat 2026 as a baseline-building cycle: voter contact data, donor relationships, volunteer infrastructure, earned media. Even if the first campaign falls short, the investment compounds.",
        "Reproductive rights and education quality are your recruiting messages for a first-time candidate — these are the issues that have motivated high-income suburban women to run for office across Ohio in recent cycles. That profile fits this district."
      ]
    }
  },
  {
    id: "oh-hd-38",
    name: "Ohio House District 38",
    city: "Columbus",
    region: "Columbus South Suburbs (Obetz / Groveport)",
    type: "state house district",
    incumbentName: "Desiree Tims",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Displacement",    tag: "lean-into", why: "Over half of residents rent in a district where $45,074 median income means housing cost is an immediate affordability crisis. Columbus's rapid growth creates displacement pressure even in historically working-class neighborhoods. Every development conversation must include explicit anti-displacement and affordability commitments." },
        { name: "Economic Opportunity & Living Wages",  tag: "lean-into", why: "Below-median income and only 21% college education signal a district where economic security is precarious for a large share of residents. Workforce investment, apprenticeship pipelines, and living-wage ordinances are direct asks that resonate across racial lines in a multiracial working-class district." },
        { name: "Education & Youth Services",          tag: "lean-into", why: "A young median age of 33.4 with significant Black and Hispanic populations means many households include school-age children who depend on Columbus City Schools. Education funding, after-school programming, and early childhood investment are not abstract — they are visible quality-of-life issues at the district level." },
        { name: "Public Safety & Community Investment", tag: "careful",  why: "A district that is 51% white and 38% Black in Columbus carries distinct community relationships to policing and safety. Lead with the concrete: response times, mental health crisis response, lighting, neighborhood investment. Avoid national movement vocabulary that lands differently on different blocks." },
        { name: "Rapid Development Without Resident Benefit", tag: "avoid", why: "Columbus's growth is reshaping neighborhoods in working-class districts. Support for development that lacks affordability guarantees or community benefit agreements will be visible and remembered. Take explicit, specific positions on projects in the district — generic pro-development language is not neutral here." }
      ],
      memoHeadline: "Uncontested means trust has been earned. Now deepen it — this coalition requires active maintenance.",
      memoParagraphs: [
        "HD-38 is a safe Democratic seat anchored in working-class Columbus neighborhoods. Tims ran uncontested in 2024 — a reflection of the district's structural Democratic tilt, built around a multiracial renter-majority coalition with below-median incomes and real economic precarity. The strategic task is not winning; it's governing and organizing in a way that builds durable loyalty.",
        "Housing is the defining issue. With 53% renters and $45,074 median income, cost burden is the dominant kitchen-table concern. Columbus's development boom is reshaping neighborhoods across this district — every conversation about growth, investment, and zoning arrives in the context of whether current residents get to stay. Tims needs a visible, specific, and consistent position on every major development proposal in the district.",
        "The district's youth — median age 33.4, significant Black and Hispanic populations — creates both a mobilization opportunity and a service obligation. Young, low-propensity voters in multiracial urban districts are the hardest to turn out and the most responsive to candidates they believe are actually present and fighting for them. Constituent visibility between elections is a political asset here, not just good governance."
      ],
      memoBullets: [
        "Take explicit positions on specific development projects in the district — not just general affordability principles. Residents are watching whether their representative shows up when their block is on the line.",
        "Build a year-round constituent engagement calendar: office hours in different neighborhoods, community events, visible response to neighborhood concerns. In a safe seat, the risk is complacency — residents notice absence.",
        "Invest in young-voter turnout infrastructure: registration drives, digital organizing, campus and community college outreach. The long-term health of this coalition depends on each new cohort being brought into the electorate."
      ]
    }
  },
  {
    id: "oh-hd-39",
    name: "Ohio House District 39",
    city: "Columbus",
    region: "Dayton / Montgomery County",
    type: "state house district",
    incumbentName: "Phil Plummer",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Kitchen-Table Economic Issues",   tag: "lean-into", why: "At $62,144 median income with only 25% college education in a mixed-race, renter-significant district, economic anxiety is immediate and shared across racial lines. Wages, utility costs, grocery prices, and healthcare bills are the issues that open doors — lead with them and stay with them." },
        { name: "Black Voter Turnout & Mobilization", tag: "lean-into", why: "At 29% Black, this district has a substantial Democratic base that likely underperforms its turnout potential in a Plummer-held seat that hasn't faced a serious challenge. A disciplined GOTV operation targeting historically low-turnout Black precincts is the clearest path to closing the 18-point gap — not persuasion." },
        { name: "Healthcare Affordability",        tag: "lean-into", why: "A working-class, mixed-race district with a median age of 42.7 has real exposure to healthcare system failures — uninsured costs, prescription bills, aging parents. This is a bipartisan pocketbook concern that gives Democrats an honest contrast with Plummer's voting record on healthcare without requiring cultural positioning." },
        { name: "Policing & Public Safety",        tag: "careful",   why: "With 29% Black residents in a district currently held by a Republican former sheriff, policing is both a political liability and a genuine community concern. Lead with safety outcomes — what residents need on their blocks — not reform framing. The white working-class voters you need to peel off respond to safety and community investment, not movement vocabulary." },
        { name: "National Democratic Identity",    tag: "avoid",     why: "Plummer wins this district by holding enough white working-class voters who have moved Republican culturally. Any campaign message that ties the Democratic candidate to national partisan identity — rather than local economic credibility — reinforces that cultural sorting. Run as a person from this community, not as a Democrat from Columbus." }
      ],
      memoHeadline: "Down 18 in a district with 29% Black voters who may not be turning out. Find those votes before chasing persuasion.",
      memoParagraphs: [
        "HD-39 is a Montgomery County seat held by Phil Plummer — a former county sheriff with strong name recognition and a Republican-branded law-and-order identity that has worked in this district. Green lost 41-59, a gap that looks structural but may be less so than it appears once you examine the Black voter turnout gap in the district.",
        "The math starts with mobilization. At 29% Black in a district where Democratic performance has been suppressed, the question is not whether there are enough Democratic-leaning voters — there are. The question is whether they are registered, contacted, and given a compelling reason to vote. That is a field problem before it is a message problem.",
        "The white working-class component of this district — 62% white, mixed homeowners and renters, $62K median income — is harder to move but not impossible on economic grounds. Healthcare costs, wage stagnation, and local job quality are genuine concerns that don't require cultural conversion. The candidate who runs an economic campaign here while driving Black turnout is the candidate with a real path."
      ],
      memoBullets: [
        "Commission precinct-level turnout analysis before making any other strategic decision. Identify where Black voter registration and turnout fall furthest below potential — that is your first investment.",
        "Healthcare and economic costs are your persuasion openers for white working-class households. Don't lead with policing, don't lead with social issues — lead with what hits people in the wallet.",
        "Counter Plummer's law-and-order identity with community safety framing: what does safe look like on specific streets, in specific neighborhoods? Name the local concerns. Be specific. Don't give him the abstraction to run against."
      ]
    }
  },
  {
    id: "oh-hd-40",
    name: "Ohio House District 40",
    city: "Cincinnati",
    region: "Warren County / Mason Area",
    type: "state house district",
    incumbentName: "Rodney Creech",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Local Services & Infrastructure",     tag: "lean-into", why: "Homeowners in a rural and small-town Hamilton County district care about what state government actually delivers — road quality, broadband access, water systems, school buildings. Frame government investment around the return to local taxpayers. This is spending even skeptical voters support when they can see where it goes." },
        { name: "Agricultural & Rural Economic Policy", tag: "lean-into", why: "A district at the rural fringe of Cincinnati with only 21% college education and strong homeownership is directly connected to agricultural and small-business economic concerns. Candidates who speak credibly to rural livelihoods, farm policy, and small-town economic stability build the kind of trust that allows other conversations." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Even in deep-red rural territory, healthcare costs are a bipartisan pocketbook concern. Prescription drug prices, rural hospital access, and Medicare security are genuine anxieties in an older homeowner district — and the Republican Party's record on all three is a real vulnerability that rarely gets tested here." },
        { name: "Social & Cultural Issues",            tag: "careful",   why: "At 88% white with a 77-point Republican margin, the cultural composition of this district is deeply conservative. Avoid leading with or being drawn onto social issues. If pressed, redirect to economic security and local services — the terrain where you have any standing at all." },
        { name: "Urban or Progressive Policy Framing", tag: "avoid",     why: "Any signal that a candidate represents Cincinnati urban interests, progressive national policy, or Democratic Party identity will activate the cultural sorting that gives Creech his 77-point margin. This seat requires a candidate who looks, sounds, and campaigns as a rural Hamilton County person first — if such a candidate exists." }
      ],
      memoHeadline: "At 77-23, this is Republican bedrock. Run to build the party's presence, not to win this cycle.",
      memoParagraphs: [
        "HD-40 is one of the most heavily Republican districts in this portfolio — Creech won 77-23 in a rural and exurban Hamilton County seat that is 88% white, predominantly homeowner, and deeply conservative. There is no realistic path to winning this seat in a normal cycle. The case for fielding a candidate here is not victory — it is party-building, candidate development, and maintaining organizational presence in territory where Democrats have ceded the ground entirely.",
        "In a district this far into Republican territory, the first rule is do no harm. A poorly run campaign or an undisciplined candidate can define the Democratic brand in this community for years. A credible, locally rooted, economically focused candidate who runs a professional race — even losing 70-30 — builds something useful: name recognition, voter contact data, donor relationships, and the beginning of a local party infrastructure.",
        "The issues that have any purchase here are the ones that don't require partisan alignment: rural broadband, road conditions, farm policy, prescription drug costs, rural hospital access. These are legitimate governing concerns in this district and they are the only conversations a Democratic candidate can have that don't immediately trigger partisan rejection."
      ],
      memoBullets: [
        "Candidate recruitment is the first and hardest task. The right profile is a farmer, a small-business owner, or a local civic leader with deep community roots who is willing to run as a credible voice for rural Hamilton County — not as a partisan Democrat.",
        "Set realistic goals: improve on 23%, build a voter contact list, get earned media on local economic issues, and finish the race with the party's reputation intact. Anything above 30% is a successful cycle in this district.",
        "Healthcare and rural infrastructure are your only bipartisan openers. Lead with them exclusively. Never give the opponent material to run a cultural contrast — that's the only way Creech's margin grows."
      ]
    }
  },
  {
    id: "oh-hd-41",
    name: "Ohio House District 41",
    city: "Toledo",
    region: "Toledo Urban Core",
    type: "state house district",
    incumbentName: "Erika White",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Education Quality & Funding",          tag: "lean-into", why: "With 34% college education and a median age of 41.5, this is a district of established homeowner families who vote on school quality as a direct quality-of-life and property-value issue. Connect state education funding to Lucas County school district outcomes voters can name — staffing levels, programs, building conditions." },
        { name: "Economic Security & Working Family Issues", tag: "lean-into", why: "At $80,900 median income in a predominantly homeowner Toledo suburb, voters are comfortable but not complacent — healthcare costs, college tuition, and retirement planning are live concerns. Messaging that speaks to protecting and building on the economic stability these families have built lands across the full district." },
        { name: "Infrastructure & Quality of Life",     tag: "lean-into", why: "Homeowners with roots in a community care about the quality of shared public goods. Toledo-area roads, water systems (Lake Erie water quality is a specific regional concern), parks, and broadband all connect to the case that state investment delivers tangible local value." },
        { name: "Fiscal & Tax Policy",                 tag: "careful",   why: "A 61-39 D margin in an 86% white homeowner suburb reflects voters who have crossed over on values and competence — not voters who are ideologically aligned with the Democratic Party on economic redistribution. Be specific and credible about costs, value, and the return on public investment." },
        { name: "National Cultural Positioning",       tag: "avoid",     why: "White's 61% reflects a coalition held together by local competence and suburban values voters — not by national Democratic brand enthusiasm. Any drift toward national partisan identity framing risks defection among the ticket-splitters who make the margin comfortable. Run as a Toledo-area legislator, not as a Democratic caucus member." }
      ],
      memoHeadline: "A 61-point margin in a white homeowner suburb is earned, not automatic. Govern locally and protect it.",
      memoParagraphs: [
        "HD-41 is a solidly Democratic Toledo suburban seat — White's 61-39 margin in 2024 reflects a district of predominantly white, educated homeowners who have consistently chosen Democratic representation despite a demographic profile that leans Republican in much of Ohio. That coalition is held together by local competence, quality-of-life priorities, and values positioning — not by ideological enthusiasm for the national Democratic platform.",
        "Education and infrastructure are the issues that bind this district. Homeowners in a Lucas County suburb have invested in their community and their schools, and they vote accordingly. Every legislative priority — school funding formulas, road investment, broadband, Lake Erie water quality — should be communicated directly to the district in terms of what it delivers locally.",
        "The margin here is comfortable but not untouchable. The voters who give White her 61% include ticket-splitters who will return to Republican habits if given a reason — an ideological drift, a visible cultural miscalculation, or a well-funded opponent who succeeds in defining the race on national terms. Active local presence and constituent service are the insurance policy."
      ],
      memoBullets: [
        "Lake Erie water quality is a specifically local issue with bipartisan resonance in the Toledo area — it connects infrastructure investment to a genuine regional concern and distinguishes local Democratic legislators from national party positioning.",
        "Maintain a visible constituent service operation. In a homeowner-majority suburb, responsiveness to local concerns — potholes, school funding, municipal services — is both good governance and smart politics.",
        "Don't nationalize the race. Let your record speak locally. The moment this becomes a race about national Democratic politics, the comfortable margin becomes competitive."
      ]
    }
  },
  {
    id: "oh-hd-42",
    name: "Ohio House District 42",
    city: "Toledo",
    region: "Toledo Near North Side",
    type: "state house district",
    incumbentName: "Elgin Rogers Jr.",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Jobs",             tag: "lean-into", why: "At $71,269 median income in a Toledo-area district with 33% renters, economic security is a near-universal concern. Toledo's manufacturing heritage and proximity to auto supply chains mean local jobs and industrial policy resonate concretely — connect state economic policy to employers and industries residents actually work for." },
        { name: "Hispanic Community Outreach & Policy", tag: "lean-into", why: "At 8.4% Hispanic, this district has a meaningful and growing constituency that is likely underregistered and undercontacted. Spanish-language outreach, bilingual field materials, and policy that speaks to immigrant families and Latino working-class households is a margin-building investment — not a symbolic one." },
        { name: "Affordable Housing & Neighborhood Stability", tag: "lean-into", why: "A third of residents rent in a mixed Toledo district with a $71K median income. Cost burden affects working families across the racial and income spectrum here. Frame housing policy around neighborhood stability — keeping families rooted in the communities where they work and raise children." },
        { name: "Policing & Community Safety",          tag: "careful",   why: "An uncontested seat in a district that is 78% white but 11% Black and 8% Hispanic requires a public safety message that holds across communities. Lead with neighborhood investment, response quality, and community policing — not enforcement volume or reform movement language." },
        { name: "National Partisan Identity",           tag: "avoid",     why: "Running uncontested doesn't mean the coalition maintains itself. Rogers's base includes working-class white voters who are persuadable in a contested race. Anything that signals ideological alignment with national Democratic politics risks fracturing a coalition that currently holds by default. Govern locally." }
      ],
      memoHeadline: "Uncontested is not the same as safe. A contested race here is winnable but not guaranteed.",
      memoParagraphs: [
        "HD-42 is a Toledo-area district where Rogers ran uncontested in 2024. The demographic profile — 78% white, mixed working- and middle-class, 33% renters — is not structurally safe Democratic territory in the way an urban majority-minority district is. The absence of Republican opposition in 2024 reflects local dynamics, not permanent structural advantage. This seat will face a contest eventually.",
        "The Hispanic community at 8.4% is the district's fastest-growing and most underrepresented constituency. Toledo's Latino population is predominantly working-class, rooted in manufacturing and service industries, and significantly underregistered relative to its share of the population. A dedicated bilingual field operation is a long-term investment in the district's Democratic coalition — it compounds across cycles.",
        "Economic credibility is the glue that holds the white working-class component of this district in the Democratic column. Toledo's identity is tied to manufacturing, labor unions, and the auto industry's fortunes. Every economic policy conversation should be grounded in what it means for Lucas County workers and families — not abstracted into national messaging."
      ],
      memoBullets: [
        "Invest in Hispanic voter registration and outreach now, before a contested race. At 8.4% of the district, this community is large enough to decide a close race — and they are almost certainly underregistered relative to their potential.",
        "Toledo manufacturing and labor are your economic identity anchors. Know the major employers, know the union locals, know the supply chain concerns. This is the language that holds working-class white voters who are persuadable in either direction.",
        "Treat the uncontested cycle as an organizing opportunity, not a vacation. Build the voter contact list, develop volunteer infrastructure, and establish community presence across all three demographic communities in the district."
      ]
    }
  },
  {
    id: "oh-hd-43",
    name: "Ohio House District 43",
    city: "Toledo",
    region: "Toledo West Side / Oregon",
    type: "state house district",
    incumbentName: "Michele Grim",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Renter Stability", tag: "lean-into", why: "43% of residents rent in a working-class Toledo district at $59,031 median income. Cost burden is immediate and shared across the district's racial composition. Connect housing policy to keeping families stable in neighborhoods they know — the frame that unites renters across racial lines without triggering homeowner anxiety." },
        { name: "Economic Opportunity & Working-Class Jobs", tag: "lean-into", why: "Below-median income with only 29% college education in a city defined by its manufacturing legacy. Toledo voters respond to candidates who are credible on protecting local industry, workforce training, and wages — not to candidates who speak in national economic abstractions. Name the employers, the union halls, the industries." },
        { name: "Education & Youth Investment",           tag: "lean-into", why: "A younger median age (35.9) and multiracial composition mean many households in this district have school-age children across income levels. Toledo City Schools' funding and quality are real concerns — and the case that state funding decisions hit this specific district in specific ways is both true and effective." },
        { name: "Policing & Community Safety",           tag: "careful",   why: "A district that is 66% white and 23% Black in a mid-size Ohio city has genuinely different community experiences of policing on different blocks. Lead with neighborhood safety outcomes — response times, staffing, lighting, community presence — without the national movement vocabulary that activates partisan sorting on both sides." },
        { name: "Culture-War Positioning",               tag: "avoid",     why: "Grim's 60-40 win includes working-class white voters who chose her over a Republican on economic and local grounds. These voters are persuadable in both directions. National cultural positioning — on social issues, identity, or progressive institutional critiques — is the fastest way to convert a comfortable margin into a competitive race." }
      ],
      memoHeadline: "A 60-point win in working-class Toledo is earned by staying local, economic, and present.",
      memoParagraphs: [
        "HD-43 is a working-class Toledo district where Grim won 60-40 by holding a multiracial coalition of white, Black, and Hispanic working families together on economic and local community grounds. That margin is real, but it requires maintenance — the white working-class voters in the coalition are persuadable in both directions and will drift if they feel the candidate has moved culturally away from them.",
        "Housing and economic opportunity are your unifying issues. With 43% renters, below-median income, and a labor-rooted regional identity, the concerns of this district are concrete and immediate. Every policy position should be translated into what it means for a Toledo renter or a Lucas County factory worker — not for a policy framework or a national constituency.",
        "The 23% Black community and 6% Hispanic community are not afterthoughts — they are a meaningful share of the coalition that produces Grim's margin. Spanish-language outreach and visible engagement with Toledo's Black community are both moral obligations of representation and strategic necessities for maintaining the coalition that makes this seat Democratic."
      ],
      memoBullets: [
        "Host regular neighborhood events across the district's geographic and demographic range. Visibility with working-class white, Black, and Hispanic communities alike is what keeps the coalition intact between election cycles.",
        "Connect every economic policy position to Toledo specifically — specific employers, specific union locals, specific industries. Generic pro-worker messaging doesn't land the same way as 'here's what this means for the Jeep plant' or 'here's what this does for Lucas County apprenticeship programs.'",
        "Don't give the Republican an opening on cultural terrain. Keep the race on housing, jobs, and schools — all three are issues where your record and your opponent's party's record create a clean contrast."
      ]
    }
  },
  {
    id: "oh-hd-44",
    name: "Ohio House District 44",
    city: "Columbus",
    region: "Columbus Southeast Exurbs (Pickerington / Canal Winchester)",
    type: "state house district",
    incumbentName: "Josh Williams",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Voter Registration & Minority Turnout",  tag: "lean-into", why: "This is the highest-priority issue in this district — before message, before policy, before anything else. A district that is 35% Black and 10% Hispanic with $40,703 median income voting Republican is almost certainly a registration and turnout deficit, not a persuasion deficit. The Democratic votes exist. They are not showing up." },
        { name: "Economic Survival & Basic Security",     tag: "lean-into", why: "At $40,703 median income — one of the lowest in the state — with 48% renters and only 16% college education, economic precarity is not a policy frame here, it is daily life. Housing stability, utility costs, healthcare access, and food security are the immediate concerns of a large share of residents. Speak to survival, not aspiration." },
        { name: "Education & Youth Opportunity",         tag: "lean-into", why: "A young median age (35.1) in a low-income multiracial district means a large share of households are raising children in underfunded schools. The case that Columbus City Schools receive adequate state funding is both urgent and visceral here — parents in this district are watching the consequences directly." },
        { name: "Development & Displacement",           tag: "careful",   why: "Columbus's growth is putting pressure on exactly the kinds of low-income, minority neighborhoods that make up this district. Support for development without explicit anti-displacement protections will be seen as taking the side of developers over residents. Any economic development position must include specific commitments to current residents staying in place." },
        { name: "Broad Anti-Republican Messaging",      tag: "avoid",     why: "This district's problem is not that residents are voting Republican by conviction — it is that too many are not voting at all. Generic anti-Republican messaging doesn't solve a turnout problem. Every campaign dollar spent on persuasion mail in HD-44 is a dollar not spent on registration drives, rides to the polls, and GOTV calls to low-propensity voters who are already on your side." }
      ],
      memoHeadline: "A majority-minority, poverty-level district held by Republicans. This is a turnout crisis, not an ideology crisis.",
      memoParagraphs: [
        "HD-44 is one of the most striking seats in Ohio: a district that is 35% Black, 10% Hispanic, and $40,703 median income — among the lowest in the state — and yet Republicans won it 58-42 in 2024. This result is not a reflection of conservative political views among low-income minority voters. It is almost certainly a catastrophic registration and turnout failure. The Democratic votes are in this district. They are not being reached.",
        "The strategic priority is registration and GOTV — period. Before any message development, any policy positioning, any persuasion strategy, the campaign needs a granular precinct-level analysis of where Black and Hispanic voter registration falls below census-population proportions, and where registered Democratic-leaning voters turned out at the lowest rates in 2024. That map is the campaign plan.",
        "Economic survival is the issue frame. At $40,703 median income with 48% renters and 16% college education, residents of this district are not engaged in ideological political debates — they are managing immediate economic precarity. A candidate who shows up consistently, speaks to survival concerns (housing, utilities, food costs, healthcare access), and builds genuine community trust over time is the profile that can eventually win this seat."
      ],
      memoBullets: [
        "Commission a precinct-level turnout audit as the first campaign investment. Where are registered Democratic-leaning voters not showing up? That data determines where every field dollar goes.",
        "Partner with community organizations already trusted in the district — Black churches, Hispanic community groups, social service providers — to lead registration and GOTV efforts. Outside political campaigns are less trusted than community-embedded organizations in low-turnout, low-income neighborhoods.",
        "This is a multi-cycle project. Do not expect to flip this seat in a single race. Set realistic goals, invest in infrastructure, and build the registration and turnout base that makes the seat competitive in 2026 or 2028."
      ]
    }
  },
  {
    id: "oh-hd-45",
    name: "Ohio House District 45",
    city: "Cincinnati",
    region: "West Chester / Liberty Township (Butler County)",
    type: "state house district",
    incumbentName: "Jennifer Gross",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Reproductive Rights",               tag: "lean-into", why: "Jennifer Gross is among the most vocal anti-abortion legislators in Ohio — and this is a district with $95,275 median income, 42% college-educated, and a growing diverse professional population. The gap between Gross's legislative record and the values of a high-income, educated Cincinnati suburb is the central contrast Democrats should be running every cycle." },
        { name: "Education Quality & Funding",       tag: "lean-into", why: "High-income, educated suburban voters with school-age children vote on school quality and will cross party lines to protect it. At 42% college-educated with strong household income, this district's parents are paying close attention to what the state legislature does to public school funding. Connect Gross's record to local school impacts." },
        { name: "Healthcare & Economic Security",    tag: "lean-into", why: "With a median age of 38.7 and a growing Asian and Hispanic professional population alongside the white suburban base, healthcare costs, prescription drug pricing, and family economic security are universally felt concerns. These issues also create an honest contrast with Gross's legislative record that doesn't require a cultural framing." },
        { name: "Economic & Tax Policy Framing",    tag: "careful",   why: "At $95,275 median income, this is a wealthy district. The economic argument for Democrats must be framed around investment, competitiveness, and security — not redistribution. Suburban professionals who are open to Democrats on values will close the door on a candidate who sounds like they are campaigning against the district's economic interests." },
        { name: "Matching Gross's Cultural Positioning", tag: "avoid", why: "Gross wins by activating cultural conservative identity in a district whose demographic profile suggests it should be more competitive. Don't fight on that terrain — it gives her the contrast she wants. Run on reproductive rights, education, and healthcare, where the policy record is clear and the district's values are on your side." }
      ],
      memoHeadline: "Gross's record is your campaign. A high-income, educated suburb shouldn't be voting 62-38.",
      memoParagraphs: [
        "HD-45 is a high-income, increasingly diverse Cincinnati suburban district that votes 62-38 Republican despite a demographic profile that has moved competitive or Democratic across comparable Ohio suburban districts. The gap between the district's profile and its electoral outcome is almost entirely explained by Jennifer Gross's ability to run as a cultural conservative before her legislative record becomes the story. The opportunity for Democrats is to change that calculus.",
        "Reproductive rights is the sharpest available contrast. Gross is one of Ohio's most extreme anti-abortion legislators — and she represents a district with $95,000 median incomes, 42% college-educated households, a growing Asian professional population (7.3%), and a Hispanic community (7.3%) that includes many families with young children. The mismatch between her record and this district's values is real and demonstrable. Make it the centerpiece of the campaign.",
        "The district's diversity is an underutilized asset. At 11% Black, 7% Hispanic, and 7% Asian, nearly 25% of the district's population is people of color — likely underregistered and undercontacted. A serious GOTV investment in these communities, combined with a reproductive-rights-and-education message aimed at college-educated suburban women, creates a coalition that can make this race genuinely competitive."
      ],
      memoBullets: [
        "Gross's anti-abortion record is your most powerful contrast tool in this specific district. Build the campaign around making that record unavoidable for voters who chose her without knowing it — or who are newly motivated by Ohio's post-Dobbs landscape.",
        "Asian and Hispanic voters at 7.3% each are a combined 14% of the district and almost certainly underregistered. A targeted, culturally specific registration and outreach effort is a force-multiplier investment in a seat where every percentage point matters.",
        "Recruit a candidate with deep suburban Cincinnati roots and a credible professional profile — a doctor, teacher, or business owner whose biography neutralizes the cultural framing before it starts. In a 62-38 district, candidate quality is the variable that determines whether you're competitive or not."
      ]
    }
  },
  {
    id: "oh-hd-46",
    name: "Ohio House District 46",
    city: "Cincinnati",
    region: "Butler County (Hamilton / Fairfield)",
    type: "state house district",
    incumbentName: "Thomas Hall",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Retirement & Healthcare Security",     tag: "lean-into", why: "At $84,845 median income with 80% homeowners and a median age of 38.3, this is a district of prosperous established households who are beginning to focus on retirement timelines and healthcare costs. Medicare protection and prescription drug pricing are genuine bipartisan concerns that give Democrats an honest contrast without triggering cultural resistance." },
        { name: "Local Infrastructure & Services",      tag: "lean-into", why: "Homeowners in a prosperous Hamilton County suburb are invested in the quality of public goods — road conditions, water systems, school buildings, broadband. Framing state investment around the tangible local return to taxpayers is the least politically costly opening for a Democratic candidate in this territory." },
        { name: "Education Funding",                   tag: "lean-into", why: "Even in a district with only 32% college education, parents of school-age children vote on school quality and per-pupil funding. Connect state education funding decisions to specific impacts on local schools — teacher vacancies, program cuts, facility conditions. This is a concern that crosses party lines when made concrete." },
        { name: "Economic & Fiscal Policy",            tag: "careful",   why: "A district this prosperous and this Republican is dominated by voters who are comfortable and protective of that comfort. Messaging that sounds like it threatens economic stability, raises taxes on working homeowners, or signals a redistribution agenda will drive down what is already a thin floor. Frame every economic position around security and investment." },
        { name: "Progressive Cultural Positioning",    tag: "avoid",     why: "At 80% white and voting 66-34 Republican, this Hamilton County suburban district has moved firmly into the Republican cultural orbit. Any candidate positioning that reads as urban-liberal or nationally progressive will confirm the cultural sorting that makes this seat safe Republican. A viable candidate here looks like a local, runs on local concerns, and never gives the opponent a national contrast to run." }
      ],
      memoHeadline: "Down 32 points in a prosperous suburb. Field a local candidate, run a credible race, build the floor.",
      memoParagraphs: [
        "HD-46 is a prosperous Hamilton County suburban seat held by Hall at 66-34 — a margin that reflects habitual Republican alignment among white homeowner households more than ideological conviction on every issue. At $84,845 median income with only 32% college education, this is a district of successful tradespeople, business owners, and middle managers — not a highly educated professional class, and therefore less amenable to the reproductive-rights-and-values message that has moved similar-income but more educated Cincinnati suburbs.",
        "The economic argument for Democrats in this district runs through kitchen-table security for established households: Medicare protection, prescription drug costs, and retirement stability are the issues that give a Democratic candidate standing without requiring ideological conversion. These voters are not hostile to government when it visibly delivers for them — roads, school buildings, broadband. Frame it that way.",
        "A 66-34 deficit does not flip in a single cycle in a district like this. The strategic goal is to field a credible, locally rooted candidate who runs a professional race, builds name recognition, improves on the floor, and creates the organizational infrastructure for a more favorable environment in 2026 or 2028."
      ],
      memoBullets: [
        "Candidate recruitment is the entire first task. The right profile is a community fixture — a small-business owner, a former local official, a school board member — whose biography makes the cultural-outsider attack implausible before it is even launched.",
        "Healthcare and retirement security are your only reliable bipartisan openers. Lead with them exclusively. A single issue that resonates with prosperous working-class homeowners is worth more than a full platform that triggers partisan sorting.",
        "Set a realistic goal: improve on 34%, build a voter file, develop local media relationships, and run out the clock without a damaging incident. A campaign that ends at 38% and leaves infrastructure behind is a success in this district."
      ]
    }
  },
  {
    id: "oh-hd-47",
    name: "Ohio House District 47",
    city: "Cincinnati",
    region: "Cincinnati Eastern Exurbs (Batavia / Clermont)",
    type: "state house district",
    incumbentName: "Diane Mullins",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Minority Voter Registration & Turnout", tag: "lean-into", why: "A district that is 7% Hispanic and 7% Black but voting 62-38 Republican is almost certainly underperforming its Democratic potential due to registration and turnout gaps in minority communities. At a young median age of 33, these communities include many first- and second-time voters. Registration and GOTV investment here compounds across cycles." },
        { name: "Affordable Housing & Renter Stability", tag: "lean-into", why: "37% of residents rent in a district where $64,784 median income means housing cost is a genuine concern. A young median age and working-class composition mean many households are renters who are price-sensitive to the Cincinnati housing market. Frame housing policy around neighborhood stability and affordability — not equity abstractions." },
        { name: "Kitchen-Table Economic Issues",         tag: "lean-into", why: "At $64,784 median income with only 25% college education and a young population, economic anxiety is immediate. Wages, childcare costs, grocery prices, and healthcare bills are the issues that open doors in a working-class district with a young median age. Speak to the real financial pressure on young families." },
        { name: "Policing & Community Safety",          tag: "careful",   why: "A district that is 79% white but 7% Hispanic and 7% Black requires a public safety message that doesn't alienate the minority communities whose turnout is essential to closing the gap. Lead with neighborhood safety outcomes and community investment — not enforcement-first framing that reads differently across racial lines." },
        { name: "National Democratic Brand",            tag: "avoid",     why: "Working-class white voters at 79% of this district have moved Republican culturally even when their economic interests align with Democratic policy. Any campaign positioning that signals national Democratic identity — rather than local economic credibility — reinforces that cultural sorting and makes the 62-38 Republican margin worse." }
      ],
      memoHeadline: "Young, diverse, and renting — but voting Republican. This is a registration and organizing problem.",
      memoParagraphs: [
        "HD-47 presents a puzzle: a Cincinnati-area district with a 33-year median age, 37% renters, 7% Hispanic residents, 7% Black residents, and $64,784 median income voting 62-38 Republican. That outcome is not explained by the district's economic interests or demographic composition — it is explained by registration gaps in minority communities and cultural sorting among young white working-class voters who have drifted Republican in the current cycle.",
        "The math of this district favors Democrats when everyone who should be voting is voting. The first campaign investment must be a precinct-level registration and turnout audit: where are Hispanic and Black voters underregistered? Where are young renters not appearing on voter rolls? Where did low-propensity Democratic-leaning voters sit out in 2024? The answers to those questions are the campaign plan.",
        "For the white working-class majority, the message is economic and local. Young families in a working-class Cincinnati suburb are dealing with childcare costs, rent increases, wages that haven't kept up, and healthcare bills they can't absorb. A candidate who speaks to that specific economic reality — not to national Democratic themes — can hold enough of this group to make the minority-community turnout investment decisive."
      ],
      memoBullets: [
        "Start with a registration drive targeting Hispanic and Black residents under 35. At a combined 14% of the district, these communities are large enough to move the outcome meaningfully if they are registered and turned out at rates comparable to the white majority.",
        "Young renters are a second underutilized constituency. Partner with local housing advocates and tenant organizations to reach renters who are on your side economically but not yet in the electorate.",
        "Kitchen-table economic issues — childcare, rent, healthcare, wages — are your message with white working-class households. Lead with what's hitting young families in the wallet right now, not with policy frameworks or national talking points."
      ]
    }
  },
  {
    id: "oh-hd-48",
    name: "Ohio House District 48",
    city: "Akron",
    region: "Canton / Stark County",
    type: "state house district",
    incumbentName: "Scott Oelslager",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Retirement & Medicare Security",       tag: "lean-into", why: "At median age 42.3 with 73% homeowners in a Stark County district, households are approaching retirement with real concerns about Social Security, Medicare, and prescription drug costs. Oelslager's long Republican tenure means his voting record on these issues is a matter of public record — and an honest contrast Democrats can use without triggering cultural resistance." },
        { name: "Local Infrastructure & Services",      tag: "lean-into", why: "Homeowners in a near-homogeneous Canton-area suburban district vote on what state government delivers locally: road conditions, water quality, school buildings, broadband. Framing state investment around the tangible return to Stark County taxpayers is the safest bipartisan opening available in this terrain." },
        { name: "Local Jobs & Manufacturing",           tag: "lean-into", why: "Stark County's manufacturing legacy means voters here judge candidates by credibility on protecting local industry and keeping jobs in the region. Economic policy connected to specific local employers, supply chains, and workforce training carries more weight than abstract economic messaging." },
        { name: "Social & Cultural Issues",            tag: "careful",   why: "At 91% white and voting 69-31 Republican, this district's cultural orientation is deeply conservative. Do not lead with any issue that invites a social or cultural contrast. Redirect every such conversation to economic security and what state government delivers for Stark County families." },
        { name: "National Progressive Identity",       tag: "avoid",     why: "Oelslager is a long-tenured incumbent with strong name recognition and a conservative cultural brand. Any candidate who allows the race to become about national Democratic positioning has already lost. The only viable path is economic credibility and local rootedness — neither of which is compatible with a campaign that leads with partisan identity." }
      ],
      memoHeadline: "Oelslager is entrenched. The only path is economic, local, and patient.",
      memoParagraphs: [
        "HD-48 is a Stark County seat that Scott Oelslager has held for years — his 69-31 margin reflects both structural Republican advantage in a 91% white homeowner district and the incumbency premium of a long-tenured legislator with deep community ties. There is no quick path here. The case for fielding a candidate is organizational, not electoral: maintaining party presence, building a voter file, and being positioned for a more favorable environment.",
        "The economic argument for a Democratic candidate in this district must be entirely retirement- and security-focused. At 42.3 median age with predominantly homeowner households, voters here are in the phase of life where Medicare stability, Social Security protection, and prescription drug costs are moving from abstract policy to personal reality. Oelslager's voting record on all three is a genuine vulnerability — one that is rarely exploited with specificity in a seat this safe.",
        "A candidate who is locally embedded, speaks credibly to Stark County manufacturing concerns, and runs a disciplined economic campaign can improve on 31% and begin building the kind of name recognition that compounds across cycles. The goal is not to win in 2026 — it is to make this seat worth contesting in 2028."
      ],
      memoBullets: [
        "Research Oelslager's specific votes on Medicare, prescription drug pricing, and Social Security. In a district full of voters approaching retirement, a concrete voting-record contrast on these issues is your most credible attack — and it doesn't require a cultural argument.",
        "Local manufacturing credibility is the other leg of the economic argument. Know the Stark County employer base, the union presence, the supply chain concerns. A candidate who can speak to that landscape earns trust that generic economic messaging cannot.",
        "Run a full-cycle organizational campaign: doors, voter contact, earned media on local economic issues. Even a 31-to-36-point improvement builds something real. Don't run to lose quietly — run to build."
      ]
    }
  },
  {
    id: "oh-hd-49",
    name: "Ohio House District 49",
    city: "Akron",
    region: "Akron / Summit County (Competitive)",
    type: "state house district",
    incumbentName: "Jim Thomas",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Affordable Housing & Renter Relief",  tag: "lean-into", why: "44% of residents rent in a below-median-income Summit County district. At $52,213 median income, cost burden is not abstract — it is a defining financial stress for nearly half the district. Housing affordability, tenant protections, and anti-displacement policy connect across the racial composition of this district and give Democrats a concrete closing argument." },
        { name: "Black Voter Turnout",                tag: "lean-into", why: "At 16.6% Black in a district where Allison lost by fewer than 2,300 votes, underperforming Black turnout is a decisive margin variable. A targeted, resourced GOTV operation in historically low-turnout Black precincts in Akron is the most direct path to flipping this seat — before any persuasion investment." },
        { name: "Kitchen-Table Economic Issues",      tag: "lean-into", why: "Below-median income, high renter rate, and a working-class composition mean economic anxiety is immediate and shared across racial lines. Wages, grocery costs, healthcare bills, and utility affordability are the issues that close the final gap with persuadable working-class white voters who are reachable on economics but not on culture." },
        { name: "Policing & Public Safety",           tag: "careful",   why: "A district that is 71% white and 17% Black in Akron carries real community tension around policing. Lead with safety outcomes and community investment — what residents actually need on their blocks — not reform framing that reads as a liability with the white working-class voters you need to hold." },
        { name: "National Political Identity",        tag: "avoid",     why: "Thomas won by running as a local conservative, not an ideological national Republican. The equivalent discipline is required on the Democratic side. Any campaign positioning that ties the candidate to national Democratic politics — rather than Akron and Summit County — gives Thomas the cultural contrast that turns a 4-point deficit into a comfortable hold." }
      ],
      memoHeadline: "Four points in a mixed working-class Akron district. Turnout wins this — not persuasion.",
      memoParagraphs: [
        "HD-49 is one of the most compelling flip opportunities in this portfolio. Allison lost to Thomas by just 2,270 votes — 47.6-52.4 — in a Summit County district with 16.6% Black residents, 44% renters, and $52,213 median income. This is a working-class, multiracial Akron district where the Democratic base exists and is simply not turning out at the rate needed to win.",
        "The path to victory is not complicated but it requires discipline. Step one: commission a precinct-level turnout analysis that identifies where Black voters and low-income renters are registered but not voting. Step two: build a field operation that contacts those specific voters with a message rooted in their specific economic concerns — housing costs, wages, healthcare. Step three: hold the white working-class component of the coalition on economic grounds without giving Thomas a cultural contrast to run.",
        "This is the kind of seat that flips when the Democratic candidate does everything right and the environment is neutral or better. The demographic and economic fundamentals are there. The 4-point gap is within reach of a well-run turnout operation. Don't overcomplicate it — identify the missing votes, go get them, and keep the message on the economy."
      ],
      memoBullets: [
        "A precinct-level turnout audit is the first campaign investment, not the last. Know exactly where the Democratic votes are sitting uncast before you write a single piece of mail or knock a single door.",
        "Black GOTV in Akron's historically lower-turnout precincts is the clearest path to the margin. Resource it like a primary operation — not as an afterthought to a broader persuasion campaign.",
        "Housing is your closing argument with renters across racial lines. At 44% renters and below-median income, cost burden is felt everywhere in this district. Make it the central economic issue and make Thomas's record on it visible and specific."
      ]
    }
  },
  {
    id: "oh-hd-50",
    name: "Ohio House District 50",
    city: "Cleveland",
    region: "Lake County (Mentor / Painesville)",
    type: "state house district",
    incumbentName: "Matthew Kishman",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Retirement & Healthcare Security",    tag: "lean-into", why: "With a median age of 43.3 in a predominantly homeowner district, households here are actively navigating retirement timelines, Medicare coverage, and prescription drug costs. These are the issues that break through partisan habit in working-class white communities — and where Democratic policy delivers a genuinely stronger record than Republicans can credibly defend." },
        { name: "Local Jobs & Manufacturing",          tag: "lean-into", why: "Lake and Lorain County's industrial heritage means voters here evaluate candidates on credibility about local jobs, manufacturing, and supply chains. Policy connected to specific regional employers and workforce training carries standing that abstract economic messaging cannot achieve. Know the local employer base and speak to it directly." },
        { name: "Local Infrastructure",               tag: "lean-into", why: "Working-class homeowners in a Lake County district care about the condition of roads, water systems, and public services they use every day. Framing state investment around the local taxpayer return — not ideological priorities — is the safest opening for a Democratic candidate in terrain this Republican." },
        { name: "Social & Cultural Issues",           tag: "careful",   why: "At 91% white and voting 67-33 Republican, this district has moved strongly into the Republican cultural column. Any candidate drawn onto social or cultural terrain has already lost the persuadable voters needed to improve on 33%. Redirect every such conversation to economic security and local services." },
        { name: "Urban or Progressive Policy Framing", tag: "avoid",    why: "Lake and Lorain County working-class white voters have defined their political identity in opposition to what they perceive as urban Democratic priorities. A candidate who sounds like they come from Cleveland or Columbus — regardless of the policy merit — will cement the cultural sorting that produces Kishman's 67-point margin." }
      ],
      memoHeadline: "Down 34 in working-class Lake County. Run local, run economic, and build something lasting.",
      memoParagraphs: [
        "HD-50 is a Lake County seat held by Kishman at 67-33 — a working-class, 91% white homeowner district that has moved firmly Republican over the past decade on cultural grounds. At $66,807 median income with only 19% college education and a 43-year median age, this is exactly the demographic profile where national Democratic messaging has failed most visibly. The floor here requires a fundamentally different approach.",
        "The economic argument that has any purchase in this district is retirement security, local jobs, and healthcare costs — not economic populism framed in progressive terms. Voters here are not opposed to government delivering for them; they are opposed to government delivering for others at their expense, or so the perception has been built. A candidate who grounds every message in what it does for Lake County working families specifically can begin to erode that perception.",
        "This is a multi-cycle organizational investment, not an immediate flip opportunity. The goal in 2026 is to run a credible, locally grounded campaign that improves on 33%, keeps the party's presence felt, and develops the infrastructure and name recognition that makes a more favorable cycle possible."
      ],
      memoBullets: [
        "Recruit a candidate with deep Lake or Lorain County roots — a union member, a small-business owner, a former municipal official. The biography has to preclude the cultural-outsider attack before it is made.",
        "Retirement security and prescription drug costs are your best bipartisan openers with older working-class homeowners. Research Kishman's specific votes and make the contrast concrete — not abstract party positioning.",
        "Set a realistic target: 37-38% is a meaningful improvement in this district. That's the goal for a first serious campaign. Build the list, build the relationships, and position for the cycle when the environment shifts."
      ]
    }
  },
  {
    id: "oh-hd-51",
    name: "Ohio House District 51",
    city: "Cleveland",
    region: "Geauga / Lake County East (Rural)",
    type: "state house district",
    incumbentName: "Jodi Salvo",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Retirement & Medicare Security",      tag: "lean-into", why: "A median age of 42 in a working-class homeowner district means a large share of households is in active retirement planning mode. Social Security protection, Medicare security, and prescription drug costs are genuine anxieties that cut through partisan habit in communities like this — and where the Democratic record is substantively stronger than Republicans can comfortably defend." },
        { name: "Local Jobs & Manufacturing",          tag: "lean-into", why: "A near-homogeneous working-class district in the Cleveland exurbs is economically connected to Ohio's industrial base. Candidates who speak credibly about protecting local jobs, supply chains, and workforce training earn the kind of trust that opens doors which generic Democratic messaging closes." },
        { name: "Local Infrastructure & Services",    tag: "lean-into", why: "Working-class homeowners in a 95% white Lorain or Medina County district care about what government actually delivers — road conditions, water quality, school buildings, broadband. Frame every state investment around the tangible return to local taxpayers, not ideological priorities." },
        { name: "Social & Cultural Issues",           tag: "careful",   why: "At 95% white and voting 72-28 Republican, this district's cultural orientation is firmly conservative. Do not lead with or be drawn onto social terrain. Any issue conversation that invites a cultural contrast helps Salvo. Redirect to local economic security every time." },
        { name: "National Democratic Identity",       tag: "avoid",     why: "A 44-point Republican margin in a near-homogeneous working-class district is built almost entirely on cultural sorting — the sense that the Democratic Party represents someone else's priorities. A candidate who reinforces that perception before the first door is knocked has already determined the outcome. Local identity, economic credibility, and zero national partisan signaling are the prerequisites for even a modest improvement." }
      ],
      memoHeadline: "Down 44 points in one of Ohio's most homogeneous working-class districts. Show up, run clean, build the floor.",
      memoParagraphs: [
        "HD-51 is among the most challenging seats in this portfolio — a 95% white, working-class Cleveland exurb at 72-28 Republican with only 19% college education and a median age of 42. Salvo's margin reflects deep cultural alignment between the district's demographics and the Republican Party's current identity. There is no near-term electoral path here. The case for fielding a candidate is purely organizational.",
        "The only economic issues with any traction in a district like this are retirement security, local manufacturing, and healthcare costs — concerns that are universal enough to transcend partisan sorting when made concrete and local. Anything that sounds redistributive, punitive toward working households, or connected to urban Democratic priorities will accelerate the cultural sorting that produces a 44-point margin.",
        "A credible candidate in this district is someone who grew up here, works here, and can claim with a straight face to be running for Lorain County families — not for the Democratic Party. That profile is rare but not impossible to find, and a well-run first campaign in a district this Republican builds organizational assets that compound across cycles."
      ],
      memoBullets: [
        "Retirement security and prescription drug costs are your only reliable openers. Research Salvo's voting record on Medicare and Social Security — in a 42-year-median-age working-class district, those votes are her biggest vulnerability.",
        "A candidate from a union background or with ties to local industry is the only profile that neutralizes the cultural-outsider attack in a district this homogeneous. Recruit accordingly.",
        "Set honest goals: improving from 28% to 32-33% is a meaningful first-race achievement here. The value of fielding a candidate is organizational presence, not electoral victory."
      ]
    }
  },
  {
    id: "oh-hd-52",
    name: "Ohio House District 52",
    city: "Cleveland",
    region: "North Ridgeville / Lorain County",
    type: "state house district",
    incumbentName: "Gayle Manning",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Minority Voter Registration & GOTV",  tag: "lean-into", why: "With 8.2% Hispanic and 7.6% Black residents — a combined 16% of the district — and a 14-point Republican margin, the arithmetic is straightforward: if minority communities in Lorain County are underregistered or underperforming their turnout potential, closing that gap alone could halve the deficit. This is the first investment, not an afterthought." },
        { name: "Kitchen-Table Economic Issues",       tag: "lean-into", why: "At $71,852 median income with only 30% college education in a working-class Lorain County district, economic anxiety is immediate and felt across racial lines. Wages, healthcare costs, and local job quality are the issues that open doors with both white working-class and minority households in a district where Manning has held on through incumbency advantage." },
        { name: "Local Jobs & Manufacturing",         tag: "lean-into", why: "Lorain County's steel and manufacturing legacy gives economic credibility outsized weight here. Candidates who can speak to the specific employers, union locals, and supply-chain concerns that working-class households in this district actually know earn trust that generic economic messaging cannot. Know the local industrial landscape and speak to it directly." },
        { name: "Policing & Community Safety",        tag: "careful",   why: "A district that is 80% white but 8% Hispanic and 8% Black in a working-class Lorain County context carries different community relationships to law enforcement. Lead with neighborhood safety outcomes — response times, community policing, local investment — not reform framing that activates partisan sorting among the white working-class voters you also need." },
        { name: "Manning's Incumbency",              tag: "careful",   why: "Gayle Manning has held this seat for years and has strong name recognition in Lorain County. A direct attack on her record without deep local credibility will backfire. Build your own identity first — let voters compare on specifics, not on partisan contrast. The contrast that works is economic performance and local presence, not political labels." }
      ],
      memoHeadline: "Manning's incumbency has held this district. Flip the turnout gap in minority communities and this race changes.",
      memoParagraphs: [
        "HD-52 is a Lorain County seat that Manning has held through a combination of incumbency advantage and working-class white voter loyalty. At 57-43, the gap is real but not prohibitive — and the district's demographic composition gives Democrats a structural path if they invest in it. A combined 16% Hispanic and Black population that is likely underperforming its voter registration and turnout potential represents the clearest route to closing the margin.",
        "Lorain County's industrial identity is the key to the white working-class component of this race. Manning has held these voters by projecting local credibility and moderate positioning. A Democratic challenger who can match that local credibility — with deep community ties, a manufacturing or union background, or visible civic engagement — can peel off enough of these voters when combined with improved minority turnout to make the race competitive.",
        "The district is not won with one strategy. It requires two parallel campaigns running simultaneously without contradicting each other: a minority community registration and GOTV effort that is resourced and persistent, and an economic credibility campaign aimed at white working-class households who are persuadable on jobs, healthcare, and retirement security. Both are necessary. Neither alone is sufficient."
      ],
      memoBullets: [
        "Commission a precinct-level analysis of Hispanic and Black voter registration rates versus census population proportions in Lorain County. That gap is the campaign's primary opportunity — quantify it before spending a dollar on anything else.",
        "A candidate with roots in Lorain County's industrial or union community is the prerequisite for the white working-class component of this race. Manning's local-credibility advantage disappears when the challenger has equivalent roots.",
        "Do not run against Manning primarily on partisan contrast. Build the challenger's identity first — specific, local, economic — and let the comparison emerge from what each candidate has actually done and stands for."
      ]
    }
  },
  {
    id: "oh-hd-53",
    name: "Ohio House District 53",
    city: "Cleveland",
    region: "Youngstown / Mahoning County",
    type: "state house district",
    incumbentName: "Joe Miller",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Hispanic Community Investment & Outreach", tag: "lean-into", why: "At 17% Hispanic, the Latino community is the defining constituency of this district — and almost certainly the margin of Miller's 56-44 win. Spanish-language outreach, bilingual field materials, and policy that speaks directly to the economic and family concerns of Lorain County's Latino working-class households is not optional. It is the campaign." },
        { name: "Economic Opportunity & Working-Class Jobs", tag: "lean-into", why: "With $64,536 median income, only 27% college education, and 32% renters, this is a working-class district where economic security is an everyday concern across racial communities. Lorain County's manufacturing and industrial history gives candidates who speak credibly to local jobs and wages standing that generic economic messaging cannot achieve." },
        { name: "Affordable Housing & Renter Stability",   tag: "lean-into", why: "Nearly a third of residents rent in a district where below-median income creates real cost burden. Housing stability connects the Hispanic, Black, and white working-class communities in this district on a common economic concern. Frame it around neighborhood stability and keeping families rooted — not equity abstractions." },
        { name: "Immigration Policy",                      tag: "careful",   why: "A 17% Hispanic community makes immigration policy a viscerally personal issue for a significant share of the district. Lead with economic security and community stability framing — not policy abstraction. Be specific about what protections mean for families in Lorain County. Avoid anything that sounds like a national partisan position divorced from local impact." },
        { name: "White Working-Class Cultural Positioning", tag: "avoid",   why: "Miller's coalition includes white working-class voters at 73% of the district who are holding Democratic on economic grounds. Any cultural positioning that reads as urban-progressive or disconnected from their concerns risks fragmenting the coalition that produces the 56% margin. Stay on jobs, housing, and schools — where the coalition holds." }
      ],
      memoHeadline: "The Hispanic community is the margin here. Invest in them first, hold the working-class coalition second.",
      memoParagraphs: [
        "HD-53 is a Lorain County district defined by one demographic fact that is rare in Ohio legislative politics: a 17% Hispanic population that represents the decisive margin of Miller's 56-44 win. This is not a district where the Latino community is a secondary constituency — it is the community whose turnout and loyalty determines whether Democrats hold the seat. Every strategic decision flows from that reality.",
        "The coalition Miller holds is a classic Lorain County working-class multiracial alliance: white industrial workers, Black residents, and the growing Latino community, bound together by shared economic concerns. Housing costs, local jobs, wages, and school quality are the issues that hold all three groups without requiring ideological alignment. The coalition frays when the campaign drifts toward either national Democratic cultural positioning or economic messaging that doesn't speak to working-class realities.",
        "Spanish-language campaign infrastructure is not a nice-to-have — it is a structural requirement. Bilingual field staff, Spanish-language mail and digital, and candidate presence at events in the Latino community are the operational backbone of winning HD-53. A campaign that treats this as an add-on rather than a foundation is misreading where its margin comes from."
      ],
      memoBullets: [
        "Spanish-language field capacity is the single most important operational investment in this district. Budget for bilingual canvassers and phone bankers from day one — not as a late-cycle addition when the base looks soft.",
        "Connect economic policy to Lorain County specifically: the steel and manufacturing industry, the specific employers and union locals that working families in this district know. Generic pro-worker messaging doesn't land the same way as speaking to the actual industrial landscape voters live in.",
        "Hold the white working-class component with disciplined local economic messaging — jobs, healthcare, housing — and avoid any drift toward issues that activate cultural sorting. The 56% margin holds when all three communities feel genuinely represented."
      ]
    }
  },
  {
    id: "oh-hd-54",
    name: "Ohio House District 54",
    city: "Akron",
    region: "Tuscarawas / Coshocton Counties",
    type: "state house district",
    incumbentName: "Kellie Deeter",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Retirement & Medicare Security",      tag: "lean-into", why: "At median age 45.3 — among the oldest district profiles in this portfolio — with 80% homeowners and working-class incomes, this district is saturated with households in active retirement planning. Social Security, Medicare, and prescription drug costs are the concerns that arrive at the door already primed. Deeter's voting record on these issues is the most honest contrast available." },
        { name: "Local Infrastructure & Services",     tag: "lean-into", why: "In a Wayne or Medina County homeowner-majority district, voters evaluate their legislators by what state government delivers locally: roads, water systems, school buildings, rural broadband. Frame every state investment in terms of what it does specifically for this district's taxpayers — not for abstract policy priorities." },
        { name: "Agricultural & Rural Economic Policy", tag: "lean-into", why: "With a 90% white, working-class homeowner profile at the rural edge of the Akron metro, agricultural and small-business economic concerns carry real weight. A candidate who speaks credibly to farm policy, rural economic stability, and small-town business conditions is heard differently than one who doesn't know the landscape." },
        { name: "Social & Cultural Issues",            tag: "careful",   why: "At 90% white and voting 66-34 Republican, this district's cultural center of gravity is firmly conservative. Do not lead with any issue that invites a social contrast. Every door conversation that goes cultural is a door lost. Redirect persistently to retirement, healthcare, and local services." },
        { name: "Urban or Progressive Policy Framing", tag: "avoid",     why: "A rural-adjacent Wayne or Medina County district has moved Republican in part because it defines itself against urban and progressive political culture. A candidate who reads as an Akron or Columbus import — regardless of policy substance — will be rejected on identity before the message lands. Local biography is the prerequisite, not an asset." }
      ],
      memoHeadline: "Older, rural-adjacent, and homeowner-dominant. Retirement security is the only door that opens here.",
      memoParagraphs: [
        "HD-54 is a Wayne or Medina County seat held by Deeter at 66-34 — an older, near-homogeneous, working-class homeowner district at the rural edge of the Akron metro. At 45.3 median age with 80% homeowners and only 20% renters, this is a district of established households whose political anxieties center on protecting what they have built, not on economic transformation. That is a specific and navigable frame for a Democratic candidate.",
        "Retirement security is the single most credible issue in this district's demographic profile. A 45-year median age in a working-class homeowner community means a large share of voters is within 15-20 years of retirement and paying close attention to Social Security, Medicare, and prescription drug costs. These concerns are both universal and bipartisan in this electorate — and they give a Democratic candidate an honest contrast with Deeter's record without requiring a cultural argument.",
        "This is a party-building cycle, not a flip opportunity. The goal is to field a locally rooted candidate, run a disciplined economic campaign, improve on 34%, build a voter file, and develop the organizational infrastructure that makes a more favorable cycle possible. A candidate who finishes at 38-39% and keeps the party's presence felt has accomplished something real."
      ],
      memoBullets: [
        "Find a candidate with Wayne or Medina County roots — a farmer, a local school board member, a retired union worker. The biography must foreclose the cultural-outsider attack before it is made. Without that, no amount of good messaging will move the dial.",
        "Research Deeter's specific votes on Medicare, Social Security, and prescription drug pricing. In a district this old and this working-class, a concrete voting-record contrast on retirement security is your most credible persuasion tool.",
        "Agricultural and rural economic policy is your credibility-builder with the district's most conservative households. Know the Wayne County farming landscape, the local agribusiness concerns, the rural broadband gaps. Demonstrating that knowledge earns you the right to be heard on other issues."
      ]
    }
  },
  {
    id: "oh-hd-55",
    name: "Ohio House District 55",
    city: "Columbus",
    region: "Columbus Far East Exurbs (Licking County)",
    type: "state house district",
    incumbentName: "C. Michelle Teska",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Education Quality & Funding",         tag: "lean-into", why: "At $102,160 median income with 38% college education, this is a high-achieving Columbus exurb full of parents who chose their neighborhood in part because of school quality. State education funding decisions that affect local district budgets — per-pupil spending, teacher pay, program funding — are the rare government actions these voters track closely and feel personally." },
        { name: "Reproductive Rights",                tag: "lean-into", why: "A 90% white, $102K median income, 38% college-educated exurban district voting 73-27 Republican is an outlier in the national pattern — comparable demographics elsewhere have moved toward Democrats sharply on reproductive rights. The issue hasn't been tested here with a serious candidate. A credible challenger who leads with it may find more resonance than the baseline suggests." },
        { name: "Retirement & Healthcare Security",   tag: "lean-into", why: "At median age 40.2 in a high-income homeowner district, households are in peak earning and simultaneously beginning to think seriously about retirement timelines and healthcare costs. Medicare security and prescription drug pricing resonate even in wealthy exurbs — particularly as voters age into the concerns rather than abstractly endorsing them." },
        { name: "Tax & Fiscal Policy",               tag: "careful",   why: "A $102,000 median income district with 84% homeowners is financially comfortable and protective of that comfort. Economic messaging that sounds redistributive, punitive toward high earners, or dismissive of fiscal management concerns will push persuadable voters firmly back to Teska. Lead with investment and security, never with class grievance." },
        { name: "National Democratic Brand Identity", tag: "avoid",     why: "A 73-27 Republican margin in a high-income exurban Columbus district is built on a cultural identity alignment that predates the recent suburban shift. Teska wins by holding both the cultural conservative base and the fiscally conservative professional class. Any candidate who leads with national Democratic positioning surrenders the professional-class persuasion opportunity before the campaign begins." }
      ],
      memoHeadline: "High income, educated, and voting 73-27 Republican — but the suburban shift hasn't been tested here yet.",
      memoParagraphs: [
        "HD-55 presents a strategic puzzle: a $102,160 median income, 38% college-educated Columbus exurban district voting 73-27 Republican — a margin that looks structural but may be partly untested. Comparable demographic profiles in suburban Columbus, Cincinnati, and Cleveland have moved meaningfully toward Democrats in recent cycles on reproductive rights and education. HD-55 hasn't had that test with a serious, credible, well-funded challenger.",
        "The potential opening is real but narrow. The college-educated professional households in this district are the same demographic that has driven Democratic gains in HD-4, HD-8, HD-11, and HD-27. The difference is that HD-55 sits further out on the exurban ring, where the cultural-conservative identity alignment is stronger and the college-educated shift has arrived later. A serious candidate with reproductive rights and education quality at the center of the campaign could cut meaningfully into Teska's margin — not necessarily to win, but to establish that this is contested ground.",
        "The prerequisite is candidate quality above almost anything else. The wrong candidate in this district reinforces cultural sorting and turns a 73-27 result into a 78-22. The right candidate — locally rooted, professionally credible, non-ideological on everything except the issues that genuinely move educated suburban voters — can begin to move the needle."
      ],
      memoBullets: [
        "Recruit a candidate whose biography disarms the cultural-outsider attack before it lands: a local physician, a school principal, a small-business owner who lives in the district and whose career speaks to its values. Profile is the prerequisite here.",
        "Lead with education quality and reproductive rights — the two issues most responsible for the college-educated suburban shift elsewhere in Ohio. Neither requires abandoning fiscal credibility, and both create honest contrasts with Teska's record.",
        "Treat 2026 as a baseline-setting cycle. If a credible candidate moves the result from 73-27 to 67-33, that is a meaningful signal that this seat is on a trajectory worth investing in for 2028."
      ]
    }
  },
  {
    id: "oh-hd-56",
    name: "Ohio House District 56",
    city: "Columbus",
    region: "Columbus Northeast Suburbs (New Albany / Gahanna)",
    type: "state house district",
    incumbentName: "Adam Mathews",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Asian American Voter Registration & Outreach", tag: "lean-into", why: "At 11.2% Asian in a $113K median income, 53%-college-educated Columbus suburb, the district's Asian professional community is large, prosperous, and almost certainly underregistered and undercontacted relative to its population share. This is a constituency that has trended Democratic nationally and whose engagement here is both a moral obligation and a mathematical opportunity." },
        { name: "Education Quality & Funding",          tag: "lean-into", why: "A 53% college-education rate in a high-income suburb means parents are intensely invested in school quality. The same issue driving Democratic gains in comparable Columbus suburbs — state education funding, per-pupil spending, teacher retention — resonates here when connected to specific local district outcomes. This is where the professional class listens." },
        { name: "Reproductive Rights",                 tag: "lean-into", why: "High-income, highly educated suburbs in the Columbus metro have moved measurably toward Democrats on reproductive rights. At 63-37, this district hasn't been seriously tested with that contrast at the center of a well-funded campaign. College-educated suburban women and the growing Asian professional community are the audience — the issue is whether a credible candidate has made the case." },
        { name: "Tax & Fiscal Policy Framing",        tag: "careful",   why: "At $113K median income with 75% homeowners, this is a prosperous professional district with a fiscally conservative streak. Economic messaging must center on investment, competitiveness, and long-term security — not redistribution. A candidate who sounds like they are running against the financial interests of this district's households will lose the persuadable professional voters they need." },
        { name: "National Democratic Brand Positioning", tag: "avoid",  why: "A 63-37 Republican margin in a highly educated, high-income Columbus suburb with a substantial Asian professional population is a structural anomaly — comparable demographics have moved elsewhere. But the path in requires the right candidate and the right issues, not a partisan campaign. Leading with Democratic Party identity in a district this far into Republican territory activates the cultural sorting that keeps it there." }
      ],
      memoHeadline: "A $113K, 53%-college suburb with 11% Asian voters at 63-37 Republican. This seat hasn't been seriously tested yet.",
      memoParagraphs: [
        "HD-56 is one of the most demographically anomalous seats in this portfolio: a $112,829 median income, 53% college-educated Columbus suburb with a growing Asian professional community at 11% — voting 63-37 Republican. That combination of wealth, education, and diversity has produced competitive or Democratic results in comparable Columbus-area districts. The difference here is almost certainly candidate quality and campaign investment, not structural impossibility.",
        "The Asian American professional community at 11% of the district is the most underutilized Democratic constituency in the seat. Nationally, Asian Americans have moved toward Democrats at rates comparable to or exceeding the college-educated suburban shift overall. In a district where they represent one in nine voters, dedicated outreach — culturally specific, community-embedded, and sustained — is both a representation imperative and a margin-building investment.",
        "Reproductive rights and education quality are your two strongest issues with the college-educated suburban professional households that constitute the majority of this district. These are the issues that have driven Democratic gains in HD-4, HD-8, HD-11, and HD-27 in the Columbus metro. A credible candidate who leads on both, avoids partisan overreach on economics, and invests in Asian American community engagement has a real path to making this race competitive."
      ],
      memoBullets: [
        "Asian American outreach is the highest-ROI investment in this district. Start with community organizations, cultural events, and multilingual communication well before campaign season. This community is unlikely to respond to standard campaign outreach that treats them as a secondary audience.",
        "Recruit a candidate whose profile resonates with a high-income professional district — a physician, an engineer, a business owner, or an educator whose biography speaks to the aspirations of the community rather than signaling ideological distance from it.",
        "Lead with reproductive rights and education quality. Don't bury them in a platform — make them the visible, consistent, specific contrast with Mathews's record. These are the issues that moved comparable Columbus suburbs. They will move some of this one too."
      ]
    }
  },
  {
    id: "oh-hd-57",
    name: "Ohio House District 57",
    city: "Cleveland",
    region: "Painesville / Lake County East",
    type: "state house district",
    incumbentName: "Jamie Callender",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Retirement & Medicare Security",      tag: "lean-into", why: "At median age 44 with 81% homeowners in a Lake County district, this electorate is saturated with households approaching retirement. Social Security, Medicare, and prescription drug costs are not abstract concerns — they are the central financial anxieties of the working-class homeowner households that dominate this district. Callender's voting record on these issues is the most honest contrast available." },
        { name: "Local Jobs & Manufacturing",          tag: "lean-into", why: "Lake County's industrial base — manufacturing, skilled trades, supply-chain employment — shapes how voters here evaluate candidates. Economic credibility means knowing the local employers, the union presence, and the workforce training gaps. Candidates who speak to that landscape earn trust; those who don't are heard as outsiders regardless of their party label." },
        { name: "Hispanic Community Outreach",        tag: "lean-into", why: "At 7.2% Hispanic in a district voting 63-37 Republican, the Latino community is almost certainly underregistered relative to its population share. Lake County's Hispanic community is predominantly working-class and may have significant first- and second-generation voters who have not yet been systematically reached by Democratic campaigns. A dedicated outreach investment here is a floor-raising opportunity." },
        { name: "Social & Cultural Issues",           tag: "careful",   why: "An 88% white working-class homeowner district in Lake County has moved firmly Republican on cultural grounds over the past decade. Do not lead with or be drawn onto social terrain. Every conversation that goes cultural is a door closed with the persuadable working-class voter you need. Redirect to retirement, healthcare, and local jobs every time." },
        { name: "Urban or Progressive Policy Identity", tag: "avoid",   why: "Callender wins by holding working-class white Lake County voters who have defined their political identity in opposition to what they perceive as urban Democratic values. A candidate who reads as a Cleveland or Columbus import — in language, in priorities, or in biography — will find that cultural rejection arrives before the first policy argument. Local roots are the prerequisite." }
      ],
      memoHeadline: "Down 26 in an older working-class Lake County seat. Retirement security opens the only reliable door.",
      memoParagraphs: [
        "HD-57 is a Lake County seat held by Callender at 63-37 — an older, predominantly white working-class homeowner district that has drifted Republican over the past decade on cultural grounds. At $85,836 median income with only 31% college education and a median age of 44, this is a district of established working-class households whose political calculus is centered on protecting economic stability, not on ideological alignment. That creates a narrow but real opening.",
        "The retirement security argument is the clearest path into this electorate. A 44-year median age in a working-class homeowner district means the electorate is full of households within 20 years of retirement who are paying close attention to Social Security, Medicare, and what prescription drugs actually cost. Callender's voting record on all three is a genuine vulnerability — one that rarely gets tested aggressively enough in a district this Republican.",
        "The Hispanic community at 7.2% is the one demographic variable that disrupts the otherwise near-homogeneous composition of this district. A registration and outreach investment in Lake County's Latino working-class community — bilingual, community-embedded, and sustained — is both underdone by Democrats in this district and capable of meaningfully improving the floor over multiple cycles."
      ],
      memoBullets: [
        "Research Callender's votes on Medicare, prescription drug pricing, and Social Security in detail. A concrete, specific voting-record contrast on retirement security is your most credible persuasion tool with the 44-year-median-age working-class homeowner households who are your best persuasion targets.",
        "Invest in Hispanic voter registration in Lake County's Latino community. At 7.2% of the district and likely underregistered, this is a multi-cycle floor-raising opportunity that Democratic campaigns in HD-57 have historically underfunded.",
        "Candidate biography is the first barrier. A Lake County native — a union member, a skilled tradesperson, a local business owner — whose roots in the district are unimpeachable is the only profile that neutralizes the cultural-outsider attack before it lands."
      ]
    }
  },
  {
    id: "oh-hd-58",
    name: "Ohio House District 58",
    city: "Cleveland",
    region: "Youngstown / Trumbull County",
    type: "state house district",
    incumbentName: "Lauren McNally",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
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
      issues: [
        { name: "Working-Class Economic Security",     tag: "lean-into", why: "At $62,621 median income with only 30% college education in the Mahoning Valley, this is a working-class district where economic security is not a campaign theme — it is the organizing reality of daily life. Wages, healthcare costs, pension protection, and local job quality are the issues that bind McNally's coalition across racial lines and keep it Democratic." },
        { name: "Local Jobs & Manufacturing",          tag: "lean-into", why: "The Mahoning Valley's steelworking and manufacturing identity is the cultural and economic backbone of this district. Credible candidates here know the employer base, the union locals, and the specific workforce concerns of a region that has navigated decades of industrial change. Economic policy must be translated into what it means for Trumbull and Mahoning County workers." },
        { name: "Healthcare & Pension Security",       tag: "lean-into", why: "An older median age (43.9) in a working-class district with strong union history means pension protection, retiree healthcare, and prescription drug costs are felt urgently and personally. These are not just economic issues here — they are promises that were made to workers who built careers around them. Speak to that covenant directly." },
        { name: "Policing & Community Safety",        tag: "careful",   why: "McNally's coalition spans white working-class, Black, and Hispanic households that have distinct relationships to law enforcement in a post-industrial Mahoning Valley city. Lead with community safety outcomes — what residents need on specific streets — rather than either reform framing or law-and-order rhetoric. The goal is to hold all three communities without activating division between them." },
        { name: "National Progressive Cultural Positioning", tag: "avoid", why: "McNally's 58-42 win is built on a working-class white majority that holds Democratic on economic and local grounds. This is Youngstown and Mahoning Valley territory — an area that has voted Democratic for generations on union and labor identity and can drift when the candidate signals cultural distance from working-class values. Don't give the Republican a cultural contrast to run." }
      ],
      memoHeadline: "McNally holds working-class Mahoning Valley by staying local, economic, and union-rooted. Don't change what works.",
      memoParagraphs: [
        "HD-58 is a Mahoning Valley district that McNally won 58-42 by holding the kind of working-class Democratic coalition that has eroded across most of the Rust Belt. An 85% white district at $62,621 median income with strong union heritage voting 58% Democratic is not an accident — it is the result of a candidate and a campaign that speaks the right language in the right register for this specific community. The strategic imperative is to understand what is working and not disrupt it.",
        "Manufacturing, healthcare, and pension security are the three issues that hold this coalition together. These are not just policy positions here — they are lived concerns for households that built careers in the Valley's industrial base and are now navigating retirement, healthcare costs, and what the regional economy offers their children. A candidate who speaks to those concerns with specific, local knowledge earns a trust that generic Democratic messaging cannot replicate.",
        "The district's minority communities — 6% Hispanic and 6% Black — are smaller shares than in some comparable seats but are still meaningful margin contributors. Visible representation and responsiveness to these communities' specific concerns is both a governing obligation and a political necessity for maintaining a coalition that needs every component."
      ],
      memoBullets: [
        "Union and labor relationships are the backbone of this coalition. Maintain active, visible ties with Mahoning Valley union locals — the endorsements, the events, the earned media in labor-aligned outlets. These relationships are the infrastructure the margin is built on.",
        "Pension security and retiree healthcare are your most personal issues with older working-class voters. Know the specific pension funds, the specific employer healthcare situations, the specific retiree concerns in Trumbull and Mahoning County. Generic talking points don't land — specificity does.",
        "Don't nationalize this race under any circumstances. Every message must speak to Youngstown, to the Valley, to the specific economic situation of Mahoning County families. The moment this becomes a race about national Democratic politics, the white working-class component of the coalition begins to erode."
      ]
    }
  },
  {
    id: "oh-hd-59",
    name: "Ohio House District 59",
    city: "Cleveland",
    region: "Trumbull County Rural (Warren Area)",
    type: "state house district",
    incumbentName: "Tex Fischer",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Black Voter Turnout & GOTV",          tag: "lean-into", why: "At 20.8% Black in a district that lost 57-43, the arithmetic is urgent: if Black voters in Trumbull or Mahoning County are underperforming their turnout potential, closing that gap is the clearest path to flipping the seat. This is a mobilization problem before it is a message problem. Invest in precinct-level turnout analysis and a dedicated Black GOTV operation before any other strategic decision." },
        { name: "Kitchen-Table Economic Issues",       tag: "lean-into", why: "At $49,959 median income — below the Ohio median — with only 22% college education and 30% renters, economic precarity is immediate and shared across the district's racial communities. Wages, utility costs, healthcare bills, and housing stability are the issues that open doors with both white working-class and minority households. Speak to survival, not aspiration." },
        { name: "Healthcare Affordability",            tag: "lean-into", why: "A below-median income district with a 43-year median age has real and compounding exposure to healthcare system failures. Uninsured costs, prescription drug bills, and the cost of caring for aging parents are felt across racial lines here. Healthcare is a bipartisan pocketbook concern that gives Democrats honest contrast without triggering cultural resistance." },
        { name: "Policing & Public Safety",           tag: "careful",   why: "With 21% Black residents in a district currently held by a Republican, policing is a fault line that can fracture the coalition you need to build. Lead with community safety outcomes — response times, staffing levels, neighborhood investment — not reform language that reads differently to white working-class and Black households respectively." },
        { name: "National Democratic Identity",       tag: "avoid",     why: "Fischer holds this district by winning enough white working-class voters who have moved Republican culturally. A campaign that leads with national Democratic identity — rather than Trumbull or Mahoning County economic credibility — reinforces the cultural sorting that keeps these voters in Fischer's column. Be a local candidate running on local concerns, not a party representative running a national message." }
      ],
      memoHeadline: "Down 14 with 21% Black voters who may not be turning out. The math says this is a mobilization problem.",
      memoParagraphs: [
        "HD-59 is a Trumbull or Mahoning County district that Fischer won 57-43 in a seat that should not be as Republican as the result suggests. A district that is 70% white and 21% Black at $49,959 median income is — on paper — Democratic territory. The 14-point Republican margin is almost certainly a function of Black voter turnout underperformance and white working-class cultural drift, not of genuine ideological alignment with Fischer's party.",
        "The mobilization math matters more than the persuasion math here. Before any message testing, any mail program, any candidate positioning, the campaign needs a granular analysis of where Black voter registration and turnout falls below its potential in the district's precincts. That data tells you where to put field resources. A GOTV operation that moves Black turnout by 10 percentage points in the right precincts is worth more than any amount of persuasion mail aimed at white working-class voters who are already sorted.",
        "For the white working-class component — 70% of the district — the path is relentlessly economic and local. Below-median income, below-average college education, 30% renters: this is a community managing economic precarity across racial lines, and the concerns are concrete and immediate. A candidate who speaks to those specifics — with knowledge of the local employers, the healthcare system, the housing market — earns enough trust to hold the white working-class households who haven't fully sorted Republican."
      ],
      memoBullets: [
        "Start with a precinct-level turnout audit. Identify where Black voter registration and turnout fall furthest below population proportions in Trumbull or Mahoning County. That map is the field plan — resource it accordingly before anything else.",
        "Partner with trusted community organizations in the district's Black community — churches, civic groups, social service organizations — to lead GOTV efforts. Community-embedded organizations reach low-propensity voters more effectively than outside political campaigns in low-income, high-distrust environments.",
        "Healthcare costs and economic survival are your persuasion openers for white working-class households. Keep the message concrete, local, and free of national partisan signals. Fischer wins by holding these voters culturally — your job is to make the economic argument compelling enough to peel some of them back."
      ]
    }
  },
  {
    id: "oh-hd-60",
    name: "Ohio House District 60",
    city: "Columbus",
    region: "Columbus Outer Suburbs (Delaware / Licking)",
    type: "state house district",
    incumbentName: "Brian Lorenz",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Education Quality & Funding",         tag: "lean-into", why: "At $126,785 median income with 55% college-educated in a Columbus suburb, this is a district of high-achieving professional households who chose their neighborhood for its schools and vote to protect them. State education funding decisions — per-pupil spending, teacher pay, school building conditions — are tracked closely by parents here. This is the issue with the broadest coalition appeal." },
        { name: "Reproductive Rights",                tag: "lean-into", why: "An 8-point Republican margin in a $127K, 55%-college-educated Columbus suburb is a structural anomaly. Comparable demographics in the Columbus metro — HD-4, HD-8, HD-11 — have moved Democratic on reproductive rights. Morocco's 46% in 2024 suggests this district is already moving. A well-funded campaign with reproductive rights at the center can close the remaining gap." },
        { name: "Asian American Community Outreach",  tag: "lean-into", why: "At 6.5% Asian in a high-income Columbus suburb, the Asian professional community is a growing constituency that is likely undercontacted by Democratic campaigns in this district. Nationally, Asian Americans have moved sharply toward Democrats. A sustained outreach investment here — community events, multilingual communication, policy that speaks to the concerns of professional immigrant families — compounds across cycles." },
        { name: "Tax & Fiscal Policy Framing",        tag: "careful",   why: "At $127K median income with a predominantly homeowner professional class, voters here are protective of their economic position and attentive to fiscal credibility. Every economic policy position must be framed around investment, competitiveness, and long-term security. Anything that sounds like a net tax increase on upper-middle-income professional households will push persuadable voters back to Lorenz." },
        { name: "Overreaching on Economic Populism",  tag: "avoid",     why: "This is not a district where economic grievance politics lands. These are successful professionals who have made it and want to protect what they built. A campaign that leans into economic populism — even earnestly — signals a values mismatch with a district whose daily economic reality is prosperity, not precarity. Run on values, governance quality, and rights — not class contrast." }
      ],
      memoHeadline: "Eight points from flipping the highest-income district in the batch. Reproductive rights and education close this gap.",
      memoParagraphs: [
        "HD-60 is the most compelling near-miss in this batch. Morocco lost to Lorenz 45.8-54.2 in a $126,785 median income, 55% college-educated Columbus suburb — a demographic profile that has already produced Democratic wins in HD-4, HD-8, HD-11, and HD-27 in the same metro area. The district is clearly on a trajectory. The question is whether the 2026 campaign is the one that closes it.",
        "Reproductive rights is the issue that has driven the college-educated suburban shift across the Columbus metro, and HD-60 has not yet been seriously tested with a well-funded campaign that puts it front and center. The 46% floor Morocco established suggests the underlying movement is real. A candidate who leads visibly and specifically on reproductive rights — not burying it in a policy platform but making it the central contrast — and pairs it with a strong education message is the formula that has worked in comparable seats.",
        "The Asian American professional community at 6.5% is an underutilized asset. In a district this competitive, every percentage point of the electorate matters. A sustained, culturally specific outreach operation that registers and engages the district's Asian community over multiple cycles is both a representation imperative and a strategic force multiplier."
      ],
      memoBullets: [
        "Treat this as the top-priority flip opportunity in the Columbus area after HD-4 and HD-8. Lorenz's margin is holdable but not comfortable — a well-resourced, well-run Democratic campaign with reproductive rights at the center has a real path to 50%.",
        "Invest in Asian American voter outreach starting now — community events, multilingual digital communication, candidate presence at cultural events. At 6.5% of a competitive district, this community is large enough to decide the race in a close year.",
        "Fiscal credibility is table stakes, not a selling point. This district will vote for a Democrat on values and rights — but only if they are not frightened off by economic positioning that sounds threatening to their household's prosperity. Stay on governance and values. Let the economic argument be implicit in your biography."
      ]
    }
  },
  {
    id: "oh-hd-61",
    name: "Ohio House District 61",
    city: "Columbus",
    region: "Dublin / Powell (Delaware County)",
    type: "state house district",
    incumbentName: "Beth Lear",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Reproductive Rights",                tag: "lean-into", why: "Beth Lear is among Ohio's most vocal conservative legislators on abortion — and she represents a $122K median income, 55%-college-educated Columbus suburb with a growing Asian professional population. That mismatch is the campaign. College-educated suburban women in districts like this have been the engine of Democratic gains across the Columbus metro. This issue belongs at the center of every voter contact." },
        { name: "Education Quality & Funding",         tag: "lean-into", why: "A 55% college-education rate in a high-income suburb means parents chose this community for its schools and vote accordingly. Lear's legislative record on education funding creates an honest contrast with a constituency that is directly invested in what the state delivers to local school districts. Connect every state budget decision to specific local impacts." },
        { name: "Asian American Community Outreach",  tag: "lean-into", why: "At 7.8% Asian in a high-income Columbus suburb, this professional community is one of the largest and most undercontacted Democratic constituencies in the district. Nationally, Asian Americans have moved sharply toward Democrats on reproductive rights and education. A sustained, culturally specific outreach program compounds across cycles and is likely the margin difference between a credible loss and a genuine upset." },
        { name: "Tax & Fiscal Policy Framing",        tag: "careful",   why: "At $122K median income with predominantly homeowner professional households, fiscal positioning matters. Economic messaging must be centered on investment, security, and quality of governance — not redistribution or class contrast. These voters are open to Democrats on values and rights; don't create friction on the economic terrain where their default Republican habit is strongest." },
        { name: "Candidate Overreach on Cultural Issues", tag: "avoid", why: "Lear's extremism is your contrast — don't match it with progressive overreach in the opposite direction. The persuadable voters in this district are college-educated moderates who are moving away from Republican cultural positioning, not toward progressive cultural positioning. A candidate who reads as ideologically driven from the left will push them back to Lear or to staying home." }
      ],
      memoHeadline: "Lear's record is the campaign. A $122K, 55%-college suburb shouldn't be electing one of Ohio's most extreme legislators.",
      memoParagraphs: [
        "HD-61 is a high-income, highly educated Columbus suburb at 62-38 Republican — a margin that should be shrinking faster than it is, given what has happened in comparable districts like HD-4 (D 57%), HD-8 (D 65%), and HD-60 (D 46%). Beth Lear is an ideological outlier in a district whose professional-class residents have moved toward Democrats on reproductive rights and education across the Columbus metro. The gap between the district's values and its representation is real and exploitable.",
        "Reproductive rights is the sharpest tool available. Lear's legislative record — specific votes, specific positions, specific statements — should be made unavoidable for every registered voter in this district who has not yet connected her record to their values. This is not a message that requires nuance or softening. College-educated suburban women in $122K-median-income Columbus suburbs have made clear across Ohio what they think of legislators with Lear's record.",
        "The Asian American professional community at 7.8% is the structural opportunity that makes this seat genuinely flippable over time. In a district as close as HD-60 or as stubborn as HD-61, that community — properly registered, engaged, and turned out — is decisive. A campaign that treats Asian American outreach as a campaign-season add-on rather than a multi-year community relationship will leave the most available votes untouched."
      ],
      memoBullets: [
        "Make Lear's record unavoidable. Every mail piece, every door script, every digital ad should connect her specific legislative positions on reproductive rights and education to what it means for families in this specific Columbus suburb. Don't abstract it — name the votes, name the impacts.",
        "Asian American outreach is a multi-year investment, not a campaign-season tactic. Start with community events, multilingual communication, and candidate presence in culturally specific settings well before any election. This community responds to relationship, not to mail drops.",
        "Recruit a candidate whose professional profile fits the district — a physician, a technologist, an educator — whose biography makes the cultural-outsider attack implausible. In a district with this much latent movement, candidate quality is the variable that determines whether it flips or stays stubbornly Republican."
      ]
    }
  },
  {
    id: "oh-hd-62",
    name: "Ohio House District 62",
    city: "Cincinnati",
    region: "Cincinnati Eastern Exurbs (Milford / Clermont)",
    type: "state house district",
    incumbentName: "Jean Schmidt",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Reproductive Rights", tag: "lean-into", why: "Jean Schmidt has a long record of voting against abortion access. Cincinnati suburban women with college education have shown sensitivity to this issue in 2022 and 2024 statewide results. Even in a 63-37 district, this message narrows the margin and activates low-propensity women voters." },
        { name: "Property Taxes & Cost of Living", tag: "lean-into", why: "At $87K median income with 28% renters, this district has middle-class voters under real financial pressure. Schmidt's votes on state tax policy affecting working families provide concrete contrast opportunities." },
        { name: "Public Education Funding", tag: "lean-into", why: "A 37% college rate and significant family demographic suggest public school investment resonates. Schmidt's record on school funding can be used to frame her as out of touch with suburban families." },
        { name: "Immigration", tag: "avoid", why: "95% white, R+26 suburban district. Immigration as a Democratic message will not move votes here and may harden opposition turnout. Stick to kitchen-table economics and local governance." },
        { name: "Jean Schmidt's National Extremism Record", tag: "careful", why: "Schmidt has national name recognition and a long track record. Attacking her personally can backfire if the candidate lacks comparable local credibility. Lead with issues, not biography attacks." }
      ],
      memoHeadline: "Schmidt's record is an opening, not a guarantee. In a 63-37 district, the goal is to run up the score in a cycle where Ohio suburban women are persuadable.",
      memoParagraphs: [
        "HD-62 is a Cincinnati suburban seat that Jean Schmidt has held for years. At R+26, this is not a primary target — but it is not a write-off either. The 2024 margin was 63-37, which is better than the worst-case Republican performance in comparable Ohio suburbs in presidential years.",
        "The district's income profile ($87K) and 28% renter rate mean real cost-of-living pressure exists. Reproductive rights and property tax policy are the two issues most likely to peel off soft Republican women voters and activate sporadic Democratic-leaning voters who stayed home.",
        "The realistic goal in 2026 is a 58-42 or 57-43 result with a strong candidate — enough to signal vulnerability and drain Schmidt's time and resources away from other targets. Flipping the seat requires a structural shift in Cincinnati suburban composition that is possible by 2028 if candidate development starts now."
      ],
      memoBullets: [
        "Run a candidate with deep Cincinnati suburban roots — a local school board member, healthcare professional, or small business owner. Jean Schmidt's brand is incumbency; the counter-brand is hyper-local.",
        "Make reproductive rights the central contrast issue. Pull Schmidt's specific votes and connect them to what suburban families in HD-62 actually experience at local clinics and hospitals.",
        "Property tax relief and school funding are secondary but credible. Frame Schmidt's record on state budget allocations and show the direct impact on HD-62 property owners and parents.",
        "Do not run a national Democrats message. The candidate should be seen eating at local diners and attending local events, not talking about Washington."
      ]
    }
  },
  {
    id: "oh-hd-63",
    name: "Ohio House District 63",
    city: "Cincinnati",
    region: "Cincinnati Far East (Anderson / East Clermont)",
    type: "state house district",
    incumbentName: "Adam C. Bird",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Manufacturing & Trade Jobs", tag: "lean-into", why: "At $76K median income with only 21% college, this is a working-class exurban district. Trade, manufacturing, and job security are the only credible economic frames. Tariff impacts and factory closures resonate here even among Republican voters." },
        { name: "Prescription Drug & Healthcare Costs", tag: "lean-into", why: "Below-state-median college attainment and working-class demographics mean healthcare costs hit this district directly. Medicare, drug pricing, and rural hospital access are concerns that can cross party lines in a 75-25 district." },
        { name: "Farm & Rural Infrastructure", tag: "careful", why: "Exurban Cincinnati districts often include farming communities and rural residents dependent on state infrastructure investment. A Democrat who demonstrates knowledge of agricultural policy and rural broadband is more credible than one who doesn't." },
        { name: "Cultural and Social Issues", tag: "avoid", why: "At 95% white and R+50, leading with LGBTQ+ rights, immigration, or social equity framing will collapse any coalition before it forms. Economic-only messaging is the only viable path." },
        { name: "Gun Control", tag: "avoid", why: "This is exurban Ohio at 75-25. Gun ownership is deeply embedded in local identity. Any candidate framing around gun restrictions will face immediate and total backlash. Silence is the strategy." }
      ],
      memoHeadline: "A 75-25 district needs a candidate who sounds like the district, not a messenger from Columbus. 2026 is candidate development year.",
      memoParagraphs: [
        "HD-63 is among the most Republican seats in Cincinnati's exurban orbit. Adam Bird won by 50 points in 2024. At 95% white and 21% college-educated, this is a working-class rural/exurban electorate that has moved decisively toward the GOP over the past decade on cultural identity, not economics.",
        "The only credible path in this district is a candidate who already lives there, has deep community ties, and speaks the economic language of local workers — manufacturing, farming, trade. That candidate cannot exist without a multi-year recruitment and development effort.",
        "The strategic value of contesting HD-63 in 2026 is vote-share expansion and donor list building, not winning. A 65-35 result with a serious local candidate would be a genuine success and a signal for 2028. Anything worse than 70-30 means the candidate wasn't right."
      ],
      memoBullets: [
        "Start candidate prospecting now — look for union members, veteran small farmers, local tradespeople, or school board members with a community footprint.",
        "Do not field a candidate who moved to the district for the race. Authenticity is the only currency that works here.",
        "Economic contrast is the only viable frame: Medicare, drug costs, job security. Avoid identity politics entirely.",
        "Set a realistic 2026 goal of 65-35. Use the race to build infrastructure (email lists, donor network, precinct captains) for a serious 2028 attempt."
      ]
    }
  },
  {
    id: "oh-hd-64",
    name: "Ohio House District 64",
    city: "Cleveland",
    region: "Mahoning / Trumbull County South",
    type: "state house district",
    incumbentName: "Nick Santucci",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $51K median income with 34% renters and 21% college attainment, this is a financially stressed working-class district in the Cleveland orbit. Wage stagnation, job loss, and affordability are concrete daily concerns. This is the primary persuasion frame." },
        { name: "Healthcare Costs & Medicaid", tag: "lean-into", why: "Below-median income and high renter rate mean healthcare cost exposure is real. Medicaid expansion, drug pricing, and coverage protection are practical concerns that D voters respond to and that peel soft R voters in this income range." },
        { name: "Black Voter Mobilization", tag: "lean-into", why: "At 12% Black population in a 56-44 district, the Black community represents the decisive margin. If Black turnout is high and cohesive, this is a winnable seat. GOTV investment in Black precincts is the highest-ROI activity in this district." },
        { name: "Public Safety Framing", tag: "careful", why: "A district that is 80% white and voted R 56-44 has voters who respond to public safety messaging. Democrats must own a community-investment public safety frame (not defund) — connecting crime to economic decline and inadequate social services." },
        { name: "National Democratic Brand", tag: "avoid", why: "This is a working-class district in a swing area where the national Democratic Party brand is a liability. Candidates must lead with local identity and economic populism. National partisan framing activates the Republican base without adding Democratic votes." }
      ],
      memoHeadline: "56-44 is a genuine pickup opportunity. Black turnout plus working-class economic populism is the winning formula — if the candidate is local.",
      memoParagraphs: [
        "HD-64 is one of the more competitive Cleveland-orbit seats. Nick Santucci won at 56-44 in 2024, but this margin is not structural — it reflects candidate quality and turnout dynamics, not permanent realignment. The district's demographics (80% white, 12% Black, $51K income, 34% renters) create a real coalition opportunity.",
        "The mathematical path to victory is straightforward: consolidate the Black vote at 80%+ turnout and loyalty, while running a working-class economic message that peels 5-8 points off soft Republican white voters who are feeling financial pressure. That combination flips a 56-44 to a 51-49 or better.",
        "The candidate must be from this community. The district is economically stressed and politically alienated — a parachuted candidate will not work. A local union member, healthcare worker, or longtime community organizer with credibility in both white working-class and Black precincts is the profile."
      ],
      memoBullets: [
        "Invest in Black precinct GOTV infrastructure immediately. HD-64's Black community is the swing variable — higher turnout at high loyalty wins the seat.",
        "Run an economic populist message anchored to wages, healthcare costs, and housing affordability. Avoid national issues. Make it about what Santucci has and hasn't done for this specific district.",
        "The candidate must have credibility in both white working-class and Black Cleveland-orbit communities. This is a rare and specific profile — find them early.",
        "Track precinct-level data from 2024 carefully. Identify which white precincts drifted R and why. Those are the persuasion targets; price-of-living messaging likely works there."
      ]
    }
  },
  {
    id: "oh-hd-65",
    name: "Ohio House District 65",
    city: "Cleveland",
    region: "Mahoning County South / Columbiana",
    type: "state house district",
    incumbentName: "David Thomas",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Manufacturing", tag: "lean-into", why: "At $62K income and only 18% college, this is a working-class Cleveland-exurban district. Trade job loss, factory closures, and wage stagnation are the only frames that can move voters here. Connect David Thomas's Statehouse votes to local economic outcomes." },
        { name: "Healthcare & Drug Costs", tag: "lean-into", why: "Low college attainment and working-class demographics mean prescription drug prices, rural hospital access, and Medicaid protection are genuine daily concerns. This frame can cross party lines with non-college white voters." },
        { name: "Candidate Recruitment as Primary Goal", tag: "lean-into", why: "David Thomas ran uncontested in 2024. The single most important 2026 action is finding and fielding a credible local candidate. An uncontested R seat is a signal of party infrastructure failure, not district impossibility." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "95% white, deeply Republican, 18% college. Social justice framing will immediately alienate the voters this district requires. Economic populism is the only viable lane." },
        { name: "National Democratic Messaging", tag: "avoid", why: "Thomas ran unopposed because the district is assumed unwinnable. A candidate who sounds like national Democrats will confirm that assumption. The only path is hyper-local economic credibility." }
      ],
      memoHeadline: "No opponent in 2024 means no baseline. Fix that first — then worry about winning.",
      memoParagraphs: [
        "HD-65 was uncontested in 2024. David Thomas held the seat without a race. At 95% white and 18% college-educated, this is a deeply Republican working-class Cleveland exurban district that has been written off organizationally — and that write-off is a self-fulfilling prophecy.",
        "The strategic priority for 2026 is not winning. It is fielding a candidate — any credible local candidate — to establish a baseline vote share, build precinct infrastructure, and make the district visible on the Democratic map. Even a 65-35 loss with an organized candidate provides data and volunteer infrastructure that a continued walkover does not.",
        "The candidate profile is narrow but not impossible: a retired autoworker, a local nurse, a small farmer, or a school board veteran who is known and respected in the community. The message is strictly economic: drug costs, job security, what Thomas has actually done in Columbus."
      ],
      memoBullets: [
        "Priority one: find a candidate. Contact local unions, school boards, and healthcare associations in the district. Do not run a volunteer who showed up at a party meeting — find someone the community already respects.",
        "The campaign should be run on a shoestring with a hyperlocal message. Trying to nationalize this race will backfire immediately.",
        "Use the 2026 campaign to build email lists, identify friendly precincts, and train local volunteers. The infrastructure built here matters more than the vote share.",
        "Set a realistic goal: hold Thomas under 65%. Beat that and call it a win."
      ]
    }
  },
  {
    id: "oh-hd-66",
    name: "Ohio House District 66",
    city: "Columbus",
    region: "Licking / Knox County (Newark Area)",
    type: "state house district",
    incumbentName: "Sharon A. Ray",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Reproductive Rights", tag: "lean-into", why: "At $95K median income and 40% college-educated, HD-66 has the demographic profile of a Columbus suburb that has started moving Democratic on reproductive rights. Sharon Ray's Statehouse voting record on abortion access is a concrete and credible contrast point for professional women in this district." },
        { name: "Public Education Quality & Funding", tag: "lean-into", why: "Forty percent college attainment and a family-age district (median 43) means school quality is a live issue. Ray's votes on education funding, public school investment, and school choice policy can be framed around what it means for kids in HD-66 specifically." },
        { name: "Property Taxes & Suburban Cost of Living", tag: "lean-into", why: "Even at $95K median income, property tax pressure in the Columbus metro is real and rising. A candidate who can speak credibly about state budget decisions that shift costs onto suburban homeowners has an opening with soft Republican voters." },
        { name: "Immigration", tag: "avoid", why: "93% white, R+30, Columbus upper-middle-class suburb. Immigration as a Democratic message will activate Republican base turnout without adding Democratic votes. Stay on kitchen-table issues." },
        { name: "Economic Populism / Class Conflict", tag: "avoid", why: "At $95K income and 40% college-educated, this district is not receptive to wealth-redistribution framing. The message must be professional-class values: education quality, rights, good governance — not inequality politics." }
      ],
      memoHeadline: "Ray's Statehouse record in a $95K, 40%-college suburb is a liability waiting to be activated. 2026 is the year to test it.",
      memoParagraphs: [
        "HD-66 is a high-income Columbus suburb that voted R 65-35 in 2024. Sharon Ray won comfortably, but the demographic profile — $95K median income, 40% college-educated, family-age — matches districts in the Columbus metro that have been shifting Democratic as Republican legislative overreach on abortion and education has become more visible.",
        "The 65-35 margin is not impenetrable. It reflects a district that has not yet been seriously contested with the right message and candidate profile. Comparable suburban Columbus seats have moved 8-12 points toward Democrats over two cycles when reproductive rights and education were the central contrast.",
        "The 2026 goal is not to win — it is to run HD-66 to 58-42 or better with a strong candidate, demonstrating trend movement and forcing Ray to spend resources defending a seat she currently ignores. A competitive 2026 race sets up a genuine flip attempt in 2028."
      ],
      memoBullets: [
        "The candidate must be from the district and embody its professional-class values: a pediatrician, educator, or local business owner. The anti-Ray message is about values and judgment, not party labels.",
        "Lead with reproductive rights and pull Ray's specific votes. Translate them into what they mean for families and healthcare providers in the Columbus suburbs.",
        "Education funding and school quality are the secondary frame. Connect Ray's Statehouse record to local school budgets and outcomes in HD-66.",
        "Avoid national Democratic branding. Run as a local, community-focused candidate who happens to be a Democrat — not the other way around."
      ]
    }
  },
  {
    id: "oh-hd-67",
    name: "Ohio House District 67",
    city: "Akron",
    region: "Wayne / Holmes Counties (Wooster Area)",
    type: "state house district",
    incumbentName: "Melanie Miller",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Manufacturing & Trade Job Security", tag: "lean-into", why: "At $77K income and 26% college, this is a working-class Akron-area district. Melanie Miller ran uncontested, but the underlying economic profile — modest wages, working-class households — is exactly the terrain where Democrats can compete on trade, jobs, and corporate accountability." },
        { name: "Healthcare Costs & Prescription Drugs", tag: "lean-into", why: "Non-college working-class households in the Akron orbit are exposed to healthcare cost volatility. Medicaid protection and drug pricing are practical concerns that cross party lines in districts like this when delivered by the right messenger." },
        { name: "Candidate Development as First Priority", tag: "lean-into", why: "Miller ran uncontested in 2024. Before any message strategy, the district needs a candidate. The Akron labor network and local union halls are the first places to look for someone with the community credibility and economic biography this district requires." },
        { name: "Social & Cultural Issues", tag: "avoid", why: "93% white, deeply Republican, only 26% college-educated. Any candidate who leads with social justice, identity, or cultural framing will face an immediate trust collapse. Economic biography is the only credible opening." },
        { name: "Anti-Miller Personal Attacks", tag: "avoid", why: "Miller ran unopposed. There is no established negative contrast to run against and no base campaign narrative yet exists in this district. Establish credibility with the community first; opposition research comes later." }
      ],
      memoHeadline: "Miller ran unopposed. That is the problem to solve in 2026 — not winning, but showing up.",
      memoParagraphs: [
        "HD-67 is a working-class Akron-area district that sent Melanie Miller to Columbus without a single opposing vote in 2024. At 93% white and 26% college-educated, the district leans Republican on identity — but its economic profile ($77K income, working-class households) is not inherently hostile to a labor-rooted Democratic message.",
        "The fact that no candidate was fielded in 2024 is an organizational failure, not a demographic verdict. This district shares characteristics with Mahoning Valley and Youngstown-area seats that supported Democrats for decades. The realignment is real but it is not complete.",
        "The 2026 goal is simple: field a credible local candidate, run a focused economic message, and establish a vote-share baseline. Even a 65-35 loss with an organized campaign builds the local infrastructure — volunteer lists, donor relationships, precinct captains — that makes a competitive race in 2028 possible."
      ],
      memoBullets: [
        "Contact Akron-area union locals immediately. A retired Goodyear worker, a building trades member with community recognition, or a local teacher's union rep is the profile that works here.",
        "The message is strictly economic: what Miller has voted for in Columbus, what it means for this district's workers and retirees. No national branding.",
        "Healthcare costs and prescription drug pricing are the most cross-partisan issues available. Lead with them in every door knock and mailer.",
        "Set the 2026 goal at 65-35. Beat that and you have a story to tell and infrastructure to build on."
      ]
    }
  },
  {
    id: "oh-hd-68",
    name: "Ohio House District 68",
    city: "Columbus",
    region: "Licking / Knox / Coshocton Counties",
    type: "state house district",
    incumbentName: "Thad Claggett",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Housing Affordability & Renters' Rights", tag: "lean-into", why: "At 31% renters and $75K median income in the Columbus orbit, affordability pressure is acute. Claggett's record on tenant protections, housing development, and property tax policy gives a Democrat concrete contrast material with a large share of the electorate." },
        { name: "Economic Security & Wages", tag: "lean-into", why: "At 30% college and $75K income, this is a middle-income Columbus exurb with real working-class exposure. Wage growth, job quality, and economic security are primary concerns. Connect Claggett's Statehouse votes to working families' day-to-day financial reality." },
        { name: "Reproductive Rights", tag: "lean-into", why: "At 59-41 in the Columbus metro, this district has a meaningful Democratic base that can grow. Reproductive rights are a proven mobilizer in Columbus-area seats — Claggett's voting record on abortion access is a high-value contrast point for women voters in this district." },
        { name: "Public Safety Framing", tag: "careful", why: "88% white with a 31% renter rate creates a suburban/exurban mix where public safety is a credible concern. Democrats must own a community-investment public safety frame — connecting economic investment to safer neighborhoods — not cede the issue entirely to Republicans." },
        { name: "National Party Branding", tag: "avoid", why: "This is a 59-41 Columbus suburb where the Republican won. Nationalizing the race activates the partisan base without moving persuadable voters. The candidate must be hyper-local, with a message about what Claggett specifically has and hasn't done for this community." }
      ],
      memoHeadline: "59-41 in a Columbus suburb with 31% renters is not a red district — it is an under-organized one.",
      memoParagraphs: [
        "HD-68 voted R 59-41 in 2024. Thad Claggett won, but this is a Columbus-orbit district with the demographic ingredients for a Democratic pickup: 31% renters, $75K median income, 30% college, and a diverse enough population to build a coalition. The 41% Democratic floor is a base, not a ceiling.",
        "Housing affordability is the single most powerful frame in this district. Thirty-one percent renters means a huge share of the electorate is experiencing cost pressure directly — rent increases, lease insecurity, inadequate maintenance. A candidate who can speak credibly about tenant protections and housing development versus Claggett's record has an immediate organizing hook.",
        "Reproductive rights add the second layer — Columbus-metro women have proven they respond to this issue at the ballot box. A candidate who combines housing affordability with reproductive rights contrast and roots it in a local biography should be able to move this to 53-47 or better."
      ],
      memoBullets: [
        "Housing is the opening issue. Knock on renter-occupied units with a clear, localized message about what Claggett has done (or not done) on tenant protections and housing cost relief.",
        "Pair housing with reproductive rights contrast. Claggett's Statehouse record on abortion access connects directly to the concerns of women in Columbus-area suburban and exurban communities.",
        "Build a coalition from the base up: renters, younger voters, women, and diverse communities in a district that is 88% white but shifting. Columbus-orbit seats move when turnout is high among low-propensity Democratic voters.",
        "The candidate must be local. A community organizer, school administrator, or local small business owner with roots in the district. Do not parachute in a candidate from Columbus proper."
      ]
    }
  },
  {
    id: "oh-hd-69",
    name: "Ohio House District 69",
    city: "Columbus",
    region: "Rural SE Ohio (Hocking / Vinton / Morgan)",
    type: "state house district",
    incumbentName: "Kevin Miller",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Fiscal Responsibility", tag: "lean-into", why: "At $87K income and only 26% college, this Columbus suburb is wealthier than its education rate suggests — likely driven by trades, real estate, and small business. Kevin Miller's R 77-23 margin reflects a district that has not heard a credible local economic alternative, not one that is ideologically unreachable." },
        { name: "Healthcare & Drug Costs", tag: "lean-into", why: "A 26%-college working-to-middle-class electorate has real exposure to healthcare cost volatility. Medicaid, drug pricing, and hospital access are cross-partisan concerns that a credible local candidate can use to open a conversation with Republican-leaning households." },
        { name: "Candidate Recruitment as Primary Goal", tag: "lean-into", why: "At R 77-23, the first strategic goal is a credible candidate who can establish a baseline — not a flip. A local businessperson, healthcare worker, or community leader with real roots in HD-69 is the prerequisite for any future competitiveness." },
        { name: "Social & Cultural Issues", tag: "avoid", why: "At 89% white and R+54, leading with social justice or identity framing will foreclose any conversation before it begins. Strict economic and local-governance focus is required." },
        { name: "National Democratic Messaging", tag: "avoid", why: "A 77-23 margin means the national Democratic brand is deeply underwater here. The candidate must run as a local community figure, not a party representative. Any national framing will activate the Republican base without moving persuadable voters." }
      ],
      memoHeadline: "77-23 is not a death sentence — it is an organizational gap. 2026 is about showing up and building from zero.",
      memoParagraphs: [
        "HD-69 voted R 77-23 for Kevin Miller in 2024. That margin reflects a district where Democrats have stopped competing, not one where competition is impossible. At $87K median income with 26% college, this Columbus suburb has economic concerns that a credible local candidate can address.",
        "The profile is not favorable for a short-term flip: 89% white, low college attainment, deeply Republican vote history. But comparable districts across Ohio that went 75-25 or worse a decade ago have moved significantly when Democrats fielded local candidates with economic credibility and sustained organizing.",
        "The 2026 goal is straightforward: field someone, run a tight economic message, and get to 68-32 or better. That result builds the infrastructure and the story for a more serious 2028 contest."
      ],
      memoBullets: [
        "Candidate first, message second. Find a local businessperson, healthcare provider, or longtime community leader who has credibility independent of party. Without the right candidate, no message works in this district.",
        "Healthcare costs and economic security are the only credible cross-partisan frames. Pull Miller's votes on Medicaid and drug pricing and connect them to what HD-69 residents actually pay.",
        "Run a shoestring campaign focused on presence and conversation — town halls, local events, door-knocking. The goal is visibility and infrastructure, not TV ads.",
        "A 2026 result of 68-32 or better is a win. Document everything: voter contact data, friendly precincts, volunteer names. That infrastructure is the real output of the 2026 campaign."
      ]
    }
  },
  {
    id: "oh-hd-70",
    name: "Ohio House District 70",
    city: "Columbus",
    region: "Greene County / Xenia Area",
    type: "state house district",
    incumbentName: "Brian Lampton",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Reproductive Rights", tag: "lean-into", why: "At 46% college-educated and $94K median income in the Columbus metro, HD-70 has the exact demographic profile that has moved toward Democrats on reproductive rights. Lampton's Statehouse voting record on abortion access is the highest-value contrast point with professional women and younger educated voters in this district." },
        { name: "Education Quality & Funding", tag: "lean-into", why: "Forty-six percent college attainment in a district with 33% renters means a mix of established professional families and younger educated residents who care about public school quality. Lampton's votes on education funding and school investment give Democrats a concrete local frame." },
        { name: "Housing Affordability", tag: "lean-into", why: "Thirty-three percent renters at $94K median income means a significant share of the district is renting by choice or necessity in a tight Columbus housing market. Affordability, housing supply, and tenant protections are live issues for this electorate." },
        { name: "Economic Populism / Class Conflict", tag: "avoid", why: "At $94K income and 46% college, this is a professional-class district. Wealth redistribution or class-conflict framing will alienate the persuadable moderate Republicans this district requires. The message must be about rights, governance quality, and community investment — not inequality." },
        { name: "National Democratic Brand", tag: "careful", why: "Columbus suburbs are trending Democratic but the national party brand still has drag in 62-38 territory. The candidate must lead with local identity and specific Lampton contrasts. National framing can activate the base but should not be the top-line message." }
      ],
      memoHeadline: "46% college, 33% renters, Columbus metro — Lampton at 62-38 is a vulnerability, not a fortress.",
      memoParagraphs: [
        "HD-70 is a Columbus suburb that Brian Lampton won 62-38 in 2024. At 46% college-educated and $94K median income, this is one of the most educated and affluent districts in this batch — and that demographic profile has been trending Democratic in suburban Columbus for two cycles. A 62-38 margin in this environment suggests the district has not yet been seriously contested.",
        "The coalition path is clear: educated professional women on reproductive rights, renters on housing affordability, and younger Columbus-area residents on education quality. Lampton's Statehouse record provides concrete contrast material across all three. A candidate who can make this campaign local and specific — not generic Democratic versus Republican — can move this to 56-44 or better.",
        "The 33% renter rate is the underutilized variable. Housing affordability in the Columbus metro is acute, and a Democrat who speaks credibly about supply, tenant protections, and state policy failures on housing has an organizing hook that exists independent of partisan identity."
      ],
      memoBullets: [
        "Recruit a candidate with strong Columbus-suburb credibility: a healthcare professional, educator, or small business owner. The candidate's biography must match the district's professional-class identity.",
        "Lead with reproductive rights and pull Lampton's specific votes. This is the single highest-ROI issue in a 46%-college Columbus suburb where women voters are already persuadable.",
        "Pair reproductive rights with housing affordability. The 33% renter rate is an organizing advantage — door-knock renter-heavy buildings with a clear, local affordability message.",
        "Avoid national Democratic framing on the top line. Run Lampton's record versus the candidate's local vision. Make the race about HD-70, not Washington."
      ]
    }
  },
  {
    id: "oh-hd-71",
    name: "Ohio House District 71",
    city: "Columbus",
    region: "Rural SW Ohio (Clinton / Fayette Counties)",
    type: "state house district",
    incumbentName: "Levi P. Dean",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $70K median income and 25% college, this is a working-class Columbus-exurban district. Wage stagnation, job quality, and trade are the primary economic concerns. Levi Dean's Statehouse votes on labor and economic policy are the most credible contrast available." },
        { name: "Healthcare Costs & Medicaid", tag: "lean-into", why: "Below-median income and non-college demographics mean healthcare cost exposure is real. Drug pricing, Medicaid coverage, and hospital access are practical daily concerns that cross partisan lines when delivered by a credible local messenger." },
        { name: "Housing Affordability", tag: "careful", why: "At 28% renters and $70K income, housing cost pressure is present but not as acute as in higher-renter districts. Affordability is a secondary frame that reinforces the economic message without leading it." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "89% white and R+40 — social justice or identity framing will collapse any coalition before it forms. Strict economic and local-governance focus is the only lane." },
        { name: "National Democratic Messaging", tag: "avoid", why: "A 70-30 margin reflects a district that has made a firm partisan decision in recent cycles. Nationalizing the race confirms that decision. The candidate must run as a hyper-local economic alternative, not a party messenger." }
      ],
      memoHeadline: "70-30 demands a candidate, not a consultant. This district requires a local economic biography — and patience.",
      memoParagraphs: [
        "HD-71 voted R 70-30 for Levi Dean in 2024. At 89% white and 25% college, this is a working-class Columbus exurb that has moved decisively Republican on identity while remaining economically stressed. The 30% Democratic floor is real but thin — it needs to be organized, not assumed.",
        "The profile here is not hopeless but it requires a very specific candidate: someone who grew up in this community, works a trade or healthcare job, and can speak the language of economic anxiety without triggering the cultural identity responses that sink national Democratic messages in these districts.",
        "The 2026 goal is 63-37 with a serious local candidate. That means running a focused economic message, investing in precinct-level organizing, and building the volunteer infrastructure that makes a 2028 competitive race possible. The margin won't move without sustained presence."
      ],
      memoBullets: [
        "Candidate recruitment is the first task. Look to local union halls, trade associations, and healthcare worker networks. Someone who belongs to this community before they are a candidate.",
        "The message is strictly: what Dean has voted for in Columbus, what it costs this district's workers and families. No national branding, no cultural framing.",
        "Healthcare and wages are the two credible cross-partisan issues. Lead with them at every door and event.",
        "Set 63-37 as the 2026 win condition. Use the campaign to build a voter file, identify friendly precincts, and train local volunteers for 2028."
      ]
    }
  },
  {
    id: "oh-hd-72",
    name: "Ohio House District 72",
    city: "Columbus",
    region: "Columbus Southeast Suburbs (Pickerington)",
    type: "state house district",
    incumbentName: "Heidi Workman",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Housing Affordability & Renters' Rights", tag: "lean-into", why: "At 33% renters with a median income of $70K in the Columbus orbit, housing cost pressure is acute. Workman's record on tenant protections and housing supply is a high-ROI contrast point with a large share of the electorate who are directly experiencing rent increases and affordability strain." },
        { name: "Reproductive Rights", tag: "lean-into", why: "At 35% college-educated and 59-41 in the Columbus metro, this district has a meaningful Democratic base that can grow. Reproductive rights have proven to be a mobilizer for younger and college-educated Columbus-area voters. Workman's Statehouse record is the contrast." },
        { name: "Wages & Economic Security", tag: "lean-into", why: "At $70K median income with a 38-year median age and 33% renters, this is a district of younger working-to-middle-class households under real financial pressure. Wage growth, job quality, and economic opportunity are primary concerns that a Democrat can own." },
        { name: "Public Safety Framing", tag: "careful", why: "A predominantly white district at 59-41 has some voters for whom public safety is a concern. Democrats must not cede this issue — frame it around community investment and economic stability, not policing reduction." },
        { name: "National Party Branding", tag: "avoid", why: "This is a winnable seat, but 59-41 means Republicans are the default. Nationalizing the race activates the Republican base. Run Workman's record against a local candidate vision — make the race about HD-72, not Washington." }
      ],
      memoHeadline: "59-41 in a Columbus suburb with 33% renters and a 38-year median age is a flip opportunity. Housing plus reproductive rights is the formula.",
      memoParagraphs: [
        "HD-72 is one of the more competitive districts in this batch. Heidi Workman won 59-41 in 2024, but the fundamentals — 33% renters, $70K income, 35% college, median age of 38 — describe a younger working-to-middle-class Columbus suburb where Democratic coalition-building is entirely feasible.",
        "Housing affordability is the primary organizing hook. Thirty-three percent of residents rent, and housing costs in the Columbus metro have risen sharply. A candidate who can credibly connect Workman's Statehouse record to what renters in HD-72 are actually paying has a concrete and personal argument that does not require partisan framing.",
        "Pair housing with reproductive rights, which activate the younger and educated voters in this district. The combination — economic relief plus fundamental rights — is the two-issue formula that has moved comparable Columbus-orbit seats from 59-41 to 52-48 or better when fielded with the right candidate."
      ],
      memoBullets: [
        "Housing first. Identify renter-heavy precincts and door-knock them with a localized affordability message tied specifically to Workman's votes. This is the highest-ROI voter contact activity in HD-72.",
        "Reproductive rights are the second frame. Pull Workman's specific votes and connect them to what women in this district actually experience. Younger voters respond to this issue at above-average rates.",
        "The candidate must be from the district and ideally be in their 30s or early 40s — someone who represents the economic reality of the community, not a political lifer.",
        "Build a robust ground game. At 59-41, the margin is tight enough that turnout operations in low-propensity Democratic precincts can flip the result. Invest in organizing infrastructure, not just advertising."
      ]
    }
  },
  {
    id: "oh-hd-73",
    name: "Ohio House District 73",
    city: "Columbus",
    region: "Columbus Southeast (Reynoldsburg / Groveport)",
    type: "state house district",
    incumbentName: "Jeff LaRe",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Reproductive Rights", tag: "lean-into", why: "At 34% college-educated and $87K median income in the Columbus metro, with 11% Black and 3% Asian populations, this is a genuinely diverse suburban district where reproductive rights are a high-value mobilizer across multiple communities. LaRe's Statehouse record is the primary contrast." },
        { name: "Black & Minority Community Mobilization", tag: "lean-into", why: "At 11% Black and significant Asian and Hispanic populations, HD-73 has real coalition diversity in a Columbus suburb. If minority communities turn out at high rates with strong Democratic loyalty, this is a 55-45 district — not a 61-39 one. GOTV investment in non-white precincts is the highest-ROI activity." },
        { name: "Education Quality & Funding", tag: "lean-into", why: "A diverse Columbus suburb at 34% college attainment and $87K median income has families deeply invested in public school quality. LaRe's votes on education funding and school choice policy are concrete contrast points that resonate across racial lines in this community." },
        { name: "Housing Affordability", tag: "careful", why: "At 29% renters and $87K income, housing pressure is present but not as acute as in lower-income renter-heavy districts. Affordable housing investment reinforces the economic frame but should not lead over reproductive rights and education in this district's message hierarchy." },
        { name: "Economic Populism / Class Conflict", tag: "avoid", why: "At $87K income, this is a professional and upper-middle class suburb. Wealth redistribution or class-conflict framing will alienate the persuadable moderate Republicans this district needs. Rights, governance, and community quality are the credible frames." }
      ],
      memoHeadline: "LaRe's margin in a $87K, 20%-minority Columbus suburb is political malpractice waiting to be punished. Build the coalition.",
      memoParagraphs: [
        "HD-73 gave Jeff LaRe a 61-39 win in 2024, but this district's demographics — $87K median income, 34% college-educated, 20% non-white population in a Columbus suburb — suggest a margin that reflects organizational failure more than political reality. Comparable diverse Columbus-metro suburbs have moved significantly toward Democrats when seriously organized.",
        "The coalition is available: college-educated suburban women on reproductive rights, Black and Asian communities on education and economic investment, and younger Columbus-area households on housing and opportunity. What is missing is a candidate and a campaign that can hold those pieces together simultaneously.",
        "LaRe has Statehouse visibility which gives Democrats contrast material. His record on abortion access, education funding, and state budget priorities should be well-documented and localized to what HD-73 families actually experience. A candidate who can run that contrast in a professional, community-rooted way has a path to 54-46 or better."
      ],
      memoBullets: [
        "Black and Asian community GOTV is the margin variable. Identify minority-heavy precincts and invest in sustained, community-rooted organizing — not just last-minute mailers.",
        "Lead with reproductive rights and education quality simultaneously. Both issues have cross-community resonance in a diverse Columbus suburb and both connect directly to LaRe's voting record.",
        "The candidate must have genuine community roots and credibility across racial lines. A Black candidate with suburban professional credentials, or a community leader with ties to multiple neighborhoods, is the ideal profile.",
        "Run a localized contrast campaign: LaRe's specific votes, their specific impact on HD-73 schools, families, and healthcare. Abstract national Democratic messaging will not move this electorate."
      ]
    }
  },
  {
    id: "oh-hd-74",
    name: "Ohio House District 74",
    city: "Columbus",
    region: "Fairfield County (Lancaster Area)",
    type: "state house district",
    incumbentName: "Bernard Willis",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $58K median income with only 18% college, this is a financially stressed working-class Columbus-area district. Bernard Willis's R 64-36 margin in a district with 33% renters and significant minority population reflects organizational failure, not permanent alignment. Wages, job quality, and economic security are the primary persuasion frame." },
        { name: "Hispanic & Black Community GOTV", tag: "lean-into", why: "At 9.5% Black and 4.3% Hispanic — over 13% combined minority population — HD-74 has meaningful non-white communities that, if organized at high turnout, can shift the electoral math. These communities are almost certainly underregistered and underorganized. GOTV investment here is the highest-ROI activity." },
        { name: "Housing Affordability & Renters' Rights", tag: "lean-into", why: "Thirty-three percent renters at only $58K median income means a large share of this district is in genuine housing cost distress. Willis's record on tenant protections and state housing policy gives Democrats a concrete, personal argument that requires no partisan framing to land." },
        { name: "Cultural & Social Issue Framing", tag: "avoid", why: "82% white and R+28 with low college attainment. Social justice or identity framing will foreclose white working-class persuasion before it begins. Economic and housing issues must lead; minority GOTV is built through community relationships, not campaign messaging." },
        { name: "National Democratic Brand", tag: "avoid", why: "A 64-36 result in a $58K, 18%-college district means the national Democratic Party brand is deeply underwater. Any candidate who sounds like national Democrats will confirm voters' worst assumptions. Hyper-local economic biography is the only credible path." }
      ],
      memoHeadline: "A $58K district with 33% renters and 13% minority population voting R 64-36 is an organizing crisis, not a demographic verdict.",
      memoParagraphs: [
        "HD-74 presents a familiar but instructive puzzle: a financially stressed, racially diverse working-class district voting Republican by a wide margin. At $58K median income, 33% renters, 18% college, 9.5% Black, and 4.3% Hispanic, the raw demographics suggest a district that should be competitive. The 64-36 result for Bernard Willis reflects organizational collapse, not permanent realignment.",
        "The highest-ROI action is minority community organizing. Black and Hispanic communities in HD-74 are almost certainly underregistered and underorganized. A multi-year GOTV investment — not a last-minute mailer campaign — can shift 3-5 points on its own. Pair that with a working-class economic message aimed at white renter households, and the math starts to change.",
        "The candidate profile is demanding: someone with credibility in both white working-class and minority communities in a low-income Columbus suburb. That person likely already works in the district as a social worker, union rep, or community health worker. The recruitment effort should look there first."
      ],
      memoBullets: [
        "Launch a multi-year minority community organizing effort immediately — voter registration drives, community events, and relationship-building in Black and Hispanic neighborhoods in HD-74. This is not a 2026 tactic, it is a 2026-and-beyond infrastructure investment.",
        "Housing is the lead message for white working-class renters. Connect Willis's specific votes to what renter households in this district actually pay and experience.",
        "Wages and job security are the secondary economic frame. Find Willis's votes on labor and economic policy and translate them into local terms.",
        "Avoid all national framing. The candidate must be from this community and speak its language. Without authenticity, no message strategy works."
      ]
    }
  },
  {
    id: "oh-hd-75",
    name: "Ohio House District 75",
    city: "Toledo",
    region: "Toledo Eastern Suburbs (Perrysburg / Wood County)",
    type: "state house district",
    incumbentName: "Haraz N. Ghanbari",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Housing Affordability & Renters' Rights", tag: "lean-into", why: "At 37.6% renters — one of the highest renter rates in this batch — with a $73K median income and a 35-year median age, HD-75 is a younger renter-heavy Toledo suburb under real affordability pressure. Ghanbari's record on housing investment and tenant protections is the single most powerful contrast available." },
        { name: "Reproductive Rights", tag: "lean-into", why: "At 39% college-educated with a median age of 35, this is a younger, more educated Toledo-area district where reproductive rights reliably mobilize. Ghanbari's Statehouse voting record is the contrast. This is the second-highest-ROI issue after housing." },
        { name: "Hispanic Community Outreach & GOTV", tag: "lean-into", why: "At 6.2% Hispanic — notable for a Toledo suburb — this community represents a meaningful and likely underorganized margin. Targeted outreach, Spanish-language materials, and community-rooted organizing in Hispanic neighborhoods could shift 2-3 points on its own in a 59-41 seat." },
        { name: "Economic Security & Wages", tag: "careful", why: "At $73K income and 39% college, this district has a working-to-professional class mix. Economic security messaging reinforces the housing and affordability frame but should not lead over the higher-salience renter and reproductive rights issues." },
        { name: "National Democratic Framing", tag: "avoid", why: "At 59-41 in a Toledo suburb, Republicans have the partisan default. Nationalizing the race activates the Republican base without adding Democratic votes. The candidate must make this race about Ghanbari's specific record and HD-75's specific needs." }
      ],
      memoHeadline: "37% renters, 39% college, 6% Hispanic, Toledo — Ghanbari at 59-41 is not safe. Build the coalition and take the seat.",
      memoParagraphs: [
        "HD-75 is one of the clearest pickup opportunities in this batch. Haraz Ghanbari won 59-41 in 2024, but the fundamentals — 37.6% renters, 39% college-educated, median age of 35, 6.2% Hispanic population — describe a younger, more diverse Toledo suburb where a well-organized Democratic campaign can win.",
        "Housing affordability is the anchor issue. Nearly 38% of HD-75 residents rent, and Toledo's housing market, while more affordable than Columbus, has its own cost-pressure dynamics for younger working households. A candidate who leads with a concrete housing and tenant-protection message tied specifically to Ghanbari's Statehouse votes has an immediate organizing hook.",
        "The Hispanic community at 6.2% is the underutilized wildcard. In a 59-41 seat, organized Hispanic GOTV could shift the margin by 2-3 points on its own. Pair that with reproductive rights mobilization among younger educated voters and a housing message for renters, and the path to 52-48 or better is real."
      ],
      memoBullets: [
        "Start Hispanic community organizing now — not in October 2026. Build relationships with local Hispanic organizations, churches, and community centers. Voter registration and turnout investment here is the margin differentiator.",
        "Housing is the top-line message. Identify renter-heavy precincts and door-knock them with a localized affordability frame. Connect Ghanbari's specific votes to what HD-75 renters actually experience.",
        "Reproductive rights are the second frame — use them to mobilize younger and college-educated voters who may not turn out in off-year cycles without activation.",
        "Recruit a candidate who reflects the district's younger, diverse professional identity. Someone in their 30s with roots in Toledo and credibility in both Anglo and Hispanic communities is the ideal profile."
      ]
    }
  },
  {
    id: "oh-hd-76",
    name: "Ohio House District 76",
    city: "Toledo",
    region: "Defiance / Williams Counties (NW Ohio)",
    type: "state house district",
    incumbentName: "Marilyn S. John",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $58K median income and only 18% college, this is a financially stressed Toledo-exurban working-class district. Marilyn John's Statehouse votes on wages, labor policy, and economic investment are the primary contrast available. Workers here are experiencing real economic pressure that a credible local economic message can address." },
        { name: "Black Community GOTV", tag: "lean-into", why: "At 7.4% Black population in a 72-28 district, the Black community is both underorganized and potentially decisive if mobilized at high turnout. Multi-year voter registration and GOTV investment in Black precincts could shift the margin 3-4 points on its own — which matters for the long-term trajectory of this district." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Low income and low college attainment mean healthcare cost exposure is acute. Medicaid, drug pricing, and hospital access are cross-partisan concerns. These issues can open doors with Republican-leaning households when framed in concrete local terms." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "85% white at R+44 with only 18% college. Leading with social justice, equity, or identity framing will collapse any coalition before it starts. Strict economic focus is the only viable lane for white working-class voter persuasion." },
        { name: "National Democratic Brand", tag: "avoid", why: "A 72-28 district requires a candidate who sounds like this community, not like the national Democratic Party. Any national framing will activate the Republican base without moving persuadable voters. Local economic credibility is the entire message." }
      ],
      memoHeadline: "72-28 with 7% Black and 31% renters means this district has been written off, not abandoned. The infrastructure gap is the problem to fix.",
      memoParagraphs: [
        "HD-76 gave Marilyn John a 72-28 win in 2024. At $58K median income, 18% college, 85% white, and 7.4% Black, this is a financially stressed Toledo exurban district that has moved decisively Republican without meaningful Democratic organizational presence for years.",
        "The Black community at 7.4% is the most actionable near-term lever. In a 72-28 district, organized minority GOTV cannot flip the seat in 2026 — but it can establish a base, build infrastructure, and shift the trajectory toward competitiveness by 2028 or 2030. That work has to start now, not in September of an election year.",
        "The 2026 goal is twofold: field a credible candidate who can sustain a local economic message, and launch a multi-year minority organizing effort in the district. A result of 65-35 with those two things in place is a better outcome than a 70-30 result with neither."
      ],
      memoBullets: [
        "Begin Black community organizing immediately — voter registration, community events, local relationships. This is a multi-year investment, not a 2026 campaign tactic.",
        "Candidate recruitment should focus on local economic credibility: a union worker, a healthcare professional, or a small business owner who is known in the community.",
        "Economic message only: wages, healthcare costs, what John has voted for in Columbus. No national branding, no cultural issues.",
        "Set 65-35 as the 2026 win condition. The real output is infrastructure — voter file, precinct captains, volunteer network — not the vote share itself."
      ]
    }
  },
  {
    id: "oh-hd-77",
    name: "Ohio House District 77",
    city: "Toledo",
    region: "Lima / Allen County",
    type: "state house district",
    incumbentName: "Meredith Craig",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Manufacturing & Trade Job Security", tag: "lean-into", why: "At $72K median income and 25% college in the Toledo orbit, this is a working-to-middle-class district where trade job quality, factory closures, and corporate accountability are primary concerns. Craig's Statehouse votes on economic and labor policy are the most credible contrast frame." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Non-college working-class households in the Toledo area face real healthcare cost exposure. Medicaid, drug pricing, and hospital access are practical daily concerns that cross party lines when a credible local candidate delivers them with specific policy contrast." },
        { name: "Candidate Development as First Priority", tag: "lean-into", why: "At R 69-31, the immediate strategic task is finding and developing a credible local candidate with an economic biography. Without a candidate who belongs to this community, no message strategy applies. The Toledo labor network and local civic institutions are the recruitment source." },
        { name: "Cultural & Identity Issues", tag: "avoid", why: "93% white at R+38. Social justice or identity framing will foreclose any persuasion conversation before it begins. Strict economic and local-governance messaging is the only viable lane." },
        { name: "Gun Policy", tag: "avoid", why: "Toledo exurban and rural communities in this district have strong gun-ownership identity. Any candidate framing around gun restrictions will face immediate and total backlash. Silence on this issue is the correct position." }
      ],
      memoHeadline: "69-31 in a working-class Toledo suburb means the message exists — the candidate doesn't. Fix that first.",
      memoParagraphs: [
        "HD-77 gave Meredith Craig a 69-31 win in 2024. At $72K income, 25% college, and 93% white, this is a working-to-middle-class Toledo suburb that votes Republican on identity while facing real economic pressures that a Democratic candidate could plausibly address.",
        "The challenge is not message — it is candidate. A working-class economic message on jobs, healthcare, and wages has theoretical traction in HD-77. But that message only lands when delivered by someone the district already trusts: a local businessperson, a union member, a teacher who has been in the community for years.",
        "The 2026 goal is a serious candidate, a 62-38 or better result, and a voter contact infrastructure that did not exist before. The margin improvement is secondary to the organizational investment."
      ],
      memoBullets: [
        "Candidate first. Contact Toledo-area unions — UAW, USW, building trades — and local civic organizations for prospects. The right candidate already exists in this community.",
        "Economic message only: Craig's votes on jobs, wages, and healthcare versus what this district's working families need. No national framing.",
        "Door-knocking and local events are more valuable here than advertising. Presence and authenticity move votes; partisan media buys confirm people's existing identity.",
        "Set 62-38 as the 2026 success threshold. Use the campaign to build voter file data and identify friendly precincts for future cycles."
      ]
    }
  },
  {
    id: "oh-hd-78",
    name: "Ohio House District 78",
    city: "Toledo",
    region: "Lima / Allen County (Speaker District)",
    type: "state house district",
    incumbentName: "Matt Huffman",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Fielding a Credible Challenger to Matt Huffman", tag: "lean-into", why: "Matt Huffman is one of the most powerful Republicans in Ohio — the former Ohio Senate President. His running unchallenged in HD-78 is a statewide embarrassment for the Democratic Party. Fielding any credible candidate draws earned media, forces Huffman to spend resources, and signals organizational seriousness to donors and volunteers statewide." },
        { name: "Black & Hispanic Community GOTV", tag: "lean-into", why: "At 9.7% Black and 3.3% Hispanic — nearly 13% combined — HD-78 has meaningful minority communities that are almost certainly underregistered and underorganized. Huffman's uncontested status reflects their invisibility, not their irrelevance. Organizing these communities is both strategically correct and long-term infrastructure investment." },
        { name: "Economic Security & Wages", tag: "lean-into", why: "At $64K median income and only 20% college, this is a working-to-middle-class district with real economic pressure. Huffman's record of prioritizing corporate and legislative interests over working families has concrete local consequences that an economic message can highlight." },
        { name: "Housing Affordability", tag: "careful", why: "At 30% renters and $64K income, housing cost pressure is real. Affordability reinforces the economic frame, but the primary strategic message here is about Huffman's power and record — not a single policy issue. Housing is supporting evidence, not the lead." },
        { name: "Overreach on National Issues", tag: "avoid", why: "Running a nationalized Democratic campaign against Ohio's most powerful Republican in a 20%-college working-class district will activate every defensive Republican instinct in the electorate. The message must be local, economic, and specific to Huffman's record — not a referendum on Biden, Harris, or national Democrats." }
      ],
      memoHeadline: "Ohio's most powerful Republican ran unopposed in a district with 13% minority population and 30% renters. That ends in 2026.",
      memoParagraphs: [
        "HD-78 is Matt Huffman's seat. The former Ohio Senate President — arguably the most powerful Republican in Columbus — ran without a Democratic opponent in 2024. That is an organizational failure of the first order, and it has both symbolic and practical consequences: Huffman faces no accountability, no pressure, and no drain on his resources.",
        "The demographics tell a different story than the uncontested result. At 9.7% Black, 3.3% Hispanic, 30% renters, and $64K median income, this is a district with genuine communities of interest that have simply been abandoned. A multi-year organizing effort in minority neighborhoods and a credible candidate who can make Huffman's record the central issue changes the district's trajectory even without winning.",
        "The 2026 goal is not to beat Huffman — it is to force him to run a real campaign, draw statewide attention to his record, and build minority community infrastructure in a district where it does not currently exist. Even a 65-35 result against the Ohio Senate President is a story worth telling."
      ],
      memoBullets: [
        "Field a candidate. This is non-negotiable. The most powerful Republican in Ohio should not run unopposed. Find a local community leader with economic credibility and the courage to take on Huffman directly.",
        "Make Huffman's record the entire campaign: his votes as Senate President on abortion, worker protections, and redistricting — localized to what HD-78 families actually experience.",
        "Launch minority community organizing in parallel with the candidate search. Black and Hispanic GOTV in HD-78 is both locally valuable and a signal to those communities statewide that Democrats are not ignoring them.",
        "Use the race to generate earned media statewide. 'Democrat challenges Ohio Senate President' is a story. Use it to raise money, recruit volunteers, and draw attention to Huffman's record beyond HD-78."
      ]
    }
  },
  {
    id: "oh-hd-79",
    name: "Ohio House District 79",
    city: "Toledo",
    region: "Auglaize / Mercer Counties",
    type: "state house district",
    incumbentName: "Monica Robb Blasdel",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Manufacturing & Trade Job Security", tag: "lean-into", why: "At $59K income and only 16% college — the lowest in this batch — HD-79 is a deeply working-class Toledo-exurban district. Trade job loss, factory closures, and economic stagnation are the lived experience here. Blasdel's Statehouse votes on economic and labor policy are the primary contrast available to a credible local candidate." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "The lowest college attainment in this batch and below-median income mean healthcare cost vulnerability is extremely high. Medicare, drug pricing, and rural hospital access are genuine daily concerns. These issues have demonstrated cross-partisan reach in comparable Toledo-area working-class districts." },
        { name: "Candidate Recruitment as the Sole 2026 Priority", tag: "lean-into", why: "At R 75-25 with 93% white and 16% college, this district has been written off organizationally. The first and most important action is finding a local candidate — a union member, a retired tradesperson, a nurse — who has community credibility independent of party. Without that person, no strategy applies." },
        { name: "Social & Cultural Issues", tag: "avoid", why: "93% white, R+50, 16% college, median age 44. The oldest and most homogeneous district in this batch. Social justice or identity framing will not open a single door here. Economic biography is the only viable path." },
        { name: "Gun Policy", tag: "avoid", why: "Deep rural/exurban Toledo district. Gun ownership is central to local identity. Any framing around gun restrictions will produce immediate and total backlash. Silence is the correct position." }
      ],
      memoHeadline: "75-25 in the oldest, least-educated district in this batch. The bar is showing up — with the right person.",
      memoParagraphs: [
        "HD-79 is among the most challenging seats in this batch. Monica Robb Blasdel won 75-25 in 2024 in a district that is 93% white, only 16% college-educated, has a median age of 44, and sits in the rural Toledo orbit. This is a district that has realigned decisively on cultural identity and will not be moved by a conventional Democratic campaign.",
        "What might create marginal movement is the right candidate delivering a strict economic message: what Blasdel has voted for in Columbus, what it costs this district's workers and retirees, and what a different set of priorities would mean for their lives. That message requires a messenger who already belongs to the community — not a volunteer who showed up for the campaign.",
        "The 2026 goal is 68-32 with a real candidate in the field. That result builds a voter file, creates local infrastructure, and signals that HD-79 is not permanently conceded. The infrastructure built in 2026 is the actual deliverable."
      ],
      memoBullets: [
        "Find a candidate who already lives and works in this community. A retired factory worker, a local nurse, or a farmer who can credibly say they are fighting for the people they know. Without this, no campaign succeeds.",
        "Healthcare costs and job security are the two issues with any cross-partisan reach. Pull Blasdel's specific votes and translate them into local impact.",
        "Run a shoestring campaign focused on presence: door-knocking, local events, town halls. Advertising is not the path here — personal contact is.",
        "Set 68-32 as the 2026 goal. Use the campaign to build a voter file and identify the small number of persuadable precincts that could matter in future cycles."
      ]
    }
  },
  {
    id: "oh-hd-80",
    name: "Ohio House District 80",
    city: "Toledo",
    region: "Putnam / Paulding Counties (Rural NW Ohio)",
    type: "state house district",
    incumbentName: "Johnathan Newman",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Manufacturing & Trade Job Security", tag: "lean-into", why: "At $74K income and only 24% college in the Toledo orbit, this is a working-to-middle-class district where trade job quality and economic security are primary concerns. Newman's Statehouse votes on labor and economic policy are the most credible contrast available to a local candidate with an economic biography." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Non-college working-class households in this district face real healthcare cost pressure. Drug pricing, Medicaid, and hospital access are practical daily concerns with documented cross-partisan reach in Toledo-area working-class communities." },
        { name: "Candidate Development as Primary Goal", tag: "lean-into", why: "At R 75-25, the immediate priority is identifying and developing a local candidate with community credibility. The Toledo labor network and local civic institutions are the most productive recruitment sources. Without the right candidate, no strategy applies." },
        { name: "Cultural & Identity Issues", tag: "avoid", why: "92% white at R+50. Social justice or identity framing will foreclose any persuasion conversation before it begins. Economic and local-governance messaging is the only viable lane for this electorate." },
        { name: "National Democratic Brand", tag: "avoid", why: "A 75-25 margin means the national Democratic brand is deeply underwater. The candidate must run as a local community figure with an economic biography — not as a party representative. Any national framing confirms voters' existing partisan identity." }
      ],
      memoHeadline: "75-25 in a Toledo suburb that should be closer. The margin reflects disorganization, not destiny — but fixing it requires the right candidate first.",
      memoParagraphs: [
        "HD-80 gave Johnathan Newman a 75-25 win in 2024. At $74K income and 24% college in the Toledo orbit, this is a working-to-middle-class district that votes Republican by a wide margin — but its economic profile is not inherently incompatible with a Democratic economic message delivered by the right candidate.",
        "The comparison to Mahoning Valley and other Toledo-area working-class districts that moved Republican over the past decade is instructive: those districts were not lost on policy — they were lost on identity and on the absence of credible local Democratic candidates who spoke their language. The formula to reverse that process is local biography, economic message, and sustained presence.",
        "The 2026 goal is a serious candidate and a 68-32 or better result. That result, combined with a voter contact database and organized precincts, makes HD-80 a different district heading into 2028 than it is today."
      ],
      memoBullets: [
        "Candidate first. Contact Toledo-area unions, building trades, and local civic organizations. The right candidate is already in this community — they just haven't been asked.",
        "Economic message only: Newman's votes on jobs, wages, and healthcare versus what HD-80 working families need. No national branding.",
        "Door-knocking and local presence are more valuable than advertising. This district responds to authenticity and personal contact, not partisan media.",
        "Set 68-32 as the 2026 success condition. Build voter file data, identify friendly precincts, and train local volunteers. The infrastructure is the real deliverable."
      ]
    }
  },
  {
    id: "oh-hd-81",
    name: "Ohio House District 81",
    city: "Toledo",
    region: "Fulton / Henry Counties (NW Ohio)",
    type: "state house district",
    incumbentName: "James M. Hoops",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Hispanic Community GOTV & Outreach", tag: "lean-into", why: "At 7.2% Hispanic — one of the highest rates in the Toledo-area Republican districts — HD-81 has a meaningful Latino community that is almost certainly underregistered and underorganized. In a 77-23 district, this community cannot flip the seat alone, but sustained multi-year GOTV investment builds infrastructure and shifts the long-term trajectory." },
        { name: "Agricultural Policy & Rural Investment", tag: "lean-into", why: "At $71K income and 17% college in the Toledo rural orbit, agricultural communities and rural residents are a significant part of this electorate. A Democrat who speaks credibly about farm policy, rural infrastructure, and state investment in rural communities can open conversations that purely urban-coded Democrats cannot." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Low college attainment and working-class income mean healthcare cost vulnerability is high. Drug pricing and rural hospital access are the most cross-partisan issues available in this district. They work in rural Ohio when delivered with local specificity." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "91% white at R+54 with 17% college. Identity or social justice framing will immediately foreclose any persuasion conversation. Economic and agricultural messaging is the only viable lane." },
        { name: "Anti-Incumbent Attacks Without Local Credibility", tag: "avoid", why: "Hoops is an established incumbent with deep roots in this community. Attacking him without an equally rooted candidate and a local economic record to point to will not land. Build credibility before launching contrast." }
      ],
      memoHeadline: "77-23 with 7% Hispanic in rural Toledo. The community organizing gap, not the ideology gap, is what needs fixing.",
      memoParagraphs: [
        "HD-81 gave James Hoops a 77-23 win in 2024. At 17% college-educated, $71K median income, and 91% white with a notable 7.2% Hispanic population, this is a rural Toledo-orbit district that has moved decisively Republican — but the Hispanic community's presence is an underutilized and underorganized asset that no Democratic strategy has yet activated.",
        "The 7.2% Hispanic rate in a district this white and this rural is unusual and strategically significant. These are likely agricultural workers and their families — a community with real economic interests (wages, labor rights, rural services) that align with Democratic priorities and that has been entirely invisible to the party's organizing infrastructure.",
        "The 2026 goal is twofold: field a local candidate who can sustain an economic and agricultural message, and launch a dedicated Hispanic community organizing effort that is treated as a multi-year investment, not a 2026 campaign tactic. A result of 68-32 with those two pieces in place is a genuine success."
      ],
      memoBullets: [
        "Begin Hispanic community outreach immediately — not in August 2026. Identify community organizations, churches, and agricultural worker networks in HD-81 and build relationships before the campaign season.",
        "Candidate recruitment should focus on rural and agricultural credibility: a farmer, a rural healthcare worker, or a small-town civic leader who can speak to Hoops's record in terms that resonate in this community.",
        "Agricultural policy and rural investment are the credible economic frames. Pull Hoops's votes on farm policy, rural hospital funding, and state rural infrastructure and translate them into local impact.",
        "Set 68-32 as the 2026 goal. The infrastructure built — Hispanic voter file, rural precinct data, volunteer network — is the real output."
      ]
    }
  },
  {
    id: "oh-hd-82",
    name: "Ohio House District 82",
    city: "Toledo",
    region: "Paulding / Van Wert Counties (Rural NW Ohio)",
    type: "state house district",
    incumbentName: "Roy W. Klopfenstein",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Hispanic Community GOTV & Outreach", tag: "lean-into", why: "At 7.4% Hispanic — the highest in this batch and notable for a rural R+58 district — HD-82 has a Latino community that is almost certainly underregistered, underorganized, and largely invisible to both parties. In a 79-21 seat, this community is not the sole path to competitiveness, but sustained organizing is both the right thing to do and the long-term infrastructure investment the district requires." },
        { name: "Agricultural Policy & Rural Investment", tag: "lean-into", why: "HD-82 is in the Toledo rural orbit with 20% college attainment and $72K income. Agricultural policy, rural infrastructure, and state investment in rural services are the credible economic frames for this electorate. A candidate with agricultural credentials has a lane that a generic Democratic message does not." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Low college attainment and working-class income mean healthcare costs are an acute daily concern. Drug pricing and rural hospital access are the most cross-partisan issues available — they have opened doors in comparable rural Ohio districts when delivered by a credible local voice." },
        { name: "All Cultural & Social Issues", tag: "avoid", why: "91% white at R+58 with 20% college. This is one of the most Republican districts in the state. Social justice, equity, or identity framing will not open a single door. Strict agricultural economics and local governance is the only credible frame." },
        { name: "Nationalizing the Race", tag: "avoid", why: "At 79-21, any connection to national Democrats will be weaponized immediately. The candidate must run entirely on local identity and local economics. Washington does not exist in this campaign." }
      ],
      memoHeadline: "79-21 with the highest Hispanic rate in this batch. The organizing opportunity is real; the electoral timeline is long.",
      memoParagraphs: [
        "HD-82 gave Roy Klopfenstein a 79-21 win in 2024 — among the widest margins in this batch. At $72K income, 20% college, 91% white, and 7.4% Hispanic in the Toledo rural orbit, this is a deeply Republican agricultural district that has not been meaningfully contested in years.",
        "The 7.4% Hispanic population — almost certainly agricultural workers and their families — is the most important organizing fact in this district. These are voters with real economic interests aligned with Democratic priorities who have never been systematically engaged. A multi-year voter registration and community relationship effort here is both morally correct and strategically sound.",
        "The realistic 2026 goal is 70-30 with a serious local candidate and the beginning of a Hispanic organizing infrastructure. The candidate profile is narrow: someone with agricultural credentials, community roots, and the ability to run a disciplined economic message without triggering cultural identity responses."
      ],
      memoBullets: [
        "Hispanic community organizing is the single most important action this district requires — and it must start now, well before the 2026 election cycle. Build relationships with agricultural worker networks, local churches, and community organizations.",
        "Find a candidate with genuine agricultural or rural healthcare credentials. Someone who belongs to this community before they are a candidate.",
        "Agricultural policy and healthcare costs are the only viable frames. Pull Klopfenstein's votes and translate them into what they mean for farms and families in HD-82.",
        "Set 70-30 as the 2026 baseline goal. Use the campaign to launch the Hispanic organizing effort that makes 2028 and 2030 look different than 2024."
      ]
    }
  },
  {
    id: "oh-hd-83",
    name: "Ohio House District 83",
    city: "Toledo",
    region: "Sandusky / Erie County",
    type: "state house district",
    incumbentName: "Ty Mathews",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $65K income and 26% college in the Toledo orbit, HD-83 has a working-to-middle-class electorate facing real economic pressures. Mathews's Statehouse record on wages, labor, and economic investment is the primary contrast available. Among the Toledo-area deep-R seats this batch, 26% college gives this district slightly more persuadable headroom than HD-81 or HD-82." },
        { name: "Housing Affordability", tag: "lean-into", why: "At 28% renters — the highest in this Toledo-area batch — housing cost pressure is more acute here than in adjacent districts. Tenant protections and housing investment give a Democrat a concrete local argument with a meaningful share of the electorate that goes beyond pure partisan identity." },
        { name: "Hispanic Community Outreach", tag: "lean-into", why: "At 4.5% Hispanic, this community is smaller than in HD-81/82 but still represents an underorganized margin in a 75-25 district. Targeted outreach, community relationship-building, and voter registration in Hispanic neighborhoods is a long-term investment worth making." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "91% white at R+50. No social justice or identity framing. Economic and housing messaging only." },
        { name: "National Democratic Brand", tag: "avoid", why: "A 75-25 result means national Democratic identification is a liability in this district. The candidate runs as a local community figure with an economic biography — not as a party messenger." }
      ],
      memoHeadline: "75-25 in a Toledo district with 28% renters and 26% college. Slightly more room than neighbors — use it.",
      memoParagraphs: [
        "HD-83 gave Ty Mathews a 75-25 win in 2024. At $65K income, 26% college, 91% white, and 28% renters, this is the most favorable demographic profile among the deep-R Toledo districts in this batch. The 26% college rate and 28% renter rate give a serious candidate slightly more persuasion headroom than the adjacent HD-81 and HD-82.",
        "Housing affordability is the distinguishing frame here. Twenty-eight percent renters at $65K median income means a significant share of HD-83 is experiencing real cost pressure. A Democrat who leads with concrete housing and tenant-protection policy tied to Mathews's record has an organizing hook that is more personal and less partisan than a generic economic message.",
        "The 2026 goal is 67-33 with a credible local candidate and a organized renter-heavy precinct strategy. That result, combined with the beginning of Hispanic community organizing, creates a meaningfully different district in 2028."
      ],
      memoBullets: [
        "Identify and door-knock renter-heavy precincts first. Housing affordability is the most personal and cross-partisan issue available in this district.",
        "Recruit a candidate with local roots and economic credibility — ideally someone who has been visible in the community before the campaign, not someone who arrived for the race.",
        "Hispanic outreach should run parallel to the candidate campaign. Community relationships, voter registration, and local events in Hispanic neighborhoods build infrastructure that outlasts the election.",
        "Set 67-33 as the 2026 win condition. Use the campaign to build a renter-focused voter file and identify which precincts are movable with sustained attention."
      ]
    }
  },
  {
    id: "oh-hd-84",
    name: "Ohio House District 84",
    city: "Columbus",
    region: "Rural SE Ohio (Guernsey / Muskingum)",
    type: "state house district",
    incumbentName: "Angie King",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Rural Investment", tag: "lean-into", why: "At $71K income and 20% college in a deeply rural Ohio district, job security, trade, and state investment in rural communities are the only frames with any cross-partisan reach. King's Statehouse votes on economic and rural policy are the primary contrast material." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Low college attainment and rural demographics mean healthcare cost exposure is high. Drug pricing, rural hospital closures, and Medicaid access are the most cross-partisan issues available and have demonstrated traction in comparable rural Ohio seats when delivered by a credible local messenger." },
        { name: "Fielding Any Credible Candidate", tag: "lean-into", why: "At R 84-16, the immediate and most important action is simply finding someone to run. An 84-16 result in a $71K, 20%-college district is not a demographic verdict — it is an organizational absence. Establishing any visible Democratic presence is itself a strategic gain." },
        { name: "All Cultural, Social & Identity Issues", tag: "avoid", why: "95% white at R+68. The most homogeneous district in this batch and one of the most Republican in the state. No social justice, identity, or equity framing. Rural economic vocabulary only." },
        { name: "Any Nationalized Framing", tag: "avoid", why: "An 84-16 result means the national Democratic brand is utterly toxic in this community. The candidate must run entirely on local identity — where they live, who they know, what they have done for this community — not on party affiliation." }
      ],
      memoHeadline: "84-16 is not a district — it is an absence. Showing up with the right person is the entire 2026 strategy.",
      memoParagraphs: [
        "HD-84 gave Angie King an 84-16 win in 2024 — the widest margin in this batch and one of the most Republican results in Ohio. At 95% white, 20% college-educated, $71K income, this is a deeply rural district assigned to the Columbus geography but politically and culturally as far from Columbus as any seat in the state.",
        "The 16% Democratic floor is a baseline to build from, not a ceiling. It reflects the number of voters who pulled a Democratic lever without any campaign, any candidate, or any organizational infrastructure. A credible local candidate running on rural economics and healthcare costs can likely reach 25-30% on the strength of personal community relationships alone.",
        "The 2026 goal is modest but real: field a candidate, run a shoestring rural economic campaign, and establish the first voter contact database this district has had in years. A 75-25 or even 70-30 result with the right local candidate would represent genuine organizational progress."
      ],
      memoBullets: [
        "The single most important action: find someone from this community willing to run. A local farmer, a rural nurse, a retired teacher with community standing. The candidate does not need to win — they need to exist and show up.",
        "Rural economic message only: King's votes on farm policy, rural hospital funding, and state investment in rural communities. No national issues, no party identity.",
        "Healthcare and prescription drug costs are the most cross-partisan available frames. These are genuinely felt concerns in rural Ohio that open doors even for Democratic candidates.",
        "Set 72-28 as the 2026 goal. Document every voter contact, build a precinct-level data set, and identify the small number of persuadable voters who could matter in future cycles."
      ]
    }
  },
  {
    id: "oh-hd-85",
    name: "Ohio House District 85",
    city: "Toledo",
    region: "Shelby / Hardin Counties",
    type: "state house district",
    incumbentName: "Tim Barhorst",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Manufacturing & Trade Job Security", tag: "lean-into", why: "At $73K income and only 19% college in the Toledo rural orbit, this is a working-class district where trade job quality, economic security, and corporate accountability are the primary frames. Barhorst's Statehouse votes on labor and economic policy are the most credible contrast available." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Low college attainment and working-class demographics mean healthcare cost exposure is high. Drug pricing, Medicaid, and rural hospital access are the most cross-partisan issues available in this district when delivered by a local candidate with genuine community credibility." },
        { name: "Candidate Development as the 2026 Priority", tag: "lean-into", why: "At R 80-20, the immediate strategic task is identifying and developing a credible local candidate. Without someone who already belongs to this community — a union member, a local farmer, a rural healthcare worker — no message strategy has traction." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "92% white at R+60. The audience for social justice or identity framing does not exist in meaningful numbers in this district. Economic message only." },
        { name: "National Democratic Brand", tag: "avoid", why: "An 80-20 result means the national Democratic Party is a deep liability. The candidate must be introduced to voters as a local community member first and a Democrat second — if at all on the top line." }
      ],
      memoHeadline: "80-20 in a Toledo working-class district. Infrastructure year — find the candidate, then build the message.",
      memoParagraphs: [
        "HD-85 gave Tim Barhorst an 80-20 win in 2024. At $73K income, 19% college, 92% white, and 25% renters in the Toledo rural orbit, this district has moved decisively Republican and has not been meaningfully contested in recent cycles. The 20% Democratic floor reflects a base of loyal voters who have been given no organizational support.",
        "The candidate profile required here is specific: someone who lives in this community, works a trade or healthcare job, and can credibly say they are fighting for the people they grew up with. That person, delivering a tight economic message on wages and healthcare, can likely push the result to 72-28 or better without any national support.",
        "The 2026 goal is organizational: establish a voter contact database, identify the persuadable precincts where Democratic performance is above the district average, and train local volunteers. A 72-28 or better result with real infrastructure built is a meaningful success."
      ],
      memoBullets: [
        "Candidate first. Contact Toledo-area unions and local civic organizations. The right candidate already exists in this community and needs to be asked.",
        "Manufacturing job security and healthcare costs are the two frames with any cross-partisan reach. Pull Barhorst's specific votes and connect them to local economic impact.",
        "Run a presence-based campaign — door-knocking, local events, town halls. Personal contact in this district moves votes; partisan media does not.",
        "Set 72-28 as the 2026 baseline. Use the campaign to build voter file data, precinct maps, and a local volunteer network for future cycles."
      ]
    }
  },
  {
    id: "oh-hd-86",
    name: "Ohio House District 86",
    city: "Columbus",
    region: "Marion / Morrow Counties",
    type: "state house district",
    incumbentName: "Tracy Richardson",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Minority Community GOTV & Coalition Building", tag: "lean-into", why: "At 14% non-white — 4.3% Black, 3.2% Hispanic, 3.1% Asian — HD-86 is one of the more diverse Columbus-area districts in this batch. In a 69-31 seat, organized minority GOTV across all three communities could shift the margin 4-6 points on its own. Multi-year investment in Black, Hispanic, and Asian community organizing is the highest-ROI action in this district." },
        { name: "Economic Security & Wages", tag: "lean-into", why: "At $79K median income and 28% college with a 38.7-year median age, this is a younger working-to-middle-class Columbus suburb. Wage growth, job quality, and economic opportunity are primary concerns. Richardson's Statehouse votes on economic and labor policy provide concrete contrast material." },
        { name: "Housing Affordability", tag: "lean-into", why: "At 29% renters and a young median age, housing cost pressure is real in this district. Tenant protections, housing supply investment, and affordability policy are concrete issues that cross community lines and reinforce the economic frame." },
        { name: "Cultural Wedge Issues", tag: "avoid", why: "86% white at R+38. Leading with national social justice or identity framing will activate the Republican base without adding Democratic votes. The coalition must be built through economic and community-specific organizing, not partisan identity messaging." },
        { name: "Siloing Minority Outreach", tag: "avoid", why: "The diversity here is spread across three distinct communities — Black, Hispanic, and Asian — each with different organizing needs. A single generic 'minority outreach' tactic will fail all three. Invest in community-specific relationships and messengers for each group." }
      ],
      memoHeadline: "69-31 in a Columbus district that is 14% non-white, 29% renters, and median age 38. This is a medium-term flip target — start organizing now.",
      memoParagraphs: [
        "HD-86 gave Tracy Richardson a 69-31 win in 2024. At $79K income, 28% college, 14% non-white, 29% renters, and median age 38.7, this is one of the most demographically promising Columbus-area districts in this batch for a long-term Democratic pickup. The 69-31 margin reflects organizational absence, not permanent alignment.",
        "The coalition path requires three parallel organizing tracks: Black community GOTV (4.3%), Hispanic community outreach (3.2%), and Asian community engagement (3.1%) — each group requiring its own community-specific strategy and local messengers. Combined, these communities represent a decisive margin in a 69-31 seat if organized at high turnout and strong loyalty.",
        "The third track is economic: younger working-to-middle-class voters on wages and housing. A candidate who can run a genuine multi-community economic campaign in HD-86 — not a tokenized minority outreach effort — has a real path to 60-40 in 2026 and better in 2028."
      ],
      memoBullets: [
        "Launch three parallel community organizing efforts now: Black neighborhood voter registration, Hispanic community relationship-building, and Asian American civic engagement. Each requires a different approach and different messengers.",
        "Housing affordability is the cross-community economic hook — it affects renters across all three minority communities and younger white working-class voters simultaneously.",
        "The candidate must have genuine multi-community credibility or the ability to build it. A candidate who is rooted in one community but respected across others is the ideal profile.",
        "Set 60-40 as the 2026 goal. Use the campaign to build a multi-community voter file and demonstrate that HD-86 is an organizing district, not a write-off."
      ]
    }
  },
  {
    id: "oh-hd-87",
    name: "Ohio House District 87",
    city: "Columbus",
    region: "Rural Central Ohio (Logan / Union Counties)",
    type: "state house district",
    incumbentName: "Riordan T. McClain",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $67K income and only 17% college in a rural Columbus-area district, trade job quality, economic security, and rural investment are the primary frames. McClain's Statehouse votes on economic and labor policy are the core contrast available to a credible local candidate." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Low college attainment and rural demographics mean healthcare cost vulnerability is high. Drug pricing and rural hospital access are the most cross-partisan issues available and have demonstrated traction in comparable rural Ohio districts when delivered by someone the community already trusts." },
        { name: "Candidate Recruitment as Sole Priority", tag: "lean-into", why: "At R 76-24 with 95% white and 17% college in an older rural district, the immediate strategic task is finding any credible local candidate. A retired farmer, a rural nurse, or a longtime community leader with roots in HD-87 is the prerequisite for any message strategy." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "95% white at R+52 with a 43-year median age. Among the most homogeneous and Republican-leaning districts in this batch. No identity or social justice framing applies here." },
        { name: "Urban or Suburban Democratic Messaging", tag: "avoid", why: "HD-87 is rural Ohio in culture, economics, and identity. Any candidate who sounds like they belong in Columbus proper will be immediately rejected. Local biography and rural-specific economic language are the only credible path." }
      ],
      memoHeadline: "76-24 in a rural Ohio district that has been written off and forgotten. Showing up with the right local person changes the baseline.",
      memoParagraphs: [
        "HD-87 gave Riordan McClain a 76-24 win in 2024. At 95% white, 17% college-educated, $67K income, and a 43-year median age in the rural Columbus orbit, this is a deeply Republican district that has not been meaningfully contested in years. The 24% Democratic floor is a base of voters who receive no organizational support.",
        "The economic profile — below-median income, low college attainment, older working-class households — describes a community that once voted Democratic for decades before the cultural realignment. The policy interests of many HD-87 households have not fundamentally changed; the party identification has. A candidate who can speak to those economic interests without triggering cultural identity responses has a narrow but real opening.",
        "The 2026 goal is simple: field someone credible, run a tight rural economic message, reach 67-33 or better, and build the first organized precinct-level voter contact database this district has had in years."
      ],
      memoBullets: [
        "Find a candidate who already belongs to this community — a local farmer, a rural healthcare worker, a retired tradesperson with community standing. Without this, no strategy applies.",
        "Healthcare costs and job security are the only credible cross-partisan frames. Pull McClain's votes and translate them into local terms. No national issues.",
        "Rural identity matters enormously here. The candidate should be introduced through local events, churches, and community organizations before the formal campaign begins.",
        "Set 67-33 as the 2026 success condition. The voter file and precinct data built during this campaign are the real long-term deliverable."
      ]
    }
  },
  {
    id: "oh-hd-88",
    name: "Ohio House District 88",
    city: "Toledo",
    region: "Huron / Seneca Counties",
    type: "state house district",
    incumbentName: "Gary Click",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Hispanic Community GOTV & Outreach", tag: "lean-into", why: "At 8.2% Hispanic — the highest rate of any district in this session — HD-88 has a substantial Latino community in the Toledo rural orbit that is almost certainly underregistered and underorganized. Gary Click's record on social policy makes outreach to this community both strategically valuable and motivationally coherent. Multi-year organizing investment here is the most important action in this district." },
        { name: "Economic Security & Agricultural Jobs", tag: "lean-into", why: "At $64K income and 20% college in a Toledo-area district with high Hispanic agricultural worker presence, trade job quality, wages, and rural economic investment are the primary frames. Click's Statehouse record on labor and economic policy provides concrete contrast material." },
        { name: "Gary Click's Legislative Record", tag: "lean-into", why: "Click has a documented record on social and cultural legislation — including positions on LGBTQ+ issues and education policy — that may be out of step with portions of his own constituency. His record is the contrast, but it must be delivered locally and specifically, not as a national culture-war frame." },
        { name: "Nationalizing the Culture War", tag: "avoid", why: "88% white at R+34 with 20% college. Framing this race around national LGBTQ+ or social justice issues will activate Republican base turnout without adding Democratic votes among the white working-class majority. Click's record should be used to illustrate local impact, not to fight the national culture war." },
        { name: "Ignoring the Hispanic Community", tag: "avoid", why: "The 8.2% Hispanic rate is this district's single biggest organizing opportunity and it has been invisible to Democratic strategy. Leaving this community unorganized again in 2026 is a strategic error that compounds with every cycle. Start now." }
      ],
      memoHeadline: "8.2% Hispanic in a 67-33 district — the highest Latino rate in this entire dataset. The organizing failure here is the most correctable gap on the map.",
      memoParagraphs: [
        "HD-88 has the highest Hispanic population rate of any district in this dataset at 8.2%. Gary Click won 67-33 in 2024 in a district with $64K median income, 20% college, and 88% white population in the Toledo rural orbit. The Latino community — almost certainly concentrated in agricultural worker households — has been entirely absent from Democratic organizing strategy.",
        "This is the most correctable organizing gap in the Toledo region. A multi-year effort to register, engage, and turn out Hispanic voters in HD-88 does not require a persuasion message — it requires presence, trust, and basic civic infrastructure that has never been built. At 8.2%, organized Latino GOTV could move this district 5-7 points on its own over two cycles.",
        "Click's Statehouse record gives a Democrat contrast material, but the primary 2026 investment is organizational, not electoral. Field a credible candidate who can sustain a presence in both the white working-class and Latino communities, run a disciplined economic and agricultural message, and set the foundation for genuine competitiveness in 2028."
      ],
      memoBullets: [
        "Hispanic community organizing is the first and most urgent action: voter registration drives, community events, relationships with local agricultural worker organizations and churches. This must begin now, not in 2026 campaign season.",
        "Find a candidate with credibility in both Anglo and Latino communities — ideally someone with agricultural or rural healthcare roots who can speak to both constituencies authentically.",
        "Economic and agricultural frames lead: wages, farm policy, rural hospital access. Click's record on these issues is the contrast. His social/cultural record is supporting evidence, not the headline.",
        "Set 60-40 as the 2026 goal. Use the campaign to build a bilingual voter file, Hispanic precinct data, and community relationships that make HD-88 a fundamentally different organizing environment in 2028."
      ]
    }
  },
  {
    id: "oh-hd-89",
    name: "Ohio House District 89",
    city: "Cleveland",
    region: "Lorain County (Elyria / Avon)",
    type: "state house district",
    incumbentName: "D.J. Swearingen",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Black & Hispanic Community GOTV", tag: "lean-into", why: "At 6% Black and 5.3% Hispanic — over 11% combined — in a 59-41 Cleveland-area seat, organized minority GOTV is the decisive margin variable. If these communities turn out at high rates with strong loyalty, this is a 52-48 or better district. This is the highest-ROI investment in HD-89." },
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $66K median income and 24% college, this is a working-class Cleveland-orbit district with real economic pressure. Swearingen's Statehouse record on wages, labor, and economic policy provides concrete contrast material. Working-class economic populism is the primary frame for white voters." },
        { name: "Healthcare Costs & Medicaid", tag: "lean-into", why: "Below-state-median income and non-college demographics mean healthcare cost exposure is high. Medicaid protections, drug pricing, and hospital access are cross-partisan concerns that a credible candidate can use to peel soft Republican votes from white working-class households." },
        { name: "Public Safety Framing", tag: "careful", why: "At 85% white and R+18 in the Cleveland orbit, some voters have public safety concerns. Democrats must not cede the issue — frame it around economic investment and community stability, not policing reduction. Swearingen's record on state investment in communities is the contrast." },
        { name: "National Democratic Brand", tag: "avoid", why: "At 59-41 in a Cleveland-orbit working-class district, the national Democratic brand has drag. The candidate must lead with local identity and a specific Swearingen contrast. Nationalizing the race activates the Republican base without adding Democratic votes." }
      ],
      memoHeadline: "59-41 in a Cleveland district with 11% minority population and $66K median income. Black and Hispanic GOTV plus economic populism flips this seat.",
      memoParagraphs: [
        "HD-89 is one of the most actionable pickup targets in this batch. D.J. Swearingen won 59-41 in 2024 in a Cleveland-orbit district with $66K median income, 24% college, 6% Black, and 5.3% Hispanic population. At 59-41, the margin is not structural — it reflects candidate quality, turnout dynamics, and organizational investment.",
        "The path to victory is straightforward: organize Black and Hispanic communities at high turnout (11% combined), run a working-class economic populist message that peels 4-6 points off soft Republican white voters, and field a candidate with credibility across all three communities. That formula has worked in comparable Cleveland-orbit seats and it can work here.",
        "The 45-year median age means a significant portion of this electorate is near or approaching retirement — making Medicare, Social Security, and drug pricing especially high-salience. A candidate who combines those retirement security concerns with working-class economic populism and minority community GOTV has a clear path to 52-48 or better."
      ],
      memoBullets: [
        "Black and Hispanic GOTV is the margin. Identify minority-heavy precincts and invest in sustained, community-rooted organizing — not last-minute mailers. These communities are the difference between 59-41 and 52-48.",
        "The candidate must have credibility across white working-class and minority communities in the Cleveland orbit. This is a demanding but not impossible profile — look for union leaders, community health workers, or longtime civic figures.",
        "Lead with economic populism and retirement security. Swearingen's record on wages, Medicaid, and drug pricing translates directly to daily concerns for this electorate's older working-class households.",
        "Do not nationalize the race. Make this about Swearingen's specific record and what HD-89 working families need from a state legislator. Local, specific, economic."
      ]
    }
  },
  {
    id: "oh-hd-90",
    name: "Ohio House District 90",
    city: "Columbus",
    region: "Scioto / Pike Counties (Appalachian Ohio)",
    type: "state house district",
    incumbentName: "Justin Pizzulli",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $52K median income — the lowest in this batch — with only 17% college, this is the most financially stressed district in this group. Pizzulli's Statehouse votes on economic and labor policy are the primary contrast. Wage stagnation and job loss are daily realities here that a credible local economic message can address." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "The lowest income in this batch combined with low college attainment means healthcare cost vulnerability is extreme. Medicare, drug pricing, and Medicaid are the most cross-partisan issues available and the most personally felt concerns in this electorate." },
        { name: "Housing Affordability", tag: "lean-into", why: "At 30% renters and only $52K median income, a significant share of HD-90 residents are in genuine housing cost distress. Tenant protections and housing investment reinforce the economic frame with a concrete and personal argument for renter households." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "94% white at R+54 with 17% college and $52K income. The lowest-income, most homogeneous district in this batch votes deeply Republican on cultural identity. No social justice or identity framing applies." },
        { name: "National Democratic Brand", tag: "avoid", why: "An economically devastated 77-23 district assigns all of its political anger to the party brand it identifies as elite and out-of-touch. The candidate must run entirely on local economic identity and local community biography. Any national framing confirms those associations." }
      ],
      memoHeadline: "The poorest district in this batch at 77-23. Economic pain is real — but it has been routed to Republican identity. A local candidate can start redirecting it.",
      memoParagraphs: [
        "HD-90 is the lowest-income district in this batch at $52K median income, and it voted 77-23 for Justin Pizzulli in 2024. At 94% white and 17% college-educated with 30% renters in the rural Columbus orbit, this is a district where genuine economic distress has been fully captured by Republican cultural identity — a pattern seen across rural Ohio over the past decade.",
        "The 23% Democratic floor is meaningful: these are voters who remain Democratic-identifying despite years of organizational neglect. A credible local candidate who can speak to the economic pain in HD-90 with specificity and authenticity — connecting Pizzulli's Statehouse votes to what this district's families actually experience — can likely grow that floor to 30-32%.",
        "The 30% renter rate at $52K income is a genuine organizing hook. Renter households in the lowest-income district in the region are experiencing affordability distress that a housing-focused message can address in concrete and personal terms. That, combined with healthcare and job security, is the economic triangle that gives a candidate credibility without requiring partisan identity."
      ],
      memoBullets: [
        "Candidate first and only: someone who grew up here, works here, and can credibly claim to fight for this community's economic interests. Without that person, no message lands.",
        "Healthcare costs and housing affordability are the two most personal issues in a $52K renter-heavy district. Lead with them and connect them specifically to Pizzulli's record.",
        "Wages and job security are the third frame. Pull Pizzulli's votes on labor and economic policy and translate them into what they mean for HD-90 working families.",
        "Set 68-32 as the 2026 goal. Voter file data and organized precincts are the real deliverables from this campaign cycle."
      ]
    }
  },
  {
    id: "oh-hd-91",
    name: "Ohio House District 91",
    city: "Columbus",
    region: "Rural SE Ohio (Pickaway / Vinton)",
    type: "state house district",
    incumbentName: "Bob Peterson",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $59K income and only 14.9% college — the lowest in this batch — HD-91 is among the most financially stressed and least-educated districts in this session. Peterson's Statehouse votes on wages, labor, and economic investment are the primary contrast material. The economic pain is real; a credible local candidate can name it." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "The lowest college attainment in the batch and below-median income make healthcare cost vulnerability acute. Medicare, drug pricing, and Medicaid access are the most cross-partisan issues available. These concerns are felt daily by HD-91 households and can open doors that pure partisan identity closes." },
        { name: "Housing Affordability", tag: "lean-into", why: "At 31% renters and $59K income, a significant share of this district is in genuine housing cost distress. Tenant protections and housing investment give a Democrat a concrete and personal argument — one that requires no partisan identity to land — with renter households." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "94% white at R+60 with 15% college. The lowest-education district in this batch. Social justice or identity framing will not open a single door. Rural economic vocabulary only." },
        { name: "National Democratic Brand", tag: "avoid", why: "An 80-20 result means the national party brand is deeply toxic. The candidate must be introduced as a community member first — where they live, who they know, what they do — not as a Democrat. Any top-line partisan framing confirms voters' existing identity." }
      ],
      memoHeadline: "80-20 with 31% renters and 15% college — the pain is real, the organization is absent. A local candidate with an economic biography starts closing that gap.",
      memoParagraphs: [
        "HD-91 gave Bob Peterson an 80-20 win in 2024. At 14.9% college-educated — the lowest in this batch — $59K median income, and 31% renters in the rural Columbus orbit, this is a district where economic distress is severe and has been entirely captured by Republican cultural identity. The 20% Democratic floor is abandoned voters, not an ideological ceiling.",
        "The 31% renter rate at $59K income is the most actionable organizing fact in this district. Renter households in a low-income rural district are experiencing genuine affordability pressure — rent increases, inadequate housing, and no policy response from their representatives. A candidate who leads with concrete housing and healthcare cost contrast tied to Peterson's record has the most direct argument available.",
        "The 2026 goal is 70-30 with a credible local candidate and a renter-focused precinct strategy. The voter file and precinct data built from that campaign make HD-91 a different organizing environment heading into 2028."
      ],
      memoBullets: [
        "Find a candidate who belongs to this community — a local tradesperson, a rural nurse, a farmer. The lowest-college district in this batch requires the highest-authenticity candidate.",
        "Renter outreach is the organizing priority. Door-knock renter-heavy addresses with a housing affordability message tied specifically to Peterson's Statehouse record.",
        "Healthcare costs and job security are the secondary economic frames. Lead with what Peterson has voted for and what it costs HD-91 families.",
        "Set 70-30 as the 2026 baseline. Voter file data and organized precincts are the real deliverables."
      ]
    }
  },
  {
    id: "oh-hd-92",
    name: "Ohio House District 92",
    city: "Columbus",
    region: "Ross / Hocking Counties (Chillicothe Area)",
    type: "state house district",
    incumbentName: "Mark Johnson",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $59K median income and 16% college in the rural Columbus orbit, this is a financially stressed working-class district where trade jobs, economic security, and wages are primary daily concerns. Johnson's Statehouse votes on economic and labor policy provide the most credible contrast available." },
        { name: "Black Community GOTV", tag: "lean-into", why: "At 3.6% Black — meaningful in a 91% white rural district — HD-92 has a minority community that is almost certainly underregistered and underorganized. In a 72-28 seat, organized Black GOTV alongside white working-class economic messaging could shift the margin 3-4 points and create genuine longer-term trajectory change." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Low income and low college attainment mean healthcare cost vulnerability is high. Drug pricing, Medicaid, and rural hospital access are the most cross-partisan issues available. They have demonstrated reach with Republican-leaning households in comparable rural Ohio districts." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "91% white at R+44 with 16% college in the rural Columbus orbit. Identity or social justice framing will foreclose any persuasion conversation. Economic and rural-governance messaging only." },
        { name: "Urban-Coded Campaign Messaging", tag: "avoid", why: "This is rural southeastern Ohio in culture and identity. Any candidate or campaign that reads as urban or suburban — in language, dress, or issue priorities — will be rejected immediately. Hyper-local rural economic authenticity is the only viable path." }
      ],
      memoHeadline: "72-28 with a 3.6% Black community in rural Ohio. Economic populism plus Black GOTV builds the path from 28% to something better.",
      memoParagraphs: [
        "HD-92 gave Mark Johnson a 72-28 win in 2024. At $59K income, 16% college, 91% white, and 3.6% Black in the rural Columbus orbit, this is a financially stressed district that has moved Republican on cultural identity while its underlying economic interests remain unaddressed.",
        "The 3.6% Black population is small but not negligible. In a 72-28 seat, organized Black voter registration and GOTV alongside a working-class white economic message represents a two-track strategy that could shift the result to 64-36 or better with the right candidate. The Black community in HD-92 has been entirely invisible to Democratic organizing — fixing that is both the right thing and the practical thing.",
        "The candidate profile is specific: someone with rural roots, economic credibility, and the ability to speak authentically to both white working-class and Black communities in a rural southeastern Ohio context. That profile exists in this community — it needs to be recruited."
      ],
      memoBullets: [
        "Recruit a candidate with genuine rural roots and economic credibility. A union member, a rural healthcare worker, or a local civic leader who has been visible in the community long before the campaign.",
        "Begin Black community voter registration and GOTV outreach now. This is a multi-year investment, not a 2026 campaign tactic. Identify local Black community leaders and build relationships.",
        "Economic message only: Johnson's votes on wages, healthcare, and rural investment versus what HD-92 working families need. No national branding.",
        "Set 64-36 as the 2026 goal. A meaningful margin improvement with Black community organizing launched is the real success condition."
      ]
    }
  },
  {
    id: "oh-hd-93",
    name: "Ohio House District 93",
    city: "Columbus",
    region: "Lawrence / Gallia Counties (Appalachian SE Ohio)",
    type: "state house district",
    incumbentName: "Jason Stephens",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Fielding a Challenger to Jason Stephens", tag: "lean-into", why: "Jason Stephens is the former Ohio House Speaker — one of the most prominent Republicans in state government. He ran unopposed in 2024. Leaving the former Speaker unchallenged is a statewide organizing failure that signals Democratic weakness to donors, volunteers, and voters. A credible challenger generates earned media, forces Stephens to spend, and makes HD-93 visible." },
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $56K income — below the median — and only 18% college with 26% renters in southeastern rural Ohio, this is a financially stressed district. Stephens's record as Speaker on economic and budget priorities is the contrast: what did he use that power for, and who benefited?" },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "Low income and low college attainment mean healthcare cost vulnerability is high. Drug pricing and rural hospital access are the most cross-partisan available issues. As House Speaker, Stephens had direct influence over healthcare legislation — that record is the contrast." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "94% white at a deep R baseline with 18% college in rural southeastern Ohio. No social justice or identity framing applies. Economic populism and rural investment are the only credible lanes." },
        { name: "Personalizing Attacks on Stephens", tag: "avoid", why: "Stephens has local name recognition as a community member, not just as a politician. Personal attacks without policy substance will backfire. Lead with his record as Speaker — the decisions he made and who they helped — not with character attacks." }
      ],
      memoHeadline: "The former Ohio House Speaker ran unopposed. Challenge him on his record — not to win, but because leaving him unchallenged is its own defeat.",
      memoParagraphs: [
        "HD-93 was uncontested in 2024. Jason Stephens — the former Ohio House Speaker and one of the most powerful Republicans in Columbus — ran without a Democratic opponent. At $56K income, 18% college, 94% white, and 26% renters in rural southeastern Ohio, this is a deeply Republican district, but the decision to leave the former Speaker unchallenged was an organizational failure with consequences beyond this single seat.",
        "Fielding a candidate in HD-93 generates statewide earned media, draws donor attention, and signals that Ohio Democrats are serious about contesting power wherever it sits. Even a 70-30 loss against the former House Speaker with a credible local candidate is a story — it puts Stephens's record on the table, forces him to raise and spend money defensively, and demonstrates organizational seriousness to volunteers and donors statewide.",
        "The local message is straightforward: as Speaker, Stephens had more power than any other member of the Ohio House. What did he do with it? Who benefited from his budget priorities, his healthcare votes, his economic decisions? A candidate who can make that case in rural southeastern Ohio terms — connecting Stephens's Statehouse power to what HD-93 families actually experience — has a credible local argument even in a deeply Republican district."
      ],
      memoBullets: [
        "Field a candidate. This is the non-negotiable 2026 action. A local civic leader, a rural healthcare worker, or a community figure with standing in southeastern Ohio who is willing to take on Stephens publicly.",
        "Make Stephens's record as Speaker the campaign: his budget priorities, healthcare votes, and economic decisions. Ask publicly: with all that power, what did he do for HD-93?",
        "Healthcare costs and rural investment are the two most credible local frames. Connect Stephens's record directly to what southeastern Ohio families are experiencing.",
        "Use the race to generate statewide attention and demonstrate organizational seriousness. A 70-30 result with a real campaign is better than a 100-0 result with none."
      ]
    }
  },
  {
    id: "oh-hd-94",
    name: "Ohio House District 94",
    city: "Columbus",
    region: "Athens / Meigs Counties",
    type: "state house district",
    incumbentName: "Kevin Ritter",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Housing Affordability & Renters' Rights", tag: "lean-into", why: "At 31% renters and only $53K median income — the second-lowest in this batch — HD-94 has significant renter-household cost distress in a younger district. Tenant protections and housing investment are the most personal and cross-partisan issues available. Ritter's Statehouse record on housing policy is the contrast." },
        { name: "Economic Security & Wages", tag: "lean-into", why: "At $53K income with 25% college and a 38.5-year median age, this is a younger, financially stressed working-class rural district. Wage growth, job security, and economic opportunity resonate with the younger households that make HD-94 demographically distinct from its neighbors." },
        { name: "Reproductive Rights", tag: "careful", why: "At 25% college and median age 38.5 — the youngest in this batch — there is a measurable younger voter cohort in HD-94 for whom reproductive rights are a mobilizing issue. It is not a lead frame in a 69-31 rural district, but it activates younger low-propensity voters who otherwise stay home in off-year elections." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "93% white at R+38 in rural Ohio. Social justice or identity framing will foreclose any persuasion conversation. Housing and wages must lead." },
        { name: "Aging Into the District's Message", tag: "avoid", why: "HD-94's distinguishing feature is its relative youth — median age 38.5. A campaign that sounds like it was written for a 55-year-old rural Ohio voter misses the opportunity. The economic and housing message must speak to younger working families, not just older blue-collar voters." }
      ],
      memoHeadline: "The youngest district in this batch at 38.5-year median age with 31% renters and $53K income. Housing plus wages speaks to this electorate in a way that works elsewhere in Ohio.",
      memoParagraphs: [
        "HD-94 gave Kevin Ritter a 69-31 win in 2024. At $53K income, 25% college, 31% renters, and median age 38.5 — the youngest district in this batch — HD-94 has a demographic profile that is slightly more favorable than its neighbors. The youth of this electorate and the high renter rate create organizing opportunities that do not exist in the older, less-renter districts surrounding it.",
        "Housing affordability is the lead issue. Younger renter households at below-median income in a rural Columbus-orbit district are experiencing real cost pressure. A candidate who leads with tenant protections and housing investment — connected specifically to Ritter's Statehouse record — has a personal and immediate argument that does not require partisan identity to land.",
        "The 2026 goal is 61-39 with a serious local candidate who can speak to younger working families. A candidate in their 30s or early 40s with local roots and an economic biography is the right profile — someone who can credibly say they are fighting for people in the same stage of life as most of HD-94's voters."
      ],
      memoBullets: [
        "Lead with housing affordability. Door-knock renter-heavy addresses with a concrete, local message about what Ritter has done (or not done) on tenant protections and housing cost relief.",
        "The candidate should reflect the district's relative youth — someone in their 30s or early 40s with local roots who can speak to the economic reality of younger working families in rural Ohio.",
        "Wages and economic security are the secondary frame. Connect Ritter's economic record to what younger households in HD-94 are actually earning and spending.",
        "Reproductive rights can activate younger low-propensity voters if used carefully — not as the lead issue, but as a mobilization tool for the under-40 cohort. Set 61-39 as the 2026 goal."
      ]
    }
  },
  {
    id: "oh-hd-95",
    name: "Ohio House District 95",
    city: "Cleveland",
    region: "Columbiana County / Youngstown SE",
    type: "state house district",
    incumbentName: "Don Jones",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Manufacturing & Trade Job Security", tag: "lean-into", why: "At $61K income and only 19% college in the Cleveland rural orbit with a 44.5-year median age, this is an older working-class district where trade job quality, plant closings, and economic stagnation are lived experience. Jones's Statehouse record on labor and economic policy is the primary contrast frame." },
        { name: "Retirement Security & Healthcare Costs", tag: "lean-into", why: "At median age 44.5 — the oldest in this batch — a large share of HD-95 voters are within 10-15 years of retirement. Medicare, Social Security, drug pricing, and pension security are high-salience concerns that cross party lines in older working-class Cleveland-orbit districts. This is the most potent cross-partisan frame available." },
        { name: "Candidate Recruitment from Local Labor", tag: "lean-into", why: "The Cleveland labor network is the most productive recruitment source for a candidate in this district. A retired union steward, a local building trades member, or a UAW/USW representative with community standing is the profile that can deliver an economic and retirement security message with credibility in HD-95." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "94% white at R+34 with 19% college in the Cleveland rural orbit. Identity or social justice framing will immediately close doors with the working-class older white voters this district requires. Economic and retirement security messaging only." },
        { name: "National Democratic Brand", tag: "avoid", why: "A 67-33 result means the national party brand is a significant liability. The candidate must lead with local identity and specific Jones contrasts. Nationalizing the race activates the Republican base without adding Democratic votes in this electorate." }
      ],
      memoHeadline: "Median age 44.5 in a 67-33 Cleveland working-class district. Retirement security and trade jobs are the cross-partisan openers — use them.",
      memoParagraphs: [
        "HD-95 gave Don Jones a 67-33 win in 2024. At $61K income, 19% college, 94% white, and median age 44.5 in the Cleveland rural orbit, this is an older working-class district where retirement security is becoming a primary daily concern. The age profile is the distinguishing characteristic — this is not a district of young families; it is a district of workers approaching or entering retirement.",
        "That age profile creates a specific and powerful opening: Medicare, drug pricing, pension security, and Social Security are concerns that cut across partisan identity for voters who are 5-15 years from retirement and watching their savings and healthcare costs with increasing anxiety. Jones's Statehouse record on these issues — and on the economic policies that affect older working-class households — is the most credible cross-partisan contrast available.",
        "The 2026 goal is 60-40 with a labor-rooted local candidate who can deliver a retirement security and trade jobs message with authentic working-class credibility. A Cleveland-area union figure or retired tradesperson who can speak to HD-95's older working households is the right profile."
      ],
      memoBullets: [
        "Retirement security is the lead issue. Medicare, drug costs, and pension protections are high-salience concerns for a 44.5-year median age district. Pull Jones's votes on these issues and connect them to what HD-95 households are actually experiencing as they approach retirement.",
        "Trade job quality and manufacturing are the second frame — this is the economic biography issue for older working-class Cleveland-orbit voters. A candidate with union roots can credibly own this space.",
        "Recruit from the Cleveland-area labor network: a retired UAW or USW steward, a building trades leader, or a longtime community figure with genuine working-class credibility in the Cleveland orbit.",
        "Set 60-40 as the 2026 goal. Use the campaign to identify persuadable precincts, build a union-connected voter file, and establish a local organizing presence that makes HD-95 competitive in 2028."
      ]
    }
  },
  {
    id: "oh-hd-96",
    name: "Ohio House District 96",
    city: "Cleveland",
    region: "Mahoning / Trumbull Rural North",
    type: "state house district",
    incumbentName: "Ron Ferguson",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Fielding a Candidate in a Cleveland-Area Uncontested Seat", tag: "lean-into", why: "Ron Ferguson ran unopposed in 2024 in a Cleveland-orbit district with $55K income, 4% Black population, and 27% renters. Leaving this seat unchallenged is an organizational failure that compounds each cycle. A credible local candidate generates a baseline vote share, builds infrastructure, and signals to Cleveland-area labor and minority networks that Democrats are not conceding the entire suburban perimeter." },
        { name: "Retirement Security & Healthcare Costs", tag: "lean-into", why: "At median age 44.6 and $55K income, a large share of HD-96 voters are aging into retirement on limited means. Medicare, drug pricing, pension security, and Medicaid are high-salience daily concerns that cross partisan lines in this older, lower-income electorate. Ferguson's Statehouse record on these issues is the primary contrast." },
        { name: "Black Community GOTV", tag: "lean-into", why: "At 4% Black in a 91% white Cleveland-orbit district, this community is small but entirely unorganized. Voter registration and GOTV investment here builds Cleveland-region infrastructure and gives local Black voters a reason to engage with state-level politics — which compounds in future cycles." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "91% white at a deep R baseline with 18% college in the Cleveland rural orbit. Social justice or identity framing will not open doors here. Retirement security and economic messaging only." },
        { name: "Urban Democratic Messaging", tag: "avoid", why: "This is a Cleveland-orbit working-class district, not a Cleveland city seat. Any candidate who sounds like they belong in the city's Democratic establishment will be rejected. Local rural/exurban economic identity is the only credible frame." }
      ],
      memoHeadline: "Ferguson ran unopposed in a district with 4% Black voters, 27% renters, and a 44-year median age. Field someone and start building what isn't there.",
      memoParagraphs: [
        "HD-96 was uncontested in 2024. Ron Ferguson held the seat in the Cleveland orbit without a Democratic opponent. At $55K income, 18% college, 91% white, 4% Black, and median age 44.6, this is a lower-income, older working-class district that has been entirely abandoned by Democratic organizing — and that abandonment is self-reinforcing.",
        "The retirement security frame is the clearest cross-partisan opening in this district. A 44.6-year median age means a large cohort of HD-96 voters is approaching retirement on modest means, watching healthcare costs and pension security with real anxiety. Ferguson's record on Medicaid, drug pricing, and pension policy is the contrast. A local candidate who can make that argument in working-class Cleveland-orbit terms has a genuine opening even in a previously uncontested seat.",
        "The 2026 goal is presence: field a candidate, generate a vote-share baseline, begin Black community organizing, and build the voter contact infrastructure that has never existed in this district. A 65-35 result with those three things in place is a meaningful success."
      ],
      memoBullets: [
        "Find a candidate from the Cleveland labor orbit — a retired union worker, a local healthcare professional, or a community figure with standing in the district. Without them, nothing else matters.",
        "Retirement security leads: Medicare, drug costs, pension protection. Pull Ferguson's specific votes and connect them to what HD-96 older households are experiencing.",
        "Begin Black community voter registration and organizing in parallel with the candidate search. Small community, big signal — showing up matters.",
        "Set 65-35 as the 2026 goal. The voter file and precinct data from this campaign are the long-term deliverable."
      ]
    }
  },
  {
    id: "oh-hd-97",
    name: "Ohio House District 97",
    city: "Columbus",
    region: "Knox / Coshocton Counties",
    type: "state house district",
    incumbentName: "Adam P. Holmes",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Housing Affordability & Renters' Rights", tag: "lean-into", why: "At 31.7% renters — the highest rate in this final batch — and $57K median income in rural Columbus orbit, HD-97 has a significant share of households in genuine housing cost distress. Holmes's uncontested status means tenant protections and housing investment have never been raised as local issues. A candidate who leads with this has an immediate organizing hook with a third of the district's households." },
        { name: "Economic Security & Working-Class Jobs", tag: "lean-into", why: "At $57K income and 19% college, this is a financially stressed working-class rural district. Holmes ran unopposed, so his economic record has never been publicly scrutinized. Wages, job quality, and rural economic investment are the primary contrast frames for a credible local candidate." },
        { name: "Fielding a Candidate as the 2026 Mission", tag: "lean-into", why: "Holmes ran without a Democratic opponent in 2024. The highest renter rate in this batch is an organizing asset that has never been activated. A candidate who can sustain a housing and economic message in a district where 32% of residents rent — and who has never heard a Democratic argument directed at them — has more persuasion headroom than the uncontested result suggests." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "92% white at an implied deep R baseline with 19% college in rural Ohio. No social justice or identity framing. Housing and economic populism only." },
        { name: "National Democratic Brand", tag: "avoid", why: "An uncontested R seat in rural Ohio means the national Democratic brand is entirely unknown or actively toxic. The candidate must be introduced as a local community figure with an economic biography — not as a party representative." }
      ],
      memoHeadline: "Holmes ran unopposed with 32% renters and $57K income in the district. That's not a concession — that's an organizing failure with a clear fix.",
      memoParagraphs: [
        "HD-97 was uncontested in 2024. Adam Holmes held the seat in the rural Columbus orbit without a Democratic opponent. At 31.7% renters — the highest in this final batch — $57K income, and 19% college, this is a district where housing affordability and economic security are daily concerns that have never been given a Democratic political voice.",
        "The 31.7% renter rate is the most actionable organizing fact in this district. These households are experiencing real cost pressure — rent increases, inadequate housing stock, no state policy response — and they have never been contacted by a Democratic campaign. A candidate who leads with tenant protections and housing investment, tied to Holmes's unscrutinized Statehouse record, has persuasion headroom that is invisible in an uncontested race.",
        "The 2026 goal is straightforward: field a candidate, prioritize renter-heavy precincts, run a tight housing and economic message, and establish a vote-share baseline. A 65-35 or better result with organized renter outreach is a genuine success."
      ],
      memoBullets: [
        "Housing first. Identify renter-heavy addresses in HD-97 and door-knock them with a concrete affordability message. This is a population that has never been asked for their vote on this issue.",
        "Find a candidate with local roots and economic credibility — a community member who can credibly say they are fighting for renters and working families in this specific district.",
        "Connect Holmes's Statehouse record to what HD-97 households actually experience: wages, housing costs, healthcare. He has never had to defend that record. Make him.",
        "Set 65-35 as the 2026 baseline. Voter file data, organized precincts, and renter-focused outreach infrastructure are the long-term deliverables."
      ]
    }
  },
  {
    id: "oh-hd-98",
    name: "Ohio House District 98",
    city: "Columbus",
    region: "Muskingum / Morgan Counties (Zanesville Area)",
    type: "state house district",
    incumbentName: "Mark Hiner",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Economic Security & Wages for Younger Workers", tag: "lean-into", why: "At median age 37.3 — the youngest district in the entire 99-district dataset — HD-98 has a large cohort of younger working households who are building careers and families on $65K median income with only 18% college. Wage growth, job quality, and economic opportunity are primary concerns for this demographic. Hiner's Statehouse record on labor and economic policy is the contrast." },
        { name: "Housing Affordability", tag: "lean-into", why: "At 26% renters in a young working-class district, housing cost pressure is acute for younger households in the early stages of homeownership or renting. Tenant protections, housing supply investment, and affordability policy are concrete concerns that resonate with the 37-year median age electorate in a way that older-skewing districts do not feel as sharply." },
        { name: "Reproductive Rights as a Mobilization Tool", tag: "careful", why: "The youngest district in Ohio at 37.3-year median age has a meaningful cohort of younger voters for whom reproductive rights are a high-salience issue. It is not a lead frame in a 75-25 rural district, but used strategically, it activates low-propensity younger voters who otherwise don't turn out in off-year elections." },
        { name: "Cultural & Social Issues", tag: "avoid", why: "95% white at R+50 with 18% college — despite the young median age, the district's homogeneity and deep Republican lean mean social justice or identity framing will foreclose any persuasion conversation. Economic and youth-specific messaging only." },
        { name: "Treating This Like an Older Rural District", tag: "avoid", why: "HD-98's youngest-in-Ohio median age is its defining characteristic. A campaign that sounds like it was written for a 55-year-old rural voter misses the only distinguishing opportunity. The economic and housing message must speak to younger working families specifically — their wages, their rent, their futures — not generic working-class nostalgia." }
      ],
      memoHeadline: "The youngest district in all of Ohio at 37.3-year median age. Economic opportunity and housing affordability speak to this electorate in ways that don't work in the districts around it.",
      memoParagraphs: [
        "HD-98 is Ohio's youngest legislative district at 37.3-year median age — a fact that makes it strategically distinct from the deeply Republican rural Columbus-orbit seats surrounding it. Mark Hiner won 75-25 in 2024, but the district's youth creates organizing opportunities that standard rural Republican demographics do not offer.",
        "Younger working households at $65K median income with 26% renters are experiencing specific economic pressures — entry-level wages, housing costs, family formation expenses — that a candidate who reflects their life stage can address directly. The contrast is not the generic Republican-versus-Democrat frame; it is: what has Hiner done for people in their 30s trying to build a life in this district?",
        "The 2026 goal is 67-33 with a candidate who genuinely belongs to this younger working community — someone in their 30s with local roots and an economic biography that speaks to HD-98's specific generational concerns. That candidate, with a youth-specific economic and housing message, has more persuasion headroom here than the 75-25 result suggests."
      ],
      memoBullets: [
        "Recruit a candidate in their 30s with local roots. This is the only district in Ohio where a young candidate's age is itself a strategic asset — they represent the district's median voter in a way that older candidates cannot.",
        "Housing and wages are the two-issue platform. What does it cost to rent or buy in this district? What are younger workers earning? Connect Hiner's record directly to both questions.",
        "Reproductive rights can mobilize younger low-propensity voters if deployed carefully — not as the lead issue, but as a secondary activation tool for younger women who don't turn out in off-year cycles.",
        "Set 67-33 as the 2026 goal. Use the campaign to build a youth-skewing voter file and identify which precincts have higher Democratic potential among younger households."
      ]
    }
  },
  {
    id: "oh-hd-99",
    name: "Ohio House District 99",
    city: "Columbus",
    region: "Portage / Geauga Counties (NE Ohio)",
    type: "state house district",
    incumbentName: "Sarah Fowler Arthur",
    incumbentParty: "Republican",
    nextElection: "November 2026",
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
      issues: [
        { name: "Hispanic & Black Community GOTV", tag: "lean-into", why: "At 4.2% Hispanic and 3.1% Black — over 7% combined non-white in a Columbus-area district — HD-99 has minority communities that are almost certainly underorganized. In a 65-35 seat, sustained multi-year GOTV investment across both communities could shift the margin 4-5 points on its own and put this seat within realistic reach." },
        { name: "Economic Security & Working-Class Wages", tag: "lean-into", why: "At $72K income and 27% college in the Columbus orbit, this is a working-to-middle-class district with real economic concerns. Fowler Arthur's Statehouse record on wages, labor policy, and economic investment provides the primary contrast for white working-class voters who are not yet persuaded by partisan identity alone." },
        { name: "Reproductive Rights", tag: "lean-into", why: "At 27% college-educated with a 65-35 margin in the Columbus orbit, reproductive rights are a credible and high-value contrast point. Fowler Arthur has a documented voting record on abortion access that is out of step with portions of a Columbus-area suburban electorate. This is a mobilization and persuasion issue simultaneously." },
        { name: "Cultural Wedge Issues", tag: "avoid", why: "90% white at R+30 with 27% college in the Columbus orbit. Social justice framing will activate the Republican base without adding Democratic votes among the persuadable white working-class and suburban voters this district requires. Rights, governance, and economic messaging — not identity politics." },
        { name: "Treating This as a Write-Off", tag: "avoid", why: "HD-99 at 65-35 with 7% minority population and a documented incumbent record on reproductive rights is not a write-off — it is an under-organized seat in a Columbus-orbit district with the demographic ingredients for a serious challenge. Treating it as unwinnable becomes a self-fulfilling prophecy." }
      ],
      memoHeadline: "Fowler Arthur at 65-35 in a Columbus district with 7% minority population and a documented reproductive rights record. This seat is contestable — organize it.",
      memoParagraphs: [
        "HD-99 is the final district — and one of the more interesting ones in this closing batch. Sarah Fowler Arthur won 65-35 in 2024 in a Columbus-orbit district with $72K income, 27% college, 4.2% Hispanic, and 3.1% Black. At 65-35 with documented minority communities and a well-known incumbent record on reproductive rights, this seat is under-organized, not unwinnable.",
        "The coalition path combines three tracks: Hispanic and Black GOTV (7% combined, underorganized), reproductive rights mobilization targeting college-educated suburban women (27% of the district), and working-class economic contrast for voters who are feeling wage and cost-of-living pressure at $72K income. Fowler Arthur's record on reproductive rights — documented through her Statehouse votes — gives the campaign concrete and personal contrast material.",
        "The 2026 goal is 57-43 with a serious candidate and all three organizing tracks running simultaneously. That result, in a Columbus-orbit seat with 7% minority population and a high-profile incumbent, demonstrates genuine competitiveness and sets up a real flip attempt in 2028."
      ],
      memoBullets: [
        "Launch Hispanic and Black community organizing immediately — voter registration, community events, and relationship-building in minority neighborhoods in HD-99. These communities are the decisive swing variable.",
        "Reproductive rights lead the contrast campaign. Pull Fowler Arthur's specific votes and connect them to what Columbus-area suburban women in HD-99 experience. This is the highest-ROI persuasion issue in this district.",
        "Economic message reinforces: wages, cost of living, what Fowler Arthur's record means for HD-99 working families. Support the rights frame with economic credibility.",
        "Recruit a candidate who reflects the district's professional and community values — someone with Columbus-orbit credibility who can speak across the white working-class and minority communities simultaneously. Set 57-43 as the 2026 goal."
      ]
    }
  }

];
