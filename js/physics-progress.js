const chapters = [
            { id: "physics-chapter-01", title: "Physical Quantities & Measurement" },
            { id: "physics-chapter-02", title: "Motion" },
            { id: "physics-chapter-03", title: "Mass, Weight & Gravity" },
            { id: "physics-chapter-04", title: "Density" },
            { id: "physics-chapter-05", title: "Forces & Their Effects" },
            { id: "physics-chapter-06", title: "Turning Effects & Centre of Gravity" },
            { id: "physics-chapter-07", title: "Momentum" },
            { id: "physics-chapter-08", title: "Energy, Work & Power" },
            { id: "physics-chapter-09", title: "Pressure" },
            { id: "physics-chapter-10", title: "States of Matter & Particle Model" },
            { id: "physics-chapter-11", title: "Temperature & Thermal Properties" },
            { id: "physics-chapter-12", title: "Melting, Boiling & Evaporation" },
            { id: "physics-chapter-13", title: "Thermal Energy Transfer" },
            { id: "physics-chapter-14", title: "General Wave Properties" }
        ];

        const display = document.getElementById('progressDisplay');
        
        chapters.forEach(ch => {
            const isComplete = localStorage.getItem(ch.id) === 'true';
            const percent = isComplete ? 100 : 0;
            const statusClass = isComplete ? 'complete' : '';
            const statusText = isComplete ? 'COMPLETE' : 'PENDING';
            
            const card = document.createElement('div');
            card.className = 'progress-card';
            card.innerHTML = `
                <div class="card-header">
                    <h3>${ch.title}</h3>
                    <span class="status ${statusClass}">${statusText}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%;"></div>
                </div>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">Progress: ${percent}%</p>
            `;
            display.appendChild(card);
        });
