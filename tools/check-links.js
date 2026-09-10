#!/usr/bin/env node
/*
 * check-links.js — static link / asset / meta audit for the MIZTWEAKZ site.
 *
 *   node tools/check-links.js            (run from the repo root, or anywhere)
 *
 * Scans every .html file under site/ plus the root-relative hrefs/srcs embedded
 * in site/assets/js/data.js and site/assets/js/site.js, and reports:
 *   - root-relative href/src values that do not resolve to a file under site/
 *     (/foo/ -> site/foo/index.html ; /foo -> site/foo.html or site/foo/index.html)
 *   - every external URL (listed, not fetched)
 *   - <img> tags missing width or height attributes
 *   - pages missing <title> or <meta name="description">
 * Exit code 1 when any broken link, dimensionless image or missing meta is found.
 * Uses only the Node standard library.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const JS_FILES = ['assets/js/data.js', 'assets/js/site.js'].map((p) => path.join(SITE, p));

/* ---------- helpers ---------- */
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) out.push(full);
  }
  return out;
}
function rel(file) { return path.relative(ROOT, file).split(path.sep).join('/'); }
function lineOf(text, index) { return text.slice(0, index).split('\n').length; }
function isFile(p) { try { return fs.statSync(p).isFile(); } catch (e) { return false; } }

/* Root-relative path -> does it resolve under site/? */
function resolveRootRelative(url) {
  const clean = url.split('#')[0].split('?')[0];
  if (clean === '/' || clean === '') return isFile(path.join(SITE, 'index.html'));
  const parts = clean.split('/').filter(Boolean);
  const base = path.join(SITE, ...parts);
  if (clean.endsWith('/')) return isFile(path.join(base, 'index.html'));
  if (isFile(base)) return true;                        // /assets/css/site.css, /foo.html
  if (isFile(base + '.html')) return true;               // /foo -> site/foo.html
  return isFile(path.join(base, 'index.html'));          // /foo -> site/foo/index.html
}

function classify(url) {
  const u = url.trim();
  if (!u) return 'empty';
  if (/^(https?:)?\/\//i.test(u)) return 'external';
  if (/^(mailto|tel|sms|javascript|data|blob):/i.test(u)) return 'scheme';
  if (u.startsWith('#')) return 'hash';
  if (u.startsWith('/')) return 'root';
  return 'relative';
}

/* ---------- collect ---------- */
const broken = [];       // { file, line, url }
const relative = [];     // non-root-relative paths (the site rule is root-relative only)
const external = new Map(); // url -> [file:line]
const imgNoDims = [];    // { file, line, tag }
const missingMeta = [];  // { file, problems[] }

function addExternal(url, where) {
  const clean = url.replace(/&amp;/g, '&');
  if (!external.has(clean)) external.set(clean, []);
  external.get(clean).push(where);
}

const seenUrl = new Set();
const dynamic = [];      // values built by JS string concatenation ('/img/' + x + '.svg') — cannot be checked statically
function checkUrl(url, file, line) {
  const kind = classify(url);
  const where = `${rel(file)}:${line}`;
  if (seenUrl.has(`${where}|${url}`)) return;   // same value matched twice on one line (JS scans)
  seenUrl.add(`${where}|${url}`);
  if (/['"]\s*\+|\+\s*['"]|\$\{/.test(url)) { dynamic.push({ file, line, url }); return; }
  if (kind === 'external') addExternal(url, where);
  else if (kind === 'root' && !resolveRootRelative(url)) broken.push({ file, line, url });
  else if (kind === 'relative') relative.push({ file, line, url });
}

/* HTML files */
const htmlFiles = walk(SITE);
for (const file of htmlFiles) {
  const text = fs.readFileSync(file, 'utf8');

  // href/src attributes (single or double quoted)
  const attrRe = /\b(href|src|poster|content)\s*=\s*("([^"]*)"|'([^']*)')/gi;
  let m;
  while ((m = attrRe.exec(text))) {
    const attr = m[1].toLowerCase();
    const value = m[3] !== undefined ? m[3] : m[4];
    if (attr === 'content') {                    // only meta og:image / url style values
      if (/^https?:\/\//i.test(value) || value.startsWith('/')) {
        const tagStart = text.lastIndexOf('<', m.index);
        const tag = text.slice(tagStart, m.index);
        if (!/og:(image|url)|twitter:image/i.test(tag)) continue;
      } else continue;
    }
    checkUrl(value, file, lineOf(text, m.index));
  }

  // CSS url() inside inline styles / <style>
  const cssUrlRe = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
  while ((m = cssUrlRe.exec(text))) checkUrl(m[1], file, lineOf(text, m.index));

  // <img> without width/height
  const imgRe = /<img\b[^>]*>/gi;
  while ((m = imgRe.exec(text))) {
    const tag = m[0];
    const hasW = /\bwidth\s*=/i.test(tag), hasH = /\bheight\s*=/i.test(tag);
    if (!hasW || !hasH) imgNoDims.push({ file, line: lineOf(text, m.index), tag: tag.replace(/\s+/g, ' ').slice(0, 120) });
  }

  // <title> + meta description
  const problems = [];
  const titleMatch = text.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) problems.push('missing <title>');
  const descMatch = text.match(/<meta\s+[^>]*name\s*=\s*["']description["'][^>]*>/i);
  if (!descMatch) problems.push('missing <meta name="description">');
  else if (!/content\s*=\s*["'][^"']+["']/i.test(descMatch[0])) problems.push('empty meta description');
  if (problems.length) missingMeta.push({ file, problems });
}

/* JS files: string literals that look like hrefs / srcs */
for (const file of JS_FILES) {
  if (!isFile(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  // href="..." / src="..." inside template strings, plus bare URL-ish string literals
  const jsAttrRe = /\b(href|src)\s*=\s*\\?["']([^"'\\]+)\\?["']/gi;
  let m;
  const seen = new Set();
  while ((m = jsAttrRe.exec(text))) {
    const key = `${m.index}:${m[2]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    checkUrl(m[2], file, lineOf(text, m.index));
  }
  const litRe = /(['"])((?:https?:\/\/|\/)[^'"\s]+)\1/g;
  while ((m = litRe.exec(text))) {
    const value = m[2];
    if (/^\/[a-z0-9_\-./#?=&%]*$/i.test(value) || /^https?:\/\//i.test(value)) {
      // skip regex-looking or pure-directory prefixes like '/assets/img/' (data.js IMG base)
      if (value === '/' || /\/$/.test(value) && !/^\/[a-z0-9-]+\/$/i.test(value)) continue;
      checkUrl(value, file, lineOf(text, m.index));
    }
  }
}

/* ---------- report ---------- */
const out = [];
out.push(`Scanned ${htmlFiles.length} HTML file(s) under site/ + ${JS_FILES.filter(isFile).length} JS file(s).`);
out.push('');

out.push(`BROKEN root-relative links: ${broken.length}`);
for (const b of broken) out.push(`  ${rel(b.file)}:${b.line}  ${b.url}`);
out.push('');

if (relative.length) {
  out.push(`NON-root-relative paths (site rule is root-relative only): ${relative.length}`);
  for (const r of relative) out.push(`  ${rel(r.file)}:${r.line}  ${r.url}`);
  out.push('');
}

if (dynamic.length) {
  out.push(`Dynamic (JS-built) URLs skipped — verify by hand: ${dynamic.length}`);
  for (const d of dynamic) out.push(`  ${rel(d.file)}:${d.line}  ${d.url}`);
  out.push('');
}

out.push(`<img> missing width/height: ${imgNoDims.length}`);
for (const i of imgNoDims) out.push(`  ${rel(i.file)}:${i.line}  ${i.tag}`);
out.push('');

out.push(`Pages missing <title> / meta description: ${missingMeta.length}`);
for (const p of missingMeta) out.push(`  ${rel(p.file)}  ${p.problems.join(', ')}`);
out.push('');

out.push(`External URLs (${external.size}, not fetched):`);
for (const [url, places] of [...external.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  out.push(`  ${url}`);
  out.push(`      ${places.slice(0, 4).join('  ')}${places.length > 4 ? `  (+${places.length - 4} more)` : ''}`);
}

console.log(out.join('\n'));
process.exit(broken.length || imgNoDims.length || missingMeta.length ? 1 : 0);
