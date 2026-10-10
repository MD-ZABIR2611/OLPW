// OLPW:build-more.js | script for build-more
#!/usr/bin/env node
/* Build expansion chapters (15+) for OLPW subjects at 14 chapters.
   Reads curriculum data from curriculum/<slug>.js (CommonJS module):
     module.exports = { chapters: [ { n, title, card, lead,
       concepts: [5-6 strings], terms: [{t,d} x6-8], tip,
       questions: [{lvl,ask,ans} x2-3] } ] }
   For each chapter:
     1. write <slug>-chapter<n>.html in the accounting-chapter15 template
     2. append a card to the subject hub (compact card for more-subjects,
        study-card for math.html / cs.html)
   Then patches subjects.js (more subjects) or chapters.js (core maths/cs)
   so planners and the dashboard count the new chapters.
   Usage: node build-more.js [--apply] [--force] [--only=slug1,slug2] */
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/ASUS/Desktop/OLPW';
const CURR = path.join(DIR, 'curriculum');
const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');
const onlyArg = process.argv.find(a => a.startsWith('--only='));
const ONLY = (onlyArg ? onlyArg.slice('--only='.length) : '').split(',').filter(Boolean);

const pad2 = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* keep currency/math symbols; just neutralize characters that break HTML */
const escq = s => esc(s);

function loadWindowJSON(file) {
    let s = fs.readFileSync(path.join(DIR, file), 'utf8');
    const m = s.match(/^([\s\S]*?window\.\w+\s*=)\s*/);
    if (!m) throw new Error('no window assignment in ' + file);
    const prefix = m[1];
    const json = s.slice(m[0].length).trim().replace(/;\s*$/, '');
    return { prefix, data: JSON.parse(json) };
}
function writeWindowJSON(file, prefix, data) {
    fs.writeFileSync(path.join(DIR, file), prefix + JSON.stringify(data, null, 4) + ';\n');
}

/* ---------- template (mirrors accounting-chapter15.html) ---------- */
const HEAD_CSS = `
<style>
:root{--bg:#0a0a0a;--bg-2:#0f0f0f;--card:#131313;--card-hi:#1c1c1c;--line:#232323;--line-2:#2e2e2e;--text:#f2f2f2;--muted:#b4b8bc;--dim:#6a6a6a;--orange:#ff5a1f;--orange-2:#ff7a3a;--tint:rgba(255,90,31,.07);--shadow:0 20px 50px rgba(0,0,0,.45);--nav:rgba(10,10,10,.86)}
html[data-theme="light"]{--bg:#FFF8F1;--bg-2:#FFF1E4;--card:#ffffff;--card-hi:#FFF6EC;--line:#F1DFCB;--line-2:#E8D2BA;--text:#2B1D12;--muted:#6B5443;--dim:#A08A76;--orange:#EA580C;--orange-2:#F97316;--tint:rgba(234,88,12,.08);--shadow:0 12px 30px rgba(120,72,30,.08);--nav:rgba(255,248,241,.92)}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh;transition:background .25s,color .25s;background-image:radial-gradient(ellipse 80% 50% at 50% 0%,var(--tint),transparent 60%)}
a{color:inherit;text-decoration:none}
h1,h2,h3,.oswald{font-family:'Inter',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.5px}
nav.top{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 32px;background:var(--nav);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.brand{display:flex;flex-direction:column;line-height:1}
.brand b{font-family:'Inter',system-ui,sans-serif;font-size:20px;letter-spacing:1px}
.brand b i{color:var(--orange);font-style:normal}
.brand span{font-family:'Inter',system-ui,sans-serif;font-size:10px;letter-spacing:3px;color:var(--orange);text-transform:uppercase;margin-top:4px}
.nav-links{display:flex;align-items:center;gap:22px;font-family:'Inter',system-ui,sans-serif;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted)}
.nav-links a:hover{color:var(--orange)}
.nav-right{display:flex;align-items:center;gap:10px}
.chip{font-family:'Inter',system-ui,sans-serif;font-size:12px;letter-spacing:1.5px;padding:6px 12px;border:1px solid var(--line-2);color:var(--text);white-space:nowrap}
.theme-btn{font-family:'Inter',system-ui,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;padding:7px 12px;background:transparent;color:var(--text);border:1px solid var(--line-2);cursor:pointer;white-space:nowrap}
.theme-btn:hover{border-color:var(--orange);color:var(--orange)}
.wrap{max-width:1180px;margin:0 auto;padding:0 32px}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font-family:'Inter',system-ui,sans-serif;text-transform:uppercase;letter-spacing:4px;font-size:11px;color:var(--orange);padding:8px 14px;border:1px solid var(--orange);background:var(--tint)}
.back{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',system-ui,sans-serif;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:var(--muted);margin-bottom:26px}
.back:hover{color:var(--orange)}
.bar{height:8px;background:var(--bg-2);border:1px solid var(--line);overflow:hidden}
.bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--orange),var(--orange-2));transition:width .6s ease}
footer{border-top:1px solid var(--line);padding:34px 32px;text-align:center;font-family:'Inter',system-ui,sans-serif;font-size:11px;letter-spacing:3px;color:var(--dim);text-transform:uppercase;margin-top:60px}
@media(max-width:760px){nav.top{padding:12px 16px}.nav-links{display:none}.wrap{padding:0 16px}}

.hero{padding:70px 0 50px;border-bottom:1px solid var(--line)}
.hero h1{font-size:clamp(34px,6vw,68px);line-height:1;margin:22px 0 18px;font-weight:700}
.hero h1 span{color:var(--orange)}
.hero p.lead{font-size:18px;color:var(--muted);max-width:760px}
.meta{display:grid;grid-template-columns:repeat(4,1fr);margin-top:36px;border:1px solid var(--line);background:var(--card)}
.meta div{padding:18px 20px;border-right:1px solid var(--line)}
.meta div:last-child{border-right:none}
.meta b{display:block;font-family:'Inter',system-ui,sans-serif;font-size:30px;line-height:1}
.meta small{font-family:'Inter',system-ui,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--dim)}
section{padding:56px 0;border-bottom:1px solid var(--line)}
.sec-head{display:flex;align-items:baseline;gap:16px;margin-bottom:28px}
.sec-num{font-family:'Inter',system-ui,sans-serif;font-size:14px;color:var(--orange);border:1px solid var(--orange);padding:2px 8px;letter-spacing:2px}
.sec-head h2{font-size:clamp(24px,3.4vw,38px)}
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.concept{display:grid;grid-template-columns:48px 1fr;gap:14px;padding:22px;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);transition:border-color .2s,transform .2s}
.concept:hover{border-color:var(--orange);transform:translateY(-2px)}
.concept .n{font-family:'Inter',system-ui,sans-serif;font-size:28px;color:var(--orange);line-height:1}
.concept p{color:var(--text)}
table.terms{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line)}
table.terms th{text-align:left;padding:14px 18px;font-family:'Inter',system-ui,sans-serif;letter-spacing:2px;text-transform:uppercase;font-size:12px;color:var(--orange);background:var(--bg-2);border-bottom:1px solid var(--line)}
table.terms td{padding:14px 18px;border-bottom:1px solid var(--line);vertical-align:top}
table.terms tr:last-child td{border-bottom:none}
table.terms td:first-child{font-weight:600;color:var(--orange);width:28%}
.tip{display:flex;gap:18px;padding:24px;border:1px solid var(--orange);background:var(--tint)}
.tip b{font-family:'Inter',system-ui,sans-serif;color:var(--orange);letter-spacing:2px;text-transform:uppercase;white-space:nowrap}
.q{padding:22px;background:var(--card);border:1px solid var(--line);margin-bottom:16px}
.q .lvl{display:inline-block;font-family:'Inter',system-ui,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:3px 8px;border:1px solid var(--orange);color:var(--orange);margin-bottom:10px}
.q p.ask{font-size:17px;font-weight:500}
.reveal{margin-top:14px;font-family:'Inter',system-ui,sans-serif;letter-spacing:1.5px;text-transform:uppercase;font-size:13px;padding:9px 18px;background:transparent;color:var(--orange);border:1px solid var(--orange);cursor:pointer}
.reveal:hover{background:var(--orange);color:#fff}
.ans{display:none;margin-top:14px;padding-top:14px;border-top:1px solid var(--line);color:var(--muted)}
.ans.on{display:block}
.ans b{font-family:'Inter',system-ui,sans-serif;color:var(--orange);letter-spacing:1.5px;text-transform:uppercase;font-size:12px;display:block;margin-bottom:4px}
.finish{text-align:center;padding:64px 0}
.finish h2{font-size:clamp(28px,4vw,46px);margin-bottom:18px}
.complete-btn{font-family:'Inter',system-ui,sans-serif;letter-spacing:2px;text-transform:uppercase;font-size:15px;padding:14px 30px;background:var(--orange);color:#fff;border:1px solid var(--orange);cursor:pointer}
.complete-btn.done{background:transparent;color:var(--orange)}
.pager{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px}
.pager a{display:block;padding:18px 20px;border:1px solid var(--line);background:var(--card)}
.pager a:hover{border-color:var(--orange)}
.pager small{font-family:'Inter',system-ui,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--dim)}
.pager b{display:block;font-family:'Inter',system-ui,sans-serif;font-size:17px;text-transform:uppercase}
.pager .next{text-align:right}
.pager .empty{visibility:hidden}
@media(max-width:760px){.meta{grid-template-columns:repeat(2,1fr)}.meta div:nth-child(2){border-right:none}.meta div:nth-child(-n+2){border-bottom:1px solid var(--line)}.grid-2{grid-template-columns:1fr}.tip{flex-direction:column;gap:8px}.pager{grid-template-columns:1fr}.hero{padding:44px 0 36px}}
</style>`;

function pageHtml(ch, slug, name, total, prevTitle, isLast) {
    const key = `${slug}-chapter-${pad2(ch.n)}`;
    const concepts = ch.concepts.map((c, i) =>
        `        <div class="concept"><span class="n">${pad2(i + 1)}</span><p>${esc(c)}</p></div>`).join('\n');
    const terms = ch.terms.map(t =>
        `            <tr><td>${esc(t.t)}</td><td>${esc(t.d)}</td></tr>`).join('\n');
    const questions = ch.questions.map(q =>
        `    <div class="q"><span class="lvl">${escq(q.lvl)}</span>\n` +
        `        <p class="ask">${esc(q.ask)}</p>\n` +
        `        <button class="reveal" onclick="toggleAnswer(this)">Reveal answer</button>\n` +
        `        <div class="ans"><b>Model answer</b>${esc(q.ans)}</div>\n    </div>`).join('\n');
    const next = isLast
        ? `        <a class="next" href="${slug}.html"><small>Finished &rarr;</small><b>Back to all chapters</b></a>`
        : `        <a class="next" href="${slug}-chapter${ch.n + 1}.html"><small>Next &rarr;</small><b>${esc(ch.nextTitle || '')}</b></a>`;
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OLPW / ${esc(name)} / Chapter ${ch.n} / ${esc(ch.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="olpw-site.js"></script>
${HEAD_CSS}
<link rel="icon" type="image/png" href="assets/logo-64.png">
<link rel="apple-touch-icon" href="assets/logo-192.png">
<link rel="stylesheet" href="olpw-site.css">
</head>
<body>
<nav class="top">
    <a class="brand" href="${slug}.html"><b>OLPW<i>.</i></b><span>${esc(name)}</span></a>
    <div class="nav-links"><a href="index.html">Dashboard</a><a href="${slug}.html">Chapters</a><a href="planner.html">Planner</a></div>
    <div class="nav-right"><span class="chip">CH ${ch.n} / ${total}</span></div>
</nav>
<div class="wrap">
<div class="hero">
    <a class="back" href="${slug}.html">&larr; ${esc(name)} chapters</a><br>
    <span class="eyebrow">Chapter ${ch.n} &middot; ${esc(name)}</span>
    <h1>${esc(ch.title)}</h1>
    <p class="lead">${esc(ch.lead)}</p>
    <div class="meta">
        <div><b>${pad2(ch.concepts.length)}</b><small>Key concepts</small></div>
        <div><b>${pad2(ch.terms.length)}</b><small>Key terms</small></div>
        <div><b>${pad2(ch.questions.length)}</b><small>Practice questions</small></div>
        <div><b id="statusNum">&mdash;</b><small>Your status</small></div>
    </div>


<section id="concepts">
    <div class="sec-head"><span class="sec-num">01</span><h2>Key Concepts</h2></div>
    <div class="grid-2">
${concepts}
    </div>
</section>

<section id="terms">
    <div class="sec-head"><span class="sec-num">02</span><h2>Key Terms</h2></div>
    <table class="terms">
        <thead><tr><th>Term</th><th>Exam definition</th></tr></thead>
        <tbody>
${terms}
        </tbody>
    </table>
</section>

<section id="tip">
    <div class="sec-head"><span class="sec-num">03</span><h2>Exam Tip</h2></div>
    <div class="tip"><b>Exam tip</b><p>${esc(ch.tip)}</p></div>
</section>

<section id="practice">
    <div class="sec-head"><span class="sec-num">04</span><h2>Practice Questions</h2></div>
    <div class="prose"><h3 style="margin:0 0 14px;font-size:18px">Structured practice &mdash; write your answer, then reveal the model.</h3></div>
${questions}
</section>

<div class="finish">
    <h2>Chapter complete?</h2>
    <button class="complete-btn" id="completeBtn" onclick="toggleComplete()">Mark complete</button>
    <div class="pager">
        <a href="${slug}-chapter${ch.n - 1}.html"><small>&larr; Previous</small><b>${esc(prevTitle)}</b></a>
${next}
    </div>
</div>
</div>
<footer>&copy; OLPW &middot; IGCSE / O-Level ${esc(name)} &middot; Built for serious exam preparation</footer>
<script>
var KEY = '${key}';
function toggleAnswer(btn){var a=btn.nextElementSibling;var on=a.classList.toggle('on');btn.textContent=on?'Hide answer':'Reveal answer';}
function renderComplete(){var done=localStorage.getItem(KEY)==='true';var b=document.getElementById('completeBtn');b.classList.toggle('done',done);b.textContent=done?'Completed \\u2713':'Mark complete';document.getElementById('statusNum').textContent=done?'Done':'To do';}
function toggleComplete(){if(localStorage.getItem(KEY)==='true')localStorage.removeItem(KEY);else localStorage.setItem(KEY,'true');renderComplete();}
renderComplete();
</script>
</body>
</html>
`;
}

/* ---------- hub card builders ---------- */
function cardGroupA(ch, slug) {
    return `    <a class="card" href="${slug}-chapter${ch.n}.html" data-key="${slug}-chapter-${pad2(ch.n)}">
        <span class="badge">Done &#10003;</span>
        <span class="num">Chapter ${pad2(ch.n)}</span>
        <h2>${esc(ch.title)}</h2>
        <p>${esc(ch.card)}</p>
        <span class="go">Open chapter &rarr;</span>
    </a>`;
}
function cardGroupB(ch, slug) {
    return `
            <!-- Chapter ${ch.n} -->
            <div class="study-card">
                <div class="card-header">
                    <span class="chapter-number">Chapter ${ch.n}</span>
                </div>
                <div class="card-content">
                    <h2 class="chapter-title">${esc(ch.title)}</h2>
                    <p>${esc(ch.card)}</p>
                </div>
                <a href="${slug}-chapter${ch.n}.html" class="resource-link">
                    Access Materials
                    <svg viewBox="0 0 24 24"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/></svg>
                </a>
            </div>`;
}

/* ---------- hub patching ---------- */
function patchHubGroupA(html, slug, newChapters) {
    const anchor = '<span class="go">Open chapter &rarr;</span>';
    if (!html.includes(anchor)) throw new Error(slug + '.html: go-anchor not found');
    const blocks = newChapters.filter(ch => !html.includes(`href="${slug}-chapter${ch.n}.html"`)).map(ch => cardGroupA(ch, slug));
    if (!blocks.length) return { html, added: 0 };
    const i = html.lastIndexOf(anchor);
    const ins = html.indexOf('</a>', i) + '</a>'.length;
    return { html: html.slice(0, ins) + '\n' + blocks.join('\n') + html.slice(ins), added: blocks.length };
}
function patchHubGroupB(html, slug, newChapters) {
    /* insert right after the last chapter study-card (the one holding "Chapter 14") */
    const marker = html.indexOf('>Chapter 14</span>');
    if (marker < 0) throw new Error(slug + '.html: chapter-14 card not found');
    const aEnd = html.indexOf('</a>', marker);
    const divEnd = html.indexOf('</div>', aEnd);
    const at = divEnd + '</div>'.length;
    const blocks = newChapters.filter(ch => !html.includes(`href="${slug}-chapter${ch.n}.html"`)).map(ch => cardGroupB(ch, slug));
    if (!blocks.length) return { html, added: 0 };
    return { html: html.slice(0, at) + blocks.join('\n') + html.slice(at), added: blocks.length };
}

/* ---------- validation ---------- */
function validate(slug, ch) {
    const problems = [];
    if (!ch.n || !ch.title || !ch.lead || !ch.card || !ch.tip) problems.push('missing n/title/lead/card/tip');
    if (!Array.isArray(ch.concepts) || ch.concepts.length < 5) problems.push('concepts < 5');
    if (!Array.isArray(ch.terms) || ch.terms.length < 6) problems.push('terms < 6');
    if (ch.terms && ch.terms.some(t => !t.t || !t.d || t.d.length < 15)) problems.push('term missing t/d or def too short');
    if (!Array.isArray(ch.questions) || ch.questions.length < 2) problems.push('questions < 2');
    if (ch.questions && ch.questions.some(q => !q.lvl || !q.ask || !q.ans)) problems.push('question missing lvl/ask/ans');
    for (const p of problems) console.log('  ! ' + slug + ' ch' + ch.n + ': ' + p);
    return !problems.length;
}

/* ---------- main ---------- */
const subjectsFile = loadWindowJSON('subjects.js');
const chaptersFile = loadWindowJSON('chapters.js');
const subjects = subjectsFile.data;
const core = chaptersFile.data;
const subjBySlug = Object.fromEntries(subjects.map(s => [s.slug, s]));
const CORE_CORE = { math: 'maths', cs: 'cs' };   /* file slug -> chapters.js key */
const GROUP_B = new Set(['math', 'cs']);

const dataFiles = fs.readdirSync(CURR).filter(f => f.endsWith('.js'))
    .filter(f => !ONLY.length || ONLY.includes(f.replace(/\.js$/, ''))).sort();
if (!dataFiles.length) { console.log('no curriculum data files found'); process.exit(0); }

let pagesWritten = 0, pagesSkipped = 0, hubCards = 0, dataPatched = 0;

for (const f of dataFiles) {
    const slug = f.replace(/\.js$/, '');
    const data = require(path.join(CURR, f));
    const isCore = !!CORE_CORE[slug];
    const meta = isCore ? null : subjBySlug[slug];
    if (!isCore && !meta) { console.log('!! unknown slug ' + slug + ' (not in subjects.js, not math/cs) — skipped'); continue; }
    const name = isCore ? (slug === 'math' ? 'Mathematics' : 'Computer Science') : meta.name;
    const existingTitles = isCore ? core[CORE_CORE[slug]].map(c => c.title) : meta.chapters.slice();
    const newChs = data.chapters.slice().sort((a, b) => a.n - b.n);
    if (!newChs.every(ch => validate(slug, ch))) { console.log('!! ' + slug + ': validation failed — fix data file'); continue; }
    const total = existingTitles.length + newChs.length;
    const hubFile = path.join(DIR, slug + '.html');

    console.log('\n== ' + slug + ' (' + name + '): chapters ' + newChs.map(c => c.n).join(',') + ' -> total ' + total);

    /* 1. pages */
    const allTitles = existingTitles.concat(newChs.map(c => c.title));
    for (let i = 0; i < newChs.length; i++) {
        const ch = newChs[i];
        ch.nextTitle = i + 1 < newChs.length ? newChs[i + 1].title : null;
        const file = path.join(DIR, `${slug}-chapter${ch.n}.html`);
        if (fs.existsSync(file) && !FORCE) { console.log('  [skip] ' + path.basename(file) + ' exists'); pagesSkipped++; continue; }
        const prevTitle = allTitles[ch.n - 2] || '';
        const isLast = ch.n === total;
        const html = pageHtml(ch, slug, name, total, prevTitle, isLast);
        if (APPLY) { fs.writeFileSync(file, html); console.log('  [write] ' + path.basename(file)); }
        else console.log('  [dry]   ' + path.basename(file));
        pagesWritten++;
    }

    /* 2. hub */
    if (fs.existsSync(hubFile)) {
        let hub = fs.readFileSync(hubFile, 'utf8');
        const r = GROUP_B.has(slug) ? patchHubGroupB(hub, slug, newChs) : patchHubGroupA(hub, slug, newChs);
        if (r.added) { if (APPLY) fs.writeFileSync(hubFile, r.html); console.log('  [' + (APPLY ? 'write' : 'dry') + '] hub ' + slug + '.html + ' + r.added + ' cards'); hubCards += r.added; }
        else console.log('  [skip] hub cards already present');
    } else console.log('  !! hub missing: ' + slug + '.html');

    /* 3. data files */
    if (isCore) {
        const list = core[CORE_CORE[slug]];
        for (const ch of newChs) {
            if (list.some(c => c.n === ch.n)) continue;
            list.push({ n: ch.n, title: ch.title, href: `${slug}-chapter${ch.n}.html`, key: `${slug}-chapter-${pad2(ch.n)}` });
            dataPatched++;
        }
        list.sort((a, b) => a.n - b.n);
    } else {
        for (const ch of newChs) {
            if (meta.chapters.includes(ch.title)) continue;
            meta.chapters.push(ch.title);
            dataPatched++;
        }
    }
}

if (APPLY) {
    writeWindowJSON('subjects.js', subjectsFile.prefix, subjects);
    writeWindowJSON('chapters.js', chaptersFile.prefix, core);
}
console.log('\nfiles: ' + dataFiles.length + ' | pages ' + (APPLY ? 'written: ' : 'would write: ') + pagesWritten +
    ' | skipped: ' + pagesSkipped + ' | hub cards: ' + hubCards + ' | data entries: ' + dataPatched + (APPLY ? '' : ' (dry run — pass --apply)'));
