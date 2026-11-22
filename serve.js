const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 8080);
const PUBLIC_DIR = __dirname;
// A local preview must never expose .git, logs, tests, environment files,
// node_modules, Firestore rules or owner-only documents.
const PUBLIC_ROOT_FILES = new Set([
    'index.html', '404.html', 'privacy.html', 'style.css', 'premium.css',
    'editorial.css', 'case-studies.css', 'case-studies.js', 'theme-init.js',
    'script.js', 'robots.txt', 'sitemap.xml'
]);
const PUBLIC_FOLDERS = new Set(['Images', 'assets', 'modules', 'vendor', 'projects']);
function isPublicRoute(urlPath) {
    const pieces = urlPath.split('/').filter(Boolean);
    if (!pieces.length || pieces.some(piece => piece.startsWith('.'))) return false;
    if (pieces.length === 1) return PUBLIC_ROOT_FILES.has(pieces[0]);
    return PUBLIC_FOLDERS.has(pieces[0]) && !pieces.some(piece => piece === '..');
}
function sendNotFound(res) {
    const notFoundPath = path.join(PUBLIC_DIR, '404.html');
    fs.stat(notFoundPath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
            res.end('Not found');
            return;
        }
        const realFile = fs.realpathSync(notFoundPath);
        if (!realFile.startsWith(PUBLIC_DIR + path.sep)) {
            res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
            res.end('Not found');
            return;
        }
        res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
        fs.createReadStream(realFile).pipe(res);
    });
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    let reqUrl;
    try { reqUrl = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400); res.end('Invalid URL'); return; }
    if (reqUrl.includes('\0') || reqUrl.split('/').includes('..')) { res.writeHead(400); res.end('Invalid path'); return; }
    if (reqUrl.endsWith('/')) reqUrl += 'index.html';
    if (!isPublicRoute(reqUrl)) {
        sendNotFound(res);
        return;
    }
    const filePath = path.resolve(PUBLIC_DIR, '.' + reqUrl);
    if (!filePath.startsWith(PUBLIC_DIR + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            sendNotFound(res);
            return;
        }

        // Disallow repository symlinks even when their names look public.
        const realFile = fs.realpathSync(filePath);
        if (!realFile.startsWith(PUBLIC_DIR + path.sep)) {
            res.writeHead(403); res.end('Forbidden'); return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
            'Content-Type': contentType,
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Portfolio server live at http://localhost:${PORT}`);
});
