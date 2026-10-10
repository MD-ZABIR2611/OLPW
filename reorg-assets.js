// OLPW:reorg-assets.js | script for reorg-assets
const fs = require('fs');
const path = require('path');
const root = __dirname;

const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const htmlBases = new Set(htmlFiles.map(f => f.replace(/\.html$/i, '')));

fs.mkdirSync(path.join(root, 'css'), { recursive: true });
fs.mkdirSync(path.join(root, 'js'), { recursive: true });

const manifest = { css: [], js: [], html: [] };

// Pass 1: move per-page assets (only when a matching .html exists)
for (const f of htmlFiles) {
    const base = f.replace(/\.html$/i, '');
    const cssFrom = path.join(root, base + '.css');
    const cssTo = path.join(root, 'css', base + '.css');
    if (fs.existsSync(cssFrom)) {
        fs.renameSync(cssFrom, cssTo);
        manifest.css.push(base + '.css');
    }
    const jsFrom = path.join(root, base + '.js');
    const jsTo = path.join(root, 'js', base + '.js');
    if (fs.existsSync(jsFrom)) {
        fs.renameSync(jsFrom, jsTo);
        manifest.js.push(base + '.js');
    }
}

// Pass 2: rewrite links in every root html (handles own + any cross references)
const linkRe = /(href|src)=(["'])([^"':\s\/][^"']*\.(?:css|js))\2/gi;
for (const f of htmlFiles) {
    const p = path.join(root, f);
    let html = fs.readFileSync(p, 'utf8');
    const orig = html;
    html = html.replace(linkRe, (whole, attr, quote, ref) => {
        let name = ref;
        if (name.startsWith('./')) name = name.slice(2);
        if (name.includes('/')) return whole; // already folder-qualified or external path
        if (name.endsWith('.css')) {
            if (fs.existsSync(path.join(root, 'css', name)) && !fs.existsSync(path.join(root, name))) {
                return `${attr}=${quote}css/${name}${quote}`;
            }
        } else if (name.endsWith('.js')) {
            if (fs.existsSync(path.join(root, 'js', name)) && !fs.existsSync(path.join(root, name))) {
                return `${attr}=${quote}js/${name}${quote}`;
            }
        }
        return whole;
    });
    if (html !== orig) {
        fs.writeFileSync(p, html);
        manifest.html.push(f);
    }
}

fs.writeFileSync(path.join(root, 'reorg-manifest.json'), JSON.stringify(manifest, null, 1));
const rootCount = fs.readdirSync(root).filter(f => fs.statSync(path.join(root, f)).isFile()).length;
console.log(JSON.stringify({
    cssMoved: manifest.css.length,
    jsMoved: manifest.js.length,
    htmlUpdated: manifest.html.length,
    rootFilesNow: rootCount,
    cssDir: fs.readdirSync(path.join(root, 'css')).length,
    jsDir: fs.readdirSync(path.join(root, 'js')).length
}));
