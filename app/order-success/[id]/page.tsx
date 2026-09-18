import { getSafeOrder } from '@/lib/data';
import { notFound } from 'next/navigation';
import OrderSuccessView from '@/components/OrderSuccessView';

export const dynamic = 'force-dynamic';

export default async function OrderSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getSafeOrder(params.id);

  if (!order) {
    notFound();
  }

  return (
    <main className="flex-1 flex flex-col relative w-full pt-4 pb-16 bg-surface min-h-screen">
      <OrderSuccessView order={order} />
    </main>
  );
}
