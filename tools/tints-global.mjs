// Second pass of the "grayish-white glow everywhere" rule (owner, 2026-09-08/09):
// every soft red TINT (translucent accent used as a wash, sheen, tinted box or hover border)
// becomes the ambient gray-white. Solid red text/fills and opaque red lines stay red.
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve(import.meta.dirname, '../site/assets/css');
let total = 0;
for (const f of fs.readdirSync(dir).filter(n => n.endsWith('.css'))) {
  const file = path.join(dir, f);
  let c = fs.readFileSync(file, 'utf8');
  let n = 0;
  // translucent accent (alpha <= .45) -> ambient
  c = c.replace(/rgba\(var\(--accent(?:-2)?-rgb\), (\.\d+|0\.\d+)\)/g, (m, a) => {
    if (parseFloat(a) <= 0.45) { n++; return `rgba(var(--ambient-rgb), ${a})`; }
    return m;
  });
  // button / card colour-mix sheens -> ambient at the same strength
  c = c.replace(/color-mix\(in srgb, var\(--(?:btn-color|color)\) (\d+)%, transparent\)/g, (m, p) => {
    n++; return `rgba(var(--ambient-rgb), ${(parseInt(p, 10) / 100).toFixed(2).replace(/^0/, '')})`;
  });
  if (n) { fs.writeFileSync(file, c); console.log(f, 'swapped', n); total += n; }
}
console.log('total swapped', total);
