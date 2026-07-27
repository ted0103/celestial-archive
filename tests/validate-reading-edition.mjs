import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import '../app/logic.js';

const deck=JSON.parse((await readFile(new URL('../app/data.js',import.meta.url),'utf8')).replace(/^window\.CELESTIAL_DECK = /,'').replace(/;\s*$/,''));
const paths=[['upright','core'],['upright','tension'],['upright','reflection'],['upright','action'],['reversed','core'],['reversed','tension'],['reversed','reflection'],['reversed','action'],['position','situation'],['position','challenge'],['position','guidance']];
const banned=[/How is .* already visible in your choices/i,/For .* choose one observable step/i,/Situation: .* locates the present pattern/i,/Challenge: .* asks you to address/i,/Guidance: .* recommends a practical response/i,/Where is .* asking for your attention/i,/Turn the insight into one practical step/i,/正在何处邀请你保持关注/,/把领悟化为一个可以完成或衡量的实际步骤/];
const signature=(text,language)=>language==='en'?text.toLowerCase().replace(/[^\p{L}\p{N}'’]+/gu,' ').trim().split(/\s+/).slice(0,6).join(' '):[...text.replace(/[，。？！；：、“”]/g,'')].slice(0,10).join('');
for(const path of paths)for(const language of ['en','zh']){
  const values=deck.cards.map(card=>card[path[0]][path[1]][language]);assert.equal(new Set(values).size,78,`${path.join('.')}.${language} must be card-specific`);
  const counts=new Map;for(const value of values){assert.ok(banned.every(pattern=>!pattern.test(value)),`${path.join('.')}.${language} retains a banned generated frame: ${value}`);const key=signature(value,language);counts.set(key,(counts.get(key)||0)+1);}assert.ok(Math.max(...counts.values())<=3,`${path.join('.')}.${language} excessively reuses a normalized opening`);
}
const {cardText,spreadRelation,synthesizeReading,createReadingSnapshot}=globalThis.CELESTIAL_LOGIC,byId=new Map(deck.cards.map(card=>[card.id,card]));
const direct=['MAJOR-01','WANDS-01','CUPS-01'].map((id,index)=>({...byId.get(id),isReversed:index===1}));
assert.equal(cardText(direct[1],direct[1].isReversed,'challenge').core.en,direct[1].reversed.core.en,'Runtime orientation must not overwrite reversed meanings');
assert.equal(spreadRelation(direct),'direct');
assert.deepEqual(synthesizeReading(direct),synthesizeReading(structuredClone(direct)),'Synthesis must be deterministic');
const precedence=['MAJOR-18','MAJOR-19','MAJOR-20'].map(id=>({...byId.get(id),isReversed:false}));
assert.equal(spreadRelation(precedence),'progression','Challenge-Guidance relation must win over Situation-Challenge');
const input={cards:direct,language:'bilingual',question:'What deserves attention?',readingCreatedAt:'2026-07-27T12:34:56.000Z',meaningEdition:deck.meaningEdition,legacy:false,legacyLabel:''},snapshot=createReadingSnapshot(input),before=JSON.stringify(snapshot);
direct[0].name='Mutated live name';direct[0].upright.core.en='Mutated live meaning';direct[1].position.challenge.zh='实时牌组已改变';direct[2].upright.action.en='Mutated live action';deck.meaningEdition='future-edition';input.language='en';input.question='Changed question';input.readingCreatedAt='2099-01-01T00:00:00.000Z';
assert.equal(JSON.stringify(snapshot),before,'Mutating live deck/input objects changed the saved snapshot');
assert.deepEqual({language:snapshot.language,question:snapshot.question,readingCreatedAt:snapshot.readingCreatedAt,meaningEdition:snapshot.meaningEdition},{language:'bilingual',question:'What deserves attention?',readingCreatedAt:'2026-07-27T12:34:56.000Z',meaningEdition:'CA-MEANINGS-2026.1'});
assert.equal(snapshot.cards[0].name,'The Magician');assert.notEqual(snapshot.cards[0].upright.core.en,direct[0].upright.core.en);assert.notEqual(snapshot.cards[1].position.challenge.zh,direct[1].position.challenge.zh);assert.notEqual(snapshot.groundedAction.en,direct[2].upright.action.en);
assert.throws(()=>{snapshot.cards[0].name='Cannot mutate';},TypeError);assert.equal(JSON.stringify(createReadingSnapshot({snapshot})),before,'Restoring a saved snapshot changed its bytes');
const app=await readFile(new URL('../app/app.js',import.meta.url),'utf8');
assert.match(app,/Legacy record · rendered with current meaning edition/);
assert.match(app,/isReversed:randomOrientation\(\)/,'Draw setup must keep orientation separate from meaning data');
console.log('Reading edition validation passed: exact bilingual schema, relation precedence/direct fallback, deterministic synthesis, immutable snapshots, and explicit legacy labeling.');
