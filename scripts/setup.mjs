import {rmSync, writeFileSync} from 'node:fs';
import {loadConfig} from './lib/config.mjs';
import {renderSiteReadme} from './lib/render.mjs';

const required = ['GITHUB_USERNAME', 'REPOSITORY_NAME', 'FULL_NAME', 'PROFESSIONAL_HEADLINE', 'CURRENT_ROLE', 'ORGANIZATION', 'LOCATION', 'LINKEDIN_URL'];
const missing = required.filter(name => !process.env[name]?.trim());
if (missing.length) {
  console.error(`Missing setup values: ${missing.join(', ')}`);
  process.exit(1);
}
if (!/^https:\/\/(?:www\.)?linkedin\.com\//i.test(process.env.LINKEDIN_URL)) {
  console.error('LINKEDIN_URL must be a public https://linkedin.com/ URL.');
  process.exit(1);
}

const {config} = loadConfig('config.json');
const username = process.env.GITHUB_USERNAME.trim();
const repo = process.env.REPOSITORY_NAME.trim();
const fullName = process.env.FULL_NAME.trim();
const rootSite = repo.toLowerCase() === `${username.toLowerCase()}.github.io`;
const baseUrl = rootSite ? `https://${username}.github.io` : `https://${username}.github.io/${repo}`;

config.site.base_url = baseUrl;
config.site.seo.title = `${fullName} — Developer Portfolio`;
config.site.seo.description = `${process.env.PROFESSIONAL_HEADLINE.trim()}. Selected work and experience by ${fullName}.`;
config.site.seo.og_image = `https://avatars.githubusercontent.com/${username}?s=1200`;
config.site.seo.og_image_alt = `Portrait of ${fullName}`;
config.person = {
  ...config.person,
  name: fullName,
  professional_headline: process.env.PROFESSIONAL_HEADLINE.trim(),
  current_role: process.env.CURRENT_ROLE.trim(),
  organization: process.env.ORGANIZATION.trim(),
  location: process.env.LOCATION.trim(),
  avatar: `https://avatars.githubusercontent.com/${username}?s=512`,
  github_username: username
};
config.hero.heading = `${fullName} builds useful products and developer experiences.`;
config.hero.summary = `${process.env.CURRENT_ROLE.trim()} at ${process.env.ORGANIZATION.trim()}. Use config.json to replace this sentence with the audience, problems, and outcomes that define your work.`;
config.hero.secondary_cta = {label: 'Connect on LinkedIn', url: process.env.LINKEDIN_URL.trim()};
config.impact_metrics = [
  {value: '1', label: 'Portfolio to personalize'},
  {value: String(config.person.focus_areas.length), label: 'Focus areas to update'}
];
config.projects.items[0].links = [{label: 'View repository', url: `https://github.com/${username}/${repo}`}];
config.experience.jobs[0].company = process.env.ORGANIZATION.trim();
config.experience.jobs[0].role = process.env.CURRENT_ROLE.trim();
config.open_source.items[0].url = `https://github.com/${username}/${repo}`;
config.contact.primary_cta = {label: 'Connect on LinkedIn', url: process.env.LINKEDIN_URL.trim()};
config.contact.social_links = [
  {name: 'GitHub', url: `https://github.com/${username}`},
  {name: 'LinkedIn', url: process.env.LINKEDIN_URL.trim()}
];
config.footer.copyright = fullName;
writeFileSync('config.json', `${JSON.stringify(config, null, 2)}\n`);
writeFileSync('README.md', renderSiteReadme(config));
rmSync('assets/readme', {recursive: true, force: true});
console.log('Personal configuration and README generated. Template-only README graphics removed.');
