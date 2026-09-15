import type { NextRequest, NextResponse } from 'next/server';

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'strict-dynamic'`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://api.lumen.app wss://api.lumen.app`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
  `block-all-mixed-content`,
].join('; ');

export function securityHeaders(_req: NextRequest, res: NextResponse) {
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-DNS-Prefetch-Control', 'off');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  );
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.headers.set('Cross-Origin-Resource-Policy', 'same-site');
  res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  res.headers.delete('X-Powered-By');
  res.headers.delete('Server');
  return res;
}
