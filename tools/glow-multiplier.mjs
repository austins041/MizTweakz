// Route every ambient glow alpha through a --glow multiplier so mobile can tone it down
// without touching desktop values (owner request 2026-09-09). Idempotent.
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve(import.meta.dirname, '../site/assets/css');
let total = 0;
for (const f of fs.readdirSync(dir).filter(n => n.endsWith('.css'))) {
  const file = path.join(dir, f);
  let c = fs.readFileSync(file, 'utf8');
  let n = 0;
  c = c.replace(/rgba\(var\(--ambient(-2)?-rgb\), (\.\d+|0?\.\d+|1)\)/g, (m, two, a) => {
    n++; return `rgba(var(--ambient${two || ''}-rgb), calc(${a} * var(--glow, 1)))`;
  });
  if (n) { fs.writeFileSync(file, c); total += n; console.log(f, 'wrapped', n); }
}
console.log('total wrapped', total);
