// OLPW:inject-meta.js | script for inject-meta
const fs = require('fs');
const path = require('path');
const root = __dirname;
let updated = 0;
for (const f of fs.readdirSync(root)) {
  if (!f.endsWith('.html')) continue;
  const p = path.join(root, f);
  let html = fs.readFileSync(p, 'utf8');
  if (/name=["']description["']/i.test(html)) continue;
  const m = html.match(/<title>([^<]*)<\/title>/i);
  const title = m ? m[1].replace(/\s+/g, ' ').trim() : 'OLPW';
  const desc = title ? `OLPW — ${title}. Free O-Level revision notes, quiz questions and study tools.` : 'OLPW — Free O-Level revision notes, quiz questions and study tools.';
  const tag = `<meta name="description" content="${desc.replace(/"/g, '&quot;')}">`;
  if (/<meta charset[^>]*>/i.test(html)) {
    html = html.replace(/<meta charset[^>]*>/i, (s) => s + '\n' + tag);
  } else if (/<head>/i.test(html)) {
    html = html.replace(/<head>/i, (s) => s + '\n' + tag);
  } else continue;
  fs.writeFileSync(p, html);
  updated++;
}
console.log('injected meta description into', updated, 'files');
