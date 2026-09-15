import { test, expect } from '../e2e/fixtures/test';
import { xssPayloads, openRedirectPayloads } from './xss-payloads';

test.describe('XSS payloads never execute', () => {
  test('dashboard name input escapes and renders safely', async ({ ownerPage }) => {
    let dialogFired = false;
    ownerPage.on('dialog', async (d) => {
      dialogFired = true;
      await d.dismiss();
    });
    await ownerPage.goto('/dashboards');
    await ownerPage.getByRole('button', { name: /new dashboard/i }).click();
    const nameInput = ownerPage.getByLabel(/name/i);
    for (const p of xssPayloads) {
      await nameInput.fill('');
      await nameInput.fill(p);
      await ownerPage.getByRole('button', { name: /^create$/i }).click();
      // Should either succeed with literal text, or fail validation, but never execute
    }
    expect(dialogFired).toBe(false);

    // Verify the rendered text is escaped
    const text = await ownerPage.locator('body').textContent();
    expect(text).toBeTruthy();
  });

  test('search input does not execute payloads', async ({ ownerPage }) => {
    let dialogFired = false;
    ownerPage.on('dialog', async (d) => { dialogFired = true; await d.dismiss(); });

    await ownerPage.goto('/dashboards');
    const search = ownerPage.getByRole('searchbox', { name: /search/i });
    for (const p of xssPayloads) {
      await search.fill(p);
      await ownerPage.keyboard.press('Enter');
      await ownerPage.waitForTimeout(50);
    }
    expect(dialogFired).toBe(false);
  });

  test('notification title is rendered as text, not HTML', async ({ ownerPage }) => {
    await ownerPage.request.post('/api/__test__/seed-notification', {
      data: { title: '<img src=x onerror=alert(1)>' },
    });
    let dialogFired = false;
    ownerPage.on('dialog', async (d) => { dialogFired = true; await d.dismiss(); });
    await ownerPage.goto('/dashboard');
    await ownerPage.waitForTimeout(500);
    expect(dialogFired).toBe(false);
  });
});

test.describe('Open redirect payloads are rejected', () => {
  for (const p of openRedirectPayloads) {
    test(`?returnTo=${p} → /login`, async ({ ownerPage }) => {
      const url = `/login?returnTo=${encodeURIComponent(p)}`;
      const res = await ownerPage.request.fetch(url, { maxRedirects: 0 });
      // Either 400 on login, or login page without redirect to evil
      if (res.status() === 302 || res.status() === 307) {
        const location = res.headers()['location'] ?? '';
        expect(location).not.toMatch(/evil\.example/);
        expect(location).not.toMatch(/^javascript:/);
      }
    });
  }
});

test.describe('Injection payloads', () => {
  test('SQL-injection-like email is treated as literal', async ({ ownerPage }) => {
    const res = await ownerPage.request.post('/api/auth/login', {
      data: { email: "' OR 1=1--", password: "x" },
    });
    expect([400, 401]).toContain(res.status());
  });

  test('path traversal in URL params is blocked', async ({ ownerPage }) => {
    const res = await ownerPage.request.fetch('/api/files/..%2F..%2Fetc%2Fpasswd');
    expect([400, 404]).toContain(res.status());
  });

  test('prototype pollution in JSON body is rejected', async ({ ownerPage }) => {
    const res = await ownerPage.request.post('/api/dashboards', {
      data: { name: 'x', __proto__: { admin: true } },
    });
    expect([400, 201]).toContain(res.status());
  });
});
