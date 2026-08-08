const escapeMap = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => escapeMap[character]);
}

export function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

export function escapeMarkdown(value = '') {
  return String(value).replace(/([\\`*_[\]<>|])/g, '\\$1').replace(/\r?\n/g, ' ');
}

function externalAttributes(url) {
  return /^https:\/\//i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
}

function link(linkData, className = '') {
  const classAttr = className ? ` class="${escapeHtml(className)}"` : '';
  return `<a${classAttr} href="${escapeHtml(linkData.url)}"${externalAttributes(linkData.url)}>${escapeHtml(linkData.label)}</a>`;
}

const icons = {
  menu: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  sun: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>',
  moon: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 15.3A8.5 8.5 0 0 1 8.7 4a8.5 8.5 0 1 0 11.3 11.3Z"/></svg>',
  arrow: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  external: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 5h5v5M10 14 19 5M19 13v6H5V5h6"/></svg>'
};

function sectionHeading(title) {
  return `<h2 class="section-heading"><span aria-hidden="true"></span>${escapeHtml(title)}</h2>`;
}

function renderHeader(config) {
  const navigation = config.navigation.map(item => `<li><a href="#${escapeHtml(item.target)}">${escapeHtml(item.label)}</a></li>`).join('');
  return `<a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header" data-site-header>
    <div class="header-inner">
      <a class="brand" href="#top" aria-label="${escapeHtml(config.person.name)} home">${escapeHtml(config.person.name)}</a>
      <nav class="desktop-nav" aria-label="Primary navigation"><ul>${navigation}</ul></nav>
      <div class="header-actions">
        <button class="icon-button" type="button" data-theme-toggle aria-label="Switch to dark theme" aria-pressed="false"><span data-theme-icon-light>${icons.sun}</span><span data-theme-icon-dark hidden>${icons.moon}</span></button>
        ${link({label: 'Connect', url: config.contact.primary_cta.url}, 'header-connect')}
        <button class="icon-button menu-button" type="button" data-menu-toggle aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-navigation"><span data-menu-open>${icons.menu}</span><span data-menu-close hidden>${icons.close}</span></button>
      </div>
    </div>
    <nav class="mobile-nav" id="mobile-navigation" data-mobile-nav aria-label="Mobile navigation" hidden><ul>${navigation}</ul>${link(config.contact.primary_cta, 'button button-primary')}</nav>
  </header>`;
}

function renderHero(config) {
  return `<section class="hero" id="top" aria-labelledby="hero-heading">
    <div class="hero-copy">
      <h1 id="hero-heading">${escapeHtml(config.hero.heading)}</h1>
      <p>${escapeHtml(config.hero.summary)}</p>
      <div class="hero-actions">${link(config.hero.primary_cta, 'button button-primary')}${link(config.hero.secondary_cta, 'button button-secondary')}</div>
    </div>
    <figure class="hero-portrait"><img src="${escapeHtml(config.person.avatar)}" alt="${escapeHtml(config.site.seo.og_image_alt)}" width="512" height="512" decoding="async" fetchpriority="high"></figure>
  </section>`;
}

function renderMetrics(config) {
  return `<section class="impact-strip" aria-label="Career impact">${config.impact_metrics.map(metric => `<div><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.label)}</span></div>`).join('')}</section>`;
}

function renderProjectDetails(project) {
  const actions = project.actions.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  const outcomes = project.outcomes.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  const projectLinks = project.links.map(item => `${link(item, 'text-link')}${icons.arrow}`).join('');
  return `<dl class="case-study-facts">
    <div><dt>Role</dt><dd>${escapeHtml(project.role)}</dd></div>
    <div><dt>Challenge</dt><dd>${escapeHtml(project.challenge)}</dd></div>
    <div><dt>Actions</dt><dd><ul>${actions}</ul></dd></div>
    <div><dt>Results</dt><dd><ul>${outcomes}</ul></dd></div>
  </dl>${projectLinks ? `<div class="case-study-links">${projectLinks}</div>` : ''}`;
}

function renderProjects(config) {
  const projects = config.projects.items.filter(project => project.featured).map((project, index) => `<article class="case-study" id="${escapeHtml(project.id)}">
    <figure class="case-study-media"><img src="${escapeHtml(project.media.src)}" alt="${escapeHtml(project.media.alt)}" loading="lazy" decoding="async" data-fit="${escapeHtml(project.media.fit || 'cover')}"${project.media.position ? ` style="object-position:${escapeHtml(project.media.position)}"` : ''}></figure>
    <div class="case-study-copy">
      <div class="case-study-title"><p>${escapeHtml(project.date)}</p><h3>${escapeHtml(project.name)}</h3></div>
      <p class="case-study-summary">${escapeHtml(project.summary)}</p>
      <details class="case-study-disclosure" data-case-study ${index === 0 ? 'open' : ''}>
        <summary><span class="when-closed">Read case study</span><span class="when-open">Hide details</span></summary>
        ${renderProjectDetails(project)}
      </details>
    </div>
  </article>`).join('');
  return `<section class="section" id="impact" aria-labelledby="impact-heading"><div class="section-inner">${sectionHeading(config.projects.title).replace('<h2 ', '<h2 id="impact-heading" ')}<div class="case-study-list">${projects}</div></div></section>`;
}

function jobItem(job, older = false) {
  return `<article class="timeline-item${older ? ' timeline-item-older' : ''}">
    <span class="timeline-dot" aria-hidden="true"></span>
    <p class="timeline-date">${escapeHtml(job.date)}</p>
    <div><h3>${escapeHtml(job.role)}</h3><p class="timeline-company">${escapeHtml(job.company)}</p><ul>${job.responsibilities.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
  </article>`;
}

function renderExperience(config) {
  const visible = config.experience.jobs.slice(0, config.experience.visible_count).map(job => jobItem(job)).join('');
  const older = config.experience.jobs.slice(config.experience.visible_count);
  const olderMarkup = older.length ? `<details class="career-history"><summary>Full career history</summary><div class="timeline older-timeline">${older.map(job => jobItem(job, true)).join('')}</div></details>` : '';
  return `<section class="section section-muted" id="experience" aria-labelledby="experience-heading"><div class="section-inner">${sectionHeading(config.experience.title).replace('<h2 ', '<h2 id="experience-heading" ')}<div class="timeline">${visible}</div>${olderMarkup}</div></section>`;
}

function renderProof(config) {
  const items = config.proof.items.map(item => typeof item === 'string'
    ? `<li>${escapeHtml(item)}</li>`
    : `<li><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}${icons.external}</a></li>`).join('');
  return `<section class="section proof-section" id="proof" aria-labelledby="proof-heading"><div class="section-inner proof-layout">${sectionHeading(config.proof.title).replace('<h2 ', '<h2 id="proof-heading" ')}<ul class="proof-list">${items}</ul></div></section>`;
}

function renderWork(config) {
  const rows = config.open_source.items.map((item, index) => `<li class="work-row"><span class="work-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.summary)}</p>${item.stars ? `<span class="work-proof">${escapeHtml(item.stars)} GitHub stars${item.language ? ` · ${escapeHtml(item.language)}` : ''}</span>` : item.language ? `<span class="work-proof">${escapeHtml(item.language)}</span>` : ''}</div><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"><span>View project</span>${icons.external}</a></li>`).join('');
  return `<section class="section" id="work" aria-labelledby="work-heading"><div class="section-inner">${sectionHeading(config.open_source.title).replace('<h2 ', '<h2 id="work-heading" ')}<ol class="work-list">${rows}</ol></div></section>`;
}

function renderContact(config) {
  return `<section class="section" id="contact" aria-labelledby="contact-heading"><div class="section-inner"><div class="contact-panel"><h2 id="contact-heading">${escapeHtml(config.contact.heading)}</h2><div><p>${escapeHtml(config.contact.summary)}</p>${link(config.contact.primary_cta, 'button button-primary')}</div></div></div></section>`;
}

function renderFooter(config, year) {
  const social = config.contact.social_links.map(item => `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a>`).join('');
  return `<footer class="site-footer"><div class="footer-inner"><p>© ${year} ${escapeHtml(config.footer.copyright)}. All rights reserved.</p><nav aria-label="Social links">${social}</nav>${config.footer.show_built_with ? `<p class="built-with">${escapeHtml(config.footer.built_with_text)}</p>` : ''}</div></footer>`;
}

export function renderHtml(config, {year = new Date().getUTCFullYear()} = {}) {
  const canonical = `${config.site.base_url.replace(/\/$/, '')}/`;
  const personUrl = `https://github.com/${config.person.github_username}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.person.name,
    url: canonical,
    image: config.person.avatar,
    jobTitle: config.person.current_role,
    worksFor: {'@type': 'Organization', name: config.person.organization},
    sameAs: config.contact.social_links.map(item => item.url),
    knowsAbout: config.person.focus_areas,
    knowsLanguage: config.person.languages,
    mainEntityOfPage: {'@type': 'WebPage', '@id': canonical},
    subjectOf: config.projects.items.filter(item => item.featured).map(item => ({'@type': 'CreativeWork', name: item.name, description: item.summary, url: item.links[0]?.url || personUrl}))
  };
  return `<!DOCTYPE html>
<html lang="${escapeHtml(config.site.language)}" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(config.site.seo.title)}</title>
  <meta name="description" content="${escapeHtml(config.site.seo.description)}">
  <meta name="author" content="${escapeHtml(config.person.name)}">
  <meta name="keywords" content="${escapeHtml(config.site.seo.keywords.join(', '))}">
  <meta name="theme-color" content="#ffffff" data-theme-color>
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <link rel="icon" href="assets/favicons/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="site.webmanifest">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escapeHtml(config.site.seo.title)}">
  <meta property="og:description" content="${escapeHtml(config.site.seo.description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(config.site.seo.og_image)}">
  <meta property="og:image:alt" content="${escapeHtml(config.site.seo.og_image_alt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(config.site.seo.title)}">
  <meta name="twitter:description" content="${escapeHtml(config.site.seo.description)}">
  <meta name="twitter:image" content="${escapeHtml(config.site.seo.og_image)}">
  <script type="application/ld+json">${escapeJson(jsonLd)}</script>
  <script>try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch{document.documentElement.dataset.theme='light'}</script>
</head>
<body>
  ${renderHeader(config)}
  <noscript><p class="noscript-message">This portfolio is fully readable without JavaScript. Theme and mobile-menu controls require JavaScript.</p></noscript>
  <main id="main-content" tabindex="-1">
    <div class="page-shell">${renderHero(config)}${renderMetrics(config)}</div>
    ${renderProjects(config)}
    ${renderExperience(config)}
    ${renderProof(config)}
    ${renderWork(config)}
    ${renderContact(config)}
  </main>
  ${renderFooter(config, year)}
  <script src="app.js" defer></script>
</body>
</html>\n`;
}

export function renderSiteReadme(config) {
  return `# ${escapeMarkdown(config.person.name)}\n\n${escapeMarkdown(config.person.professional_headline)}\n\n[Visit the portfolio](${config.site.base_url}) · [GitHub](https://github.com/${config.person.github_username})\n\n## Selected impact\n\n${config.projects.items.filter(item => item.featured).map(item => `- **${escapeMarkdown(item.name)}** — ${escapeMarkdown(item.summary)}`).join('\n')}\n\n## Contact\n\n${escapeMarkdown(config.contact.summary)}\n\n${config.contact.social_links.map(item => `- [${escapeMarkdown(item.name)}](${item.url})`).join('\n')}\n`;
}

export function renderProfileReadme(config) {
  const current = config.experience.jobs[0];
  const selected = config.projects.items.filter(item => item.featured).slice(0, 3);
  const credentials = config.proof.items.filter(item => typeof item === 'object');
  const repoRows = config.open_source.items.map(item => `| [${escapeMarkdown(item.name)}](${item.url}) | ${escapeMarkdown(item.summary)} | ${escapeMarkdown(item.language || '—')} |`).join('\n');
  return `# Hi, I’m ${escapeMarkdown(config.person.name)}\n\n${escapeMarkdown(config.person.professional_headline)}. ${escapeMarkdown(config.hero.summary)}\n\n- I’m currently **${escapeMarkdown(current.role)}** at **${escapeMarkdown(current.company)}**.\n- I’m based in **${escapeMarkdown(config.person.location)}**.\n- My focus areas are ${config.person.focus_areas.map(item => `**${escapeMarkdown(item)}**`).join(', ')}.\n\n## Selected impact\n\n${config.impact_metrics.map(item => `- **${escapeMarkdown(item.value)}** ${escapeMarkdown(item.label)}`).join('\n')}\n\n## Selected work\n\n${selected.map(item => `- **${escapeMarkdown(item.name)}** — ${escapeMarkdown(item.summary)}${item.links[0] ? ` ([view](${item.links[0].url}))` : ''}`).join('\n')}\n${credentials.length ? `\n## Credentials\n\n${credentials.map(item => `- [${escapeMarkdown(item.name)}](${item.url})`).join('\n')}\n` : ''}\n## Open-source work\n\n<!-- TOP-REPOS:START -->\n| Repository | Description | Language |\n| --- | --- | --- |\n${repoRows}\n<!-- TOP-REPOS:END -->\n\n## Connect\n\n${config.contact.social_links.map(item => `- [${escapeMarkdown(item.name)}](${item.url})`).join('\n')}\n\n[View my portfolio](${config.site.base_url})\n`;
}
