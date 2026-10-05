/* OLPW planner data layer: Firebase login + Firestore sync, per-account local cache, reminders,
   focus (Pomodoro) timer, chapter progress, study stats and appearance settings.
   Used by planner.html and index.html. Needs firebase-app, firebase-auth and firebase-firestore (compat);
   chapters.js is optional but enables chapter features. */
(function () {
    if (!firebase.apps.length) firebase.initializeApp(window.OLPW_FIREBASE_CONFIG);
    const auth = firebase.auth();
    const db = typeof firebase.firestore === 'function' ? firebase.firestore() : null;

    const SUBJECTS = {
        general:   { name: 'General',       color: '#94A3B8' },
        maths:     { name: 'Maths',         color: '#F59E0B' },
        physics:   { name: 'Physics',       color: '#3B82F6' },
        chemistry: { name: 'Chemistry',     color: '#A855F7' },
        biology:   { name: 'Biology',       color: '#22C55E' },
        cs:        { name: 'Comp. Science', color: '#06B6D4' }
    };
    const SECTIONS = ['todos', 'notes', 'exams', 'timetable', 'sessions', 'chapters'];
    const STATUS_LABELS = {
        local: 'Saved on this device',
        connecting: 'Connecting…',
        syncing: 'Syncing…',
        synced: 'Synced to your account',
        offline: 'Offline · saved on this device',
        denied: 'Cloud sync not set up · saved on this device',
        error: 'Sync error · saved on this device'
    };
    const LEGACY_TODOS = 'olpw-todos';
    const LEGACY_NOTES = 'olpw-calendar-notes';

    let user = null;
    let cacheKey = null;
    let data = emptyData();
    let dirty = false;
    let pendingWrites = 0;
    let gotServer = false;
    let status = 'local';
    let unsubscribe = null;
    let connectTimer = null;
    const changeListeners = [];
    const statusListeners = [];

    function emptyData() { return { todos: [], notes: [], exams: [], timetable: [], sessions: [], chapters: [] }; }
    function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
    function pad(n) { return String(n).padStart(2, '0'); }
    function iso(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
    function parseISO(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
    function at(dateStr, time) {
        const d = parseISO(dateStr);
        const [h, mi] = (time || '09:00').split(':').map(Number);
        d.setHours(h, mi, 0, 0);
        return d;
    }
    function formatDate(s, opts) {
        return parseISO(s).toLocaleDateString(undefined, opts || { weekday: 'short', day: 'numeric', month: 'short' });
    }
    function formatTime(t) {
        if (!t) return '';
        const [h, m] = t.split(':').map(Number);
        return new Date(2000, 0, 1, h, m).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    }
    function formatMinutes(mins) {
        const h = Math.floor(mins / 60), m = Math.round(mins % 60);
        return h ? `${h}h ${m}m` : `${m}m`;
    }
    function daysUntil(s) {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return Math.round((parseISO(s) - t) / 864e5);
    }
    function daysBetween(a, b) { return Math.round((parseISO(b) - parseISO(a)) / 864e5); }
    function subject(key) { return SUBJECTS[key] || SUBJECTS.general; }

    function normalize(raw) {
        const d = emptyData();
        if (raw) SECTIONS.forEach(s => { if (Array.isArray(raw[s])) d[s] = raw[s].filter(x => x && x.id); });
        return d;
    }

    function mergeData(a, b) {
        const out = emptyData();
        SECTIONS.forEach(s => {
            const map = new Map();
            [...a[s], ...b[s]].forEach(item => {
                const cur = map.get(item.id);
                if (!cur || (item.updated || 0) >= (cur.updated || 0)) map.set(item.id, item);
            });
            out[s] = [...map.values()];
        });
        return out;
    }

    function readCache() {
        try { return JSON.parse(localStorage.getItem(cacheKey)); }
        catch { return null; }
    }
    function writeCache() {
        if (cacheKey) localStorage.setItem(cacheKey, JSON.stringify({ data, dirty }));
    }

    function migrateLegacy() {
        let changed = false;
        try {
            const todos = JSON.parse(localStorage.getItem(LEGACY_TODOS) || '[]');
            todos.forEach(t => {
                if (!t || !t.id || data.todos.some(x => x.id === t.id)) return;
                data.todos.push({ subject: 'general', time: '', remind: '', ...t, due: t.due || '', updated: Date.now() });
                changed = true;
            });
            const notes = JSON.parse(localStorage.getItem(LEGACY_NOTES) || '{}');
            Object.entries(notes).forEach(([date, list]) => (list || []).forEach(n => {
                if (!n || !n.id || data.notes.some(x => x.id === n.id)) return;
                data.notes.push({ id: n.id, date, text: n.text, subject: 'general', created: n.created || Date.now(), updated: Date.now() });
                changed = true;
            }));
        } catch { /* ignore unreadable legacy data */ }
        localStorage.removeItem(LEGACY_TODOS);
        localStorage.removeItem(LEGACY_NOTES);
        return changed;
    }

    function setStatus(s) {
        status = s;
        statusListeners.forEach(fn => fn(s, STATUS_LABELS[s]));
    }
    function emit() { changeListeners.forEach(fn => fn(data)); }
    function errorStatus(err) {
        console.warn('OLPW sync:', err);
        return err && (err.code === 'permission-denied' || err.code === 'not-found' || err.code === 'failed-precondition') ? 'denied' : 'error';
    }

    function start(u) {
        if (user && u && user.uid === u.uid) return;
        stop();
        user = u;
        cacheKey = 'olpw-planner-' + u.uid;
        const cached = readCache();
        data = normalize(cached && cached.data);
        dirty = !!(cached && cached.dirty);
        if (migrateLegacy()) dirty = true;
        writeCache();
        syncChapters();
        emit();
        connect();
        focusTick();
    }

    function connect() {
        if (!db) { setStatus('local'); return; }
        setStatus('connecting');
        const ref = db.collection('planner').doc(user.uid);
        connectTimer = setTimeout(() => { if (!gotServer && status === 'connecting') setStatus('offline'); }, 12000);
        unsubscribe = ref.onSnapshot({ includeMetadataChanges: true }, snap => {
            if (snap.metadata.fromCache) return;
            const before = new Set(data.chapters.map(c => c.id));
            if (!gotServer) {
                gotServer = true;
                clearTimeout(connectTimer);
                const remote = snap.exists ? normalize(snap.data()) : emptyData();
                if (dirty || !snap.exists) {
                    data = mergeData(remote, data);
                    push(SECTIONS);
                } else {
                    data = remote;
                }
            } else if (!snap.metadata.hasPendingWrites) {
                data = normalize(snap.data());
            } else {
                return;
            }
            const after = new Set(data.chapters.map(c => c.id));
            before.forEach(id => { if (!after.has(id)) localStorage.removeItem(id); });
            writeCache();
            syncChapters();
            if (!pendingWrites) setStatus('synced');
            emit();
        }, err => {
            clearTimeout(connectTimer);
            setStatus(errorStatus(err));
        });
    }

    function stop() {
        if (unsubscribe) unsubscribe();
        unsubscribe = null;
        clearTimeout(connectTimer);
        user = null;
        cacheKey = null;
        data = emptyData();
        dirty = false;
        pendingWrites = 0;
        gotServer = false;
        setStatus('local');
        emit();
    }

    function push(sections) {
        if (!db || !user || status === 'denied') return;
        const uid = user.uid;
        const payload = JSON.parse(JSON.stringify(sections.reduce((p, s) => { p[s] = data[s]; return p; }, {})));
        payload.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        pendingWrites++;
        if (gotServer) setStatus('syncing');
        db.collection('planner').doc(uid).set(payload, { merge: true })
            .then(() => {
                if (!user || user.uid !== uid) return;
                pendingWrites = Math.max(0, pendingWrites - 1);
                if (!pendingWrites) { dirty = false; writeCache(); setStatus('synced'); }
            })
            .catch(err => {
                pendingWrites = Math.max(0, pendingWrites - 1);
                setStatus(errorStatus(err));
            });
    }

    function update(section, mutator) {
        if (!user) return;
        const next = mutator(data[section].slice());
        data = { ...data, [section]: next };
        dirty = true;
        writeCache();
        emit();
        push([section]);
    }

    function requireAuth(onUser) {
        auth.onAuthStateChanged(u => {
            if (!u) {
                stop();
                const page = location.pathname.split('/').pop() || 'planner.html';
                location.replace('index.html?next=' + encodeURIComponent(page + location.search + location.hash));
                return;
            }
            start(u);
            onUser(u);
        });
    }

    /* ---------- Chapters (flags shared with the chapter pages' "Mark complete" buttons) ---------- */
    function chapterList(subjectKey) { return (window.OLPW_CHAPTERS || {})[subjectKey] || []; }
    function allChapters() { return Object.values(window.OLPW_CHAPTERS || {}).flat(); }
    function findChapter(ref) {
        if (!ref) return null;
        const [s, n] = ref.split(':');
        const ch = chapterList(s).find(c => c.n === Number(n));
        return ch ? { ...ch, subject: s } : null;
    }
    function isChapterDone(key) { return data.chapters.some(c => c.id === key); }
    function setChapterDone(key, done) {
        if (done) localStorage.setItem(key, 'true');
        else localStorage.removeItem(key);
        const now = Date.now();
        update('chapters', list => done
            ? (list.some(c => c.id === key) ? list : [...list, { id: key, at: now, updated: now }])
            : list.filter(c => c.id !== key));
    }
    function syncChapters() {
        if (!user) return;
        const have = new Set(data.chapters.map(c => c.id));
        const now = Date.now();
        const add = allChapters()
            .filter(c => localStorage.getItem(c.key) === 'true' && !have.has(c.key))
            .map(c => ({ id: c.key, at: now, updated: now }));
        data.chapters.forEach(c => localStorage.setItem(c.id, 'true'));
        if (add.length) update('chapters', list => [...list, ...add]);
    }
    function chapterProgress(subjectKey) {
        const list = chapterList(subjectKey);
        const done = list.filter(c => isChapterDone(c.key)).length;
        return { done, total: list.length };
    }

    /* ---------- Stats ---------- */
    function activity() {
        const map = {};
        const add = (date, k, v) => { (map[date] = map[date] || { tasks: 0, minutes: 0, sessions: 0 })[k] += v; };
        data.todos.forEach(t => {
            const ts = t.done && (t.doneAt || t.updated);
            if (ts) add(iso(new Date(ts)), 'tasks', 1);
        });
        data.sessions.forEach(s => { add(s.date, 'minutes', s.minutes || 0); add(s.date, 'sessions', 1); });
        return map;
    }
    function streaks(map) {
        map = map || activity();
        const active = k => map[k] && (map[k].tasks || map[k].sessions);
        let best = 0, run = 0, prev = null;
        Object.keys(map).filter(active).sort().forEach(d => {
            run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1;
            best = Math.max(best, run);
            prev = d;
        });
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        const activeToday = !!active(iso(d));
        if (!activeToday) d.setDate(d.getDate() - 1);
        let current = 0;
        while (active(iso(d))) { current++; d.setDate(d.getDate() - 1); }
        return { current, best: Math.max(best, current), activeToday };
    }

    window.addEventListener('storage', e => {
        if (cacheKey && e.key === cacheKey) {
            const cached = readCache();
            if (cached) { data = normalize(cached.data); emit(); }
        } else if (e.key === FOCUS_KEY) {
            focus = loadFocus();
            emitFocus();
        } else if (e.key === THEME_KEY) {
            applyTheme();
        }
    });

    /* ---------- Toasts, sound, notifications ---------- */
    let toastBox = null;
    function toast(title, body) {
        if (!toastBox) {
            toastBox = document.createElement('div');
            toastBox.className = 'olpw-toasts';
            document.body.appendChild(toastBox);
        }
        const t = document.createElement('div');
        t.className = 'olpw-toast';
        const b = document.createElement('b');
        b.textContent = title;
        t.append(b, document.createTextNode(body || ''));
        t.addEventListener('click', () => t.remove());
        toastBox.appendChild(t);
        setTimeout(() => t.remove(), 9000);
    }

    let audioCtx = null;
    function chime() {
        try {
            audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            const now = audioCtx.currentTime;
            [660, 880, 990].forEach((freq, i) => {
                const o = audioCtx.createOscillator(), g = audioCtx.createGain();
                o.frequency.value = freq;
                o.connect(g);
                g.connect(audioCtx.destination);
                const t0 = now + i * 0.22;
                g.gain.setValueAtTime(0.0001, t0);
                g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02);
                g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
                o.start(t0);
                o.stop(t0 + 0.55);
            });
        } catch { /* audio unavailable */ }
    }

    function systemNotify(title, body, tag) {
        if ('Notification' in window && Notification.permission === 'granted') {
            try { new Notification(title, { body, icon: 'weblogo.png', tag }); } catch { /* toast already shown */ }
        }
    }

    /* ---------- Reminders ---------- */
    const REMINDERS_KEY = 'olpw-reminders';
    const NOTIFIED_KEY = 'olpw-notified';
    const LATE_LIMIT = 6 * 3600e3;
    let reminderTimer = null;

    function remindersEnabled() { return localStorage.getItem(REMINDERS_KEY) === 'on'; }
    function notificationMode() {
        if (!remindersEnabled()) return 'off';
        return ('Notification' in window && Notification.permission === 'granted') ? 'system' : 'page';
    }
    async function enableReminders() {
        localStorage.setItem(REMINDERS_KEY, 'on');
        if ('Notification' in window && Notification.permission === 'default') {
            try { await Notification.requestPermission(); } catch { /* unsupported here */ }
        }
        checkReminders();
        return notificationMode();
    }
    function disableReminders() { localStorage.setItem(REMINDERS_KEY, 'off'); }

    function upcomingReminders() {
        const events = [];
        data.todos.forEach(t => {
            if (t.done || !t.due || t.remind === '' || t.remind == null) return;
            const dueAt = at(t.due, t.time);
            const mins = Number(t.remind);
            const when = Date.now() > dueAt ? 'Task overdue'
                : mins === 0 ? 'Task due now'
                : daysUntil(t.due) === 1 ? 'Task due tomorrow'
                : mins === 60 ? 'Task due in 1 hour' : mins === 15 ? 'Task due in 15 minutes' : 'Task due today';
            events.push({ key: `t:${t.id}:${dueAt.getTime() - mins * 60000}`, fireAt: dueAt - mins * 60000,
                until: Math.max(dueAt.getTime(), dueAt - mins * 60000 + LATE_LIMIT),
                title: when, body: `${t.text} · ${subject(t.subject).name}` + (t.time ? ` · ${formatTime(t.time)}` : '') });
        });
        data.exams.forEach(e => {
            const examAt = at(e.date, e.time);
            [1440, 60].forEach(mins => {
                const when = mins === 60 ? 'in 1 hour' : daysUntil(e.date) === 0 ? 'today' : 'tomorrow';
                events.push({ key: `e:${e.id}:${mins}:${examAt.getTime()}`, fireAt: examAt - mins * 60000,
                    until: examAt.getTime() - (mins === 1440 ? 3600e3 : 0),
                    title: `${subject(e.subject).name} exam ${when}`, body: e.text + (e.time ? ` at ${formatTime(e.time)}` : '') });
            });
        });
        const today = iso(new Date());
        const weekday = new Date().getDay();
        data.timetable.forEach(c => {
            if (Number(c.day) !== weekday || !c.start) return;
            events.push({ key: `c:${c.id}:${today}`, fireAt: at(today, c.start) - 10 * 60000,
                until: at(today, c.start).getTime(),
                title: 'Class in 10 minutes', body: `${c.text} · ${subject(c.subject).name} · ${formatTime(c.start)}` });
        });
        return events;
    }

    function checkReminders() {
        if (!user || !remindersEnabled()) return;
        let notified;
        try { notified = JSON.parse(localStorage.getItem(NOTIFIED_KEY)) || {}; } catch { notified = {}; }
        const now = Date.now();
        Object.keys(notified).forEach(k => { if (now - notified[k] > 7 * 864e5) delete notified[k]; });
        upcomingReminders().forEach(ev => {
            if (notified[ev.key] || now < ev.fireAt || now > ev.until) return;
            notified[ev.key] = now;
            toast(ev.title, ev.body);
            if (notificationMode() === 'system') systemNotify(ev.title, ev.body, ev.key);
        });
        localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notified));
    }

    function startReminders() {
        if (reminderTimer) return;
        checkReminders();
        reminderTimer = setInterval(checkReminders, 30000);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) checkReminders(); });
    }

    /* ---------- Focus timer (Pomodoro); state is per device so it survives page changes ---------- */
    const FOCUS_KEY = 'olpw-focus';
    const FOCUS_DEFAULTS = { focus: 25, short: 5, long: 15, longEvery: 4, autoStart: false, sound: true };
    const FOCUS_LABELS = { focus: 'Focus', short: 'Short break', long: 'Long break' };
    const focusListeners = [];
    let focus = loadFocus();

    function loadFocus() {
        const base = { mode: 'focus', running: false, endAt: 0, remaining: null, periodMinutes: null, periodId: '', subject: 'general', taskId: '', cycle: 0 };
        try {
            const f = JSON.parse(localStorage.getItem(FOCUS_KEY));
            if (f) return { ...base, ...f, settings: { ...FOCUS_DEFAULTS, ...(f.settings || {}) } };
        } catch { /* fall through */ }
        return { ...base, settings: { ...FOCUS_DEFAULTS } };
    }
    function saveFocus() {
        localStorage.setItem(FOCUS_KEY, JSON.stringify(focus));
        emitFocus();
    }
    function emitFocus() { focusListeners.forEach(fn => fn(focusView())); }
    function modeMinutes(mode) { return Number(focus.settings[mode]) || FOCUS_DEFAULTS[mode]; }
    function focusRemaining() {
        if (focus.running) return Math.max(0, focus.endAt - Date.now());
        return focus.remaining != null ? focus.remaining : modeMinutes(focus.mode) * 60000;
    }
    function focusView() {
        const total = (focus.periodMinutes || modeMinutes(focus.mode)) * 60000;
        return { ...focus, label: FOCUS_LABELS[focus.mode], remainingMs: focusRemaining(), totalMs: total };
    }
    function focusStart() {
        if (focus.running) return;
        if (focus.remaining == null) {
            focus.periodMinutes = modeMinutes(focus.mode);
            focus.periodId = newId();
        }
        focus.endAt = Date.now() + focusRemaining();
        focus.running = true;
        focus.remaining = null;
        saveFocus();
    }
    function focusPause() {
        if (!focus.running) return;
        focus.remaining = focusRemaining();
        focus.running = false;
        saveFocus();
    }
    function focusReset() {
        focus.running = false;
        focus.remaining = null;
        focus.periodMinutes = null;
        saveFocus();
    }
    function focusSetMode(mode) {
        focus.mode = mode;
        focusReset();
    }
    function focusSet(fields) {
        Object.assign(focus, fields);
        saveFocus();
    }
    function focusSettings(fields) {
        focus.settings = { ...focus.settings, ...fields };
        saveFocus();
    }
    function finishPeriod(completed) {
        const fresh = loadFocus();
        if (completed && (!fresh.running || fresh.periodId !== focus.periodId)) { focus = fresh; emitFocus(); return; }
        const wasFocus = focus.mode === 'focus';
        if (wasFocus && completed && user) {
            const endedAt = focus.endAt || Date.now();
            const minutes = focus.periodMinutes || modeMinutes('focus');
            const entry = { id: newId(), date: iso(new Date(endedAt)), at: endedAt, minutes, subject: focus.subject || 'general', taskId: focus.taskId || '', created: Date.now(), updated: Date.now() };
            update('sessions', list => [...list, entry]);
        }
        if (wasFocus) {
            if (completed) focus.cycle = (focus.cycle || 0) + 1;
            focus.mode = completed && focus.cycle % (Number(focus.settings.longEvery) || 4) === 0 ? 'long' : 'short';
        } else {
            focus.mode = 'focus';
        }
        focus.running = false;
        focus.remaining = null;
        focus.periodMinutes = null;
        saveFocus();
        if (completed) {
            const title = wasFocus ? 'Focus session complete' : 'Break is over';
            const body = wasFocus ? `Nice work! Time for a ${FOCUS_LABELS[focus.mode].toLowerCase()}.` : 'Ready for the next focus session?';
            toast(title, body);
            systemNotify(title, body, 'olpw-focus');
            if (focus.settings.sound) chime();
            if (focus.settings.autoStart) focusStart();
        }
    }
    function focusSkip() { finishPeriod(false); }
    function focusTick() {
        if (user && focus.running && Date.now() >= focus.endAt) finishPeriod(true);
        else if (focus.running) emitFocus();
    }
    setInterval(focusTick, 1000);

    /* ---------- Appearance ---------- */
    const THEME_KEY = 'olpw-theme';
    const DEFAULT_ACCENT = '#16A34A';
    const ACCENTS = [['Green', DEFAULT_ACCENT], ['Blue', '#3B82F6'], ['Purple', '#8B5CF6'], ['Orange', '#EA580C'], ['Pink', '#EC4899'], ['Amber', '#F59E0B']];
    function getTheme() {
        try { return { mode: 'light', accent: DEFAULT_ACCENT, ...JSON.parse(localStorage.getItem(THEME_KEY)) }; }
        catch { return { mode: 'light', accent: DEFAULT_ACCENT }; }
    }
    function applyTheme() {
        const t = getTheme();
        const mode = t.mode === 'auto' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : t.mode;
        document.documentElement.dataset.theme = mode;
        if (t.accent.toLowerCase() === DEFAULT_ACCENT.toLowerCase()) document.documentElement.style.removeProperty('--accent');
        else document.documentElement.style.setProperty('--accent', t.accent);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = mode === 'light' ? '#F0FDF4' : '#0B1210';
    }
    function setTheme(fields) {
        localStorage.setItem(THEME_KEY, JSON.stringify({ ...getTheme(), ...fields }));
        applyTheme();
    }
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', applyTheme);

    function mountThemePicker(button) {
        const pop = document.createElement('div');
        pop.className = 'olpw-theme-pop hidden';
        pop.innerHTML = '<div class="otp-title">Appearance</div><div class="otp-modes"></div><div class="otp-title">Accent colour</div><div class="otp-swatches"></div>';
        const modes = pop.querySelector('.otp-modes');
        const swatches = pop.querySelector('.otp-swatches');
        function render() {
            const t = getTheme();
            modes.innerHTML = '';
            [['dark', 'Dark'], ['light', 'Light'], ['auto', 'Auto']].forEach(([value, label]) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.textContent = label;
                b.className = t.mode === value ? 'active' : '';
                b.addEventListener('click', () => { setTheme({ mode: value }); render(); });
                modes.appendChild(b);
            });
            swatches.innerHTML = '';
            ACCENTS.forEach(([name, color]) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.title = name;
                b.style.background = color;
                b.className = t.accent.toLowerCase() === color.toLowerCase() ? 'active' : '';
                b.addEventListener('click', () => { setTheme({ accent: color }); render(); });
                swatches.appendChild(b);
            });
        }
        document.body.appendChild(pop);
        pop.addEventListener('click', e => e.stopPropagation());
        button.addEventListener('click', e => {
            e.stopPropagation();
            render();
            pop.classList.toggle('hidden');
            const r = button.getBoundingClientRect();
            pop.style.top = `${r.bottom + 8}px`;
            pop.style.right = `${Math.max(8, window.innerWidth - r.right)}px`;
        });
        document.addEventListener('click', e => { if (!pop.contains(e.target)) pop.classList.add('hidden'); });
    }

    const sharedStyle = document.createElement('style');
    sharedStyle.textContent = `
        .olpw-toasts { position: fixed; right: 20px; bottom: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; max-width: 340px; }
        .olpw-toast { background: var(--surface, #151B2B); border: 1px solid var(--border, #2D3650); border-left: 4px solid var(--accent, #FF4500); border-radius: 10px; padding: 12px 16px; color: var(--text-main, #CBD5E1); font: 14px/1.45 Inter, sans-serif; box-shadow: 0 12px 30px rgba(0,0,0,.35); animation: olpwToastIn .25s ease; cursor: pointer; }
        .olpw-toast b { display: block; color: var(--text-strong, #fff); margin-bottom: 2px; font-weight: 600; }
        @keyframes olpwToastIn { from { opacity: 0; transform: translateY(10px); } }
        @media (max-width: 760px) { .olpw-toasts { left: 12px; right: 12px; bottom: calc(84px + env(safe-area-inset-bottom)); max-width: none; } }
        .olpw-theme-pop { position: fixed; z-index: 500; width: 240px; background: var(--surface, #151B2B); border: 1px solid var(--border, #2D3650); border-radius: 14px; padding: 14px; box-shadow: 0 20px 50px rgba(0,0,0,.35); font-family: Inter, sans-serif; }
        .olpw-theme-pop.hidden { display: none; }
        .otp-title { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted, #94A3B8); margin-bottom: 8px; }
        .otp-modes { display: flex; background: var(--field, #0B0F19); border: 1px solid var(--border, #2D3650); border-radius: 10px; padding: 3px; margin-bottom: 14px; }
        .otp-modes button { flex: 1; background: none; border: none; color: var(--text-muted, #94A3B8); padding: 7px 0; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; }
        .otp-modes button.active { background: var(--surface-light, #1E2538); color: var(--text-strong, #fff); }
        .otp-swatches { display: flex; gap: 8px; flex-wrap: wrap; }
        .otp-swatches button { width: 28px; height: 28px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; box-shadow: inset 0 0 0 2px rgba(255,255,255,.15); }
        .otp-swatches button.active { border-color: var(--text-strong, #fff); }`;
    document.head.appendChild(sharedStyle);
    applyTheme();

    window.OLPWPlanner = {
        SUBJECTS, STATUS_LABELS, FOCUS_LABELS, auth,
        get data() { return data; },
        get status() { return status; },
        get user() { return user; },
        start, stop, update, requireAuth,
        onChange(fn) { changeListeners.push(fn); },
        onStatus(fn) { statusListeners.push(fn); fn(status, STATUS_LABELS[status]); },
        newId, iso, parseISO, at, formatDate, formatTime, formatMinutes, daysUntil, daysBetween, subject,
        toast, chime, enableReminders, disableReminders, notificationMode, startReminders, checkReminders,
        chapterList, findChapter, isChapterDone, setChapterDone, chapterProgress,
        activity, streaks,
        focus: {
            get state() { return focusView(); },
            start: focusStart, pause: focusPause, reset: focusReset, skip: focusSkip,
            setMode: focusSetMode, set: focusSet, settings: focusSettings,
            onChange(fn) { focusListeners.push(fn); fn(focusView()); }
        },
        theme: { get: getTheme, set: setTheme, apply: applyTheme, mountPicker: mountThemePicker, ACCENTS }
    };
})();
