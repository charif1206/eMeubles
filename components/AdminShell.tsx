'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@prisma/client';
import { logoutAdmin } from '@/app/actions/authActions';

interface AdminShellProps {
  user: {
    username: string;
    role: Role;
  };
  pendingOrdersCount: number;
  children: React.ReactNode;
}

export default function AdminShell({ user, pendingOrdersCount, children }: AdminShellProps) {
  const pathname = usePathname();
  const isAdmin = user.role === Role.ADMIN;
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const navLinks = [
    {
      href: '/admin/dashboard',
      label: 'الرئيسية (Tableau de bord)',
      shortLabel: 'الرئيسية',
      icon: 'grid_view',
      adminOnly: true,
    },
    {
      href: '/admin/orders',
      label: 'إدارة الطلبيات (Commandes)',
      shortLabel: 'الطلبيات',
      icon: 'shopping_bag',
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      adminOnly: false,
    },
    {
      href: '/admin/products',
      label: 'كتالوج السلعة (Produits)',
      shortLabel: 'الكتالوج',
      icon: 'chair',
      adminOnly: true,
    },
  ];

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen" dir="rtl">
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR (lg and up) - Strictly preserved as original            */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex fixed right-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-l border-surface-container">
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 px-space-md flex items-center justify-between border-b border-surface-container">
            <Link href="/" className="flex items-center gap-space-sm hover:opacity-90 transition-opacity">
              <img
                alt="شعار أروقة دار ديزاين"
                className="h-8 w-auto object-contain rounded-sm"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VH3vghTFcADuuueH0BsTcOKFD0qtePj9DVMNgQbPNZV3ion7mFY9I7-BQSwOLLVtSUifmLkpwWn0LnUzJgLTwJYBw8Oey_e1QOa961Zsh2Nq_O2jBuGiRfVYAyKB9a8SkYddIyuObSRTnQFHYeGI7lmmEJkNT-P6R3ftlC9RZ0qIVR_V3XACG1OtjXxqQRasYtQFFu3-Ad6dtjjcl07aaGPgJyfe5C8HlQkeg_Hi-kKL-EGewww4_ZCg"
              />
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface leading-none font-bold">
                  أروقة دار ديزاين
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-xs">
                  لوحة التحكم المركزية
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="p-space-md">
            <div className="font-label-sm text-label-sm text-outline mb-space-sm uppercase tracking-wider px-space-sm">
              التنقل الرئيسي
            </div>
            <nav className="flex flex-col gap-space-xs">
              {navLinks.map((item, idx) => {
                if (item.adminOnly && !isAdmin) return null;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={`${item.href}-${idx}`}
                    href={item.href}
                    className={`flex items-center justify-between px-space-md py-space-sm rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-space-md">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      <span className="font-body-md text-body-md">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`font-label-sm text-label-sm px-space-sm py-space-xs rounded-full font-bold ${
                          isActive
                            ? 'bg-on-primary text-primary-container'
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="p-space-md border-t border-surface-container">
          <div className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                {user.username}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                {isAdmin ? 'أدمين عام • الإدارة' : 'مؤكد طلبيات • Confirmateur'}
              </span>
            </div>
            <form action={logoutAdmin}>
              <button
                className="text-on-surface-variant hover:text-error transition-colors p-1 cursor-pointer"
                title="تسجيل الخروج"
                type="submit"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. TABLET COLLAPSED ICON RAIL (md to lg)                                  */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex lg:hidden fixed right-0 top-0 h-full w-20 bg-surface-container-lowest z-50 flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-l border-surface-container">
        <div className="flex flex-col items-center">
          {/* Brand Icon Header */}
          <div className="h-16 w-full flex items-center justify-center border-b border-surface-container">
            <Link href="/" title="أروقة دار ديزاين" className="hover:opacity-90 transition-opacity">
              <img
                alt="شعار أروقة دار ديزاين"
                className="h-8 w-auto object-contain rounded-sm"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VH3vghTFcADuuueH0BsTcOKFD0qtePj9DVMNgQbPNZV3ion7mFY9I7-BQSwOLLVtSUifmLkpwWn0LnUzJgLTwJYBw8Oey_e1QOa961Zsh2Nq_O2jBuGiRfVYAyKB9a8SkYddIyuObSRTnQFHYeGI7lmmEJkNT-P6R3ftlC9RZ0qIVR_V3XACG1OtjXxqQRasYtQFFu3-Ad6dtjjcl07aaGPgJyfe5C8HlQkeg_Hi-kKL-EGewww4_ZCg"
              />
            </Link>
          </div>

          {/* Icon Navigation */}
          <nav className="flex flex-col items-center gap-3 py-6 px-2 w-full">
            {navLinks.map((item, idx) => {
              if (item.adminOnly && !isAdmin) return null;
              const isActive = pathname === item.href;

              return (
                <div key={`tablet-${item.href}-${idx}`} className="relative group w-full flex justify-center">
                  <Link
                    href={item.href}
                    className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-primary-container text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>

                    {/* Badge Indicator */}
                    {item.badge !== undefined && (
                      <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-surface-container-lowest">
                        {item.badge}
                      </span>
                    )}
                  </Link>

                  {/* Tooltip on Hover */}
                  <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-inverse-surface text-inverse-on-surface text-xs font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    {item.shortLabel}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Tablet User Footer Profile */}
        <div className="p-3 border-t border-surface-container flex flex-col items-center gap-2">
          <div
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary cursor-default"
            title={`${user.username} (${isAdmin ? 'أدمين' : 'مؤكد'})`}
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
          <form action={logoutAdmin}>
            <button
              className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-lg hover:bg-error-container/20 cursor-pointer flex items-center justify-center"
              title="تسجيل الخروج"
              type="submit"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 3. MOBILE SLIDE-OVER DRAWER (Sheet) (< md)                                 */}
      {/* ========================================================================= */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" dir="rtl">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative mr-0 w-80 max-w-[85vw] bg-surface-container-lowest h-full shadow-2xl z-10 flex flex-col justify-between border-l border-surface-container animate-in slide-in-from-right duration-300">
            <div className="flex flex-col">
              {/* Drawer Top Header */}
              <div className="h-16 px-space-md flex items-center justify-between border-b border-surface-container">
                <Link
                  href="/"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center gap-space-sm"
                >
                  <img
                    alt="شعار أروقة دار ديزاين"
                    className="h-8 w-auto object-contain rounded-sm"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1VH3vghTFcADuuueH0BsTcOKFD0qtePj9DVMNgQbPNZV3ion7mFY9I7-BQSwOLLVtSUifmLkpwWn0LnUzJgLTwJYBw8Oey_e1QOa961Zsh2Nq_O2jBuGiRfVYAyKB9a8SkYddIyuObSRTnQFHYeGI7lmmEJkNT-P6R3ftlC9RZ0qIVR_V3XACG1OtjXxqQRasYtQFFu3-Ad6dtjjcl07aaGPgJyfe5C8HlQkeg_Hi-kKL-EGewww4_ZCg"
                  />
                  <div className="flex flex-col">
                    <span className="font-title-md text-title-md text-on-surface font-bold">
                      أروقة دار ديزاين
                    </span>
                    <span className="text-[11px] text-outline">لوحة التحكم</span>
                  </div>
                </Link>

                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-9 h-9 rounded-xl bg-surface-container text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="p-4">
                <div className="font-label-sm text-label-sm text-outline mb-3 uppercase tracking-wider px-2">
                  القائمة الرئيسية
                </div>
                <nav className="flex flex-col gap-1.5">
                  {navLinks.map((item, idx) => {
                    if (item.adminOnly && !isAdmin) return null;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={`mobile-drawer-${item.href}-${idx}`}
                        href={item.href}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                          <span className="font-body-md text-body-md">{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold ${
                              isActive
                                ? 'bg-on-primary text-primary-container'
                                : 'bg-secondary-container text-on-secondary-container'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-6 pt-4 border-t border-surface-container">
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary bg-primary/10 hover:bg-primary/15 transition-colors font-medium text-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">storefront</span>
                    <span>معاينة متجر الزبائن</span>
                    <span className="material-symbols-outlined text-[16px] mr-auto">open_in_new</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Drawer User Footer */}
            <div className="p-4 border-t border-surface-container">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-primary text-[20px]">person</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-semibold text-on-surface truncate text-sm">
                    {user.username}
                  </span>
                  <span className="text-xs text-outline truncate">
                    {isAdmin ? 'أدمين عام' : 'مؤكد طلبيات'}
                  </span>
                </div>
                <form action={logoutAdmin}>
                  <button
                    className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-lg hover:bg-error-container/20 cursor-pointer"
                    title="تسجيل الخروج"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TOP APP BAR (Responsive: right-0 on mobile, right-20 on tablet, right-72 on desktop) */}
      {/* ========================================================================= */}
      <header className="fixed top-0 right-0 md:right-20 lg:right-72 left-0 h-16 bg-surface/90 backdrop-blur-xl z-40 px-4 md:px-space-lg flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
        {/* Right Section: Mobile Hamburger + Brand / Visit Store */}
        <div className="flex items-center gap-2 sm:gap-space-sm">
          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container cursor-pointer flex items-center justify-center"
            aria-label="فتح القائمة الجانبية"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-xs sm:text-label-md transition-colors border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
            <span className="hidden sm:inline">زيارة المتجر للزبائن</span>
            <span className="sm:hidden">المتجر</span>
            <span className="material-symbols-outlined text-[14px] text-outline">open_in_new</span>
          </Link>
        </div>

        {/* Left Section: User Status & Avatar */}
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          <div className="flex items-center gap-2 sm:gap-space-sm">
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                {user.username}
              </span>
              <span className="font-label-sm text-label-sm text-primary-container font-medium">
                {isAdmin ? 'أدمين عام' : 'مؤكد طلبيات'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 5. MAIN CONTENT AREA (Responsive margins & bottom padding)                 */}
      {/* ========================================================================= */}
      <div className="pr-0 md:pr-20 lg:pr-72 transition-all">
        <main className="w-full pt-16 pb-24 md:pb-8 bg-surface min-h-screen">
          {children}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 6. MOBILE BOTTOM NAVIGATION (Quick Tabs for Mobile Only)                  */}
      {/* ========================================================================= */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-lg border-t border-surface-container z-40 flex items-center justify-around px-2 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
        aria-label="شريط التنقل السفلي"
      >
        {navLinks.map((item, idx) => {
          if (item.adminOnly && !isAdmin) return null;
          const isActive = pathname === item.href;

          return (
            <Link
              key={`bottom-nav-${item.href}-${idx}`}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative">
                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'scale-110 text-primary' : ''}`}>
                  {item.icon}
                </span>
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -left-2 min-w-[16px] h-[16px] px-1 bg-secondary-container text-on-secondary-container rounded-full text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.shortLabel}</span>
            </Link>
          );
        })}

        {/* More Tab Button -> Opens Drawer */}
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-1 text-on-surface-variant hover:text-on-surface cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">more_horiz</span>
          <span className="text-[11px] mt-0.5 tracking-tight">المزيد</span>
        </button>
      </nav>
    </div>
  );
}
