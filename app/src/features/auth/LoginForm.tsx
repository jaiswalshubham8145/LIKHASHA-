'use client';

import { useId, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/providers/AuthProvider';
import { useI18n } from '@/providers/I18nProvider';
import { isEmail } from '@/utils/validate';

export interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginForm({ onSuccess, redirectTo }: LoginFormProps = {}) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, status, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [serverError, setServerError] = useState<string | undefined>();

  const emailId = useId();

  const isLoading = status === 'loading';
  const destination = redirectTo ?? searchParams.get('returnTo') ?? '/dashboard';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(undefined);
    setServerError(undefined);

    if (!isEmail(email)) {
      setEmailError(t('common.invalidEmail'));
      return;
    }
    if (!password) return;

    try {
      await signIn({ email, password });
      onSuccess?.();
      router.push(destination);
    } catch (err) {
      const message = (err as { message?: string }).message;
      setServerError(message ?? t('errors.invalidCredentials'));
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-4">
      <div>
        <label htmlFor={emailId} className="sr-only">
          {t('common.email')}
        </label>
        <Input
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          required
          label={t('common.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
      </div>
      <Input
        label={t('common.password')}
        type="password"
        name="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {serverError && (
        <p role="alert" className="text-sm text-danger">
          {serverError}
        </p>
      )}
      {error && !serverError && (
        <p role="alert" className="text-sm text-danger">
          {error.message}
        </p>
      )}
      <Button type="submit" loading={isLoading} disabled={isLoading}>
        {t('common.signIn')}
      </Button>
    </form>
  );
}
