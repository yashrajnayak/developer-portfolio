// GitHub Projects Manager Module
export class GitHubProjectsManager {
    constructor() {
        this.projectsContainer = null;
    }

    // Fetch GitHub projects with "featured" topic
    async fetchGitHubProjects(config) {
        this.projectsContainer = document.getElementById('projects');
        const username = config.github_username;
        
        if (!username) {
            console.warn('No GitHub username provided, skipping GitHub projects');
            return;
        }
        
        try {
            // Clear loading message
            this.projectsContainer.innerHTML = '';
            
            // Fetch repositories with "featured" topic using GitHub REST API
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }
            
            const repos = await response.json();
            
            // Filter repositories that have "featured" topic
            const featuredRepos = repos.filter(repo => 
                repo.topics && repo.topics.includes('featured')
            );
            
            if (featuredRepos.length > 0) {
                this.renderProjects(featuredRepos, username);
            } else {
                this.projectsContainer.innerHTML = `
                    <div class="loading">
                        No featured repositories found. Add the "featured" topic to your repositories to display them here.
                    </div>
                `;
            }
        } catch (error) {
            this.projectsContainer.innerHTML = '<div class="loading">Failed to load projects. Please try again later.</div>';
            console.error('Error loading GitHub projects:', error);
        }
    }

    // Render GitHub projects
    renderProjects(repos, username) {
        const fragment = document.createDocumentFragment();
        
        repos.forEach((repo, index) => {
            const card = this.createGitHubProjectCard(repo, index);
            fragment.appendChild(card);
        });
        
        this.projectsContainer.appendChild(fragment);
        this.addSeeAllRepositoriesLink(username);
    }

    // Create GitHub project card
    createGitHubProjectCard(repo, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Create content with improved accessibility
        card.innerHTML = `
            <h3>${repo.name}</h3>
            ${repo.description ? `<p>${repo.description}</p>` : '<p>No description available</p>'}
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" aria-label="View ${repo.name} repository on GitHub">View Repository</a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" aria-label="View live demo of ${repo.name}">Live Demo</a>` : ''}
            </div>
        `;
        
        return card;
    }

    // Helper function to add "See all repositories" link
    addSeeAllRepositoriesLink(username) {
        const projectsSection = document.querySelector('.projects-on-github');
        
        // Check if the "See all repositories" link already exists
        let seeAllLink = projectsSection.querySelector('.see-all-repos');
        
        if (!seeAllLink) {
            seeAllLink = document.createElement('div');
            seeAllLink.className = 'see-all-repos';
            
            const link = document.createElement('a');
            link.href = `https://github.com/${username}?tab=repositories`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', `See all GitHub repositories for ${username}`);
            link.textContent = 'See all repositories →';
            
            seeAllLink.appendChild(link);
            projectsSection.appendChild(seeAllLink);
        }
    }
}
