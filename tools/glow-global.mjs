// Make every glow/halo/shadow effect use the grayish-white ambient tokens (owner request 2026-09-08).
// Solid fills, text colours and borders keep the red accent; only light effects change.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const A = 'rgba(var(--ambient-rgb), ';
const edits = {
  'site/assets/css/site.css': [
    [/(\.nav-tab\.active::before \{[^}]*?)rgba\(var\(--accent-rgb\), \.4\)/, '$1' + A + '.45)'],
    [/box-shadow: 0 0 8px var\(--accent-2\);/g, 'box-shadow: 0 0 8px ' + A + '.6);'],
    [/box-shadow: 0 0 12px var\(--accent-2\);/g, 'box-shadow: 0 0 12px ' + A + '.6);'],
    [/(\.hamburger-container:hover, \.hamburger-container\[aria-expanded="true"\] \{ box-shadow: 0 0 5px )var\(--accent\)/, '$1' + A + '.7)'],
    [/box-shadow: 0 0 25px rgba\(var\(--accent-rgb\), \.12\), 0 0 50px rgba\(var\(--accent-2-rgb\), \.08\)/, 'box-shadow: 0 0 25px ' + A + '.18), 0 0 50px ' + A + '.10)'],
    [/box-shadow: 0 0 15px 3px rgba\(var\(--accent-rgb\), \.5\);/, 'box-shadow: 0 0 15px 3px ' + A + '.55);'],
    [/(\.glass-info-card \.info-accent \{[^}]*?box-shadow: 0 0 12px )color-mix\([^;]*?;/, '$1' + A + '.5);'],
    [/filter: drop-shadow\(0 0 30px rgba\(var\(--accent-2-rgb\), \.25\)\)/, 'filter: drop-shadow(0 0 30px ' + A + '.35))'],
    [/@keyframes mz-sale-pulse \{ 0%, 100% \{ box-shadow: 0 0 5px rgba\(var\(--accent-2-rgb\), \.3\); \} 50% \{ box-shadow: 0 0 15px rgba\(var\(--accent-2-rgb\), \.5\); \} \}/, '@keyframes mz-sale-pulse { 0%, 100% { box-shadow: 0 0 5px ' + A + '.35); } 50% { box-shadow: 0 0 15px ' + A + '.6); } }'],
    [/(\.hero-headline \.accent, \.text-accent \{ text-shadow: 0 0 28px )rgba\(var\(--accent-rgb\), \.45\)/, '$1' + A + '.5)'],
    [/(\.footer-glow \{[^}]*?linear-gradient\(90deg, transparent, )var\(--accent(-bright)?\)/, '$1' + A + '.7)'],
  ],
  'site/assets/css/page-affiliates.css': [
    [/box-shadow: 0 0 22px rgba\(var\(--accent-rgb\), \.35\);/, 'box-shadow: 0 0 22px ' + A + '.45);'],
  ],
  'site/assets/css/page-utilities.css': [
    [/box-shadow: 0 0 10px rgba\(var\(--accent-rgb\), \.6\);/, 'box-shadow: 0 0 10px ' + A + '.7);'],
    [/text-shadow: 0 0 6px rgba\(var\(--accent-rgb\), \.9\), 0 0 18px rgba\(var\(--accent-rgb\), \.55\), 0 0 36px rgba\(var\(--accent-rgb\), \.3\);/, 'text-shadow: 0 0 6px ' + A + '.8), 0 0 18px ' + A + '.45), 0 0 36px ' + A + '.25);'],
    [/box-shadow: 0 0 25px rgba\(var\(--gold-rgb\), \.18\), 0 0 60px rgba\(var\(--gold-rgb\), \.10\)/, 'box-shadow: 0 0 25px ' + A + '.22), 0 0 60px ' + A + '.12)'],
    [/box-shadow: 0 0 15px 3px rgba\(var\(--gold-rgb\), \.55\);/, 'box-shadow: 0 0 15px 3px ' + A + '.6);'],
  ],
};
for (const [rel, list] of Object.entries(edits)) {
  const file = path.join(ROOT, rel);
  let c = fs.readFileSync(file, 'utf8');
  const miss = [];
  for (const [re, to] of list) { if (!re.test(c)) miss.push(re.source.slice(0, 48)); c = c.replace(re, to); }
  fs.writeFileSync(file, c);
  console.log(rel, 'applied', list.length - miss.length, '/', list.length, miss.length ? 'MISSING: ' + miss.join(' | ') : '');
}
