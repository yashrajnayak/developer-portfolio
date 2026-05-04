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

            // Initialize scroll controls and desktop disclosure defaults
            this.initScrollToTop();
            this.handleDetailsDisplay();

            // Hide loading screen after the main portfolio content is ready
            this.loadingManager.hideLoadingScreen();

            // Load GitHub projects after the main portfolio is visible.
            const features = { github_projects: true, ...config.features };
            if (features.github_projects && config.github_username) {
                this.githubProjectsManager.fetchGitHubProjects(config).catch(error => {
                    console.error('Error loading GitHub projects:', error);
                });
            }

        } catch (error) {
            console.error('Error initializing portfolio:', error);
            this.loadingManager.hideLoadingScreen(false);
        }
    }

    handleDetailsDisplay() {
        const openDetailsOnDesktop = () => {
            const isDesktop = window.innerWidth >= 769;
            const detailsElements = document.querySelectorAll('.project-details, .experience-details');

            detailsElements.forEach(details => {
                details.open = isDesktop;
            });
        };

        openDetailsOnDesktop();
        window.addEventListener('resize', openDetailsOnDesktop);
    }

    initScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top');
        if (!scrollBtn) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    app.init();
});
