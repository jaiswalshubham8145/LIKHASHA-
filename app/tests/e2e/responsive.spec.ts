import { test, expect } from './fixtures/test';

const viewports = [
  { name: 'mobile-iphone-se', width: 375, height: 667 },
  { name: 'mobile-pixel-8', width: 412, height: 915 },
  { name: 'tablet-ipad', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'ultrawide-3440', width: 3440, height: 1440 },
];

for (const v of viewports) {
  test.describe(`Responsive — ${v.name}`, () => {
    test.use({ viewport: { width: v.width, height: v.height } });

    test('landing page has no horizontal scroll', async ({ page }) => {
      await page.goto('/');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });

    test('login form is usable and accessible', async ({ page, makeAxe }) => {
      await page.goto('/login');
      const a11y = await makeAxe().analyze();
      expect(a11y.violations, JSON.stringify(a11y.violations, null, 2)).toEqual([]);
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('dashboard navigation works at this width', async ({ ownerPage }) => {
      await ownerPage.goto('/dashboards');
      const nav = ownerPage.getByRole('navigation', { name: /primary/i });
      await expect(nav).toBeVisible();

      // Hamburger on small, full nav on large
      if (v.width < 768) {
        await expect(ownerPage.getByRole('button', { name: /open menu/i })).toBeVisible();
      } else {
        await expect(ownerPage.getByRole('link', { name: /dashboards/i })).toBeVisible();
      }
    });

    test('touch targets are at least 44x44 on small viewports', async ({ page }) => {
      test.skip(v.width >= 768, 'Touch target rule applies to mobile');
      await page.goto('/login');
      const buttons = await page.getByRole('button').all();
      for (const b of buttons) {
        const box = await b.boundingBox();
        if (!box) continue;
        expect(box.width, `button ${await b.textContent()}`).toBeGreaterThanOrEqual(40);
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    });
  });
}

test.describe('Orientation changes', () => {
  test.use({ viewport: { width: 1024, height: 768 } });
  test('tablet landscape vs portrait', async ({ ownerPage }) => {
    await ownerPage.goto('/dashboards/d_1');
    await expect(ownerPage.getByTestId('kpi-mrr')).toBeVisible();
    await ownerPage.setViewportSize({ width: 768, height: 1024 });
    await expect(ownerPage.getByTestId('kpi-mrr')).toBeVisible();
  });
});
