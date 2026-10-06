/* OLPW expansion curriculum — Mathematics (CAIE 0580 companion chapters 15-18) */
module.exports = {
    chapters: [
        {
            n: 15,
            title: 'Functions in Depth',
            card: 'Composite functions, inverse functions and the domain restrictions that make an inverse possible.',
            lead: 'Functions are machines that map inputs to outputs, and examiners test whether you can chain machines together and run them backwards. The key insight is that only one-to-one functions have inverses.',
            concepts: [
                'A function maps each input in its domain to exactly one output; the set of outputs is the range.',
                'The composite function fg means g first, then f, so fg(x) = f(g(x)); the order matters and fg rarely equals gf.',
                'The inverse function f⁻¹ reverses f, so f⁻¹f(x) = x for every x in the domain.',
                'To find an inverse, write y = f(x), swap x and y, then make y the subject.',
                'A function has an inverse only when it is one-to-one; f(x) = x² fails because both 3 and −3 map to 9, so the domain must be restricted, for example to x ≥ 0.',
                'The graph of f⁻¹ is the reflection of the graph of f in the line y = x, which makes domains and ranges swap roles.'
            ],
            terms: [
                { t: 'Function', d: 'A rule that maps each value of the input variable to exactly one value of the output variable.' },
                { t: 'Domain', d: 'The set of all allowed input values of a function.' },
                { t: 'Range', d: 'The set of all output values a function actually produces as the input takes every value in the domain.' },
                { t: 'Inverse function', d: 'The function f⁻¹ that reverses f, mapping each output back to its original input so that f⁻¹f(x) = x.' },
                { t: 'Composite function', d: 'A function formed by applying one function after another, written fg(x) = f(g(x)).' },
                { t: 'One-to-one function', d: 'A function in which every output comes from exactly one input, the condition required for an inverse to exist.' },
                { t: 'Mapping diagram', d: 'A diagram with two columns showing how each element of the input set is paired with its image in the output set.' },
                { t: 'Image', d: 'The output value produced when a particular input is passed through a function.' }
            ],
            tip: 'For inverse questions always write y = f(x) first and show the swap of x and y; for fg(2), work from the inside out with g(2) before f.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'f(x) = 3x − 5 and g(x) = x². Find fg(2) and f⁻¹(7), showing your method.',
                    ans: 'fg(2) = f(g(2)) = f(2²) = f(4) = 3×4 − 5 = 12 − 5 = 7 (1). For the inverse, let y = 3x − 5, then swap: x = 3y − 5 (1). Solve: y = (x + 5)/3, so f⁻¹(x) = (x + 5)/3 (1). Hence f⁻¹(7) = (7 + 5)/3 = 12/3 = 4 (1). Check: f(4) = 7 confirms the answer (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Explain why f(x) = x² for all real x does not have an inverse, and describe how restricting the domain allows an inverse to be defined.',
                    ans: 'An inverse exists only for a one-to-one function (1). Here f(3) = 9 and f(−3) = 9, so two different inputs give the same output and the reverse mapping would not know whether 9 came from 3 or −3 (1). Restricting the domain to x ≥ 0 makes f one-to-one, since every output now comes from exactly one input (1). The inverse is then f⁻¹(x) = √x with domain x ≥ 0 and range f⁻¹ ≥ 0 (1).'
                }
            ]
        },
        {
            n: 16,
            title: 'Geometric Constructions, Nets and Scale Drawings',
            card: 'Accurate constructions with arcs, nets and surface areas of solids, and scale drawings with bearings.',
            lead: 'Construction questions reward neatness and correct arcs, not guessing. A net folds into a solid, a scale drawing turns centimetres into kilometres, and bearings are always measured clockwise from north.',
            concepts: [
                'A triangle is constructed from three sides (SSS) by drawing one side, swinging arcs from each end for the second side, and intersecting arcs for the third; construction arcs must be visible.',
                'Constructions of perpendicular bisectors and angle bisectors are not required in the current 0580 syllabus; the examinable constructions are triangles and other figures from given measurements.',
                'A net is a flat arrangement of faces that folds into a solid; the surface area of a cuboid is 2(lw + lh + wh).',
                'In a scale drawing, all lengths are multiplied by the scale factor and angles are preserved, so bearings and shapes are transferred accurately.',
                'A bearing is a three-figure angle measured clockwise from north; the back bearing from B to A is the bearing from A to B plus or minus 180°.',
                'Scale factors convert between drawing and real life: 1 cm to 4 km means 7.5 cm represents 30 km.'
            ],
            terms: [
                { t: 'Net', d: 'A two-dimensional arrangement of faces that can be folded along its edges to form a three-dimensional solid.' },
                { t: 'Scale drawing', d: 'A drawing in which every length is a fixed fraction or multiple of the real length, with angles unchanged.' },
                { t: 'Bearing', d: 'A three-figure angle measured clockwise from north used to describe direction.' },
                { t: 'Three-figure bearing', d: 'A bearing written with three digits, such as 060° or 240°, measured clockwise from north.' },
                { t: 'Back bearing', d: 'The bearing of A from B when the bearing of B from A is known, found by adding or subtracting 180°.' },
                { t: 'Surface area', d: 'The total area of all faces of a solid, equal to the area of its net.' },
                { t: 'Construction arcs', d: 'The compass arcs drawn during a construction whose intersections locate vertices; they must be shown to earn construction marks.' },
                { t: 'Scale', d: 'The ratio between a distance on a drawing or map and the corresponding real distance, such as 1 cm to 4 km.' }
            ],
            tip: 'Leave all compass arcs visible and write the scale next to every measured length; for bearings, start each angle at north and measure clockwise.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'A cuboid measures 5 cm by 3 cm by 2 cm. Draw a suitable net, label its faces, and calculate the total surface area of the cuboid.',
                    ans: 'A valid net has four rectangles 5 by 2 in a row with two 3 by 2 rectangles attached to one of them (or the equivalent arrangement) (1). Surface area = 2(lw + lh + wh) = 2(5×3 + 5×2 + 3×2) (1) = 2(15 + 10 + 6) = 2×31 (1) = 62 cm² (1). The unit cm² is required for the final mark (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'On a map with scale 1 cm to 4 km, two towns are 7.5 cm apart, and town B bears 060° from town A. Find the real distance between the towns and the bearing of A from B, explaining your reasoning.',
                    ans: 'Real distance = 7.5 × 4 = 30 km, since each centimetre represents 4 km (1). Bearings are measured clockwise from north, so the back bearing is found from 060° + 180° = 240° (1). The bearing of A from B is 240° (1). Reasoning: reversing a journey adds 180° to the bearing, and the distance is unchanged because the two towns are the same two points (1).'
                }
            ]
        },
        {
            n: 17,
            title: 'Graphs of Curved Functions',
            card: 'Sketching and interpreting parabolas, reciprocal curves and exponential growth and decay from their key features.',
            lead: 'A good sketch comes from four signposts: intercepts, roots, turning points and asymptotes. Exponential curves never touch the axis, which is exactly the behaviour depreciation questions exploit.',
            concepts: [
                'For y = ax² + bx + c the y-intercept is c, the roots solve ax² + bx + c = 0, and the turning point lies on the axis of symmetry x = −b/(2a).',
                'A reciprocal graph such as y = 1/x has two branches and the axes as asymptotes, never touching them.',
                'Exponential growth uses a multiplier greater than 1, and exponential decay uses a multiplier between 0 and 1, for example V = 20 000×0.85ⁿ for 15% annual depreciation.',
                'The nth term of a depreciation sequence multiplies the starting value by the retention factor raised to power n; after 3 years the factor 0.85³ applies.',
                'Estimating solutions of equations is done by reading intersections, such as where a curve meets a straight line, or by drawing a suitable line on the graph.',
                'The gradient of a curve changes from point to point; a tangent at a point estimates the gradient there, which is positive, zero or negative according to the slope.'
            ],
            terms: [
                { t: 'Parabola', d: 'The U-shaped curve produced by a quadratic function, symmetric about a vertical axis through its turning point.' },
                { t: 'Turning point', d: 'A point where a curve changes direction from increasing to decreasing or vice versa; for a parabola it lies on the axis of symmetry.' },
                { t: 'Asymptote', d: 'A line that a curve approaches ever more closely but never reaches, such as the axes for the graph of y = 1/x.' },
                { t: 'y-intercept', d: 'The point where a graph crosses the y-axis, found by substituting x = 0.' },
                { t: 'Exponential growth', d: 'Change in which a quantity is multiplied by a constant factor greater than 1 in equal time intervals, producing a rising curve.' },
                { t: 'Exponential decay', d: 'Change in which a quantity is multiplied by a constant factor between 0 and 1 in equal time intervals, producing a falling curve approaching an asymptote.' },
                { t: 'Reciprocal graph', d: 'The curve of a function such as y = 1/x with two separate branches, each approaching but never touching the axes.' },
                { t: 'Gradient of a curve', d: 'The rate of change at a point on a curve, estimated by the gradient of the tangent drawn there.' }
            ],
            tip: 'List the signposts before you sketch: y-intercept, roots, turning point, asymptote. In depreciation questions, identify the multiplier as a decimal first, for example 0.85 for a 15% loss.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'For the graph of y = x² − 4x + 3, find the y-intercept, the coordinates where the curve crosses the x-axis, and the turning point.',
                    ans: 'y-intercept: when x = 0, y = 3 (1). Roots: x² − 4x + 3 = 0 gives (x − 1)(x − 3) = 0, so x = 1 or x = 3, crossing at (1, 0) and (3, 0) (1). Axis of symmetry x = −b/(2a) = 4/2 = 2 (1). When x = 2, y = 4 − 8 + 3 = −1, so the turning point is (2, −1) and it is a minimum (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A car is bought for 20 000 dollars and depreciates by 15% each year, with value V = 20 000×0.85ⁿ after n years. Explain what 0.85 represents, find the value after 3 years, and describe the shape of the graph of V against n.',
                    ans: 'Each year the car keeps 100% − 15% = 85% of its value, so the yearly multiplier is 0.85 (1). After 3 years, V = 20 000×0.85³ = 20 000×0.614125 (1) = 12 282.5 dollars, about 12 283 dollars (1). The graph is a decreasing exponential curve: steep at first, flattening as n increases, always positive and approaching the n-axis V = 0 as an asymptote without ever reaching it (1).'
                }
            ]
        },
        {
            n: 18,
            title: 'Multi-Topic Problem Solving',
            card: 'Extended questions that blend percentages, scale factors, geometry and algebra — the style of the hardest 0580 paper questions.',
            lead: 'The top-band questions combine several topics in one story. Break the story into stages, finish each stage with a sentence, and the marks take care of themselves.',
            concepts: [
                'In reverse percentage problems the original amount is found by dividing by the multiplier, for example 250 after a 25% increase means 250/1.25 = 200.',
                'For similar figures, lengths scale by k, areas by k² and volumes by k³; a scale of 1:20 multiplies areas by 400 and volumes by 8000.',
                'Unit conversions must be planned before calculating: 60 000 cm² = 6 m² because 1 m² = 10 000 cm², and 1000 cm³ = 1 litre.',
                'Angle results come in families: angles on a line sum to 180°, angles in a triangle sum to 180°, and parallel lines give alternate, corresponding and co-interior angle facts.',
                'In multi-step questions, write an intermediate value with its units at the end of each step so later stages can reuse it correctly.',
                'Checking by estimation catches errors: an answer wildly different from a rough mental estimate usually signals a misplaced decimal point or scale factor.'
            ],
            terms: [
                { t: 'Multiplier', d: 'The single decimal number that scales a quantity in one step, such as 1.25 for a 25% increase or 0.85 for a 15% decrease.' },
                { t: 'Reverse percentage', d: 'The method of recovering an original amount by dividing the new amount by the multiplier, rather than subtracting the percentage.' },
                { t: 'Depreciation', d: 'The decrease in value of an asset over time, usually calculated by multiplying by a retention factor less than 1 each period.' },
                { t: 'Scale factor', d: 'The ratio of corresponding lengths in similar figures, multiplying every length of one figure to give the other.' },
                { t: 'Area scale factor', d: 'The square of the length scale factor, converting an area of one similar figure to the corresponding area of the other.' },
                { t: 'Volume scale factor', d: 'The cube of the length scale factor, converting a volume of one similar solid to the corresponding volume of the other.' },
                { t: 'Alternate angles', d: 'Equal angles formed on opposite sides of a transversal cutting a pair of parallel lines, in a Z-shaped arrangement.' },
                { t: 'Co-interior angles', d: 'Angles between two parallel lines on the same side of a transversal, summing to 180°.' }
            ],
            tip: 'Underline each quantity in the question as you use it, square the length scale factor for area and cube it for volume, and convert all units before you begin.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'After a 25% price increase, a phone costs 250 dollars. Find the original price, showing why subtracting 25% of 250 would be wrong.',
                    ans: 'The multiplier for a 25% increase is 1.25, so original × 1.25 = 250 (1). Original price = 250/1.25 = 200 dollars (1). Subtracting 25% of 250 gives 187.50 dollars, which is wrong because the 25% was added to the original 200, not to 250, so the base of the percentage is different (1). Check: 200×1.25 = 250 confirms the answer (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A model yacht is built to scale 1:20 of the real yacht. The model sail has area 150 cm² and the model hull holds 0.5 litres. Find the real sail area in m² and the real hull capacity in litres, explaining the scale factors used.',
                    ans: 'Length scale factor is 20, so the area scale factor is 20² = 400 (1). Real sail area = 150×400 = 60 000 cm² = 60 000/10 000 = 6 m² (1). The volume scale factor is 20³ = 8000 (1). Real hull capacity = 0.5×8000 = 4000 litres (1). Areas scale by the square and volumes by the cube of the length scale factor because area covers two dimensions and volume covers three (1).'
                }
            ]
        }
    ]
};
