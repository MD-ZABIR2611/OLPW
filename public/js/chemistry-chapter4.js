// OLPW:js/chemistry-chapter4.js | script for chemistry-chapter4
// INTERACTIVE ANSWER REVEAL
        function toggleAnswer(btn) {
            var answerBox = btn.nextElementSibling;
            if (answerBox.style.display === 'block') {
                answerBox.style.display = 'none';
                btn.innerText = 'REVEAL ANSWER';
            } else {
                answerBox.style.display = 'block';
                btn.innerText = 'HIDE ANSWER';
            }
        }

        // PROGRESS BAR ANIMATION ON SCROLL
        window.addEventListener('scroll', function() {
            var theoryBar = document.getElementById('theoryBar');
            var examBar = document.getElementById('examBar');
            var totalBar = document.getElementById('totalBar');
            var progressPanel = document.querySelector('.progress-panel');
            
            var panelPosition = progressPanel.getBoundingClientRect().top;
            var screenPosition = window.innerHeight / 1.5;

            if (panelPosition < screenPosition) {
                theoryBar.style.width = '100%';
                theoryPct.innerText = '100%';
                examBar.style.width = '100%';
                examPct.innerText = '100%';
                totalBar.style.width = '100%';
                totalPct.innerText = '100';
            }
        });

        // SMOOTH SCROLL ACTIVE NAV
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // MASTERY BUTTONS
        function markComplete(btn) {
            if (btn.innerText === 'MARK COMPLETE') {
                btn.innerText = 'COMPLETED ✓';
                btn.style.background = 'var(--neon-orange)';
                btn.style.color = 'var(--pure-black)';
            } else {
                btn.innerText = 'MARK COMPLETE';
                btn.style.background = 'transparent';
                btn.style.color = 'var(--white)';
            }
        }
