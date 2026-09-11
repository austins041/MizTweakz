// Repair the home page's before/after media block.
//
// Two problems: a quoting slip left the Liquid as {{ finished-product-poster.webp | asset_url }}
// with no quotes, which renders an empty src; and the clip did not play at all because
// Shopify will not host the MP4 inside a theme. Both are fixed here: the animated WebP
// ships as a theme asset and plays by itself, with the still frame served to anyone who
// asks for reduced motion, and the MP4 remains an optional upgrade via a theme setting.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const tpl = path.join(ROOT, 'shopify-theme/templates/index.liquid');
let s = fs.readFileSync(tpl, 'utf8');

const ALT = 'Before and after gameplay comparison: 113 FPS with 5 ms input delay before, 367 FPS with 0 ms after';
const Q = String.fromCharCode(39); // single quote, kept out of the literal to avoid escaping mistakes

const block = [
  '{%- if settings.results_video_url != blank -%}',
  '        <video class="results-video" width="1280" height="720" autoplay muted loop playsinline preload="metadata" poster="{{ ' + Q + 'finished-product-poster.webp' + Q + ' | asset_url }}" aria-label="' + ALT + '">',
  '          <source src="{{ settings.results_video_url }}" type="video/mp4">',
  '          <img src="{{ ' + Q + 'finished-product.webp' + Q + ' | asset_url }}" width="1280" height="720" alt="' + ALT + '" loading="lazy">',
  '        </video>',
  '      {%- else -%}',
  '        <picture>',
  '          <source media="(prefers-reduced-motion: reduce)" srcset="{{ ' + Q + 'finished-product-poster.webp' + Q + ' | asset_url }}">',
  '          <img class="results-video" src="{{ ' + Q + 'finished-product.webp' + Q + ' | asset_url }}" width="1280" height="720" alt="' + ALT + '" loading="lazy" decoding="async">',
  '        </picture>',
  '      {%- endif -%}',
].join('\n');

// replace from the opening if through its endif, whatever shape it is in now
const start = s.indexOf('{%- if settings.results_video_url');
if (start === -1) { console.error('results block not found'); process.exit(1); }
const endTok = '{%- endif -%}';
const end = s.indexOf(endTok, start) + endTok.length;
s = s.slice(0, start) + block + s.slice(end);
fs.writeFileSync(tpl, s);

const unquoted = (s.match(/\{\{\s*[a-z0-9-]+\.(webp|png|jpg|svg|mp4)\s*\|/gi) || []);
console.log('block replaced');
console.log('unquoted asset references left:', unquoted.length, unquoted.join(', '));

// the setting is now an optional upgrade, so say so
const sp = path.join(ROOT, 'shopify-theme/config/settings_schema.json');
const j = JSON.parse(fs.readFileSync(sp, 'utf8'));
for (const group of j) {
  for (const setting of group.settings || []) {
    if (setting.id === 'results_video_url') {
      setting.label = 'Before and after video (optional)';
      setting.info = 'The clip already plays on the home page as an animated image, so this is optional. For full video quality, upload the MP4 under Settings then Files, copy its URL and paste it here.';
    }
  }
}
fs.writeFileSync(sp, JSON.stringify(j, null, 2) + '\n');
console.log('setting relabelled as optional');
