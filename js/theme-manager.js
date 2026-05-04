// Theme Manager Module
export class ThemeManager {
    constructor() {
        this.themeSwitch = null;
        this.root = document.documentElement;
    }

    init() {
        this.themeSwitch = document.querySelector('.theme-switch');
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.root.setAttribute('data-theme', savedTheme);
        this.updateToggleState(savedTheme);

        // Add event listener for theme switch
        if (this.themeSwitch) {
            this.themeSwitch.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        const currentTheme = this.root.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateToggleState(newTheme);
    }

    updateToggleState(theme) {
        if (!this.themeSwitch) return;

        const isDark = theme === 'dark';
        this.themeSwitch.setAttribute('aria-pressed', String(isDark));
        this.themeSwitch.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
}
