// Replace em/en dashes in site copy with plain punctuation (owner request 2026-09-08).
import fs from 'node:fs';
const files = ['site/index.html','site/about/index.html','site/affiliates/index.html','site/contact/index.html','site/tos/index.html','site/privacy/index.html','site/404.html','site/assets/js/data.js','site/assets/js/site.js'];
const changed = [];
for (const f of files) {
  let t = fs.readFileSync(f, 'utf8'); const orig = t;
  t = t.split('\n').map(line => {
    if (!/[—–]/.test(line)) return line;
    let l = line;
    l = l.replace(/(\d)\s*[–—]\s*(\d)/g, '$1 to $2');                 // numeric ranges: 50–100 -> 50 to 100
    l = l.replace(/'—'/g, "''");                                       // mailto body separator line
    l = l.replace(/\s*–\s*/g, ', ');                                   // remaining en dashes
    const spaced = (l.match(/ — /g) || []).length;
    if (spaced >= 2) l = l.replace(/ — /g, ', ');                      // parenthetical pair -> commas
    else l = l.replace(/ — ([a-z])/g, (m, c) => '. ' + c.toUpperCase()) // single dash -> sentence break
              .replace(/ — /g, ', ');
    l = l.replace(/—/g, ', ');                                         // unspaced leftovers
    return l;
  }).join('\n');
  if (t !== orig) { fs.writeFileSync(f, t); changed.push(f); }
}
console.log('changed:', changed.join(', '));
