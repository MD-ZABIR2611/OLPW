// OLPW:js/index.js | script for index
(function () {
            try {
                var t = JSON.parse(localStorage.getItem('olpw-theme')) || {};
                var m = t.mode || 'light';
                if (m === 'auto') m = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                document.documentElement.dataset.theme = m;
                if (t.accent) document.documentElement.style.setProperty('--accent', t.accent);
            } catch (e) { /* default theme */ }
        })();

// FORCE LOGIN EVERY TIME: Firebase forgets the user when the tab is closed,
        // but keeps them signed in while they move between OLPW pages in the same tab.
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .catch((error) => { console.error("Persistence error:", error); });

        const auth = firebase.auth();

        const authScreen = document.getElementById('authScreen');
        const landingScreen = document.getElementById('landingScreen');
        const dashboardScreen = document.getElementById('dashboardScreen');
        const nextPage = new URLSearchParams(location.search).get('next');
        const loginView = document.getElementById('loginFormView');
        const signupView = document.getElementById('signupFormView');
        const authAlertLogin = document.getElementById('authAlert');
        const authAlertSignup = document.getElementById('authAlertSignup');

        function toggleAuth(view) {
            authAlertLogin.classList.add('hidden');
            authAlertSignup.classList.add('hidden');
            if (view === 'signup') { loginView.classList.add('hidden'); signupView.classList.remove('hidden'); } 
            else { signupView.classList.add('hidden'); loginView.classList.remove('hidden'); }
        }

        function showAlert(message, type = 'login', ok = false) {
            const alertBox = type === 'login' ? authAlertLogin : authAlertSignup;
            alertBox.innerText = message;
            alertBox.classList.toggle('ok', ok);
            alertBox.classList.remove('hidden');
        }

        function showLanding() {
            authScreen.classList.add('hidden');
            dashboardScreen.classList.add('hidden');
            landingScreen.classList.remove('hidden');
        }

        function showAuth(view) {
            toggleAuth(view);
            landingScreen.classList.add('hidden');
            dashboardScreen.classList.add('hidden');
            authScreen.classList.remove('hidden');
            window.scrollTo(0, 0);
            const first = document.getElementById(view === 'signup' ? 'signupName' : 'loginEmail');
            if (first) first.focus();
        }

        document.querySelectorAll('[data-auth]').forEach(btn => btn.addEventListener('click', () => showAuth(btn.dataset.auth)));
        document.getElementById('authBackBtn').addEventListener('click', () => {
            if (nextPage) history.replaceState(null, '', 'index.html');
            document.getElementById('authNextNote').classList.add('hidden');
            showLanding();
        });

        (function renderSubjectCloud() {
            const core = [['Mathematics', '#F59E0B'], ['Physics', '#3B82F6'], ['Chemistry', '#A855F7'], ['Biology', '#3b82f6'], ['Computer Science', '#06B6D4']];
            const more = (window.OLPW_MORE_SUBJECTS || []).map(s => [s.name, s.color]);
            const all = core.concat(more);
            const cloud = document.getElementById('subjectCloud');
            all.forEach(([name, color]) => {
                const chip = document.createElement('span');
                chip.className = 'subject-chip';
                chip.style.setProperty('--c', color);
                chip.appendChild(document.createElement('i'));
                chip.append(name);
                cloud.appendChild(chip);
            });
            document.getElementById('statSubjects').textContent = all.length;
            const coreChapters = Object.values(window.OLPW_CHAPTERS || {}).reduce((n, l) => n + l.length, 0);
            const moreChapters = (window.OLPW_MORE_SUBJECTS || []).reduce((n, s) => n + (s.chapters || []).length, 0);
            document.getElementById('statChapters').textContent = coreChapters + moreChapters;
        })();

        // Sign Up Logic
        document.getElementById('signupBtn').addEventListener('click', async () => {
            const btn = document.getElementById('signupBtn');
            btn.innerText = 'Creating...'; btn.disabled = true;
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            if(!name || !email || !password) {
                showAlert("Please fill all fields", 'signup'); btn.innerText = 'Create Profile'; btn.disabled = false; return;
            }

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                await user.updateProfile({ displayName: name });
            } catch (err) {
                const SIGNUP_ERRORS = {
                    'auth/email-already-in-use': 'An account with this email already exists. Log in instead, or use "Forgot Password?" to recover it.',
                    'auth/invalid-email': 'That email address does not look right. Check it and try again.',
                    'auth/weak-password': 'Password is too weak. Use at least 6 characters.'
                };
                showAlert(SIGNUP_ERRORS[err.code] || err.message, 'signup');
                btn.innerText = 'Create Profile'; btn.disabled = false;
            }
        });

        // Login Logic
        document.getElementById('loginBtn').addEventListener('click', async () => {
            const btn = document.getElementById('loginBtn');
            btn.innerText = 'Logging in...'; btn.disabled = true;
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            if(!email || !password) { 
                showAlert("Enter email and password"); btn.innerText = 'Access Dashboard'; btn.disabled = false; return; 
            }

            try {
                await auth.signInWithEmailAndPassword(email, password);
            } catch (err) {
                const LOGIN_ERRORS = {
                    'auth/invalid-credential': 'Email or password is incorrect. New here? Create a profile first, or use "Forgot Password?" below.',
                    'auth/invalid-email': 'That email address does not look right. Check it and try again.',
                    'auth/user-not-found': 'No account with that email yet. Create a profile first.',
                    'auth/wrong-password': 'Wrong password. Try again, or use "Forgot Password?" below.',
                    'auth/too-many-requests': 'Too many attempts. Wait a minute and try again.',
                    'auth/user-disabled': 'This account has been disabled.'
                };
                showAlert(LOGIN_ERRORS[err.code] || err.message || "Invalid email or password.");
                btn.innerText = 'Access Dashboard'; btn.disabled = false;
            }
        });

        // Continue with Google
        const GOOGLE_ERRORS = {
            'auth/operation-not-allowed': 'Google sign-in is not switched on yet. Please use email and password for now.',
            'auth/unauthorized-domain': 'Google sign-in is not allowed on this web address yet. Please use email and password for now.',
            'auth/account-exists-with-different-credential': 'This email already has an account. Log in with your email and password instead.',
            'auth/network-request-failed': 'No internet connection. Check your connection and try again.',
            'auth/user-disabled': 'This account has been disabled.'
        };
        function googleError(err, view) {
            if (['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/user-cancelled'].includes(err.code)) return;
            showAlert(GOOGLE_ERRORS[err.code] || err.message || 'Google sign-in failed. Please try again.', view);
        }
        document.querySelectorAll('[data-google]').forEach(btn => btn.addEventListener('click', async () => {
            const view = btn.dataset.google, label = btn.querySelector('span'), text = label.textContent;
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            authAlertLogin.classList.add('hidden');
            authAlertSignup.classList.add('hidden');
            btn.disabled = true; label.textContent = 'Opening Google...';
            try {
                await auth.signInWithPopup(provider);
            } catch (err) {
                if (['auth/popup-blocked', 'auth/operation-not-supported-in-environment'].includes(err.code)) {
                    sessionStorage.setItem('olpw-google-view', view);
                    return auth.signInWithRedirect(provider).catch(e => { googleError(e, view); btn.disabled = false; label.textContent = text; });
                }
                googleError(err, view);
            }
            btn.disabled = false; label.textContent = text;
        }));
        auth.getRedirectResult().catch(err => {
            const view = sessionStorage.getItem('olpw-google-view');
            if (!view) return;
            showAuth(view);
            googleError(err, view);
        }).finally(() => sessionStorage.removeItem('olpw-google-view'));

        [['loginEmail', 'loginBtn'], ['loginPassword', 'loginBtn'], ['signupName', 'signupBtn'], ['signupEmail', 'signupBtn'], ['signupPassword', 'signupBtn']].forEach(([input, btn]) => {
            document.getElementById(input).addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById(btn).click(); });
        });

        // Forgot Password
        function resetPassword() {
            const email = document.getElementById('loginEmail').value.trim();
            if (!email) {
                showAlert('Type your account email in the box above, then click "Forgot Password?" again.');
                document.getElementById('loginEmail').focus();
                return;
            }
            auth.sendPasswordResetEmail(email)
                .then(() => showAlert(`Password reset email sent to ${email}. Check your inbox.`, 'login', true))
                .catch((err) => showAlert(err.message));
        }

        // Check Auth State
        auth.onAuthStateChanged((user) => {
            if (user) {
                if (nextPage && /^[\w-]+\.html(\?[\w=&%.-]*)?(#[\w-]*)?$/.test(nextPage)) {
                    location.replace(nextPage);
                    return;
                }
                landingScreen.classList.add('hidden');
                OLPWPlanner.start(user);
                OLPWPlanner.startReminders();
                renderToday();

                // INSTANTLY SHOW DASHBOARD
                authScreen.classList.add('hidden');
                dashboardScreen.classList.remove('hidden');
                
                // Reset buttons
                document.getElementById('loginBtn').innerText = 'Access Dashboard'; 
                document.getElementById('loginBtn').disabled = false;
                document.getElementById('signupBtn').innerText = 'Create Profile'; 
                document.getElementById('signupBtn').disabled = false;

                // Get name
                const displayName = user.displayName || (user.email ? user.email.split('@')[0] : "Student");
                document.getElementById('welcomeName').innerText = displayName;
                document.getElementById('profileAvatar').innerText = displayName.charAt(0).toUpperCase();
                
            } else {
                // Logged out: pages that need an account send people here with ?next=, so go straight to login
                if (nextPage) {
                    document.getElementById('authNextNote').classList.remove('hidden');
                    showAuth('login');
                } else {
                    showLanding();
                }
            }
        });

        // Logout Logic
        document.getElementById('logoutBtn').addEventListener('click', () => {
            OLPWPlanner.stop();
            auth.signOut();
        });

        // Today widget (data from the Study Planner)
        const P = OLPWPlanner;
        const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const STUDY_SUBJECTS = ['maths', 'physics', 'chemistry', 'biology', 'cs'];

        function todayItem(subjectKey, textValue, smallText, smallClass) {
            const li = document.createElement('li');
            li.className = 'today-item';
            li.style.setProperty('--c', P.subject(subjectKey).color);
            const main = document.createElement('div');
            main.className = 'ti-main';
            main.textContent = textValue;
            if (smallText) {
                const small = document.createElement('small');
                small.textContent = smallText;
                if (smallClass) small.className = smallClass;
                main.appendChild(small);
            }
            li.appendChild(main);
            return li;
        }

        function fillToday(id, items, emptyHtml, build) {
            const list = document.getElementById(id);
            list.innerHTML = '';
            if (!items.length) {
                const li = document.createElement('li');
                li.className = 'today-empty';
                li.innerHTML = emptyHtml;
                list.appendChild(li);
            }
            items.forEach(x => list.appendChild(build(x)));
        }

        function progressBar(color, done, total) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.setProperty('--c', color);
            const fill = document.createElement('i');
            fill.style.width = total ? `${done / total * 100}%` : '0';
            bar.appendChild(fill);
            return bar;
        }

        function renderToday() {
            if (!P.user) return;
            const now = new Date();
            const today = P.iso(now);
            const data = P.data;
            document.getElementById('todayDate').textContent = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

            const tasks = data.todos.filter(t => !t.done && t.due && t.due <= today)
                .sort((a, b) => (a.due + (a.time || '99')).localeCompare(b.due + (b.time || '99')));
            document.getElementById('tdTaskCount').textContent = tasks.length ? tasks.length : '';
            fillToday('tdTasks', tasks.slice(0, 5), 'Nothing due today. <a href="planner.html#tasks">Add a task</a>', t => {
                const overdue = t.due < today;
                const li = todayItem(t.subject, t.text,
                    overdue ? `Overdue Â· ${P.formatDate(t.due)}` : `${P.subject(t.subject).name}${t.time ? ' Â· ' + P.formatTime(t.time) : ''}`,
                    overdue ? 'red' : '');
                const check = document.createElement('input');
                check.type = 'checkbox';
                check.title = 'Mark as done';
                check.addEventListener('change', () => {
                    const at = Date.now();
                    P.update('todos', list => list.map(x => x.id === t.id ? { ...x, done: true, doneAt: at, updated: at } : x));
                });
                li.prepend(check);
                return li;
            });

            const classes = data.timetable.filter(c => Number(c.day) === now.getDay()).sort((a, b) => a.start.localeCompare(b.start));
            fillToday('tdClasses', classes, `No classes on ${DAY_NAMES[now.getDay()]}. <a href="planner.html#calendar">Set up your timetable</a>`,
                c => todayItem(c.subject, c.text, `${P.formatTime(c.start)}${c.end ? 'â€“' + P.formatTime(c.end) : ''} Â· ${P.subject(c.subject).name}`));

            const notes = data.notes.filter(n => n.date === today);
            fillToday('tdNotes', notes, 'No notes pinned to today. <a href="planner.html#calendar">Open calendar</a>',
                n => todayItem(n.subject, n.text, P.subject(n.subject).name));

            const exams = data.exams.filter(e => P.at(e.date, e.time || '23:59') >= now)
                .sort((a, b) => P.at(a.date, a.time) - P.at(b.date, b.time)).slice(0, 3);
            fillToday('tdExams', exams, 'No upcoming exams. <a href="planner.html#today">Add one</a>', e => {
                const d = P.daysUntil(e.date);
                const li = todayItem(e.subject, e.text, `${P.subject(e.subject).name} Â· ${P.formatDate(e.date)}${e.time ? ' Â· ' + P.formatTime(e.time) : ''}`);
                const count = document.createElement('div');
                count.className = 'count';
                count.textContent = d === 0 ? 'Today' : d;
                if (d > 0) {
                    const unit = document.createElement('span');
                    unit.textContent = d === 1 ? 'day' : 'days';
                    count.appendChild(unit);
                }
                li.prepend(count);
                return li;
            });

            const map = P.activity();
            const streak = P.streaks(map);
            let tasks7 = 0;
            for (let i = 0; i < 7; i++) {
                const d = P.iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i));
                tasks7 += (map[d] && map[d].tasks) || 0;
            }
            document.getElementById('skCurrent').textContent = streak.current;
            document.getElementById('skToday').textContent = P.formatMinutes((map[today] && map[today].minutes) || 0);
            document.getElementById('skWeek').textContent = tasks7;
            document.getElementById('streakPill').classList.toggle('cold', !streak.current);
            document.getElementById('streakText').textContent = streak.current
                ? `${streak.current}-day streak${streak.activeToday ? '' : ' Â· keep it going today'}`
                : 'No streak yet';

            const chapterBox = document.getElementById('tdChapters');
            chapterBox.innerHTML = '';
            STUDY_SUBJECTS.forEach(s => {
                const { done, total } = P.chapterProgress(s);
                const row = document.createElement('div');
                row.className = 'progress-row';
                const top = document.createElement('div');
                top.className = 'top';
                const name = document.createElement('span');
                name.textContent = P.subject(s).name;
                const count = document.createElement('b');
                count.textContent = `${done}/${total}`;
                top.append(name, count);
                row.append(top, progressBar(P.subject(s).color, done, total));
                chapterBox.appendChild(row);
            });

            renderRemindButton();
            renderMoreSubjects();
        }

        /* The five core subjects live in chapters.js; the rest in subjects.js. Merge both into
           one browsable list so every subject appears in a single grid with real chapter counts. */
        const CORE_CARDS = [
            { slug: 'maths', href: 'math.html', card: 'Number, algebra, geometry, trigonometry and statistics with worked examples and exam practice.' },
            { slug: 'physics', href: 'physics.html', card: 'Mechanics, energy, electricity, waves and modern physics, with interactive simulations.' },
            { slug: 'chemistry', href: 'chemistry.html', card: 'Atoms, bonding, acids, salts and organic chemistry, plus the interactive periodic table.' },
            { slug: 'biology', href: 'biology.html', card: 'Cells, human physiology, plant biology, genetics, ecology and biotechnology.' },
            { slug: 'cs', href: 'cs.html', card: 'Data representation, hardware, algorithms, programming, databases and networks.' }
        ];
        function allSubjectList() {
            const core = CORE_CARDS.map(c => {
                const meta = P.subject(c.slug);
                const chapters = (window.OLPW_CHAPTERS || {})[c.slug] || [];
                return {
                    slug: c.slug, href: c.href, name: meta.name, color: meta.color, card: c.card,
                    searchText: chapters.map(ch => ch.title || '').join(' '),
                    keys: chapters.map(ch => ch.key),
                    total: chapters.length
                };
            });
            const more = (window.OLPW_MORE_SUBJECTS || []).map(s => ({
                slug: s.slug, href: `${s.slug}.html`, name: s.name, color: s.color, card: s.card,
                searchText: (s.chapters || []).join(' '),
                keys: Array.from({ length: (s.chapters || []).length }, (_, i) => `${s.slug}-chapter-${String(i + 1).padStart(2, '0')}`),
                total: (s.chapters || []).length
            }));
            return core.concat(more);
        }

        function renderMoreSubjects() {
            const grid = document.getElementById('moreSubjects');
            const list = allSubjectList();
            if (!grid || !list.length) return;
            const q = document.getElementById('moreSearch').value.trim().toLowerCase();
            grid.innerHTML = '';
            let shown = 0, totalChapters = 0;
            list.forEach(s => {
                totalChapters += s.total;
                if (q && !(s.name + ' ' + s.card + ' ' + s.searchText).toLowerCase().includes(q)) return;
                let done = 0;
                s.keys.forEach(k => { if (localStorage.getItem(k) === 'true') done++; });
                const card = document.createElement('a');
                card.href = s.href;
                card.className = 'card';
                card.style.setProperty('--c', s.color);
                card.dataset.subject = s.slug;
                const title = document.createElement('div');
                title.className = 'card-title';
                title.innerHTML = '<span class="dot"></span>';
                title.append(s.name);
                const desc = document.createElement('div');
                desc.className = 'card-desc';
                desc.textContent = s.card;
                const prog = document.createElement('div');
                prog.className = 'card-progress';
                const label = document.createElement('span');
                label.textContent = `${done}/${s.total} chapters`;
                prog.append(progressBar(s.color, done, s.total), label);
                card.append(title, desc, prog);
                grid.appendChild(card);
                shown++;
            });
            document.getElementById('moreEmpty').classList.toggle('hidden', shown > 0);
            document.getElementById('moreSub').textContent = q
                ? `${shown} of ${list.length} subjects match your search`
                : `${list.length} subjects Â· ${totalChapters} chapters Â· key terms, exam tips and practice questions`;
        }
        document.getElementById('moreSearch').addEventListener('input', renderMoreSubjects);
        renderMoreSubjects();

        function renderFocusPill(f) {
            const pill = document.getElementById('focusPill');
            const idle = !f.running && f.remaining == null;
            pill.classList.toggle('hidden', idle);
            if (!idle) {
                const s = Math.ceil(f.remainingMs / 1000);
                pill.textContent = `${f.running ? 'â—' : 'âšâš'} ${f.label} ${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
            }
            document.getElementById('focusLink').textContent = idle ? 'Start a focus session' : f.running ? 'Timer running Â· open' : 'Timer paused Â· resume';
        }

        function renderRemindButton() {
            const mode = P.notificationMode();
            const btn = document.getElementById('remindBtn');
            btn.classList.toggle('on', mode !== 'off');
            btn.textContent = mode === 'off' ? 'Enable reminders' : mode === 'system' ? 'Reminders on' : 'Reminders on (in page)';
        }

        document.getElementById('remindBtn').addEventListener('click', async () => {
            if (P.notificationMode() !== 'off') { P.disableReminders(); renderRemindButton(); return; }
            const mode = await P.enableReminders();
            renderRemindButton();
            P.toast('Reminders on', mode === 'system'
                ? 'You will get notifications for tasks, exams and classes while OLPW is open.'
                : 'Browser notifications are blocked here, so reminders will pop up inside OLPW pages while they are open.');
        });

        P.theme.mountPicker(document.getElementById('themeBtn'));
        P.onChange(renderToday);
        P.focus.onChange(renderFocusPill);
        P.onStatus((s, label) => {
            const pill = document.getElementById('syncPill');
            pill.textContent = label;
            pill.className = 'sync-pill ' + (s === 'synced' ? 'ok' : (s === 'syncing' || s === 'connecting') ? 'busy' : '');
        });
        setInterval(renderToday, 60000);
