# Hero Stats: Typography, Spacing, Motion, Accessibility and Performance (2025–2026)

Scope: practical guidance for a static HTML/CSS/vanilla-JS site set in Inter, in a black-and-white scheme with one warm accent.

## What number-to-label size ratios and font settings make stats read well?

### Takeaway
No authoritative source specifies a numeric number-to-label ratio. The consistent pattern is a large figure set with lining, tabular numerals and slightly negative tracking, paired with a short, much smaller label in proportional text that is often uppercase and letter-spaced. Inter supports every OpenType feature you need (`tnum`, `case`, `zero`, `ss01`, `cv*`). Its own tracking formula puts large display sizes at about -0.022em.

### Cited Findings
- `font-variant-numeric: tabular-nums` maps to `tnum` and gives every digit the same width. `lining-nums` maps to `lnum` and sits all figures on the baseline. `slashed-zero` maps to `zero`. These values can be combined in one declaration, and the property has been Baseline "widely available" since January 2020. — [MDN font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)
- Inter's numeral features:
  - `tnum` is a dedicated set of glyphs that keep "the same width across all weights".
  - `case` gives case alternates, which align symbols such as +, -, parentheses and colons with capitals and digits.
  - `zero` gives a slashed zero.
  - `ss01` gives alternate digits.
  - `cv01` (alternate one), `cv02` (open four), `cv03` (open six), `cv04` (open nine) and `cv09` (flat-top three) are single-digit variants.
  - `sups`, `numr` and `dnom` cover superscripts and fractions.
  - Inter 4 has an optical-size (`opsz`) axis that runs from "text" to "display", with cleaner, finer detail at large sizes.

  — [Inter (rsms.me)](https://rsms.me/inter/)
- Inter's dynamic-metrics tracking formula is tracking = a + b·e^(c·z), with a = -0.0223, b = 0.185, c = -0.1745 and z = font size in px. At 32px and above it settles near **-0.022em**. — [Inter dynamic metrics (archived v3 site)](https://d.rsms.me/inter-website/v3/dynmetrics/)
- Butterick: add **5–12% letterspacing (0.05–0.12em) to all-caps or small-caps text**. Lowercase usually needs none, and large headlines can have spacing removed. "If the spaces between letters are large enough to fit more letters, you've gone overboard." — [Practical Typography: Letterspacing](https://practicaltypography.com/letterspacing.html)
- Shopify's number component:
  - Use a larger size for "the figure a merchant should read first" and keep supporting figures at the base size.
  - Use tabular numerals for figures that sit alongside other figures.
  - Tabular numerals "make ordinary words look uneven", so labels should not use them.

  — [Shopify App Home: Number](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/number)
- A common stat-tile pattern is a semi-bold value with tabular figures above a small, uppercase, letter-spaced label in a muted colour. — [Star Citizen wiki StatTiles CSS](https://starcitizen.tools/Module:StatTiles/styles.css) (example implementation, not a standard)
- Stat blocks only work when the label stays very short beneath a large number. — [IU email templates: Statistics block](https://salesforce.ucm.iu.edu/creating-emails/content-blocks/statistics/index.html)

### Inferences
- **Recommended starting CSS.** This is a synthesis. The ratios come from common practice, not a cited standard.
  ```css
  .stat__value {
    font-size: clamp(2.75rem, 2rem + 3.5vw, 5rem); /* ~44–80px */
    font-weight: 600;            /* 600–700; 800+ gets heavy in Inter Display sizes */
    line-height: 1;              /* or 0.95 at display sizes */
    letter-spacing: -0.022em;    /* Inter dynamic-metrics asymptote */
    font-variant-numeric: tabular-nums lining-nums;
    font-feature-settings: "case" 1, "cv11" 0; /* "case" lifts +, - to cap/digit height */
    font-optical-sizing: auto;   /* uses Inter opsz Display cut if the variable font has it */
  }
  .stat__label {
    font-size: 0.8125rem;        /* 13–14px */
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;      /* inside Butterick's 5–12% range */
    line-height: 1.4;
    max-width: 18ch;
  }
  .stat__suffix { font-size: 0.6em; vertical-align: 0.35em; font-weight: 500; } /* or keep at 1em */
  ```
  This gives a number-to-label ratio of roughly **3.5:1 to 6:1**. A ratio of 4:1 or more reads clearly as hierarchy. Below about 2.5:1 the number and label start to compete.
- **Suffixes such as +, % and K.**
  - Keep them in the same text node as the number, or in an adjacent span inside the same element, so screen readers read "500+" or "98%" as one unit.
  - Shrinking the suffix to 0.55–0.7em and raising it with `vertical-align`, or turning on `font-feature-settings: "case"`, stops a full-size "+" from dominating.
  - Using the warm accent colour on the suffix only is a restrained way to bring in the accent.
  - "K" and "M" are capital letters and already sit at cap height, so they need no shift.
- **Tabular numerals matter most for count-up animations.** Without them the digits change width every frame and the text visibly jitters. As an extra safeguard, reserve width with `min-width` in `ch` units or with an invisible "ghost" copy of the final value.
- **Alignment.** Left-aligned stats in a row are easier to scan than centred ones. Align the numbers on a shared baseline and the labels on a shared top line.
- **Separators.**
  - Thin 1px vertical rules at about 15–20% contrast between stats, or a 1px top rule above each stat, suit a black-and-white editorial look.
  - Gaps of about 2–4rem (`clamp`) between stats, and 0.5–0.75rem between number and label.
  - Hairline rules should collapse to horizontal rules when the stats stack on mobile.
- **Weight.** One weight step between number and label, such as 600 against 500, plus the size and case contrast is enough. Very light weights (300 and below) at large sizes can lose contrast because of anti-aliasing (see the WCAG note in the next section).

### Gaps
- I found no authoritative, citable source that specifies a number-to-label size ratio. The 3.5–6:1 range is my inference from common practice.
- I did not verify whether Inter's `case` feature moves "+" and "%" specifically. Test it in the browser.
- I did not confirm whether Inter's `opsz` axis is included in Google Fonts' default static files. A self-hosted Inter 4 variable font is the safest way to get the Display cut.

## How should count-up animations be implemented accessibly (aria, final value in DOM, reduced motion)?

### Takeaway
Put the final value in the HTML so there is no JavaScript dependency and nothing to fix for crawlers or LCP. Hide only the animated copy from assistive technology and never put the counter in a live region. Skip the animation entirely under `prefers-reduced-motion: reduce`. Do not put `aria-label` on a plain div or span, because ARIA prohibits naming the generic role.

### Cited Findings
- Animation the page starts on its own falls under WCAG 2.2.2 (Pause, Stop, Hide). Motion triggered by interaction such as scrolling falls under 2.3.3 Animation from Interactions, which is Level AAA. 2.3.3 says motion "can cause dizziness, nausea and headaches" for people with vestibular disorders. Its sufficient techniques are C39 (the CSS `prefers-reduced-motion` media query) and SCR40 (checking the setting in JS). — [W3C Understanding SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- ARIA 1.2 lists `generic` among the roles that cannot be named: "Authors MUST NOT use the aria-label or aria-labelledby attributes to name the element." — [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/#generic)
- Framer's "Better Counter" component hides its animated number from assistive tech and exposes the final formatted value in a separate element. — [Framer Better Counter](https://www.framer.com/community/marketplace/components/better-counter/)
- The WordPress Counting Number Block plugin says "screen readers will read the actual number value, not the animated one". It also turns the animation off under reduced motion. — [Counting Number Block](https://en-ca.wordpress.org/plugins/counting-number-block/)
- Dialpad's Motion Text component skips animation under `prefers-reduced-motion` and sets `aria-hidden` on animated content while it is animating. — [Dialpad Motion Text](https://dialtone.dialpad.com/deploy-previews/pr-1331/components/motion-text.html)
- GSAP recommends `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` so animations are only added for users who accept motion. — [GSAP accessibility](https://www.gsap.com/resources/a11y/)

### Inferences
- **Recommended markup.** This is a synthesis of the findings above.
  ```html
  <dl class="stats">
    <div class="stat">
      <dt class="stat__label">Clients served</dt>
      <dd class="stat__value">
        <span class="visually-hidden">500+</span>
        <span class="stat__num" aria-hidden="true" data-count="500" data-suffix="+">500+</span>
      </dd>
    </div>
  </dl>
  ```
  - Put the visual order first by placing `dd` above `dt` with CSS `order` or `flex-direction: column-reverse`. Keep the source order as label then value, so screen readers read "Clients served, 500+". A `<ul>` of `<p>` elements is a valid simpler alternative.
  - Both spans hold the real final value in the HTML. Without JavaScript, crawlers and screen readers get the correct number, and nothing shifts.
- **Recommended JavaScript.**
  - Run the count only if `matchMedia('(prefers-reduced-motion: no-preference)').matches` is true **and** an `IntersectionObserver` reports the element on screen (threshold about 0.5). Run it once, then `unobserve`.
  - Animate with `requestAnimationFrame` and an ease-out curve (cubic or expo) over about **1.2–2s**.
  - Count from about 0–70% of the final value rather than from zero, so it feels less like a slot machine.
  - Format with `Intl.NumberFormat` so thousands separators match the final value, and write to `textContent`, not `innerHTML`.
  - Do not use `aria-live`. A live region would announce dozens of intermediate values.
- **Avoid a flash of zero.** Do not render "0" in the HTML and count up from it. If JavaScript fails, the page shows false data, and if the stat is the LCP element its final paint is delayed. Before the animation starts, add a class only in JavaScript that sets the visual value to its start number. Do this while the hero is still below the fold, or count in place from the real number.
- **Does it pass WCAG?** A one-shot count shorter than 5 seconds that starts automatically probably does not trigger the 2.2.2 pause requirement, because 2.2.2 applies to motion lasting more than 5 seconds. That is my reading and not quoted from the source fetched here. Honouring reduced motion meets the AAA technique C39.

### Gaps
- I found no formal W3C or WAI pattern for animated counters specifically. The hidden-animation-plus-real-value approach comes from component libraries and practitioner consensus.
- I did not run screen-reader tests (NVDA, JAWS, VoiceOver) on how "500+" or "98%" is announced. Testing is recommended. For example, some readers read "+" as "plus" and others skip it.

## Which motion patterns are considered tasteful vs gimmicky in 2025–2026 B2B sites?

### Takeaway
Research favours brief, subtle, purposeful motion, typically 100–500ms for UI transitions. One-shot reveals and a single count-up per stat row are acceptable. Heavy parallax, scroll-jacking and many simultaneous animations are widely criticised. CSS scroll-driven animations (`animation-timeline: view()`) now ship in Chrome/Edge 115+ and Safari 26+, with Firefox only recently or not yet on by default. Treat them as progressive enhancement.

### Cited Findings
- NN/g: "Animation in UX must be unobtrusive, brief, and subtle". Animation is best used as "subtle feedback for microinteractions, rather than to induce delight or entertain users". Surface-level delight "quickly sours", and too many simultaneous animations overwhelm users. — [NN/g: The Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/)
- NN/g: "the duration of most animations should be in the range of 100–500 ms", typically 100–400ms. Simple feedback takes about 100ms and larger changes take 200–300ms. — [NN/g: Animation Duration](https://www.nngroup.com/articles/animation-duration/)
- NN/g researcher Katie Sherwin argues that subtle modern parallax "still has all the same UX problems" as the older, obtrusive kind. This is reported second-hand by Fast Company. — [Fast Company](https://www.fastcompany.com/90309395/why-parallax-scrolling-needs-to-die)
- A 2021 OsloMet thesis found **no significant difference** in task time, errors or opinion between sites with and without parallax. Participants preferred parallax on average, but it gave no measurable usability gain. — [OsloMet thesis](https://oda.oslomet.no/oda-xmlui/handle/11250/2832354)
- WCAG 2.3.3 gives a parallax example: decorative elements that move horizontally as the user scrolls should be possible to disable. — [W3C SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- Scroll-jacking problems include input mismatch between trackpad, mouse and touch, dropped frames from heavy scroll handlers, and blocked navigation. This is a vendor source. — [alvarotrigo.com](https://alvarotrigo.com/blog/what-is-scroll-hijacking/)
- Scroll-driven animations:
  - They integrate with CSS Animations and the Web Animations API and can run **off the main thread**. Classic scroll-event effects are prone to jank.
  - The demo animates `transform: scaleX()` rather than `width` so it stays composited.
  - The reveal pattern is `animation: reveal linear; animation-timeline: view();`.
  - The image-reveal demo uses `animation-range: entry 25% cover 50%` with a clip-path expansion. `entry 0% entry 100%` can be shortened to `entry`.

  — [Chrome for Developers: Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- Browser support for `animation-timeline: view()`: Chrome and Edge 115+, Safari 26.0+, Firefox 159+, with about 87.8% global usage according to caniuse. A Mozilla Connect thread with 2026 comments says `animation-timeline` was still behind a preference in Firefox and not on by default. These sources conflict, or the Firefox version listed may be very recent or upcoming. — [caniuse: animation-timeline view()](https://caniuse.com/mdn-css_properties_animation-timeline_view); [Mozilla Connect](https://connect.mozilla.org/t5/ideas/implement-css-scroll-driven-animations-animation-timeline/idc-p/119842); Safari 26 support also reported by [cydstumpel.nl](https://cydstumpel.nl/?p=1170)

### Inferences
- **Tasteful for a B2B hero, as a synthesis:**
  1. A one-shot fade-and-rise (opacity 0→1, translateY 12–24px→0) at 400–700ms with ease-out. Stagger the stats by 60–100ms.
  2. One count-up per stat, fired once.
  3. An image reveal with `clip-path: inset()` from bottom or side, at 600–900ms, once.
  4. A very slight scale on the hero photo (1.05→1) as it enters.
  5. Hairline rules that draw in with `transform: scaleX`.
- **Gimmicky:**
  - Multi-layer parallax.
  - Scroll-jacking, pinned "scrollytelling" stat sequences, or anything that changes scroll speed.
  - Counters that re-trigger on every scroll pass.
  - Bouncy or elastic easing.
  - Long (over 1s) delays before content appears.
  - Animating text that is the LCP element in a way that delays its final paint.
  - Cursor-follow effects.
- **Progressive enhancement with scroll-driven CSS:**
  ```css
  @media (prefers-reduced-motion: no-preference) {
    @supports (animation-timeline: view()) {
      .reveal { animation: reveal linear both; animation-timeline: view(); animation-range: entry 10% cover 30%; }
    }
  }
  @keyframes reveal { from { opacity: 0; transform: translateY(1.5rem); } to { opacity: 1; transform: none; } }
  ```
  Browsers without support show static content, which is an acceptable fallback. For one-shot (not scrubbed) reveals in every browser, use `IntersectionObserver` to toggle a class with normal CSS transitions.
- **Avoid hiding above-the-fold content.** Do not set opacity 0 on hero content until JavaScript runs. Content in the first viewport should be visible in the initial render, otherwise you risk LCP delays and blank screens when JavaScript fails.
- **Parallax.** If you use it, make it a single layer with small amplitude (under about 10–15% translate) and use transform only. Turn it off entirely under reduced motion.
- **Reduced motion.** Use opacity-only cross-fades rather than removing every transition. Reduced motion means less motion, not no feedback.

### Gaps
- I found no primary 2025–2026 NN/g article on scroll-jacking. The NN/g position on parallax comes from a secondary source.
- Firefox's default-on status for scroll-driven animations as of October 2026 is unconfirmed because the sources conflict. Check caniuse or MDN at implementation time.
- I found no data on B2B conversion impact from any specific motion pattern.
- I did not find a cited source on whether `clip-path` animations are composited. In Chromium, clip-path animation compositing arrived relatively recently. Test performance on low-end devices.

## What are the performance/accessibility pitfalls for photo-heavy heroes, and how to avoid them?

### Takeaway
The hero photo is usually the LCP element. Put it in the HTML as an `<img>` with `srcset`/`sizes`, `fetchpriority="high"`, no lazy loading, and explicit `width`/`height` or `aspect-ratio` so it causes no layout shift. Animate with transform and opacity only. Text over photos still needs 4.5:1 contrast, or 3:1 for large text, so use scrims or keep stats on solid black or white.

### Cited Findings
- **LCP image loading:**
  - The LCP image must be discoverable in the initial HTML through `src` or `srcset`. JS-injected images, `data-src`, and CSS background images delay discovery.
  - For CSS backgrounds, use `<link rel="preload">`.
  - Add `fetchpriority="high"`, but giving it to more than one or two images makes it unhelpful.
  - Use `fetchpriority="low"` for offscreen images.
  - **Never lazy-load the LCP image.**
  - Host it on the same origin as the page.
  - Targets: LCP of 2.5s or less at the 75th percentile. Ideal subpart split is TTFB ~40%, resource load delay <10%, load duration ~40%, render delay <10%.

  — [web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp)
- `fetchpriority` on the Google Flights hero image cut LCP from 2.6s to 1.9s (0.7s). In-viewport images start at Low priority until layout, and the attribute starts them at High. For background-image LCP, put `fetchpriority="high"` on the preload. — [web.dev: Fetch Priority](https://web.dev/articles/fetch-priority)
- **Layout shift (CLS):**
  - Target CLS of 0.1 or less at the 75th percentile. Above 0.25 is poor.
  - Set `width` and `height` on images or reserve space with CSS `aspect-ratio`. Keep `height: auto`.
  - Responsive variants should share one aspect ratio. `<source>` in `<picture>` also accepts width and height.
  - Animate `transform` rather than `top` or `left`.
  - For fonts, use `font-display: optional`, a sensible fallback, and `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override` to match fallback metrics. Preload critical fonts.

  — [web.dev: Optimize CLS](https://web.dev/articles/optimize-cls)
- **Contrast:**
  - Normal text needs **4.5:1** and large text needs **3:1** (WCAG 1.4.3 AA), with no rounding.
  - Large text is 18pt or bigger (about 24px), or 14pt bold (about 18.5px).
  - Thin fonts may need extra contrast because of anti-aliasing.
  - Text over background images must meet the same ratios. Failure F83 covers background images with insufficient contrast.

  — [W3C Understanding SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

### Inferences
- **Recommended hero image markup:**
  ```html
  <img src="hero-1200.avif"
       srcset="hero-800.avif 800w, hero-1200.avif 1200w, hero-1800.avif 1800w, hero-2400.avif 2400w"
       sizes="(min-width: 64rem) 50vw, 100vw"
       width="1200" height="800" alt="…" fetchpriority="high" decoding="async">
  ```
  - Wrap it in `<picture>` with a WebP or JPEG fallback if needed.
  - Use `fetchpriority="high"` on one image only.
  - Give all other photos `loading="lazy"` plus their width and height.
  - If you use `object-fit: cover` in a fixed `aspect-ratio` box, set `aspect-ratio` on the container too.
- **Pitfalls specific to motion:**
  - A clip-path or opacity reveal on the LCP image can push LCP back to when the animation reveals it. Keep hero reveals short (under about 600ms), start them right away rather than on scroll, or leave the LCP image unanimated and reveal secondary images only.
  - Avoid animating `filter: blur()` or `width`/`height` on large photos.
- **Fonts.** Self-host Inter as WOFF2, subset to Latin, and preload the one weight or variable file used above the fold. A tuned `size-adjust` fallback (Arial with size-adjust of about 107% is a common Inter fallback) reduces CLS from large stat numbers swapping in.
- **Black and white with one warm accent:**
  - Pure #000 on #fff (21:1) is very high contrast. Many editorial sites use near-black (#0a0a0a–#111) and off-white (#fafafa) to soften glare, which still exceeds 15:1.
  - Warm accents such as orange or amber often **fail 4.5:1 on white** for small text. Use the accent on large numerals or suffixes, where only 3:1 is needed, or on a black background, where warm colours have high contrast. Otherwise darken the accent for small labels. Check every pairing with a contrast checker.
  - Muted grey labels such as #6b6b6b on white are about 5.3:1 and pass. Lighter greys like #999 (about 2.8:1) fail for small labels.
- **Stats over photos.** Put a gradient scrim such as `linear-gradient(to top, rgb(0 0 0 / .7), transparent)` behind them, or place stats on a solid band beside or below the image. A grayscale photo (`filter: grayscale(1)` or a pre-processed file, which is better for performance) fits the black-and-white scheme.
- **Content and structure:**
  - Keep the stat numbers as live HTML text, not baked into images. That keeps them selectable, translatable, accessible, and eligible as a fast text LCP.
  - Give decorative images `alt=""`.

### Gaps
- I found no cited numbers on how much a clip-path reveal of the LCP image delays measured LCP. The pitfall is inferred from how LCP is defined.
- I did not verify the exact contrast ratios of specific warm accent hex values. Compute them once the accent colour is chosen.
- I did not research AVIF versus WebP support details or encoding settings beyond the general guidance above.
