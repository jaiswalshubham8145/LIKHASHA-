'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/providers/AuthProvider';
import { useI18n } from '@/providers/I18nProvider';
import { useToast } from '@/components/Toast';
import { canManageTeam, inviteMember, listTeamMembers, removeMember, type TeamMember } from './api';

const ROLES: Array<TeamMember['role']> = ['admin', 'member', 'viewer'];

export function TeamSettings() {
  const { t } = useI18n();
  const toast = useToast();
  const { session } = useAuth();
  const accessToken = session?.accessToken ?? '';
  const role = session?.user.role;
  const qc = useQueryClient();
  const queryKey = ['team', accessToken];

  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('member');
  const [inviteError, setInviteError] = useState<string | undefined>();
  const [confirmRemove, setConfirmRemove] = useState<TeamMember | null>(null);

  const { data } = useQuery({
    queryKey,
    queryFn: () => listTeamMembers(accessToken),
    enabled: !!accessToken,
  });

  const inviteMutation = useMutation({
    mutationFn: () => inviteMember({ email, role: inviteRole }, accessToken),
    onMutate: () => setInviteError(undefined),
    onSuccess: (created) => {
      qc.setQueryData<{ items: TeamMember[] }>(queryKey, (prev) => ({
        items: [...(prev?.items ?? []), created],
      }));
      setInviteOpen(false);
      setEmail('');
      toast.push({ kind: 'success', title: 'Invitation sent' });
    },
    onError: (err) => {
      const code = (err as { code?: string }).code;
      if (code === 'email_taken') {
        setInviteError('This email is already a member.');
      } else {
        setInviteError('Could not send invite.');
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeMember(id, accessToken),
    onSuccess: (_void, id) => {
      qc.setQueryData<{ items: TeamMember[] }>(queryKey, (prev) => ({
        items: (prev?.items ?? []).filter((m) => m.id !== id),
      }));
      setConfirmRemove(null);
      toast.push({ kind: 'success', title: 'Member removed' });
    },
  });

  const members = data?.items ?? [];
  const canManage = role ? canManageTeam(role) : false;

  return (
    <section aria-label="Team settings" className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('common.team')}</h1>
        {canManage && (
          <Button onClick={() => setInviteOpen(true)}>{t('common.inviteMember')}</Button>
        )}
      </header>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/5 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} aria-label={m.email} className="border-t border-border">
                <td className="px-4 py-2">{m.name}</td>
                <td className="px-4 py-2 text-muted">{m.email}</td>
                <td className="px-4 py-2 capitalize">{m.role}</td>
                <td className="px-4 py-2 text-right">
                  {canManage && m.id !== session?.user.id && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setConfirmRemove(m)}
                    >
                      {t('common.remove')}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title={t('common.inviteMember')}
        description="Send an invite to join your team."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) return;
            inviteMutation.mutate();
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label={t('common.email')}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={inviteError}
            required
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="invite-role" className="text-sm font-medium">
              {t('common.role')}
            </label>
            <select
              id="invite-role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
              className="h-10 rounded-md border border-border bg-bg px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setInviteOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={inviteMutation.isPending}>
              {t('common.sendInvite')}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={confirmRemove !== null}
        onOpenChange={(o) => !o && setConfirmRemove(null)}
        title={t('common.areYouSure')}
        description={`This will remove ${confirmRemove?.name ?? ''} from your team.`}
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmRemove(null)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            loading={removeMutation.isPending}
            onClick={() => confirmRemove && removeMutation.mutate(confirmRemove.id)}
          >
            {t('common.confirm')}
          </Button>
        </div>
      </Dialog>
    </section>
  );
}
