# Lumen — Frontend Testing Strategy

> Production-grade testing architecture for the Lumen SaaS analytics dashboard.
> Standards: Google, Microsoft, Stripe, Airbnb, Linear, Vercel, OpenAI.

**Targets**

| Metric            | Target          | Hard Gate |
| ----------------- | --------------- | --------- |
| Unit/Component    | ≥ 85% coverage  | ≥ 80%     |
| Accessibility     | WCAG 2.2 AA     | 0 serious |
| Lighthouse Perf   | ≥ 95            | ≥ 90      |
| Lighthouse A11y   | 100             | ≥ 95      |
| LCP               | < 2.5s          | < 4.0s    |
| INP               | < 200ms         | < 500ms   |
| CLS               | < 0.1           | < 0.25    |
| Bundle (initial)  | < 180KB gz      | < 250KB   |
| Visual diff       | 0 unintended    | 0 P0/P1   |
| Escape rate (prod)| < 2%            | < 5%      |

---

## Phase 1 — Test Strategy

### Quality Objectives

1. Prevent regressions to **critical user journeys** (auth, billing, dashboards).
2. Guarantee **WCAG 2.2 AA** compliance on every release.
3. Maintain **Lighthouse 95+** for Performance, Accessibility, Best Practices, SEO.
4. Block releases on **P0/P1 security vulnerabilities** (XSS, CSRF, secret leaks).
5. Detect **visual regressions** within one PR cycle.
6. Achieve **< 2% production escape rate** within 90 days of launch.

### Testing Pyramid

```
                    ┌──────────────┐
                    │   E2E (10)   │   Playwright — critical journeys
                    ├──────────────┤
                ┌───┤ Integration  ├───┐   MSW + RTL — features & APIs
                │   │    (40)      │   │
                │   ├──────────────┤   │
            ┌───┤   │  Component   │   │   Vitest + RTL — UI contracts
            │   │   │    (120)     │   │   + axe-core per component
            │   │   ├──────────────┤   │
        ┌───┤   │   │    Unit      │   │   Vitest — hooks, utils, stores
        │   │   │   │    (300)     │   │
        │   │   │   └──────────────┘   │
        │   │   └──────────────────────┘
        │   └──────────────────────────┘
        └────────────────────────────────┘
```

### Critical User Journeys (P0)

| ID  | Journey              | Risk   | Tests                        |
| --- | -------------------- | ------ | ---------------------------- |
| J1  | Sign up              | High   | E2E, a11y, security          |
| J2  | Log in / SSO         | High   | E2E, a11y, security          |
| J3  | Password reset       | High   | E2E, a11y, security          |
| J4  | Create dashboard     | High   | E2E, integration, a11y       |
| J5  | Real-time data view  | High   | Integration, reliability     |
| J6  | Invite team member   | Medium | E2E, RBAC                    |
| J7  | Upgrade plan         | High   | E2E, security                |
| J8  | Export report        | Medium | E2E, perf                    |
| J9  | Notification center  | Medium | Integration, a11y            |
| J10 | Account deletion     | High   | E2E, security, GDPR          |

### Quality Gates (block deploy on failure)

```
L1  Lint + typecheck + format        → required
L2  Unit + component tests ≥ 80%     → required
L3  Integration tests pass           → required
L4  E2E (smoke) pass on 3 browsers   → required
L5  A11y: 0 serious/critical         → required
L6  Lighthouse mobile Perf ≥ 90      → required
L7  Bundle budget met                → required
L8  Security headers + CSP check     → required
L9  Visual regression: 0 P0/P1       → required
L10 Coverage: lines ≥ 80, br ≥ 75    → required
```

---

## Phase 2 — Manual Testing

Stored under `docs/testing/manual/`. Each test plan is a checklist executed before
each release on staging. Focus areas:

- **Functional** — navigation, forms, auth, RBAC, search, settings, notifications
- **UI** — layout, spacing, typography, color, components, empty/error states
- **UX** — flow efficiency, error recovery, learnability, cognitive load
- **Exploratory** — charters per feature, 60-min time-boxed sessions

> Manual testing does not block CI. It blocks **release** (release checklist).

---

## Phase 3 — Responsive Testing

- **Mobile**: iPhone SE (375×667), iPhone 15 Pro (393×852), Pixel 8 (412×915)
- **Tablet**: iPad (768×1024), iPad Pro (1024×1366)
- **Desktop**: 1280×800, 1440×900, 1920×1080, 2560×1440
- **Ultra-wide**: 3440×1440

Playwright runs all critical journeys at each viewport. Layout shift is asserted
(`expect(page).toHaveNoLayoutShift()`). Orientation changes covered for tablets.

See `tests/e2e/responsive.spec.ts`.

---

## Phase 4 — Browser Testing

Matrix executed in CI on every PR to `main`:

| Browser | Engine  | Versions              | Provider        |
| ------- | ------- | --------------------- | --------------- |
| Chrome  | Blink   | latest, latest-1      | Playwright      |
| Edge    | Blink   | latest                | Playwright      |
| Firefox | Gecko   | latest, latest-1      | Playwright      |
| Safari  | WebKit  | 17, 16                | Playwright + BrowserStack |

Polyfills: `core-js`, `whatwg-fetch`, `intersection-observer` (Safari 12 fallback).
PostCSS prefixes via `postcss-preset-env` for `:has()`, `:focus-visible`.

---

## Phase 5 — Unit Testing (Vitest)

- **Framework**: Vitest 2.x with `happy-dom` env for components, `node` for utils
- **Coverage**: v8 provider, 80% lines / 75% branches / 80% functions
- **Scope**: hooks, stores, utils, formatters, validators, pure functions
- **Conventions**:
  - One `*.test.ts(x)` next to source or in `tests/unit/`
  - AAA pattern (Arrange / Act / Assert)
  - No snapshot for logic — only for stable UI contracts
  - Property-based tests (fast-check) for parsers and formatters

---

## Phase 6 — Component Testing (Vitest + RTL + axe)

Every primitive component gets:

1. Render tests (default, variants, sizes, states)
2. Interaction tests (click, keyboard, focus)
3. a11y tests (`axe-core` per render — 0 violations)
4. Prop / event contract tests
5. Edge case tests (empty, overflow, long content, RTL, LTR)

Wrappers in `tests/setup/test-utils.tsx` provide `<Providers>` (i18n, theme, query
client, router) and accessible name matchers.

---

## Phase 7 — Snapshot Testing

**Used sparingly.** Snapshots only for:

- Generated static data (e.g., SVG icons, locale message catalogs)
- Critical layout markers (e.g., error boundary fallback shell)
- Generated API mocks (MSW handlers serialize for drift detection)

**Forbidden**:

- Whole-page DOM snapshots (brittle)
- Component tree snapshots (use visual regression instead)
- Snapshots of formatted dates / times / IDs (use explicit assertions)

---

## Phase 8 — Integration Testing (Vitest + MSW + RTL)

- **Network**: MSW v2 intercepts all HTTP. No real network in tests.
- **State**: Zustand stores tested with real reducers, no mocks.
- **Router**: Memory router with realistic history.
- **Auth**: Session via MSW handlers + cookie mock.
- **i18n**: Default `en-US`, secondary `de-DE` and `ar-SA` for one feature each.

See `tests/integration/*.test.tsx`.

---

## Phase 9 — End-to-End Testing (Playwright)

- **Runner**: Playwright 1.48+ with the official trace viewer.
- **Parallelism**: sharded by feature in CI; 4 workers locally.
- **Retries**: 1 retry on CI for flake, 0 locally.
- **Stability**: auto-wait + `expect.toPass()` for async UI; no `waitForTimeout`.
- **Auth state**: stored via `storageState` per role (admin, member, viewer).
- **Critical journeys**: J1–J10 above.

See `tests/e2e/*.spec.ts`.

---

## Phase 10 — Accessibility Testing

Three layers:

1. **Per-component**: `axe-core` in every component test.
2. **Per-page**: `axe-core` in every E2E test (`@axe-core/playwright`).
3. **Full audit**: pa11y-ci on built pages (CI artifact).

**Manual**: NVDA + VoiceOver + keyboard-only walkthrough per release.
Targets: 0 serious, 0 critical. Contrast ratio ≥ 4.5:1 (AA), 7:1 (AAA for body).

---

## Phase 11 — Visual Regression Testing

- **Tool**: Playwright `toHaveScreenshot()` with `mask` arrays for dynamic content.
- **Coverage**: every page × {light, dark, high-contrast} × {mobile, desktop}.
- **Update flow**: PR includes diff; reviewer approves baseline bump.
- **Theming**: tests run under each theme via `<html data-theme>`.
- **i18n**: `en`, `de`, `ar` (RTL) baselines for top 5 pages.

Baselines ignored in git via `tests/visual/baselines/.gitignore`; reviewed via PR
artifacts.

---

## Phase 12 — Performance Testing

- **Lighthouse CI**: budget enforced in `lighthouserc.json`.
- **Web Vitals**: `web-vitals` package reports from real users to analytics.
- **Bundle**: `size-limit` per route; CI fails on regression.
- **Render**: React Profiler markers in critical components; CI samples.
- **Memory**: leak detection via `playwright --trace` on long-running flows.

Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1.

---

## Phase 13 — Lighthouse Testing

`lighthouserc.json` runs against the built Next.js app. Categories asserted:

- performance ≥ 0.95
- accessibility = 1.0
- best-practices ≥ 0.95
- seo ≥ 0.95

Mobile preset (Moto G Power, slow 4G). Desktop preset for desktop build.

Run on every PR. Trends tracked in `.lighthouseci/`.

---

## Phase 14 — Security Testing

Automated checks:

- **Headers**: Helmet-equivalent policy verified by `tests/security/headers.test.ts`
- **CSP**: nonce-based, `strict-dynamic`, no `unsafe-inline` in production
- **Trusted Types**: enforced where supported
- **Cookies**: `Secure`, `HttpOnly`, `SameSite=Lax|Strict`
- **XSS**: payload corpus (`tests/security/xss-payloads.ts`) tested against every
  input that renders user content
- **Open redirect**: URL allowlist for all `redirect` and `returnTo` params
- **CSRF**: token presence asserted on all state-changing requests
- **Dependency audit**: `pnpm audit --prod --audit-level=high` in CI
- **Secret scan**: gitleaks pre-commit and CI

Manual pen test annually + on major auth changes.

---

## Phase 15 — Reliability Testing

- **Network**: `page.route()` simulates offline, 3G, timeout, 5xx
- **Slow connections**: throttled to 50 Kbps for 30s during hydration
- **API timeouts**: MSW handlers inject 30s delay; UI must surface error < 100ms
- **Server errors**: 500/502/503 injected; retry + backoff asserted
- **Browser crash**: `page.context().crash()` in critical flows
- **Offline mode**: Service Worker cache hit asserted; mutation queue drained on reconnect
- **Tab throttling**: `Page Visibility` backgrounded for 5 min — no memory leak

---

## Phase 16 — Test Automation Architecture

```
tests/
├── setup/                  # vitest setup, msw, test utils
├── unit/                   # vitest
├── integration/            # vitest + msw + rtl
├── e2e/                    # playwright
├── accessibility/          # pa11y, axe snapshots
├── visual/                 # screenshot baselines
├── performance/            # lighthouse, vitals, bundle
├── security/               # headers, xss, csrf, secrets
└── reliability/            # offline, timeouts, retries
```

**CI orchestration** (`.github/workflows/quality.yml`):

1. Lint + typecheck (parallel)
2. Unit + component (Vitest, parallel by file)
3. Integration (Vitest + MSW, serial — shared state)
4. Build Next.js
5. E2E smoke (Playwright, sharded)
6. E2E full (Playwright, scheduled nightly)
7. A11y + Lighthouse (parallel with E2E)
8. Security scans (parallel)
9. Bundle size
10. Visual regression (parallel)

**Reporting**: HTML reports uploaded; failures block merge; flaky test quarantine
has a 14-day TTL.

---

## Phase 17 — Quality Metrics

Tracked weekly, surfaced in `docs/testing/metrics.md`:

- Coverage (lines, branches, functions)
- Defect density (P0/P1/P2 per KLOC)
- Escape rate (bugs found in prod / total bugs)
- Regression rate (regressions / release)
- A11y score (axe violations by severity)
- Lighthouse score (perf, a11y, BP, SEO)
- Flake rate (retried tests / total)
- MTTR (mean time to repair)
- Build duration, test duration

**SLOs** (90-day rolling):

- Coverage ≥ 85%
- Escape rate < 2%
- Flake rate < 1%
- A11y violations: 0 serious/critical

---

## Phase 18 — CI/CD Quality Gates

`required_status_checks` in branch protection:

```
✅ lint
✅ typecheck
✅ test:unit
✅ test:integration
✅ test:e2e:smoke
✅ test:accessibility
✅ lighthouse
✅ bundle-size
✅ security
✅ visual-regression
```

A failing gate **blocks merge**. Override requires a `quality-override` label
plus a 24h cool-down and an incident postmortem.

---

## Phase 19 — Review Gates (Pre-Release)

1. **Functional** — all P0 journeys pass on staging
2. **UI** — visual review vs Figma
3. **UX** — usability smoke with 3 internal users
4. **Accessibility** — 0 serious/critical, NVDA + VoiceOver signed off
5. **Browser** — full matrix green
6. **Mobile** — iOS Safari + Android Chrome signed off
7. **Performance** — Lighthouse 95+ mobile, all budgets met
8. **Security** — headers, CSP, audit, no secrets
9. **Automation** — flake rate < 1%, no quarantined tests > 14d
10. **Production readiness** — error reporting, feature flags, runbook

Any single failed gate → **release rejected**. No exceptions without VP sign-off.

---

## Output Format (per feature)

For every feature, tests deliver:

1. Test strategy (what, why, risk)
2. Test cases (unit, integration, e2e)
3. Manual test plan (checklist)
4. Automated tests (runnable code in this repo)
5. Accessibility tests
6. Visual regression tests
7. Performance tests
8. Security tests
9. Reliability tests
10. CI/CD integration
11. Quality metrics
12. Release criteria

---

## How to Run

```bash
pnpm test                    # unit + component
pnpm test:unit               # vitest only
pnpm test:integration        # vitest + msw
pnpm test:e2e                # playwright
pnpm test:e2e:smoke          # smoke only
pnpm test:a11y               # pa11y + axe
pnpm test:visual             # visual regression
pnpm test:perf               # lighthouse
pnpm test:security           # headers + payloads
pnpm test:all                # everything
pnpm test:ci                 # CI mode (with reporters + junit)
```
