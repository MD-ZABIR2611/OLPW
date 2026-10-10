function toggleAnswer(id) {
            const answer = document.getElementById(`answer-${id}`);
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
            }
        }

        document.querySelectorAll('.obj-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('completed');
                if (btn.classList.contains('completed')) {
                    btn.innerText = 'Completed';
                } else {
                    btn.innerText = 'Mark Complete';
                }
            });
        });

        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
