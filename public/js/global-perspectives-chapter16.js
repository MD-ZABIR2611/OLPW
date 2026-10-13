// OLPW:js/global-perspectives-chapter16.js | script for global-perspectives-chapter16
var KEY = 'global-perspectives-chapter-16';
function toggleAnswer(btn){var a=btn.nextElementSibling;var on=a.classList.toggle('on');btn.textContent=on?'Hide answer':'Reveal answer';}
function renderComplete(){var done=localStorage.getItem(KEY)==='true';var b=document.getElementById('completeBtn');b.classList.toggle('done',done);b.textContent=done?'Completed \u2713':'Mark complete';document.getElementById('statusNum').textContent=done?'Done':'To do';}
function toggleComplete(){if(localStorage.getItem(KEY)==='true')localStorage.removeItem(KEY);else localStorage.setItem(KEY,'true');renderComplete();}
renderComplete();
