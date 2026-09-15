import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@tests/setup/mocks/server';
import { LoginForm } from '@/features/auth/LoginForm';
import { renderWithProviders, checkA11y } from '@tests/setup/test-utils';
import { useAuthStore } from '@/stores/auth-store';

const API = 'http://localhost:3100/api';

describe('LoginForm integration', () => {
  beforeEach(() => {
    useAuthStore.setState({ session: null, status: 'idle', error: null });
    server.resetHandlers();
  });

  it('submits credentials, calls /auth/login, redirects on success', async () => {
    let requestSeen: { email?: string; password?: string } | null = null;
    server.use(
      http.post(`${API}/auth/login`, async ({ request }) => {
        requestSeen = (await request.json()) as { email?: string; password?: string };
        return HttpResponse.json({
          user: { id: 'u_1', email: requestSeen.email, name: 'Test', role: 'member' },
          accessToken: 'a',
          refreshToken: 'b',
          expiresAt: Date.now() + 3600_000,
        });
      }),
    );

    const onSuccess = vi.fn();
    const { user } = renderWithProviders(<LoginForm onSuccess={onSuccess} />, {
      route: '/login',
    });

    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/password/i), 'correct-horse-battery');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(requestSeen).toEqual({ email: 'ada@example.com', password: 'correct-horse-battery' });
    });
    await waitFor(() => {
      expect(useAuthStore.getState().status).toBe('authenticated');
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('shows inline error on 401', async () => {
    server.use(
      http.post(`${API}/auth/login`, () =>
        HttpResponse.json({ code: 'invalid_credentials', message: 'Invalid email or password' }, { status: 401 }),
      ),
    );

    const { user } = renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), 'x@y.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid/i);
    expect(useAuthStore.getState().status).toBe('error');
  });

  it('disables submit during pending request', async () => {
    let resolveResponse: (v: HttpResponse) => void = () => {};
    server.use(
      http.post(`${API}/auth/login`, () => new Promise<HttpResponse>((r) => { resolveResponse = r; })),
    );

    const { user } = renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'long-enough-pass');
    const submit = screen.getByRole('button', { name: /sign in/i });
    await user.click(submit);

    await waitFor(() => expect(submit).toBeDisabled());
    expect(within(submit).getByRole('status', { hidden: true })).toBeTruthy();

    resolveResponse(HttpResponse.json({
      user: { id: 'u', email: 'a@b.com', name: 'A', role: 'member' },
      accessToken: 'a',
      refreshToken: 'b',
      expiresAt: Date.now() + 3600_000,
    }));
  });

  it('client-side validation prevents submit for invalid email', async () => {
    const { user } = renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.type(screen.getByLabelText(/password/i), 'short');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('preserves email field after server error', async () => {
    server.use(
      http.post(`${API}/auth/login`, () =>
        HttpResponse.json({ code: 'invalid_credentials' }, { status: 401 }),
      ),
    );
    const { user } = renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await screen.findByRole('alert');
    expect(screen.getByLabelText(/email/i)).toHaveValue('ada@example.com');
  });

  it('has no a11y violations', async () => {
    const { container } = renderWithProviders(<LoginForm />);
    await checkA11y(container);
  });
});
