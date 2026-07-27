import {readFile,writeFile,unlink} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const source=process.argv[2];
if(!source)throw new Error('Usage: node scripts/build-export-font-subset.mjs /path/to/NotoSansSC.ttf');

const inputs=await Promise.all(['app/data.js','app/index.html','app/app.js'].map(path=>readFile(resolve(root,path),'utf8')));
const glyphs=[...new Set(inputs.join('\n').match(/\p{Script=Han}/gu)||[])].sort().join('');
const corpus=resolve(root,'.export-cjk-glyphs.txt');
const output=resolve(root,'app/assets/fonts/celestial-cjk.ttf');
await writeFile(corpus,glyphs,'utf8');

const result=spawnSync('hb-subset',[source,`--output-file=${output}`,`--text-file=${corpus}`,'--layout-features=*','--name-IDs=*','--name-legacy'],{stdio:'inherit'});
await unlink(corpus);
if(result.status!==0)process.exit(result.status||1);
console.log(`Built ${output} with ${glyphs.length} Simplified Chinese glyphs.`);
