import {createHash} from 'node:crypto';
import {readFile, readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(projectRoot, 'app/assets/cards/r1');
const register = JSON.parse(await readFile(resolve(root, 'deck-register.json'), 'utf8'));
const provenance = JSON.parse(await readFile(resolve(root, 'provenance.json'), 'utf8'));
const rejected = new Set((await readdir(resolve(root, 'rejected'))).filter((name) => name.endsWith('.png')));
const failures = [];

if (register.cards.length !== 78) failures.push(`Expected 78 cards, received ${register.cards.length}`);
if (register.totals.approvedAnchors !== 6) failures.push('Expected 6 approved face anchors');
if (register.totals.generatedQaPassed !== 72) failures.push('Expected 72 generated QA-passed faces');
if (register.totals.remaining !== 0) failures.push('Expected zero remaining faces');
if (register.productionAuthorized !== true) failures.push('Production authorization must record the explicit second-gate approval');

const ids = new Set();
const files = new Set();
const hashes = new Set();
const englishNames = new Set();
const chineseNames = new Set();
const entries = [
  ...register.cards,
  ...provenance.approvedAnchors.filter((item) => item.id === 'CARD-BACK').map((item) => ({...item, status: 'approved_anchor'})),
];

for (const entry of entries) {
  if (ids.has(entry.id)) failures.push(`Duplicate id: ${entry.id}`);
  ids.add(entry.id);
  if (!entry.file) { failures.push(`Missing file path: ${entry.id}`); continue; }
  if (files.has(entry.file)) failures.push(`Duplicate file path: ${entry.file}`);
  files.add(entry.file);
  if (entry.file.includes('/rejected/') || rejected.has(entry.file.split('/').at(-1))) failures.push(`Rejected file referenced: ${entry.id}`);
  const bytes = await readFile(resolve(root, entry.file));
  if (bytes.toString('ascii', 1, 4) !== 'PNG') failures.push(`Not a PNG: ${entry.id}`);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== 1024 || height !== 1536) failures.push(`${entry.id} is ${width}x${height}, expected 1024x1536`);
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (entry.sha256 !== hash) failures.push(`Hash mismatch: ${entry.id}`);
  if (hashes.has(hash)) failures.push(`Duplicate image bytes: ${entry.id}`);
  hashes.add(hash);
}

for (const card of register.cards) {
  if (!card.nameEn?.trim() || !card.nameZh?.trim()) failures.push(`Missing bilingual name: ${card.id}`);
  if (englishNames.has(card.nameEn)) failures.push(`Duplicate English name: ${card.nameEn}`);
  if (chineseNames.has(card.nameZh)) failures.push(`Duplicate Chinese name: ${card.nameZh}`);
  englishNames.add(card.nameEn);
  chineseNames.add(card.nameZh);
}

if (englishNames.size !== 78 || chineseNames.size !== 78) failures.push('Expected 78 unique English names and 78 unique Chinese names');

if (entries.length !== 79) failures.push(`Expected 79 total raster assets, received ${entries.length}`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('R1 asset validation passed: 78 uniquely named faces + 1 unique back, all 1024x1536, hashes locked, second gate approved.');
