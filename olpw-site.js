/* OLPW shared page layer: warm light theme by default, logo + Home, Back and theme switch on every page.
   Load it synchronously in <head> (before any page script that reads the theme) so the page never flashes dark. */
(function () {
    var KEY = 'olpw-theme';
    var MIGRATED = 'olpw-theme-warm-v1';
    var WARM_ACCENT = '#EA580C';
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
            t.mode = 'light';
            if (!t.accent || /^#ff4500$/i.test(t.accent)) t.accent = WARM_ACCENT;
            saveTheme(t);
            localStorage.setItem(MIGRATED, '1');
        }
    } catch (e) { /* storage blocked: fall back to light */ }
    apply();

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
