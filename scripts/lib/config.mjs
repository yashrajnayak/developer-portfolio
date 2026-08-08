import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const isRemote = value => /^https:\/\//i.test(String(value || ''));
const cleanUrl = value => String(value || '').replace(/^http:\/\//i, 'https://').replace(/\/$/, '');
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;

export function slugify(value, fallback = 'item') {
  const slug = String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return /^[a-z]/.test(slug) ? slug : `${fallback}-${slug || '1'}`;
}

function dedupeIds(items) {
  const seen = new Map();
  return items.map((item, index) => {
    const base = slugify(item.id || item.name, `project-${index + 1}`);
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return {...item, id: count === 0 ? base : `${base}-${count + 1}`};
  });
}

export function migrateV1(input) {
  if (input?.schema_version === 2) return structuredClone(input);

  const name = input.header?.greeting || input.site?.title || 'Your Name';
  const jobs = Array.isArray(input.experience?.jobs) ? input.experience.jobs : [];
  const legacyProjects = Array.isArray(input.projects?.items) ? input.projects.items : [];
  const social = Array.isArray(input.social_links) ? input.social_links : [];
  const githubUsername = input.github_username || 'username';
  const currentJob = jobs[0] || {};
  const about = Array.isArray(input.about?.paragraphs) ? input.about.paragraphs.filter(nonEmpty) : [];
  const categories = Array.isArray(input.skills?.categories) ? input.skills.categories : [];
  const flatProof = categories.flatMap(category => (category.items || []).map(item => {
    if (typeof item === 'string') return item;
    return item?.name && item?.url ? {name: item.name, url: cleanUrl(item.url)} : item?.name;
  })).filter(Boolean);

  const projects = dedupeIds(legacyProjects.map((project, index) => {
    const description = Array.isArray(project.description) ? project.description.filter(nonEmpty) : [];
    const links = project.link?.url ? [{label: project.link.title || 'View project', url: cleanUrl(project.link.url)}] : [];
    return {
      id: project.id,
      name: project.name || `Project ${index + 1}`,
      date: project.date || 'Date not specified',
      role: project.role || 'Contributor',
      summary: project.summary || description[0] || 'Add a concise project summary.',
      challenge: project.challenge || description[1] || description[0] || 'Describe the problem this work addressed.',
      actions: Array.isArray(project.actions) && project.actions.length ? project.actions : description.slice(0, -1).length ? description.slice(0, -1) : [description[0] || 'Describe the actions you took.'],
      outcomes: Array.isArray(project.outcomes) && project.outcomes.length ? project.outcomes : [description.at(-1) || 'Describe the result you achieved.'],
      featured: project.featured !== false,
      media: project.media || {src: project.picture || 'assets/projects/Placeholder.png', alt: `${project.name || `Project ${index + 1}`} preview`, fit: 'contain'},
      links,
      description,
      ...(project.picture ? {picture: project.picture} : {}),
      ...(project.link ? {link: {label: project.link.title || 'View project', url: cleanUrl(project.link.url)}} : {})
    };
  }));

  const linkedIn = social.find(link => /linkedin/i.test(link.name || ''));
  const github = social.find(link => /github/i.test(link.name || '')) || {name: 'GitHub', url: `https://github.com/${githubUsername}`};
  const contactTarget = linkedIn || github;
  const baseUrl = cleanUrl(input.site?.seo?.base_url || `https://${githubUsername}.github.io`);
  const title = input.site?.seo?.title || `${name} — Developer Portfolio`;
  const description = input.site?.seo?.description || about[0] || `Selected work and experience by ${name}.`;
  const workItems = projects.slice(0, 3).map(project => ({
    name: project.name,
    summary: project.summary,
    url: project.links[0]?.url || `https://github.com/${githubUsername}`
  }));

  return {
    $schema: './config.schema.json',
    schema_version: 2,
    site: {
      base_url: baseUrl,
      language: 'en',
      seo: {
        title,
        description,
        keywords: String(input.site?.seo?.keywords || 'developer, portfolio').split(',').map(item => item.trim()).filter(Boolean),
        og_image: input.site?.seo?.og_image || `https://avatars.githubusercontent.com/${githubUsername}?s=1200`,
        og_image_alt: input.site?.seo?.og_image_alt || `Portrait of ${name}`
      }
    },
    person: {
      name,
      professional_headline: input.header?.tagline || currentJob.role || 'Developer and creator',
      current_role: currentJob.role || input.header?.tagline || 'Your current role',
      organization: currentJob.company || 'Your organization',
      location: input.person?.location || 'Location not specified',
      avatar: input.person?.avatar || `https://avatars.githubusercontent.com/${githubUsername}?s=512`,
      github_username: githubUsername,
      focus_areas: categories.map(category => category.name).filter(nonEmpty).slice(0, 5).length ? categories.map(category => category.name).filter(nonEmpty).slice(0, 5) : ['Software development'],
      languages: input.person?.languages || ['English']
    },
    hero: {
      heading: input.hero?.heading || name,
      summary: input.hero?.summary || about[0] || description,
      primary_cta: input.hero?.primary_cta || {label: 'View selected work', url: '#impact'},
      secondary_cta: input.hero?.secondary_cta || {label: `Connect on ${contactTarget.name}`, url: cleanUrl(contactTarget.url)}
    },
    impact_metrics: input.impact_metrics || [
      {value: `${jobs.length}`, label: jobs.length === 1 ? 'Role highlighted' : 'Roles highlighted'},
      {value: `${projects.length}`, label: projects.length === 1 ? 'Selected project' : 'Selected projects'},
      {value: `${Math.max(flatProof.length, 1)}`, label: flatProof.length === 1 ? 'Capability' : 'Capabilities'}
    ],
    navigation: input.navigation || [
      {label: 'Impact', target: 'impact'},
      {label: 'Experience', target: 'experience'},
      {label: 'Work', target: 'work'},
      {label: 'Contact', target: 'contact'}
    ],
    projects: {title: input.projects?.title || 'Selected impact', items: projects.length ? projects : [{
      id: 'first-project', name: 'Your first project', date: 'Add a date', role: 'Your role', summary: 'Add a concise summary.', challenge: 'Describe the challenge.', actions: ['Describe what you did.'], outcomes: ['Describe the outcome.'], featured: true, media: {src: 'assets/projects/Placeholder.png', alt: 'Project placeholder', fit: 'contain'}, links: []
    }]},
    experience: {title: input.experience?.title || 'Experience', visible_count: Math.min(Math.max(jobs.length, 1), 3), jobs: jobs.length ? jobs : [{company: 'Your organization', role: 'Your role', date: 'Add dates', responsibilities: ['Describe your impact.'], logo: 'assets/logos/Placeholder_Logo.png', logo_dark: 'assets/logos/Placeholder_Logo.png'}]},
    proof: {title: input.skills?.title || 'Capabilities & credentials', items: flatProof.length ? flatProof : ['Add your core capability']},
    open_source: {title: 'Tools and open-source work', items: workItems.length ? workItems : [{name: 'GitHub profile', summary: 'Explore more work on GitHub.', url: `https://github.com/${githubUsername}`}]},
    contact: {
      heading: input.footer?.tagline || 'Let’s build something useful.',
      summary: about[1] || 'Available for collaborations and thoughtful conversations.',
      primary_cta: {label: `Connect on ${contactTarget.name}`, url: cleanUrl(contactTarget.url)},
      social_links: social.map(link => ({name: link.name, url: cleanUrl(link.url)})).filter(link => nonEmpty(link.name) && isRemote(link.url)).length ? social.map(link => ({name: link.name, url: cleanUrl(link.url)})).filter(link => nonEmpty(link.name) && isRemote(link.url)) : [github]
    },
    footer: {
      copyright: name,
      show_built_with: input.footer?.show_built_with !== false,
      built_with_text: input.footer?.built_with_text || 'Built with the Developer Portfolio v2 engine.'
    }
  };
}

function humanizeAjvError(error) {
  const path = error.instancePath ? error.instancePath.slice(1).replaceAll('/', '.') : 'config';
  if (error.keyword === 'required') return `${path} is missing required field "${error.params.missingProperty}"`;
  if (error.keyword === 'additionalProperties') return `${path} contains unsupported field "${error.params.additionalProperty}"`;
  return `${path} ${error.message}`;
}

function duplicateMessages(config) {
  const errors = [];
  const check = (label, values) => {
    const seen = new Set();
    for (const raw of values) {
      const value = String(raw || '').trim().toLowerCase();
      if (!value) continue;
      if (seen.has(value)) errors.push(`${label} contains a duplicate value: ${raw}`);
      seen.add(value);
    }
  };
  check('navigation labels', config.navigation.map(item => item.label));
  check('navigation targets', config.navigation.map(item => item.target));
  check('project ids', config.projects.items.map(item => item.id));
  check('project names', config.projects.items.map(item => item.name));
  check('experience companies', config.experience.jobs.map(item => `${item.company} ${item.date}`));
  check('contact links', config.contact.social_links.map(item => item.url));
  return errors;
}

function assetMessages(config, root) {
  const errors = [];
  const inspect = (path, value) => {
    if (!value || isRemote(value)) return;
    if (!/^(assets|media)\//.test(value)) {
      errors.push(`${path} must be an HTTPS URL or a reusable assets/ or media/ path`);
      return;
    }
    if (!existsSync(resolve(root, value))) errors.push(`${path} points to a missing asset: ${value}`);
  };
  inspect('person.avatar', config.person.avatar);
  inspect('site.seo.og_image', config.site.seo.og_image);
  config.projects.items.forEach((project, index) => inspect(`projects.items[${index}].media.src`, project.media.src));
  config.experience.jobs.forEach((job, index) => {
    inspect(`experience.jobs[${index}].logo`, job.logo);
    inspect(`experience.jobs[${index}].logo_dark`, job.logo_dark);
  });
  return errors;
}

export function validateConfig(config, {schemaPath = resolve('config.schema.json'), root = process.cwd()} = {}) {
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  const ajv = new Ajv2020({allErrors: true, strict: true, validateFormats: true});
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(config);
  const errors = valid ? [] : validate.errors.map(humanizeAjvError);
  errors.push(...duplicateMessages(config), ...assetMessages(config, root));
  const validTargets = new Set(['impact', 'experience', 'proof', 'work', 'contact']);
  for (const item of config.navigation) {
    if (!validTargets.has(item.target)) errors.push(`navigation target "${item.target}" does not match a rendered section`);
  }
  if (config.experience.visible_count > config.experience.jobs.length) errors.push('experience.visible_count cannot exceed experience.jobs length');
  return {valid: errors.length === 0, errors};
}

export function loadConfig(configPath = 'config.json', {allowMigration = true} = {}) {
  let source;
  try {
    source = JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read ${configPath}: ${error.message}`);
  }
  const migrated = source.schema_version !== 2;
  if (migrated && !allowMigration) throw new Error(`${configPath} uses schema v1. Run "npm run migrate -- ${configPath}" first.`);
  const config = migrated ? migrateV1(source) : source;
  const root = dirname(resolve(configPath));
  const schemaPath = resolve(process.cwd(), 'config.schema.json');
  const result = validateConfig(config, {schemaPath, root});
  if (!result.valid) throw new Error(`Configuration errors in ${configPath}:\n- ${result.errors.join('\n- ')}`);
  return {config, migrated, source};
}
