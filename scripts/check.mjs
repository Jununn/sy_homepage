import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const context = {window:{}};
for (const file of ['content.js','datasets-copy.js','datasets-data.js']) runInNewContext(readFileSync(`dist/${file}`,'utf8'),context);
const content=context.window.siteContent, library=context.window.datasetLibrary;
const htmlFiles=['index.html','datasets.html'];
const ids=new Set(library.items.map(x=>x.id));
assert.equal(ids.size,library.items.length,'Duplicate sample IDs');
for (const file of htmlFiles) {
 const html=readFileSync(`dist/${file}`,'utf8');
 for(const locale of ['zh','en']) for(const match of html.matchAll(/data-i18n(?:-html|-aria|-alt)?="([^"]+)"/g)) assert.equal(typeof content[locale][match[1]],'string',`${locale}: missing ${match[1]}`);
 for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const target=match[1];if(target.startsWith('http'))continue;
  const [path,anchor]=target.split('#');const dest=path||file;
  assert.ok(existsSync(`dist/${dest}`),`Missing asset: ${target}`);
  if(anchor) {
   const staticAnchor=readFileSync(`dist/${dest}`,'utf8').includes(`id="${anchor}"`);
   assert.ok(staticAnchor || (dest==='datasets.html'&&ids.has(anchor)),`Missing anchor: ${target}`);
  }
 }
}
for(const match of readFileSync('dist/datasets.js','utf8').matchAll(/\bt\('([^']+)'\)/g)) for(const locale of ['zh','en']) assert.equal(typeof content[locale][match[1]],'string',`${locale}: missing dynamic label ${match[1]}`);
for(const file of ['app.js','content.js','datasets.js','datasets-data.js','datasets-copy.js']) assert.equal(spawnSync(process.execPath,['--check',`dist/${file}`]).status,0,`Invalid JS: ${file}`);
const provenance=JSON.parse(readFileSync('dist/datasets-provenance.json','utf8'));
assert.equal(provenance.selection.length,library.items.length);
for(const asset of provenance.assets) assert.equal(createHash('sha256').update(readFileSync(`dist/${asset.path}`)).digest('hex'),asset.sha256,`Changed source image: ${asset.path}`);
for(const item of library.items) {
 assert.ok(library.categories[item.category]);
 assert.equal(typeof item.title.zh,'string');assert.equal(typeof item.title.en,'string');
 if(item.category==='single') for(const key of ['before','after']) assert.ok(existsSync(`dist/${item.record[key]}`));
 if(item.category==='multi') {
  assert.equal(item.record.rounds.length,item.record.num_rounds);
  assert.ok(existsSync(`dist/${item.record.reference}`));
  item.record.rounds.forEach((r,i)=>{assert.equal(r.idx,i+1);assert.ok(existsSync(`dist/${r.image}`));for(const ref of r.source_ref.split('+')) if(ref.startsWith('round_')) assert.ok(Number(ref.slice(6))<=i,`Future image reference in ${item.id}`);});
 }
}
console.log(`Passed: bilingual copy, local links, JavaScript, ${library.items.length} samples, and ${provenance.assets.length} unchanged source images.`);
