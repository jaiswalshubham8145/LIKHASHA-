'use client';

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import type { Session } from '@/types/auth';

interface AuthContextValue {
  session: Session | null;
  status: ReturnType<typeof useAuthStore.getState>['status'];
  error: ReturnType<typeof useAuthStore.getState>['error'];
  isAuthenticated: boolean;
  signIn: ReturnType<typeof useAuthStore.getState>['signIn'];
  signOut: ReturnType<typeof useAuthStore.getState>['signOut'];
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialSession = null,
}: {
  children: ReactNode;
  initialSession?: Session | null;
}) {
  const session = useAuthStore((s) => s.session);
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);
  const signIn = useAuthStore((s) => s.signIn);
  const signOut = useAuthStore((s) => s.signOut);

  // Hydrate initial session once
  useEffect(() => {
    if (initialSession && !session) {
      useAuthStore.setState({ session: initialSession, status: 'authenticated' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      status,
      error,
      isAuthenticated: session !== null,
      signIn,
      signOut,
    }),
    [session, status, error, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
