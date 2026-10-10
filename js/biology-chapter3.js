// OLPW:js/biology-chapter3.js | script for biology-chapter3
function toggleAnswer(id) { document.getElementById(id).classList.toggle('visible'); }
        function markComplete(id) {
            localStorage.setItem(id, 'true');
            alert('Chapter 03 marked as complete!');
        }
        function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }
