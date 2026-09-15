// Compute flake rate from a folder of Playwright JSON reports
// Usage: node scripts/flake-report.mjs artifacts/
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2] ?? 'artifacts/';
if (!existsSync(dir)) {
  console.error('No artifacts dir:', dir);
  process.exit(1);
}

type Result = {
  title: string;
  file: string;
  status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'flaky' | 'interrupted';
  retries: number;
  durationMs: number;
};

const all: Result[] = [];
for (const f of readdirSync(dir)) {
  if (!f.endsWith('.json')) continue;
  const r = JSON.parse(readFileSync(join(dir, f), 'utf-8'));
  for (const s of r.suites?.flatMap((x: any) => x.specs ?? []) ?? []) {
    for (const t of s.tests ?? []) {
      all.push({
        title: s.title,
        file: r.config?.rootDir ?? '',
        status: t.status,
        retries: t.results?.length ? t.results.length - 1 : 0,
        durationMs: t.results?.[0]?.duration ?? 0,
      });
    }
  }
}

const flaky = all.filter((t) => t.status === 'flaky' || (t.retries > 0 && t.status === 'passed'));
const failed = all.filter((t) => t.status === 'failed' || t.status === 'timedOut');
const passed = all.filter((t) => t.status === 'passed');
const flakeRate = all.length ? flaky.length / all.length : 0;

const report = {
  total: all.length,
  passed: passed.length,
  failed: failed.length,
  flaky: flaky.length,
  flakeRate,
  mostFlaky: all
    .filter((t) => t.retries > 0)
    .sort((a, b) => b.retries - a.retries)
    .slice(0, 20),
};

console.log(JSON.stringify(report, null, 2));

if (flakeRate > 0.05) {
  console.error(`::error::Flake rate ${(flakeRate * 100).toFixed(2)}% exceeds 5% threshold`);
  process.exit(2);
}
