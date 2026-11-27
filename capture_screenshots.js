import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const PORT = 5174;
const DIST_DIR = path.resolve('dist');
const OUTPUT_DIR = path.resolve('screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

// Start a lightweight static server with SPA fallback
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, reqPath);

  // If path is a directory or does not exist with an extension, fallback to index.html
  if (!path.extname(reqPath) || !fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

async function main() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server running at http://localhost:${PORT}`);

  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  console.log('Using browser:', chromePath);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1.5 });

  const BASE_URL = `http://localhost:${PORT}`;

  // Helper to inject mock login session
  async function setSession(userRole = 'admin') {
    await page.evaluate((role) => {
      const adminUser = { id: 'admin', name: 'Admin', email: 'admin@fitzone.com', role: 'admin' };
      const custUser = { id: '1', name: 'Rahul Sharma', email: 'rahul@fitzone.com', role: 'customer', plan: 'Premium', joinDate: '2025-01-15' };
      localStorage.setItem('fitzone_user', JSON.stringify(role === 'admin' ? adminUser : custUser));
    }, userRole);
  }

  console.log('Capturing screenshots...');

  // 1. Login Page (Customer Tab)
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.auth-card', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_Login_Customer.png') });
  console.log('✓ 01_Login_Customer.png');

  // 2. Login Page (Admin Tab)
  const adminTab = await page.$('.auth-tab:nth-child(2)');
  if (adminTab) {
    await adminTab.click();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_Login_Admin.png') });
    console.log('✓ 02_Login_Admin.png');
  }

  // 3. Register Page
  await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.auth-card', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_Register_Page.png') });
  console.log('✓ 03_Register_Page.png');

  // Set Admin session
  await setSession('admin');

  // 4. Admin Dashboard
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.dashboard', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_Admin_Dashboard.png') });
  console.log('✓ 04_Admin_Dashboard.png');

  // 5. Admin Members List
  await page.goto(`${BASE_URL}/admin/members`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.members-header', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_Admin_MemberList.png') });
  console.log('✓ 05_Admin_MemberList.png');

  // 6. Admin Attendance Tracker
  await page.goto(`${BASE_URL}/admin/attendance`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.attendance-list', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_Admin_Attendance.png') });
  console.log('✓ 06_Admin_Attendance.png');

  // 7. Admin Diet Plans
  await page.goto(`${BASE_URL}/admin/diet`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.diet-grid', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_Admin_DietPlans.png') });
  console.log('✓ 07_Admin_DietPlans.png');

  // 8. Admin Fitness Tracker & BMI
  await page.goto(`${BASE_URL}/admin/fitness`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.fitness-form', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_Admin_FitnessTracker.png') });
  console.log('✓ 08_Admin_FitnessTracker.png');

  // 9. Admin Fitness Progress (Nested Route)
  await page.goto(`${BASE_URL}/admin/fitness/progress`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_Admin_ProgressChart.png') });
  console.log('✓ 09_Admin_ProgressChart.png');

  // 10. Admin Manage Shop & Orders
  await page.goto(`${BASE_URL}/admin/shop`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.shop-grid', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_Admin_ManageShop.png') });
  console.log('✓ 10_Admin_ManageShop.png');

  // Set Customer session
  await setSession('customer');

  // 11. Customer Dashboard
  await page.goto(`${BASE_URL}/app`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.customer-dashboard', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '11_Customer_Dashboard.png') });
  console.log('✓ 11_Customer_Dashboard.png');

  // 12. Customer Shop
  await page.goto(`${BASE_URL}/app/shop`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.shop-grid', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '12_Customer_Shop.png') });
  console.log('✓ 12_Customer_Shop.png');

  // Add an item to cart and take Cart screenshot
  await page.evaluate(() => {
    const cart = [
      {
        id: 1,
        name: 'Whey Protein',
        price: 2499,
        quantity: 2,
        icon: '🥛',
        category: 'Supplements'
      },
      {
        id: 3,
        name: 'Gym Gloves',
        price: 499,
        quantity: 1,
        icon: '🧤',
        category: 'Accessories'
      }
    ];
    localStorage.setItem('fitzone_cart', JSON.stringify(cart));
  });

  // 13. Customer Cart
  await page.goto(`${BASE_URL}/app/shop/cart`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.cart-summary', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '13_Customer_Cart.png') });
  console.log('✓ 13_Customer_Cart.png');

  // 14. Customer Contact & Star Rating
  await page.goto(`${BASE_URL}/app/contact`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.contact-form', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '14_Customer_Contact_Rating.png') });
  console.log('✓ 14_Customer_Contact_Rating.png');

  // 15. Dark Mode Screenshot
  await page.evaluate(() => {
    localStorage.setItem('darkMode', 'true');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.dashboard', { timeout: 5000 });
  await page.screenshot({ path: path.join(OUTPUT_DIR, '15_DarkMode_AdminDashboard.png') });
  console.log('✓ 15_DarkMode_AdminDashboard.png');

  await browser.close();
  server.close();
  console.log('All screenshots captured successfully in:', OUTPUT_DIR);
}

main().catch((err) => {
  console.error('Error capturing screenshots:', err);
  server.close();
  process.exit(1);
});
