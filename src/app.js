(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeColor = document.querySelector('[data-theme-color]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNavigation = document.querySelector('[data-mobile-nav]');
  const compactLayout = window.matchMedia('(max-width: 720px)');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  function storedTheme() {
    try {
      return localStorage.getItem('portfolio-theme');
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      // The selected theme still applies for this visit when storage is unavailable.
    }
  }

  function applyTheme(theme, persist = false) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = nextTheme;
    themeToggle?.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    themeToggle?.setAttribute('aria-label', `Switch to ${nextTheme === 'dark' ? 'light' : 'dark'} theme`);
    themeToggle?.querySelector('[data-theme-icon-light]')?.toggleAttribute('hidden', nextTheme === 'dark');
    themeToggle?.querySelector('[data-theme-icon-dark]')?.toggleAttribute('hidden', nextTheme !== 'dark');
    themeColor?.setAttribute('content', nextTheme === 'dark' ? '#0b1220' : '#ffffff');
    if (persist) setStoredTheme(nextTheme);
  }

  function closeMenu({restoreFocus = false} = {}) {
    if (!mobileNavigation || !menuToggle) return;
    mobileNavigation.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.querySelector('[data-menu-open]')?.removeAttribute('hidden');
    menuToggle.querySelector('[data-menu-close]')?.setAttribute('hidden', '');
    if (restoreFocus) menuToggle.focus();
  }

  function toggleMenu() {
    if (!mobileNavigation || !menuToggle) return;
    const opening = mobileNavigation.hidden;
    mobileNavigation.hidden = !opening;
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    menuToggle.querySelector('[data-menu-open]')?.toggleAttribute('hidden', opening);
    menuToggle.querySelector('[data-menu-close]')?.toggleAttribute('hidden', !opening);
    if (opening) mobileNavigation.querySelector('a')?.focus();
  }

  function updateCaseStudies() {
    document.querySelectorAll('[data-case-study]').forEach((details, index) => {
      details.open = compactLayout.matches ? index === 0 : true;
    });
  }

  applyTheme(storedTheme() || (systemTheme.matches ? 'dark' : 'light'));
  updateCaseStudies();

  themeToggle?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  menuToggle?.addEventListener('click', toggleMenu);
  mobileNavigation?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileNavigation && !mobileNavigation.hidden) closeMenu({restoreFocus: true});
  });
  compactLayout.addEventListener('change', () => {
    closeMenu();
    updateCaseStudies();
  });
  systemTheme.addEventListener('change', event => {
    if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light');
  });
})();
