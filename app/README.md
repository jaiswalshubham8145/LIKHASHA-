# Lumen — Frontend

Next.js 15 + TypeScript + Tailwind + shadcn/ui. Multi-tenant SaaS analytics.

## Stack

- **Framework**: Next.js 15 (App Router, RSC, Server Actions)
- **Language**: TypeScript 5 (strict)
- **UI**: Tailwind CSS, shadcn/ui, Radix primitives, lucide-react
- **State**: Zustand (client) + TanStack Query (server)
- **Forms**: react-hook-form + Zod
- **i18n**: next-intl
- **Auth**: HttpOnly session cookies, short-lived access + refresh tokens
- **Realtime**: WebSocket via TanStack Query streaming
- **PWA**: Service Worker (custom) for offline shell
- **Testing**: Vitest + Playwright + MSW + axe-core (see `docs/testing/TESTING.md`)

## Scripts

```bash
pnpm dev                 # dev server
pnpm build               # production build
pnpm test:all            # full local test suite
pnpm test:unit           # vitest
pnpm test:e2e            # playwright
pnpm test:a11y           # axe + pa11y
pnpm lighthouse          # lighthouse-ci
pnpm size                # bundle size budget
```

## Folder structure

```
src/
  app/                   # App Router (route segments, layouts, loading, error)
  components/            # Cross-feature components
    ui/                  # Design system primitives (Button, Input, Dialog, ...)
  features/              # Feature slices (auth, dashboards, billing, team, settings)
    auth/
      LoginForm.tsx
      api.ts
      schema.ts
    dashboards/
    billing/
    team/
    settings/
  hooks/                 # Reusable hooks
  stores/                # Zustand stores
  lib/                   # Framework-agnostic utilities
    design-system/       # Tokens, motion, icons
  providers/             # React context providers
  types/                 # Shared types
  utils/                 # Pure helpers (format, validate, cn)
  i18n/                  # Locale messages
  middleware/            # Edge middleware (auth, headers, locale)
tests/                   # See docs/testing/TESTING.md
docs/testing/            # Test strategy & manual plans
```

## Quality gates

CI blocks merge on any failure:

- ✅ Lint, typecheck, format
- ✅ Unit + component coverage ≥ 80%
- ✅ Integration tests pass
- ✅ E2E smoke (chromium + firefox)
- ✅ axe: 0 serious/critical
- ✅ Lighthouse mobile perf ≥ 90, a11y ≥ 95
- ✅ Bundle size within budget
- ✅ Security headers + CSP
- ✅ Visual regression: 0 P0/P1

See `docs/testing/TESTING.md` for the full strategy.
