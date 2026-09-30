const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mpeg': 'audio/mpeg',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  // Decode URL-encoded paths (e.g., %20 -> space)
  try { urlPath = decodeURIComponent(urlPath); } catch(e) {}
  
  // Normalize path to prevent directory traversal
  const requestedPath = path.normalize(urlPath === '/' ? 'index.html' : urlPath);
  const filePath = path.join(__dirname, '..', requestedPath);
  
  // Security: ensure the resolved path is still within the project root
  const projectRoot = path.resolve(__dirname, '..');
  if (!filePath.startsWith(projectRoot + path.sep) && filePath !== projectRoot) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(4567, '127.0.0.1', () => {
  console.log('ready on http://127.0.0.1:4567');
});

