'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Panel Error:', error);
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-md">
        <div className="w-14 h-14 rounded-xl bg-error-container/30 text-error flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px]">sync_problem</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface mb-1.5">تعذر تحميل بيانات لوحة الإدارة</h2>
        <p className="text-xs text-outline mb-6">
          حدث خطأ أثناء الاتصال بقاعدة البيانات أو معالجة طلبات الإدارة.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>إعادة المحاولة</span>
          </button>
          <Link
            href="/admin/dashboard"
            className="flex-1 py-2.5 px-4 rounded-xl bg-surface-container text-on-surface font-medium text-sm hover:bg-surface-container-high transition-all flex items-center justify-center gap-1.5"
          >
            <span>لوحة التحكم</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
