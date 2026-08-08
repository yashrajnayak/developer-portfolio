import {expect, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {loadConfig} from '../../scripts/lib/config.mjs';

const {config} = loadConfig(process.env.PORTFOLIO_CONFIG || 'config.json');

const viewports = [
  {name: 'mobile', width: 390, height: 844},
  {name: 'tablet', width: 768, height: 1024},
  {name: 'desktop', width: 1440, height: 1000}
];

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({viewport});

    test('renders without console errors, overflow, overlap, or serious axe findings', async ({page}) => {
      const errors = [];
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      const layout = await page.evaluate(() => ({
        bodyHeight: document.body.scrollHeight,
        bodyWidth: document.body.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        controls: [...document.querySelectorAll('[data-theme-toggle], [data-menu-toggle]')].filter(element => getComputedStyle(element).display !== 'none').map(element => {
          const rect = element.getBoundingClientRect();
          return {width: rect.width, height: rect.height, bottom: rect.bottom};
        }),
        headerBottom: document.querySelector('[data-site-header]').getBoundingClientRect().bottom,
        heroTop: document.querySelector('.hero').getBoundingClientRect().top
      }));
      expect(layout.bodyWidth).toBeLessThanOrEqual(layout.viewportWidth);
      expect(layout.controls.every(control => control.width >= 44 && control.height >= 44)).toBe(true);
      expect(layout.heroTop).toBeGreaterThanOrEqual(layout.headerBottom - 1);
      if (viewport.width === 390) expect(layout.bodyHeight).toBeLessThan(6500);
      const results = await new AxeBuilder({page}).analyze();
      expect(results.violations.filter(violation => ['serious', 'critical'].includes(violation.impact))).toEqual([]);
      expect(errors).toEqual([]);
    });
  });
}

test('supports theme, keyboard navigation, menu, and reduced motion', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.emulateMedia({colorScheme: 'dark', reducedMotion: 'reduce'});
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.locator('[data-menu-toggle]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-mobile-nav]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-mobile-nav]')).toBeHidden();
  await expect(page.locator('[data-menu-toggle]')).toBeFocused();
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('generated HTML is useful before JavaScript runs', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false, viewport: {width: 768, height: 1024}});
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveTitle(config.site.seo.title);
  await expect(page.locator('h1')).toHaveText(config.hero.heading);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByAltText(config.site.seo.og_image_alt, {exact: true})).toBeVisible();
  await expect(page.locator('#impact')).toContainText(config.projects.items[0].name);
  await expect(page.locator('#contact a')).toHaveAttribute('href', /^https:\/\//);
  await context.close();
});
