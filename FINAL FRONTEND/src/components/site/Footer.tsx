import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/60 px-6 py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-monument text-xs tracking-[0.5em] text-gold">
            LIKHASHA
          </p>
          <p className="mt-4 max-w-sm font-display text-2xl font-light text-foreground/80">
            Prati śabda, eka anubhava — poetry engineered as a cinematic
            experience.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {[
            { to: "/generate", label: "Generate" },
            { to: "/library", label: "Library" },
            { to: "/pricing", label: "Pricing" },
            { to: "/login", label: "Sign in" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="font-sans text-[11px] uppercase tracking-[0.3em] text-mist transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl font-sans text-[10px] uppercase tracking-[0.3em] text-faint">
        © {new Date().getFullYear()} Likhasha — Frontend experience build
      </p>
    </footer>
  );
}
