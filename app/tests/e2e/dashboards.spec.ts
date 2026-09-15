import { test, expect } from './fixtures/test';

test.describe('Dashboard journeys — J4/J5', () => {
  test('J4: owner creates a dashboard and sees it in the list', async ({ ownerPage }) => {
    await ownerPage.goto('/dashboards');
    await expect(ownerPage.getByRole('heading', { name: /dashboards/i })).toBeVisible();

    await ownerPage.getByRole('button', { name: /new dashboard/i }).click();
    const name = `Funnel ${Date.now()}`;
    await ownerPage.getByLabel(/name/i).fill(name);
    await ownerPage.getByRole('button', { name: /^create$/i }).click();

    await expect(ownerPage.getByRole('heading', { name })).toBeVisible();
  });

  test('J4: viewer cannot create dashboards', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('viewer+e2e@example.com');
    await page.getByLabel(/password/i).fill('E2e-Viewer-Pass-1234!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);

    await page.goto('/dashboards');
    await expect(page.getByRole('button', { name: /new dashboard/i })).toBeDisabled();
    await ctx.close();
  });

  test('J5: real-time KPI updates without full page reload', async ({ ownerPage }) => {
    await ownerPage.goto('/dashboards/d_1');
    const kpi = ownerPage.getByTestId('kpi-mrr');
    await expect(kpi).toBeVisible();
    const before = await kpi.textContent();

    // Simulate server push via API trigger
    await ownerPage.request.post('/api/__test__/bump-kpi', {
      data: { id: 'w_1', delta: 0.1 },
    });

    await expect.poll(async () => await kpi.textContent(), { timeout: 5_000 })
      .not.toBe(before);
  });

  test('J5: shows error boundary on widget crash', async ({ ownerPage }) => {
    await ownerPage.goto('/dashboards/d_1');
    await ownerPage.request.post('/api/__test__/crash-widget', { data: { id: 'w_1' } });
    await expect(ownerPage.getByRole('alert')).toContainText(/widget failed/i);
    // Other widgets still render
    await expect(ownerPage.getByTestId('kpi-active-users')).toBeVisible();
  });
});
