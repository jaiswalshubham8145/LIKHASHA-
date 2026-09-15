import { test, expect } from '../e2e/fixtures/test';

test.describe('Reliability', () => {
  test('offline → service worker serves cached shell', async ({ ownerPage, context }) => {
    await ownerPage.goto('/dashboard');
    await ownerPage.waitForLoadState('networkidle');
    // Wait for SW activation
    await ownerPage.evaluate(() => navigator.serviceWorker.ready);

    await context.setOffline(true);
    await ownerPage.reload();
    // Shell still renders
    await expect(ownerPage.getByRole('heading', { name: /dashboards/i })).toBeVisible();
    await context.setOffline(false);
  });

  test('offline mutations are queued and replayed', async ({ ownerPage, context }) => {
    await ownerPage.goto('/settings/team');
    await context.setOffline(true);
    await ownerPage.getByRole('button', { name: /invite member/i }).click();
    await ownerPage.getByLabel(/email/i).fill('offline@example.com');
    await ownerPage.getByRole('button', { name: /send invite/i }).click();
    await expect(ownerPage.getByText(/queued|will be sent/i)).toBeVisible();
    await context.setOffline(false);
    await expect(ownerPage.getByText(/sent|success/i)).toBeVisible({ timeout: 10_000 });
  });

  test('5xx → retry with backoff surfaces user-friendly error', async ({ ownerPage, context }) => {
    let attempt = 0;
    await context.route('**/api/dashboards', (route) => {
      attempt++;
      if (attempt < 4) return route.fulfill({ status: 503 });
      return route.continue();
    });
    await ownerPage.goto('/dashboards');
    // After retries succeed, list loads
    await expect(ownerPage.getByText('Revenue Overview')).toBeVisible({ timeout: 10_000 });
    expect(attempt).toBeGreaterThanOrEqual(4);
  });

  test('5xx exhausting retries shows error with retry button', async ({ ownerPage, context }) => {
    await context.route('**/api/dashboards', (route) =>
      route.fulfill({ status: 503, body: JSON.stringify({ code: 'unavailable' }) }),
    );
    await ownerPage.goto('/dashboards');
    await expect(ownerPage.getByRole('alert')).toContainText(/try again|retry|unavailable/i);
    await expect(ownerPage.getByRole('button', { name: /retry/i })).toBeVisible();
  });

  test('timeout (>10s) → error state', async ({ ownerPage, context }) => {
    await context.route('**/api/dashboards', async (route) => {
      await new Promise((r) => setTimeout(r, 12_000));
      return route.continue();
    });
    await ownerPage.goto('/dashboards');
    await expect(ownerPage.getByRole('alert')).toBeVisible({ timeout: 15_000 });
  });

  test('slow 3G → skeletons render and then content', async ({ ownerPage, context }) => {
    await context.route('**/*', async (route) => {
      await new Promise((r) => setTimeout(r, 800));
      return route.continue();
    });
    await ownerPage.goto('/dashboards');
    // Skeletons are present while loading
    const skeletons = ownerPage.locator('[data-testid="skeleton"]');
    await expect(skeletons.first()).toBeVisible();
    await expect(ownerPage.getByText('Revenue Overview')).toBeVisible({ timeout: 10_000 });
  });

  test('tab backgrounded for 60s does not leak memory', async ({ ownerPage }) => {
    await ownerPage.goto('/dashboard');
    const before = await ownerPage.evaluate(
      () => (performance as any).memory?.usedJSHeapSize ?? 0,
    );
    await ownerPage.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await ownerPage.waitForTimeout(60_000);
    const after = await ownerPage.evaluate(
      () => (performance as any).memory?.usedJSHeapSize ?? 0,
    );
    expect(after).toBeLessThan(before * 1.5 + 10_000_000);
  });
});
