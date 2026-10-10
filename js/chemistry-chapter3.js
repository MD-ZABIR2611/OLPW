// ===========================================
        // JAVASCRIPT FIXES & ENHANCEMENTS
        // ===========================================

        // 1. Interactive Answer Reveal
        function toggleAnswer(id) {
            var x = document.getElementById(id);
            if (x.style.display === "block") {
                x.style.display = "none";
            } else {
                x.style.display = "block";
            }
        }

        // 2. Objective Button Toggle
        document.querySelectorAll('.obj-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('completed');
                if (this.classList.contains('completed')) {
                    this.innerText = 'Completed ✓';
                } else {
                    this.innerText = 'Mark Complete';
                }
            });
        });

        // 3. Scroll-based Active Nav Link (ScrollSpy)
        const sections = document.querySelectorAll('section, header');
        const navLinks = document.querySelectorAll('.nav-links a');

        function updateActiveNav() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120; // Offset for fixed nav
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }

        // 4. Progress Bar Animation on Scroll (Fixes the ReferenceError)
        function updateProgressBars() {
            const progressPanel = document.querySelector('.progress-panel');
            if (!progressPanel) return;
            
            const panelPosition = progressPanel.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.5; // Trigger when scrolled halfway down viewport

            if (panelPosition < screenPosition) {
                // Safely select all bar fills and update width
                document.querySelectorAll('.bar-fill').forEach(bar => {
                    bar.style.width = '100%';
                });
                // Safely select all percent spans and update text
                document.querySelectorAll('.bar-percent').forEach(span => {
                    span.innerText = '100%';
                });
                // Update main progress title
                const mainPercent = document.querySelector('.progress-percent');
                if (mainPercent) {
                    mainPercent.innerText = '100% COMPLETE';
                }
            }
        }

        // 5. Combined Scroll Event Listener
        window.addEventListener('scroll', () => {
            updateActiveNav();
            updateProgressBars();
        });

        // Run on load to set initial state
        window.addEventListener('load', () => {
            updateActiveNav();
        });
