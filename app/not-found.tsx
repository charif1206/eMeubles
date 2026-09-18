import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen w-full bg-surface flex flex-col items-center justify-center p-6 text-on-surface"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-secondary-fixed/40 flex items-center justify-center mb-5 text-secondary shadow-inner">
          <span className="material-symbols-outlined text-[42px]">search_off</span>
        </div>

        <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-sm mb-3 font-semibold">
          404 • غير موجود
        </span>

        <h1 className="font-headline-md text-2xl font-bold text-on-surface mb-2">
          الصفحة أو المنتج غير متوفر
        </h1>

        <p className="font-body-md text-outline mb-6 text-sm leading-relaxed">
          الصفحة التي تبحث عنها ربما تم نقلها، حذفها، أو الرابط غير صحيح.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/"
            className="flex-1 py-3 px-5 rounded-xl bg-primary text-on-primary font-label-md font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm text-center"
          >
            <span className="material-symbols-outlined text-[18px]">chair</span>
            <span>تصفح الكتالوج</span>
          </Link>

          <Link
            href="/"
            className="flex-1 py-3 px-5 rounded-xl bg-surface-container text-on-surface font-label-md font-medium hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 text-center"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-outline">أروقة دار ديزاين • Arwaqa Dar Design</p>
    </div>
  );
}
