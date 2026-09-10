// Rasterizes the owner's "M" tile mark (site/assets/img/brand/logo-m-tile.svg) into every
// logo/favicon/OG derivative the site references. Run: node build-logo-m.mjs
import sharp from 'sharp';
import path from 'node:path';
const BRAND = path.resolve(import.meta.dirname, '../../site/assets/img/brand');
const svg = path.join(BRAND, 'logo-m-tile.svg');
const jobs = [
  ['logo.png', 512], ['logo.webp', 512], ['logo-192.png', 192], ['logo-96.png', 96],
  ['favicon-512.png', 512], ['favicon-180.png', 180], ['favicon-32.png', 32],
];
const rows = [];
for (const [name, size] of jobs) {
  const img = sharp(svg, { density: 384 }).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
  const info = name.endsWith('.webp')
    ? await img.webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(BRAND, name))
    : await img.png({ compressionLevel: 9 }).toFile(path.join(BRAND, name));
  rows.push({ file: name, w: info.width, h: info.height, bytes: info.size, channels: info.channels });
}
// Open Graph card: tile centred on the site background.
const tile = await sharp(svg, { density: 384 }).resize(420, 420).png().toBuffer();
const og = await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#1f1f21' } })
  .composite([{ input: tile, left: 390, top: 105 }])
  .jpeg({ quality: 86 }).toFile(path.join(BRAND, 'og.jpg'));
rows.push({ file: 'og.jpg', w: og.width, h: og.height, bytes: og.size, channels: og.channels });
console.table(rows);
