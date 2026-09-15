import { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, type AxeMatcher, toHaveNoViolations } from 'vitest-axe';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { I18nProvider } from '@/providers/I18nProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/components/Toast';
import type { Session } from '@/types/auth';

expect.extend(toHaveNoViolations);

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: Session | null;
  locale?: string;
  theme?: 'light' | 'dark' | 'high-contrast';
  queryClient?: QueryClient;
  route?: string;
  initialEntries?: string[];
}

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  });
}

export function AllProviders({
  children,
  session = null,
  locale = 'en-US',
  theme = 'light',
  queryClient,
}: {
  children: ReactNode;
  session?: Session | null;
  locale?: string;
  theme?: 'light' | 'dark' | 'high-contrast';
  queryClient?: QueryClient;
}) {
  const client = queryClient ?? makeQueryClient();
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider defaultTheme={theme}>
        <I18nProvider locale={locale}>
          <AuthProvider initialSession={session}>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  {
    session = null,
    locale = 'en-US',
    theme = 'light',
    queryClient,
    ...options
  }: RenderWithProvidersOptions = {},
): RenderResult & { user: ReturnType<typeof userEvent.setup>; queryClient: QueryClient } {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const client = queryClient ?? makeQueryClient();
  const result = render(ui, {
    wrapper: ({ children }) => (
      <AllProviders session={session} locale={locale} theme={theme} queryClient={client}>
        {children}
      </AllProviders>
    ),
    ...options,
  });
  return { ...result, user, queryClient: client };
}

export async function checkA11y(container: HTMLElement, options?: { rules?: AxeMatcher['rules']; enabledImpacts?: AxeMatcher['enabledImpacts'] }) {
  const results = await axe(container, options);
  expect(results).toHaveNoViolations();
}

export { render, screen, waitFor, act, within, fireEvent } from '@testing-library/react';
export { userEvent };
export { axe };
