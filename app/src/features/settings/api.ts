import type { Role } from '@/types/auth';

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface InviteRequest {
  email: string;
  role: Role;
}

export async function listTeamMembers(accessToken: string): Promise<{ items: TeamMember[] }> {
  const res = await fetch('/api/team/members', {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as { items: TeamMember[] };
}

export async function inviteMember(input: InviteRequest, accessToken: string): Promise<TeamMember> {
  const res = await fetch('/api/team/invite', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
    const err = new Error(data.message ?? `HTTP ${res.status}`) as Error & { code?: string };
    err.code = data.code ?? 'unknown_error';
    throw err;
  }
  return (await res.json()) as TeamMember;
}

export async function removeMember(id: string, accessToken: string): Promise<void> {
  await fetch(`/api/team/members/${id}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${accessToken}` },
  });
}

export function canManageTeam(role: Role): boolean {
  return role === 'owner' || role === 'admin';
}
