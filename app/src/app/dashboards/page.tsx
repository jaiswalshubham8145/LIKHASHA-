import { DashboardList } from '@/features/dashboards/DashboardList';
import { requireSession } from '@/lib/auth/server';

export const metadata = { title: 'Dashboards' };

export default async function DashboardsPage() {
  await requireSession();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <DashboardList />
    </div>
  );
}
