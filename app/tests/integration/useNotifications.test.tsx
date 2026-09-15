import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNotifications } from '@/hooks/useNotifications';
import { http, HttpResponse } from 'msw';
import { server } from '@tests/setup/mocks/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';

const API = 'http://localhost:3100/api';

function wrapper(qc: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
}

describe('useNotifications', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    server.resetHandlers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches and exposes unread count', async () => {
    const qc = makeClient();
    const { result } = renderHook(() => useNotifications(), { wrapper: wrapper(qc) });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.unreadCount).toBe(1);
    expect(result.current.data?.items).toHaveLength(2);
  });

  it('marks a notification as read optimistically', async () => {
    const qc = makeClient();
    const { result } = renderHook(() => useNotifications(), { wrapper: wrapper(qc) });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.markRead('n_1');
    });
    await waitFor(() => {
      const item = result.current.data?.items.find((n) => n.id === 'n_1');
      expect(item?.read).toBe(true);
    });
  });

  it('rolls back optimistic update on server error', async () => {
    server.use(
      http.post(`${API}/notifications/:id/read`, () =>
        new HttpResponse(null, { status: 500 }),
      ),
    );
    const qc = makeClient();
    const { result } = renderHook(() => useNotifications(), { wrapper: wrapper(qc) });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    act(() => {
      result.current.markRead('n_1');
    });
    await waitFor(() => {
      const item = result.current.data?.items.find((n) => n.id === 'n_1');
      expect(item?.read).toBe(false); // rolled back
    });
  });

  it('polls every 30 seconds when active', async () => {
    let callCount = 0;
    server.use(
      http.get(`${API}/notifications`, () => {
        callCount++;
        return HttpResponse.json({
          items: [],
          unreadCount: 0,
        });
      }),
    );

    const qc = makeClient();
    renderHook(() => useNotifications({ pollIntervalMs: 1000 }), {
      wrapper: wrapper(qc),
    });

    await waitFor(() => expect(callCount).toBe(1));
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));
    expect(callCount).toBeGreaterThanOrEqual(3);
  });

  it('pauses polling when tab is hidden', async () => {
    let callCount = 0;
    server.use(
      http.get(`${API}/notifications`, () => {
        callCount++;
        return HttpResponse.json({ items: [], unreadCount: 0 });
      }),
    );

    const visibilitySpy = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    const qc = makeClient();
    renderHook(() => useNotifications({ pollIntervalMs: 1000 }), { wrapper: wrapper(qc) });
    await waitFor(() => expect(callCount).toBe(1));

    act(() => vi.advanceTimersByTime(5000));
    expect(callCount).toBe(1); // did not refetch while hidden
    visibilitySpy.mockReturnValue('visible');
  });
});
