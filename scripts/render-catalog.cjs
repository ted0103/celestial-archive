const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'design', 'cards');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.md': 'text/markdown; charset=utf-8',
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  const candidate = path.resolve(root, `.${requestPath === '/' ? '/design/catalog.html' : requestPath}`);
  if (!candidate.startsWith(root + path.sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  fs.readFile(candidate, (error, content) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end(error.message);
      return;
    }
    response.setHeader('Content-Type', mime[path.extname(candidate)] || 'application/octet-stream');
    response.writeHead(200).end(content);
  });
});

const dataUrlToBuffer = (value) => Buffer.from(value.replace(/^data:image\/png;base64,/, ''), 'base64');

(async () => {
  fs.mkdirSync(outputDir, {recursive: true});
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await chromium.launch({
    headless: true,
    ...(fs.existsSync(systemChrome) ? {executablePath: systemChrome} : {}),
  });

  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}, deviceScaleFactor: 1});
    page.on('pageerror', (error) => console.error(`Catalog page error: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') console.error(`Catalog console error: ${message.text()}`);
    });
    await page.goto(`http://127.0.0.1:${port}/design/catalog.html`, {waitUntil: 'networkidle'});
    await page.waitForFunction(() => document.body.dataset.ready === 'true' && window.__catalog?.cards?.length === 78);

    const cardRecords = await page.evaluate(() => window.__catalog.cards);
    for (const card of cardRecords) {
      const dataUrl = await page.evaluate((id) => window.__catalog.renderCardDataUrl(id, 768), card.id);
      fs.writeFileSync(path.join(outputDir, `${card.id}.png`), dataUrlToBuffer(dataUrl));
    }
    await page.evaluate(() => window.__catalog.renderAllGridCards());
    await page.locator('#catalog-grid').scrollIntoViewIfNeeded();
    await page.screenshot({path: path.join(root, 'design', 'catalog-desktop.png')});

    const mobile = await browser.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 1});
    await mobile.goto(`http://127.0.0.1:${port}/design/catalog.html`, {waitUntil: 'networkidle'});
    await mobile.waitForFunction(() => document.body.dataset.ready === 'true');
    await mobile.evaluate(() => window.__catalog.renderAllGridCards());
    await mobile.locator('#catalog-grid').scrollIntoViewIfNeeded();
    await mobile.screenshot({path: path.join(root, 'design', 'catalog-mobile.png')});
    await mobile.close();

    const contact = await browser.newPage({viewport: {width: 2100, height: 1800}, deviceScaleFactor: 1});
    await contact.goto(`http://127.0.0.1:${port}/design/catalog.html?contact=1`, {waitUntil: 'networkidle'});
    await contact.waitForFunction(() => document.body.dataset.contactReady === 'true');
    await contact.screenshot({path: path.join(root, 'design', 'contact-sheet.png'), fullPage: true});
    await contact.close();

    console.log(`Rendered ${cardRecords.length} local-image card previews.`);
    console.log('Rendered design/contact-sheet.png.');
    console.log('Rendered desktop and mobile catalog QA screenshots.');
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  server.close();
  process.exitCode = 1;
});
