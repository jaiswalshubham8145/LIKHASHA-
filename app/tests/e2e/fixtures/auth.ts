import { type Page } from '@playwright/test';

export type Role = 'owner' | 'admin' | 'member' | 'viewer';

const credentials: Record<Role, { email: string; password: string }> = {
  owner: { email: 'owner+e2e@example.com', password: 'E2e-Owner-Pass-1234!' },
  admin: { email: 'admin+e2e@example.com', password: 'E2e-Admin-Pass-1234!' },
  member: { email: 'member+e2e@example.com', password: 'E2e-Member-Pass-1234!' },
  viewer: { email: 'viewer+e2e@example.com', password: 'E2e-Viewer-Pass-1234!' },
};

export async function authenticateAs(page: Page, role: Role) {
  const { email, password } = credentials[role];
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10_000 });
}

export async function signUp(page: Page, email: string, password: string, name: string) {
  await page.goto('/signup');
  await page.getByLabel(/name/i).fill(name);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password/i).fill(password);
  await page.getByLabel(/confirm password/i).fill(password);
  await page.getByRole('button', { name: /create account/i }).click();
}

export async function resetPassword(page: Page, email: string) {
  await page.goto('/forgot-password');
  await page.getByLabel(/email/i).fill(email);
  await page.getByRole('button', { name: /send reset link/i }).click();
}
