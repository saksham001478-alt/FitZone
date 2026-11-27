import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const PORT = 5175;
const DIST_DIR = path.resolve('dist');
const OUTPUT_DIR = path.resolve('screenshots');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, reqPath);
  if (!path.extname(reqPath) || !fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

async function main() {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--window-size=1400,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1.5 });
  const BASE_URL = `http://localhost:${PORT}`;

  // Login as Admin with dark mode
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const adminUser = { id: 'admin', name: 'Admin', email: 'admin@fitzone.com', role: 'admin' };
    localStorage.setItem('fitzone_user', JSON.stringify(adminUser));
    localStorage.setItem('darkMode', 'true');
  });

  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.dashboard', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '15_DarkMode_AdminDashboard.png') });
  console.log('✓ 15_DarkMode_AdminDashboard.png');

  // Customer Diet Detail page (Dynamic route :type)
  await page.evaluate(() => {
    const custUser = { id: '1', name: 'Rahul Sharma', email: 'rahul@fitzone.com', role: 'customer' };
    localStorage.setItem('fitzone_user', JSON.stringify(custUser));
  });
  await page.goto(`${BASE_URL}/app/diet/weight-loss`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.diet-detail', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '16_Customer_DietDetail.png') });
  console.log('✓ 16_Customer_DietDetail.png');

  await browser.close();
  server.close();
}

main().catch(console.error);
