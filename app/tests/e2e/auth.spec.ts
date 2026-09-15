import { test, expect } from './fixtures/test';

test.describe('Authentication — J1/J2/J3', () => {
  test.beforeEach(async ({ anonymousPage }) => {
    await anonymousPage.context().clearCookies();
  });

  test('J2: signs in with valid credentials and lands on dashboard', async ({ page, makeAxe }) => {
    await page.goto('/login');

    const a11y = await makeAxe().analyze();
    expect(a11y.violations, JSON.stringify(a11y.violations, null, 2)).toEqual([]);

    await page.getByLabel(/email/i).fill('owner+e2e@example.com');
    await page.getByLabel(/password/i).fill('E2e-Owner-Pass-1234!');
    await page.screenshot({ path: 'test-results/login-filled.png' });
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /dashboards/i })).toBeVisible();
  });

  test('J2: shows field-level error for wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('owner+e2e@example.com');
    await page.getByLabel(/password/i).fill('WrongPassword1234!');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByRole('alert')).toContainText(/invalid/i);
    await expect(page).toHaveURL(/\/login/);
  });

  test('J2: rate limits after 5 failed attempts', async ({ page }) => {
    await page.goto('/login');
    for (let i = 0; i < 5; i++) {
      await page.getByLabel(/email/i).fill('owner+e2e@example.com');
      await page.getByLabel(/password/i).fill(`wrong-${i}`);
      await page.getByRole('button', { name: /sign in/i }).click();
      await expect(page.getByRole('alert')).toBeVisible();
    }
    await expect(page.getByRole('alert')).toContainText(/too many/i);
  });

  test('J1: signs up a new account and reaches onboarding', async ({ page, makeAxe }) => {
    const email = `new-${Date.now()}@example.com`;
    await page.goto('/signup');

    const a11y = await makeAxe().analyze();
    expect(a11y.violations).toEqual([]);

    await page.getByLabel(/name/i).fill('Ada Lovelace');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password/i).fill('Sup3r-Strong-Pass!');
    await page.getByLabel(/confirm password/i).fill('Sup3r-Strong-Pass!');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page).toHaveURL(/\/onboarding|verify-email/);
  });

  test('J1: rejects weak password on signup', async ({ page }) => {
    await page.goto('/signup');
    await page.getByLabel(/name/i).fill('Ada');
    await page.getByLabel(/email/i).fill('ada@example.com');
    await page.getByLabel(/^password/i).fill('password');
    await page.getByLabel(/confirm password/i).fill('password');
    await page.getByLabel(/terms/i).check();

    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/at least 12 characters/i)).toBeVisible();
  });

  test('J3: requests password reset', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByLabel(/email/i).fill('owner+e2e@example.com');
    await page.getByRole('button', { name: /send reset link/i }).click();
    await expect(page.getByText(/check your email/i)).toBeVisible();
  });

  test('Logout clears session and redirects to login', async ({ ownerPage }) => {
    await ownerPage.getByRole('button', { name: /user menu/i }).click();
    await ownerPage.getByRole('menuitem', { name: /sign out/i }).click();
    await expect(ownerPage).toHaveURL(/\/login/);
    await ownerPage.goto('/dashboard');
    await expect(ownerPage).toHaveURL(/\/login/);
  });

  test('Keyboard-only login works', async ({ page }) => {
    await page.goto('/login');
    await page.keyboard.press('Tab'); // email
    await page.keyboard.type('owner+e2e@example.com');
    await page.keyboard.press('Tab'); // password
    await page.keyboard.type('E2e-Owner-Pass-1234!');
    await page.keyboard.press('Tab'); // submit
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
