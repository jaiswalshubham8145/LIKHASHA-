export type Role = 'owner' | 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface AuthError {
  code: string;
  message: string;
}
