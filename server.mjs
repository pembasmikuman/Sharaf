import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
    try {
        // Parse URL and query parameters
        const url = new URL(req.url, `http://${req.headers.host}`);
        let filePath;

        // Handle root path
        if (url.pathname === '/') {
            filePath = path.join(__dirname, 'index.html');
        }
        // Handle dynamic product pages
        else if (url.pathname.includes('product.html')) {
            filePath = path.join(__dirname, 'product.html');
        }
        // Handle assets folder requests
        else if (url.pathname.startsWith('/assets/')) {
            filePath = path.join(__dirname, url.pathname);
        }
        // Handle other static files
        else {
            filePath = path.join(__dirname, url.pathname);
        }

        // Get file extension and content type
        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] || 'text/plain';

        try {
            const data = await fs.readFile(filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // If HTML file not found, serve index.html for client-side routing
                if (ext === '.html') {
                    const indexHtml = await fs.readFile(path.join(__dirname, 'index.html'));
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(indexHtml);
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                }
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error(chalk.red('Server Error:', error));
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

server.listen(PORT, () => {
    console.log(chalk.bgBlue(`Server is running on http://localhost:${PORT}`));
});
