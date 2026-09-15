export interface FormatCurrencyOptions {
  currency?: string;
  locale?: string;
}

export function formatCurrency(
  value: number,
  { currency = 'USD', locale = 'en-US' }: FormatCurrencyOptions = {},
): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export interface FormatNumberOptions {
  decimals?: number;
  locale?: string;
}

export function formatNumber(
  value: number,
  locale: string = 'en-US',
  { decimals }: FormatNumberOptions = {},
): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export interface FormatPercentOptions {
  isRatio?: boolean;
  signDisplay?: 'auto' | 'always' | 'never' | 'exceptZero';
  locale?: string;
  decimals?: number;
}

export function formatPercent(
  value: number,
  { isRatio = true, signDisplay = 'auto', locale = 'en-US', decimals = 1 }: FormatPercentOptions = {},
): string {
  if (!Number.isFinite(value)) return '—';
  const v = isRatio ? value : value / 100;
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    signDisplay,
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(v);
}

export interface FormatDateOptions {
  format?: 'short' | 'medium' | 'long' | 'full' | 'iso' | ((d: Date) => string);
  locale?: string;
}

export function formatDate(date: Date | string | number, { format = 'iso', locale = 'en-US' }: FormatDateOptions = {}): string {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  if (format === 'iso') return d.toISOString().slice(0, 10);
  if (typeof format === 'function') return format(d);
  return new Intl.DateTimeFormat(locale, { dateStyle: format }).format(d);
}

export interface FormatRelativeTimeOptions {
  now?: Date | number;
  locale?: string;
}

const RTF_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
  ['second', 1],
];

export function formatRelativeTime(
  date: Date | string | number,
  { now = Date.now(), locale = 'en-US' }: FormatRelativeTimeOptions = {},
): string {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  const nowDate = now instanceof Date ? now : new Date(now);
  const diff = (d.getTime() - nowDate.getTime()) / 1000;
  const absDiff = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const [unit, seconds] of RTF_UNITS) {
    if (absDiff >= seconds || unit === 'second') {
      const v = Math.round(diff / seconds);
      return rtf.format(v, unit);
    }
  }
  return rtf.format(0, 'second');
}

export interface TruncateOptions {
  wordBoundary?: boolean;
  ellipsis?: string;
}

export function truncate(input: string, max: number, { wordBoundary = false, ellipsis = '…' }: TruncateOptions = {}): string {
  if (input.length <= max) return input;
  const target = max - ellipsis.length;
  if (target <= 0) return ellipsis.slice(0, max);
  if (!wordBoundary) return input.slice(0, target) + ellipsis;
  const slice = input.slice(0, target);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + ellipsis;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${word}`;
}

export interface FormatBytesOptions {
  system?: 'si' | 'iec';
  decimals?: number;
}

export function formatBytes(bytes: number, { system = 'si', decimals = 1 }: FormatBytesOptions = {}): string {
  if (!Number.isFinite(bytes)) return '—';
  if (bytes === 0) return '0 B';
  const k = system === 'iec' ? 1024 : 1000;
  const sizes = system === 'iec'
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
    : ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.min(Math.floor(Math.log(Math.abs(bytes)) / Math.log(k)), sizes.length - 1);
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(decimals).replace(/\.0+$/, '')} ${sizes[i]}`;
}

export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0s';
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m${sec ? ` ${sec}s` : ''}`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}
