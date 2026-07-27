import {createHash} from 'node:crypto';
import {readFile,readdir,stat} from 'node:fs/promises';
import {join,relative,resolve,sep} from 'node:path';

const root=resolve(import.meta.dirname,'..'),dist=resolve(root,'dist'),failures=[];
const manifest=JSON.parse(await readFile(resolve(dist,'asset-manifest.json'),'utf8'));
const expected=new Set(manifest.files.map(file=>file.url.replace(/^\.\//,'')));
const deploymentOnly=new Set(['.nojekyll','.well-known/assetlinks.json']);
const actual=new Set((await walk(dist)).map(path=>relative(dist,path).split(sep).join('/')).filter(path=>!['asset-manifest.json','sw.js'].includes(path)&&!deploymentOnly.has(path)));

for(const path of expected)if(!actual.has(path))failures.push(`Manifest file missing: ${path}`);
for(const path of actual)if(!expected.has(path))failures.push(`Unknown release file: ${path}`);
for(const entry of manifest.files){const path=resolve(dist,entry.url.replace(/^\.\//,'')),bytes=await readFile(path),hash=createHash('sha256').update(bytes).digest('hex');if(bytes.length!==entry.bytes)failures.push(`Byte length mismatch: ${entry.url}`);if(hash!==entry.sha256)failures.push(`SHA-256 mismatch: ${entry.url}`);if(!entry.mime)failures.push(`Missing MIME: ${entry.url}`);}

const core=manifest.files.filter(file=>file.pack==='core'),gesture=manifest.files.filter(file=>file.pack==='gesture'),coreBytes=core.reduce((sum,file)=>sum+file.bytes,0),gestureBytes=gesture.reduce((sum,file)=>sum+file.bytes,0);
if(coreBytes>35*1024*1024)failures.push(`Core exceeds 35 MiB: ${coreBytes}`);
if(gestureBytes>20*1024*1024)failures.push(`Gesture exceeds 20 MiB: ${gestureBytes}`);
for(const file of core)if(file.bytes>2.5*1024*1024)failures.push(`Core file exceeds 2.5 MiB: ${file.url}`);
for(const file of gesture)if(file.url.endsWith('.wasm')?file.bytes>6*1024*1024:file.bytes>5*1024*1024)failures.push(`Gesture file exceeds its exception budget: ${file.url}`);

const dataRaw=await readFile(resolve(dist,'data.js'),'utf8'),data=JSON.parse(dataRaw.replace(/^window\.CELESTIAL_DECK = /,'').replace(/;\s*$/,'')),css=await readFile(resolve(dist,'styles.css'),'utf8'),html=await readFile(resolve(dist,'index.html'),'utf8'),sw=await readFile(resolve(dist,'sw.js'),'utf8'),pkg=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
const assetLinks=JSON.parse(await readFile(resolve(dist,'.well-known/assetlinks.json'),'utf8'));
if(data.cards.length!==78||data.cards.some(card=>!card.src.endsWith('.webp'))||!data.back.endsWith('.webp'))failures.push('Release registry does not contain 78 optimized WebP faces plus the back');
if(/assets\/(cards|backgrounds)\/[^)'"\s]+\.(png|jpe?g)/i.test(css))failures.push('Release CSS still references an unoptimized card/background image');
if([...actual].some(path=>/rejected|catalog|prompt|provenance/i.test(path)))failures.push('Non-runtime review/source material leaked into dist');
if(!html.includes('rel="manifest"')||!html.includes('Content-Security-Policy')||!sw.includes(manifest.releaseId)||!sw.includes('PACK_PROGRESS')||!sw.includes('PACK_STATUS')||sw.includes('self.skipWaiting()')||!sw.includes("data.type==='RELEASE_ID'")||!sw.includes("event.request.mode==='navigate'"))failures.push('Manifest, meta CSP, release-bound update-safe worker, or resumable pack messaging is missing');
for(const match of html.matchAll(/(?:href|src)="([^"#]+\?v=[^"]+)"/g))if(!sw.includes(`./${match[1]}`))failures.push(`Service worker shell version mismatch: ${match[1]}`);
if(pkg.dependencies['@mediapipe/hands']!=='0.4.1675469240'||pkg.devDependencies?.sharp!=='0.35.3')failures.push('MediaPipe runtime or Sharp build encoder is not exactly pinned');
if(assetLinks[0]?.target?.package_name!=='io.github.ted0103.twa'||assetLinks[0]?.target?.sha256_cert_fingerprints?.length!==1)failures.push('Root Digital Asset Links association is missing or malformed');
for(const path of ['assets/fonts/OFL-NotoSansSC.txt','assets/vendor/mediapipe-hands/LICENSE.txt','assets/icons/icon-192.png','assets/icons/icon-512.png'])if(!actual.has(path))failures.push(`Required release notice/icon missing: ${path}`);
for(const path of ['assets/audio/celestial-ambient.mp3','assets/vendor/mediapipe-hands/hands_solution_simd_wasm_bin.js','assets/vendor/mediapipe-hands/hands_solution_simd_wasm_bin.wasm','assets/vendor/mediapipe-hands/hands_solution_wasm_bin.js','assets/vendor/mediapipe-hands/hands_solution_wasm_bin.wasm'])if(!actual.has(path))failures.push(`Required music/gesture runtime missing: ${path}`);
const music=manifest.files.find(file=>file.url==='./assets/audio/celestial-ambient.mp3');if(music?.mime!=='audio/mpeg'||music?.sha256!=='41c593c7336faa72004b5b74577c4094c954d545fcc536e722ba4b3a3bef5d0f')failures.push('Distributed ambient MP3 MIME or source hash is wrong');
for(const source of [html,dataRaw,await readFile(resolve(dist,'app.js'),'utf8')])if(/https?:\/\//.test(source))failures.push('Release runtime contains a remote URL');

if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`Release ${manifest.releaseId} validated: Core ${(coreBytes/1048576).toFixed(2)} MiB, Gesture ${(gestureBytes/1048576).toFixed(2)} MiB, ${actual.size} allowlisted files.`);

async function walk(directory){const results=[];for(const entry of await readdir(directory,{withFileTypes:true})){const path=join(directory,entry.name);if(entry.isDirectory())results.push(...await walk(path));else if(entry.isFile())results.push(path);}return results;}
