/* senate-districts.js — Groundwork Ohio Senate District Data
 *
 * DATA SCHEMA (each entry):
 *   id             — unique kebab-case string used by showDistrict()
 *   name           — display name shown in search and dashboard
 *   city           — "Akron" | "Cleveland" | "Columbus" | "Cincinnati" | "Toledo"
 *   region         — area description (shown in search dropdown)
 *   type           — "state senate district"
 *   incumbentName  — current officeholder
 *   incumbentParty — "Democrat" | "Republican" | "Independent"
 *   nextElection   — odd-numbered districts = November 2026; even = November 2028
 *   seatStatus     — "Active" | "Open"
 *   dashboard      — full brief object
 * ─────────────────────────────────────────────────────────────────────────────── */

const SENATE_DISTRICTS = [

  // ══════════════════════════════════════════════
  //  OHIO STATE SENATE DISTRICTS
  // ══════════════════════════════════════════════

  {
    id: "oh-sd-1",
    name: "Ohio Senate District 1",
    city: "Toledo",
    region: "Northwest Ohio (Williams, Fulton, Defiance, Henry, Paulding counties)",
    type: "state senate district",
    incumbentName: "Robert McColley",
    incumbentParty: "Republican",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 1",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$69,460", sub: "" },
        { label: "College-Educated Adults",  value: "21.2%",  sub: "" },
        { label: "Median Age",               value: "40.6",   sub: "" },
        { label: "Renter Rate",              value: "22.5%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Robert McColley (R) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 91.3, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino",        pct:  6.3, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct:  1.1, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  0.7, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Agricultural & Rural Economic Policy", tag: "lean-into", why: "SD-1 is rural farm country — Williams, Fulton, Defiance, Henry, and Paulding counties are dominated by agriculture. Farm income, commodity prices, rural broadband, and agricultural infrastructure are tangible daily concerns that a Democratic challenger can speak to with an economic populist frame that resonates regardless of party label." },
        { name: "Rural Healthcare Access", tag: "lean-into", why: "At 40.6 median age in a rural district with no major urban center, healthcare access — including hospital consolidations, rural clinic closures, and prescription drug costs — is a kitchen-table issue. Democrats can own this as a constituent-service priority that the incumbent has failed to deliver." },
        { name: "Trade & Manufacturing Job Losses", tag: "lean-into", why: "NW Ohio's economy has been shaped by automotive supply chains and manufacturing. Highlighting the gap between Republican trade rhetoric and actual job outcomes in Defiance, Bryan, and Napoleon gives a Democratic challenger a credible economic authenticity argument." },
        { name: "Immigration & Border Security", tag: "avoid", why: "At 91% white and heavily rural, immigration as a hot-button issue will not move D votes in SD-1. A challenger who gets drawn into federal immigration debates loses the district's economic focus and cedes the narrative to Republican base mobilization." },
        { name: "Gun Policy", tag: "avoid", why: "Rural NW Ohio is a hunting and gun-ownership culture. A Democratic challenger who leads with gun restrictions will disqualify themselves with persuadable working-class voters before making any economic argument. This issue has no upside in SD-1." }
      ],
      memoHeadline: "Deep-R rural NW Ohio — field a candidate to build infrastructure and own the healthcare and farm economy narrative.",
      memoParagraphs: [
        "SD-1 is among Ohio's most Republican rural senate seats, covering five predominantly agricultural counties in the northwest corner of the state. Robert McColley ran uncontested in 2022, reflecting the Democratic Party's near-total organizational absence from this territory. The seat is not competitive in 2026, but leaving it uncontested again is a strategic mistake.",
        "The path to a credible challenge runs entirely through economic populism: farm policy, rural hospital closures, prescription drug costs, and the hollowing out of small-town economies in Bryan, Napoleon, Defiance, and Wauseon. These concerns cut across partisan identity when argued by a candidate who is genuinely from the community. A Democrat who shows up, attends county fairs, and names specific failures in the rural economy can move the needle from uncontested to a respectable minority.",
        "The 6.3% Hispanic population — largely agricultural workers in this region — represents an underserved constituency that a Democratic presence can engage. Spanish-language outreach and agricultural worker protections are both principled and politically useful in this district."
      ],
      memoBullets: [
        "Recruit a candidate with rural roots — a farmer, veterinarian, rural healthcare worker, or small-business owner. Credibility in this district is biographical, not programmatic.",
        "Center the campaign on three kitchen-table issues: rural hospital access, prescription drug costs, and farm income. Do not platform on anything that triggers urban cultural associations.",
        "Invest in Hispanic agricultural worker outreach in Fulton and Henry counties. Register voters, provide Spanish-language constituent services, and build a loyal base that persists past 2026."
      ]
    }
  },

  {
    id: "oh-sd-2",
    name: "Ohio Senate District 2",
    city: "Toledo",
    region: "Toledo Metro (Lucas County)",
    type: "state senate district",
    incumbentName: "Paloma De La Fuente",
    incumbentParty: "Democrat",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 2",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$59,394", sub: "" },
        { label: "College-Educated Adults",  value: "26.4%",  sub: "" },
        { label: "Median Age",               value: "38.0",   sub: "" },
        { label: "Renter Rate",              value: "37.1%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Paloma De La Fuente (D) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 75.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 14.3, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  7.2, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  1.3, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Wages & Working-Class Economic Security", tag: "lean-into", why: "SD-2 is working-class Toledo — $59K median income with 37% renters signals a constituency under constant cost pressure. Wage growth, workers' rights, and anti-poverty policy are the primary connective tissue between the incumbent and her diverse coalition of white, Black, and Hispanic working-class voters." },
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 37.1% renters in an urban district with moderate incomes, housing affordability is a daily stress. Legislative action on tenant protections, affordable housing development, and housing cost relief is the most direct way to demonstrate constituent value between elections." },
        { name: "Hispanic Community Engagement", tag: "lean-into", why: "At 7.2% Hispanic in a Toledo district, this is a community with growing political potential. Spanish-language outreach, voter registration drives, and culturally specific constituent services build the coalition depth that makes SD-2 a durable D seat regardless of the political environment." },
        { name: "Black Community GOTV", tag: "lean-into", why: "At 14.3% Black in a working-class Toledo district, the African American community is a core pillar of the SD-2 coalition. Year-round engagement — not just October GOTV — is what sustains the turnout floor that makes this seat reliable for every statewide Democrat." },
        { name: "Neglecting the Off-Year Constituent Service Rhythm", tag: "avoid", why: "SD-2's next election is 2028. Four years is a long time to let engagement lapse. An incumbent who disappears between election cycles will face an eroded coalition — lower turnout, less enthusiasm, and a longer runway to rebuild trust before the next cycle." }
      ],
      memoHeadline: "Safe D Toledo seat — working-class multiracial coalition requires year-round investment, not just election-cycle attention.",
      memoParagraphs: [
        "SD-2 is a solidly Democratic Lucas County seat that Paloma De La Fuente won uncontested in 2024. The district's multiracial working-class character — 75% white, 14% Black, 7% Hispanic at $59K median income — makes it a durable D hold when the coalition is actively maintained. The 2028 election cycle is distant enough that now is exactly the right time to invest in the grassroots infrastructure that makes the seat a reliable asset.",
        "Housing and wages are the issue frame that unifies all three major communities in SD-2. A working-class white voter, a Black family in a rental, and a Hispanic household stretching to cover rent all share the same economic squeeze. The incumbent who visibly fights for housing protections, wage growth, and anti-poverty policy builds cross-racial loyalty that is difficult for any Republican challenger to erode.",
        "The Hispanic community at 7.2% is the most underutilized growth variable in SD-2's coalition. Sustained Spanish-language constituent outreach, voter registration investment, and community presence in Toledo's Hispanic neighborhoods — particularly in the Lagrange Street corridor — builds the kind of deep loyalty that pays turnout dividends in every election cycle through 2030."
      ],
      memoBullets: [
        "Establish a regular constituent services calendar — monthly office hours in multiple neighborhoods, housing resource fairs, and direct engagement with renters facing displacement. The incumbent's legislative record means nothing if constituents don't feel it in their daily lives.",
        "Launch a sustained Hispanic voter registration and outreach program. At 7.2%, there is meaningful room to grow the coalition's size and engagement depth before 2028.",
        "Partner with Toledo's Black civic and faith organizations to maintain year-round GOTV infrastructure. Turnout in SD-2 sets the floor for every Democrat running in Lucas County and statewide."
      ]
    }
  },

  {
    id: "oh-sd-3",
    name: "Ohio Senate District 3",
    city: "Columbus",
    region: "Columbus East Side & Suburbs (Franklin County)",
    type: "state senate district",
    incumbentName: "Tina Maharath",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 3",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$81,582", sub: "" },
        { label: "College-Educated Adults",  value: "35.8%",  sub: "" },
        { label: "Median Age",               value: "37.6",   sub: "" },
        { label: "Renter Rate",              value: "33.0%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Tina Maharath (D) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 68.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 18.3, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  5.4, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  3.4, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Multiracial Coalition Maintenance", tag: "lean-into", why: "SD-3 is a genuinely diverse Franklin County seat — 68% white, 18% Black, 5% Hispanic, 3.4% Asian. Sustaining broad coalition engagement across all communities is the primary strategic task. No single community delivers a majority, which means the incumbent's job is to be the representative of the entire district, not just one constituency." },
        { name: "Housing Affordability & Development", tag: "lean-into", why: "At 33% renters and $82K income in a Columbus growth market, housing cost pressure affects both renters and first-time homebuyers. Columbus's rapid development has created affordability concerns up and down the income ladder, and an SD-3 senator who is visibly engaged on housing policy is speaking to a broad cross-section of the district." },
        { name: "Education Investment", tag: "lean-into", why: "At 35.8% college attainment, SD-3 has a substantial educated suburban and exurban population that is engaged on school funding, public university investment, and education quality. This is a strong base issue that motivates turnout among the professional and family-age voters who dominate eastern Franklin County." },
        { name: "Asian & Hispanic Community Engagement", tag: "careful", why: "With 3.4% Asian and 5.4% Hispanic, these communities are growing contributors to SD-3's coalition. Outreach must be genuine, culturally specific, and year-round. Columbus has a significant Vietnamese American community in parts of east Franklin County that should receive dedicated constituent attention." },
        { name: "Neglecting 2026 Prep in a Challenging Cycle", tag: "avoid", why: "SD-3 goes back on the ballot in 2026 — a midterm environment where statewide dynamics may be unfavorable. An uncontested 2022 win does not mean 2026 will be uncontested. Begin coalition-building and voter contact work now to ensure SD-3 is defended with strength." }
      ],
      memoHeadline: "Diverse Columbus D seat on the 2026 ballot — begin active coalition maintenance and 2026 prep now.",
      memoParagraphs: [
        "SD-3 is a diverse Franklin County Democratic seat that Tina Maharath won uncontested in 2022. The district's 68% white, 18% Black, 3.4% Asian, and 5.4% Hispanic composition makes it one of Ohio's more genuinely multiracial senate districts, and maintaining that broad coalition is the primary strategic challenge for the 2026 cycle.",
        "Housing is the unifying issue. Columbus is in the middle of a sustained growth and affordability crisis, and SD-3's mix of renters, first-time homebuyers, and established homeowners all have a stake in how development, zoning, and affordability policy evolve. An incumbent who is visibly fighting on housing has a base issue that resonates with virtually every demographic in the district.",
        "The Asian American community — particularly Vietnamese American households in parts of eastern Franklin County — is a constituency worth dedicated constituent service investment. At 3.4%, this community punches above its percentage in civic engagement and turnout when properly organized, and building that relationship before 2026 is a priority that pays compound dividends."
      ],
      memoBullets: [
        "Treat 2026 as a contested race now. Begin voter contact, constituent events, and coalition outreach immediately. An uncontested 2022 does not mean 2026 will be the same environment.",
        "Invest in culturally specific outreach to Asian American and Hispanic communities in the district. Columbus's Vietnamese American community and Hispanic neighborhoods in east Franklin County are underorganized D-leaning populations.",
        "Host quarterly constituent service events across the district's geographic breadth — covering both urban Columbus precincts and the suburban and exurban areas of eastern Franklin County."
      ]
    }
  },

  {
    id: "oh-sd-4",
    name: "Ohio Senate District 4",
    city: "Columbus",
    region: "Columbus Northwest Suburbs (Franklin County)",
    type: "state senate district",
    incumbentName: "Thomas Cooke",
    incumbentParty: "Democrat",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 4",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$80,991", sub: "" },
        { label: "College-Educated Adults",  value: "33.2%",  sub: "" },
        { label: "Median Age",               value: "37.1",   sub: "" },
        { label: "Renter Rate",              value: "30.7%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Thomas Cooke (D) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 76.8, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  8.8, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  6.9, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  4.3, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Education & School Funding", tag: "lean-into", why: "At 33% college attainment with a family-age median (37.1 years), SD-4's suburban Columbus population is deeply invested in school quality and public education funding. This is the highest-engagement base issue for the professional suburban households that anchor the district's Democratic coalition." },
        { name: "Housing Affordability & First-Time Homebuyers", tag: "lean-into", why: "Columbus's suburban growth market has made first-time homeownership increasingly difficult even for households earning $80K. Zoning reform, housing supply, and affordability policy speak directly to the young families who make up a significant share of SD-4 and who are frustrated by the gap between incomes and home prices." },
        { name: "Reproductive Rights", tag: "lean-into", why: "SD-4's suburban, college-educated composition — including the 4.3% Asian and significant professional-class population — makes reproductive rights a high-salience motivator. The 2023 Ohio constitutional amendment results showed suburban Columbus precincts voting strongly for reproductive freedom. This is a base-mobilization and coalition-expansion issue." },
        { name: "Asian & Hispanic Community Engagement", tag: "careful", why: "With 4.3% Asian and 6.9% Hispanic, SD-4 has growing minority communities that should receive genuine constituent attention. Columbus's Asian American population in the northwest suburbs is politically engaged and professionally organized — do not take this community for granted with performative outreach." },
        { name: "Complacency in an Uncontested Seat", tag: "avoid", why: "Suburban Columbus districts that have flipped D in recent cycles can flip back if the coalition is not actively maintained. 2028 is not that far away, and the investment made between now and then determines whether SD-4 is defended from strength or scrambles in a potentially difficult environment." }
      ],
      memoHeadline: "Suburban Columbus D hold — education, housing, and reproductive rights are the coalition glue for 2028.",
      memoParagraphs: [
        "SD-4 is a northwest Franklin County Democratic seat that Thomas Cooke won uncontested in 2024. At $81K median income, 33% college attainment, and 37 median age, this is a family-oriented suburban district where education quality, housing affordability, and reproductive rights are the issues that built — and must maintain — the Democratic coalition.",
        "The district's 4.3% Asian and 6.9% Hispanic populations represent growing communities in Columbus's northwest suburbs. These households are professionally ambitious, civically engaged when organized, and capable of deepening the D coalition's margin in 2028. Genuine outreach — not seasonal gestures — builds the loyalty that sustains coalition growth.",
        "The path to a strong 2028 performance runs through constituent services that are visible and tangible: school funding advocacy, housing affordability legislation, and a consistent presence in the district's communities. An SD-4 senator who is known and trusted in Hilliard, Worthington, and Dublin neighborhoods does not need to run scared in 2028."
      ],
      memoBullets: [
        "Host quarterly town halls in different parts of the district — rotate between Hilliard, Worthington, and other suburban communities to maintain geographic breadth of engagement.",
        "Build relationships with PTA networks, school board allies, and parent advocacy organizations. Education is the primary political motivator for the suburban families who anchor SD-4's coalition.",
        "Invest in Asian American community outreach in the northwest Columbus suburbs. This professionally engaged community is underorganized relative to its civic capacity."
      ]
    }
  },

  {
    id: "oh-sd-5",
    name: "Ohio Senate District 5",
    city: "Toledo",
    region: "Lima & West Central Ohio (Allen, Auglaize, Hardin, Shelby, Van Wert counties)",
    type: "state senate district",
    incumbentName: "Stephen A. Huffman",
    incumbentParty: "Republican",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 5",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$70,487", sub: "" },
        { label: "College-Educated Adults",  value: "23.3%",  sub: "" },
        { label: "Median Age",               value: "41.7",   sub: "" },
        { label: "Renter Rate",              value: "28.1%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Stephen A. Huffman (R) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 80.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 12.3, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  2.4, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  1.3, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Manufacturing & Industrial Job Recovery", tag: "lean-into", why: "West central Ohio — Lima, Wapakoneta, Sidney — has an industrial history in auto manufacturing and agricultural equipment. The loss of manufacturing jobs and the failure of Republican economic policy to replace them with comparable wages is an authentic grievance that a Democratic challenger can speak to directly." },
        { name: "Rural Healthcare & Hospital Access", tag: "lean-into", why: "At 41.7 median age with 12.3% Black population concentrated in Lima, healthcare access is a central concern. Lima Memorial and other regional hospitals have faced consolidation pressure. A challenger who makes healthcare access a campaign centerpiece can win crossover working-class votes." },
        { name: "Black Community in Lima", tag: "lean-into", why: "Lima's Black community at roughly 12% of the district is an underserved Democratic base that has received little investment from state-level Democrats. Voter registration, GOTV infrastructure, and constituent services in Lima's Black neighborhoods are the highest-ROI investment in SD-5." },
        { name: "Prescription Drug Costs", tag: "lean-into", why: "At 41.7 median age with modest college attainment, this is a district where out-of-pocket medication costs are a lived reality for many households. Prescription drug price reform — especially insulin and chronic disease medication — is a crossover issue with genuine traction in Republican-leaning working-class communities." },
        { name: "Cultural Wedge Issues", tag: "avoid", why: "SD-5's working-class white majority is susceptible to Republican cultural wedge tactics. A Democratic challenger who appears focused on urban or progressive cultural concerns loses credibility with persuadable voters before making any economic argument. Stay relentlessly on economic kitchen-table issues." }
      ],
      memoHeadline: "West central Ohio R seat with a 12% Black base in Lima — field a candidate, own healthcare and manufacturing, invest in Lima's Black community.",
      memoParagraphs: [
        "SD-5 covers Lima and five west central Ohio counties — a region defined by industrial decline, agricultural stability, and a significant Black community in Lima that has been largely ignored by state Democratic infrastructure. Stephen Huffman ran uncontested in 2022, which reflects a strategic abdication of a district that is more reachable than its partisan history suggests.",
        "Lima's Black community is the anchor of a viable Democratic coalition in SD-5. At roughly 12.3% of the district population and concentrated in Allen County, this is a community with civic infrastructure — churches, historically Black organizations, and community institutions — that can deliver organized turnout when the party shows up and invests. The first step is registering voters and making the Democratic Party visible in Lima year-round.",
        "A Democratic challenger's economic argument in SD-5 should be built around three verifiable failures: the loss of manufacturing jobs that paid middle-class wages, the deterioration of rural hospital access, and the cost of prescription drugs for working-class families who are one diagnosis away from financial crisis. These are not partisan talking points in SD-5 — they are lived experiences that the incumbent has not addressed."
      ],
      memoBullets: [
        "Open a visible Democratic presence in Lima. Office hours, community events, and regular engagement with Black civic organizations are the foundation of any viable SD-5 coalition.",
        "Recruit a candidate who is from the district — ideally someone with roots in Lima or one of the smaller industrial communities. Credibility is biographical in west central Ohio.",
        "Make healthcare access the flagship issue. Attend every public forum on hospital consolidation, pharmacy closures, and rural healthcare. Own the issue before the incumbent does."
      ]
    }
  },

  {
    id: "oh-sd-6",
    name: "Ohio Senate District 6",
    city: "Cincinnati",
    region: "Dayton Metro (Montgomery County & surrounding)",
    type: "state senate district",
    incumbentName: "Willis E. Blackshear Jr",
    incumbentParty: "Democrat",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 6",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$63,722", sub: "" },
        { label: "College-Educated Adults",  value: "33.8%",  sub: "" },
        { label: "Median Age",               value: "37.4",   sub: "" },
        { label: "Renter Rate",              value: "40.6%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Willis E. Blackshear Jr (D) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 70.4, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 18.9, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  4.6, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  2.5, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Affordable Housing & Anti-Displacement", tag: "lean-into", why: "At 40.6% renters and $64K median income in the Dayton market, housing cost burden is the defining daily stress for a significant share of SD-6 residents. Dayton has experienced housing price appreciation that has outpaced wage growth, making tenant protections, housing investment, and anti-displacement policy the highest-priority constituent service the incumbent can deliver." },
        { name: "Black Community Investment & GOTV", tag: "lean-into", why: "At 18.9% Black, the African American community is a core pillar of SD-6's Democratic coalition. Dayton has a rich Black civic tradition — churches, fraternal organizations, historically Black neighborhoods — and year-round investment in that infrastructure is what makes the seat reliable for every Democrat on the ballot in Montgomery County." },
        { name: "Wage Growth & Workers' Rights", tag: "lean-into", why: "A $64K median income in an urban district with significant renter population reflects a working-class economic reality. Legislative action on wage growth, workers' rights, and workforce investment programs speaks directly to the multi-racial working class that constitutes SD-6's core." },
        { name: "Public Safety Investment", tag: "careful", why: "Dayton has experienced public safety challenges that are real concerns across racial communities. Lead with community investment, mental health resources, and accountable policing structures rather than enforcement headcount. Avoid letting Republicans frame the incumbent as soft on crime in a district where safety is a legitimate constituent priority." },
        { name: "Neglecting Constituent Presence Between Cycles", tag: "avoid", why: "With the next election in 2028, there is a risk of organizational drift. SD-6's coalition requires sustained maintenance — constituent services, community presence, and active engagement with Black civic institutions — to remain durable. Four years without active engagement produces a cold-start GOTV problem in 2028." }
      ],
      memoHeadline: "Dayton D seat — 19% Black, 41% renters, next election 2028. Housing and constituency investment are the primary strategic tasks.",
      memoParagraphs: [
        "SD-6 covers the Dayton metro (Montgomery County) and represents one of Ohio's working-class urban Democratic seats. Willis Blackshear Jr. won uncontested in 2024, and the 2028 election is distant enough that now is exactly the right time to invest in the grassroots infrastructure that makes this seat reliably Democratic rather than something to scramble to defend.",
        "Housing is the unifying economic issue across SD-6's multiracial coalition. At 40.6% renters and $64K median income, the district's working-class households — white and Black alike — are experiencing the gap between wages and housing costs as a daily stress. The incumbent who is visibly fighting on tenant protections, anti-displacement, and affordable housing development builds the kind of cross-racial loyalty that is difficult to erode.",
        "The Black community at 18.9% is the most critical constituency for sustained investment. Dayton's Black civic infrastructure — including Antioch Baptist, Greater Allen AME, and the numerous Black fraternal and professional organizations in the city — is the organizing backbone of the SD-6 coalition. Year-round engagement with these institutions, not just pre-election mobilization, is what produces the turnout levels that matter."
      ],
      memoBullets: [
        "Partner with Dayton's Black faith and civic organizations to establish year-round GOTV infrastructure. Turnout in SD-6 is not just an SD-6 issue — it determines the floor for every Democrat running in Montgomery County.",
        "Host regular housing resource fairs and tenant rights workshops in the district's highest-renter neighborhoods. Make the incumbent's housing advocacy tangible and visible to residents experiencing cost pressure.",
        "Establish a constituent services presence in multiple Dayton neighborhoods — not just campaign-season drop-ins, but regular, scheduled office hours that build the familiarity and trust that produces high turnout in 2028."
      ]
    }
  },

  {
    id: "oh-sd-7",
    name: "Ohio Senate District 7",
    city: "Columbus",
    region: "Dublin & Columbus North Suburbs (Delaware/Franklin counties)",
    type: "state senate district",
    incumbentName: "David Dallas",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 7",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$104,554", sub: "" },
        { label: "College-Educated Adults",  value: "50.2%",   sub: "" },
        { label: "Median Age",               value: "39.7",    sub: "" },
        { label: "Renter Rate",              value: "25.2%",   sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "David Dallas (D) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 80.3, color: DEMO_COLORS[0] },
        { label: "Asian",                    pct:  5.9, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct:  7.4, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino",        pct:  3.7, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Reproductive Rights & Healthcare Freedom", tag: "lean-into", why: "At 50.2% college attainment and $104K median income, SD-7 is a high-information professional-class district. The 2023 reproductive rights amendment carried Columbus's north suburbs decisively. This is the top mobilization and coalition-expansion issue for the educated suburban households who anchor SD-7's Democratic majority." },
        { name: "Public Education Funding & School Quality", tag: "lean-into", why: "Dublin, Westerville, and northern Columbus suburbs have strong school traditions and a parent population that is deeply engaged in education quality, school funding equity, and public school investment. Education is the primary political identity issue for the family-age suburban voters who dominate SD-7." },
        { name: "Property Taxes & Housing Costs", tag: "lean-into", why: "At $104K median income and in one of Ohio's fastest-growing suburban markets, SD-7 voters — even high earners — are experiencing the squeeze between rising home values, property tax assessments, and the cost of staying in the community. Housing affordability at the ownership level is a relevant and underserved issue for this demographic." },
        { name: "Asian American Community Engagement", tag: "careful", why: "At 5.9% Asian in one of Ohio's wealthiest suburban districts, this is a professionally accomplished, civically engaged, and politically pivoting community. Columbus's Indian American and Chinese American communities in Dublin and Westerville are not monolithically D — they require genuine constituent attention and engagement on education, healthcare, and economic policy." },
        { name: "Complacency Heading into 2026", tag: "avoid", why: "SD-7 returns to the ballot in 2026, in a midterm environment where suburban motivation can fluctuate. A district that was uncontested in 2022 may face a better-funded Republican challenge in 2026 as the party recalibrates its suburban strategy. Begin opponent research and coalition maintenance immediately." }
      ],
      memoHeadline: "High-income, 50% college, Dublin-area D seat on the 2026 ballot — reproductive rights and education are the coalition anchors.",
      memoParagraphs: [
        "SD-7 is one of Ohio's wealthiest and most educated state senate districts, covering Dublin and northern Columbus suburbs in Delaware and Franklin counties. David Dallas won uncontested in 2022, but the 2026 cycle may present a genuine Republican challenge as the party recalibrates its strategy in high-education suburban districts. Begin active constituency engagement now.",
        "The coalition in SD-7 is primarily motivated by two issues: reproductive rights and education. The 2023 Ohio constitutional amendment results confirmed that educated suburban Columbus voters are strongly engaged on reproductive freedom — this is not a peripheral issue in SD-7 but a core mobilization tool. Similarly, the district's parent population is organized around school funding and education quality in ways that sustain political engagement across years.",
        "The Asian American community at 5.9% — concentrated in Dublin and Westerville, including a substantial Indian American and Chinese American professional population — deserves genuine constituent attention beyond campaign-season outreach. This community is sophisticated about policy, values constituent accessibility, and can be a meaningful coalition contributor when engaged with respect and substance."
      ],
      memoBullets: [
        "Host reproductive rights-focused constituent events in 2025 and 2026 to maintain the mobilization energy from the 2023 amendment campaign. This is the issue that drove suburban D gains and must be kept front of mind.",
        "Build relationships with Dublin and Westerville school board networks, PTA leadership, and parent advocacy organizations. Education policy is the sustained political identity issue for SD-7's suburban family voters.",
        "Conduct dedicated outreach to Dublin's Indian American and Chinese American communities. Host community dinners, attend cultural events, and demonstrate that the incumbent is a genuine constituent partner, not a seasonal visitor."
      ]
    }
  },

  {
    id: "oh-sd-8",
    name: "Ohio Senate District 8",
    city: "Cincinnati",
    region: "Cincinnati Eastern & Northern Suburbs (Hamilton County)",
    type: "state senate district",
    incumbentName: "Louis W. Blessing III",
    incumbentParty: "Republican",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 8",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$80,412", sub: "" },
        { label: "College-Educated Adults",  value: "37.1%",  sub: "" },
        { label: "Median Age",               value: "39.6",   sub: "" },
        { label: "Renter Rate",              value: "27.3%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Louis W. Blessing III (R) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 73.7, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 16.8, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  3.8, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  2.5, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Reproductive Rights", tag: "lean-into", why: "At 37.1% college attainment and $80K median income, SD-8's suburban Hamilton County demographics closely match the suburban Cincinnati precincts that voted for the 2023 reproductive rights amendment. A Democratic challenger who leads with reproductive freedom has a genuine mobilization tool in this district — the Republican incumbent's position is a liability with suburban women voters." },
        { name: "Black Community Mobilization in Hamilton County", tag: "lean-into", why: "At 16.8% Black, SD-8 has a more substantial African American community than its uncontested R status suggests. Democratic infrastructure in the district's Black neighborhoods — voter registration, constituent services, GOTV — is the highest-ROI investment for building a competitive coalition. This community has been organizationally neglected by Democrats at the state level." },
        { name: "Education & School Funding", tag: "lean-into", why: "With 37.1% college attainment and strong suburban family demographics, education funding and school quality are high-salience issues in SD-8. A challenger who makes the Republican majority's school funding record a central argument resonates with the parent-age households who dominate suburban Hamilton County." },
        { name: "Economic Competitiveness & Development", tag: "careful", why: "Cincinnati's suburban economy is growing but unevenly. A challenger can speak to economic development, infrastructure investment, and workforce training in ways that appeal across racial and income lines without triggering partisan reflexes in the district's white moderate majority." },
        { name: "Conceding the District Without a Candidate", tag: "avoid", why: "SD-8's demographics — 37% college, 17% Black, $80K income — are not as safe for Republicans as an uncontested result implies. The Republican candidate for this seat was unopposed in 2024, which means there is no established Democratic vote floor to build from. Filing a credible candidate in 2028 is the first step to making this seat competitive." }
      ],
      memoHeadline: "Cincinnati suburban R seat with 17% Black and 37% college — the demographics say this is not as safe as it looks. Field a strong D candidate in 2028.",
      memoParagraphs: [
        "SD-8 is a Hamilton County Republican seat that Louis Blessing III won uncontested in 2024. But the district's demographics — 37.1% college attainment, 16.8% Black, and $80K median income — suggest a suburban constituency more competitive than its uncontested status implies. The Democratic Party's failure to field a candidate in 2024 is a strategic oversight that 2028 should correct.",
        "The case for a competitive 2028 Democratic challenge rests on two pillars: reproductive rights mobilization among suburban women, and Black community GOTV in the district's African American neighborhoods. The 2023 Ohio reproductive rights amendment showed that suburban Cincinnati precincts with SD-8's demographic profile are persuadable on this issue. Pair that with serious investment in Black voter registration and turnout, and the competitive math begins to emerge.",
        "Building a Democratic presence in SD-8 before 2028 is essential. Without year-round constituent engagement, candidate recruitment, and grassroots organization in the district, a 2028 challenge is a cold start. Begin by identifying community leaders, investing in voter registration in Black neighborhoods, and building the local Democratic Party infrastructure that can actually contest the seat."
      ],
      memoBullets: [
        "Begin candidate recruitment now. SD-8 needs a challenger with name recognition in Hamilton County's suburban communities — ideally a local elected official, civic leader, or professional with existing community relationships.",
        "Invest in Black voter registration and community organization in SD-8's African American neighborhoods. The 16.8% Black population is a dormant coalition that has never had meaningful Democratic investment at the state senate level.",
        "Commission district-level polling to establish a baseline and test which issues — reproductive rights, education, housing — resonate most strongly with persuadable voters in this Hamilton County district."
      ]
    }
  },

  {
    id: "oh-sd-9",
    name: "Ohio Senate District 9",
    city: "Cincinnati",
    region: "Cincinnati Urban Core (Hamilton County)",
    type: "state senate district",
    incumbentName: "Catherine D. Ingram",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 9",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$55,528", sub: "" },
        { label: "College-Educated Adults",  value: "39.2%",  sub: "" },
        { label: "Median Age",               value: "33.8",   sub: "" },
        { label: "Renter Rate",              value: "55.5%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Catherine D. Ingram (D) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 52.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 36.6, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  5.2, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  2.5, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 55.5% renters and $56K median income, housing cost burden is the defining daily stress for the majority of SD-9 residents. Cincinnati's urban core has experienced sustained housing cost pressure, and the incumbent's record on tenant protections, housing investment, and anti-displacement policy is the primary tool for maintaining constituency engagement before 2026." },
        { name: "Black Community Turnout Infrastructure", tag: "lean-into", why: "At 36.6% Black in Cincinnati's urban core, the African American community is the anchor of SD-9's Democratic coalition. Year-round investment in Black civic institutions, churches, and community organizations — not just election-season GOTV — is what maintains the turnout floor that makes this seat a reliable Democratic asset and what matters for every statewide race in Hamilton County." },
        { name: "Economic Mobility & Workforce Access", tag: "lean-into", why: "At $56K median income with a young population (33.8 median age), economic mobility — job access, workforce training, wage growth — is a central aspiration for the working-class and younger households that make up much of SD-9. Concrete wins on economic opportunity legislation are the most relevant constituent service for this constituency." },
        { name: "Public Safety & Community Investment", tag: "careful", why: "Urban safety concerns are real in Cincinnati's core neighborhoods and cross racial lines. Lead with community investment, mental health resources, and accountable policing rather than enforcement rhetoric. Do not cede the safety issue to Republicans by appearing dismissive of residents' genuine concerns about neighborhood security." },
        { name: "Treating 2026 as a Given", tag: "avoid", why: "SD-9 returns to the ballot in 2026. In a potentially challenging midterm environment, a seat that was uncontested in 2022 could face a Republican challenge. Active constituent engagement, high-visibility housing and economic wins, and maintained GOTV infrastructure are the insurance against any 2026 surprise." }
      ],
      memoHeadline: "Cincinnati urban core, 37% Black, 56% renters — housing and Black community GOTV are the twin strategic imperatives heading into 2026.",
      memoParagraphs: [
        "SD-9 is Cincinnati's urban core Democratic seat, represented by Catherine Ingram who ran uncontested in 2022. At 55.5% renters, 36.6% Black, and $56K median income, this is a working-class multiracial urban district where housing affordability and economic mobility are daily concerns. The 2026 ballot cycle means active strategic investment should begin immediately.",
        "Housing is the issue that unifies SD-9's diverse constituencies. Whether a Black family in Avondale, a white household in Lower Price Hill, or a young professional in Over-the-Rhine, renters across the district are experiencing the same cost pressure and the same sense that the housing market is working against them. An incumbent who is visibly and legislatively engaged on tenant protections, anti-displacement, and affordable housing development maintains the cross-racial trust that makes SD-9's coalition durable.",
        "Black community turnout in Hamilton County's urban core is a bellwether for every Democratic candidate on the ballot. Cincinnati's African American community — with its deep institutional infrastructure in the West End, Avondale, Walnut Hills, and Bond Hill — is the organizational backbone of SW Ohio Democratic politics. Year-round investment in that infrastructure, through the incumbent's constituent presence and civic partnerships, is not just an SD-9 priority but a regional one."
      ],
      memoBullets: [
        "Hold quarterly renter resource events — tenant rights workshops, housing assistance referrals, and anti-displacement clinics in the highest-renter neighborhoods. Make housing advocacy visible and practical.",
        "Establish year-round partnerships with Cincinnati's Black faith community, civic organizations, and historically Black institutions. GOTV should be the harvest of sustained relationships, not a cold-call operation in October 2026.",
        "Invest in constituent outreach to the district's younger population (33.8 median age is young). Younger renters are high-propensity D voters when mobilized and a critical component of the 2026 turnout target."
      ]
    }
  },

  {
    id: "oh-sd-10",
    name: "Ohio Senate District 10",
    city: "Columbus",
    region: "Springfield & West Central Ohio (Clark, Champaign, Logan, Madison counties)",
    type: "state senate district",
    incumbentName: "Kyle Koehler",
    incumbentParty: "Republican",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 10",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$72,237", sub: "" },
        { label: "College-Educated Adults",  value: "29.7%",  sub: "" },
        { label: "Median Age",               value: "39.9",   sub: "" },
        { label: "Renter Rate",              value: "31.4%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Kyle Koehler (R) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 84.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  6.3, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  3.4, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  1.7, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Manufacturing & Industrial Job Recovery", tag: "lean-into", why: "Springfield, Urbana, and West Liberty have deep manufacturing histories. The Haitian immigration controversy in Springfield — which became a national flash point — exposed the anxieties of a working-class white community experiencing economic dislocation. A Democratic challenger can speak authentically to the economic causes of that anxiety without endorsing the scapegoating." },
        { name: "Healthcare Access & Hospital Stability", tag: "lean-into", why: "West central Ohio's smaller cities and rural communities face ongoing healthcare access challenges — clinic closures, primary care shortages, high prescription costs. A challenger who makes healthcare a central campaign issue has genuine crossover traction with working-class households across racial lines." },
        { name: "Prescription Drug Costs", tag: "lean-into", why: "At 39.9 median age in a district with modest college attainment, out-of-pocket medication costs are a lived reality. Insulin pricing, chronic disease medication, and pharmacy access in rural communities are issues with documented crossover appeal in Republican-leaning working-class Ohio." },
        { name: "Immigration Rhetoric", tag: "avoid", why: "Springfield's Haitian immigrant community became a national political target in 2024. A Democratic challenger who either dismisses local community concerns or engages in anti-immigrant messaging loses credibility on both sides. The frame is economic investment, not immigration policy — focus on what the community needs, not who moved in." },
        { name: "Cultural Signaling Toward Urban Progressive Issues", tag: "avoid", why: "SD-10's 84% white working-class base is highly reactive to signals they associate with urban Democratic politics. A challenger who appears culturally aligned with Columbus or Cincinnati progressive circles will be disqualified before making any economic argument. Ground the campaign entirely in west central Ohio's specific economic and community concerns." }
      ],
      memoHeadline: "Springfield-area R seat — field a D candidate with local roots and an economic populist frame that speaks to manufacturing loss and healthcare access.",
      memoParagraphs: [
        "SD-10 covers Springfield and four west central Ohio counties — a region that became a national political flashpoint in 2024 over Springfield's Haitian immigrant community. The underlying story is economic displacement and community anxiety in a post-industrial city, and that is the authentic terrain for a Democratic challenge in 2028. Kyle Koehler ran uncontested in 2024, continuing the pattern of Democratic organizational absence from this district.",
        "The economic argument is real and available. Springfield, Urbana, and the smaller communities of Logan, Champaign, and Madison counties have experienced the hollowing-out of manufacturing that characterized the Rust Belt — job losses that Republican trade and tax policy accelerated while promising reversal. A Democratic challenger who can speak to that economic history without cultural alienation has a genuine argument in SD-10.",
        "The 6.3% Black community in Springfield is an underserved Democratic base with civic infrastructure — churches, historically Black organizations — that has received almost no investment from state Democratic politics. Voter registration and GOTV in Springfield's Black neighborhoods, combined with an economic populist message for the broader working-class community, creates the foundation of a viable 2028 coalition."
      ],
      memoBullets: [
        "Recruit a candidate with deep Springfield or Clark County roots — someone who is known in the community and can speak to economic loss with personal authenticity rather than policy abstraction.",
        "Invest in Black voter registration and community engagement in Springfield. This is the highest-ROI demographic investment in SD-10 and the anchor of any viable Democratic coalition.",
        "Focus the economic argument on three specific local failures: manufacturing jobs lost, hospital or clinic closures, and prescription drug costs. Avoid national Democratic framing and stay hyper-local."
      ]
    }
  },

  {
    id: "oh-sd-11",
    name: "Ohio Senate District 11",
    city: "Cleveland",
    region: "Lorain County & Western Cleveland Suburbs",
    type: "state senate district",
    incumbentName: "Tony Dia",
    incumbentParty: "Republican",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 11",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$69,437", sub: "" },
        { label: "College-Educated Adults",  value: "31.9%",  sub: "" },
        { label: "Median Age",               value: "39.7",   sub: "" },
        { label: "Renter Rate",              value: "33.7%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Tony Dia (R) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 76.9, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 12.8, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  6.8, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  1.9, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Black & Hispanic Community Mobilization", tag: "lean-into", why: "At 12.8% Black and 6.8% Hispanic in Lorain County — including Lorain city's substantial Puerto Rican and Black communities — SD-11 has dormant Democratic base communities that have received minimal state-level investment. Voter registration, constituent services, and GOTV in Lorain's minority communities are the highest-ROI investment in building a competitive 2026 coalition." },
        { name: "Manufacturing & Port Economy", tag: "lean-into", why: "Lorain has a steel and manufacturing history — US Steel's Lorain Works, now Cleveland-Cliffs, remains a major employer. A Democratic challenger can speak authentically to the working-class industrial community in Lorain and Elyria with an economic populism frame that addresses both the industrial legacy and the need for diversified job growth." },
        { name: "Reproductive Rights in Suburban Lorain County", tag: "lean-into", why: "At 31.9% college attainment, the suburban portions of SD-11 — Avon, North Ridgeville, Avon Lake — are the kind of educated suburban communities where reproductive rights resonated in the 2023 amendment vote. A Democratic challenger who leads with reproductive freedom activates the suburban coalition that makes this seat competitive." },
        { name: "Puerto Rican Community Investment in Lorain", tag: "lean-into", why: "Lorain's Puerto Rican community is one of the most politically organized Latino communities in Ohio. This community has been electing Democrats at the city level for decades and is an underutilized state-level resource. A state senate challenger who is genuinely embedded in Lorain's Puerto Rican community starts with a built-in organizational advantage." },
        { name: "Treating This as a Safe R Seat", tag: "avoid", why: "SD-11's demographics — 13% Black, 7% Hispanic, 32% college, $69K income — are not safely Republican. Tony Dia was unopposed in 2022, which means there is no established D vote share to measure from. But the underlying demographics support a competitive race in the right environment with the right candidate." }
      ],
      memoHeadline: "Lorain County R seat with 13% Black, 7% Hispanic, and Lorain's Puerto Rican community — this seat is more competitive than its uncontested history suggests. Field a strong D candidate in 2026.",
      memoParagraphs: [
        "SD-11 covers Lorain County and its mix of industrial cities (Lorain, Elyria) and growing western Cleveland suburbs (Avon, North Ridgeville, Avon Lake). Tony Dia won uncontested in 2022, but the district's demographics make it one of the more reachable R-held senate seats in Ohio. The key is building a multiracial coalition that combines Lorain's minority communities with suburban reproductive rights voters.",
        "Lorain's Puerto Rican community is one of Ohio's most politically organized Latino constituencies. With deep roots in the city's Catholic parishes and civic organizations, this community has the institutional infrastructure to deliver organized turnout — if a Democratic candidate makes them the center of the campaign's organizational strategy rather than an afterthought. Pair that with Black community voter registration in Lorain and Elyria, and the Democratic base begins to take shape.",
        "The suburban piece of the coalition — educated, family-age households in Avon, Avon Lake, and North Ridgeville — is movable on reproductive rights and education. The 2023 amendment results showed that suburban Lorain County is not monolithically Republican on cultural issues. A challenger who activates both the urban base and the suburban persuadables has a genuinely competitive path in a district that Republicans have not had to defend."
      ],
      memoBullets: [
        "Recruit a candidate with authentic roots in Lorain — ideally someone embedded in either the Puerto Rican community, the steel/manufacturing worker community, or the Elyria civic network. Credibility in Lorain is essential for building the urban coalition.",
        "Launch an immediate voter registration and community organizing campaign in Lorain's Puerto Rican and Black neighborhoods. Begin by partnering with existing community organizations — the Spanish-American Committee, Black civic organizations, and union halls.",
        "Commission polling in the suburban Avon/North Ridgeville portion of the district to test the reproductive rights and education frames with the persuadable suburban electorate."
      ]
    }
  },

  {
    id: "oh-sd-12",
    name: "Ohio Senate District 12",
    city: "Akron",
    region: "Wayne, Medina & Holmes Counties (NE Ohio rural/small town)",
    type: "state senate district",
    incumbentName: "Susan Manchester",
    incumbentParty: "Republican",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 12",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$70,111", sub: "" },
        { label: "College-Educated Adults",  value: "19.8%",  sub: "" },
        { label: "Median Age",               value: "40.3",   sub: "" },
        { label: "Renter Rate",              value: "27.0%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Susan Manchester (R) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 90.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  4.1, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  2.4, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  0.6, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Rural Healthcare & Hospital Access", tag: "lean-into", why: "Wayne, Medina, and Holmes counties are rural communities where hospital consolidations and clinic closures are concrete threats. A Democratic challenger who makes healthcare access the primary issue — naming specific local facilities at risk — speaks to a genuine working-class concern that crosses partisan lines in rural Ohio." },
        { name: "Amish & Agricultural Community Economic Concerns", tag: "lean-into", why: "Holmes County is home to one of the world's largest Amish communities, and Wayne County has deep agricultural roots. Farm income stability, rural infrastructure, and agricultural policy are economic backbone of the district. A challenger who speaks respectfully to agricultural communities earns credibility that advertising cannot replace." },
        { name: "Prescription Drug Costs & Aging Population", tag: "lean-into", why: "At 40.3 median age with low college attainment, SD-12 has a working-class older population that experiences prescription drug costs as a direct financial burden. Medication costs for chronic disease management are monthly budget line items for a significant share of SD-12 households." },
        { name: "Urban Cultural Signaling", tag: "avoid", why: "SD-12 at 90% white and 19.8% college is one of Ohio's most culturally conservative districts. Any signal that a Democratic challenger is aligned with urban or progressive cultural politics ends the conversation with persuadable voters before it begins." },
        { name: "Ignoring the District Entirely", tag: "avoid", why: "Leaving SD-12 uncontested in 2028 repeats the pattern of organizational abandonment that made this seat uncompetitive in the first place. Filing a candidate builds the voter file, earns media, and begins the multi-cycle work of making the district visible." }
      ],
      memoHeadline: "Deep-R rural NE Ohio — the only viable frame is economic populism on healthcare and farm income. Build presence, don't expect a win in 2028.",
      memoParagraphs: [
        "SD-12 is among Ohio's most Republican state senate districts — 90% white, 19.8% college, $70K income in Wayne, Medina, and Holmes counties. Susan Manchester won uncontested in 2024. A Democratic challenger in 2028 should expect to lose but has an obligation to try, because continuous absence makes the district permanently uncompetitive.",
        "The most authentic Democratic argument in SD-12 is economic populism rooted in specific local concerns: the cost of healthcare in communities without major hospital systems, the stability of farm income in agricultural economies, and prescription drug costs that hit working-class families. These are not partisan issues in rural Ohio — they are community survival issues.",
        "The Amish and agricultural communities in Holmes and Wayne counties respond to respect and authentic engagement on the issues that matter to them. A Democratic candidate who attends farm bureau meetings and demonstrates genuine interest in agricultural policy earns a hearing that advertising cannot buy."
      ],
      memoBullets: [
        "File a candidate who is genuinely from the district — a rural doctor, agricultural worker, or small-town business owner with real community ties.",
        "Center the campaign on three specific and local issues: rural healthcare access, farm income stability, and prescription drug costs. Do not mention national Democratic priorities.",
        "Treat 2028 as cycle one of a multi-cycle investment. Measure success by voter file growth, community relationships built, and local name recognition — not vote percentage."
      ]
    }
  },

  {
    id: "oh-sd-13",
    name: "Ohio Senate District 13",
    city: "Toledo",
    region: "Toledo Suburbs (Wood & Lucas Counties)",
    type: "state senate district",
    incumbentName: "Anthony Eliopoulos",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 13",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$70,738", sub: "" },
        { label: "College-Educated Adults",  value: "27.6%",  sub: "" },
        { label: "Median Age",               value: "42.4",   sub: "" },
        { label: "Renter Rate",              value: "26.1%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Anthony Eliopoulos (D) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 81.2, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino",        pct: 10.1, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct:  6.6, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  1.2, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Hispanic Community Outreach & Voter Registration", tag: "lean-into", why: "At 10.1% Hispanic — a notably high share for a Toledo suburban district — SD-13 has a significant Latino community that represents the highest-growth opportunity in the district's coalition. Spanish-language outreach, voter registration, and culturally specific constituent services are both principled and politically essential heading into 2026." },
        { name: "Manufacturing & Industrial Worker Issues", tag: "lean-into", why: "Wood County's economy includes automotive supply chain employers and industrial manufacturing. A Democratic incumbent who is visibly engaged on trade, manufacturing jobs, and workers' rights speaks to the working-class backbone of the Toledo suburban coalition." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "At 42.4 median age, SD-13 has an aging working-class population with real concerns about healthcare costs, hospital access, and prescription drug pricing. Legislative wins on these issues are the most tangible constituent service for the district's core demographic." },
        { name: "Black Community Engagement", tag: "careful", why: "The 6.6% Black community in SD-13 should receive genuine year-round engagement rather than election-season mobilization. Community organizations, church partnerships, and constituent services in Black neighborhoods build the loyalty that sustains turnout." },
        { name: "Assuming 2026 Will Be Uncontested", tag: "avoid", why: "SD-13 goes back on the ballot in 2026 in a potentially challenging environment. The district's 81% white working-class base is persuadable in either direction. Begin constituent engagement now and do not allow an organizational vacuum that a Republican challenger can fill." }
      ],
      memoHeadline: "Toledo suburban D seat — 10% Hispanic is the standout coalition opportunity. Invest in Spanish-language outreach and prepare actively for 2026.",
      memoParagraphs: [
        "SD-13 covers the Toledo suburbs in Wood and Lucas counties, with a distinctly working-class and aging character — 42.4 median age, 27.6% college, $71K income. Anthony Eliopoulos won uncontested in 2022, but the 2026 ballot cycle means active preparation should begin now. The district's most important strategic asset is its 10.1% Hispanic population — one of the highest in the Toledo area.",
        "Hispanic outreach in SD-13 should be treated as a strategic priority. Spanish-language constituent communication, voter registration drives in Hispanic neighborhoods of Bowling Green and Toledo's western suburbs, and culturally specific community events build the kind of loyalty that sustains turnout across cycles. At 10% Hispanic in a district where the incumbent was uncontested, the growth potential is significant.",
        "The working-class white majority in SD-13 is the incumbent's base but not a guaranteed one. Voters respond to constituent presence, economic tangibility, and the sense that their representative is fighting for them on manufacturing jobs and healthcare costs. An incumbent who is visible and accessible in Bowling Green and Perrysburg maintains coalition trust that makes 2026 a defense from strength."
      ],
      memoBullets: [
        "Launch a dedicated Spanish-language outreach program targeting SD-13's 10.1% Hispanic community in Wood and Lucas counties. Begin voter registration immediately.",
        "Host quarterly constituent events in different parts of the district — Bowling Green, Perrysburg, Maumee — to maintain geographic presence.",
        "Develop a visible legislative agenda on manufacturing, healthcare, and prescription drugs that produces concrete and communicable wins before 2026."
      ]
    }
  },

  {
    id: "oh-sd-14",
    name: "Ohio Senate District 14",
    city: "Columbus",
    region: "Scioto Valley & Appalachian SE Ohio",
    type: "state senate district",
    incumbentName: "Terry A. Johnson",
    incumbentParty: "Republican",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 14",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$71,355", sub: "" },
        { label: "College-Educated Adults",  value: "25.4%",  sub: "" },
        { label: "Median Age",               value: "41.0",   sub: "" },
        { label: "Renter Rate",              value: "27.3%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Terry A. Johnson (R) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 93.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  1.5, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  2.0, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  0.8, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Opioid Epidemic & Addiction Recovery", tag: "lean-into", why: "Scioto County and surrounding Appalachian counties have been among the most severely affected by the opioid epidemic in the United States. A Democratic challenger who makes recovery services and treatment access the centerpiece speaks to a wound that is still raw and personal in nearly every family in SD-14." },
        { name: "Rural Healthcare Access", tag: "lean-into", why: "Southern Ohio's Appalachian counties have some of the worst healthcare access in the state — hospital closures, primary care deserts, and mental health service gaps. A challenger who shows up to community forums on hospital closures with a concrete legislative agenda earns credibility across party lines." },
        { name: "Economic Despair & Job Creation", tag: "lean-into", why: "SD-14 represents some of Ohio's poorest communities. A genuine economic development agenda that addresses the lack of quality jobs in rural SE Ohio, without the cultural alienation of urban Democratic politics, is the only credible Democratic frame in this district." },
        { name: "Gun Policy", tag: "avoid", why: "In a 93% white Appalachian rural district where hunting and gun ownership are deeply embedded cultural practices, gun policy debates are non-starters. The frame must be economic and healthcare — never cultural." },
        { name: "National Democratic Branding", tag: "avoid", why: "SD-14 is deep-R Appalachian Ohio. A challenger who runs as a national Democratic standard-bearer will lose badly. The framing must be intensely local — specific to the Scioto Valley, specific to the opioid crisis." }
      ],
      memoHeadline: "Appalachian SE Ohio — opioid recovery and rural healthcare are the only authentic Democratic frames. Long-term investment, not a 2028 win expectation.",
      memoParagraphs: [
        "SD-14 is Appalachian southeastern Ohio — Scioto, Pike, Lawrence, Jackson, Gallia, and Vinton counties. This is among Ohio's most Republican and most economically distressed territory. Terry Johnson ran uncontested in 2024. A Democratic challenger in 2028 should expect to lose but has an obligation to try, and the organizational work of contested elections is the foundation of any long-term recovery.",
        "The opioid epidemic is the defining political and human reality of SD-14. Scioto County was once called the 'pill mill capital of the United States.' Every family in this district has been touched by addiction or overdose. A Democratic candidate who shows up in Portsmouth with a recovery services agenda, who meets with addiction counselors and recovery community organizations, does something no Republican incumbent has done in years.",
        "Rural healthcare access is the second pillar. A challenger who is present at hospital board meetings, public health forums, and community health events earns the kind of credibility that advertising cannot buy."
      ],
      memoBullets: [
        "Recruit a candidate from the district — ideally someone in healthcare, addiction recovery, or public health who is embedded in the Scioto Valley community.",
        "Make opioid recovery and addiction services the flagship campaign issue. Partner with recovery community organizations, harm reduction groups, and faith communities doing recovery work in the district.",
        "Measure 2028 success by organizational metrics — voter file growth, community relationships established — not vote percentage. The goal is planting seeds for 2032 and beyond."
      ]
    }
  },

  {
    id: "oh-sd-15",
    name: "Ohio Senate District 15",
    city: "Columbus",
    region: "Columbus South & Diverse Urban Core (Franklin County)",
    type: "state senate district",
    incumbentName: "Hearcel F. Craig",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 15",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$60,162", sub: "" },
        { label: "College-Educated Adults",  value: "30.0%",  sub: "" },
        { label: "Median Age",               value: "34.5",   sub: "" },
        { label: "Renter Rate",              value: "53.8%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Hearcel F. Craig (D) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 48.6, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 35.0, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  9.2, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  2.9, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 53.8% renters and $60K median income in Columbus's diverse south side, housing cost burden is the defining daily concern for the majority of SD-15 residents. Tenant protections, affordable housing development, and anti-displacement policy are the incumbent's most visible tools for demonstrating constituent value before the 2026 election." },
        { name: "Black Community GOTV & Constituent Investment", tag: "lean-into", why: "At 35% Black, the African American community is the core of SD-15's Democratic coalition. Year-round investment in Black civic infrastructure — faith communities, historically Black organizations, community events — sustains the turnout floor that makes this seat a reliable Democratic asset in Franklin County." },
        { name: "Hispanic Community Engagement", tag: "lean-into", why: "At 9.2% Hispanic in Columbus's south side, the Latino community represents one of the highest-growth coalition opportunities in SD-15. Spanish-language outreach, voter registration, and culturally specific constituent services in Columbus's Hispanic neighborhoods build coalition depth that pays dividends in every cycle." },
        { name: "Young Voter Turnout", tag: "lean-into", why: "At 34.5 median age, SD-15 is one of Columbus's younger state senate districts. Young renters — particularly young Black and Hispanic residents — are high-propensity D voters when mobilized and require active engagement." },
        { name: "Organizational Complacency Between Cycles", tag: "avoid", why: "SD-15 goes back on the ballot in 2026. Active constituent engagement, housing advocacy wins, and maintained GOTV infrastructure are the insurance against any 2026 challenge — and the investment that makes SD-15 a force multiplier for the broader Franklin County coalition." }
      ],
      memoHeadline: "Columbus diverse south side — 35% Black, 9% Hispanic, 54% renters. Housing, Black GOTV, and Hispanic coalition growth are the three strategic priorities for 2026.",
      memoParagraphs: [
        "SD-15 is Columbus's diverse south side — a Franklin County district that is nearly evenly split between white (49%), Black (35%), and Hispanic (9%) communities at a young median age of 34.5. Hearcel Craig won uncontested in 2022, but the 2026 cycle should be treated as a genuine defense. At 53.8% renters and $60K income, housing affordability is the unifying political issue.",
        "Housing strategy should be the incumbent's primary public profile between now and 2026. In a district where more than half of residents rent and where Columbus's housing market has consistently outpaced wage growth, every legislative action on tenant protections, affordable housing funding, and anti-displacement policy is a direct investment in constituency trust.",
        "The Hispanic community at 9.2% is the most underutilized growth variable in SD-15. Columbus's south side has a substantial and growing Latino population that is civically engaged when organized. Spanish-language constituent communication, voter registration drives, and genuine presence in south side Hispanic neighborhoods before 2026 are essential."
      ],
      memoBullets: [
        "Host quarterly renter resource events — tenant rights clinics, housing assistance fairs, anti-displacement workshops — in the district's highest-renter neighborhoods.",
        "Launch a sustained Spanish-language outreach program targeting Columbus's south side Hispanic communities. Partner with Hispanic civic organizations, churches, and community centers to register voters.",
        "Invest in youth voter engagement — social media, community events, and policy communication on housing and economic opportunity that speaks directly to SD-15's young adult population."
      ]
    }
  },

  {
    id: "oh-sd-16",
    name: "Ohio Senate District 16",
    city: "Columbus",
    region: "Upper Arlington & Columbus Northwest Suburbs (Franklin County)",
    type: "state senate district",
    incumbentName: "Beth Liston",
    incumbentParty: "Democrat",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 16",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$90,930", sub: "" },
        { label: "College-Educated Adults",  value: "49.2%",  sub: "" },
        { label: "Median Age",               value: "37.7",   sub: "" },
        { label: "Renter Rate",              value: "39.2%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Beth Liston (D) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 77.9, color: DEMO_COLORS[0] },
        { label: "Asian",                    pct:  7.6, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct:  6.4, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino",        pct:  4.9, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Reproductive Rights & Healthcare Freedom", tag: "lean-into", why: "At 49.2% college attainment and $91K median income, SD-16 is one of Ohio's most educated districts. Upper Arlington and Columbus's northwest suburbs voted overwhelmingly for the 2023 reproductive rights amendment. This is the top mobilization issue for 2028." },
        { name: "Public Education Funding & School Quality", tag: "lean-into", why: "Dublin, Hilliard, and the northwest Columbus suburban communities have strong school traditions and a parent population deeply invested in education quality and funding. Education is the primary political identity issue for the family-age suburban voters who dominate SD-16." },
        { name: "Asian American Community Engagement", tag: "lean-into", why: "At 7.6% Asian — the highest Asian share of any Columbus-area senate district — SD-16 has a professionally accomplished Asian American population. This community is politically engaged and capable of being a meaningful coalition contributor when engaged with substance and consistency." },
        { name: "Housing Costs & First-Time Homebuyers", tag: "careful", why: "At 39.2% renters and $91K income in a Columbus growth market, even high-earning residents in SD-16 feel the squeeze of housing costs. This is relevant for younger households who cannot afford to buy in Upper Arlington's housing market." },
        { name: "Assuming 2028 Is Safe Without Active Engagement", tag: "avoid", why: "High-education suburban districts can be competitive when Republicans field credible candidates. The incumbent's role in 2025-2027 is to be so visible, accessible, and effective that any 2028 challenge faces a wall of community relationships and legislative achievements." }
      ],
      memoHeadline: "Upper Arlington high-education D seat — reproductive rights, education, and Asian American engagement are the coalition priorities for 2028.",
      memoParagraphs: [
        "SD-16 is one of Ohio's most educated and high-income state senate districts, covering Upper Arlington and Columbus's northwest suburbs. Beth Liston won uncontested in 2024, and the district's demographics — 49% college, $91K income — make it a natural Democratic stronghold in the post-2016 suburban realignment. The strategic task is not maintaining the coalition but deepening it.",
        "The Asian American community at 7.6% is the most distinctive strategic opportunity in SD-16. Ohio's most Asian-concentrated state senate district has a community that is politically sophisticated and highly engaged when approached with substance. The incumbent who builds genuine constituent relationships with this community builds loyalty that outlasts any individual election cycle.",
        "Reproductive rights and education are the coalition anchors for 2028. The 2023 amendment results confirmed that SD-16 voters are strongly engaged on reproductive freedom, and the district's deep investment in public school quality means education funding is a perpetually relevant issue."
      ],
      memoBullets: [
        "Build dedicated constituent relationships with Upper Arlington's Asian American community — attend Diwali and Lunar New Year events, host community dinners, and maintain genuine year-round communication.",
        "Become the most vocal champion in the Ohio Senate for Columbus-area public school funding. Make education the defining legislative identity of the SD-16 seat.",
        "Develop a visible 2028 campaign infrastructure by 2027 — name recognition events, constituent outreach in every neighborhood, and a fundraising base that signals electoral seriousness."
      ]
    }
  },

  {
    id: "oh-sd-17",
    name: "Ohio Senate District 17",
    city: "Columbus",
    region: "Appalachian SE Ohio (Athens, Hocking, Meigs, Morgan, Perry counties)",
    type: "state senate district",
    incumbentName: "Garry Boone",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 17",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$57,644", sub: "" },
        { label: "College-Educated Adults",  value: "16.2%",  sub: "" },
        { label: "Median Age",               value: "41.3",   sub: "" },
        { label: "Renter Rate",              value: "28.2%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Garry Boone (D) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 93.2, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  2.3, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  1.2, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  0.4, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Higher Education & Ohio University", tag: "lean-into", why: "Athens County is home to Ohio University, the largest employer and economic engine in the district. An SD-17 Democratic incumbent who is the legislature's strongest advocate for Ohio University's budget, in-state tuition affordability, and the university's role in regional economic development builds a relationship with the Athens community that is nearly impossible to defeat." },
        { name: "Appalachian Economic Investment & Rural Broadband", tag: "lean-into", why: "At $58K median income in one of Ohio's most economically distressed regions, tangible investment in Appalachian economic development — job creation, broadband infrastructure, workforce training — is the most meaningful constituent service the incumbent can deliver." },
        { name: "Healthcare & Addiction Recovery Services", tag: "lean-into", why: "SE Ohio's Appalachian counties have been among the most severely affected by the opioid epidemic. Recovery services, mental health resources, and rural hospital access are urgent community concerns that cut across partisan identity." },
        { name: "Cultural Wedge Issues", tag: "avoid", why: "SD-17 is 93% white and working-class Appalachian outside of Athens County. A Democratic incumbent who campaigns on national progressive cultural issues in these communities accelerates the party's rural loss — and potentially loses their uncontested status in 2026." },
        { name: "Taking Athens County Turnout for Granted", tag: "avoid", why: "Athens County is the turnout engine that makes SD-17 Democratic. If Ohio University students, faculty, and staff are not mobilized and engaged with their state senator's work, the Athens County margin narrows and the district becomes competitive." }
      ],
      memoHeadline: "Anomalous D seat in Appalachian Ohio — Ohio University is the coalition anchor. Defend it with economic and educational investment, not cultural messaging.",
      memoParagraphs: [
        "SD-17 is an unusual Democratic senate seat — a 93% white, Appalachian Ohio district where the Democratic coalition rests almost entirely on Athens County and the Ohio University community. Garry Boone won uncontested in 2022, but the 2026 cycle should be treated with caution. The surrounding counties of Hocking, Meigs, Morgan, and Perry have shifted strongly Republican, and the district's Democratic viability depends on Athens County delivering a large enough margin.",
        "Ohio University is the key to everything in SD-17. The university community — students, faculty, staff, and the Athens economy that depends on it — is the organizational and turnout foundation of the Democratic coalition. The incumbent who is the legislature's most visible advocate for Ohio University enters 2026 with the strongest possible electoral position.",
        "In the rural communities outside Athens County, the only viable Democratic frame is economic and community-centered: addiction recovery services, rural hospital access, broadband investment, and agricultural support. Cultural signaling of any kind in Perry or Meigs counties accelerates the party's already significant rural losses."
      ],
      memoBullets: [
        "Host a major annual Ohio University legislative advocacy event — students and faculty meet the senator, priorities are publicly stated, and wins are publicly celebrated. Make Ohio University the centerpiece of the SD-17 Democratic political identity.",
        "Commission a constituent services audit of the rural counties in the district — what are the most urgent unmet needs in Hocking, Meigs, and Morgan counties? Concrete, local, and visible services are the only currency that matters in Appalachian rural communities.",
        "Prepare for a contested 2026 race. Begin voter registration in Athens County, engage the OU student electorate, and build the precinct-level infrastructure to defend the Athens margin."
      ]
    }
  },

  {
    id: "oh-sd-18",
    name: "Ohio Senate District 18",
    city: "Cleveland",
    region: "Lake County & Eastern Cleveland Suburbs",
    type: "state senate district",
    incumbentName: "Jerry Cirino",
    incumbentParty: "Republican",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 18",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$79,963", sub: "" },
        { label: "College-Educated Adults",  value: "36.4%",  sub: "" },
        { label: "Median Age",               value: "44.4",   sub: "" },
        { label: "Renter Rate",              value: "27.0%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Jerry Cirino (R) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 77.7, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 12.4, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  4.5, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  2.9, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Reproductive Rights", tag: "lean-into", why: "At 36.4% college attainment and $80K income, SD-18 has the suburban Lake County demographic profile that voted for the 2023 reproductive rights amendment. Mentor, Painesville, and Willoughby are communities where educated suburban households are persuadable on reproductive freedom." },
        { name: "Black Community Mobilization in Lake County", tag: "lean-into", why: "At 12.4% Black, SD-18 has a more substantial African American community than its uncontested R status suggests. Democratic investment in Black voter registration and community organization in Painesville and the eastern suburbs is the most important coalition-building action for 2028." },
        { name: "Education & Public School Funding", tag: "lean-into", why: "Lake County's suburban school systems are important to the family-age households that dominate the district. A Democratic challenger who makes Republican school funding failures the centerpiece resonates with the parent-age suburban electorate." },
        { name: "Property Taxes & Housing Affordability", tag: "careful", why: "At 44.4 median age and $80K income, SD-18's older suburban homeowners are sensitive to property tax increases. A Democratic challenger should offer concrete housing policy proposals rather than appearing indifferent to the fiscal concerns of working and middle-class homeowners." },
        { name: "Filing No Candidate Again in 2028", tag: "avoid", why: "SD-18's demographics — 36% college, 12% Black, $80K income — make it far more competitive than an uncontested result implies. Not fielding a candidate means no established D vote floor, no coalition built, and no organizational infrastructure for the next cycle." }
      ],
      memoHeadline: "Lake County suburban R seat — reproductive rights + 12% Black coalition = competitive potential in 2028. Field a strong candidate now.",
      memoParagraphs: [
        "SD-18 covers Lake and Geauga counties — affluent eastern Cleveland suburbs that Republican Jerry Cirino held uncontested in 2024. But at 36.4% college attainment, 12.4% Black, and $80K income, the district's demographics are not as safely Republican as the uncontested result suggests. The 2028 cycle is an opportunity to build a genuinely competitive challenge.",
        "The reproductive rights frame is the most powerful tool for a Democratic challenger in SD-18. Lake County precincts — Mentor, Willoughby, Eastlake — showed movement toward reproductive freedom in the 2023 amendment. Pair that with Black community mobilization in Painesville and the district's eastern communities, and the competitive math begins to emerge.",
        "Building a Democratic presence in SD-18 before 2028 requires starting now. Voter registration in Black neighborhoods, civic engagement with the Painesville community, and building local Democratic Party infrastructure in Lake County are the foundation of any competitive challenge."
      ],
      memoBullets: [
        "Begin Black voter registration and community organizing in Painesville, Mentor, and the district's eastern suburbs. The 12.4% Black population is the dormant anchor of a viable Democratic coalition.",
        "Recruit a candidate with Lake County name recognition — a local elected official, civic leader, or professional. Outsider candidates with no Lake County ties will not be competitive.",
        "Test the reproductive rights message in Lake County with targeted digital outreach before 2028 to understand which precincts are movable and how to allocate resources in the campaign."
      ]
    }
  },

  {
    id: "oh-sd-19",
    name: "Ohio Senate District 19",
    city: "Columbus",
    region: "Delaware County & Columbus North Suburbs",
    type: "state senate district",
    incumbentName: "Andrew O. Brenner",
    incumbentParty: "Republican",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 19",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$99,979", sub: "" },
        { label: "College-Educated Adults",  value: "42.7%",  sub: "" },
        { label: "Median Age",               value: "39.2",   sub: "" },
        { label: "Renter Rate",              value: "22.9%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Andrew O. Brenner (R) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 86.9, color: DEMO_COLORS[0] },
        { label: "Asian",                    pct:  5.0, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct:  2.8, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino",        pct:  2.5, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Reproductive Rights", tag: "lean-into", why: "At 42.7% college attainment and $100K income, SD-19 is exactly the high-education suburban district type that voted for the 2023 reproductive rights amendment. Delaware County precincts showed movement toward reproductive freedom beyond what Republican state performance would predict. This is the highest-upside mobilization issue in SD-19." },
        { name: "Public Education Funding & School Quality", tag: "lean-into", why: "Delaware County's school systems — Olentangy, Big Walnut — are among Ohio's highest-performing. The parent population in this district is organized, opinionated, and deeply invested in education quality. A Democratic challenger who makes the Republican incumbent's education record a central argument activates a constituency that is already organized and motivated." },
        { name: "Asian American Community Engagement", tag: "lean-into", why: "At 5% Asian — concentrated in the Olentangy corridor — SD-19's Indian American and Chinese American communities are professionally accomplished and increasingly persuadable. A Democratic challenger who genuinely engages this community on education, healthcare, and economic policy can move votes where margins matter." },
        { name: "Anti-Business Economic Framing", tag: "avoid", why: "At $100K median income with a professional-class, business-owning constituency, a Democratic challenger who is perceived as anti-business will lose persuadable upper-middle-class voters before making any other argument. The economic frame must be fiscal responsibility and stable governance." },
        { name: "Treating This as an Unwinnable R District", tag: "avoid", why: "SD-19 went on the ballot in 2022 without a Democratic candidate — a strategic failure in a district whose demographics ($100K income, 43% college) are exactly the profile that has produced competitive suburban D gains. File a strong candidate in 2026." }
      ],
      memoHeadline: "Delaware County high-income suburban R seat — reproductive rights and education make this potentially competitive in 2026. Do not leave it uncontested again.",
      memoParagraphs: [
        "SD-19 is one of Ohio's wealthiest and most educated state senate districts, covering Delaware County and the northern Columbus suburbs. Andrew Brenner won uncontested in 2022 — a strategic mistake by Democrats in a district whose demographics ($100K income, 43% college) are exactly the profile of the suburban realignment that has produced D gains. The 2026 cycle is the moment to correct that error.",
        "The Republican incumbent in SD-19 has championed some of the most extreme education legislation in Ohio's General Assembly — attacks on public school curriculum, opposition to equitable school funding, and voucher expansion that defunds public schools. In a district dominated by parents with children in Delaware County's high-performing public schools, the incumbent's education record is a genuine electoral liability.",
        "Reproductive rights are the second pillar. Delaware County's 43% college attainment matches the profile that voted for the 2023 Ohio reproductive rights amendment. A candidate who leads with reproductive freedom, follows with education, and wraps both in a fiscal responsibility frame for upper-middle-class suburban households has a realistic path to competitiveness."
      ],
      memoBullets: [
        "File an urgent candidate recruitment search for SD-19. The ideal challenger is a Delaware County resident with community name recognition — a school board member, civic leader, or local professional who can fundraise competitively in a high-income district.",
        "Commission district-level polling immediately to establish a baseline and measure the resonance of reproductive rights and education messaging with SD-19's suburban electorate.",
        "Build relationships with Olentangy and Big Walnut school district parent networks. These organized, motivated constituencies can be activated against an incumbent with an extreme education record."
      ]
    }
  },

  {
    id: "oh-sd-20",
    name: "Ohio Senate District 20",
    city: "Columbus",
    region: "Columbus Northwest & Rural Suburbs (Union, Licking counties)",
    type: "state senate district",
    incumbentName: "Nick Hubbell",
    incumbentParty: "Democrat",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 20",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$82,819", sub: "" },
        { label: "College-Educated Adults",  value: "29.7%",  sub: "" },
        { label: "Median Age",               value: "39.9",   sub: "" },
        { label: "Renter Rate",              value: "25.7%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Nick Hubbell (D) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 85.6, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  5.9, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  2.4, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  2.7, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Growth Management & Infrastructure", tag: "lean-into", why: "Union and Licking counties are among Ohio's fastest-growing suburban and exurban areas. Infrastructure investment, traffic, development management, and community planning are immediate quality-of-life concerns for residents in a region growing faster than its public services can keep up." },
        { name: "Education Funding & School Quality", tag: "lean-into", why: "At 39.9 median age in a growing suburban community, SD-20 is dominated by family-age households with children in public schools. Education funding, school quality, and new school capacity in rapidly growing communities are primary political concerns for the parent population anchoring the district's Democratic coalition." },
        { name: "Constituent Accessibility Across a Geographically Spread District", tag: "lean-into", why: "Union and Licking counties are geographically large and include both suburban and rural communities. An incumbent who is present in Marysville, Newark, and Granville builds the geographic breadth of relationships that sustains a durable coalition." },
        { name: "Agricultural Policy & Rural Communities", tag: "careful", why: "Despite rapid suburban growth, Union and Licking counties retain significant agricultural land. A Democratic incumbent who understands and engages on farm income, rural infrastructure, and agricultural policy in the eastern portions of the district builds credibility with rural voters who might otherwise drift Republican." },
        { name: "Complacency in a Growing District", tag: "avoid", why: "Rapidly growing suburbs can shift partisan composition quickly as new residents arrive. SD-20's coalition must be continuously rebuilt as the district's population changes. An incumbent who assumes the 2024 coalition is permanent without active engagement will face a surprise when 2028 arrives." }
      ],
      memoHeadline: "Growing Columbus exurban D seat — infrastructure, education, and constituency breadth are the strategic priorities for maintaining the 2028 coalition.",
      memoParagraphs: [
        "SD-20 covers Union and Licking counties — some of central Ohio's fastest-growing suburban and exurban communities. Nick Hubbell won uncontested in 2024, and the district's $83K income and 30% college attainment reflect a comfortable suburban population. The strategic challenge of governing in a fast-growing district is that the coalition is constantly changing as new residents arrive — community engagement must be continuous, not cyclical.",
        "Infrastructure and growth management are the most immediate constituent concerns in Union and Licking counties. Traffic, school capacity, development quality, and community planning are daily frustrations for residents who chose these communities for their quality of life and are watching that quality pressured by rapid growth. An incumbent who is a visible advocate for responsible growth management speaks to the most visceral political concerns of the district.",
        "Education is the second pillar. The districts of Marysville, Big Walnut, and Licking Valley are communities where parents are organized and capable of delivering campaign infrastructure when activated. Building relationships with school district leadership, PTA networks, and parent advocacy organizations before 2028 creates the civic infrastructure that makes SD-20 defensible from strength."
      ],
      memoBullets: [
        "Attend every county commissioner and township trustee meeting in Union and Licking counties in the first year. Being visible at local government meetings signals constituent seriousness and builds the cross-partisan relationships that make a Democrat viable in exurban Ohio.",
        "Partner with public school district leadership in Marysville, Newark, and Granville on state education funding advocacy. Make school funding the signature legislative priority that SD-20's education community can organize around.",
        "Conduct outreach to the rural and agricultural communities in the northern portions of Union and Licking counties. Farmers and rural small-business owners are persuadable when an incumbent demonstrates genuine interest in their concerns."
      ]
    }
  },

  {
    id: "oh-sd-21",
    name: "Ohio Senate District 21",
    city: "Cleveland",
    region: "East Cleveland & East Cuyahoga County (majority-Black)",
    type: "state senate district",
    incumbentName: "Mikhail Alterman",
    incumbentParty: "Republican",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 21",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$54,023", sub: "" },
        { label: "College-Educated Adults",  value: "33.8%",  sub: "" },
        { label: "Median Age",               value: "40.2",   sub: "" },
        { label: "Renter Rate",              value: "45.4%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Mikhail Alterman (R) listed as 2022 winner with 18,584 votes — almost certainly a data anomaly in a majority-Black D-leaning district. Next election: November 2026.",
      demos: [
        { label: "Black / African American", pct: 57.8, color: DEMO_COLORS[0] },
        { label: "White",                    pct: 33.9, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  2.7, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  2.0, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Black Community GOTV & Voter Registration", tag: "lean-into", why: "SD-21 is 57.8% Black in east Cleveland and east Cuyahoga County — one of Ohio's most African American state senate districts. This is a district that should reliably elect Democratic legislators. Democratic organizational investment in Black community GOTV is the single highest-priority action for 2026." },
        { name: "Affordable Housing & Anti-Displacement", tag: "lean-into", why: "At 45.4% renters and $54K median income in east Cleveland and east Cuyahoga communities, housing affordability and anti-displacement are the most urgent constituent concerns. A Democratic challenger who makes housing the centerpiece speaks directly to the daily economic reality of the majority-Black working-class households that make up the district's core." },
        { name: "Economic Justice & Community Investment", tag: "lean-into", why: "East Cleveland and the east Cuyahoga suburbs have experienced decades of disinvestment and declining public services. A Democratic challenger who offers a concrete economic investment agenda — job access, business development, public infrastructure — gives the community something to organize around beyond party identity." },
        { name: "Investigating the 2022 Election Anomaly", tag: "lean-into", why: "The 2022 election data showing a Republican winning with only 18,584 votes in a 58% Black district is almost certainly a data artifact. Democrats must investigate the actual electoral history of this district, understand who is currently serving, and treat this as the top priority recapture opportunity in the Ohio Senate for 2026." },
        { name: "Running a Low-Effort Campaign in This District", tag: "avoid", why: "SD-21 is a majority-Black district that should be safely Democratic. Any Democratic candidate who treats this as a guaranteed win without serious GOTV investment and community organizing will be making the same mistake that allowed a Republican to represent east Cleveland's Black community." }
      ],
      memoHeadline: "PRIORITY RECAPTURE: Majority-Black east Cleveland D seat showing a Republican incumbent — investigate, field a strong candidate immediately, and launch full GOTV for 2026.",
      memoParagraphs: [
        "SD-21 is the highest-priority Democratic recapture opportunity in the Ohio Senate. The district is 57.8% Black in east Cleveland and east Cuyahoga County — the demographic foundation of a safe Democratic seat. The 2022 election data showing a Republican winner with only 18,584 votes is almost certainly anomalous — reflecting either a primary result, a special election, a write-in situation, or a data recording error. Democrats must immediately investigate the actual electoral history and current representation of this district.",
        "Regardless of what the 2022 anomaly reflects, the 2026 strategy is clear: recruit a strong Black community-rooted candidate, invest heavily in voter registration and GOTV in east Cleveland's African American neighborhoods, and ensure this district delivers the Democratic results its demographics demand. At 58% Black, 45% renters, and $54K income, this community has urgent constituent needs that require a Democratic senator committed to housing, economic justice, and community investment.",
        "The organizational infrastructure for SD-21 should be built around east Cleveland's Black civic institutions — faith communities, historically Black organizations, community development corporations, and civic clubs. These institutions have the community trust and volunteer capacity to deliver organized turnout when properly resourced."
      ],
      memoBullets: [
        "IMMEDIATE ACTION: Investigate the 2022 SD-21 election result to determine who is actually serving this district and what the electoral circumstances were. This is the critical first step before any other strategy is developed.",
        "Begin voter registration and community organizing in east Cleveland's Black neighborhoods now — 2026 is not far away and the organizational infrastructure must be built given the absence of recent Democratic investment.",
        "Recruit a candidate who is embedded in east Cleveland's Black community — a pastor, community development leader, school administrator, or long-serving civic figure whose name and face are known and trusted in Warrensville Heights, East Cleveland, and the surrounding communities."
      ]
    }
  },

  {
    id: "oh-sd-22",
    name: "Ohio Senate District 22",
    city: "Akron",
    region: "Lorain, Huron & Erie Counties (North Central Ohio)",
    type: "state senate district",
    incumbentName: "Mark Romanchuk",
    incumbentParty: "Republican",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 22",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$74,085", sub: "" },
        { label: "College-Educated Adults",  value: "27.9%",  sub: "" },
        { label: "Median Age",               value: "42.1",   sub: "" },
        { label: "Renter Rate",              value: "24.2%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Mark Romanchuk (R) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 90.4, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  3.4, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  2.3, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  0.9, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Manufacturing & Industrial Job Stability", tag: "lean-into", why: "Lorain County's industrial base — Lorain's steel industry, Avon Lake's manufacturing corridor, and the Huron/Erie county agricultural equipment sector — has been shaped by the Rust Belt economic story. A Democratic challenger who speaks authentically to manufacturing job stability, supply chain investment, and workers' rights can peel off working-class voters who are skeptical of Republican economic results." },
        { name: "Rural Healthcare & Hospital Access", tag: "lean-into", why: "Huron and Erie counties are rural communities where hospital access and primary care availability are concrete concerns. A challenger who makes healthcare access a campaign centerpiece — naming specific closures and the Republican legislature's inaction — earns crossover traction." },
        { name: "Lake Erie Environmental Protection", tag: "lean-into", why: "Erie County's economy depends on Lake Erie — commercial fishing, tourism, and recreation all rely on water quality. Lake Erie's harmful algal bloom crisis and water quality protection are genuine community concerns in Sandusky and the Lake Erie shore communities that a Democratic challenger can own as an economic and environmental issue." },
        { name: "Urban Cultural Messaging", tag: "avoid", why: "At 90% white with 27.9% college, SD-22 is deeply sensitive to perceived urban cultural alignment. A Democratic challenger must ground every issue in north central Ohio's specific economic and environmental realities." },
        { name: "Ignoring the District", tag: "avoid", why: "Leaving SD-22 uncontested in 2028 continues the pattern of organizational abandonment. Building a visible Democratic presence — even in a losing campaign — creates voter file infrastructure and community relationships that pay dividends in future cycles." }
      ],
      memoHeadline: "North central Ohio R seat — manufacturing, healthcare, and Lake Erie are the authentic Democratic frames. Build presence in 2028.",
      memoParagraphs: [
        "SD-22 covers Lorain, Huron, and Erie counties — a swath of north central Ohio defined by steel, agriculture, Lake Erie, and the economic anxieties of communities that have watched manufacturing decline while political promises accumulated. Mark Romanchuk ran uncontested in 2024. A 2028 challenge won't win, but it plants the seeds for future competitiveness.",
        "Lake Erie is the most distinctive local issue in SD-22 that Democrats own authentically. Sandusky's economy, the Lake Erie fishing industry, and the tourism corridor along the north coast all depend on water quality. Harmful algal blooms, nutrient runoff from agricultural operations, and Republican environmental rollbacks are all connectable to the lived experience of Erie County residents.",
        "The manufacturing and workers' rights frame is the second pillar. Lorain's industrial community — particularly around Cleveland-Cliffs and the manufacturing corridor — has a union tradition that pre-dates the current partisan alignment. A Democratic challenger who is present in union halls, who understands the specific economics of the steel industry, and who can speak credibly about trade and workers' rights earns a hearing."
      ],
      memoBullets: [
        "File a candidate from the district with genuine ties to either the manufacturing worker community in Lorain County or the Lake Erie/tourism community in Erie County.",
        "Make Lake Erie environmental protection the signature campaign issue that differentiates a Democratic challenger from a Republican incumbent who has supported environmental rollbacks.",
        "Visit union halls in Lorain and the agricultural communities in Huron County. Relationships with organized labor and farming communities are the foundation of any north central Ohio Democratic coalition."
      ]
    }
  },

  {
    id: "oh-sd-23",
    name: "Ohio Senate District 23",
    city: "Cleveland",
    region: "West Cuyahoga County (Lakewood, Parma, Cleveland West Side)",
    type: "state senate district",
    incumbentName: "Nickie J. Antonio",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 23",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$51,594", sub: "" },
        { label: "College-Educated Adults",  value: "29.3%",  sub: "" },
        { label: "Median Age",               value: "36.1",   sub: "" },
        { label: "Renter Rate",              value: "53.2%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Nickie J. Antonio (D) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 59.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 25.5, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct: 11.1, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  3.0, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Affordable Housing & Renter Protections", tag: "lean-into", why: "At 53.2% renters and $52K median income across Lakewood, Parma, and Cleveland's west side, housing cost burden is the daily defining concern for the majority of SD-23 residents. The incumbent's record on tenant protections, anti-displacement, and affordable housing investment is the most tangible constituent service tool heading into 2026." },
        { name: "Hispanic Community GOTV", tag: "lean-into", why: "At 11.1% Hispanic — reflecting Cleveland's substantial Puerto Rican, Mexican, and Central American communities on the west side — SD-23 has one of the strongest Latino populations of any Cuyahoga County senate district. Spanish-language outreach, voter registration, and genuine community investment build the coalition depth that makes SD-23 a durable Democratic asset." },
        { name: "Black Community Turnout Investment", tag: "lean-into", why: "At 25.5% Black, the African American community is a core pillar of the SD-23 coalition. Year-round investment in Black civic institutions on Cleveland's west side — faith communities, community organizations, neighborhood associations — sustains the turnout floor that makes this seat reliable for every Democrat running in Cuyahoga County." },
        { name: "Working-Class Economic Issues", tag: "lean-into", why: "At $52K median income with 53% renters in a multiracial working-class district, wage growth, workers' rights, and anti-poverty policy are the unifying economic frame across racial communities. Lakewood and Parma have strong union traditions that a Democratic incumbent can draw on." },
        { name: "Organizational Complacency Heading into 2026", tag: "avoid", why: "SD-23 returns to the ballot in 2026. A district this diverse and working-class requires active GOTV investment to turn out at the levels that make it reliably Democratic. Begin constituent engagement, housing advocacy, and coalition-building now — don't wait for the election-year sprint." }
      ],
      memoHeadline: "West Cuyahoga diverse D seat — 11% Hispanic is the standout coalition growth opportunity. Housing and multiracial GOTV are the priorities for 2026.",
      memoParagraphs: [
        "SD-23 is a diverse west Cuyahoga County Democratic seat covering Lakewood, Parma, and Cleveland's west side. Nickie Antonio won uncontested in 2022. At 59% white, 25.5% Black, and 11.1% Hispanic — with 53% renters and $52K income — this is a working-class multiracial district where housing affordability is the primary unifying political issue and where the Hispanic community represents the most significant coalition growth opportunity.",
        "The Hispanic community at 11.1% is the standout strategic opportunity in SD-23. Cleveland's west side Puerto Rican community — centered on Lorain Avenue and the Detroit-Shoreway neighborhood — has deep organizational infrastructure and a history of high civic engagement when mobilized. Spanish-language constituent services, voter registration drives, and genuine year-round community presence build the loyalty that sustains high Hispanic turnout in 2026.",
        "Black community turnout on Cleveland's west side is the second pillar. At 25.5% Black, the African American community in Parma, Lakewood, and Cleveland's west side neighborhoods is the margin that makes SD-23 a reliable Democratic asset. Year-round investment in Black civic institutions — not just October mobilization — is what maintains that turnout floor at the level that matters for every countywide and statewide race."
      ],
      memoBullets: [
        "Launch a sustained Spanish-language community outreach program targeting Cleveland's west side Hispanic communities. Voter registration, Spanish-language constituent communication, and community events are the foundation of coalition growth.",
        "Host quarterly housing resource events — tenant rights workshops, anti-displacement clinics, housing assistance fairs — in the highest-renter neighborhoods of Lakewood, Parma, and the west side. Make the incumbent's housing advocacy tangible.",
        "Build year-round relationships with Black civic organizations, west side faith communities, and neighborhood associations. GOTV should be the harvest of sustained engagement, not a cold-start operation."
      ]
    }
  },

  {
    id: "oh-sd-24",
    name: "Ohio Senate District 24",
    city: "Cleveland",
    region: "Lake & Eastern Cuyahoga Suburbs (Willoughby Hills, Eastlake, Mentor area)",
    type: "state senate district",
    incumbentName: "Sue Durichko",
    incumbentParty: "Democrat",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 24",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$81,632", sub: "" },
        { label: "College-Educated Adults",  value: "40.4%",  sub: "" },
        { label: "Median Age",               value: "43.5",   sub: "" },
        { label: "Renter Rate",              value: "27.3%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Sue Durichko (D) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 82.0, color: DEMO_COLORS[0] },
        { label: "Hispanic / Latino",        pct:  7.8, color: DEMO_COLORS[1] },
        { label: "Black / African American", pct:  5.0, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  4.0, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Reproductive Rights", tag: "lean-into", why: "At 40.4% college attainment and $82K income in eastern Cuyahoga and Lake county suburbs, SD-24 has exactly the educated suburban demographic that drove the 2023 reproductive rights amendment success. This is the primary mobilization and coalition-maintenance issue for 2028 in a district that skews toward professional suburban households." },
        { name: "Education Funding & School Quality", tag: "lean-into", why: "At 43.5 median age in suburban Lake and Cuyahoga communities, SD-24 is dominated by family-age households with children in public school systems. Education funding, school quality, and the Republican majority's record on school vouchers are high-salience issues for the parent population anchoring the district's Democratic coalition." },
        { name: "Hispanic Community Engagement", tag: "lean-into", why: "At 7.8% Hispanic — notably high for a suburban Lake/Cuyahoga district — SD-24 has a Latino community that warrants dedicated constituent attention and Spanish-language outreach. Building genuine relationships with this community before 2028 strengthens coalition depth in a district where every percentage point of turnout matters." },
        { name: "Property Tax & Homeowner Economic Concerns", tag: "careful", why: "At $82K income and 82% white in an aging suburban homeowner community (43.5 median age), property tax assessments and homeowner economic stability are relevant concerns. A Democratic incumbent who is attentive to these concerns and works to mitigate property tax burden without opposing necessary public investment builds cross-partisan trust." },
        { name: "Resting on an Uncontested 2024 Result", tag: "avoid", why: "SD-24's suburban composition — while currently D-leaning — can shift when Republicans field a credible, well-funded suburban candidate. Active constituent engagement and coalition maintenance between now and 2028 are essential to ensure the seat is defended from strength, not scrambled for." }
      ],
      memoHeadline: "Eastern Cleveland suburban D seat — reproductive rights, education, and Hispanic community engagement are the coalition priorities for 2028.",
      memoParagraphs: [
        "SD-24 covers the eastern Cuyahoga and Lake county suburbs — Willoughby Hills, Eastlake, Mentor-area communities — that represent the suburban D coalition in the Cleveland metro. Sue Durichko won uncontested in 2024. At 40.4% college attainment and $82K income, this is a professional suburban district where reproductive rights and education are the coalition anchors.",
        "The Hispanic community at 7.8% is the most distinctive strategic opportunity in SD-24. For a suburban Lake/Cuyahoga district, 7.8% Hispanic is a notable share that warrants dedicated constituent investment. Spanish-language outreach, community events, and genuine year-round engagement build the coalition depth that gives Democrats a consistent margin cushion in 2028.",
        "The 2023 reproductive rights amendment showed that SD-24's suburban electorate is strongly engaged on reproductive freedom. An incumbent who is publicly and legislatively committed to protecting reproductive healthcare access maintains the coalition energy from that successful campaign and enters 2028 with a clear and resonant message for the district's primary voter constituencies."
      ],
      memoBullets: [
        "Host reproductive rights town halls in 2025 and 2026 to maintain the mobilization energy from the 2023 amendment campaign. This issue is the primary mobilization tool for SD-24's educated suburban electorate.",
        "Launch dedicated Spanish-language constituent outreach in SD-24's Hispanic communities. At 7.8%, this is a community that can deepen the coalition's margin when properly engaged.",
        "Build relationships with Lake and eastern Cuyahoga county school district networks. Education funding advocacy is the sustained political identity issue for SD-24's parent population."
      ]
    }
  },

  {
    id: "oh-sd-25",
    name: "Ohio Senate District 25",
    city: "Columbus",
    region: "Columbus Urban Core — Short North, Franklinton, Near East Side",
    type: "state senate district",
    incumbentName: "Bill DeMora",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 25",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$66,526", sub: "" },
        { label: "College-Educated Adults",  value: "46.6%",  sub: "" },
        { label: "Median Age",               value: "31.2",   sub: "" },
        { label: "Renter Rate",              value: "55.9%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Bill DeMora (D) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 56.0, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 26.8, color: DEMO_COLORS[1] },
        { label: "Asian",                    pct:  6.2, color: DEMO_COLORS[2] },
        { label: "Hispanic / Latino",        pct:  7.4, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Affordable Housing & Tenant Protections", tag: "lean-into", why: "At 55.9% renters, 31.2 median age, and $67K income in Columbus's most rapidly gentrifying urban core — Short North, Franklinton, Near East Side — housing cost burden and displacement are the defining political concerns for the majority of SD-25 residents. The incumbent's housing record is the primary tool for maintaining the trust of a young, diverse, renting constituency." },
        { name: "Young Voter Engagement", tag: "lean-into", why: "At 31.2 median age — the youngest state senate district in Ohio — SD-25 is dominated by young adults who are renters, educated, diverse, and high-propensity Democratic voters when mobilized. Young voter outreach, social media communication, and policy wins on housing and economic opportunity are the primary engagement tools for this constituency." },
        { name: "Multiracial Coalition Investment", tag: "lean-into", why: "SD-25's 56% white, 27% Black, 7% Hispanic, and 6% Asian composition makes it one of Ohio's most genuinely diverse state senate districts. No single community delivers a majority, which means the incumbent must be the representative of the entire coalition — investing in Black, Hispanic, and Asian community engagement year-round, not just at election time." },
        { name: "Anti-Displacement & Neighborhood Preservation", tag: "lean-into", why: "Columbus's urban core gentrification is reshaping SD-25 in real time. Long-term residents — particularly Black households in the Near East Side and Franklinton — are being displaced by rising rents and development pressure. An incumbent who is visibly fighting for anti-displacement policy and community land trusts builds the trust of the residents most at risk of losing their place in the district they helped build." },
        { name: "Complacency in a Fast-Changing District", tag: "avoid", why: "SD-25 is changing rapidly as Columbus's urban core gentrifies and the demographic composition shifts. An incumbent who is not actively maintaining relationships with both long-term residents and the district's growing populations will find the coalition has changed beneath them by 2026." }
      ],
      memoHeadline: "Columbus urban core — youngest district in Ohio, 56% renters, multiracial. Housing anti-displacement and young voter engagement are the twin strategic imperatives for 2026.",
      memoParagraphs: [
        "SD-25 is Columbus's urban core — Short North, Franklinton, and the Near East Side. At 31.2 median age, this is the youngest state senate district in Ohio. Bill DeMora won uncontested in 2022, but the 2026 cycle should be treated with active strategic investment. A district this young, this diverse, and this renter-heavy requires continuous engagement to maintain the high turnout that makes it a Democratic asset rather than a variable.",
        "Housing displacement is the political crisis of SD-25. The Short North and Near East Side are among Columbus's most rapidly gentrifying neighborhoods. Long-term Black residents in Franklinton and the Near East Side are experiencing displacement pressure that is reshaping both the community and the district's political composition. An incumbent who is visibly fighting on anti-displacement policy — community land trusts, tenant protections, affordable housing preservation — maintains the trust of the residents who are at greatest risk and builds the kind of moral authority that sustains high turnout.",
        "Young voter engagement is the other strategic imperative. At 31.2 median age with 46.6% college attainment and 55.9% renters, SD-25 is dominated by young educated renters who are high-propensity Democrats when engaged but who require active, relevant, and sustained outreach to participate consistently. Social media communication, housing policy wins they can see in their daily lives, and a visible incumbent who is embedded in the district's cultural life are the tools for maintaining young voter engagement across the 2026 cycle."
      ],
      memoBullets: [
        "Make anti-displacement the flagship legislative priority. Commission a district-wide anti-displacement audit and publicly advocate for specific policies — community land trusts, tenant first-right-of-purchase, affordable housing preservation funds — that protect long-term Near East Side and Franklinton residents.",
        "Invest in year-round social media and digital outreach targeted at SD-25's young renter population. Policy communication about housing, student debt, and economic opportunity that is delivered through channels young adults actually use is the foundation of young voter engagement.",
        "Host quarterly multiracial community events that bring together Black, Hispanic, Asian, and white communities in SD-25. Coalition breadth requires deliberate investment — an incumbent who only shows up in one community will find the others have drifted before 2026."
      ]
    }
  },

  {
    id: "oh-sd-26",
    name: "Ohio Senate District 26",
    city: "Columbus",
    region: "Knox, Licking, Morrow & Richland Counties (exurban/rural central Ohio)",
    type: "state senate district",
    incumbentName: "Mohamud Jama",
    incumbentParty: "Democrat",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 26",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$68,849", sub: "" },
        { label: "College-Educated Adults",  value: "21.6%",  sub: "" },
        { label: "Median Age",               value: "41.0",   sub: "" },
        { label: "Renter Rate",              value: "25.9%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Mohamud Jama (D) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 89.7, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  2.6, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  4.4, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  1.3, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Rural Economic Investment & Small Business Support", tag: "lean-into", why: "Knox, Licking, Morrow, and Richland counties are a mix of exurban communities, small towns, and agricultural land. Economic investment — small business support, workforce development, broadband infrastructure — is the most relevant and least polarizing issue for the working-class white majority in this district. A Democratic incumbent must demonstrate tangible economic wins for these communities to maintain viability in a 90% white, 22% college district." },
        { name: "Healthcare Access in Smaller Communities", tag: "lean-into", why: "Mt. Vernon, Newark, and the smaller communities of Morrow and Richland counties face the same rural healthcare access challenges — clinic closures, primary care shortages, prescription costs — that define Appalachian Ohio. These are real and urgent concerns for a population that is aging (41 median age) and working-class, and they are concerns where a visible Democratic incumbent can deliver value." },
        { name: "Constituent Service as the Primary Engagement Tool", tag: "lean-into", why: "In a 90% white, rural/exurban district where a Democratic senator is anomalous, constituent service — accessible, responsive, genuine — is the primary tool for building and maintaining the trust that makes the seat defensible in 2028. An incumbent who helps individuals navigate state agencies, who shows up at township meetings, and who is known in every county of the district builds bipartisan goodwill that overcomes partisan identity." },
        { name: "National Democratic Party Framing", tag: "avoid", why: "SD-26 is 90% white with 22% college attainment in communities that have shifted significantly toward Republicans over the past decade. An incumbent who campaigns on national Democratic Party priorities or appears culturally aligned with urban Democratic politics will accelerate that shift. The frame must be intensely local, service-oriented, and economically grounded." },
        { name: "Neglecting the Rural Counties in Favor of Newark/Licking", tag: "avoid", why: "Licking County (Newark) is the most Democratic-leaning part of SD-26, but Morrow, Knox, and Richland counties contain the voters who are most persuadable — and most neglected. An incumbent who concentrates constituent activity in Newark while ignoring Mt. Vernon and Cardington loses the geographic breadth that makes the seat defensible in a difficult environment." }
      ],
      memoHeadline: "Anomalous D seat in rural central Ohio — constituent service, economic investment, and geographic breadth are the only viable strategies for 2028.",
      memoParagraphs: [
        "SD-26 is one of Ohio's most politically anomalous seats: a Democratic senator representing a 90% white, 22% college, rural/exurban district covering Knox, Licking, Morrow, and Richland counties. Mohamud Jama won uncontested in 2024 — a result that reflects either strong local name recognition, Republican organizational failure, or both. Maintaining this seat in 2028 requires a strategy that is completely divorced from national Democratic Party identity.",
        "Constituent service is the primary political tool in SD-26. In a district where a Democratic senator is unusual, the path to reelection runs through being known, accessible, and genuinely effective at helping individual constituents navigate state government. Helping a Knox County farmer resolve a USDA dispute, connecting a Richland County family to Medicaid, and showing up at every county fair and agricultural event in the district builds bipartisan goodwill that party identity alone cannot sustain.",
        "Economic investment framing is the secondary tool. Small business support, workforce training, rural broadband, and healthcare access in smaller communities are issues where a Democratic incumbent can deliver tangible wins without triggering partisan reflexes. Connecting every economic development announcement in the four counties to the incumbent's legislative advocacy is the core of the reelection narrative."
      ],
      memoBullets: [
        "Establish a visible constituent services presence in all four counties — Knox, Morrow, and Richland counties especially. Regular office hours in Mt. Vernon, Cardington, and Mansfield-area communities signal geographic commitment that prevents the perception of a senator who only shows up in Newark.",
        "Attend every county fair, agricultural expo, and community festival in the district. In rural Ohio, physical presence at community events is the primary tool for building the personal relationships that override partisan identity in the voting booth.",
        "Develop and publicize a specific economic investment agenda for each county in SD-26. Every broadband project, healthcare facility, and workforce training program connected to the incumbent's advocacy is a reelection asset."
      ]
    }
  },

  {
    id: "oh-sd-27",
    name: "Ohio Senate District 27",
    city: "Cincinnati",
    region: "Cincinnati Western Suburbs (Hamilton & Warren Counties)",
    type: "state senate district",
    incumbentName: "Patricia Goetz",
    incumbentParty: "Democrat",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 27",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$80,592", sub: "" },
        { label: "College-Educated Adults",  value: "40.2%",  sub: "" },
        { label: "Median Age",               value: "41.9",   sub: "" },
        { label: "Renter Rate",              value: "27.6%",  sub: "" }
      ],
      dem: 100, rep: 0,
      partisanSub: "Patricia Goetz (D) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 81.8, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  8.5, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  1.9, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  3.5, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Reproductive Rights & Healthcare Freedom", tag: "lean-into", why: "At 40.2% college attainment and $81K income in Cincinnati's western suburbs (Anderson Township, Delhi, western Hamilton County), SD-27 has the exact demographic profile that drove the 2023 reproductive rights amendment success in southwest Ohio. This is the top mobilization issue heading into 2026 and the incumbent's most powerful coalition anchor with educated suburban women." },
        { name: "Public Education Funding", tag: "lean-into", why: "At 41.9 median age with 40% college attainment, SD-27 is a district dominated by family-age households with strong investment in public school quality. The Republican legislature's record on vouchers and school funding equity is a genuine liability that a Democratic incumbent can deploy against any 2026 challenger." },
        { name: "Asian American Community Engagement", tag: "lean-into", why: "At 3.5% Asian in Cincinnati's western suburbs — including a growing Indian American and East Asian professional community — SD-27 has a constituency worth genuine constituent attention. This community is professionally accomplished, civically engaged when organized, and capable of contributing meaningfully to the coalition's margin." },
        { name: "Black Community Engagement in Hamilton County", tag: "careful", why: "At 8.5% Black, SD-27 has a meaningful African American community that should receive year-round constituent attention rather than election-season gestures. Community organizations, church partnerships, and accessible constituent services build the loyalty that sustains turnout." },
        { name: "Complacency Heading into 2026 in a Competitive Suburb", tag: "avoid", why: "SD-27 goes back on the ballot in 2026. Cincinnati's western suburbs are areas where Republicans can recruit credible challengers with Hamilton County connections. An incumbent who does not actively maintain the coalition — with visible constituent presence and a strong legislative record on reproductive rights and education — enters 2026 vulnerable." }
      ],
      memoHeadline: "Cincinnati western suburb D seat on 2026 ballot — reproductive rights and education are the coalition anchors. Do not allow Republican challenger to fill organizational vacuum.",
      memoParagraphs: [
        "SD-27 covers Cincinnati's western Hamilton County and Warren County suburbs — communities that have trended toward the educated suburban D coalition over the post-2016 cycle. Patricia Goetz won uncontested in 2022, but the 2026 cycle should be treated as a genuine defense. At 40% college attainment and $81K income, this is a district where Republican recruiters will look for a credible challenger.",
        "Reproductive rights are the primary coalition anchor. The 2023 amendment showed that Cincinnati's western suburbs — while still Republican-leaning in most other respects — are strongly engaged on reproductive freedom. An incumbent who has a clear and consistent legislative record on reproductive healthcare access enters 2026 with the most powerful mobilization tool available in Hamilton County's suburban communities.",
        "Education is the second pillar. Anderson Township, Delhi, and the western Hamilton County school communities are engaged, organized, and capable of delivering campaign infrastructure when activated around school funding and quality issues. Building relationships with the Hamilton County school network before 2026 creates the civic base that makes any Republican challenge a much harder lift."
      ],
      memoBullets: [
        "Host reproductive rights-focused constituent events in 2025 to maintain the mobilization energy from the 2023 amendment campaign and signal to the district that the incumbent is a reliable champion on this issue.",
        "Build relationships with western Hamilton County school district networks — Anderson, Delhi, Oak Hills — through education funding advocacy and visible presence at school board meetings.",
        "Conduct dedicated outreach to SD-27's Asian American community in Cincinnati's western suburbs. At 3.5%, this professionally accomplished community can be a meaningful coalition contributor when genuinely engaged."
      ]
    }
  },

  {
    id: "oh-sd-28",
    name: "Ohio Senate District 28",
    city: "Cincinnati",
    region: "Butler & Montgomery Counties (Middletown, Hamilton area)",
    type: "state senate district",
    incumbentName: "Jon Leissler",
    incumbentParty: "Republican",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 28",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$64,003", sub: "" },
        { label: "College-Educated Adults",  value: "29.2%",  sub: "" },
        { label: "Median Age",               value: "40.0",   sub: "" },
        { label: "Renter Rate",              value: "35.2%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Jon Leissler (R) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 75.5, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct: 14.2, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  3.0, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  3.3, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Black Community Mobilization in Middletown & Hamilton", tag: "lean-into", why: "At 14.2% Black in a Butler/Montgomery County district that includes Middletown and Hamilton, SD-28 has a substantial African American community that has received minimal Democratic investment at the state senate level. Voter registration, constituent services, and GOTV in Middletown's Black neighborhoods are the highest-ROI coalition-building investment for 2028." },
        { name: "Manufacturing & Working-Class Economic Recovery", tag: "lean-into", why: "Middletown and Hamilton are post-industrial communities where manufacturing job loss has been a defining economic reality for decades. J.D. Vance's memoir made Middletown internationally famous as a symbol of working-class white deindustrialization — but the Black community in these same cities has experienced the same economic displacement with less political representation. A Democratic challenger who speaks to economic recovery across racial lines has an authentic and powerful message in SD-28." },
        { name: "Healthcare Access & Addiction Recovery", tag: "lean-into", why: "Butler County — including Middletown — has been severely affected by the opioid epidemic. Recovery services, mental health resources, and hospital access are urgent concerns that cross racial and partisan lines in these communities. A Democratic challenger who is present in the addiction recovery community earns credibility that advertising cannot buy." },
        { name: "Racial Resentment Framing", tag: "avoid", why: "In a 75% white working-class district with a painful deindustrialization story, racial grievance politics can be politically activated against Democrats by Republican opponents. A Democratic challenger must speak to economic pain across racial lines — not in ways that appear to prioritize one community over others — to avoid giving Republicans the cultural wedge that has cost Democrats in Butler County for a decade." },
        { name: "Leaving the District Uncontested in 2028", tag: "avoid", why: "SD-28's demographics — 14% Black, 29% college, 35% renters, $64K income — suggest a district more competitive than its uncontested Republican result implies. Not fielding a candidate means no D vote floor, no Black community investment, and no organizational infrastructure for future cycles." }
      ],
      memoHeadline: "Middletown-area R seat — 14% Black + working-class deindustrialization = more competitive than uncontested. Field a D candidate in 2028.",
      memoParagraphs: [
        "SD-28 covers Middletown, Hamilton, and the Butler/Montgomery county communities that have become shorthand for working-class white deindustrialization. Jon Leissler ran uncontested in 2024. But the district's 14.2% Black population, 35.2% renter rate, and $64K median income suggest demographics more competitive than the uncontested result implies. The 2028 cycle should feature a Democratic challenger.",
        "Middletown's Black community is the foundation of any viable Democratic coalition in SD-28. This community has experienced the same economic displacement as the district's white working class — the same factory closures, the same healthcare deserts, the same infrastructure disinvestment — with less political voice at the state level. Black voter registration and community organizing in Middletown is both the right thing to do and the highest-ROI political investment in SD-28.",
        "The economic populism frame available in Butler County is authentic and powerful. Middletown is not an abstraction — it is a real community that has watched manufacturing leave, watched civic institutions erode, and watched a decade of Republican governance at both the state and federal level fail to reverse that decline. A Democratic challenger who shows up in Middletown with a specific and local economic recovery agenda is making an argument that the Republican incumbent has never had to answer."
      ],
      memoBullets: [
        "Begin Black voter registration and community organizing in Middletown and Hamilton now. The 14.2% Black population is the anchor of any viable 2028 Democratic coalition in SD-28.",
        "Recruit a candidate with deep Butler County roots — ideally someone embedded in the Middletown community who can speak to economic loss with biographical authenticity.",
        "Make addiction recovery services, manufacturing investment, and healthcare access the three-issue platform. All three are locally specific, cross-racial, and speak to the lived experience of SD-28 communities in ways that override partisan identity."
      ]
    }
  },

  {
    id: "oh-sd-29",
    name: "Ohio Senate District 29",
    city: "Columbus",
    region: "Knox & Licking Counties (Newark, Mt. Vernon area)",
    type: "state senate district",
    incumbentName: "Lynn C. Gorman (Write-In)",
    incumbentParty: "Independent",
    nextElection: "November 2026",
    seatStatus: "Open",
    dashboard: {
      subtitle: "Ohio Senate District 29",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$65,410", sub: "" },
        { label: "College-Educated Adults",  value: "25.5%",  sub: "" },
        { label: "Median Age",               value: "41.7",   sub: "" },
        { label: "Renter Rate",              value: "32.1%",  sub: "" }
      ],
      dem: 0, rep: 0,
      partisanSub: "Lynn C. Gorman won in 2022 as a write-in candidate with only 2,730 votes — effectively an open seat. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 84.6, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  7.9, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  3.0, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  0.9, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Fielding a Strong D Candidate Immediately", tag: "lean-into", why: "SD-29 is an effectively open seat — a write-in winner with 2,730 votes in 2022 represents a nearly absent political contest. Democrats have an equal opportunity with Republicans to claim this seat in 2026 with a credible candidate who has local name recognition and community ties. The 2026 election is the primary strategic objective." },
        { name: "Healthcare Access & Hospital Stability", tag: "lean-into", why: "Knox and Licking counties have rural and exurban communities where hospital access and primary care are ongoing concerns. A Democratic challenger who makes healthcare the primary issue — naming specific local facilities at risk and the Republican majority's failure to act — earns crossover traction in a district where healthcare is a tangible daily concern." },
        { name: "Economic Development in Newark & Mt. Vernon", tag: "lean-into", why: "Newark (Licking County) and Mt. Vernon (Knox County) are the two largest communities in SD-29 and both have working-class economies shaped by manufacturing and agriculture. A Democratic candidate who brings a specific economic investment agenda to these communities — workforce training, small business support, infrastructure — can build a competitive coalition." },
        { name: "Black Community Engagement in Licking County", tag: "lean-into", why: "At 7.9% Black — concentrated largely in Newark and the Licking County communities — SD-29 has a Democratic base constituency that is underserved and underorganized at the state level. Voter registration and community engagement with Newark's Black community before 2026 builds the coalition foundation that makes the seat competitive." },
        { name: "Treating This as a Normal Uncompetitive R District", tag: "avoid", why: "SD-29 is NOT a normal R district — it is an open seat where the 2022 'winner' was a write-in with 2,730 votes. Democrats who treat this as a routine R district and fail to file a serious candidate in 2026 are making a strategic error. This is one of the most open opportunities in the Ohio Senate cycle." }
      ],
      memoHeadline: "OPEN SEAT OPPORTUNITY: Write-in winner with 2,730 votes in 2022 = effectively uncontested. File a strong D candidate NOW for November 2026.",
      memoParagraphs: [
        "SD-29 is among the most significant open-seat opportunities in the Ohio Senate for 2026. The 2022 'winner' — Lynn C. Gorman — won as a write-in candidate with only 2,730 votes, indicating that the contest was effectively unoccupied by any organized candidate. This means there is no entrenched Republican incumbent, no established Republican vote floor to overcome, and no political infrastructure defending the seat. Democrats who act first and recruit a strong candidate have a genuine competitive opportunity.",
        "Knox and Licking counties — covering Newark, Mt. Vernon, and the rural communities between them — are working-class central Ohio communities that respond to economic investment messaging, healthcare advocacy, and genuine constituent presence. At 85% white and 26% college, the district is challenging Democratic territory, but it is also territory where a locally rooted candidate who delivers on constituent service and economic investment can build bipartisan support that overcomes partisan identity.",
        "The 7.9% Black population in Newark and Licking County is the most organized Democratic base constituency in SD-29. Voter registration, community organizing, and constituent services targeting Newark's Black community are the first steps toward building a viable coalition. Combined with working-class economic messaging for the broader district, this becomes the foundation of a competitive 2026 campaign."
      ],
      memoBullets: [
        "URGENT: File a candidate recruitment search for SD-29 immediately. A locally known candidate with Knox or Licking County community ties is essential — this is not a district where an outside candidate can be parachuted in successfully.",
        "Begin Black voter registration and community organizing in Newark now. The 7.9% Black population is the most reliably Democratic base constituency in SD-29 and must be the organizational anchor of the 2026 campaign.",
        "Commission polling in SD-29 to establish a baseline and test which issues — healthcare, economic development, education — resonate most strongly with the district's persuadable electorate. Use the results to build a hyper-local campaign message."
      ]
    }
  },

  {
    id: "oh-sd-30",
    name: "Ohio Senate District 30",
    city: "Toledo",
    region: "Wood & Defiance Counties (Northwest Ohio rural)",
    type: "state senate district",
    incumbentName: "Brian M. Chavez",
    incumbentParty: "Republican",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 30",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$56,713", sub: "" },
        { label: "College-Educated Adults",  value: "20.4%",  sub: "" },
        { label: "Median Age",               value: "42.4",   sub: "" },
        { label: "Renter Rate",              value: "27.0%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Brian M. Chavez (R) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 92.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  2.8, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  1.5, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  0.8, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Rural Healthcare & Hospital Access", tag: "lean-into", why: "Wood and Defiance counties have rural communities where hospital consolidations and clinic closures are real concerns. A Democratic challenger who makes healthcare access the primary issue — naming specific facilities and the Republican legislature's inaction — speaks to a genuine working-class concern that has crossover traction in rural NW Ohio." },
        { name: "Agricultural Policy & Farm Income", tag: "lean-into", why: "SD-30 is agricultural NW Ohio — soybean and corn country where farm income, commodity markets, and agricultural infrastructure are the economic backbone of rural communities. A Democratic challenger who can speak authentically to farm policy, crop insurance, and rural cooperative support earns the hearing that makes a losing campaign into a seed-planting exercise." },
        { name: "Prescription Drug Costs", tag: "lean-into", why: "At 42.4 median age with $57K income, SD-30 has an aging working-class population where prescription drug costs — insulin, chronic disease medication, pharmacy access in rural communities — are monthly household budget pressures. This is a crossover issue with documented traction in rural Republican-leaning Ohio." },
        { name: "Cultural Wedge Issues", tag: "avoid", why: "At 92% white with 20% college in rural northwest Ohio, cultural wedge politics are highly effective Republican tools. A Democratic challenger must stay relentlessly on economic kitchen-table issues and avoid any frame that triggers rural cultural identity politics." },
        { name: "Ignoring the District", tag: "avoid", why: "Leaving SD-30 uncontested in 2028 is the easy path and the strategically incorrect one. Even a losing campaign builds voter file, generates earned media, and plants the community relationships that produce competitiveness over multiple cycles." }
      ],
      memoHeadline: "Deep-R rural NW Ohio — healthcare, farm income, and prescription costs are the only viable frames. Build presence in 2028 for long-term infrastructure.",
      memoParagraphs: [
        "SD-30 covers Wood and Defiance counties in northwest Ohio — a rural agricultural district where $57K median income and 20% college attainment reflect a working-class community that has drifted strongly Republican over the past decade. Brian Chavez ran uncontested in 2024. A Democratic challenger in 2028 will lose, but the organizational work of running a campaign creates the infrastructure that makes future cycles more competitive.",
        "Healthcare access is the most powerful issue available in SD-30. Rural hospital consolidations, clinic closures, and primary care shortages are not abstract policy debates in Wood and Defiance counties — they are real community crises that people in Bowling Green, Defiance, and Napoleon experience directly. A candidate who shows up at community forums on hospital closures and names what the Republican legislature has failed to do for rural healthcare earns a level of credibility that advertising cannot replicate.",
        "Agricultural policy is the second pillar. Northwest Ohio's agricultural communities — corn and soybean farmers in Defiance, Henry, and Wood counties — have real concerns about commodity prices, trade policy, and farm income that cut across partisan identity. A Democratic candidate who has done the homework on agricultural economics and can speak credibly to farm families earns a hearing in these communities."
      ],
      memoBullets: [
        "File a candidate with genuine NW Ohio rural roots — a rural physician, farmer, or agricultural extension professional who is known in Wood or Defiance county communities.",
        "Center the campaign on healthcare access and prescription drug costs. Attend every community forum on hospital consolidation and rural health that occurs in the district between now and 2028.",
        "Engage with local Farm Bureau chapters and agricultural cooperatives. Even if these organizations do not endorse a Democratic challenger, the act of showing up demonstrates a commitment to rural agricultural communities that distinguishes the challenger from the typical absent Democrat."
      ]
    }
  },

  {
    id: "oh-sd-31",
    name: "Ohio Senate District 31",
    city: "Akron",
    region: "Tuscarawas, Carroll & Coshocton Counties (NE Ohio rural)",
    type: "state senate district",
    incumbentName: "Al Landis",
    incumbentParty: "Republican",
    nextElection: "November 2026",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 31",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$65,091", sub: "" },
        { label: "College-Educated Adults",  value: "20.9%",  sub: "" },
        { label: "Median Age",               value: "40.4",   sub: "" },
        { label: "Renter Rate",              value: "28.4%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Al Landis (R) ran uncontested in 2022. Next election: November 2026.",
      demos: [
        { label: "White",                    pct: 93.2, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  1.6, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  2.5, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  0.7, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Rural Healthcare & Hospital Access", tag: "lean-into", why: "Tuscarawas, Carroll, and Coshocton counties are rural communities where hospital access and primary care availability are concrete concerns. Union Hospital, Coshocton Regional Medical Center, and smaller rural clinics serve communities that are hours from major medical centers. Healthcare is a survival issue, not a partisan one, in these communities." },
        { name: "Manufacturing & Coal Transition", tag: "lean-into", why: "This part of NE Ohio sits at the edge of Appalachian coal country and has experienced the economic disruption of coal industry decline alongside manufacturing contraction. A Democratic challenger who speaks to economic transition with a concrete investment agenda — renewable energy jobs, workforce retraining — rather than just acknowledging loss has an authentic and forward-looking argument." },
        { name: "Agricultural Support in Small Farming Communities", tag: "lean-into", why: "Tuscarawas and Coshocton counties have active farming communities alongside their industrial heritage. Farm income, rural cooperative support, and agricultural infrastructure are relevant economic concerns for a meaningful segment of the district's working population." },
        { name: "Carbon Industry Rhetoric", tag: "careful", why: "This district sits at the edge of coal and oil country. A Democratic challenger must acknowledge the economic reality of energy industry workers without endorsing policies that simply extend fossil fuel dependence. The frame is economic transition and investment in new industries, not attacking the identity of workers in legacy energy sectors." },
        { name: "National Democratic Framing", tag: "avoid", why: "At 93% white with 21% college in Appalachian-adjacent NE Ohio, national Democratic Party framing — even well-intentioned — activates rural cultural identity politics that overrides any economic argument. Stay hyper-local." }
      ],
      memoHeadline: "Appalachian-adjacent NE Ohio R seat — healthcare and economic transition are the viable frames. Field a candidate to build 2026 infrastructure.",
      memoParagraphs: [
        "SD-31 covers Tuscarawas, Carroll, and Coshocton counties — a rural NE Ohio district with Appalachian cultural characteristics, manufacturing history, and agricultural communities. Al Landis ran uncontested in 2022. A 2026 Democratic challenger will face very difficult terrain, but the organizational work of contesting this seat matters for the long-term health of Democratic infrastructure in NE Ohio.",
        "Healthcare is the most compelling argument available in this district. The rural hospital network serving Tuscarawas, Carroll, and Coshocton counties faces the same pressures — consolidation, primary care shortages, specialist access — that define Appalachian Ohio healthcare. A candidate who makes this the centerpiece of the campaign and shows up to every hospital board meeting and community health forum earns a kind of community credibility that party advertising cannot replicate.",
        "Economic transition is the secondary argument. This part of Ohio sits at the edge of coal and energy country, and communities like Coshocton and Newcomerstown have watched both manufacturing and energy industries decline. A Democratic challenger who offers a specific economic investment agenda — workforce retraining, broadband infrastructure, renewable energy job creation — rather than simply mourning the past makes an argument with genuine relevance to communities looking for a path forward."
      ],
      memoBullets: [
        "Recruit a candidate from Tuscarawas or Coshocton County with genuine community ties — a rural physician, trades worker, or small-business owner who is known in New Philadelphia, Dover, or Coshocton.",
        "Make healthcare access the primary campaign issue. Attend county health board meetings, hospital board presentations, and community forums on rural healthcare to demonstrate substantive engagement.",
        "Develop a specific economic transition agenda — tied to actual employers, actual workforce training programs, and actual broadband projects in the district — that offers a future-oriented economic vision beyond mourning industrial decline."
      ]
    }
  },

  {
    id: "oh-sd-32",
    name: "Ohio Senate District 32",
    city: "Akron",
    region: "Trumbull & Portage Counties (Youngstown area)",
    type: "state senate district",
    incumbentName: "Sandra O'Brien",
    incumbentParty: "Republican",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 32",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$60,743", sub: "" },
        { label: "College-Educated Adults",  value: "22.1%",  sub: "" },
        { label: "Median Age",               value: "43.9",   sub: "" },
        { label: "Renter Rate",              value: "25.4%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Sandra O'Brien (R) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 88.3, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  5.6, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  2.8, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  0.5, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Steel & Manufacturing Worker Economic Populism", tag: "lean-into", why: "Trumbull County — Warren, Niles, Brookfield — is historic steel country with a deep union tradition. These communities were Democratic for generations and have shifted R in recent cycles due to economic abandonment and cultural drift. A Democratic challenger with genuine union connections and a credible steel/manufacturing economic policy can speak to the original Democratic identity of these communities in a way that resonates with older voters who remember when the mills ran." },
        { name: "Working-Class Healthcare & Prescription Drug Costs", tag: "lean-into", why: "At 43.9 median age, $61K income, and low college attainment, SD-32 has an aging working-class population for whom healthcare costs — particularly prescription drugs — are a monthly budget stress. This is the highest-traction crossover issue available in Trumbull and Portage counties." },
        { name: "Union Legacy & Workers' Rights", tag: "lean-into", why: "Trumbull County's union tradition is not dead — it is dormant. United Steelworkers and UAW have historical roots in these communities that a Democratic challenger can activate by showing genuine commitment to workers' rights, collective bargaining, and trade policy that protects American manufacturing. This is the most authentic Democratic argument in SD-32." },
        { name: "National Democratic Brand Association", tag: "careful", why: "Trumbull and Portage counties have shifted R in part because national Democratic politics has felt culturally alien to working-class white communities here. A challenger must acknowledge that drift without endorsing Republican cultural politics — and must demonstrate that their brand of Democratic politics is about economic power for workers, not urban progressive cultural issues." },
        { name: "Leaving This Historical D Territory Uncontested in 2028", tag: "avoid", why: "Trumbull County was a Democratic stronghold for most of the 20th century. Leaving SD-32 uncontested in 2028 permanently cedes territory that, with the right candidate and the right economic message, can be brought back into the competitive column over multiple cycles. File a candidate." }
      ],
      memoHeadline: "Youngstown-area R seat in formerly D steel country — union economic populism is the authentic frame. Field a candidate and begin rebuilding the working-class coalition.",
      memoParagraphs: [
        "SD-32 is Trumbull and Portage counties — the heart of the Youngstown steel belt that was Democratic for most of the 20th century and has shifted Republican over the past two decades. Sandra O'Brien ran uncontested in 2024. This is not permanently R territory — it is historically Democratic territory that has been abandoned by a party that stopped showing up and stopped speaking the language that built this coalition in the first place.",
        "The union tradition in Trumbull County is the foundation of any Democratic comeback in SD-32. Warren, Niles, and Brookfield have USW and UAW histories that are living memories for a population averaging 43.9 years old. A Democratic challenger who shows up at union halls, who understands the specific economics of the steel industry and the Youngstown economic ecosystem, and who can speak credibly about trade, collective bargaining, and workers' rights is speaking the language that built this coalition. The question is whether a candidate with those credentials and that connection can be found and supported.",
        "Healthcare is the crossover issue. At $61K income and 43.9 median age, out-of-pocket healthcare costs — prescription drugs, specialist access, insulin — are real and immediate concerns for working-class households in SD-32. This is an issue where Democrats have better policy positions than Republicans and where a well-framed challenger argument can move persuadable voters regardless of recent partisan drift."
      ],
      memoBullets: [
        "Recruit a candidate with authentic union roots in Trumbull County — someone who has worked in manufacturing, is known in Warren or Niles labor circles, and can speak to steel/manufacturing economics with credibility.",
        "Establish a visible Democratic presence in Trumbull County union halls and working-class communities in 2026-2027. The candidate who wins in 2028 is the one who has been showing up in these communities for two years before the election.",
        "Make prescription drug costs and healthcare access the three-issue platform alongside union workers' rights. These are the issues where Democrats have better answers and where working-class voters in SD-32 are most persuadable."
      ]
    }
  },

  {
    id: "oh-sd-33",
    name: "Ohio Senate District 33",
    city: "Akron",
    region: "Mahoning Valley & Columbiana County (Youngstown metro)",
    type: "state senate district",
    incumbentName: "Al Cutrona",
    incumbentParty: "Republican",
    nextElection: "November 2028",
    seatStatus: "Active",
    dashboard: {
      subtitle: "Ohio Senate District 33",
      chips: [],
      stats: [
        { label: "Median Household Income", value: "$57,138", sub: "" },
        { label: "College-Educated Adults",  value: "22.5%",  sub: "" },
        { label: "Median Age",               value: "43.9",   sub: "" },
        { label: "Renter Rate",              value: "28.4%",  sub: "" }
      ],
      dem: 0, rep: 100,
      partisanSub: "Al Cutrona (R) ran uncontested in 2024. Next election: November 2028.",
      demos: [
        { label: "White",                    pct: 82.4, color: DEMO_COLORS[0] },
        { label: "Black / African American", pct:  9.7, color: DEMO_COLORS[1] },
        { label: "Hispanic / Latino",        pct:  4.8, color: DEMO_COLORS[2] },
        { label: "Asian",                    pct:  0.7, color: DEMO_COLORS[3] }
      ],
      issues: [
        { name: "Mahoning Valley Economic Reinvestment", tag: "lean-into", why: "Youngstown and the Mahoning Valley are the defining case study of American deindustrialization — and also a community that has spent decades attempting economic reinvestment and diversification. A Democratic challenger who speaks to the specific economic history and present of the Mahoning Valley, who engages with the Youngstown Business Incubator and regional economic development efforts, demonstrates that Democrats understand and are invested in this community's future." },
        { name: "Black Community Mobilization in Youngstown", tag: "lean-into", why: "At 9.7% Black — concentrated in Youngstown's African American community — SD-33 has a Democratic base constituency that has been organizationally neglected at the state level. Voter registration, community engagement, and constituent services in Youngstown's Black neighborhoods are the highest-ROI investment for building a competitive coalition in this district." },
        { name: "Healthcare & Prescription Drug Costs", tag: "lean-into", why: "At 43.9 median age and $57K income — identical to SD-32 — SD-33's aging working-class population experiences prescription drug costs and healthcare access as daily concerns. A Democratic challenger who makes healthcare affordability a campaign centerpiece speaks to the most universal kitchen-table concern in the Mahoning Valley." },
        { name: "Union Legacy & Workers' Rights", tag: "lean-into", why: "The Mahoning Valley's union tradition — United Steelworkers, local labor councils, and the working-class civic infrastructure built around organized labor — is the historical foundation of Democratic politics in Youngstown. A challenger who reconnects with that tradition through genuine union engagement builds the organizational backbone that makes a competitive campaign possible." },
        { name: "Ignoring Youngstown's Black Community", tag: "avoid", why: "The Mahoning Valley's Black community is the most reliably Democratic constituency in SD-33 and the most organizationally neglected. A Democratic challenger who does not make Black community investment a central campaign priority is leaving the most available coalition votes on the table and will underperform the district's true Democratic ceiling." }
      ],
      memoHeadline: "Youngstown R seat in historic D steel territory — union populism, Black community GOTV, and healthcare are the coalition pillars for 2028.",
      memoParagraphs: [
        "SD-33 covers Youngstown, Boardman, and the Mahoning Valley communities that represent one of America's most consequential experiments in post-industrial economic transition. Al Cutrona ran uncontested in 2024. Like the adjacent SD-32, this is historically Democratic territory — not permanently Republican territory — and building a competitive challenge requires beginning the organizational work now, in 2025 and 2026, rather than parachuting in a candidate in 2028.",
        "Youngstown's Black community is the electoral anchor of any viable SD-33 Democratic coalition. At 9.7% Black and concentrated in Youngstown proper, this community has the civic infrastructure — faith institutions, historically Black organizations, and neighborhood civic groups — to deliver organized turnout when properly resourced and engaged. Black voter registration, constituent services, and year-round community presence in Youngstown's African American neighborhoods are the first-order strategic investment.",
        "The union tradition in the Mahoning Valley is the second pillar. Youngstown's USW heritage and the labor councils that built the Valley's civic identity in the 20th century still have institutional memory and organizational capacity. A Democratic challenger who shows up in union halls, who understands the economics of manufacturing and the trade policies that affected the Valley, and who can speak credibly to the workers who built this community has an argument that the Republican incumbent cannot make."
      ],
      memoBullets: [
        "Establish an immediate community presence in Youngstown's Black neighborhoods — partnering with faith institutions, historically Black civic organizations, and neighborhood associations to begin voter registration and community organizing well before 2028.",
        "Engage with Mahoning Valley union halls and the United Steelworkers local organizations. The candidate who wins SD-33 in 2028 will be the one who has been attending union events and building labor relationships for two years before the election.",
        "Make healthcare costs the universal crossover message — prescription drugs, specialist access, and hospital affordability are the issues that reach across racial and partisan lines in a working-class aging community like the Mahoning Valley."
      ]
    }
  },

];
