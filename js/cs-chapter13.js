// OLPW:js/cs-chapter13.js | script for cs-chapter13
function toggleAnswer(id) { document.getElementById(id).classList.toggle('visible'); }
        function markComplete(id) {
            localStorage.setItem(id, 'true');
            alert('Chapter 13 marked as complete!');
        }
        function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }
