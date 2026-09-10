// Match Paragon's background exactly, in our colours (owner request 2026-09-10):
// body colour + one fixed full-screen texture (two faint soft glows at the left and right edges, fine grain),
// a single 50px drop-shadow on the hero logo, no glow on text, no moving light.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '../site');
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const wr = (f, s) => fs.writeFileSync(path.join(ROOT, f), s);
const log = [];

/* ---- textures: Paragon's main.jpg has a large faint glow on the left edge and a smaller one on the right, on near-black ---- */
const texture = (leftA, rightA) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 1824" width="2048" height="1824" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <!-- Paragon-style fixed page texture in our colours: two faint edge glows on the dark base, plus fine grain. -->
  <defs>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="150"/></filter>
    <filter id="noise" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0"/>
    </filter>
  </defs>
  <rect width="2048" height="1824" fill="#1f1f21"/>
  <ellipse cx="90" cy="880" rx="520" ry="620" fill="#e6e6ec" fill-opacity="${leftA}" filter="url(#blur)"/>
  <ellipse cx="2010" cy="1000" rx="300" ry="520" fill="#e6e6ec" fill-opacity="${rightA}" filter="url(#blur)"/>
  <rect width="2048" height="1824" filter="url(#noise)"/>
</svg>
`;
wr('assets/img/texture.svg', texture('.11', '.07'));
wr('assets/img/texture-mobile.svg', texture('.06', '.04'));
log.push('textures rewritten');

/* ---- CSS ---- */
let c = rd('assets/css/site.css');
// remove the drifting layer + dark pockets blocks and their keyframes
c = c.replace(/\n\/\* -{10} drifting ambient light[\s\S]*?@media \(prefers-reduced-motion: reduce\) \{ \.ambient-blob \{ animation: none !important; \} \}\n/, '\n');
c = c.replace(/\n\/\* dark pockets:[\s\S]*?\.ambient-blob\.d3, \.ambient-blob\.d4 \{ display: none; \} \}\n/, '\n');
log.push('ambient layer css removed: ' + !c.includes('.ambient-blob'));
// body: colour only; the texture moves to a fixed ::before exactly like Paragon's body:before
c = c.replace(/background: #1f1f21 url\(\/assets\/img\/texture\.svg[^)]*\) center \/ cover no-repeat;/, 'background: #1f1f21;');
if (!c.includes('body::before {')) c = c.replace(/(\nbody \{[^}]*\}\n)/, `$1body::before { content: ""; position: fixed; inset: 0; z-index: -1; background: url(/assets/img/texture.svg?v=20260909f) center / cover no-repeat; pointer-events: none; } /* Paragon body:before */\n`);
c = c.replace(/body \{ background-image: url\(\/assets\/img\/texture-mobile\.svg[^)]*\); \}/, 'body::before { background-image: url(/assets/img/texture-mobile.svg?v=20260909f); }');
log.push('body texture -> fixed ::before: ' + c.includes('body::before {'));
// logo: Paragon's single 50px shadow, same in the final state
c = c.replace(/(\.logo-icon \{[^}]*?)filter: drop-shadow\([^;]*;/, '$1filter: drop-shadow(0 0 50px rgba(var(--ambient-rgb), calc(.35 * var(--glow, 1))));');
c = c.replace(/(\.logo-showcase\.transitioning \.logo-icon, \.logo-showcase\.final \.logo-icon \{ transform: none; )filter: drop-shadow\([^;]*;/, '$1filter: drop-shadow(0 0 50px rgba(var(--ambient-rgb), calc(.35 * var(--glow, 1))));');
// text: Paragon has no glow on the headline; keep the owner's black stroke
c = c.replace(/(\.hero-headline \.accent, \.text-accent \{ text-shadow: )[^}]*\}/, '$1none; }');
c = c.replace(/(\.hero-headline > span \{ -webkit-text-stroke: 3px #000; paint-order: stroke fill; text-shadow: )[^}]*\}/, '$10 0 2px #000; }');
// the old hero-glow element stays empty
c = c.replace(/(\.hero-glow \{[^}]*?)background: [^;]*;/, '$1background: none;');
wr('assets/css/site.css', c);
log.push('logo/text rules set');

/* ---- JS: stop injecting the drifting layer ---- */
let j = rd('assets/js/site.js');
j = j.replace(/\n\s*\/\* drifting ambient light behind every page[^\n]*\n\s*function renderAmbient\(\) \{[\s\S]*?\n  \}\n/, '\n');
j = j.replace(/\n(\s*)renderAmbient\(\);/, '');
wr('assets/js/site.js', j);
log.push('ambient js removed: ' + !j.includes('renderAmbient'));
console.log(log.join('\n'));
