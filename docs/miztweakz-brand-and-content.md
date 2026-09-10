# MIZ TWEAKZ (miztweakz.com) — Brand Identity & Full Content Extraction

Extracted 2026-09-03 from https://www.miztweakz.com/ (Shopify store, **Dawn theme**, theme id `t/2`, shop domain `4e0szr-nf.myshopify.com`, store name "MIZTWEAKS"). Extraction was done from raw HTML (`curl`), `products.json`, the sitemap, the Judge.me widget API, and computed styles / canvas pixel sampling in a browser tab. No images were downloaded to disk; URLs are recorded below.

Page `<title>`: **MIZ TWEAKZ - Optimize Your PC For Gaming - FPS Boost Tweaks – MIZTWEAKS**
Meta description (home): "MizTweaks offers professional PC tweaks, Windows optimization, FPS optimization, input lag reduction, latency optimization, debloat tools, network tweaks, and gaming performance enhancements. Improve responsiveness, boost FPS, optimize your PC for gaming, and get the most out of your hardware."
Meta description (product pages): "MizTweaks provides PC gaming tweaks and Windows optimization tools to improve responsiveness, reduce input lag, optimize FPS, and lower ping."
OG share image: `https://www.miztweakz.com/cdn/shop/files/New_Project_6.png?v=1777327148` (1200x628, dark #202020 background with a centered light/white graphic — the wordmark on dark).

---

## (a) Color palette

The theme defines 5 Dawn "color schemes" as CSS custom properties (RGB triplets). Only **scheme-1** (root/default) and **scheme-2** are actually used on any page; schemes 3-5 are defined but unused except scheme-3 for the "Sale" badge.

### Definitive palette

| Role | Hex | Source / where used |
|---|---|---|
| **Page background** (body, header, footer, cards, every section) | `#1f1f21` (rgb 31,31,33) | `--color-background` scheme-1 & 2; `--gradient-background: #1f1f21` |
| **Surface / background-contrast** (hover surfaces, contrast fills) | `#2b2b2e` (rgb 43,43,46) | `--color-background-contrast` scheme-1 & 2 |
| **Text primary / headings** | `#ffffff` | `--color-foreground: 255,255,255`; h1/h2/card titles/FAQ questions render pure white |
| **Body text** (75% white on #1f1f21) | `rgba(255,255,255,.75)` ≈ `#c7c7c8` | body, paragraphs, prices, nav links, footer links |
| **Text muted** (50% / 30%) | `rgba(255,255,255,.5)` ≈ `#8f8f90`; `.3` ≈ `#626263` | captions, placeholders, disabled |
| **Border / divider** (10% white) | `rgba(255,255,255,.1)` ≈ `#353536` | card borders, content-container borders, accordion dividers |
| **Header bottom border** (8% white) | `rgba(255,255,255,.08)` ≈ `#313133` | `.header-wrapper` 0.8px solid |
| **Input border** (55% white) | `rgba(255,255,255,.55)` ≈ `#9a9a9b` | newsletter/contact inputs (`--inputs-border-opacity: .55`), 1px, radius 0 |
| **PRIMARY ACCENT — electric lime** | `#e3fc02` (rgb 227,252,2) | `--color-button` + `--color-link` + `--color-secondary-button-text` in scheme-1 (root). Used for: FAQ section links, newsletter section button/arrow, cart-drawer "Check out", "Skip to content", secondary-button outlines & text. Also `--gradient-background` of scheme-4 |
| **Button (scheme-1)** | bg `#e3fc02`, text `#1f1f21`, border 1px `#1f1f21`, radius 0 | FAQ + newsletter + cart/drawer contexts |
| **Button (scheme-2)** — most visible CTAs | bg `#ffffff`, text `#1f1f21`, border 1px, radius 0 | Hero "SHOP", "Join 4000+ Active Users", product "Add to cart"/"Buy Now", blog "Start Now", contact "DISCORD" |
| **Secondary button (scheme-1)** | bg `#1f1f21`, text+border `#e3fc02` | outline lime button |
| **Secondary button (scheme-2)** | bg `#1f1f21`, text+border `#ffffff` | "View cart" in cart notification |
| **Link (scheme-1)** | `#e3fc02` | rte links in FAQ/newsletter/footer-adjacent app blocks |
| **Link (scheme-2)** | `#ffffff` | hero, product, blog sections |
| **Sale badge** | bg `#ffffff`, text `#1f1f21`, border `rgba(31,31,33,.1)`, pill radius `4rem` | `.badge.color-scheme-3` on product cards ("Sale") |
| **Review stars / review accent (Judge.me)** | `#f8ff00` | `--jdgm-primary-color`, `--jdgm-star-color`, reviewer-name color, "write review" button bg, verified-buyer badge bg, histogram bars |
| Judge.me secondary tint | `rgba(248,255,0,0.1)` | star background / hover tint |
| Judge.me snippet card | bg `#333333`, text `#fcf8f8`, muted `#7b7b7b`, radius 8px, arrows bg `#fff` / icon `#000` | review snippet cards (if shown) |
| **Secondary accent — cyan (latent)** | `#00fced` (rgb 0,252,237) | scheme-5 background (`--gradient-background: #00fced`, contrast `#007d75`); defined in theme settings but not applied to any fetched section |
| Lime scheme contrast | `#717e01` | scheme-4 `--color-background-contrast` |
| Light scheme (scheme-3) | bg `#ffffff`, fg `#1f1f21`, contrast `#bfbfbf`, button `#1f1f21`/text `#ffffff` | only used by the Sale badge |
| Shadow color | `#ffffff` at opacity 0 | `--color-shadow: 255,255,255`; all shadows disabled (opacity 0) |
| Payment-terms bg | `#1f1f21` | `--payment-terms-background-color` |
| McAfee badge red (image) | ≈ `#c02020` | `McAfee_Verified_Badge` PNG |

**Gradients:** none — every `--gradient-background` is a flat color (`#1f1f21`, `#ffffff`, `#e3fc02`, `#00fced`).

**Summary in words:** near-black charcoal (#1f1f21) everywhere, pure white Oswald headings, 75%-white Figtree body copy, hairline 10%-white borders, zero border-radius on buttons/cards/inputs, no shadows. The only saturated colors are the **electric lime-yellow #e3fc02** (theme accent) and the near-identical **Judge.me yellow #f8ff00** on review stars. Most big CTAs are actually **white** buttons (scheme-2); the lime shows up on the FAQ/newsletter sections, cart drawer, and links.

### Raw theme CSS custom properties (from `<style>` in `<head>`)

```
:root, .color-scheme-1 { --color-background: 31,31,33; --gradient-background: #1f1f21; --color-foreground: 255,255,255; --color-background-contrast: 43,43,46; --color-shadow: 255,255,255; --color-button: 227,252,2; --color-button-text: 31,31,33; --color-secondary-button: 31,31,33; --color-secondary-button-text: 227,252,2; --color-link: 227,252,2; --color-badge-foreground: 255,255,255; --color-badge-background: 31,31,33; --color-badge-border: 255,255,255; }
.color-scheme-2 { --color-background: 31,31,33; --gradient-background: #1f1f21; --color-foreground: 255,255,255; --color-background-contrast: 43,43,46; --color-button: 255,255,255; --color-button-text: 31,31,33; --color-secondary-button: 31,31,33; --color-secondary-button-text: 255,255,255; --color-link: 255,255,255; --color-badge-*: (255,255,255 / 31,31,33 / 255,255,255) }
.color-scheme-3 { --color-background: 255,255,255; --gradient-background: #ffffff; --color-foreground: 31,31,33; --color-background-contrast: 191,191,191; --color-button: 31,31,33; --color-button-text: 255,255,255; --color-secondary-button: 255,255,255; --color-secondary-button-text: 31,31,33; --color-link: 31,31,33; }
.color-scheme-4 { --color-background: 227,252,2; --gradient-background: #e3fc02; --color-foreground: 31,31,33; --color-background-contrast: 113,126,1; --color-button: 31,31,33; --color-button-text: 227,252,2; --color-secondary-button: 227,252,2; --color-secondary-button-text: 31,31,33; --color-link: 31,31,33; }
.color-scheme-5 { --color-background: 0,252,237; --gradient-background: #00fced; --color-foreground: 31,31,33; --color-background-contrast: 0,125,117; --color-button: 31,31,33; --color-button-text: 0,252,237; --color-secondary-button: 0,252,237; --color-secondary-button-text: 31,31,33; --color-link: 31,31,33; }
body { color: rgba(var(--color-foreground), 0.75); background-color: rgb(var(--color-background)); }
```

Judge.me: `:root{--jdgm-primary-color:#F8FF00;--jdgm-secondary-color:rgba(248,255,0,0.1);--jdgm-star-color:#F8FF00;--jdgm-write-review-text-color:white;--jdgm-write-review-bg-color:#F8FF00;--jdgm-paginate-color:#F8FF00;--jdgm-border-radius:0;--jdgm-reviewer-name-color:#F8FF00}`

### Layout / shape tokens (Dawn settings)
- `--page-width: 160rem` (1600px), `--page-width-margin: 0`
- `--buttons-radius: 0`, `--buttons-border-width: 1px`, `--inputs-radius: 0`, `--inputs-border-width: 1px`
- `--product-card-corner-radius: 0`, card border 0, card shadow off, `--badge-corner-radius: 4rem`
- `--media-radius: 0`, `--text-boxes-radius: 0`, `--popup-corner-radius: 0`, `--variant-pills-radius: 40px`
- `--spacing-sections-desktop: 52px`, `--spacing-sections-mobile: 36px`
- grid gaps: desktop 40px / mobile 20px
- Section→scheme map (home): announcement bar, header, hero, product grid, "Trusted By The BEST", footer = **scheme-2** (white buttons). FAQ, newsletter = **scheme-1** (lime buttons). Judge.me carousel & POWR slider blocks inherit root scheme-1.

### Hex frequency in homepage HTML (top, excluding payment-icon SVG colors)
`#000` 16 · `#108474` 13 (Shopify/Judge.me SVG) · `#ffffff` 12 · `#f8ff00` 11 · `#fff` 11 · `#7b7b7b` 4 · `#232323` 4 · `#1d1c1c` 4 · `#1f1f21` 2 · `#e3fc02` 1 · `#00fced` 1. `base.css` uses only `rgb(var(--color-*))` tokens (no literal hex besides `#fff`/`#000`).

---

## (b) Logo & typography

### Logo (header)
- **URL:** `https://www.miztweakz.com/cdn/shop/files/b3e68a16-b61b-477e-9066-f7e73cbdc638.png?v=1745436634` (served up to `&width=600`; srcset 80w/120w/160w)
- **Alt:** `MIZTWEAKS` · **Displayed:** 80×80 px in header (`.header__heading-logo`, `width="80" height="80.0"`, `loading="eager"`), wrapped in `<h1 class="header__heading"><a href="/" class="header__heading-link">`. Header layout: logo left, nav center, search/login/cart icons right. No text wordmark next to it.
- **Natural size:** 600×600 (square, transparent PNG). Content occupies roughly the middle 65% vertically and ~90% horizontally.
- **Colors:** strictly two-tone — off-white `#f8f8f6` strokes and near-black `#171b1c` fills, with anti-aliased grays. **No lime/yellow in the logo.**
- **Description (from a 100×42 pixel map — coarse; designer should open the URL):** a two-line, heavy, slanted graffiti / bubble-letter **wordmark reading "MIZ" (top line) over "TWEAKZ" (bottom line)**. Letters are drawn as thick white outlines with dark interiors (outline style), the letters touch/overlap into one cluster, and the whole block is skewed italic-style (bottom line shifts left, top line sits right — rising to the right ~10-15°). A heavier white keyline surrounds the whole cluster. The top-right of the "MIZ" line has a tall flourish/serif spike; the bottom line's "Z" tails off down-left. Reads as a street-art / esports clan-tag mark. Recreate as: Oswald-like condensed ultra-bold letters, expanded to bubble outlines, white stroke ≈ 6-8% of cap height, dark fill, italic skew, on transparent.
- **Favicon:** `https://www.miztweakz.com/cdn/shop/files/logo_4257b021-6349-4b4e-90c4-2b2ca73894b8.png?crop=center&height=32&v=1777327471&width=32` — a *different* asset (grayscale mid-tone photographic/avatar-style mark, mostly `#808080`-`#a0a0a0`), not the wordmark.

### Typography (Shopify font stack, self-hosted from `//www.miztweakz.com/cdn/fonts/`)
| Token | Value |
|---|---|
| `--font-heading-family` | **Oswald, sans-serif** — weight **500** only (`oswald_n5` woff2/woff) |
| `--font-body-family` | **Figtree, sans-serif** — weights loaded: **500** normal, **700** normal, 500 italic, 700 italic (`--font-body-weight: 500`, `--font-body-weight-bold: 800` declared but only 700 is loaded) |
| `--font-heading-scale` | 1.4 · `--font-body-scale` 1.0 · `html{font-size:62.5%}` |
| Body | Figtree 500, 15px mobile / **16px** desktop, `letter-spacing: 0.06rem`, line-height 1.8 |
| h1 (`.h1`, hero heading) | Oswald 500, **56px**, letter-spacing 0.84px, color #fff, no uppercase transform (caps are typed manually) |
| h2 (`.h2`) | Oswald 500, 33.6px |
| Product card title (`.card__heading`) | Oswald 500, 25.2px |
| FAQ question (`.accordion__title`) | Oswald 500, 21px |
| Announcement bar text | Oswald 500, 18.2px, letter-spacing 1px, white |
| Nav links | Figtree 500, 14px, `rgba(255,255,255,.75)` |
| Buttons | Figtree 500, 15px, letter-spacing 1px, height 4.5rem, radius 0 |
| Prices | Figtree 500, 13px, letter-spacing 1px |
| Footer links | Figtree 500, 14px, letter-spacing 0.4px |
| Review stars | `JudgemeStar` icon font, #f8ff00 |

---

## (c) Site map

### Announcement bar (site-wide, scheme-2, centered, no link)
`🔥 Limited Time Offer – 50% OFF All Packs!`

### Header nav (desktop inline + mobile drawer, identical items)
| Label | href |
|---|---|
| Home | `/` |
| Products | `/collections/all` |
| Reviews | `/pages/avada-faqs` (page titled "Frequently Asked Questions"; content = reviews + videos, see (e)) |
| Affiliate | `/blogs/news` (blog with 0 posts, repurposed as the affiliate landing page) |
| Contact | `/pages/contact` |
| Log in (icon/text) | `https://www.miztweakz.com/customer_authentication/redirect?locale=en&region_country=US` |
| Search (icon → predictive search modal) | `/search` |
| Cart (icon, count bubble) | `/cart` |
| Country/region + currency selector | 28 countries: Australia AUD, Austria EUR, Belgium EUR, Canada CAD, Czechia CZK, Denmark DKK, Finland EUR, France EUR, Germany EUR, Hong Kong SAR HKD, Ireland EUR, Israel ILS, Italy EUR, Japan JPY, Malaysia MYR, Netherlands EUR, New Zealand NZD, Norway USD, Poland PLN, Portugal EUR, Singapore SGD, South Korea KRW, Spain EUR, Sweden SEK, Switzerland CHF, UAE AED, United Kingdom GBP, United States USD (default) |

Cart notification popup text: "Item added to your cart" · "View cart" (secondary) · "Check out" (primary) · "Continue shopping".

### Footer (scheme-2)
- Country/region selector (same list)
- "Payment methods" icon row: Apple Pay, Discover, Diners Club, PayPal, Bancontact, Google Pay, American Express, Mastercard, Visa, iDEAL
- `© 2026, MIZTWEAKS` (link `/`) · `Powered by Shopify`
- Policy links: Privacy policy `/policies/privacy-policy` · Refund policy `/policies/refund-policy` · Contact information `/policies/contact-information` · Terms of service `/policies/terms-of-service` · Shipping policy `/policies/shipping-policy` · Legal notice `/policies/legal-notice`
- No footer menu columns, no footer newsletter, no footer social icons.

### Floating social-icons app block (site-wide, black icon set, branding removed)
Discord `https://discord.gg/tT4HSfAWrt` (custom icon `discord-black-icon-1_webp.webp`) · TikTok `https://www.tiktok.com/@miz_tweakz?lang=en` · YouTube `https://www.youtube.com/@MIZTWEAKZ` · Instagram `https://www.instagram.com/miz_tweakz`

### All URLs in sitemap
- `/` · `/collections/all` · `/collections/frontpage`
- `/products/ultimate-bundle` · `/products/pc-ping-package` · `/products/fps-pack` · `/products/delay-pack` · `/products/debloat-tool`
- `/pages/about-us` · `/pages/avada-faqs` · `/pages/contact` · `/pages/data-sharing-opt-out` (Shopify default privacy opt-out; empty title)
- `/blogs/news` (no articles)
- Policies listed above. `/pages/faq`, `/pages/reviews`, `/pages/affiliate` do **not** exist (404).

---

## (d) Products (from `/products.json` + product pages)

All products: digital (`requires_shipping: false`), taxable, one variant "Default Title", USD, all currently on sale at 50% off compare-at (matches the announcement bar). Every product has exactly **one image**, a **1024×1536 portrait PNG** (2:3). Product cards on the collection/home grid: image ratio 150%, "Sale" badge bottom-left, title, strikethrough compare-at + sale price, quick-add "Add to cart".

### 1. PC Ultimate Bundle
- URL: `https://www.miztweakz.com/products/ultimate-bundle` · id `8753447731363` · variant `45797377409187` · vendor "My Store" · published 2025-04-23
- **Price $39.99** · compare-at **$89.99**
- Reviews: **27**, average **4.89**
- Description (verbatim `body_html`, a `<ul>`):
  - Contains Everything from the PING, FPS, Debloat, and Delay Packages
  - Lowers Delay for KBM & Controller
  - Network Registry Files for Lower & Stable Ping
  - GPU/CPU Settings for Increased Performance
  - Custom KBM Tweaks for Lower Delay
  - Advanced System Optimization for Maximum Performance
- Image: `https://cdn.shopify.com/s/files/1/0702/0380/1763/files/Ultimate_Bundle_9754c0c1-b8fd-4f38-befb-9a23cc929ff9_5.png?v=1783705006` (1024×1536, no alt). Depicts: box-art style product render on a flat light-gray (#eeeeee) backdrop; central object is dark with navy/indigo (#1d2359, #4952b4), purple (#533989) and deep-red (#660101, #bb201d) accents — reads as a dark software-box / package mockup with colorful game-art panels.

### 2. PC Ping Pack
- URL: `https://www.miztweakz.com/products/pc-ping-package` · id `8767206621347` · vendor MIZTWEAKS · published 2025-05-18
- **Price $24.99** · compare-at **$49.99** · Reviews: **4**, avg **4.75**
- Description (verbatim, `<ul>`):
  - Network Registry Files for Lower & Stable Ping
  - Disabling Network Data Collection
  - Reduction of Telemetry Settings
  - Advanced System Optimization for Maximum Performance
- Image: `https://cdn.shopify.com/s/files/1/0702/0380/1763/files/ping_pack_c6c5fb3d-b1a6-422b-8067-e9bb25b83ce8.png?v=1783705067` (1024×1536). Same box-art style on light gray.

### 3. PC FPS Pack
- URL: `https://www.miztweakz.com/products/fps-pack` · id `8753434984611` · vendor "My Store" · published 2025-04-23
- **Price $24.99** · compare-at **$49.99** · Reviews: **4**, avg **5.00**
- Description (verbatim, one `<p>` with bullets):
  • Registry Files to Boost Performance
  • Power Settings for Maximum Performance
  • Debloated Discord to Boost FPS
  • Bonus NVIDIA Settings for FPS
  • Advanced System Optimization for Maximum Performance
- Image: `https://cdn.shopify.com/s/files/1/0702/0380/1763/files/fps_pack_1.png?v=1783705051` (1024×1536). Dark package on light gray (#d9d9d9-#ececec) with dark-brown/red-brown (#412625, #733c3b) tones — box mockup.

### 4. PC Delay Pack
- URL: `https://www.miztweakz.com/products/delay-pack` · id `8753433510051` · vendor "My Store" · published 2025-04-23
- **Price $24.99** · compare-at **$49.99** · Reviews: **2**, avg **5.00**
- Description (verbatim):
  • Lowers Delay for KBM & Controller
  • PC Service Reduction to Reduce Input Delay
  • Custom KBM Tweaks for Lower Delay
  • Lower Process Count for Optimal Delay
  • Advanced System Optimization for Maximum Performance
- Image: `https://cdn.shopify.com/s/files/1/0702/0380/1763/files/delay_pack-b8fd-4f38-befb-9a23cc929ff9.png?v=1783705034` (1024×1536).

### 5. PC Debloat Tool
- URL: `https://www.miztweakz.com/products/debloat-tool` · id `9074962661539` · vendor MIZTWEAKS · published 2026-04-02
- **Price $14.99** · compare-at **$29.99** · Reviews: **0** ("No reviews")
- Description (verbatim, `<ul>`):
  - One-Click Full System Debloat for Maximum Performance
  - Disables Unnecessary Services to Reduce Input Delay
  - Custom Privacy & Telemetry Tweaks for a Cleaner System
  - Lowers Background Process Count for Optimal Responsiveness
  - Advanced Registry Optimization for Faster Boot & Response Times
- Image: `https://cdn.shopify.com/s/files/1/0702/0380/1763/files/debloat_tool_377b240d-41e3-4e21-afb3-4465c1c375e4.png?v=1783705084` (1024×1536).

### 6. XBOX Pack — **not currently listed**
Not in `products.json`, sitemap, `/collections/all`, or predictive search (`/products/xbox-pack` etc. → 404). It only survives as a product name inside one Judge.me carousel review ("My kid said it helped reduce lag." — Anonymous, 01/26/2026, 5★). The store-wide count is 51 reviews but only 37 are attached to the five live products, so ~14 reviews belong to this unpublished/hidden product. Price unknown. The site copy still says "we have options for consoles as well" and the meta text mentions "PC, PS5, Xbox, and all consoles".

### Product page template (same on all five)
Main section (scheme-2): single image gallery (left) · h1 title · Judge.me stars + "N reviews" · description bullets · two accordions:
- **Delivery** — "The Full Bundle Will Be Delivered Instantly VIA Email as a Downloadable File." (identical text on all five product pages, including the single packs)
- **What You'll Receive** — "A downloadable optimization package" / "Easy to follow + FULL Video Tutorial" / "Lifetime access to your download"
Then price block ($39.99 / ~~$89.99~~ / "Sale"), "Shipping calculated at checkout." (links `/policies/shipping-policy`), **Add to cart** button + accelerated checkout (Buy it now), icon-with-text trio: **Instant Access · Easy Setup · Direct Support** (Dawn line icons; third is the chat-bubble icon), "View full details".
Below: "Trusted By The BEST" creators (3 avatars) + **Buy Now** → `/collections/all`; image-with-text with McAfee badge image + h2 **"4000+ Active Users"** + p **"We Value Each Customer's Safety, and Ensure Our Product Is Virus-Free and Safe For All Systems."** + **Buy Now**; Judge.me carousel; FAQ (product-page wording, see (e)); newsletter.

---

## (e) Page copy — verbatim by page

### HOME `/`
1. **Announcement bar:** `🔥 Limited Time Offer – 50% OFF All Packs!`
2. **Hero** (image-with-text, scheme-2, text left / media right, no overlap, media "adapt" 16:9):
   - Media: animated GIF `https://www.miztweakz.com/cdn/shop/files/ezgif.com-optimize_255f0d11-705a-4c66-8336-1a6d08a9ea37.gif?v=1774424349` (1500×844) — a split-screen before/after Fortnite-style gameplay clip (bright sky blues/greys, vertical divider near the middle, green + red HUD/FPS counter elements).
   - Heading (h2 styled `.h1`): **Increase FPS, Reduce input delay, optimize your PC for gaming**
   - No subheadline.
   - Button (primary): **SHOP** → `/collections/all`
3. **POWR Image Slider app block** (`powr-image-slider`, id `baee2a07_1766985102`, iframe from powr.io; template title "Copy of Multi Slider - Logo Template Shoes"; transition "slide", autoplay off). Four images (a logo strip): `https://customer.powrcdn.com/VRBmrJ/src-res/MTG6LDlmMwm5376R6ezak.webp`, `.../__pXcfr0JUjYVtOq4zcPW.webp`, `.../dAvmXzSL_WLWg8CEL4thf.webp`, `.../BQKfQlGfGASXzpRjmCM-Y.webp`. No captions. (Could not read pixels cross-origin; template name implies brand/game logos.)
4. **Featured collection** (scheme-2): heading **Instantly Improve Your Performance:** — 5 product cards (5-col desktop / 2-col tablet-down) in order: PC Ultimate Bundle, PC Ping Pack, PC FPS Pack, PC Delay Pack, PC Debloat Tool. Each card: image, "Sale" badge, title, "Regular price ~~$X~~ Sale price $Y USD", "Add to cart".
5. **Multicolumn** (scheme-2, 3 columns, circular half-width images, centered): heading **Trusted By The BEST**
   - `https://www.miztweakz.com/cdn/shop/files/channels4_profile_5.jpg?v=1764634629` → **Premfn**
   - `https://www.miztweakz.com/cdn/shop/files/zn2vTeID_400x400_d72296b6-e71d-4db9-b59e-da0aed8a5446.jpg?v=1765820353` → **Npen**
   - `https://www.miztweakz.com/cdn/shop/files/channels4_profile_2dd1709f-15ce-4a81-84f7-11f38eccfea0.jpg?v=1766125916` → **aero1x**
   - (all are YouTube/Twitter profile avatars, no links) · Button (primary): **Join 4000+ Active Users** → `/collections/all`
6. **Judge.me featured carousel:** heading **Let customers speak for us** · "from 51 reviews" · average score 4.92 · sliding cards (stars, title, body, name, date, product name).
7. **FAQ** (collapsible content, scheme-1): heading **Frequently Asked Questions**
   - **What are Gaming Tweaks** — Tweaks are custom built PC optimizations that help improve FPS, reduce input lag, enhance responsiveness, and optimize Windows for better gaming performance.
   - **What kind of performance boost can I expect?** — Expect lower input delay, lower ping, and a noticeable increase in system responsiveness. Real users have reported an increase of 50-100 FPS. No gimmicks, just raw performance.
   - **Is this safe for my setup?** — Yes, 100%. Everything is tested, non-intrusive, and fully reversible. No sketchy third-party tools. Just elite system tweaks used by Mizery himself, and some pros!
   - **Do I need to be tech-savvy to use it?** — Not at all. The instructions and process are both crystal clear. Each package has a step-by-step guide and pro support if you need help along the way.
   - **Does it work on all systems?** — It's optimized for Windows 10 & 11, and works on laptops, desktops! However, depending on the level of your setup, results may vary.
   - **Terms of Service** — Because the product is instantly delivered to your device, we offer no refunds.
8. **Newsletter** (scheme-1): heading **Subscribe to our emails** · "Be the first to know about new collections and exclusive offers." · Email input (placeholder "Email") + arrow submit.

Product-page FAQ variant (same 6 questions, slightly different answers):
   - Q2: "Expect lower input delay, smoother frames, and a noticeable increase in system responsiveness. Real users have reported an increase of 30-100 FPS. No gimmicks — just raw performance."
   - Q3: "Yes — 100%. Everything is tested, non-intrusive, and fully reversible. No sketchy third-party tools. Just elite-level system tweaks used by Mizery himself, and some pros!"
   - Q5: "It's optimized for Windows 10 & 11, and works on laptops, desktops, and we have options for consoles as well! However, depending on the level of your setup, results may vary."

### ABOUT US `/pages/about-us` (title "About Us") — byte-identical content to `/pages/avada-faqs` (title "Frequently Asked Questions", linked as "Reviews" in the nav)
1. Rich text (scheme-2): h2 **Real Results** · p **100% Verified Reviews from our customers. Across every setup imaginable, Miz Tweakz consistently improves performance.**
2. Judge.me carousel (same as home).
3. Video section (scheme-1): heading **i5-13420H – RTX 4050 – 16GB RAM** · YouTube embed `https://www.youtube.com/embed/2qGGoF08cHA` · poster `https://www.miztweakz.com/cdn/shop/files/INSTANTLY_Get_Lower_Ping_and_higher_fps_in_Fortnite_2.jpg?v=1765867402` (YouTube thumbnail: "INSTANTLY Get Lower Ping and higher fps in Fortnite").
4. Video section (scheme-1): heading **Ultra 9 185H – RTX 4070 (Laptop) – 16GB RAM** · YouTube embed `https://www.youtube.com/embed/8f5-mHrQJ08` · poster `https://www.miztweakz.com/cdn/shop/files/b4_afer_1.png?v=1767330736` (1280×720 before/after Fortnite screenshot: blue sky scene split by a vertical divider, red/green stat overlays, caption text along the bottom).
5. Rich text (scheme-2): button **Buy Now** → `https://www.miztweakz.com/products/ultimate-bundle`
6. Empty rich-text section; newsletter (same as home).

### CONTACT `/pages/contact`
- h1 **Contact**
- Contact form (scheme-2, Shopify `contact` form): fields **Name** (`contact[name]`), **Email*** (required, `contact[email]`), **Phone number** (`contact[phone]`), **Comment** (textarea, `contact[body]`), button **Send**.
- Empty slideshow section.
- Rich text (scheme-2): h2 **Or Join Our Discord** · p **For the fastest response time on any needs or concerns join ouir discord and open a support ticket!** (sic "ouir") · button **DISCORD** → `https://discord.gg/w9kZpXtkjR`

### AFFILIATE `/blogs/news` (blog "News", zero posts; nav label "Affiliate")
1. Rich text (scheme-2): h2 **Earn $2,500+Monthly** · p **Earn Money Sharing Miz Tweakz, There is NO CAP to How Much Our Partners Can Make!** · button **Start Now** → `https://miztweakz.goaffpro.com/create-account` (GoAffPro affiliate portal)
2. Rich text (scheme-2): h2 **Partner Tiers** · then three heading lines:
   - **Sign up and get started immediately. Your account is approved instantly.**
   - **Up to 30% commission on every sale you generate.**
   - **Give your audience savings with a unique discount code while boosting your sales!**
   - button **Start Now** → same GoAffPro link
3. Empty slideshow section.
4. FAQ (collapsible, scheme-1): heading **FAQ**
   - **Do I have to be a content creator to join?** — Anyone is welcome to join! You don't need to be a content creator—just refer new users to get started. You can even begin by sharing with friends!
   - **Why should I join?** — By joining, you have the opportunity to earn money either by monetizing your channel or simply by referring friends. It's a free and easy way to start earning.
   - **How much do I earn?** — Our compensation structure is tiered, meaning your commission will increase as you earn more with us. The starting commission rate is 20%.
   - **I don't see my question?** — Join the Discord (link → `https://discord.com/invite/tT4HSfAWrt`) and make a support ticket. Feel free to ask anything!

### COLLECTION `/collections/all`
Default Dawn collection grid (no custom title/description text beyond the product cards; same header/footer/Judge.me carousel).

### POLICIES
**Refund policy** `/policies/refund-policy` (full verbatim):
> ### Return Policy
> Because our products are digital downloads, all sales are final. We do not offer returns, exchanges, or refunds once a purchase is completed.
> We encourage you to read all product descriptions carefully and reach out with any questions before making a purchase. If you're unsure whether a product is right for you, don't hesitate to contact us—we're happy to help clarify anything.
> ### Damages or Download Issues
> If you experience any technical issues with accessing or downloading your product, please contact us immediately. We'll do our best to troubleshoot the problem and make sure you receive your product as promised.
> ### EU Customers
> Under EU consumer protection laws, digital products are not eligible for a 14-day "cooling off" period once the download has started. By purchasing and downloading our product, you acknowledge and agree that you lose the right to cancel your order once delivery has begun.

**Shipping policy** `/policies/shipping-policy` (full verbatim):
> Tweaks are instantly sent to customers' email or can be downloaded from the site right after purchase

**Contact information** `/policies/contact-information` (full verbatim):
> Trade name: MIZTWEAKS
> Email: rmizeryinc@gmail.com

**Privacy policy** `/policies/privacy-policy` — Shopify's standard generated privacy policy, "Last updated: April 27, 2026". First paragraph verbatim:
> MIZTWEAKS operates this store and website, including all related information, content, features, tools, products and services, in order to provide you, the customer, with a curated shopping experience (the "Services"). MIZTWEAKS is powered by Shopify, which enables us to provide the Services to you. This Privacy Policy describes how we collect, use, and disclose your personal information when you visit, use, or make a purchase or other transaction using the Services or otherwise communicate with us. If there is a conflict between our Terms of Service and this Privacy Policy, this Privacy Policy controls with respect to the collection, processing, and disclosure of your personal information.

Headings: Personal Information We Collect or Process · Personal Information Sources · How We Use Your Personal Information · How We Disclose Personal Information · Relationship with Shopify · Third Party Websites and Links · Children's Data · Security and Retention of Your Information · Your Rights and Choices · Complaints · International Transfers · Changes to This Privacy Policy · Contact. Summary: standard Shopify template — collects contact/order/account/device data, uses Shopify Payments/analytics, shares with Shopify and service providers, GDPR/CCPA-style rights list. Contact clause: "please call or email us at **miztweakzteam@gmail.com** or contact us via our Discord."

**Terms of service** `/policies/terms-of-service` and **Legal notice** `/policies/legal-notice` — both contain the **same privacy-policy text pasted verbatim** (identical headings and first paragraph as above; there are no actual terms/legal-notice clauses). The only real "terms" statement on the site is the FAQ item: "Because the product is instantly delivered to your device, we offer no refunds."

---

## (f) Reviews (Judge.me)

App: **Judge.me Product Reviews** (theme app extension `judgeme-739`, widget CSS `shopify_v2.css`; featured-carousel app block on home/about/product pages; full review widget + "Write a review" on product pages; pagination 5; 10% coupon-for-review enabled; store reply label "MIZTWEAKS"). Site-wide: **51 reviews, 4.92 average**. 37 retrieved below (27 + 4 + 4 + 2 + 0); the remaining ~14 belong to the unlisted XBOX Pack. All retrieved reviews are marked **Verified Buyer**.

### PC Ultimate Bundle (27 · avg 4.89)
| Stars | Name | Date | Title | Body |
|---|---|---|---|---|
| 5 | Anonymous | 2026-07-28 | — | Gave me 100 more fps and 10 less ping |
| 5 | JF | 2026-07-05 | . | . |
| 5 | David Stoica | 2026-06-03 | Helped me lower my delay and processes like crazy | Helped me lower my delay and processes like crazy and made my fps and ping more stable rather than increasing it |
| 5 | Anonymous | 2026-05-25 | I heavily recommend this | I heavily recommend this. My FPS in game went from a constant 90 fps to around a constant 180fps with decreased frame drops. |
| 5 | Teegan Williams | 2026-05-22 | I got a 100 fps | I got a 100 fps boost |
| 5 | Adrian Fernandez | 2026-05-12 | Great tweaks | I honestly didn't entrust at first but this is actually great I used u tun like 220-240 fps not to stable and very high ping and now i can get up 400 fps in creative and stable 240 fps no stutters and I run a stable ping of 20 without Ethernet thanks mizery |
| 5 | Chase Fiely | 2026-04-05 | Never expected it to be THIS GOOD | It was great,I didn't think that it was worth the original cost but then it was 50% off soI bought it. Worth every pennie no longer lag even though there always like teoTVsand three phones on the wifi |
| 5 | phozyfnr | 2026-03-30 | i got like zero delay and more stable fps W | i got like zero delay and more stable fps W tweaks! |
| 5 | Anonymous | 2026-02-02 | — | I was running30-40ping with the ping glitch and now getting 20ping plus helped fps a lot |
| 5 | misha | 2026-01-31 | Misha | For 30 gbp such good value. The best tweaks on the market went down 30 ping and up 80 fps |
| 5 | Anonymous | 2025-12-31 | Great Product | It helped my ping drop a lot |
| 5 | Anonymous | 2025-12-28 | I can def feel the difference much much | I can def feel the difference much much better |
| 4 | adriana carreño | 2025-12-28 | — | added like 60 fps reduce about 5 to 10 ping |
| 4 | Dayne Edwards | 2025-12-25 | Really good over all | Really good over all, jump from 200 to 300 fps but I wish the ping package was better. |
| 5 | taico12 | 2025-12-20 | Realy good for fortnite | Realy good for fortnite i went from 50-60 ping to 30-45 |
| 5 | Leet | 2025-12-17 | — (1 photo) | This made me get 20 less ping and 100 more fps |
| 5 | Haiden | 2025-12-11 | These are goated my game is running smooth better than ever | These are goated my game is running smooth better than ever. Didnt even have to disable anything W MANS |
| 5 | Harry | 2025-12-09 | — | Went from having stutters and being on 30ms of ping to zero stutters and 0-10ms of ping. Goated bundle |
| 5 | keqko | 2025-10-26 | Recommend a lot | Fricking AWESOMEEEE |
| 5 | Anonymous | 2025-09-13 | 👍🏼 | 👍🏼 |
| 5 | Jake Meyerholtz | 2025-09-12 | Best Investment Yet | Miz Tweaks was the the best investment for my PC yet. It boosted my fps and lowered my ping and delay. Will definitely recommend to everyone I know. |
| 4 | H. VAN BAVEL | 2025-09-08 | — | perfect i have 8ping normally its 50ping! |
| 5 | ljhtech | 2025-09-07 | amazing | amazing, honestly miz tweaks is so good W mizery ❤️i hit my first triple edit on kbm after applying the tweaks |
| 5 | maree | 2025-08-19 | Honest review. | Honestly was skeptical at first but after using it on my latitude 5320 school laptop that could get 50 fps consistently in reload, after purchase i went from about 70 fps in creative to consistent 120 fps and in game is sit around 90-100. 100% recommend best money i have ever spent. Thank you so so much Mizery W sexy mans 🥹 |
| 5 | Alexander | 2025-07-24 | Huge difference | The tweaks were amazing really improved my gaming experience. |
| 5 | Gregory | 2025-06-30 | MXR's Rating (1 photo) | If Ima be deadazz this works. Ty Mizery I can actualy quad edit now. |
| 5 | Rasean Matthews | 2025-06-14 | Perfect Preformance | My game ran smooth now it is running smoother. |

### PC Ping Pack (4 · avg 4.75)
| Stars | Name | Date | Title | Body |
|---|---|---|---|---|
| 4 | Lawrence Walsh | 2026-01-18 | — | Could be better. Dropped about five ping and this is with many optimizations I've done. Overall much more stable and smooth gameplay. Totally not a scam. |
| 5 | Anonymous | 2026-01-02 | — | used to play on 60 ping now i play on 15 thx |
| 5 | Teagan Bailey | 2025-11-27 | Best purchase of all time | Before I bought this pack, i was getting a constant 60-70 ping. Ever since I bought this pack I've been at around 30-25 ping. Which unbelievable, it has helped me a lot since I've gotten it at improving my gameplay, because of the lower ping. Hands down the best thing I've ever boughten!!! |
| 5 | Anonymous | 2025-07-23 | — | they are good i can clip kids on lower ping now |

### PC FPS Pack (4 · avg 5.00)
| Stars | Name | Date | Title | Body |
|---|---|---|---|---|
| 5 | Anonymous | 2026-07-25 | — | Max fps was 220, now up to 360 max |
| 5 | Murphy | 2026-03-26 | Boosted my fps | Boosted my fps by 90, so im very happy about that, and my system is somehow more stable |
| 5 | SickoFN | 2026-01-31 | PC FPS Pack | Got to over 200FPS helps a bunch for my clips W MIZ |
| 5 | Tarquin Shipman | 2025-05-20 | Results | This helped stabilize my FPS and made streaming games way smoother. Before, I would have some crazy dips in my FPS when streaming games like Fortnite. |

### PC Delay Pack (2 · avg 5.00)
| Stars | Name | Date | Title | Body |
|---|---|---|---|---|
| 5 | Jasper | 2026-07-13 | Holy tweaks | Yea, i kinda thought there would be no difference and jst get placebo that its better but WOW. my delay has been so much better and my game runs smoother! |
| 5 | SORIN ASH | 2026-05-31 | Amazing tweaks shoutout to | Amazing tweaks shoutout to miz |

### PC Debloat Tool — 0 reviews

### XBOX Pack (unlisted product; from carousel only)
| Stars | Name | Date | Title | Body |
|---|---|---|---|---|
| 5 | Anonymous | 2026-01-26 | — | My kid said it helped reduce lag. |

Carousel order shown on the homepage (16 cards): Anonymous 07/28/2026 · Chase Fiely · phozyfnr · Murphy · Anonymous 02/02/2026 · misha · SickoFN · Anonymous (XBOX) · Anonymous (Ping) · Anonymous 12/28/2025 · Dayne Edwards · taico12 · Leet · Haiden · Harry.

---

## (g) Social, contact & external

| Channel | URL / value | Where found |
|---|---|---|
| Discord (main / support) | `https://discord.gg/tT4HSfAWrt` (also `https://discord.com/invite/tT4HSfAWrt`) | floating social bar; affiliate FAQ |
| Discord (contact page) | `https://discord.gg/w9kZpXtkjR` | contact page "DISCORD" button |
| YouTube | `https://www.youtube.com/@MIZTWEAKZ` | social bar |
| TikTok | `https://www.tiktok.com/@miz_tweakz?lang=en` | social bar |
| Instagram | `https://www.instagram.com/miz_tweakz` | social bar |
| Twitter/X | none | — |
| Trustpilot | none (reviews are Judge.me only) | — |
| Support email | `miztweakzteam@gmail.com` | privacy policy contact clause |
| Business email | `rmizeryinc@gmail.com` | Contact information policy |
| Affiliate portal | `https://miztweakz.goaffpro.com/create-account` (GoAffPro) | affiliate page |
| YouTube videos embedded | `2qGGoF08cHA`, `8f5-mHrQJ08` | about/reviews page |
| Owner / persona | "Mizery" (FAQ: "tweaks used by Mizery himself"; reviewers thank "mizery"/"miz") | — |
| Featured creators | Premfn, Npen, aero1x | "Trusted By The BEST" |
| Trust badge | McAfee "Verified" badge image `https://www.miztweakz.com/cdn/shop/files/McAfee_Verified_Badge_5fb4fadc-9d05-492b-818f-ceb1db67c216.png?v=1766977794` (1025×634, red #c02020 on transparent) | product pages |
| Apps detected | Judge.me Product Reviews, POWR Image Slider, a social-icons floating-bar app, Avada (FAQ page handle), GoAffPro | — |

---

## (h) Imagery style notes (for matching placeholders)

- **Overall mood:** dark esports/streamer aesthetic — flat charcoal (#1f1f21) canvas, white condensed Oswald headlines, hairline borders, zero rounding, no shadows. Very little color except lime/yellow stars and CTAs. Emoji used in copy (🔥).
- **Product imagery:** one image per product, **portrait 2:3 (1024×1536) PNG "box-art" renders on a flat light-gray (#eeeeee) studio backdrop**; the object is a dark software-box / package mockup with saturated game-art panels (Ultimate Bundle: navy/indigo/purple + deep red; FPS Pack: dark brown/red-brown). Cards display them at 150% ratio with a hover zoom, transparent media background, no border.
- **Hero:** an animated **GIF of Fortnite-style gameplay in a split-screen before/after comparison** (bright sky-blue/grey tones, vertical divider, green/red FPS-counter HUD), 16:9, sitting to the right of the headline.
- **Proof imagery:** YouTube thumbnails / a **before-vs-after Fortnite screenshot** (blue sky, divider down the middle, red/green stat overlays, caption bar at bottom) headed by hardware specs ("i5-13420H – RTX 4050 – 16GB RAM"); two embedded YouTube videos.
- **Social proof:** three **circular creator avatars** (YouTube profile pictures) with handles; Judge.me review cards with yellow stars; a **McAfee Verified** red badge next to "4000+ Active Users".
- **Logo slider:** a POWR strip of 4 logo images (game/brand logos) directly under the hero.
- **Icons:** Dawn's thin-line SVG icons (chat bubble, etc.) for "Instant Access / Easy Setup / Direct Support"; black-glyph social icons (Discord/TikTok/YouTube/Instagram).
- **Placeholder guidance:** use 2:3 portrait product-box mockups on #eeeeee; 16:9 gameplay screenshots with an FPS counter and a before/after divider; circular avatar crops; a red verification badge; keep everything on #1f1f21 with white type and #e3fc02 / #f8ff00 accents.

---

## Appendix — raw asset URL list
- Logo: `https://www.miztweakz.com/cdn/shop/files/b3e68a16-b61b-477e-9066-f7e73cbdc638.png?v=1745436634`
- Favicon: `https://www.miztweakz.com/cdn/shop/files/logo_4257b021-6349-4b4e-90c4-2b2ca73894b8.png?v=1777327471`
- OG image: `https://www.miztweakz.com/cdn/shop/files/New_Project_6.png?v=1777327148`
- Hero GIF: `https://www.miztweakz.com/cdn/shop/files/ezgif.com-optimize_255f0d11-705a-4c66-8336-1a6d08a9ea37.gif?v=1774424349`
- Products: see (d)
- Creators: `channels4_profile_5.jpg?v=1764634629`, `zn2vTeID_400x400_d72296b6-e71d-4db9-b59e-da0aed8a5446.jpg?v=1765820353`, `channels4_profile_2dd1709f-15ce-4a81-84f7-11f38eccfea0.jpg?v=1766125916` (all under `https://www.miztweakz.com/cdn/shop/files/`)
- Video posters: `INSTANTLY_Get_Lower_Ping_and_higher_fps_in_Fortnite_2.jpg?v=1765867402`, `b4_afer_1.png?v=1767330736`
- McAfee badge: `McAfee_Verified_Badge_5fb4fadc-9d05-492b-818f-ceb1db67c216.png?v=1766977794`
- Fonts: `https://www.miztweakz.com/cdn/fonts/oswald/oswald_n5.8ad4910bfdb43e150746ef7aa67f3553e3abe8e2.woff2`, `https://www.miztweakz.com/cdn/fonts/figtree/figtree_n5.3b6b7df38aa5986536945796e1f947445832047c.woff2`, `figtree_n7.2fd9bfe01586148e644724096c9d75e8c7a90e55.woff2`, `figtree_i5.969396f679a62854cf82dbf67acc5721e41351f0.woff2`, `figtree_i7.06add7096a6f2ab742e09ec7e498115904eda1fe.woff2`
- Theme CSS: `https://www.miztweakz.com/cdn/shop/t/2/assets/base.css?v=159841507637079171801745435930` (+ Dawn component CSS files)
