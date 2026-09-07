const http = require('http'), fs = require('fs'), p = require('path');
const root = __dirname;
http.createServer((q, s) => {
  let f = root + decodeURIComponent(q.url.split('?')[0]);
  if (f.endsWith('/')) f += 'index.html';
  fs.readFile(f, (e, d) => {
    if (e) { s.statusCode = 404; s.end('nf'); return }
    const m = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpeg': 'image/jpeg', '.xlsx': 'application/vnd.ms-excel' };
    s.setHeader('Content-Type', m[p.extname(f)] || 'application/octet-stream');
    s.end(d);
  });
}).listen(8123, () => console.log('serving on 8123'));
