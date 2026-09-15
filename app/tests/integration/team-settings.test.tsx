import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@tests/setup/mocks/server';
import { TeamSettings } from '@/features/settings/TeamSettings';
import { renderWithProviders } from '@tests/setup/test-utils';

const API = 'http://localhost:3100/api';

describe('TeamSettings integration', () => {
  it('renders members from API', async () => {
    renderWithProviders(
      <TeamSettings />,
      {
        session: {
          user: { id: 'u_1', email: 'owner@example.com', name: 'Owner', role: 'owner' },
          accessToken: 't', refreshToken: 'r', expiresAt: Date.now() + 3600_000,
        },
      },
    );
    expect(await screen.findByText('owner@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('member@example.com')).toBeInTheDocument();
  });

  it('invites a member and prepends to list', async () => {
    const { user } = renderWithProviders(
      <TeamSettings />,
      {
        session: {
          user: { id: 'u_1', email: 'owner@example.com', name: 'Owner', role: 'owner' },
          accessToken: 't', refreshToken: 'r', expiresAt: Date.now() + 3600_000,
        },
      },
    );

    await screen.findByText('owner@example.com');
    await user.click(screen.getByRole('button', { name: /invite member/i }));

    await user.type(screen.getByLabelText(/email/i), 'new@example.com');
    await user.selectOptions(screen.getByLabelText(/role/i), 'member');
    await user.click(screen.getByRole('button', { name: /send invite/i }));

    await waitFor(() => expect(screen.getByText('new@example.com')).toBeInTheDocument());
  });

  it('blocks non-owners from seeing invite form', () => {
    renderWithProviders(
      <TeamSettings />,
      {
        session: {
          user: { id: 'u_3', email: 'member@example.com', name: 'Member', role: 'member' },
          accessToken: 't', refreshToken: 'r', expiresAt: Date.now() + 3600_000,
        },
      },
    );
    expect(screen.queryByRole('button', { name: /invite member/i })).not.toBeInTheDocument();
  });

  it('shows server error if email already invited', async () => {
    server.use(
      http.post(`${API}/team/invite`, () =>
        HttpResponse.json({ code: 'email_taken' }, { status: 409 }),
      ),
    );
    const { user } = renderWithProviders(
      <TeamSettings />,
      {
        session: {
          user: { id: 'u_1', email: 'owner@example.com', name: 'Owner', role: 'owner' },
          accessToken: 't', refreshToken: 'r', expiresAt: Date.now() + 3600_000,
        },
      },
    );
    await screen.findByText('owner@example.com');
    await user.click(screen.getByRole('button', { name: /invite member/i }));
    await user.type(screen.getByLabelText(/email/i), 'taken@example.com');
    await user.click(screen.getByRole('button', { name: /send invite/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/already|taken/i);
  });

  it('removes a member with confirm dialog', async () => {
    const { user } = renderWithProviders(
      <TeamSettings />,
      {
        session: {
          user: { id: 'u_1', email: 'owner@example.com', name: 'Owner', role: 'owner' },
          accessToken: 't', refreshToken: 'r', expiresAt: Date.now() + 3600_000,
        },
      },
    );
    await screen.findByText('member@example.com');
    const row = screen.getByRole('row', { name: /member@example.com/i });
    await user.click(within(row).getByRole('button', { name: /remove/i }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent(/are you sure/i);
    await user.click(within(dialog).getByRole('button', { name: /confirm/i }));

    await waitFor(() =>
      expect(screen.queryByText('member@example.com')).not.toBeInTheDocument(),
    );
  });
});

// re-export within for the test above
import { within } from '@testing-library/react';
