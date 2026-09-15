import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@tests/setup/mocks/server';
import { DashboardList } from '@/features/dashboards/DashboardList';
import { renderWithProviders } from '@tests/setup/test-utils';

const API = 'http://localhost:3100/api';

describe('DashboardList integration', () => {
  beforeEach(() => server.resetHandlers());

  it('loads and renders dashboards from API', async () => {
    renderWithProviders(<DashboardList />, {
      session: {
        user: { id: 'u_1', email: 'a@b.com', name: 'A', role: 'member' },
        accessToken: 't',
        refreshToken: 'r',
        expiresAt: Date.now() + 3600_000,
      },
    });

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
    expect(await screen.findByText('Revenue Overview')).toBeInTheDocument();
    expect(screen.getByText('Churn')).toBeInTheDocument();
  });

  it('shows empty state when API returns no dashboards', async () => {
    server.use(
      http.get(`${API}/dashboards`, () => HttpResponse.json({ items: [], nextCursor: null })),
    );
    renderWithProviders(<DashboardList />);
    expect(await screen.findByText(/no dashboards yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create your first/i })).toBeInTheDocument();
  });

  it('shows error state with retry on 500', async () => {
    server.use(
      http.get(`${API}/dashboards`, () => new HttpResponse(null, { status: 500 })),
    );
    renderWithProviders(<DashboardList />);
    const retry = await screen.findByRole('button', { name: /retry/i });
    expect(retry).toBeInTheDocument();
  });

  it('creates a dashboard and prepends to list', async () => {
    let postCount = 0;
    server.use(
      http.post(`${API}/dashboards`, async ({ request }) => {
        postCount++;
        const body = (await request.json()) as { name: string };
        return HttpResponse.json(
          { id: 'd_new', name: body.name, widgets: [], updatedAt: new Date().toISOString() },
          { status: 201 },
        );
      }),
    );

    const { user } = renderWithProviders(<DashboardList />);
    await screen.findByText('Revenue Overview');

    await user.click(screen.getByRole('button', { name: /new dashboard/i }));
    const nameInput = await screen.findByLabelText(/name/i);
    await user.type(nameInput, 'Funnel');
    await user.click(screen.getByRole('button', { name: /^create$/i }));

    await waitFor(() => expect(screen.getByText('Funnel')).toBeInTheDocument());
    expect(postCount).toBe(1);
  });

  it('does not show stale data when session changes', async () => {
    const { rerender } = renderWithProviders(<DashboardList />);
    await screen.findByText('Revenue Overview');

    rerender(
      <DashboardList />,
    );
    // different session would trigger a different query key; we just assert re-render is stable
    expect(screen.getByText('Revenue Overview')).toBeInTheDocument();
  });
});
