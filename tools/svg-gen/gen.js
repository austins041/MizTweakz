/* One-off generator for the MIZTWEAKZ SVG assets.
   Converts Oswald Bold text to <path> data so the brand font renders even
   inside <img> (which cannot load web fonts). Output is plain static SVG. */
const opentype = require('opentype.js');
const fs = require('fs');
const path = require('path');

const font = opentype.loadSync(path.join(__dirname, 'Oswald-Bold.ttf'));
const OUT = 'C:/Users/mason/OneDrive/Documents/MissTweaks-Redesign/site/assets/img';

const LIME = '#e3fc02', CYAN = '#00fced', BG = '#1f1f21', SURF = '#2b2b2e', OFF = '#f8f8f6', INK = '#171b1c', MUTED = '#8f8f90';

function round(n) { return Math.round(n * 100) / 100; }

// Build a path for `text`, optionally transformed by fn(x,y)->[x,y]. Returns {d, bbox, width}
function textPath(text, x, y, size, opts = {}, fn) {
  const o = Object.assign({ kerning: true }, opts);
  const width = font.getAdvanceWidth(text, size, o);
  const p = font.getPath(text, x, y, size, o);
  if (fn) {
    p.commands.forEach(c => {
      if (c.x !== undefined) { const [nx, ny] = fn(c.x, c.y); c.x = nx; c.y = ny; }
      if (c.x1 !== undefined) { const [nx, ny] = fn(c.x1, c.y1); c.x1 = nx; c.y1 = ny; }
      if (c.x2 !== undefined) { const [nx, ny] = fn(c.x2, c.y2); c.x2 = nx; c.y2 = ny; }
    });
  }
  return { d: p.toPathData(2), bbox: p.getBoundingBox(), width };
}
// Centered text at cx (baseline y)
function centered(text, cx, y, size, opts = {}, fn) {
  const w = font.getAdvanceWidth(text, size, Object.assign({ kerning: true }, opts));
  return textPath(text, cx - w / 2, y, size, opts, fn);
}
// Skew + rotate transform around a pivot
function skewRot(skewDeg, rotDeg, px, py) {
  const t = Math.tan(skewDeg * Math.PI / 180), r = rotDeg * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r);
  return (x, y) => {
    let dx = x - px, dy = y - py;
    dx = dx + dy * t;                  // skewX
    const rx = dx * cs - dy * sn, ry = dx * sn + dy * cs; // rotate
    return [rx + px, ry + py];
  };
}
function write(name, svg) {
  fs.writeFileSync(path.join(OUT, name), svg.trim() + '\n');
  console.log('wrote', name, (svg.length / 1024).toFixed(1) + 'kb');
}
const SVG = (vb, w, h, body, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}" ${extra}>\n${body}\n</svg>`;

/* ---------------- logo-mark.svg ---------------- */
(function () {
  const fn = skewRot(-12, -6, 100, 100);
  const mz = centered('MZ', 100, 100, 108, { letterSpacing: -0.03 }, fn);
  // vertically center: shift so bbox center = 100
  const cy = (mz.bbox.y1 + mz.bbox.y2) / 2, cx = (mz.bbox.x1 + mz.bbox.x2) / 2;
  const shift = `translate(${round(100 - cx)} ${round(100 - cy)})`;
  write('logo-mark.svg', SVG('0 0 200 200', 200, 200, `
  <title>MIZTWEAKZ</title>
  <circle cx="100" cy="100" r="95" fill="${INK}"/>
  <circle cx="100" cy="100" r="95" fill="none" stroke="${OFF}" stroke-width="6"/>
  <circle cx="100" cy="100" r="82" fill="none" stroke="${OFF}" stroke-opacity=".16" stroke-width="2"/>
  <g transform="${shift}" stroke-linejoin="round">
    <path d="${mz.d}" fill="none" stroke="${INK}" stroke-width="22"/>
    <path d="${mz.d}" fill="none" stroke="${OFF}" stroke-width="11"/>
    <path d="${mz.d}" fill="${INK}"/>
  </g>`, 'role="img" aria-label="MIZTWEAKZ"'));
})();

/* ---------------- favicon.svg ---------------- */
(function () {
  const fn = skewRot(-12, -6, 32, 32);
  const mz = centered('MZ', 32, 32, 36, { letterSpacing: -0.03 }, fn);
  const cy = (mz.bbox.y1 + mz.bbox.y2) / 2, cx = (mz.bbox.x1 + mz.bbox.x2) / 2;
  write('favicon.svg', SVG('0 0 64 64', 64, 64, `
  <circle cx="32" cy="32" r="31" fill="${BG}"/>
  <circle cx="32" cy="32" r="30" fill="none" stroke="${LIME}" stroke-width="3"/>
  <path d="${mz.d}" transform="translate(${round(32 - cx)} ${round(32 - cy)})" fill="${LIME}"/>`));
})();

/* ---------------- logo-wordmark.svg ---------------- */
(function () {
  const fn = skewRot(-12, -5, 280, 150);
  const miz = textPath('MIZ', 235, 150, 168, { letterSpacing: -0.02 }, fn);
  const twk = textPath('TWEAKZ', 40, 282, 138, { letterSpacing: -0.01 }, fn);
  const x1 = Math.min(miz.bbox.x1, twk.bbox.x1) - 26, y1 = Math.min(miz.bbox.y1, twk.bbox.y1) - 26;
  const x2 = Math.max(miz.bbox.x2, twk.bbox.x2) + 26, y2 = Math.max(miz.bbox.y2, twk.bbox.y2) + 26;
  const W = round(x2 - x1), H = round(y2 - y1);
  const d = miz.d + ' ' + twk.d;
  // Z spike flourish: a small triangle rising off the top-right of the MIZ line
  const sx = miz.bbox.x2, sy = miz.bbox.y1;
  write('logo-wordmark.svg', SVG(`${round(x1)} ${round(y1)} ${W} ${H}`, Math.round(W), Math.round(H), `
  <title>MIZ TWEAKZ</title>
  <g stroke-linejoin="round" stroke-linecap="round">
    <path d="${d}" fill="none" stroke="${INK}" stroke-width="30"/>
    <path d="${d}" fill="none" stroke="${OFF}" stroke-width="14"/>
    <path d="${d}" fill="${INK}"/>
    <path d="M${round(sx - 30)} ${round(sy + 8)} L${round(sx + 6)} ${round(sy - 34)} L${round(sx + 10)} ${round(sy + 10)} Z" fill="${OFF}" stroke="${INK}" stroke-width="6"/>
  </g>`, 'role="img" aria-label="MIZ TWEAKZ"'));
})();

/* ---------------- hero-glow.svg ---------------- */
write('hero-glow.svg', SVG('0 0 800 800', 800, 800, `
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${LIME}" stop-opacity=".34"/>
      <stop offset=".45" stop-color="${LIME}" stop-opacity=".10"/>
      <stop offset="1" stop-color="${LIME}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="c" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${CYAN}" stop-opacity=".16"/>
      <stop offset="1" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="400" cy="400" r="400" fill="url(#g)"/>
  <circle cx="520" cy="470" r="260" fill="url(#c)"/>`, 'aria-hidden="true"'));

/* ---------------- texture.svg ---------------- */
write('texture.svg', SVG('0 0 1600 1000', 1600, 1000, `
  <defs>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0v48" fill="none" stroke="#ffffff" stroke-opacity=".035" stroke-width="1"/>
    </pattern>
    <radialGradient id="l" cx="14%" cy="8%" r="55%">
      <stop offset="0" stop-color="${LIME}" stop-opacity=".09"/>
      <stop offset="1" stop-color="${LIME}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="c" cx="88%" cy="92%" r="55%">
      <stop offset="0" stop-color="${CYAN}" stop-opacity=".07"/>
      <stop offset="1" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
    <filter id="noise" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/>
    </filter>
  </defs>
  <rect width="1600" height="1000" fill="${BG}"/>
  <rect width="1600" height="1000" fill="url(#grid)"/>
  <rect width="1600" height="1000" fill="url(#l)"/>
  <rect width="1600" height="1000" fill="url(#c)"/>
  <rect width="1600" height="1000" filter="url(#noise)"/>`, 'preserveAspectRatio="xMidYMid slice" aria-hidden="true"'));

/* ---------------- pack box art ---------------- */
const ICONS = {
  gauge: `<path d="M18 74a36 36 0 1 1 64 0" fill="none" stroke="COL" stroke-width="7" stroke-linecap="round"/>
          <path d="M26 66l6-3M50 34v6M74 66l-6-3M33 45l4 4M67 45l-4 4" stroke="COL" stroke-width="4" stroke-linecap="round"/>
          <path d="M50 74L70 44" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="74" r="6" fill="#fff"/>`,
  signal: `<rect x="12" y="66" width="14" height="20" rx="3" fill="COL"/><rect x="32" y="50" width="14" height="36" rx="3" fill="COL"/>
           <rect x="52" y="32" width="14" height="54" rx="3" fill="COL"/><rect x="72" y="14" width="14" height="72" rx="3" fill="COL" fill-opacity=".45"/>`,
  bolt: `<path d="M56 6L22 56h24l-6 38 38-54H54l6-34z" fill="COL" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linejoin="round"/>`,
  broom: `<path d="M84 10L46 50" stroke="COL" stroke-width="9" stroke-linecap="round"/>
          <path d="M46 50l-12-8-22 22 24 24 22-22-12-16z" fill="COL" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linejoin="round"/>
          <path d="M22 74l14 14M30 66l14 14M38 58l14 14" stroke="${INK}" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>`,
  crown: `<path d="M10 74l-2-40 22 18 20-32 20 32 22-18-2 40z" fill="COL" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linejoin="round"/>
          <rect x="8" y="78" width="84" height="12" rx="3" fill="COL2"/><circle cx="50" cy="60" r="5" fill="${INK}"/>`
};

function packBox({ file, line1, line2, color, color2, icon, subtitle, tag }) {
  const c2 = color2 || color;
  const t1 = centered(line1, 300, 660, line1.length > 5 ? 108 : 148, { letterSpacing: 0.01 });
  const t2 = centered(line2, 300, 722, 50, { letterSpacing: 0.22 });
  const brand = textPath('MIZTWEAKZ', 152, 214, 30, { letterSpacing: 0.12 });
  const sub = centered(subtitle, 300, 775, 19, { letterSpacing: 0.16 });
  const tagP = tag ? centered(tag, 300, 130, 24, { letterSpacing: 0.18 }) : null;
  write(file, SVG('0 0 600 900', 600, 900, `
  <title>${line1} ${line2} — MIZTWEAKZ</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SURF}"/><stop offset="1" stop-color="#121214"/></linearGradient>
    <linearGradient id="face" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34343b"/><stop offset="1" stop-color="#1a1a1e"/></linearGradient>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="${color}" stop-opacity=".30"/><stop offset=".6" stop-color="${c2}" stop-opacity=".06"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0v30" fill="none" stroke="#fff" stroke-opacity=".04"/></pattern>
    <pattern id="stripes" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="14" fill="#000" fill-opacity=".12"/></pattern>
    <filter id="blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>
    <clipPath id="faceClip"><rect x="110" y="150" width="380" height="600" rx="18"/></clipPath>
  </defs>
  <rect width="600" height="900" fill="url(#bg)"/>
  <rect width="600" height="900" fill="url(#grid)"/>
  <rect width="600" height="900" fill="url(#glow)"/>
  <ellipse cx="300" cy="790" rx="200" ry="26" fill="#000" fill-opacity=".55" filter="url(#blur)"/>
  <!-- box -->
  <polygon points="110,150 140,128 520,128 490,150" fill="#3c3c45"/>
  <polygon points="490,150 520,128 520,728 490,750" fill="#0f0f12"/>
  <rect x="110" y="150" width="380" height="600" rx="18" fill="url(#face)" stroke="#fff" stroke-opacity=".14"/>
  <g clip-path="url(#faceClip)">
    <rect x="110" y="150" width="380" height="96" fill="url(#band)"/>
    <rect x="110" y="150" width="380" height="96" fill="url(#stripes)"/>
    <rect x="110" y="150" width="16" height="600" fill="url(#band)"/>
    <polygon points="110,150 490,150 490,470" fill="#fff" fill-opacity=".035"/>
    <path d="${brand.d}" fill="${INK}"/>
    <circle cx="452" cy="198" r="16" fill="${INK}" fill-opacity=".85"/>
    <path d="M444 198l6 6 10-12" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g transform="translate(220 300) scale(1.6)">${ICONS[icon].replace(/COL2/g, c2).replace(/COL/g, color)}</g>
  <path d="${t1.d}" fill="url(#band)"/>
  <path d="${t2.d}" fill="#fff"/>
  <line x1="200" y1="748" x2="400" y2="748" stroke="#fff" stroke-opacity=".12"/>
  <path d="${sub.d}" fill="${MUTED}"/>
  ${tagP ? `<rect x="${round(300 - tagP.width / 2 - 18)}" y="98" width="${round(tagP.width + 36)}" height="44" rx="22" fill="${INK}" stroke="${color}" stroke-opacity=".7" stroke-width="2"/><path d="${tagP.d}" fill="${color}"/>` : ''}`,
    'role="img"'));
}
packBox({ file: 'pack-fps.svg', line1: 'FPS', line2: 'PACK', color: LIME, icon: 'gauge', subtitle: 'PC OPTIMIZATION · WINDOWS 10 & 11' });
packBox({ file: 'pack-ping.svg', line1: 'PING', line2: 'PACK', color: CYAN, icon: 'signal', subtitle: 'NETWORK OPTIMIZATION · WINDOWS 10 & 11' });
packBox({ file: 'pack-delay.svg', line1: 'DELAY', line2: 'PACK', color: '#ffffff', icon: 'bolt', subtitle: 'INPUT DELAY · KBM & CONTROLLER' });
packBox({ file: 'pack-debloat.svg', line1: 'DEBLOAT', line2: 'TOOL', color: CYAN, icon: 'broom', subtitle: 'ONE-CLICK SYSTEM DEBLOAT', tag: 'NEW' });
packBox({ file: 'pack-ultimate.svg', line1: 'ULTIMATE', line2: 'BUNDLE', color: LIME, color2: CYAN, icon: 'crown', subtitle: 'FPS + PING + DELAY + DEBLOAT', tag: 'MOST VALUE' });

/* ---------------- before-after-fps.svg ---------------- */
(function () {
  const W = 1200, H = 675;
  // shared scene geometry (drawn on both halves)
  const hills = 'M0 430 C120 380 200 440 320 400 C440 360 520 420 640 380 C760 340 860 420 980 390 C1080 366 1140 400 1200 380 L1200 560 L0 560 Z';
  const bld = [[60, 350, 40, 90], [140, 330, 30, 110], [230, 370, 56, 70], [700, 340, 44, 100], [790, 310, 34, 130], [880, 360, 60, 80], [1040, 330, 40, 110]]
    .map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0f1013"/>`).join('');
  const fpsL = textPath('64', 40, 112, 84, { letterSpacing: -0.02 });
  const fpsLl = textPath('FPS', 40 + fpsL.width + 10, 112, 30, { letterSpacing: 0.1 });
  const pingL = textPath('48 ms', 40, 146, 24, { letterSpacing: 0.08 });
  const fpsR = textPath('240', 640, 112, 84, { letterSpacing: -0.02 });
  const fpsRl = textPath('FPS', 640 + fpsR.width + 10, 112, 30, { letterSpacing: 0.1 });
  const pingR = textPath('18 ms', 640, 146, 24, { letterSpacing: 0.08 });
  const before = centered('BEFORE', 300, 612, 30, { letterSpacing: 0.26 });
  const after = centered('AFTER', 900, 612, 30, { letterSpacing: 0.26 });
  const cap = centered('MIZTWEAKZ  ·  SAME PC  ·  SAME SETTINGS  ·  FPS PACK APPLIED', 600, 660, 16, { letterSpacing: 0.2 });
  const frameL = 'M40 190 l20 -10 l18 22 l22 -30 l20 14 l18 -26 l24 30 l20 -18 l20 26 l20 -32 l22 20 l20 -12 l18 24 l22 -28 l20 16 l20 -8 l20 20 l24 -30 l20 12 l22 -6 l20 18 l22 -26 l20 10 l20 -14';
  const frameR = 'M640 182 l24 -2 l24 2 l24 -3 l24 2 l24 -1 l24 2 l24 -2 l24 1 l24 -2 l24 2 l24 -1 l24 1 l24 -2 l24 2 l24 -1 l24 1 l24 -2 l24 1 l24 -1 l24 2 l24 -1';
  write('before-after-fps.svg', SVG(`0 0 ${W} ${H}`, W, H, `
  <title>Before and after applying the MIZTWEAKZ FPS Pack: 64 FPS vs 240 FPS</title>
  <defs>
    <linearGradient id="skyL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b3f47"/><stop offset="1" stop-color="#22252a"/></linearGradient>
    <linearGradient id="skyR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f3a3c"/><stop offset="1" stop-color="#182426"/></linearGradient>
    <radialGradient id="sunR" cx="80%" cy="18%" r="40%"><stop offset="0" stop-color="${LIME}" stop-opacity=".22"/><stop offset="1" stop-color="${LIME}" stop-opacity="0"/></radialGradient>
    <linearGradient id="hudBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
    <clipPath id="left"><rect x="0" y="0" width="600" height="${H}"/></clipPath>
    <clipPath id="right"><rect x="600" y="0" width="600" height="${H}"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <!-- LEFT: before -->
  <g clip-path="url(#left)">
    <rect width="${W}" height="${H}" fill="url(#skyL)"/>
    <path d="${hills}" fill="#191b1f"/>${bld}
    <rect y="560" width="${W}" height="115" fill="#0c0d0f"/>
    <rect width="${W}" height="${H}" fill="#000" fill-opacity=".18"/>
    <g fill="none" stroke="#ff6b6b" stroke-width="2" stroke-opacity=".8"><path d="${frameL}"/></g>
    <rect x="24" y="36" width="270" height="130" rx="12" fill="url(#hudBg)" stroke="#fff" stroke-opacity=".08"/>
    <path d="${fpsL.d}" fill="#ff6b6b"/><path d="${fpsLl.d}" fill="#fff" fill-opacity=".7"/><path d="${pingL.d}" fill="#fff" fill-opacity=".55"/>
    <g stroke="#fff" stroke-opacity=".55" stroke-width="2"><path d="M300 340v-18M300 378v-18M282 359h18M318 359h18"/></g>
    <rect x="${round(300 - before.width / 2 - 22)}" y="584" width="${round(before.width + 44)}" height="40" rx="20" fill="#000" fill-opacity=".5" stroke="#fff" stroke-opacity=".15"/>
    <path d="${before.d}" fill="#fff" fill-opacity=".75"/>
  </g>
  <!-- RIGHT: after -->
  <g clip-path="url(#right)">
    <rect width="${W}" height="${H}" fill="url(#skyR)"/>
    <rect width="${W}" height="${H}" fill="url(#sunR)"/>
    <path d="${hills}" fill="#121b1c"/>${bld}
    <rect y="560" width="${W}" height="115" fill="#0a0f10"/>
    <g fill="none" stroke="${LIME}" stroke-width="2.5"><path d="${frameR}"/></g>
    <rect x="624" y="36" width="290" height="130" rx="12" fill="url(#hudBg)" stroke="${LIME}" stroke-opacity=".35"/>
    <path d="${fpsR.d}" fill="${LIME}"/><path d="${fpsRl.d}" fill="#fff" fill-opacity=".85"/><path d="${pingR.d}" fill="${CYAN}"/>
    <g stroke="${LIME}" stroke-opacity=".9" stroke-width="2"><path d="M900 340v-18M900 378v-18M882 359h18M918 359h18"/></g>
    <rect x="${round(900 - after.width / 2 - 22)}" y="584" width="${round(after.width + 44)}" height="40" rx="20" fill="${LIME}"/>
    <path d="${after.d}" fill="${INK}"/>
  </g>
  <!-- divider -->
  <rect x="597" y="0" width="6" height="${H}" fill="#fff"/>
  <circle cx="600" cy="${H / 2}" r="26" fill="#fff"/>
  <path d="M590 ${H / 2}l-7 0M583 ${H / 2}l5 -5M583 ${H / 2}l5 5M610 ${H / 2}l7 0M617 ${H / 2}l-5 -5M617 ${H / 2}l-5 5" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <rect y="640" width="${W}" height="35" fill="#000" fill-opacity=".6"/>
  <path d="${cap.d}" fill="${MUTED}"/>`, 'role="img"'));
})();

/* ---------------- avatars ---------------- */
[['avatar-1.svg', 'CF', LIME], ['avatar-2.svg', 'MU', CYAN], ['avatar-3.svg', 'TB', LIME], ['avatar-4.svg', 'HA', CYAN], ['avatar-5.svg', 'JM', LIME]]
  .forEach(([file, ini, col], i) => {
    const t = centered(ini, 60, 60, 46, { letterSpacing: 0.04 });
    const cy = (t.bbox.y1 + t.bbox.y2) / 2;
    write(file, SVG('0 0 120 120', 120, 120, `
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34343b"/><stop offset="1" stop-color="#1c1c20"/></linearGradient></defs>
  <circle cx="60" cy="60" r="58" fill="url(#g)"/>
  <circle cx="60" cy="60" r="56" fill="none" stroke="${col}" stroke-opacity=".7" stroke-width="3"/>
  <circle cx="${[38, 86, 30, 90, 60][i]}" cy="${[92, 30, 40, 84, 16][i]}" r="4" fill="${col}"/>
  <path d="${t.d}" transform="translate(0 ${round(60 - cy)})" fill="${OFF}"/>`, 'role="img" aria-label="' + ini + '"'));
  });

/* ---------------- game badges ---------------- */
[['badge-fortnite.svg', 'FORTNITE'], ['badge-valorant.svg', 'VALORANT'], ['badge-apex.svg', 'APEX LEGENDS'], ['badge-cs2.svg', 'CS2'], ['badge-warzone.svg', 'WARZONE'], ['badge-rocket-league.svg', 'ROCKET LEAGUE']]
  .forEach(([file, label]) => {
    let size = 46;
    let w = font.getAdvanceWidth(label, size, { kerning: true, letterSpacing: 0.08 });
    while (w > 196 && size > 20) { size -= 2; w = font.getAdvanceWidth(label, size, { kerning: true, letterSpacing: 0.08 }); }
    const t = centered(label, 130, 60, size, { letterSpacing: 0.08 });
    const cy = (t.bbox.y1 + t.bbox.y2) / 2;
    write(file, SVG('0 0 260 120', 260, 120, `
  <rect x="2" y="2" width="256" height="116" rx="18" fill="${SURF}" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>
  <rect x="16" y="46" width="4" height="28" rx="2" fill="${LIME}"/>
  <path d="${t.d}" transform="translate(6 ${round(60 - cy)})" fill="#ffffff"/>`, 'role="img" aria-label="' + label + '"'));
  });

console.log('done');
