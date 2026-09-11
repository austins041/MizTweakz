// The before/after clip, for a Shopify theme.
//
// Shopify rejects .mp4 as a theme asset, but it accepts .webp, and an animated
// WebP plays on its own in an <img>. So the clip ships inside the theme as an
// animated WebP and needs no setup. The MP4 stays available as an optional
// upgrade through a theme setting for anyone who wants full quality.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve(import.meta.dirname, '../tools/img/package.json'));
const ffmpeg = require('ffmpeg-static');
const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'theme-extras/finished-product.mp4');
const OUT = path.join(ROOT, 'shopify-theme/assets/finished-product.webp');

if (!fs.existsSync(SRC)) { console.error('source missing:', SRC); process.exit(1); }

// Try progressively smaller/cheaper encodes until it fits comfortably in a theme asset.
const attempts = [
  { w: 960, q: 55, fps: 20 },
  { w: 854, q: 45, fps: 18 },
  { w: 720, q: 40, fps: 15 },
];
const LIMIT = 4 * 1024 * 1024;
let chosen = null;

for (const a of attempts) {
  execFileSync(ffmpeg, [
    '-y', '-loglevel', 'error', '-i', SRC,
    '-vf', `fps=${a.fps},scale=${a.w}:-2:flags=lanczos`,
    '-loop', '0', '-an', '-vsync', '0',
    '-c:v', 'libwebp', '-quality', String(a.q), '-compression_level', '5',
    OUT,
  ]);
  const size = fs.statSync(OUT).size;
  console.log(`${a.w}px q${a.q} ${a.fps}fps -> ${(size / 1048576).toFixed(2)} MB`);
  chosen = { ...a, size };
  if (size <= LIMIT) break;
}

if (chosen.size > LIMIT) {
  console.error('still too large for a theme asset; keeping the still frame instead');
  fs.unlinkSync(OUT);
  process.exit(2);
}
console.log('wrote', path.relative(ROOT, OUT), `(${(chosen.size / 1048576).toFixed(2)} MB)`);
