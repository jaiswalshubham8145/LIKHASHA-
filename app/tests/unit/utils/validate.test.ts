import { describe, it, expect } from 'vitest';
import {
  isEmail,
  isUrl,
  isStrongPassword,
  isUuid,
  isPhone,
  isCreditCard,
  isHexColor,
  isIsoDate,
  isSlug,
  isJson,
  sanitizeUrl,
  escapeHtml,
  stripHtml,
} from '@/utils/validate';

describe('isEmail', () => {
  it.each([
    ['user@example.com', true],
    ['user.name+tag@sub.example.co.uk', true],
    ['user@', false],
    ['@example.com', false],
    ['user space@example.com', false],
    ['', false],
  ])('isEmail(%j) === %s', (input, expected) => {
    expect(isEmail(input)).toBe(expected);
  });
});

describe('isUrl', () => {
  it.each([
    ['https://example.com', true],
    ['http://localhost:3000/path?q=1', true],
    ['ftp://files.example.com', true],
    ['javascript:alert(1)', false],
    ['data:text/html,<x>', false],
    ['vbscript:msgbox(1)', false],
    ['file:///etc/passwd', false],
    ['not a url', false],
  ])('isUrl(%j) === %s', (input, expected) => {
    expect(isUrl(input, { allowedProtocols: ['http:', 'https:', 'ftp:'] })).toBe(expected);
  });
});

describe('isStrongPassword', () => {
  it('requires minimum length', () => {
    expect(isStrongPassword('Ab1!aaaa')).toBe(false);
    expect(isStrongPassword('Ab1!aaaaaaaa')).toBe(true);
  });

  it('requires all classes', () => {
    expect(isStrongPassword('alllowercase12')).toBe(false);
    expect(isStrongPassword('ALLUPPERCASE12')).toBe(false);
    expect(isStrongPassword('AllLettersOnly')).toBe(false);
    expect(isStrongPassword('AllClasses1!aaaa')).toBe(true);
  });

  it('detects common passwords', () => {
    expect(isStrongPassword('Password123!aaa', { blocklist: ['Password123!'] })).toBe(false);
  });
});

describe('isUuid', () => {
  it.each([
    ['550e8400-e29b-41d4-a716-446655440000', true],
    ['550E8400-E29B-41D4-A716-446655440000', true],
    ['not-a-uuid', false],
    ['550e8400e29b41d4a716446655440000', false], // no hyphens
  ])('isUuid(%j) === %s', (input, expected) => {
    expect(isUuid(input)).toBe(expected);
  });
});

describe('isPhone', () => {
  it.each([
    ['+12025551234', true],
    ['+44 20 7946 0958', true],
    ['2025551234', true],
    ['abc', false],
  ])('isPhone(%j) === %s', (input, expected) => {
    expect(isPhone(input)).toBe(expected);
  });
});

describe('isCreditCard', () => {
  it.each([
    ['4242424242424242', true], // visa test
    ['4000000000000002', true], // visa test (decline)
    ['5555555555554444', true], // mc test
    ['378282246310005', true],  // amex test
    ['4242424242424241', false], // bad luhn
  ])('isCreditCard(%j) === %s', (input, expected) => {
    expect(isCreditCard(input)).toBe(expected);
  });
});

describe('isHexColor', () => {
  it.each(['#fff', '#FFFFFF', '#1234abcd', 'fff', 'FFFFFF', 'red'])(
    'isHexColor(%j)',
    (input) => {
      expect(isHexColor(input)).toBe(input !== 'red');
    },
  );
});

describe('isIsoDate', () => {
  it.each([
    ['2026-06-06', true],
    ['2026-06-06T12:00:00Z', true],
    ['2026-13-01', false],
    ['not a date', false],
  ])('isIsoDate(%j) === %s', (input, expected) => {
    expect(isIsoDate(input)).toBe(expected);
  });
});

describe('isSlug', () => {
  it.each([
    ['hello-world', true],
    ['hello_world', false],
    ['Hello-World', false],
    ['hello--world', false],
    ['hello-', false],
  ])('isSlug(%j) === %s', (input, expected) => {
    expect(isSlug(input)).toBe(expected);
  });
});

describe('isJson', () => {
  it('parses valid JSON', () => {
    expect(isJson('{"a":1}')).toBe(true);
    expect(isJson('[]')).toBe(true);
  });
  it('rejects invalid', () => {
    expect(isJson('{')).toBe(false);
    expect(isJson('not json')).toBe(false);
  });
});

describe('sanitizeUrl', () => {
  it('allows http(s)', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
  });
  it('rejects javascript: and data: and vbscript:', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBeNull();
  });
  it('handles relative URLs', () => {
    expect(sanitizeUrl('/dashboard')).toBe('/dashboard');
    expect(sanitizeUrl('//cdn.example.com/x.png')).toBe('//cdn.example.com/x.png');
  });
});

describe('escapeHtml', () => {
  it('escapes dangerous chars', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    );
    expect(escapeHtml("it's")).toBe('it&#x27;s');
  });

  it('handles null/undefined/numbers safely', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml(42)).toBe('42');
  });
});

describe('stripHtml', () => {
  it('removes all tags', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });
  it('removes script/style content', () => {
    expect(stripHtml('<script>alert(1)</script>safe')).toBe('safe');
  });
  it('handles malicious attributes', () => {
    expect(stripHtml('<img src=x onerror=alert(1)>')).toBe('');
  });
});
