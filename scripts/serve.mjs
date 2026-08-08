import {createReadStream, existsSync, statSync} from 'node:fs';
import {createServer} from 'node:http';
import {extname, resolve, sep} from 'node:path';

const root = resolve(process.env.PORTFOLIO_OUTPUT || 'dist');
const port = Number(process.env.PORT || process.argv[2] || 4173);
const types = {'.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json'};

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let filePath = resolve(root, requested);
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = resolve(filePath, 'index.html');
  if (!existsSync(filePath)) {
    response.writeHead(404, {'content-type': 'text/plain; charset=utf-8'}).end('Not found');
    return;
  }
  response.writeHead(200, {'content-type': types[extname(filePath)] || 'application/octet-stream', 'cache-control': 'no-store'});
  createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => console.log(`Portfolio preview: http://127.0.0.1:${port}`));
