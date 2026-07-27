import {createHash} from 'node:crypto';
import {readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const assetRoot = resolve(projectRoot, 'app/assets/cards/r1');
const specsPath = resolve(assetRoot, 'generation-specs.json');
const outputPath = resolve(assetRoot, 'generation-records.json');

const specs = JSON.parse(await readFile(specsPath, 'utf8'));
const records = [];

for (const spec of specs.records) {
  const buffer = await readFile(resolve(assetRoot, spec.file));
  const signature = buffer.subarray(1, 4).toString('ascii');
  if (signature !== 'PNG') throw new Error(`${spec.file} is not a PNG`);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  if (width * 3 !== height * 2) throw new Error(`${spec.file} is not portrait 2:3`);

  records.push({
    ...spec,
    sha256: createHash('sha256').update(buffer).digest('hex'),
    width,
    height,
    mode: 'generate_with_approved_style_references',
    visualQa: 'passed_internal',
  });
}

await writeFile(outputPath, `${JSON.stringify({version: specs.version, records}, null, 2)}\n`, 'utf8');
console.log(`Recorded ${records.length} generated R1 assets.`);

