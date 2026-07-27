const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const catalogUrl = pathToFileURL(path.join(root, 'design', 'catalog-review.html')).href;

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(fs.existsSync(systemChrome) ? {executablePath: systemChrome} : {}),
  });
  const errors = [];

  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(catalogUrl, {waitUntil: 'domcontentloaded'});
    await page.waitForFunction(() => document.body.dataset.ready === 'true' && window.__catalog?.cards?.length === 78);

    assert.equal(await page.locator('.card-entry').count(), 78, 'All-card view must contain 78 entries');
    assert.equal(await page.locator('#filters button').count(), 6, 'Catalog must expose all six review filters');

    await page.getByRole('button', {name: /Major Arcana/}).click();
    assert.equal(await page.locator('.card-entry').count(), 22, 'Major Arcana filter must contain 22 entries');

    await page.getByRole('button', {name: /All 78/}).click();
    await page.locator('#search').fill('MAJOR-18');
    assert.equal(await page.locator('.card-entry').count(), 1, 'Search by stable card ID must resolve one card');
    await page.locator('.card-open').click();
    assert.equal(await page.locator('#card-dialog').evaluate((dialog) => dialog.open), true, 'Card detail dialog must open');
    assert.match(await page.locator('#dialog-title').textContent(), /The Moon/);
    assert.match(await page.locator('#revision-code').textContent(), /MAJOR-18/);
    await page.keyboard.press('Escape');

    await page.locator('#search').fill('');
    await page.getByRole('button', {name: 'Annotated'}).click();
    assert.equal(await page.locator('#catalog-grid').getAttribute('data-view'), 'annotated');

    const mobile = await browser.newPage({viewport: {width: 390, height: 844}, isMobile: true});
    mobile.on('pageerror', (error) => errors.push(error.message));
    await mobile.goto(catalogUrl, {waitUntil: 'domcontentloaded'});
    await mobile.waitForFunction(() => document.body.dataset.ready === 'true');
    const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 1, `Mobile catalog must not overflow horizontally (overflow: ${overflow}px)`);
    assert.equal(await mobile.locator('.card-entry').count(), 78);
    await mobile.close();

    assert.deepEqual(errors, [], `Catalog emitted page errors: ${errors.join('; ')}`);
    console.log('Catalog QA passed: direct file open, 78 cards, filters, search, dialog, annotated view, and mobile overflow.');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

