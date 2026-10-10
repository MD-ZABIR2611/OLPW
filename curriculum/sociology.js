// OLPW:curriculum/sociology.js | script for sociology
/* OLPW expansion curriculum — Sociology (CAIE 2251 companion chapters 15-18) */
module.exports = {
    chapters: [
        {
            n: 15,
            title: 'Research Methods in Depth',
            card: 'The strengths and limitations of experiments, surveys, interviews, observation and official statistics, and how sociologists judge research.',
            lead: 'Beyond naming the methods: how each research technique actually works, the reliability, validity and ethical problems each raises, and why sociologists often combine methods.',
            concepts: [
                'Experiments (laboratory) control variables to establish cause and effect, giving reliable, repeatable results, but the artificial setting produces low validity and the Hawthorne effect, as people change their behaviour when observed; field experiments are more natural but harder to control and raise ethical issues.',
                'Social surveys use questionnaires to collect large amounts of standardised data quickly and cheaply; representativeness depends on sampling — random, stratified or quota — but postal and online surveys suffer low response rates and samples may be unrepresentative.',
                'Structured interviews give comparable, reliable answers but pre-set questions miss unexpected depth; unstructured and informal interviews gain rich, valid insights but are time-consuming, costly and hard to compare; focus groups let members interact but one voice can dominate.',
                'Participant observation achieves high validity because the researcher shares the group\'s life and sees the world through its members\' eyes, but it is slow, raises practical and ethical problems, and small samples cannot be generalised; non-participant observation is more detached but behaviour alters when people know they are watched.',
                'Official statistics (crime rates, the census, exam results, unemployment figures) are free, large-scale and easy to compare over time, but governments define and collect them for their own purposes, categories change, and they record reported behaviour rather than actual behaviour — the dark figure of unrecorded crime.',
                'Research is judged by reliability (would repetition give the same results?), validity (does it measure what it claims?) and representativeness (do findings reflect the wider population?), together with ethical issues of consent, privacy and harm; triangulation combines methods so their strengths offset each other\'s weaknesses.'
            ],
            terms: [
                { t: 'Reliability', d: 'The extent to which a research method produces consistent results when repeated.' },
                { t: 'Validity', d: 'The extent to which a method measures what it claims to measure, capturing the true meaning of behaviour.' },
                { t: 'Hawthorne effect', d: 'The tendency of people to change their behaviour because they know they are being observed.' },
                { t: 'Representative sample', d: 'A small group chosen so that its social characteristics mirror those of the whole population studied.' },
                { t: 'Random sampling', d: 'A sampling method in which every member of the population has an equal chance of selection.' },
                { t: 'Official statistics', d: 'Quantitative data collected by government agencies, such as the census, crime figures and unemployment records.' },
                { t: 'Participant observation', d: 'A qualitative method in which the researcher joins the group being studied to see the world from its members\' point of view.' },
                { t: 'Triangulation', d: 'The use of two or more research methods together so their strengths offset each other\'s weaknesses.' }
            ],
            tip: 'Methods questions follow a fixed pattern: name the method, give one strength and one limitation of that specific method, then compare it briefly with another method — examiners reward matching the criticism to the method, such as low response rates for postal questionnaires but not for interviews.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'State two strengths and two limitations of using questionnaires in sociological research.',
                    ans: 'Strengths: questionnaires collect large amounts of standardised data quickly and cheaply, and closed questions make answers easy to compare and count (1). The data can be repeated by other researchers, giving reliability (1). Limitations: postal and online questionnaires often have low response rates, and respondents may not be representative of the whole population (1). Closed questions lack depth and validity, and wording can lead or confuse respondents (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Evaluate the use of official statistics as a source of data for sociologists studying crime.',
                    ans: 'Strengths: official crime statistics are free, cover the whole country and can be compared over time and between groups, making them convenient for measuring trends (1). Limitations: they record crimes reported to and recorded by the police, not all crimes — the dark figure of unrecorded crime is large, for example most thefts from person go unreported (1). Police practices, recording rules and government priorities change, so figures measure the activities of control agencies as much as offenders (1). Official statistics are still useful for large-scale comparison, and can be combined with victim surveys for validity (1). Overall they are a starting point that must be interpreted with care, not a true picture of crime (1).'
                }
            ]
        },
        {
            n: 16,
            title: 'Globalisation & Social Change',
            card: 'How global trade, migration and media link societies, and how globalisation transforms family life, identity, work and culture.',
            lead: 'Globalisation is the growing interconnection of societies through worldwide flows of goods, money, people, information and culture, and it is reshaping social institutions and personal identity.',
            concepts: [
                'Globalisation is the growing interdependence of societies through global flows of trade, finance, information, migration and culture, accelerated since the late twentieth century by satellite communication, the internet and cheap air travel.',
                'Economically, transnational corporations locate each stage of production where costs are lowest, creating jobs in developing economies but de-industrialising manufacturing regions of developed economies — the New International Division of Labour — and shifting employment into services.',
                'Culturally, Western media, brands, food and languages spread worldwide (cultural diffusion and homogenisation), producing a global culture; reactions include cultural hybridity, the mixing of global and local forms, and resistance such as defending local languages and traditions.',
                'Globalisation changes families and identity: migration and urbanisation alter household structures and gender roles, while global awareness lets individuals construct identity as a reflexive project, continually revised in Giddens\' term; diaspora communities maintain transnational family and cultural links across borders.',
                'Digital globalisation: social media connect people across borders instantly, enabling global social movements and new online communities, but also spreading misinformation and widening inequality of access between and within societies.',
                'Theoretical views differ: functionalists see globalisation as progressive integration and development; Marxists, following Wallerstein\'s world-systems theory, see a core exploiting a periphery with a semi-periphery between them; glocalisation describes global products adapted to local cultures, such as fast-food menus varying by country.'
            ],
            terms: [
                { t: 'Globalisation', d: 'The process by which societies become increasingly interconnected through worldwide flows of goods, capital, information, migration and culture.' },
                { t: 'Transnational corporation', d: 'A company that produces and sells in many countries, locating each stage of production where costs are lowest.' },
                { t: 'Cultural diffusion', d: 'The spread of cultural items such as ideas, styles, religions and technologies from one society to others.' },
                { t: 'Glocalisation', d: 'The adaptation of global products and practices to fit local cultures and tastes.' },
                { t: 'World-systems theory', d: 'Wallerstein\'s theory that the world economy is divided into an exploiting core, an exploited periphery and a semi-periphery between them.' },
                { t: 'Diaspora', d: 'A community of people dispersed from their original homeland who keep social and cultural ties across countries.' },
                { t: 'Social movement', d: 'A sustained, organised effort by large numbers of people outside government to promote or resist social change.' },
                { t: 'Cultural hybridity', d: 'The blending of global and local cultural forms to create new mixed cultural practices.' }
            ],
            tip: 'In globalisation essays, define the term first, give two concrete examples such as a transnational corporation, a diaspora or a global social movement, and end by weighing functionalist integration against Marxist exploitation before reaching a judgement.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Define globalisation and give three examples of how it affects everyday life.',
                    ans: 'Globalisation is the growing interconnection of societies through worldwide flows of trade, money, information, migration and culture (1). Examples: eating food and wearing clothes produced by transnational corporations from many countries (1). Communicating with family abroad instantly through the internet and social media (1). Working for or buying from foreign firms, and watching global films and music online (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Evaluate two ways in which globalisation has changed family life and social identity in modern societies.',
                    ans: 'Migration spreads families across countries, creating transnational households that keep in touch digitally and send remittances, so family membership no longer depends on living together (1). It also changes gender roles, as migrant women gain independent earnings and authority, though traditional expectations can also be reinforced (1). Identity becomes a reflexive project as individuals choose from global cultural options rather than inheriting a single local culture, which can strengthen hybrid identities but weaken traditional authority (1). The negative side: global media promote consumerism and can erode local languages and values, and the digital divide excludes the poor (1). Overall globalisation loosens traditional structures but creates new forms of belonging, and its effects depend on access and power (1).'
                }
            ]
        },
        {
            n: 17,
            title: 'Health, Medicine & the Sick Role',
            card: 'Parsons\' sick role, how class, gender and ethnicity shape health, the medical model, and debates about healthcare in society.',
            lead: 'Health and illness are social as well as biological: sociology examines the rights and duties of the sick person, why health chances are unequal, and how medicine is organised and criticised.',
            concepts: [
                'Parsons\' sick role (1951) defines the rights and duties of illness: the sick person is temporarily exempted from normal responsibilities and is not blamed for being ill, but in return must want to get well and must seek technically competent help, cooperating with the doctor.',
                'Critics argue the sick role fits acute physical illness better than chronic illness such as diabetes, mental illness, disability, or conditions like alcoholism where blame remains; not all patients adopt the role passively, and some exaggerate illness for gain.',
                'The medical (bio-medical) model explains disease as biological malfunction; critics such as the social model of health stress social causes — poverty, housing, work and environment — and accuse medicine of medicalising normal life stages such as childbirth and ageing.',
                'Health is socially patterned: lower social classes suffer higher rates of illness and earlier death because of worse housing, diet, dangerous work and poorer access to care; the Black Report (1980) documented these class health inequalities in Britain.',
                'Gender and ethnicity shape health too: women live longer than men in most societies yet report more illness; some diseases are more common in particular ethnic groups, and some groups face barriers such as language, discrimination or distrust of services.',
                'Healthcare varies between systems: insurance-based systems such as the USA leave many uninsured, while state-funded systems such as Britain\'s NHS aim at universal cover; complementary medicine (herbal remedies, acupuncture, faith healing) remains widely used, and globalisation spreads both disease and medical knowledge.'
            ],
            terms: [
                { t: 'Sick role', d: 'Parsons\' concept of the rights and obligations of a sick person: exemption from normal duties in exchange for trying to recover and seeking medical help.' },
                { t: 'Medicalisation', d: 'The process by which human conditions and behaviours come to be defined and treated as medical problems.' },
                { t: 'Social model of health', d: 'The view that health is shaped mainly by social conditions such as income, housing and work rather than by biology alone.' },
                { t: 'Morbidity rate', d: 'The rate of illness or disease in a population, usually expressed per 1 000 people per year.' },
                { t: 'Mortality rate', d: 'The number of deaths in a population, usually expressed per 1 000 people per year.' },
                { t: 'Life expectancy', d: 'The average number of years a person can expect to live from birth, based on current death rates.' },
                { t: 'Complementary medicine', d: 'Treatment such as herbal remedies, acupuncture or faith healing used alongside or instead of conventional biomedicine.' },
                { t: 'Health inequality', d: 'Systematic differences in health and access to healthcare between social classes, ethnic groups, genders or regions.' }
            ],
            tip: 'Sick-role questions reward using Parsons precisely: state the two rights and two obligations, then criticise with one clear example such as chronic illness or blame attached to addiction, to move from description into evaluation marks.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Describe Parsons\' sick role, including the rights and the duties it gives the sick person.',
                    ans: 'The sick person is exempted from normal responsibilities such as work or housework while ill (1). The sick person is not blamed or held responsible for their condition (1). In return the sick person must want to recover and try to get well (1). The sick person must seek technically competent help, usually from a doctor, and cooperate with treatment (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Evaluate the view that social class is the main cause of differences in health between social groups.',
                    ans: 'Lower social classes experience worse housing, poorer diets, more dangerous work and greater stress, and show higher rates of illness and earlier death — evidence such as the Black Report supports a strong class link (1). Class also affects access: the poor can afford less healthcare, health insurance or healthy food, so class influences health directly and indirectly (1). However, gender matters too — women live longer but report more illness — and ethnicity matters, through both genetic risk and discrimination (1). Class interacts with these: an educated middle-class woman has better health chances than a poor man regardless of gender or ethnicity (1). Overall class is a major, probably the strongest, single cause, but it works together with gender, ethnicity and age rather than alone (1).'
                }
            ]
        },
        {
            n: 18,
            title: 'Work, Unemployment & the Economy',
            card: 'How work shapes identity and class, the causes and social effects of unemployment, and how technology is changing employment.',
            lead: 'Employment is a major source of income, status and identity, and changes in the economy — deindustrialisation, women\'s employment, automation — reshape social life and inequality.',
            concepts: [
                'Work is activity that produces goods or services, usually for pay; unpaid work such as housework is still work, and paid employment is a major source of social identity, status and life chances in industrial societies.',
                'Employment is divided into primary (extractive, e.g. farming and mining), secondary (manufacturing), tertiary (services) and quaternary (knowledge and information) sectors; as economies develop, employment shifts from primary towards tertiary and quaternary work.',
                'Deindustrialisation — the long decline of manufacturing in many Western economies after the 1970s — destroyed skilled manual jobs and weakened the traditional working class, while service jobs grew, many of them part-time and low-paid.',
                'Marxists see wage labour as exploitation and alienation, separating workers from the product, the process, their fellow workers and their human potential; Braverman\'s deskilling thesis argues that machines and scientific management reduce workers\' skills and control.',
                'Unemployment takes forms such as frictional (between jobs), structural (declining industries), cyclical (recessions) and seasonal; its effects include poverty, debt, ill-health, family stress, loss of skills and status, stigma, and disadvantage passed to children — while functionalists argue unequal rewards motivate effort.',
                'Work is changing: women\'s employment has risen sharply since the 1960s, though a gender pay gap and a glass ceiling persist; automation, artificial intelligence and the gig economy of app-based short-term contracts are destroying some jobs, creating others, and increasing insecurity for many workers.'
            ],
            terms: [
                { t: 'Unemployment', d: 'The state of being without paid work while available for and actively seeking employment.' },
                { t: 'Deindustrialisation', d: 'The long-term decline of manufacturing industry and its replacement by service employment in an economy.' },
                { t: 'Alienation', d: 'Marx\'s concept of workers\' loss of control over their product, their labour, their fellow workers and their potential under capitalism.' },
                { t: 'Deskilling', d: 'The reduction of workers\' skill levels as machines and simplified management techniques take over complex tasks.' },
                { t: 'Gender pay gap', d: 'The difference between men\'s and women\'s average earnings, usually expressed as a percentage of men\'s pay.' },
                { t: 'Gig economy', d: 'A labour market of short-term, flexible jobs, often organised through apps, without permanent contracts or benefits.' },
                { t: 'Glass ceiling', d: 'An invisible barrier that prevents women and minorities from rising to senior positions despite their qualifications.' },
                { t: 'Life chances', d: 'Weber\'s term for the opportunities people have to obtain desirable things such as health, education and income, shaped by their social position.' }
            ],
            tip: 'Unemployment answers should link each economic fact to a social consequence — job loss leads to poverty, which harms health, family stability and children\'s education — because marks are awarded for each linked step in the chain, not for a bare list.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Define unemployment and describe three of its social consequences for individuals and families.',
                    ans: 'Unemployment means being without paid work while available for and actively seeking it (1). Loss of income causes poverty, debt and inability to afford housing, food or healthcare (1). Unemployment damages physical and mental health and can lead to loss of skills and status, making re-employment harder (1). It creates family stress, stigma and can disadvantage children\'s education, repeating disadvantage across generations (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Evaluate two effects of technological change on workers and on society.',
                    ans: 'Automation and artificial intelligence destroy routine jobs in manufacturing and clerical work, causing structural unemployment and insecurity, especially for less-skilled workers (1). Technology also creates new occupations in computing, logistics and services, and raises productivity and living standards over time (1). Work becomes more flexible through the gig economy, which suits some workers but replaces secure contracts with insecure, benefit-free jobs (1). Skills requirements rise, so workers need continual retraining, widening inequality between the educated and the uneducated (1). Overall technology increases national wealth but distributes its costs and benefits unevenly, so retraining and welfare support determine whether workers gain or lose (1).'
                }
            ]
        }
    ]
};
