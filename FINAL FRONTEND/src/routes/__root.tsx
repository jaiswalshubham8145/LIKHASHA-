import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="atmosphere relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4">
      <div className="relative max-w-md text-center">
        <h1 className="font-display text-[clamp(80px,18vw,220px)] font-light leading-none text-gold-gradient">
          404
        </h1>
        <h2 className="mt-4 font-display text-2xl font-light text-foreground">
          This verse was never written
        </h2>
        <p className="mt-3 font-sans text-sm text-mist">
          The page drifted into the cosmos. Return and start a new line.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex rounded-full border border-[var(--border-gold)] px-8 py-3 font-sans text-[11px] uppercase tracking-[0.28em] text-gold transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        {error && (
          <p className="mt-3 text-xs text-red-400 font-mono bg-red-950/40 p-2.5 rounded border border-red-500/20 max-w-sm mx-auto overflow-auto text-left">
            {error.message || String(error)}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Likhasha — AI Poetry, Shayari & Quotes Studio" },
        {
          name: "description",
          content:
            "Likhasha turns any emotion into timeless poetry, couplets, and quotes across English, Hindi, and Urdu. Har lafz ek nasha. 🌙",
        },
        { name: "author", content: "Likhasha" },
        {
          property: "og:title",
          content: "Likhasha — AI Poetry & Quote Studio",
        },
        {
          property: "og:description",
          content:
            "Every emotion deserves its verse. Compose poetry, shayari, and viral quotes in English, Hindi, and Urdu.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Manrope:wght@300;400;500;600&family=Marcellus&display=swap",
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      ],
    }),

    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster richColors position="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
