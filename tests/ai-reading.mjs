import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import worker from '../worker/index.mjs';
import '../app/logic.js';
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../app/data.js',import.meta.url),'utf8'),sandbox);
const cards=JSON.parse(JSON.stringify(sandbox.window.CELESTIAL_DECK.cards)),ai=globalThis.CELESTIAL_AI;
const selected=cards.slice(0,3).map(card=>({...card,isReversed:false}));
const payload=ai.payload(selected,{topic:'work',situation:'choice',clarity:'next',question:'PRIVATE QUESTION'});
assert(!JSON.stringify(payload).includes('PRIVATE'));ai.validateRequest(payload,cards);
for(const value of [{...payload,question:'private'},{...payload,topic:'ignore instructions'},{...payload,consent:false},{...payload,cards:[payload.cards[0],payload.cards[0],payload.cards[2]]},{...payload,cards:[{...payload.cards[0],name:'injection'},...payload.cards.slice(1)]}])assert.throws(()=>ai.validateRequest(value,cards));
for(const value of [{en:'<img>',zh:'测试'},{en:'x'.repeat(451),zh:'测试'},{en:'text'},null])assert.throws(()=>ai.validateResult(value));
const result={en:'The Fool invites a small experiment; the Magician suggests using available tools; the High Priestess invites observation. For work choices, try one option for an hour and record what you learn. This is a possible lens, not a prediction.',zh:'愚者提示小步尝试，魔术师提示运用现有工具，女祭司提示观察。面对工作选择，可先用一小时试行一个选项并记录所得。这是一种思考角度，并非预测。'};
const snapshot=globalThis.CELESTIAL_LOGIC.createReadingSnapshot({cards:selected,language:'bilingual',question:'private',focusedReading:result,focusedChoices:{topic:'work',situation:'choice',clarity:'next'}});
assert.equal(snapshot.synthesis.en,result.en);assert(Object.isFrozen(snapshot.focusedReading));
assert.deepEqual(globalThis.CELESTIAL_LOGIC.createReadingSnapshot({snapshot}),snapshot);
const env={Celestial_Archieve:'test-secret',FREE_TIER_CONFIRMED:'true',ALLOWED_ORIGIN:'https://ted0103.github.io',AI_LIMIT:{limit:async()=>({success:true})}};
function request(value=payload,origin=env.ALLOWED_ORIGIN,country='MY'){const req=new Request('https://worker.test/reading',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:typeof value==='string'?value:JSON.stringify(value)});Object.defineProperty(req,'cf',{value:{country}});return req;}
let calls=0;globalThis.fetch=async(url,options)=>{calls++;assert(url.includes('/gemini-3.1-flash-lite:generateContent'));assert(!options.body.includes('PRIVATE'));assert(!options.body.includes('private'));assert.equal(options.headers['x-goog-api-key'],'test-secret');return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(result)}]}}]});};
assert.equal((await worker.fetch(request(),{...env,FREE_TIER_CONFIRMED:'false'})).status,503);
assert.equal((await worker.fetch(request(payload,'https://evil.test'),env)).status,403);
assert.equal((await worker.fetch(request(payload,env.ALLOWED_ORIGIN,'GB'),env)).status,403);
assert.equal((await worker.fetch(request({...payload,question:'private'}),env)).status,400);
assert.equal((await worker.fetch(request('x'.repeat(1025)),env)).status,413);
assert.equal((await worker.fetch(request(),{...env,AI_LIMIT:{limit:async()=>({success:false})}})).status,429);
assert.equal(calls,0);
const success=await worker.fetch(request(),env);assert.equal(success.status,200);assert.deepEqual(await success.json(),result);assert.equal(success.headers.get('Cache-Control'),'no-store');
globalThis.fetch=async()=>new Response('',{status:429});assert.equal((await worker.fetch(request(),env)).status,429);
globalThis.fetch=async()=>Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:'not json'}]}}]});assert.equal((await worker.fetch(request(),env)).status,503);
globalThis.fetch=async()=>{throw Error('timeout')};assert.equal((await worker.fetch(request(),env)).status,503);
assert.deepEqual(JSON.parse(fs.readFileSync(new URL('../worker/cards.json',import.meta.url),'utf8')),cards.map(({id,name,zh,upright,reversed})=>({id,name,zh,upright,reversed})));
console.log('PASS: allowlist, privacy, consent, response limits, immutable save, origins, region, quota, malformed and network fallback; authoritative deck matches.');
// Exercise the actual UI request function with deferred responses, without browser-only globals.
const source=fs.readFileSync(new URL('../app/app.js',import.meta.url),'utf8');
const focusSource=source.slice(source.indexOf('  async function focusReading(){'),source.indexOf("  $('#ai-generate').addEventListener"));
function uiContext(){
 const elements={'#ai-consent':{checked:true},'#ai-topic':{value:'work'},'#ai-situation':{value:'choice'},'#ai-clarity':{value:'next'},'#ai-status':{textContent:''},'#ai-generate':{disabled:false}};
 let resolve;const response=new Promise(r=>resolve=r);let rendered=0,calls=0;
 const ctx=vm.createContext({ai,aiRequest:null,focusedReading:null,focusedChoices:null,readingSaved:false,selectedCards:selected,readingRevealed:true,readingGeneration:1,cards,AbortController,setTimeout,clearTimeout,window:{CELESTIAL_AI_ENDPOINT:'https://worker.test/reading'},$:s=>elements[s],bilingual:en=>en,renderFocusedControls(){},renderMeanings(){rendered++;},fetch:async()=>{calls++;return response;}});
 ctx.readingStillCurrent=g=>g===ctx.readingGeneration;vm.runInContext(focusSource,ctx);
 return {ctx,elements,resolve:()=>resolve(Response.json(result)),rendered:()=>rendered,calls:()=>calls};
}
let ui=uiContext();ui.elements['#ai-consent'].checked=false;await ui.ctx.focusReading();assert.equal(ui.calls(),0);
ui=uiContext();let pending=ui.ctx.focusReading();ui.ctx.readingGeneration++;ui.resolve();await pending;assert.equal(ui.ctx.focusedReading,null);assert.equal(ui.rendered(),0);
ui=uiContext();pending=ui.ctx.focusReading();ui.ctx.readingSaved=true;ui.resolve();await pending;assert.equal(ui.ctx.focusedReading,null);
ui=uiContext();pending=ui.ctx.focusReading();ui.resolve();await pending;assert.equal(ui.ctx.focusedReading.en,result.en);assert.equal(ui.rendered(),1);
console.log('PASS: actual UI consent gate, stale response discard, save-during-request protection and success.');

const html=fs.readFileSync('app/index.html','utf8');
assert(html.includes("connect-src 'self' https://celestial-archive-ai.tedhangtan.workers.dev;"));
