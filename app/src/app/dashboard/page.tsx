import { DashboardList } from '@/features/dashboards/DashboardList';

export const metadata = { title: 'Overview' };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <DashboardList />
    </div>
  );
}
