import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const require = createRequire(import.meta.url);
const {chromium} = require('/Users/_ted/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const CARD_WIDTH = 1024;
const CARD_HEIGHT = 1536;
const GOLD = '#d4a74f';
const BLACK = '#070b0d';

const TYPOGRAPHY = Object.freeze({
  family: 'Ferrum',
  titleSize: 56,
  numeralSize: 76,
  letterSpacing: 3,
  horizontalScale: 1.35,
  titleCenterX: CARD_WIDTH / 2,
  titleBaselineY: 1480,
  numeralCenterX: CARD_WIDTH / 2,
  numeralBaselineY: 116,
});

const args = process.argv.slice(2);
let jobs;

if (args[0] === '--all') {
  const {cards} = await import('../src/cards.js');
  jobs = cards
    .map((card) => ({
      inputPath: path.resolve(`references/redesign-v6-art/${card.id}.png`),
      outputPath: path.resolve(`references/redesign-v6-final/${card.id}.png`),
      title: card.nameEn,
      numeral: card.numeral,
    }))
    .filter((job) => fs.existsSync(job.inputPath));
} else {
  const [inputPath, outputPath, title, numeral] = args;
  if (!inputPath || !outputPath || !title || numeral === undefined) {
    console.error('Usage: node scripts/apply-card-typography.mjs <input> <output> <title> <numeral> | --all');
    process.exit(1);
  }
  jobs = [{inputPath: path.resolve(inputPath), outputPath: path.resolve(outputPath), title, numeral}];
}

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const fontPath = path.resolve('design/fonts/ferrum.otf');
const fontData = fs.readFileSync(fontPath).toString('base64');
const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  headless: true,
  ...(fs.existsSync(systemChrome) ? {executablePath: systemChrome} : {}),
});

try {
  const page = await browser.newPage({viewport: {width: CARD_WIDTH, height: CARD_HEIGHT}, deviceScaleFactor: 1});
  for (const {inputPath, outputPath, title, numeral} of jobs) {
    if (!fs.existsSync(inputPath)) throw new Error(`Input does not exist: ${inputPath}`);
    fs.mkdirSync(path.dirname(outputPath), {recursive: true});
    const imageMime = path.extname(inputPath).toLowerCase() === '.webp' ? 'image/webp' : 'image/png';
    const imageData = fs.readFileSync(inputPath).toString('base64');
    await page.setContent(`<!doctype html>
    <html><head><style>
      @font-face { font-family: "FerrumDeck"; src: url(data:font/otf;base64,${fontData}) format("opentype"); font-weight:400; }
      * { box-sizing:border-box; }
      html,body { width:${CARD_WIDTH}px; height:${CARD_HEIGHT}px; margin:0; overflow:hidden; background:${BLACK}; }
      .card { position:relative; width:100%; height:100%; }
      .art { position:absolute; inset:0; width:100%; height:100%; object-fit:fill; }
      .bay { position:absolute; left:132px; top:1384px; width:760px; height:122px; border:5px solid ${GOLD}; border-radius:18px; background:${BLACK}; box-shadow:inset 0 0 0 8px ${BLACK}, inset 0 0 0 10px color-mix(in srgb, ${GOLD} 80%, transparent); }
      .medallion { position:absolute; left:451px; top:30px; width:122px; height:122px; border:5px solid ${GOLD}; border-radius:50%; background:${BLACK}; box-shadow:inset 0 0 0 8px ${BLACK}, inset 0 0 0 10px color-mix(in srgb, ${GOLD} 80%, transparent); }
      .label { position:absolute; display:flex; align-items:center; justify-content:center; color:${GOLD}; font-family:"FerrumDeck", serif; font-weight:400; line-height:1; letter-spacing:${TYPOGRAPHY.letterSpacing}px; white-space:nowrap; }
      .label > span { display:inline-block; transform:scaleX(${TYPOGRAPHY.horizontalScale}); transform-origin:50% 50%; }
      .title { left:132px; top:1388px; width:760px; height:114px; font-size:${TYPOGRAPHY.titleSize}px; padding-top:3px; }
      .numeral { left:451px; top:31px; width:122px; height:119px; font-size:${TYPOGRAPHY.numeralSize}px; padding-top:2px; }
    </style></head><body>
      <div class="card">
        <img class="art" src="data:${imageMime};base64,${imageData}" alt="">
        <div class="bay"></div><div class="medallion"></div>
        <div class="label title"><span>${escapeHtml(title.toUpperCase())}</span></div>
        <div class="label numeral"><span>${escapeHtml(numeral)}</span></div>
      </div>
    </body></html>`, {waitUntil: 'load'});
    await page.evaluate(() => document.fonts.ready);
    const titleWidth = await page.locator('.title span').evaluate((element) => element.getBoundingClientRect().width);
    if (titleWidth > 710) throw new Error(`Fixed title size overflow: ${title} renders at ${titleWidth.toFixed(1)}px`);
    await page.screenshot({path: outputPath});
    console.log(outputPath);
  }
} finally {
  await browser.close();
}
