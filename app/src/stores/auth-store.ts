'use client';

import { create } from 'zustand';
import type { AuthError, AuthStatus, Session } from '@/types/auth';

interface AuthState {
  session: Session | null;
  status: AuthStatus;
  error: AuthError | null;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: () => boolean;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
    const err: AuthError = {
      code: data.code ?? 'unknown_error',
      message: data.message ?? `HTTP ${res.status}`,
    };
    throw err;
  }
  return (await res.json()) as T;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  status: 'idle',
  error: null,

  async signIn({ email, password }) {
    set({ status: 'loading', error: null });
    try {
      const data = await postJson<{
        user: Session['user'];
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
      }>('/api/auth/login', { email, password });
      const session: Session = {
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      };
      set({ session, status: 'authenticated', error: null });
    } catch (e) {
      const error = e as AuthError;
      set({ status: 'error', error, session: null });
      throw error;
    }
  },

  async signOut() {
    set({ status: 'loading' });
    try {
      await postJson('/api/auth/logout', {});
    } catch {
      // ignore network errors on logout — clear locally anyway
    }
    set({ session: null, status: 'idle', error: null });
  },

  clearError() {
    set({ error: null });
  },

  isAuthenticated() {
    return get().session !== null;
  },
}));
