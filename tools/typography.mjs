// Typography pass: Inter everywhere, and a slightly smaller type scale.
//  - Text families that are not Inter (Poppins, Roboto, Georgia, Playfair, bare Arial...) become Inter.
//  - Every text stack gets a sans-serif fallback (a stack of only "Inter-Medium" falls back to Times
//    when the font is late), and font-display:optional becomes swap so Inter always shows up.
//  - Font sizes above 16px shrink by SCALE (20px body copy -> ~18px, 43px headings -> ~38px);
//    16px and smaller stay as they are so small print keeps its legibility.

const SCALE = 0.89;
const MIN_SCALED = 16;

const KEEP_FAMILY = /material|icon|awesome|slick|mono|courier|consolas|menlo|emoji|symbol/i;
const SWAP_FAMILY = /^(poppins|roboto|georgia|playfair display|helvetica|helvetica neue|arial|times new roman|times|serif)$/i;
const GENERIC = /^(sans-serif|serif|monospace|system-ui|-apple-system|cursive|fantasy|inherit|initial|unset|revert)$/i;

function fixStack(v) {
  const t = v.trim();
  if (!t || /var\(|^inherit$|^initial$|^unset$/i.test(t) || KEEP_FAMILY.test(t)) return v;
  const fams = t.split(',').map(s => s.trim()).filter(Boolean);
  const name = f => f.replace(/^["']|["']$/g, '');
  const out = [];
  fams.forEach((f, i) => {
    const n = name(f);
    if (SWAP_FAMILY.test(n) && (i === 0 || !/arial|helvetica/i.test(n))) out.push(n === 'serif' ? 'sans-serif' : "'Inter'");
    else out.push(f);
  });
  const dedup = out.filter((f, i) => out.findIndex(o => name(o).toLowerCase() === name(f).toLowerCase()) === i);
  if (!dedup.some(f => GENERIC.test(name(f)))) dedup.push('sans-serif');
  return (v.match(/^\s*/)[0]) + dedup.join(',');
}

const scalePx = v => v.replace(/(\d*\.?\d+)px/g, (m, n) => {
  n = parseFloat(n);
  return n <= MIN_SCALED ? m : +Math.max(MIN_SCALED, n * SCALE).toFixed(1) + 'px';
});

// font-size values (plain px or px inside clamp/min/max), also --*font-size* custom properties
const scaleSizes = css => css.replace(/((?:^|[\s;{"'])(?:font-size|--[\w-]*font-size[\w-]*)\s*:)([^;}"']*)/gi,
  (m, p, v) => p + scalePx(v));

export function typeCss(css) {
  css = css.replace(/font-display\s*:\s*optional/gi, 'font-display:swap');
  // font stacks held in custom properties (Bootstrap's system-ui / Segoe UI stack, page-level --font-family)
  css = css.replace(/(--bs-font-sans-serif\s*:)[^;}]*/gi, "$1Inter-Regular,'Inter',system-ui,-apple-system,sans-serif");
  css = css.replace(/(--[\w-]*font-family[\w-]*\s*:)([^;}]*)/gi, (m, p, v) => /var\(/.test(v) ? m : p + fixStack(v));
  // font-family declarations outside @font-face blocks
  css = css.replace(/(@font-face\s*\{[^}]*\})|(font-family\s*:)([^;}!"]*(?:"[^"]*"[^;}!"]*)*)/gi,
    (m, face, prop, val) => face ? face : prop + fixStack(val));
  return scaleSizes(css);
}

// <style> blocks and style="" attributes of a page
export function typeHtml(html) {
  html = html.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (m, a, css, c) => a + typeCss(css) + c);
  return html.replace(/(\sstyle\s*=\s*)(["'])([\s\S]*?)\2/gi, (m, a, q, v) =>
    a + q + scaleSizes(' ' + v.replace(/(font-family\s*:)([^;]*)/gi, (mm, p, val) => p + fixStack(val))).slice(1) + q);
}
