import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const r1Root = resolve(projectRoot, 'app/assets/cards/r1');
const register = JSON.parse(await readFile(resolve(r1Root, 'deck-register.json'), 'utf8'));
const provenance = JSON.parse(await readFile(resolve(r1Root, 'provenance.json'), 'utf8'));
const back = provenance.approvedAnchors.find((item) => item.id === 'CARD-BACK');

const payload = {
  version: register.version,
  status: register.status,
  totals: register.totals,
  catalogApprovedAt: register.catalogApprovedAt,
  productionAuthorized: register.productionAuthorized,
  nextGate: register.nextGate,
  generatedAt: '2026-07-18',
  back: {
    id: back.id,
    nameEn: 'Universal Lunar Back',
    nameZh: '通用月相牌背',
    group: 'back',
    motif: 'lunar seal',
    rationale: 'A rotationally balanced lunar-phase seal shared by the entire deck.',
    status: 'approved_anchor',
    file: `../${back.file}`,
    sha256: back.sha256,
  },
  cards: register.cards.map((card) => ({...card, file: `../${card.file}`})),
};

await writeFile(
  resolve(r1Root, 'catalog/catalog-data.js'),
  `window.R1_CATALOG = ${JSON.stringify(payload, null, 2)};\n`,
  'utf8',
);
console.log(`Prepared catalog data for ${payload.cards.length} faces plus one back.`);
