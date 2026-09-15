import { LoginForm } from '@/features/auth/LoginForm';
import { Suspense } from 'react';
import Link from 'next/link';

export const metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-semibold">Sign in to Lumen</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <LoginForm />
      </Suspense>
      <p className="mt-4 text-sm text-muted">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-brand-600 underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
