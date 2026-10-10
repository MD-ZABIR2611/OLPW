// OLPW:js/refreshment.js | script for refreshment
(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? d; } catch (e) { return d; } };
    const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
    let toastTimer = 0;
    function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2600); }
    let ac = null;
    function tone(freq, dur, delay = 0, type = 'sine', vol = 0.16) {
        try {
            ac = ac || new (window.AudioContext || window.webkitAudioContext)();
            const t0 = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
            o.type = type; o.frequency.value = freq;
            g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
            o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + dur + 0.02);
        } catch (e) {}
    }
    const chime = () => [659, 784, 988, 1319].forEach((f, i) => tone(f, 0.5, i * 0.18, 'triangle'));

    /* ---------- Break timer ---------- */
    const TIPS = [
        'Stand up and stretch your arms and back.',
        'Drink a glass of water â€” your brain is about 75% water.',
        'Look at something 20 feet away for 20 seconds to rest your eyes.',
        'Take a short walk, even just around the room.',
        'Roll your shoulders and neck slowly a few times.',
        'Step outside or open a window for some fresh air.',
        'Have a healthy snack like fruit or nuts.'
    ];
    $('tip').textContent = 'ðŸ’¡ ' + TIPS[Math.floor(Math.random() * TIPS.length)];
    const C = 2 * Math.PI * 52, fg = $('ringFg');
    fg.style.strokeDasharray = C;
    const T = { total: 300, left: 300, running: false, ends: 0, id: 0 };
    const baseTitle = document.title;
    const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    function drawTimer() {
        $('tTime').textContent = fmt(T.left);
        fg.style.strokeDashoffset = C * (1 - T.left / T.total);
        $('tStart').textContent = T.running ? 'Pause' : T.left < T.total && T.left > 0 ? 'Resume' : 'Start';
        document.querySelectorAll('[data-min]').forEach(b => b.classList.toggle('on', +b.dataset.min * 60 === T.total));
        document.title = T.running ? `${fmt(T.left)} Â· Break` : baseTitle;
    }
    function tick() {
        T.left = Math.max(0, Math.round((T.ends - Date.now()) / 1000));
        if (T.left <= 0) {
            clearInterval(T.id); T.running = false;
            $('tState').textContent = "Break's over! Time to get back to studying. ðŸ“š";
            chime(); toast("Break's over â€” back to studying!");
            if (window.Notification && Notification.permission === 'granted') { try { new Notification('OLPW', { body: "Break's over â€” back to studying!" }); } catch (e) {} }
        }
        drawTimer();
    }
    function setLength(min) { clearInterval(T.id); T.running = false; T.total = T.left = min * 60; $('tState').textContent = `A ${min}-minute break. Press Start when you're ready.`; drawTimer(); }
    document.querySelectorAll('[data-min]').forEach(b => b.onclick = () => setLength(+b.dataset.min));
    $('tStart').onclick = () => {
        if (T.running) { clearInterval(T.id); T.running = false; $('tState').textContent = 'Paused.'; drawTimer(); return; }
        if (T.left <= 0) T.left = T.total;
        if (window.Notification && Notification.permission === 'default') { try { Notification.requestPermission(); } catch (e) {} }
        T.ends = Date.now() + T.left * 1000; T.running = true;
        $('tState').textContent = 'Enjoy your break! Try one of the activities below.';
        T.id = setInterval(tick, 500); drawTimer();
    };
    $('tReset').onclick = () => setLength(T.total / 60);
    drawTimer();

    /* ---------- Tabs ---------- */
    const panels = [...document.querySelectorAll('.panel')];
    let activeTab = '';
    function openTab(id) {
        if (!panels.some(p => p.id === id)) id = 'breathe';
        if (activeTab === 'breathe' && id !== 'breathe') stopBreathing();
        activeTab = id;
        panels.forEach(p => p.classList.toggle('on', p.id === id));
        document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === id));
        try { history.replaceState(null, '', '#' + id); } catch (e) {}
    }
    document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => openTab(b.dataset.tab));

    /* ---------- Breathing ---------- */
    const B = { on: false, timer: 0, rounds: 0 };
    const PHASES = [['Breathe in', 1], ['Hold', 1], ['Breathe out', 0.55], ['Hold', 0.55]];
    function stopBreathing() {
        B.on = false; clearTimeout(B.timer);
        $('bCircle').style.transform = 'scale(.55)';
        $('bLabel').innerHTML = 'Ready?<small></small>';
        $('bStart').textContent = 'Start';
    }
    function breathePhase(p, sec) {
        if (!B.on) return;
        const [label, scale] = PHASES[p];
        if (sec === 4) { $('bCircle').style.transform = `scale(${scale})`; if (p === 0) tone(440, 0.25, 0, 'sine', 0.08); if (p === 2) tone(330, 0.25, 0, 'sine', 0.08); }
        $('bLabel').innerHTML = `${label}<small>${sec}</small>`;
        B.timer = setTimeout(() => {
            if (sec > 1) return breathePhase(p, sec - 1);
            if (p === 3) { B.rounds++; $('bRounds').textContent = 'Rounds: ' + B.rounds; }
            breathePhase((p + 1) % 4, 4);
        }, 1000);
    }
    $('bStart').onclick = () => {
        if (B.on) return stopBreathing();
        B.on = true; $('bStart').textContent = 'Stop';
        breathePhase(0, 4);
    };

    /* ---------- Reaction test ---------- */
    const R = { state: 'idle', t0: 0, timer: 0, times: load('olpw-refresh-react', []), best: load('olpw-refresh-react-best', 0) };
    const rBox = $('rBox');
    function rStats() {
        const last = R.times[R.times.length - 1], recent = R.times.slice(-5);
        $('rLast').textContent = last ? last + ' ms' : 'â€”';
        $('rAvg').textContent = recent.length ? Math.round(recent.reduce((a, b) => a + b, 0) / recent.length) + ' ms' : 'â€”';
        $('rBest').textContent = R.best ? R.best + ' ms' : 'â€”';
    }
    function rSet(state, html) { R.state = state; rBox.className = 'react' + (state === 'wait' ? ' wait' : state === 'go' ? ' go' : ''); rBox.innerHTML = html; }
    function rPress() {
        if (R.state === 'wait') {
            clearTimeout(R.timer);
            tone(160, 0.25, 0, 'square', 0.08);
            return rSet('idle', 'Too soon! ðŸ˜…<small>Wait for green. Click to try again.</small>');
        }
        if (R.state === 'go') {
            const ms = Math.round(performance.now() - R.t0);
            R.times.push(ms); R.times = R.times.slice(-20); save('olpw-refresh-react', R.times);
            const record = !R.best || ms < R.best;
            if (record) { R.best = ms; save('olpw-refresh-react-best', ms); }
            rStats();
            const verdict = ms < 200 ? 'Lightning fast! âš¡' : ms < 260 ? 'Great reflexes!' : ms < 330 ? 'Nice!' : 'Keep practising!';
            return rSet('idle', `${ms} ms${record ? ' â€” new best! ðŸ†' : ''}<small>${verdict} Click to go again.</small>`);
        }
        rSet('wait', 'Wait for greenâ€¦<small>&nbsp;</small>');
        R.timer = setTimeout(() => { R.t0 = performance.now(); rSet('go', 'CLICK!<small>&nbsp;</small>'); }, 1200 + Math.random() * 2800);
    }
    rBox.addEventListener('pointerdown', e => { e.preventDefault(); rPress(); });
    rStats();

    /* ---------- Tic-Tac-Toe ---------- */
    const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const X = { b: Array(9).fill(''), over: false, first: 'X', lvl: load('olpw-refresh-ttt-lvl', 'hard'), score: load('olpw-refresh-ttt', { w: 0, d: 0, l: 0 }), busy: false };
    const tBoard = $('tBoard');
    for (let i = 0; i < 9; i++) { const b = document.createElement('button'); b.dataset.i = i; tBoard.appendChild(b); }
    function winner(b) {
        for (const l of LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return { w: b[l[0]], line: l };
        return b.every(Boolean) ? { w: 'draw', line: [] } : null;
    }
    function minimax(b, me) {
        const r = winner(b);
        if (r) return { s: r.w === 'O' ? 10 : r.w === 'X' ? -10 : 0 };
        let best = { s: me === 'O' ? -99 : 99, i: -1 };
        for (let i = 0; i < 9; i++) if (!b[i]) {
            b[i] = me;
            let s = minimax(b, me === 'O' ? 'X' : 'O').s;
            b[i] = '';
            s -= Math.sign(s);
            if (me === 'O' ? s > best.s : s < best.s) best = { s, i };
        }
        return best;
    }
    function tDraw(res) {
        [...tBoard.children].forEach((btn, i) => {
            btn.textContent = X.b[i]; btn.className = X.b[i] === 'X' ? 'x' : X.b[i] === 'O' ? 'o' : '';
            if (res && res.line.includes(i)) btn.classList.add('win');
            btn.disabled = X.over || !!X.b[i] || X.busy;
        });
        $('tW').textContent = X.score.w; $('tD').textContent = X.score.d; $('tL').textContent = X.score.l;
        document.querySelectorAll('[data-lvl]').forEach(b => b.classList.toggle('on', b.dataset.lvl === X.lvl));
    }
    function tCheck() {
        const r = winner(X.b);
        if (!r) return false;
        X.over = true;
        if (r.w === 'X') { X.score.w++; $('tMsg').textContent = 'You win! ðŸŽ‰'; chime(); }
        else if (r.w === 'O') { X.score.l++; $('tMsg').textContent = 'The computer wins this time.'; }
        else { X.score.d++; $('tMsg').textContent = "It's a draw."; }
        save('olpw-refresh-ttt', X.score);
        tDraw(r);
        return true;
    }
    function tComputer() {
        X.busy = true; $('tMsg').textContent = 'Computer is thinkingâ€¦'; tDraw();
        setTimeout(() => {
            const empty = X.b.map((v, i) => v ? -1 : i).filter(i => i >= 0);
            const i = X.lvl === 'easy' && Math.random() < 0.55 ? empty[Math.floor(Math.random() * empty.length)] : minimax(X.b.slice(), 'O').i;
            X.b[i] = 'O'; X.busy = false; tone(520, 0.08, 0, 'triangle');
            if (!tCheck()) { $('tMsg').textContent = 'Your turn.'; tDraw(); }
        }, 450);
    }
    tBoard.onclick = e => {
        const btn = e.target.closest('button');
        if (!btn || X.over || X.busy || X.b[btn.dataset.i]) return;
        X.b[btn.dataset.i] = 'X'; tone(660, 0.08, 0, 'triangle');
        if (!tCheck()) tComputer();
    };
    function tNew() {
        X.b = Array(9).fill(''); X.over = false; X.busy = false;
        tDraw();
        if (X.first === 'O') tComputer(); else $('tMsg').textContent = 'Your turn â€” you go first.';
        X.first = X.first === 'X' ? 'O' : 'X';
    }
    $('tNew').onclick = tNew;
    document.querySelectorAll('[data-lvl]').forEach(b => b.onclick = () => { X.lvl = b.dataset.lvl; save('olpw-refresh-ttt-lvl', X.lvl); tDraw(); });
    tNew();

    /* ---------- 2048 ---------- */
    const COLORS = { 2: ['#eee4da', '#776e65'], 4: ['#ede0c8', '#776e65'], 8: ['#f2b179', '#fff'], 16: ['#f59563', '#fff'], 32: ['#f67c5f', '#fff'], 64: ['#f65e3b', '#fff'], 128: ['#edcf72', '#fff'], 256: ['#edcc61', '#fff'], 512: ['#edc850', '#fff'], 1024: ['#edc53f', '#fff'], 2048: ['#edc22e', '#fff'] };
    const Gm = { g: Array(16).fill(0), score: 0, best: load('olpw-refresh-2048', 0), won: false, over: false, fresh: -1 };
    const gBoard = $('gBoard'), tiles = [];
    for (let i = 0; i < 16; i++) { const t = document.createElement('div'); t.className = 'tile'; gBoard.insertBefore(t, $('gOver')); tiles.push(t); }
    function addTile() {
        const empty = Gm.g.map((v, i) => v ? -1 : i).filter(i => i >= 0);
        if (!empty.length) return;
        const i = empty[Math.floor(Math.random() * empty.length)];
        Gm.g[i] = Math.random() < 0.9 ? 2 : 4; Gm.fresh = i;
    }
    function gDraw() {
        tiles.forEach((t, i) => {
            const v = Gm.g[i], c = COLORS[v] || ['#3c3a32', '#fff'];
            t.textContent = v || '';
            t.style.background = v ? c[0] : '';
            t.style.color = v ? c[1] : '';
            t.style.fontSize = v >= 1024 ? '20px' : v >= 128 ? '24px' : '';
            t.classList.toggle('pop', i === Gm.fresh);
        });
        $('gScore').textContent = Gm.score; $('gBest').textContent = Gm.best;
    }
    function slideRow(row) {
        const a = row.filter(Boolean), out = [];
        let gain = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i] === a[i + 1]) { out.push(a[i] * 2); gain += a[i] * 2; i++; }
            else out.push(a[i]);
        }
        while (out.length < 4) out.push(0);
        return { out, gain };
    }
    function canMove() {
        if (Gm.g.includes(0)) return true;
        for (let i = 0; i < 16; i++) { if (i % 4 < 3 && Gm.g[i] === Gm.g[i + 1]) return true; if (i < 12 && Gm.g[i] === Gm.g[i + 4]) return true; }
        return false;
    }
    function gMove(dir) {
        if (Gm.over) return;
        let moved = false, gain = 0;
        for (let k = 0; k < 4; k++) {
            const idx = [0, 1, 2, 3].map(j => dir === 'left' || dir === 'right' ? k * 4 + j : j * 4 + k);
            if (dir === 'right' || dir === 'down') idx.reverse();
            const r = slideRow(idx.map(i => Gm.g[i]));
            r.out.forEach((v, j) => { if (Gm.g[idx[j]] !== v) moved = true; Gm.g[idx[j]] = v; });
            gain += r.gain;
        }
        if (!moved) return;
        Gm.score += gain;
        if (Gm.score > Gm.best) { Gm.best = Gm.score; save('olpw-refresh-2048', Gm.best); }
        if (gain) tone(300 + Math.min(900, gain), 0.07, 0, 'triangle', 0.1);
        addTile(); gDraw();
        if (!Gm.won && Gm.g.includes(2048)) { Gm.won = true; chime(); toast('You made 2048! ðŸŽ‰ Keep going for a higher score.'); }
        if (!canMove()) { Gm.over = true; $('gOverText').textContent = `Game over â€” ${Gm.score} points`; $('gOver').classList.add('on'); }
    }
    function gNew() { Gm.g = Array(16).fill(0); Gm.score = 0; Gm.won = false; Gm.over = false; $('gOver').classList.remove('on'); addTile(); addTile(); gDraw(); }
    $('gNew').onclick = gNew; $('gAgain').onclick = gNew;
    const KEYS = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' };
    document.addEventListener('keydown', e => {
        if (e.target.closest && e.target.closest('input, textarea')) return;
        if (activeTab === 'g2048' && KEYS[e.key]) { e.preventDefault(); gMove(KEYS[e.key]); }
        if (activeTab === 'react' && e.code === 'Space') { e.preventDefault(); rPress(); }
    });
    let sw = null;
    gBoard.addEventListener('pointerdown', e => { sw = { x: e.clientX, y: e.clientY }; });
    gBoard.addEventListener('pointerup', e => {
        if (!sw) return;
        const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
        sw = null;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        gMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    });
    gNew();

    /* ---------- Quick maths ---------- */
    const Q = { lvl: load('olpw-refresh-qm-lvl', 'easy'), best: load('olpw-refresh-qm', { easy: 0, hard: 0 }), score: 0, ans: 0, ends: 0, id: 0, running: false };
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    function newQ() {
        const hard = Q.lvl === 'hard', op = rnd(0, hard ? 3 : 2);
        let a, b, txt;
        if (op === 0) { a = rnd(hard ? 12 : 1, hard ? 99 : 20); b = rnd(hard ? 12 : 1, hard ? 99 : 20); Q.ans = a + b; txt = `${a} + ${b}`; }
        else if (op === 1) { a = rnd(hard ? 20 : 2, hard ? 120 : 20); b = rnd(1, a); Q.ans = a - b; txt = `${a} âˆ’ ${b}`; }
        else if (op === 2) { a = rnd(2, hard ? 15 : 10); b = rnd(2, hard ? 15 : 10); Q.ans = a * b; txt = `${a} Ã— ${b}`; }
        else { b = rnd(2, 12); Q.ans = rnd(2, 12); a = b * Q.ans; txt = `${a} Ã· ${b}`; }
        $('qQ').textContent = txt + ' = ?';
        $('qIn').value = '';
    }
    function qDraw() {
        $('qScore').textContent = Q.score; $('qBest').textContent = Q.best[Q.lvl];
        document.querySelectorAll('[data-qm]').forEach(b => { b.classList.toggle('on', b.dataset.qm === Q.lvl); b.disabled = Q.running; });
        $('qStart').textContent = Q.running ? 'Stop' : 'Start';
    }
    function qEnd(stopped) {
        clearInterval(Q.id); Q.running = false;
        $('qIn').disabled = true;
        const record = !stopped && Q.score > Q.best[Q.lvl];
        if (record) { Q.best[Q.lvl] = Q.score; save('olpw-refresh-qm', Q.best); chime(); }
        $('qQ').textContent = stopped ? 'Stopped.' : `Time! ${Q.score} correct${record ? ' â€” new best! ðŸ†' : ''}`;
        qDraw();
    }
    function qTick() {
        const left = Math.max(0, Q.ends - Date.now());
        $('qTime').textContent = Math.ceil(left / 1000);
        $('qBar').style.width = (left / 600) + '%';
        if (left <= 0) qEnd(false);
    }
    $('qStart').onclick = () => {
        if (Q.running) return qEnd(true);
        Q.score = 0; Q.running = true; Q.ends = Date.now() + 60000;
        $('qIn').disabled = false; newQ(); qDraw(); $('qIn').focus();
        Q.id = setInterval(qTick, 200); qTick();
    };
    $('qIn').addEventListener('input', () => {
        const v = $('qIn').value.trim();
        if (!Q.running || v === '' || v === '-') return;
        if (+v === Q.ans) { Q.score++; tone(700, 0.07, 0, 'triangle', 0.1); newQ(); qDraw(); }
        else if (v.length >= String(Q.ans).length) { const el = $('qIn'); el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad'); }
    });
    document.querySelectorAll('[data-qm]').forEach(b => b.onclick = () => { if (Q.running) return; Q.lvl = b.dataset.qm; save('olpw-refresh-qm-lvl', Q.lvl); qDraw(); });
    qDraw();

    openTab(location.hash.slice(1));
})();
