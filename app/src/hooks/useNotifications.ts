'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export interface Notification {
  id: string;
  kind: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  items: Notification[];
  unreadCount: number;
}

interface UseNotificationsOptions {
  pollIntervalMs?: number;
  enabled?: boolean;
}

async function fetchNotifications(accessToken: string): Promise<NotificationsResponse> {
  const res = await fetch('/api/notifications', {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as NotificationsResponse;
}

async function markReadRequest(id: string, accessToken: string): Promise<{ id: string; read: true }> {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: 'POST',
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as { id: string; read: true };
}

async function markAllReadRequest(accessToken: string): Promise<{ ok: true }> {
  const res = await fetch('/api/notifications/read-all', {
    method: 'POST',
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as { ok: true };
}

export function useNotifications({ pollIntervalMs = 30_000, enabled = true }: UseNotificationsOptions = {}) {
  const session = useAuthStore((s) => s.session);
  const accessToken = session?.accessToken ?? '';
  const qc = useQueryClient();
  const visibilityRef = useRef<boolean>(true);

  // Pause polling while tab is hidden
  useEffect(() => {
    if (typeof document === 'undefined') return;
    visibilityRef.current = document.visibilityState !== 'hidden';
    const handler = () => {
      visibilityRef.current = document.visibilityState !== 'hidden';
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  const query = useQuery<NotificationsResponse>({
    queryKey: ['notifications', accessToken],
    queryFn: () => fetchNotifications(accessToken),
    enabled: enabled && !!accessToken,
    refetchInterval: () => (visibilityRef.current ? pollIntervalMs : false),
    refetchOnWindowFocus: true,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markReadRequest(id, accessToken),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['notifications', accessToken] });
      const previous = qc.getQueryData<NotificationsResponse>(['notifications', accessToken]);
      if (previous) {
        qc.setQueryData<NotificationsResponse>(['notifications', accessToken], {
          ...previous,
          items: previous.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
          unreadCount: Math.max(0, previous.unreadCount - (previous.items.find((n) => n.id === id && !n.read) ? 1 : 0)),
        });
      }
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(['notifications', accessToken], ctx.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['notifications', accessToken] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllReadRequest(accessToken),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['notifications', accessToken] });
      const previous = qc.getQueryData<NotificationsResponse>(['notifications', accessToken]);
      if (previous) {
        qc.setQueryData<NotificationsResponse>(['notifications', accessToken], {
          ...previous,
          items: previous.items.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(['notifications', accessToken], ctx.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['notifications', accessToken] });
    },
  });

  return {
    ...query,
    data: query.data,
    markRead: markReadMutation.mutate,
    markAll: markAllMutation.mutate,
    isMarking: markReadMutation.isPending || markAllMutation.isPending,
  };
}
