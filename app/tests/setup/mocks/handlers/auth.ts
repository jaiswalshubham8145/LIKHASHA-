import { http, HttpResponse } from 'msw';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3100/api';

export const authHandlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { code: 'invalid_input', message: 'Email and password required' },
        { status: 400 },
      );
    }
    if (body.email === 'locked@example.com') {
      return HttpResponse.json(
        { code: 'account_locked', message: 'Account is locked' },
        { status: 423 },
      );
    }
    if (body.password === 'wrong') {
      return HttpResponse.json(
        { code: 'invalid_credentials', message: 'Invalid email or password' },
        { status: 401 },
      );
    }
    return HttpResponse.json({
      user: {
        id: 'u_1',
        email: body.email,
        name: 'Test User',
        role: 'member',
      },
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      expiresAt: Date.now() + 3600_000,
    });
  }),

  http.post(`${API}/auth/logout`, () => HttpResponse.json({ ok: true })),

  http.post(`${API}/auth/refresh`, () =>
    HttpResponse.json({
      accessToken: 'new-access-token',
      expiresAt: Date.now() + 3600_000,
    }),
  ),

  http.post(`${API}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string; name?: string };
    if (!body.email || !body.password || !body.name) {
      return HttpResponse.json({ code: 'invalid_input' }, { status: 400 });
    }
    if (body.password.length < 12) {
      return HttpResponse.json(
        { code: 'weak_password', message: 'Password must be ≥ 12 characters' },
        { status: 422 },
      );
    }
    if (body.email === 'taken@example.com') {
      return HttpResponse.json(
        { code: 'email_taken', message: 'Email already registered' },
        { status: 409 },
      );
    }
    return HttpResponse.json(
      {
        user: { id: 'u_new', email: body.email, name: body.name, role: 'member' },
        accessToken: 'tkn',
        refreshToken: 'rtk',
        expiresAt: Date.now() + 3600_000,
      },
      { status: 201 },
    );
  }),

  http.post(`${API}/auth/forgot-password`, async ({ request }) => {
    const body = (await request.json()) as { email?: string };
    if (!body.email) return HttpResponse.json({ code: 'invalid_input' }, { status: 400 });
    return HttpResponse.json({ ok: true });
  }),

  http.post(`${API}/auth/reset-password`, async ({ request }) => {
    const body = (await request.json()) as { token?: string; password?: string };
    if (body.token === 'expired') {
      return HttpResponse.json({ code: 'token_expired' }, { status: 410 });
    }
    if (!body.token || !body.password) {
      return HttpResponse.json({ code: 'invalid_input' }, { status: 400 });
    }
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${API}/auth/me`, ({ request }) => {
    const auth = request.headers.get('authorization');
    if (!auth) return HttpResponse.json({ code: 'unauthenticated' }, { status: 401 });
    return HttpResponse.json({
      id: 'u_1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'member',
    });
  }),
];
