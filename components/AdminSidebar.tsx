'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@prisma/client';
import { logoutAdmin } from '@/app/actions/authActions';

interface AdminSidebarProps {
  user: {
    username: string;
    role: Role;
  };
  pendingOrdersCount: number;
}

export default function AdminSidebar({ user, pendingOrdersCount }: AdminSidebarProps) {
  const pathname = usePathname();
  const isAdmin = user.role === Role.ADMIN;

  const navLinks = [
    {
      href: "/admin/dashboard",
      label: "الرئيسية (Tableau de bord)",
      icon: "grid_view",
      adminOnly: true,
    },
    {
      href: "/admin/orders",
      label: "إدارة الطلبيات (Commandes)",
      icon: "shopping_bag",
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      adminOnly: false,
    },
    {
      href: "/admin/products",
      label: "كتالوج السلعة (Produits)",
      icon: "chair",
      adminOnly: true,
    },
  ];

  return (
    <aside className="fixed right-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-l border-surface-container">
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
              // Avoid duplicate key if dashboard is listed twice
              const isActive = pathname === item.href && (idx !== 3 || pathname === '/admin/dashboard');

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
              className="text-on-surface-variant hover:text-error transition-colors p-1"
              title="تسجيل الخروج"
              type="submit"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
