'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-surface min-h-screen flex items-center justify-center p-6 font-sans text-on-surface">
        <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-error-container/30 text-error flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[36px]">error</span>
          </div>
          <h2 className="text-xl font-bold mb-2">عطل غير متوقع في التطبيق</h2>
          <p className="text-sm text-outline mb-6">
            واجه النظام خطأ عاماً. يرجى الضغط أدناه لإعادة تشغيل الواجهة.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 px-6 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-all cursor-pointer"
          >
            إعادة التشغيل
          </button>
        </div>
      </body>
    </html>
  );
}
