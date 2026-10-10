// OLPW:curriculum/environmental.js | script for environmental
/* OLPW expansion curriculum — Environmental Management (CAIE 0680 companion chapters 15-18) */
module.exports = {
    chapters: [
        {
            n: 15,
            title: 'Human Population and Carrying Capacity',
            card: 'How populations grow, what limits them, and how governments use pro- and anti-natalist policies to change birth rates.',
            lead: 'Human population follows the same sigmoid curve as any other species: slow growth, explosive growth, then a plateau as limiting factors bite. Exam questions ask you to explain that curve and to judge whether policies that bend it work.',
            concepts: [
                'The human population growth curve has three phases: slow growth when birth and death rates are both high, rapid growth as death rates fall while birth rates stay high, and slowing growth as birth rates fall towards death rates.',
                'Carrying capacity is the maximum population an environment can support indefinitely given available resources such as food, water and energy.',
                'Limiting factors such as food supply, water, disease and habitat space slow growth as the population approaches carrying capacity, producing the plateau of the sigmoid curve.',
                'Birth rate and death rate per thousand measure natural change; migration adds or subtracts people beyond natural increase.',
                'Population pyramids display age and sex structure: a wide base shows rapid growth, a narrow base shows ageing and slow or negative growth.',
                'Antinatalist policies aim to reduce birth rates through family planning and education, while pronatalist policies encourage larger families with incentives; both must be evaluated for effectiveness and ethics.'
            ],
            terms: [
                { t: 'Carrying capacity', d: 'The maximum population size that an environment can sustain indefinitely with the resources available, such as food, water and energy.' },
                { t: 'Birth rate', d: 'The number of live births per thousand people in a population in one year.' },
                { t: 'Death rate', d: 'The number of deaths per thousand people in a population in one year.' },
                { t: 'Population pyramid', d: 'A bar chart showing the numbers or percentages of males and females in each age group of a population, revealing its growth trend.' },
                { t: 'Migration', d: 'The movement of people into or out of a region or country, adding to or subtracting from population change beyond natural increase.' },
                { t: 'Pronatalist policy', d: 'A government policy that encourages childbearing, often through financial incentives, to raise a low birth rate.' },
                { t: 'Antinatalist policy', d: 'A government policy that discourages childbearing, through family planning and education, to lower a high birth rate.' },
                { t: 'Limiting factor', d: 'A resource or condition, such as food, water or disease, that restricts population growth as numbers approach carrying capacity.' }
            ],
            tip: 'In population questions, name the phase of the curve and the factor causing it; in policy evaluations, balance effectiveness, cost and ethics before your conclusion.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Describe the three phases of the sigmoid population growth curve and explain what is meant by carrying capacity.',
                    ans: 'Phase 1: slow growth because both birth rate and death rate are high and roughly cancel (1). Phase 2: rapid growth because death rate falls while birth rate remains high (1). Phase 3: growth slows and levels off as birth rate falls towards the death rate and limiting factors operate (1). Carrying capacity is the maximum population an environment can support indefinitely with its available resources (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A country has a rapidly growing population and scarce farmland. Evaluate two antinatalist measures the government could use, and conclude with your judgement on which is more likely to succeed.',
                    ans: 'Family planning services provide contraception and advice, directly lowering birth rates as shown in countries such as Bangladesh, but they need funding, trained staff and cultural acceptance (1). Improving female education and employment raises the age of marriage, increases career opportunities and reduces desired family size, and it brings wider economic benefits, but the effect takes a generation to appear (1). Effectiveness: family planning acts faster on birth rates, while education is slower but more permanent and has extra benefits for health and earnings (1). Conclusion: funding family planning alongside girls education is most likely to succeed, since the fast effect and the long-term change reinforce each other, provided the programme is voluntary and respects local culture (1).'
                }
            ]
        },
        {
            n: 16,
            title: 'Water Scarcity, Irrigation and Dams',
            card: 'Why fresh water runs short, how irrigation feeds billions, and the benefits and costs of damming rivers.',
            lead: 'Agriculture consumes most of the fresh water humanity uses, so feeding a growing population means moving water to fields. Dams store that water and make electricity, but they drown valleys, trap silt and change lives downstream.',
            concepts: [
                'Water scarcity arises because fresh water is under 3% of the world water, much of it locked in ice, while demand rises with population, farming and industry.',
                'Irrigation supplies water to crops through channels, sprinklers or drip systems; it can double or triple yields but wastes water when channels leak or floods evaporate.',
                'Salinisation is the accumulation of salts in irrigated soil as evaporation leaves salts behind, eventually making the soil infertile.',
                'Waterlogging saturates soil so roots cannot breathe, usually caused by over-irrigation in poorly drained land.',
                'Multipurpose dams store water for drinking and irrigation, generate hydroelectric power, control floods and support recreation and fishing.',
                'Dams impose costs: flooded farmland and settlements, loss of habitats, trapped silt that starves downstream farms and deltas, and changed river flow affecting downstream countries.'
            ],
            terms: [
                { t: 'Water scarcity', d: 'The shortage of fresh water to meet human, agricultural and industrial needs in a region, caused by low supply or high demand.' },
                { t: 'Irrigation', d: 'The artificial supply of water to crops by channels, sprinklers or drip systems to supplement rainfall.' },
                { t: 'Salinisation', d: 'The build-up of salts in soil as irrigation water evaporates, which eventually makes the soil infertile.' },
                { t: 'Waterlogging', d: 'The saturation of soil by over-irrigation so that air is excluded and crop roots cannot respire.' },
                { t: 'Multipurpose dam', d: 'A dam built to store river water for several uses at once, including water supply, irrigation, hydroelectric power and flood control.' },
                { t: 'Reservoir', d: 'An artificial lake behind a dam in which river water is stored for later use.' },
                { t: 'Desalination', d: 'The removal of salt from seawater to produce fresh water, an expensive process used in water-poor coastal countries.' },
                { t: 'Water conflict', d: 'Dispute between regions or countries over shared water resources, such as rivers crossing political boundaries.' }
            ],
            tip: 'In dam evaluations, group points by stakeholder (farmers, electricity users, people displaced, downstream countries) and finish with a justified overall judgement.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'A region uses 500 million litres of water per day and 80% goes to agriculture. Calculate the daily volume used for agriculture, and state two purposes for which a dam might be built.',
                    ans: 'Agricultural use = 80% of 500 million = 0.8×500 = 400 million litres per day (1). Method: convert the percentage to the decimal 0.8 and multiply by the total (1). Purposes, one mark each: water storage for drinking supply (1), irrigation of farmland / hydroelectric power generation / flood control (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A government proposes a large dam on a river shared with a neighbouring country. Evaluate the benefits and costs of the dam for different groups, and conclude whether you would support the project.',
                    ans: 'Benefits: farmers downstream of the reservoir gain reliable irrigation water, towns gain a drinking supply, and hydroelectric power provides cheap, low-carbon electricity for industry (1). Costs: villages and farmland are flooded, displacing people and destroying habitats; trapped silt starves downstream farms and deltas of nutrients, and altered flow harms the neighbouring country (1). Stakeholder view: the gains concentrate on cities and irrigators while the costs fall on displaced communities and the downstream nation, so the decision is unevenly shared (1). Conclusion: support the dam only if planners include silt-passing flows, compensation and a water-sharing agreement with the neighbour, because otherwise the long-term costs outweigh the benefits (1).'
                }
            ]
        },
        {
            n: 17,
            title: 'Oceans and Coasts - Pollution and Fisheries Management',
            card: 'Oil pollution of seas, how spills are managed and prevented, and strategies for keeping fisheries sustainable.',
            lead: 'The ocean feeds over a billion people, but oil spills and overfishing damage the ecosystems that fish depend on. The exam wants named strategies for both problems, each with a strength and a limitation.',
            concepts: [
                'Oil pollution reaches seas from tanker spills, ballast discharge, offshore drilling leaks and runoff from land; it coats birds and mammals, blocks light and damages coastal habitats including coral reefs.',
                'MARPOL is the international convention that regulates oil discharge from ships, including rules on tanker design and waste disposal.',
                'Prevention uses double-hulled tankers, stricter inspection and safer routing; response uses floating booms to contain slicks, skimmers to recover oil and detergents to disperse it, each with drawbacks.',
                'Overfishing removes fish faster than stocks can reproduce, shrinking populations and the catches that fishing communities depend on.',
                'Fisheries management tools include quotas, minimum mesh size, closed seasons and marine reserves, each protecting breeding or juvenile fish in a different way.',
                'Aquaculture farms fish and shellfish under controlled conditions, easing pressure on wild stocks but sometimes polluting coastal water and spreading disease.'
            ],
            terms: [
                { t: 'Oil pollution', d: 'Contamination of seawater by crude oil or refined products from spills, discharge or leaks, harming marine life and coastal habitats.' },
                { t: 'MARPOL', d: 'The international convention for the prevention of pollution from ships, regulating oil discharge and ship waste.' },
                { t: 'Double-hulled tanker', d: 'A tanker with two layers of hull so that an outer puncture does not release the cargo oil, reducing spill risk.' },
                { t: 'Bycatch', d: 'Non-target species, including young fish, dolphins and turtles, caught accidentally and often discarded dead.' },
                { t: 'Quota', d: 'A legal limit on the total catch, or catch per boat, set to keep fish stocks at sustainable levels.' },
                { t: 'Marine reserve', d: 'A sea area closed to fishing or other extraction so stocks and habitats can recover.' },
                { t: 'Aquaculture', d: 'The farming of fish, shellfish or seaweed in tanks, pens or ponds under controlled conditions.' },
                { t: 'Coral reef', d: 'A shallow warm-water ecosystem built by coral animals, rich in biodiversity but vulnerable to oil, sediment and warming seas.' }
            ],
            tip: 'Learn each strategy as a matched pair of benefit and limitation, for example quotas limit catches but are hard to police; named strategies such as MARPOL earn credit.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Describe four strategies used to prevent or manage oil pollution of the seas.',
                    ans: 'Any four valid strategies, one mark each: MARPOL rules limiting oil discharge from ships (1); double-hulled tankers reducing spill risk after collisions (1); floating booms containing a slick at sea (1); skimmers removing oil from the surface or detergents dispersing it, with care since detergents add their own toxicity (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A coastal fishery is collapsing from overfishing. Evaluate three management strategies that could restore the stocks, and conclude which you would prioritise.',
                    ans: 'Quotas cap the total catch so spawning stocks recover, but they are hard to enforce and can be set too high by political pressure (1). Closed seasons protect fish during breeding, cheap to run but they reduce short-term income for fishers and do not limit overall effort in open periods (1). Marine reserves ban fishing in key areas, letting stocks and habitats rebuild and spilling over into fished areas, but they displace fishers and need monitoring (1). Conclusion: combine a science-based quota with a breeding-season closure and at least one reserve, because no single tool protects both the adults and the young across the whole life cycle (1).'
                }
            ]
        },
        {
            n: 18,
            title: 'Environmental Impact Assessment, Legislation and International Agreements',
            card: 'How EIAs predict project damage, how laws enforce standards, and how treaties tackle global problems like ozone depletion.',
            lead: 'Development and conservation pull in opposite directions, so decision-makers need tools to see damage before it happens. EIAs, national laws and international agreements form the three lines of defence the syllabus expects you to evaluate.',
            concepts: [
                'An environmental impact assessment predicts the environmental effects of a proposed project, such as a dam, factory or road, before approval.',
                'An EIA surveys baseline conditions, predicts impacts on air, water, soil, wildlife and people, proposes mitigation, and invites public consultation before a decision.',
                'Legislation turns environmental aims into enforceable rules, such as limits on emissions or requirements for waste treatment, backed by inspections and penalties.',
                'International agreements coordinate action across borders because pollutants and wildlife do not respect boundaries; the Montreal Protocol banned CFCs and the ozone layer is recovering as a result.',
                'Agreements can be weakened by non-compliance, slow ratification, weak enforcement and unequal costs between rich and poor countries.',
                'Comparing treaties shows what makes them work: clear targets, universal membership, financial support for poorer nations and a reporting system with sanctions.'
            ],
            terms: [
                { t: 'Environmental impact assessment', d: 'A study, required before major projects are approved, that predicts environmental effects and proposes measures to reduce them.' },
                { t: 'Legislation', d: 'Laws passed by a government that set enforceable environmental standards, backed by inspection and penalties.' },
                { t: 'International agreement', d: 'A treaty between countries to coordinate action on a shared environmental problem, such as pollution or resource depletion.' },
                { t: 'Montreal Protocol', d: 'The 1987 international agreement that phased out CFCs and other ozone-depleting substances, leading to measurable ozone recovery.' },
                { t: 'Kyoto Protocol', d: 'The international agreement that set binding greenhouse-gas reduction targets for developed countries.' },
                { t: 'Carbon footprint', d: 'The total greenhouse gases, usually expressed as carbon dioxide equivalent, produced directly and indirectly by a person, product or activity.' },
                { t: 'CFC', d: 'Chlorofluorocarbon, a synthetic gas once used in aerosols and refrigeration that depletes the ozone layer.' },
                { t: 'Reforestation', d: 'The replanting of trees on land formerly forested, restoring habitats, storing carbon and reducing soil erosion.' }
            ],
            tip: 'For agreement-evaluation questions, always name one treaty and judge it against three tests: targets, enforcement and fairness between rich and poor countries.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'State the purpose of an environmental impact assessment and list three factors an EIA for a new factory would investigate.',
                    ans: 'Purpose: to predict the likely environmental effects of a proposed project before permission is granted, so harm can be avoided or reduced (1). Factors, one mark each: air and water pollution from the factory (1); effects on wildlife and habitats such as noise, land take or discharge (1); effects on local people, including health, noise, traffic and visual impact (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'International agreements are often described as weak because they are hard to enforce. Evaluate this claim using one named agreement, and conclude whether such agreements are worthwhile.',
                    ans: 'Named example: the Montreal Protocol phased out CFCs after scientists linked them to ozone depletion, and atmospheric CFC levels have since fallen, showing agreements can succeed (1). Weaknesses: some agreements have vague targets, slow ratification, and no strong penalties, as critics argue for parts of climate treaties, while costs fall unevenly on poorer countries (1). Strengths: they set common standards, share technology and finance, and create reporting systems that name and shame laggards (1). Conclusion: agreements are worthwhile but work only with clear targets, universal membership, financial help for poorer countries and regular reporting, so the claim is partly true yet overstated given the ozone success (1).'
                }
            ]
        }
    ]
};
