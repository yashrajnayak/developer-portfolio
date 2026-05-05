import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ignoredDirectories = new Set(['.git', 'node_modules']);
const ignoredFiles = new Set(['scripts/check-local-paths.mjs']);
const ignoredExtensions = new Set([
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.pdf',
  '.png',
  '.webp'
]);

const localPathPattern = /(?:\/Users\/|\/home\/|\/Volumes\/|Documents\/GitHub|file:\/\/|localhost|127\.0\.0\.1|C:\\)/;
const findings = [];

function extension(path) {
  const match = path.match(/\.[^.]+$/);
  return match ? match[0].toLowerCase() : '';
}

function scanFile(path) {
  if (ignoredFiles.has(path.replaceAll('\\', '/'))) return;
  if (ignoredExtensions.has(extension(path))) return;

  const buffer = readFileSync(path);
  if (buffer.includes(0)) return;

  const text = buffer.toString('utf8');
  text.split(/\r?\n/).forEach((line, index) => {
    if (localPathPattern.test(line)) {
      findings.push(`${path}:${index + 1}: ${line.trim()}`);
    }
  });
}

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) continue;

    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      walk(path);
    } else if (stats.isFile()) {
      scanFile(path);
    }
  }
}

walk('.');

if (findings.length > 0) {
  console.error('Local machine-specific paths found:');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log('No local machine-specific paths found.');
