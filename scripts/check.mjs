import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { spawnSync } from 'node:child_process';
const html = readFileSync('dist/index.html', 'utf8');
const context = {window: {}};
runInNewContext(readFileSync('dist/content.js', 'utf8'), context);
const content = context.window.siteContent;
for (const locale of ['zh', 'en']) {
  for (const match of html.matchAll(/data-i18n(?:-html|-aria|-alt)?="([^"]+)"/g)) {
    assert.equal(typeof content[locale][match[1]], 'string', `${locale}: missing ${match[1]}`);
  }
}
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const target = match[1];
  if (target.startsWith('#')) assert.ok(html.includes(`id="${target.slice(1)}"`), `Missing anchor: ${target}`);
  else if (!target.startsWith('http')) assert.ok(existsSync(`dist/${target}`), `Missing asset: ${target}`);
}
for (const file of ['dist/app.js', 'dist/content.js']) {
  assert.equal(spawnSync(process.execPath, ['--check', file]).status, 0, `Invalid JS: ${file}`);
}
console.log('Passed: bilingual copy, anchor targets, local assets, and JavaScript syntax.');
