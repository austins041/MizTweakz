# MIZTWEAKZ Redesign (school project)

Redesign of **MIZTWEAKZ** (miztweakz.com, a Shopify store selling PC gaming
"tweak packs") rebuilt to mirror the structure, layout, components, animations
and page behaviors of **Paragon Tweaks** (paragontweaks.net), while keeping
MIZTWEAKZ's own brand: colors, logo, fonts and content.

## What's here

| Path | Purpose |
| --- | --- |
| `site/` | The static site. Deployable as-is to Cloudflare Pages. |
| `site/assets/css/site.css` | Design system: tokens at the top, then every shared component. |
| `site/assets/js/site.js` | Shared behavior: header/footer injection, nav dropdown, mobile drawer, hero mount animation, scroll reveal, marquees, FAQ accordion, modals, cookie consent, page transitions, `?pack=` deep links. |
| `site/assets/js/data.js` | All MIZTWEAKZ content as data (`window.MZ`): packs, prices, reviews, FAQ, socials, stats. |
| `site/assets/img/` | Hand-made SVG placeholders (logo, box art, badges, avatars, textures). Swap for real assets later. |
| `docs/paragon-tweaks-audit.md` | Full UI/UX audit of Paragon Tweaks (the layout source of truth). |
| `docs/miztweakz-brand-and-content.md` | Brand palette, logo, fonts and verbatim content pulled from MIZTWEAKZ. |
| `BUILD-NOTES.md` | How the design system is used and how to scaffold a new page. |
| `tools/` | Helper scripts (SVG generator, link checker). |

## Route map (Paragon → MIZTWEAKZ)

| Paragon Tweaks | This redesign |
| --- | --- |
| `/` | `/` |
| `/services` (Tweaking / Overclocking / Networking / Streaming) | `/packs/` (FPS / Ping / Delay / Ultimate Bundle) |
| `/utilities` | `/utilities/` (PC Debloat Tool + guides) |
| `/about` | `/about/` |
| `/partners` | `/affiliates/` |
| `/contact` | `/contact/` |
| `/tos`, `/privacy` | `/tos/`, `/privacy/` |

## Palette

| Role | Hex |
| --- | --- |
| Background | `#1f1f21` |
| Surface | `#2b2b2e` |
| Primary accent (Paragon's exact red, per owner) | `#bc312a` |
| Bright accent (Paragon's exact accent) | `#e85a51` |
| Ambient glow (background lighting, halos) | `#bc312a` / `#e85a51` |
| Headings / body / muted text | `#ffffff` / `#c7c7c8` / `#8f8f90` |

Logo: the real MIZ TWEAKZ square mark (derivatives from `tools/img/build-logo-miz.mjs`); the owner's alternative "M" mark is kept in `site/assets/img/brand/logo-m*.svg`.

Fonts: **Oswald** (display, replaces Paragon's Amenti) and **Figtree** (body), via Google Fonts.

## Run locally

```bash
npx --yes http-server site -p 8123 -c-1
```

## Deploy (Cloudflare Pages)

```bash
npx wrangler pages deploy site --project-name misstweaks-redesign
```

Live: https://misstweaks-redesign.pages.dev/

## Third-party logos

The game logos in `site/assets/img/games/` come from Wikimedia Commons and are used for a school project only:
Fortnite (`File:FortniteLogo.svg`, public domain), Valorant (`File:Valorant logo - pink color version.svg`, public domain),
Apex Legends (`File:Apex Legends logo.svg`, public domain), Counter-Strike 2 (`File:Counter-Strike 2 logo.svg`, public domain),
Call of Duty Warzone (`File:Call of Duty Warzone Logo.png`, public domain, inverted to white), Rocket League
(`File:Rocket League logo.svg`, CC BY-SA 4.0). Monochrome marks were recolored white for the dark background.
All marks remain trademarks of their owners.
