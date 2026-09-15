import { test, expect, type Page } from '../e2e/fixtures/test';

interface Vitals {
  lcp?: number;
  cls?: number;
  inp?: number;
  fcp?: number;
  ttfb?: number;
}

async function measureWebVitals(page: Page): Promise<Vitals> {
  await page.addInitScript(() => {
    // @ts-ignore
    window.__vitals = {};
  });
  await page.addScriptTag({
    url: 'https://unpkg.com/web-vitals@4?module',
    type: 'module',
  });
  await page.waitForFunction(() => (window as any).__vitals);
  return page.evaluate(async () => {
    // @ts-ignore
    const { onLCP, onCLS, onINP, onFCP, onTTFB } = await import('https://unpkg.com/web-vitals@4?module');
    return new Promise<Vitals>((resolve) => {
      const v: Vitals = {};
      onLCP((m) => { v.lcp = m.value; });
      onCLS((m) => { v.cls = m.value; });
      onINP((m) => { v.inp = m.value; });
      onFCP((m) => { v.fcp = m.value; });
      onTTFB((m) => { v.ttfb = m.value; });
      setTimeout(() => resolve(v), 5000);
    });
  });
}

const budgets: Array<{ route: string; lcp: number; cls: number; inp: number; fcp: number }> = [
  { route: '/', lcp: 2500, cls: 0.1, inp: 200, fcp: 1500 },
  { route: '/login', lcp: 2000, cls: 0.05, inp: 150, fcp: 1200 },
  { route: '/dashboard', lcp: 3000, cls: 0.1, inp: 250, fcp: 1800 },
  { route: '/dashboards/d_1', lcp: 3500, cls: 0.1, inp: 300, fcp: 2000 },
];

for (const b of budgets) {
  test(`web vitals — ${b.route}`, async ({ ownerPage }) => {
    await ownerPage.goto(b.route);
    await ownerPage.waitForLoadState('networkidle');
    const v = await measureWebVitals(ownerPage);
    expect(v.lcp ?? Infinity, `LCP was ${v.lcp}ms`).toBeLessThan(b.lcp);
    expect(v.cls ?? 0, `CLS was ${v.cls}`).toBeLessThan(b.cls);
    expect(v.inp ?? 0, `INP was ${v.inp}ms`).toBeLessThan(b.inp);
    expect(v.fcp ?? Infinity, `FCP was ${v.fcp}ms`).toBeLessThan(b.fcp);
  });
}

test('CLS: dashboard does not shift after data load', async ({ ownerPage }) => {
  await ownerPage.goto('/dashboards/d_1');
  await ownerPage.evaluate(() => {
    // @ts-ignore
    window.__cls = 0;
    // @ts-ignore
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        // @ts-ignore
        if (!(e).hadRecentInput) window.__cls += (e).value;
      }
    });
    po.observe({ type: 'layout-shift', buffered: true });
  });
  await ownerPage.waitForTimeout(3000);
  const cls = await ownerPage.evaluate(() => (window as any).__cls);
  expect(cls).toBeLessThan(0.1);
});

test('INP: 10 rapid clicks stay responsive', async ({ ownerPage }) => {
  await ownerPage.goto('/dashboards');
  const button = ownerPage.getByRole('button', { name: /new dashboard/i });
  for (let i = 0; i < 10; i++) {
    await button.click({ delay: 50 });
    await ownerPage.keyboard.press('Escape');
  }
  const t = Date.now();
  await ownerPage.getByRole('link', { name: /settings/i }).click();
  const navTime = Date.now() - t;
  expect(navTime).toBeLessThan(2000);
});
