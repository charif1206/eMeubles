import { getSafeProduct } from '@/lib/data';
import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getSafeProduct(params.id);

  if (!product) return { title: 'المنتج غير موجود | أروقة دار ديزاين' };

  return {
    title: `${product.name} | أروقة دار ديزاين`,
    description: product.description.slice(0, 160),
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getSafeProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex-1 flex flex-col relative w-full pt-4 pb-20 bg-surface min-h-screen">
      <ProductDetailView product={product} />
    </main>
  );
}
