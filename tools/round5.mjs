// Owner round 5 (2026-09-09): copy and layout fixes across the site. Idempotent where practical.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '../site');
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const wr = (f, s) => fs.writeFileSync(path.join(ROOT, f), s);
const log = [];
const rep = (name, s, re, to) => { const ok = re.test(s); log.push(`${name}: ${ok ? 'ok' : 'MISSING'}`); return s.replace(re, to); };

/* ---------- index.html ---------- */
let h = rd('index.html');
h = rep('hero copy', h, /<span class="highlight">lower ping<\/span> ,\s*\n\s*tested, non-intrusive and fully reversible, so you can focus on winning\./, '<span class="highlight">lower ping</span>,\n          tested, non-intrusive and fully reversible.');
h = rep('non-intrusive', h, /Registry files and settings only\./g, 'Registry and settings changes only.');
h = rep('ping card', h, /Network registry files for a steadier connection/, 'Network registry tweaks for a steadier connection');
h = rep('instant delivery', h, /Delivered instantly via email as a downloadable file, with lifetime access to your download\./, 'Download the app, sign in and your tweaks are ready to apply in minutes.');
h = rep('cta note', h, /Instant delivery · Lifetime access · Full video tutorial included/, 'Free app · Windows 10 and 11 · Full video tutorial included');
h = rep('cta copy', h, /Grab the free tweaks, follow the step-by-step guide and join 4,000\+ players already running MIZTWEAKZ\./, 'Grab the free app, follow the step-by-step guide and join 4,000+ players already running MIZTWEAKZ.');
h = rep('free download label', h, /<span class="section-label">Free download<\/span>/, '<span class="section-label"><span class="free-word">Free download</span></span>');
h = rep('join -> utilities', h, /<a class="nice-button btn-lg" href="https:\/\/github\.com\/austins041\/MizTweakz\/releases\/latest\/download\/MizTweakz-Setup\.exe">Join 4,000\+ Active Users<\/a>/, '<a class="nice-button btn-lg" href="/utilities/">Join 4,000+ Active Users</a>');
wr('index.html', h);

/* ---------- about ---------- */
let a = rd('about/index.html');
a = rep('about registry', a, /same registry files, power settings/, 'same registry tweaks, power settings');
a = rep('about lifetime', a, /[^.>]*by email with a full video tutorial and lifetime access\. Join 4,000\+ players already run[^<]*/, 'Download the app, follow the full video tutorial and join 4,000+ players already running MIZTWEAKZ.');
a = rep('about join', a, /<a class="nice-button btn-lg" href="https:\/\/discord\.gg\/tT4HSfAWrt" target="_blank" rel="noopener">Join 4,000\+ Active Users<\/a>/, '<a class="nice-button btn-lg" href="/utilities/">Join 4,000+ Active Users</a>');
wr('about/index.html', a);

/* ---------- tos ---------- */
let t = rd('tos/index.html');
t = rep('tos files 1', t, /are delivered as files\./, 'are delivered as a downloadable app.');
t = rep('tos files 2', t, /license<\/strong> to use the files, guides and video tutorials/, 'license</strong> to use the app, guides and video tutorials');
t = rep('tos files 3', t, /publicly post the downloaded files, guides or videos/, 'publicly post the app, guides or videos');
t = rep('tos files 4', t, /including the tweak files, guides/, 'including the app, guides');
t = rep('tos lifetime', t, /\s*Lifetime access to your download applies to your[^.]*\./, '');
wr('tos/index.html', t);

/* ---------- data.js ---------- */
let d = rd('assets/js/data.js');
d = rep('data non-intrusive', d, /Registry files and settings only\./, 'Registry and settings changes only.');
d = rep('data instant delivery', d, /Delivered instantly via email as a downloadable file, with lifetime access to your download\./, 'Download the app, sign in and your tweaks are ready to apply in minutes.');
d = rep('data comment', d, /the real MizTweakz installer on GitHub releases \(1\.0\.1, 2026-09-08\)\./, 'the real MizTweakz installer.');
wr('assets/js/data.js', d);

/* ---------- utilities ---------- */
let u = rd('utilities/index.html');
u = rep('version chip', u, /\s*<span class="title-tag version-chip"[^>]*>v1\.0\.1<\/span>/, '');
u = rep('version line', u, /\s*<span[^>]*>[^<]*<\/span>\s*<span>Version 1\.0\.1, September 8, 2026, latest build<\/span>/, '');
u = u.replace(/<span>Version 1\.0\.1, September 8, 2026, latest build<\/span>/, '');
u = rep('update line', u, /The app updates itself\. It checks GitHub releases shortly after launch and every 6 hours, downloads the new build in the background and installs it when you restart\./, 'The app updates itself. It checks for a new build shortly after launch and every 6 hours, downloads it in the background and installs it when you restart.');
u = rep('all releases btn', u, /\s*<a [^>]*href="https:\/\/github\.com\/austins041\/MizTweakz\/releases"[^>]*>[\s\S]*?<\/a>/, '');
// circled block: checksum + verify + requirements. Remove from the divider before "SHA-256" to the end of the requirements list container.
const start = u.search(/<hr[^>]*>\s*(?=[\s\S]{0,400}SHA-256)/);
const reqIdx = u.indexOf('REQUIREMENTS') >= 0 ? u.indexOf('REQUIREMENTS') : u.search(/Requirements<\/h/);
if (start >= 0 && reqIdx > start) {
  // end = closing of the grid wrapper that holds both columns: find the first "</div>\n" after the last requirement <li> ... </ul></div>
  const afterReq = u.indexOf('</ul>', reqIdx);
  const closeDiv = u.indexOf('</div>', afterReq); // requirements column
  const closeGrid = u.indexOf('</div>', closeDiv + 6); // grid wrapper
  u = u.slice(0, start) + u.slice(closeGrid + 6);
  log.push('checksum+requirements block: removed');
} else log.push('checksum+requirements block: MISSING');
u = u.replace(/free tweaks/g, 'free app');
u = rep('faq update answer', u, /It checks GitHub releases[^<]*/, 'It checks for a new build shortly after launch and every 6 hours, downloads it in the background and installs it when you restart.');
// FAQ: move the refund item to the bottom
const faqItems = u.match(/\s*<div class="faq-item">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g);
const refund = (u.match(/\s*<div class="faq-item"><h3><button[^>]*>What is your refund policy\?[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/) || [])[0];
if (refund) { u = u.replace(refund, ''); u = u.replace(/(<div class="faq-item">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)(\s*<\/div>\s*<\/section>)/, (m, last, tail) => last + refund + tail); log.push('faq refund moved: ok'); } else log.push('faq refund moved: MISSING');
// coverflow: keep 1, 5, 10, 11, 12 (home, fps-boost, crosshair, potato-graphics, gaming-tweaks)
const keep = ['home', 'fps-boost', 'crosshair', 'potato-graphics', 'gaming-tweaks'];
const slides = u.match(/<figure[^>]*class="[^"]*coverflow-slide[^"]*"[\s\S]*?<\/figure>/g) || u.match(/<li[^>]*class="[^"]*coverflow-slide[^"]*"[\s\S]*?<\/li>/g) || [];
let removed = 0;
for (const s of slides) { const m = s.match(/img\/app\/([a-z-]+)\.webp/); if (m && !keep.includes(m[1])) { u = u.replace(s, ''); removed++; } }
log.push(`coverflow slides removed: ${removed} of ${slides.length}`);
u = u.replace(/Thirteen screens/g, 'Five screens').replace(/13 screens/g, '5 screens');
wr('utilities/index.html', u);

/* ---------- CSS ---------- */
let c = rd('assets/css/site.css');
if (!c.includes('black outline (owner request')) c += `
/* ---------- "Reduce Input Delay." black outline (owner request 2026-09-09) ---------- */
.hero-headline .accent { -webkit-text-stroke: 3px #000; paint-order: stroke fill; text-shadow: 0 0 2px #000, 0 0 28px rgba(var(--ambient-rgb), calc(.5 * var(--glow, 1))); }
/* results section: centred column beside the clip (owner request 2026-09-09) */
#results.two-col { align-items: center; justify-items: center; }
#results .text-col { align-items: center; text-align: center; justify-content: center; width: 100%; }
#results .feature-cards { width: 100%; text-align: left; }
/* "Free download" phrase shares the green treatment */
.section-label .free-word { font-size: inherit; }
`;
wr('assets/css/site.css', c);
let p = rd('assets/css/page-utilities.css');
p = rep('plans one row', p, /\.plans-grid \{ display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-end; gap: 20px; margin-top: 30px; \}/, '.plans-grid { display: flex; flex-wrap: nowrap; justify-content: center; align-items: stretch; gap: 20px; margin-top: 30px; } /* owner: one row, not staggered */\n.plans-grid > * { display: flex; }\n.plans-grid .plan-card { height: 100%; }');
p = rep('plan shell padding', p, /(\.plan-shell \{[^}]*?)padding: 40px 5px 5px;/, '$1padding: 5px;');
p = rep('plan tag pos', p, /\.plan-shell \.plan-tag \{ top: 12px; z-index: 1; \}/, '.plan-shell .plan-tag { top: -14px; z-index: 3; }');
if (!p.includes('plans wrap fallback')) p += `\n/* plans wrap fallback below 1000px (owner: one row on desktop) */\n@media (max-width: 999px) { .plans-grid { flex-wrap: wrap; } }\n`;
wr('assets/css/page-utilities.css', p);

console.log(log.join('\n'));
const all = ['index.html', 'about/index.html', 'utilities/index.html', 'tos/index.html', 'affiliates/index.html', 'contact/index.html', 'privacy/index.html', 'assets/js/data.js', 'assets/js/site.js'];
const left = [];
for (const f of all) { const s = rd(f); for (const [k, re] of [['GitHub', /github/i], ['lifetime', /lifetime/i], ['1.0.1', /1\.0\.1/], ['winning', /winning/i], ['downloadable file', /downloadable file/i]]) { const m = s.match(re); if (m) left.push(`${f}: ${k}`); } }
console.log('LEFTOVERS (visible or href):', left.length ? left.join(' | ') : 'none');
