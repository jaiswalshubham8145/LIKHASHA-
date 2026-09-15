import { test, expect } from '../e2e/fixtures/test';

const routes = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/dashboards',
  '/settings/profile',
  '/settings/billing',
  '/settings/team',
];

for (const route of routes) {
  test(`a11y audit — ${route}`, async ({ ownerPage, makeAxe }) => {
    await ownerPage.goto(route);
    await ownerPage.waitForLoadState('networkidle');

    const results = await makeAxe()
      .disableRules(['color-contrast']) // enable if theming is verified
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    expect(
      critical,
      `Critical a11y violations on ${route}: ${JSON.stringify(critical, null, 2)}`,
    ).toEqual([]);
  });
}

test('color contrast meets WCAG AA across all themes', async ({ ownerPage, makeAxe }) => {
  for (const theme of ['light', 'dark', 'high-contrast']) {
    await ownerPage.goto('/dashboard');
    await ownerPage.evaluate((t) => {
      document.documentElement.dataset.theme = t;
    }, theme);
    const results = await makeAxe()
      .options({ rules: { 'color-contrast': { enabled: true } } })
      .analyze();
    const contrast = results.violations.filter((v) => v.id === 'color-contrast');
    expect(contrast, `Contrast violations in ${theme}: ${JSON.stringify(contrast, null, 2)}`).toEqual([]);
  }
});

test('respects prefers-reduced-motion', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/dashboards');
  const animationDuration = await page.evaluate(() => {
    const el = document.querySelector('[data-test-animated]');
    if (!el) return 0;
    return getComputedStyle(el).animationDuration;
  });
  expect(animationDuration).toMatch(/^0(m?s)?$/);
  await ctx.close();
});
