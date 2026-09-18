import { getSafeOrders } from '@/lib/data';
import AdminOrdersView from '@/components/AdminOrdersView';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await getSafeOrders();

  return <AdminOrdersView initialOrders={orders} />;
}
