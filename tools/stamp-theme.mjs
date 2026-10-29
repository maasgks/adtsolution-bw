// Cache-busting: append ?v=<content hash> to every reference to the theme files in the built pages,
// so browsers fetch a new copy whenever a theme file changes (GitHub Pages caches assets for 10 min).
// Usage: node tools/stamp-theme.mjs [siteDir]   (run by the Pages workflow before upload)
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SITE = path.resolve(process.argv[2] || 'site');
const FILES = ['mono.css', 'mono.js', 'klaro-config.js', 'klaro.min.js'];
const hash = f => crypto.createHash('sha1').update(fs.readFileSync(path.join(SITE, 'assets/theme', f))).digest('hex').slice(0, 10);
const stamps = FILES.filter(f => fs.existsSync(path.join(SITE, 'assets/theme', f))).map(f => ({
  re: new RegExp(`(assets/theme/${f.replace(/\./g, '\\.')})(\\?v=[0-9a-f]+)?(["'])`, 'g'),
  v: hash(f),
}));

let pages = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'assets') walk(f); continue; }
    if (!f.endsWith('.html')) continue;
    const before = fs.readFileSync(f, 'utf8');
    let html = before;
    for (const s of stamps) html = html.replace(s.re, `$1?v=${s.v}$3`);
    if (html !== before) { fs.writeFileSync(f, html); pages++; }
  }
})(SITE);
console.log(`stamped ${pages} pages:`, stamps.map(s => s.v).join(' '));
