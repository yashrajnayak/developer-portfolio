import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {escapeHtml, escapeMarkdown, renderHtml, renderProfileReadme, renderSiteReadme} from '../../scripts/lib/render.mjs';

const config = JSON.parse(readFileSync('config.json', 'utf8'));

test('HTML escaping protects content and attributes', () => {
  assert.equal(escapeHtml('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  const unsafe = structuredClone(config);
  unsafe.person.name = '<img src=x onerror=alert(1)>';
  const html = renderHtml(unsafe, {year: 2026});
  assert.doesNotMatch(html, /<img src=x onerror/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
});

test('Markdown escaping prevents generated README structure injection', () => {
  assert.equal(escapeMarkdown('name | [link]\nnext'), 'name \\| \\[link\\] next');
});

test('static render contains meaningful SEO, landmarks, content, and JSON-LD', () => {
  const html = renderHtml(config, {year: 2026});
  assert.ok(html.includes(`<title>${escapeHtml(config.site.seo.title)}</title>`));
  assert.ok(html.includes(`<meta name="description" content="${escapeHtml(config.site.seo.description)}">`));
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /Skip to content/);
  assert.match(html, /Selected impact/);
  assert.match(html, /Capabilities &amp; credentials/);
  assert.match(html, /application\/ld\+json/);
  assert.ok(html.includes(`© 2026 ${escapeHtml(config.footer.copyright)}`));
});

test('README generators derive claims from the schema', () => {
  const site = renderSiteReadme(config);
  const profile = renderProfileReadme(config);
  assert.ok(site.includes(config.person.name));
  assert.ok(site.includes(config.projects.items[0].name));
  assert.ok(profile.includes(config.experience.jobs[0].role));
  assert.ok(profile.includes(config.person.location));
  assert.doesNotMatch(profile, /Databricks|MongoDB|GitHub Constellation/);
});
