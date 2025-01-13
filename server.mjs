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
        // Get the file path from the URL
        let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
        
        // Handle assets folder requests
        if (req.url.startsWith('/assets/')) {
            filePath = path.join(__dirname, req.url);
        }

        // Get file extension
        const ext = path.extname(filePath);
        
        // Set content type based on file extension
        const contentType = MIME_TYPES[ext] || 'text/plain';

        try {
            const data = await fs.readFile(filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        } catch (error) {
            // If file not found, serve index.html for client-side routing
            if (error.code === 'ENOENT' && ext === '.html') {
                const indexHtml = await fs.readFile(path.join(__dirname, 'index.html'));
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(indexHtml);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
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
