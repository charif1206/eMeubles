import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSafePendingOrdersCount } from '@/lib/data';
import AdminShell from '@/components/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/admin/login');
  }

  const pendingOrdersCount = await getSafePendingOrdersCount();

  return (
    <AdminShell user={session} pendingOrdersCount={pendingOrdersCount}>
      {children}
    </AdminShell>
  );
}
