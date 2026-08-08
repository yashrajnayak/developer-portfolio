import {cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadConfig} from './lib/config.mjs';
import {renderHtml, renderProfileReadme, renderSiteReadme} from './lib/render.mjs';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const engineRoot = resolve(scriptDirectory, '..');
const configPath = resolve(process.env.PORTFOLIO_CONFIG || process.argv[2] || resolve(engineRoot, 'config.json'));
const contentRoot = dirname(configPath);
const outputDirectory = resolve(process.env.PORTFOLIO_OUTPUT || resolve(engineRoot, 'dist'));
const {config, migrated} = loadConfig(configPath);

rmSync(outputDirectory, {recursive: true, force: true});
mkdirSync(outputDirectory, {recursive: true});

writeFileSync(resolve(outputDirectory, 'index.html'), renderHtml(config));
writeFileSync(resolve(outputDirectory, 'styles.css'), readFileSync(resolve(engineRoot, 'src/styles.css')));
writeFileSync(resolve(outputDirectory, 'app.js'), readFileSync(resolve(engineRoot, 'src/app.js')));
writeFileSync(resolve(outputDirectory, 'site-readme.md'), renderSiteReadme(config));
writeFileSync(resolve(outputDirectory, 'profile-readme.md'), renderProfileReadme(config));

if (existsSync(resolve(engineRoot, 'assets'))) cpSync(resolve(engineRoot, 'assets'), resolve(outputDirectory, 'assets'), {recursive: true});
for (const directory of ['assets', 'media']) {
  const source = resolve(contentRoot, directory);
  if (contentRoot !== engineRoot && existsSync(source)) cpSync(source, resolve(outputDirectory, directory), {recursive: true});
}

const baseUrl = config.site.base_url.replace(/\/$/, '');
const manifest = {
  name: config.site.seo.title,
  short_name: config.person.name,
  description: config.site.seo.description,
  start_url: './',
  scope: './',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#0b5cff'
};
const favicon192 = resolve(contentRoot, 'assets/favicons/favicon-192x192.png');
const favicon512 = resolve(contentRoot, 'assets/favicons/favicon-512x512.png');
if (existsSync(favicon192) && existsSync(favicon512)) manifest.icons = [
  {src: 'assets/favicons/favicon-192x192.png', sizes: '192x192', type: 'image/png'},
  {src: 'assets/favicons/favicon-512x512.png', sizes: '512x512', type: 'image/png'}
];
writeFileSync(resolve(outputDirectory, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(resolve(outputDirectory, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`);
writeFileSync(resolve(outputDirectory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`);

if (existsSync(resolve(contentRoot, 'CNAME'))) cpSync(resolve(contentRoot, 'CNAME'), resolve(outputDirectory, 'CNAME'));
console.log(`Built ${outputDirectory}${migrated ? ' from a migrated v1 configuration' : ''}.`);
