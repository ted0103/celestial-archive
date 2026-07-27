import assert from 'node:assert/strict';
import {cards, majorCards, minorCards, SUIT_META} from '../src/cards.js';

assert.equal(cards.length, 78, 'Deck must contain exactly 78 cards');
assert.equal(majorCards.length, 22, 'Deck must contain 22 Major Arcana');
assert.equal(minorCards.length, 56, 'Deck must contain 56 Minor Arcana');
assert.equal(new Set(cards.map((card) => card.id)).size, 78, 'Card IDs must be unique');

for (const [suit, meta] of Object.entries(SUIT_META)) {
  const suitCards = cards.filter((card) => card.group === suit);
  assert.equal(suitCards.length, 14, `${meta.nameEn} must contain 14 cards`);
  assert.deepEqual(suitCards.map((card) => card.rankIndex), Array.from({length: 14}, (_, index) => index + 1));
}

assert.equal(majorCards[0].id, 'MAJOR-00');
assert.equal(majorCards[0].numeral, '0');
assert.equal(majorCards[8].nameEn, 'Strength');
assert.equal(majorCards[8].numeral, 'VIII');
assert.equal(majorCards[11].nameEn, 'Justice');
assert.equal(majorCards[11].numeral, 'XI');

for (const card of cards) {
  for (const field of ['id', 'nameEn', 'nameZh', 'motif', 'rationale', 'uprightEn', 'uprightZh', 'reversedEn', 'reversedZh', 'accent']) {
    assert.equal(typeof card[field], 'string', `${card.id}.${field} must be a string`);
    assert.ok(card[field].trim().length > 0, `${card.id}.${field} must not be empty`);
  }
  assert.match(card.accent, /^#[0-9a-f]{6}$/i, `${card.id}.accent must be a 6-digit hex color`);
}

const motifCount = new Set(cards.map((card) => card.motif)).size;
assert.equal(motifCount, 78, 'Every card must have a distinct motif label');

console.log(`Validated ${cards.length} cards: 22 Major Arcana + 56 Minor Arcana.`);
console.log(`Unique motif labels: ${motifCount}.`);

