import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const metadata = { title: 'Create account' };

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-semibold">Create your account</h1>
      <form action="/api/auth/register" method="post" className="flex flex-col gap-4">
        <Input label="Name" name="name" required autoComplete="name" />
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          hint="At least 12 characters with upper, lower, digit and symbol"
        />
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
        />
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="terms" required className="mt-0.5" />
          <span>I agree to the Terms of Service and Privacy Policy.</span>
        </label>
        <Button type="submit">Create account</Button>
      </form>
      <p className="mt-4 text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-600 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
