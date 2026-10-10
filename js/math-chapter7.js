// OLPW:js/math-chapter7.js | script for math-chapter7
function toggleAnswer(id) { document.getElementById(id).classList.toggle('visible'); }
        function markComplete(id) {
            localStorage.setItem(id, 'true');
            alert('Chapter 07 marked as complete!');
        }
        function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }
