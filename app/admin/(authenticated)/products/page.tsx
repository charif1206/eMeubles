import { getSafeProducts } from '@/lib/data';
import { requireAdmin } from '@/lib/auth';
import AdminProductsView from '@/components/AdminProductsView';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await getSafeProducts();

  return <AdminProductsView initialProducts={products} />;
}
