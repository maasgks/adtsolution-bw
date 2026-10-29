# ADT Black — black brand edition of adtsolution.com

A re-skin of https://www.adtsolution.com (513 pages) where the brand orange `#de7909`
becomes black. Images, logos and every other colour stay exactly as on the live site.
Orange survives only as soft glows in background gradients and a few small accents.
Layout and element placement are identical to the live site.

## Run it

```bash
node serve.mjs          # http://localhost:5173
```

(Opening `site/index.html` directly also works, but the server gives clean URLs and
avoids browser `file://` restrictions.)

## Structure

| Path | What it is |
|---|---|
| `site/` | The built website: open/deploy this |
| `site/assets/theme/mono.css` | Theme layer: accent glows, small accents, hover states, transitions, reveal styles |
| `site/assets/theme/mono.js` | Scroll reveal, progress hairline, contrast guard |
| `site/assets/css/` | The site's stylesheets, with brand orange recoloured at build time |
| `source/` | Raw crawl of the live site (input to the build) |
| `tools/crawl.mjs` | Re-crawls the live site into `source/` |
| `tools/recolor.mjs` | Colour engine (brand-orange and near-black navy colours → black / neutral) |
| `tools/typography.mjs` | Inter everywhere + slightly smaller type scale (sizes above 16px × 0.89) |
| `tools/build.mjs` | `source/` → `site/` (recolour, localise CSS/fonts, rewrite links, inject theme) |

## How the colour mapping works

Near-black navies (`#101828` bands, footer, header strip, dark text) become neutral black of the
same lightness. Apart from that, only the orange / amber family (hue 18–42°, saturation > 40%) changes:

- Solid brand orange → ink `#111` (buttons, active tabs, highlights, inline SVG icons);
  darker shades → `#1f1f1f`.
- Light tints (e.g. `#fcf2e6` card backgrounds) → neutral grey of the same luminance (`#f3f3f3`-ish).
- Faint translucent orange (alpha ≤ 0.2) is kept: these are the site's background glows.
- Everything else (navy text, blues, greens, yellows), plus all images, videos and logos → untouched.

## Where orange remains (deliberately)

- **Background gradients:** soft glows on hero sections and the former peach panels.
  The former orange-gradient band is now black with a warm glow, and the marquee strip
  has a moving glint. Tune these with `--mono-glow` and `--mono-glow-dark`.
- **Small accents:** text selection · scroll-progress hairline · nav underline on hover/active ·
  active tab / slider dot ·
  keyboard focus ring and input focus glow · back-to-top hover · accent lines / small icon markers.

To change an accent, edit `--mono-accent` or the relevant rule in `mono.css`. No rebuild is needed.
Orange that is part of an image (photos, illustrations, the logo) is left as it is.

## Theme layer extras

- **Buttons:** solid black pills (`.mono-btn-ink`), white outlined pills (`.mono-btn-line`), and on dark
  backgrounds white pills (`.mono-btn-light`) or white outlines (`.mono-btn-ghost`). Pills are 48px tall.
  **Hover never changes colours:** an arrow slides in after the label (`arrows()` in `mono.js`).
  On auto-width buttons the label slides left inside the padding, so the button keeps its size (`.mono-arrow`).
  On stretched buttons the arrow grows in after the label (`.mono-arrow-inline`).
  Buttons that already have an arrow or icon are left alone.
  Tabs, filters, arrows and toggles keep their own styling. Active tabs are solid black.
- **Buttons on dark cards:** black buttons are inverted to white pills (`.mono-btn-light`), and outline buttons
  get a white outline (`.mono-btn-ghost`).
- **Polish pass (`mono.css` §7):** one hero H1 scale on every template, minimum spacing between headings
  and their copy, readable legal headings, a consistent header CTA, left-aligned blog copy, uncropped
  featured images, and no sideways scrolling on mobile.
- **Safety nets (`mono.js`):** reveals `.wow` blocks if WOW.js is missing or misses them, and hides
  broken-image icons. The blog template's blue-violet accent is recoloured like the brand orange
  (`accentBlue` in `recolor.mjs`). Relative `url()` paths on `<base href="/">` pages are resolved at build
  time, and two content slips are patched (`CONTENT_FIXES` in `build.mjs`).
- **Reach globe** (EOR / PEO pages): recoloured at build time (`CONTENT_FIXES` in `build.mjs`) to a grey palette:
  reach countries mid grey with white borders, and hub, markers and arcs in ink.
- **Marquee strip:** labels stay on one line.
- **Content width:** containers are capped at `--mono-content` (1140px; the live site uses up to 1400px).
- **Line length:** `mono.js` (`measure()`) tags any text block that runs nearly the full page width
  (over 920px, or over 800px when centred) and caps it at `--mono-measure` (760px), so lines stay
  around 75 characters. Centred intros stay centred under their heading. Text inside cards and
  columns is left alone. Legal pages (`.pricy_page`) are a single 860px reading column.
  Blog "Recent Blog" titles that are typed in capitals are shown in title case.
- **Footer:** near-black with warm glows, dark office cards, grey links that turn white on hover.
- **Motion:** hover and reveal effects use the `translate` / `scale` properties, never `transform`, so
  the site's own transforms (such as the centred mega menus) are never overridden.

## Rebuilding

```bash
node tools/crawl.mjs source   # optional: refresh content from the live site
node tools/build.mjs          # regenerate site/ (≈10 s)
node tools/build.mjs pricing  # rebuild only pages whose path contains "pricing"
```

Notes: analytics tags (GTM / HubSpot) are stripped so local previews don't send traffic
to the real dashboards. Forms and dynamic widgets still call the live site's scripts.
Motion respects `prefers-reduced-motion`.
