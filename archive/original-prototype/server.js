const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const publicDirectory = path.join(__dirname, 'public');
const files = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8']
};
const port = Number(process.env.PORT || 3000);
http.createServer((request, response) => {
  const file = files[new URL(request.url, 'http://localhost').pathname];
  if (!file || !['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not found');
    return;
  }
  fs.readFile(path.join(publicDirectory, file[0]), (error, data) => {
    if (error) {
      response.writeHead(500);
      response.end('Unable to read file');
      return;
    }
    response.writeHead(200, { 'Content-Type': file[1] });
    response.end(request.method === 'HEAD' ? undefined : data);
  });
}).listen(port, () => console.log(`VMS preview: http://localhost:${port}`));
