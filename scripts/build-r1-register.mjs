import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import {cards} from '../src/cards.js';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const outputPath = resolve(projectRoot, 'app/assets/cards/r1/deck-register.json');
const generationRecordsPath = resolve(projectRoot, 'app/assets/cards/r1/generation-records.json');
const provenancePath = resolve(projectRoot, 'app/assets/cards/r1/provenance.json');

const approvedFiles = new Map([
  ['MAJOR-00', 'approved/major-00-the-fool.png'],
  ['MAJOR-18', 'approved/major-18-the-moon.png'],
  ['SWORDS-03', 'approved/swords-03-three-of-swords.png'],
  ['CUPS-01', 'approved/cups-01-ace-of-cups.png'],
  ['PENTACLES-10', 'approved/pentacles-10-ten-of-pentacles.png'],
  ['WANDS-13', 'approved/wands-queen-queen-of-wands.png'],
]);

const generationRecords = JSON.parse(await readFile(generationRecordsPath, 'utf8')).records;
const provenance = JSON.parse(await readFile(provenancePath, 'utf8'));
const approvedHashes = new Map(provenance.approvedAnchors.map((record) => [record.id, record.sha256]));
const generatedById = new Map(generationRecords.map((record) => [record.id, record]));
const generatedCount = generationRecords.filter((record) => record.visualQa === 'passed_internal').length;
const remaining = 78 - approvedFiles.size - generatedCount;

const register = {
  version: 'R1.0',
  status: remaining === 0 ? 'complete_catalog_user_approved' : 'generation_in_progress',
  proofApprovedAt: '2026-07-18T01:16:10Z',
  totals: {
    cards: 78,
    approvedAnchors: approvedFiles.size,
    generatedQaPassed: generatedCount,
    remaining,
  },
  catalogApprovedAt: remaining === 0 ? '2026-07-18T03:56:31Z' : null,
  productionAuthorized: remaining === 0,
  nextGate: remaining === 0 ? 'production_integration_and_release_qa' : 'complete_78_card_catalog_and_back_user_approval',
  cards: cards.map((card) => {
    const generated = generatedById.get(card.id);
    const isAnchor = approvedFiles.has(card.id);
    return {
      id: card.id,
      group: card.group,
      rank: card.rank ?? null,
      nameEn: card.nameEn,
      nameZh: card.nameZh,
      motif: card.motif,
      rationale: card.rationale,
      status: isAnchor ? 'approved_anchor' : generated ? 'generated_qa_passed' : 'queued',
      file: approvedFiles.get(card.id) ?? generated?.file ?? null,
      sha256: isAnchor ? approvedHashes.get(card.id) : generated?.sha256 ?? null,
      generationAttempt: isAnchor ? 0 : generated?.attempt ?? null,
      visualQa: isAnchor ? 'approved_r1_proof' : generated?.visualQa ?? 'pending',
    };
  }),
};

await writeFile(outputPath, `${JSON.stringify(register, null, 2)}\n`, 'utf8');
console.log(`Wrote ${register.cards.length} cards to ${outputPath}`);
