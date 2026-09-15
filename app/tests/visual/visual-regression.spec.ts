import { test, expect } from '../e2e/fixtures/test';

// Mask: dynamic timestamps, user names, avatars, charts
const mask = [
  '[data-testid="chart"]',
  '[data-testid="avatar"]',
  '[data-testid="timestamp"]',
  '[data-testid="user-menu"]',
  '.recharts-tooltip-wrapper',
];

const routes = [
  { path: '/', name: 'landing' },
  { path: '/login', name: 'login' },
  { path: '/dashboard', name: 'dashboard' },
  { path: '/dashboards', name: 'dashboards' },
  { path: '/dashboards/d_1', name: 'dashboard-detail' },
  { path: '/settings/profile', name: 'settings-profile' },
  { path: '/settings/billing', name: 'settings-billing' },
  { path: '/settings/team', name: 'settings-team' },
];

const themes = ['light', 'dark', 'high-contrast'] as const;
const locales = ['en-US', 'de-DE', 'ar-SA'] as const;

for (const theme of themes) {
  for (const route of routes) {
    test(`visual — ${theme} — ${route.path}`, async ({ ownerPage }) => {
      await ownerPage.goto(route.path);
      await ownerPage.evaluate((t) => {
        document.documentElement.dataset.theme = t;
        document.documentElement.lang = 'en-US';
      }, theme);
      await ownerPage.waitForLoadState('networkidle');
      await ownerPage.waitForFunction(() => document.fonts.ready.then(() => true));
      await expect(ownerPage).toHaveScreenshot(`visual/baselines/${theme}${route.name}.png`, {
        fullPage: true,
        mask: route.path.startsWith('/settings') || route.path === '/dashboard' || route.path === '/dashboards' || route.path === '/dashboards/d_1'
          ? ownerPage.locator(mask.join(',')).all().then(() => ownerPage.locator(mask.join(',')))
          : undefined,
        maxDiffPixelRatio: 0.001,
      });
    });
  }
}

for (const locale of locales) {
  test(`visual — i18n — /dashboard (${locale})`, async ({ ownerPage }) => {
    await ownerPage.goto('/dashboard');
    await ownerPage.evaluate((l) => {
      document.documentElement.lang = l;
      document.documentElement.dir = l === 'ar-SA' ? 'rtl' : 'ltr';
    }, locale);
    await ownerPage.waitForLoadState('networkidle');
    await expect(ownerPage).toHaveScreenshot(`visual/baselines/i18n-${locale}-dashboard.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.005,
    });
  });
}

test('visual — modal open state', async ({ ownerPage }) => {
  await ownerPage.goto('/settings/team');
  await ownerPage.getByRole('button', { name: /invite member/i }).click();
  await expect(ownerPage.getByRole('dialog')).toBeVisible();
  await expect(ownerPage).toHaveScreenshot('visual/baselines/team-invite-dialog.png', {
    maxDiffPixelRatio: 0.001,
  });
});

test('visual — toast notifications', async ({ ownerPage }) => {
  await ownerPage.goto('/dashboards');
  await ownerPage.getByRole('button', { name: /new dashboard/i }).click();
  await ownerPage.getByLabel(/name/i).fill('Visual');
  await ownerPage.getByRole('button', { name: /^create$/i }).click();
  await expect(ownerPage.getByRole('status')).toBeVisible();
  await expect(ownerPage).toHaveScreenshot('visual/baselines/toast-success.png', {
    maxDiffPixelRatio: 0.001,
  });
});
