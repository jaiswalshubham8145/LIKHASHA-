import { describe, it, expect } from 'vitest';
import { cn } from '@/utils/cn';

describe('cn', () => {
  it('joins truthy strings', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('flattens arrays', () => {
    expect(cn(['a', 'b'], 'c', ['d'])).toBe('a b c d');
  });

  it('supports object form (clsx-style)', () => {
    expect(cn('a', { b: true, c: false, d: 1 })).toBe('a b d');
  });

  it('handles nested mixed input', () => {
    expect(cn('a', ['b', { c: true, d: false }], null, 'e')).toBe('a b c e');
  });

  it('returns empty string when no truthy values', () => {
    expect(cn(null, false, undefined, '')).toBe('');
  });
});
