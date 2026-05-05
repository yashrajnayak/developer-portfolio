import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const cssFiles = [
  'css/base.css',
  'css/components.css',
  'css/loading.css',
  'css/theme.css',
  'css/scroll-to-top.css',
  'css/print.css',
  'css/header.css',
  'css/about.css',
  'css/skills.css',
  'css/experience.css',
  'css/projects.css',
  'css/footer.css',
  'css/animations.css',
  'css/responsive.css'
];

const jsFiles = [
  'js/config-manager.js',
  'js/seo-manager.js',
  'js/theme-manager.js',
  'js/loading-manager.js',
  'js/section-manager.js',
  'js/header-manager.js',
  'js/github-projects-manager.js',
  'js/footer-manager.js',
  'js/main.js'
];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function normalizeBaseUrl(config) {
  return String(config.site?.seo?.base_url || '').replace(/\/$/, '');
}

function buildBundles() {
  const cssBundle = cssFiles
    .map(file => `/* ${file} */\n${readFileSync(file, 'utf8').trim()}`)
    .join('\n\n');

  const jsBundle = jsFiles
    .map(file => readFileSync(file, 'utf8')
      .replace(/^import .+;\r?\n/gm, '')
      .replace(/^export class /gm, 'class ')
      .trim())
    .join('\n\n');

  writeFileSync('css/bundle.css', `${cssBundle}\n`);
  writeFileSync('js/bundle.js', `${jsBundle}\n`);
}

function buildManifest(config) {
  const seo = config.site?.seo || {};
  const icons = [
    { src: 'assets/favicons/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: 'assets/favicons/favicon-512x512.png', sizes: '512x512', type: 'image/png' }
  ].filter(icon => existsSync(icon.src));

  const manifest = {
    name: config.site?.title || config.header?.greeting || 'Developer Portfolio',
    short_name: config.header?.greeting || config.site?.title || 'Portfolio',
    description: seo.description || config.site?.description || 'Developer portfolio',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#2563eb'
  };

  if (icons.length > 0) {
    manifest.icons = icons;
  }

  writeFileSync('site.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`);
}

function buildRobots(config) {
  const baseUrl = normalizeBaseUrl(config);
  const sitemapLine = baseUrl ? `\nSitemap: ${baseUrl}/sitemap.xml\n` : '\n';

  writeFileSync('robots.txt', `User-agent: *\nAllow: /\n${sitemapLine}`);
}

function buildSitemap(config) {
  const baseUrl = normalizeBaseUrl(config);
  const lastmod = config.site?.seo?.lastmod;
  const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';

  const sitemap = baseUrl
    ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${baseUrl}/</loc>${lastmodLine}\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
    : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n`;

  writeFileSync('sitemap.xml', sitemap);
}

const config = readJson('config.json');
buildBundles();
buildManifest(config);
buildRobots(config);
buildSitemap(config);
