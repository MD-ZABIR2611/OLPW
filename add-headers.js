// OLPW:add-headers.js | script for add-headers
const fs = require('fs');
const path = require('path');
const root = __dirname;

const dirs = ['', 'css', 'js', 'curriculum', 'night-flyer'];
const exts = new Set(['.css', '.js', '.html']);
const modified = [];

for (const d of dirs) {
    const dir = path.join(root, d);
    for (const f of fs.readdirSync(dir)) {
        const ext = path.extname(f).toLowerCase();
        if (!exts.has(ext)) continue;
        const p = path.join(dir, f);
        if (!fs.statSync(p).isFile()) continue;
        const rel = d ? d + '/' + f : f;
        let content = fs.readFileSync(p, 'utf8');
        const marker = 'OLPW:' + rel;
        if (content.includes(marker)) continue;
        const base = f.replace(/\.(css|js|html)$/i, '');
        if (ext === '.css') {
            content = '/* ' + marker + ' | styles for ' + base + ' */\n' + content;
        } else if (ext === '.js') {
            content = '// ' + marker + ' | script for ' + base + '\n' + content;
        } else {
            if (/^<!DOCTYPE html>/i.test(content)) {
                content = content.replace(/^<!DOCTYPE html>/i, '<!DOCTYPE html>\n<!-- ' + marker + ' | ' + base + ' -->');
            } else {
                content = '<!-- ' + marker + ' | ' + base + ' -->\n' + content;
            }
        }
        fs.writeFileSync(p, content);
        modified.push(rel);
    }
}

// untracked night-flyer assets with no commentable format
for (const f of ['icon.svg', 'manifest.json']) {
    const p = path.join(root, 'night-flyer', f);
    if (fs.existsSync(p)) modified.push('night-flyer/' + f);
}

fs.writeFileSync(path.join(root, 'header-manifest.json'), JSON.stringify(modified, null, 1));
console.log(JSON.stringify({ modified: modified.length }));
