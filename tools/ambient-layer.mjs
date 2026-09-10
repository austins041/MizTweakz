// Drifting ambient light layer (owner request 2026-09-10): fixed full-screen blobs behind every page,
// animated independently so the light is everywhere and never a static shape with an edge.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '../site');
const css = path.join(ROOT, 'assets/css/site.css');
const js = path.join(ROOT, 'assets/js/site.js');
let c = fs.readFileSync(css, 'utf8');
const log = [];

// 1. retire the static hero glow image (its canvas edge showed as a straight cutoff)
c = c.replace(/(\.hero-glow \{[^}]*?)background: url\(\/assets\/img\/hero-glow\.svg[^;]*;/, (m, p) => { log.push('hero-glow bg removed'); return p + 'background: none;'; });

// 2. calmer text/logo glows so the words are not the focal point
c = c.replace(/(\.hero-headline \.accent, \.text-accent \{ text-shadow: )[^}]*\}/, `$1-14px -6px 26px rgba(var(--ambient-rgb), calc(.16 * var(--glow, 1))), 20px 10px 40px rgba(var(--ambient-rgb), calc(.08 * var(--glow, 1))); }`);
c = c.replace(/(\.hero-headline > span \{ -webkit-text-stroke: 3px #000; paint-order: stroke fill; text-shadow: )[^}]*\}/, `$10 0 2px #000, -18px -8px 30px rgba(var(--ambient-rgb), calc(.18 * var(--glow, 1))), 24px 12px 46px rgba(var(--ambient-rgb), calc(.09 * var(--glow, 1))); }`);
log.push('text glows softened');

if (!c.includes('.ambient-layer')) c += `
/* ---------- drifting ambient light (owner request 2026-09-10) ----------
   A fixed layer behind every page holding six large blurred blobs. Each blob drifts on its own path and
   period, so the light is spread everywhere, moves slowly and never shows a hard edge. Alpha follows --glow. */
.ambient-layer { position: fixed; inset: -20vh -20vw; z-index: 0; pointer-events: none; overflow: hidden; contain: strict; }
.ambient-blob { position: absolute; border-radius: 50%; filter: blur(70px); will-change: transform; mix-blend-mode: screen;
  background: radial-gradient(circle at 40% 40%, rgba(var(--ambient-rgb), calc(var(--a, .18) * var(--glow, 1))) 0%, rgba(var(--ambient-rgb), calc(var(--a, .18) * .45 * var(--glow, 1))) 38%, transparent 70%); }
.ambient-blob.b1 { --a: .22; width: 58vw; height: 58vw; left: -8vw;  top: -12vh; animation: drift-a 46s ease-in-out infinite; }
.ambient-blob.b2 { --a: .16; width: 44vw; height: 44vw; left: 62vw;  top: 8vh;   animation: drift-b 58s ease-in-out infinite; }
.ambient-blob.b3 { --a: .14; width: 50vw; height: 50vw; left: 10vw;  top: 62vh;  animation: drift-c 52s ease-in-out infinite; }
.ambient-blob.b4 { --a: .20; width: 30vw; height: 30vw; left: 40vw;  top: 30vh;  animation: drift-d 39s ease-in-out infinite; }
.ambient-blob.b5 { --a: .12; width: 46vw; height: 46vw; left: 66vw;  top: 66vh;  animation: drift-a 63s ease-in-out infinite reverse; }
.ambient-blob.b6 { --a: .10; width: 26vw; height: 26vw; left: -4vw;  top: 40vh;  animation: drift-b 44s ease-in-out infinite reverse; }
@keyframes drift-a { 0% { transform: translate(0, 0) scale(1); } 30% { transform: translate(22vw, 14vh) scale(1.18); } 60% { transform: translate(6vw, 34vh) scale(.92); } 100% { transform: translate(0, 0) scale(1); } }
@keyframes drift-b { 0% { transform: translate(0, 0) scale(1); } 35% { transform: translate(-26vw, 18vh) scale(1.12); } 70% { transform: translate(-8vw, -14vh) scale(.88); } 100% { transform: translate(0, 0) scale(1); } }
@keyframes drift-c { 0% { transform: translate(0, 0) scale(1); } 25% { transform: translate(28vw, -20vh) scale(1.1); } 65% { transform: translate(40vw, 6vh) scale(1.24); } 100% { transform: translate(0, 0) scale(1); } }
@keyframes drift-d { 0% { transform: translate(0, 0) scale(1); } 40% { transform: translate(-20vw, -22vh) scale(1.3); } 75% { transform: translate(18vw, 12vh) scale(.9); } 100% { transform: translate(0, 0) scale(1); } }
.page, #site-header, #site-footer, .site-header, .footer { position: relative; z-index: 1; }
@media (max-width: 768px) { .ambient-blob { filter: blur(48px); } .ambient-blob.b5, .ambient-blob.b6 { display: none; } }
@media (prefers-reduced-motion: reduce) { .ambient-blob { animation: none !important; } }
`;
fs.writeFileSync(css, c);
log.push('ambient css added');

let j = fs.readFileSync(js, 'utf8');
if (!j.includes('ambient-layer')) {
  j = j.replace(/(\n\s*function renderHeader\(\) \{)/, `
  /* drifting ambient light behind every page (owner request 2026-09-10) */
  function renderAmbient() {
    if (document.querySelector('.ambient-layer')) return;
    var html = '<div class="ambient-layer" aria-hidden="true">' + [1, 2, 3, 4, 5, 6].map(function (i) { return '<span class="ambient-blob b' + i + '"></span>'; }).join('') + '</div>';
    document.body.insertAdjacentHTML('afterbegin', html);
  }
$1`);
  j = j.replace(/(\n\s*)renderHeader\(\);/, '$1renderAmbient();$1renderHeader();');
  log.push('ambient js added: ' + j.includes('renderAmbient();'));
}
fs.writeFileSync(js, j);
console.log(log.join(' | '));
