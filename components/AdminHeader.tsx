'use client';

import Link from 'next/link';
import { Role } from '@prisma/client';

interface AdminHeaderProps {
  user: {
    username: string;
    role: Role;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const isAdmin = user.role === Role.ADMIN;

  return (
    <header className="fixed top-0 right-72 left-0 h-16 bg-surface/90 backdrop-blur-xl z-40 px-space-lg flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      <div className="flex items-center gap-space-sm">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors border border-outline-variant/20"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
          <span>زيارة المتجر للزبائن</span>
          <span className="material-symbols-outlined text-[14px] text-outline">open_in_new</span>
        </Link>
      </div>

      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-space-sm">
          <div className="flex flex-col text-left">
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
  );
}
