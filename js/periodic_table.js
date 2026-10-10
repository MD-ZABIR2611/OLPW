// OLPW:js/periodic_table.js | script for periodic_table
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const CATEGORIES = {
  'alkali-metal':     { name: 'Alkali Metal',         color: '#FF4500' },
  'alkaline-earth':   { name: 'Alkaline Earth',       color: '#FF8C00' },
  'transition-metal': { name: 'Transition Metal',     color: '#B8BCC4' },
  'post-transition':  { name: 'Post-Transition Metal',color: '#7C828A' },
  'metalloid':        { name: 'Metalloid',            color: '#B8860B' },
  'nonmetal':         { name: 'Nonmetal',             color: '#FF5E1A' },
  'halogen':          { name: 'Halogen',              color: '#E63946' },
  'noble-gas':        { name: 'Noble Gas',            color: '#D4AF37' },
  'lanthanide':       { name: 'Lanthanide',           color: '#C75B3F' },
  'actinide':         { name: 'Actinide',             color: '#9C2A1E' },
  'unknown':          { name: 'Unknown',              color: '#5A5A5A' }
};

const ELEMENTS = [
  {z:1,sym:'H',name:'Hydrogen',mass:'1.008',cat:'nonmetal',g:1,p:1,conf:'1s¹',desc:'The lightest and most abundant element in the universe, constituting roughly 75% of all baryonic mass. Used extensively in ammonia synthesis (Haber process), petroleum refining, and as a clean fuel source in fuel cells.'},
  {z:2,sym:'He',name:'Helium',mass:'4.0026',cat:'noble-gas',g:18,p:1,conf:'1s²',desc:'An inert noble gas with the lowest boiling point of any element. Critical for cryogenics, MRI scanner cooling (liquid helium), and as a lifting gas in balloons and airships.'},
  {z:3,sym:'Li',name:'Lithium',mass:'6.94',cat:'alkali-metal',g:1,p:2,conf:'[He] 2s¹',desc:'The lightest metal, soft enough to be cut with a knife. Central to rechargeable lithium-ion batteries powering modern electronics and electric vehicles. Also used in mood-stabilizing medication and aerospace alloys.'},
  {z:4,sym:'Be',name:'Beryllium',mass:'9.0122',cat:'alkaline-earth',g:2,p:2,conf:'[He] 2s²',desc:'A light, stiff, and toxic alkaline earth metal valued in aerospace structures, X-ray windows, and as a neutron reflector in nuclear reactors. Its alloys with copper are non-sparking and highly conductive.'},
  {z:5,sym:'B',name:'Boron',mass:'10.81',cat:'metalloid',g:13,p:2,conf:'[He] 2s² 2p¹',desc:'A metalloid essential to borosilicate glassware (Pyrex), detergents, and as a neutron absorber in nuclear control rods. An essential micronutrient for plant growth.'},
  {z:6,sym:'C',name:'Carbon',mass:'12.011',cat:'nonmetal',g:14,p:2,conf:'[He] 2s² 2p²',desc:'The basis of all known life and organic chemistry. Forms diverse allotropes: diamond, graphite, graphene, fullerenes, and nanotubes. Central to steel production, fuels, and modern nanomaterials.'},
  {z:7,sym:'N',name:'Nitrogen',mass:'14.007',cat:'nonmetal',g:15,p:2,conf:'[He] 2s² 2p³',desc:'A diatomic gas comprising 78% of Earth\'s atmosphere. Essential for ammonia synthesis (fertilizer), as an inert blanketing gas, and as a cryogenic coolant (liquid nitrogen, 77 K).'},
  {z:8,sym:'O',name:'Oxygen',mass:'15.999',cat:'nonmetal',g:16,p:2,conf:'[He] 2s² 2p⁴',desc:'Highly reactive gas essential for respiration and combustion, constituting 21% of the atmosphere. Vital in medicine, steelmaking, water treatment, and as an oxidizer in rocket propulsion.'},
  {z:9,sym:'F',name:'Fluorine',mass:'18.998',cat:'halogen',g:17,p:2,conf:'[He] 2s² 2p⁵',desc:'The most electronegative and reactive element. Compounds include Teflon (PTFE), uranium hexafluoride for enrichment, and fluoride additives in dental products and public water supplies.'},
  {z:10,sym:'Ne',name:'Neon',mass:'20.180',cat:'noble-gas',g:18,p:2,conf:'[He] 2s² 2p⁶',desc:'An inert noble gas famous for the distinctive orange-red glow of neon signs when electrically excited. Also used in cryogenic refrigerants and as a laser medium (HeNe lasers).'},
  {z:11,sym:'Na',name:'Sodium',mass:'22.990',cat:'alkali-metal',g:1,p:3,conf:'[Ne] 3s¹',desc:'A soft, silvery, highly reactive metal. Essential biological electrolyte central to nerve function. Industrial uses include sodium-vapor lighting, coolant in some nuclear reactors, and chemical reduction of titanium.'},
  {z:12,sym:'Mg',name:'Magnesium',mass:'24.305',cat:'alkaline-earth',g:2,p:3,conf:'[Ne] 3s²',desc:'A light, strong structural metal central to chlorophyll in photosynthesis. Widely used in automotive and aerospace alloys, fireworks (brilliant white flame), and as a sacrificial anode for corrosion protection.'},
  {z:13,sym:'Al',name:'Aluminium',mass:'26.982',cat:'post-transition',g:13,p:3,conf:'[Ne] 3s² 3p¹',desc:'The most abundant metal in Earth\'s crust. Lightweight, corrosion-resistant, and infinitely recyclable. Central to aerospace, packaging, electrical transmission, and construction.'},
  {z:14,sym:'Si',name:'Silicon',mass:'28.085',cat:'metalloid',g:14,p:3,conf:'[Ne] 3s² 3p²',desc:'The foundation of the digital age. A metalloid essential to semiconductor electronics, integrated circuits, solar cells, and glass manufacture. The second most abundant element in Earth\'s crust.'},
  {z:15,sym:'P',name:'Phosphorus',mass:'30.974',cat:'nonmetal',g:15,p:3,conf:'[Ne] 3s² 3p³',desc:'Essential for DNA, RNA, and ATP energy transfer. White phosphorus is highly reactive (military applications); red phosphorus is used in matches, fertilizers, and flame retardants.'},
  {z:16,sym:'S',name:'Sulfur',mass:'32.06',cat:'nonmetal',g:16,p:3,conf:'[Ne] 3s² 3p⁴',desc:'A yellow nonmetal vital to two amino acids. Used in sulfuric acid (the most produced industrial chemical), vulcanization of rubber, fertilizers, and pharmaceuticals.'},
  {z:17,sym:'Cl',name:'Chlorine',mass:'35.45',cat:'halogen',g:17,p:3,conf:'[Ne] 3s² 3p⁵',desc:'A toxic, reactive gas used widely in water disinfection, sanitation, and as a bleaching agent in the paper industry. Also a precursor to PVC plastic and numerous industrial chemicals.'},
  {z:18,sym:'Ar',name:'Argon',mass:'39.948',cat:'noble-gas',g:18,p:3,conf:'[Ne] 3s² 3p⁶',desc:'The most abundant noble gas in Earth\'s atmosphere (0.93%). Used as an inert shielding gas in welding, incandescent lighting, and semiconductor crystal growth.'},
  {z:19,sym:'K',name:'Potassium',mass:'39.098',cat:'alkali-metal',g:1,p:4,conf:'[Ar] 4s¹',desc:'A soft, reactive alkali metal essential to nerve function and plant growth. Dominant component of potash fertilizers. Used in soap making, glass, and as a salt substitute in low-sodium diets.'},
  {z:20,sym:'Ca',name:'Calcium',mass:'40.078',cat:'alkaline-earth',g:2,p:4,conf:'[Ar] 4s²',desc:'The most abundant metal in the human body, central to bones, teeth, and cellular signaling. Used in cement, plaster, steelmaking, and as a reducing agent in metallurgy.'},
  {z:21,sym:'Sc',name:'Scandium',mass:'44.956',cat:'transition-metal',g:3,p:4,conf:'[Ar] 3d¹ 4s²',desc:'A light transition metal with a high melting point. Aluminum-scandium alloys are valued in aerospace, bicycle frames, and baseball bats. Its iodide is used in high-intensity discharge lamps.'},
  {z:22,sym:'Ti',name:'Titanium',mass:'47.867',cat:'transition-metal',g:4,p:4,conf:'[Ar] 3d² 4s²',desc:'Renowned for its high strength-to-weight ratio and corrosion resistance. Essential in jet engines, aerospace, medical implants, and as TiO₂ pigment in paints, sunscreen, and food coloring.'},
  {z:23,sym:'V',name:'Vanadium',mass:'50.942',cat:'transition-metal',g:5,p:4,conf:'[Ar] 3d³ 4s²',desc:'A hard transition metal used to strengthen steel alloys for tools, springs, and high-speed applications. Also central to vanadium redox flow batteries for grid-scale energy storage.'},
  {z:24,sym:'Cr',name:'Chromium',mass:'51.996',cat:'transition-metal',g:6,p:4,conf:'[Ar] 3d⁵ 4s¹',desc:'A hard, lustrous metal prized for chrome plating and stainless steel (provides corrosion resistance). Chromium compounds produce vivid pigments (rubies, emeralds) and are used in leather tanning.'},
  {z:25,sym:'Mn',name:'Manganese',mass:'54.938',cat:'transition-metal',g:7,p:4,conf:'[Ar] 3d⁵ 4s²',desc:'Essential for steel production, improving strength and workability. Used in aluminum alloys, alkaline batteries (MnO₂ cathode), and as a trace nutrient in plant and animal metabolism.'},
  {z:26,sym:'Fe',name:'Iron',mass:'55.845',cat:'transition-metal',g:8,p:4,conf:'[Ar] 3d⁶ 4s²',desc:'The most abundant element on Earth by mass, forming much of the planet\'s core. The backbone of human civilization through steel production. Central to hemoglobin for oxygen transport in blood.'},
  {z:27,sym:'Co',name:'Cobalt',mass:'58.933',cat:'transition-metal',g:9,p:4,conf:'[Ar] 3d⁷ 4s²',desc:'A ferromagnetic metal essential to lithium-ion battery cathodes (LiCoO₂) and high-temperature superalloys for jet engines. Cobalt blue has been used as a pigment for millennia.'},
  {z:28,sym:'Ni',name:'Nickel',mass:'58.693',cat:'transition-metal',g:10,p:4,conf:'[Ar] 3d⁸ 4s²',desc:'A corrosion-resistant ferromagnetic metal used in stainless steel, coinage, and rechargeable nickel-cadmium and nickel-metal hydride batteries. Also vital to hydrogenation catalysts.'},
  {z:29,sym:'Cu',name:'Copper',mass:'63.546',cat:'transition-metal',g:11,p:4,conf:'[Ar] 3d¹⁰ 4s¹',desc:'One of the first metals used by humans. Excellent electrical and thermal conductor, central to electrical wiring, motors, and electronics. Naturally antimicrobial, used in plumbing and architecture.'},
  {z:30,sym:'Zn',name:'Zinc',mass:'65.38',cat:'transition-metal',g:12,p:4,conf:'[Ar] 3d¹⁰ 4s²',desc:'Essential for over 300 enzymes in human biology. Used primarily for galvanizing steel against corrosion, in brass alloys, and as the negative electrode in alkaline batteries.'},
  {z:31,sym:'Ga',name:'Gallium',mass:'69.723',cat:'post-transition',g:13,p:4,conf:'[Ar] 3d¹⁰ 4s² 4p¹',desc:'A soft metal that melts in the palm of the hand (29.8°C). Critical in semiconductor technology: GaN and GaAs power LEDs, lasers, and high-frequency circuits in mobile communications.'},
  {z:32,sym:'Ge',name:'Germanium',mass:'72.630',cat:'metalloid',g:14,p:4,conf:'[Ar] 3d¹⁰ 4s² 4p²',desc:'A metalloid foundational to early transistor development. Modern uses include fiber optics, infrared optics, and substrate wafers for high-efficiency multi-junction solar cells.'},
  {z:33,sym:'As',name:'Arsenic',mass:'74.922',cat:'metalloid',g:15,p:4,conf:'[Ar] 3d¹⁰ 4s² 4p³',desc:'A notorious poison, yet useful in semiconductor doping (gallium arsenide) and historically in wood preservation. Found naturally in many minerals and some groundwater sources.'},
  {z:34,sym:'Se',name:'Selenium',mass:'78.971',cat:'nonmetal',g:16,p:4,conf:'[Ar] 3d¹⁰ 4s² 4p⁴',desc:'Photoconductor essential to photocopiers and solar cells. Trace nutrient with antioxidant function. Used in anti-dandruff shampoos and as a decolorizer in glass manufacture.'},
  {z:35,sym:'Br',name:'Bromine',mass:'79.904',cat:'halogen',g:17,p:4,conf:'[Ar] 3d¹⁰ 4s² 4p⁵',desc:'One of only two elements liquid at room temperature. Historically used in flame retardants and leaded gasoline. Modern applications include photographic chemicals and some pharmaceuticals.'},
  {z:36,sym:'Kr',name:'Krypton',mass:'83.798',cat:'noble-gas',g:18,p:4,conf:'[Ar] 3d¹⁰ 4s² 4p⁶',desc:'A rare noble gas used in high-performance lighting, photographic flashes, and as an insulating gas in windows. Kr-85 has applications in leak detection and nuclear monitoring.'},
  {z:37,sym:'Rb',name:'Rubidium',mass:'85.468',cat:'alkali-metal',g:1,p:5,conf:'[Kr] 5s¹',desc:'A soft, highly reactive metal. Used in atomic clocks (Rb standard), specialty glass, and as a getter in vacuum tubes. Its isotopes are used in medical PET imaging.'},
  {z:38,sym:'Sr',name:'Strontium',mass:'87.62',cat:'alkaline-earth',g:2,p:5,conf:'[Kr] 5s²',desc:'A soft metal that produces a brilliant red flame, central to fireworks and signal flares. Sr-90 is a dangerous fallout isotope; stable strontium compounds are used in ferrite magnets and CRT glass.'},
  {z:39,sym:'Y',name:'Yttrium',mass:'88.906',cat:'transition-metal',g:3,p:5,conf:'[Kr] 4d¹ 5s²',desc:'A transition metal used in phosphors for displays and LEDs, YAG laser crystals, and high-temperature superconductors (YBCO). Stabilizes zirconia in high-performance ceramics.'},
  {z:40,sym:'Zr',name:'Zirconium',mass:'91.224',cat:'transition-metal',g:4,p:5,conf:'[Kr] 4d² 5s²',desc:'Highly corrosion-resistant with low neutron cross-section, ideal for nuclear reactor cladding. Cubic zirconia is a popular diamond simulant. Also used in surgical instruments and dental ceramics.'},
  {z:41,sym:'Nb',name:'Niobium',mass:'92.906',cat:'transition-metal',g:5,p:5,conf:'[Kr] 4d⁴ 5s¹',desc:'A soft transition metal used in superconducting magnets (NbTi, Nb₃Sn) for MRI and particle accelerators. Microalloying steel for pipelines and as a hypoallergenic jewelry metal.'},
  {z:42,sym:'Mo',name:'Molybdenum',mass:'95.95',cat:'transition-metal',g:6,p:5,conf:'[Kr] 4d⁵ 5s¹',desc:'High-melting metal essential for high-strength steel alloys, particularly in tool steels and pipelines. A cofactor in nitrogenase enzymes that fix atmospheric nitrogen in plants.'},
  {z:43,sym:'Tc',name:'Technetium',mass:'[98]',cat:'transition-metal',g:7,p:5,conf:'[Kr] 4d⁵ 5s²',desc:'The first artificially produced element, all isotopes radioactive. Tc-99m is the workhorse of nuclear medicine diagnostics, used in millions of imaging procedures annually.'},
  {z:44,sym:'Ru',name:'Ruthenium',mass:'101.07',cat:'transition-metal',g:8,p:5,conf:'[Kr] 4d⁷ 5s¹',desc:'A hard platinum-group metal used as a wear-resistant coating for electrical contacts, in catalysis, and as a promoter in ruthenium-doped titanium anodes for chlor-alkali cells.'},
  {z:45,sym:'Rh',name:'Rhodium',mass:'102.91',cat:'transition-metal',g:9,p:5,conf:'[Kr] 4d⁸ 5s¹',desc:'One of the rarest and most expensive metals. Critical in three-way automotive catalytic converters, mirrors for searchlights, and as a finish in jewelry and tableware.'},
  {z:46,sym:'Pd',name:'Palladium',mass:'106.42',cat:'transition-metal',g:10,p:5,conf:'[Kr] 4d¹⁰',desc:'Excellent at hydrogen absorption, used in catalytic converters, hydrogen purification, and as a catalyst in organic synthesis. Found in multi-layer ceramic capacitors and dental alloys.'},
  {z:47,sym:'Ag',name:'Silver',mass:'107.87',cat:'transition-metal',g:11,p:5,conf:'[Kr] 4d¹⁰ 5s¹',desc:'The most electrically and thermally conductive metal. Used in jewelry, tableware, photographic film, antimicrobial coatings, and high-reliability electrical contacts and conductive inks.'},
  {z:48,sym:'Cd',name:'Cadmium',mass:'112.41',cat:'transition-metal',g:12,p:5,conf:'[Kr] 4d¹⁰ 5s²',desc:'A toxic metal used historically in NiCd batteries, pigments (cadmium yellow/red), and as a protective plating. Phasing out due to environmental and health concerns.'},
  {z:49,sym:'In',name:'Indium',mass:'114.82',cat:'post-transition',g:13,p:5,conf:'[Kr] 4d¹⁰ 5s² 5p¹',desc:'A soft metal essential to transparent conductive ITO coatings for LCD/OLED displays and touchscreens. Also used in low-melting-point solders and semiconductor doping.'},
  {z:50,sym:'Sn',name:'Tin',mass:'118.71',cat:'post-transition',g:14,p:5,conf:'[Kr] 4d¹⁰ 5s² 5p²',desc:'A soft metal used for millennia in bronze. Modern uses include solder in electronics, food can coatings (tinplate), and as a stabilizer in PVC. Nontoxic in metallic form.'},
  {z:51,sym:'Sb',name:'Antimony',mass:'121.76',cat:'metalloid',g:15,p:5,conf:'[Kr] 4d¹⁰ 5s² 5p³',desc:'A brittle metalloid used as a hardener in lead-acid battery plates and as a flame retardant in plastics and textiles. Antimony trioxide is a key catalyst in PET production.'},
  {z:52,sym:'Te',name:'Tellurium',mass:'127.60',cat:'metalloid',g:16,p:5,conf:'[Kr] 4d¹⁰ 5s² 5p⁴',desc:'A rare metalloid used in thin-film CdTe solar cells, thermoelectric cooling modules (Bi₂Te₃), and to improve the machinability of steel and copper alloys.'},
  {z:53,sym:'I',name:'Iodine',mass:'126.90',cat:'halogen',g:17,p:5,conf:'[Kr] 4d¹⁰ 5s² 5p⁵',desc:'A violet solid with the highest atomic mass of the stable halogens. Essential trace nutrient, used to disinfect water, sterilize wounds, and as a contrast agent in medical imaging.'},
  {z:54,sym:'Xe',name:'Xenon',mass:'131.29',cat:'noble-gas',g:18,p:5,conf:'[Kr] 4d¹⁰ 5s² 5p⁶',desc:'A noble gas producing brilliant light in high-intensity arc lamps for cinema projection and automotive headlights. Used as a surgical anesthetic and in ion propulsion for spacecraft.'},
  {z:55,sym:'Cs',name:'Caesium',mass:'132.91',cat:'alkali-metal',g:1,p:6,conf:'[Xe] 6s¹',desc:'A soft gold-tinted alkali metal that melts at 28.5°C. Cs-133 defines the SI second via atomic clocks. Also used in oil-drilling fluids and as a catalyst promoter.'},
  {z:56,sym:'Ba',name:'Barium',mass:'137.33',cat:'alkaline-earth',g:2,p:6,conf:'[Xe] 6s²',desc:'A soft reactive metal whose compounds are used as X-ray contrast agents (barium sulfate for GI imaging), in green fireworks, and as a drilling mud weighting agent.'},
  {z:57,sym:'La',name:'Lanthanum',mass:'138.91',cat:'lanthanide',g:3,p:6,conf:'[Xe] 5d¹ 6s²',desc:'The first lanthanide. Used in high-refractive-index camera lenses, hybrid-vehicle NiMH battery cathodes, and as a catalyst in petroleum refining. Lanthanum carbonate treats hyperphosphatemia.'},
  {z:58,sym:'Ce',name:'Cerium',mass:'140.12',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f¹ 5d¹ 6s²',desc:'The most abundant rare-earth element. Used in self-cleaning oven coatings, glass-polishing powders, automotive catalytic converters, and as a flint in lighters.'},
  {z:59,sym:'Pr',name:'Praseodymium',mass:'140.91',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f³ 6s²',desc:'A soft silver lanthanide used in high-strength aircraft engine alloys, Didymium glass for welder\'s goggles, and to color glass and ceramics yellow-green.'},
  {z:60,sym:'Nd',name:'Neodymium',mass:'144.24',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f⁴ 6s²',desc:'Essential to the strongest permanent magnets known (NdFeB), used in headphones, hard disk drives, EV motors, and wind turbines. Also colors glass in shades of red-purple.'},
  {z:61,sym:'Pm',name:'Promethium',mass:'[145]',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f⁵ 6s²',desc:'A radioactive lanthanide with no stable isotopes. Pm-147 powers luminous paint, nuclear-powered micro-batteries, and thickness gauges for thin materials.'},
  {z:62,sym:'Sm',name:'Samarium',mass:'150.36',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f⁶ 6s²',desc:'Used in samarium-cobalt magnets that retain magnetic properties at high temperatures. Sm-153 is used in cancer treatment; samarium oxide aids in nuclear reactor shielding.'},
  {z:63,sym:'Eu',name:'Europium',mass:'151.96',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f⁷ 6s²',desc:'The most reactive lanthanide, used as red and blue phosphors in displays and fluorescent lamps. Also used as an anti-counterfeiting tag in euro banknotes.'},
  {z:64,sym:'Gd',name:'Gadolinium',mass:'157.25',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f⁷ 5d¹ 6s²',desc:'Has the highest thermal neutron cross-section of any stable element. Used in MRI contrast agents and as a burnable poison in nuclear reactor control rods.'},
  {z:65,sym:'Tb',name:'Terbium',mass:'158.93',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f⁹ 6s²',desc:'Used in green phosphors for displays and lighting, in magnetostrictive Terfenol-D for sonar transducers, and as a stabilizer in fuel cells.'},
  {z:66,sym:'Dy',name:'Dysprosium',mass:'162.50',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f¹⁰ 6s²',desc:'Added to NdFeB magnets to preserve performance at the high operating temperatures of EV motors and wind turbines. Also used in high-capacity hard disk drives.'},
  {z:67,sym:'Ho',name:'Holmium',mass:'164.93',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f¹¹ 6s²',desc:'Holds the highest magnetic moment of any element. Used in high-strength magnets, laser crystals for medical surgery, and as a nuclear control rod material.'},
  {z:68,sym:'Er',name:'Erbium',mass:'167.26',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f¹² 6s²',desc:'Erbium-doped fiber amplifiers revolutionized long-distance optical telecommunications. Er:YAG lasers are used in dentistry and dermatology; pink coloring for glass and porcelain.'},
  {z:69,sym:'Tm',name:'Thulium',mass:'168.93',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f¹³ 6s²',desc:'The least abundant lanthanide in Earth\'s crust. Tm-doped lasers are used in portable X-ray sources and high-precision surgery. Used in high-temperature superconductors.'},
  {z:70,sym:'Yb',name:'Ytterbium',mass:'173.05',cat:'lanthanide',g:0,p:6,conf:'[Xe] 4f¹⁴ 6s²',desc:'Used in high-strength stainless steel, atomic clocks of unprecedented precision (Yb optical lattice), and as a dopant in specialized laser gain media.'},
  {z:71,sym:'Lu',name:'Lutetium',mass:'174.97',cat:'lanthanide',g:3,p:6,conf:'[Xe] 4f¹⁴ 5d¹ 6s²',desc:'The densest and hardest lanthanide. Used in PET scan detectors (LSO crystals), as a catalyst in petroleum cracking, and in age-dating meteorites via Lu-Hf decay.'},
  {z:72,sym:'Hf',name:'Hafnium',mass:'178.49',cat:'transition-metal',g:4,p:6,conf:'[Xe] 4f¹⁴ 5d² 6s²',desc:'Excellent neutron absorber, used in nuclear reactor control rods. Its oxide provides high-k dielectric layers in modern semiconductor transistors below 45 nm.'},
  {z:73,sym:'Ta',name:'Tantalum',mass:'180.95',cat:'transition-metal',g:5,p:6,conf:'[Xe] 4f¹⁴ 5d³ 6s²',desc:'Highly corrosion-resistant and biocompatible. Tantalum electrolytic capacitors are ubiquitous in electronics; metal used in surgical implants, chemical equipment, and jet engine alloys.'},
  {z:74,sym:'W',name:'Tungsten',mass:'183.84',cat:'transition-metal',g:6,p:6,conf:'[Xe] 4f¹⁴ 5d⁴ 6s²',desc:'Has the highest melting point (3422°C) of any element. Essential for incandescent lamp filaments, drill bits, armor-piercing ammunition, and high-temperature superalloys.'},
  {z:75,sym:'Re',name:'Rhenium',mass:'186.21',cat:'transition-metal',g:7,p:6,conf:'[Xe] 4f¹⁴ 5d⁵ 6s²',desc:'One of the rarest elements in Earth\'s crust. Used in single-crystal superalloys for jet engine turbine blades and as a highly selective petroleum-reforming catalyst.'},
  {z:76,sym:'Os',name:'Osmium',mass:'190.23',cat:'transition-metal',g:8,p:6,conf:'[Xe] 4f¹⁴ 5d⁶ 6s²',desc:'The densest naturally occurring element. Used in alloys for fountain pen tips, electrical contacts, and other applications demanding extreme wear resistance. Its tetroxide is a powerful stain and oxidizer.'},
  {z:77,sym:'Ir',name:'Iridium',mass:'192.22',cat:'transition-metal',g:9,p:6,conf:'[Xe] 4f¹⁴ 5d⁷ 6s²',desc:'The most corrosion-resistant metal known. Used in spark plugs, crucibles for crystal growth, and the pen tips of premium fountain pens. The K-Pg iridium layer helped date the dinosaur extinction.'},
  {z:78,sym:'Pt',name:'Platinum',mass:'195.08',cat:'transition-metal',g:10,p:6,conf:'[Xe] 4f¹⁴ 5d⁹ 6s¹',desc:'A dense, malleable, inert precious metal. Central to automotive catalytic converters, fine jewelry, and as a catalyst in petroleum refining and the Ostwald process for nitric acid.'},
  {z:79,sym:'Au',name:'Gold',mass:'196.97',cat:'transition-metal',g:11,p:6,conf:'[Xe] 4f¹⁴ 5d¹⁰ 6s¹',desc:'A dense, soft, shiny metal prized for millennia as currency and ornament. Excellent electrical conductor used in high-end electronics, aerospace, dental work, and infrared shielding.'},
  {z:80,sym:'Hg',name:'Mercury',mass:'200.59',cat:'transition-metal',g:12,p:6,conf:'[Xe] 4f¹⁴ 5d¹⁰ 6s²',desc:'The only metal liquid at room temperature. Used in thermometers, fluorescent lamps, and historically in dental amalgam. Highly toxic; phase-out under the Minamata Convention.'},
  {z:81,sym:'Tl',name:'Thallium',mass:'204.38',cat:'post-transition',g:13,p:6,conf:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹',desc:'A soft, highly toxic metal once used as rat poison. Modern applications include infrared optics, gamma-ray detectors (Tl-doped NaI), and high-temperature superconductors.'},
  {z:82,sym:'Pb',name:'Lead',mass:'207.2',cat:'post-transition',g:14,p:6,conf:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²',desc:'Dense, soft, and easily worked. Used in car batteries, radiation shielding, and ammunition. Being phased out of many uses (paint, fuel) due to neurotoxicity, especially in children.'},
  {z:83,sym:'Bi',name:'Bismuth',mass:'208.98',cat:'post-transition',g:15,p:6,conf:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³',desc:'The most naturally diamagnetic element. Forms iridescent geometric crystals. Used in low-melting alloys, Pepto-Bismol, lead-free shotgun shot, and as a cooling heat-transfer medium.'},
  {z:84,sym:'Po',name:'Polonium',mass:'[209]',cat:'post-transition',g:16,p:6,conf:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴',desc:'A rare and intensely radioactive metalloid discovered by Marie Curie. Used historically in anti-static brushes; notorious as a lethal poison. Generates significant heat from its own decay.'},
  {z:85,sym:'At',name:'Astatine',mass:'[210]',cat:'halogen',g:17,p:6,conf:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵',desc:'The rarest naturally occurring element on Earth, with no stable isotopes. Highly radioactive; the longest-lived isotope, At-210, has a half-life of just 8 hours. Studied for targeted alpha therapy in oncology.'},
  {z:86,sym:'Rn',name:'Radon',mass:'[222]',cat:'noble-gas',g:18,p:6,conf:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶',desc:'A radioactive noble gas from uranium decay, accumulating in basements and mines. A leading cause of lung cancer in non-smokers. Historically used in quack medical devices.'},
  {z:87,sym:'Fr',name:'Francium',mass:'[223]',cat:'alkali-metal',g:1,p:7,conf:'[Rn] 7s¹',desc:'The second-rarest naturally occurring element; only a few grams exist in the entire Earth\'s crust at any moment. Intensely radioactive; studied in atomic structure experiments but has no practical applications.'},
  {z:88,sym:'Ra',name:'Radium',mass:'[226]',cat:'alkaline-earth',g:2,p:7,conf:'[Rn] 7s²',desc:'Discovered by Marie Curie. Glows faintly from its own radioactivity; once used in luminous dial paints and quack cures before health risks were understood. Today confined to medical radiotherapy.'},
  {z:89,sym:'Ac',name:'Actinium',mass:'[227]',cat:'actinide',g:3,p:7,conf:'[Rn] 6d¹ 7s²',desc:'A soft, silvery radioactive metal that glows pale blue in the dark. Studied for targeted alpha-emitting therapy of cancers (Ac-225). Discovered in 1899, giving its name to the actinide series.'},
  {z:90,sym:'Th',name:'Thorium',mass:'232.04',cat:'actinide',g:0,p:7,conf:'[Rn] 6d² 7s²',desc:'A weakly radioactive actinide explored as an alternative nuclear fuel that produces less long-lived waste than uranium. Thorium dioxide has one of the highest melting points of any oxide.'},
  {z:91,sym:'Pa',name:'Protactinium',mass:'231.04',cat:'actinide',g:0,p:7,conf:'[Rn] 5f² 6d¹ 7s²',desc:'A dense, silvery actinide so rare and radioactive that it has no practical use outside research. Pa-231 dating of marine sediments extends radiometric dating beyond 100,000 years.'},
  {z:92,sym:'U',name:'Uranium',mass:'238.03',cat:'actinide',g:0,p:7,conf:'[Rn] 5f³ 6d¹ 7s²',desc:'The primary fuel of nuclear reactors and weapons. U-235 is fissile; U-238, the dominant isotope, can breed Pu-239. Also used in armor-piercing ammunition and historically in glass and glazes.'},
  {z:93,sym:'Np',name:'Neptunium',mass:'[237]',cat:'actinide',g:0,p:7,conf:'[Rn] 5f⁴ 6d¹ 7s²',desc:'The first transuranium element, synthesized in 1940. Np-237 is a byproduct of nuclear reactors and is used in neutron detection equipment. Named after the planet Neptune.'},
  {z:94,sym:'Pu',name:'Plutonium',mass:'[244]',cat:'actinide',g:0,p:7,conf:'[Rn] 5f⁶ 7s²',desc:'A fissile actinide central to nuclear weapons and certain reactor designs. Pu-238 powers radioisotope thermoelectric generators (RTGs) aboard deep-space probes like Voyager and Curiosity.'},
  {z:95,sym:'Am',name:'Americium',mass:'[243]',cat:'actinide',g:0,p:7,conf:'[Rn] 5f⁷ 7s²',desc:'Used in household ionization-type smoke detectors (about 0.3 micrograms of Am-241 each). Also serves as a neutron source for industrial gauges and well-logging.'},
  {z:96,sym:'Cm',name:'Curium',mass:'[247]',cat:'actinide',g:0,p:7,conf:'[Rn] 5f⁷ 6d¹ 7s²',desc:'A hard, silvery radioactive metal named after Marie Curie. Used as an alpha-particle source in X-ray spectrometers on Mars rovers and as a power source for spacecraft.'},
  {z:97,sym:'Bk',name:'Berkelium',mass:'[247]',cat:'actinide',g:0,p:7,conf:'[Rn] 5f⁹ 7s²',desc:'A synthetic actinide produced in nuclear reactors; only milligram quantities exist worldwide. Used as a target material to synthesize heavier transactinide elements such as tennessine.'},
  {z:98,sym:'Cf',name:'Californium',mass:'[251]',cat:'actinide',g:0,p:7,conf:'[Rn] 5f¹⁰ 7s²',desc:'A powerful neutron emitter. Cf-252 is used to start nuclear reactors, scan luggage for explosives, detect gold and silver ore, and treat certain brain and ovarian cancers.'},
  {z:99,sym:'Es',name:'Einsteinium',mass:'[252]',cat:'actinide',g:0,p:7,conf:'[Rn] 5f¹¹ 7s²',desc:'First discovered in the debris of the first hydrogen bomb test in 1952. Visible quantities glow from radioactivity. Used as a target to synthesize mendelevium; no practical applications.'},
  {z:100,sym:'Fm',name:'Fermium',mass:'[257]',cat:'actinide',g:0,p:7,conf:'[Rn] 5f¹² 7s²',desc:'The heaviest element that can be produced by neutron bombardment. Named for Enrico Fermi; purely a research curiosity with no applications outside basic nuclear physics.'},
  {z:101,sym:'Md',name:'Mendelevium',mass:'[258]',cat:'actinide',g:0,p:7,conf:'[Rn] 5f¹³ 7s²',desc:'Synthesized by bombarding einsteinium with alpha particles. Named after Dmitri Mendeleev, architect of the periodic table. Only studied at the atomic level.'},
  {z:102,sym:'No',name:'Nobelium',mass:'[259]',cat:'actinide',g:0,p:7,conf:'[Rn] 5f¹⁴ 7s²',desc:'A synthetic actinide named after Alfred Nobel. Its most stable isotope, No-259, has a half-life of just 58 minutes. Chemistry is studied one atom at a time.'},
  {z:103,sym:'Lr',name:'Lawrencium',mass:'[266]',cat:'actinide',g:3,p:7,conf:'[Rn] 5f¹⁴ 7s² 7p¹',desc:'The final actinide. Named for Ernest Lawrence, inventor of the cyclotron. Its chemistry is difficult to study due to short half-lives and tiny available quantities.'},
  {z:104,sym:'Rf',name:'Rutherfordium',mass:'[267]',cat:'transition-metal',g:4,p:7,conf:'[Rn] 5f¹⁴ 6d² 7s²',desc:'The first transactinide element. Predicted to behave chemically like hafnium. Synthesized atom-by-atom in heavy-ion accelerators; only a few atoms have ever been produced.'},
  {z:105,sym:'Db',name:'Dubnium',mass:'[268]',cat:'transition-metal',g:5,p:7,conf:'[Rn] 5f¹⁴ 6d³ 7s²',desc:'A synthetic element named after Dubna, Russia. Predicted chemistry resembles tantalum, but only single-atom experiments have been performed. No practical applications.'},
  {z:106,sym:'Sg',name:'Seaborgium',mass:'[269]',cat:'transition-metal',g:6,p:7,conf:'[Rn] 5f¹⁴ 6d⁴ 7s²',desc:'Named after Glenn Seaborg while he was still alive. Confirmed to behave like tungsten in gas-phase chemistry. No applications beyond fundamental atomic research.'},
  {z:107,sym:'Bh',name:'Bohrium',mass:'[270]',cat:'transition-metal',g:7,p:7,conf:'[Rn] 5f¹⁴ 6d⁵ 7s²',desc:'Named after physicist Niels Bohr. The most stable confirmed isotope, Bh-270, has a half-life of about one minute. Studies confirm rhenium-like chemical behavior.'},
  {z:108,sym:'Hs',name:'Hassium',mass:'[269]',cat:'transition-metal',g:8,p:7,conf:'[Rn] 5f¹⁴ 6d⁶ 7s²',desc:'Named after the German state of Hesse. Despite existing for only seconds, gas-phase chemistry experiments confirm it behaves as a homolog of osmium.'},
  {z:109,sym:'Mt',name:'Meitnerium',mass:'[278]',cat:'unknown',g:9,p:7,conf:'[Rn] 5f¹⁴ 6d⁷ 7s²',desc:'Named after Lise Meitner, co-discoverer of nuclear fission. So short-lived that detailed chemistry is impossible; its properties are inferred from periodic trends.'},
  {z:110,sym:'Ds',name:'Darmstadtium',mass:'[281]',cat:'unknown',g:10,p:7,conf:'[Rn] 5f¹⁴ 6d⁸ 7s²',desc:'Named after Darmstadt, Germany, where it was first synthesized. Predicted to be a dense solid metal, but only a handful of atoms have ever been produced.'},
  {z:111,sym:'Rg',name:'Roentgenium',mass:'[282]',cat:'unknown',g:11,p:7,conf:'[Rn] 5f¹⁴ 6d⁹ 7s²',desc:'Named after Wilhelm Röntgen, discoverer of X-rays. Predicted to share chemical similarities with gold, but experimental confirmation is exceptionally difficult.'},
  {z:112,sym:'Cn',name:'Copernicium',mass:'[285]',cat:'transition-metal',g:12,p:7,conf:'[Rn] 5f¹⁴ 6d¹⁰ 7s²',desc:'Named for astronomer Nicolaus Copernicus. Limited experiments suggest surprisingly volatile behavior, possibly behaving as a gas at room temperature like its homolog mercury.'},
  {z:113,sym:'Nh',name:'Nihonium',mass:'[286]',cat:'unknown',g:13,p:7,conf:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹',desc:'The first element officially discovered in Asia. Named after Japan ("Nihon"). Highly radioactive and short-lived; only a few atoms have been synthesized.'},
  {z:114,sym:'Fl',name:'Flerovium',mass:'[289]',cat:'unknown',g:14,p:7,conf:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²',desc:'Named after the Flerov Laboratory of Nuclear Reactions in Dubna. Experiments suggest it may be a volatile liquid or gas at room temperature; theorized to lie near an "island of stability".'},
  {z:115,sym:'Mc',name:'Moscovium',mass:'[290]',cat:'unknown',g:15,p:7,conf:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³',desc:'Named after the Moscow region. Synthesized in 2003 via bombardment of americium-243 with calcium-48 ions. Properties remain largely unknown and untested.'},
  {z:116,sym:'Lv',name:'Livermorium',mass:'[293]',cat:'unknown',g:16,p:7,conf:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴',desc:'Named after Lawrence Livermore National Laboratory in California. Predicted to behave like polonium but with potentially metallic character; experimental data is extremely sparse.'},
  {z:117,sym:'Ts',name:'Tennessine',mass:'[294]',cat:'halogen',g:17,p:7,conf:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵',desc:'Named for the state of Tennessee. Officially classified as a halogen but predicted to behave differently due to relativistic effects on its 7p electrons.'},
  {z:118,sym:'Og',name:'Oganesson',mass:'[294]',cat:'noble-gas',g:18,p:7,conf:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶',desc:'The heaviest element yet synthesized, named after Russian physicist Yuri Oganessian. Despite being in the noble-gas group, it is predicted to be a solid and significantly reactive.'}
];

ELEMENTS.forEach(el => {
  let row, col;
  if (el.z >= 58 && el.z <= 71) {
    row = 10; col = 5 + (el.z - 58); 
  } else if (el.z >= 90 && el.z <= 103) {
    row = 11; col = 5 + (el.z - 90);
  } else {
    row = el.p + 1; 
    col = el.g + 1; 
  }
  el.gridRow = row;
  el.gridCol = col;
});

const tableEl = document.getElementById('table');
const legendEl = document.getElementById('legend');

Object.entries(CATEGORIES).forEach(([key, cat]) => {
  const item = document.createElement('div');
  item.className = 'legend-item';
  item.dataset.category = key;
  item.innerHTML = `<span class="legend-swatch" style="background:${cat.color}; color:${cat.color}"></span><span>${cat.name}</span>`;
  item.addEventListener('click', () => toggleCategoryFilter(key));
  legendEl.appendChild(item);
});

ELEMENTS.forEach(el => {
  const cell = document.createElement('div');
  cell.className = 'element';
  cell.style.gridRow = el.gridRow;
  cell.style.gridColumn = el.gridCol;
  cell.style.setProperty('--c', CATEGORIES[el.cat].color);
  cell.dataset.z = el.z;
  cell.dataset.category = el.cat;
  cell.innerHTML = `
    <div class="el-num">${el.z}</div>
    <div class="el-sym">${el.sym}</div>
    <div class="el-mass">${el.mass}</div>
  `;
  cell.addEventListener('mouseenter', () => showHover(el));
  cell.addEventListener('mouseleave', hideHover);
  cell.addEventListener('click', () => openModal(el));
  cell.tabIndex = 0;
  cell.setAttribute('role', 'button');
  cell.setAttribute('aria-label', `${el.name}, atomic number ${el.z}`);
  tableEl.appendChild(cell);
  el._cell = cell;
});

for (let p = 1; p <= 7; p++) {
  const lbl = document.createElement('div');
  lbl.className = 'axis-label';
  lbl.style.gridRow = p + 1;
  lbl.style.gridColumn = 1;
  lbl.textContent = p;
  tableEl.appendChild(lbl);
}
for (let g = 1; g <= 18; g++) {
  const lbl = document.createElement('div');
  lbl.className = 'axis-label';
  lbl.style.gridRow = 1;
  lbl.style.gridColumn = g + 1;
  lbl.textContent = g;
  tableEl.appendChild(lbl);
}

const lanthLabel = document.createElement('div');
lanthLabel.className = 'element placeholder';
lanthLabel.style.gridRow = 10;
lanthLabel.style.gridColumn = 4;
lanthLabel.textContent = '58-71';
lanthLabel.title = 'Lanthanides';
tableEl.appendChild(lanthLabel);

const actinLabel = document.createElement('div');
actinLabel.className = 'element placeholder';
actinLabel.style.gridRow = 11;
actinLabel.style.gridColumn = 4;
actinLabel.textContent = '90-103';
actinLabel.title = 'Actinides';
tableEl.appendChild(actinLabel);

const hoverPanel = document.getElementById('hoverPanel');
function showHover(el) {
  const cat = CATEGORIES[el.cat];
  document.getElementById('hpSym').textContent = el.sym;
  document.getElementById('hpSym').style.setProperty('--c', cat.color);
  document.getElementById('hpNum').textContent = `№ ${el.z}`;
  document.getElementById('hpName').textContent = el.name;
  document.getElementById('hpMass').textContent = `${el.mass} u`;
  document.getElementById('hpConfig').textContent = el.conf;
  document.getElementById('hpCat').textContent = cat.name;
  const g = el.g > 0 ? el.g : '—';
  document.getElementById('hpGp').textContent = `${g} · ${el.p}`;
  hoverPanel.classList.add('show');
  document.querySelectorAll('.element').forEach(c => {
    if (parseInt(c.dataset.z) === el.z) c.classList.add('active');
  });
  tableEl.classList.add('has-active');
}
function hideHover() {
  hoverPanel.classList.remove('show');
  document.querySelectorAll('.element.active').forEach(c => c.classList.remove('active'));
  if (!activeCategory) tableEl.classList.remove('has-active');
}

let scene, camera, renderer, controls, atomGroup, nucleusGroup, animationId;
let electrons = [];
let geometries = {};
let textures = {};
let ambientLight, pointLight;

function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.1, 'rgba(255,255,255,0.9)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

function getShells(z) {
    const capacities = [2, 8, 18, 32, 32, 18, 8]; 
    let shells = [];
    let remaining = z;
    for(let i=0; i<capacities.length; i++) {
        if(remaining <= 0) break;
        const inShell = Math.min(remaining, capacities[i]);
        shells.push(inShell);
        remaining -= inShell;
    }
    return shells;
}

function init3D() {
    const container = document.getElementById('bohr3d');
    scene = new THREE.Scene();
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 50;
    
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    geometries.pGeo = new THREE.SphereGeometry(1.2, 16, 16);
    geometries.ringGeo = new THREE.TorusGeometry(1, 0.025, 8, 128);
    geometries.coreGeo = new THREE.SphereGeometry(1, 32, 32);
    
    textures.glow = createGlowTexture();

    ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xffffff, 1.8, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;

    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 400;
    const dustPos = new Float32Array(dustCount * 3);
    for(let i=0; i<dustCount*3; i++) {
        dustPos[i] = (Math.random() - 0.5) * 200;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ 
        color: 0xffffff, 
        size: 0.3, 
        transparent: true, 
        opacity: 0.15,
        map: textures.glow,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);
}

function buildAtom(z, massStr, colorHex) {
    if (atomGroup) {
        scene.remove(atomGroup);
        atomGroup.traverse(obj => {
            if (obj.material) obj.material.dispose();
        });
    }
    
    atomGroup = new THREE.Group();
    electrons = [];
    
    const baseColor = new THREE.Color(colorHex);
    const massNum = parseFloat(massStr.replace(/[\[\]]/g, '')) || z;
    
    nucleusGroup = new THREE.Group();
    const protons = z;
    const neutrons = Math.max(0, Math.round(massNum - z));
    const total = protons + neutrons;
    
    const pMat = new THREE.MeshStandardMaterial({ 
        color: baseColor, 
        emissive: baseColor, 
        emissiveIntensity: 0.8, 
        roughness: 0.3 
    });
    const nMat = new THREE.MeshStandardMaterial({ 
        color: 0xf1f5f9, 
        emissive: 0x64748b, 
        emissiveIntensity: 0.25, 
        roughness: 0.5 
    });
    
    const packRadius = Math.max(3, Math.pow(total, 1/3) * 1.6);
    
    const particles = [];
    for(let i=0; i<protons; i++) particles.push('p');
    for(let i=0; i<neutrons; i++) particles.push('n');
    for(let i=particles.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [particles[i], particles[j]] = [particles[j], particles[i]];
    }
    
    for(let i=0; i<particles.length; i++) {
        const mesh = new THREE.Mesh(geometries.pGeo, particles[i] === 'p' ? pMat : nMat);
        const r = packRadius * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        mesh.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        mesh.userData = { initialPos: mesh.position.clone(), phase: Math.random() * Math.PI * 2 };
        nucleusGroup.add(mesh);
    }
    
    const coreMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(geometries.coreGeo, coreMat);
    core.scale.set(packRadius, packRadius, packRadius);
    nucleusGroup.add(core);

    pointLight.color = baseColor;
    
    atomGroup.add(nucleusGroup);
    
    const shells = getShells(z);
    let maxRadius = 0;
    
    shells.forEach((count, shellIndex) => {
        const radius = 8 + (shellIndex * 6);
        maxRadius = Math.max(maxRadius, radius);
        const shellGroup = new THREE.Group();
        
        const ringMat = new THREE.MeshBasicMaterial({ 
            color: baseColor, 
            transparent: true, 
            opacity: 0.25,
            blending: THREE.AdditiveBlending 
        });
        const ring = new THREE.Mesh(geometries.ringGeo, ringMat);
        ring.scale.set(radius, radius, radius);
        shellGroup.add(ring);
        
        shellGroup.rotation.x = Math.random() * Math.PI;
        shellGroup.rotation.y = Math.random() * Math.PI;
        shellGroup.rotation.z = Math.random() * Math.PI;
        
        for(let i=0; i<count; i++) {
            const mat = new THREE.SpriteMaterial({ 
                map: textures.glow, 
                color: 0xffffff, 
                blending: THREE.AdditiveBlending, 
                transparent: true,
                depthWrite: false
            });
            const electron = new THREE.Sprite(mat);
            electron.scale.set(2.5, 2.5, 1);
            electron.userData = { 
                angle: (i / count) * Math.PI * 2, 
                speed: 0.04 - (shellIndex * 0.003), 
                radius: radius 
            };
            shellGroup.add(electron);
            electrons.push(electron);
        }
        
        atomGroup.add(shellGroup);
    });
    
    scene.add(atomGroup);
    
    const camDist = maxRadius * 1.8;
    camera.position.set(0, 0, camDist);
    controls.minDistance = maxRadius * 0.8;
    controls.maxDistance = maxRadius * 3.5;
    controls.update();
}

function animate3D() {
    animationId = requestAnimationFrame(animate3D);
    
    if (controls) controls.update();
    
    if (nucleusGroup) {
        nucleusGroup.rotation.y += 0.005;
        nucleusGroup.rotation.x += 0.002;
        
        const t = performance.now() * 0.001;
        nucleusGroup.children.forEach(child => {
            if(child.userData.initialPos) {
                child.position.x = child.userData.initialPos.x + Math.sin(t * 5 + child.userData.phase) * 0.15;
                child.position.y = child.userData.initialPos.y + Math.cos(t * 5 + child.userData.phase) * 0.15;
                child.position.z = child.userData.initialPos.z + Math.sin(t * 4 + child.userData.phase) * 0.15;
            }
        });
    }
    
    if (electrons.length > 0) {
        electrons.forEach(electron => {
            const data = electron.userData;
            data.angle += data.speed;
            electron.position.x = Math.cos(data.angle) * data.radius;
            electron.position.z = Math.sin(data.angle) * data.radius;
        });
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');

function openModal(el) {
    const cat = CATEGORIES[el.cat];
    document.getElementById('modalSym').textContent = el.sym;
    document.getElementById('modalZ').textContent = `ATOMIC NUMBER ${el.z}`;
    document.getElementById('modalName').textContent = el.name;
    document.getElementById('modalCat').textContent = cat.name;
    const header = document.getElementById('modalHeader');
    header.style.setProperty('--c', cat.color);
    header.setAttribute('data-symbol', el.sym);
    document.getElementById('mZ').textContent = el.z;
    document.getElementById('mMass').textContent = `${el.mass} u`;
    document.getElementById('mGroup').textContent = el.g > 0 ? el.g : 'f-block';
    document.getElementById('mPeriod').textContent = el.p;
    document.getElementById('mCat').textContent = cat.name;
    document.getElementById('mBlock').textContent = getBlock(el);
    document.getElementById('mConfig').textContent = el.conf;
    document.getElementById('mDesc').textContent = el.desc;
    
    document.getElementById('hudZ').textContent = `Z: ${el.z}`;
    document.getElementById('hudMass').textContent = `M: ${el.mass}`;
    
    modalBackdrop.classList.add('show');
    modalClose.focus();
    
    if (!scene) init3D();
    buildAtom(el.z, el.mass, cat.color);
    
    const container = document.getElementById('bohr3d');
    if (container.clientWidth > 0) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    if (!animationId) animate3D();
}

function getBlock(el) {
    if (el.z >= 57 && el.z <= 71) return 'f-block';
    if (el.z >= 89 && el.z <= 103) return 'f-block';
    if (el.g >= 3 && el.g <= 12 && el.g > 0) return 'd-block';
    if (el.g === 1 || el.g === 2) return 's-block';
    return 'p-block';
}

function closeModal() { 
    modalBackdrop.classList.remove('show'); 
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
});

let activeCategory = null;
function toggleCategoryFilter(key) {
    if (activeCategory === key) {
        clearCategoryFilter();
        return;
    }
    document.querySelectorAll('.legend-item').forEach(li => li.classList.toggle('active', li.dataset.category === key));
    activeCategory = key;
    document.querySelectorAll('.element').forEach(cell => {
        cell.classList.toggle('category-active', cell.dataset.category === key);
    });
    tableEl.classList.add('has-active');
}
function clearCategoryFilter() {
    activeCategory = null;
    document.querySelectorAll('.legend-item').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.element').forEach(cell => cell.classList.remove('category-active'));
    tableEl.classList.remove('has-active');
}

const searchInput = document.getElementById('search');
const searchClear = document.getElementById('searchClear');
function runSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) {
        document.querySelectorAll('.element').forEach(c => c.classList.remove('search-match', 'search-dimmed'));
        searchClear.classList.remove('show');
        return;
    }
    searchClear.classList.add('show');
    ELEMENTS.forEach(el => {
        const match = el.sym.toLowerCase() === q || el.name.toLowerCase().includes(q) || el.sym.toLowerCase().startsWith(q) || String(el.z) === q;
        el._cell.classList.toggle('search-match', match);
        el._cell.classList.toggle('search-dimmed', !match);
    });
}
searchInput.addEventListener('input', e => runSearch(e.target.value));
searchClear.addEventListener('click', () => {
    searchInput.value = '';
    runSearch('');
    searchInput.focus();
});

window.addEventListener('resize', () => {
    if (renderer && camera) {
        const container = document.getElementById('bohr3d');
        if (container.clientWidth > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modalBackdrop.classList.contains('show')) closeModal();
        else if (activeCategory) clearCategoryFilter();
        else if (searchInput.value) { searchInput.value = ''; runSearch(''); }
    }
    if (e.key === '/' && document.activeElement !== searchInput && !modalBackdrop.classList.contains('show')) {
        e.preventDefault();
        searchInput.focus();
    }
});
