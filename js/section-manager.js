// Section Manager Module
export class SectionManager {
    constructor(configManager) {
        this.configManager = configManager;
    }

    escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    safeUrl(value) {
        const url = String(value || '').trim();
        if (!url) return '';

        if (/^(https?:|mailto:|tel:)/i.test(url)) {
            return this.escapeHtml(url);
        }

        if (/^(\/|\.\/|\.\.\/|#|assets\/)/.test(url)) {
            return this.escapeHtml(url);
        }

        return '';
    }

    listItems(items) {
        const values = Array.isArray(items) ? items : [items].filter(Boolean);
        return values.map(item => `<li>${this.escapeHtml(item)}</li>`).join('');
    }

    toggleSection(sectionClass, isEnabled) {
        const section = document.querySelector(`.${sectionClass}`);
        if (!section) return;

        section.style.display = isEnabled ? 'block' : 'none';
    }

    updatePageContent(config) {
        const features = {
            about: true,
            projects: true,
            experience: true,
            skills: true,
            github_projects: true,
            ...config.features
        };

        this.toggleSection('about', features.about);
        this.toggleSection('projects', features.projects);
        this.toggleSection('experience', features.experience);
        this.toggleSection('skills', features.skills);
        this.toggleSection('projects-on-github', features.github_projects);

        if (features.about) {
            this.updateAboutSection(config);
        }

        if (features.projects) {
            this.updateProjectsSection(config);
        }

        if (features.experience) {
            this.updateExperienceSection(config);
        }

        if (features.skills) {
            this.updateSkillsSection(config);
        }

        if (features.github_projects && config.github_projects?.title) {
            const githubProjectsTitle = document.querySelector('.projects-on-github h2');
            if (githubProjectsTitle) {
                githubProjectsTitle.textContent = config.github_projects.title;
            }
        }
    }

    updateAboutSection(config) {
        const aboutSection = document.querySelector('.about');
        if (!aboutSection) return;

        if (config.about?.paragraphs?.length) {
            aboutSection.innerHTML = config.about.paragraphs
                .map(paragraph => `<p>${this.escapeHtml(paragraph)}</p>`)
                .join('');
        } else {
            aboutSection.innerHTML = '<p>Welcome to my portfolio.</p>';
        }
    }

    updateProjectsSection(config) {
        const projectsSection = document.querySelector('.projects');
        if (!projectsSection) return;

        const titleElement = projectsSection.querySelector('h2');
        if (titleElement) {
            titleElement.textContent = this.configManager.getSectionTitle('projects');
        }

        projectsSection.querySelectorAll('.project-item').forEach(item => item.remove());

        const fragment = document.createDocumentFragment();

        if (config.projects?.items?.length) {
            config.projects.items.forEach(project => {
                fragment.appendChild(this.createProjectItem(project));
            });
        } else {
            const emptyState = document.createElement('div');
            emptyState.className = 'project-item';
            emptyState.innerHTML = `
                <div class="project-content">
                    <h3>Your Projects Will Appear Here</h3>
                    <p class="date">Coming Soon</p>
                    <ul>
                        <li>Add projects to config.json</li>
                        <li>Include project descriptions and optional screenshots</li>
                        <li>Showcase your best work</li>
                    </ul>
                </div>
            `;
            fragment.appendChild(emptyState);
        }

        projectsSection.appendChild(fragment);
    }

    createProjectItem(project) {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';

        const name = this.escapeHtml(project.name || 'Project');
        const date = project.date ? `<p class="date">${this.escapeHtml(project.date)}</p>` : '';
        const descriptionHtml = this.listItems(project.description || 'Project details coming soon.');
        const linksHtml = this.createProjectLinks(project);
        const imageSrc = this.safeUrl(project.picture);

        projectItem.innerHTML = `
            <details class="project-details">
                <summary class="project-header">
                    <div class="project-header-content">
                        <h3>${name}</h3>
                        ${date}
                    </div>
                    <div class="project-accordion-toggle" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                    </div>
                </summary>
                <div class="project-content">
                    <div class="project-content-desktop">
                        <h3>${name}</h3>
                        ${date}
                    </div>
                    <ul>
                        ${descriptionHtml}
                    </ul>
                    ${linksHtml}
                </div>
            </details>
            ${imageSrc ? `
            <div class="project-image">
                <img src="${imageSrc}" alt="${name} project screenshot" loading="lazy">
            </div>
            ` : ''}
        `;

        return projectItem;
    }

    createProjectLinks(project) {
        const links = [];

        if (project.link) {
            links.push(typeof project.link === 'object' ? project.link : {
                url: project.link,
                title: 'View Project'
            });
        }

        if (Array.isArray(project.links)) {
            links.push(...project.links);
        }

        const linkHtml = links
            .map(link => {
                const url = this.safeUrl(link?.url);
                if (!url) return '';

                const title = this.escapeHtml(link.title || link.name || 'View Project');
                const projectName = this.escapeHtml(project.name || 'project');
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${title} for ${projectName}">${title}</a>`;
            })
            .filter(Boolean)
            .join('');

        return linkHtml ? `<div class="project-links">${linkHtml}</div>` : '';
    }

    updateExperienceSection(config) {
        const experienceSection = document.querySelector('.experience');
        if (!experienceSection) return;

        const titleElement = experienceSection.querySelector('h2');
        if (titleElement) {
            titleElement.textContent = this.configManager.getSectionTitle('experience');
        }

        experienceSection.querySelectorAll('.experience-item').forEach(item => item.remove());

        const fragment = document.createDocumentFragment();

        if (config.experience?.jobs?.length) {
            config.experience.jobs.forEach(job => {
                fragment.appendChild(this.createExperienceItem(job));
            });
        } else {
            const emptyState = document.createElement('div');
            emptyState.className = 'experience-item';
            emptyState.innerHTML = `
                <div class="experience-content">
                    <h3>Your Experience Will Appear Here</h3>
                    <p class="date">Ready to showcase your career</p>
                    <ul>
                        <li>Add work experience to config.json</li>
                        <li>Include company logos and concise achievements</li>
                        <li>Highlight measurable impact</li>
                    </ul>
                </div>
            `;
            fragment.appendChild(emptyState);
        }

        experienceSection.appendChild(fragment);
    }

    createExperienceItem(job) {
        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';

        const company = this.escapeHtml(job.company || 'Company');
        const role = this.escapeHtml(job.role || 'Role');
        const date = job.date ? `<p class="date">${this.escapeHtml(job.date)}</p>` : '';
        const responsibilitiesHtml = this.listItems(job.responsibilities || 'Add responsibilities to config.json.');

        const logo = this.safeUrl(job.logo);
        const darkLogo = this.safeUrl(job.logo_dark);
        const logoHtml = logo || darkLogo ? `
            <div class="company-logo">
                ${logo ? `<img src="${logo}" alt="${company} logo" class="light-mode-logo" loading="lazy">` : ''}
                ${darkLogo ? `<img src="${darkLogo}" alt="${company} logo" class="dark-mode-logo" loading="lazy">` : ''}
            </div>
        ` : '';

        experienceItem.innerHTML = `
            <details class="experience-details">
                <summary class="experience-header">
                    <div class="experience-header-content">
                        <h3>${company} | ${role}</h3>
                        ${date}
                    </div>
                    ${logoHtml}
                    <div class="accordion-toggle" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                    </div>
                </summary>
                <div class="experience-content">
                    <ul>
                        ${responsibilitiesHtml}
                    </ul>
                </div>
            </details>
        `;

        return experienceItem;
    }

    updateSkillsSection(config) {
        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;

        const titleElement = skillsSection.querySelector('h2');
        if (titleElement) {
            titleElement.textContent = this.configManager.getSectionTitle('skills');
        }

        const skillsGrid = skillsSection.querySelector('.skills-grid');
        if (!skillsGrid) return;

        const fragment = document.createDocumentFragment();
        skillsGrid.innerHTML = '';

        if (config.skills?.categories?.length) {
            config.skills.categories.forEach(category => {
                fragment.appendChild(this.createSkillCategory(category));
            });
        } else {
            const emptyState = document.createElement('div');
            emptyState.className = 'skill-category';
            emptyState.innerHTML = `
                <h3>Your Skills Will Appear Here</h3>
                <ul>
                    <li>Add technical skills to config.json</li>
                    <li>Organize them into categories</li>
                    <li>Include certifications with links</li>
                </ul>
            `;
            fragment.appendChild(emptyState);
        }

        skillsGrid.appendChild(fragment);
    }

    createSkillCategory(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';

        const itemsHtml = Array.isArray(category.items)
            ? category.items.map(item => this.createSkillItem(item)).join('')
            : this.createSkillItem(category.items);

        categoryDiv.innerHTML = `
            <h3>${this.escapeHtml(category.name || 'Skills')}</h3>
            <ul>
                ${itemsHtml}
            </ul>
        `;

        return categoryDiv;
    }

    createSkillItem(item) {
        if (typeof item === 'object' && item?.name && item?.url) {
            const url = this.safeUrl(item.url);
            const name = this.escapeHtml(item.name);
            if (url) {
                return `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a></li>`;
            }
            return `<li>${name}</li>`;
        }

        return `<li>${this.escapeHtml(item)}</li>`;
    }
}
