import { existsSync, readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync('config.json', 'utf8'));
const errors = [];

function requireString(path, value) {
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${path} must be a non-empty string`);
  }
}

function isRemoteUrl(value) {
  return /^https?:\/\//i.test(value);
}

function checkAsset(path, value) {
  if (!value || isRemoteUrl(value)) return;
  if (!existsSync(value)) {
    errors.push(`${path} points to a missing asset: ${value}`);
  }
}

requireString('github_username', config.github_username);
requireString('header.greeting', config.header?.greeting);
requireString('header.tagline', config.header?.tagline);
requireString('site.seo.title', config.site?.seo?.title);
requireString('site.seo.description', config.site?.seo?.description);
requireString('site.seo.base_url', config.site?.seo?.base_url);

if (!Array.isArray(config.social_links) || config.social_links.length === 0) {
  errors.push('social_links must include at least one link');
}

if (!Array.isArray(config.about?.paragraphs)) {
  errors.push('about.paragraphs must be an array');
}

config.projects?.items?.forEach((project, index) => {
  requireString(`projects.items[${index}].name`, project.name);
  checkAsset(`projects.items[${index}].picture`, project.picture);
});

config.experience?.jobs?.forEach((job, index) => {
  requireString(`experience.jobs[${index}].company`, job.company);
  requireString(`experience.jobs[${index}].role`, job.role);
  checkAsset(`experience.jobs[${index}].logo`, job.logo);
  checkAsset(`experience.jobs[${index}].logo_dark`, job.logo_dark);
});

if (config.github_projects?.mode && !['featured', 'stars', 'feed'].includes(config.github_projects.mode)) {
  errors.push('github_projects.mode must be one of: featured, stars, feed');
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('config.json is valid.');
