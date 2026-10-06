/* OLPW shared page layer: clean green theme (light by default), logo + Home, Back and theme switch on every page.
   Load it synchronously in <head> (before any page script that reads the theme) so the page never flashes dark. */
(function () {
    var KEY = 'olpw-theme';
    var MIGRATED = 'olpw-theme-clean-v2';
    var CLEAN_ACCENT = '#16A34A';
    /* the accent picker stores a hex in t.accent; each known accent maps to a full palette
       (olpw-site.css overrides the tokens via html[data-palette]) */
    var ACCENT_PALETTES = { '#16a34a': 'green', '#3b82f6': 'blue', '#8b5cf6': 'purple', '#ea580c': 'orange', '#ec4899': 'pink', '#f59e0b': 'amber' };
    var PALETTE_ORDER = ['green', 'blue', 'purple', 'orange', 'pink', 'amber'];
    var PALETTE_LABELS = { green: 'Green', blue: 'Blue', purple: 'Purple', orange: 'Orange', pink: 'Pink', amber: 'Amber' };
    var PALETTE_HEX = { green: '#16A34A', blue: '#3B82F6', purple: '#8B5CF6', orange: '#EA580C', pink: '#EC4899', amber: '#F59E0B' };
    var PALETTE_INKS = {
        green: ['#16a34a', '#22c55e', '#15803d', '#4ade80', '#0d9488', '#f59e0b'],
        blue: ['#2563eb', '#3b82f6', '#1d4ed8', '#60a5fa', '#7c3aed', '#0ea5e9'],
        purple: ['#7c3aed', '#8b5cf6', '#6d28d9', '#a78bfa', '#ec4899', '#0ea5e9'],
        orange: ['#ea580c', '#f97316', '#c2410c', '#fb923c', '#0ea5e9', '#f59e0b'],
        pink: ['#ec4899', '#f472b6', '#be185d', '#f9a8d4', '#8b5cf6', '#fb7185'],
        amber: ['#d97706', '#f59e0b', '#b45309', '#fbbf24', '#ea580c', '#0ea5e9']
    };
    var root = document.documentElement;
    var page = (location.pathname.split('/').pop() || 'index').replace(/\.html$/i, '') || 'index';
    var darkOnly = page === 'Focaus_build';

    root.setAttribute('data-olpw-page', page);

    function readTheme() {
        try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
    }
    function saveTheme(t) {
        try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) { /* private mode */ }
    }
    function effectiveMode(t) {
        var m = t.mode || 'light';
        if (m === 'auto') m = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        return m;
    }
    function apply() {
        root.setAttribute('data-theme', darkOnly ? 'dark' : effectiveMode(readTheme()));
        root.setAttribute('data-palette', paletteName());
    }
    function paletteName() {
        var t = readTheme();
        return ACCENT_PALETTES[(t.accent || CLEAN_ACCENT).toLowerCase()] || 'green';
    }
    function inks() { return PALETTE_INKS[paletteName()] || PALETTE_INKS.green; }

    try {
        if (!localStorage.getItem(MIGRATED)) {
            var t = readTheme();
            if (!localStorage.getItem('olpw-theme-warm-v1')) t.mode = 'light';
            if (!t.accent || /^#(ff4500|ea580c|f97316|006a4e)$/i.test(t.accent)) t.accent = CLEAN_ACCENT;
            saveTheme(t);
            localStorage.setItem(MIGRATED, '1');
        }
    } catch (e) { /* storage blocked: fall back to light */ }
    apply();

    /* ---------- Clean look: Inter instead of the old display fonts, green instead of hard-coded orange ---------- */
    var OLD_FONT = /\b(Oswald|Roboto Condensed|Archivo Black|Barlow Condensed|Space Grotesk)\b/i;
    var OLD_FONT_TAIL = /["']?\b(Oswald|Roboto Condensed|Archivo Black|Barlow Condensed|Space Grotesk)\b.*$/i;
    var INTER = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
    var SHORTHANDS = ['background', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-color', 'outline', 'text-decoration', 'font'];
    var HEADING = /(^|[\s,>+~(])h[1-3]\b|title|heading|hero|logo|brand/i;
    var COLOR = /#([0-9a-f]{6}|[0-9a-f]{3})\b|rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)(%?)\s*)?\)/gi;
    /* the periodic table's orange/red shades are element categories, not the site accent */
    var recolor = page !== 'Focaus_build' && page !== 'periodic_table';
    var doneSheets = typeof WeakSet === 'function' ? new WeakSet() : null;

    function mix(v, a) {
        if (a == null || a >= 1) return 'var(' + v + ')';
        return 'color-mix(in srgb, var(' + v + ') ' + Math.round(a * 100) + '%, transparent)';
    }
    function accentFor(r, g, b, a, isBg) {
        var max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255, l = (max + min) / 2, d = max - min;
        /* the dark-first pages paint panels, bars and footers near-black (not pure black, which is kept for overlays) */
        if (isBg && d < 0.04 && l > 0.012 && l < 0.09) return mix(l < 0.05 ? '--olpw-bg' : '--olpw-card', a);
        if (!d) return null;
        var s = d / (1 - Math.abs(2 * l - 1)), h;
        r /= 255; g /= 255; b /= 255;
        if (max === r) h = 60 * (((g - b) / d) % 6);
        else if (max === g) h = 60 * ((b - r) / d + 2);
        else h = 60 * ((r - g) / d + 4);
        if (h < 0) h += 360;
        /* old brand greens (and the old orange accents) both follow the chosen accent palette */
        var inGreen = h >= 90 && h <= 170;
        if (inGreen ? (s < 0.5 || l < 0.09 || l > 0.97) : (h < 10 || h > 34 || s < 0.7 || l < 0.25)) return null;
        return mix(l > 0.8 ? '--olpw-tint' : l > 0.6 ? '--olpw-accent-2' : l < 0.4 ? '--olpw-accent-deep' : '--olpw-accent', a);
    }
    function swapColors(value, isBg) {
        return value.replace(COLOR, function (m, hex, r, g, b, a, pct) {
            if (hex) {
                if (hex.length === 3) hex = hex.replace(/./g, '$&$&');
                r = parseInt(hex.slice(0, 2), 16); g = parseInt(hex.slice(2, 4), 16); b = parseInt(hex.slice(4, 6), 16);
            }
            var alpha = a == null ? null : (pct ? parseFloat(a) / 100 : parseFloat(a));
            return accentFor(+r, +g, +b, alpha, isBg) || m;
        });
    }
    function fixStyle(st, selector) {
        var oldFont = '';
        for (var i = st.length - 1; i >= 0; i--) {
            var p = st[i];
            if (p.charAt(0) === '-' && p.charAt(1) === '-') continue;
            var v = st.getPropertyValue(p), nv = v;
            if (p === 'font-family') {
                var f = v.match(OLD_FONT);
                if (f) { oldFont = f[1]; nv = INTER; }
            } else if (recolor && /#|rgb/i.test(v)) nv = swapColors(v, p.indexOf('background') === 0);
            if (nv !== v) st.setProperty(p, nv, st.getPropertyPriority(p));
        }
        /* a shorthand that contains var() reports its longhands as empty, so fix those as a whole */
        for (var k = 0; k < SHORTHANDS.length; k++) {
            var sh = SHORTHANDS[k], sv = st.getPropertyValue(sh);
            if (!sv || sv.indexOf('var(') < 0) continue;
            var snv = sh === 'font' ? sv.replace(OLD_FONT_TAIL, INTER)
                : recolor ? swapColors(sv, sh === 'background') : sv;
            if (snv !== sv) st.setProperty(sh, snv, st.getPropertyPriority(sh));
        }
        if (!oldFont || !selector || !HEADING.test(selector) || /sub-?title/i.test(selector)) return;
        if (/archivo/i.test(oldFont)) st.setProperty('font-weight', '800');
        else if (!st.fontWeight || parseInt(st.fontWeight, 10) < 600) st.setProperty('font-weight', '700');
        if (st.textTransform === 'uppercase' && !/label|eyebrow|tag|badge|kicker|meta/i.test(selector)) {
            st.setProperty('text-transform', 'none');
            st.setProperty('letter-spacing', '-0.02em');
        }
    }
    function fixRules(rules) {
        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            if (r.style && r.selectorText) fixStyle(r.style, r.selectorText);
            else if (r.style && r.type === 5) fixStyle(r.style, '');
            if (r.cssRules) fixRules(r.cssRules);
        }
    }
    function fixSheets() {
        var sheets = document.styleSheets;
        for (var i = 0; i < sheets.length; i++) {
            var sh = sheets[i];
            if (doneSheets && doneSheets.has(sh)) continue;
            if (sh.href && /olpw-site\.css/.test(sh.href)) continue;
            var rules;
            try { rules = sh.cssRules; } catch (e) { continue; }
            if (!rules) continue;
            fixRules(rules);
            if (doneSheets) doneSheets.add(sh);
        }
    }
    function fixInline(rootEl) {
        if (rootEl.nodeType !== 1) return;
        if (rootEl.hasAttribute('style')) fixStyle(rootEl.style, '');
        var els = rootEl.querySelectorAll ? rootEl.querySelectorAll('[style]') : [];
        for (var i = 0; i < els.length; i++) fixStyle(els[i].style, '');
    }
    if (page !== 'Focaus_build') {
        var pending = false;
        var watcher = new MutationObserver(function (muts) {
            for (var i = 0; i < muts.length; i++) {
                var added = muts[i].addedNodes;
                for (var j = 0; j < added.length; j++) {
                    var n = added[j];
                    if (n.nodeName === 'STYLE' || n.nodeName === 'LINK') pending = true;
                    else fixInline(n);
                }
            }
            if (pending) { pending = false; fixSheets(); }
        });
        watcher.observe(root, { childList: true, subtree: true });
        document.addEventListener('DOMContentLoaded', function () { fixSheets(); fixInline(document.body); });
        window.addEventListener('load', fixSheets);
    }

    /* ---------- Geometrics: a randomised shape tile behind the page and a few slowly drifting shapes ---------- */
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function geoTile(size, boost) {
        var INKS = inks();
        var els = '';
        function op(a, b) { return Math.min(0.3, rnd(a, b) * boost).toFixed(3); }
        function dot(c, o) {
            els += '<circle cx="' + rnd(0, size).toFixed(1) + '" cy="' + rnd(0, size).toFixed(1) + '" r="' + rnd(2.5, 5).toFixed(1) + '" fill="' + c + '" fill-opacity="' + o + '"/>';
        }
        function ring(c, o) {
            els += '<circle cx="' + rnd(0, size).toFixed(1) + '" cy="' + rnd(0, size).toFixed(1) + '" r="' + rnd(9, 20).toFixed(1) + '" fill="none" stroke="' + c + '" stroke-opacity="' + o + '" stroke-width="' + rnd(1.6, 2.6).toFixed(1) + '"/>';
        }
        function tri(c, o) {
            var s = rnd(10, 20);
            els += '<g transform="translate(' + rnd(0, size).toFixed(1) + ' ' + rnd(0, size).toFixed(1) + ') rotate(' + pick([0, 60, 180, 240]) + ')">' +
                '<path d="M0 ' + (-s * 0.6).toFixed(1) + ' L' + (s * 0.52).toFixed(1) + ' ' + (s * 0.3).toFixed(1) + ' L' + (-s * 0.52).toFixed(1) + ' ' + (s * 0.3).toFixed(1) + ' Z" fill="none" stroke="' + c + '" stroke-opacity="' + o + '" stroke-width="2" stroke-linejoin="round"/></g>';
        }
        function sq(c, o) {
            var s = rnd(11, 20);
            els += '<g transform="translate(' + rnd(0, size).toFixed(1) + ' ' + rnd(0, size).toFixed(1) + ') rotate(' + pick([0, 45, 90, -30]) + ')">' +
                '<rect x="' + (-s / 2).toFixed(1) + '" y="' + (-s / 2).toFixed(1) + '" width="' + s.toFixed(1) + '" height="' + s.toFixed(1) + '" rx="' + (s * 0.22).toFixed(1) + '" fill="none" stroke="' + c + '" stroke-opacity="' + o + '" stroke-width="2"/></g>';
        }
        function plus(c, o) {
            var s = rnd(6, 10);
            els += '<g transform="translate(' + rnd(0, size).toFixed(1) + ' ' + rnd(0, size).toFixed(1) + ') rotate(' + pick([0, 45]) + ')" stroke="' + c + '" stroke-opacity="' + o + '" stroke-width="2.4" stroke-linecap="round">' +
                '<path d="M' + (-s).toFixed(1) + ' 0 H' + s.toFixed(1) + '"/><path d="M0 ' + (-s).toFixed(1) + ' V' + s.toFixed(1) + '"/></g>';
        }
        function arc(c, o) {
            var r = rnd(10, 18);
            els += '<g transform="translate(' + rnd(0, size).toFixed(1) + ' ' + rnd(0, size).toFixed(1) + ') rotate(' + rnd(0, 360).toFixed(0) + ')">' +
                '<path d="M' + (-r).toFixed(1) + ' 0 A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + r.toFixed(1) + ' 0" fill="none" stroke="' + c + '" stroke-opacity="' + o + '" stroke-width="2" stroke-linecap="round"/></g>';
        }
        function lines(c, o) {
            els += '<g transform="translate(' + rnd(0, size).toFixed(1) + ' ' + rnd(0, size).toFixed(1) + ') rotate(' + pick([30, -30, 60]) + ')" stroke="' + c + '" stroke-opacity="' + o + '" stroke-width="2" stroke-linecap="round">' +
                '<path d="M-9 -5 H9"/><path d="M-9 0 H9"/><path d="M-9 5 H9"/></g>';
        }
        var i;
        for (i = 0; i < 8; i++) dot(INKS[i % INKS.length], op(0.08, 0.14));
        for (i = 0; i < 5; i++) ring(INKS[(i + 1) % INKS.length], op(0.07, 0.12));
        for (i = 0; i < 4; i++) tri(INKS[(i + 2) % INKS.length], op(0.07, 0.12));
        for (i = 0; i < 3; i++) sq(INKS[(i + 3) % INKS.length], op(0.06, 0.11));
        for (i = 0; i < 3; i++) plus(INKS[(i + 4) % INKS.length], op(0.08, 0.13));
        for (i = 0; i < 2; i++) arc(INKS[(i + 5) % INKS.length], op(0.07, 0.12));
        for (i = 0; i < 2; i++) lines(INKS[(i + 2) % INKS.length], op(0.06, 0.10));
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + els + '</svg>';
        return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
    }
    function paintTile() {
        var boost = root.getAttribute('data-theme') === 'dark' ? 0.6 : 0.55;
        root.style.setProperty('--olpw-geo', geoTile(340, boost) + ', ' + geoTile(210, boost));
    }

    function sprite(kind, size) {
        var INKS = inks();
        var c = pick(INKS), body = '';
        if (kind === 'ring') body = '<circle cx="17" cy="17" r="11.5" fill="none" stroke="' + c + '" stroke-width="2.4" opacity=".9"/><circle cx="26" cy="9.5" r="2.2" fill="' + c + '" opacity=".85"/>';
        else if (kind === 'tri') body = '<path d="M17 4.5 L29.5 27.5 L4.5 27.5 Z" fill="none" stroke="' + c + '" stroke-width="2.3" stroke-linejoin="round" opacity=".9"/>';
        else if (kind === 'square') body = '<rect x="6.5" y="6.5" width="21" height="21" rx="5" fill="none" stroke="' + c + '" stroke-width="2.3" opacity=".9"/>';
        else if (kind === 'dot') body = '<circle cx="17" cy="17" r="6.5" fill="' + c + '" opacity=".85"/>';
        else if (kind === 'diamond') body = '<rect x="10" y="10" width="14" height="14" rx="3" fill="' + c + '" opacity=".85" transform="rotate(45 17 17)"/>';
        else if (kind === 'plus') body = '<g stroke="' + c + '" stroke-width="3" stroke-linecap="round" opacity=".9"><path d="M17 7 V27"/><path d="M7 17 H27"/></g>';
        else body = '<path d="M5 21 A12 12 0 0 1 29 21" fill="none" stroke="' + c + '" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>';
        return '<svg viewBox="0 0 34 34" width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
    }
    function ambient() {
        if (document.querySelector('.olpw-ambient')) return;
        if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var KINDS = ['ring', 'tri', 'square', 'dot', 'diamond', 'plus', 'arc', 'ring', 'tri', 'dot'];
        var host = document.createElement('div');
        host.className = 'olpw-ambient';
        host.setAttribute('aria-hidden', 'true');
        var count = window.innerWidth < 700 ? 10 : 18;
        for (var i = 0; i < count; i++) {
            var el = document.createElement('div');
            el.className = 'olpw-amb';
            el.innerHTML = sprite(KINDS[i % KINDS.length], 18 + Math.random() * 28);
            el.style.left = rnd(0, 100) + 'vw';
            el.style.setProperty('--dx', rnd(-12, 12).toFixed(1) + 'vw');
            el.style.setProperty('--spin', (Math.random() > 0.5 ? '' : '-') + Math.round(rnd(160, 520)) + 'deg');
            el.style.setProperty('--dur', rnd(26, 60).toFixed(1) + 's');
            el.style.setProperty('--sway', rnd(4, 8).toFixed(1) + 's');
            el.style.setProperty('--op', rnd(0.18, 0.4).toFixed(2));
            el.style.animationDelay = (-rnd(0, 60)).toFixed(1) + 's';
            if (Math.random() > 0.65) el.style.filter = 'blur(1px)';
            host.appendChild(el);
        }
        document.body.appendChild(host);
    }
    if (page !== 'Focaus_build') {
        paintTile();
        new MutationObserver(paintTile).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
        if (document.body) ambient(); else document.addEventListener('DOMContentLoaded', ambient);
    }

    /* ---------- Self-assessment quiz: chapter pages carry a JSON block; this renders and scores it ---------- */
    function initQuiz() {
        var dataEl = document.getElementById('olpw-quiz-data');
        var host = document.querySelector('.olpw-quiz-root');
        if (!dataEl || !host || host.dataset.ready) return;
        var data;
        try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
        var qs = data && (Array.isArray(data) ? data : data.questions);
        if (!qs || !qs.length) return;
        host.dataset.ready = '1';
        var pageId = page || (location.pathname.split('/').pop() || 'chapter').replace(/\.html$/, '');
        var bestKey = 'olpw-quiz-best-' + pageId;
        var total = qs.length;
        var scorable = 0;
        for (var s = 0; s < total; s++) if (qs[s].type !== 'written') scorable++;
        var state = { answered: 0, correct: 0 };
        var best = parseInt(localStorage.getItem(bestKey) || '0', 10) || 0;

        function el(tag, cls, text) {
            var n = document.createElement(tag);
            if (cls) n.className = cls;
            if (text != null) n.textContent = text;
            return n;
        }
        function norm(s) {
            return (s || '').toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();
        }
        function shuffled(arr) {
            var a = arr.slice();
            for (var i = a.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
            }
            return a;
        }
        function fmtBest() { return best + '/' + scorable; }

        var scoreChip = el('span', 'olpw-quiz-best', 'Best score: ' + fmtBest());
        var head = el('div', 'olpw-quiz-head');
        head.appendChild(el('span', 'olpw-quiz-sub', scorable + ' scored questions + written practice · instant feedback · answer key at the bottom'));
        head.appendChild(scoreChip);

        var list = el('div', 'olpw-quiz-list');
        var foot = el('div', 'olpw-quiz-foot');
        var scoreLine = el('p', 'olpw-quiz-score', 'Answered 0 of ' + total + ' · Correct 0');
        var banner = el('div', 'olpw-quiz-banner');
        banner.style.display = 'none';

        function updateScore() {
            scoreLine.textContent = 'Answered ' + state.answered + ' of ' + scorable + ' scored · Correct ' + state.correct;
            if (state.answered === scorable) {
                var msg;
                if (state.correct === scorable) msg = 'Perfect score! You know this chapter — consider marking it complete.';
                else if (state.correct >= Math.ceil(scorable * 0.6)) msg = 'Good work! Review the ones you missed and try again.';
                else msg = 'Keep going — re-read the core theory, then reset and try again.';
                banner.textContent = 'You scored ' + state.correct + '/' + scorable + '. ' + msg;
                banner.style.display = '';
                if (state.correct > best) {
                    best = state.correct;
                    localStorage.setItem(bestKey, String(best));
                    scoreChip.textContent = 'Best score: ' + fmtBest();
                }
            }
        }

        function lockAndMark(qWrap, chosenBtn, correctText, ok) {
            state.answered++;
            if (ok) state.correct++;
            var opts = qWrap.querySelectorAll('.olpw-quiz-opt');
            for (var i = 0; i < opts.length; i++) {
                opts[i].disabled = true;
                if (norm(opts[i].textContent) === norm(correctText)) opts[i].classList.add('is-correct');
            }
            if (chosenBtn && !ok) chosenBtn.classList.add('is-wrong');
            var verdict = qWrap.querySelector('.olpw-quiz-verdict');
            verdict.textContent = ok ? 'Correct.' : 'Not quite — the answer is "' + correctText + '".';
            verdict.className = 'olpw-quiz-verdict ' + (ok ? 'ok' : 'no');
            qWrap.dataset.locked = '1';
            updateScore();
        }

        function buildQuestion(q, idx) {
            var wrap = el('div', 'olpw-quiz-q');
            wrap.appendChild(el('p', 'olpw-quiz-qtext', (idx + 1) + '. ' + q.q));
            if (q.type === 'mcq') {
                var optsWrap = el('div', 'olpw-quiz-opts');
                var order = shuffled(q.options);
                for (var i = 0; i < order.length; i++) {
                    (function (label) {
                        var btn = el('button', 'olpw-quiz-opt', label);
                        btn.type = 'button';
                        btn.addEventListener('click', function () {
                            if (wrap.dataset.locked) return;
                            lockAndMark(wrap, btn, q.answer, norm(label) === norm(q.answer));
                        });
                        optsWrap.appendChild(btn);
                    })(order[i]);
                }
                wrap.appendChild(optsWrap);
            } else {
                var row = el('div', 'olpw-quiz-fib');
                var input = el('input', 'olpw-quiz-input');
                input.type = 'text';
                input.placeholder = 'Type your answer…';
                input.setAttribute('aria-label', 'Answer for question ' + (idx + 1));
                var check = el('button', 'olpw-quiz-check', 'Check');
                check.type = 'button';
                function doCheck() {
                    if (wrap.dataset.locked || !input.value.trim()) return;
                    var ok = false, acc = q.accept || [q.answer];
                    for (var i = 0; i < acc.length; i++) if (norm(input.value) === norm(acc[i])) ok = true;
                    input.classList.add(ok ? 'is-correct' : 'is-wrong');
                    lockAndMark(wrap, null, q.answer, ok);
                    input.disabled = true;
                    check.disabled = true;
                }
                check.addEventListener('click', doCheck);
                input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doCheck(); });
                row.appendChild(input);
                row.appendChild(check);
                wrap.appendChild(row);
            }
            wrap.appendChild(el('p', 'olpw-quiz-verdict', ''));
            return wrap;
        }

        function buildWritten(q, idx) {
            var wrap = el('div', 'olpw-quiz-q');
            wrap.appendChild(el('p', 'olpw-quiz-qtext', (idx + 1) + '. ' + q.q));
            wrap.appendChild(el('p', 'olpw-quiz-hint', 'Write your answer, then compare it with the model answer below.'));
            var wbtn = el('button', 'olpw-quiz-btn ghost', 'Show model answer');
            wbtn.type = 'button';
            var wans = el('div', 'olpw-quiz-model');
            wans.style.display = 'none';
            wans.textContent = q.answer;
            wbtn.addEventListener('click', function () {
                var open = wans.style.display !== 'none';
                wans.style.display = open ? 'none' : '';
                wbtn.textContent = open ? 'Show model answer' : 'Hide model answer';
            });
            wrap.appendChild(wbtn);
            wrap.appendChild(wans);
            return wrap;
        }

        var keyPanel = el('div', 'olpw-quiz-key');
        keyPanel.style.display = 'none';
        var keyTitle = el('h4', '', 'Answer key');
        var keyList = el('ol');
        var kNum = 0;
        for (var k = 0; k < total; k++) {
            if (qs[k].type === 'written') continue;
            keyList.appendChild(el('li', '', (kNum + 1) + '. ' + qs[k].answer));
            kNum++;
        }
        keyPanel.appendChild(keyTitle);
        keyPanel.appendChild(keyList);

        var keyBtn = el('button', 'olpw-quiz-btn', 'Show answer key');
        keyBtn.type = 'button';
        keyBtn.addEventListener('click', function () {
            var open = keyPanel.style.display !== 'none';
            keyPanel.style.display = open ? 'none' : '';
            keyBtn.textContent = open ? 'Show answer key' : 'Hide answer key';
        });
        var resetBtn = el('button', 'olpw-quiz-btn ghost', 'Try again');
        resetBtn.type = 'button';
        resetBtn.addEventListener('click', function () { build(); });

        foot.appendChild(scoreLine);
        foot.appendChild(keyBtn);
        foot.appendChild(resetBtn);

        function build() {
            state.answered = 0; state.correct = 0;
            list.innerHTML = '';
            var n = 0;
            for (var i = 0; i < total; i++) {
                if (qs[i].type === 'written') list.appendChild(buildWritten(qs[i], i));
                else { list.appendChild(buildQuestion(qs[i], n)); n++; }
            }
            banner.style.display = 'none';
            updateScore();
        }
        build();

        host.appendChild(head);
        host.appendChild(list);
        host.appendChild(banner);
        host.appendChild(foot);
        host.appendChild(keyPanel);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initQuiz);
    else initQuiz();

    /* ---------- Back-to-top: long pages get a floating jump button ---------- */
    (function () {
        function mountTopBtn() {
            if (document.querySelector('.olpw-top-btn')) return;
            var btn = document.createElement('button');
            btn.className = 'olpw-top-btn';
            btn.type = 'button';
            btn.innerHTML = '&#8593;';
            btn.title = 'Back to top';
            btn.setAttribute('aria-label', 'Back to top');
            btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
            var tick = function () {
                btn.classList.toggle('show', (window.scrollY || document.documentElement.scrollTop || 0) > 600);
            };
            window.addEventListener('scroll', tick, { passive: true });
            tick();
            document.body.appendChild(btn);
        }
        if (document.body) mountTopBtn(); else document.addEventListener('DOMContentLoaded', mountTopBtn);
    })();

    function parentPage() {
        var m = page.match(/^(.+)-chapter\d+$/) ||
            page.match(/^(math|physics|physices|chemistry|biology|cs)-(dashboard|definitions|formulas|formulae|revision|practical|progress|algorithms)$/);
        if (m) return m[1] + '.html';
        if (page === 'periodic_table') return 'chemistry.html';
        return 'index.html';
    }

    function goBack() {
        var sameOrigin = false;
        try { sameOrigin = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) { /* bad referrer */ }
        if (sameOrigin && history.length > 1) history.back();
        else location.href = parentPage();
    }

    function toggleTheme() {
        var t = readTheme();
        t.mode = effectiveMode(t) === 'light' ? 'dark' : 'light';
        saveTheme(t);
        apply();
        if (window.OLPWPlanner && OLPWPlanner.theme) OLPWPlanner.theme.apply();
        renderThemeButton();
    }

    var themeBtn = null;
    function renderThemeButton() {
        if (!themeBtn) return;
        var light = root.getAttribute('data-theme') === 'light';
        themeBtn.textContent = light ? '\u263E' : '\u2600';
        themeBtn.title = light ? 'Switch to dark theme' : 'Switch to light theme';
        themeBtn.setAttribute('aria-label', themeBtn.title);
    }

    /* ---------- Accent palette: stored as t.accent (same key the planner picker uses) ---------- */
    var palBtn = null;
    function renderPaletteButton() {
        if (!palBtn) return;
        var name = paletteName();
        palBtn.title = 'Accent colour: ' + (PALETTE_LABELS[name] || name) + ' (click to change)';
        palBtn.setAttribute('aria-label', palBtn.title);
        palBtn.style.background = 'linear-gradient(135deg, var(--olpw-accent, #16A34A), var(--olpw-accent-2, #22C55E))';
    }
    function cyclePalette() {
        var t = readTheme();
        var next = PALETTE_ORDER[(PALETTE_ORDER.indexOf(paletteName()) + 1) % PALETTE_ORDER.length];
        t.accent = PALETTE_HEX[next];
        saveTheme(t);
        applyPalette();
        renderPaletteButton();
        if (window.OLPWPlanner && OLPWPlanner.theme) OLPWPlanner.theme.apply();
    }
    function applyPalette() {
        apply();
        paintTile();
        var old = document.querySelector('.olpw-ambient');
        if (old) old.remove();
        if (document.body) ambient();
    }

    function mount() {
        var old = document.querySelectorAll('a.olpw-back');
        for (var i = 0; i < old.length; i++) old[i].remove();
        if (page === 'index' || document.querySelector('.olpw-float')) return;

        var bar = document.createElement('nav');
        bar.className = 'olpw-float';
        bar.setAttribute('aria-label', 'Site navigation');

        var home = document.createElement('a');
        home.className = 'olpw-float-btn olpw-float-home';
        home.href = 'index.html';
        home.title = 'OLPW home';
        var logo = document.createElement('img');
        logo.src = 'assets/logo-64.png';
        logo.alt = '';
        logo.width = 26;
        logo.height = 26;
        home.appendChild(logo);
        home.appendChild(document.createTextNode('Home'));

        var back = document.createElement('button');
        back.type = 'button';
        back.className = 'olpw-float-btn';
        back.textContent = '\u2190 Back';
        back.title = 'Go back to the previous page';
        back.addEventListener('click', goBack);

        bar.appendChild(home);
        bar.appendChild(back);

        if (!darkOnly) {
            themeBtn = document.createElement('button');
            themeBtn.type = 'button';
            themeBtn.className = 'olpw-float-btn olpw-float-icon';
            themeBtn.addEventListener('click', toggleTheme);
            bar.appendChild(themeBtn);
            renderThemeButton();

            palBtn = document.createElement('button');
            palBtn.type = 'button';
            palBtn.className = 'olpw-pal-btn';
            palBtn.addEventListener('click', cyclePalette);
            bar.appendChild(palBtn);
            renderPaletteButton();
        }
        document.body.appendChild(bar);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();

    window.addEventListener('storage', function (e) {
        if (e.key === KEY) {
            apply();
            renderThemeButton();
            renderPaletteButton();
            paintTile();
            var old = document.querySelector('.olpw-ambient');
            if (old) old.remove();
            if (document.body) ambient();
        }
    });
    window.OLPWSite = { goBack: goBack, parentPage: parentPage, toggleTheme: toggleTheme, applyTheme: apply, applyPalette: applyPalette, cyclePalette: cyclePalette, paletteName: paletteName };
})();
