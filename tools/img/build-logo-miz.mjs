// Regenerates the MIZ TWEAKZ logo derivatives (header/hero/footer/favicons/OG) from the
// original storefront files in the Codex handoff. Run: node build-logo-miz.mjs [handoff-assets-dir]
import sharp from 'sharp';
import path from 'node:path';
const SRC = process.argv[2] || 'C:/Users/mason/Documents/Codex/2026-09-05/make/outputs/miz-claude-handoff/assets';
const BRAND = path.resolve(import.meta.dirname, '../../site/assets/img/brand');
const header = path.join(SRC, 'b3e68a16-b61b-477e-9066-f7e73cbdc638.png'); // header/hero source (1024x1024 RGBA)
const favicon = path.join(SRC, 'logo_4257b021-6349-4b4e-90c4-2b2ca73894b8.png'); // favicon source (same art)
const wordmark = path.join(SRC, 'New_Project_6.png');
const rows = [];
const out = async (name, info) => rows.push({ file: name, w: info.width, h: info.height, bytes: info.size, ch: info.channels });
for (const [name, size, src] of [['logo.png', 512, header], ['logo-192.png', 192, header], ['logo-96.png', 96, header],
  ['favicon-512.png', 512, favicon], ['favicon-180.png', 180, favicon], ['favicon-32.png', 32, favicon]]) {
  await out(name, await sharp(src).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(BRAND, name)));
}
await out('logo.webp', await sharp(header).resize(512, 512).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(BRAND, 'logo.webp')));
const wm = await sharp(wordmark).ensureAlpha().trim({ threshold: 1 }).resize({ width: 760, withoutEnlargement: true }).png().toBuffer({ resolveWithObject: true });
await out('og.jpg', await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#1f1f21' } })
  .composite([{ input: wm.data, left: Math.round((1200 - wm.info.width) / 2), top: Math.round((630 - wm.info.height) / 2) }])
  .jpeg({ quality: 86 }).toFile(path.join(BRAND, 'og.jpg')));
console.table(rows);
