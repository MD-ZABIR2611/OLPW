function toggleAnswer(id) { document.getElementById(id).classList.toggle('visible'); }
        function markComplete(id) {
            localStorage.setItem(id, 'true');
            alert('Chapter 08 marked as complete!');
        }
        function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }
