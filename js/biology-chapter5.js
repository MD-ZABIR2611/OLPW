// OLPW:js/biology-chapter5.js | script for biology-chapter5
function toggleAnswer(id) { document.getElementById(id).classList.toggle('visible'); }
        function markComplete(id) {
            localStorage.setItem(id, 'true');
            alert('Chapter 05 marked as complete!');
        }
        function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }
