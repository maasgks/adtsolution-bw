/* ADT Black — runtime theme layer: scroll reveal, progress hairline
   and a contrast safety net (text that was orange on dark surfaces). */
(function () {
  'use strict';
  var d = document, html = d.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Containers whose children must never be hidden/animated: carousels move
  // slides with transforms, fixed chrome and dialogs manage their own state.
  var NO_TOUCH = 'header, .header_marquee, nav, .navbar, .modal, .offcanvas, .dropdown-menu, ' +
    '[class*="slider"], [class*="slick"], [class*="carousel"], [class*="swiper"], .tns-outer, .owl-carousel, ' +
    '[class*="marquee"], [class*="exit-intent"], .klaro, .cookie-notice, form, .select2-container, .footer_section, footer';

  /* ---------- scroll progress + header state ---------- */
  var bar = d.createElement('div');
  bar.id = 'mono-progress';
  bar.setAttribute('aria-hidden', 'true');
  d.body.appendChild(bar);
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var max = html.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
      html.classList.toggle('mono-scrolled', scrollY > 24);
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // dark bands whose backgrounds are gradients drawn by mono.css (former orange / navy sections, footer)
  var DARK_CTX = '.bg_orange_gradient, .bg_blue, .bg_blue2, .footer_section, .marquee_section, .marquee_section2, .email_support_section';

  /* ---------- contrast safety net ---------- */
  function rgb(str) {
    var m = str && str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(/[\s,\/]+/).map(parseFloat);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function lum(c) {
    var f = function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
    return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b);
  }
  var bgCache = new WeakMap();
  function effectiveBg(el) {
    var chain = [];
    for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
      if (bgCache.has(n)) { var hit = bgCache.get(n); chain.forEach(function (c) { bgCache.set(c, hit); }); return hit; }
      chain.push(n);
      // known dark bands (their gradients are drawn by mono.css, so no opaque colour to read)
      if (n.matches(DARK_CTX)) { var ink = { r: 14, g: 14, b: 14, a: 1 }; chain.forEach(function (x) { bgCache.set(x, ink); }); return ink; }
      var cs = getComputedStyle(n);
      // images and gradients: real backdrop colour unknown, leave the text as the site styled it
      if (cs.backgroundImage !== 'none') { chain.forEach(function (c) { bgCache.set(c, null); }); return null; }
      var c = rgb(cs.backgroundColor);
      if (c && c.a > .6) { chain.forEach(function (x) { bgCache.set(x, c); }); return c; }
    }
    var white = { r: 255, g: 255, b: 255, a: 1 };
    chain.forEach(function (x) { bgCache.set(x, white); });
    return white;
  }
  function guardContrast() {
    var els = d.body.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,span,li,label,strong,b,em,small,td,th,button,div');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], hasText = false;
      for (var k = el.firstChild; k; k = k.nextSibling) if (k.nodeType === 3 && k.nodeValue.trim()) { hasText = true; break; }
      if (!hasText || el.closest('[aria-hidden="true"], .mono-tl-step')) continue;   // decorative, faint on purpose
      var cs = getComputedStyle(el), fg = rgb(cs.color);
      if (!fg || fg.a < .5 || cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)') continue;
      var bg = effectiveBg(el);
      if (!bg) continue;
      var L1 = lum(fg), L2 = lum(bg);
      var ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
      if (ratio < 1.8) el.style.setProperty('color', L2 > .4 ? '#111111' : '#ffffff', 'important');
    }
  }

  /* ---------- buttons: one black-pill system ---------- */
  // Dark buttons (former orange, navy, #282828...) -> .mono-btn-ink; light outlined buttons on light
  // surfaces -> .mono-btn-line. Stateful controls (tabs, filters, toggles, arrows) keep their own styling.
  var BTN = 'a.common_btn, .common_btn, .btn, button, input[type="submit"], input[type="button"], a[class*="btn"], ' +
    'a[class*="button"], a[class*="cta"], .banner_button a, .load_more_btn a, .load_more_btn2 a';
  var NOT_BTN = '.navbar-toggler, .btn-close, .accordion-button, .slick-arrow, .slick-dots button, [role="tab"], .nav-link, ' +
    '.nav button, .dropdown-toggle, [class*="select2"], .klaro *, #klaro *, [class*="arrow"], [class*="close"], ' +
    '[class*="toggle"], [class*="dd-btn"], [class*="filter"], [class*="chip"], [class*="pill"], .page-link, [aria-pressed], ' +
    '.navbar-nav *, .menu_drop_column *, [class*="tab"], [class*="slider"] button, [class*="carousel"] button, a#scroll';
  // backdrop of a button: 'light', 'dark' or 'photo' (first opaque ancestor colour / known dark band)
  function backdrop(el) {
    for (var n = el.parentElement; n && n.nodeType === 1; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (cs.backgroundImage.indexOf('url(') !== -1) return 'photo';
      if (cs.backgroundImage.indexOf('gradient') !== -1) {          // dark gradient cards (fee cards, CTA bands)
        var g = rgb(cs.backgroundImage);
        if (g && g.a > .6) return lum(g) > .5 ? 'light' : 'dark';
      }
      var c = rgb(cs.backgroundColor);
      if (c && c.a > .6) return lum(c) > .5 ? 'light' : 'dark';
      if (n.matches(DARK_CTX)) return 'dark';
    }
    return 'light';
  }
  function styleButtons() {
    var els = d.querySelectorAll(BTN);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.dataset.monoBtn || el.matches(NOT_BTN) || el.classList.contains('active')) continue;
      var r = el.getBoundingClientRect();
      if (r.width < 60 || r.height < 26) continue;                     // hidden (e.g. closed modal) or icon-only: retry later
      if (!(el.innerText || el.value || '').trim()) continue;
      var cs = getComputedStyle(el), bg = rgb(cs.backgroundColor);
      var tl = parseFloat(cs.borderTopLeftRadius), tr = parseFloat(cs.borderTopRightRadius),
        br = parseFloat(cs.borderBottomRightRadius), bl = parseFloat(cs.borderBottomLeftRadius);
      var even = Math.max(tl, tr, br, bl) - Math.min(tl, tr, br, bl) < 1;   // joined to an input: keep its shape
      var kind = '', back = backdrop(el);
      // a black button on a black card disappears: invert it to a white pill there
      // dark gradient-filled buttons read as solid ink (first colour stop decides)
      var stop = cs.backgroundImage.indexOf('gradient') !== -1 && rgb(cs.backgroundImage);
      var gradient = !!stop && stop.a > .5 && lum(stop) < .2;
      if ((bg && bg.a > .8 && lum(bg) < .06) || gradient) kind = back === 'dark' ? 'mono-btn-light' : 'mono-btn-ink';
      else if ((!bg || bg.a < .1 || lum(bg) > .85) && parseFloat(cs.borderTopWidth) >= 1 &&
        (rgb(cs.borderTopColor) || { a: 0 }).a > .3 && back === 'light') kind = 'mono-btn-line';
      // outline buttons on dark cards: white outline + white text (they were dark grey on black)
      else if ((!bg || bg.a < .35) && back === 'dark' && parseFloat(cs.borderTopWidth) >= 1) kind = 'mono-btn-ghost';
      el.dataset.monoBtn = kind || '-';
      if (!kind) continue;
      el.classList.add(kind);
      // full pill only for single-line buttons; two-line labels keep their own rounded corners
      if (even && r.height < parseFloat(cs.fontSize) * 3.4) el.classList.add('mono-pill');
    }
  }

  /* ---------- button height + hover arrow ---------- */
  // Pills are 48px tall. On hover an arrow slides in after the label (CSS in mono.css §3):
  //  .mono-arrow        auto-width button: label slides left inside the padding, so its size never changes
  //  .mono-arrow-inline stretched / fixed-width button, or tight padding: the arrow grows in after the label
  // Buttons that already carry an arrow or icon, or use ::after themselves, are left alone.
  var ARROW_BTN = '[data-mono-btn^="mono-btn"], .testimonial_cta_section .common_btn, ' +
    ':is(.bg_orange_gradient, .bg_blue2, .email_support_section) :is(.pricing_btns, .banner_button) a.common_btn';
  function arrows() {
    if (d.fonts && d.fonts.status !== 'loaded') return;               // widths are only final with Inter loaded
    d.querySelectorAll(ARROW_BTN).forEach(function (el) {
      if (el.dataset.monoArrow) return;
      var r = el.getBoundingClientRect();
      if (r.width < 60 || r.height < 26) return;                       // hidden for now: retry later
      el.dataset.monoArrow = '-';
      var text = (el.textContent || '').trim(), cs = getComputedStyle(el), fs = parseFloat(cs.fontSize);
      if (!text || /[→›»>➜➔]\s*$|^\s*[←‹«<]/.test(text)) return;
      if (el.querySelector('svg, img, i, [class*="icon"], [class*="arrow"]') || /arrow|icon/i.test(el.className)) return;
      var after = getComputedStyle(el, '::after').content;
      if (after && after !== 'none' && after !== 'normal') return;
      if (cs.position !== 'static' && cs.position !== 'relative') return;
      if (r.height > fs * 3.4) return;                                    // two-line label
      // 48px pills
      if (parseFloat(cs.borderTopLeftRadius) >= r.height / 2 - 1 && r.height < 46) {
        if (cs.display.indexOf('flex') !== -1) el.style.setProperty('min-height', '48px', 'important');
        else {
          var extra = (48 - r.height) / 2;
          el.style.setProperty('padding-top', (parseFloat(cs.paddingTop) + extra) + 'px', 'important');
          el.style.setProperty('padding-bottom', (parseFloat(cs.paddingBottom) + extra) + 'px', 'important');
        }
      }
      var pl = parseFloat(cs.paddingLeft), pr = parseFloat(cs.paddingRight);
      var rg = d.createRange(); rg.selectNodeContents(el);
      var natural = rg.getBoundingClientRect().width + pl + pr + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
      var stretched = r.width > natural + 12;
      if (!stretched && pl >= 20 && pr >= 20) {
        el.style.setProperty('--mono-pl', pl + 'px');
        el.style.setProperty('--mono-pr', pr + 'px');
        el.classList.add('mono-arrow');
      } else el.classList.add('mono-arrow-inline');
      el.dataset.monoArrow = '1';
    });
  }

  /* ---------- home: "Global reach" + "Built for Dynamic HR Teams" ---------- */
  // Sections that animate as a whole when they scroll into view (.mono-anim -> .mono-seen; CSS in §10).
  function homeSections() {
    var gr = d.querySelector('.global_reach_section');
    if (gr && !gr.dataset.mono) {
      gr.dataset.mono = '1';
      gr.classList.add('mono-anim');
      // the "Talk to our expert" popup is one flat image (orange button included): rebuild it as a live card.
      // The avatars are cropped from that same image (its faces sit on a 100px grid, 66px wide, at y 122).
      var a = gr.querySelector('.globe_div_popup a');
      if (a && !a.querySelector('.mono-expert')) {
        var src = (a.querySelector('img') || {}).src || '';
        var faces = '';
        for (var i = 0; i < 5; i++) faces += '<span style="--x:' + (93 + i * 100) + ';background-image:url(\'' + src + '\')"></span>';
        a.insertAdjacentHTML('beforeend',
          '<div class="mono-expert"><div class="mono-expert-faces">' + faces + '</div>' +
          '<div class="mono-expert-live"><i></i>Experts online now</div>' +
          '<strong>Talk to our expert</strong><small>Get quick guidance from industry leaders</small>' +
          '<span class="mono-expert-btn">Connect now</span></div>');
        a.classList.add('mono-expert-link');
      }
      var right = gr.querySelector('.global_reach_right');
      if (right && !right.querySelector('.mono-eyebrow')) right.insertAdjacentHTML('afterbegin', '<span class="mono-eyebrow">Global presence</span>');
    }
    var bt = d.querySelector('.build_team_section');
    if (bt && !bt.dataset.mono) {
      bt.dataset.mono = '1';
      bt.classList.add('mono-anim');
      var pop = bt.querySelector('.build_team_popup');
      if (pop && !pop.querySelector('.mono-eyebrow')) pop.insertAdjacentHTML('afterbegin', '<span class="mono-eyebrow">One platform, every country</span>');
    }
    // home: product tiles animate as one choreography; section headings get a small label
    var gs = d.querySelector('.global_section');
    if (gs && gs.querySelector('.global_section_common')) gs.classList.add('mono-anim');
    [['.global_section > .container > .row > .common_title', 'One platform'], ['.why_adt_section.bg_grey .common_title', 'Why teams choose us'],
     ['.trusted_by_section .common_title', 'Customer stories']].forEach(function (p) {
      var t = d.querySelector(p[0]);
      if (t && !t.querySelector('.mono-eyebrow')) t.insertAdjacentHTML('afterbegin', '<span class="mono-eyebrow">' + p[1] + '</span>');
    });
    d.querySelectorAll('.expand_section').forEach(function (s) { if (s.querySelector('.expand_image_wrappper')) s.classList.add('mono-anim'); });
    var secs = d.querySelectorAll('.mono-anim:not(.mono-seen)');
    if (!secs.length) return;
    if (!('IntersectionObserver' in window)) { secs.forEach(function (s) { s.classList.add('mono-seen'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        e.target.classList.add('mono-seen');
        countUp(e.target);
      });
    }, { threshold: .18 });
    secs.forEach(function (s) { io.observe(s); });
  }
  // stats such as "50+" or "99.9%" count up from zero once ("24/7" and other non-numbers stay as they are)
  function countUp(root) {
    root.querySelectorAll('.global_counters h2, .eor_global_column .count').forEach(function (h) {
      var m = /^(\d+(?:\.\d+)?)(\D{0,2})$/.exec(h.textContent.trim());
      if (!m || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var end = parseFloat(m[1]), dec = (m[1].split('.')[1] || '').length, suf = m[2], t0 = 0;
      h.style.minWidth = h.offsetWidth + 'px';
      (function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
        h.textContent = (end * e).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }

  /* ---------- testimonials: an endless loop of cards ---------- */
  // Every card has the same height; its WIDTH adapts to its quote (long quote = wide card), so each
  // quote is shown in full with no empty space. Very short quotes are set a little larger instead.
  // The row is duplicated and scrolls endlessly; hovering pauses it. Content is unchanged.
  function testimonials() {
    var sec = d.querySelector('.trusted_by_section');
    if (!sec || sec.querySelector('.mono-tloop')) return;
    var seen = {}, cards = [];
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
    sec.querySelectorAll('.trusted_companies_slider .trusted_companies_column').forEach(function (card) {
      if (card.closest('.slick-cloned')) return;
      var nameEl = card.querySelector('p.name'), q = card.querySelector('.custom_scroll p') || card.querySelector('p');
      if (!nameEl || !q) return;
      var name = nameEl.textContent.trim();
      if (seen[name]) return;
      seen[name] = 1;
      var org = nameEl.nextElementSibling ? nameEl.nextElementSibling.textContent.trim() : '';
      var logo = card.querySelector('h3 img');
      var initials = name.split(/\s+/).map(function (w) { return w.charAt(0); }).slice(0, 2).join('').toUpperCase();
      cards.push('<figure class="mono-tcard">' +
        '<div class="mono-tcard-head">' + (logo ? '<img src="' + esc(logo.getAttribute('src')) + '" alt="' + esc(logo.alt || org) + '" loading="eager">' : '') +
        '<svg class="mono-tcard-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 18c-1.9 0-3.2-1.5-3.2-3.6 0-3.4 2.4-6.6 5.8-8.4l.9 1.4C8.5 8.6 7.3 10.2 7 11.7c.3-.1.7-.2 1.1-.2 1.7 0 2.9 1.2 2.9 3 0 1.9-1.6 3.5-3.8 3.5zm9.8 0c-1.9 0-3.2-1.5-3.2-3.6 0-3.4 2.4-6.6 5.8-8.4l.9 1.4c-2.2 1.2-3.4 2.8-3.7 4.3.3-.1.7-.2 1.1-.2 1.7 0 2.9 1.2 2.9 3 0 1.9-1.6 3.5-3.8 3.5z"/></svg></div>' +
        '<blockquote>' + esc(q.textContent.trim().replace(/\s+/g, ' ')) + '</blockquote>' +
        '<figcaption><span class="mono-tcard-avatar" aria-hidden="true">' + initials + '</span>' +
        '<span class="mono-tcard-who"><strong>' + esc(name) + '</strong><span>' + esc(org) + '</span></span></figcaption></figure>');
    });
    if (!cards.length) return;
    var set = cards.join('');
    var loop = d.createElement('div');
    loop.className = 'mono-tloop';
    loop.innerHTML = '<div class="mono-ttrack">' + set + set.replace(/<figure class="mono-tcard">/g, '<figure class="mono-tcard" aria-hidden="true">') + '</div>';
    var wrap = sec.querySelector('.trusted_companies_wrapper');
    wrap.parentNode.insertBefore(loop, wrap);
    sec.classList.add('mono-tloop-on');
    fitLoop(loop, cards.length);
    var t;
    addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { fitLoop(loop, cards.length); }, 200); });
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { fitLoop(loop, cards.length); });
  }
  function fitLoop(loop, n) {
    var all = loop.querySelectorAll('.mono-tcard'), GAP = 20;
    var maxW = Math.min(680, Math.round(innerWidth * .86)), minW = Math.min(300, maxW);
    var set = function (c, w, fs) { c.style.width = w + 'px'; c.style.setProperty('--fs', fs + 'px'); c.style.height = 'auto'; return c.offsetHeight; };
    // the common height: the longest quote at the widest card
    var H = 0, i, c;
    for (i = 0; i < n; i++) H = Math.max(H, set(all[i], maxW, 15));
    var picks = [];
    for (i = 0; i < n; i++) {
      c = all[i];
      var pick = null, sizes = [18, 17, 16, 15];
      for (var s = 0; s < sizes.length && !pick; s++) {
        for (var w = minW; w <= maxW; w += 10) {
          var h = set(c, w, sizes[s]);
          if (h <= H) { if (H - h <= 44 || sizes[s] === 15) pick = { w: w, fs: sizes[s] }; break; }
        }
      }
      picks.push(pick || { w: maxW, fs: 15 });
    }
    var shift = 0;
    for (i = 0; i < all.length; i++) {
      var p = picks[i % n];
      set(all[i], p.w, p.fs);
      all[i].style.height = H + 'px';
      if (i < n) shift += p.w + GAP;
    }
    var track = loop.firstChild;
    track.style.setProperty('--shift', -shift + 'px');
    track.style.setProperty('--dur', Math.round(shift / 38) + 's');      // ~38px per second
  }


  // search box inside dropdown menus gets a hint
  d.addEventListener('focusin', function (e) {
    var t = e.target;
    if (t && t.matches && t.matches('.select2-search--dropdown .select2-search__field') && !t.placeholder) t.placeholder = 'Search…';
  });

  /* ---------- about: journey timeline + hero ---------- */
  // "Our Journey" was five tab pills: rebuild the same periods as a vertical timeline whose rail fills as
  // you scroll; each period's node lights up when it reaches the middle of the screen.
  function journey() {
    var sec = d.querySelector('.about-journey');
    if (!sec || sec.querySelector('.mono-tl')) return;
    var pills = sec.querySelectorAll('.nav-tabs .nav-link'), items = '';
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
    pills.forEach(function (pill, i) {
      var pane = sec.querySelector(pill.getAttribute('data-bs-target'));
      if (!pane) return;
      var title = pane.querySelector('.journey-title'), text = pane.querySelector('.journey-text'), img = pane.querySelector('img');
      items += '<article class="mono-tl-item' + (i % 2 ? ' is-flip' : '') + '">' +
        '<div class="mono-tl-node" aria-hidden="true"><span></span></div>' +
        '<div class="mono-tl-body"><span class="mono-tl-step">' + ('0' + (i + 1)).slice(-2) + '</span>' +
        '<span class="mono-tl-period">' + esc(pill.textContent.trim().replace(/\s*-\s*/, ' – ')) + '</span>' +
        '<h3>' + esc(title ? title.textContent.trim() : '') + '</h3>' +
        '<p>' + esc(text ? text.textContent.trim().replace(/\s+/g, ' ') : '') + '</p></div>' +
        (img ? '<figure class="mono-tl-media"><img src="' + esc(img.getAttribute('src')) + '" alt="' + esc(img.alt || '') + '" loading="lazy" width="' + (img.getAttribute('width') || 1200) + '" height="' + (img.getAttribute('height') || 800) + '"></figure>' : '') +
        '</article>';
    });
    if (!items) return;
    var tl = d.createElement('div');
    tl.className = 'mono-tl';
    tl.innerHTML = '<div class="mono-tl-rail" aria-hidden="true"><span class="mono-tl-fill"></span></div>' + items;
    var content = sec.querySelector('.tab-content');
    content.parentNode.insertBefore(tl, content);
    sec.classList.add('mono-tl-on');
    var rail = tl.querySelector('.mono-tl-rail'), fill = rail.firstChild, arts = tl.querySelectorAll('.mono-tl-item'), ticking = false;
    function place() {                                          // rail runs from the first node to the last
      var first = arts[0].querySelector('.mono-tl-node'), last = arts[arts.length - 1].querySelector('.mono-tl-node');
      var base = tl.getBoundingClientRect().top, f = first.getBoundingClientRect(), l = last.getBoundingClientRect();
      var top = f.top - base + f.height / 2, bottom = l.top - base + l.height / 2;
      rail.style.top = top + 'px'; rail.style.height = Math.max(0, bottom - top) + 'px';
    }
    function update() {
      ticking = false;
      var mid = innerHeight * .55, r = rail.getBoundingClientRect();
      var p = r.height ? Math.min(1, Math.max(0, (mid - r.top) / r.height)) : 0;
      fill.style.transform = 'scaleY(' + p + ')';
      arts.forEach(function (a) {
        var n = a.querySelector('.mono-tl-node').getBoundingClientRect();
        a.classList.toggle('is-active', n.top + n.height / 2 <= mid);
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    place(); update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', function () { place(); update(); });
    addEventListener('load', function () { place(); update(); });
    tl.querySelectorAll('img').forEach(function (im) { im.addEventListener('load', function () { place(); update(); }); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { threshold: .2, rootMargin: '0px 0px -8% 0px' });
      arts.forEach(function (a) { io.observe(a); });
    } else arts.forEach(function (a) { a.classList.add('is-in'); });
  }
  // About hero: split layout (copy beside a three-photo grid) with a full-width stat rail below,
  // replacing the flat collage image with stat cards floating over its corners. The photos are crops of
  // that same collage (assets/theme/about/). Stats keep their real values in the DOM for screen readers;
  // only an aria-hidden copy counts up, once, when the rail is in view and motion is allowed.
  function aboutHero() {
    var h = d.querySelector('.about-hero');
    if (!h || h.dataset.mono) return;
    var left = h.querySelector('.banner_left'), wrap = h.querySelector('.about-hero-wrapper');
    if (!left || !wrap) return;
    h.dataset.mono = '1';
    var theme = (d.querySelector('script[src*="theme/mono.js"]') || {}).src || '';
    var base = theme.replace(/mono\.js.*$/, 'about/');
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
    var title = left.querySelector('h1'), intro = left.querySelector('p'), cta = h.querySelector('.hero-cta');
    var stats = [].map.call(h.querySelectorAll('.hero-stat'), function (s) {
      return { v: s.querySelector('h2').textContent.trim().replace(/\s+/g, ''), l: s.querySelector('p').textContent.trim() };
    });
    var grid = d.createElement('div');
    grid.className = 'mono-ah';
    grid.innerHTML =
      '<div class="mono-ah-copy"><span class="mono-eyebrow">About us · Since 2015</span></div>' +
      '<div class="mono-ah-media">' +
        '<figure class="mono-ah-ph is-tall"><img src="' + base + 'globe.jpg" alt="A hand turning a globe on a desk" width="581" height="452" fetchpriority="high" decoding="async"></figure>' +
        '<figure class="mono-ah-ph"><img src="' + base + 'office.jpg" alt="Open-plan office with people working at desks" width="739" height="288" decoding="async"></figure>' +
        '<figure class="mono-ah-ph"><img src="' + base + 'team.jpg" alt="Colleagues working together on laptops" width="1099" height="324" decoding="async"></figure>' +
      '</div>';
    var copy = grid.firstChild;
    if (title) copy.appendChild(title);
    if (intro) copy.appendChild(intro);
    if (cta) copy.appendChild(cta);
    var rail = d.createElement('dl');
    rail.className = 'mono-ah-stats';
    rail.innerHTML = stats.map(function (s, i) {
      var m = /^([\d.]+)(K?)([+%]?)$/.exec(s.v) || [s.v, s.v, '', ''];
      return '<div class="mono-ah-stat" style="--i:' + i + '"><dt>' + esc(s.l) + '</dt>' +
        '<dd><span class="mono-ah-num" data-end="' + esc(m[1]) + '" aria-hidden="true">' + esc(m[1] + m[2]) + '<i>' + esc(m[3]) + '</i></span>' +
        '<span class="mono-sr">' + esc(s.v) + '</span></dd>' +
        '<span class="mono-ah-no" aria-hidden="true">' + ('0' + (i + 1)).slice(-2) + '</span></div>';
    }).join('');
    var row = left.closest('.row');
    (row || left).parentNode.insertBefore(grid, row || left);
    grid.parentNode.insertBefore(rail, grid.nextSibling);
    if (row) row.style.display = 'none';
    wrap.style.display = 'none';
    h.classList.add('mono-ah-on', 'mono-anim');
    // count up once, in view, motion allowed
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      rail.querySelectorAll('.mono-ah-num').forEach(function (n) {
        var end = parseFloat(n.dataset.end), dec = (n.dataset.end.split('.')[1] || '').length;
        var tail = n.innerHTML.slice(n.dataset.end.length), t0 = 0;
        (function step(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - p, 3);
          n.innerHTML = (end * e).toFixed(dec) + tail;
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: .4 });
    io.observe(rail);
  }


  // About "Our Core Values": a 3x2 bento grid; the section heading moves into a dark intro tile
  function values() {
    var sec = d.querySelector('.about-values'), wrap = sec && sec.querySelector('.core_values_wrapper');
    if (!wrap || wrap.querySelector('.mono-values-intro')) return;
    var h = sec.querySelector('.common_title h2');
    var intro = d.createElement('div');
    intro.className = 'mono-values-intro';
    intro.innerHTML = '<span class="mono-eyebrow">What we stand for</span><h2>' + (h ? h.textContent.trim() : 'Our Core Values') + '</h2>' +
      '<p>The principles behind every team we hire, pay and support.</p>';
    wrap.insertBefore(intro, wrap.firstChild);
    wrap.querySelectorAll('.value-card').forEach(function (c, i) {
      c.insertAdjacentHTML('afterbegin', '<span class="mono-value-no" aria-hidden="true">' + ('0' + (i + 1)).slice(-2) + '</span>');
    });
    sec.classList.add('mono-values-on', 'mono-anim');
  }
  // About 'What Makes Dhi ADT Different': label + numbered cells in one hairline panel
  function diff() {
    var s = d.querySelector('.about-diff');
    if (!s || s.classList.contains('mono-diff-on')) return;
    var head = s.querySelector('.common_title');
    if (head && !head.querySelector('.mono-eyebrow')) head.insertAdjacentHTML('afterbegin', '<span class="mono-eyebrow">Why Dhi ADT</span>');
    s.querySelectorAll('.feature-card').forEach(function (f, i) {
      f.insertAdjacentHTML('afterbegin', '<span class="mono-diff-no" aria-hidden="true">' + ('0' + (i + 1)).slice(-2) + '</span>');
      f.parentElement.style.setProperty('--i', i);
    });
    s.classList.add('mono-diff-on', 'mono-anim');
  }
  // About 'Our Team': leadership grid (label above the heading, staggered entrance)
  function team() {
    var t = d.querySelector('.about-team');
    if (!t || t.classList.contains('mono-team-on')) return;
    var head = t.querySelector('.common_title');
    if (head && !head.querySelector('.mono-eyebrow')) head.insertAdjacentHTML('afterbegin', '<span class="mono-eyebrow">Leadership</span>');
    t.querySelectorAll('.teamimg').forEach(function (m, i) { m.style.setProperty('--i', i); });
    t.classList.add('mono-team-on', 'mono-anim');
  }

  // Contact page: label above the hero heading, the consultation form beside its reassurances (instead of a
  // lone centred card under them), section labels, and entrance animation. Content is unchanged.
  function contactPage() {
    var hero = d.querySelector('.contact_help_section');
    if (!hero || hero.dataset.mono) return;
    hero.dataset.mono = '1';
    var left = hero.querySelector('.banner_left');
    if (left && !left.querySelector('.mono-eyebrow')) left.insertAdjacentHTML('afterbegin', '<span class="mono-eyebrow">Contact us</span>');
    var badge = left && left.querySelector('.common_btn');
    if (badge) badge.classList.add('mono-status');
    hero.classList.add('mono-contact-hero', 'mono-anim');
    hero.querySelectorAll('.contact_column_wrapper').forEach(function (c, i) {
      c.style.setProperty('--i', i);
      var a = c.querySelector('p a');
      if (a) c.classList.add('mono-has-link');
    });
    // consultation: benefits on the left under the form's heading, form card on the right
    var book = d.querySelector('.book_now_section');
    var form = book && book.querySelector('.contact_page_form');
    if (form && !book.querySelector('.mono-cbook')) {
      var cols = book.querySelectorAll('.book_now_column');
      var grid = d.createElement('div');
      grid.className = 'mono-cbook';
      grid.innerHTML = '<div class="mono-cbook-copy"><span class="mono-eyebrow">Book a consultation</span><ul class="mono-cbook-list"></ul></div><div class="mono-cbook-form"></div>';
      var h = form.querySelector('h4');
      if (h) grid.firstChild.insertBefore(h, grid.firstChild.lastChild);
      cols.forEach(function (c) {
        var li = d.createElement('li');
        li.appendChild(c);
        grid.firstChild.lastChild.appendChild(li);
      });
      var row = form.closest('.row');
      grid.lastChild.appendChild(form);
      row.parentNode.insertBefore(grid, row);
      row.style.display = 'none';
      book.classList.add('mono-cbook-on', 'mono-anim');
    }
    var offices = d.querySelector('.country_tab_section');
    if (offices && !offices.querySelector('.mono-office-head')) {
      var tabs = offices.querySelector('.nav-tabs');
      if (tabs) tabs.insertAdjacentHTML('beforebegin', '<div class="mono-office-head common_title"><span class="mono-eyebrow">Our offices</span><h2>Find us around the world</h2></div>');
      offices.classList.add('mono-offices-on');
    }
    var support = d.querySelector('.email_support_section');
    if (support) support.classList.add('mono-support-on');
  }

  /* ---------- scroll reveal ---------- */
  var CARD = '.gl-card, .related-card, .feature-card, .value-card, .team-card, .pp-diff-card, .pp-calc-card, ' +
    '.checklist-card, .blog-rec-card, .accordion-item, .country_taxes_column, .core_value_column, ' +
    '.resources_column, .eor_global_column, .response_time_column, .relocation_service_column, ' +
    '.comprehensive_column, .global_presence_column, .pp-faq-item, .journey-title, .card';
  var BLOCK = 'section .row > [class*="col"], section [class*="common_title"], section > .container > h1, ' +
    'section > .container > h2, section > .container > p, .breadcrumb_section .container > *, main .row > [class*="col"]';

  function reveal() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var picked = [];
    function ok(el) {
      if (el.closest(NO_TOUCH) || el.closest('.mono-anim')) return false;   // .mono-anim sections run their own entrance
      var cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.position === 'sticky') return false;
      return true;
    }
    d.querySelectorAll(CARD).forEach(function (el) { if (ok(el)) picked.push(el); });
    d.querySelectorAll(BLOCK).forEach(function (el) {
      if (!ok(el)) return;
      if (el.querySelector(CARD)) return;                       // cards inside animate on their own
      for (var i = 0; i < picked.length; i++) if (picked[i] === el || picked[i].contains(el) || el.contains(picked[i])) return;
      picked.push(el);
    });
    // nested picks: keep only the outermost within the same chain
    picked = picked.filter(function (el) { return !picked.some(function (o) { return o !== el && o.contains(el); }); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; io.unobserve(el);
        el.classList.add('mono-in');
        var done = function () {                              // hand transforms back to the site's own CSS
          el.classList.remove('mono-reveal', 'mono-in', 'mono-reveal-img');
          el.style.removeProperty('--mono-d');
          el.removeEventListener('transitionend', done);
        };
        el.addEventListener('transitionend', done);
        setTimeout(done, 1800);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    // failsafe: anything on or above the current viewport that the observer
    // missed (anchor jumps, fast scroll, zero-size parents) is shown anyway
    function sweep() {
      var vh = innerHeight;
      d.querySelectorAll('.mono-reveal:not(.mono-in)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh) { io.unobserve(el); el.classList.add('mono-in'); setTimeout(function () { el.classList.remove('mono-reveal', 'mono-in', 'mono-reveal-img'); }, 1600); }
      });
    }
    var sweepT;
    addEventListener('scroll', function () { clearTimeout(sweepT); sweepT = setTimeout(sweep, 400); }, { passive: true });
    setTimeout(sweep, 2500);

    picked.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentElement ? el.parentElement.children : [], function (s) { return picked.indexOf(s) !== -1; });
      var idx = Math.max(0, sibs.indexOf(el));
      el.style.setProperty('--mono-d', Math.min(idx * 0.09, 0.45) + 's');
      el.classList.add('mono-reveal');
      if (el.tagName === 'IMG' || (el.children.length === 1 && el.firstElementChild.tagName === 'IMG' && !el.textContent.trim())) el.classList.add('mono-reveal-img');
      io.observe(el);
    });
  }

  /* ---------- boot ---------- */
  /* ---------- safety nets for the site's own scripts ---------- */
  // WOW.js hides `.wow` blocks until it animates them; when it is missing (script error) or misses an
  // element (fast scroll, anchor jump), the content stays invisible. Show anything that should be on screen.
  function showWow(all) {
    var vh = innerHeight;
    d.querySelectorAll('.wow').forEach(function (el) {
      if (el.style.visibility !== 'hidden' && !all) return;
      if (all || el.getBoundingClientRect().top < vh) { el.style.visibility = 'visible'; el.style.animationName = 'none'; }
    });
  }
  // broken images: hide the browser's broken-image icon, keep the layout
  function markBroken(img) { if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) img.classList.add('mono-img-missing'); }
  d.addEventListener('error', function (e) { if (e.target && e.target.tagName === 'IMG') e.target.classList.add('mono-img-missing'); }, true);

  /* ---------- readable line length ---------- */
  // Intros, notes and prose often span the whole 1100px+ container (140+ characters a line).
  // Cap running text at a comfortable measure; centred text stays centred under its heading.
  var PROSE = 'p, li, blockquote, dd, .lead, div, span, h1, h2, h3, h4';
  var NOT_PROSE = 'header, nav, footer, .footer_section, table, .modal, .dropdown-menu, .offcanvas, button, a, label, ' +
    '[class*="marquee"], [class*="slider"], [class*="swiper"], [class*="carousel"], .mono-measure';
  function measure() {
    d.querySelectorAll(PROSE).forEach(function (el) {
      if (el.closest(NOT_PROSE)) return;
      var own = '', k = el.firstChild;
      for (; k; k = k.nextSibling) if (k.nodeType === 3 || (k.nodeType === 1 && /^(STRONG|B|EM|I|SPAN|A|BR|SMALL|SUP)$/.test(k.tagName))) own += k.textContent;
      if (own.trim().length < 50) return;
      var cs = getComputedStyle(el);
      if (cs.display === 'inline' || cs.display === 'none' || cs.display.indexOf('flex') > -1 || cs.display.indexOf('grid') > -1) return;
      // only blocks that run (nearly) the full page width; text in cards and columns is left alone
      // (centred lines get tiring sooner, so they are capped from a narrower width)
      var head = /^H[1-4]$/.test(el.tagName), mid = cs.textAlign === 'center';
      if (el.getBoundingClientRect().width <= (head ? 960 : mid ? 800 : 920)) return;
      el.classList.add('mono-measure', head ? 'mono-measure-h' : 'mono-measure-p');
      if (cs.textAlign === 'center') el.classList.add('mono-measure-c');
    });
  }

  // the blog's "Recent Blog" titles are typed in capitals; show them in title case like every other heading
  var ACRO = /^(EOR|PEO|ADT|HR|HRIS|HRMS|UK|US|USA|EU|UAE|KSA|GCC|GDPR|IT|AI|CEO|CFO|CTO|APAC|EMEA|LATAM|PAYE|VAT|GST|TDS|PF|ESI|IOR|TEA|SME|SMES|FAQ|ROI|KPI|NDA|B2B|SAAS|IP|PEOS|EORS|II|III|IV)$/;
  var SMALL = /^(a|an|and|as|at|but|by|for|from|in|into|of|on|or|per|the|to|vs|via|with)$/;
  function unshout() {
    d.querySelectorAll('.recent-blog-content h5 a').forEach(function (a) {
      var t = a.textContent;
      if (!/[A-Z]{3}/.test(t) || t !== t.toUpperCase()) return;
      a.textContent = t.trim().split(/(\s+)/).map(function (w, i) {
        if (/^\s+$/.test(w)) return w;
        return w.replace(/[A-Za-z][A-Za-z']*/g, function (word) {
          if (ACRO.test(word.replace(/'S$/, ''))) return word.replace(/'S$/, "'s");
          var low = word.toLowerCase();
          return i > 0 && SMALL.test(low) ? low : low.charAt(0).toUpperCase() + low.slice(1);
        });
      }).join('');
    });
  }

  function buttons() { try { styleButtons(); arrows(); measure(); } catch (e) { } }
  function boot() {
    try { unshout(); } catch (e) { }
    try { testimonials(); } catch (e) { }
    try { journey(); aboutHero(); values(); team(); diff(); contactPage(); } catch (e) { }
    try { homeSections(); } catch (e) { }
    buttons();
    try { reveal(); } catch (e) { }
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
  addEventListener('load', function () {
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 200); };
    idle(function () { buttons(); try { guardContrast(); } catch (e) { } });
    setTimeout(buttons, 2500);                                   // late site CSS / lazy blocks
    d.querySelectorAll('img').forEach(markBroken);
    setTimeout(function () { showWow(typeof window.WOW === 'undefined'); }, 1500);
  });
  var wowT;
  addEventListener('scroll', function () { clearTimeout(wowT); wowT = setTimeout(function () { showWow(false); }, 700); }, { passive: true });
  // buttons that only become visible later (modals, tabs, accordions, mobile menu)
  ['shown.bs.modal', 'shown.bs.tab', 'shown.bs.collapse', 'shown.bs.dropdown'].forEach(function (ev) {
    d.addEventListener(ev, function () { setTimeout(buttons, 50); });
  });
  var clickT;
  d.addEventListener('click', function () { clearTimeout(clickT); clickT = setTimeout(buttons, 400); }, true);
})();
