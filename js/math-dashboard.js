// OLPW:js/math-dashboard.js | script for math-dashboard
const chapters = [
            { id: "math-chapter-01", num: "01", title: "Number & Number Systems", desc: "Integers, primes, HCF/LCM, indices, standard form, fractions, percentages, bounds, rounding." },
            { id: "math-chapter-02", num: "02", title: "Arithmetic, Ratio, Proportion & Percentages", desc: "Order of operations, interest, ratios, direct/inverse proportion, speed, density, currency." },
            { id: "math-chapter-03", num: "03", title: "Algebra & Algebraic Manipulation", desc: "Expanding, factorising, algebraic fractions, changing the subject, indices." },
            { id: "math-chapter-04", num: "04", title: "Equations, Inequalities & Sequences", desc: "Linear, simultaneous, quadratic equations, inequalities, arithmetic sequences." },
            { id: "math-chapter-05", num: "05", title: "Graphs, Functions & Coordinate Geometry", desc: "y=mx+c, parallel/perpendicular lines, distance, midpoint, quadratic/cubic graphs." },
            { id: "math-chapter-06", num: "06", title: "Geometry & Angles", desc: "Angle rules, polygons, parallel lines, congruence, similarity, bearings, constructions." },
            { id: "math-chapter-07", num: "07", title: "Mensuration: Perimeter, Area, Surface Area & Volume", desc: "Prisms, cylinders, spheres, cones, pyramids, compound shapes, arc length." },
            { id: "math-chapter-08", num: "08", title: "Pythagoras, Trigonometry & Bearings", desc: "Right-angled triangles, SOH CAH TOA, sine rule, cosine rule, 3D trigonometry." },
            { id: "math-chapter-09", num: "09", title: "Vectors & Transformations", desc: "Column vectors, magnitude, translations, reflections, rotations, enlargements." },
            { id: "math-chapter-10", num: "10", title: "Statistics & Data Handling", desc: "Mean, median, mode, histograms, cumulative frequency, box plots, scatter graphs." },
            { id: "math-chapter-11", num: "11", title: "Probability", desc: "Sample spaces, tree diagrams, Venn diagrams, mutually exclusive, independent events." },
            { id: "math-chapter-12", num: "12", title: "Circle Theorems & Advanced Geometry", desc: "Angle at centre, cyclic quadrilaterals, tangents, alternate segment theorem." },
            { id: "math-chapter-13", num: "13", title: "Advanced Algebra, Quadratics & Functions", desc: "Completing the square, quadratic formula, composite/inverse functions, variation." },
            { id: "math-chapter-14", num: "14", title: "Exam Practice, Problem Solving & Revision", desc: "Mixed-topic questions, multi-step problems, non-routine problem solving, mock exams." }
        ];

        // Render Chapter Cards
        const chapterList = document.getElementById('chapterList');
        let completedCount = 0;

        chapters.forEach(ch => {
            const isComplete = localStorage.getItem(ch.id) === 'true';
            if (isComplete) completedCount++;

            const card = document.createElement('a');
            card.href = `math-chapter${parseInt(ch.num, 10)}.html`;
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
