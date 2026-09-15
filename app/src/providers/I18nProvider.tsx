'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

type Messages = Record<string, unknown>;

interface I18nContextValue {
  locale: string;
  messages: Messages;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const DEFAULT_MESSAGES: Messages = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    submit: 'Submit',
    loading: 'Loading…',
    retry: 'Retry',
    signIn: 'Sign in',
    signOut: 'Sign out',
    signUp: 'Sign up',
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    dashboards: 'Dashboards',
    newDashboard: 'New dashboard',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    invalidEmail: 'Invalid email',
    required: 'Required',
    weakPassword: 'Password must be at least 12 characters with upper, lower, digit and symbol',
    noDashboards: 'No dashboards yet',
    createFirst: 'Create your first',
    inviteMember: 'Invite member',
    role: 'Role',
    sendInvite: 'Send invite',
    remove: 'Remove',
    team: 'Team',
    settings: 'Settings',
    profile: 'Profile',
    billing: 'Billing',
    plans: 'Plans',
    upgrade: 'Upgrade',
    downgrade: 'Downgrade',
    areYouSure: 'Are you sure?',
    confirm: 'Confirm',
  },
  errors: {
    generic: 'Something went wrong',
    network: 'Network error — please try again',
    unauthorized: 'You need to sign in',
    forbidden: 'You do not have access',
    notFound: 'Not found',
    serverError: 'Server error — please try again later',
    invalidCredentials: 'Invalid email or password',
    accountLocked: 'Account is locked',
    tooManyAttempts: 'Too many attempts. Please try again later',
    rateLimited: 'Rate limited',
  },
};

function getNested(obj: Messages, path: string): string | undefined {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Messages)) {
      cur = (cur as Messages)[p];
    } else {
      return undefined;
    }
  }
  return typeof cur === 'string' ? cur : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function I18nProvider({
  children,
  locale = 'en-US',
  messages,
}: {
  children: ReactNode;
  locale?: string;
  messages?: Messages;
}) {
  const value = useMemo<I18nContextValue>(() => {
    const merged: Messages = { ...DEFAULT_MESSAGES, ...(messages ?? {}) };
    return {
      locale,
      messages: merged,
      t: (key, vars) => {
        const found = getNested(merged, key);
        return interpolate(found ?? key, vars);
      },
    };
  }, [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
