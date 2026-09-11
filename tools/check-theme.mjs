#!/usr/bin/env node
/* =========================================================================
   check-theme.mjs

   Local validator for shopify-theme/. There is no Shopify auth in this
   environment, so nothing can be previewed or pushed; this script is the
   substitute. It reports:

     a. required files present
     b. every .json file parses
     c. every {% schema %} body is valid JSON
     d. Liquid block tags are balanced per file
     e. every 'file' | asset_url reference resolves to a file in assets/
     f. leftover static-site strings (/assets/img/ or a ?v= cache buster)
     g. node --check on assets/site.js and assets/data.js

   Usage:  node tools/check-theme.mjs [themeDir]
   Exits non-zero when anything is reported.
   ========================================================================= */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THEME = path.resolve(process.argv[2] || path.join(__dirname, '..', 'shopify-theme'));

const REQUIRED = [
  'layout/theme.liquid',
  'config/settings_schema.json',
  'config/settings_data.json',
  'locales/en.default.json',
  'sections/header.liquid',
  'sections/footer.liquid',
  'templates/index.liquid',
  'assets/site.css.liquid',
  'assets/site.js',
  'assets/data.js',
];

/* Liquid block tags that must be closed. `comment` is handled first and stripped. */
const BLOCK_TAGS = [
  'if',
  'for',
  'case',
  'form',
  'schema',
  'comment',
  'paginate',
  'capture',
  'unless',
  'style',
  'javascript',
  'stylesheet',
  'tablerow',
  'raw',
];

/* Directories whose text content is scanned. THEME-NOTES.md is excluded on
   purpose: it documents the old /assets/img/ paths it replaced. */
const SCAN_DIRS = ['layout', 'sections', 'snippets', 'templates', 'config', 'locales', 'assets'];
const TEXT_EXT = new Set(['.liquid', '.json', '.js', '.css', '.svg']);

const findings = [];
const notes = [];
function fail(file, msg) {
  findings.push(`${file}: ${msg}`);
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const rel = (p) => path.relative(THEME, p).split(path.sep).join('/');

/* ---------- collect ---------- */
if (!fs.existsSync(THEME)) {
  console.error(`Theme folder not found: ${THEME}`);
  process.exit(1);
}
const allFiles = walk(THEME);
const textFiles = allFiles.filter((f) => {
  const r = rel(f);
  return SCAN_DIRS.includes(r.split('/')[0]) && TEXT_EXT.has(path.extname(f));
});
const assetNames = new Set(
  fs.existsSync(path.join(THEME, 'assets')) ? fs.readdirSync(path.join(THEME, 'assets')) : []
);

/* ---------- a. required files ---------- */
for (const r of REQUIRED) {
  if (!fs.existsSync(path.join(THEME, r))) fail(r, 'required file is missing');
}
for (const key of ['content_for_header', 'content_for_layout']) {
  const layout = path.join(THEME, 'layout/theme.liquid');
  if (fs.existsSync(layout) && !fs.readFileSync(layout, 'utf8').includes(`{{ ${key} }}`)) {
    fail('layout/theme.liquid', `must output {{ ${key} }}`);
  }
}

/* ---------- helpers ---------- */
function stripComments(src) {
  // remove {% comment %}...{% endcomment %} and {% raw %}...{% endraw %} bodies
  return src
    .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, ' ')
    .replace(/\{%-?\s*raw\s*-?%\}[\s\S]*?\{%-?\s*endraw\s*-?%\}/g, ' ');
}

function countTag(src, name) {
  const open = src.match(new RegExp(`\\{%-?\\s*${name}\\b`, 'g')) || [];
  const close = src.match(new RegExp(`\\{%-?\\s*end${name}\\b`, 'g')) || [];
  return [open.length, close.length];
}

/* ---------- b. json parses ---------- */
for (const file of allFiles.filter((f) => path.extname(f) === '.json')) {
  try {
    JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    fail(rel(file), `invalid JSON: ${err.message}`);
  }
}

/* ---------- c + d + e + f: per liquid/text file ---------- */
for (const file of textFiles) {
  const r = rel(file);
  const src = fs.readFileSync(file, 'utf8');
  /* {% comment %} bodies are documentation, so they are exempt from the leftover-string scan */
  const scanned = path.extname(file) === '.liquid' ? stripComments(src) : src;

  if (path.extname(file) === '.liquid') {
    // d. tag balance (comment/raw counted on the raw source, everything else after stripping them)
    const [cOpen, cClose] = countTag(src, 'comment');
    if (cOpen !== cClose) fail(r, `unbalanced comment/endcomment (${cOpen} open, ${cClose} close)`);

    const body = stripComments(src);
    for (const tag of BLOCK_TAGS) {
      if (tag === 'comment' || tag === 'raw') continue;
      const [open, close] = countTag(body, tag);
      if (open !== close) fail(r, `unbalanced ${tag}/end${tag} (${open} open, ${close} close)`);
    }

    // no {{ }} inside {% %}
    const bad = body.match(/\{%[^%}]*\{\{/g);
    if (bad) fail(r, `output tag {{ }} inside a {% %} tag: ${bad[0].trim()}`);

    // c. schema json
    const schema = body.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
    if (schema) {
      try {
        const parsed = JSON.parse(schema[1]);
        if (!parsed.name) fail(r, 'schema has no "name"');
      } catch (err) {
        fail(r, `schema is not valid JSON: ${err.message}`);
      }
    }
  }

  // e. asset_url targets
  const assetRefs = src.matchAll(/['"]([^'"\n]+?)['"]\s*\|\s*asset_(?:url|img_url)/g);
  for (const m of assetRefs) {
    const name = m[1];
    if (!assetNames.has(name) && !assetNames.has(`${name}.liquid`)) {
      fail(r, `asset_url references a missing asset: ${name}`);
    }
  }

  // f. leftovers from the static site
  if (scanned.includes('/assets/img/')) fail(r, 'leftover static-site path "/assets/img/"');
  if (/\?v=/.test(scanned)) fail(r, 'leftover cache-busting query "?v="');
}

/* ---------- g. javascript syntax ---------- */
for (const js of ['assets/site.js', 'assets/data.js']) {
  const full = path.join(THEME, js);
  if (!fs.existsSync(full)) continue;
  try {
    execFileSync(process.execPath, ['--check', full], { stdio: 'pipe' });
    notes.push(`node --check ${js}: ok`);
  } catch (err) {
    fail(js, `node --check failed: ${String(err.stderr || err.message).split('\n')[0]}`);
  }
}

/* ---------- unreferenced assets (informational) ---------- */
const referenced = new Set();
for (const file of textFiles) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/['"]([^'"\n]+?)['"]\s*\|\s*asset_(?:url|img_url)/g)) referenced.add(m[1]);
}
const jsOnly = new Set(['site.js', 'data.js', 'site.css.liquid']);
const unreferenced = [...assetNames].filter(
  (a) => !referenced.has(a) && !referenced.has(a.replace(/\.liquid$/, '')) && !jsOnly.has(a)
);

/* ---------- report ---------- */
console.log(`Theme: ${THEME}`);
console.log(`Files: ${allFiles.length} (${assetNames.size} assets, ${textFiles.length} scanned)`);
for (const n of notes) console.log(`  ok   ${n}`);
if (unreferenced.length) {
  console.log(
    `  note ${unreferenced.length} asset(s) not referenced from Liquid (data.js builds those URLs at runtime): ${unreferenced.join(', ')}`
  );
}
if (findings.length) {
  console.log(`\n${findings.length} finding(s):`);
  for (const f of findings) console.log(`  FAIL ${f}`);
  process.exit(1);
}
console.log('\nAll checks passed.');
