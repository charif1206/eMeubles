'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product, ProductStatus } from '@prisma/client';

interface CatalogViewProps {
  products: Product[];
  searchQuery?: string;
}

const CATEGORIES = ['الكل', 'صالون', 'شومبرة نوم', 'طوابل وكراسي', 'ميعن وديكور'];

export default function CatalogView({ products, searchQuery = '' }: CatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'price_asc' | 'price_desc' | 'popular'>('latest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.woodType.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== 'الكل') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by status pill
    if (selectedStatus === 'DISPONIBLE') {
      result = result.filter((p) => p.status === ProductStatus.DISPONIBLE);
    } else if (selectedStatus === 'SUR_COMMANDE') {
      result = result.filter((p) => p.status === ProductStatus.SUR_COMMANDE);
    }

    // Sort
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const sortLabels: Record<string, string> = {
    latest: 'الأحدث',
    price_asc: 'الأقل سعراً',
    price_desc: 'الأعلى سعراً',
    popular: 'الأكثر طلباً',
  };

  return (
    <div className="flex flex-col w-full max-w-md md:max-w-5xl lg:max-w-7xl mx-auto px-0 sm:px-4 lg:px-8" dir="rtl">
      {/* Top Refined Filter Bar */}
      <div className="w-full bg-surface-container-lowest shadow-sm sm:rounded-2xl sm:mt-3 flex flex-col gap-space-sm pt-space-sm pb-space-md sm:p-4 border-b sm:border border-surface-container/60">
        {/* Category Pills: Horizontal Native Scroll on mobile, smooth wrapped flex on desktop */}
        <div className="flex items-center gap-space-xs overflow-x-auto sm:flex-wrap px-margin-mobile sm:px-0 no-scrollbar select-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill flex-shrink-0 h-9 px-space-md rounded-full font-label-md text-label-md transition-all flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm font-semibold'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
                type="button"
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Quick Status & Availability Filter + Sort Bar */}
        <div className="flex items-center justify-between px-margin-mobile sm:px-0 gap-space-sm flex-wrap pt-1">
          <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar">
            {/* Stock Ready Pill */}
            <button
              onClick={() => setSelectedStatus(selectedStatus === 'DISPONIBLE' ? null : 'DISPONIBLE')}
              className={`flex-shrink-0 flex items-center gap-1.5 h-7.5 px-3 rounded-full font-label-sm text-label-sm transition-colors shadow-xs cursor-pointer ${
                selectedStatus === 'DISPONIBLE'
                  ? 'bg-secondary text-on-secondary ring-2 ring-secondary/30 font-semibold'
                  : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'
              }`}
              type="button"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>سلعة واجدة (تسليم فوري)</span>
            </button>

            {/* Made to Order Pill */}
            <button
              onClick={() => setSelectedStatus(selectedStatus === 'SUR_COMMANDE' ? null : 'SUR_COMMANDE')}
              className={`flex-shrink-0 flex items-center gap-1 h-7.5 px-3 rounded-full font-label-sm text-label-sm transition-colors cursor-pointer ${
                selectedStatus === 'SUR_COMMANDE'
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
              type="button"
            >
              <span>خدمة على الطلب</span>
            </button>
          </div>

          {/* Desktop Count & Sort Trigger */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 font-body-sm text-outline">
              <span className="material-symbols-outlined text-[16px] text-primary">chair</span>
              <span>
                معروض: <strong className="text-on-surface font-semibold">{filteredProducts.length} قطعة أثاث</strong>
              </span>
            </div>

            {/* Quick Sort Trigger */}
            <button
              onClick={() => setIsSortOpen(true)}
              className="flex-shrink-0 flex items-center gap-1 text-on-surface-variant hover:text-primary font-label-sm text-label-sm px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border border-transparent hover:border-outline-variant/30"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">swap_vert</span>
              <span>{sortLabels[sortBy]}</span>
            </button>
          </div>
        </div>

        {/* Count Summary & Active Filter Indicator (Mobile Only) */}
        <div className="flex sm:hidden items-center justify-between px-margin-mobile pt-space-xs">
          <span className="font-body-sm text-body-sm text-outline flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-primary">chair</span>
            <span>
              معروض: <strong className="text-on-surface font-semibold">{filteredProducts.length} قطعة أثاث</strong>
            </span>
          </span>
          <span className="font-label-sm text-label-sm text-primary-container bg-primary-fixed px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">verified</span>
            <span>صناعة محلية رفيعة</span>
          </span>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="w-full px-margin-mobile sm:px-0 pt-space-md sm:pt-6 pb-24">
        {filteredProducts.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container">
            <span className="material-symbols-outlined text-outline text-[48px] mb-2">search_off</span>
            <h3 className="font-title-md text-title-md text-on-surface font-bold">ما لقينا حتى قطعة مطابقة</h3>
            <p className="font-body-sm text-outline mt-1 max-w-sm">جرب تبدل كلمات البحث أو تضغط على "الكل" لرؤية جميع الموديلات.</p>
            <button
              onClick={() => {
                setSelectedCategory('الكل');
                setSelectedStatus(null);
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
            >
              عرض كامل الكتالوج
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full">
            {filteredProducts.map((product) => {
              const mainImage = product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc';
              const isAvailable = product.status === ProductStatus.DISPONIBLE;
              const isCustom = product.status === ProductStatus.SUR_COMMANDE;

              return (
                <article
                  key={product.id}
                  className="group relative flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-surface-container/60 hover:border-primary-container/40"
                >
                  <div className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden">
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                      src={mainImage}
                    />
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 z-10">
                      {isAvailable && (
                        <span className="inline-flex items-center gap-1 bg-secondary-container/95 text-on-secondary-container backdrop-blur-xs font-label-sm text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          <span>متوفر</span>
                        </span>
                      )}
                      {isCustom && (
                        <span className="inline-flex items-center gap-1 bg-primary-fixed/95 text-on-primary-fixed-variant backdrop-blur-xs font-label-sm text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          <span>على الطلب</span>
                        </span>
                      )}
                      {!isAvailable && !isCustom && (
                        <span className="inline-flex items-center gap-1 bg-surface-variant text-on-surface-variant backdrop-blur-xs font-label-sm text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                          <span>نفاذ الكمية</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-body-sm text-[11px] sm:text-xs text-outline truncate">{product.woodType}</span>
                      <h3 className="font-title-md text-[13px] sm:text-[15px] leading-snug text-on-surface font-semibold line-clamp-2 min-h-[38px] sm:min-h-[42px]">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-currency-md text-currency-md sm:text-xl text-on-surface font-bold">
                          {product.price.toLocaleString('fr-DZ')}
                        </span>
                        <span className="font-label-sm text-[11px] text-outline font-normal">دج</span>
                      </div>
                      <Link
                        href={`/product/${product.id}`}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-container text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>تفاصيل المنتج</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Sort Drawer / Modal */}
      {isSortOpen && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-end sm:items-center sm:justify-center animate-in fade-in duration-200 p-0 sm:p-4"
          onClick={() => setIsSortOpen(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-space-md sm:p-6 flex flex-col gap-space-md shadow-xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-surface-variant rounded-full mx-auto sm:hidden"></div>
            <div className="flex items-center justify-between">
              <h4 className="font-headline-md text-headline-md text-on-surface font-bold">ترتيب المعروضات</h4>
              <button
                className="w-8 h-8 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-colors cursor-pointer"
                onClick={() => setIsSortOpen(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-1 pb-safe sm:pb-0">
              {[
                { key: 'latest', label: 'الأحدث إطلاقاً' },
                { key: 'price_asc', label: 'السعر: من الأقل إلى الأعلى' },
                { key: 'price_desc', label: 'السعر: من الأعلى إلى الأقل' },
                { key: 'popular', label: 'الأكثر طلباً بالجزائر' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setSortBy(item.key as any);
                    setIsSortOpen(false);
                  }}
                  className={`sort-option w-full py-3 px-space-sm flex items-center justify-between rounded-xl font-label-md text-label-md transition-colors cursor-pointer ${
                    sortBy === item.key
                      ? 'text-primary font-semibold bg-surface-container-low'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  <span>{item.label}</span>
                  {sortBy === item.key && (
                    <span className="material-symbols-outlined text-[20px] text-primary">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
