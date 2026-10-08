const fs = require('fs');
const path = require('path');
const root = __dirname;
let changed = 0, skipped = 0;

function isJsScript(attrs) {
  if (/\bsrc\s*=/i.test(attrs)) return false;
  const m = attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i);
  if (!m) return true;
  return m[1].toLowerCase() === 'text/javascript' || m[1].toLowerCase() === 'module';
}

for (const f of fs.readdirSync(root)) {
  if (!f.endsWith('.html')) continue;
  const p = path.join(root, f);
  let html = fs.readFileSync(p, 'utf8');
  const styles = [];
  const scripts = [];
  let styleIdx = 0, scriptIdx = 0;

  html = html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (whole, body) => {
    styles.push(body.trim());
    return '';
  });

  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (whole, attrs, body) => {
    if (!isJsScript(attrs)) return whole;
    const trimmed = body.trim();
    if (!trimmed) return '';
    scripts.push({ attrs, body: trimmed });
    return '';
  });

  if (!styles.length && !scripts.length) { skipped++; continue; }

  const base = f.replace(/\.html$/i, '');
  if (styles.length) {
    const css = styles.join('\n\n') + '\n';
    fs.writeFileSync(path.join(root, base + '.css'), css);
    html = html.replace(/<\/head>/i, `<link rel="stylesheet" href="${base}.css">\n</head>`);
  }
  if (scripts.length) {
    const js = scripts.map(s => s.body).join('\n\n') + '\n';
    fs.writeFileSync(path.join(root, base + '.js'), js);
    // preserve module/defer/etc attributes from the first script block
    const m = scripts[0].attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i);
    const typeAttr = (m && m[1].toLowerCase() === 'module') ? ' type="module"' : '';
    html = html.replace(/<\/body>/i, `<script${typeAttr} src="${base}.js"></script>\n</body>`);
  }

  fs.writeFileSync(p, html);
  changed++;
}
console.log('extracted:', changed, 'skipped:', skipped);
