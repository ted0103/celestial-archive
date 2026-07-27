const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const url = `file://${path.join(root, 'index.html')}`;
const out = __dirname;
const results = {checkedAt: new Date().toISOString(), consoleErrors: [], checks: {}};

async function shot(page, name) {
  await page.screenshot({path: path.join(out, `${name}.png`), fullPage: false});
}

async function enter(page) {
  await page.goto(url, {waitUntil: 'load'});
  if (await page.locator('#opening-skip').isVisible().catch(() => false)) {
    await page.click('#opening-skip');
    await page.waitForTimeout(900);
  }
  await page.click('#enter-button');
  await page.waitForTimeout(1650);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream']
  });

  const desktop = await browser.newPage({viewport: {width: 1440, height: 900}, deviceScaleFactor: 1});
  desktop.on('console', message => {if (message.type() === 'error') results.consoleErrors.push(message.text());});
  await desktop.goto(url, {waitUntil: 'load'});
  await desktop.waitForTimeout(1900);
  await shot(desktop, '00-opening-sequence-desktop');
  results.checks.openingSequenceVisible = await desktop.locator('#opening-sequence:not([hidden])').count() === 1;
  await desktop.click('#opening-skip');
  await desktop.waitForTimeout(140);
  results.checks.introAndCollageOverlap = await desktop.locator('#opening-sequence.is-ending').count() === 1 && await desktop.locator('#entry[data-arrival="playing"]').count() === 1;
  await desktop.waitForTimeout(2160);
  results.checks.entryArrivalAnimation = await desktop.locator('#entry').getAttribute('data-arrival') === 'playing';
  await shot(desktop, '01-entry-desktop');
  await desktop.click('#enter-button');
  await desktop.waitForTimeout(1650);
  await shot(desktop, '02-gateway-desktop');
  results.checks.stagedGatewayElements = await desktop.locator('[data-view="gateway"] .scene-element.is-scene-visible').count() >= 7;

  await desktop.click('[data-route="ritual"]');
  await desktop.waitForTimeout(800);
  await desktop.click('#begin-ritual');
  await desktop.locator('.deck-choice').nth(1).evaluate(element => element.click());
  await desktop.waitForTimeout(360);
  results.checks.cardFlightBetweenDeckAndSlot = await desktop.locator('.deal-clone').count() === 1 && await desktop.locator('.reading-slot.is-awaiting-deal').count() === 1;
  await shot(desktop, '02a-card-draw-flight-desktop');
  await desktop.locator('.deck-choice').nth(4).evaluate(element => element.click());
  await desktop.waitForTimeout(220);
  await desktop.locator('.deck-choice').nth(7).evaluate(element => element.click());
  await desktop.click('#reveal-cards');
  await desktop.waitForTimeout(1200);
  await shot(desktop, '03a-cinematic-reveal-desktop');
  results.checks.cinematicRevealVisible = await desktop.locator('#reveal-cinema.is-active').count() === 1;
  await desktop.waitForTimeout(500);
  results.checks.revealStagesSeparated = await desktop.locator('#reveal-cinema.is-flipping').count() === 1;
  await desktop.waitForTimeout(3400);
  await shot(desktop, '03-ritual-reveal-desktop');
  results.checks.threeCardReveal = await desktop.locator('.tarot-card.is-flipped').count() === 3;
  results.checks.detailedMeanings = await desktop.locator('.meaning-depth').count() === 3 && await desktop.locator('.reading-detail').count() === 3;

  const downloadPromise = desktop.waitForEvent('download', {timeout: 8000}).catch(() => null);
  await desktop.click('#export-reading');
  const download = await downloadPromise;
  if (download) {
    const reportPath = path.join(out, 'meaning-report-proof.png');
    await download.saveAs(reportPath);
    results.checks.imageExport = true;
    const header = fs.readFileSync(reportPath);
    results.checks.exportDimensions = header.readUInt32BE(16) === 3200 && header.readUInt32BE(20) === 1800;
  } else results.checks.imageExport = false;
  if (!download) results.checks.exportDimensions = false;

  await desktop.mouse.click(1120, 180);
  await desktop.waitForTimeout(120);
  results.checks.clickParticles = Number(await desktop.locator('#click-particle-canvas').getAttribute('data-particles')) > 0;

  await desktop.click('.brand');
  await desktop.waitForTimeout(650);
  await desktop.click('[data-route="arcana"]');
  await desktop.waitForTimeout(650);
  await shot(desktop, '04-arcana-desktop');
  results.checks.sixProofFaces = await desktop.locator('.arcana-item:not([hidden])').count() === 6;
  await desktop.locator('.arcana-item').first().click();
  await desktop.waitForTimeout(900);
  results.checks.detailFlipsFromBack = await desktop.locator('#dialog-card .tarot-card.is-flipped').count() === 1;
  await shot(desktop, '05-card-detail-desktop');
  await desktop.click('#card-dialog .dialog-close');

  await desktop.click('.brand');
  await desktop.waitForTimeout(600);
  await desktop.click('[data-route="chamber"]');
  await desktop.waitForTimeout(700);
  await desktop.click('#gallery-next');
  await desktop.waitForTimeout(700);
  await shot(desktop, '06-reading-chamber-desktop');
  results.checks.singleGalleryFocus = await desktop.locator('.session-card.is-selected').count() === 1;

  await desktop.click('.brand');
  await desktop.waitForTimeout(600);
  await desktop.click('[data-route="grimoire"]');
  await desktop.waitForTimeout(700);
  await desktop.locator('.chapter-button').nth(4).click();
  await shot(desktop, '07-grimoire-desktop');

  await desktop.click('#settings-toggle');
  await desktop.waitForTimeout(650);
  await shot(desktop, '08-settings-desktop');
  await desktop.click('[data-close="settings"]');
  await desktop.click('#review-toggle');
  await desktop.waitForTimeout(650);
  await shot(desktop, '09-review-manifest-desktop');
  results.checks.finiteReviewManifest = (await desktop.locator('.review-item').count()) > 40;
  results.checks.cardImagesLoaded = await desktop.evaluate(() => [...document.images].filter(img => img.offsetParent !== null).every(img => img.complete && img.naturalWidth > 0));

  const mobile = await browser.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 1});
  mobile.on('console', message => {if (message.type() === 'error') results.consoleErrors.push(`mobile: ${message.text()}`);});
  await enter(mobile);
  await shot(mobile, '10-gateway-phone');
  results.checks.phoneGatewayNoHorizontalOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  await mobile.click('#settings-toggle');
  await mobile.click('[data-language="zh"]');
  await mobile.waitForTimeout(300);
  await mobile.click('[data-close="settings"]');
  await mobile.click('[data-route="arcana"]');
  await mobile.waitForTimeout(650);
  await shot(mobile, '11-arcana-phone-zh');
  results.checks.phoneZhNoHorizontalOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  results.checks.zhModeActive = await mobile.evaluate(() => document.documentElement.dataset.language === 'zh');

  const camera = await browser.newPage({viewport: {width: 1280, height: 800}, deviceScaleFactor: 1});
  camera.on('console', message => {if (message.type() === 'error') results.consoleErrors.push(`camera: ${message.text()}`);});
  await enter(camera);
  await camera.click('[data-route="ritual"]');
  await camera.waitForTimeout(700);
  await camera.click('#hand-ritual');
  await camera.waitForTimeout(5400);
  results.checks.cameraGestureStream = await camera.evaluate(() => Boolean(window.__celestialCamera?.active && document.querySelector('#gesture-video')?.srcObject?.active));
  results.checks.cameraIdleDoesNotSelect = await camera.locator('.deck-choice.is-picked').count() === 0;
  await camera.evaluate(() => window.__celestialCamera?.testZone(1));
  results.checks.cameraGestureSelects = await camera.locator('.deck-choice.is-picked').count() === 1;
  await shot(camera, '12-camera-gesture-desktop');
  await camera.evaluate(() => window.__celestialCamera?.stop());
  await camera.close();

  await desktop.goto(`file://${path.join(root, 'card-palette-review.html')}`, {waitUntil: 'load'});
  await desktop.setViewportSize({width: 1440, height: 1000});
  await desktop.screenshot({path: path.join(out, '13-card-palette-review.png'), fullPage: true});
  results.checks.revisionTwoPaletteSheet = await desktop.locator('.card img').count() === 7 && await desktop.evaluate(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));

  await browser.close();
  results.passed = Object.values(results.checks).every(Boolean) && results.consoleErrors.length === 0;
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  process.exitCode = results.passed ? 0 : 1;
})().catch(error => {
  console.error(error);
  process.exit(1);
});
