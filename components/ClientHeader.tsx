'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function ClientHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    } else {
      params.delete('q');
    }
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe" dir="rtl">
      <div className="max-w-md md:max-w-7xl mx-auto min-h-[7rem] md:min-h-[4.25rem] px-margin-mobile sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between py-space-xs md:py-2.5 gap-2 md:gap-6">
        {/* Mobile top bar: Brand + Admin link */}
        <div className="h-12 md:h-auto flex items-center justify-between gap-gutter-mobile md:gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-space-sm hover:opacity-90 transition-opacity">
            <img
              alt="شعار أروقة دار ديزاين"
              className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-outline-variant/30"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VH3vghTFcADuuueH0BsTcOKFD0qtePj9DVMNgQbPNZV3ion7mFY9I7-BQSwOLLVtSUifmLkpwWn0LnUzJgLTwJYBw8Oey_e1QOa961Zsh2Nq_O2jBuGiRfVYAyKB9a8SkYddIyuObSRTnQFHYeGI7lmmEJkNT-P6R3ftlC9RZ0qIVR_V3XACG1OtjXxqQRasYtQFFu3-Ad6dtjjcl07aaGPgJyfe5C8HlQkeg_Hi-kKL-EGewww4_ZCg"
            />
            <div className="flex flex-col">
              <span className="font-title-md text-title-md md:text-title-lg text-on-surface leading-none font-bold">أروقة دار ديزاين</span>
              <span className="font-label-sm text-label-sm text-outline mt-0.5">Catalog & Meuble</span>
            </div>
          </Link>
          <div className="flex items-center gap-space-xs md:hidden">
            <Link
              href="/admin/login"
              className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-primary font-label-sm text-[11px] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>الإدارة</span>
            </Link>
          </div>
        </div>

        {/* Search input bar */}
        <div className="h-11 md:h-auto flex items-center flex-1 w-full md:max-w-md lg:max-w-xl md:mx-auto">
          <form onSubmit={handleSearch} className="relative w-full flex items-center">
            <span className="material-symbols-outlined absolute right-3 text-outline text-[20px] pointer-events-none">
              search
            </span>
            <input
              className="w-full h-10 pr-10 pl-space-md rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest transition-colors border border-transparent focus:border-primary-container/30"
              placeholder="حوس على صالون، خزانة، طابلة..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  router.push('/');
                }}
                className="absolute left-3 text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </form>
        </div>

        {/* Desktop Admin Link */}
        <div className="hidden md:flex items-center gap-space-xs shrink-0">
          <Link
            href="/admin/login"
            className="px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors flex items-center gap-1.5 border border-transparent hover:border-outline-variant/30 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span>لوحة الإدارة</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
