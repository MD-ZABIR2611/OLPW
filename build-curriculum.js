#!/usr/bin/env node
/* Build the new science chapters (Physics 15-26, Biology 15) from the existing page templates,
   extend the subject pages + biology dashboard, embed the periodic table in Chemistry. */
const fs = require('fs');
const path = require('path');
const DIR = 'C:/Users/ASUS/Desktop/OLPW';
const read = f => fs.readFileSync(path.join(DIR, f), 'utf8');
const write = (f, c) => fs.writeFileSync(path.join(DIR, f), c);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------------- authored curriculum data: Physics 15-26 (CAIE 0625/5054) ---------------- */
const PHYSICS = [
{ num: 15, tag: 'LIGHT', title: 'Light: Reflection & Refraction',
  card: 'Reflection, plane mirrors, refraction, refractive index, total internal reflection, optical fibres.',
  theory: [
    ['Reflection of Light', ['Light is reflected when it bounces off a surface. The ray hitting the surface is the incident ray; the ray leaving is the reflected ray. Both angles are measured from the normal - the line at 90° to the surface.', 'Law of reflection: the angle of incidence equals the angle of reflection (i = r), and the incident ray, reflected ray and normal all lie in the same plane.', 'A plane mirror forms a virtual image: the same size as the object, laterally inverted (left and right swapped), upright, and as far behind the mirror as the object is in front. Virtual images cannot be formed on a screen.']],
    ['Refraction of Light', ['Refraction is the change in direction of light when it passes from one medium to another, caused by the change in its speed. Light slows down and bends TOWARDS the normal when it enters a denser medium (air to glass), and speeds up and bends AWAY from the normal into a less dense medium.', 'Refractive index n measures how much a medium slows light: n = sin i / sin r, where i and r are measured in air. For glass n is about 1.5 and for water about 1.33.']],
    ['Total Internal Reflection (TIR)', ['When light travels from a denser to a less dense medium, some light reflects back at the boundary. Above a certain angle of incidence - the critical angle c - all the light reflects back inside: this is total internal reflection.', 'Two conditions for TIR: the light must be travelling in the denser medium towards the less dense one, and the angle of incidence must be greater than the critical angle. The critical angle obeys sin c = 1/n (about 42° for glass, 49° for water).', 'Optical fibres use TIR to pipe light along a thin glass core, carrying internet and telephone signals and light in medical endoscopes. Prisms in binoculars and periscopes also use TIR because it mirrors light perfectly.']]
  ],
  defs: [
    ['Normal', 'The line drawn at 90° to a surface at the point where the ray hits it; all angles are measured from it.'],
    ['Law of Reflection', 'The angle of incidence equals the angle of reflection, and the incident ray, reflected ray and normal lie in the same plane.'],
    ['Virtual Image', 'An image formed by light rays that appear to diverge from a point but do not actually pass through it, so it cannot be caught on a screen.'],
    ['Refraction', 'The change in direction of light as it passes between media of different optical density, caused by the change in its speed.'],
    ['Refractive Index', 'The ratio showing how much a medium slows down light: n = sin i / sin r; about 1.5 for glass and 1.33 for water.'],
    ['Critical Angle', 'The angle of incidence in the denser medium at which the refracted ray travels along the boundary: sin c = 1/n.'],
    ['Total Internal Reflection', 'The complete reflection of light back into the denser medium when the angle of incidence exceeds the critical angle.'],
    ['Optical Fibre', 'A thin glass fibre that pipes light along its length by repeated total internal reflection, used in communications and endoscopes.']
  ],
  formulae: { h: 'Refraction & TIR Equations', intro: 'Angles are always measured from the normal. i = angle in air (or less dense medium).', boxes: ['n = sin i / sin r', 'sin c = 1 / n', 'n = speed of light in vacuum / speed in medium'] },
  practical: 'Trace a ray through a rectangular glass block: the ray bends towards the normal on entering and away on leaving, emerging parallel to the incident ray. Use a semicircular block to find the critical angle - rotate the ray until the refracted ray skims the surface, then measure the angle.',
  exam: [
    ['A ray of light hits a glass block (n = 1.5). The angle of incidence in air is 30°. Calculate the angle of refraction.', ['Formula: n = sin i / sin r', 'Substitution: 1.5 = sin 30° / sin r, so sin r = 0.5 / 1.5 = 0.333', 'Answer: r = sin⁻¹(0.333) = 19° (towards the normal)']],
    ['State the two conditions needed for total internal reflection.', ['Light must be travelling in the denser medium towards the less dense medium (1).', 'The angle of incidence must be greater than the critical angle (1).']]
  ],
  phet: [{ name: 'Bending Light', slug: 'bending-light', desc: 'Shine rays through glass and water, measure angles and watch total internal reflection happen live.' }]
},
{ num: 16, tag: 'LIGHT', title: 'Lenses & Optical Devices',
  card: 'Converging and diverging lenses, ray diagrams, real and virtual images, magnifying glass, magnification.',
  theory: [
    ['Types of Lenses', ['A converging (convex) lens is thicker in the middle: it bends parallel rays inwards so they meet at the principal focus. A diverging (concave) lens is thinner in the middle and spreads rays outwards so they appear to come from a focus on the other side.', 'The focal length f is the distance from the lens centre to the principal focus. A stronger lens is thicker and has a shorter focal length.']],
    ['Images Formed by a Converging Lens', ['Object beyond 2F: real, inverted, smaller image between F and 2F (camera).', 'Object at 2F: real, inverted, same-size image at 2F (photocopier).', 'Object between F and 2F: real, inverted, magnified image beyond 2F (projector).', 'Object inside F: virtual, upright, magnified image on the same side (magnifying glass).', 'A diverging lens always forms a virtual, upright, diminished image.']],
    ['Magnification', ['Linear magnification is how many times larger the image is than the object: magnification = image height / object height. It has no unit. Real images can be projected onto screens; virtual images cannot.']]
  ],
  defs: [
    ['Converging Lens', 'A lens thicker in the middle that bends parallel rays inwards to meet at the principal focus.'],
    ['Diverging Lens', 'A lens thinner in the middle that spreads parallel rays outwards as if from a virtual focus.'],
    ['Principal Focus', 'The point where rays parallel to the principal axis converge (or appear to diverge from) after passing through the lens.'],
    ['Focal Length', 'The distance from the optical centre of the lens to the principal focus.'],
    ['Real Image', 'An image formed where light rays actually meet, so it can be formed on a screen and is always inverted.'],
    ['Linear Magnification', 'The ratio of image height to object height; it has no unit.']
  ],
  formulae: { h: 'Lens Equation', intro: 'Use ray diagrams to locate images; magnification compares heights.', boxes: ['magnification m = image height / object height'] },
  practical: 'Find the focal length of a converging lens: focus the light from a distant window onto a sheet of paper. The distance from lens to paper is the focal length, because rays from a distant object arrive parallel.',
  exam: [
    ['An object 4 cm high stands on the axis of a converging lens. The image formed is 12 cm high. State the magnification and whether the image is real or virtual if it can be caught on a screen.', ['Magnification = image height / object height = 12 / 4 = 3x (1).', 'It can be caught on a screen, so it is a real image (1), which is always inverted (1).']],
    ['Explain why a magnifying glass must be held close to the object.', ['The object must be inside the focal length (between the lens and F) (1).', 'Only then does the lens form a virtual, upright, magnified image that the eye can see through the lens (1).']]
  ],
  phet: [{ name: 'Geometric Optics', slug: 'geometric-optics', desc: 'Move the object along a lens and watch the image change in real time.' }]
},
{ num: 17, tag: 'WAVES', title: 'The Electromagnetic Spectrum',
  card: 'The seven EM bands, common uses, dangers, and the properties all EM waves share.',
  theory: [
    ['What EM Waves Are', ['Electromagnetic waves are transverse waves that transfer energy from a source to an absorber. They do NOT need a medium - they all travel at the same top speed, 3 × 10⁸ m/s in a vacuum (the speed of light).', 'The spectrum in order of increasing frequency and decreasing wavelength: radio waves, microwaves, infrared, visible light (red to violet), ultraviolet, X-rays, gamma rays. Visible light is only a tiny slice of the spectrum.']],
    ['Uses and Dangers', ['Radio waves: TV and radio broadcasting, aircraft and satellite communication. Microwaves: satellite TV, mobile phones, cooking (water molecules absorb them).', 'Infrared: grills, toasters, remote controls, thermal imaging, optical fibres. Visible light: vision, photography, illumination. Ultraviolet: fluorescent lamps, sterilising water, detecting fake banknotes; danger - sunburn, skin cancer, eye damage.', 'X-rays: medical imaging of bones and teeth, airport security; danger - cell mutation and cancer. Gamma rays: sterilising medical equipment and food, cancer radiotherapy; danger - highly ionising, causes mutation.']]
  ],
  defs: [
    ['Electromagnetic Waves', 'Transverse waves made of oscillating electric and magnetic fields that travel at 3 × 10⁸ m/s in a vacuum and need no medium.'],
    ['Ionising Radiation', 'Radiation with enough energy to remove electrons from atoms, damaging cells - ultraviolet, X-rays and gamma rays.'],
    ['Infrared Radiation', 'EM waves just beyond red light, felt as heat; used in grills, remotes and thermal imaging.'],
    ['Ultraviolet', 'EM waves beyond violet light that cause fluorescence, sunburn and skin cancer.'],
    ['Microwaves', 'EM waves used for satellite communication and cooking because water molecules absorb them strongly.'],
    ['Gamma Rays', 'The highest-frequency EM waves, emitted by radioactive nuclei; used to sterilise equipment and treat cancer.']
  ],
  formulae: null,
  practical: 'Demonstration: pass white light through a prism to split it into a continuous spectrum, then place a thermometer just beyond the red end - the temperature rises fastest there, detecting invisible infrared.',
  exam: [
    ['Give one use and one danger of ultraviolet radiation.', ['Use: sterilising water / fluorescent lamps / detecting forged banknotes (1).', 'Danger: sunburn or skin cancer or eye damage, because UV is ionising (1).']],
    ['Explain why microwaves are used for satellite communication but not radio waves.', ['Microwaves pass through the ionosphere (electrically charged layers of the upper atmosphere) without being reflected (1).', 'Longer radio waves reflect off the ionosphere, so they cannot reach satellites (1).']]
  ],
  phet: []
},
{ num: 18, tag: 'WAVES', title: 'Sound & Ultrasound',
  card: 'How sound travels, echoes, pitch and loudness, the hearing range, ultrasound uses.',
  theory: [
    ['What Sound Is', ['Sound is a longitudinal wave of compressions and rarefactions travelling through a medium. It is produced by vibrating sources and CANNOT travel through a vacuum, because there are no particles to vibrate.', 'Typical speed: about 330-350 m/s in air, faster in liquids and fastest in solids. Loudness depends on amplitude; pitch depends on frequency.']],
    ['Hearing and Echoes', ['Humans hear roughly 20 Hz to 20 000 Hz (20 kHz). Above 20 kHz is ultrasound.', 'An echo is reflected sound. For a cliff at distance d, the sound travels there and back: speed = 2d / t.', 'Ultrasound uses: sonar (depth of sea, shoals of fish), non-invasive prenatal scanning, cleaning and quality testing of metals.']]
  ],
  defs: [
    ['Longitudinal Wave', 'A wave whose oscillations are parallel to the direction of travel, made of compressions and rarefactions - like sound.'],
    ['Compression', 'The region of a sound wave where the particles are squashed closest together and pressure is highest.'],
    ['Rarefaction', 'The region of a sound wave where particles are spread furthest apart and pressure is lowest.'],
    ['Echo', 'Sound reflected off a hard surface and heard again; used to measure distances via speed = 2d / t.'],
    ['Pitch', 'How high or low a note sounds; set by the frequency of the wave.'],
    ['Loudness', 'How strong a sound seems; set by the amplitude of the vibrations.'],
    ['Ultrasound', 'Sound with frequency above 20 000 Hz, beyond human hearing; used in sonar and medical scanning.']
  ],
  formulae: { h: 'Echo Equation', intro: 'Remember the sound travels to the surface AND back.', boxes: ['speed = 2 × distance to wall / time'] },
  practical: 'Measure the speed of sound: stand a known distance from a large wall, clap and listen for the echo, or use two microphones and an electronic timer. Sound needs a medium - a bell in a vacuum jar goes silent as the air is pumped out.',
  exam: [
    ['A student fires a starter pistol towards a cliff and hears the echo after 1.5 s. Sound travels at 340 m/s. How far away is the cliff?', ['Total distance = speed × time = 340 × 1.5 = 510 m (1).', 'Distance to cliff = 510 / 2 = 255 m (1).']],
    ['Explain why an astronaut on the Moon cannot hear an explosion nearby.', ['Sound is a longitudinal wave that needs particles to travel (1).', 'The Moon has no atmosphere - it is a vacuum, so the vibrations cannot reach the astronaut (1).']]
  ],
  phet: []
},
{ num: 19, tag: 'ELECTRICITY', title: 'Static Electricity',
  card: 'Charging by friction, electric fields, earthing, electrostatic hazards and applications.',
  theory: [
    ['Charge and Charging', ['Static electricity is charge that stays on an insulator. When two insulators are rubbed together, electrons - never protons - are transferred: polythene rubbed with cloth gains electrons and becomes negative; acetate loses them and becomes positive.', 'Like charges repel, unlike charges attract. Only electrons move; the object that gains electrons becomes negatively charged.']],
    ['Electric Fields and Earthing', ['An electric field is the region around a charge where another charge feels a force. Field lines point away from positive and towards negative charge; closer lines mean a stronger field.', 'A charged object can attract light uncharged objects by induction - it pushes the like charge away and pulls the unlike charge closer. Earthing lets excess charge flow harmlessly to the ground.']],
    ['Dangers and Uses', ['Dangers: fuel tankers earth themselves because a spark from static charge could ignite the vapour; lightning is a huge static discharge between cloud and ground; static makes paper and dust stick.', 'Uses: photocopiers and laser printers attract toner to charged plates; electrostatic precipitators remove ash and dust from factory chimneys; crop sprayers charge droplets so they spread evenly.']]
  ],
  defs: [
    ['Static Electricity', 'Electric charge that stays fixed on the surface of an insulator instead of flowing away.'],
    ['Electric Field', 'The region around a charged object where another charge experiences a force; drawn with lines pointing from + to −.'],
    ['Earthing', 'Providing a conducting path so excess charge can flow safely to or from the ground.'],
    ['Induction', 'Charging or attracting an object by rearranging its charges without contact.'],
    ['Electrostatic Precipitator', 'A chimney device that charges smoke particles so plates attract and collect them, cutting pollution.']
  ],
  formulae: null,
  practical: 'Rub a polythene rod with a duster and hold it near a stream of tap water - the rod bends the water towards it. Suspend two charged rods to show like charges repelling. Discharge a charged rod slowly with a finger (earthing) and feel no shock - the current is tiny.',
  exam: [
    ['Explain how a polythene rod becomes negatively charged when rubbed with a dry cloth.', ['Friction transfers electrons between the materials (1).', 'Electrons move from the cloth to the polythene, so the rod gains electrons and becomes negative while the cloth becomes positive (1).']],
    ['Explain why a fuel tanker must be earthed before fuel is transferred.', ['Friction during the journey leaves static charge on the tanker body (1).', 'A spark when the nozzle connects could ignite the fuel vapour; earthing lets the charge flow away safely so no spark forms (1).']]
  ],
  phet: [{ name: 'Balloons and Static Electricity', slug: 'balloons-and-static-electricity', desc: 'Rub a balloon on a jumper and stick it to the wall - see the charges rearrange.' },
          { name: 'John Travoltage', slug: 'john-travoltage', desc: 'Build up charge by rubbing and watch the spark jump when you touch the door handle.' }]
},
{ num: 20, tag: 'ELECTRICITY', title: 'Current, Voltage & Resistance',
  card: 'Charge and current, potential difference, Ohm\u2019s law, I\u2013V characteristics, resistance factors.',
  theory: [
    ['Current and Charge', ['Electric current is the rate of flow of electric charge, carried by electrons in a metal: I = Q / t. Current is measured with an ammeter connected in SERIES. One ampere = one coulomb per second.', 'Voltage (potential difference) is the energy transferred per unit charge: V = W / Q. A voltmeter is connected in PARALLEL across the component.']],
    ['Resistance and Ohm\u2019s Law', ['Resistance opposes current: R = V / I, measured in ohms (Ω). For an ohmic conductor at constant temperature, I is proportional to V - this is Ohm\u2019s law.', 'I-V graphs: an ohmic conductor is a straight line through the origin; a filament lamp curves because heating raises the resistance; a diode conducts in one direction only.']],
    ['What Changes Resistance', ['Resistance increases with length (R ∝ L) and decreases with cross-sectional area (R ∝ 1/A). It also depends on the material and on temperature - metals conduct worse when hot, while thermistors are designed to conduct better when hot.']]
  ],
  defs: [
    ['Electric Current', 'The rate of flow of electric charge, I = Q / t, measured in amperes with an ammeter in series.'],
    ['Coulomb', 'The unit of charge; one coulomb is the charge passing when a current of one amp flows for one second.'],
    ['Potential Difference', 'The work done (energy transferred) per unit charge moving between two points: V = W / Q, measured in volts.'],
    ['Ohm\u2019s Law', 'For an ohmic conductor at constant temperature, current is directly proportional to potential difference (V = IR).'],
    ['Ohmic Conductor', 'A conductor whose I-V graph is a straight line through the origin because its resistance stays constant.'],
    ['Diode', 'A component that lets current flow in one direction only; used to convert a.c. to d.c.']
  ],
  formulae: { h: 'Electrical Quantities', intro: 'Learn all four relationships - most exam calculations use at least one.', boxes: ['I = Q / t', 'V = W / Q', 'V = I × R', 'R increases with length, decreases with area'] },
  practical: 'Investigate an I-V characteristic: connect a component to a cell, ammeter (series), voltmeter (parallel) and variable resistor. Vary the supply and record pairs of readings. Reverse the connections to see negative values - the lamp\u2019s curve flattens as it heats.',
  exam: [
    ['A charge of 45 C flows through a lamp in 30 s. Calculate the current.', ['I = Q / t (1).', 'I = 45 / 30 = 1.5 A (1).']],
    ['Explain why the resistance of a filament lamp increases as it glows brighter.', ['More current makes the filament hotter (1).', 'The metal ions vibrate more, so electrons collide with them more often - resistance rises, which bends the I-V graph (1).']]
  ],
  phet: [{ name: 'Ohm\u2019s Law', slug: 'ohms-law', desc: 'Adjust voltage and resistance and watch the current respond instantly.' },
          { name: 'Resistance in a Wire', slug: 'resistance-in-a-wire', desc: 'See how length, thickness and material change a wire\u2019s resistance.' }]
},
{ num: 21, tag: 'ELECTRICITY', title: 'Electric Circuits',
  card: 'Series and parallel circuits, circuit symbols, combined resistance, thermistors and LDRs.',
  theory: [
    ['Series Circuits', ['In a series circuit there is one loop: the current is the SAME everywhere; the supply voltage is SHARED between components in proportion to their resistances; total resistance is the sum of the separate resistances (Rt = R1 + R2 + ...).', 'One break or one blown bulb stops the whole circuit. Cell voltages in series add up.']],
    ['Parallel Circuits', ['In a parallel circuit each branch gets the full supply voltage; the current SPLITS between branches (adding up to the supply current); total resistance is LESS than the smallest branch resistance: 1/Rt = 1/R1 + 1/R2.', 'Household lighting is wired in parallel so every lamp gets full voltage and works independently.']],
    ['Sensing Circuits', ['A thermistor\u2019s resistance falls when it gets warmer; an LDR\u2019s resistance falls in brighter light. Wired in a potential divider, they switch on heaters, street lamps and night lights automatically.']]
  ],
  defs: [
    ['Series Circuit', 'A single loop where the same current passes through every component in turn.'],
    ['Parallel Circuit', 'A circuit with branches, each connected across the same supply voltage.'],
    ['Thermistor', 'A resistor whose resistance decreases as temperature rises; used in temperature-sensing circuits.'],
    ['LDR (Light-Dependent Resistor)', 'A resistor whose resistance decreases as light intensity increases; used in automatic lights.'],
    ['Potential Divider', 'Two resistors in series that split the supply voltage so part of the circuit gets a chosen fraction of it.']
  ],
  formulae: { h: 'Circuit Rules', intro: 'Learn the series and parallel resistance rules and when each applies.', boxes: ['Series: Rt = R1 + R2 + R3 ...', 'Parallel: 1/Rt = 1/R1 + 1/R2 ...', 'V out (divider) = V supply × R2 / (R1 + R2)'] },
  practical: 'Build a sensing circuit: a thermistor and fixed resistor in series across a supply, with the output across the fixed resistor. Warm the thermistor - its resistance falls, more voltage appears across the fixed resistor - exactly how a fan heater\u2019s thermostat works.',
  exam: [
    ['A 4 Ω and a 12 Ω resistor are connected in parallel. Calculate the total resistance.', ['1/Rt = 1/4 + 1/12 = 3/12 + 1/12 = 4/12 (1).', 'Rt = 12/4 = 3 Ω - less than either branch resistance (1).']],
    ['Explain why a street lamp with an LDR switches on automatically at dusk.', ['At dusk the light level falls, so the LDR\u2019s resistance rises (1).', 'Its share of the supply voltage rises until the switching circuit detects enough voltage to turn the lamp on (1).']]
  ],
  phet: [{ name: 'Circuit Construction Kit: DC', slug: 'circuit-construction-kit-dc', desc: 'Build series and parallel circuits with virtual bulbs, meters and resistors.' }]
},
{ num: 22, tag: 'ELECTRICITY', title: 'Practical Electricity & Mains Safety',
  card: 'Electrical power and energy, the kilowatt-hour, mains wiring, fuses and the earth wire.',
  theory: [
    ['Power, Energy and Cost', ['Electrical power is energy transferred per second: P = VI = I²R = V²/R. Energy used: E = VIt = Pt.', 'Electricity meters measure energy in kilowatt-hours (kWh): 1 kWh is the energy a 1 kW appliance uses in 1 hour. Cost = kWh × price per kWh.']],
    ['Mains Wiring and Safety', ['The live wire (brown) carries the supply at about 230 V; the neutral (blue) completes the circuit near 0 V; the earth wire (green-yellow) is a safety wire connected to the metal case.', 'If a fault makes the case live, a large current flows through the earth wire and blows the FUSE, disconnecting the appliance. The fuse rating should be just above the normal operating current. Double-insulated appliances (plastic cases) need no earth wire.']],
    ['Hazards', ['Damaged insulation, overheated cables (too much current for the wire thickness), damp conditions, and long extension leads all risk fire or shock. Circuit breakers trip faster than fuses and can be reset.']]
  ],
  defs: [
    ['Electrical Power', 'The energy transferred per second by a component: P = VI = I²R = V²/R, measured in watts.'],
    ['Kilowatt-hour', 'The energy used by a 1 kW appliance in 1 hour - the commercial unit of electrical energy.'],
    ['Fuse', 'A thin wire that melts when the current exceeds its rating, breaking the circuit; fitted in the live wire.'],
    ['Earth Wire', 'A safety wire connecting an appliance\u2019s metal case to the ground so fault current flows and blows the fuse.'],
    ['Live Wire', 'The brown mains wire carrying the alternating supply at about 230 V.'],
    ['Double Insulation', 'Appliance protection where the case is entirely plastic, so no earth wire is needed.']
  ],
  formulae: { h: 'Power, Energy & Cost', intro: 'P = VI first, then everything else follows.', boxes: ['P = V × I = I²R = V²/R', 'E = P × t = VIt', 'Cost = kWh used × price per kWh'] },
  practical: 'Wire a three-pin plug correctly: 3 A fuse for small appliances (lamps), 13 A for heaters and kettles. Check the fuse rating against the appliance current: a 1.8 kW heater at 230 V draws I = 1800/230 ≈ 7.8 A, so a 13 A fuse is chosen.',
  exam: [
    ['A 2.0 kW heater runs for 3 hours. Electricity costs 30 cents per kWh. Calculate the cost.', ['Energy = 2.0 kW × 3 h = 6 kWh (1).', 'Cost = 6 × 30 = 180 cents = $1.80 (1).']],
    ['Explain how the earth wire and fuse together protect the user of a metal washing machine.', ['If the live wire touches the metal case, the case becomes live at 230 V (1).', 'A very large current flows through the earth wire and melts the fuse, disconnecting the supply before anyone touching the case gets shocked (1).']]
  ],
  phet: []
},
{ num: 23, tag: 'MAGNETISM', title: 'Magnetism & Electromagnets',
  card: 'Magnetic materials and fields, plotting fields, electromagnets and their uses.',
  theory: [
    ['Magnets and Magnetic Materials', ['Magnetic materials are iron, steel, cobalt and nickel. Iron is magnetically SOFT (magnetises and loses magnetism easily - ideal for electromagnet cores); steel is magnetically HARD (keeps its magnetism - ideal for permanent magnets).', 'Magnets always have a north and south pole. Like poles repel, unlike poles attract. A magnet attracts (not repels) any magnetic material.']],
    ['Magnetic Fields', ['A magnetic field is the region where a magnetic material or compass experiences a force. Field lines run from the north pole to the south pole; the closer the lines, the stronger the field.', 'Plot a field with a compass: place it near the magnet, mark the needle directions, move around the magnet and join the marks into field lines.']],
    ['Electromagnets', ['A solenoid (coil of wire) with current flowing acts like a bar magnet; adding a soft-iron core makes a much stronger electromagnet. Its strength increases with more turns, more current, or a core.', 'Electromagnets switch on and off - used in scrapyard cranes, relays (a small current switches a larger one), electric bells and Maglev trains.']]
  ],
  defs: [
    ['Magnetic Field', 'The region around a magnet where a magnetic material or compass needle experiences a force.'],
    ['Magnetic Field Line', 'A line showing the direction a north pole would move; lines run from N to S and never cross.'],
    ['Induced Magnetism', 'Magnetism created in a magnetic material when it is placed in a magnetic field.'],
    ['Soft Magnetic Material', 'Iron - magnetises and demagnetises easily, so it is used for electromagnet cores.'],
    ['Hard Magnetic Material', 'Steel - keeps its magnetism, so it is used for permanent magnets.'],
    ['Electromagnet', 'A coil of wire (often on a soft-iron core) that acts as a magnet only while current flows.'],
    ['Relay', 'A switch where a small current through an electromagnet closes a circuit carrying a much larger current.']
  ],
  formulae: null,
  practical: 'Plot the field of a bar magnet with a compass and iron filings on paper. Then build an electromagnet: wind 20 turns of insulated wire on an iron nail, connect to a cell and pick up paperclips. Add turns or cells - the magnet lifts more clips.',
  exam: [
    ['Explain why the core of an electromagnet is made of iron rather than steel.', ['Iron is a magnetically soft material (1).', 'It magnetises and demagnetises instantly with the current, so the electromagnet can be switched on and off; steel would stay magnetised (1).']],
    ['Describe how a relay allows a small current to switch a large current.', ['The small current energises the electromagnet (1).', 'It attracts an iron armature, which closes the contacts of the high-current circuit - so a sensor circuit can safely switch a motor or heater (1).']]
  ],
  phet: [{ name: 'Magnet and Compass', slug: 'magnet-and-compass', desc: 'Move a compass around a magnet and watch the needle follow the field lines.' },
          { name: 'Magnets and Electromagnets', slug: 'magnets-and-electromagnets', desc: 'Switch a coil on and off, flip the poles and pick up paperclips with an electromagnet.' }]
},
{ num: 24, tag: 'MAGNETISM', title: 'Electromagnetism: Motors, Generators & Transformers',
  card: 'The motor effect, F = BIL, d.c. motors, electromagnetic induction, a.c. generators, transformers.',
  theory: [
    ['The Motor Effect', ['A current-carrying wire in a magnetic field experiences a force. The force is largest when the wire is at 90° to the field and zero when parallel. Direction: Fleming\u2019s LEFT-hand rule ( thuMb = Motion, First finger = Field, seCond finger = Current).', 'Force grows with stronger field, more current or longer wire in the field: F = BIL.', 'A d.c. motor spins because opposite forces on the two sides of the coil turn it; the split-ring commutator reverses the current every half-turn so the coil keeps rotating the same way.']],
    ['Electromagnetic Induction', ['Moving a magnet into a coil (or a wire across a field) induces an EMF across the coil: electromagnetic induction. Faster movement, stronger magnets, more turns or a softer iron core give a bigger EMF.', 'The induced current opposes the change causing it (Lenz\u2019s law) - that is why pushing a magnet in feels a resistance. An a.c. generator spins a coil in a magnetic field; slip rings give alternating current.']],
    ['Transformers', ['A transformer transfers electrical power between two coils on an iron core: an alternating voltage in the primary induces an alternating voltage in the secondary. Vs / Vp = Ns / Np for an ideal transformer.', 'Step-up transformers raise voltage (more secondary turns); the national grid transmits power at very high voltage because higher voltage means LOWER current for the same power, so much less energy is wasted heating the cables (P = I²R).']]
  ],
  defs: [
    ['Motor Effect', 'The force experienced by a current-carrying conductor placed in a magnetic field.'],
    ['Fleming\u2019s Left-Hand Rule', 'Thumb = motion (force), first finger = field (N to S), second finger = current (+ to −).'],
    ['Electromagnetic Induction', 'Generating an EMF across a conductor when it experiences a changing magnetic field.'],
    ['Split-Ring Commutator', 'The reversing switch on a d.c. motor that keeps the coil spinning in one direction.'],
    ['Slip Rings', 'Contacts that connect a spinning generator coil to the output without reversing it, giving a.c.'],
    ['Transformer', 'Two coils on an iron core that change alternating voltage: Vs / Vp = Ns / Np.'],
    ['Step-Up Transformer', 'A transformer with more secondary turns that raises voltage and lowers current.']
  ],
  formulae: { h: 'Electromagnetism Equations', intro: 'F = BIL uses the component of field at 90° to the wire.', boxes: ['F = B × I × L', 'Vs / Vp = Ns / Np', 'For an ideal transformer: Vp × Ip = Vs × Is'] },
  practical: 'Make the motor effect visible: hang a foil strip between magnet poles and connect a cell - the strip kicks. Swap the cell terminals and it kicks the other way. Spin a coil between magnets connected to a sensitive meter to see induced current swing both ways (a.c.).',
  exam: [
    ['A transformer steps 230 V down to 12 V. The primary has 1150 turns. How many turns does the secondary have?', ['Vs / Vp = Ns / Np (1).', 'Ns = 12/230 × 1150 = 60 turns (1).']],
    ['Explain why the national grid transmits electricity at very high voltage.', ['For a fixed power, a higher voltage means a lower current (P = VI) (1).', 'Power wasted as heat in the cables is I²R, so a smaller current wastes much less energy (1).']]
  ],
  phet: [{ name: 'Faraday\u2019s Law', slug: 'faradays-law', desc: 'Move a magnet through a coil and watch the light bulb flash as EMF is induced.' },
          { name: 'Magnets and Electromagnets', slug: 'magnets-and-electromagnets', desc: 'See how coils and fields interact - the foundation of motors and generators.' }]
},
{ num: 25, tag: 'NUCLEAR', title: 'Radioactivity & Nuclear Physics',
  card: 'The nucleus and isotopes, alpha/beta/gamma radiation, half-life, uses and safety.',
  theory: [
    ['The Nucleus and Isotopes', ['The nucleus contains protons (positive) and neutrons (neutral). Nuclide notation ⁿₘX gives the proton number m (bottom) and nucleon number n (top). Isotopes are atoms of the same element with the same protons but different numbers of neutrons.', 'Some isotopes are unstable and decay, emitting radiation. Decay is random and spontaneous - unaffected by temperature or chemistry.']],
    ['The Three Radiations', ['Alpha (α): a helium nucleus (2p + 2n), charge +2. Stopped by paper or a few cm of air; the strongest ioniser. Deflected slightly by fields.', 'Beta (β): a fast electron emitted when a neutron turns into a proton. Stopped by a few mm of aluminium; moderately ionising; deflected the opposite way to alpha.', 'Gamma (γ): a high-frequency EM wave, no mass or charge. Reduced by thick lead; the weakest ioniser but most penetrating; not deflected. Radiation is detected with a Geiger-Müller tube, photographic film or a cloud chamber.']],
    ['Half-Life, Uses and Safety', ['Half-life is the time for half the unstable nuclei in a sample to decay. After each half-life the activity halves.', 'Uses: carbon dating (C-14), medical tracers (technetium), sterilising equipment, controlling sheet thickness, smoke alarms (americium). Background radiation comes from radon, rocks, cosmic rays and food.', 'Safety: time, distance and shielding - handle sources with tongs, point them away, store in lead-lined boxes, wear film badges. Ionising radiation damages cells and can cause cancer.']]
  ],
  defs: [
    ['Isotope', 'Atoms of the same element (same protons) with different numbers of neutrons.'],
    ['Radioactive Decay', 'The random, spontaneous release of radiation from an unstable nucleus.'],
    ['Alpha Particle', 'A helium nucleus (2 protons + 2 neutrons) emitted from a nucleus; strongly ionising, stopped by paper.'],
    ['Beta Particle', 'A fast electron emitted when a neutron changes into a proton; stopped by a few mm of aluminium.'],
    ['Gamma Ray', 'A high-frequency EM wave emitted by a nucleus; the most penetrating, weakest ionising radiation.'],
    ['Half-Life', 'The time taken for half the unstable nuclei in a sample to decay.'],
    ['Background Radiation', 'The low-level radiation always around us from radon gas, rocks, cosmic rays and radioactive food.'],
    ['Nucleon Number', 'The total number of protons and neutrons in a nucleus (the top number in nuclide notation).']
  ],
  formulae: { h: 'Half-Life', intro: 'Count how many half-lives have passed, then halve the activity that many times.', boxes: ['remaining activity = initial × (1/2)^(time / half-life)'] },
  practical: 'Use a GM tube and counter: measure background first, then a source. Place paper, then aluminium, then lead between - the count drops step by step, identifying alpha, beta and gamma. Always handle the source with tongs, pointing it away from people.',
  exam: [
    ['A source has an activity of 800 Bq and a half-life of 2 hours. Calculate its activity after 6 hours.', ['6 hours = 3 half-lives (1).', 'Activity = 800 → 400 → 200 → 100 Bq (1).']],
    ['A nucleus emits a beta particle. Explain what changes inside the nucleus.', ['A neutron changes into a proton and an electron (1).', 'The proton number rises by 1, the nucleon number is unchanged, and the electron is emitted as the beta particle (1).']]
  ],
  phet: [{ name: 'Radioactive Dating Game', slug: 'radioactive-dating-game', desc: 'Measure carbon-14 decay to date ancient objects and watch half-life on a graph.' },
          { name: 'Isotopes and Atomic Mass', slug: 'isotopes-and-atomic-mass', desc: 'Build isotopes and see how they change an element\u2019s average mass.' }]
},
{ num: 26, tag: 'SPACE', title: 'Earth & Space Physics',
  card: 'Earth, Moon and seasons, the Solar System, orbits, life cycle of stars, red-shift and the universe.',
  theory: [
    ['Earth, Moon and Seasons', ['The Earth spins on its tilted axis once every 24 hours, giving day and night. Its 365-day orbit around the Sun, plus the 23.5° tilt, gives the seasons: each hemisphere leans towards the Sun in its summer.', 'The Moon orbits Earth monthly, showing phases because we see different amounts of its sunlit half. Solar and lunar eclipses happen when Sun, Moon and Earth line up.']],
    ['The Solar System and Orbits', ['Gravity keeps the planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune) in elliptical orbits around the Sun, and moons around planets. Smaller bodies: asteroids (rock, mostly between Mars and Jupiter), comets (ice and dust with long tails near the Sun), natural and artificial satellites.', 'Orbital speed v = 2πr / T, where r is orbit radius and T the orbital period. Bigger orbits mean longer periods - the orbital speed of a planet is slower the further it is from the Sun.']],
    ['Stars and the Universe', ['Stars shine by nuclear FUSION - hydrogen nuclei join to make helium, releasing huge energy. Star life cycle: nebula → main-sequence star (gravity balanced by fusion pressure) → red giant → white dwarf; a massive star becomes a red supergiant → supernova → neutron star or black hole.', 'Galaxies hold billions of stars. Light from distant galaxies is RED-SHIFTED - stretched to longer wavelengths - showing they are moving away: the universe is expanding from the Big Bang.']]
  ],
  defs: [
    ['Orbit', 'The curved path of one object around another because of gravity, e.g. a planet around the Sun.'],
    ['Satellite', 'An object orbiting a larger one - natural (the Moon) or artificial (weather and GPS satellites).'],
    ['Nuclear Fusion', 'The joining of light nuclei (like hydrogen) into heavier nuclei, releasing enormous energy - the Sun\u2019s power source.'],
    ['Nebula', 'A huge cloud of gas and dust in space where stars are born.'],
    ['Supernova', 'The explosive death of a massive star, which can leave a neutron star or black hole.'],
    ['Red-Shift', 'The stretching of light from receding galaxies to longer (redder) wavelengths - evidence the universe is expanding.'],
    ['Comet', 'A body of ice and dust in an elliptical orbit that grows a glowing tail when near the Sun.']
  ],
  formulae: { h: 'Orbital Motion', intro: 'Orbit radius r and period T give the speed along the orbit.', boxes: ['orbital speed v = 2 × π × r / T'] },
  practical: 'Model the seasons with a lamp (Sun) and a tilted globe (Earth): keep the axis pointing the same way as the globe circles the lamp and watch which hemisphere gets more direct light. Model phases of the Moon with a ball held up to lamplight.',
  exam: [
    ['A satellite orbits Earth at radius 7.0 × 10⁶ m with a period of 5.9 × 10³ s. Calculate its orbital speed.', ['v = 2πr / T (1).', 'v = (2 × π × 7.0 × 10⁶) / (5.9 × 10³) ≈ 7.5 × 10³ m/s (1).']],
    ['Explain how red-shift supports the Big Bang theory.', ['Light from distant galaxies is shifted to longer, redder wavelengths (1).', 'This shows the galaxies are receding - the further away, the faster - so the universe is expanding, and tracing back in time points to an initial hot, dense beginning (1).']]
  ],
  phet: [{ name: 'Gravity and Orbits', slug: 'gravity-and-orbits', desc: 'Launch planets and satellites and see how gravity bends their paths into orbits.' },
          { name: 'Blackbody Spectrum', slug: 'blackbody-spectrum', desc: 'Compare the light a star gives off as you heat or cool it.' }]
}
];

/* ---------------- Biology 15 ---------------- */
const BIO15 = { num: 15, title: 'Biotechnology & Genetic Modification' };

/* ---------------- builder ---------------- */
function buildPhysicsChapter(ch) {
  let shell = read('physics-chapter1.html');
  const openTag = '<div class="main-content">';
  const i0 = shell.indexOf(openTag);
  const iEnd = shell.indexOf('</aside>', i0);
  const shell1 = shell.slice(0, i0 + openTag.length);
  let shell2 = shell.slice(shell.indexOf('<aside class="sidebar">', iEnd - 400));
  const num2 = String(ch.num).padStart(2, '0');

  let s = '';
  // theory
  s += '                    <section id="theory">\n                        <span class="section-label">THEORY</span>\n';
  ch.theory.forEach((blk, bi) => {
    s += `                        <h2>${esc(blk[0])}</h2>\n`;
    blk[1].forEach(p => { s += `                        <p>${p}</p>\n`; });
  });
  s += '                    </section>\n\n';
  // definitions
  s += '                    <section id="definitions">\n                        <span class="section-label">DEFINITIONS</span>\n';
  ch.defs.forEach(([t, d]) => { s += `                        <p><strong>${esc(t)}:</strong> ${d}</p>\n`; });
  s += '                    </section>\n\n';
  // formulae
  if (ch.formulae) {
    s += `                    <section id="formulae">\n                        <span class="section-label">FORMULAE &amp; CALCULATIONS</span>\n                        <h2>${esc(ch.formulae.h)}</h2>\n                        <p>${ch.formulae.intro}</p>\n                        <div class="formula-box">\n`;
    ch.formulae.boxes.forEach(b => { s += `                            <div class="formula">${b}</div>\n`; });
    s += '                        </div>\n                    </section>\n\n';
  }
  // practical
  s += `                    <section id="practical">\n                        <span class="section-label">PRACTICAL WORK</span>\n                        <p>${ch.practical}</p>\n                    </section>\n\n`;
  // exam
  s += '                    <section id="exam">\n                        <span class="section-label">EXAM PRACTICE</span>\n                        <h2>Test Your Knowledge</h2>\n';
  ch.exam.forEach((q, qi) => {
    s += `                        <div class="exam-box">\n                            <h4>Question ${qi + 1}</h4>\n                            <p>${q[0]}</p>\n                            <button class="answer-btn" onclick="toggleAnswer('ans${qi + 1}')">SHOW ANSWER</button>\n                            <div class="answer-text" id="ans${qi + 1}">\n`;
    q[1].forEach(l => { s += `                                <p>${l}</p>\n`; });
    s += '                            </div>\n                        </div>\n';
  });
  s += '                    </section>\n\n';
  // resources (PhET)
  if (ch.phet && ch.phet.length) {
    s += '                    <section id="resources">\n                        <span class="section-label">VISUAL LEARNING</span>\n                        <h2>Interactive Simulations</h2>\n                        <p>See these ideas move - each link opens a free, interactive simulation in a new tab. Play with the variables until the behaviour makes sense.</p>\n';
    ch.phet.forEach(p => {
      s += `                        <div class="exam-box">\n                            <h4>${esc(p.name)} — PhET Interactive Simulations</h4>\n                            <p>${p.desc}</p>\n                            <a class="answer-btn" style="text-decoration:none; display:inline-block; margin-top:0.6rem;" href="https://phet.colorado.edu/en/simulations/${p.slug}" target="_blank" rel="noopener">OPEN SIMULATION</a>\n                        </div>\n`;
    });
    s += '                    </section>\n\n';
  }

  shell2 = shell2
    .replace('physics-chapter-01', 'physics-chapter-' + num2)
    .replace('Chapter 01 marked as complete!', 'Chapter ' + num2 + ' marked as complete!');

  const head = shell1
    .replace(/<title>.*<\/title>/, `<title>OLPW PHYSICS — Chapter ${num2}: ${esc(ch.title)}</title>`)
    .replace(/PHYSICS \/ 01 \/ MOTION \/ <span>CHAPTER 01<\/span>/, `PHYSICS / ${num2} / ${ch.tag} / <span>CHAPTER ${num2}</span>`)
    .replace(/<h1>.*<\/h1>/, `<h1>${esc(ch.title)}</h1>`);
  write(`physics-chapter${ch.num}.html`, head + s + shell2);
  return { num: ch.num, title: ch.title, card: ch.card };
}

/* physics.html cards */
function addPhysicsCards(list) {
  let html = read('physics.html');
  if (html.includes('physics-chapter15.html')) return;
  const anchor = 'href="physics-chapter14.html"';
  const a = html.indexOf(anchor);
  if (a < 0) throw new Error('physics.html ch14 anchor missing');
  const aEnd = html.indexOf('</a>', a);
  const cardEnd = html.indexOf('</div>', aEnd) + '</div>'.length;
  let cards = '';
  list.forEach(ch => {
    cards += `\n            <!-- Chapter ${String(ch.num).padStart(2, '0')} -->\n            <div class="study-card">\n                <div class="card-header">\n                    <span class="chapter-number">Chapter ${String(ch.num).padStart(2, '0')}</span>\n                </div>\n                <div class="card-content">\n                    <h2 class="chapter-title">${esc(ch.title)}</h2>\n                    <p>${ch.card}</p>\n                </div>\n                <a href="physics-chapter${ch.num}.html" class="resource-link">\n                    Access Materials\n                    <svg viewBox="0 0 24 24"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/></svg>\n                </a>\n            </div>`;
  });
  html = html.slice(0, cardEnd) + cards + html.slice(cardEnd);
  write('physics.html', html);
}

/* biology B15 from the biology template */
function buildBiology15() {
  let shell = read('biology-chapter1.html');
  const i0 = shell.indexOf('<div class="main-content">');
  const iEnd = shell.indexOf('<aside class="sidebar">', i0);
  const shell1 = shell.slice(0, i0 + '<div class="main-content">'.length);
  let shell2 = shell.slice(shell.indexOf('</aside>', iEnd) - '                '.length);

  const sec = (label, inner) => `                    <section id="${label[1]}">\n                        <span class="section-label">${label[0]}</span>\n${inner}                    </section>\n\n`;
  let s = '';
  s += sec(['SECTION 01 — CHAPTER OVERVIEW', 'overview'], `                        <h2>Using Microbes &amp; Changing Genes</h2>\n                        <p>Biotechnology puts living things - mostly bacteria, fungi and their enzymes - to work for humans, from bread and beer to penicillin and washing powder. Genetic modification goes further: it moves a gene from one organism into another, such as putting the human insulin gene into bacteria so they manufacture insulin for medicine.</p>\n`);
  s += sec(['SECTION 02 — LEARNING OBJECTIVES', 'objectives'], `                        <ul class="checklist">\n                            <li>Describe how yeast is used in bread-making and brewing.</li>\n                            <li>Explain how industrial fermenters keep microbes productive.</li>\n                            <li>Recall industrial enzyme uses (pectinase, rennin, lactase, proteases).</li>\n                            <li>Describe how bacteria are genetically modified to produce insulin.</li>\n                            <li>Discuss the advantages and concerns of GM crops.</li>\n                        </ul>\n`);
  s += sec(['SECTION 03 — CORE THEORY', 'theory'], `                        <h2>Fermentation &amp; Industrial Microbes</h2>\n                        <p>Yeast respires sugar: aerobically for quick growth, and ANAEROBICALLY (fermentation) when oxygen runs out, producing ethanol and carbon dioxide. Bread-making uses the CO₂ to raise dough (the ethanol evaporates in the oven); brewing uses the ethanol.</p>\n                        <p>An industrial fermenter is a steel tank built to keep microbes at their optimum: thermostats hold the temperature, paddles mix and add oxygen, pH probes and buffers hold acidity steady, and everything is sterilised first so only the wanted microbe grows.</p>\n                        <p>Enzymes are harvested for industry: pectinase clarifies fruit juice, rennin (chymosin) curdles milk for cheese, lactase makes lactose-free milk, and proteases and lipases in biological washing powder digest food stains at low temperatures.</p>\n                        <p>Penicillin is made by growing the mould <em>Penicillium</em> in huge fermenters; the antibiotic is extracted from the broth and purified. The producing strain was originally from a chance mould on a petri dish - Fleming\u2019s famous discovery.</p>\n`);
  s += sec(['SECTION 04 — KEY DEFINITIONS', 'definitions'], `                        <div class="info-box">\n                            <p><strong>BIOTECHNOLOGY:</strong> The use of living organisms or their enzymes to make useful products for humans.</p>\n                            <p><strong>FERMENTATION:</strong> The anaerobic respiration of yeast: glucose → ethanol + carbon dioxide.</p>\n                            <p><strong>FERMENTER:</strong> A controlled tank (temperature, pH, oxygen, stirring) in which microbes are grown on a large scale.</p>\n                            <p><strong>GENETIC MODIFICATION:</strong> Transferring a gene from one organism into the DNA of another so the receiver makes a new protein.</p>\n                            <p><strong>TRANSGENIC:</strong> Describes an organism carrying a gene from a different species.</p>\n                            <p><strong>PLASMID:</strong> A small ring of bacterial DNA used as a vector to carry an inserted gene into a bacterium.</p>\n                        </div>\n`);
  s += sec(['SECTION 05 — PRACTICAL LAB', 'practical'], `                        <div class="info-box">\n                            <h4>AIM</h4>\n                            <p>Investigate anaerobic respiration in yeast and the conditions it needs.</p>\n                            <h4>METHOD</h4>\n                            <p>1. Mix yeast with sugar solution in a flask and fit a balloon or limewater tube.</p>\n                            <p>2. Keep one flask warm (35 °C) and one on ice; compare balloon inflation or limewater turning milky.</p>\n                            <p>3. Repeat without sugar as a control - no gas is made without substrate.</p>\n                            <h4>CONCLUSION</h4>\n                            <p>Gas (CO₂) is produced only when yeast, sugar and warmth are all present: fermentation needs respiration substrate and enzyme-friendly temperatures.</p>\n                        </div>\n`);
  s += sec(['SECTION 06 — EXAM TECHNIQUE', 'technique'], `                        <p><strong>DESCRIBE:</strong> State the steps of genetic modification in order - gene cut with restriction enzyme, plasmid cut with the same enzyme, gene inserted with ligase, plasmid returned to bacterium, bacteria cultured in fermenters.</p>\n                        <p><strong>DISCUSS:</strong> Give both sides for GM crops - higher yields and vitamins (golden rice) versus gene spread to wild plants and farmer seed costs.</p>\n`);
  s += sec(['SECTION 07 — COMMON MISTAKES', 'mistakes'], `                        <div class="info-box">\n                            <p><strong>Mistake:</strong> Saying yeast fermentation produces CO₂ and water.</p>\n                            <p><strong>Correction:</strong> Anaerobic fermentation produces ethanol and CO₂ only - no water, and much less ATP than aerobic respiration.</p>\n                            <p><strong>Mistake:</strong> Writing that the insulin GENE is "harmful" to bacteria or that the whole human insulin protein is inserted.</p>\n                            <p><strong>Correction:</strong> Only the DNA/gene is inserted; the bacterium then reads it and makes the insulin protein itself.</p>\n                        </div>\n`);
  s += sec(['SECTION 08 — QUICK REVISION', 'revision'], `                        <ul class="checklist">\n                            <li>Yeast + sugar, no oxygen → ethanol + CO₂.</li>\n                            <li>Fermenters control temperature, pH, oxygen and sterility.</li>\n                            <li>Enzyme uses: pectinase (juice), rennin (cheese), lactase (lactose-free milk), proteases (washing powder).</li>\n                            <li>GM insulin: human gene → plasmid → bacterium → fermenter → harvest insulin.</li>\n                            <li>GM crops: higher yield, added nutrients; concerns include gene spread and seed cost.</li>\n                        </ul>\n`);
  s += sec(['SECTION 09 — EXAM QUESTIONS', 'exam'], `                        <div class="exam-box">\n                            <h4>Question 1 (Foundation)</h4>\n                            <p>List three conditions an industrial fermenter must control and say why each matters.</p>\n                            <button class="answer-btn" onclick="toggleAnswer('ans1')">SHOW ANSWER</button>\n                            <div class="answer-text" id="ans1">\n                                <p>Temperature kept at optimum so enzymes work at their fastest without denaturing (1);</p>\n                                <p>Oxygen supplied (stirred in) so aerobic microbes like Penicillium respire and grow quickly (1);</p>\n                                <p>pH buffered at the optimum for the enzymes; sterile conditions so no competing microbes take over (any 3 × 1 mark).</p>\n                            </div>\n                        </div>\n                        <div class="exam-box">\n                            <h4>Question 2 (Challenge)</h4>\n                            <p>Describe how bacteria are genetically modified to produce human insulin.</p>\n                            <button class="answer-btn" onclick="toggleAnswer('ans2')">SHOW ANSWER</button>\n                            <div class="answer-text" id="ans2">\n                                <p>The human insulin gene is cut out of human DNA using a restriction enzyme (1);</p>\n                                <p>a bacterial plasmid is cut with the same enzyme so the sticky ends match (1);</p>\n                                <p>the gene is joined into the plasmid with DNA ligase and the plasmid is transferred into bacteria (1);</p>\n                                <p>the transgenic bacteria are grown in fermenters and insulin is harvested and purified (1).</p>\n                            </div>\n                        </div>\n`);
  s += sec(['SECTION 10 — FINAL CHECKLIST', 'checklist'], `                        <ul class="checklist">\n                            <li>I can explain bread-making and brewing with yeast fermentation.</li>\n                            <li>I can label fermenter conditions and justify each one.</li>\n                            <li>I know four industrial enzyme uses and their substrates.</li>\n                            <li>I can order the steps of producing GM insulin.</li>\n                            <li>I can argue benefits and risks of GM crops.</li>\n                        </ul>\n                        <button class="complete-btn" style="margin-top: 2rem;" onclick="markComplete('biology-chapter-15')">MARK CHAPTER COMPLETE</button>\n`);

  shell2 = shell2
    .replace('biology-chapter-01', 'biology-chapter-15')
    .replace('Chapter 01 marked as complete!', 'Chapter 15 marked as complete!');
  const head = shell1
    .replace(/<title>.*<\/title>/, '<title>OLPW BIOLOGY — Chapter 15: Biotechnology &amp; Genetic Modification</title>')
    .replace(/BIOLOGY \/ 01 \/ [^<]*\/ <span>CHAPTER 01<\/span>/, 'BIOLOGY / 15 / BIOTECHNOLOGY / <span>CHAPTER 15</span>')
    .replace(/<h1>.*<\/h1>/, '<h1>Biotechnology &amp; Genetic Modification</h1>');
  write('biology-chapter15.html', head + s + shell2);
}

/* ---------------- run ---------------- */
const added = PHYSICS.map(buildPhysicsChapter);
addPhysicsCards(added);
buildBiology15();

/* biology.html: append Chapter 15 card */
{
  let html = read('biology.html');
  if (html.includes('biology-chapter15.html')) return;
  const anchor = 'href="biology-chapter14.html"';
  const a = html.indexOf(anchor);
  const aEnd = html.indexOf('</a>', a);
  const cardEnd = html.indexOf('</div>', aEnd) + '</div>'.length;
  const card = `\n\n            <!-- Chapter 15 -->\n            <div class="study-card">\n                <div class="card-header">\n                    <span class="chapter-number">Chapter 15</span>\n                </div>\n                <div class="card-content">\n                    <h2 class="chapter-title">Biotechnology &amp; Genetic Modification</h2>\n                    <p>Fermentation, industrial enzymes and fermenters, penicillin, GM insulin and GM crops.</p>\n                </div>\n                <a href="biology-chapter15.html" class="resource-link">\n                    Access Materials\n                    <svg viewBox="0 0 24 24"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/></svg>\n                </a>\n            </div>`;
  html = html.slice(0, cardEnd) + card + html.slice(cardEnd);
  write('biology.html', html);
}

/* biology-dashboard: add chapter 15 + update count text */
{
  let html = read('biology-dashboard.html');
  const anchor = '{ id: "biology-chapter-14", num: "14", title: "Ecology, Ecosystems & Human Influences", desc: "Food webs, nutrient cycles, population sampling, biodiversity, pollution, conservation." }';
  if (!html.includes(anchor)) throw new Error('dashboard anchor missing');
  html = html.replace(anchor, anchor + ',\n            { id: "biology-chapter-15", num: "15", title: "Biotechnology & Genetic Modification", desc: "Fermentation, industrial enzymes and fermenters, penicillin, GM insulin and GM crops." }');
  html = html.replace('Covering 14 core chapters', 'Covering 15 core chapters');
  write('biology-dashboard.html', html);
}

/* chemistry.html: periodic table banner card + chemistry nav — placed after the chapter grid */
{
  let html = read('chemistry.html');
  if (!html.includes('periodic_table.html')) {
    const anchor = 'href="chemistry-chapter14.html"';
    const a = html.indexOf(anchor);
    if (a >= 0) {
      const aEnd = html.indexOf('</a>', a);
      const cardEnd = html.indexOf('</div>', aEnd) + '</div>'.length;
      const card = `\n\n            <!-- Periodic Table reference -->\n            <div class="study-card" style="outline: 2px solid currentColor;">\n                <div class="card-header">\n                    <span class="chapter-number">REFERENCE</span>\n                </div>\n                <div class="card-content">\n                    <h2 class="chapter-title">The Periodic Table — Full Interactive Reference</h2>\n                    <p>All 118 elements organised by group and period, with symbols, numbers and key data. Use it with every chemistry chapter.</p>\n                </div>\n                <a href="periodic_table.html" class="resource-link">\n                    Open Periodic Table\n                    <svg viewBox="0 0 24 24"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/></svg>\n                </a>\n            </div>`;
      html = html.slice(0, cardEnd) + card + html.slice(cardEnd);
      write('chemistry.html', html);
    }
  }
}

/* chemistry-chapter9 (The Periodic Table): embed the table permanently */
{
  let html = read('chemistry-chapter9.html');
  if (!html.includes('periodic_table.html')) {
    const anchor = html.indexOf('<section id="simulation"');
    const numMatch = html.match(/<span class="section-num">(\d+)<\/span>/g);
    let maxNum = 0;
    (numMatch || []).forEach(t => { maxNum = Math.max(maxNum, parseInt(t.replace(/\D/g, ''), 10)); });
    const embed = `\n    <section id="periodic-table">\n        <div class="container">\n            <div class="section-header">\n                <span class="section-num">${maxNum + 1}</span>\n                <h2 class="section-title">Periodic Table Reference</h2>\n            </div>\n            <p style="margin-bottom: 1rem;">The complete interactive periodic table is embedded below and always available here. Click any element for details, or open it <a href="periodic_table.html" target="_blank" rel="noopener">full screen</a>.</p>\n            <div style="border: 1px solid currentColor; border-radius: 8px; overflow: hidden;">\n                <iframe src="periodic_table.html" title="Interactive Periodic Table" style="width: 100%; height: 820px; border: none; display: block;" loading="lazy"></iframe>\n            </div>\n        </div>\n    </section>`;
    if (anchor >= 0) html = html.slice(0, anchor) + embed + '\n' + html.slice(anchor);
    else html = html.replace(/<\/body>/, embed + '\n</body>');
    write('chemistry-chapter9.html', html);
  }
}

console.log('chapters built: physics ' + added.map(a => a.num).join(',') + ' + biology 15');
console.log('subject pages, dashboard, periodic table embed: done');
