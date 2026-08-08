import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const htmlPath = resolve(process.env.PORTFOLIO_OUTPUT || 'dist', 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));
const errors = [];

for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
  const target = match[1];
  if (/^(?:https:\/\/|data:|mailto:|tel:)/i.test(target)) continue;
  if (target.startsWith('#')) {
    if (!ids.has(target.slice(1))) errors.push(`Missing fragment target: ${target}`);
    continue;
  }
  const clean = target.split(/[?#]/)[0];
  if (clean && !existsSync(resolve(htmlPath, '..', clean))) errors.push(`Missing local link target: ${target}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Generated local links and fragment targets are valid.');
