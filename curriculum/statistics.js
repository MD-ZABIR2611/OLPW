// OLPW:curriculum/statistics.js | script for statistics
/* OLPW expansion curriculum — Statistics (CAIE 4040 companion chapters 15-18) */
module.exports = {
    chapters: [
        {
            n: 15,
            title: 'Discrete Random Variables and Expectation',
            card: 'Probability distributions, E(X) and Var(X), and using expectation to decide whether a game is fair or profitable.',
            lead: 'A discrete random variable turns an experiment into a table of values and probabilities from which exact predictions follow. Expectation tells you the long-run average, which is how examiners test fairness and profit.',
            concepts: [
                'A discrete random variable X takes countable values x₁, x₂, ... with probabilities p₁, p₂, ... forming a probability distribution, and the probabilities must sum to exactly 1.',
                'The expectation is E(X) = Σxp, the long-run mean value of X over many repetitions of the experiment.',
                'Var(X) = E(X²) − [E(X)]² where E(X²) = Σx²p, so build a third row of x²p values before finishing.',
                'For a game, expected profit = expected winnings − cost to play; the game is fair when the expected net gain is 0.',
                'A probability function such as P(X = x) = kx for x = 1, 2, 3, 4 is completed by finding k from ΣP(X = x) = 1.',
                'Distributions may be displayed as a table, a graph of probability against value, or an algebraic function — the rules are identical.'
            ],
            terms: [
                { t: 'Random variable', d: 'A variable whose value is a numerical outcome of a random experiment, usually denoted by an uppercase letter such as X.' },
                { t: 'Probability distribution', d: 'A table, graph or formula listing each value of a discrete random variable together with its probability, with the probabilities summing to 1.' },
                { t: 'Expectation', d: 'The long-run average value E(X) = Σxp of a random variable, found by multiplying each value by its probability and summing.' },
                { t: 'Variance', d: 'A measure of spread of a random variable, calculated as Var(X) = E(X²) − [E(X)]², with units of the variable squared.' },
                { t: 'Fair game', d: 'A game in which the expected net gain of a player is zero, so neither player wins or loses on average over many plays.' },
                { t: 'Expected profit', d: 'The mean profit of a venture, equal to expected revenue minus cost, used to decide whether a game, policy or project is worth running.' },
                { t: 'Sum of probabilities', d: 'The rule that the probabilities of all possible values of a discrete random variable add to exactly 1, used to find unknown constants.' },
                { t: 'Probability function', d: 'A formula P(X = x) = f(x) giving the probability of each value of a discrete random variable, valid only when every value lies between 0 and 1.' }
            ],
            tip: 'In any distribution question, write Σp = 1 as your first line to earn the method mark, and keep probabilities as exact fractions until the final answer.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'A discrete random variable X has distribution: x = 0, 1, 2 with P(X = x) = 0.2, 0.5, 0.3. Find E(X), E(X²) and Var(X).',
                    ans: 'E(X) = Σxp = 0×0.2 + 1×0.5 + 2×0.3 = 0.5 + 0.6 = 1.1 (1). E(X²) = Σx²p = 0×0.2 + 1×0.5 + 4×0.3 = 0.5 + 1.2 = 1.7 (1). Var(X) = E(X²) − [E(X)]² = 1.7 − 1.1² = 1.7 − 1.21 = 0.49 (1). Check: Σp = 0.2 + 0.5 + 0.3 = 1 (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A game costs 3 dollars to play. A player wins 5 dollars with probability 0.2, 2 dollars with probability 0.3, and nothing otherwise. Determine, with reasons, whether the game is fair.',
                    ans: 'Expected winnings = 5×0.2 + 2×0.3 + 0×0.5 = 1 + 0.6 = 1.6 dollars (1). Net gains are 5 − 3 = 2, 2 − 3 = −1 and 0 − 3 = −3 dollars (1). Expected net gain = 2×0.2 + (−1)×0.3 + (−3)×0.5 = 0.4 − 0.3 − 1.5 = −1.4 dollars (1). Since the expected net gain is not 0, the game is not fair; it favours the organiser, who gains 1.4 dollars per play on average (1).'
                }
            ]
        },
        {
            n: 16,
            title: 'Transformations of Mean and Standard Deviation',
            card: 'How adding a constant or multiplying by a constant rescales the mean, variance and standard deviation of a data set.',
            lead: 'Coded and combined data appear constantly in 4040. Multiplying by 3 multiplies the spread by 3, but adding 5 merely shifts every value without changing the spread.',
            concepts: [
                'If every value is transformed to y = ax + b, then the new mean is a×(old mean) + b and the new standard deviation is |a|×(old standard deviation).',
                'Adding a constant shifts the mean but leaves the standard deviation and variance unchanged because distances between values do not change.',
                'Multiplying by a constant multiplies the standard deviation by its absolute value and the variance by its square.',
                'For combined data from two groups, the overall mean is the weighted mean (n₁x̄₁ + n₂x̄₂)/(n₁ + n₂), not the simple average of the two means.',
                'The total of a set of values is Σx = n×x̄, the key link between summary statistics and raw sums.',
                'Coding with y = (x − a)/b simplifies awkward means before reversing the transformation to return to the original scale.'
            ],
            terms: [
                { t: 'Linear transformation', d: 'A change of scale of the form y = ax + b applied to every value in a data set, shifting and rescaling the distribution.' },
                { t: 'Coding', d: 'The use of a simple transformation such as y = (x − a)/b to make calculation of the mean and standard deviation easier.' },
                { t: 'Mean', d: 'The arithmetic average of a set of values, equal to the sum of the values divided by the number of values.' },
                { t: 'Variance', d: 'The mean squared deviation from the mean, measuring spread in squared units, with s² = Σ(x − x̄)²/n for raw data.' },
                { t: 'Standard deviation', d: 'The positive square root of the variance, measuring spread in the same units as the data.' },
                { t: 'Sum of values', d: 'The total Σx of all values in a set, recovered from the mean by multiplying the mean by the number of values.' },
                { t: 'Deviation from the mean', d: 'The difference x − x̄ between a value and the mean, used in the definition of variance and standard deviation.' },
                { t: 'Combined data set', d: 'Two or more groups merged into one, whose total mean and standard deviation must be recomputed from the raw sums of each group.' }
            ],
            tip: 'Before combining two classes, write Σx = n×x̄ for each group separately; adding constants never changes the standard deviation, multiplying always does.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'A data set has mean 8 and standard deviation 2. Each value x is transformed to y = 3x + 5. Find the new mean and the new standard deviation.',
                    ans: 'New mean = 3×8 + 5 = 24 + 5 = 29 (1). Multiplying by 3 multiplies the standard deviation by 3, and adding 5 does not change it (1). New standard deviation = 3×2 = 6 (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Class A has 20 students with mean mark 64; class B has 30 students with mean mark 76. Find the mean mark of the combined group of 50 students and explain why it is not 70.',
                    ans: 'Total for A = 20×64 = 1280 and total for B = 30×76 = 2280 (1). Combined total = 1280 + 2280 = 3560 (1). Combined mean = 3560/50 = 71.2 (1). It is not 70 because the groups have different sizes; the mean is weighted towards class B, which has more students and the higher mean (1).'
                }
            ]
        },
        {
            n: 17,
            title: 'Crude and Standardised Rates',
            card: 'Crude birth and death rates per thousand, and how direct standardisation removes bias when comparing populations of different age structures.',
            lead: 'Crude rates divide by total population, so an older town can look sicker than a younger one. Direct standardisation re-expresses both towns against one standard population to allow a fair comparison.',
            concepts: [
                'A crude rate per thousand is (number of events/total population)×1000, used for birth rates, death rates and fertility rates.',
                'An age-specific rate restricts both events and population to one age band, such as deaths of people aged 60-69 divided by the population of that band.',
                'Crude rates mislead when the populations have different age structures, because older populations naturally have more deaths per thousand people.',
                'Direct standardisation applies each population age-specific rate to a standard population and divides the total expected events by the total standard population, then ×1000.',
                'Standardised rates can rank two populations differently from crude rates; the reversal must be explained by differences in age structure.',
                'Other exam rates include fertility rate per thousand women of childbearing age and accident rates per thousand or per million workers.'
            ],
            terms: [
                { t: 'Crude death rate', d: 'The number of deaths in a population in a year divided by the total population, usually expressed per thousand people.' },
                { t: 'Crude birth rate', d: 'The number of live births in a year divided by the total population, usually expressed per thousand people.' },
                { t: 'Standardised rate', d: 'A rate computed by applying a population age-specific rates to one standard population, allowing fair comparison between populations.' },
                { t: 'Standard population', d: 'A single reference population with fixed age-group sizes used as the basis for direct standardisation.' },
                { t: 'Age-specific rate', d: 'A rate calculated within one age group, dividing events in that group by the population of the same group.' },
                { t: 'Fertility rate', d: 'The number of live births per thousand women of childbearing age in a given year.' },
                { t: 'Accident rate', d: 'The number of accidents divided by the number of workers or hours worked, often expressed per thousand or per million.' },
                { t: 'Direct standardisation', d: 'The method of multiplying each standard-population age-group size by the corresponding age-specific rate and dividing the total expected events by the total standard population.' }
            ],
            tip: 'Lay standardisation out in a table with columns for the standard population, each age-specific rate and the expected number of events; the (1) marks follow the columns.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'A town of 50 000 people records 400 deaths in one year. Calculate the crude death rate per 1000 of the population, and state two purposes for which a dam might be built.',
                    ans: 'Crude death rate = (400/50 000)×1000 = 400×1000/50 000 = 8 per 1000 (1). A dam provides water storage for drinking and irrigation supplies (1) and hydroelectric power generation / flood control (1). The unit per 1000 must be stated for full credit (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Town A has 5000 young people with death rate 4 per 1000 and 5000 old people with death rate 16 per 1000. Town B has 8000 young at 5 per 1000 and 2000 old at 20 per 1000. Using the standard population of 6000 young and 4000 old, show that standardisation reverses the ranking given by the crude rates.',
                    ans: 'Crude A = (5000×4 + 5000×16)/10 000 = (20 + 80)/10 = 10 per 1000 (1). Crude B = (8000×5 + 2000×20)/10 000 = (40 + 40)/10 = 8 per 1000, so B looks healthier (1). Standardised A = (6000×4 + 4000×16)/10 000 = (24 + 64)/10 = 8.8 per 1000 (1). Standardised B = (6000×5 + 4000×20)/10 000 = (30 + 80)/10 = 11 per 1000 (1). The ranking reverses because Town B is older: once age structure is removed, Town A actually has the lower underlying mortality (1).'
                }
            ]
        },
        {
            n: 18,
            title: 'The Statistical Enquiry Cycle and Exam Practice',
            card: 'Planning an investigation end to end: hypothesis, sampling, data collection, presentation, analysis and interpretation, plus exam technique for the 4040 paper.',
            lead: 'Every 4040 exam weaves the enquiry cycle into extended questions. Marks flow from planning before you collect, and from interpreting after you calculate, never from the calculation alone.',
            concepts: [
                'A statistical enquiry moves through stages: state the hypothesis, define the population, design the data collection, collect the data, present and analyse it, then interpret and conclude.',
                'The sampling frame is the list of population members from which a sample is drawn; a random sample gives every member an equal chance of selection.',
                'A pilot survey is a small trial run used to test a questionnaire, timing and procedures before the main data collection.',
                'Well-designed questionnaire questions are specific, unambiguous, non-leading, offer exhaustive and non-overlapping response boxes, and avoid asking for information respondents cannot recall.',
                'Bivariate data are presented on a scatter diagram with the line of best fit; correlation describes the direction and strength of a relationship, not its cause.',
                'Interpretation should answer the original hypothesis, acknowledge limitations such as sample size or bias, and avoid extrapolating beyond the observed range.'
            ],
            terms: [
                { t: 'Statistical enquiry', d: 'The full process of planning, collecting, presenting, analysing and interpreting data in order to answer a question or test a hypothesis.' },
                { t: 'Hypothesis', d: 'A clear statement about a population, made before data collection, that the investigation will support or refute.' },
                { t: 'Population', d: 'The complete set of individuals or items about which information is required in an investigation.' },
                { t: 'Sampling frame', d: 'The physical list of population members from which a random sample is selected.' },
                { t: 'Pilot survey', d: 'A small-scale trial of a survey used to check that questions, layout and procedures work before the main collection.' },
                { t: 'Leading question', d: 'A question phrased so that it suggests a particular answer, producing biased data that must be avoided in questionnaires.' },
                { t: 'Non-response', d: 'The failure of some selected individuals to reply, which can bias results if non-respondents differ from respondents.' },
                { t: 'Extrapolation', d: 'Estimating values beyond the range of the observed data using a fitted line, which is unreliable because the pattern may not continue.' }
            ],
            tip: 'In plan-a-survey questions, earn marks by naming the population, the sampling method, the variables to record and the diagram you will draw, in that order.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'List four features of a well-designed questionnaire question, and name the stage of the enquiry cycle in which a small trial run of the questionnaire takes place.',
                    ans: 'Any four features, one mark each: questions are clear and specific (1); questions are not leading (1); response boxes are exhaustive and do not overlap (1); the question does not rely on memory over too long a period (1). The trial run is the pilot survey, carried out at the planning stage before main data collection (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A researcher wants to investigate whether hours of revision are associated with exam marks among the 800 students of a school. Describe a suitable plan covering population, sampling, data collection, presentation and interpretation.',
                    ans: 'Population: the 800 students of the school; draw a named random sample, for example 60 students, using the school roll as the sampling frame and random numbers (1). Collect paired data: hours of revision and exam mark for each sampled student, keeping definitions consistent, after piloting the data-collection sheet (1). Present the paired data on a scatter diagram, draw the line of best fit and comment on the direction and strength of correlation (1). Interpret: state whether the evidence supports the hypothesis of positive association, note limitations such as sample size, other influencing factors and the danger of claiming causation or extrapolating beyond the observed range (1).'
                }
            ]
        }
    ]
};
