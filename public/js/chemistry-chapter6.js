// OLPW:js/chemistry-chapter6.js | script for chemistry-chapter6
function toggleAnswer(id) {
            var x = document.getElementById(id);
            if (x.style.display === "block") { x.style.display = "none"; } else { x.style.display = "block"; }
        }

        document.querySelectorAll('.obj-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('completed');
                if (this.classList.contains('completed')) { this.innerText = 'Completed ✓'; } else { this.innerText = 'Mark Complete'; }
            });
        });

        const sections = document.querySelectorAll('section, header');
        const navLinks = document.querySelectorAll('.nav-links a');

        function updateActiveNav() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) { current = section.getAttribute('id'); }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) { link.classList.add('active'); }
            });
        }

        function updateProgressBars() {
            const progressPanel = document.querySelector('.progress-panel');
            if (!progressPanel) return;
            const panelPosition = progressPanel.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.5;
            if (panelPosition < screenPosition) {
                document.querySelectorAll('.bar-fill').forEach(bar => { bar.style.width = '100%'; });
                document.querySelectorAll('.bar-percent').forEach(span => { span.innerText = '100%'; });
                const mainPercent = document.querySelector('.progress-percent');
                if (mainPercent) { mainPercent.innerText = '100% COMPLETE'; }
            }
        }

        window.addEventListener('scroll', () => {
            updateActiveNav();
            updateProgressBars();
        });

        window.addEventListener('load', () => {
            updateActiveNav();
        });
