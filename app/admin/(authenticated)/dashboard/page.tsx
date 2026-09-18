import { getSafeAdminStats } from '@/lib/data';
import { requireAdmin } from '@/lib/auth';
import AdminDashboardView from '@/components/AdminDashboardView';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await requireAdmin();

  const { orders, productsCount } = await getSafeAdminStats();

  return <AdminDashboardView orders={orders} productsCount={productsCount} />;
}
