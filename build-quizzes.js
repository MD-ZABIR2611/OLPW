#!/usr/bin/env node
/* Batch build for OLPW chapter pages:
   1. extract key terms/definitions from each page's own study material
   2. generate a self-assessment quiz (MCQ + fill-in-the-blank, seeded shuffle)
   3. insert <section id="quiz"> after the exam/practice section, renumber later sections
   4. add "Self-Assessment" to the sidebar navigation
   5. consistency fixes: SVG fills -> currentColor, orange -> brand green, Oswald/Roboto -> Inter
   Usage: node build-quizzes.js [--apply]  (default is a dry run for files passed after flags) */
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/ASUS/Desktop/OLPW';
const APPLY = process.argv.includes('--apply');
const onlyArg = process.argv.find(a => a.startsWith('--only'));
const ONLY = (onlyArg ? onlyArg.slice('--only'.length + 1) : '').split(',').filter(Boolean);
const INTER_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
const OLD_FONTS = ['Oswald', 'Roboto Condensed', 'Barlow Condensed', 'Archivo Black', 'Space Grotesk'];
const STOP = new Set(('mistake,correction,mistakes,question,questions,answer,answers,note,notes,aim,method,calculation,example,examples,step,steps,tip,tips,hint,warning,accept,marks,mark,formula,formulae,command,command words,state,describe,explain,define,definition,definitions,term,terms,key term,key terms,overview,objectives,theory,diagram,diagrams,practical,technique,revision,checklist,recap,summary,introduction,result,total,debit,credit side,working,substitution,you,they,it,this,that').split(','));

/* hand-curated quizzes for pages too thin to mine for terms (content matches the page) */
const OVERRIDES = {
    'physics-chapter4.html': [
        { type: 'mcq', q: 'Which term matches this definition? \u201CThe mass per unit volume of a substance, measured in kilograms per cubic meter (kg/m\u00B3) or grams per cubic centimeter (g/cm\u00B3).\u201D', options: ['Density', 'Volume', 'Mass', 'Pressure'], answer: 'Density' },
        { type: 'fib', q: 'Fill in the blank: \u201Cdensity (\u03C1) = ______ (m) / volume (V)\u201D', answer: 'mass', accept: ['mass'] },
        { type: 'mcq', q: 'To find the density of an irregular solid, you measure its mass and then find its volume using\u2026', options: ['the displacement method', 'a ruler only', 'a balance', 'a thermometer'], answer: 'the displacement method' },
        { type: 'mcq', q: 'Which pair of units could be used to state a density value?', options: ['kg/m\u00B3 and g/cm\u00B3', 'N/kg and Pa', 'm/s\u00B2 and J', 'Pa and N/m'], answer: 'kg/m\u00B3 and g/cm\u00B3' },
        { type: 'fib', q: 'Fill in the blank: in the equation \u201Cdensity (\u03C1) = mass (m) / volume (V)\u201D, the symbol \u03C1 stands for ______.', answer: 'density', accept: ['density'] }
    ],
    'physics-chapter9.html': [
        { type: 'mcq', q: 'Which term matches this definition? \u201CForce applied perpendicular to a surface per unit area, measured in Pascals (Pa).\u201D', options: ['Pressure', 'Force', 'Area', 'Density'], answer: 'Pressure' },
        { type: 'fib', q: 'Fill in the blank: \u201Cpressure (p) = ______ (F) / area (A)\u201D', answer: 'force', accept: ['force'] },
        { type: 'mcq', q: 'Which formula gives the pressure at depth h in a liquid?', options: ['p = \u03C1 \u00D7 g \u00D7 h', 'p = \u03C1 \u00D7 h / g', 'p = g / (\u03C1 \u00D7 h)', 'p = \u03C1 + g + h'], answer: 'p = \u03C1 \u00D7 g \u00D7 h' },
        { type: 'fib', q: 'Fill in the blank: \u201CPressure is force applied perpendicular to a surface per unit area, measured in ______ (Pa).\u201D', answer: 'Pascals', accept: ['Pascals', 'Pascal', 'pa'] },
        { type: 'mcq', q: 'As depth in a liquid increases, the liquid pressure\u2026', options: ['increases', 'decreases', 'stays the same', 'becomes zero'], answer: 'increases' }
    ]
};
const files = fs.readdirSync(DIR).filter(f => /^[\w-]+-chapter\d+\.html$/.test(f))
    .filter(f => !ONLY.length || ONLY.includes(f)).sort();

/* ---------- seeded RNG ---------- */
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function seededShuffle(arr, rnd) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- term extraction ---------- */
function clean(s) { return s.replace(/\s+/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim(); }
function normTerm(s) { return clean(s).toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim(); }
const STOP_RE = /^(the|a|an|his|her|its|their)\b/i;

function stripTags(s) { return clean(String(s).replace(/<[^>]+>/g, ' ')); }
function extractTerms(html) {
    const out = [];
    function add(term, def) {
        term = stripTags(term); def = stripTags(def).replace(/[.;,]+$/, '');
        const n = normTerm(term);
        if (!n || n.length > 40 || term.length < 2) return;
        if (STOP.has(n) || STOP_RE.test(term) || /^\d+$/.test(n)) return;
        if (def.length < 12 || def.length > 320) return;
        if (out.some(t => normTerm(t.term) === n)) return;
        out.push({ term, def });
    }
    // scoped: definitions / key terms sections first
    const sectionRe = /<section id="(?:definitions|terms|key-terms)"[^>]*>([\s\S]*?)<\/section>/gi;
    let m, scoped = '';
    while ((m = sectionRe.exec(html))) scoped += m[1];
    const scope = scoped || html;
    const strongRe = /<(?:strong|b)[^>]*>\s*([^<:\n]{2,48}?)\s*:?\s*<\/(?:strong|b)>\s*([^<]{15,400})/gi;
    while ((m = strongRe.exec(scope))) add(m[1], m[2]);
    if (out.length < 4) {
        const rowRe = /<tr>\s*<td[^>]*>([\s\S]{2,120}?)<\/td>\s*<td[^>]*>([\s\S]{10,600}?)<\/td>\s*<\/tr>/gi;
        while ((m = rowRe.exec(scope))) {
            if (/^term$|^keyword/i.test(stripTags(m[1]))) continue;
            add(m[1], m[2]);
        }
    }
    return out;
}

/* ---------- question generation ---------- */
function makeQuestions(terms, pool, rnd) {
    const qs = [];
    const typeable = t => /^[\x20-\x7E]+$/.test(t.term);
    /* direction 1: given the definition, pick the term */
    function mcqQ(t) {
        let distractors = terms.filter(o => normTerm(o.term) !== normTerm(t.term)).map(o => o.term);
        if (distractors.length < 3) {
            const extras = seededShuffle(pool.filter(p => normTerm(p.term) !== normTerm(t.term) && !terms.includes(p)), rnd)
                .slice(0, 3 - distractors.length).map(p => p.term);
            distractors = distractors.concat(extras);
        }
        const options = seededShuffle([t.term].concat(seededShuffle(distractors, rnd).slice(0, 3)), rnd);
        return { type: 'mcq', q: 'Which term matches this definition? \u201C' + t.def + '\u201D', options, answer: t.term };
    }
    /* direction 2: given the term, pick the correct definition (concept recall) */
    function revQ(t) {
        let distractors = terms.filter(o => normTerm(o.term) !== normTerm(t.term)).map(o => o.def);
        if (distractors.length < 3) {
            const extras = seededShuffle(pool.filter(p => normTerm(p.term) !== normTerm(t.term) && !terms.includes(p)), rnd)
                .slice(0, 3 - distractors.length).map(p => p.def);
            distractors = distractors.concat(extras);
        }
        const options = seededShuffle([t.def].concat(seededShuffle(distractors, rnd).slice(0, 3)), rnd);
        return { type: 'mcq', q: 'Which statement correctly defines \u201C' + t.term + '\u201D?', options, answer: t.def };
    }
    function fibQ(t) {
        const re = new RegExp('\\b' + t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        const q = re.test(t.def)
            ? 'Fill in the blank: \u201C' + t.def.replace(re, '______') + '\u201D'
            : 'Fill in the blank \u2014 which key term is being defined? \u201C' + t.def + '\u201D';
        return { type: 'fib', q, answer: t.term, accept: [t.term] };
    }
    const order = seededShuffle(terms, rnd);
    /* allocation per page (robust bank): up to 4 forward + 4 reverse MCQs + 3 FIBs + 4 written,
       reusing terms across DIFFERENT question types (recognition vs recall are distinct skills) */
    const nFwd = Math.min(4, order.length);
    const fwd = order.slice(0, nFwd);
    for (const t of fwd) qs.push(mcqQ(t));
    const revOrder = seededShuffle(order, rnd);
    const nRev = Math.min(4, order.length);
    const rev = revOrder.slice(0, nRev);
    for (const t of rev) qs.push(revQ(t));
    const fibPool = seededShuffle(order.filter(typeable), rnd);
    const fibs = fibPool.slice(0, 3);
    for (const t of fibs) qs.push(fibQ(t));
    const used = new Set(fwd.concat(rev, fibs).map(t => normTerm(t.term)));
    /* extra forward MCQs if the page is rich (caps the scored bank at 11) */
    for (const t of order) {
        if (qs.length >= 11) break;
        if (!used.has(normTerm(t.term))) { qs.push(mcqQ(t)); used.add(normTerm(t.term)); }
    }
    /* written/structured practice with model answers (recall, not recognition);
       on term-thin pages, reuse terms so every chapter gets written practice */
    let written = 0;
    for (const t of order) {
        if (written >= 4 || qs.length >= 15) break;
        if (used.has(normTerm(t.term))) continue;
        used.add(normTerm(t.term));
        qs.push({ type: 'written', q: 'Written practice: Explain what is meant by \u201C' + t.term + '\u201D. (2 marks)', answer: t.def });
        written++;
    }
    for (const t of order) {
        if (written >= 3) break;
        qs.push({ type: 'written', q: 'Written practice: Define \u201C' + t.term + '\u201D without looking, then check your wording. (2 marks)', answer: t.def });
        written++;
    }
    /* every scored MCQ needs its answer among the options */
    return qs;
}

/* ---------- html surgery ---------- */
function svgFixes(html) {
    return html.replace(/<svg[\s\S]*?<\/svg>/gi, (svg) => svg
        .replace(/fill="#(?:E0E0E0|FFFFFF|fff|F8F8F8)"/gi, 'fill="currentColor"')
        .replace(/stroke="#(?:FFFFFF|fff|E0E0E0)"/gi, 'stroke="currentColor"')
        .replace(/((?:fill|stroke)="#)FF5E00(")/gi, '$116A34A$2')
        .replace(/font-family="Oswald"/gi, 'font-family="Inter, system-ui, sans-serif"'));
}
function fontFixes(html) {
    for (const f of OLD_FONTS) {
        const esc = f.replace(' ', '\\s+');
        html = html.replace(new RegExp("(font-family\\s*:\\s*)['\"]?" + esc + "['\"]?[^;}\"']*;", 'gi'), "$1'Inter',system-ui,sans-serif;");
        html = html.replace(new RegExp("(font-family\\s*:\\s*)['\"]?" + esc + "['\"]?[^;}\"']*(?=[\"}\\n])", 'gi'), "$1'Inter',system-ui,sans-serif");
    }
    html = html.replace(/https:\/\/fonts\.googleapis\.com\/css2\?[^"']*/g, (u) =>
        /Oswald|Barlow|Roboto/i.test(u) ? INTER_URL : u);
    return html;
}
function findAnchor(html) {
    for (const id of ['exam', 'practice', 'quiz']) {
        const i = html.indexOf('<section id="' + id + '"');
        if (i >= 0) return { index: i, end: html.indexOf('</section>', i) + '</section>'.length, id, secStart: i };
    }
    for (const id of ['checklist', 'recap']) {
        const i = html.indexOf('<section id="' + id + '"');
        if (i >= 0) return { index: i, end: i, id, secStart: i, before: true };
    }
    const last = html.lastIndexOf('</section>');
    return { index: last, end: last + '</section>'.length, id: null, secStart: -1 };
}
function sectionNumber(html, anchor) {
    const secSnip = anchor.secStart >= 0 ? html.slice(anchor.secStart, anchor.secStart + 800) : '';
    let m = secSnip.match(/<span class="(?:sec-num|section-num)">\s*(?:SECTION\s+)?(\d{1,2})/i);
    if (m) return parseInt(m[1], 10) + 1;
    m = secSnip.match(/SECTION\s+(\d{1,2})/i);
    if (m) return parseInt(m[1], 10) + 1;
    let max = 0;
    const res = [/<span class="(?:sec-num|section-num)">(\d+)<\/span>/g,
                 /<span class="section-num">[^<]*?SECTION\s+(\d{1,2})[^<]*?<\/span>/gi];
    for (const re of res) while ((m = re.exec(html))) max = Math.max(max, parseInt(m[1], 10));
    return max + 1;
}
function bumpNumbers(html, from) {
    let head = html.slice(0, from), tail = html.slice(from);
    tail = tail.replace(/SECTION\s+(\d{1,2})(\s*—)/gi, (mm, d, dash) => 'SECTION ' + String(parseInt(d, 10) + 1).padStart(2, '0') + dash);
    tail = tail.replace(/(<span class="sec-num">)(\d+)(<\/span>)/g, (mm, a, d, b) => a + (parseInt(d, 10) + 1) + b);
    tail = tail.replace(/(<span class="section-num">)(\d+)(<\/span>)/g, (mm, a, d, b) => a + (parseInt(d, 10) + 1) + b);
    return head + tail;
}
function addSidebarLink(html, anchorEnd, quizId) {
    const link = '<li><a href="#' + quizId + '">Self-Assessment</a></li>';
    if (html.includes('href="#' + quizId + '"')) return html;
    let m = html.match(/(\s*)<li><a href="#(?:checklist|recap)"[^>]*>\s*[^<]*<\/a><\/li>/i);
    if (m && m.index > anchorEnd - 5000) return html.replace(m[0], '\n' + m[1] + link + m[0]);
    m = html.match(/<li><a href="#(?:exam|practice|quiz)"[^>]*>\s*[^<]*<\/a><\/li>(\s*)/i);
    if (m) return html.replace(m[0], m[0] + '\n' + (m[1] || '').replace(/\S/g, ' ') + link);
    return html;
}

/* ---------- pass 1: collect terms + subject pools ---------- */
const pages = [];
const pools = {};
for (const f of files) {
    const html = fs.readFileSync(path.join(DIR, f), 'utf8');
    const subject = f.replace(/-chapter\d+\.html$/, '');
    const terms = extractTerms(html);
    (pools[subject] = pools[subject] || []).push(...terms);
    pages.push({ f, html, subject, terms });
}

/* ---------- pass 2: generate + apply ---------- */
const REGEN = process.argv.includes('--regen');
let inserted = 0, skipped = [], svgTouched = 0, fontTouched = 0, regenerated = 0;
for (const p of pages) {
    const rnd = mulberry32(hash(p.f));
    let html = p.html;
    const already = html.includes('olpw-quiz-data');
    const questions = OVERRIDES[p.f] || (p.terms.length >= 2 ? makeQuestions(p.terms, pools[p.subject], rnd) : null);
    const json = JSON.stringify(questions).replace(/</g, '\\u003c');
    const quizId = /<section id="quiz"/.test(html) ? 'quiz-sa' : 'quiz';

    if (REGEN && already && questions) {
        const dataRe = /(<script type="application\/json" id="olpw-quiz-data">)[\s\S]*?(<\/script>)/;
        if (!dataRe.test(html)) throw new Error('quiz data tag malformed in ' + p.f);
        html = html.replace(dataRe, (m, p1, p2) => p1 + json + p2);
        regenerated++;
    }

    if (!already && questions) {
        const anchor = findAnchor(html);
        const hasLabel = /class="section-label"/.test(html);
        const hasSecNum = /<span class="sec-num">/.test(html);
        const secNumSample = (html.match(/<span class="section-num">([^<]*)<\/span>/) || [])[1];
        const hasSectionNum = secNumSample != null;
        const wrapContainer = /<section id="(?:definitions|terms|exam|practice|theory|simulation|quiz)"[^>]*>\s*<div class="container">/.test(html);
        const num = sectionNumber(html, anchor);
        const pad = html.match(/\n(\s*)<section id="(?:exam|practice|checklist|recap|simulation|quiz)"/);
        const ind = pad ? pad[1] : '                    ';
        let labelHtml;
        if (hasLabel) labelHtml = '<span class="section-label">SECTION ' + String(num).padStart(2, '0') + ' \u2014 SELF-ASSESSMENT</span>\n' + ind + '    <h2>Self-Assessment Quiz</h2>';
        else if (hasSecNum) labelHtml = '<div class="sec-head"><span class="sec-num">' + String(num).padStart(2, '0') + '</span><h2>Self-Assessment Quiz</h2></div>';
        else if (hasSectionNum) labelHtml = '<div class="section-header"><span class="section-num">' + (/SECTION/i.test(secNumSample) ? 'SECTION ' + String(num).padStart(2, '0') : String(num).padStart(2, '0')) + '</span><h2 class="section-title">Self-Assessment Quiz</h2></div>';
        else labelHtml = '<h2>Self-Assessment Quiz</h2>';
        const inner = ind + '    ' + labelHtml + '\n' +
            ind + '    <div class="olpw-quiz-root"></div>\n' +
            ind + '    <script type="application/json" id="olpw-quiz-data">' + json + '</scr' + 'ipt>\n';
        const block = '\n\n' + ind + '<section id="' + quizId + '">\n' +
            (wrapContainer ? ind + '    <div class="container">\n' + inner + ind + '    </div>\n' : inner) +
            ind + '</section>';
        html = bumpNumbers(html, anchor.end);
        // re-insert: everything before anchor.end + block + rest
        html = html.slice(0, anchor.end) + block + html.slice(anchor.end);
        html = addSidebarLink(html, anchor.end, quizId);
        inserted++;
    } else if (!already) {
        skipped.push(p.f + ' (' + p.terms.length + ' terms)');
    }

    const before = html;
    html = svgFixes(html);
    if (html !== before) svgTouched++;
    const b2 = html;
    html = fontFixes(html);
    if (html !== b2) fontTouched++;

    if (APPLY && html !== p.html) fs.writeFileSync(path.join(DIR, p.f), html);
    console.log((APPLY ? '[write] ' : '[dry]   ') + p.f + ' | terms: ' + p.terms.length + ' | quiz: ' + (already ? 'already-present' : (questions ? 'inserted (' + questions.length + ' q)' : 'SKIPPED')));
}
console.log('\nfiles: ' + pages.length + ' | quizzes ' + (APPLY ? 'inserted into ' : 'would insert into ') + inserted + ' | skipped: ' + skipped.length);
if (skipped.length) console.log('skipped -> ' + skipped.join(', '));
console.log('svg-fixed: ' + svgTouched + ' | font-fixed: ' + fontTouched + ' | quiz-data regenerated: ' + regenerated);
