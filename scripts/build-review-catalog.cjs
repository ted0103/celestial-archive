const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

const sourceHtml = read('design/catalog.html');
const deckArtworkFilename = 'engraved-tarot-reference-enhanced-4x.webp';
const deckArtworkPath = `../references/${deckArtworkFilename}`;
const deckArtwork = fs.readFileSync(path.join(root, 'references', deckArtworkFilename));
const deckArtworkDataUrl = `data:image/webp;base64,${deckArtwork.toString('base64')}`;
const fontWeights = [400, 500, 600, 700];
const css = fontWeights.reduce((result, weight) => {
  const filename = `jetbrains-mono-${weight}.ttf`;
  const buffer = fs.readFileSync(path.join(root, 'design', 'fonts', filename));
  return result.replace(
    `./fonts/${filename}`,
    `data:font/ttf;base64,${buffer.toString('base64')}`,
  );
}, read('design/catalog.css'));
const cards = read('src/cards.js').replace(/^export\s+/gm, '');
const renderer = read('src/card-renderer.js').replace(/^export\s+/gm, '');
const catalog = read('design/catalog.js').replace(/^import[^;]+;\s*/gm, '');

const bundled = sourceHtml
  .replaceAll(deckArtworkPath, deckArtworkDataUrl)
  .replace('<link rel="stylesheet" href="./catalog.css">', `<style>\n${css}\n</style>`)
  .replace('<script type="module" src="./catalog.js"></script>', `<script type="module">\n${cards}\n${renderer}\n${catalog}\n</script>`);

const output = path.join(root, 'design', 'catalog-review.html');
fs.writeFileSync(output, bundled);
console.log(`Built ${path.relative(root, output)} (${Buffer.byteLength(bundled).toLocaleString()} bytes).`);
