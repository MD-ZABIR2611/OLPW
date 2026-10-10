// OLPW:curriculum/economics.js | script for economics
/* OLPW expansion curriculum — Economics (CAIE 2281 companion chapters 15-18) */
module.exports = {
    chapters: [
        {
            n: 15,
            title: 'National Income & the Macroeconomy',
            card: 'How GDP, GNP and national income statistics measure the size and growth of an economy, and why the figures must be used with care.',
            lead: 'Measuring the total output and income of an economy, distinguishing nominal from real values, and judging how far the statistics reflect real living standards.',
            concepts: [
                'Gross Domestic Product (GDP) measures the total value of goods and services produced within a country in one year, regardless of who owns the factors of production.',
                'Gross National Product (GNP) adds net property income from abroad to GDP, so it counts the income of a nation\'s residents wherever it is earned.',
                'Net National Product (NNP) = GNP minus depreciation (capital consumption), giving a truer picture of income available after replacing worn-out capital.',
                'Nominal GDP is measured at current prices; real GDP adjusts for inflation using a price index, so only changes in actual output are shown.',
                'GDP per head (per capita) divides total GDP by population and is the standard measure for comparing the size of economies or tracking growth in average income.',
                'National income statistics understate true economic welfare because they ignore unpaid work, the informal (hidden) economy, leisure, income distribution and environmental damage.'
            ],
            terms: [
                { t: 'Gross Domestic Product', d: 'The total market value of all final goods and services produced within a country\'s borders in one year.' },
                { t: 'Gross National Product', d: 'GDP plus net property income from abroad: the total income earned by a country\'s residents in one year.' },
                { t: 'Depreciation', d: 'The fall in value of capital equipment as it wears out; also called capital consumption, deducted from GNP to give NNP.' },
                { t: 'Real GDP', d: 'GDP measured at constant prices of a base year, with the effect of inflation removed.' },
                { t: 'Nominal GDP', d: 'GDP measured at current market prices, which rises with inflation even when output is unchanged.' },
                { t: 'GDP per capita', d: 'Total GDP divided by the population, giving average income per person used to compare living standards.' },
                { t: 'Hidden economy', d: 'Economic activity that is legal but not declared to the tax authorities, so it is missed by official GDP statistics.' },
                { t: 'Economic growth', d: 'An increase in the real output of an economy over time, usually shown by rising real GDP.' }
            ],
            tip: 'In data-response questions, always state whether you are using nominal or real figures before comparing GDP across years — examiners award a mark for noticing that rising nominal GDP can hide falling real output when inflation is high.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'A country\'s GDP is $400 billion, net property income from abroad is −$20 billion, and depreciation is $30 billion. Calculate GNP and NNP.',
                    ans: 'GNP = GDP + net property income from abroad = $400bn + (−$20bn) = $380bn (1). NNP = GNP − depreciation = $380bn − $30bn = $350bn (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Explain two reasons why a country with a high and rising GDP per capita might still have widespread poverty.',
                    ans: 'Distribution: average income per head says nothing about how income is shared — if growth accrues to a small wealthy group, the poor may see no benefit (1). Composition/non-monetary factors: GDP ignores the informal economy, unpaid work, leisure, health and education, and counts pollution and congestion costs as positive output, so welfare may not rise with GDP (1). Also accept: population growth can keep per-capita income low even when total GDP grows quickly.'
                }
            ]
        },
        {
            n: 16,
            title: 'Inflation & Unemployment in Depth',
            card: 'Measuring inflation and unemployment precisely, explaining their causes and consequences, and evaluating the policies governments use against them.',
            lead: 'Going beyond the definitions: how a consumer prices index is built, how unemployment is counted, and the demand-side and supply-side cures for each.',
            concepts: [
                'Inflation is a sustained rise in the general price level, measured year-on-year as the percentage change in a consumer prices index (CPI) weighted basket of goods and services.',
                'Demand-pull inflation results from total spending (AD) growing faster than output; cost-push inflation results from rising costs — wages, imported raw materials, oil, taxes — shifting supply left.',
                'Inflation redistributes arbitrarily (hurting savers, pensioners and lenders, helping borrowers), reduces international competitiveness, creates menu and shoe-leather costs, and can feed an inflationary wage-price spiral.',
                'Unemployment is measured as the percentage of the labour force without work but available and actively seeking it; the claimant count and labour force surveys give different figures.',
                'Cyclical (demand-deficient) unemployment follows recessions; structural unemployment follows declining industries or regions; frictional unemployment is the short gap between jobs; seasonal unemployment follows the calendar of industries like agriculture and tourism.',
                'Governments fight inflation with contractionary fiscal and monetary policy and supply-side measures to raise productivity; they fight unemployment with expansionary policy, retraining, regional support and reducing labour-market rigidities.'
            ],
            terms: [
                { t: 'Consumer Prices Index', d: 'A weighted average of the prices of a representative basket of goods and services, used to measure inflation against a base year.' },
                { t: 'Demand-pull inflation', d: 'Inflation caused by total demand for goods and services exceeding the economy\'s capacity to supply them.' },
                { t: 'Cost-push inflation', d: 'Inflation caused by increases in the costs of production, such as wages or imported raw materials, shifting aggregate supply left.' },
                { t: 'Labour force', d: 'All people of working age who are employed plus those who are unemployed but actively seeking work.' },
                { t: 'Structural unemployment', d: 'Unemployment caused by a long-term decline in an industry or region, leaving workers\' skills or location mismatched with available jobs.' },
                { t: 'Frictional unemployment', d: 'Short-term unemployment that occurs while workers move between jobs or enter the labour market.' },
                { t: 'Cyclical unemployment', d: 'Unemployment caused by a fall in total demand during the downturn of the business cycle.' },
                { t: 'Stagflation', d: 'The simultaneous occurrence of high inflation and high unemployment, usually triggered by an adverse supply shock.' }
            ],
            tip: 'When asked for consequences, separate them by group — effects on consumers, firms, savers and the government\'s budget each earn separate marks, and a balanced answer distinguishes the harm to lenders from the gain to borrowers.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'The CPI basket cost $200 in the base year and $210 one year later. Calculate the annual inflation rate and state which type of inflation is most likely if oil prices have risen sharply.',
                    ans: 'Inflation rate = ($210 − $200) / $200 × 100 = 5% (1). A sharp rise in oil prices raises production costs, so this is cost-push inflation (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A government wants to reduce structural unemployment. Evaluate two policy measures it could use, referring to likely effectiveness.',
                    ans: 'Retraining and education programmes move workers from declining industries into growing ones, directly attacking the skills mismatch; effective but slow and expensive, and older workers may not retrain (1). Regional incentives such as grants or tax relief for firms locating in depressed areas reduce geographical immobility; effective where jobs can be created locally, but firms may relocate again once incentives end (1). Accept also: improving information through job centres to cut frictional unemployment, or reducing welfare disincentives.'
                }
            ]
        },
        {
            n: 17,
            title: 'The Balance of Payments & Exchange Rates',
            card: 'The current and capital accounts, why exchange rates move, and how depreciation or appreciation ripples through prices, output and jobs.',
            lead: 'Reading a balance of payments statement, comparing fixed and floating exchange-rate systems, and tracing how a changing exchange rate affects the whole economy.',
            concepts: [
                'The balance of payments records all transactions between residents of a country and the rest of the world: the current account (trade in goods and services, income, transfers), the capital account, and the financial account.',
                'A current account deficit means a country imports more than it exports; financed by selling assets or borrowing, persistent deficits build up foreign debt and can signal weak competitiveness.',
                'Under a floating exchange rate the price of the currency is set by demand and supply in foreign exchange markets; under a fixed rate the government or central bank pegs the currency to another value and must hold reserves to defend it.',
                'Depreciation (a fall in the exchange rate) makes exports cheaper and imports dearer, boosting export volumes and domestic output while raising import prices and cost-push inflationary pressure.',
                'Appreciation does the reverse: cheaper imports dampen inflation and raise real purchasing power, but exports become dearer abroad, squeezing export industries and possibly employment.',
                'Governments manage exchange rates with interest-rate changes, foreign-currency intervention, and fiscal policy; each tool conflicts with other macroeconomic aims, which is why exchange-rate policy involves trade-offs.'
            ],
            terms: [
                { t: 'Current account', d: 'The section of the balance of payments recording trade in goods and services, primary income flows and transfers.' },
                { t: 'Balance of payments', d: 'A record of all economic transactions between the residents of one country and the rest of the world over a period of time.' },
                { t: 'Exchange rate', d: 'The price of one currency in terms of another, e.g. how many dollars one pound will buy.' },
                { t: 'Depreciation', d: 'A fall in the value of a currency under a floating exchange-rate system, making exports cheaper and imports more expensive.' },
                { t: 'Appreciation', d: 'A rise in the value of a currency under a floating exchange-rate system, making exports more expensive and imports cheaper.' },
                { t: 'Floating exchange rate', d: 'A system where the exchange rate is determined by the demand for and supply of the currency in foreign exchange markets.' },
                { t: 'Fixed exchange rate', d: 'A system where the government or central bank pegs the currency\'s value against another currency or gold and holds reserves to defend the peg.' },
                { t: 'Competitiveness', d: 'The ability of a country\'s goods and services to compete on price and quality in world markets.' }
            ],
            tip: 'For "effects of depreciation" questions, structure the answer as two chains: exports become cheaper so export demand, output and jobs rise; imports become dearer so import spending falls but cost-push inflation rises. Writing both chains earns full evaluation marks.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'A country\'s imports of goods and services total $120bn and its exports total $95bn. Calculate the balance on trade in goods and services and state whether it is a surplus or a deficit.',
                    ans: 'Balance = exports − imports = $95bn − $120bn = −$25bn (1). The negative figure is a trade deficit of $25 billion (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Evaluate two effects on a country\'s economy of an appreciation of its exchange rate.',
                    ans: 'Import prices fall, which lowers cost-push inflation and raises households\' real purchasing power, especially for imported food and fuel (1). However, exports become dearer in foreign markets so export volumes, output and employment in export industries fall, and the current account balance may worsen — the strength depends on the price elasticity of demand for exports (1).'
                }
            ]
        },
        {
            n: 18,
            title: 'Globalisation & Development Economics',
            card: 'Why the world economy is integrating through trade blocs, multinational companies and finance, and what helps developing economies catch up.',
            lead: 'The drivers and critics of globalisation, the institutions that manage world trade, and the policy choices open to governments of developing economies.',
            concepts: [
                'Globalisation is the growing integration of the world\'s economies through trade in goods and services, freer movement of capital and labour, and the spread of technology and multinational companies.',
                'Falling transport and communication costs, trade liberalisation, the growth of multinational companies and international financial flows are the main drivers of globalisation.',
                'The World Trade Organisation sets the rules of world trade and negotiates lower tariffs and quotas; trading blocs such as free trade areas and customs unions give members preferential access to each other\'s markets.',
                'Multinational companies bring investment, jobs, technology transfer and export earnings to host economies, but may repatriate profits, exploit labour, avoid tax and exert political influence.',
                'Developing economies typically share low GDP per capita, dependence on primary-product exports, rapid population growth, high debt burdens and weak infrastructure; development strategies include industrialisation, export promotion, education, and microfinance.',
                'Free trade raises world output through specialisation but creates winners and losers: infant industries may need temporary protection, and heavy dependence on one export commodity exposes an economy to volatile world prices.'
            ],
            terms: [
                { t: 'Globalisation', d: 'The process by which the world\'s economies become more integrated and interdependent through trade, capital flows and the spread of technology.' },
                { t: 'Multinational company', d: 'A firm that owns or controls production facilities in more than one country.' },
                { t: 'World Trade Organisation', d: 'The international body that sets the rules of world trade and promotes the reduction of tariffs and other barriers between members.' },
                { t: 'Trading bloc', d: 'A group of countries that agree to reduce or remove trade barriers between themselves, such as a free trade area or customs union.' },
                { t: 'Free trade area', d: 'A trading bloc where member countries remove tariffs and quotas between themselves but keep their own external tariffs.' },
                { t: 'Customs union', d: 'A trading bloc with free trade between members plus a common external tariff against non-members.' },
                { t: 'Microfinance', d: 'The provision of very small loans and basic financial services to poor entrepreneurs who lack access to banks.' },
                { t: 'Infant industry', d: 'A new domestic industry that cannot yet compete with established foreign rivals and may be granted temporary protection while it grows.' }
            ],
            tip: 'Development questions reward balance: for every benefit of a strategy (growth, jobs, export earnings) name a corresponding limitation (cost, debt, income inequality, environmental damage) and end with a supported judgement about which effect dominates.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'State three characteristics commonly shared by developing economies.',
                    ans: 'Any three of: low GDP per head (1); dependence on primary commodity exports (1); rapid population growth / high birth rates (1); high levels of poverty and unemployment (1); weak infrastructure and human capital (1); heavy foreign debt burden (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Evaluate the effects on a developing economy of hosting multinational companies.',
                    ans: 'Benefits: foreign direct investment creates jobs and raises incomes; technology and managerial skills transfer to local firms; export earnings and tax revenue increase (1). Drawbacks: profits are often repatriated rather than reinvested; MNCs may exert monopoly power, pay low wages, pollute, or relocate when costs rise, leaving dependency; tax avoidance reduces the fiscal benefit (1). A balanced conclusion weighs the employment and technology gains against profit leakage and dependency.'
                }
            ]
        }
    ]
};
