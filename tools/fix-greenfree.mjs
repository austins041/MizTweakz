// Repair greenFree(): the \b word boundaries were written as backspace bytes (0x08). Also re-run it after
// page scripts that rebuild button labels, so "Free" stays green everywhere.
import fs from 'node:fs';
import path from 'node:path';
const f = path.resolve(import.meta.dirname, '../site/assets/js/site.js');
let j = fs.readFileSync(f, 'utf8');
const before = j;
j = j.split('Free').join('\\bFree\\b');
const fixed = j !== before;
// run again on window load and shortly after, so page-level scripts that rewrite labels get wrapped too
if (!j.includes('greenFree-rerun')) {
  j = j.replace(/try \{ greenFree\(\); \} catch \(e\) \{ \/\* cosmetic \*\/ \}/,
    "try { greenFree(); } catch (e) { /* cosmetic */ }\n    /* greenFree-rerun: page scripts may rebuild labels after init */\n    window.addEventListener('load', function () { try { greenFree(); } catch (e) {} });\n    setTimeout(function () { try { greenFree(); } catch (e) {} }, 1200);");
}
fs.writeFileSync(f, j);
console.log('backspaces fixed:', fixed, '| regex now:', (j.match(/\/\\bFree\\b\/\.test/) || ['?'])[0], '| rerun hooks:', j.includes('greenFree-rerun'));
