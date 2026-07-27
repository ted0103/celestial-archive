import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import {cards as sourceCards, GROUPS} from '../src/cards.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const register = JSON.parse(await readFile(resolve(root, 'app/assets/cards/r1/deck-register.json'), 'utf8'));
const assets = new Map(register.cards.map((card) => [card.id, card]));

const practiceByGroup = {
  major: ['Name one choice that expresses this card with care.', '说出一个能谨慎体现这张牌的选择。'],
  wands: ['Choose one small action that gives this energy a clear direction.', '选择一个小行动，让这股能量获得清晰方向。'],
  cups: ['Make room for the feeling, then give it one honest boundary or invitation.', '为这份感受留出空间，再给它一个诚实的边界或邀请。'],
  swords: ['Separate the observable fact from the story, then write the clearest next sentence.', '将可观察的事实与想象区分开，再写下最清楚的下一句话。'],
  pentacles: ['Turn the insight into one practical step you can complete or measure.', '把领悟化为一个可以完成或衡量的实际步骤。'],
};

const productionCards = sourceCards.map((card) => {
  const asset = assets.get(card.id);
  if (!asset?.file) throw new Error(`Missing approved production asset for ${card.id}`);
  const [practiceEn, practiceZh] = practiceByGroup[card.group];
  const suitLabel = card.group === 'major' ? '' : ` · ${card.group.toUpperCase()}`;
  return {
    id: card.id,
    group: card.group,
    kind: card.group === 'major' ? 'major' : 'minor',
    code: `${card.numeral}${suitLabel}`,
    name: card.nameEn,
    zh: card.nameZh,
    motif: card.motif,
    rationale: card.rationale,
    keywords: card.uprightEn.split(',').map((part) => part.trim()).join(' · '),
    keywordsZh: card.uprightZh.replaceAll('、', ' · '),
    meaning: card.uprightEn,
    meaningZh: card.uprightZh,
    shadow: card.reversedEn,
    shadowZh: card.reversedZh,
    reflection: `Where is ${card.uprightEn} asking for your attention rather than certainty?`,
    reflectionZh: `${card.uprightZh}正在何处邀请你保持关注，而不是急于确定？`,
    practice: practiceEn,
    practiceZh,
    src: `assets/cards/r1/${asset.file}`,
    sha256: asset.sha256,
  };
});

const payload = {
  version: 'card-schema@1',
  deckVersion: register.version,
  catalogApprovedAt: register.catalogApprovedAt,
  back: 'assets/cards/r1/approved/card-back-lunar-seal.png',
  groups: GROUPS,
  cards: productionCards,
};

await writeFile(
  resolve(root, 'app/data.js'),
  `window.CELESTIAL_DECK = ${JSON.stringify(payload, null, 2)};\n`,
  'utf8',
);

console.log(`Built production data for ${productionCards.length} named cards.`);
