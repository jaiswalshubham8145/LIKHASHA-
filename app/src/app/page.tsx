import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <header className="mb-12 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">Lumen</Link>
        <nav aria-label="Primary" className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Get started</Link>
          </Button>
        </nav>
      </header>

      <section className="flex flex-col gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Analytics that move at the speed of your team.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          Real-time dashboards, frictionless collaboration, and a security model your
          CISO will love. Built for product teams that ship.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/signup">Start free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
