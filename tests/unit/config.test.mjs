import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {migrateV1, validateConfig} from '../../scripts/lib/config.mjs';

const schemaPath = resolve('config.schema.json');
const root = resolve('.');
const current = JSON.parse(readFileSync('config.json', 'utf8'));

test('schema v2 example validates', () => {
  assert.deepEqual(validateConfig(current, {schemaPath, root}), {valid: true, errors: []});
});

test('v1 migration centralizes person, hero, links, and extended projects', () => {
  const migrated = migrateV1({
    site: {title: 'Ada Lovelace', seo: {base_url: 'http://ada.example.dev', description: 'Computing pioneer'}},
    header: {greeting: 'Ada Lovelace', tagline: 'Mathematician'},
    github_username: 'ada',
    social_links: [{name: 'GitHub', url: 'https://github.com/ada'}],
    about: {paragraphs: ['Writes about analytical engines.']},
    projects: {items: [{name: 'Engine notes', date: '1843', description: ['Documented an algorithm.', 'Made the method teachable.'], picture: 'assets/projects/Placeholder.png'}]},
    experience: {jobs: [{company: 'Independent', role: 'Mathematician', date: '1843', responsibilities: ['Published notes.'], logo: 'assets/logos/Placeholder_Logo.png', logo_dark: 'assets/logos/Placeholder_Logo.png'}]},
    skills: {categories: [{name: 'Technical', items: ['Mathematics']}]},
    footer: {tagline: 'Let’s explore ideas.', show_built_with: true, built_with_text: 'Vanilla JavaScript'}
  });
  assert.equal(migrated.schema_version, 2);
  assert.equal(migrated.person.name, 'Ada Lovelace');
  assert.equal(migrated.person.current_role, 'Mathematician');
  assert.equal(migrated.site.base_url, 'https://ada.example.dev');
  assert.equal(migrated.projects.items[0].role, 'Contributor');
  assert.equal(migrated.projects.items[0].media.src, 'assets/projects/Placeholder.png');
  assert.ok(migrated.projects.items[0].outcomes.length > 0);
  assert.equal(validateConfig(migrated, {schemaPath, root}).valid, true);
});

test('validator reports duplicate ids, unsupported targets, unsafe URLs, and missing assets', () => {
  const invalid = structuredClone(current);
  invalid.projects.items.push({...structuredClone(invalid.projects.items[0]), name: 'Another project'});
  invalid.navigation[0].target = 'missing';
  invalid.contact.primary_cta.url = 'javascript:alert(1)';
  invalid.person.avatar = 'assets/missing.png';
  const result = validateConfig(invalid, {schemaPath, root});
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /duplicate value/);
  assert.match(result.errors.join('\n'), /does not match a rendered section/);
  assert.match(result.errors.join('\n'), /must match exactly one schema/);
  assert.match(result.errors.join('\n'), /missing asset/);
});
