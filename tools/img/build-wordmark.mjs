// Trims the transparent padding off the official MIZ TWEAKZ wordmark
// (New_Project_6.png, 1200x628 RGBA) and writes alpha-preserving hero
// derivatives. Run: node build-wordmark.mjs [handoff-assets-dir]
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR = process.argv[2] || 'C:/Users/mason/Documents/Codex/2026-09-05/make/outputs/miz-claude-handoff/assets';
const OUT_DIR = path.resolve(import.meta.dirname, '../../site/assets/img/brand');
const src = path.join(SRC_DIR, 'New_Project_6.png');
await mkdir(OUT_DIR, { recursive: true });

const trimmed = sharp(src).ensureAlpha().trim({ threshold: 1 });
const meta = await trimmed.clone().toBuffer({ resolveWithObject: true });
console.log('trimmed size', meta.info.width, 'x', meta.info.height, 'channels', meta.info.channels);

const rows = [];
for (const [name, width] of [['wordmark', 900]]) {
  for (const ext of ['webp', 'png']) {
    const out = path.join(OUT_DIR, `${name}.${ext}`);
    const img = sharp(meta.data).resize({ width, withoutEnlargement: true });
    const info = ext === 'webp'
      ? await img.webp({ quality: 90, alphaQuality: 100, lossless: false }).toFile(out)
      : await img.png({ compressionLevel: 9, palette: false }).toFile(out);
    rows.push({ file: `${name}.${ext}`, w: info.width, h: info.height, bytes: info.size, channels: info.channels });
  }
}
console.table(rows);
