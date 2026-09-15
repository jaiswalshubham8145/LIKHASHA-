'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/providers/AuthProvider';
import { useI18n } from '@/providers/I18nProvider';
import { useToast } from '@/components/Toast';
import { canCreateDashboard, createDashboard, listDashboards, type Dashboard } from './api';

export function DashboardList() {
  const { t } = useI18n();
  const toast = useToast();
  const { session } = useAuth();
  const accessToken = session?.accessToken ?? '';
  const role = session?.user.role;
  const qc = useQueryClient();
  const queryKey = ['dashboards', accessToken];

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => listDashboards(accessToken),
    enabled: !!accessToken,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createDashboard({ name }, accessToken),
    onSuccess: (created) => {
      qc.setQueryData<{ items: Dashboard[]; nextCursor: string | null }>(queryKey, (prev) => ({
        items: [created, ...(prev?.items ?? [])],
        nextCursor: prev?.nextCursor ?? null,
      }));
      setCreateOpen(false);
      setNewName('');
      toast.push({ kind: 'success', title: 'Dashboard created' });
    },
    onError: () => {
      toast.push({ kind: 'danger', title: 'Failed to create dashboard' });
    },
  });

  if (isLoading) {
    return (
      <div role="status" aria-label="Loading" className="flex items-center gap-2 text-muted">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        {t('common.loading')}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-2">
        <p role="alert" className="text-sm text-danger">
          {t('errors.serverError')}
        </p>
        <Button onClick={() => refetch()}>{t('common.retry')}</Button>
      </div>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    const canCreate = role ? canCreateDashboard(role) : false;
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted">{t('common.noDashboards')}.</p>
        {canCreate && (
          <a href="/dashboards/new" className="text-brand-600 underline">
            {t('common.createFirst')} dashboard
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('common.dashboards')}</h1>
        {role && canCreateDashboard(role) && (
          <Button onClick={() => setCreateOpen(true)}>{t('common.newDashboard')}</Button>
        )}
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d) => (
          <li key={d.id}>
            <a
              href={`/dashboards/${d.id}`}
              className="block rounded-md border border-border bg-bg p-4 transition-colors hover:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <h2 className="text-lg font-medium">{d.name}</h2>
              <p className="mt-1 text-sm text-muted">
                {d.widgets.length} widgets · updated {new Date(d.updatedAt).toLocaleDateString()}
              </p>
            </a>
          </li>
        ))}
      </ul>

      <Dialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={t('common.newDashboard')}
        description="Give your dashboard a name."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newName.trim()) createMutation.mutate(newName.trim());
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label={t('common.name')}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              {t('common.create')}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
