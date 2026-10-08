(function () {
            try {
                var t = JSON.parse(localStorage.getItem('olpw-theme')) || {};
                var m = t.mode || 'light';
                if (m === 'auto') m = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                document.documentElement.dataset.theme = m;
                if (t.accent) document.documentElement.style.setProperty('--accent', t.accent);
            } catch (e) { /* default theme */ }
        })();

const P = OLPWPlanner;
        const F = P.focus;
        const $ = id => document.getElementById(id);
        const TABS = ['today', 'calendar', 'tasks', 'focus', 'progress'];
        const STUDY_SUBJECTS = ['maths', 'physics', 'chemistry', 'biology', 'cs'];
        const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
        const REMIND_OPTIONS = [['', 'No reminder'], ['0', 'Remind at due time'], ['15', '15 min before'], ['60', '1 hour before'], ['1440', '1 day before']];
        const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const TYPES = {
            task:  { name: 'task',  section: 'todos',     fields: ['text', 'subject', 'chapter', 'date', 'time', 'priority', 'remind'] },
            exam:  { name: 'exam',  section: 'exams',     fields: ['text', 'subject', 'date', 'time'] },
            note:  { name: 'note',  section: 'notes',     fields: ['note', 'subject', 'date'] },
            class: { name: 'class', section: 'timetable', fields: ['text', 'subject', 'day', 'start', 'end'] }
        };

        const state = { tab: 'today', view: 'month', anchor: new Date(), selected: P.iso(new Date()), subject: 'all', taskFilter: 'all' };
        const openChapters = new Set();
        let editing = null;

        /* ---------- Helpers ---------- */
        function el(tag, cls, text) {
            const e = document.createElement(tag);
            if (cls) e.className = cls;
            if (text != null) e.textContent = text;
            return e;
        }
        function colorOf(key) { return P.subject(key).color; }
        function chip(key) {
            const c = el('span', 'chip', P.subject(key).name);
            c.style.setProperty('--c', colorOf(key));
            return c;
        }
        function iconBtn(symbol, title, onClick, extra) {
            const b = el('button', 'icon-btn' + (extra ? ' ' + extra : ''), symbol);
            b.type = 'button';
            b.title = title;
            b.addEventListener('click', e => { e.stopPropagation(); onClick(); });
            return b;
        }
        function chapterAnchor(ref) {
            const ch = P.findChapter(ref);
            if (!ch) return null;
            const a = el('a', 'chapter-link', `Ch ${ch.n}: ${ch.title} ↗`);
            a.href = ch.href;
            if (/^https?:/.test(ch.href)) { a.target = '_blank'; a.rel = 'noopener'; }
            a.addEventListener('click', e => e.stopPropagation());
            return a;
        }
        function matches(item) { return state.subject === 'all' || (item.subject || 'general') === state.subject; }
        function todayISO() { return P.iso(new Date()); }
        function timeKey(x) { return x.start || x.time || '99:99'; }
        function byTime(a, b) { return timeKey(a).localeCompare(timeKey(b)); }
        function relativeDay(key) {
            const d = P.daysUntil(key);
            if (d === 0) return 'Today';
            if (d === 1) return 'Tomorrow';
            if (d === -1) return 'Yesterday';
            return d > 0 ? `In ${d} days` : `${-d} days ago`;
        }
        function mmss(ms) {
            const s = Math.ceil(ms / 1000);
            return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
        }
        function lastDays(n) {
            const out = [];
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            for (let i = n - 1; i >= 0; i--) out.push(P.iso(new Date(d.getFullYear(), d.getMonth(), d.getDate() - i)));
            return out;
        }
        function fillList(id, items, emptyText, build) {
            const list = $(id);
            list.innerHTML = '';
            if (!items.length && emptyText) list.appendChild(el('li', 'empty-small', emptyText));
            items.forEach(x => list.appendChild(build(x)));
        }

        function upcomingExams(filtered) {
            const now = new Date();
            return P.data.exams
                .filter(e => P.at(e.date, e.time || '23:59') >= now && (!filtered || matches(e)))
                .sort((a, b) => P.at(a.date, a.time || '00:00') - P.at(b.date, b.time || '00:00'));
        }
        function dayItems(key) {
            const weekday = P.parseISO(key).getDay();
            return {
                exams: P.data.exams.filter(e => e.date === key && matches(e)).sort(byTime),
                classes: P.data.timetable.filter(c => Number(c.day) === weekday && matches(c)).sort(byTime),
                tasks: P.data.todos.filter(t => t.due === key && matches(t)).sort(byTime),
                notes: P.data.notes.filter(n => n.date === key && matches(n)).sort((a, b) => a.created - b.created)
            };
        }

        /* ---------- Cards ---------- */
        function itemCard(type, item, textValue, metaParts, withCheckbox) {
            const li = el('li', `item-card is-${type}${item.done ? ' done' : ''}`);
            li.style.setProperty('--c', colorOf(item.subject));
            if (withCheckbox) {
                const check = el('input');
                check.type = 'checkbox';
                check.checked = !!item.done;
                check.title = item.done ? 'Mark as not done' : 'Mark as done';
                check.addEventListener('change', () => toggleTask(item.id, check.checked));
                li.appendChild(check);
            }
            const main = el('div', 'item-main');
            const meta = el('div', 'item-meta');
            meta.appendChild(chip(item.subject));
            metaParts.filter(Boolean).forEach(p => meta.appendChild(typeof p === 'string' ? el('span', null, p) : p));
            main.append(el('div', 'item-text', textValue), meta);
            const actions = el('div', 'item-actions');
            if (type === 'task' && !item.done) actions.appendChild(iconBtn('▶', 'Focus on this task', () => focusOnTask(item), 'play'));
            actions.append(iconBtn('✎', 'Edit', () => openEditor(type, item)),
                           iconBtn('✕', 'Delete', () => removeItem(TYPES[type].section, item.id,
                               type === 'class' ? `Remove "${item.text}" from every ${DAY_NAMES[item.day]}?` : null), 'delete'));
            li.append(main, actions);
            return li;
        }
        function taskCard(t, extraMeta) {
            return itemCard('task', t, t.text, [t.time && P.formatTime(t.time), extraMeta, chapterAnchor(t.chapter)], true);
        }

        /* ---------- Header ---------- */
        function renderStats() {
            const t = todayISO();
            const todos = P.data.todos;
            $('heroDate').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            $('statActive').textContent = todos.filter(x => !x.done).length;
            $('statToday').textContent = todos.filter(x => !x.done && x.due === t).length;
            $('statOverdue').textContent = todos.filter(x => !x.done && x.due && x.due < t).length;
            const next = upcomingExams(false)[0];
            if (next) {
                const d = P.daysUntil(next.date);
                $('statExam').textContent = d === 0 ? 'Today' : `${d}d`;
                $('statExamLabel').textContent = `${P.subject(next.subject).name} exam`;
            } else {
                $('statExam').textContent = '—';
                $('statExamLabel').textContent = 'Next exam';
            }
            const s = P.streaks();
            $('streakBadge').classList.toggle('cold', !s.current);
            $('streakText').textContent = s.current ? `${s.current}-day streak` : 'No streak yet';
            $('streakBadge').title = s.current && !s.activeToday ? 'Finish a task or a focus session today to keep your streak' : '';
        }

        function renderFilter() {
            const bar = $('subjectFilter');
            bar.querySelectorAll('.filter-chip').forEach(b => b.remove());
            [['all', 'All subjects', 'var(--accent)'], ...Object.entries(P.SUBJECTS).map(([k, s]) => [k, s.name, s.color])].forEach(([key, name, color]) => {
                const b = el('button', 'filter-chip' + (state.subject === key ? ' active' : ''), name);
                b.type = 'button';
                b.style.setProperty('--c', color);
                b.addEventListener('click', () => {
                    state.subject = key;
                    if (key !== 'all') openChapters.add(key);
                    $('noteSubject').value = $('taskSubject').value = key === 'all' ? 'general' : key;
                    renderAll();
                });
                bar.appendChild(b);
            });
        }

        /* ---------- Today ---------- */
        function countdown(exam) {
            const d = P.daysUntil(exam.date);
            if (d > 1) return { big: d, small: 'days left' };
            if (d === 1) return { big: 1, small: 'day left' };
            if (exam.time) {
                const ms = P.at(exam.date, exam.time) - Date.now();
                if (ms > 0) {
                    const h = Math.floor(ms / 3600e3), m = Math.floor(ms % 3600e3 / 60000);
                    return { big: h ? `${h}h` : `${m}m`, small: h ? `${m}m to go` : 'to go' };
                }
                return { big: 'Now', small: 'good luck' };
            }
            return { big: 'Today', small: 'good luck' };
        }

        function renderExams() {
            const list = $('examList');
            list.innerHTML = '';
            const exams = upcomingExams(true);
            if (!exams.length) {
                list.appendChild(el('div', 'empty', state.subject === 'all'
                    ? 'No upcoming exams. Add one to start a countdown.'
                    : `No upcoming ${P.subject(state.subject).name} exams.`));
                return;
            }
            exams.forEach(exam => {
                const card = el('div', 'exam-card' + (P.daysUntil(exam.date) <= 3 ? ' soon' : ''));
                card.style.setProperty('--c', colorOf(exam.subject));
                const cd = countdown(exam);
                const count = el('div', 'exam-count');
                count.append(el('span', 'big', String(cd.big)), el('span', 'small', cd.small));
                const info = el('div', 'exam-info');
                const meta = el('div', 'exam-meta');
                meta.append(chip(exam.subject), el('span', null, P.formatDate(exam.date) + (exam.time ? ' · ' + P.formatTime(exam.time) : '')));
                info.append(el('div', 'exam-title', exam.text), meta);
                const actions = el('div', 'exam-actions');
                actions.append(iconBtn('✎', 'Edit exam', () => openEditor('exam', exam)),
                               iconBtn('✕', 'Delete exam', () => removeItem('exams', exam.id, 'Delete this exam?'), 'delete'));
                card.append(count, info, actions);
                card.addEventListener('click', () => { selectDate(exam.date); setTab('calendar'); });
                list.appendChild(card);
            });
        }

        function renderAgenda() {
            const t = todayISO();
            const { exams, classes, tasks, notes } = dayItems(t);
            const overdue = P.data.todos.filter(x => !x.done && x.due && x.due < t && matches(x)).sort((a, b) => a.due.localeCompare(b.due));
            $('agendaSub').textContent = `${DAY_NAMES[new Date().getDay()]} · ${classes.length} class${classes.length === 1 ? '' : 'es'}, ${tasks.filter(x => !x.done).length} task${tasks.filter(x => !x.done).length === 1 ? '' : 's'} left`;
            $('agOverdueWrap').classList.toggle('hidden', !overdue.length);
            fillList('agOverdue', overdue, null, x => taskCard(x, el('span', 'overdue', `Due ${P.formatDate(x.due)}`)));
            const schedule = [
                ...classes.map(c => ({ type: 'class', item: c, sort: c.start })),
                ...exams.map(e => ({ type: 'exam', item: e, sort: e.time || '00:00' }))
            ].sort((a, b) => a.sort.localeCompare(b.sort));
            fillList('agSchedule', schedule, 'Nothing scheduled. Add classes in Calendar → Week timetable.', s => s.type === 'class'
                ? itemCard('class', s.item, s.item.text, [`${P.formatTime(s.item.start)}${s.item.end ? '–' + P.formatTime(s.item.end) : ''}`])
                : itemCard('exam', s.item, '★ ' + s.item.text, [s.item.time && P.formatTime(s.item.time)]));
            fillList('agTasks', tasks, 'No tasks due today.', x => taskCard(x, `${x.priority} priority`));
            $('agNotesWrap').classList.toggle('hidden', !notes.length);
            fillList('agNotes', notes, null, n => itemCard('note', n, n.text, []));
        }

        function renderStreakCard() {
            const map = P.activity();
            const s = P.streaks(map);
            const week = lastDays(7);
            $('skCurrent').textContent = s.current;
            $('skBest').textContent = s.best;
            $('skWeek').textContent = P.formatMinutes(week.reduce((sum, d) => sum + ((map[d] && map[d].minutes) || 0), 0));
            const dots = $('weekDots');
            dots.innerHTML = '';
            week.forEach(d => {
                const a = map[d];
                const on = a && (a.tasks || a.sessions);
                const w = el('div', 'week-dot' + (on ? ' on' : '') + (d === todayISO() ? ' today' : ''));
                w.title = a ? `${a.tasks} task${a.tasks === 1 ? '' : 's'}, ${a.minutes} min focus` : 'No activity';
                w.append(el('i', null, on ? '✓' : ''), el('span', null, P.parseISO(d).toLocaleDateString(undefined, { weekday: 'narrow' })));
                dots.appendChild(w);
            });
        }

        function renderChapterMini() {
            const box = $('chapterMini');
            box.innerHTML = '';
            STUDY_SUBJECTS.filter(s => state.subject === 'all' || state.subject === s).forEach(s => {
                const { done, total } = P.chapterProgress(s);
                const row = el('div', 'progress-row');
                row.style.setProperty('--c', colorOf(s));
                const top = el('div', 'top');
                top.append(el('span', null, P.subject(s).name), el('b', null, `${done}/${total}`));
                const bar = el('div', 'bar');
                const fill = el('i');
                fill.style.width = total ? `${done / total * 100}%` : '0';
                bar.appendChild(fill);
                row.append(top, bar);
                box.appendChild(row);
            });
            if (!box.children.length) box.appendChild(el('div', 'empty-small', 'No chapters for this subject.'));
        }

        /* ---------- Calendar ---------- */
        function renderMonth() {
            const year = state.anchor.getFullYear(), month = state.anchor.getMonth();
            const first = new Date(year, month, 1);
            $('calTitle').textContent = first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
            const grid = $('days');
            grid.innerHTML = '';
            const start = new Date(year, month, 1 - first.getDay());
            const weeks = Math.ceil((first.getDay() + new Date(year, month + 1, 0).getDate()) / 7);
            const today = todayISO();

            for (let i = 0; i < weeks * 7; i++) {
                const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
                const key = P.iso(date);
                const { exams, tasks, notes } = dayItems(key);
                const cell = el('button', 'day');
                cell.type = 'button';
                if (date.getMonth() !== month) cell.classList.add('other-month');
                if (key === today) cell.classList.add('today');
                if (key === state.selected) cell.classList.add('selected');
                const items = [
                    ...exams.map(e => ({ cls: 'is-exam', text: '★ ' + e.text, subject: e.subject })),
                    ...tasks.map(t => ({ cls: t.done ? 'done' : '', text: (t.done ? '✓ ' : '○ ') + t.text, subject: t.subject })),
                    ...notes.map(n => ({ cls: '', text: n.text.split('\n')[0], subject: n.subject }))
                ];
                const top = el('div', 'day-top');
                const dots = el('span', 'day-dots');
                [...new Set(items.map(x => x.subject || 'general'))].slice(0, 4).forEach(s => {
                    const dot = el('i');
                    dot.style.setProperty('--c', colorOf(s));
                    dots.appendChild(dot);
                });
                top.append(el('span', 'day-num', String(date.getDate())), dots);
                cell.appendChild(top);
                items.slice(0, 3).forEach(item => {
                    const c = el('span', 'day-item ' + item.cls, item.text);
                    c.style.setProperty('--c', colorOf(item.subject));
                    cell.appendChild(c);
                });
                if (items.length > 3) cell.appendChild(el('span', 'day-more', `+${items.length - 3} more`));
                cell.addEventListener('click', () => {
                    selectDate(key);
                    if (window.matchMedia('(max-width: 1100px)').matches) document.querySelector('.day-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
                grid.appendChild(cell);
            }
        }

        function startOfWeek(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay()); }

        function renderWeek() {
            const start = startOfWeek(state.anchor);
            const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
            const fmt = { day: 'numeric', month: 'short' };
            $('calTitle').textContent = `${start.toLocaleDateString(undefined, fmt)} – ${end.toLocaleDateString(undefined, { ...fmt, year: 'numeric' })}`;
            const grid = $('weekGrid');
            grid.innerHTML = '';
            const today = todayISO();
            for (let i = 0; i < 7; i++) {
                const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
                const key = P.iso(date);
                const col = el('div', 'week-col');
                if (key === today) col.classList.add('today');
                if (key === state.selected) col.classList.add('selected');
                const head = el('button', 'week-head');
                head.type = 'button';
                head.append(el('span', null, DAY_NAMES[date.getDay()].slice(0, 3)), el('b', null, String(date.getDate())));
                head.addEventListener('click', () => selectDate(key));
                const body = el('div', 'week-body');
                const { exams, classes, tasks, notes } = dayItems(key);
                const entries = [
                    ...classes.map(c => ({ type: 'class', item: c, sort: c.start, small: `${P.formatTime(c.start)}${c.end ? '–' + P.formatTime(c.end) : ''}`, text: c.text })),
                    ...exams.map(e => ({ type: 'exam', item: e, sort: e.time || '00:00', small: `Exam${e.time ? ' · ' + P.formatTime(e.time) : ''}`, text: '★ ' + e.text })),
                    ...tasks.map(t => ({ type: 'task', item: t, sort: t.time || '98:00', small: `Task${t.time ? ' · ' + P.formatTime(t.time) : ''}`, text: (t.done ? '✓ ' : '○ ') + t.text })),
                    ...notes.map(n => ({ type: 'note', item: n, sort: '99:00', small: 'Note', text: n.text.split('\n')[0] }))
                ].sort((a, b) => a.sort.localeCompare(b.sort));
                if (!entries.length) body.appendChild(el('div', 'week-empty', 'Free'));
                entries.forEach(entry => {
                    const b = el('button', `week-item is-${entry.type}${entry.item.done ? ' done' : ''}`);
                    b.type = 'button';
                    b.style.setProperty('--c', colorOf(entry.item.subject));
                    b.append(el('small', null, entry.small), document.createTextNode(entry.text));
                    b.title = `Edit ${TYPES[entry.type].name}`;
                    b.addEventListener('click', () => openEditor(entry.type, entry.item));
                    body.appendChild(b);
                });
                col.append(head, body);
                grid.appendChild(col);
            }
        }

        function renderCalendar() {
            $('monthView').classList.toggle('hidden', state.view !== 'month');
            $('weekView').classList.toggle('hidden', state.view !== 'week');
            $('viewSeg').querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.view === state.view));
            if (state.view === 'month') renderMonth(); else renderWeek();
        }

        function renderDay() {
            const key = state.selected;
            $('dayTitle').textContent = P.parseISO(key).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            $('daySub').textContent = relativeDay(key) + (state.subject !== 'all' ? ` · showing ${P.subject(state.subject).name} only` : '');
            const { exams, classes, tasks, notes } = dayItems(key);
            $('dayExamsWrap').classList.toggle('hidden', !exams.length);
            fillList('dayExams', exams, null, e => itemCard('exam', e, '★ ' + e.text, [e.time && P.formatTime(e.time)]));
            $('dayClassesWrap').classList.toggle('hidden', !classes.length);
            fillList('dayClasses', classes, null, c => itemCard('class', c, c.text,
                [`${P.formatTime(c.start)}${c.end ? '–' + P.formatTime(c.end) : ''}`, `every ${DAY_NAMES[c.day]}`]));
            fillList('dayTasks', tasks, 'No tasks due on this day.', t => taskCard(t, `${t.priority} priority`));
            fillList('dayNotes', notes, 'No notes for this day.', n => itemCard('note', n, n.text, []));
        }

        function renderLegend() {
            const legend = $('legend');
            legend.innerHTML = '';
            Object.keys(P.SUBJECTS).forEach(k => legend.appendChild(chip(k)));
            legend.appendChild(el('span', null, '★ exam · ○ task · ✓ done'));
        }

        /* ---------- Tasks ---------- */
        function sortTasks(list) {
            return [...list].sort((a, b) => {
                if (a.done !== b.done) return a.done ? 1 : -1;
                if (a.due && b.due && a.due !== b.due) return a.due < b.due ? -1 : 1;
                if (!!a.due !== !!b.due) return a.due ? -1 : 1;
                if (a.due && (a.time || '') !== (b.time || '')) return (a.time || '99') < (b.time || '99') ? -1 : 1;
                if (a.priority !== b.priority) return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
                return a.created - b.created;
            });
        }

        function renderTasks() {
            const today = todayISO();
            const list = $('taskList');
            list.innerHTML = '';
            $('taskFilterSeg').querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.filter === state.taskFilter));
            const visible = sortTasks(P.data.todos).filter(t => matches(t) &&
                (state.taskFilter === 'all' || (state.taskFilter === 'done' ? t.done : !t.done)));
            $('taskEmpty').classList.toggle('hidden', visible.length > 0);

            visible.forEach(task => {
                const li = el('li', 'task' + (task.done ? ' done' : ''));
                li.style.setProperty('--c', colorOf(task.subject));
                const check = el('input');
                check.type = 'checkbox';
                check.checked = task.done;
                check.title = task.done ? 'Mark as not done' : 'Mark as done';
                check.addEventListener('change', () => toggleTask(task.id, check.checked));
                const body = el('div', 'task-body');
                const text = el('div', 'task-text', task.text);
                text.addEventListener('dblclick', () => openEditor('task', task));
                const meta = el('div', 'task-meta');
                meta.append(chip(task.subject), el('span', `badge ${task.priority}`, task.priority[0].toUpperCase() + task.priority.slice(1)));
                if (task.due) {
                    const time = task.time ? ' · ' + P.formatTime(task.time) : '';
                    let due;
                    if (!task.done && task.due < today) due = el('span', 'overdue', `Overdue · ${P.formatDate(task.due)}${time}`);
                    else if (task.due === today) due = el('span', 'due-today', `Due today${time}`);
                    else due = el('span', null, `Due ${P.formatDate(task.due, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}${time}`);
                    due.style.cursor = 'pointer';
                    due.title = 'Show on calendar';
                    due.addEventListener('click', () => { selectDate(task.due); setTab('calendar'); });
                    meta.appendChild(due);
                }
                if (task.due && task.remind !== '' && task.remind != null && !task.done) {
                    const opt = REMIND_OPTIONS.find(o => o[0] === String(task.remind));
                    if (opt) meta.appendChild(el('span', null, 'Reminder ' + opt[1].replace('Remind ', '').toLowerCase()));
                }
                const ch = chapterAnchor(task.chapter);
                if (ch) meta.appendChild(ch);
                body.append(text, meta);
                const actions = el('div', 'item-actions');
                if (!task.done) actions.appendChild(iconBtn('▶', 'Focus on this task', () => focusOnTask(task), 'play'));
                actions.append(iconBtn('✎', 'Edit task', () => openEditor('task', task)),
                               iconBtn('✕', 'Delete task', () => removeItem('todos', task.id), 'delete'));
                li.append(check, body, actions);
                list.appendChild(li);
            });
        }

        /* ---------- Focus ---------- */
        function renderFocus(f) {
            const pct = f.totalMs ? f.remainingMs / f.totalMs : 1;
            const isBreak = f.mode !== 'focus';
            const idle = !f.running && f.remaining == null;
            const time = mmss(f.remainingMs);
            $('bigTime').textContent = time;
            $('bigLabel').textContent = f.label;
            $('bigLabel').classList.toggle('break', isBreak);
            $('bigBar').style.strokeDashoffset = String(282.74 * (1 - pct));
            $('bigBar').classList.toggle('break', isBreak);
            const every = Number(f.settings.longEvery) || 4;
            $('bigCycle').textContent = `Session ${(f.cycle % every) + (isBreak ? 0 : 1) || every} of ${every}`;
            $('fStart').textContent = f.running ? 'Pause' : idle ? 'Start' : 'Resume';
            $('modeSeg').querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.mode === f.mode));
            $('miniTime').textContent = time;
            $('miniLabel').textContent = f.label;
            $('miniBar').style.strokeDashoffset = String(276.46 * (1 - pct));
            $('miniBar').classList.toggle('break', isBreak);
            const task = f.taskId && P.data.todos.find(t => t.id === f.taskId);
            $('miniSub').textContent = f.running ? (task ? task.text : `${P.subject(f.subject).name} · running`) : idle ? 'Ready when you are' : 'Paused';
            $('miniStart').textContent = f.running ? 'Pause' : idle ? 'Start' : 'Resume';
            const pill = $('focusPill');
            pill.classList.toggle('hidden', idle);
            pill.classList.toggle('paused', !f.running);
            pill.textContent = `${f.label} ${time}`;
            document.title = f.running ? `${time} · ${f.label} | OLPW` : 'OLPW - Study Planner';
            if (document.activeElement !== $('fSubject')) $('fSubject').value = f.subject || 'general';
            if (document.activeElement !== $('fTask')) $('fTask').value = f.taskId || '';
        }

        function renderFocusOptions() {
            const sel = $('fTask');
            const f = F.state;
            sel.innerHTML = '';
            sel.appendChild(new Option('Nothing specific', ''));
            P.data.todos.filter(t => !t.done && (f.subject === 'general' || !f.subject || t.subject === f.subject || t.id === f.taskId))
                .forEach(t => sel.appendChild(new Option(t.text, t.id)));
            sel.value = f.taskId || '';
            const s = f.settings;
            [['sFocus', s.focus], ['sShort', s.short], ['sLong', s.long], ['sEvery', s.longEvery]].forEach(([id, v]) => {
                if (document.activeElement !== $(id)) $(id).value = v;
            });
            $('sAuto').checked = !!s.autoStart;
            $('sSound').checked = !!s.sound;
        }

        function renderSessions() {
            const today = todayISO();
            const sessions = P.data.sessions.filter(s => s.date === today).sort((a, b) => b.at - a.at);
            const mins = sessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
            $('sessionsSub').textContent = sessions.length ? `${sessions.length} session${sessions.length === 1 ? '' : 's'} · ${P.formatMinutes(mins)} focused` : 'Finish a focus session to see it here.';
            fillList('sessionList', sessions, 'No sessions yet today.', s => {
                const task = s.taskId && P.data.todos.find(t => t.id === s.taskId);
                const li = el('li', 'item-card');
                li.style.setProperty('--c', colorOf(s.subject));
                const main = el('div', 'item-main');
                const meta = el('div', 'item-meta');
                meta.append(chip(s.subject), el('span', null, new Date(s.at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })));
                main.append(el('div', 'item-text', `${s.minutes} min${task ? ' · ' + task.text : ''}`), meta);
                const actions = el('div', 'item-actions');
                actions.appendChild(iconBtn('✕', 'Remove session', () => removeItem('sessions', s.id, 'Remove this focus session from your stats?'), 'delete'));
                li.append(main, actions);
                return li;
            });
        }

        function focusOnTask(task) {
            F.set({ subject: task.subject || 'general', taskId: task.id });
            const f = F.state;
            if (f.mode !== 'focus') F.setMode('focus');
            if (!F.state.running) F.start();
            setTab('focus');
        }

        /* ---------- Progress ---------- */
        function renderProgress() {
            const map = P.activity();
            const s = P.streaks(map);
            const week = lastDays(7);
            const prevWeek = lastDays(14).slice(0, 7);
            const sum = (days, k) => days.reduce((n, d) => n + ((map[d] && map[d][k]) || 0), 0);
            $('pCurrent').textContent = s.current;
            $('pCurrentHint').textContent = s.current && !s.activeToday ? 'Do something today to keep it going!' : s.activeToday ? 'You\'re active today. Nice!' : 'Finish a task or focus session to start one';
            $('pBest').textContent = s.best;
            const tasksW = sum(week, 'tasks'), tasksP = sum(prevWeek, 'tasks');
            const minsW = sum(week, 'minutes'), minsP = sum(prevWeek, 'minutes');
            $('pTasks').textContent = tasksW;
            $('pTasksHint').textContent = `${tasksP} the week before`;
            $('pFocus').textContent = P.formatMinutes(minsW);
            $('pFocusHint').textContent = `${sum(week, 'sessions')} sessions · ${P.formatMinutes(minsP)} the week before`;

            const chart = $('chart');
            chart.innerHTML = '';
            const max = Math.max(30, ...week.map(d => (map[d] && map[d].minutes) || 0));
            week.forEach(d => {
                const a = map[d] || { minutes: 0, tasks: 0 };
                const col = el('div', 'chart-col');
                const bar = el('div', 'chart-bar' + (a.minutes ? '' : ' zero'));
                bar.style.height = `${Math.max(2, a.minutes / max * 100)}%`;
                if (a.minutes) bar.appendChild(el('em', null, P.formatMinutes(a.minutes)));
                col.append(bar, el('div', 'chart-tasks', a.tasks ? `✓${a.tasks}` : ''),
                           el('div', 'chart-day' + (d === todayISO() ? ' today' : ''), P.parseISO(d).toLocaleDateString(undefined, { weekday: 'short' })));
                chart.appendChild(col);
            });

            const box = $('subjectBreakdown');
            box.innerHTML = '';
            const weekSet = new Set(week);
            const per = {};
            Object.keys(P.SUBJECTS).forEach(k => per[k] = { minutes: 0, tasks: 0 });
            P.data.sessions.filter(x => weekSet.has(x.date)).forEach(x => (per[x.subject] || per.general).minutes += x.minutes || 0);
            P.data.todos.filter(t => t.done && weekSet.has(P.iso(new Date(t.doneAt || t.updated)))).forEach(t => (per[t.subject] || per.general).tasks++);
            const rows = Object.entries(per).filter(([, v]) => v.minutes || v.tasks).sort((a, b) => b[1].minutes - a[1].minutes || b[1].tasks - a[1].tasks);
            const maxM = Math.max(1, ...rows.map(([, v]) => v.minutes));
            if (!rows.length) box.appendChild(el('div', 'empty', 'No activity in the last 7 days yet.'));
            rows.forEach(([k, v]) => {
                const row = el('div', 'progress-row');
                row.style.setProperty('--c', colorOf(k));
                const top = el('div', 'top');
                top.append(el('span', null, P.subject(k).name), el('b', null, `${P.formatMinutes(v.minutes)} · ${v.tasks} task${v.tasks === 1 ? '' : 's'}`));
                const bar = el('div', 'bar');
                const fill = el('i');
                fill.style.width = `${v.minutes / maxM * 100}%`;
                bar.appendChild(fill);
                row.append(top, bar);
                box.appendChild(row);
            });

            const heat = $('heatmap');
            heat.innerHTML = '';
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const startDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 15 * 7);
            for (let i = 0; i < 16 * 7; i++) {
                const d = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate() + i);
                const key = P.iso(d);
                const a = map[key];
                const score = a ? a.tasks + a.sessions : 0;
                const lvl = score === 0 ? '' : score === 1 ? ' l1' : score <= 3 ? ' l2' : score <= 5 ? ' l3' : ' l4';
                const cell = el('span', 'heat' + lvl + (d > today ? ' future' : '') + (key === todayISO() ? ' today' : ''));
                cell.title = `${P.formatDate(key, { weekday: 'short', day: 'numeric', month: 'short' })}: ${a ? `${a.tasks} task${a.tasks === 1 ? '' : 's'}, ${a.minutes} min focus` : 'no activity'}`;
                heat.appendChild(cell);
            }

            renderChapterGrid();
        }

        function renderChapterGrid() {
            const grid = $('chapterGrid');
            grid.innerHTML = '';
            STUDY_SUBJECTS.filter(s => state.subject === 'all' || state.subject === s).forEach(s => {
                const list = P.chapterList(s);
                const { done, total } = P.chapterProgress(s);
                const card = el('details', 'chapter-card');
                card.style.setProperty('--c', colorOf(s));
                card.open = openChapters.has(s);
                card.addEventListener('toggle', () => { if (card.open) openChapters.add(s); else openChapters.delete(s); });
                const summary = el('summary');
                const top = el('div', 'top');
                const h = el('h3', null, P.subject(s).name);
                const right = el('span', 'count', `${done}/${total} done`);
                right.appendChild(el('span', 'chev', '›'));
                top.append(h, right);
                const bar = el('div', 'bar');
                bar.style.setProperty('--c', colorOf(s));
                const fill = el('i');
                fill.style.width = total ? `${done / total * 100}%` : '0';
                bar.appendChild(fill);
                summary.append(top, bar);
                const rows = el('ul', 'chapter-rows');
                list.forEach(ch => {
                    const isDone = P.isChapterDone(ch.key);
                    const row = el('li', 'chapter-row' + (isDone ? ' done' : ''));
                    const check = el('input');
                    check.type = 'checkbox';
                    check.checked = isDone;
                    check.title = isDone ? 'Mark as not finished' : 'Mark chapter as finished';
                    check.addEventListener('change', () => P.setChapterDone(ch.key, check.checked));
                    const name = el('span', 'name');
                    name.append(el('small', null, `Ch ${ch.n}`), document.createTextNode(ch.title));
                    const open = el('a', 'icon-btn', '↗');
                    open.href = ch.href;
                    open.title = 'Open chapter';
                    if (/^https?:/.test(ch.href)) { open.target = '_blank'; open.rel = 'noopener'; }
                    const plan = iconBtn('+', 'Plan a revision task for this chapter', () => openEditor('task', null, {
                        text: `Revise ${P.subject(s).name} Ch ${ch.n}: ${ch.title}`, subject: s, chapter: `${s}:${ch.n}`, priority: 'medium'
                    }));
                    row.append(check, name, open, plan);
                    rows.appendChild(row);
                });
                card.append(summary, rows);
                grid.appendChild(card);
            });
        }

        /* ---------- Reminders button ---------- */
        function renderRemindButton() {
            const mode = P.notificationMode();
            $('remindBtn').classList.toggle('on', mode !== 'off');
            $('remindLabel').textContent = mode === 'off' ? 'Enable reminders' : mode === 'system' ? 'Reminders on' : 'Reminders on (in page)';
            $('remindBtn').title = mode === 'off' ? 'Get reminded about tasks, exams and classes'
                : mode === 'system' ? 'Reminders are on. Click to turn them off.'
                : 'Browser notifications are blocked here, so reminders pop up inside OLPW pages. Click to turn off.';
        }

        function renderAll() {
            renderStats();
            renderFilter();
            renderExams();
            renderAgenda();
            renderStreakCard();
            renderChapterMini();
            renderCalendar();
            renderDay();
            renderTasks();
            renderFocusOptions();
            renderFocus(F.state);
            renderSessions();
            renderProgress();
            renderRemindButton();
        }

        /* ---------- Tabs ---------- */
        function setTab(tab, fromHash) {
            if (!TABS.includes(tab)) tab = 'today';
            state.tab = tab;
            document.body.dataset.tab = tab;
            document.querySelectorAll('.tab-page').forEach(p => p.classList.toggle('active', p.dataset.page === tab));
            document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
            $('fab').classList.toggle('hidden', tab === 'focus' || tab === 'progress');
            if (!fromHash && location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab);
            window.scrollTo({ top: 0, behavior: fromHash ? 'auto' : 'smooth' });
        }
        function tabFromHash() {
            const h = location.hash.slice(1);
            return h === 'exams' ? 'today' : h;
        }

        /* ---------- Actions ---------- */
        function selectDate(key) {
            state.selected = key;
            state.anchor = P.parseISO(key);
            renderCalendar();
            renderDay();
        }
        function toggleTask(id, done) {
            const now = Date.now();
            P.update('todos', list => list.map(t => t.id === id ? { ...t, done, doneAt: done ? now : null, updated: now } : t));
            const task = P.data.todos.find(t => t.id === id);
            if (done && task && task.chapter) {
                const ch = P.findChapter(task.chapter);
                if (ch && !P.isChapterDone(ch.key)) P.toast('Chapter finished too?', `Tick "${P.subject(ch.subject).name} Ch ${ch.n}" in Progress → Chapters when you're done with it.`);
            }
        }
        function removeItem(section, id, question) {
            if (question && !confirm(question)) return;
            P.update(section, list => list.filter(x => x.id !== id));
        }
        function saveItem(type, id, fields) {
            const now = Date.now();
            P.update(TYPES[type].section, list => id
                ? list.map(x => x.id === id ? { ...x, ...fields, updated: now } : x)
                : [...list, { id: P.newId(), created: now, updated: now, ...(type === 'task' ? { done: false } : {}), ...fields }]);
            if (fields.remind && P.notificationMode() === 'off') {
                P.toast('Reminders are off', 'Tap the bell at the top of the page to turn them on.');
            }
        }

        /* ---------- Editor dialog ---------- */
        function fillChapterOptions(subjectKey, selected) {
            const sel = $('edChapter');
            sel.innerHTML = '';
            const list = P.chapterList(subjectKey);
            sel.appendChild(new Option(list.length ? 'No chapter' : 'Pick a subject first', ''));
            list.forEach(ch => sel.appendChild(new Option(`Ch ${ch.n}: ${ch.title}`, `${subjectKey}:${ch.n}`)));
            sel.disabled = !list.length;
            sel.value = selected && selected.startsWith(subjectKey + ':') ? selected : '';
        }

        function openEditor(type, item, defaults) {
            const cfg = TYPES[type];
            const v = item || defaults || {};
            editing = { type, id: item ? item.id : null };
            document.querySelectorAll('#editorForm [data-field]').forEach(l => l.classList.toggle('hidden', !cfg.fields.includes(l.dataset.field)));
            $('edTitle').textContent = (item ? 'Edit ' : 'New ') + cfg.name;
            $('edTextLabel').textContent = type === 'task' ? 'Task' : type === 'exam' ? 'Exam (e.g. Paper 2 Theory)' : 'Class (e.g. Physics tuition)';
            $('edDateLabel').textContent = type === 'task' ? 'Due date' : 'Date';
            $('edTimeLabel').textContent = type === 'task' ? 'Due time' : 'Start time';
            $('edText').value = v.text || '';
            $('edNote').value = type === 'note' ? (v.text || '') : '';
            $('edSubject').value = v.subject || (state.subject !== 'all' ? state.subject : 'general');
            fillChapterOptions($('edSubject').value, v.chapter);
            $('edDate').value = (type === 'task' ? v.due : v.date) || '';
            $('edDay').value = String(v.day != null ? v.day : P.parseISO(state.selected).getDay());
            $('edTime').value = v.time || '';
            $('edStart').value = v.start || '';
            $('edEnd').value = v.end || '';
            $('edPriority').value = v.priority || 'medium';
            $('edRemind').value = v.remind != null ? String(v.remind) : '';
            $('edError').classList.add('hidden');
            $('edDelete').classList.toggle('hidden', !item);
            $('editor').showModal();
            if (!window.matchMedia('(max-width: 760px)').matches) (type === 'note' ? $('edNote') : $('edText')).focus();
        }

        function editorError(msg) {
            $('edError').textContent = msg;
            $('edError').classList.remove('hidden');
        }

        $('edSubject').addEventListener('change', () => fillChapterOptions($('edSubject').value, $('edChapter').value));

        $('editorForm').addEventListener('submit', e => {
            e.preventDefault();
            const { type, id } = editing;
            const text = (type === 'note' ? $('edNote') : $('edText')).value.trim();
            const subject = $('edSubject').value;
            const date = $('edDate').value;
            if (!text) return editorError(type === 'note' ? 'Write something for the note.' : 'Please enter a title.');
            let fields;
            if (type === 'task') {
                const remind = $('edRemind').value;
                if (remind && !date) return editorError('Set a due date to get a reminder.');
                fields = { text, subject, chapter: $('edChapter').value, due: date, time: $('edTime').value, priority: $('edPriority').value, remind };
            } else if (type === 'exam') {
                if (!date) return editorError('Pick the exam date.');
                fields = { text, subject, date, time: $('edTime').value };
            } else if (type === 'note') {
                if (!date) return editorError('Pick a date for the note.');
                fields = { text, subject, date };
            } else {
                const start = $('edStart').value, end = $('edEnd').value;
                if (!start) return editorError('Set a start time for the class.');
                if (end && end <= start) return editorError('End time must be after the start time.');
                fields = { text, subject, day: Number($('edDay').value), start, end };
            }
            saveItem(type, id, fields);
            $('editor').close();
        });
        $('edCancel').addEventListener('click', () => $('editor').close());
        $('edDelete').addEventListener('click', () => {
            const { type, id } = editing;
            if (!confirm(`Delete this ${TYPES[type].name}?`)) return;
            removeItem(TYPES[type].section, id);
            $('editor').close();
        });
        $('editor').addEventListener('click', e => { if (e.target === $('editor')) $('editor').close(); });

        /* ---------- Wiring ---------- */
        document.querySelectorAll('select[data-subjects]').forEach(sel => {
            Object.entries(P.SUBJECTS).forEach(([k, s]) => sel.appendChild(new Option(s.name, k)));
        });
        document.querySelectorAll('select[data-remind]').forEach(sel => {
            REMIND_OPTIONS.forEach(([v, label]) => sel.appendChild(new Option(label, v)));
        });

        document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
        document.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => setTab(b.dataset.goto)));
        window.addEventListener('hashchange', () => setTab(tabFromHash(), true));

        $('taskForm').addEventListener('submit', e => {
            e.preventDefault();
            const text = $('taskText').value.trim();
            if (!text) return;
            const due = $('taskDue').value;
            const remind = $('taskRemind').value;
            if (remind && !due) { P.toast('Add a due date', 'A reminder needs a due date for the task.'); $('taskDue').focus(); return; }
            saveItem('task', null, { text, subject: $('taskSubject').value, chapter: '', due, time: $('taskTime').value, priority: $('taskPriority').value, remind });
            $('taskText').value = '';
            $('taskTime').value = '';
            $('taskText').focus();
        });

        $('quickAdd').addEventListener('submit', e => {
            e.preventDefault();
            const text = $('quickText').value.trim();
            if (!text) return;
            saveItem('task', null, { text, subject: state.subject !== 'all' ? state.subject : 'general', chapter: '', due: todayISO(), time: '', priority: 'medium', remind: '' });
            $('quickText').value = '';
        });

        $('noteForm').addEventListener('submit', e => {
            e.preventDefault();
            const text = $('noteText').value.trim();
            if (!text) return;
            saveItem('note', null, { text, subject: $('noteSubject').value, date: state.selected });
            $('noteText').value = '';
        });

        $('dayAddTask').addEventListener('click', () => openEditor('task', null, { due: state.selected }));
        $('dayAddExam').addEventListener('click', () => openEditor('exam', null, { date: state.selected }));
        $('addExamBtn').addEventListener('click', () => openEditor('exam', null, { date: todayISO() }));
        $('addClassBtn').addEventListener('click', () => openEditor('class', null, { day: P.parseISO(state.selected).getDay() }));
        $('fab').addEventListener('click', () => {
            if (state.tab === 'calendar') openEditor('note', null, { date: state.selected });
            else openEditor('task', null, { due: state.tab === 'today' ? todayISO() : '' });
        });

        $('viewSeg').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
            state.view = b.dataset.view;
            state.anchor = P.parseISO(state.selected);
            renderCalendar();
        }));
        function shift(dir) {
            const a = state.anchor;
            state.anchor = state.view === 'month'
                ? new Date(a.getFullYear(), a.getMonth() + dir, 1)
                : new Date(a.getFullYear(), a.getMonth(), a.getDate() + dir * 7);
            renderCalendar();
        }
        $('prevBtn').addEventListener('click', () => shift(-1));
        $('nextBtn').addEventListener('click', () => shift(1));
        $('todayBtn').addEventListener('click', () => selectDate(todayISO()));

        $('taskFilterSeg').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
            state.taskFilter = b.dataset.filter;
            renderTasks();
        }));
        $('clearDone').addEventListener('click', () => {
            const count = P.data.todos.filter(t => t.done).length;
            if (!count) return P.toast('Nothing to clear', 'You have no completed tasks.');
            if (confirm(`Delete ${count} completed task${count > 1 ? 's' : ''}? They will also disappear from your stats.`)) P.update('todos', list => list.filter(t => !t.done));
        });

        function toggleTimer() { if (F.state.running) F.pause(); else F.start(); }
        $('fStart').addEventListener('click', toggleTimer);
        $('miniStart').addEventListener('click', toggleTimer);
        $('fReset').addEventListener('click', () => F.reset());
        $('miniReset').addEventListener('click', () => F.reset());
        $('fSkip').addEventListener('click', () => F.skip());
        $('modeSeg').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
            if (F.state.running && !confirm('Stop the current timer and switch?')) return;
            F.setMode(b.dataset.mode);
        }));
        $('fSubject').addEventListener('change', () => {
            const task = P.data.todos.find(t => t.id === F.state.taskId);
            F.set({ subject: $('fSubject').value, taskId: task && task.subject !== $('fSubject').value ? '' : F.state.taskId });
            renderFocusOptions();
        });
        $('fTask').addEventListener('change', () => {
            const task = P.data.todos.find(t => t.id === $('fTask').value);
            F.set({ taskId: $('fTask').value, subject: task ? task.subject : F.state.subject });
            renderFocusOptions();
        });
        [['sFocus', 'focus', 1, 180], ['sShort', 'short', 1, 60], ['sLong', 'long', 1, 90], ['sEvery', 'longEvery', 2, 12]].forEach(([id, key, min, max]) => {
            $(id).addEventListener('change', () => {
                const v = Math.min(max, Math.max(min, Math.round(Number($(id).value) || min)));
                $(id).value = v;
                F.settings({ [key]: v });
            });
        });
        $('sAuto').addEventListener('change', () => F.settings({ autoStart: $('sAuto').checked }));
        $('sSound').addEventListener('change', () => F.settings({ sound: $('sSound').checked }));

        $('remindBtn').addEventListener('click', async () => {
            if (P.notificationMode() !== 'off') {
                P.disableReminders();
                renderRemindButton();
                return;
            }
            const mode = await P.enableReminders();
            renderRemindButton();
            P.toast('Reminders on', mode === 'system'
                ? 'You will get notifications for tasks, exams and classes while OLPW is open.'
                : 'Browser notifications are blocked here, so reminders will pop up inside OLPW pages while they are open.');
        });
        P.theme.mountPicker($('themeBtn'));

        P.onStatus((s, label) => {
            const pill = $('syncPill');
            $('syncText').textContent = label;
            pill.title = s === 'denied'
                ? 'Cloud Firestore is not enabled for this Firebase project yet. Your planner is safely saved in this browser.'
                : label;
            pill.className = 'sync-pill ' + (s === 'synced' ? 'ok' : (s === 'syncing' || s === 'connecting') ? 'busy' : 'warn');
        });
        P.onChange(() => { if (!document.body.classList.contains('booting')) renderAll(); });
        F.onChange(f => { if (!document.body.classList.contains('booting')) renderFocus(f); });

        let booted = false;
        P.requireAuth(user => {
            const name = user.displayName || (user.email ? user.email.split('@')[0] : 'Student');
            $('avatar').textContent = name.charAt(0).toUpperCase();
            $('avatar').title = name;
            document.body.classList.remove('booting');
            if (booted) { renderAll(); return; }
            booted = true;
            const params = new URLSearchParams(location.search);
            const due = params.get('due');
            if (due && /^\d{4}-\d{2}-\d{2}$/.test(due)) {
                state.selected = due;
                state.anchor = P.parseISO(due);
                $('taskDue').value = due;
            }
            renderLegend();
            renderAll();
            setTab(due ? 'tasks' : tabFromHash(), true);
            if (due) $('taskText').focus();
            P.startReminders();
            setInterval(() => { renderStats(); renderExams(); }, 60000);
        });
