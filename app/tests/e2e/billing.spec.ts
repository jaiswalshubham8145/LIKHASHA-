import { test, expect } from './fixtures/test';

test.describe('Billing — J7', () => {
  test('owner upgrades from Free to Pro via Stripe Checkout', async ({ ownerPage }) => {
    await ownerPage.goto('/settings/billing');
    await expect(ownerPage.getByRole('heading', { name: /plans/i })).toBeVisible();

    await ownerPage.getByRole('radio', { name: /pro/i }).check();
    await ownerPage.getByRole('button', { name: /upgrade/i }).click();

    // Mock Stripe redirect by intercepting the navigation
    await ownerPage.route('https://stripe.test/c/sess_test', (route) =>
      route.fulfill({ status: 200, body: '<html><body>Mock Stripe Success</body></html>' }),
    );

    await expect(ownerPage).toHaveURL(/stripe\.test|sess_test/);
  });

  test('shows current plan and renewal date', async ({ ownerPage }) => {
    await ownerPage.goto('/settings/billing');
    await expect(ownerPage.getByText(/current plan/i)).toBeVisible();
    await expect(ownerPage.getByText(/pro/i)).toBeVisible();
    await expect(ownerPage.getByText(/next renewal/i)).toBeVisible();
  });

  test('refuses to downgrade if there are unpaid invoices', async ({ ownerPage }) => {
    await ownerPage.request.post('/api/__test__/seed-overdue-invoice');
    await ownerPage.goto('/settings/billing');
    await ownerPage.getByRole('radio', { name: /free/i }).check();
    await ownerPage.getByRole('button', { name: /downgrade/i }).click();
    await expect(ownerPage.getByRole('alert')).toContainText(/outstanding invoice/i);
  });

  test('invoice PDF download works', async ({ ownerPage }) => {
    await ownerPage.goto('/settings/billing/invoices');
    const downloadPromise = ownerPage.waitForEvent('download');
    await ownerPage.getByRole('button', { name: /download/i }).first().click();
    const dl = await downloadPromise;
    expect(dl.suggestedFilename()).toMatch(/\.pdf$/);
  });
});
