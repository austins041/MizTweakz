# Installing the MIZTWEAKZ Shopify theme

The file to upload is `miztweakz-theme.zip` in this folder. Everything below happens in your
Shopify admin. Nothing here touches the live store until the last step, and that step is
reversible in one click.

## 1. Upload it as a draft

1. Shopify admin, then **Online Store**, then **Themes**.
2. Under **Theme library**, click **Add theme**, then **Upload zip file**.
3. Pick `miztweakz-theme.zip` and upload.

It lands in the library as a draft. **Do not click Publish yet.** Your current theme keeps
serving the store the whole time.

## 2. Point the pages at the right templates

The theme ships one template per custom page. Shopify only uses them once you assign them.
For each page below go to **Online Store**, then **Pages**, open the page, and in the
**Theme template** box on the right pick the template, then Save.

| Page | Template to pick |
| --- | --- |
| About | `page.about` |
| Affiliates | `page.affiliates` |
| Contact | `page.contact` |
| Utilities (the plans page) | `page.utilities` |
| Any long legal or text page | `page.legal` |

If a page does not exist yet, create it first with **Add page**. The title and body can be
short, the template supplies the layout.

## 3. Set the menus

The header and footer read your real Shopify navigation, so they update themselves later
without touching code. Go to **Online Store**, then **Navigation**.

- **Main menu** drives the header tabs. A sensible set is Home, Utilities, About,
  Affiliates, Contact.
- **Footer menu** drives the footer's Navigate column.

The footer's Legal column links straight to your Shopify policy pages and needs no menu.

## 4. Add the before and after video

Shopify does not allow video files inside a theme, so the clip is not in the zip. You will find it in this folder at `theme-extras/finished-product.mp4`, and the same file is
in the repo at `site/assets/video/finished-product.mp4`.

1. **Settings**, then **Files**, then **Upload files**, and pick that MP4.
2. Click the copy-link icon next to it once it finishes.
3. Back in **Themes**, on the new theme use **Customize**, then **Theme settings**, then
   **Links**, and paste the URL into **Before and after video**. Save.

Skip this and the home page shows the still frame instead, which still looks fine.

## 5. Preview and check

On the draft theme click **Preview** (the eye icon, or Actions then Preview). Walk through:

- Home page loads, the logo and glow look right, the game logos scroll.
- A product page, for example Basic or Ultimate. Price shows, **Add to cart** works.
- The cart page: quantity updates, remove works, **Checkout** reaches Shopify checkout.
- Utilities: the plan buttons link to the real Basic and Ultimate products.
- Contact: send yourself a test message through the form.
- The header menu and footer links.

## 6. Publish

Happy with it? On the draft theme click **Actions**, then **Publish**.

**To undo:** go back to **Themes**, find your previous theme in the library, and click
**Publish** on it. The store returns to exactly how it was. Nothing is deleted by
publishing, so this stays available.

## Notes

- Product pages, collections, cart, search, customer accounts and the blog all render
  through this theme now, styled to match. They read live Shopify data, so nothing about
  your products or prices is hard coded.
- The theme's own source lives in `shopify-theme/` in this repo. Rebuild the zip after any
  change, and re-run `node tools/check-theme.mjs` first.
