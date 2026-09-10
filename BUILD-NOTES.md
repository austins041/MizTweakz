# MIZTWEAKZ Redesign — Build Notes (Phase A)

Static multi-page site that mirrors **paragontweaks.net**'s layout, components and page behaviours with **MIZTWEAKZ**'s palette, logo, fonts and content. No framework, no build step, no CDN other than Google Fonts.

```
site/
  index.html              home (done)
  404.html                not-found (done, Cloudflare Pages serves it automatically)
  _headers                security + asset cache headers
  assets/css/site.css     the whole design system (tokens at the top)
  assets/js/data.js       window.MZ  — every piece of content as data
  assets/js/site.js       window.MZ.ui — header/footer injection + all behaviours
  assets/img/*.svg        generated brand + product imagery (see "Assets")
tools/svg-gen/gen.js      one-off generator for the SVGs (needs opentype.js + Oswald-Bold.ttf)
docs/                     the Paragon audit + MIZTWEAKZ brand/content extraction
```

Deploy: `wrangler pages deploy site`. Preview locally: `npx http-server site -p 8123 -c-1`.

Sources of truth: `docs/paragon-tweaks-audit.md` (layout/UX) and `docs/miztweakz-brand-and-content.md` (colors/copy).

---

## 1. Route map (Phase B: one folder per route, `index.html` inside)

| Paragon | MIZTWEAKZ | `body[data-page]` | Notes |
|---|---|---|---|
| `/` | `/` | `home` | done |
| `/services` | `/packs/` | `packs` | sections `#fps`, `#ping`, `#delay`, `#ultimate` (ids = `MZ.categories[].id`). `?pack=<handle>` auto-opens that pack's Buy modal on load (site.js already does this on every page; on `data-page="packs"` it also mirrors the open modal into the URL like Paragon's `/services/Tweaking/Elite`). |
| `/utilities` (NEW) | `/utilities/` | `utilities` | PC Debloat Tool (`MZ.helpers.pack('debloat-tool')`) + guides/downloads |
| `/about` | `/about/` | `about` | `MZ.creators`, `MZ.brand.videos` (YouTube ids; gate embeds behind functional consent, see §7) |
| `/partners` | `/affiliates/` | `affiliates` | `MZ.brand.affiliateUrl`, `MZ.affiliateFaqs` |
| `/contact` | `/contact/` | `contact` | `MZ.brand.socials.discordContact`, `MZ.brand.email` |
| `/tos`, `/privacy` | `/tos/`, `/privacy/` | `tos`, `privacy` | |

Header nav order/labels/icons/badges come from `MZ.nav`; the Packs hover dropdown comes from `MZ.categories`. The active tab is computed from the first path segment, so nested pages under a route stay highlighted.

## 2. Page skeleton (copy exactly)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Packs | MIZTWEAKZ</title>
  <meta name="description" content="…">
  <meta name="theme-color" content="#1f1f21">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Figtree:ital,wght@0,400;0,500;0,700;1,400&display=swap">
  <link rel="stylesheet" href="/assets/css/site.css">
  <script>document.documentElement.classList.add('js');</script>
  <script src="/assets/js/data.js" defer></script>
  <script src="/assets/js/site.js" defer></script>
</head>
<body data-page="packs">
  <a href="#main-content" class="skip-link">Skip to content</a>
  <div id="site-header"></div>

  <main id="main-content" class="page" tabindex="-1">
    <!-- first block gets the mount animation -->
    <section class="banner" data-mount>
      <div class="banner-content">
        <h1 class="banner-title">Our Packs</h1>
        <div class="banner-pills">
          <a class="title-tag nav-tag" href="#fps" style="--color:#e3fc02">FPS</a>
          <a class="title-tag nav-tag" href="#ping" style="--color:#00fced">Ping</a>
          <a class="title-tag nav-tag" href="#delay" style="--color:#ffffff">Delay</a>
          <a class="title-tag nav-tag title-tag--gradient" href="#ultimate"><span>Ultimate Bundle</span></a>
        </div>
      </div>
    </section>

    <!-- every following block: .animate (Paragon useRevealOnScroll) or .reveal (home-style sections) -->
    <section class="section section-with-bar animate" id="fps">
      <h2>FPS Pack</h2>
      <div class="pack-grid pack-grid--1" data-render="pack-grid" data-category="fps"></div>
    </section>
  </main>

  <div id="site-footer"></div>
</body>
</html>
```

Rules: root-relative URLs only (`/assets/…`, `/packs/`); `html.js` is added inline so hidden-until-revealed elements stay visible without JS; header, footer, modal shell, cookie card and shield button are all injected by `site.js`.

Use `<main class="page">` (gap `clamp(3rem,6vw,5rem)`, padding `0 20px`, `margin-top: var(--nav-height)`) or `.page.page--tight` for denser pages. Anchor targets need `.section` (`scroll-margin-top: var(--nav-height)`).

## 3. Design tokens (`:root` in site.css)

| Token | Value | Paragon role |
|---|---|---|
| `--bg` | `#1f1f21` | `#0c0c0c` page background (+ fixed `texture.svg` via `body::before`) |
| `--surface` | `#2b2b2e` | raised surfaces |
| `--hairline` / `--hairline-soft` | `rgba(255,255,255,.10)` / `.06` | glass-card top/bottom borders |
| `--heading` / `--text` / `--muted` | `#fff` / `#c7c7c8` / `#8f8f90` | text tiers; also `--text-70`, `--text-50` |
| `--accent` (+ `--accent-rgb`) | `#e3fc02` (`227,252,2`) | `--main` red: accent headline word, filled buttons, glows, active nav, icons, stat numbers |
| `--accent-bright` | `#f1ff6b` | `--accent-bright` (promo tags, mobile active item) |
| `--accent-ink` | `#1f1f21` | text on filled accent buttons |
| `--accent-2` (+ `--accent-2-rgb`) | `#00fced` (`0,252,237`) | secondary colour: NEW badge, sale badge, second pack colour |
| `--ambient` (+ `--ambient-rgb`), `--ambient-2` (+ `--ambient-2-rgb`) | `#bc312a` (`188,49,42`), `#e85a51` (`232,90,81`) | ambient lighting only: background radial glows, hero/logo drop-shadows, `hero-glow.svg`, `texture.svg`. Interactive accents (buttons, borders, active nav, focus) stay lime |
| `--cat-fps` / `--cat-ping` / `--cat-delay` | `#e3fc02` / `#00fced` / `#ffffff` | Tweaking/Overclocking/Networking section colours |
| `--cat-ultimate`, `--cat-ultimate-2`, `--gradient-ultimate` | lime → cyan | Apex gold tier |
| `--discord` | `#4296fe` | Discord button |
| `--glass`, `--glass-panel`, `--glass-blur`, `--panel-blur` | `rgba(0,0,0,.30)`, `rgba(10,10,10,.8)`, `3px`, `8px` | glass card / dropdown panel |
| `--radius-xl/lg/md/sm/xs` | `22/15/12/10/8px` | card / pill / button / tag / menu-item radii |
| `--nav-height` | `97px` | header height |
| `--max-content` | `1400px` | |
| `--ease-out-expo` | `cubic-bezier(.16,1,.3,1)` | hero mount easing |
| `--font-display` / `--font-body` / `--font-mono` | Oswald / Figtree / JetBrains Mono (+ fallbacks) | Amenti / Roboto / JetBrains Mono |

Per-component theming uses `--color` (set inline: `style="--color:#00fced"`) exactly like Paragon: `.title-tag`, `.nice-button(-box)`, `.pack-card-wrapper`, `.card-tag`, `.features li .icon`, `.glass-info-card .info-accent`, `.modal-content`, `.dropdown-panel .nav-tab .dot`.

Typography helpers: `.section-label` (eyebrow, lime), `.section-label--muted`, `.section-title`, `.section-subtitle` (lime display) / `.section-subtitle--plain`, `.section-description`, `.highlight`, `.text-accent`, `.text-accent-2`, `.text-gradient`, `.mono`.

## 4. Components

### Header / footer
Injected automatically. Header = `.nav-container > .nav` with `.nav-pill` glass pills (logo, `.tab-container.compact` tab bar, `.hamburger-container`), `.btn-clear.discord` login pill (opens the login-gate modal), `.mobile-menu.glass-card` drawer. Footer = `.footer` grid `1.5fr 1fr 1fr 1.2fr` (brand + socials / Navigate / Legal / `.footer-cta.glass-card`) + `.footer-bottom`.

**Breakpoint:** the desktop tab bar shows at **≥ 1101px** (`DESKTOP_NAV_MIN` in site.js and the `@media (min-width:1101px)` block in CSS). Paragon only shows tabs above 1415px, which makes 1280–1366px laptops see a hamburger; 1100 was chosen so the site reads as a desktop site at common laptop widths. Logo text hides ≤1100, Discord button squishes to icon-only ≤407.

### Buttons
```html
<!-- primary: two-layer box + filled accent button (Paragon nice-button-box) -->
<div class="nice-button-box"><a class="nice-button btn-lg" href="/packs/">Shop Packs</a></div>
<div class="nice-button-box" style="--color:#00fced"><button class="nice-button btn-md">Buy Now</button></div>
<button class="nice-button gradient btn-md">Ultimate</button>          <!-- lime→cyan fill -->
<a class="nice-button grey btn-lg" href="/about/">Learn More</a>        <!-- Paragon .grey -->
<button class="nice-button dark btn-sm" style="--color:#e3fc02">…</button> <!-- Paragon's original dark+glow look -->
<!-- sizes: .btn-sm .btn-md (default) .btn-lg · states: [disabled] / .is-disabled -->

<!-- pill with arrow (Paragon btn-clear) -->
<button class="btn-clear"><span>Learn More</span><span class="btn-clear__arrow"><i data-icon="arrow-right"></i></span></button>
<a class="btn-clear discord" href="…" target="_blank" rel="noopener noreferrer"><span>Join Discord</span><i data-icon="discord"></i></a>
<!-- variants: .primary (lime outline→fill) .cancel .sm .full -->

<a class="social-btn" href="…" aria-label="YouTube"><i data-icon="youtube"></i></a>
<span class="title-tag" style="--color:#00fced">One Time Purchase</span>   <!-- .nav-tag = hover lift, .title-tag--large = modal title, .title-tag--gradient > span -->
<a class="promo-link" href="/utilities/">Explore Utilities <i data-icon="arrow-right"></i></a>  <!-- .cta-link same look -->
```

### Cards & chips
```html
<div class="glass-card glass-card--pad">…</div>                <!-- base: translucent black, blur, top/bottom hairlines, sheens -->
<div class="glass-card glass-card--hover" style="--color:#e3fc02">…</div>  <!-- lift + tinted border on hover -->

<div class="stat-chip"><span class="stat-value">4.92★</span><span class="stat-divider"></span><span class="stat-label">Avg. rating</span></div>

<div class="feature-card"><i data-icon="gauge"></i><div><h3>Higher FPS</h3><p>…</p></div></div>

<div class="metrics-row"><div class="metric"><span class="metric-value">+60%</span><span class="metric-label">Frame Rate</span><span class="metric-desc">Improvement</span></div></div>

<div class="glass-info-card-grid">
  <div class="glass-info-card glass-card"><span class="info-accent"></span><h4><i data-icon="download"></i>Instant Access</h4><p>…</p></div>
</div>

<span class="status-badge status-badge--success">Access ready</span>
<span class="sale-badge">Sale · 50% off</span>
```

### Pack (product) card — render from data
```html
<div class="pack-grid" data-render="pack-grid" data-packs="fps-pack,ultimate-bundle" data-max-features="4"></div>
<div class="pack-grid pack-grid--1" data-render="pack-grid" data-category="ping"></div>   <!-- .pack-grid--3 = Paragon 3-col services grid -->
```
or in JS: `container.innerHTML = MZ.ui.packCard(MZ.helpers.pack('fps-pack'), { maxFeatures: 6, featuredShell: true })`. Anatomy = Paragon ProductCard: `.pack-card-wrapper[--color] > .card-tag + .pack-card.glass-card > .top-card-container > .top-card (glowing 4px bar + box art) + .content-wrapper (title, .price-row, .description, .nice-button-box.book-now-box "Buy Now", .features, .btn-clear "Learn More")`. `featured: true` packs get the `.outer-glow-container` shell (Paragon's Apex gold shell, lime→cyan). Buy/Learn buttons carry `data-modal` + `data-pack` and just work.

### Reviews / testimonials
```html
<div data-render="testimonials"></div>   <!-- marquee of MZ.homeReviews (≥790px) + 3 stacked .review-card--static (<790px) -->
```
`MZ.ui.reviewCard(review, 'review-card--compact')`, `MZ.ui.stars(5)`. Cards are 320px, gap 30px, duration = 350 × n × 0.0162 s (Paragon's formula; 9 cards ≈ 51 s), pause on hover. To use another review set, render cards yourself into `.testimonials > .testimonial-track > .testimonial-set ×2` and set `--marquee-distance` / `--marquee-duration` inline.

### Brand marquee
```html
<div class="brands-marquee"><div class="brands-track" data-marquee="brands"><ul class="brands-set">
  <li class="brand-item"><img src="/assets/img/badge-fortnite.svg" width="120" height="60" alt="Fortnite"></li>…
</ul></div></div>
```
site.js clones the set ×3 → `translateX(-33.333%)` 30 s loop, grayscale until hover, pause on hover. An empty `.brands-set` is filled from `MZ.games`.

### FAQ accordion
```html
<div class="faq-list" data-accordion>
  <div class="faq-item"><h3><button type="button" class="faq-question" aria-expanded="false">Question<span class="faq-icon" aria-hidden="true"><i data-icon="plus"></i></span></button></h3>
    <div class="faq-answer"><div class="faq-answer-inner">Answer</div></div></div>
</div>
<div class="faq-list" data-render="faq" data-source="affiliateFaqs"></div>   <!-- renders from MZ[data-source] -->
```
One open at a time, `max-height` animated to `scrollHeight`, aria-controls/expanded wired automatically. For accordions injected later call `MZ.ui.initAccordions(root)`.

### Banner (Paragon ShortBanner) & section headings
`.banner[data-mount] > .banner-content > h1.banner-title + .banner-pills` (see skeleton). `.section-with-bar h2` = Paragon's 2em/500 section heading. `.section-header` (centered label + title + subtitle) / `.section-header--left`.

### Layout blocks used on home (reusable)
`.promo-section` (image left with fade mask + absolutely positioned `.promo-content`; `.promo-image--art` for portrait box art), `.two-col` / `.two-col--text-left` with `.media-col` (`.video-wrapper` or `.media-frame` with four `.corner` spans) and `.text-col`, `.how-it-works > .steps-container > .step-card.glass-card[style="--delay:.15s"]` (staggered fade-up when the parent `.reveal` becomes `.visible`), `.social-proof`, `.final-cta.glass-card`, `.not-found`.

### Forms
`.form-label`, `.form-input`, `.form-textarea`, `.form-select`, `.form-note`, `.status-message--success|error`.

### Icons
`<i data-icon="name"></i>` is replaced with an inline SVG on load (`MZ.ui.hydrateIcons(root)` for injected markup; `MZ.ui.icon('name')` returns the SVG string). Names: `home tags wrench info users envelope bars times check arrow-right arrow-up-right chevron-down plus gauge stopwatch signal shield shield-half lock undo book headset download infinity external broom cookie copy bolt crown star discord youtube tiktok instagram`.

## 5. Behaviours

**Mount animation** — put `data-mount` on the first block of the page (hero inner, banner). 100 ms after load it gets `.loaded` → fade + 24px slide, 0.9 s expo-out. A `.logo-showcase` gets `.transitioning` at 500 ms (mark slides left, wordmark fades in) and `.final` at 1300 ms. Guarded by `html.js` so no-JS users see everything.

**Scroll reveal** — `.animate` → `.slide-up` (IntersectionObserver threshold .01, 30px/0.6 s; Paragon `useRevealOnScroll`). `.reveal` → `.visible` (threshold .2, 40px/0.8 s; Paragon home sections; tall sections >1.5 viewports use .05). For content injected after load call `MZ.ui.refreshReveal(root)`.

**Page transitions** — every same-origin, same-tab link click fades `body` out (`.is-leaving`, 220 ms) then navigates; the destination's `[data-mount]` block animates in. Opt out per link with `data-no-transition`. Hash links on the same page scroll natively; a link to the current page scrolls to top.

**Modals** — `data-modal="pack-buy|pack-learn" data-pack="<handle>"`, `data-modal="login"`, `data-modal="cookie-prefs"`, `data-modal="close"`. Programmatic:
```js
MZ.ui.openModal({ title, color: '#00fced', gradient: false, colored: true, maxWidth: '720px',
                  bodyHTML, footerHTML, onOpen(root){}, onClose(){} });
MZ.ui.closeModal(); MZ.ui.openPackModal('pack-learn', 'delay-pack');
```
Backdrop blur + brightness, `.modal-pop` scale-in, body scroll lock, Escape / overlay / × close, focus trap + focus restore, `mz:modal-open` / `mz:modal-close` events. The pack Buy modal's primary button opens the real miztweakz.com product URL in a new tab; "Learn More" swaps to the detail modal.

**Cookie consent** — card bottom-right on first visit (Customise / Reject All / Accept All), stored in `localStorage["mz-consent"]` as `{necessary, functional, advertisement, ts}`; afterwards a shield button bottom-left and the footer "Cookie Preferences" reopen the preferences modal. Read `MZ.ui.consent.get()`; listen for `document.addEventListener('mz:consent', e => e.detail.functional)` to gate YouTube embeds (About page) exactly like Paragon's `.yt-gate`.

**Reduced motion** — `prefers-reduced-motion: reduce` disables marquees, reveals, mount animation, sale pulse and smooth scroll.

## 6. Data (`data.js`)
`MZ.brand`, `MZ.nav`, `MZ.categories`, `MZ.packs` (handle, category, name, price, compareAt, url, image, icon, color[, color2, gradient, featured, tag], tagline, description, features[], reviewCount, rating), `MZ.delivery`, `MZ.reviews` (verbatim Judge.me, 21 of the 51), `MZ.homeReviews`, `MZ.faqs`, `MZ.affiliateFaqs`, `MZ.stats`, `MZ.features`, `MZ.metrics`, `MZ.games`, `MZ.creators`, `MZ.helpers` (`money`, `savings`, `pack`, `category`, `reviewsFor`, `formatDate`). Fields marked `(new)` in the file are copy written for this redesign; everything else is verbatim from miztweakz.com. Always render strings through `MZ.ui.esc()`.

## 7. Assets (`/assets/img`, all hand-generated SVG, no external images)
`logo-mark.svg` (round MZ mark, off-white/ink two-tone), `logo-wordmark.svg` (stacked slanted "MIZ / TWEAKZ", 495×359), `favicon.svg`, `hero-glow.svg`, `texture.svg` (fixed page background), `pack-fps|ping|delay|debloat|ultimate.svg` (600×900 box art), `before-after-fps.svg` (1200×675), `avatar-1…5.svg` (CF, MU, TB, HA, JM), `badge-fortnite|valorant|apex|cs2|warzone|rocket-league.svg` (260×120 text badges). Text inside them is converted to paths (Oswald Bold) so it renders inside `<img>`. Always give `<img>` width/height attributes. Regenerate with `node tools/svg-gen/gen.js` after `npm i opentype.js@1.3.4` and dropping `Oswald-Bold.ttf` (Google Fonts, OFL) next to it.

## 8. Deviations from the audit (and why)
- Desktop tab bar at ≥1101px instead of >1415px (laptops should see a desktop nav).
- Primary buttons are **filled lime with dark text** (the MIZTWEAKZ accent role) inside Paragon's two-layer box; Paragon's original dark-with-glow look is kept as `.nice-button.dark`.
- Home order follows the brief (hero → promo → game marquee → pack grid → before/after → why-us → testimonials → FAQ → CTA → footer). Paragon's PTU-promo slot is kept as the Utilities/Debloat promo; the "Latest YouTube" block and the "How it works" steps have no MIZTWEAKZ equivalent and were replaced by the pack grid and the six-card "Why MIZTWEAKZ" grid (same how-it-works layout/stagger).
- The stacked wordmark forced its own hero lockup offsets (`translate(calc(-50% - 115px))`) instead of Paragon's `-180% - 55px`.
- Announcement ("50% OFF") is a pill inside the hero — Paragon has no announcement bar.
- Mobile menu is Paragon's glass panel under the header (audit-confirmed), not a full-height drawer.
- Consent is stored in localStorage (no cookie), and there is no real Discord auth — the login pill opens a Paragon-style login gate pointing at the Discord invite.

## 9. Known gaps
Phase B pages (`/packs/ /utilities/ /about/ /affiliates/ /contact/ /tos/ /privacy/`) are not built; footer/nav links to them 404 until then. No OG image (needs a raster). Reviews beyond the 21 in `data.js` (14 belong to the unlisted XBOX Pack) were not transcribed. The `tools/svg-gen` script needs the font downloaded separately.

## Cache busting & the wordmark derivative (added 2026-09-05)

- `site/_headers` serves `/assets/*` with `Cache-Control: public, max-age=0, must-revalidate` so browsers revalidate (ETag/304) after every deploy instead of holding a day-old copy. The CSS/JS `<link>`/`<script>` tags and the two `url()` references inside site.css (texture.svg, hero-glow.svg) additionally carry `?v=20260905c`; bump that string in all nine HTML files and in site.css when shipping a visual change you want to force through.
- `tools/img/build-wordmark.mjs` trims the transparent padding off the official horizontal wordmark (`New_Project_6.png`) into `site/assets/img/brand/wordmark.{webp,png}` (555x435, RGBA). It is generated but not wired in: the square `logo.*` used in the hero and header already carries the same wordmark with its official glow, so a second copy would be redundant. It is available for a future header or footer lockup.
- Copy rules applied after Codex's audit: the home results block is framed as a store-published comparison graphic (117 FPS/31 ping → 239 FPS/6 ping) with a "results vary" caveat; the About story image is the store's ping 72 → 46 comparison; the 50–100 FPS figure is attributed to the MIZTWEAKZ FAQ; the ping metric is non-numeric ("Lower ping, reported in customer reviews") because the only −30 ms figure came from a single review.

## Owner revisions (2026-09-05, evening)

- Accent tokens switched from lime/cyan to red: `--accent #e8423a`, `--accent-bright #ff6a62`, `--accent-2 #ff8c85`, `--accent-ink #ffffff` (filled buttons now use white text). Category colours follow. Hardcoded lime/cyan hexes in page HTML, page CSS, data.js and the generated SVG badges/avatars were replaced with the same values. Ambient tokens unchanged.
- Logo replaced with the owner's "M" mark: `brand/logo-m.svg` (transparent) and `brand/logo-m-tile.svg` (white rounded tile, used everywhere on the dark site). `tools/img/build-logo-m.mjs` regenerates logo.png/webp, logo-96/192, favicon-32/180/512 and og.jpg from the tile; `assets/img/favicon.svg` is a copy of the tile. The MIZ TWEAKZ wordmark derivatives remain in brand/ but are unused.
- Home hero: the CTA group now sits directly under the tagline (above the description and stat chips); primary button reads "Download Now" (also in the final CTA) and still links to /packs/. The hero logo slot is `min(220px, 56vw)` with no negative margin (the tile has no halo).
- Home page no longer shows products: the Debloat promo section and the pack overview grid were removed. Packs remain reachable from the nav dropdown, /packs/ and /utilities/.
- Asset version query bumped to `?v=20260905d`.

## Owner revisions, round 2 (2026-09-05, late)

- Accent tokens now use Paragon's exact values: `--accent #bc312a` (Paragon --main) and `--accent-bright #e85a51` (Paragon --accent-bright); `--accent-2` also `#e85a51`; category colours follow. `.stat-value` uses `--accent-bright` so the small stat numbers stay legible on the dark background. `--accent-ink` stays white.
- Logo reverted to the real MIZ TWEAKZ square mark: `tools/img/build-logo-miz.mjs` regenerates logo.png/webp, logo-96/192, favicon-32/180/512 and og.jpg (wordmark on #1f1f21) from the handoff originals. The SVG favicon link was removed from every page (PNG favicons only); the owner's "M" mark stays in brand/ as `logo-m.svg` / `logo-m-tile.svg` with `build-logo-m.mjs` in case it is wanted again.
- Home results section now plays the owner-supplied comparison clip: `site/assets/video/finished-product.mp4` (1280x720, H.264, muted, 4.6 s, 2.3 MB, transcoded from the 4K 28 MB original with ffmpeg-static at CRF 30) with `finished-product-poster.webp` as poster; autoplay/loop/muted/playsinline, and an inline script switches to paused-with-controls under prefers-reduced-motion. Caption describes the clip (113 FPS / 5 ms → 367 FPS / 0 ms, results vary). The Fortnite still remains in brand/ but is no longer referenced on the home page.
- Asset version query bumped to `?v=20260905f`.

## Paragon CSS parity pass (2026-09-05, night)

Owner instruction: "inspect the style of the paragon website and pull that code to ensure it's the same design exactly." Paragon's live Vite bundle is checked in at `docs/paragon-reference/index.css` (pretty-printed copy `index.pretty.css`; `:root`, `@font-face`, `@keyframes` and every `@media` block extracted to `tokens-and-media.md`). Every measurable property of every shared component was diffed against it and set to Paragon's value; colour tokens (already Paragon's `#bc312a` / `#e85a51`), copy, images, page structure and class names were kept. Verified with `getComputedStyle` on paragontweaks.net vs localhost at 1440×900 and the 375×812 mobile preset: all measured geometry, sizes, weights, line-heights, letter-spacing, radii, paddings, gaps and alphas match; the residual diffs are font glyph widths (Amenti vs Oswald, Roboto vs Figtree) and content length.

What changed (Paragon value applied):
- **Breakpoints.** Desktop tab bar now shows only at `>=1416px` (Paragon NavBar `isMobile = innerWidth <= 1415`, a JS check mirrored as a media query); `DESKTOP_NAV_MIN = 1416`; logo text hides `<=1415`; the `<=1100` touch-target rules in site.css / page-packs.css / page-utilities.css follow the same threshold. Removed our extra 901-1200px two-column steps grid (Paragon keeps 3 columns down to 900). Discord pill `<=407` swaps to Paragon's short "Login" label instead of icon-only (padding stays `10px 20px`).
- **Base.** `body` letter-spacing removed (Paragon has none), `-moz-osx-font-smoothing: grayscale` added; headings default to weight 400 and inherit the 1.6 body line-height (Paragon's computed values); `:focus-visible` uses `--accent-bright`; the custom `::selection` was dropped (Paragon has none); `.skip-link` = Paragon's (top/left 0, `12px 20px`, radius `0 0 8px`, weight 700, white focus ring).
- **Header.** `.nav` padding-only (no gap/min-height, 92px tall like Paragon); left/right groups gap 10px; logo 30px (no drop-shadow), logo text 18px/400; `.nav-tab` = Paragon verbatim (`font: inherit`, no border by default, `transition: all .3s`, active tab adds 1px borders + `::before` 60%x60% blur(8px) glow at `bottom:-4px` + `::after` inset -2px halo, radius 14px, opacity .8) plus a real `.active-tab-underline` span (Paragon positions it with JS); `.new-badge` inherits the display face and uses the red gradient; dropdown panel gap 10px, no box-shadow/min-width, Paragon's top/bottom sheens; Discord pill icon 30x24 (46px pill); hamburger `height:50px; padding:0 15px`, 16px icon; mobile items `12px 16px`, radius 8px, 1rem, .7 white, active `.15` red.
- **Buttons.** `.nice-button` is now Paragon's exact button (dark `#2c2c2c` face with a radial `--color` tint, `#e5e5e5` text, weight 400, `letter-spacing .01em`, `0 2px 4px` shadow, `transition: all .2s`, hover `#363636` + `translateY(-1px)`, active `#1e1e1e`, `:focus` blue ring, no default padding: the size classes carry it, `.btn-sm` = `10px 18px`). The previous filled-accent primary is gone; `.nice-button.dark` is now an alias of the base. `.nice-button-box` gained `align-items: stretch; width: fit-content`. `.btn-clear` = Paragon (`display:flex`, display face 400, `line-height:1`, `> span { margin-top:-2px }`, no default gap; `.discord` keeps 15px; `.primary` red text; `.cancel` grey hover); arrow badge gets `padding:3px`.
- **Tags / links.** `.title-tag` `2px 5px`, radius 10px, `color-mix(in hsl ...)`, inherits size (1em) and weight 400; `--large` `6px 10px 4px`, line-height 110%. `.promo-link` = body face .95rem/500 accent-bright; `.cta-link` gap `.5rem`, hover gap `.75rem`.
- **Cards & chips.** `.glass-info-card` padding 18px, gap 8px, `minmax(0,1fr)` grid, title lh 1.35, text lh 1.55; `.feature-card` `align-items:center`, no hover, inner text column gap .25rem; `.stat-chip` `transition: all .3s`, value weight 800; `.metrics-row` margin-top/padding-top 2rem, `.metric` gap .5rem, value weight 900; `.price` / `.feature-header` weight 400; `.features` margin-bottom 10px, rows gap 5px centred; `.status-badge` inline-block + capitalize; review cards `padding-bottom:45px`, `0 4px 6px` shadow, min-height 200px, body lh 1.4, meta `.875rem` at `bottom:15px`; static review stack gap 15px / padding 0 20px.
- **Hero.** `align-items:flex-start`; new `.headline-block` (gap .75rem) around h1 + tagline; h1 weight 900, `letter-spacing:-.02em`; description max-width 600px; stats gap 1rem (.75rem <=768); CTA group `margin-top:.5rem`; chip gap .4rem <=480; logo mount transition `.8s ease`.
- **Sections.** `.two-col` / `.how-it-works` / `.social-proof` / `.faq-section` / `.brands-section` take Paragon's section padding (`clamp(2rem,5vw,4rem) clamp(1.5rem,4vw,4rem)` etc.) and header/CTA margins instead of flex gaps; `.section-title` / `.proof-title` / `.faq-title` / `.metric-value` weight 900; `.section-subtitle` margin-bottom .5rem, plain subtitle 1.1rem; `.section-description` 1rem; text column gap 1rem; feature list margin-top 1.5rem; `.video-wrapper` `.3` fill, `.08` border, `0 25px 60px .4` shadow; brands label spacing 2.75rem, container padding `10px 0`, items `transition: all .4s`; FAQ item `overflow:hidden`, open `.08` red, question 1rem/600/1.4, icon `rotate(45deg) translateY(-1px)`, CTA box (margin-top 3rem, padding 2rem, radius 16px).
- **Footer.** Paragon's Footer.vue verbatim: 50px logo (`.brand-link`), brand column gap 1rem, tagline 280px, socials gap .75rem + margin-top .5rem, `.footer-nav-col` gap 1.25rem, links gap .75rem, `.nav-title` margin 0 / `.4` white, CTA card gap 1rem with the title/text/button as direct children, `.cta-text` .9rem, `.bottom-content` padding `1.5rem clamp(1.5rem,4vw,4rem)`, copyright `.35` white, accent bar radius 2px; 1024 gap 2.5rem; 640 gap 1rem.
- **Modals / consent.** Backdrop has no padding; panel `rgba(10,10,10,.4)` + `blur(1px)`, `width:auto`, `margin:0 5px`, fades in with the pop; `--colored` tint is Paragon's masked inset `::after`; top bar `align-items:center; gap:12px`; close button is the bare 2em "x"; body `flex:1 1 auto; min-height:0; overflow-x:hidden`, Paragon scrollbar (track margin 10px, thumb radius 4px, hover .3); footer `margin-top:20px`, stacks <=600; preferences groups use Paragon's head (`12px 16px`) + panel (`0 16px 16px`) layout, "Always Active" `.05em`/400, white focus rings; cookie card uses Paragon's margins (title `0 0 8px`, body `0 0 16px`, actions gap 10px); shield button 16px icon.
- **Forms.** Focus = `.3` white border, no ring; textarea min-height 80px; radius 10px; `font-family: inherit`.
- **Fonts.** Oswald 400 is now loaded (Paragon's default weight is 400); family tokens untouched. Paragon's 800/900 headline weights resolve to Oswald 700 (its heaviest face).
- Asset version bumped to `?v=20260905g` (nine HTML files + the two `url()`s in site.css).

Paragon rules intentionally **not** applied:
- Fonts: Amenti / Roboto `@font-face`s and family tokens (licensed; being handled separately). Paragon's `.btn-clear` also renders in Arial because `<button>` doesn't inherit the font there; not copied.
- `.video-wrapper` keeps `max-width:620px` (Paragon's `.feature-video` is a 400px portrait clip; ours is 16:9).
- `.logo-showcase` sizing/mount offsets (Paragon animates a 3.5:1 icon+wordmark lockup; ours is a square mark).
- `.section-with-bar` >=1620 bracket `::before` / `__tag` (page-packs.css and page-utilities.css already implement their own versions on `.pack-section`); only the `h1/h2 { margin-top:-6px }` part was added.
- `.form-label` keeps a 6px bottom margin (Paragon's contact-form layout lives in a lazy chunk that isn't in the bundle).
- `.modal-body` keeps `display:flex; gap:1.25rem` to space our modal blocks (Paragon's inner components carry their own margins).
- `.glass-card--hover`, `.nice-button.gradient`, `.hero-announce`, `.final-cta`, `.disclosure`, `.step-icon` are MIZTWEAKZ-only additions with no Paragon counterpart and were left as they were.
- Paragon-only components we don't have (`.latest-yt`, `.image-text-card` media, cart/user cards, `.tag-clickable` tooltips, `.auth-placeholder-block`, `.corner-dots`, `.separator-dots`) were skipped.

## Fonts (owner decision 2026-09-05, after the Paragon alignment)

- Paragon's display face is **Amenti** (licensed, self-hosted on their site) and its body stack starts with Roboto but never loads it, so Paragon's body text renders in the system UI font.
- We do not copy Amenti. The owner chose the closest free match: `--font-display: "Outfit"` (Google Fonts, 400/700/900), loaded via the single `<link>` in every page head. `--font-body` is Paragon's exact stack (`"Roboto", Inter, -apple-system, …`) with Roboto **not** loaded, so it resolves the same way Paragon's does. Oswald and Figtree are no longer loaded anywhere.
- To swap in licensed Amenti later: add the `@font-face` rules for 400/700/900 to the top of site.css pointing at self-hosted files under `site/assets/fonts/`, then change `--font-display` to `"Amenti", "Outfit", sans-serif` and drop the Google Fonts link.

## Mobile pass (2026-09-05, late night)

Owner instruction: "ensure the mobile view is very good." Every page was measured at 375×812, 390×844 and 360×780 (no horizontal scroll, header on one row, tap targets, text sizes, media aspect, grids, modals, forms, legal TOC, cookie card, console/network). Fixes are **phone-only `@media` additions** at Paragon's own breakpoints (768 / 640 / 480); no desktop value changed. Section 17 of `site.css` plus small blocks in the page CSS files.

- **Hero (≤480):** the headline broke into four lines with orphaned "FPS." / "Delay." — the hero's side padding is dropped (the page already pads 20px) and `.hero-headline` becomes `clamp(1.75rem, 9.6vw, 2.25rem)` with `text-wrap: balance`, so each sentence sits on one line from 320–480px. `.hero-announce` shrinks to .875rem / .04em so the 50%-off pill is one line at 375+ (two at 360) and is a 44px target.
- **Text:** `body` is 16px on phones (Paragon's 15px stays on desktop); `.description`, `.features li`, `.review-body` follow. Nothing renders below 12px: `.new-badge` (was 9.6px), `.sale-badge`, `.review-verified`, `.card-tag`, `.subscriber-count span`, `.banner-eyebrow .new-badge`, `.video-card .spec-label`, legal TOC numbers.
- **Tap targets (≥44px):** `.btn-clear` (Paragon's pill is 40px at 1em), `.cta-link`, `.promo-link`, banner / "Includes" pills, the modal's bare "×" (44×44 hit box via negative margins, same visual spot), consent-preferences `.btn-sm` buttons and the 42×24 toggle (its invisible input is stretched to 58×44), footer `.nav-link` (44px tall, 44px min width), `.expand-btn`, `.yt-gate-manage`, the contact `.info-link` mailto links, the utilities `.support-meta` mailto link, and the legal "#" permalink.
- **Header drawer:** opening the panel now adds `body.menu-open` (page scroll locked) and swaps the hamburger glyph to an X; Escape / outside tap / link tap still close it and the current page stays highlighted. The panel remains Paragon's glass panel under the header (audit-confirmed, §8), not a full-screen sheet.
- **Cookie card (≤640):** Customise + Reject All sit side by side with Accept All full-width below, buttons 1rem / 12px 16px — the card drops from ~380px to ~290px of an 812px viewport and still clears the header.
- **Legal TOC (≤640):** one horizontally scrolling pill strip (edge-to-edge, snap, hidden scrollbar, fade mask) instead of 7–13 wrapped pills (554px tall on /privacy/); the scroll-spy centres the active pill by scrolling the strip only, never the page.
- **Results clip:** the inline script now (re)starts the muted clip with an IntersectionObserver when it scrolls into view and pauses it off-screen, for browsers that defer an off-screen autoplay.
- Asset version bumped to `?v=20260905i` (nine HTML files + the two `url()`s in site.css). `tools/check-links.js` passes.

Left as-is: `.social-btn` 40×40 with 12px spacing (Paragon-exact, passes the 40px + 8px rule); `.pt-prefs-revisit` shield 42px (isolated, Paragon-exact); form focus stays Paragon's `.3` white border (no ring); `.faq-answer-inner` .9rem at ≤640 is Paragon's own mobile value; inline prose links keep their natural line height.

## Owner revisions, round 3 (2026-09-05, late evening)

- **Store removed from the site:** `/packs/` and `/utilities/` pages, their page CSS and nav/footer entries are gone; `_redirects` sends `/packs*` and `/utilities*` to `/` (301). Pack data, pack-modal code and the `?pack=` handler remain in data.js/site.js as dead code so nothing else breaks; safe to delete later.
- **Free download:** every "Download Now" button (hero, why-section, final CTA, footer CTA, About) links to `MZ.download.href` = `/downloads/miztweakz-free-tweaks.zip` with the `download` attribute. The zip is a placeholder containing a README; replace the file to ship the real download.
- **Home hero:** blank space removed (`.hero` padding-top 56px, min-height auto instead of Paragon's 210px / full viewport); the limited-time pill is gone; the rating chip reads "4.92 star Avg. rating" (no review count).
- **Game marquee:** real marks from Wikimedia Commons in `assets/img/games/` (see README for sources and licences), shown in colour in 160x64 boxes, 12 s loop (was 30 s), no hover pause.
- **Results section:** the clip column is wider (`.two-col--media-wide`, 1.7fr / 980px max) and the text column keeps only the three feature bars under a plain "Before & After." heading.
- **Why section:** eyebrow label removed; heading "Built By Mizery. Trusted By Pros."
- **New "Trusted By The BEST" section** with the real creator photos (Premfn, Npen, aero1x) and a "Join 4,000+ Active Users" button to the Discord invite, placed before the reviews.
- **Reviews:** header is "Customer Reviews" + yellow stars + teal "Verified Reviews" check; the marquee no longer pauses on hover.
- Asset version query bumped to `?v=20260905j`.

## Owner revisions, round 4 (2026-09-08)

- **Ambient glow is grayish-white now** (`--ambient #e6e6ec`, `--ambient-2 #ffffff`; hero-glow.svg and texture.svg recolored and their opacities roughly halved because a white halo reads stronger than a red one). The accent stays red.
- **No em or en dashes in copy.** `tools/dashes.mjs` rewrote every one: numeric ranges become "50 to 100", paired dashes become commas, a single mid-sentence dash becomes a sentence break with the next word capitalised. Keep new copy dash-free (hyphenated words like "step-by-step" are fine).
- Home "why" heading is "Instantly Improve Your Performance."; the "Join 4,000+ Active Users" button downloads the free pack instead of opening Discord.
- Socials: Twitch and Kick added to `MZ.brand.socials` (handles assumed to be `miz_tweakz`, matching TikTok/Instagram; confirm with the owner), to the footer, the contact page and the About team socials, with new `twitch`/`kick` icons in site.js.
- New `/products/` page (see the "Products page" section below, written by its builder). Nav is Home / Products / About / Affiliates / Contact.
- Asset version query is `?v=20260908a`.

## Products page (2026-09-08)

`/products/` (`site/products/index.html` + `site/assets/css/page-products.css`, `body[data-page="products"]`) mirrors Paragon's `/utilities` "Utility Plans" block with the owner's app plans. Nav entry `{ label: 'Products', href: '/products/', icon: 'tags' }` is the second item in `MZ.nav`, so the header tab bar, mobile drawer and footer "Navigate" column all pick it up.

- **Structure:** `.banner[data-mount]` ("Products" + Free / Basic / Ultimate pills that jump to the cards) → `#plans.section-with-bar.plans-section.animate` (eyebrow `.title-tag` "The App"; `.plans-head` row = `h2` "Plans" + `.billing-selector.nav-pill.compact` on the left, `.subscriber-count.glass-card` on the right; `.plans-subtitle`; `.plans-grid`) → three-item FAQ (`data-accordion`, copy verbatim from `MZ.faqs`: refunds, Windows 10 & 11, safe/reversible) → `.final-cta` "Download for Free".
- **Plan cards** (Paragon ProductCard + `.utility-card`): `.plan-card-wrapper[--color]` (380px, `padding-top: 22px`, `::after` = the coloured top/left/right hairline that fades downward) → `.plan-tag` (Paragon `.card-tag`: 55px tall, only the top 22px peeks above the card, the rest hides behind the header band; `.plan-tag--green` = the "Your Plan" pill) → `.plan-card.glass-card` → `.top-card-container > .top-card.plan-top` (95px CSS halftone band: 7px dot grid in `--color` fading to the right, 4px glowing bar, `h3.top-card-text` at left 7%) → `.content-wrapper` (`.price-row` with `.original-price` / `.price` / `.price-currency` "/month" / teal `.sale-badge`, `.billing-note`, `.description`, `.nice-button-box.book-now-box`, `.plan-features` = `.feature-header` + `ul.features`; `li.is-excluded` rows are dimmed with the `times` icon and an sr-only "Not included:" prefix). Order on desktop is Free / Ultimate / Basic (Paragon Core / Apex / Edge).
- **Featured shell:** Ultimate sits in `.plan-shell.outer-glow-container` (390px, `padding: 40px 5px 5px`, gold `#fbbf24` gradient + glow, gold 4px bar, `::after` halftone texture at 40% in the top 15%, "Most Complete" tab at `top: 12px`). `--color` is gold, so its checks, band and button tint follow. `.plans-grid` is `flex; align-items: flex-end; gap: 20px`, so bottoms align and the taller featured card rises above the others.
- **Buttons:** Free = `<a class="nice-button" download data-download>` (href/label re-synced from `MZ.download` on load). Basic / Ultimate = "Get Basic" / "Get Ultimate" with the `arrow-right` icon and `data-modal="login"` (Discord login gate; there is no checkout in this build).
- **Billing toggle** (inline script): pills carry `data-billing="monthly|six|annual"` + `aria-pressed`; Arrow / Home / End keys move between them. Prices are computed from `data-monthly` cents on each card: `billed = round(monthly × months × (1 − discount))`, `perMonth = round(billed / months)`; 6 Months = 17% off, Annual = 25% off. Monthly shows the plain price; the other two show the monthly price struck through, the discounted per-month price, a teal SALE pill and "Billed $X every 6 months" / "Billed $X per year" (Basic $6.63 → $39.79 / $5.99 → $71.91; Ultimate $12.44 → $74.65 / $11.24 → $134.91). Free stays $0. An `sr-only` `aria-live` line announces the period.
- **Counter:** `.led-count` (mono, `--accent-bright`, LED text-shadow) counts 0 → `MZ.brand.activeUsers` ("4,000+") over 1.4 s when it scrolls into view; `prefers-reduced-motion` shows the final value immediately. Static "4,000+" is in the markup for no-JS.
- **Responsive:** ≤1250 the row wraps in Paragon's order (Ultimate, Basic, Free; Paragon's rule is ≤1200, but three cards + page padding + scrollbar only fit above ~1245px, so the reorder is applied where the wrap actually happens); ≤800 single column, featured first, cards `min(413px, 92dvw)`; ≤700 the head stacks and the counter becomes a full-width row; ≤500 the selector becomes a 3-column grid (6px 10px, .85rem, badges kept at ≥12px) so nothing overflows at 375px; ≤768 pills are 44px tap targets.
- **Fixed in passing:** `site.js` line 76 (`instagram` icon path) was missing its trailing comma, which broke `site.js` parsing (no header/footer/modals on any page). Added the comma; nothing else in site.js/site.css changed.
- Verified at 1440×900 and the 375×812 preset: Products tab active, toggle math per the table above, download attribute present, login modal opens and Escape closes it with focus restored, counter renders, no console errors after the fix, no failed requests, no horizontal scroll. `node tools/check-links.js` exits 0. Asset version query stays `?v=20260908a`.

## Utilities page (2026-09-08)

`/products/` is gone; the plans now live on `/utilities/` (`site/utilities/index.html` + `site/assets/css/page-utilities.css`, `body[data-page="utilities"]`), rebuilt as Paragon's `/utilities` page around the real MizTweakz desktop app. Facts come only from `docs/app-study.md`; the installer facts were verified against the GitHub release (1.0.1, 80,004,704 bytes = 76.3 MB, SHA-256 `8a09d131144437fa540cc093918213627bccb69d841b93bfde75c81a027361c0`, September 8, 2026). Deleted: `site/products/`, `page-products.css`, `site/downloads/` (the placeholder zip). Nav entry is `{ label: 'Utilities', href: '/utilities/', icon: 'wrench', badge: 'NEW' }` (Paragon's `fa-wrench` + NEW badge). `_redirects` sends `/products` and `/products/*` to `/utilities/` (301) and no longer redirects `/utilities`; the `/packs` rules stay. `MZ.download.href` is now the GitHub installer URL (`https://github.com/austins041/MizTweakz/releases/latest/download/MizTweakz-Setup.exe`); every hard-coded zip link on the home and About pages was pointed there and lost its `download` attribute (cross-origin, browsers ignore it), as did the footer CTA in site.js.

- **Order (Paragon):** banner, "The App" showcase, Utility Plans, Utility Download, FAQ. The three bar sections share `.bar-section` / `.bar-eyebrow` (the old `.plans-section` rules, generalised) with Paragon's tag colours: red "The App", `#b418e7` "The Utility", `#3b82f6` "Downloads".
- **Banner:** `.banner[data-mount]` with the 96px app icon (`brand/app-icon-160.webp`), h1 "MizTweakz Utility", the study's one-paragraph description, pills Windows 10 & 11 / Free tier (green) / Auto-updates (blue), and a Download for Free + See Plans (`#utility-plans`) button row (Paragon's "Experience PTU" slot).
- **Coverflow** (`[data-coverflow]`, vanilla JS in the page script): the 13 screenshots in `assets/img/app/` (1280x800 with `-640` variants via `srcset`; `sizes="(max-width: 850px) 100vw, 760px"`) share one grid cell; JS assigns `.is-active / .is-prev / .is-next / .is-prev2 / .is-next2` by wrap-around distance, so the centre slide is flat at 760px, the neighbours sit at translateX(62%) rotateY(30deg) scale(.78) dimmed, the next pair at 100% / scale(.6), and the rest are opacity 0. 50px round prev/next buttons, Paragon's 40x4px dash indicators (a `::before` stretches each hit box to 44px), a mono "02 / 13" counter and an `aria-live` caption filled from the active slide's `figcaption` (per-screen copy from the study). ArrowLeft/Right/Home/End work anywhere inside the carousel, a side slide can be clicked, and a 40px swipe on the stage moves one slide. Non-active slides are `aria-hidden`. No autoplay. Reduced motion drops the transitions. Without JS the track becomes a horizontal scroll-snap strip with every caption visible. Paragon's breakpoints: side slides hidden <=1000, arrows/mask gone and slide 100% wide <=850, 24px dashes <=768, counter hidden <=600, 18px dashes <=500 so 13 fit in 335px.
- **Feature grid:** nine `.glass-info-card`s in a 3-column `.app-feature-grid` (2 <=1000, 1 <=640); FPS Boost and Potato Graphics carry a gold `.tier-pill` "Ultimate". Copy sticks to the study's numbers and caveats ("frees memory, it does not create it"; Potato Graphics = texture filtering + transparency supersampling only).
- **Plans:** the products section moved over unchanged in look (billing toggle, LED counter, cards, featured shell, responsive rules) with the gating fixed per the study: FPS Boost left Basic's included list, is now in Basic's not-included list, and Ultimate lists "FPS Boost and Potato Graphics". The Free card's button is "Download for Free" to the GitHub URL (`data-download` keeps it synced with `MZ.download`; the label goes into an inner `<span>` so icons survive).
- **Download card** (`#utility-downloads`, Paragon DownloadCard): 108px icon with the ambient drop-shadow, "MizTweakz for Windows" + blue `v1.0.1` chip, blurb, Download for Free + "All releases" (`btn-clear`, GitHub releases), meta line "MizTweakz-Setup.exe • 76.3 MB • Version 1.0.1, September 8, 2026, latest build" (there is no written changelog, so no Changelog modal), a self-update note (checks GitHub shortly after launch and every 6 hours, installs on restart), then a two-column details row: the SHA-256 in a mono `user-select: all` `<code>` with a Copy button (clipboard API, falls back to selecting the hash; result announced in an sr-only live region) plus a "Verify your download" `Get-FileHash` line, and the requirements list (Windows 10/11 64-bit, admin rights, an account, free tier offline). Stacks <=700 like Paragon's `.download-main`.
- **FAQ:** the three plan questions plus "Does it need admin rights?" and "Will it update itself?" answered from the study.
- **Verified** on the local server at 1440x900 and the 375x812 preset: Utilities tab active with the NEW badge (desktop bar and mobile drawer), coverflow steps with buttons, dots, ArrowRight/End and wraps at both ends, `aria-hidden` on 12 of 13, toggle math unchanged (Basic $6.63 / $39.79 and $5.99 / $71.91; Ultimate $12.44 / $74.65 and $11.24 / $134.91), all download buttons (page, home hero, why, creators, final CTA, footer) point at the GitHub URL with no `download` attribute, FAQ opens one at a time, counter reaches 4,000+, no horizontal scroll (375 vs 375; stage and slide both 335px), no failed requests. The three `Unexpected identifier 'twitch'` console entries were stale from an earlier tab session (site.js passes `node --check` and renders the header). `node tools/check-links.js` exits 0. Asset version query is `?v=20260908c` (eight HTML files + the two `url()`s in site.css).
- **Not replicated from Paragon:** the LargeBanner's background art and right-hand overlay image (we keep the ShortBanner `.banner` with the icon and pills), the Performance Benchmarks section (no benchmark data; the study forbids FPS claims), the Changelog modal (no changelog exists), the live `GET /api/subscribers/count` (static 4,000+ from `MZ.brand.activeUsers`), and the cart / Replace Package flow (Get Basic / Get Ultimate still open the login gate). Paragon's UtilitiesView CSS lives in a lazy chunk that is not in `docs/paragon-reference/index.css`, so the coverflow, download card and plan-card geometry follow the audit's measurements rather than copied rules.

## Glow is global (2026-09-08)

The grayish-white ambient tokens now drive EVERY light effect on the site, not just the hero: nav-tab active halo, hamburger hover, featured plan shell and its bar, glass-card info bars, the sale-badge pulse, the accent headline text-shadow, the footer hairline glow, affiliate badge glow, coverflow dots, the LED counter text-shadow and the Ultimate card halo (was gold). Solid fills, text colours and borders keep the red accent; the gold halftone dot texture on the Ultimate card is a fill pattern, not a glow, and stays gold. `tools/glow-global.mjs` holds the exact swaps. Rule for new CSS: any `box-shadow`, `text-shadow`, `drop-shadow()` or radial wash uses `rgba(var(--ambient-rgb), a)`. Asset version `?v=20260908d`.

## Tints too (2026-09-09)

Second pass of the gray-white rule: every translucent red tint (alpha up to .45) and every button/card `color-mix` sheen now uses `rgba(var(--ambient-rgb), a)`; see `tools/tints-global.mjs`. Only solid red text, opaque red lines (alpha .5 and up) and the gold halftone texture remain red/gold. Asset version `?v=20260908e`.
IMPORTANT process note: three earlier rounds (dashes/products, utilities, global glow) were reported as live but were never deployed; the deploy on 2026-09-09 04:33Z published them. Always run `npx wrangler pages deploy site` and curl the live CSS version before claiming a change is live.
