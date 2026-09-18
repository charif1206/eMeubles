import { getSafeProducts } from '@/lib/data';
import ClientHeader from '@/components/ClientHeader';
import CatalogView from '@/components/CatalogView';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const searchQuery = searchParams?.q || '';
  const products = await getSafeProducts(searchQuery);

  return (
    <>
      <ClientHeader />
      <main className="flex-1 flex flex-col relative w-full pt-28 md:pt-20 pb-16 bg-surface min-h-screen">
        <CatalogView products={products} searchQuery={searchQuery} />
      </main>
    </>
  );
}
