'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { I18nProvider } from '@/providers/I18nProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/components/Toast';
import type { Session } from '@/types/auth';

export function Providers({
  children,
  initialSession = null,
  locale = 'en-US',
  theme = 'light',
}: {
  children: ReactNode;
  initialSession?: Session | null;
  locale?: string;
  theme?: 'light' | 'dark' | 'high-contrast';
}) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider defaultTheme={theme}>
        <I18nProvider locale={locale}>
          <AuthProvider initialSession={initialSession}>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
