# Installing the MIZTWEAKZ Shopify theme

Upload `miztweakz-theme.zip` from this folder. Everything happens in your Shopify admin,
and nothing touches the live store until you publish.

## Why the preview looked wrong the first time

The theme was right, but Shopify was filling it with your old store's content:

- **The Utilities, About and Affiliates pages do not exist on your store.** Shopify only
  serves a `/pages/...` URL if a page with that handle exists. The theme carries the
  design for those pages, but Shopify has nothing to attach it to until you create them.
  That is step 2 below and it takes about three minutes.
- **The header was showing your old menu.** It used to read your Shopify "main-menu",
  which still lists Products, Reviews and Affiliate pointing at the old pack products.
  The theme now carries its own navigation instead, so this is already fixed.

## 1. Upload it as a draft

**Online Store**, then **Themes**, then **Add theme**, then **Upload zip file**. Pick
`miztweakz-theme.zip`. It lands in the library as a draft. Do not publish yet.

## 2. Create the three pages (this is the important one)

**Online Store**, then **Pages**, then **Add page**. Do this three times. Leave the
content box empty, the template supplies everything. What matters is the title and the
template.

| Title to type | Template to select | Check the URL says |
| --- | --- | --- |
| Utilities | `page.utilities` | `/pages/utilities` |
| About | `page.about` | `/pages/about` |
| Affiliates | `page.affiliates` | `/pages/affiliates` |

The template dropdown is on the right of the page editor, labelled **Theme template**. If
the list looks empty, make sure the new theme is selected in the theme picker at the top,
or finish uploading it first.

While you are there, open your existing **Contact** page and set its template to
`page.contact`.

**Watch the handle.** After saving, look at the page URL in the editor. It must be exactly
`utilities`, `about` and `affiliates`. If Shopify made it `utilities-1` or similar, edit it
under **Search engine listing**, then **Edit website SEO**, then **URL handle**.

## 3. Add the before and after video (optional)

Shopify does not allow video inside a theme, so the clip is not in the zip. It is at
`theme-extras/finished-product.mp4` in this folder, and also at
`site/assets/video/finished-product.mp4`.

1. **Settings**, then **Files**, then **Upload files**, and pick that MP4.
2. Copy its link.
3. **Themes**, then **Customize** on the new theme, then **Theme settings**, then
   **Links**, and paste it into **Before and after video**. Save.

Skip it and the home page shows the still frame, which still looks right.

## 4. Preview and check

On the draft theme click **Preview**. Walk through:

- Home: logo, glow, the game logos scrolling.
- The header menu: Home, Utilities, About, Affiliates, Contact. All five should load.
- Utilities: the Free, Basic and Ultimate plans, and the app screenshots.
- A product such as Basic or Ultimate. **Add to cart** works.
- The cart: quantity, remove, and **Checkout** reaching Shopify checkout.
- Contact: send yourself a test message.

## 5. Publish

**Actions**, then **Publish** on the draft theme.

**To undo:** go back to **Themes**, find your old theme in the library, and click
**Publish** on it. The store returns to exactly how it was. Publishing never deletes the
previous theme.

## Notes

- The header and footer now use the theme's own navigation. If you would rather drive them
  from Shopify menus later, **Customize**, then click the header, and untick **Use the
  theme's own navigation**.
- Product, collection, cart, search, customer accounts, blog and policy pages all render
  through this theme, reading live Shopify data. No product or price is hard coded.
- Theme source is in `shopify-theme/`. After any change run `node tools/check-theme.mjs`,
  then rebuild the zip.
