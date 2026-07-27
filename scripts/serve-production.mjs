import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {extname, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const appRoot = resolve(projectRoot, process.argv.includes('--dist')?'dist':'app');
const host = '127.0.0.1';
const publicHost = 'celestial-archive.localhost';
const port = 47831;
const allowedHost = `${publicHost}:${port}`;
const mime = new Map([
  ['.html','text/html; charset=utf-8'],['.js','text/javascript; charset=utf-8'],['.css','text/css; charset=utf-8'],
  ['.json','application/json; charset=utf-8'],['.webmanifest','application/manifest+json; charset=utf-8'],['.png','image/png'],['.webp','image/webp'],['.ttf','font/ttf'],['.otf','font/otf'],
  ['.wasm','application/wasm'],['.tflite','application/octet-stream'],['.binarypb','application/octet-stream'],['.data','application/octet-stream'],
]);

function sendHeaders(response, type, cache='no-store') {
  response.setHeader('Content-Type', type);
  response.setHeader('Cache-Control', cache);
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
  response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  response.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self' 'wasm-unsafe-eval' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
}

const server = createServer(async (request, response) => {
  if (request.headers.host !== allowedHost) {
    sendHeaders(response, 'text/plain; charset=utf-8'); response.statusCode=421; response.end(`Open http://${allowedHost}/ exactly.`); return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendHeaders(response, 'text/plain; charset=utf-8'); response.statusCode=405; response.end('Method not allowed'); return;
  }
  try {
    const url = new URL(request.url, `http://${allowedHost}`);
    const decoded = decodeURIComponent(url.pathname);
    const requested = decoded.endsWith('/') ? `${decoded}index.html` : decoded;
    const filePath = resolve(appRoot, `.${requested}`);
    if (filePath !== appRoot && !filePath.startsWith(`${appRoot}${sep}`)) throw new Error('Path outside app root');
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error('Not a file');
    const bytes = await readFile(filePath);
    const type = mime.get(extname(filePath).toLowerCase()) || 'application/octet-stream';
    const cache = /\/assets\/cards\/r1\/(approved|generated)\//.test(filePath) ? 'public, max-age=31536000, immutable' : 'no-store';
    sendHeaders(response,type,cache);response.statusCode=200;if(request.method==='HEAD')response.end();else response.end(bytes);
  } catch {
    sendHeaders(response,'text/plain; charset=utf-8');response.statusCode=404;response.end('Not found');
  }
});

server.listen(port,host,()=>console.log(`The Celestial Archive is available at http://${allowedHost}/`));
