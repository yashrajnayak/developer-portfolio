import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadConfig} from './lib/config.mjs';
import {renderProfileReadme, renderSiteReadme} from './lib/render.mjs';

const configPath = process.argv[2] || process.env.PORTFOLIO_CONFIG || 'config.json';
const siteOutput = resolve(process.argv[3] || 'SITE_README.md');
const profileOutput = resolve(process.argv[4] || 'PROFILE_README.md');
const {config} = loadConfig(configPath);
writeFileSync(siteOutput, renderSiteReadme(config));
writeFileSync(profileOutput, renderProfileReadme(config));
console.log(`Generated ${siteOutput} and ${profileOutput} from ${configPath}.`);
