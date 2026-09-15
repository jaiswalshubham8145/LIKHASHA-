import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  formatRelativeTime,
  truncate,
  pluralize,
  formatBytes,
  formatDuration,
} from '@/utils/format';

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats by locale and currency', () => {
    expect(formatCurrency(1234.56, { currency: 'EUR', locale: 'de-DE' })).toMatch(/1\.234,56/);
  });

  it('handles zero and negatives', () => {
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(-99.9)).toBe('-$99.90');
  });

  it('handles very large numbers', () => {
    expect(formatCurrency(1e9)).toBe('$1,000,000,000.00');
  });

  it('rounds to 2 decimals', () => {
    expect(formatCurrency(1.005)).toBe('$1.01');
    expect(formatCurrency(1.004)).toBe('$1.00');
  });

  it('property: always contains currency symbol and 2 decimals', () => {
    fc.assert(
      fc.property(fc.float({ min: 0, max: 1e12, noNaN: true }), (n) => {
        const s = formatCurrency(n);
        return /[$€£¥]/.test(s) && /\.\d{2}$/.test(s);
      }),
    );
  });
});

describe('formatNumber', () => {
  it('formats with grouping', () => {
    expect(formatNumber(1_234_567)).toBe('1,234,567');
  });

  it('respects locale', () => {
    expect(formatNumber(1_234_567, 'de-DE')).toBe('1.234.567');
  });

  it('respects decimals option', () => {
    expect(formatNumber(1.23456, 'en-US', { decimals: 2 })).toBe('1.23');
  });
});

describe('formatPercent', () => {
  it('converts 0..1 ratio to %', () => {
    expect(formatPercent(0.123)).toBe('12.3%');
  });

  it('treats numbers > 1 as already-percent', () => {
    expect(formatPercent(12.3, { isRatio: false })).toBe('12.3%');
  });

  it('formats sign for deltas', () => {
    expect(formatPercent(0.05, { signDisplay: 'always' })).toBe('+5%');
    expect(formatPercent(-0.05, { signDisplay: 'always' })).toBe('-5%');
  });
});

describe('formatDate', () => {
  const date = new Date('2026-06-06T12:00:00Z');

  it('formats ISO by default', () => {
    expect(formatDate(date)).toBe('2026-06-06');
  });

  it('respects format string', () => {
    expect(formatDate(date, { format: 'short' })).toMatch(/Jun 6, 2026/);
  });

  it('handles invalid input gracefully', () => {
    expect(formatDate(new Date('invalid'))).toBe('—');
  });
});

describe('formatRelativeTime', () => {
  const now = new Date('2026-06-06T12:00:00Z');

  it.each([
    [new Date('2026-06-06T11:59:30Z'), '30s ago'],
    [new Date('2026-06-06T11:55:00Z'), '5m ago'],
    [new Date('2026-06-06T09:00:00Z'), '3h ago'],
    [new Date('2026-06-05T12:00:00Z'), 'yesterday'],
    [new Date('2026-06-01T12:00:00Z'), '5d ago'],
  ])('formats %s as %s', (input, expected) => {
    expect(formatRelativeTime(input, { now })).toBe(expected);
  });

  it('uses "in X" for future dates', () => {
    expect(formatRelativeTime(new Date('2026-06-06T13:00:00Z'), { now })).toBe('in 1h');
  });
});

describe('truncate', () => {
  it('returns string when shorter than max', () => {
    expect(truncate('hi', 10)).toBe('hi');
  });

  it('truncates with ellipsis', () => {
    expect(truncate('hello world', 8)).toBe('hello w…');
  });

  it('respects word boundary option', () => {
    expect(truncate('hello world this is long', 12, { wordBoundary: true })).toBe('hello…');
  });
});

describe('pluralize', () => {
  it('handles singular and plural', () => {
    expect(pluralize(1, 'item')).toBe('1 item');
    expect(pluralize(2, 'item')).toBe('2 items');
  });

  it('handles custom plural', () => {
    expect(pluralize(2, 'child', 'children')).toBe('2 children');
  });
});

describe('formatBytes', () => {
  it.each([
    [0, '0 B'],
    [512, '512 B'],
    [1024, '1 KB'],
    [1024 ** 2, '1 MB'],
    [1024 ** 3, '1 GB'],
    [1.5 * 1024 ** 2, '1.5 MB'],
  ])('formats %d as %s', (input, expected) => {
    expect(formatBytes(input)).toBe(expected);
  });

  it('respects IEC vs SI', () => {
    expect(formatBytes(1000, { system: 'si' })).toBe('1 kB');
    expect(formatBytes(1024, { system: 'iec' })).toBe('1 KiB');
  });
});

describe('formatDuration', () => {
  it.each([
    [0, '0s'],
    [45, '45s'],
    [60, '1m 0s'],
    [125, '2m 5s'],
    [3600, '1h 0m'],
    [3661, '1h 1m 1s'],
  ])('formats %d seconds as %s', (input, expected) => {
    expect(formatDuration(input)).toBe(expected);
  });
});
