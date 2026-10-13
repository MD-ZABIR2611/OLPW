// OLPW:js/cs-chapter14.js | script for cs-chapter14
function toggleAnswer(id) { document.getElementById(id).classList.toggle('visible'); }
        function markComplete(id) {
            localStorage.setItem(id, 'true');
            alert('Chapter 14 marked as complete! You finished the course!');
        }
        function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }
