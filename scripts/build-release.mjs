import {createHash} from 'node:crypto';
import {cp,mkdir,readFile,readdir,rm,stat,writeFile} from 'node:fs/promises';
import {extname,join,relative,resolve,sep} from 'node:path';
import sharp from 'sharp';

const root=resolve(import.meta.dirname,'..');
const source=resolve(root,'app');
const output=resolve(root,'dist');
const coreLimit=35*1024*1024;
const gestureLimit=14*1024*1024;

const textFiles=['index.html','logic.js','app.js','manifest.webmanifest'];
const staticFiles=[
  'assets/fonts/jetbrains-mono-400.ttf','assets/fonts/jetbrains-mono-700.ttf','assets/fonts/celestial-cjk.ttf','assets/fonts/OFL-NotoSansSC.txt',
  'assets/icons/icon-192.png','assets/icons/icon-512.png','assets/icons/apple-touch-icon.png'
];
const gestureFiles=[
  'assets/vendor/mediapipe-hands/hands.js','assets/vendor/mediapipe-hands/hands.binarypb','assets/vendor/mediapipe-hands/hand_landmark_lite.tflite',
  'assets/vendor/mediapipe-hands/hands_solution_packed_assets_loader.js','assets/vendor/mediapipe-hands/hands_solution_packed_assets.data',
  'assets/vendor/mediapipe-hands/hands_solution_simd_wasm_bin.js','assets/vendor/mediapipe-hands/hands_solution_simd_wasm_bin.wasm',
  'assets/vendor/mediapipe-hands/hands_solution_simd_wasm_bin.data','assets/vendor/mediapipe-hands/LICENSE.txt'
];

await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});

const dataRaw=await readFile(resolve(source,'data.js'),'utf8');
const registry=JSON.parse(dataRaw.replace(/^window\.CELESTIAL_DECK = /,'').replace(/;\s*$/,''));
const cssRaw=await readFile(resolve(source,'styles.css'),'utf8');
const cssImages=[...cssRaw.matchAll(/url\((['"]?)(assets\/[^'"\)]+)\1\)/g)].map(match=>match[2]).filter(path=>/\.(png|jpe?g)$/i.test(path));
const imageSources=[...new Set([...registry.cards.map(card=>card.src),registry.back,...cssImages])];
const imageMap=new Map(imageSources.map(path=>[path,path.replace(/\.(png|jpe?g)$/i,'.webp')]));

for(const file of textFiles)await copyFile(file);
for(const file of [...staticFiles,...gestureFiles])await copyFile(file);

for(const path of imageSources){
  const destination=imageMap.get(path);await mkdir(resolve(output,destination,'..'),{recursive:true});
  const card=path.includes('/cards/');await sharp(resolve(source,path)).webp({quality:card?86:82,effort:6,smartSubsample:true}).toFile(resolve(output,destination));
}

const releaseRegistry={...registry,back:imageMap.get(registry.back),cards:registry.cards.map(card=>({...card,src:imageMap.get(card.src)}))};
await writeFile(resolve(output,'data.js'),`window.CELESTIAL_DECK = ${JSON.stringify(releaseRegistry,null,2)};\n`);
await writeFile(resolve(output,'styles.css'),cssRaw.replace(/url\((['"]?)(assets\/[^'"\)]+)\1\)/g,(whole,quote,path)=>imageMap.has(path)?`url(${quote}${imageMap.get(path)}${quote})`:whole));

const files=await walk(output),entries=[];
for(const absolute of files){const url=relative(output,absolute).split(sep).join('/'),bytes=await readFile(absolute),pack=url.startsWith('assets/vendor/mediapipe-hands/')?'gesture':'core';entries.push({url:`./${url}`,bytes:bytes.length,mime:mimeFor(url),sha256:createHash('sha256').update(bytes).digest('hex'),pack});}
entries.sort((a,b)=>a.url.localeCompare(b.url));
const releaseId=createHash('sha256').update(JSON.stringify(entries)).digest('hex').slice(0,16),coreBytes=sum(entries,'core'),gestureBytes=sum(entries,'gesture');
if(coreBytes>coreLimit)throw new Error(`Core release is ${(coreBytes/1048576).toFixed(2)} MiB; limit is 35 MiB.`);
if(gestureBytes>gestureLimit)throw new Error(`Gesture pack is ${(gestureBytes/1048576).toFixed(2)} MiB; limit is 14 MiB.`);

await writeFile(resolve(output,'asset-manifest.json'),JSON.stringify({releaseId,generatedAt:new Date().toISOString(),totals:{coreBytes,gestureBytes},files:entries},null,2));
await writeFile(resolve(output,'sw.js'),serviceWorker(releaseId,entries));
await copyDeploymentFile('.well-known/assetlinks.json');
await writeFile(resolve(output,'.nojekyll'),'');
console.log(`Built dist/ release ${releaseId}: Core ${(coreBytes/1048576).toFixed(2)} MiB, Gesture ${(gestureBytes/1048576).toFixed(2)} MiB, ${entries.length} allowlisted files.`);

async function copyFile(path){const from=resolve(source,path),to=resolve(output,path);if(!from.startsWith(`${source}${sep}`)||!to.startsWith(`${output}${sep}`))throw new Error(`Unsafe release path: ${path}`);await mkdir(resolve(to,'..'),{recursive:true});await cp(from,to);}
async function copyDeploymentFile(path){const from=resolve(root,'deployment',path),to=resolve(output,path);await mkdir(resolve(to,'..'),{recursive:true});await cp(from,to);}
async function walk(directory){const results=[];for(const entry of await readdir(directory,{withFileTypes:true})){const path=join(directory,entry.name);if(entry.isDirectory())results.push(...await walk(path));else if(entry.isFile())results.push(path);}return results;}
function sum(items,pack){return items.filter(item=>item.pack===pack).reduce((total,item)=>total+item.bytes,0);}
function mimeFor(path){return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.wasm':'application/wasm','.tflite':'application/octet-stream','.binarypb':'application/octet-stream','.data':'application/octet-stream','.txt':'text/plain; charset=utf-8'}[extname(path).toLowerCase()]||'application/octet-stream');}
function serviceWorker(releaseId,items){const version='20260722-2',shell=['./','./index.html',`./styles.css?v=${version}`,`./data.js?v=${version}`,`./logic.js?v=${version}`,`./app.js?v=${version}`,'./manifest.webmanifest'],core=items.filter(item=>item.pack==='core').map(item=>item.url),gesture=items.filter(item=>item.pack==='gesture').map(item=>item.url);return `const RELEASE_ID=${JSON.stringify(releaseId)};\nconst SHELL_CACHE='celestial-shell-'+RELEASE_ID;\nconst CORE_CACHE='celestial-core-'+RELEASE_ID;\nconst GESTURE_CACHE='celestial-gesture-'+RELEASE_ID;\nconst ACTIVE_CACHES=new Set([SHELL_CACHE,CORE_CACHE,GESTURE_CACHE]);\nconst SHELL=${JSON.stringify(shell)};\nconst PACKS={core:${JSON.stringify(core)},gesture:${JSON.stringify(gesture)}};\nself.addEventListener('install',event=>event.waitUntil(Promise.all([caches.open(SHELL_CACHE).then(cache=>cache.addAll(SHELL)),self.skipWaiting()])));\nself.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('celestial-')&&!ACTIVE_CACHES.has(key)).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));\nself.addEventListener('message',event=>{const data=event.data||{},source=event.source;if(data.type==='PACK_STATUS'){event.waitUntil(Promise.all([packReady('core'),packReady('gesture')]).then(([core,gesture])=>source?.postMessage({type:'PACK_STATUS',core,gesture,releaseId:RELEASE_ID})));return;}if(data.type!=='PREPARE_PACK'||!PACKS[data.pack])return;const pack=data.pack,cacheName=pack==='core'?CORE_CACHE:GESTURE_CACHE;event.waitUntil(caches.open(cacheName).then(async cache=>{let complete=0;for(const url of PACKS[pack]){const cached=await cache.match(url);if(!cached){const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error('Failed '+url);await cache.put(url,response);}complete++;source?.postMessage({type:'PACK_PROGRESS',pack,complete,total:PACKS[pack].length,releaseId:RELEASE_ID});}source?.postMessage({type:'PACK_READY',pack,releaseId:RELEASE_ID});}).catch(()=>source?.postMessage({type:'PACK_ERROR',pack,releaseId:RELEASE_ID})));});\nasync function packReady(pack){const cache=await caches.open(pack==='core'?CORE_CACHE:GESTURE_CACHE);for(const url of PACKS[pack])if(!await cache.match(url))return false;return true;}\nself.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));return;}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});\n`;}
