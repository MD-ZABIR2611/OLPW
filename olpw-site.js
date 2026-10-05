/* OLPW shared page layer: clean green theme (light by default), logo + Home, Back and theme switch on every page.
   Load it synchronously in <head> (before any page script that reads the theme) so the page never flashes dark. */
(function () {
    var KEY = 'olpw-theme';
    var MIGRATED = 'olpw-theme-clean-v2';
    var CLEAN_ACCENT = '#16A34A';
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
    }

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
        if (h < 10 || h > 34 || s < 0.7 || l < 0.25) return null;
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

    /* ---------- Botanicals: a randomised leaf/flower tile behind the page and a few slowly drifting leaves ---------- */
    var GREENS = ['#2f8f5b', '#3aa76d', '#256b45', '#5cbf7f', '#1f7a4d', '#7ed0a0', '#4caf50'];
    var FLOWERS = ['#e86a9a', '#f2a65a', '#d9534f', '#f6c445', '#b07cd6', '#ff8fab'];
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function natureTile(size, boost) {
        var els = '';
        function op(a, b) { return Math.min(0.3, rnd(a, b) * boost).toFixed(3); }
        function leaf(c, o) {
            els += '<g transform="translate(' + rnd(0, size) + ' ' + rnd(0, size) + ') rotate(' + rnd(0, 360) + ') scale(' + rnd(0.5, 1) + ')" fill="' + c + '" fill-opacity="' + o + '">' +
                '<path d="M0 0 Q26 -16 54 0 Q26 16 0 0 Z"/><path d="M0 0 L54 0" stroke="' + c + '" stroke-opacity="' + o + '" stroke-width="1.4" fill="none"/>' +
                '<path d="M14 -1 L20 -7 M26 -1 L33 -8 M14 1 L20 7 M26 1 L33 8" stroke="' + c + '" stroke-opacity="' + o + '" stroke-width="1" fill="none"/></g>';
        }
        function monstera(c, o) {
            els += '<g transform="translate(' + rnd(0, size) + ' ' + rnd(0, size) + ') rotate(' + rnd(0, 360) + ') scale(' + rnd(0.5, 0.95) + ')" fill="' + c + '" fill-opacity="' + o + '">' +
                '<path d="M24 0 C46 2 52 26 30 50 C6 40 2 12 24 0 Z"/>' +
                '<path d="M24 2 L30 48 M24 14 L12 10 M26 22 L40 18 M24 30 L13 30 M27 38 L38 40" stroke="#ffffff" stroke-opacity="' + (o * 0.5) + '" stroke-width="1.3" fill="none"/></g>';
        }
        function fern(c, o) {
            var p = '<g transform="translate(' + rnd(0, size) + ' ' + rnd(0, size) + ') rotate(' + rnd(0, 360) + ') scale(' + rnd(0.5, 0.9) + ')" stroke="' + c + '" stroke-opacity="' + o + '" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M0 0 Q22 -6 46 -2"/>';
            for (var i = 1; i <= 6; i++) { var t = i * 7; p += '<path d="M' + t + ' ' + (-1 - i * 0.3) + ' q6 -7 12 -3"/><path d="M' + t + ' ' + (1 + i * 0.3) + ' q6 7 12 3"/>'; }
            els += p + '</g>';
        }
        function flower(c, o) {
            var p = '<g transform="translate(' + rnd(0, size) + ' ' + rnd(0, size) + ') scale(' + rnd(0.5, 0.95) + ')" fill-opacity="' + o + '">';
            for (var i = 0; i < 6; i++) p += '<ellipse cx="0" cy="-9" rx="5" ry="9" fill="' + c + '" transform="rotate(' + (i * 60) + ')"/>';
            els += p + '<circle r="4.2" fill="#f6c445" fill-opacity="' + Math.min(1, +o + 0.15) + '"/></g>';
        }
        function grass(c, o) {
            els += '<g transform="translate(' + rnd(0, size) + ' ' + rnd(0, size) + ') scale(' + rnd(0.5, 1) + ')" stroke="' + c + '" stroke-opacity="' + o + '" stroke-width="2" fill="none" stroke-linecap="round">' +
                '<path d="M0 0 Q-3 -14 -9 -22"/><path d="M0 0 Q0 -16 1 -26"/><path d="M0 0 Q4 -13 11 -20"/><path d="M0 0 Q8 -9 15 -12"/></g>';
        }
        var i;
        for (i = 0; i < 7; i++) leaf(GREENS[i % GREENS.length], op(0.06, 0.11));
        for (i = 0; i < 4; i++) monstera(GREENS[(i + 2) % GREENS.length], op(0.05, 0.10));
        for (i = 0; i < 3; i++) fern(GREENS[(i + 1) % GREENS.length], op(0.06, 0.10));
        for (i = 0; i < 5; i++) flower(FLOWERS[i % FLOWERS.length], op(0.10, 0.18));
        for (i = 0; i < 6; i++) grass(GREENS[(i + 3) % GREENS.length], op(0.06, 0.11));
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + els + '</svg>';
        return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
    }
    function paintTile() {
        var boost = root.getAttribute('data-theme') === 'dark' ? 0.6 : 0.55;
        root.style.setProperty('--olpw-leaf', natureTile(340, boost) + ', ' + natureTile(210, boost));
    }

    function sprite(kind, size) {
        var c = pick(GREENS), p = pick(FLOWERS), body = '', i;
        if (kind === 'leaf') body = '<g fill="' + c + '"><path d="M2 17 Q17 2 32 17 Q17 32 2 17 Z" opacity=".92"/><path d="M2 17 L32 17" stroke="rgba(255,255,255,.45)" stroke-width="1.1" fill="none"/><path d="M10 16 L14 11 M17 16 L22 10 M10 18 L14 23 M17 18 L22 24" stroke="rgba(255,255,255,.3)" stroke-width=".9" fill="none"/></g>';
        else if (kind === 'monstera') body = '<g fill="' + c + '"><path d="M17 2 C31 4 34 20 19 32 C5 25 4 8 17 2 Z" opacity=".9"/><path d="M17 3 L19 31 M17 11 L9 8 M18 17 L27 14 M17 23 L9 23" stroke="rgba(255,255,255,.4)" stroke-width="1" fill="none"/></g>';
        else if (kind === 'fern') body = '<g stroke="' + c + '" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".9"><path d="M3 31 Q17 24 31 4"/><path d="M8 28 q5 -6 10 -5 M12 24 q5 -6 10 -5 M16 20 q5 -6 10 -5 M20 16 q5 -6 10 -5 M24 12 q5 -6 9 -5"/><path d="M9 29 q-1 -7 3 -10 M14 25 q-1 -7 3 -10 M19 20 q-1 -7 3 -10"/></g>';
        else if (kind === 'flower') {
            for (i = 0; i < 6; i++) body += '<ellipse cx="17" cy="8" rx="4.4" ry="8" fill="' + p + '" opacity=".9" transform="rotate(' + (i * 60) + ' 17 17)"/>';
            body += '<circle cx="17" cy="17" r="4" fill="#f6c445"/><circle cx="17" cy="17" r="1.8" fill="#c98a12"/>';
        } else if (kind === 'petal') body = '<path d="M17 3 C27 10 27 24 17 31 C7 24 7 10 17 3 Z" fill="' + p + '" opacity=".88"/><path d="M17 5 L17 29" stroke="rgba(255,255,255,.4)" stroke-width="1" fill="none"/>';
        else body = '<g stroke="' + c + '" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".85"><path d="M17 32 Q13 20 7 13 M17 32 Q17 18 18 8 M17 32 Q22 21 28 15 M17 32 Q24 27 30 26"/></g>';
        return '<svg viewBox="0 0 34 34" width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
    }
    function ambient() {
        if (document.querySelector('.olpw-ambient')) return;
        if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var KINDS = ['leaf', 'monstera', 'fern', 'flower', 'petal', 'grass', 'leaf', 'flower'];
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
        }
        document.body.appendChild(bar);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();

    window.addEventListener('storage', function (e) { if (e.key === KEY) { apply(); renderThemeButton(); } });
    window.OLPWSite = { goBack: goBack, parentPage: parentPage, toggleTheme: toggleTheme, applyTheme: apply };
})();
