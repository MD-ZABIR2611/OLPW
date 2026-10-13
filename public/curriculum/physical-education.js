// OLPW:curriculum/physical-education.js | script for physical-education
/* OLPW expansion curriculum — Physical Education (CAIE 0413 companion chapters 15-18) */
module.exports = {
    chapters: [
        {
            n: 15,
            title: 'Exercise Physiology: Acute and Chronic Responses',
            card: 'Immediate and long-term responses to exercise: acute changes during a session, chronic adaptations from training, and how to measure them.',
            lead: 'The body responds in the moment and adapts over months: distinguishing acute responses from chronic adaptations explains how training improves performance and why fitness fades when training stops.',
            concepts: [
                'Acute responses are immediate, short-term changes during a single bout of exercise: heart rate rises from about 70 towards 200 bpm, cardiac output climbs from about 5 to over 20 litres per minute, breathing rate and depth increase, and body temperature rises.',
                'The anticipatory rise in heart rate before exercise begins is driven by adrenaline release and neural stimulation from the brain; during exercise, chemoreceptors detecting carbon dioxide and hydrogen ions, and proprioceptors signalling movement, drive the cardio-respiratory increases.',
                'Oxygen deficit occurs at the start of exercise because the aerobic energy system responds too slowly to meet demand; afterwards EPOC (excess post-exercise oxygen consumption) repays that debt, restoring ATP, phosphocreatine and oxygen stores and helping clear lactic acid.',
                'Chronic adaptations to endurance training include resting bradycardia (a resting heart rate as low as 40 bpm), increased stroke volume, capillarisation of trained muscle and a higher mitochondrial density, improving the delivery and use of oxygen.',
                'Strength training causes muscle hypertrophy — fibres grow as actin and myosin filaments thicken — while tendons strengthen and bone density increases; the principle of reversibility warns that these adaptations fade within weeks of detraining.',
                'Aerobic capacity (VO2 max), the maximum volume of oxygen the body can use per minute, rises with training as the heart pumps more blood and the muscles extract more oxygen, making it the key physiological marker of endurance fitness.'
            ],
            terms: [
                { t: 'Acute response', d: 'An immediate, short-term physiological change during a single bout of exercise, such as raised heart rate and breathing rate.' },
                { t: 'Chronic adaptation', d: 'A long-term physiological change resulting from repeated training, such as lower resting heart rate or muscle hypertrophy.' },
                { t: 'Cardiac output', d: 'The volume of blood pumped by the heart each minute, calculated as heart rate multiplied by stroke volume.' },
                { t: 'Stroke volume', d: 'The volume of blood ejected by the left ventricle in one heartbeat, which increases with endurance training.' },
                { t: 'Oxygen deficit', d: 'The gap at the start of exercise between the oxygen the aerobic system can supply and the oxygen the working muscles demand.' },
                { t: 'EPOC', d: 'Excess post-exercise oxygen consumption: the elevated oxygen use after exercise that repays the oxygen deficit and restores energy and oxygen stores.' },
                { t: 'Hypertrophy', d: 'The increase in muscle fibre size caused by repeated resistance training, as actin and myosin filaments thicken.' },
                { t: 'VO2 max', d: 'The maximum volume of oxygen the body can take in, transport and use per minute, measured in ml/kg/min, a key indicator of endurance fitness.' }
            ],
            tip: 'Structure responses-to-exercise answers by timescale: list acute changes during the session, then chronic adaptations after weeks of training; always give values where you know them, e.g. cardiac output rising from 5 to over 20 litres per minute, as specific data earns application marks.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Define cardiac output, give the formula used to calculate it, and state one acute response and one chronic adaptation to endurance training.',
                    ans: 'Cardiac output is the volume of blood pumped by the heart each minute (1). Formula: heart rate multiplied by stroke volume (1). Acute response: heart rate and breathing rate rise during exercise (1). Chronic adaptation: resting bradycardia, or increased stroke volume and capillarisation, after weeks of training (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Explain the difference between oxygen deficit and EPOC, and why a sprinter keeps breathing hard after crossing the finish line.',
                    ans: 'At the start of intense exercise the aerobic system cannot supply ATP fast enough, so anaerobic systems cover the shortfall; this shortfall is the oxygen deficit (1). EPOC is the elevated oxygen consumption afterwards that repays the deficit, restoring ATP and phosphocreatine and the oxygen stores in muscle and blood (1). EPOC also supports the removal of lactic acid and the cooling of an elevated body temperature (1). Breathing and heart rate stay high after a sprint because these recovery processes still demand oxygen until the stores are replaced and waste products cleared (1).'
                }
            ]
        },
        {
            n: 16,
            title: 'Biomechanics in Sport',
            card: 'Forces in sport: centre of mass and stability, friction, drag and projectiles, and how athletes manipulate them to gain an advantage.',
            lead: 'Sport is applied physics: pushes and pulls, balance, grip, air resistance and the flight of a ball all follow mechanical rules that performers exploit deliberately.',
            concepts: [
                'A force is a push or pull that can start, stop, change the speed or direction of, or deform a body; in sport forces come from muscles (internal) and from gravity, friction, air resistance and reaction forces (external).',
                'Newton\'s third law — every action has an equal and opposite reaction — explains propulsion: a sprinter drives backwards against the starting blocks and the ground, and the ground pushes the athlete forwards with an equal and opposite reaction force.',
                'The centre of mass is the point where the body\'s mass is balanced; its height, together with the size of the base of support and the body\'s mass, determines stability, which tacklers, gymnasts and wrestlers manipulate deliberately.',
                'Friction between shoe and surface provides the grip needed for acceleration and changes of direction; too little causes slipping, while excessive friction wastes energy in endurance events, hence different stud patterns for dry and wet pitches.',
                'Air resistance (drag) and water resistance oppose motion at higher speeds; streamlining the body and equipment, drafting behind opponents and aerodynamic suits and helmets all reduce drag.',
                'Projectiles follow a curved path set by the speed, angle and height of release plus gravity and air resistance; a release angle near 45 degrees gives maximum range, adjusted slightly below 45 degrees for shots released above landing level, as in the shot put.'
            ],
            terms: [
                { t: 'Force', d: 'A push or pull that changes the motion, speed, direction or shape of a body, measured in newtons.' },
                { t: 'Centre of mass', d: 'The point at which a body\'s mass is considered concentrated and about which it balances.' },
                { t: 'Base of support', d: 'The area enclosed by the points of contact between the body and the ground, which with mass and centre-of-mass height determines stability.' },
                { t: 'Stability', d: 'The resistance of a body to being overturned, increased by a wider base of support, a lower centre of mass and greater mass.' },
                { t: 'Friction', d: 'A force between two surfaces that resists sliding, useful for grip in sport but wasteful when it opposes motion.' },
                { t: 'Drag', d: 'Air or water resistance opposing the motion of a body, which increases with speed and is reduced by streamlining.' },
                { t: 'Streamlining', d: 'Shaping the body or equipment into a smooth, narrow form to reduce drag from air or water.' },
                { t: 'Projectile', d: 'A body projected into the air whose range depends on its release speed, release angle and release height.' }
            ],
            tip: 'Answer how-to-improve-stability with the three controls — widen the base, lower the centre of mass, increase mass — one mark each, then apply them by naming a sporting example such as a rugby scrum or wrestling stance.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'State two ways an athlete can increase their stability and one way friction helps a sprinter.',
                    ans: 'Any two: widen the base of support (1); lower the centre of mass (1); increase body mass (1). Friction gives grip between the spikes and the track, so the sprinter can push back against the ground without slipping and accelerate forwards (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Using Newton\'s third law, explain how a swimmer propels themselves through the water, and how streamlining reduces drag.',
                    ans: 'Newton\'s third law states that every action has an equal and opposite reaction (1). The swimmer pushes backwards on the water with their hands and feet, and the water pushes forwards on the swimmer with an equal and opposite reaction force, driving them through the pool (1). Streamlining makes the body long, narrow and horizontal, reducing the turbulent wake and pressure drag around it (1). With less drag, less of the swimmer\'s force is wasted overcoming resistance, so more of each stroke converts into forward speed (1).'
                }
            ]
        },
        {
            n: 17,
            title: 'Performance Analysis and Talent Development',
            card: 'Notational analysis, performance indicators and goal-setting, and the talent pathways that move performers from club to national level.',
            lead: 'Modern coaching runs on evidence: observing and measuring performance, setting structured goals, and guiding talented performers along organised pathways to the top.',
            concepts: [
                'Notational (performance) analysis turns observation into numbers — passes completed, distance covered, shots on target — so training and tactics can be based on evidence rather than impression.',
                'Quantitative data such as heart rate, split times and possession percentages is measured numerically, while qualitative data such as technique observation and decision-making quality is described subjectively; strong analysis combines both.',
                'Goal-setting theory directs improvement: SMART goals are Specific, Measurable, Achievable, Realistic and Time-bound, and process goals about technique and effort are more controllable, and so more effective, than outcome goals such as winning.',
                'Target-setting references standards: performance indicators are benchmarked against norms or previous performances, and a performance profile visually rates a performer\'s abilities to highlight priority areas.',
                'Talent development pathways move performers from school and club sport through representative, regional and national squads, supported by academies and long-term athlete development models that build physical, technical and psychological skills progressively.',
                'Talent identification uses testing such as sprint speed, aerobic capacity and strength alongside coach observation, but early specialisation carries risks of burnout and dropout, so multi-sport development is often recommended for children.'
            ],
            terms: [
                { t: 'Notational analysis', d: 'The systematic recording of events and actions during performance, such as passes or shots, to produce objective data for improving training and tactics.' },
                { t: 'Performance indicator', d: 'A measurable factor used to judge performance, such as possession percentage, completion rate or distance covered.' },
                { t: 'Quantitative data', d: 'Numerical performance data such as times, distances, heart rates and scores, which can be measured and compared statistically.' },
                { t: 'Qualitative data', d: 'Descriptive, non-numerical information about performance, such as observations of technique, balance or decision-making.' },
                { t: 'SMART goal', d: 'A target that is Specific, Measurable, Achievable, Realistic and Time-bound, used to structure effective training goals.' },
                { t: 'Process goal', d: 'A goal about the performer\'s own actions and technique, e.g. following through on a shot, which the performer can control directly.' },
                { t: 'Talent pathway', d: 'The structured route by which performers progress from school and club level through regional and national squads and academies.' },
                { t: 'Performance profile', d: 'A visual chart rating a performer\'s abilities across a range of qualities, agreed with the coach, used to identify strengths and priority areas.' }
            ],
            tip: 'When asked how analysis improves performance, write the full chain: data collected as a named indicator, compared with a benchmark, weakness identified, specific training target set, then re-tested to measure improvement; each link is a mark.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Define notational analysis and give two examples of quantitative performance data a coach might collect.',
                    ans: 'Notational analysis is the systematic recording of events and actions during performance to produce objective data (1). Example 1: number of passes completed or shots on target (1). Example 2: distance covered, split times or heart rates (1). It turns observation into numbers so training and tactics can be based on evidence rather than impression (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Evaluate the use of quantitative versus qualitative data when analysing a team\'s performance, justifying when each is most useful.',
                    ans: 'Quantitative data is objective and comparable: pass completion percentages or distance covered reveal patterns and can be tracked over time (1). However, it can miss context, since a completed pass may still be slow or the wrong choice, so numbers alone can mislead (1). Qualitative data, such as a coach\'s observation of technique or decision-making, captures quality and context that numbers miss (1). But it is subjective and hard to compare fairly between different observers (1). Strongest conclusion: the two complement each other, with quantitative data identifying what happened and qualitative analysis explaining why, so good analysis combines both (1).'
                }
            ]
        },
        {
            n: 18,
            title: 'Contemporary Issues in Sport',
            card: 'Drugs and doping, officiating technology such as VAR and Hawk-Eye, hosting mega-events, and the ethics of fair play in modern sport.',
            lead: 'Sport today is shaped by science, money and ethics: doping controls, video technology, mega-event hosting and the commercial pressures that test fair play.',
            concepts: [
                'Doping is the use of banned substances or methods to gain an advantage; WADA publishes the Prohibited List, and blood and urine tests detect anabolic steroids (muscle growth), EPO (endurance) and stimulants, with penalties including long bans and stripped medals.',
                'Performance-enhancing drugs damage health — steroids harm the liver and heart and stunt growth in adolescents, while EPO thickens the blood and raises the risk of clots — and they undermine fair competition, which is why detection and education are prioritised.',
                'Technology transforms officiating: VAR lets football referees review key decisions on video, Hawk-Eye tracks the ball\'s path in tennis and cricket, and goal-line technology confirms whether the ball crossed the line, improving accuracy but sometimes slowing play and sparking debate over the spirit of the game.',
                'Hosting mega-events such as the Olympic Games and FIFA World Cup can regenerate cities, boost tourism, trade and national pride, and inspire participation, but costs billions, can displace communities and may leave underused venues; the legacy depends on planning and reuse.',
                'Ethics and fair play extend to match-fixing, gambling, cheating and abuse of officials; governing bodies enforce codes of conduct, and campaigns promote respect, inclusion and sporting behaviour at every level.',
                'Commercialisation and media money grow sport\'s income and global reach, but concentrate wealth in elite leagues, shift scheduling to suit television, and can price out local fans or widen inequality between rich and poor clubs and nations.'
            ],
            terms: [
                { t: 'Doping', d: 'The use of prohibited substances or methods to enhance performance, banned because it harms health and breaks fair-play rules.' },
                { t: 'WADA', d: 'The World Anti-Doping Agency, which coordinates the fight against doping worldwide, including the Prohibited List and testing standards.' },
                { t: 'Anabolic steroid', d: 'A synthetic drug that mimics testosterone to increase muscle mass and strength, with harmful side effects, banned in sport.' },
                { t: 'EPO', d: 'Erythropoietin, a hormone drug that raises red blood cell production to improve endurance, misused as a banned performance-enhancing drug.' },
                { t: 'VAR', d: 'Video Assistant Referee: football technology in which match officials review key decisions using video replays to improve accuracy.' },
                { t: 'Hawk-Eye', d: 'A ball-tracking computer system using multiple cameras to predict a ball\'s path, used for line decisions in tennis, cricket and other sports.' },
                { t: 'Legacy', d: 'The long-term benefits and costs of hosting a major sporting event, including venues, participation, tourism and urban regeneration.' },
                { t: 'Fair play', d: 'The ethical principle of competing honestly, respecting rules, officials and opponents, and accepting results without cheating.' }
            ],
            tip: 'Contemporary-issues essays are marked by argument plus example: name the issue, give a specific example such as a named drug, VAR or a particular Games, and end with a justified judgement; one-sided answers cap out in the lower bands.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Name two performance-enhancing drugs or doping methods and one piece of officiating technology, stating its purpose.',
                    ans: 'Any two: anabolic steroids for muscle growth (1); EPO to boost red blood cell production and endurance (1); blood doping or stimulants (1). Technology: VAR, which uses video replays to review key decisions, or Hawk-Eye, which tracks the ball for line calls (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Evaluate the arguments for and against a country hosting a mega-event such as the Olympic Games, reaching a supported conclusion.',
                    ans: 'For: hosting can regenerate cities with new venues and transport, boost tourism, trade and national pride, and inspire mass participation in sport (1). It showcases the country globally and can fast-track infrastructure that benefits residents for decades (1). Against: costs run into billions and frequently overrun, leaving debts and underused white-elephant venues (1). Communities may be displaced by construction, and the environmental cost of building and visitor travel is high (1). Conclusion: with realistic budgeting, legacy planning and reuse of venues the benefits can outweigh the costs, but without them hosts are left with debt and empty stadiums, so the quality of planning decides the verdict (1).'
                }
            ]
        }
    ]
};
