// OLPW:curriculum/design-technology.js | script for design-technology
/* OLPW expansion curriculum — Design & Technology (CAIE 6043 companion chapters 15-18) */
module.exports = {
    chapters: [
        {
            n: 15,
            title: 'Mechanisms in Depth',
            card: 'Levers, gears and pulleys in depth: mechanical advantage, velocity ratio and efficiency calculations applied to real mechanisms.',
            lead: 'Mechanisms multiply force, change speed or transfer motion. Levers, gears and pulleys all obey the same three calculations: mechanical advantage, velocity ratio and efficiency.',
            concepts: [
                'Levers multiply force: a class 1 lever has the fulcrum between load and effort (crowbar, scissors), class 2 has the load between fulcrum and effort (wheelbarrow, nutcracker), and class 3 has the effort between fulcrum and load (tweezers, human forearm).',
                'Mechanical advantage (MA) = load ÷ effort; velocity ratio (VR) = distance moved by effort ÷ distance moved by load; in an ideal machine MA equals VR.',
                'Efficiency = MA ÷ VR × 100, equivalently useful work output ÷ work input × 100; real machines stay below 100% because friction and the weight of moving parts waste energy.',
                'Gears transmit rotary motion: the gear ratio equals driven teeth ÷ driver teeth, an idler gear reverses direction without changing the ratio, and compound gears give large reductions.',
                'Bevel gears transfer drive between shafts at 90 degrees, a rack and pinion converts rotation into linear motion, and a worm gear gives a high reduction ratio while locking against back-driving.',
                'Pulleys change the direction of a force (a fixed pulley, MA 1) or multiply it (a movable pulley and block and tackle); lever equilibrium is analysed with moments, force × perpendicular distance from the pivot.'
            ],
            terms: [
                { t: 'Fulcrum', d: 'The fixed pivot point about which a lever rotates; the point of support for the turning forces.' },
                { t: 'Mechanical advantage', d: 'The ratio of the output force (load) to the input force (effort), showing how much a mechanism multiplies an applied force.' },
                { t: 'Velocity ratio', d: 'The ratio of the distance moved by the effort to the distance moved by the load in a machine.' },
                { t: 'Efficiency', d: 'The ratio of useful work output to total work input, expressed as a percentage; friction keeps it below 100 per cent in real machines.' },
                { t: 'Moment', d: 'The turning effect of a force about a pivot, calculated as the force multiplied by its perpendicular distance from the pivot.' },
                { t: 'Idler gear', d: 'A gear placed between the driver and driven gears that reverses the direction of rotation without changing the velocity ratio.' },
                { t: 'Bevel gear', d: 'A gear with teeth cut at an angle, used to transmit drive between two shafts whose axes intersect, usually at 90 degrees.' },
                { t: 'Worm gear', d: 'A screw-like gear meshing with a spur gear, giving a large speed reduction and preventing the output shaft from driving backwards.' }
            ],
            tip: 'Show every step in mechanism calculations: write the formula, substitute the numbers, then answer with units. When asked why MA is less than VR, name friction and the weight of moving parts — those two points appear in almost every mark scheme.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'A lever lifts a load of 240 N using an effort of 60 N; the effort moves 1.5 m while the load rises 0.3 m. Calculate the mechanical advantage, the velocity ratio and the efficiency.',
                    ans: 'Mechanical advantage = load ÷ effort = 240 ÷ 60 = 4 (1). Velocity ratio = effort distance ÷ load distance = 1.5 ÷ 0.3 = 5 (1). Efficiency = MA ÷ VR × 100 = 4 ÷ 5 × 100 (1) = 80% (1). The missing 20% is wasted against friction and in moving the parts of the machine (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A salesman claims his pulley system multiplies force tenfold with no energy loss. Explain why a machine\'s mechanical advantage can equal, but never exceed, its velocity ratio, and what happens in practice.',
                    ans: 'In an ideal machine with no friction, MA equals VR because work input equals work output (1). A real machine wastes some input work against friction and in moving its own parts (1), so its MA is always smaller than its VR (1). Therefore efficiency = MA ÷ VR × 100 is always below 100% (1). Judgement: the salesman\'s no-energy-loss claim is impossible, so a tenfold MA would require a velocity ratio greater than 10 and still deliver less than 100% efficiency (1).'
                }
            ]
        },
        {
            n: 16,
            title: 'Scales of Production',
            card: 'One-off, batch, mass and continuous production compared by cost, tools, labour and quality, and how to choose the right scale for a product.',
            lead: 'From a single bespoke commission to a production line that never stops, the scale of production shapes every decision about tools, cost, labour and quality.',
            concepts: [
                'One-off (job) production makes a single product for one customer, such as bespoke furniture or a made-to-measure wedding dress, using skilled labour and general-purpose tools, which gives high unit cost but full customisation.',
                'Batch production repeats a set quantity of identical items before the equipment is reset for the next product, such as bakery batches or festival T-shirts, balancing flexibility with lower unit costs through jigs and templates.',
                'Mass production makes large volumes of standardised products on assembly lines, such as cars and smartphones, achieving very low unit cost through economies of scale, automation and division of labour, but with high tooling cost and little flexibility.',
                'Continuous production runs dedicated plant without stopping, as in steel, paper, oil refining and bottling drinks, giving the lowest unit cost of all but the least flexibility to change product.',
                'The scale of production dictates the choice of tools and equipment: jigs and fixtures secure batch accuracy, moulds and dies serve mass production, and CAD, CAM and robotics are justified only where volume is high.',
                'Quality control by inspection suits mass lines, while quality assurance (planned prevention) is used at every scale; larger scales cut the cost per unit but raise set-up cost and the risk if demand falls.'
            ],
            terms: [
                { t: 'One-off production', d: 'The manufacture of a single custom-made product for one customer, using skilled labour and general-purpose tools.' },
                { t: 'Batch production', d: 'Making a set quantity of identical products in one production run before the equipment is reset for a different product.' },
                { t: 'Mass production', d: 'The high-volume manufacture of identical products on assembly lines, using automation and division of labour to achieve low unit costs.' },
                { t: 'Continuous production', d: 'A non-stop manufacturing process in which materials flow through dedicated plant, used for liquids, gases and bulk goods such as paper or steel.' },
                { t: 'Jig', d: 'A custom-made device that guides a cutting tool and holds the workpiece so that identical parts can be produced quickly and accurately.' },
                { t: 'Fixture', d: 'A device that clamps a workpiece firmly in position during machining but does not guide the cutting tool.' },
                { t: 'Quality assurance', d: 'A planned system of procedures and checks designed to prevent defects occurring at every stage of production, rather than inspecting them in afterwards.' },
                { t: 'Economy of scale', d: 'A fall in average cost per unit that results from higher output, as fixed costs are spread over more units.' }
            ],
            tip: 'Scales-of-production questions usually follow an identify-then-justify pattern: state the scale, then justify it with cost, quantity or flexibility. Compare your chosen scale against one alternative to secure the evaluation marks.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Name the most suitable scale of production for each product and justify each choice: (a) a made-to-measure wedding dress, (b) 500 identical school desks, (c) cans of cola sold nationwide, (d) petrol refined at a port plant.',
                    ans: 'Wedding dress: one-off production, because a single customised item is made for one customer (1). School desks: batch production, a limited run of identical items before the machinery is reset (1). Cans of cola: mass production, continuous high-volume output of a standardised product on dedicated lines (1). Petrol: continuous production, because refining runs non-stop on dedicated plant (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A furniture maker receives an order for 60 identical chairs. Evaluate producing them by batch production rather than one-off production, and justify the recommendation.',
                    ans: 'Batch production uses jigs and templates to cut and drill identical parts accurately and quickly (1), lowering the labour cost per chair and keeping quality consistent across all 60 (1). One-off production suits a single prototype, but making 60 chairs individually would be slow and expensive per chair (1). Batch production needs initial set-up time and cost for the jigs, which is uneconomic for very small quantities (1). Judgement: batch production is the better choice here because an order of 60 justifies the set-up and cuts the unit cost (1).'
                }
            ]
        },
        {
            n: 17,
            title: 'Product Analysis & Disassembly',
            card: 'Analysing and disassembling existing products to judge them against specification, ergonomics, sustainability and user needs.',
            lead: 'Every product is a set of solved problems. Analysing and disassembling existing products reveals the thinking behind them — and the specification your own design must beat.',
            concepts: [
                'Product analysis evaluates an existing product against criteria such as function, user needs, aesthetics, ergonomics, materials, construction, safety, cost and sustainability.',
                'Disassembly takes a product apart in reverse order of assembly, recording every material, component and joining method with notes or photographs as evidence.',
                'Comparing the product with its design specification shows whether it meets its original requirements and where improvements are possible for a redesign.',
                'Anthropometric data (human body measurements) and ergonomic checks reveal whether sizes, grips and operating forces suit the intended users.',
                'Life cycle assessment measures a product\'s total environmental impact from raw-material extraction to disposal; designers respond using the 6 Rs: refuse, rethink, reduce, reuse, repair and recycle.',
                'Disassembly has limits: adhesives and welded joints may destroy parts, some assemblies cannot be refitted, and hidden or patented solutions cannot simply be copied, so analysis must record what cannot be taken apart.'
            ],
            terms: [
                { t: 'Product analysis', d: 'The systematic evaluation of an existing product against criteria such as function, materials, construction, safety, user needs and sustainability.' },
                { t: 'Disassembly', d: 'The careful taking apart of a product to study the materials, components and joining methods used and the order in which it was assembled.' },
                { t: 'Ergonomics', d: 'The study of designing products and environments to fit the people who use them, considering comfort, safety and ease of use.' },
                { t: 'Anthropometrics', d: 'The measurement of human body sizes and proportions, used by designers to size products correctly for their intended users.' },
                { t: 'Design specification', d: 'A detailed list of measurable requirements that a product must meet, written at the start of a design project and used to judge the outcome.' },
                { t: 'Aesthetics', d: 'The visual appeal of a product, including its shape, colour, texture, proportion and finish.' },
                { t: 'Life cycle assessment', d: 'An analysis of a product\'s total environmental impact from raw-material extraction through manufacture, use and disposal.' },
                { t: 'Joining method', d: 'The technique used to assemble parts of a product, such as adhesives, welding, screws or interlocking joints, chosen to suit the materials.' }
            ],
            tip: 'Product-analysis answers must be specific: never write "it looks nice" — write "rounded corners improve safety for children" and link every point back to the user or to a point in the specification.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'List four criteria you would use to analyse an existing product such as a cordless kettle, giving a brief reason why each matters.',
                    ans: 'Function: it must boil water quickly and safely for its users (1). Materials and construction: the plastics must be heat-resistant and the parts joined durably (1). Ergonomics and safety: the handle must be comfortable and the lid must lock against scalding (1). Sustainability: the materials should be recyclable and the kettle should not waste energy (1). Accept also aesthetics, cost or ease of manufacture.'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A designer disassembles a rival\'s cordless drill before designing a new model. Discuss how disassembly informs the design specification, and evaluate its limitations.',
                    ans: 'Disassembly reveals the materials used and why, such as glass-filled nylon chosen for the casing to give strength (1). It shows the joining methods, which reveals assembly time and how easily the product could be repaired or recycled (1). It exposes how the motor, gearbox and battery are arranged, suggesting improvements in size, weight and ergonomics for the new specification (1). Limitations: adhesives and welded joints may destroy parts, some assemblies cannot be refitted, and patented solutions cannot simply be copied (1). Judgement: disassembly is most valuable when combined with user research and product testing rather than used alone (1).'
                }
            ]
        },
        {
            n: 18,
            title: 'Design Communication',
            card: 'Orthographic and isometric drawing, exploded diagrams and fully dimensioned working drawings: the language used to communicate designs for manufacture.',
            lead: 'Designs become real through drawings. Orthographic and isometric views, exploded diagrams and working drawings let a designer communicate precisely with clients and manufacturers.',
            concepts: [
                'Orthographic projection draws an object as separate flat views — front, top and end — to scale, and the projection symbol states whether first-angle or third-angle projection is used.',
                'Isometric drawing shows the object in 3D on axes at 30 degrees to the horizontal with true measurements along each axis, unlike perspective drawing where lines converge towards vanishing points.',
                'An exploded diagram separates the parts along their assembly directions to show how they fit together and in what order; it is widely used in instruction manuals and marketing.',
                'A working drawing gives full dimensions, tolerances, materials and finishes so a manufacturer can make the product without asking any further questions.',
                'Dimensioning uses extension lines, dimension lines and arrowheads with sizes stated in millimetres, and tolerances give the upper and lower limits within which a part remains acceptable.',
                'CAD produces all of these drawings accurately from a single model, updates every view automatically when the design changes, renders realistic images for clients and outputs files for CAM machines.'
            ],
            terms: [
                { t: 'Orthographic projection', d: 'A method of drawing a three-dimensional object as a set of flat two-dimensional views, such as front, top and end, drawn to scale.' },
                { t: 'Third-angle projection', d: 'A projection system in which each view of an object is drawn on the side from which that view is seen.' },
                { t: 'Isometric drawing', d: 'A three-dimensional representation of an object drawn with its axes at 30 degrees to the horizontal and all measurements to the same scale.' },
                { t: 'Exploded diagram', d: 'A drawing in which the parts of an assembly are separated along their assembly lines to show how they fit together and in what order.' },
                { t: 'Working drawing', d: 'A fully detailed and dimensioned drawing, stating materials and finishes, from which a product can be manufactured without further explanation.' },
                { t: 'Tolerance', d: 'The permitted variation in a dimension, stated as upper and lower limits between which a manufactured part remains acceptable.' },
                { t: 'Rendering', d: 'The addition of colour, shading, texture and lighting to a drawing or CAD model to make it look realistic.' },
                { t: 'Dimension line', d: 'A thin line with arrowheads that records the size of a feature on a drawing, drawn between two extension lines.' }
            ],
            tip: 'In drawing questions, name the correct view or symbol precisely and add what it communicates; a labelled sketch showing front, top and end views often earns marks where written description alone does not.',
            questions: [
                {
                    lvl: 'FOUNDATION',
                    ask: 'Name the drawing used for each purpose: (a) a set of flat views of an object from the front, top and end; (b) a 3D view drawn with axes at 30 degrees; (c) parts separated to show assembly order; (d) a fully dimensioned drawing used for manufacture.',
                    ans: 'Orthographic projection: flat views from different directions, drawn to scale (1). Isometric drawing: a 3D view with the three axes at 30 degrees (1). Exploded diagram: parts separated along their assembly lines to show how they fit together (1). Working drawing: fully dimensioned with tolerances, materials and finishes so the product can be manufactured (1).'
                },
                {
                    lvl: 'CHALLENGE',
                    ask: 'A client struggles to read technical drawings. Evaluate whether the final design should be presented as an exploded diagram instead of orthographic views, and justify your recommendation.',
                    ans: 'An exploded diagram is easy for non-specialists to understand: it shows what the product looks like and how the parts assemble (1). However it gives no dimensions, tolerances or material information, so a manufacturer could not make the product from it (1). Orthographic views fully define every feature to scale and are essential for production (1). Judgement: present both — the exploded view for the client and working orthographic drawings for manufacture — because each drawing serves a different audience (1).'
                }
            ]
        }
    ]
};
