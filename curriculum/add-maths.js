/* OLPW expansion curriculum — Additional Mathematics (CAIE 4037 companion chapters 15-18) */
module.exports = {
    chapters: [
        {
            n: 15,
            title: 'Applications of Differentiation',
            card: 'Using gradients, stationary points and connected rates of change to solve optimisation and curve problems, with first and second derivative tests.',
            lead: 'Turning dy/dx into marks: equations of tangents and normals, classifying stationary points, connected rates of change, and optimising quantities in practical contexts.',
            concepts: [
                'The gradient of a curve at a point is the value of dy/dx there, so the tangent at x = a has gradient f′(a) and the normal has gradient −1/f′(a), the negative reciprocal, because the normal is perpendicular to the tangent.',
                'A stationary point occurs where dy/dx = 0; the first derivative test classifies it by the sign change of dy/dx — positive to negative gives a maximum, negative to positive gives a minimum.',
                'At a stationary point, d²y/dx² < 0 indicates a maximum and d²y/dx² > 0 indicates a minimum; full justification of the conclusion is expected, and points of inflexion are not required.',
                'Connected rates of change link two rates with the chain rule, e.g. dv/dt = (dv/dr) × (dr/dt); first establish the geometric or physical relationship between the quantities, then differentiate it with respect to time.',
                'Optimisation method: define the variables, use the constraint to express the quantity as a function of one variable, differentiate, solve dy/dx = 0, verify the nature of the stationary point, and give the answer in context with units.',
                'For a small change δx, δy ≈ (dy/dx) × δx; this small increment approximation uses the tangent to estimate the change in a function near a known point.'
            ],
            terms: [
                { t: 'Stationary point', d: 'A point on a curve where the gradient is zero, found by solving dy/dx = 0 and classified using the first or second derivative test.' },
                { t: 'Maximum point', d: 'A stationary point where the gradient changes from positive to negative, so the function changes from increasing to decreasing there.' },
                { t: 'Minimum point', d: 'A stationary point where the gradient changes from negative to positive, so the function changes from decreasing to increasing there.' },
                { t: 'Second derivative test', d: 'At a stationary point, d²y/dx² < 0 indicates a maximum and d²y/dx² > 0 indicates a minimum.' },
                { t: 'Connected rates of change', d: 'Two or more rates linked by the chain rule, e.g. dv/dt = (dv/dr) × (dr/dt), used when related quantities vary with time together.' },
                { t: 'Optimisation', d: 'Using differentiation to find the maximum or minimum value of a quantity in a practical problem, subject to given constraints.' },
                { t: 'Normal to a curve', d: 'The straight line through a point on a curve perpendicular to the tangent there, with gradient equal to the negative reciprocal of the tangent gradient.' },
                { t: 'Small increment approximation', d: 'For a small change δx in x, the change in y is approximately δy ≈ (dy/dx) × δx, using the tangent to estimate the change.' }
            ],
            tip: 'When a question asks for the nature of a stationary point, quote the sign change of dy/dx or the sign of d²y/dx² explicitly; in optimisation questions end with the optimal value, its units and a one-line statement of what it represents, because the interpretation mark is separate from the differentiation marks.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'For the curve y = x² − 6x + 4, find the coordinates of the stationary point and determine whether it is a maximum or a minimum.',
                    ans: 'dy/dx = 2x − 6; at a stationary point 2x − 6 = 0 so x = 3 (1). When x = 3, y = 9 − 18 + 4 = −5, so the point is (3, −5) (1). d²y/dx² = 2, which is positive (1), so (3, −5) is a minimum point (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A closed cylindrical can must have volume 500 cm³, so its surface area is A = 2πr² + 1000/r. Find the radius that minimises the surface area, justify that it is a minimum, and explain the practical meaning.',
                    ans: 'dA/dr = 4πr − 1000/r²; setting dA/dr = 0 gives 4πr³ = 1000, so r³ = 250/π and r ≈ 4.30 cm (1)(1). d²A/dr² = 4π + 2000/r³, which is positive when r ≈ 4.30, so the stationary point is a minimum (1). Practically, this radius uses the least material to make the can, which cuts production cost (1).'
                }
            ]
        },
        {
            n: 16,
            title: 'Applications of Integration',
            card: 'Evaluating definite integrals to find areas under and between curves, and applying integration to kinematics for displacement, velocity and distance travelled.',
            lead: 'The definite integral as area: computing regions bounded by curves, lines and axes, and reversing differentiation to move between displacement, velocity and acceleration.',
            concepts: [
                'The definite integral of f(x) from a to b equals F(b) − F(a), where F is the antiderivative of f; interpreted as area, it gives the region between the curve y = f(x) and the x-axis from x = a to x = b.',
                'A region below the x-axis integrates to a negative value, so area must be reported as a positive quantity; a region cut by an axis is computed as the sum of the separate areas of its parts.',
                'The area between two curves from x = a to x = b equals the integral of (upper function − lower function); find the limits a and b from the intersection points of the curves first.',
                'In kinematics, v = ds/dt and a = dv/dt; integrating velocity gives displacement, and the constant of integration is fixed by an initial condition such as s = 0 when t = 0.',
                'On a velocity-time graph the area under the graph measures displacement; total distance travelled requires integrating the speed, so the integral must be split wherever v changes sign.',
                'With constant acceleration the same relationships reduce to the constant acceleration equations v = u + at, s = ut + ½at² and v² = u² + 2as, which integration reproduces.'
            ],
            terms: [
                { t: 'Definite integral', d: 'An integral evaluated between two limits, giving the difference of the antiderivative at those limits and equal to the area under the curve between them.' },
                { t: 'Constant of integration', d: 'An arbitrary constant added to an indefinite integral, whose value is fixed by a given condition such as an initial displacement.' },
                { t: 'Displacement', d: 'The distance and direction of a particle from a fixed reference point; the integral of velocity with respect to time.' },
                { t: 'Velocity', d: 'The rate of change of displacement with respect to time; the gradient of a displacement-time graph.' },
                { t: 'Acceleration', d: 'The rate of change of velocity with respect to time; the gradient of a velocity-time graph.' },
                { t: 'Distance travelled', d: 'The total length of the path covered in a time interval, found by integrating the speed so that periods of negative velocity still count positive.' },
                { t: 'Area between two curves', d: 'The definite integral, between the intersection x-values, of the upper function minus the lower function.' },
                { t: 'Speed', d: 'The magnitude of velocity without direction, found from the gradient of a distance-time graph.' }
            ],
            tip: 'Sketch the region before integrating and mark the limits from the intersection points; if a curve crosses the axis inside the interval, integrate each part separately and take positive values — one integral straight across a crossing point is the most common way to lose the final accuracy mark.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Find the area enclosed between the curve y = 4x − x² and the x-axis.',
                    ans: 'The curve meets the x-axis where 4x − x² = 0, i.e. x = 0 and x = 4, so the limits are 0 and 4 (1). The integral of 4x − x² is 2x² − x³/3 (1). Evaluating from 0 to 4: 2(16) − 64/3 = 32 − 64/3 = 32/3 (1). Area = 32/3 square units, i.e. 10⅔ (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A particle moves with velocity v = t² − 8t + 12 m/s for 0 ≤ t ≤ 6. Explain how to find the total distance travelled, and calculate it.',
                    ans: 'v = 0 when (t − 2)(t − 6) = 0, so the velocity changes sign at t = 2 and the integral must be split there (1). From 0 to 2 the integral of v is t³/3 − 4t² + 12t = 8/3 − 16 + 24 = 32/3, and v is positive, giving 32/3 m (1). From 2 to 6 the integral is −32/3, so that part contributes 32/3 m of distance (1). Total distance = 32/3 + 32/3 = 64/3 ≈ 21.3 m (1). The displacement over the 6 seconds is 0, which shows distance and displacement differ once the particle reverses direction (1).'
                }
            ]
        },
        {
            n: 17,
            title: 'Coordinate Geometry of the Circle',
            card: 'The equation of a circle in centre-radius and expanded forms, intersections of lines and circles, tangent conditions, and common chords of two circles.',
            lead: 'From (x − a)² + (y − b)² = r² to deciding whether a line cuts, touches or misses a circle — all with coordinate geometry, and no calculus required.',
            concepts: [
                'A circle with centre (a, b) and radius r has equation (x − a)² + (y − b)² = r²; the equation is provided in the List of formulas.',
                'The expanded form x² + y² + 2gx + 2fy + c = 0 has centre (−g, −f) and radius √(g² + f² − c), found by completing the square in x and y; it represents a real circle only when g² + f² − c > 0.',
                'To see how a line meets a circle, substitute the line equation into the circle equation to obtain a quadratic in x: two distinct roots give a chord, equal roots give a tangent, and no real roots mean the line does not meet the circle.',
                'A tangent is perpendicular to the radius at the point of contact, so the tangent gradient is the negative reciprocal of the radius gradient; its equation follows from y − y₁ = m(x − x₁), and no use of calculus is expected.',
                'Comparing the perpendicular distance d from the centre to the line with the radius gives the same classification: d less than r means the line cuts twice, d equal to r means it touches, and d greater than r means it misses.',
                'For two circles, compare the distance between centres with the sum and difference of the radii to decide whether they intersect, touch externally or internally, or are separate; the common chord equation is found by subtracting one circle equation from the other.'
            ],
            terms: [
                { t: 'Chord', d: 'A straight line segment joining two points on the circumference of a circle.' },
                { t: 'Tangent to a circle', d: 'A straight line touching a circle at exactly one point, perpendicular to the radius at the point of contact.' },
                { t: 'Common chord', d: 'The chord joining the two intersection points of two circles; its equation is found by subtracting the two circle equations.' },
                { t: 'Centre of a circle', d: 'The fixed point equidistant from all points on a circle; the point (a, b) in the standard equation of the circle.' },
                { t: 'Radius', d: 'The constant distance from the centre to any point on the circle, denoted r in the centre-radius form of the equation.' },
                { t: 'General form of a circle', d: 'The expanded equation x² + y² + 2gx + 2fy + c = 0 of a circle, which has centre (−g, −f) and radius √(g² + f² − c).' },
                { t: 'Length of a chord', d: 'Calculated as 2√(r² − d²), where d is the perpendicular distance from the centre to the chord, or from the two intersection points of the line and circle.' },
                { t: 'Touching circles', d: 'Two circles that touch externally when the distance between centres equals the sum of their radii, and internally when it equals the difference.' }
            ],
            tip: 'For show-that-the-line-is-a-tangent questions, form the quadratic in x or y and state the discriminant condition explicitly — equal roots, discriminant zero, exactly one point of contact — before writing the conclusion; the mark is awarded for the comparison being seen, not just asserted.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Find the centre and radius of the circle x² + y² − 6x + 4y − 12 = 0.',
                    ans: 'Group the terms: (x² − 6x) + (y² + 4y) = 12 (1). Complete the squares: (x − 3)² − 9 + (y + 2)² − 4 = 12, so (x − 3)² + (y + 2)² = 25 (1). Centre = (3, −2) (1). Radius = √25 = 5 (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'The line y = x + c meets the circle x² + y² = 25. Determine the values of c for which the line is a tangent to the circle, explaining your reasoning.',
                    ans: 'Substituting gives x² + (x + c)² = 25, i.e. 2x² + 2cx + c² − 25 = 0 (1). A tangent meets the circle at exactly one point, so this quadratic has equal roots and its discriminant is zero (1). Discriminant = (2c)² − 4(2)(c² − 25) = 4c² − 8c² + 200 = 200 − 4c² = 0, so c² = 50 (1). Hence c = ±5√2 (1); for these values the line touches the circle at a single point, and for other values of c it cuts the circle twice or misses it (1).'
                }
            ]
        },
        {
            n: 18,
            title: 'Trigonometric Identities and Equations in Depth',
            card: 'Proving identities and solving equations with sin, cos, tan and the reciprocal functions over given domains in degrees and radians, using the core identities.',
            lead: 'Moving beyond right-angled triangles: manipulating the Pythagorean identities, proving results rigorously, and capturing every solution inside a stated interval.',
            concepts: [
                'The identity sin²θ + cos²θ = 1 holds for all θ; dividing it by cos²θ gives sec²θ = 1 + tan²θ, and dividing by sin²θ gives cosec²θ = 1 + cot²θ. These relationships are given in the List of formulas.',
                'tan θ = sin θ/cos θ, sec θ = 1/cos θ, cosec θ = 1/sin θ and cot θ = cos θ/sin θ; converting everything to sin and cos is the standard way to simplify expressions and solve equations.',
                'To solve an equation, reduce it to a single function of a single angle, find the principal value from the calculator, then use the symmetry of the graph or a CAST diagram to list every solution in the given domain, in degrees or radians as requested.',
                'Equations with a multiple angle such as 2θ or 3θ are solved for the multiple angle over the stretched domain first, then every solution is divided by the coefficient, discarding any values that fall outside the original domain.',
                'Equations with sec, cosec or cot are rewritten in terms of cos, sin or tan first, noting any restrictions, e.g. cos θ = 0 would make sec θ undefined, so such values must be rejected.',
                'To prove an identity, start from the more complicated side, express everything in sin and cos, simplify using the identities, and arrive at the other side; terms must never be moved across the equals sign during a proof.'
            ],
            terms: [
                { t: 'Trigonometric identity', d: 'An equation involving trigonometric functions that is true for every value of the angle for which both sides are defined.' },
                { t: 'Principal value', d: 'The calculator solution of a trigonometric equation in the range −90° to 90°, from which all other solutions are found by symmetry.' },
                { t: 'Period', d: 'The interval over which a trigonometric graph repeats; for sin bθ and cos bθ it is 360°/b, or 2π/b radians.' },
                { t: 'Amplitude', d: 'The maximum displacement of a trigonometric graph from its centre line; for a sin bθ + c the amplitude is a.' },
                { t: 'Secant', d: 'The reciprocal of the cosine function, sec θ = 1/cos θ, which is undefined wherever cos θ = 0.' },
                { t: 'Cosecant', d: 'The reciprocal of the sine function, cosec θ = 1/sin θ, which is undefined wherever sin θ = 0.' },
                { t: 'Cotangent', d: 'The reciprocal of the tangent function, cot θ = 1/tan θ = cos θ/sin θ, undefined wherever sin θ = 0.' },
                { t: 'CAST diagram', d: 'A memory aid showing which trigonometric functions are positive in each quadrant, used to find all solutions of an equation.' }
            ],
            tip: 'After finding the principal value, list every solution inside the given interval before dividing by a coefficient for multiple-angle equations, and give radian answers as exact multiples of π — a decimal such as 1.05 instead of π/3 loses the final accuracy mark.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Given that sin θ = 3/5 and θ is acute, use the identity sin²θ + cos²θ = 1 to find the exact values of cos θ and tan θ.',
                    ans: 'cos²θ = 1 − sin²θ = 1 − 9/25 = 16/25 (1). Since θ is acute, cos θ = 4/5 (1). tan θ = sin θ/cos θ = (3/5)/(4/5) = 3/4 (1). So the exact values are cos θ = 4/5 and tan θ = 3/4, matching the 3-4-5 triangle (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'Prove the identity sin θ tan θ + cos θ = sec θ, showing every step of your reasoning.',
                    ans: 'Start with the left-hand side and write tan θ = sin θ/cos θ (1). Then sin θ tan θ + cos θ = sin²θ/cos θ + cos θ = (sin²θ + cos²θ)/cos θ, combining over a common denominator (1). Using sin²θ + cos²θ = 1 gives 1/cos θ (1). Since 1/cos θ = sec θ, the left-hand side equals the right-hand side and the identity is proved (1).'
                }
            ]
        }
    ]
};
