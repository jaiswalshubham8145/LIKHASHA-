import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/services/firebase";
import { useAuth } from "@/hooks/useAuth";
import { SiteShell } from "@/components/site/SiteShell";
import { VideoBackdrop } from "@/components/site/VideoBackdrop";
import { InkParticles } from "@/components/site/InkParticles";

import { VIDEOS } from "@/lib/media";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Likhasha" },
      {
        name: "description",
        content:
          "Sign in or create a Likhasha account to save verses to your private poetry vault.",
      },
      { property: "og:title", content: "Sign in — Likhasha" },
      {
        property: "og:description",
        content: "Access your private Likhasha poetry vault.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "up") {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
        toast.success("Account created successfully. Welcome to Likhasha!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back to your vault.");
      }
      navigate({ to: "/generate" });
    } catch (err: any) {
      console.error(err);
      let msg = err.message || "Authentication failed.";
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        msg = "Invalid email or password.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google.");
      navigate({ to: "/generate" });
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error(err.message || "Google sign-in failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell footer={false}>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32">
        <VideoBackdrop src={VIDEOS.cosmos} intensity={0.4} fixed />
        <InkParticles
          className="pointer-events-none fixed inset-0 h-full w-full opacity-50"
          count={60}
        />

        <div
          className="glass-gold relative w-full max-w-md rounded-2xl p-10"
          style={{ animation: "rise-in 1s var(--ease-out-expo) both" }}
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-gold">
            Likhasha
          </p>

          {user ? (
            <div className="mt-6 text-center">
              <h1 className="font-display text-3xl font-light">
                Connected as{" "}
                <span className="text-gold">
                  {user.displayName || user.email}
                </span>
              </h1>
              <p className="mt-3 font-sans text-xs text-mist">
                Your vault is unlocked and ready.
              </p>

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => navigate({ to: "/generate" })}
                  className="w-full rounded-full btn-gold px-8 py-4 font-sans text-[11px] uppercase tracking-[0.28em] text-ink"
                >
                  Open Studio
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full rounded-full border border-border px-8 py-3 font-sans text-[11px] uppercase tracking-[0.28em] text-mist hover:text-gold"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="mt-6 font-display text-4xl font-light">
                {mode === "in" ? "Welcome back" : "Begin your vault"}
              </h1>

              <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
                {mode === "up" && (
                  <label className="block">
                    <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-faint">
                      Name
                    </span>
                    <input
                      type="text"
                      placeholder="Mirza"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={cn(
                        "mt-2 w-full rounded-lg border border-border bg-ink-2/60 px-4 py-3 font-sans text-sm text-foreground outline-none",
                        "transition-colors duration-500 placeholder:text-faint focus:border-[var(--border-gold-hover)]",
                      )}
                    />
                  </label>
                )}

                <label className="block">
                  <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-faint">
                    Email
                  </span>
                  <input
                    type="email"
                    placeholder="you@likhasha.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={cn(
                      "mt-2 w-full rounded-lg border border-border bg-ink-2/60 px-4 py-3 font-sans text-sm text-foreground outline-none",
                      "transition-colors duration-500 placeholder:text-faint focus:border-[var(--border-gold-hover)]",
                    )}
                  />
                </label>

                <label className="block">
                  <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-faint">
                    Password
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={cn(
                      "mt-2 w-full rounded-lg border border-border bg-ink-2/60 px-4 py-3 font-sans text-sm text-foreground outline-none",
                      "transition-colors duration-500 placeholder:text-faint focus:border-[var(--border-gold-hover)]",
                    )}
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-full btn-gold px-8 py-4 font-sans text-[11px] uppercase tracking-[0.28em] text-ink transition-all duration-500 disabled:opacity-50"
                >
                  {loading
                    ? "Authenticating..."
                    : mode === "in"
                      ? "Sign in"
                      : "Create account"}
                </button>
              </form>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <span className="relative bg-ink px-4 font-sans text-[9px] uppercase tracking-[0.28em] text-faint">
                  or
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 rounded-full border border-[var(--border-gold)] bg-gold/5 px-6 py-3 font-sans text-[10px] uppercase tracking-[0.24em] text-gold hover:bg-gold hover:text-ink transition-all duration-500"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => setMode(mode === "in" ? "up" : "in")}
                className="mt-8 w-full font-sans text-[10px] uppercase tracking-[0.24em] text-mist transition-colors hover:text-gold"
              >
                {mode === "in"
                  ? "New here? Create an account"
                  : "Already a poet? Sign in"}
              </button>
            </>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
