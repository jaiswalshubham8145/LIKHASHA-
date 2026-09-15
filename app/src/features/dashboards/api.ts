import type { Role } from '@/types/auth';

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'line' | 'bar' | 'pie' | 'table';
  label: string;
  value: number | string;
  delta?: number;
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  updatedAt: string;
}

export interface DashboardsResponse {
  items: Dashboard[];
  nextCursor: string | null;
}

export interface CreateDashboardRequest {
  name: string;
}

export async function listDashboards(accessToken: string): Promise<DashboardsResponse> {
  const res = await fetch('/api/dashboards', {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as DashboardsResponse;
}

export async function createDashboard(
  input: CreateDashboardRequest,
  accessToken: string,
): Promise<Dashboard> {
  const res = await fetch('/api/dashboards', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
    const err = new Error(data.message ?? `HTTP ${res.status}`) as Error & { code?: string };
    err.code = data.code ?? 'unknown_error';
    throw err;
  }
  return (await res.json()) as Dashboard;
}

export async function deleteDashboard(id: string, accessToken: string): Promise<void> {
  await fetch(`/api/dashboards/${id}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${accessToken}` },
  });
}

export function canCreateDashboard(role: Role): boolean {
  return role !== 'viewer';
}
