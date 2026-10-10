// OLPW:js/tools.js | script for tools
(function () {
    const $ = id => document.getElementById(id);
    const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
    const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

    /* Tabs (remembers the last tab; #tab in the URL opens a tab directly) */
    const tabs = document.querySelectorAll('[data-tab]');
    function openTab(id) {
        if (!$(id)) id = 'flash';
        tabs.forEach(b => b.classList.toggle('on', b.dataset.tab === id));
        document.querySelectorAll('.panel').forEach(p => p.classList.toggle('on', p.id === id));
        localStorage.setItem('olpw-tools-tab', id);
        history.replaceState(null, '', '#' + id);
    }
    tabs.forEach(b => b.addEventListener('click', () => openTab(b.dataset.tab)));
    openTab(location.hash.slice(1) || localStorage.getItem('olpw-tools-tab') || 'flash');

    /* Flashcards */
    let cards = load('olpw-flashcards', [
        { q: 'What is the formula for speed?', a: 'Speed = distance ÷ time', known: false },
        { q: 'What is photosynthesis?', a: 'The process by which plants use light energy to make glucose from carbon dioxide and water, releasing oxygen.', known: false },
        { q: 'What is opportunity cost?', a: 'The next best alternative given up when a choice is made.', known: false }
    ]);
    let idx = 0, onlyUnknown = false;
    function deck() { return cards.map((c, i) => i).filter(i => !onlyUnknown || !cards[i].known); }
    function renderCards() {
        save('olpw-flashcards', cards);
        const d = deck();
        const stage = $('fcStage');
        stage.innerHTML = '';
        if (!d.length) {
            stage.innerHTML = `<p class="empty">${cards.length ? 'You know every card. Nice work!' : 'No cards yet. Add your first one above.'}</p>`;
            if (cards.length) { const b = document.createElement('button'); b.className = 'btn'; b.textContent = 'Show all cards'; b.onclick = () => { onlyUnknown = false; renderCards(); }; stage.appendChild(b); }
        } else {
            idx = Math.min(idx, d.length - 1);
            const c = cards[d[idx]];
            stage.innerHTML = `<div class="card3d" id="fcCard" title="Click to flip"><div class="card3d-inner"><div class="face"><small>Question ${idx + 1} / ${d.length}</small></div><div class="face back"><small>Answer</small></div></div></div>
            <div class="row fc-controls"><button class="btn" id="fcPrev" type="button">&larr; Prev</button><button class="btn" id="fcShuffle" type="button">Shuffle</button><button class="btn primary" id="fcKnow" type="button"></button><button class="btn" id="fcFilter" type="button"></button><button class="btn" id="fcNext" type="button">Next &rarr;</button></div>`;
            stage.querySelector('.face').append(c.q);
            stage.querySelector('.face.back').append(c.a);
            $('fcKnow').textContent = c.known ? 'Mark as not known' : 'I know this ✓';
            $('fcFilter').textContent = onlyUnknown ? 'Show all' : 'Only unknown';
            $('fcCard').onclick = () => $('fcCard').classList.toggle('flip');
            $('fcPrev').onclick = () => { idx = (idx - 1 + d.length) % d.length; renderCards(); };
            $('fcNext').onclick = () => { idx = (idx + 1) % d.length; renderCards(); };
            $('fcKnow').onclick = () => { c.known = !c.known; if (onlyUnknown && c.known) idx = idx % Math.max(1, d.length - 1); renderCards(); };
            $('fcFilter').onclick = () => { onlyUnknown = !onlyUnknown; idx = 0; renderCards(); };
            $('fcShuffle').onclick = () => { for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; } idx = 0; renderCards(); };
        }
        const list = $('fcList');
        list.innerHTML = cards.length ? `<p class="muted" style="margin-bottom:6px">${cards.length} cards · ${cards.filter(c => c.known).length} known</p>` : '';
        cards.forEach((c, i) => {
            const row = document.createElement('div');
            row.className = 'fc-item';
            const s = document.createElement('span');
            s.textContent = (c.known ? '✓ ' : '') + c.q;
            const del = document.createElement('button');
            del.type = 'button'; del.title = 'Delete card'; del.textContent = '✕';
            del.onclick = () => { cards.splice(i, 1); renderCards(); };
            row.append(s, del);
            list.appendChild(row);
        });
    }
    function addCard() {
        const q = $('fcQ').value.trim(), a = $('fcA').value.trim();
        if (!q || !a) { (q ? $('fcA') : $('fcQ')).focus(); return; }
        cards.push({ q, a, known: false });
        $('fcQ').value = ''; $('fcA').value = ''; $('fcQ').focus();
        onlyUnknown = false; idx = cards.length - 1; renderCards();
    }
    $('fcAdd').onclick = addCard;
    $('fcA').addEventListener('keydown', e => { if (e.key === 'Enter') addCard(); });
    renderCards();

    /* Calculator: a small safe parser (no eval) */
    const FN = { sin: x => Math.sin(x * Math.PI / 180), cos: x => Math.cos(x * Math.PI / 180), tan: x => Math.tan(x * Math.PI / 180), asin: x => Math.asin(x) * 180 / Math.PI, acos: x => Math.acos(x) * 180 / Math.PI, atan: x => Math.atan(x) * 180 / Math.PI, log: Math.log10, ln: Math.log, sqrt: Math.sqrt, abs: Math.abs };
    function evaluate(src) {
        const s = src.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/√/g, 'sqrt').replace(/π/g, 'pi');
        let i = 0;
        const peek = () => s[i];
        function num() {
            const m = s.slice(i).match(/^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i);
            if (m) { i += m[0].length; return parseFloat(m[0]); }
            const w = s.slice(i).match(/^[a-z]+/i);
            if (w) {
                const name = w[0].toLowerCase(); i += w[0].length;
                if (name === 'pi') return Math.PI;
                if (name === 'e') return Math.E;
                if (FN[name]) { const v = FN[name](factor()); return v; }
                throw new Error('Unknown: ' + name);
            }
            if (peek() === '(') { i++; const v = expr(); if (peek() !== ')') throw new Error('Missing )'); i++; return v; }
            throw new Error('Syntax error');
        }
        function postfix() {
            let v = num();
            while (peek() === '!' || peek() === '%') {
                if (peek() === '!') { if (v < 0 || v > 170 || v % 1) throw new Error('Bad factorial'); let f = 1; for (let k = 2; k <= v; k++) f *= k; v = f; }
                else v = v / 100;
                i++;
            }
            return v;
        }
        function power() { const b = postfix(); if (peek() === '^') { i++; return Math.pow(b, factor()); } return b; }
        function factor() { if (peek() === '-') { i++; return -factor(); } if (peek() === '+') { i++; return factor(); } return power(); }
        function term() {
            let v = factor();
            while (true) {
                if (peek() === '*') { i++; v *= factor(); }
                else if (peek() === '/') { i++; v /= factor(); }
                else if (peek() && /[\d(a-z.]/i.test(peek())) v *= factor();
                else return v;
            }
        }
        function expr() { let v = term(); while (peek() === '+' || peek() === '-') { const op = s[i++]; v = op === '+' ? v + term() : v - term(); } return v; }
        const v = expr();
        if (i < s.length) throw new Error('Syntax error');
        return v;
    }
    const fmt = v => Number.isFinite(v) ? String(parseFloat(v.toPrecision(12))) : 'Undefined';
    const calcIn = $('calcIn'), calcOut = $('calcOut');
    function preview() { const t = calcIn.value.trim(); if (!t) { calcOut.textContent = ''; return; } try { calcOut.textContent = '= ' + fmt(evaluate(t)); } catch (e) { calcOut.textContent = ''; } }
    function equals() { try { const r = fmt(evaluate(calcIn.value)); calcOut.textContent = calcIn.value + ' ='; calcIn.value = r; } catch (e) { calcOut.textContent = e.message; } }
    const KEYS = ['sin', 'cos', 'tan', '(', ')', 'log', 'ln', '√', '^', '!', '7', '8', '9', '÷', 'C', '4', '5', '6', '×', '⌫', '1', '2', '3', '-', 'π', '0', '.', '%', '+', '='];
    KEYS.forEach(k => {
        const b = document.createElement('button');
        b.type = 'button'; b.textContent = k;
        if ('÷×-+^!%'.includes(k)) b.className = 'op';
        if (k === '=') b.className = 'eq';
        b.onclick = () => {
            if (k === '=') equals();
            else if (k === 'C') { calcIn.value = ''; calcOut.textContent = ''; }
            else if (k === '⌫') { calcIn.value = calcIn.value.slice(0, -1); preview(); }
            else { calcIn.value += /^[a-z]+$/.test(k) || k === '√' ? k + '(' : k; preview(); }
            calcIn.focus();
        };
        $('calcKeys').appendChild(b);
    });
    calcIn.addEventListener('input', preview);
    calcIn.addEventListener('keydown', e => { if (e.key === 'Enter') equals(); });

    /* Unit converter */
    const UNITS = {
        Length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, µm: 1e-6, nm: 1e-9, mile: 1609.344, yard: 0.9144, foot: 0.3048, inch: 0.0254 },
        Mass: { kg: 1, g: 0.001, mg: 1e-6, tonne: 1000, lb: 0.45359237, oz: 0.028349523 },
        Time: { s: 1, ms: 0.001, min: 60, h: 3600, day: 86400, week: 604800, year: 31557600 },
        Area: { 'm²': 1, 'cm²': 1e-4, 'mm²': 1e-6, 'km²': 1e6, hectare: 1e4, acre: 4046.8564224 },
        Volume: { 'm³': 1, 'dm³ (litre)': 0.001, 'cm³ (ml)': 1e-6, 'gallon (UK)': 0.00454609 },
        Speed: { 'm/s': 1, 'km/h': 1 / 3.6, mph: 0.44704, knot: 0.514444 },
        Energy: { J: 1, kJ: 1000, MJ: 1e6, cal: 4.184, kcal: 4184, kWh: 3.6e6 },
        Pressure: { Pa: 1, kPa: 1000, atm: 101325, bar: 1e5, mmHg: 133.322 },
        Data: { bit: 0.125, byte: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
        Temperature: { '°C': 'C', '°F': 'F', K: 'K' }
    };
    const uType = $('uType'), uFrom = $('uFrom'), uTo = $('uTo');
    Object.keys(UNITS).forEach(t => uType.add(new Option(t, t)));
    function fillUnits() {
        const names = Object.keys(UNITS[uType.value]);
        [uFrom, uTo].forEach((sel, k) => { sel.innerHTML = ''; names.forEach(n => sel.add(new Option(n, n))); sel.selectedIndex = Math.min(k, names.length - 1); });
        convert();
    }
    function toC(v, u) { return u === 'C' ? v : u === 'F' ? (v - 32) * 5 / 9 : v - 273.15; }
    function fromC(v, u) { return u === 'C' ? v : u === 'F' ? v * 9 / 5 + 32 : v + 273.15; }
    function convert() {
        const v = parseFloat($('uVal').value);
        if (!Number.isFinite(v)) { $('uOut').textContent = ''; return; }
        const set = UNITS[uType.value];
        const r = uType.value === 'Temperature' ? fromC(toC(v, set[uFrom.value]), set[uTo.value]) : v * set[uFrom.value] / set[uTo.value];
        $('uOut').textContent = `${v} ${uFrom.value} = ${fmt(r)} ${uTo.value}`;
    }
    uType.onchange = fillUnits;
    [uFrom, uTo].forEach(s => s.onchange = convert);
    $('uVal').oninput = convert;
    $('uSwap').onclick = () => { const a = uFrom.value; uFrom.value = uTo.value; uTo.value = a; convert(); };
    fillUnits();

    /* Grade calculator */
    const BANDS = [[90, 'A*'], [80, 'A'], [70, 'B'], [60, 'C'], [50, 'D'], [40, 'E'], [0, 'U']];
    let rows = load('olpw-grade-rows', [{ n: 'Paper 1', m: '', t: 80, w: 50 }, { n: 'Paper 2', m: '', t: 80, w: 50 }]);
    function renderRows() {
        const body = $('gRows');
        body.innerHTML = '';
        rows.forEach((r, i) => {
            const tr = document.createElement('tr');
            [['n', 'text', 'Name'], ['m', 'number', 'Mark'], ['t', 'number', 'Out of'], ['w', 'number', 'Weight']].forEach(([k, type, label]) => {
                const td = document.createElement('td');
                const inp = document.createElement('input');
                inp.type = type; inp.value = r[k]; inp.setAttribute('aria-label', label);
                if (type === 'number') { inp.min = 0; inp.step = 'any'; }
                inp.oninput = () => { r[k] = inp.value; calcGrades(); };
                td.appendChild(inp); tr.appendChild(td);
            });
            const td = document.createElement('td');
            const del = document.createElement('button');
            del.className = 'btn'; del.type = 'button'; del.textContent = '✕'; del.title = 'Remove row';
            del.onclick = () => { rows.splice(i, 1); renderRows(); };
            td.appendChild(del); tr.appendChild(td);
            body.appendChild(tr);
        });
        calcGrades();
    }
    function calcGrades() {
        save('olpw-grade-rows', rows);
        let sum = 0, weight = 0;
        rows.forEach(r => {
            const m = parseFloat(r.m), t = parseFloat(r.t), w = parseFloat(r.w);
            if (Number.isFinite(m) && t > 0 && w > 0) { sum += Math.min(m / t, 1) * w; weight += w; }
        });
        if (!weight) { $('gPct').textContent = $('gGrade').textContent = $('gNext').textContent = '–'; return; }
        const pct = sum / weight * 100;
        const band = BANDS.findIndex(([min]) => pct >= min);
        $('gPct').textContent = pct.toFixed(1) + '%';
        $('gGrade').textContent = BANDS[band][1];
        $('gNext').textContent = band === 0 ? 'Top grade!' : `+${(BANDS[band - 1][0] - pct).toFixed(1)}% for ${BANDS[band - 1][1]}`;
    }
    $('gAdd').onclick = () => { rows.push({ n: `Test ${rows.length + 1}`, m: '', t: 100, w: 10 }); renderRows(); };
    renderRows();

    /* Quick notes */
    let notes = load('olpw-quick-notes', []);
    let current = null, saveTimer = null;
    function renderNotes() {
        const list = $('nList');
        list.innerHTML = notes.length ? '' : '<p class="muted">No notes yet.</p>';
        notes.slice().sort((a, b) => b.updated - a.updated).forEach(n => {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = n.title || 'Untitled note';
            b.classList.toggle('on', current && n.id === current.id);
            b.onclick = () => openNote(n.id);
            list.appendChild(b);
        });
    }
    function openNote(id) {
        current = notes.find(n => n.id === id) || null;
        $('nTitle').value = current ? current.title : '';
        $('nBody').value = current ? current.body : '';
        $('nSaved').textContent = current ? 'Saved ' + new Date(current.updated).toLocaleString() : '';
        renderNotes();
    }
    function newNote() {
        const n = { id: Date.now().toString(36), title: '', body: '', updated: Date.now() };
        notes.push(n); save('olpw-quick-notes', notes); openNote(n.id); $('nTitle').focus();
    }
    function queueSave() {
        if (!current) { newNote(); }
        current.title = $('nTitle').value; current.body = $('nBody').value; current.updated = Date.now();
        $('nSaved').textContent = 'Saving…';
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => { save('olpw-quick-notes', notes); $('nSaved').textContent = 'Saved'; renderNotes(); }, 400);
    }
    $('nNew').onclick = newNote;
    $('nTitle').oninput = queueSave;
    $('nBody').oninput = queueSave;
    $('nDelete').onclick = () => {
        if (!current) return;
        notes = notes.filter(n => n.id !== current.id); save('olpw-quick-notes', notes);
        openNote(notes.length ? notes[notes.length - 1].id : null);
    };
    $('nDownload').onclick = () => {
        if (!current) return;
        const blob = new Blob([(current.title ? current.title + '\n\n' : '') + current.body], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (current.title || 'note').replace(/[^\w -]+/g, '').trim().slice(0, 40) + '.txt';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    openNote(notes.length ? notes[notes.length - 1].id : null);

    /* Word counter */
    const wIn = $('wIn');
    wIn.value = localStorage.getItem('olpw-word-text') || '';
    function count() {
        const t = wIn.value;
        localStorage.setItem('olpw-word-text', t);
        const words = (t.match(/[\p{L}\p{N}'’-]+/gu) || []).length;
        $('wWords').textContent = words;
        $('wChars').textContent = t.length;
        $('wNoSp').textContent = t.replace(/\s/g, '').length;
        $('wSent').textContent = (t.match(/[^.!?]+[.!?]+/g) || (t.trim() ? [t] : [])).length;
        $('wPara').textContent = t.split(/\n\s*\n/).filter(p => p.trim()).length;
        $('wRead').textContent = Math.max(words ? 1 : 0, Math.round(words / 200)) + ' min';
    }
    wIn.oninput = count;
    count();
})();
