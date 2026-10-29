// Build: source/ (raw crawl of www.adtsolution.com) -> site/ (black brand theme)
// Usage: node tools/build.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { recolorCss, recolorHtml } from './recolor.mjs';
import { typeCss, typeHtml } from './typography.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'source');
const OUT = path.join(ROOT, 'site');
const ORIGIN = 'https://www.adtsolution.com';
const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'pages-index.json'), 'utf8'));

const CONTENT_FIXES = [
  // developer note left in the EOR / PEO service pages
  [" (Preview links below use this site's clean-URL convention; the underlying 30 pages haven't been built yet, so they will 404 until then.)", ''],
  ["(Preview links below use this site's clean-URL convention; the underlying 30 pages haven't been built yet, so they will 404 until then.)", ''],
  // duplicated phrase on talent-mobility-services
  ['salaries were actually paid — salaries were actually paid.', 'salaries were actually paid.'],
  // 3D reach globe (EOR / PEO pages): a calm grey palette instead of black land + orange arcs.
  // Reach countries in mid grey with crisp white borders; hub, markers and arcs in ink.
  ["OCEAN = '#f8f1e3', LAND = '#efe4cf'", "OCEAN = '#f6f6f7', LAND = '#e4e4e7'"],
  ["strokeStyle = 'rgba(210,170,110,.4)'", "strokeStyle = 'rgba(17,17,17,.06)'"],
  ["strokeStyle = 'rgba(180,140,90,.45)'", "strokeStyle = 'rgba(255,255,255,.95)'"],
  ["REACH_COUNTRIES.has(feature.properties.name) ? '#f28a1a' : LAND", "REACH_COUNTRIES.has(feature.properties.name) ? '#a1a1aa' : LAND"],
  ['MeshBasicMaterial({ color: 0x172033 })', 'MeshBasicMaterial({ color: 0x111111 })'],
  ['MeshBasicMaterial({ color: 0x172033, transparent: true, opacity: 0.5,', 'MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.35,'],
  ['MeshBasicMaterial({ color: 0xf28a1a })', 'MeshBasicMaterial({ color: 0x3f3f46 })'],
  ['LineBasicMaterial({ color: 0xf28a1a, transparent: true, opacity: 0.25 })', 'LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.18 })'],
  ['MeshBasicMaterial({ color: 0xffd28a })', 'MeshBasicMaterial({ color: 0x111111 })'],
];

// stylesheets of the blog / post template use blue-violet as their accent: treat it like the brand orange
const BLOG_CSS = /\/user\/css\//;

const fileFor = p => (p === '/' ? 'index' : p.slice(1).replace(/[^a-zA-Z0-9\/\-_.]/g, '_')) + '.html';

// page path -> output file (relative to site/)
const pageFile = new Map();
for (const [p, v] of Object.entries(index)) {
  if (v.status === 200 && fs.existsSync(path.join(SRC, fileFor(p)))) pageFile.set(p, fileFor(p));
}
for (const [p, v] of Object.entries(index)) {          // redirects -> their target page
  if (!pageFile.has(p) && v.final && pageFile.has(v.final)) pageFile.set(p, pageFile.get(v.final));
}

const decode = s => s.replace(/&amp;/g, '&');
const abs = (u, base = ORIGIN + '/') => { try { return new URL(decode(u), base).href; } catch { return u; } };

function localPage(href) {
  const h = decode(href);
  let u; try { u = new URL(h, ORIGIN + '/'); } catch { return null; }
  if (!/^(www\.)?adtsolution\.com$/.test(u.hostname)) return null;
  let p = u.pathname; try { p = decodeURIComponent(p); } catch { } if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  const f = pageFile.get(p); return f ? { f, hash: u.hash } : null;
}

// ---------- stylesheet localisation ----------
const cssCache = new Map();   // absolute URL -> local path relative to site/
const fontCache = new Map();
const shouldLocalise = u => /^https?:\/\/(www\.)?adtsolution\.com\//.test(u) || /cdn\.jsdelivr\.net\/.*select2/.test(u);

async function get(url, binary) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!r.ok) return null;
      return binary ? Buffer.from(await r.arrayBuffer()) : await r.text();
    } catch { }
  }
  return null;
}

async function localFont(url) {
  if (fontCache.has(url)) return fontCache.get(url);
  const name = 'assets/fonts/' + path.basename(new URL(url).pathname);
  const buf = await get(url, true);
  const res = buf ? name : url;
  if (buf) { fs.mkdirSync(path.join(OUT, 'assets/fonts'), { recursive: true }); fs.writeFileSync(path.join(OUT, name), buf); }
  fontCache.set(url, res); return res;
}

async function rewriteCssUrls(css, base, fromDir) {
  const jobs = [];
  css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => { jobs.push(u); return m; });
  const map = {};
  for (const u of jobs) {
    if (/^(data:|#)/.test(u)) continue;
    const a = abs(u, base);
    if (/\.(woff2?|ttf|otf|eot)(\?|#|$)/i.test(a) && /adtsolution\.com/.test(a)) {
      const l = await localFont(a.split(/[?#]/)[0]);
      map[u] = l.startsWith('http') ? l : path.posix.relative(fromDir, l);
    } else map[u] = a;
  }
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => map[u] ? `url("${map[u]}")` : m);
}

async function localCss(url) {
  const key = url.split('#')[0];
  if (cssCache.has(key)) return cssCache.get(key);
  const p = (async () => {
    const txt = await get(key);
    if (txt == null) return null;
    const u = new URL(key);
    const name = 'assets/css/' + (u.hostname.includes('adtsolution') ? '' : u.hostname.replace(/\./g, '_') + '__') +
      u.pathname.replace(/^\/+/, '').replace(/\//g, '__');
    let css = await rewriteCssUrls(txt, key, 'assets/css');
    css = typeCss(recolorCss(css, { accentBlue: BLOG_CSS.test(key) }));
    fs.mkdirSync(path.join(OUT, 'assets/css'), { recursive: true });
    fs.writeFileSync(path.join(OUT, name), css);
    return name;
  })();
  cssCache.set(key, p); return p;
}

// ---------- page transform ----------
async function buildPage(rel) {
  let html = fs.readFileSync(path.join(SRC, rel), 'utf8');
  const depth = rel.split('/').length - 1;
  const pre = depth ? '../'.repeat(depth) : '';
  const fromDir = path.posix.dirname(rel);

  // pages with <base href="/"> use root-relative-by-base asset paths ("images/x.webp", "js/form.js");
  // the base tag has to go (it would break local links), so resolve those paths against the origin
  const hasBase = /<base\s+href=["']\/["']\s*\/?>/i.test(html);
  html = html.replace(/<base\s+href=["']\/["']\s*\/?>/i, '');
  if (hasBase) {
    const fixRel = u => { const t = u.trim(); return !t || /^([a-z][\w+.-]*:|\/|#)/i.test(t) ? t : ORIGIN + '/' + t; };
    html = html.replace(/(\s(?:src|data-src|data-bg|data-background|poster|data-lazy|data-original)=)(["'])([^"']*)\2/gi,
      (m, a, q, u) => a + q + fixRel(u) + q);
    html = html.replace(/(\s(?:srcset|data-srcset)=)(["'])([^"']*)\2/gi,
      (m, a, q, v) => a + q + v.split(',').map(s => { const [u, ...d] = s.trim().split(/\s+/); return [fixRel(u), ...d].join(' '); }).join(', ') + q);
    html = html.replace(/<link\b[^>]*>/gi, tag => tag.replace(/(\shref=)(["'])([^"']*)\2/i, (m, a, q, u) => a + q + fixRel(u) + q));
    // background images in style="" attributes, e.g. style="background-image:url('images/privacy_banner.webp')"
    html = html.replace(/url\(\s*(&quot;|['"]?)(?!\s*(?:data:|[a-z][\w+.-]*:|\/|#))([^'")&]+)\1\s*\)/gi,
      (m, q, u) => `url(${q}${fixRel(u)}${q})`);
  }

  // content slips on the live site that should never reach visitors
  for (const [from, to] of CONTENT_FIXES) html = html.split(from).join(to);

  // strip third-party analytics so local previews do not report fake traffic
  html = html.replace(/<script[^>]*src=["'][^"']*(googletagmanager|hs-scripts|hs-analytics|clarity\.ms|hotjar)[^"']*["'][^>]*>\s*<\/script>/gi, '');
  // only small standalone snippets (GTM bootstrap, gtag config) — never the site's loader scripts
  html = html.replace(/<script\b[^>]*>((?:(?!<\/script>)[\s\S])*?)<\/script>/gi,
    (m, body) => body.length < 900 && /gtm\.start|gtag\('config'|clarity\(|hotjar/.test(body) ? '' : m);
  html = html.replace(/<noscript>(?:(?!<\/noscript>)[\s\S])*?googletagmanager(?:(?!<\/noscript>)[\s\S])*?<\/noscript>/gi, '');

  // Google Fonts sheets for non-Inter text families (Poppins, Playfair): the site is set in Inter only
  html = html.replace(/<link\b[^>]*href=["'][^"']*fonts\.googleapis\.com\/css2?\?family=[^"']*["'][^>]*>/gi,
    tag => /family=(Poppins|Playfair)/i.test(tag) && !/Inter|Material/i.test(tag) ? '' : tag);

  // stylesheets -> local recoloured copies
  const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => m[0]);
  for (const tag of new Set(linkTags)) {
    const isStyle = /rel=["']?[^"'>]*stylesheet/i.test(tag) || /as=["']?style/i.test(tag);
    const isFont = /as=["']?font/i.test(tag);
    const hm = tag.match(/href=(["'])([^"']+)\1/i); if (!hm) continue;
    const url = abs(hm[2]);
    let local = null;
    if (isStyle && shouldLocalise(url)) local = await localCss(url);
    else if (isFont && /adtsolution\.com/.test(url)) local = await localFont(url.split('?')[0]);
    if (local && !local.startsWith('http')) {
      const nt = tag.replace(hm[0], `href="${path.posix.relative(fromDir, local)}"`);
      html = html.split(tag).join(nt);
    }
  }

  // inline <style>: fonts local, other root-relative urls absolute
  html = await (async () => {
    const parts = []; let last = 0;
    for (const m of html.matchAll(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi)) {
      parts.push(html.slice(last, m.index), m[1], await rewriteCssUrls(m[2], ORIGIN + '/', fromDir), m[3]);
      last = m.index + m[0].length;
    }
    parts.push(html.slice(last)); return parts.join('');
  })();

  // root-relative asset paths inside inline scripts (dynamic loaders):
  // stylesheets -> local recoloured copies, everything else -> live origin
  html = await (async () => {
    const parts = []; let last = 0;
    for (const m of html.matchAll(/(<script\b(?![^>]*\bsrc=)[^>]*>)([\s\S]*?)(<\/script>)/gi)) {
      let js = m[2];
      const found = [...new Set([...js.matchAll(/(['"`])(\/(?!\/)[^'"`\s]*?\.(?:css|js|webp|png|jpe?g|svg|gif|mp3|mp4|woff2?)(?:\?[^'"`\s]*)?)\1/g)].map(x => x[2]))];
      for (const u of found) {
        let rep = ORIGIN + u;
        if (/\.css(\?|$)/.test(u)) { const l = await localCss(abs(u)); if (l) rep = path.posix.relative(fromDir, l); }
        else if (/\.woff2?(\?|$)/.test(u)) { const l = await localFont(abs(u).split('?')[0]); if (!l.startsWith('http')) rep = path.posix.relative(fromDir, l); }
        js = js.split(`'${u}'`).join(`'${rep}'`).split(`"${u}"`).join(`"${rep}"`).split('`' + u + '`').join('`' + rep + '`');
      }
      parts.push(html.slice(last, m.index), m[1], js, m[3]);
      last = m.index + m[0].length;
    }
    parts.push(html.slice(last)); return parts.join('');
  })();

  // internal page links -> local files
  html = html.replace(/<a\b[^>]*>/gi, tag => tag.replace(/(\shref=)(["'])([^"']*)\2/i, (m, a, q, h) => {
    if (/^(#|mailto:|tel:|javascript:)/i.test(h)) return m;
    const lp = localPage(h);
    if (lp) return a + q + path.posix.relative(fromDir, lp.f) + lp.hash + q;
    return a + q + (h.startsWith('/') ? abs(h) : h) + q;
  }));

  // remaining root-relative / protocol-relative asset references -> live origin
  html = html.replace(/(\s(?:src|href|data-src|data-bg|data-background|poster|action|data-lazy|data-original)=)(["'])(\/[^"']*)\2/gi,
    (m, a, q, u) => a + q + (u.startsWith('//') ? 'https:' + u : ORIGIN + u) + q);
  html = html.replace(/(\s(?:srcset|data-srcset)=)(["'])([^"']*)\2/gi,
    (m, a, q, v) => a + q + v.replace(/(^|,\s*)(\/[^\s,]+)/g, (mm, s, u) => s + (u.startsWith('//') ? 'https:' + u : ORIGIN + u)) + q);
  html = html.replace(/url\((['"]?)(\/(?!\/)[^'")]+)\1\)/g, (m, q, u) => `url(${q}${ORIGIN}${u}${q})`);

  // cookie consent: local Klaro copy + host-independent config (the live config pins the consent
  // cookie to the parent domain, which fails on other hosts, so the banner would never go away)
  html = html.replace(/https:\/\/www\.adtsolution\.com\/js\/(?:klaro\/)?klaro-config\.min\.js(?:\?[^'"]*)?/g, `${pre}assets/theme/klaro-config.js`);
  html = html.replace(/https:\/\/www\.adtsolution\.com\/js\/(?:klaro\/)?klaro(?:\.min)?\.js/g, `${pre}assets/theme/klaro.min.js`);

  html = typeHtml(recolorHtml(html, { accentBlue: /user__css__main\.css/.test(html) }));

  // theme layer
  html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="${pre}assets/theme/mono.css">\n</head>`);
  html = html.replace(/<html\b([^>]*)>/i, (m, a) => /class=/.test(a) ? m.replace(/class=(["'])/, 'class=$1mono-js ') : `<html${a} class="mono-js">`);
  html = html.replace(/<\/body>(?![\s\S]*<\/body>)/i, `<script src="${pre}assets/theme/mono.js" defer></script>\n</body>`);

  const out = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); e.isDirectory() ? walk(f) : f.endsWith('.html') && files.push(path.relative(SRC, f).split(path.sep).join('/')); } })(SRC);
const only = process.argv[2];
const list = only ? files.filter(f => f.includes(only)) : files;
let n = 0;
for (let i = 0; i < list.length; i += 12) {
  await Promise.all(list.slice(i, i + 12).map(f => buildPage(f).catch(e => console.error('FAIL', f, e.message))));
  n += list.slice(i, i + 12).length; if (n % 120 < 12) console.log(`built ${n}/${list.length}`);
}
console.log(`done: ${list.length} pages, ${cssCache.size} stylesheets, ${fontCache.size} fonts`);
