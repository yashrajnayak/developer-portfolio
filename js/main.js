// Main Application Module
import { ConfigManager } from './config-manager.js';
import { SEOManager } from './seo-manager.js';
import { ThemeManager } from './theme-manager.js';
import { LoadingManager } from './loading-manager.js';
import { SectionManager } from './section-manager.js';
import { HeaderManager } from './header-manager.js';
import { GitHubProjectsManager } from './github-projects-manager.js';
import { FooterManager } from './footer-manager.js';

class PortfolioApp {
    constructor() {
        this.configManager = new ConfigManager();
        this.seoManager = new SEOManager();
        this.themeManager = new ThemeManager();
        this.loadingManager = new LoadingManager();
        this.sectionManager = new SectionManager(this.configManager);
        this.headerManager = new HeaderManager();
        this.githubProjectsManager = new GitHubProjectsManager();
        this.footerManager = new FooterManager();
    }

    async init() {
        try {
            // Initialize theme first
            this.themeManager.init();

            // Load configuration
            const config = await this.configManager.loadConfig();
            if (!config) return;

            // Update SEO tags first
            this.seoManager.updateSEOTags(config);

            // Update header section
            this.headerManager.updateHeaderSection(config);

            // Update page content from config
            this.sectionManager.updatePageContent(config);

            // Update footer section
            this.footerManager.updateFooterSection(config);

            // Conditionally fetch GitHub projects based on feature flag
            const features = { github_projects: true, ...config.features };
            if (features.github_projects && config.github_username) {
                await this.githubProjectsManager.fetchGitHubProjects(config);
            }
            
            // Hide loading screen after all content has loaded
            this.loadingManager.hideLoadingScreen();

        } catch (error) {
            console.error('Error initializing portfolio:', error);
            this.loadingManager.hideLoadingScreen(false);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    app.init();
});
