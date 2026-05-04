// GitHub Projects Manager Module
export class GitHubProjectsManager {
    constructor() {
        this.projectsContainer = null;
        this.requestTimeoutMs = 5000;
        this.defaultMaxRepos = 6;
        this.defaultTopic = 'featured';
    }

    async fetchJson(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);

        try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return response.json();
        } finally {
            clearTimeout(timeoutId);
        }
    }

    setMessage(message) {
        if (!this.projectsContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'loading';
        messageElement.setAttribute('role', 'status');
        messageElement.textContent = message;
        this.projectsContainer.replaceChildren(messageElement);
    }

    getSettings(config) {
        const settings = config.github_projects || {};
        const username = config.github_username;
        const excludedRepos = new Set([
            username,
            ...(settings.excluded_repos || [])
        ].filter(Boolean));

        return {
            mode: settings.mode || (settings.source_url ? 'feed' : 'featured'),
            topic: settings.topic || this.defaultTopic,
            sourceUrl: settings.source_url || '',
            maxRepos: Number.isInteger(settings.max_repos) ? settings.max_repos : this.defaultMaxRepos,
            excludedRepos
        };
    }

    normalizeRepo(repo) {
        return {
            name: repo.name,
            description: repo.description || '',
            url: repo.html_url || repo.url,
            homepage: repo.homepage || '',
            language: repo.language || '',
            stars: repo.stars ?? repo.stargazers_count ?? 0,
            forks: repo.forks ?? repo.forks_count ?? 0,
            topics: repo.topics || [],
            updatedAt: repo.updatedAt || repo.updated_at || '',
            pushedAt: repo.pushedAt || repo.pushed_at || '',
            archived: Boolean(repo.archived),
            fork: Boolean(repo.fork)
        };
    }

    getDisplayRepos(repos, settings) {
        return repos
            .map(repo => this.normalizeRepo(repo))
            .filter(repo => repo.name && repo.url)
            .filter(repo => !repo.archived && !repo.fork)
            .filter(repo => !settings.excludedRepos.has(repo.name))
            .sort((a, b) => {
                if (b.stars !== a.stars) {
                    return b.stars - a.stars;
                }

                const bDate = Date.parse(b.pushedAt || b.updatedAt) || 0;
                const aDate = Date.parse(a.pushedAt || a.updatedAt) || 0;
                return bDate - aDate;
            })
            .slice(0, settings.maxRepos);
    }

    async fetchFromProfileFeed(settings) {
        if (!settings.sourceUrl) {
            return [];
        }

        const repos = await this.fetchJson(settings.sourceUrl);
        if (!Array.isArray(repos)) {
            throw new Error('Repository feed must return an array');
        }

        return this.getDisplayRepos(repos, settings);
    }

    async fetchFeaturedRepos(username, settings) {
        const repos = await this.fetchJson(`https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=100`);
        const featuredRepos = repos.filter(repo => repo.topics?.includes(settings.topic));

        return this.getDisplayRepos(featuredRepos, settings);
    }

    async fetchFromGitHubSearch(username, settings) {
        const query = encodeURIComponent(`user:${username} fork:false archived:false`);
        const perPage = Math.min(100, settings.maxRepos + settings.excludedRepos.size + 5);
        const data = await this.fetchJson(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=${perPage}`);

        return this.getDisplayRepos(data.items || [], settings);
    }

    async fetchFromGitHubRepos(username, settings) {
        const repos = await this.fetchJson(`https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=100`);

        return this.getDisplayRepos(repos, settings);
    }

    async fetchGitHubProjects(config) {
        this.projectsContainer = document.getElementById('projects');
        const username = config.github_username;
        const settings = this.getSettings(config);

        if (!this.projectsContainer) {
            console.warn('Projects container not found, skipping GitHub projects');
            return;
        }

        if (!username) {
            console.warn('No GitHub username provided, skipping GitHub projects');
            return;
        }

        this.projectsContainer.replaceChildren();

        try {
            const repos = await this.getRepos(username, settings);

            if (repos.length > 0) {
                this.renderProjects(repos, username);
                return;
            }

            if (settings.mode === 'featured') {
                this.setMessage(`No repositories found with the "${settings.topic}" topic.`);
            } else {
                this.setMessage('No public repositories found.');
            }
        } catch (error) {
            this.setMessage('GitHub projects are temporarily unavailable.');
            console.error('Error loading GitHub projects:', error);
        }
    }

    async getRepos(username, settings) {
        if (settings.sourceUrl) {
            try {
                const feedRepos = await this.fetchFromProfileFeed(settings);
                if (feedRepos.length > 0) return feedRepos;
            } catch (error) {
                console.warn('Repository feed failed, falling back to GitHub APIs', error);
            }
        }

        if (settings.mode === 'featured') {
            return this.fetchFeaturedRepos(username, settings);
        }

        try {
            const searchRepos = await this.fetchFromGitHubSearch(username, settings);
            if (searchRepos.length > 0) return searchRepos;
        } catch (error) {
            console.warn('GitHub Search API failed, falling back to user repositories', error);
        }

        return this.fetchFromGitHubRepos(username, settings);
    }

    formatNumber(value) {
        return new Intl.NumberFormat('en-US').format(value || 0);
    }

    createProjectMeta(repo) {
        const meta = document.createElement('div');
        meta.className = 'project-meta';

        const stats = [
            { icon: 'star', label: `${this.formatNumber(repo.stars)} stars` },
            { icon: 'call_split', label: `${this.formatNumber(repo.forks)} forks` }
        ];

        if (repo.language) {
            stats.push({ icon: 'code', label: repo.language });
        }

        stats.forEach(stat => {
            const item = document.createElement('span');
            item.className = 'project-stat';

            const icon = document.createElement('span');
            icon.className = 'material-symbols-outlined';
            icon.setAttribute('aria-hidden', 'true');
            icon.textContent = stat.icon;

            const label = document.createElement('span');
            label.textContent = stat.label;

            item.append(icon, label);
            meta.appendChild(item);
        });

        return meta;
    }

    createTopics(repo) {
        const topics = repo.topics.slice(0, 3);
        if (topics.length === 0) {
            return null;
        }

        const topicList = document.createElement('div');
        topicList.className = 'project-topics';

        topics.forEach(topic => {
            const item = document.createElement('span');
            item.textContent = topic;
            topicList.appendChild(item);
        });

        return topicList;
    }

    renderProjects(repos, username) {
        const fragment = document.createDocumentFragment();

        repos.forEach((repo, index) => {
            const card = this.createGitHubProjectCard(repo, index);
            fragment.appendChild(card);
        });

        this.projectsContainer.appendChild(fragment);
        this.addSeeAllRepositoriesLink(username);
    }

    createGitHubProjectCard(repo, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const title = document.createElement('h3');
        const titleLink = document.createElement('a');
        titleLink.href = repo.url;
        titleLink.target = '_blank';
        titleLink.rel = 'noopener noreferrer';
        titleLink.setAttribute('aria-label', `View ${repo.name} repository on GitHub`);
        titleLink.textContent = repo.name;
        title.appendChild(titleLink);

        const meta = this.createProjectMeta(repo);

        const description = document.createElement('p');
        description.textContent = repo.description || 'No description provided.';

        const topics = this.createTopics(repo);

        const links = document.createElement('div');
        links.className = 'project-links';

        const repositoryLink = document.createElement('a');
        repositoryLink.href = repo.url;
        repositoryLink.target = '_blank';
        repositoryLink.rel = 'noopener noreferrer';
        repositoryLink.setAttribute('aria-label', `View ${repo.name} repository on GitHub`);
        repositoryLink.textContent = 'View Repository';
        links.appendChild(repositoryLink);

        if (repo.homepage) {
            const homepageLink = document.createElement('a');
            homepageLink.href = repo.homepage;
            homepageLink.target = '_blank';
            homepageLink.rel = 'noopener noreferrer';
            homepageLink.setAttribute('aria-label', `View live demo of ${repo.name}`);
            homepageLink.textContent = 'Live Demo';
            links.appendChild(homepageLink);
        }

        card.append(title, meta, description);
        if (topics) {
            card.appendChild(topics);
        }
        card.appendChild(links);
        return card;
    }

    addSeeAllRepositoriesLink(username) {
        const projectsSection = document.querySelector('.projects-on-github');
        if (!projectsSection) return;

        let seeAllLink = projectsSection.querySelector('.see-all-repos');

        if (!seeAllLink) {
            seeAllLink = document.createElement('div');
            seeAllLink.className = 'see-all-repos';

            const link = document.createElement('a');
            link.href = `https://github.com/${username}?tab=repositories`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', `See all GitHub repositories for ${username}`);
            link.textContent = 'See all repositories';

            const icon = document.createElement('span');
            icon.className = 'material-symbols-outlined';
            icon.setAttribute('aria-hidden', 'true');
            icon.textContent = 'arrow_forward';

            link.appendChild(icon);
            seeAllLink.appendChild(link);
            projectsSection.appendChild(seeAllLink);
        }
    }
}
