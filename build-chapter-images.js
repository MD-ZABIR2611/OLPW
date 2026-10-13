// OLPW:build-chapter-images.js | script for build-chapter-images
/* Generate a themed SVG banner for every chapter page and inject it above the <h1>.
   Deterministic and offline (no downloads): each banner uses the subject's colour,
   chapter number, title and a topic icon. Idempotent — re-running only touches
   pages that are missing their image. Usage: node build-chapter-images.js */
const fs = require('fs');
const path = require('path');
const DIR = __dirname;

const pad2 = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function loadWindowJSON(file) {
    const s = fs.readFileSync(path.join(DIR, file), 'utf8');
    const m = s.match(/^([\s\S]*?window\.\w+\s*=)\s*/);
    if (!m) throw new Error('no window assignment in ' + file);
    return JSON.parse(s.slice(m[0].length).trim().replace(/;\s*$/, ''));
}

/* ---------- catalogue: file-slug -> { name, color, chapters:[{n,title}] } ---------- */
const CORE_NAMES = { maths: 'Mathematics', physics: 'Physics', chemistry: 'Chemistry', biology: 'Biology', cs: 'Computer Science' };
const CORE_COLORS = { maths: '#F59E0B', physics: '#3B82F6', chemistry: '#A855F7', biology: '#22C55E', cs: '#06B6D4' };
const catalog = {};
try {
    Object.entries(loadWindowJSON('chapters.js')).forEach(([key, list]) => {
        const fileSlug = list.length ? list[0].href.replace(/-chapter\d+\.html$/, '') : key;
        catalog[fileSlug] = {
            name: CORE_NAMES[key] || key,
            color: CORE_COLORS[key] || '#64748B',
            chapters: list.map(c => ({ n: c.n, title: c.title }))
        };
    });
    loadWindowJSON('subjects.js').forEach(s => {
        catalog[s.slug] = { name: s.name, color: s.color, chapters: (s.chapters || []).map((t, i) => ({ n: i + 1, title: t })) };
    });
} catch (e) {
    console.warn('build-chapter-images: catalogue unavailable (' + e.message + ') — skipping');
    process.exit(0);
}

/* ---------- colour helpers ---------- */
function hexToRgb(c) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(c));
    if (!m) return [100, 116, 139];
    return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
}
function mix(a, b, t) {
    const A = hexToRgb(a), B = hexToRgb(b);
    return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

/* ---------- icon library (24x24 stroke paths) ---------- */
const ICONS = {
    pi: '<path d="M5 8h14"/><path d="M9 8v10M15 8v10"/>',
    atom: '<circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="9.5" ry="4"/><ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)"/>',
    flask: '<path d="M10 3h4M11 3v5l-5.5 9a2.4 2.4 0 0 0 2 3.6h9a2.4 2.4 0 0 0 2-3.6L13 8V3"/><path d="M8.5 14.5h7"/>',
    dna: '<path d="M8 3c0 6 8 6 8 12M16 3c0 6-8 6-8 12"/><path d="M8 21c0-2 8-2 8-4M16 21c0-2-8-2-8-4"/><path d="M9 7h6M9 11h6M9 15h6"/>',
    code: '<path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/><path d="M13 4l-3 16"/>',
    chart: '<path d="M4 4v16h16"/><path d="M7 15l4-5 3 3 5-7"/><path d="M15 6h4v4"/>',
    coins: '<ellipse cx="9" cy="6.5" rx="5" ry="2.3"/><path d="M4 6.5V12c0 1.3 2.2 2.3 5 2.3s5-1 5-2.3V6.5"/><ellipse cx="15" cy="14.5" rx="5" ry="2.3"/><path d="M10 14.5V20c0 1.3 2.2 2.3 5 2.3s5-1 5-2.3v-5.5"/>',
    bag: '<path d="M6 8h12l1.2 12H4.8L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 0-2 2V5z"/><path d="M19 17H6a2 2 0 0 0-2 2"/><path d="M9 7h6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3.6 3 14.4 0 18c-3-3.6-3-14.4 0-18"/>',
    curve: '<path d="M4 20c4 0 4-16 8-16s4 16 8 16"/>',
    bars: '<path d="M4 20V10M9 20V4M14 20V8M19 20V13"/>',
    chip: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.5 5.5l2 2M16.5 16.5l2 2M18.5 5.5l-2 2M7.5 16.5l-2 2"/>',
    people: '<circle cx="8.5" cy="8" r="3.2"/><path d="M3 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><circle cx="16" cy="9.5" r="2.6"/><path d="M15 15.5c2.8 0 5 1.8 5 4.5"/>',
    leaf: '<path d="M5 19C5 9 12 4 20 4c0 8-5 15-15 15z"/><path d="M5 19c3-6 7-9 11-11"/>',
    plane: '<path d="M3 12l18-8-4 9 4 8-18-8z"/><path d="M11 12l-2 2"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H14a2 2 0 0 1 0-4h4a3 3 0 0 0 3-3c0-3.5-4-6-9-6z"/><circle cx="8" cy="9" r="1.2"/><circle cx="12" cy="7" r="1.2"/><circle cx="7" cy="14" r="1.2"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
    apple: '<path d="M12 7c-1-2-3-3-5-2.5C4 5.5 3 9 4.5 13S9 21 12 20c3 1 6-3 7.5-7S20 5.5 17 4.5c-2-.5-4 .5-5 2.5z"/><path d="M12 7V4c0-1 .8-2 2-2"/>',
    heart: '<path d="M12 20s-7-4.3-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.7-9 9-9 9z"/><path d="M7 12h3l1.5-3 2 6 1.5-3h3"/>',
    scales: '<path d="M12 3v18M8 21h8M5 8h14"/><path d="M5 8l-2.5 5a3 3 0 0 0 5 0L5 8zM19 8l-2.5 5a3 3 0 0 0 5 0L19 8z"/><circle cx="12" cy="6" r="1.4"/>',
    crescent: '<path d="M15 3a9 9 0 1 0 6 15.5A9 9 0 0 1 15 3z"/><path d="M17 6l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    landmark: '<path d="M4 21h16M6 21v-9M10 21v-9M14 21v-9M18 21v-9M3 8l9-5 9 5v3H3z"/>',
    bolt: '<path d="M13 2L5 13h5l-1 9 8-11h-5l1-9z"/>',
    wave: '<path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/><path d="M3 17c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/>',
    prism: '<path d="M12 4l8 14H4l8-14z"/><path d="M12 4v14"/><path d="M4 18c2-5 6-6 8-6"/>',
    pen: '<path d="M4 20l1-4L16 5l3 3L8 19l-4 1z"/><path d="M14 7l3 3"/>'
};
const SUBJECT_ICONS = {
    math: 'pi', maths: 'pi', physics: 'atom', chemistry: 'flask', biology: 'dna', cs: 'code',
    economics: 'chart', accounting: 'coins', business: 'bag', commerce: 'scales',
    english: 'book', literature: 'pen', 'add-maths': 'curve', statistics: 'bars',
    geography: 'globe', history: 'landmark', ict: 'chip', sociology: 'people',
    environmental: 'leaf', 'global-perspectives': 'globe', 'bangladesh-studies': 'landmark',
    bangla: 'pen', islamiyat: 'crescent', 'travel-tourism': 'plane',
    'art-design': 'palette', 'design-technology': 'gear', 'food-nutrition': 'apple',
    'physical-education': 'heart'
};
const KEYWORD_ICONS = [
    [/light|optic|reflect|refract|lens|spectrum/i, 'prism'],
    [/electric|circuit|current|charge|static|magnet|power|energy/i, 'bolt'],
    [/wave|sound|ultra|echo/i, 'wave'],
    [/atom|nuclea|radio|isotope|electron/i, 'atom'],
    [/cell|genet|dna|evolut|inherit|reproduc|living|organism/i, 'dna'],
    [/plant|photosynth|ecolog|ecosystem|population|climate|environ/i, 'leaf'],
    [/acid|salt|organic|reaction|mole|compound|bond|periodic|metal|air|water|fibre/i, 'flask'],
    [/algebra|equation|graph|geometr|trigonometr|number|arithmetic|ratio|proportion|percent|statistic|probabilit|vector|calculu|function|sequence|inequal|logarithm|matrix|set theory|index/i, 'pi'],
    [/market|demand|supply|trade|econom|money|bank|inflation|fiscal|tax|growth|development|globalis|expenditure|income|exchange rate|bop/i, 'chart'],
    [/account|ledger|cash|journal|statement|profit|finance|budget|cost|break-even/i, 'coins'],
    [/business|marketing|mix|promotion|price|product|place|entrepreneur|stakeholder|management|recruit|motivat/i, 'bag'],
    [/data|algorithm|program|network|database|hardware|software|logic|binary|internet|system|robotic|model/i, 'code'],
    [/essay|poem|writing|comprehension|grammar|language|speaking|listen|narrative|prose|drama|summary|directed/i, 'book'],
    [/map|river|landform|weather|earthquake|volcano|urban|settlement|tourism|migration|vegetation|soil/i, 'globe'],
    [/war|revolution|empire|civilis|independen|constitution|government|law|right|political|reform|parliament|monarch|citizen|union|partition|language movement|liberation/i, 'scales'],
    [/design|art|colour|color|paint|draw|visual|texture|craft|graphic|ceramic/i, 'palette'],
    [/food|diet|nutrition|cook|health|hygiene|meal|kitchen/i, 'apple'],
    [/sport|fitness|muscle|training|athlete|movement|skill|outdoor|exercise/i, 'heart'],
    [/travel|transport|airport|hospitality|accommodation|customer|visitor|resort/i, 'plane']
];
function iconFor(slug, title) {
    for (const [re, name] of KEYWORD_ICONS) if (re.test(title)) return name;
    return SUBJECT_ICONS[slug] || 'book';
}

/* ---------- banner ---------- */
function svgFor(slug, meta, ch) {
    const c = meta.color;
    const bg1 = mix(c, '#ffffff', 0.82);
    const bg2 = mix(c, '#ffffff', 0.97);
    const ink = mix(c, '#0f172a', 0.74);
    const sub = mix(c, '#0f172a', 0.42);
    const icon = ICONS[iconFor(slug, ch.title)] || ICONS.book;
    const title = ch.title.length > 64 ? ch.title.slice(0, 61).trim() + '\u2026' : ch.title;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 240" width="960" height="240" role="img" aria-label="${esc(meta.name)} chapter ${ch.n} banner">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs>
<rect width="960" height="240" fill="url(#g)"/>
<circle cx="846" cy="36" r="170" fill="${c}" opacity="0.10"/>
<circle cx="918" cy="212" r="110" fill="${c}" opacity="0.12"/>
<circle cx="806" cy="196" r="7" fill="${c}" opacity="0.35"/>
<circle cx="742" cy="120" r="5" fill="${c}" opacity="0.28"/>
<rect x="46" y="56" width="128" height="128" rx="30" fill="#ffffff" opacity="0.72" stroke="${c}" stroke-opacity="0.35"/>
<g transform="translate(62,72) scale(4)" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icon}</g>
<text x="212" y="82" font-family="Inter, system-ui, sans-serif" font-size="15" letter-spacing="5" font-weight="700" fill="${sub}">${esc(meta.name.toUpperCase())}</text>
<text x="212" y="128" font-family="Inter, system-ui, sans-serif" font-size="44" font-weight="800" fill="${ink}">Chapter ${ch.n}</text>
<text x="212" y="164" font-family="Inter, system-ui, sans-serif" font-size="21" font-weight="600" fill="${ink}" opacity="0.85">${esc(title)}</text>
<text x="922" y="220" text-anchor="end" font-family="Inter, system-ui, sans-serif" font-size="13" letter-spacing="4" font-weight="700" fill="${c}" opacity="0.55">OLPW</text>
</svg>
`;
}

/* ---------- main ---------- */
const outDir = path.join(DIR, 'assets', 'chapters');
fs.mkdirSync(outDir, { recursive: true });
const pages = fs.readdirSync(DIR).filter(f => /^[\w-]+-chapter\d+\.html$/.test(f));
let imgs = 0, injected = 0, skipped = 0, unknown = 0;
for (const page of pages) {
    const m = page.match(/^(.+)-chapter(\d+)\.html$/);
    const slug = m[1], n = Number(m[2]);
    const meta = catalog[slug];
    if (!meta) { unknown++; console.log('  ? no catalogue entry for ' + page); continue; }
    const ch = meta.chapters.find(c => c.n === n);
    if (!ch) { unknown++; console.log('  ? chapter ' + n + ' not in data for ' + slug); continue; }
    const imgFile = 'assets/chapters/' + slug + '-' + pad2(n) + '.svg';
    const svg = svgFor(slug, meta, ch);
    const imgPath = path.join(DIR, imgFile);
    try {
        if (fs.readFileSync(imgPath, 'utf8') !== svg) { fs.writeFileSync(imgPath, svg); imgs++; }
    } catch { fs.writeFileSync(imgPath, svg); imgs++; }
    const htmlPath = path.join(DIR, page);
    const html = fs.readFileSync(htmlPath, 'utf8');
    if (html.includes('chapter-art')) { skipped++; continue; }
    const h1 = html.indexOf('<h1');
    if (h1 < 0) { console.log('  ? no <h1> in ' + page); continue; }
    const lineStart = html.lastIndexOf('\n', h1) + 1;
    const indent = html.slice(lineStart, h1);
    const tag = `${indent}<img class="chapter-art" src="${imgFile}" alt="${esc(meta.name)} \u2014 Chapter ${n}: ${esc(ch.title)}" width="960" height="240" loading="lazy" decoding="async" style="display:block;width:100%;max-width:960px;height:auto;border-radius:14px;margin:20px 0 6px;border:1px solid rgba(15,23,42,.10)">\n`;
    fs.writeFileSync(htmlPath, html.slice(0, lineStart) + tag + html.slice(lineStart));
    injected++;
}
console.log(`build-chapter-images: ${pages.length} pages | ${injected} banners injected | ${imgs} images written/updated | ${skipped} already had one | ${unknown} unknown`);
