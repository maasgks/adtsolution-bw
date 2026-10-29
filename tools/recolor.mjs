// Colour engine for the black edition: only the brand-orange family and near-black navies change.
//   solid orange          -> ink black (buttons, active tabs, highlights, icons)
//   light orange tints    -> neutral greys of the same lightness (card / section surfaces)
//   faint orange (a <= .2) -> kept as-is: these are the site's soft background glows,
//                            which become the edition's accent colour
//   near-black navy       -> neutral black of the same lightness (dark bands, footer, dark text)
// Every other colour (slate greys, blues, greens, imagery) stays exactly as on the live site.
// The deliberate orange accents are re-applied afterwards in site/assets/theme/mono.css.

const NAMED = {
  orange: '#ffa500', darkorange: '#ff8c00', sandybrown: '#f4a460', peru: '#cd853f', chocolate: '#d2691e',
  peachpuff: '#ffdab9', bisque: '#ffe4c4', papayawhip: '#ffefd5', moccasin: '#ffe4b5', navajowhite: '#ffdead',
};

const INK = 17;        // #111111  solid brand
const INK_DEEP = 31;   // #1f1f1f  darker brand shades (hover states, dark orange text)

const hex2 = n => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');

function hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s, l };
}

// Grey level 0..255 for a brand-family colour, or null to leave the colour untouched
export function toInk(r, g, b, a, opts = {}) {
  const { h, s, l } = hsl(r, g, b);
  // blog / post template: its blue-violet accent plays the role of the brand colour there
  if (opts.accentBlue && h >= 200 && h <= 275 && s > 0.45 && l >= 0.35)
    return l >= 0.8 ? 0.2126 * r + 0.7152 * g + 0.0722 * b : INK;
  // near-black navies (#101828 bands, footer, header strip, dark text) -> neutral black of same luminance
  if (h >= 195 && h <= 260 && s > 0.15 && l < 0.27) return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (!(h >= 18 && h <= 42 && s > 0.4)) return null;        // not orange / amber
  if (a !== undefined && a <= 0.2) return null;             // soft glow -> accent, keep
  if (l >= 0.6) return 0.2126 * r + 0.7152 * g + 0.0722 * b; // tints -> neutral of same luminance
  return l < 0.4 ? INK_DEEP : INK;
}

function fmt(gr, a) {
  const v = hex2(gr);
  if (a === undefined || a >= 1) return '#' + v + v + v;
  return `rgba(${Math.round(gr)},${Math.round(gr)},${Math.round(gr)},${+a.toFixed(3)})`;
}

function fromHex(h) {
  h = h.slice(1);
  if (h.length === 3 || h.length === 4) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : undefined;
  return { r, g, b, a };
}

export function mapHex(h, opts) {
  const { r, g, b, a } = fromHex(h);
  const gr = toInk(r, g, b, a, opts);
  return gr === null ? h : fmt(gr, a);
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

const HEX_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-zA-Z_-])/g;
const FN_RE = /\b(rgba?|hsla?)\(\s*([^()]*?)\s*\)/gi;
const NAMED_RE = new RegExp(`(:\\s*|\\s|,|\\()(${Object.keys(NAMED).join('|')})(?=\\s*(?:!important|;|\\}|\\)|,|\\s|$))`, 'gi');

// Recolour a CSS text (stylesheet, <style> block or style="" attribute value).
// opts.accentBlue: also treat vivid blue-violet as an accent (blog / post template)
export function recolorCss(css, opts = {}) {
  css = css.replace(FN_RE, (m, fn, args) => {
    const parts = args.split(/[\s,\/]+/).filter(Boolean);
    if (parts.length < 3 || parts.some(p => /var\(|calc|from/.test(p))) return m;
    let r, g, b; const a = parts[3] !== undefined ? (parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3])) : undefined;
    if (/^hsl/i.test(fn)) [r, g, b] = hslToRgb(parseFloat(parts[0]), parseFloat(parts[1]) / 100, parseFloat(parts[2]) / 100);
    else [r, g, b] = parts.slice(0, 3).map(p => p.endsWith('%') ? parseFloat(p) * 2.55 : parseFloat(p));
    if ([r, g, b].some(isNaN)) return m;
    const gr = toInk(r, g, b, a, opts);
    if (gr === null) return m;
    const v = Math.round(gr);
    return a === undefined ? `rgb(${v},${v},${v})` : `rgba(${v},${v},${v},${a})`;
  });
  css = css.replace(HEX_RE, h => mapHex(h, opts));
  css = css.replace(NAMED_RE, (m, pre, name) => {
    const hex = NAMED[name.toLowerCase()], out = mapHex(hex, opts);
    return out === hex ? m : pre + out;
  });
  return css;
}

// Recolour colour-bearing parts of an HTML document without touching anchors/ids/URLs.
export function recolorHtml(html, opts = {}) {
  html = html.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (m, a, css, c) => a + recolorCss(css, opts) + c);
  html = html.replace(/(\sstyle\s*=\s*)(["'])([\s\S]*?)\2/gi, (m, a, q, v) => a + q + recolorCss(v, opts) + q);
  html = html.replace(/(\s(?:fill|stroke|stop-color|color|bgcolor|flood-color|lighting-color)\s*=\s*)(["'])([^"']*)\2/gi,
    (m, a, q, v) => a + q + recolorCss(' ' + v, opts).slice(1) + q);
  // colour literals inside inline scripts (e.g. chart / slider configs): only quoted hex values
  html = html.replace(/(<script\b(?![^>]*type=["']application\/(?:ld\+)?json)[^>]*>)([\s\S]*?)(<\/script>)/gi,
    (m, a, js, c) => a + js.replace(/(['"])(#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3}))\1/g, (mm, q, h) => q + mapHex(h, opts) + q) + c);
  return html;
}
