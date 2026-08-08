import {loadConfig} from './lib/config.mjs';

const configPath = process.env.PORTFOLIO_CONFIG || process.argv[2] || 'config.json';
try {
  const {migrated} = loadConfig(configPath);
  console.log(`${configPath} is valid${migrated ? ' after the built-in v1 → v2 compatibility migration' : ''}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
