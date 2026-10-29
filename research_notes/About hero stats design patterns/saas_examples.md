# SaaS About / Company page patterns: hero, stats, and team imagery (2025–2026)

Method note: the pages were fetched live on 2026-10-28 with a text/markdown fetcher. The fetcher returns DOM order, headings, text and image alt/filenames. It does **not** return rendered CSS: type size, colour, dividers or real animation. So every claim below about visual size, separators or motion is either taken from markup hints (for example duplicated logo sets, "Carousel image" alts, video controls) or marked as inferred. Papaya Global's About page returned HTTP 403 (and a CloudFront block via proxy). The archive.org fetch was refused, so Papaya's page is not verified. Oyster's About page lives at /who-we-are (/about and /about-us return 404).

## For each company, what does the About page hero look like and where do the stats live?

### Takeaway
Only one of the nine About pages, Deel's, has a formal stat block. It has 4 stats, number above label, placed mid-page after the origin story and timeline, not in the hero. Oyster has a 3-stat block, but on its Careers page. Every other company either puts figures inline in prose (Stripe, Linear, Rippling, Oyster's About page) or shows no numbers at all (Remote, Vercel, Notion). Heroes are almost always a big mission-statement H1 plus a one-line subhead, with a single visual (illustration, video, or none).

### Cited Findings
- **Deel (/about):**
  - Hero: H1 "Work with the world" with a subhead and one hero image. Under it sit a trust line, "Trusted by 40,000+ companies from startups to enterprise", and a link card, "175 STORIES / Read about real results".
  - A customer-logo strip follows (28 logos plus a repeated set, which suggests a looping marquee).
  - Then come product blocks, the origin story "How Deel came about" with founder headshots, a 2019→2023→"Today" growth timeline, and a YC photo of the founders.
  - Then a **4-stat grid, number above label**: "40,000 / Supported Businesses", "$17.3B / processed payments", "650,000+ / workers hired", "150 / available countries".
  - After that come investor testimonial cards (duplicated, which suggests a carousel), investor logos, and Careers/Press/Resource-hub link cards.
  - The page contradicts itself: 35,000+ vs 40,000 customers, $650M vs $600M+ raised, 150 vs 100 countries.
  - [Deel About](https://www.deel.com/about/)
- **Deel (/careers):**
  - Hero: "Built for the ones who build", with two hero images ("Epic_Entrance", "deel_speed").
  - A values icon strip, then a filterable roles list with per-department counts and the total "250 open positions across all teams".
  - Figures sit inline in prose ("$1B+ ARR", "160+ countries"), plus five "Carousel image" photos and a bold "40,000+ companies" above a logo scroller (the filename "logo_scroller" plus duplicated sets suggest a marquee).
  - [Deel Careers](https://www.deel.com/careers/)
- **Remote (/about):**
  - Hero: "Talent is everywhere, opportunity should be too."
  - Then "Our distributed team supports businesses around the world" with one image, 5 values (Care, Innovation, Transparency, Intensity, Excellence), a 9-person leadership grid ("Meet our team") and department career links.
  - **No numeric stats at all.** All images have empty alt text.
  - [Remote About](https://remote.com/about)
- **Remote (/careers):**
  - Hero: "Building infrastructure for a world that works." with no hero image listed.
  - Then values, benefits list, "Belong everywhere." with one image, and blog cards.
  - No stats and no identifiable team photos.
  - [Remote Careers](https://remote.com/careers)
- **Rippling (/about):**
  - Eyebrow "Our mission", H1 "We free smart people to work on hard problems", a bold subhead, body copy and a CTA.
  - Hero visual is an illustration: "A purple logo icon connected to six surrounding icons…".
  - The only number is "600+ apps", inline in hero body copy.
  - Then an 8–9 exec grid with headshots on purple backgrounds and quotes, and "Where we work": 10 office cities as **text only, no office photos**.
  - Then career cards with illustrations, press cards and a demo form.
  - [Rippling About](https://www.rippling.com/about)
- **Oyster (/who-we-are):**
  - Hero: "Opportunities for all." / "Where you are shouldn't govern what you do." with a "Watch the Oyster Product Video" link.
  - Hero image: "Three smiling people in separate frames on a textured green background".
  - Then a logo strip (duplicated, which suggests a marquee) and a mission section with "based in 60+ countries" inline.
  - Then an 8-person leadership grid with decorative circles, flowers and line bursts, a board-member testimonial, and 4 illustrated values.
  - No stat block.
  - [Oyster Who We Are](https://www.oysterhr.com/who-we-are)
- **Oyster (/careers):**
  - Hero: "Change the world of work with us" over a sky image.
  - Award badges: Glassdoor 4.9, Culture Amp 91%.
  - Then a **3-stat block titled "Distributed and diverse", number above label**: "2020 / Year founded", "648+ / Employees", "70 / Countries".
  - Then one full-width image, and one real team photo of three colleagues at a table.
  - Note the mismatch: 70 countries here vs "60+ countries" on the About page.
  - [Oyster Careers](https://www.oysterhr.com/careers)
- **Papaya Global:** the About page could not be fetched (HTTP 403, CloudFront block). Third-party figures conflict:
  - Employees: 500 to about 800.
  - Countries: 100, 140 or 160+, depending on the source and year.
  - [Wikipedia](https://en.wikipedia.org/wiki/Papaya_Global); [Calcalist](https://www.calcalistech.com/ctech/articles/0,7340,L-3896671,00.html); [Startup Nation Central](https://finder.startupnationcentral.org/company_page/Papaya)
- **Linear (/about):**
  - Hero: "Building tools for the next era of product development" plus subhead, with a **video player** (it exposes playback controls).
  - Numbers are inline only: "more than 40,000 companies", founded "2019".
  - Then "Meet the team behind Linear": 8 leadership headshots (alt text = person's name) plus a long plain-text list of all other team names without photos.
  - Then "Backed by the best": 2 investor cards plus a text list of about 20 angels, and a closing CTA.
  - [Linear About](https://linear.app/about)
- **Stripe (/about):**
  - No discrete hero headline block. One image at the top (`stripe_about_gram.png`), then the lead sentence "Stripe is a technology company focused on improving the conditions for economic growth and prosperity."
  - Stats are woven into prose: "More than 5 million businesses", "trillions of dollars a year", "around 1.7% of global GDP".
  - Then 3 CTAs (Get in touch / Docs / open roles) and a set of 11 hover-image link cards (Customers, Roadmap, Radar, Works in Progress, etc.).
  - No team or office photos.
  - [Stripe About](https://stripe.com/about)
- **Vercel (/about):**
  - Hero: "Vercel frees the world to ship what's next" / "Vercel is agentic infrastructure for every app and agent." with a "View open positions" CTA.
  - Then 3 value propositions, 16 investor firms and 17 individual investors as lists, and a closing "Join us and shape the future of the web".
  - **No stats and no images** in the fetched content.
  - [Vercel About](https://vercel.com/about)
- **Notion (/about):**
  - Hero: H1 "About Notion" / "A story of tools and the future of work." with an illustration of people working at desks.
  - The body is an editorial essay alternating text with full-width illustrations and **historical archival photos** (an industrial-revolution factory, a mid-century computer), plus a video, a "Join us" SF office paragraph, a press-logo row and a McLuhan pull quote.
  - **No stats.**
  - [Notion About](https://www.notion.com/about)

### Inferences
- The stat block, when present, sits **below the fold**. Deel places it after the founding story, as proof that backs up the narrative. Oyster places it on Careers, where it is pitched at candidates ("Distributed and diverse").
- In the hero, the common social-proof device is a one-line trust statement with a customer count (Deel's "Trusted by 40,000+ companies…"), often followed by a logo marquee. A multi-stat row is not the common choice.
- Developer-tool and productivity brands (Linear, Vercel, Notion, Stripe) lean on mission prose and people/investor lists rather than metric grids. Stripe's prose-embedded scale stats ("1.7% of global GDP") are the most distinctive "stats without a stat block" approach.

### Gaps
- Rendered number size, font weight, colour, and whether dividers or separators sit between stats could not be verified for any company (text fetcher only). Screenshots or a browser session would be needed.
- Papaya Global's About page is not verified (403 and archive refused).
- Whether Deel's stats use count-up animation is unknown.

## What stat formats recur (e.g. "35,000+ customers", label above vs below, units, footnotes)?

### Takeaway
The formats that recur are a rounded number with "+" (40,000+, 650,000+, 648+, 60+), currency with B suffix ($17.3B), and a bare country count (150, 70). The number sits above a short lowercase or Title-case noun label. Blocks hold 3–4 stats. No footnotes or "as of" dates were found on any fetched page, and figures are often inconsistent within the same site.

### Cited Findings
- Deel shows 4 stats, number above label, with mixed label casing: "Supported Businesses" vs "processed payments", "workers hired", "available countries". The formats mix a plain number (40,000), currency plus B ($17.3B) and a "+" suffix (650,000+). — [Deel About](https://www.deel.com/about/)
- Oyster shows 3 stats, number above label: "2020 / Year founded", "648+ / Employees", "70 / Countries". The founding year is used as a stat. — [Oyster Careers](https://www.oysterhr.com/careers)
- Inline-prose formats: "More than 5 million businesses", "around 1.7% of global GDP" ([Stripe](https://stripe.com/about)); "more than 40,000 companies" ([Linear](https://linear.app/about)); "600+ apps" ([Rippling](https://www.rippling.com/about)); "based in 60+ countries" ([Oyster](https://www.oysterhr.com/who-we-are)).
- Trust-line format: "Trusted by 40,000+ companies from startups to enterprise" ([Deel About](https://www.deel.com/about/)). Also a bold "40,000+ companies" above a logo scroller ([Deel Careers](https://www.deel.com/careers/)).
- Pages contradict themselves: Deel's About page has 35,000+ vs 40,000 customers and 150 vs 100 countries ([Deel About](https://www.deel.com/about/)). Oyster has 60+ countries on its About page vs 70 on Careers ([Oyster Who We Are](https://www.oysterhr.com/who-we-are); [Oyster Careers](https://www.oysterhr.com/careers)).
- No footnotes or "as of" qualifiers on any fetched stat. — all pages above

### Inferences
- A single-source, dated stats set (with an "as of" footnote) would be a differentiator. Even market leaders let figures drift across pages.
- The HR/EOR stat categories are: customers/businesses, payments processed, workers hired, countries covered, employees, and year founded.

### Gaps
- Typographic size ratio between number and label, and whether units such as "B" or "+" are styled smaller or in an accent colour, could not be seen.

## How are team/office photos integrated (grid, marquee, rounded tiles, full-bleed)?

### Takeaway
On About pages, the dominant team imagery is a **leadership headshot grid**: Remote has 9, Rippling 8–9 on brand-purple backgrounds, Oyster 8, Linear 8, and Deel has 2 founder headshots. Candid team or office photography is rare. Where it appears, it is a single image, a founder moment photo, or a small carousel on the Careers page. None of the fetched About pages showed an office photo grid or collage.

### Cited Findings
- Rippling lists 10 offices as text addresses only, with no office photos. Exec headshots are shot "on a purple background", which gives a branded, uniform backdrop. — [Rippling About](https://www.rippling.com/about)
- Deel uses founder headshots, a candid YC event photo ("Deel CEO Alex Bouaziz and Deel CRO Shuo Wang at YC") and investor headshot cards in a likely carousel. Its Careers page has 5 "Carousel image" photos and an "Alex_Shuo" photo. — [Deel About](https://www.deel.com/about/); [Deel Careers](https://www.deel.com/careers/)
- Oyster uses a hero composite, "Three smiling people in separate frames on a textured green background" (a framed-tile collage), plus leadership cards with decorative circles and flowers. Its Careers page has one full-width image and one candid team photo. — [Oyster Who We Are](https://www.oysterhr.com/who-we-are); [Oyster Careers](https://www.oysterhr.com/careers)
- Remote's About page has one image after "Our distributed team…" and a 9-person leadership grid with portraits. Its Careers page uses a stock-style "workfromhome" image. — [Remote About](https://remote.com/about); [Remote Careers](https://remote.com/careers)
- Linear shows headshots for leadership only. Everyone else appears as a plain text name list. — [Linear About](https://linear.app/about)
- Notion uses illustrations and historical archival photos instead of team photos. — [Notion About](https://www.notion.com/about)
- Stripe and Vercel show no people photography. — [Stripe](https://stripe.com/about); [Vercel](https://vercel.com/about)

### Inferences
- Remote-first EOR companies (Remote, Oyster, Deel) can't show "the office", so they use portraits, framed composites of individuals, or illustration. Rippling has physical offices and chooses to list them as text.
- Tile shape (rounded vs square) and whether images go full-bleed could not be confirmed from markup.

### Gaps
- Corner radius, aspect ratios and grid column counts are unverified.
- Whether any page uses an auto-scrolling photo marquee is unknown. Only the logo strips and the Deel testimonial/investor sets show duplication consistent with a marquee.

## Which patterns are specific to HR/EOR companies (Deel, Remote, Rippling, Oyster, Papaya) versus general SaaS?

### Takeaway
HR/EOR About pages are more "proof-heavy". They combine a customer-logo marquee, a trust line with customer count, global-coverage numbers (countries) and values sections with illustrations, alongside leadership grids. General SaaS and dev-tool pages (Linear, Vercel, Notion, Stripe) are more editorial: a mission essay, an investor/angel list and minimal or no imagery, with scale figures only inline in prose.

### Cited Findings
- Values sections are common among the HR/EOR pages: Remote (5 values), Oyster (4 illustrated values), Deel (6 value icons on Careers). — [Remote](https://remote.com/about); [Oyster](https://www.oysterhr.com/who-we-are); [Deel Careers](https://www.deel.com/careers/)
- Logo marquees appear on the HR/EOR pages: Deel (customer and investor logos, duplicated) and Oyster ("Trusted by teams and partners", duplicated). — [Deel](https://www.deel.com/about/); [Oyster](https://www.oysterhr.com/who-we-are)
- Global-coverage stats are HR-specific: "150 available countries" (Deel), "70 Countries" (Oyster), "60+ countries" (Oyster). — sources above
- Investor social proof appears on both sides:
  - Deel uses investor testimonial cards (Tobias Lütke, Dara Khosrowshahi, etc.).
  - Linear and Vercel show investor and angel name lists.
  - [Deel](https://www.deel.com/about/); [Linear](https://linear.app/about); [Vercel](https://vercel.com/about)
- Motion seen across the set:
  - Likely logo marquees (Deel, Oyster) and carousels (Deel), inferred from duplicated markup and filenames.
  - Hero video (Linear) and embedded video (Notion, Oyster link).
  - Hover-reveal image link cards (Stripe, inferred).
  - [Deel](https://www.deel.com/about/); [Linear](https://linear.app/about); [Notion](https://www.notion.com/about); [Stripe](https://stripe.com/about)

### Inferences
- An EOR About page following category norms would have: a mission H1 plus a trust line with customer count, a logo marquee, the origin story, a 3–4 stat row (customers, countries, workers/payments, founded/employees) with the number above the label, a leadership headshot grid on a consistent brand-colour backdrop, and values.
- Deel's page is the closest to a full reference implementation in this set.
- Showing real team or office photography would set an EOR company apart, because peers mostly avoid it.

### Gaps
- Papaya Global's patterns are unverified.
- No design-teardown articles were consulted, because of the tool-call budget. Visual-level claims (number size, separators, count-up animation) need screenshot verification.
