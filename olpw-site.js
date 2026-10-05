/* OLPW shared page layer: clean green theme (light by default), logo + Home, Back and theme switch on every page.
   Load it synchronously in <head> (before any page script that reads the theme) so the page never flashes dark. */
(function () {
    var KEY = 'olpw-theme';
    var MIGRATED = 'olpw-theme-clean-v1';
    var CLEAN_ACCENT = '#006A4E';
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
            if (!t.accent || /^#(ff4500|ea580c|f97316)$/i.test(t.accent)) t.accent = CLEAN_ACCENT;
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
