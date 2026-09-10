// Tiny local receiver: the app-preview page POSTs {name, dataUrl} and this writes site/assets/img/app/<name>.png
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const OUT = path.resolve(import.meta.dirname, '../site/assets/img/app');
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method !== 'POST') { res.writeHead(404); return res.end(); }
  let body = ''; req.on('data', c => body += c); req.on('end', () => {
    try { const { name, dataUrl } = JSON.parse(body); const safe = String(name).replace(/[^a-z0-9-]/gi, '').slice(0, 40);
      const b64 = dataUrl.split(',')[1]; const file = path.join(OUT, safe + '.png'); fs.writeFileSync(file, Buffer.from(b64, 'base64'));
      res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: true, file, bytes: fs.statSync(file).size }));
    } catch (e) { res.writeHead(400); res.end(String(e)); }
  });
}).listen(8125, () => console.log('shot receiver on 8125 ->', OUT));
