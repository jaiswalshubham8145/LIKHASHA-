import { Link } from "@tanstack/react-router";
import { Menu, X, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const LINKS = [
  { to: "/generate", label: "Generate" },
  { to: "/library", label: "Library" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[var(--ease-out-expo)]",
        scrolled ? "px-3 py-3" : "px-6 py-6",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-full px-6 py-3 transition-all duration-700",
          scrolled
            ? "glass-vision shadow-[0_16px_40px_-10px_rgba(0,0,0,0.8)]"
            : "glass-pill border-white/10 bg-white/[0.03]",
        )}
      >
        <Link
          to="/"
          className="font-monument text-sm tracking-[0.42em] text-white"
        >
          LIKHASHA
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group relative font-sans text-[11px] uppercase tracking-[0.28em] text-white/60 transition-colors hover:text-white"
              activeProps={{ className: "text-white" }}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}

          <Link
            to="/login"
            className="glass-pill flex items-center gap-2 rounded-full px-5 py-2 font-sans text-[11px] uppercase tracking-[0.24em] transition-all duration-400 text-white/90 hover:text-white hover:bg-white/15 hover:border-white/30"
          >
            <UserIcon className="w-3.5 h-3.5" />
            {user ? user.displayName?.split(" ")[0] || "Vault" : "Sign in"}
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-gold)] text-gold md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="glass fixed inset-0 flex flex-col justify-center gap-3 px-8 pt-24 md:hidden">
          {[
            ...LINKS,
            { to: "/login", label: user ? "My Vault" : "Sign in" } as const,
          ].map((l, index) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="border-b border-border py-5 font-display text-5xl italic text-foreground transition-colors hover:text-gold"
              style={{
                animation: `rise-in 0.8s var(--ease-out-expo) ${index * 0.08}s both`,
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
export default Nav;
