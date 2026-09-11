# MIZTWEAKZ Shopify theme, foundation notes

This theme is a port of the static site in `../site/`. The static build stays the
source of truth for the design; nothing in `../site/` was modified.

Everything below is a contract. Other agents are adding commerce and content
templates on top of this foundation, so match these names exactly.

---

## 1. File layout

```
shopify-theme/
  layout/theme.liquid          the shell (head, skip link, header section, <main>, footer section)
  sections/header.liquid       server-rendered replacement for renderHeader()
  sections/footer.liquid       server-rendered replacement for renderFooter()
  snippets/icon.liquid         <i data-icon="name"></i> placeholder
  snippets/nav-icon.liquid     maps one link list entry to an icon name
  templates/index.liquid       home page, ported from site/index.html
  config/settings_schema.json  theme_info + Brand + Links settings
  config/settings_data.json    { "current": { ... } } defaults
  locales/en.default.json      general / products / cart / layout strings
  assets/                      FLAT, no sub-folders (Shopify does not allow them)
```

`layout/theme.liquid` owns the page shell. Templates emit **sections only**: the
skip link, `{% section 'header' %}`, `<main id="main-content" class="page">`,
`{{ content_for_layout }}` and `{% section 'footer' %}` are already there. Do not
re-declare `<main>` or the skip link in a template.

`<main>` carries `class="page"` (plus `home-page` on the index template), which is
the CSS class that supplies `margin-top: var(--nav-height)`, the section gap and
the page padding. `<body>` carries `class="template-{{ template.name }}"` and
`data-page="{{ template.name }}"`.

## 2. Asset naming convention

Shopify assets are a single flat folder, so the static site's sub-folders became
filename prefixes. Nothing else in the filenames changed.

| Static site | Theme asset |
| --- | --- |
| `site/assets/img/texture.svg` | `assets/texture.svg` (top level keeps its name) |
| `site/assets/img/brand/logo.webp` | `assets/brand-logo.webp` |
| `site/assets/img/games/apex.svg` | `assets/games-apex.svg` |
| `site/assets/img/app/home.webp` | `assets/app-home.webp` |
| `site/assets/img/app/app-debloat.webp` | `assets/app-app-debloat.webp` (the file itself starts with `app-`) |
| `site/assets/video/finished-product.mp4` | `assets/finished-product.mp4` (name unchanged) |
| `site/assets/css/site.css` | `assets/site.css.liquid` |
| `site/assets/css/page-about.css` | `assets/page-about.css` |
| `site/assets/js/site.js` | `assets/site.js` |
| `site/assets/js/data.js` | `assets/data.js` |

Reference them as `{{ 'brand-logo.webp' | asset_url }}`. Never write a literal
`/assets/...` path and never append a `?v=` cache buster: Shopify versions assets
itself, and `tools/check-theme.mjs` fails the build on both.

### site.css.liquid

The full 78 KB design system, byte for byte, with two changes:

* `url(/assets/img/texture.svg?v=...)` is now `url({{ 'texture.svg' | asset_url }})`
* `url(/assets/img/texture-mobile.svg?v=...)` is now `url({{ 'texture-mobile.svg' | asset_url }})`

It is a `.liquid` asset so those two filters run. Load it as
`{{ 'site.css' | asset_url | stylesheet_tag }}` (no `.liquid` in the handle).
Design tokens live in `:root` at the top of the file; `layout/theme.liquid`
overrides only `--accent`, `--accent-rgb` and `--accent-bright` from theme
settings, and the defaults are the exact values the static site ships.

### data.js

Copied from the static site minus `MZ.nav` and `MZ.download`, because Liquid owns
navigation now and the download URL is a theme setting. Still present and still
used: `brand`, `categories`, `packs`, `delivery`, `reviews`, `homeReviews`,
`faqs`, `affiliateFaqs`, `stats`, `features`, `metrics`, `games`, `creators`,
`helpers`.

Image paths inside it are built from `window.MZ.assetBase`, which
`layout/theme.liquid` sets in an inline head script before the deferred scripts
run. `MZ.assetBase` is also exposed on the `MZ` object after boot.

`MZ.packs` is the legacy static pack catalogue (five packs from the old store).
It only feeds the review cards' "pack name" line and the legacy pack modals. It
is **not** commerce data: do not build product templates from it, use Shopify
product objects.

### site.js

Copied from the static site with these changes and nothing else:

* `renderHeader()`, `renderFooter()` and `socialBtn()` are gone, along with both
  call sites in `init()`. Liquid renders the header and footer now.
* `init()` calls `initNav(doc)` instead, so the nav behaviour binds to the
  server-rendered markup.
* `initNav(root)` defaults `root` to `document` and now wires **every**
  `.nav-dropdown-wrap` (the static build only ever had one), guarded by a
  `data-nav-ready` attribute so it is safe to call twice.
* A `cart` icon was added to the `ICONS` map for the header cart link.

`node --check assets/site.js` and `node --check assets/data.js` both pass.

## 3. What site.js still expects from your markup

Add these hooks to any template you write and site.js does the rest. Everything
is queried from `document` at `DOMContentLoaded`.

| Hook | What happens |
| --- | --- |
| `<i data-icon="name"></i>` | replaced with an inline SVG. Use `{% render 'icon', name: 'gauge' %}` |
| `[data-mount]` on the first block | mount animation, gets `.loaded` after 100 ms |
| `.animate` | scroll reveal, gets `.slide-up` (threshold .01) |
| `.reveal` | scroll reveal, gets `.visible` (threshold .2, .05 for tall sections) |
| `[data-marquee="brands"]` wrapping `ul.brands-set` | the set is cloned twice for the loop |
| `[data-render="testimonials"]` | renders the review marquee from `MZ.homeReviews` |
| `[data-render="faq"] [data-source="faqs"]` | renders an accordion from `MZ[source]` |
| `[data-render="pack-grid"]` | legacy static pack cards, do not use for Shopify products |
| `[data-accordion]` wrapping `.faq-item > h3 > button.faq-question` + `.faq-answer > .faq-answer-inner` | one-open-at-a-time accordion |
| `[data-modal="login\|cookie-prefs\|close"]` | modal system |
| `[data-modal="pack-buy\|pack-learn"][data-pack="handle"]` | legacy pack modals |

Public API for markup injected after boot: `MZ.ui.hydrateIcons(root)`,
`MZ.ui.initAccordions(root)`, `MZ.ui.refreshReveal(root)`, `MZ.ui.openModal(...)`,
`MZ.ui.closeModal()`, `MZ.ui.reviewCard(...)`, `MZ.ui.stars(n)`, `MZ.ui.esc(s)`,
`MZ.ui.consent`.

Two behaviours to know about because they affect commerce pages:

* **Page transitions.** Every same-origin, same-tab link click fades the body out
  for 220 ms and then navigates. Opt out with `data-no-transition` on the link.
  It skips links with `target`, `download`, or a `mailto:`/`tel:` href. It does
  **not** touch form submissions, so add-to-cart and checkout are unaffected.
* **The word "Free".** `greenFree()` wraps any standalone word "Free" inside
  `.nice-button`, `.btn-clear`, headings, `.features li`, `.stat-chip` and a few
  other containers in `<span class="free-word">`. Write it yourself where you can
  (`Download for <span class="free-word">Free</span>`) so it is right before JS runs.

## 4. Liquid objects the header and footer read

### sections/header.liquid

| Object | Use |
| --- | --- |
| `linklists['main-menu']` | default tab source, overridden by `section.settings.menu` (a `link_list` setting defaulting to `main-menu`) |
| `link.title`, `link.url`, `link.type` | tab label, href, and the first pass of the icon guess |
| `link.active`, `link.child_active` | `.active` class; `aria-current="page"` only on `link.active` |
| `link.links` | a parent with children renders `.nav-dropdown-wrap > a.nav-tab.has-dropdown + .dropdown-panel` |
| `cart.item_count` | the cart link in `.nav-user-controls` and in the mobile drawer |
| `routes.root_url`, `routes.cart_url` | logo and cart hrefs |
| `shop.name` | logo alt text, logo text fallback |
| `section.settings.logo`, then `settings.logo`, then `brand-logo-96.png` | logo image |
| `section.settings.logo_text` | text beside the logo, defaults to `MIZTWEAKZ` |

Markup is the static `renderHeader()` output, class for class:

```
.nav-container
  nav.nav
    .nav-left > a.logo-container.nav-pill (img + span.logo-text)
             > button.hamburger-container.nav-pill[aria-controls="mobile-menu"]
    .tab-container.nav-pill.compact > a.nav-tab (> span.icon-wrapper, span, span.active-tab-underline)
    .nav-user-controls > a.btn-clear.cart-link
  nav.mobile-menu.glass-card#mobile-menu > a.mobile-menu-item (+ .mobile-menu-sub)
```

`#mobile-menu` and `.hamburger-container` are required by `initNav`, which toggles
`.open` on the menu, `body.menu-open`, the button's `aria-expanded`/`aria-label`
and swaps the bars icon for an X.

Icon names come from `snippets/nav-icon.liquid`, which guesses from `link.type`
then refines on the downcased title (home, util/tool/app/download, about/faq,
affiliate/partner/account, contact/support, cart/checkout). Anything unmatched
gets `tags`.

### sections/footer.liquid

| Object | Use |
| --- | --- |
| `linklists['footer']` | Navigate column, overridden by `section.settings.menu` |
| `settings.discord_url`, `settings.youtube_url`, `settings.tiktok_url`, `settings.instagram_url` | the four `.social-btn` links, in that order, blank ones skipped |
| `section.settings.tagline`, `cta_title`, `cta_text`, `cta_url` | brand tagline and the CTA card |
| `settings.download_url` | CTA button when `cta_url` is blank |
| `shop.name`, `'now' | date: '%Y'` | the copyright line |

The Legal column is hard-linked to `/policies/privacy-policy`,
`/policies/terms-of-service` and `/policies/refund-policy`, plus the
`data-modal="cookie-prefs"` button.

**The static footer's "Student redesign concept for a school project. Not
affiliated with MIZTWEAKZ." line was deleted on purpose.** This is the real
storefront, so the claim would be false. Do not put it back.

## 5. Theme settings

`config/settings_schema.json`:

* **Brand**: `logo` (image picker), `accent_color` (`#d92b21`), `accent_bright_color` (`#ff5b50`)
* **Links**: `download_url` (the GitHub installer), `discord_url`, `youtube_url`, `tiktok_url`, `instagram_url`

The link settings are `text` rather than `url` inputs because they are external
URLs and `url` inputs do not take a schema default. `config/settings_data.json`
ships the same values under `current`, plus the header and footer static section
settings under `current.sections`.

## 6. Verifying

No Shopify auth exists in this environment, so nothing can be previewed or
pushed. Run the local validator instead:

```
node tools/check-theme.mjs
```

It checks required files, JSON parsing, `{% schema %}` bodies, Liquid block-tag
balance per file, `{{ }}` used inside `{% %}`, every `asset_url` target resolving
to a real file in `assets/`, leftover `/assets/img/` or `?v=` strings, and
`node --check` on both JS assets. It exits non-zero on any finding, and it also
prints (without failing) the assets no Liquid file references, which is expected
for the ones `data.js` builds at runtime.

## 7. Still missing

* **Not verified in a browser.** No Shopify store credentials here, so nothing was
  rendered. First push should be to an unpublished theme, previewed, then published.
* **`assets/finished-product.mp4` (2.3 MB).** Copied in per the brief, but Shopify's
  asset uploader may reject `.mp4`. If `shopify theme push` rejects it, upload the
  file under Content, Files and replace the `<source src>` in `templates/index.liquid`
  with that CDN URL. The poster image works either way.
* **Commerce templates.** `product`, `collection`, `cart`, `search`,
  `list-collections`, `customers/*`, `gift_card`, `404` and `password` are being
  added by other agents. Only the home page came from this foundation.
* **No section groups.** The header and footer are static sections rendered from
  the layout, so their settings live in `settings_data.json` under
  `current.sections`. Converting them to `sections/header-group.json` later is a
  clean follow-up but was not done here.
* **Legacy dead code in `site.js`/`data.js`.** The pack modal system, `MZ.packs`,
  `MZ.categories`, the `?pack=` deep link and the `firstSegment`/`isActive`
  helpers all survive from the static build and are unused by this foundation.
  They are harmless; delete them once the commerce templates land.
* **Cart count is server rendered.** `{{ cart.item_count }}` in the header is only
  correct on a full page load. The element carries `data-cart-count` so an
  AJAX cart can update it.
* **Page CSS.** `assets/page-about.css`, `page-affiliates.css`, `page-contact.css`,
  `page-legal.css` and `page-utilities.css` were copied over flat for the content
  templates. They contain no `url()` references so they needed no rewriting, and
  they are plain `.css`, not `.liquid`.
