'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log the error to console
    console.error('Unhandled App Error Caught:', error);
  }, [error]);

  return (
    <div
      className="min-h-screen w-full bg-surface flex flex-col items-center justify-center p-6 text-on-surface"
      dir="rtl"
    >
      <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
        {/* Warning Icon Badge */}
        <div className="w-20 h-20 rounded-2xl bg-error-container/30 flex items-center justify-center mb-6 text-error shadow-inner">
          <span className="material-symbols-outlined text-[44px]">warning_amber</span>
        </div>

        <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm mb-3 font-semibold">
          خطأ غير متوقع في النظام
        </span>

        <h1 className="font-headline-md text-2xl font-bold text-on-surface mb-2">
          عذراً، حدث خطأ أثناء تحميل الصفحة
        </h1>

        <p className="font-body-md text-on-surface-variant mb-6 max-w-md text-sm leading-relaxed">
          قد يكون هناك انقطاع مؤقت في الاتصال بقاعدة البيانات أو مشكلة في الخادم. تم تسجيل المشكلة تلقائياً.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full mb-6">
          <button
            onClick={() => reset()}
            className="flex-1 min-w-[140px] py-3 px-5 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>إعادة المحاولة</span>
          </button>

          <Link
            href="/"
            className="flex-1 min-w-[140px] py-3 px-5 rounded-xl bg-surface-container text-on-surface font-label-md font-medium hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        {/* Technical Details Toggle */}
        <div className="w-full pt-4 border-t border-outline-variant/20 text-right">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-outline hover:text-on-surface flex items-center justify-between w-full py-1 cursor-pointer font-mono"
            type="button"
          >
            <span>تفاصيل الخطأ الفني (Debug Info)</span>
            <span className="material-symbols-outlined text-[16px]">
              {showDetails ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {showDetails && (
            <div className="mt-3 p-3.5 rounded-xl bg-surface-container-high text-xs font-mono text-left text-error-container overflow-x-auto max-h-48 border border-outline-variant/30 leading-normal" dir="ltr">
              <p className="font-bold text-error mb-1">{error.name}: {error.message}</p>
              {error.digest && <p className="text-outline text-[11px] mb-2">Digest: {error.digest}</p>}
              {error.stack && (
                <pre className="text-[11px] text-on-surface-variant whitespace-pre-wrap">{error.stack}</pre>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-xs text-outline">أروقة دار ديزاين • Arwaqa Dar Design</p>
    </div>
  );
}
