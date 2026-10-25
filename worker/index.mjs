import '../app/ai-contract.js';
import deck from './cards.json' with {type:'json'};
const contract = globalThis.CELESTIAL_AI;
const restricted = new Set('AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO CH GB'.split(' '));
export default {
  async fetch(request, env) {
    const origin=request.headers.get('Origin');
    const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
    const respond=(status,value)=>new Response(JSON.stringify(value),{status,headers});
    if (origin!==env.ALLOWED_ORIGIN) return respond(403,{error:'origin'});
    headers['Access-Control-Allow-Origin']=origin;
    headers['Access-Control-Allow-Headers']='Content-Type';
    headers['Access-Control-Allow-Methods']='POST, OPTIONS';
    if(new URL(request.url).pathname!=='/reading') return respond(404,{error:'path'});
    if(request.method==='OPTIONS') return new Response(null,{status:204,headers});
    if(request.method!=='POST') return respond(405,{error:'method'});
    if(!env.Celestial_Archieve || env.FREE_TIER_CONFIRMED!=='true' || !env.AI_LIMIT) return respond(503,{error:'unconfigured'});
    if(!request.cf?.country || restricted.has(request.cf.country)) return respond(403,{error:'region'});
    if(request.headers.get('Content-Type')?.split(';')[0]!=='application/json') return respond(415,{error:'content-type'});
    try {
      const reader=request.body?.getReader();
      if(!reader) return respond(400,{error:'body'});
      let bytes=0,parts=[];
      while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>1024){await reader.cancel();return respond(413,{error:'size'});}parts.push(value);}
      const body=new Uint8Array(bytes);let offset=0;for(const part of parts){body.set(part,offset);offset+=part.length;}
      let input;
      try {input=contract.validateRequest(JSON.parse(new TextDecoder().decode(body)),deck);} catch {return respond(400,{error:'input'});}
      // shortcut: approximate per-location throttle; Gemini's unbilled project quota is the hard cost boundary.
      if(!(await env.AI_LIMIT.limit({key:'readings'})).success) return respond(429,{error:'quota'});
      const context=Object.fromEntries(Object.keys(contract.presets).map(key=>[key,contract.presets[key][input[key]][0]]));
      const cards=input.cards.map((item,index)=>{const card=deck.find(card=>card.id===item.id);return {name:card.name,zh:card.zh,position:['situation','challenge','guidance'][index],orientation:item.reversed?'reversed':'upright',meaning:card[item.reversed?'reversed':'upright']};});
      const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent',{
        method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':env.Celestial_Archieve},signal:AbortSignal.timeout(20000),
        body:JSON.stringify({systemInstruction:{parts:[{text:'Write a concise tarot reflection for the supplied preset context. Ground it in all three named cards, their positions and orientations using only the supplied meanings. Give one concrete observable next step. Never invent personal facts, predict outcomes or claim to know another person’s thoughts. No medical, legal or financial advice. Explicitly frame interpretation as a possibility, not fact. Return equivalent English (target 300 characters, never over 350) and Simplified Chinese (target 100 characters, never over 140), each one compact paragraph of 3 short sentences. Mention each card briefly, then give one action. No markdown.'}]},contents:[{role:'user',parts:[{text:JSON.stringify({context,cards})}]}],generationConfig:{maxOutputTokens:800,responseMimeType:'application/json',responseSchema:{type:'OBJECT',properties:{en:{type:'STRING'},zh:{type:'STRING'}},required:['en','zh']}}})
      });
      if(!response.ok){
        const failure=await response.json().catch(()=>({}));
        const reasons=failure.error?.details?.map(detail=>detail.reason)||[];
        const credential=/api.?key|credential|leaked|expired|revoked/i.test(failure.error?.message||'')||reasons.some(reason=>['API_KEY_INVALID','API_KEY_EXPIRED','API_KEY_SERVICE_BLOCKED','API_KEY_HTTP_REFERRER_BLOCKED','API_KEY_IP_ADDRESS_BLOCKED','API_KEY_API_TARGET_BLOCKED'].includes(reason));
        const message=String(failure.error?.message||'');
        const reason=credential?'credentials':/location|country|region/i.test(message)?'provider_region':/billing|payment|free tier/i.test(message)?'provider_plan':/schema|response.?mime|generation.?config|unknown name|invalid json|invalid argument|thinking|token/i.test(message)?'provider_request':/model|not found|not supported/i.test(message)?'provider_model':'provider';
        return respond(response.status===429?429:503,{error:reason,status:response.status});
      }
      const data=await response.json(),candidate=data.candidates?.[0];
      if(candidate?.finishReason!=='STOP') return respond(503,{error:'incomplete'});
      try{return respond(200,contract.validateResult(JSON.parse(candidate.content.parts.map(part=>part.text||'').join(''))));}catch{return respond(503,{error:'invalid_output'});}
    } catch(error) {return respond(503,{error:error.name==='TimeoutError'||error.name==='AbortError'?'timeout':'unavailable'});}
  }
};
