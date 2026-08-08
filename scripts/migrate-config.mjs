import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {migrateV1, validateConfig} from './lib/config.mjs';

const inputPath = resolve(process.argv[2] || 'config.json');
const outputPath = resolve(process.argv[3] || inputPath);
let source;
try {
  source = JSON.parse(readFileSync(inputPath, 'utf8'));
} catch (error) {
  console.error(`Could not read ${inputPath}: ${error.message}`);
  process.exit(1);
}
if (source.schema_version === 2) {
  console.log(`${inputPath} already uses schema_version 2.`);
  process.exit(0);
}
const migrated = migrateV1(source);
const result = validateConfig(migrated, {root: dirname(inputPath)});
if (!result.valid) {
  console.error(`Migration needs attention:\n- ${result.errors.join('\n- ')}`);
  process.exit(1);
}
writeFileSync(outputPath, `${JSON.stringify(migrated, null, 2)}\n`);
console.log(`Migrated ${inputPath} to schema_version 2 at ${outputPath}. Review placeholders before publishing.`);
