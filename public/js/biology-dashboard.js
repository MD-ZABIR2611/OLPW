// OLPW:js/biology-dashboard.js | script for biology-dashboard
const chapters = [
            { id: "biology-chapter-01", num: "01", title: "Characteristics, Classification & Organisation", desc: "Characteristics of life, classification hierarchy, binomial naming, cell structure, tissues, and organs." },
            { id: "biology-chapter-02", num: "02", title: "Cells & Movement of Substances", desc: "Diffusion, osmosis, active transport, surface area to volume ratio, potato osmosis practical." },
            { id: "biology-chapter-03", num: "03", title: "Biological Molecules", desc: "Carbohydrates, proteins, lipids, water, and detailed food tests (Benedict's, Iodine, Biuret, Ethanol)." },
            { id: "biology-chapter-04", num: "04", title: "Enzymes", desc: "Biological catalysts, lock-and-key model, factors affecting enzyme activity, denaturation." },
            { id: "biology-chapter-05", num: "05", title: "Plant Nutrition & Photosynthesis", desc: "Leaf structure, limiting factors, mineral ions, starch test practical, photosynthesis graphs." },
            { id: "biology-chapter-06", num: "06", title: "Human Nutrition", desc: "Balanced diet, digestive system, enzymes, absorption, villi adaptations, deficiency diseases." },
            { id: "biology-chapter-07", num: "07", title: "Transport in Plants", desc: "Xylem, phloem, transpiration, potometer practical, root hair cells, translocation." },
            { id: "biology-chapter-08", num: "08", title: "Transport in Humans", desc: "Circulatory system, heart structure, arteries, veins, capillaries, blood components." },
            { id: "biology-chapter-09", num: "09", title: "Diseases, Immunity & Drugs", desc: "Pathogens, immune system, antibodies, vaccination, antibiotics, drug testing." },
            { id: "biology-chapter-10", num: "10", title: "Gas Exchange, Respiration & Excretion", desc: "Respiratory system, alveoli, aerobic/anaerobic respiration, kidneys, nephron function." },
            { id: "biology-chapter-11", num: "11", title: "Coordination, Response & Homeostasis", desc: "Nervous system, reflex arc, synapses, hormones, homeostasis, plant tropisms." },
            { id: "biology-chapter-12", num: "12", title: "Reproduction", desc: "Asexual vs sexual, flower structure, human reproductive systems, pregnancy, menstruation." },
            { id: "biology-chapter-13", num: "13", title: "Inheritance, Genetics & Variation", desc: "DNA, chromosomes, Punnett squares, monohybrid crosses, natural selection, evolution." },
            { id: "biology-chapter-14", num: "14", title: "Ecology, Ecosystems & Human Influences", desc: "Food webs, nutrient cycles, population sampling, biodiversity, pollution, conservation." },
            { id: "biology-chapter-15", num: "15", title: "Biotechnology & Genetic Modification", desc: "Fermentation, industrial enzymes and fermenters, penicillin, GM insulin and GM crops." }
        ];

        // Render Chapter Cards
        const chapterList = document.getElementById('chapterList');
        let completedCount = 0;

        chapters.forEach(ch => {
            const isComplete = localStorage.getItem(ch.id) === 'true';
            if (isComplete) completedCount++;

            const card = document.createElement('a');
            card.href = `biology-chapter${parseInt(ch.num, 10)}.html`;
            card.className = 'chapter-card';
            card.innerHTML = `
                <span class="chap-num">CHAPTER ${ch.num}</span>
                <span class="status-badge ${isComplete ? 'visible' : ''}">COMPLETE</span>
                <h3>${ch.title}</h3>
                <p class="chap-desc">${ch.desc}</p>
                <span class="tag">CORE</span>
            `;
            chapterList.appendChild(card);
        });

        // Update Progress Dashboard
        const percent = Math.round((completedCount / 14) * 100);
        document.getElementById('completedCount').innerText = `${completedCount} / 14`;
        document.getElementById('masteredCount').innerText = completedCount;
        document.getElementById('remainingCount').innerText = 14 - completedCount;
        document.getElementById('progressPercent').innerText = `${percent}%`;
        document.getElementById('progressCircle').style.background = `conic-gradient(var(--accent) ${percent}%, var(--border) ${percent}%)`;

        function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }
