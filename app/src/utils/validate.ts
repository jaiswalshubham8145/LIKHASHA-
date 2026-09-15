const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HEX_COLOR_RE = /^#?[0-9a-f]{3}([0-9a-f]{3}([0-9a-f]{2})?)?$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const LOWER = /[a-z]/;
const UPPER = /[A-Z]/;
const DIGIT = /\d/;
const SPECIAL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export function isEmail(value: string): boolean {
  return typeof value === 'string' && EMAIL_RE.test(value);
}

export interface IsUrlOptions {
  allowedProtocols?: ReadonlyArray<string>;
}

export function isUrl(value: string, { allowedProtocols = ['http:', 'https:'] }: IsUrlOptions = {}): boolean {
  if (typeof value !== 'string') return false;
  try {
    const u = new URL(value);
    return allowedProtocols.includes(u.protocol);
  } catch {
    return false;
  }
}

export interface IsStrongPasswordOptions {
  minLength?: number;
  blocklist?: ReadonlyArray<string>;
}

export function isStrongPassword(
  value: string,
  { minLength = 12, blocklist = [] }: IsStrongPasswordOptions = {},
): boolean {
  if (typeof value !== 'string' || value.length < minLength) return false;
  if (!LOWER.test(value) || !UPPER.test(value) || !DIGIT.test(value) || !SPECIAL.test(value)) return false;
  return !blocklist.some((b) => b === value);
}

export function isUuid(value: string): boolean {
  return typeof value === 'string' && UUID_RE.test(value);
}

export function isPhone(value: string): boolean {
  if (typeof value !== 'string') return false;
  const stripped = value.replace(/[\s\-().]/g, '');
  if (!/^\+?\d{7,15}$/.test(stripped)) return false;
  return PHONE_RE.test(value);
}

// Luhn check
export function isCreditCard(value: string): boolean {
  if (typeof value !== 'string') return false;
  const digits = value.replace(/\D/g, '');
  if (digits.length < 12 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function isHexColor(value: string): boolean {
  return typeof value === 'string' && HEX_COLOR_RE.test(value);
}

export function isIsoDate(value: string): boolean {
  if (typeof value !== 'string') return false;
  if (!ISO_DATE_RE.test(value)) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

export function isSlug(value: string): boolean {
  return typeof value === 'string' && SLUG_RE.test(value);
}

export function isJson(value: string): boolean {
  if (typeof value !== 'string') return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeUrl(value: string): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  // relative or protocol-relative
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  if (trimmed.startsWith('//')) {
    try {
      const u = new URL(`https:${trimmed}`);
      return u.toString();
    } catch {
      return null;
    }
  }
  try {
    const u = new URL(trimmed);
    if (['javascript:', 'data:', 'vbscript:', 'file:'].includes(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"'`=/]/g, (c) => HTML_ESCAPES[c] ?? c);
}

export function stripHtml(value: string): string {
  if (typeof value !== 'string') return '';
  // remove script/style entirely, then strip remaining tags
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}
