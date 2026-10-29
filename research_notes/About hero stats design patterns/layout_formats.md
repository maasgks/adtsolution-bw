# Layout formats for "About us" heroes combining photography and company stats (B2B SaaS, 2025–2026)

Research note: about 15 tool calls. Most sources are design blogs, vendor articles, and live pages of competitor About pages (Deel, Rippling) as fetched in October 2026. I found no primary, methodologically sound study of how often each hero+stats pattern is used. Usage percentages from trend blogs are flagged as unverified. Proportions, tile counts, and the 4-photo/4-stat recipe are mostly **inferences**, labelled as such, built from the cited grid specs.

---

## 1. Which hero+stats layout patterns do modern SaaS / fintech / HR-tech sites use most in 2025–2026, and which feel dated?

### Takeaway
The current mainstream is a **type-led hero (large headline, short mission line) followed by a separate stats element**: a full-width stat band/row or a bento module. Photography sits in its own block, not as a backdrop under the stats. Bento grids are described as "mainstream" in 2026. Direct HR/EOR competitors use simple, sequential layouts: Deel has a headline, one photo, a trust line, then a 4-stat block lower down; Rippling has a headline, a diagram, and no stat cards. I found **no source that explicitly calls floating stat cards over photo corners dated.** That claim rests on indirect evidence: generic hero imagery and the 2021 glassmorphism and floating-layer wave are described as past their peak.

### Cited Findings
- Line25 (April 2026) says oversized headlines "have replaced the stock hero image as the default attention-grabber for design-forward brands". Its typography table moves oversized type from "Peak" (2025) to "Normalizing" (2026). — [Line25, Web Design Trends 2026](https://line25.com/articles/web-design-trends-2026/)
- Line25 lists bento grids as "Mainstream" with 45% adoption, "best for product launches, feature pages, portfolios, marketing sites". It describes modules as "a self-contained story: a stat, a feature, a quote". The 45% figure cites "analysis of 10,000+ sites" with no methodology given, so treat it as **unverified**. — [Line25](https://line25.com/articles/web-design-trends-2026/)
- Another vendor claim says "67% of top-tier SaaS landing pages" use bento. It could not be traced to a primary study (**unverified**, and it conflicts with Line25's 45%). — [B12 guide](https://www.b12.io/resource-center/website-design/web-design-guide-bento-grids-and-kinetic-typography/)
- SaaSFrame's bento pattern library (labelled a "2026 design trend") lists 44+ SaaS companies using bento sections, including Vercel, WorkOS, Mercury, Attio, Cal.com, Dub, Payhawk, Customer.io, Mintlify, and Hugging Face. These are mostly feature sections, not About heroes. — [SaaSFrame bento-grid patterns](https://www.saasframe.io/patterns/bento-grid)
- Bento was popularized by Apple's product summary slides. Each compartment showcases one feature or point. — [SaaSFrame blog: The Bento Layout Trend](https://www.saasframe.io/blog/the-bento-layout-trend)
- **Deel /about (EOR competitor):** H1 "Work with the world" plus intro, **one hero photo**, then a trust line ("Trusted by 40,000+ companies… 175 stories") and a scrolling customer-logo strip. The main **four-stat block** comes much later in "The year it all clicked", paired with a photo: 40,000 businesses, $17.3B payments processed, 650,000+ workers hired, 150 countries. Exact visual format not confirmed. — [Deel About](https://www.deel.com/about/)
- **Rippling /about (HR competitor):** mission label plus H1 "We free smart people to work on hard problems", one CTA link, and a **platform diagram, not a photo**. No stat cards; figures ("600+ apps", "four continents") appear only in body copy. Leadership headshots follow. — [Rippling About](https://www.rippling.com/about)
- A Webstacks roundup of 16 B2B/SaaS About pages (last updated May 2026) shows that stats are usually a **separate section or early headline number**, not overlaid on photos. Examples: Calendly puts "20+ million" in the headline; Airtable shows 500,000 orgs and $1.36B funding in clean separated sections; Contentful shows 38,000+ developers and 110B API requests; Miro shows 80M+ users; Atlassian has a statistics section. Photo-led heroes: Surfe uses a large group photo; Clay uses team, office and event photos; ClickUp uses large team photos. — [Webstacks, 16 Best About Us Page Examples](https://www.webstacks.com/blog/about-us-page)
- Line25 calls the original glassmorphism wave "heavy-handed" and says it "peaked around 2021". Its 2026 "spatial design" favours "layered card compositions with realistic shadow casting", so layered cards are still live but in a restrained form. — [Line25](https://line25.com/articles/web-design-trends-2026/)
- 2026 trend pieces say rigid 12-column grids are loosening: sections overlap, images float off-axis, editorial "zine-style" asymmetric compositions appear. These are vendor/agency sources with light evidence. — [B12 layout ideas 2026](https://www.b12.io/resource-center/website-design/website-layout-ideas-to-try-in-2026.html); [Contra community post](https://contra.com/community/fRTnjlqt-here-are-the-standout-trends-for)
- Light-evidence critique: full-width hero images are "safe, predictable, and often ineffective at driving conversions". It recommends split layouts and type-led "anti-hero" designs and claims "up to 20% better conversion" (**unverified**). — [Peerlist, Hero images are dead](https://peerlist.io/saxenashikhil/articles/hero-images-are-dead-these-solutions-are-replacing-them)
- NN/g: users pay attention to photos that carry information, such as real people and real places, and ignore "fluffy" decorative or stock imagery. Real team portraits add trust and stock photos of unidentified people are ignored. — [NN/g, Decorative Images video](https://www.nngroup.com/videos/decorative-images/); [UX Myths summary of NN/g research](https://uxmyths.com/post/705397950/myth-ornamental-graphics-improves-the-users-experience); [Information Today summary of Nielsen](https://www.infotoday.com/LinkUp/Being-Picture-Perfect-on-the-Web-72037.shtml)
- Line25 notes a counter-trend toward sites that "deliberately look human-made, imperfect, and idiosyncratic", away from the "homogenized" Figma-template look. AI imagery struggles with "specific real people… brand-specific environments", which favours real office and team photography. — [Line25](https://line25.com/articles/web-design-trends-2026/)

### Catalogue of patterns (status, fit, and structure)
Status labels are synthesized from the findings above. Proportions marked (inf.) are inferences, not cited specs.

| Pattern | 2025–26 status | When it works | Typical structure (inf. unless cited) | Photos / stats it suits | Mobile behaviour |
|---|---|---|---|---|---|
| **Bento grid (photo + stat tiles)** | Mainstream ([Line25](https://line25.com/articles/web-design-trends-2026/)) | Several facts of similar weight; fixed, short content per tile; "one viewport" summaries ([freeCodeCamp](https://www.freecodecamp.org/news/bento-grids-in-web-design/)) | 4- or 6-column CSS grid, fixed row heights (e.g. 4 cols × 200px rows, 14px gap ([Plus Addons](https://theplusaddons.com/blog/bento-grid-layout/))), one 2×2 focal tile | 6–9 tiles total ideal; breaks down past ~12 ([Plus Addons](https://theplusaddons.com/blog/bento-grid-layout/)); ≤9 ([freeCodeCamp](https://www.freecodecamp.org/news/bento-grids-in-web-design/)). For example, 3–5 photos + 3–4 stats | Remap `grid-template-areas` to 2 columns (≤767px) or 1 column; hero tile stays full width |
| **Split hero with stat rail** | Current; matches the "split layout" alternative ([Peerlist](https://peerlist.io/saxenashikhil/articles/hero-images-are-dead-these-solutions-are-replacing-them)) | One strong photo or a small collage; headline-led page | (inf.) 12-col: text 5–6 cols / media 6–7 cols; stats as a 4-up row under the copy or a vertical rail divided by hairlines | 1–2 photos (or a 2×2 mini-grid); 3–4 stats | Media stacks below text; rail becomes a 2×2 grid |
| **Type-led hero + full-width stat band** | Very common on SaaS About pages (Calendly, Airtable, Contentful, Miro, Deel per [Webstacks](https://www.webstacks.com/blog/about-us-page), [Deel](https://www.deel.com/about/)) | Big numbers are the proof point; minimal photography | (inf.) Band of 4 equal columns separated by 1px dividers; numerals ~48–72px; label ≤ 2 lines | 0–1 photo in hero; 3–4 stats (4 most common, as in Deel's block) | 4-up → 2×2 → (optional) 1-col list |
| **Photo strip / marquee** | Logo marquees are common (Deel's logo strip); photo marquees are seen on agency/culture pages. No strong source on trend status | Culture/"people" feel; many photos of equal weight | (inf.) Single row of equal-height images (e.g. 4:5 or 3:4 portraits), duplicated track for a seamless loop | 6+ photos so the loop doesn't visibly repeat; stats go in a separate band | Same strip, smaller height; must pause and respect reduced motion (see Q4) |
| **Layered / overlapping cards** (stat card overlapping a photo corner) | Restrained layering is still live ([Line25](https://line25.com/articles/web-design-trends-2026/)). Heavy floating glass badges link to the ~2021 wave (inference: dated; no source names stat badges specifically) | A single hero photo plus one "proof" metric | (inf.) Card offset -24 to -48px over the photo edge | 1 photo, 1–2 stats max | Overlap usually removed; card stacks under the photo |
| **Editorial asymmetric collage** | Rising in 2026 ([B12](https://www.b12.io/resource-center/website-design/website-layout-ideas-to-try-in-2026.html), [Contra](https://contra.com/community/fRTnjlqt-here-are-the-standout-trends-for)) | Brand wants a human, non-template feel ([Line25](https://line25.com/articles/web-design-trends-2026/)) | (inf.) Mixed-ratio images on an offset grid (e.g. tall 3:4 next to wide 4:3 with vertical offset); stats set as large inline type | 3–5 photos; 2–4 stats set typographically | Collapses to a stacked column or a 2-up pairing; offsets removed |

### Inferences
- For an EOR/HR brand, the safest current direction is a **type-led hero (big headline) plus real office/team photography plus a clean 4-stat element**. Both direct competitors keep stats out of photo overlays.
- "Stat cards floating over photo corners" read as template-era (circa 2019–2022): drop shadows, glass blur, badges. In a black-and-white brand they also fight the photo for contrast. Treat this as an expert inference, not a sourced finding.
- Black-and-white photography combined with a single warm orange accent suits bento or band layouts. The accent can mark one focal stat tile or the stat numerals, rather than tinting photos.

### Gaps
- No reliable quantitative source ranks hero+stats patterns by prevalence. The 45% and 67% bento figures are unverified and conflict with each other.
- Could not confirm the visual format (band vs cards) of Deel's 4-stat block from text-only fetch. Remote.com/about-us returned 404. Oyster, Multiplier and Papaya were not checked.
- Godly, Land-book, Lapa Ninja and Awwwards were not fetched; their pages are image galleries that text fetch cannot meaningfully analyse.
- No NN/g or Baymard article specifically on stat blocks or bento layouts was found.

---

## 2. What grid structures and proportions do bento-style photo+stat layouts use?

### Takeaway
Published bento implementations use **4- or 6-column CSS grids** with **fixed row heights**, one **2×2 (or 4×4 of 6) focal tile**, gaps of roughly **14–24px**, and **6–9 tiles**. Tile size should reflect real importance. Bento needs fixed-length content; variable-height content belongs in masonry.

### Cited Findings
- A 2026 tutorial uses `grid-template-columns: repeat(4, 1fr)`, three rows at `200px`, `gap: 14px`. The hero tile spans 2×2, a feature tile spans 2 columns, a side tile takes 1 cell, a "chip" tile spans 2 rows, and a stats tile spans the bottom 3 columns. — [The Plus Addons, Bento Grid Layouts in 2026 (Aug 2026)](https://theplusaddons.com/blog/bento-grid-layout/)
- Same source: "six to nine tiles is the sweet spot"; the layout "breaks down past roughly a dozen tiles". Tile size should reflect real importance, because size used only to fill space reads as false hierarchy. Bento needs fixed content: "fixed rows clip long tiles or leave short ones empty", so use masonry for variable content. — [The Plus Addons](https://theplusaddons.com/blog/bento-grid-layout/)
- Same source: every named grid area must be a rectangle; an L or T shape invalidates the whole `grid-template-areas` declaration. Dots (`.`) create deliberate empty cells. — [The Plus Addons](https://theplusaddons.com/blog/bento-grid-layout/)
- A 2024 tutorial (older but structural) uses a 6-column grid (`repeat(6, 1fr)`), gap `1.5vw`, 5px radius, and a 2px border. The hero spans 4 cols × 4 rows, a side tile 2×4, and three bottom tiles 2 cols each. It recommends ≤9 boxes, varied box sizes for hierarchy, and a central focal tile. — [freeCodeCamp, David Jaja (Apr 2024)](https://www.freecodecamp.org/news/bento-grids-in-web-design/)
- Bento risks: too much content per screen, flattened hierarchy if tiles are uniform, monotony, and accessibility issues for screen readers and keyboard users. — [freeCodeCamp](https://www.freecodecamp.org/news/bento-grids-in-web-design/)
- SaaSFrame: cards of different sizes let a major point get room while a supporting point fits a smaller panel. — [SaaSFrame bento patterns](https://www.saasframe.io/patterns/bento-grid)

### Inferences
- **Radius:** no reliable 2025–26 source gave radius norms. Current SaaS bento sections commonly use roughly 12–24px radius on tiles (observational; unsourced). For a stark black-and-white brand, a small radius (0–8px) or a consistent ~12px reads more editorial than 24px+ "app-card" rounding. Pick one radius and apply it to photos and stat tiles alike.
- **Gutters:** 12–16px tight gutters make the grid read as one object (more "bento"). 24px+ makes tiles read as separate cards.
- **Row height:** fixed heights such as 180–240px per row unit on desktop keep photo crops predictable. Use `object-fit: cover` on images.

### Gaps
- No authoritative source (NN/g, Baymard, major design system) publishes bento radius or gutter standards. Values above come from two tutorials.

---

## 3. How should four office/team photos and four stats be combined so no tile looks empty or crowded?

### Takeaway
No source addresses this exact 4+4 case. The cited rules give the constraints: 6–9 tiles is ideal; size should reflect importance; content must be fixed-length; and real photos of people and places carry meaning. Eight tiles fit the sweet spot. The main risk is eight equal tiles (a flat checkerboard), so vary photo sizes and keep stat tiles typographic.

### Cited Findings
- Six to nine tiles is the sweet spot; size should reflect importance, not fill space. — [The Plus Addons](https://theplusaddons.com/blog/bento-grid-layout/)
- Vary box sizes for hierarchy; uniform structure flattens hierarchy and becomes monotonous. — [freeCodeCamp](https://www.freecodecamp.org/news/bento-grids-in-web-design/)
- Bento modules work as "a self-contained story: a stat, a feature, a quote". — [Line25](https://line25.com/articles/web-design-trends-2026/)
- Informational photos of real people and places get attention; decorative ones are ignored. — [NN/g](https://www.nngroup.com/videos/decorative-images/)
- Deel pairs its 4 stats with a photo in one section, an existing precedent for a 4-stat + photo pairing in EOR. — [Deel About](https://www.deel.com/about/)

### Inferences: candidate 4-photo + 4-stat layouts
All of these are inferred compositions, not sourced templates.
1. **Bento, 4 columns × 3 rows (desktop ≥1024px):** One 2×2 large team photo (focal). One 1×2 tall office photo. Two 1×1 photos. Four stats as 1×1 tiles, or one 2×1 band holding two stats. Example map: `"p1 p1 p2 s1" / "p1 p1 p2 s2" / "p3 s3 s4 p4"`. That is eight tiles; photos take about 60% of the area and stats about 40%.
2. **Split hero plus 2×2 photo mosaic plus stat rail:** Left 5/12 holds the headline, copy and a CTA. Right 7/12 holds a 2×2 photo mosaic with mixed ratios (one tall spanning 2 rows, plus two squares; or four equal tiles). Below spans a full-width 4-up stat band with hairline dividers. This is the lowest-risk option: photos never compete with numbers.
3. **Alternating checkerboard (photo/stat/photo/stat across 4×2):** It is tidy, but it risks the "uniform/monotonous" failure mode. Use it only if the stat tiles have strong typography (a large numeral plus a 1–2 line label). Brand option: put the accent orange on numerals only.
- **Avoiding empty stat tiles:** a stat tile needs a numeral (about 48–64px), a label (≤ about 6 words), and optionally a tiny context line or a top-left eyebrow. Black or near-black tile fills with white type alternating with white tiles fill the space without imagery.
- **Avoiding crowding:** one stat per tile; no icons plus numbers plus paragraphs; keep labels short so fixed-height tiles don't clip (see the fixed-content rule).
- **Photo consistency:** apply the same grade (e.g. all monochrome or all warm-neutral) so four photos read as one set. Line25 argues for real, human imagery over generic or AI imagery.

### Gaps
- No sourced example of an EOR/HR About hero using exactly a 4-photo + 4-stat bento was found.
- No user-testing data compares band vs bento vs rail for stat comprehension.

---

## 4. How do these patterns collapse on tablet and mobile?

### Takeaway
Bento grids collapse by **remapping `grid-template-areas`** at breakpoints (desktop 4–6 cols → tablet 3–4 → mobile 2 or 1). The focal tile stays full width. Some tiles may be dropped or restacked. DOM order must match logical reading order, because visual reordering does not change screen-reader or keyboard order. Auto-moving photo marquees need a pause mechanism under WCAG 2.2.2.

### Cited Findings
- Example breakpoints: at `max-width: 767px` a 4-column bento collapses to 2 columns with `auto` rows. The map becomes `"hero hero" / "feat side" / "stats stats"`, so one tile drops out. No tablet breakpoint is given. — [The Plus Addons](https://theplusaddons.com/blog/bento-grid-layout/)
- Example breakpoints: at ≤1000px a 6-col grid becomes 4 cols (hero 4×2); at ≤750px it becomes 3 cols, the hero is 3×2, and all other tiles go full-width and stack. — [freeCodeCamp](https://www.freecodecamp.org/news/bento-grids-in-web-design/)
- `grid-auto-flow: dense` can visually reorder tiles, but focus and screen readers follow the DOM. Avoid it on interactive tiles; it is acceptable for non-interactive photo and stat tiles. Give each tile a sensible heading level. — [The Plus Addons](https://theplusaddons.com/blog/bento-grid-layout/)
- MDN documents the mobile-first pattern of a single column at small widths, adding columns via media queries with `grid-template-areas`. — [MDN, Common grid layouts](https://developer.mozilla.org/docs/Web/CSS/Guides/Grid_layout/Common_grid_layouts)
- Frontend Mentor solutions reorder named areas for mobile and recommend mobile-first media queries. — [Frontend Mentor solution](https://www.frontendmentor.io/solutions/bento-grid-using-grid-template-areas-1lktFA3A7-)
- WCAG 2.2 SC 2.2.2 says auto-starting moving or scrolling content that lasts more than 5s and sits alongside other content needs a way to pause, stop or hide it. A shared control for all moving elements is recommended. This applies to photo and logo marquees. — [W3C Understanding 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)

### Inferences: collapse recipes per pattern
- **Bento (4×3 desktop) → tablet (≥640px and <1024px):** 2 or 3 columns; the focal photo goes full width (2×1 at about 16:9); remaining photos pair 1×1; the stats form a 2×2 block. **→ mobile (<640px):** 2 columns. The focal photo goes full width first, then a 2×2 stat block (stats are compact and readable side by side), then 2–3 photos as a 2-up row or a horizontal scroll-snap strip. Drop one photo if it would leave an orphan.
- **Split hero + stat rail:** stacks headline → photo(s) → stats. The 4-up stat band becomes 2×2 on tablet and mobile; a single column only below about 360px or if labels are long.
- **Full-width stat band:** 4-up → 2×2. Keep the dividers as a cross (+) rather than four rows of borders.
- **Photo marquee:** keep it as a single row at reduced height. Honour `prefers-reduced-motion` (static, horizontally scrollable strip) and provide a pause control per WCAG 2.2.2.
- **Layered/overlapping card:** remove the overlap on mobile; the stat card sits below the photo at full width. Overlaps tend to cover faces and break at small widths.
- **Editorial collage:** flatten to a single column, or 2-up pairs with offsets removed; keep the largest image first.
- **Source order:** write the HTML in reading order (headline → key stat → photos) and use grid placement only for desktop arrangement. Photos that are purely atmospheric can take `alt=""`; team or office photos with meaning get descriptive alt text ([Stanford decorative image guidance](https://uit.stanford.edu/accessibility/learn-about/images/image-decorative)).

### Gaps
- No source gave tested tablet breakpoints specific to photo+stat bento sections. The breakpoints above are inferred from two tutorials (767px; 1000/750px).
- No data on whether mobile users prefer stacked stats or scroll-snap carousels for photos in About heroes.
