// OLPW:js/bangla.js | script for bangla
var cards = document.querySelectorAll('.card[data-key]');
document.getElementById('coreNum').textContent = cards.length;
var done = 0;
cards.forEach(function(c){ if (localStorage.getItem(c.dataset.key) === 'true') { c.classList.add('done'); done++; } });
var pct = Math.round(done / cards.length * 100);
document.getElementById('doneNum').textContent = String(done).padStart(2, '0');
document.getElementById('pctNum').textContent = pct + '%';
document.getElementById('progLbl').textContent = done + ' / ' + cards.length;
requestAnimationFrame(function(){ document.getElementById('progBar').style.width = pct + '%'; });
