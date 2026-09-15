import { test, expect } from '../e2e/fixtures/test';

const required = {
  'strict-transport-security': /max-age=\d+/,
  'x-content-type-options': /nosniff/,
  'x-frame-options': /DENY|SAMEORIGIN/,
  'referrer-policy': /(strict-origin-when-cross-origin|same-origin|no-referrer)/,
  'permissions-policy': /camera=\(|microphone=\(|geolocation=/,
  'content-security-policy': /default-src/,
  'x-dns-prefetch-control': /off/,
};

const forbidden = ['x-powered-by', 'server'];

test('security headers are set on all routes', async ({ ownerPage }) => {
  const routes = ['/', '/login', '/dashboard', '/api/auth/me'];
  for (const route of routes) {
    const response = await ownerPage.request.fetch(route, { maxRedirects: 0 });
    const headers = response.headers();
    for (const [name, pattern] of Object.entries(required)) {
      expect(headers[name], `Missing ${name} on ${route}`).toMatch(pattern);
    }
    for (const name of forbidden) {
      expect(headers[name], `Forbidden header ${name} on ${route}`).toBeUndefined();
    }
  }
});

test('CSP has no unsafe-inline in production', async ({ ownerPage }) => {
  const res = await ownerPage.request.fetch('/');
  const csp = res.headers()['content-security-policy'] ?? '';
  expect(csp).not.toMatch(/'unsafe-inline'/);
  expect(csp).not.toMatch(/'unsafe-eval'/);
  expect(csp).toMatch(/'strict-dynamic'/);
  expect(csp).toMatch(/upgrade-insecure-requests/);
  expect(csp).toMatch(/frame-ancestors 'none'|frame-ancestors 'self'/);
});

test('cookies are Secure, HttpOnly, SameSite', async ({ ownerPage }) => {
  const res = await ownerPage.request.post('/api/auth/login', {
    data: { email: 'owner+e2e@example.com', password: 'E2e-Owner-Pass-1234!' },
  });
  const setCookie = res.headersArray().filter((h) => h.name.toLowerCase() === 'set-cookie');
  expect(setCookie.length).toBeGreaterThan(0);
  for (const c of setCookie) {
    expect(c.value.toLowerCase()).toMatch(/httponly/);
    expect(c.value.toLowerCase()).toMatch(/samesite=(lax|strict)/);
    if (process.env.NODE_ENV === 'production') {
      expect(c.value.toLowerCase()).toMatch(/secure/);
    }
  }
});

test('CSRF token required on state-changing requests', async ({ ownerPage }) => {
  const res = await ownerPage.request.post('/api/team/invite', {
    data: { email: 'x@example.com', role: 'member' },
    headers: { 'x-skip-csrf': '1' }, // should still be rejected
  });
  expect(res.status()).toBe(403);
});

test('CORS preflight rejects unknown origins', async ({ ownerPage }) => {
  const res = await ownerPage.request.fetch('/api/auth/login', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://evil.example',
      'Access-Control-Request-Method': 'POST',
    },
  });
  expect([403, 200]).toContain(res.status());
  const allowOrigin = res.headers()['access-control-allow-origin'];
  expect(allowOrigin).not.toBe('https://evil.example');
});

test('clickjacking: page is not frameable', async ({ ownerPage }) => {
  const csp = (await ownerPage.request.fetch('/')).headers()['content-security-policy'] ?? '';
  const xfo = (await ownerPage.request.fetch('/')).headers()['x-frame-options'] ?? '';
  expect(csp).toMatch(/frame-ancestors 'none'/);
  expect(xfo).toMatch(/DENY|SAMEORIGIN/);
});

test('no secrets in HTML or JSON responses', async ({ ownerPage }) => {
  const routes = ['/', '/login', '/dashboard', '/api/auth/me'];
  for (const r of routes) {
    const res = await ownerPage.request.fetch(r);
    const body = await res.text();
    expect(body, `Secret in ${r}`).not.toMatch(/(sk_live|sk_test|AKIA[0-9A-Z]{16}|-----BEGIN .* PRIVATE KEY-----)/);
    expect(body.toLowerCase(), `Possible password in ${r}`).not.toMatch(/(password\s*[:=]\s*['"]?[^'",\s}]{4,})/);
  }
});
