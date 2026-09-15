import type { Session } from '@/types/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Session['user'];
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export async function loginApi(input: LoginRequest): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
    const err = new Error(data.message ?? `Login failed (${res.status})`) as Error & {
      code?: string;
      status?: number;
    };
    err.code = data.code ?? 'unknown_error';
    err.status = res.status;
    throw err;
  }
  return (await res.json()) as LoginResponse;
}

export async function logoutApi(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
}
