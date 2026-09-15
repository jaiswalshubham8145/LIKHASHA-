// Aggregate test metrics into a weekly snapshot
// Usage: pnpm metrics:aggregate
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

type Summary = {
  week: string;
  unit: { total: number; passed: number; failed: number; durationMs: number; coverage?: { lines: number; branches: number; functions: number; statements: number } };
  integration: { total: number; passed: number; failed: number; durationMs: number };
  e2e: { total: number; passed: number; failed: number; flaky: number; durationMs: number };
  a11y: { serious: number; critical: number; moderate: number; minor: number };
  lighthouse: { performance: number; accessibility: number; bestPractices: number; seo: number; lcp: number; cls: number; inp: number };
  bundle: { initialJsKb: number; cssKb: number };
  security: { vulnerabilities: { critical: number; high: number; medium: number }; secretsLeaked: number; failedHeaders: number };
};

function readJson<T>(p: string): T | null {
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf-8')) as T;
}

function readJunit(p: string) {
  const xml = readFileSync(p, 'utf-8');
  const tests = (xml.match(/<testcase/g) ?? []).length;
  const failures = (xml.match(/<failure/g) ?? []).length;
  return { total: tests, passed: tests - failures, failed: failures };
}

const root = process.cwd();
const out: Summary = {
  week: new Date().toISOString().slice(0, 10),
  unit: { total: 0, passed: 0, failed: 0, durationMs: 0 },
  integration: { total: 0, passed: 0, failed: 0, durationMs: 0 },
  e2e: { total: 0, passed: 0, failed: 0, flaky: 0, durationMs: 0 },
  a11y: { serious: 0, critical: 0, moderate: 0, minor: 0 },
  lighthouse: { performance: 0, accessibility: 0, bestPractices: 0, seo: 0, lcp: 0, cls: 0, inp: 0 },
  bundle: { initialJsKb: 0, cssKb: 0 },
  security: { vulnerabilities: { critical: 0, high: 0, medium: 0 }, secretsLeaked: 0, failedHeaders: 0 },
};

const coverage = readJson<any>(join(root, 'coverage/coverage-summary.json'));
if (coverage?.total) {
  out.unit.coverage = {
    lines: coverage.total.lines.pct,
    branches: coverage.total.branches.pct,
    functions: coverage.total.functions.pct,
    statements: coverage.total.statements.pct,
  };
}

const u = readJunit(join(root, 'coverage/junit-unit.xml'));
if (u) out.unit = { ...out.unit, ...u };
const i = readJunit(join(root, 'coverage/junit-integration.xml'));
if (i) out.integration = { ...out.integration, ...i };

const e2e = readJson<any>(join(root, 'playwright-report/results.json'));
if (e2e?.stats) {
  out.e2e = {
    total: e2e.stats.expected + e2e.stats.unexpected + e2e.stats.flaky + e2e.stats.skipped,
    passed: e2e.stats.expected,
    failed: e2e.stats.unexpected,
    flaky: e2e.stats.flaky,
    durationMs: e2e.stats.duration,
  };
}

const a11y = readJson<any[]>(join(root, 'reports/a11y/axe.json'));
if (Array.isArray(a11y)) {
  for (const r of a11y) {
    for (const v of r.violations ?? []) {
      if (v.impact === 'critical') out.a11y.critical++;
      if (v.impact === 'serious') out.a11y.serious++;
      if (v.impact === 'moderate') out.a11y.moderate++;
      if (v.impact === 'minor') out.a11y.minor++;
    }
  }
}

const lh = readJson<any[]>(join(root, '.lighthouseci/manifest.json'));
if (Array.isArray(lh)) {
  const last = lh[lh.length - 1];
  if (last?.summary) {
    out.lighthouse = {
      performance: last.summary.performance,
      accessibility: last.summary.accessibility,
      bestPractices: last.summary['best-practices'],
      seo: last.summary.seo,
      lcp: 0, cls: 0, inp: 0,
    };
  }
}

const audit = readJson<any>(join(root, 'reports/security/audit.json'));
if (audit?.metadata?.vulnerabilities) {
  out.security.vulnerabilities = {
    critical: audit.metadata.vulnerabilities.critical ?? 0,
    high: audit.metadata.vulnerabilities.high ?? 0,
    medium: audit.metadata.vulnerabilities.moderate ?? 0,
  };
}

const dir = join(root, 'reports/metrics');
if (!existsSync(dir)) {
  require('node:fs').mkdirSync(dir, { recursive: true });
}
writeFileSync(join(dir, `${out.week}.json`), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
