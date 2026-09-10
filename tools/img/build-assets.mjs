#!/usr/bin/env node
/*
 * build-assets.mjs — turn the original MIZTWEAKZ storefront images into the
 * optimized derivatives the site ships under site/assets/img/brand/.
 *
 *   cd tools/img && npm install          (once — pulls sharp, Node ≥ 18)
 *   node build-assets.mjs [source-dir]   (default source = SRC_DIR below)
 *
 * Source: the read-only research handoff (asset-manifest.json lists every
 * original with its public URL). Nothing in the source folder is modified.
 * Output names are kebab-case and stable — the HTML/CSS/JS reference them.
 */
import sharp from 'sharp';
import { mkdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = 'C:/Users/mason/Documents/Codex/2026-09-05/make/outputs/miz-claude-handoff/assets';
const SRC = path.resolve(process.argv[2] || SRC_DIR);
const OUT = path.resolve(HERE, '..', '..', 'site', 'assets', 'img', 'brand');

/* original filename → role (see asset-guide.md "Key artwork mapping") */
const FILES = {
  logo: 'logo_4257b021-6349-4b4e-90c4-2b2ca73894b8.png',        // 1024×1024, favicon-grade source
  social: 'New_Project_6.png',                                    // 1200×628 social preview
  heroGif: 'ezgif.com-optimize_255f0d11-705a-4c66-8336-1a6d08a9ea37.gif', // 800×450 animated
  beforeAfter: 'b4_afer_1.png',                                   // 1280×720 ping before/after
  fortnite: 'INSTANTLY_Get_Lower_Ping_and_higher_fps_in_Fortnite_2.jpg', // 1920×1080 FPS+ping
  packs: {
    'pack-fps': 'fps_pack_1.png',
    'pack-ping': 'ping_pack_c6c5fb3d-b1a6-422b-8067-e9bb25b83ce8.png',
    'pack-delay': 'delay_pack-b8fd-4f38-befb-9a23cc929ff9.png',
    'pack-debloat': 'debloat_tool_377b240d-41e3-4e21-afb3-4465c1c375e4.png',
    'pack-ultimate': 'Ultimate_Bundle_9754c0c1-b8fd-4f38-befb-9a23cc929ff9_5.png'
  },
  creators: {
    'creator-premfn': 'channels4_profile_5.jpg',
    'creator-npen': 'zn2vTeID_400x400_d72296b6-e71d-4db9-b59e-da0aed8a5446.jpg',
    'creator-aero1x': 'channels4_profile_2dd1709f-15ce-4a81-84f7-11f38eccfea0.jpg'
  }
};

const HERO_LOOP_MAX_BYTES = 3 * 1024 * 1024;
const src = (name) => path.join(SRC, name);
const out = (name) => path.join(OUT, name);
const results = [];

async function record(name) {
  const file = out(name);
  const [meta, info] = await Promise.all([sharp(file, { pages: 1 }).metadata(), stat(file)]);
  results.push({ name, width: meta.width, height: meta.pageHeight || meta.height, bytes: info.size });
  return info.size;
}
async function write(pipeline, name) {
  await pipeline.toFile(out(name));
  return record(name);
}

/* ---- logo: the sticker is a transparent PNG (soft glow halo), so every size keeps alpha ---- */
async function buildLogo() {
  const logo = src(FILES.logo);
  await write(sharp(logo).resize(512, 512).png({ compressionLevel: 9 }), 'logo.png');
  await write(sharp(logo).resize(512, 512).webp({ quality: 85 }), 'logo.webp');
  await write(sharp(logo).resize(192, 192).png({ compressionLevel: 9 }), 'logo-192.png');
  await write(sharp(logo).resize(96, 96).png({ compressionLevel: 9 }), 'logo-96.png');
  await write(sharp(logo).resize(512, 512).png({ compressionLevel: 9 }), 'favicon-512.png');
  await write(sharp(logo).resize(180, 180).png({ compressionLevel: 9 }), 'favicon-180.png');
  await write(sharp(logo).resize(32, 32).png({ compressionLevel: 9 }), 'favicon-32.png');
}

/* ---- pack box art: keep the 2:3 ratio, no cropping ---- */
async function buildPacks() {
  for (const [name, file] of Object.entries(FILES.packs)) {
    const art = src(file);
    await write(sharp(art).resize(512, 768, { fit: 'inside' }).webp({ quality: 82 }), `${name}.webp`);
    await write(sharp(art).resize(512, 768, { fit: 'inside' }).png({ compressionLevel: 9 }), `${name}.png`);
    await write(sharp(art).resize(768, 1152, { fit: 'inside' }).webp({ quality: 82 }), `${name}-lg.webp`);
  }
}

/* ---- creator avatars: square cover crop ---- */
async function buildCreators() {
  for (const [name, file] of Object.entries(FILES.creators)) {
    await write(sharp(src(file)).resize(160, 160, { fit: 'cover' }).webp({ quality: 82 }), `${name}.webp`);
    await write(sharp(src(file)).resize(320, 320, { fit: 'cover' }).webp({ quality: 82 }), `${name}-320.webp`);
  }
}

/* ---- before/after screenshots ---- */
async function buildScreens() {
  await write(sharp(src(FILES.beforeAfter)).resize({ width: 1280 }).webp({ quality: 80 }), 'before-after.webp');
  await write(sharp(src(FILES.beforeAfter)).resize({ width: 640 }).webp({ quality: 78 }), 'before-after-640.webp');
  await write(sharp(src(FILES.fortnite)).resize({ width: 1280 }).webp({ quality: 80 }), 'fortnite-ping-fps.webp');
  await write(sharp(src(FILES.fortnite)).resize({ width: 640 }).webp({ quality: 78 }), 'fortnite-ping-fps-640.webp');
}

/* ---- animated hero loop (≤ 3 MB or it does not ship) + first-frame poster ---- */
async function buildHero() {
  const gif = src(FILES.heroGif);
  const meta = await sharp(gif, { animated: true }).metadata();
  console.log(`hero gif: ${meta.width}×${meta.pageHeight} · ${meta.pages} frames`);
  await write(sharp(gif, { pages: 1 }).resize(800, 450).webp({ quality: 82 }), 'hero-poster.webp');

  // Encode to memory first: only a loop that fits the budget is written to disk
  // (also sidesteps OneDrive holding a just-written file open on Windows).
  await unlink(out('hero-loop.webp')).catch(() => {});
  for (const quality of [60, 45]) {
    const buf = await sharp(gif, { animated: true }).resize(800, 450).webp({ quality, effort: 4 }).toBuffer();
    console.log(`hero-loop.webp @ quality ${quality}: ${(buf.length / 1024 / 1024).toFixed(2)} MB`);
    if (buf.length <= HERO_LOOP_MAX_BYTES) {
      await writeFile(out('hero-loop.webp'), buf);
      await record('hero-loop.webp');
      return true;
    }
  }
  console.log(`hero-loop.webp is over ${HERO_LOOP_MAX_BYTES / 1024 / 1024} MB even at quality 45 — NOT shipped, use hero-poster.webp only.`);
  return false;
}

/* ---- Open Graph image ---- */
async function buildOg() {
  await write(sharp(src(FILES.social)).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }), 'og.jpg');
}

function printTable() {
  const rows = results.map((r) => [r.name, `${r.width}×${r.height}`, r.bytes.toLocaleString('en-US')]);
  const w = [0, 1, 2].map((i) => Math.max(...rows.map((r) => r[i].length), ['file', 'size', 'bytes'][i].length));
  const line = (r) => `${r[0].padEnd(w[0])}  ${r[1].padEnd(w[1])}  ${r[2].padStart(w[2])}`;
  console.log('\n' + line(['file', 'size', 'bytes']));
  console.log('-'.repeat(w[0] + w[1] + w[2] + 4));
  rows.forEach((r) => console.log(line(r)));
  const total = results.reduce((s, r) => s + r.bytes, 0);
  console.log(`\n${results.length} files · ${(total / 1024 / 1024).toFixed(2)} MB total → ${OUT}`);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`source: ${SRC}\noutput: ${OUT}\n`);
  await buildLogo();
  await buildPacks();
  await buildCreators();
  await buildScreens();
  await buildOg();
  await buildHero();
  printTable();
}

main().catch((err) => { console.error(err); process.exit(1); });
