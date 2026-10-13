// OLPW:js/physics-chapter2.js | script for physics-chapter2
function toggleAnswer(id) { 
            document.getElementById(id).classList.toggle('visible'); 
        }
        
        function markComplete(id) {
            localStorage.setItem(id, 'true');
            alert('Chapter 02 marked as complete!');
        }

        function toggleMenu() {
            document.getElementById('navLinks').classList.toggle('active');
        }
