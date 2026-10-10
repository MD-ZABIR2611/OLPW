// OLPW:js/biology-definitions.js | script for biology-definitions
function filterDefinitions() {
            let input = document.getElementById('searchInput').value.toLowerCase();
            let cards = document.getElementsByClassName('def-card');
            for (let i = 0; i < cards.length; i++) {
                let term = cards[i].getElementsByClassName('def-term')[0].innerText.toLowerCase();
                let text = cards[i].getElementsByClassName('def-text')[0].innerText.toLowerCase();
                if (term.includes(input) || text.includes(input)) {
                    cards[i].style.display = "";
                } else {
                    cards[i].style.display = "none";
                }
            }
        }
        function toggleMenu() { document.getElementById('navLinks').classList.toggle('active'); }
