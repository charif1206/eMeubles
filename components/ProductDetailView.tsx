'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@prisma/client';
import { WILAYAS } from '@/lib/wilayas';
import { createOrder } from '@/app/actions/orderActions';

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedWilaya, setSelectedWilaya] = useState(WILAYAS[15]); // Default: 16 - Alger
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Combine images with technical blueprint diagram if not already included
  const blueprintImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB3lFC-VtWX3Den_lPato_sIkBwV3FvqkWPU6lYn0EyRHbakCR68mEChXpWtnacdhhf-KsQoDNaoppo_YK8KNQLCZ115KrU5peFrRFfJfVxSiBwB1igrzQsre_6K4MzWeHT-va8p0TXiY-JWRjT6E0YozY5x4zvHNe2vYs05d1UDQK371Lf_tZ9Eu-pXgtOFCpU5-zG3kesCMuUBd3UM9uNtaYDUqj5hWVBsJTs8i3EtBB99s7WlVE';

  const slides = product.images.length > 0 ? [...product.images] : [blueprintImage];
  if (!slides.includes(blueprintImage)) {
    slides.push(blueprintImage);
  }
  const blueprintIndex = slides.indexOf(blueprintImage);

  // Calculate pricing & discount
  const originalPrice = Math.round(product.price * 1.2 / 1000) * 1000;
  const savings = originalPrice - product.price;
  const deliveryFee = selectedWilaya ? selectedWilaya.deliveryFee : 2500;
  const grandTotal = product.price + deliveryFee;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `اكتشف ${product.name} في متجر أروقة دار ديزاين`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('تم نسخ رابط المنتج بنجاح');
    }
  };

  const scrollToCheckout = () => {
    const el = document.getElementById('checkoutSection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createOrder(formData);
      if (res.error) {
        setFormError(res.error);
        const errEl = document.getElementById('formErrorNotice');
        if (errEl) errEl.scrollIntoView({ behavior: 'smooth' });
      } else if (res.success && res.orderId) {
        router.push(`/order-success/${res.orderId}`);
      }
    });
  };

  return (
    <div className="flex flex-col w-full max-w-md lg:max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 py-2 lg:py-4" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-xs rounded-full shadow-lg flex items-center gap-space-xs animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[16px] text-secondary-fixed">check_circle</span>
          <span className="font-label-sm text-label-sm">{toastMessage}</span>
        </div>
      )}

      {/* Minimal Context Bar & Status Header */}
      <div className="px-margin-mobile lg:px-0 pt-space-xs pb-space-sm flex items-center justify-between gap-space-sm w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-space-xs text-on-surface-variant hover:text-primary transition-colors py-1.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          <span className="font-label-md text-label-md">رجوع للكتالوج</span>
        </Link>
        <div className="flex items-center gap-space-xs">
          <img
            alt="شعار أروقة دار ديزاين"
            className="w-8 h-8 rounded-lg object-contain bg-surface-container-lowest p-0.5 shadow-xs"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VH3vghTFcADuuueH0BsTcOKFD0qtePj9DVMNgQbPNZV3ion7mFY9I7-BQSwOLLVtSUifmLkpwWn0LnUzJgLTwJYBw8Oey_e1QOa961Zsh2Nq_O2jBuGiRfVYAyKB9a8SkYddIyuObSRTnQFHYeGI7lmmEJkNT-P6R3ftlC9RZ0qIVR_V3XACG1OtjXxqQRasYtQFFu3-Ad6dtjjcl07aaGPgJyfe5C8HlQkeg_Hi-kKL-EGewww4_ZCg"
          />
          <button
            aria-label="مشاركة المنتج"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant active:bg-surface-container-high hover:text-primary transition-colors cursor-pointer"
            onClick={handleShare}
            type="button"
          >
            <span className="material-symbols-outlined text-[19px]">share</span>
          </button>
        </div>
      </div>

      {/* Trust Badges Strip */}
      <div className="px-margin-mobile lg:px-0 flex flex-wrap items-center gap-space-xs pb-space-md w-full">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span>متوفر في المخزن (تسليم فوري)</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
          <span>صناعة جزائرية متقونة</span>
        </span>
      </div>

      {/* ========================================================================= */}
      {/* RESPONSIVE LAYOUT (Single column on Mobile, 2 Columns Split on Desktop)  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start w-full">
        {/* ===================================================================== */}
        {/* RIGHT COLUMN (60% / col-span-7): Gallery, Specs, Details, FAQ        */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-y-4 w-full">
          {/* Interactive Gallery Container */}
          <section className="px-margin-mobile lg:px-0 flex flex-col gap-space-sm">
            {/* Main Display Frame */}
            <div className="relative w-full aspect-[4/3] lg:aspect-[16/11] rounded-2xl overflow-hidden bg-surface-container-low shadow-sm border border-surface-container">
              <img
                alt={product.name}
                className={`w-full h-full ${
                  activeSlide === blueprintIndex ? 'object-contain p-4 bg-surface-container-lowest' : 'object-cover'
                } transition-all duration-300`}
                src={slides[activeSlide]}
              />

              {/* Quick Blueprint Badge */}
              {activeSlide === blueprintIndex && (
                <div className="absolute top-3 right-3 items-center gap-1.5 bg-inverse-surface/90 text-inverse-on-surface px-2.5 py-1 rounded-lg font-label-sm text-label-sm shadow-md backdrop-blur-sm flex">
                  <span className="material-symbols-outlined text-[16px] text-primary-fixed">straighten</span>
                  <span>مخطط الأبعاد والمقاسات الدقيقة 📐</span>
                </div>
              )}

              {/* Swipe / Navigation overlay controls */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1 bg-inverse-surface/75 text-inverse-on-surface backdrop-blur-md px-2.5 py-1 rounded-full font-label-sm text-label-sm pointer-events-auto">
                  <span>{activeSlide + 1}</span>/{slides.length}
                </div>
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <button
                    aria-label="الصورة السابقة"
                    className="w-8 h-8 rounded-full bg-surface-container-lowest/90 text-on-surface flex items-center justify-center shadow-md active:scale-95 hover:bg-surface-container-lowest transition-all cursor-pointer"
                    onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                  <button
                    aria-label="الصورة التالية"
                    className="w-8 h-8 rounded-full bg-surface-container-lowest/90 text-on-surface flex items-center justify-center shadow-md active:scale-95 hover:bg-surface-container-lowest transition-all cursor-pointer"
                    onClick={() => setActiveSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnails Carousel Strip */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
              {slides.map((slide, idx) => {
                const isBlueprint = idx === blueprintIndex;
                const isSelected = activeSlide === idx;
                return (
                  <button
                    key={idx}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low shadow-sm active:scale-95 transition-all cursor-pointer ${
                      isSelected ? 'outline-2 outline-primary ring-2 ring-primary/40' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setActiveSlide(idx)}
                    type="button"
                  >
                    <img
                      alt={`مصغرة ${idx + 1}`}
                      className={`w-full h-full ${isBlueprint ? 'object-contain p-1 bg-surface-container-lowest' : 'object-cover'}`}
                      src={slide}
                    />
                    {isBlueprint && (
                      <span className="absolute bottom-0.5 right-0.5 bg-primary text-on-primary font-label-sm text-[9px] px-1 rounded">
                        مخطط
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Title & Pricing Section */}
          <section className="px-margin-mobile lg:px-0 pt-2 pb-space-sm flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline tracking-wide">
                {product.category} • مرجع: {product.slug.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile lg:text-3xl text-on-surface font-bold">
              {product.name}
            </h1>
            {/* Price Tag with COD Reassurance */}
            <div className="flex items-baseline flex-wrap gap-space-sm pt-space-xs">
              <span className="font-display-lg-mobile text-display-lg-mobile lg:text-4xl text-primary font-bold">
                {product.price.toLocaleString('fr-DZ')} دج
              </span>
              <span className="font-body-md text-body-md text-outline line-through">
                {originalPrice.toLocaleString('fr-DZ')} دج
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                توفير {savings.toLocaleString('fr-DZ')} دج
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed pt-2 text-sm sm:text-base">
              {product.description}
            </p>
          </section>

          {/* Micro-specifications Clean 2x2 Grid */}
          <section className="px-margin-mobile lg:px-0 py-space-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
              {/* Box 1 */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl flex flex-col gap-1 shadow-sm border border-surface-container">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[20px]">straighten</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">الأبعاد والمقاسات</span>
                </div>
                <span className="font-body-sm text-body-sm text-outline">{product.dimensions || '220 سم × 90 سم × 85 سم'}</span>
              </div>
              {/* Box 2 */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl flex flex-col gap-1 shadow-sm border border-surface-container">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[20px]">forest</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">نوع الخشب الأصلي</span>
                </div>
                <span className="font-body-sm text-body-sm text-outline">{product.woodType || 'خشب زان Hêtre مجفف'}</span>
              </div>
              {/* Box 3 */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl flex flex-col gap-1 shadow-sm border border-surface-container">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[20px]">chair</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">إسفنج D30 الأصلي</span>
                </div>
                <span className="font-body-sm text-body-sm text-outline">كثافة عالية مع طبقة وادينغ فائقة النعومة</span>
              </div>
              {/* Box 4 */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl flex flex-col gap-1 shadow-sm border border-surface-container">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">الضمان الحقيقي</span>
                </div>
                <span className="font-body-sm text-body-sm text-outline">ضمان 5 سنوات كاملة على الهيكل الداخلي</span>
              </div>
            </div>
          </section>

          {/* Guarantee & Delivery Trust Banner */}
          <section className="px-margin-mobile lg:px-0 py-space-xs">
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm border border-surface-container">
              <div className="flex items-start gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">التوصيل متوفر لـ 58 ولاية</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    الدفع ما يكونش مسبق! حتى يوصلك البكاج لدارك، تحلو وتسيتي صالونك وتتأكد من جودته عاد تسلك الشوفور.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Dimension Preview Card with CTA to switch tab */}
          <section className="px-margin-mobile lg:px-0 py-space-xs">
            <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex items-center justify-between gap-space-sm border border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[24px]">architecture</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">هل المقاسات مناسبة لصالونك؟</span>
                  <span className="font-body-sm text-body-sm text-outline">يمر بسهولة عبر الأبواب والمصاعد</span>
                </div>
              </div>
              <button
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm shrink-0 active:scale-95 transition-all cursor-pointer"
                onClick={() => {
                  setActiveSlide(blueprintIndex);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                type="button"
              >
                شوف المخطط 📐
              </button>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="px-margin-mobile lg:px-0 py-space-sm flex flex-col gap-space-xs">
            <h3 className="font-title-md text-title-md text-on-surface mb-1 font-semibold">أسئلة شائعة قبل الطلب</h3>
            <details className="bg-surface-container-lowest rounded-lg p-space-sm group shadow-sm transition-all border border-surface-container">
              <summary className="flex items-center justify-between cursor-pointer list-none font-label-md text-label-md text-on-surface font-semibold">
                <span>كيفاش تتم عملية الدفع والتأكيد؟</span>
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="font-body-sm text-body-sm text-on-surface-variant pt-2 leading-relaxed">
                بمجرد ما تعمر الفورمولار، يتصل بيك أحد مستشاري "أروقة دار ديزاين" خلال دقائق أو ساعات قليلة للتأكيد والتنسيق. الدفع نقداً بالدينار الجزائري كي يوصلك الصالون لعندك.
              </p>
            </details>
            <details className="bg-surface-container-lowest rounded-lg p-space-sm group shadow-sm transition-all border border-surface-container">
              <summary className="flex items-center justify-between cursor-pointer list-none font-label-md text-label-md text-on-surface font-semibold">
                <span>شحال ياخذ وقت التوصيل لولايتي؟</span>
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="font-body-sm text-body-sm text-on-surface-variant pt-2 leading-relaxed">
                الجزائر وضواحيها: من 24 إلى 48 ساعة. الولايات الشرقية والغربية: 2 إلى 4 أيام. ولايات الجنوب: 4 إلى 6 أيام عمل مع التوصيل حتى باب المنزل.
              </p>
            </details>
            <details className="bg-surface-container-lowest rounded-lg p-space-sm group shadow-sm transition-all border border-surface-container">
              <summary className="flex items-center justify-between cursor-pointer list-none font-label-md text-label-md text-on-surface font-semibold">
                <span>واش ندير إذا ما عجبنيش الصالون كي يوصل؟</span>
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="font-body-sm text-body-sm text-on-surface-variant pt-2 leading-relaxed">
                عندك الحق الكامل تفتح الغلاف وتفحص الصالون مع الشوفور قبل ما تخلص أي دينار. إذا فيه أي عيب أو ما طابقش المواصفات، تقدر ترفض الاستلام مباشرة.
              </p>
            </details>
          </section>
        </div>

        {/* ===================================================================== */}
        {/* LEFT COLUMN (40% / col-span-5): Sticky Fast Checkout Sidebar Form    */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col w-full pb-20 lg:pb-8">
          <section className="px-margin-mobile lg:px-0" id="checkoutSection">
            <div className="bg-surface-container-lowest rounded-2xl p-space-md sm:p-6 shadow-md flex flex-col gap-space-md border border-outline-variant/30">
              {/* Section Header */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[22px]">edit_note</span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">عمّر معلوماتك للطلب السريع</h2>
                  </div>
                  <span className="bg-primary-fixed text-on-primary-fixed font-label-sm text-[11px] px-2 py-0.5 rounded-full font-semibold">
                    COD مريح
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  بدون دفع مسبق أو بطاقة بنكية. أدخل معلوماتك ونتصلو بيك فوراً لتأكيد طلبيتك.
                </p>
              </div>

              {/* Error Notice */}
              {formError && (
                <div
                  id="formErrorNotice"
                  className="p-3 bg-error-container text-on-error-container rounded-xl font-label-md text-label-md flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{formError}</span>
                </div>
              )}

              {/* Form Inputs */}
              <form className="flex flex-col gap-space-sm" onSubmit={handleFormSubmit}>
                <input type="hidden" name="productId" value={product.id} />

                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between" htmlFor="customerName">
                    <span>
                      الاسم واللقب الكامل <span className="text-error">*</span>
                    </span>
                    <span className="text-outline font-label-sm text-[11px]">مطلوب</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute right-3 text-outline text-[20px] pointer-events-none">
                      person
                    </span>
                    <input
                      className="w-full h-12 pr-10 pl-space-md rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest shadow-sm transition-colors border border-transparent focus:border-primary-container"
                      id="customerName"
                      name="clientName"
                      placeholder="مثال: محمد بلقاسم"
                      required
                      type="text"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between" htmlFor="customerPhone">
                    <span>
                      رقم الهاتف <span className="text-error">*</span>
                    </span>
                    <span className="text-outline font-label-sm text-[11px]">مطلوب للتأكيد</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute right-3 text-outline text-[20px] pointer-events-none">
                      call
                    </span>
                    <input
                      className="w-full h-12 pr-10 pl-space-md rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md text-right focus:outline-none focus:bg-surface-container-lowest shadow-sm transition-colors border border-transparent focus:border-primary-container"
                      dir="ltr"
                      id="customerPhone"
                      name="phone"
                      placeholder="05 / 06 / 07 XX XX XX XX"
                      required
                      type="tel"
                    />
                  </div>
                  <span className="font-body-sm text-[11px] text-outline flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[13px] text-secondary">check_circle</span>
                    <span>سنتصل بك هاتفياً لتأكيد تفاصيل التوصيل وموعد الزيارة قبل الإرسال.</span>
                  </span>
                </div>

                {/* Wilaya Selection */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="customerWilaya">
                    الولاية (58 ولاية) <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute right-3 text-outline text-[20px] pointer-events-none">
                      location_on
                    </span>
                    <select
                      className="w-full h-12 pr-10 pl-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest appearance-none shadow-sm transition-colors border border-transparent focus:border-primary-container cursor-pointer"
                      id="customerWilaya"
                      name="wilaya"
                      value={`${selectedWilaya.code} - ${selectedWilaya.nameAr}`}
                      onChange={(e) => {
                        const code = e.target.value.split(' - ')[0];
                        const found = WILAYAS.find((w) => w.code === code);
                        if (found) setSelectedWilaya(found);
                      }}
                      required
                    >
                      {WILAYAS.map((w) => (
                        <option key={w.code} value={`${w.code} - ${w.nameAr}`}>
                          {w.code} - {w.nameAr} ({w.deliveryFee.toLocaleString('fr-DZ')} دج)
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Commune & Street Address */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="customerCommune">
                    البلدية <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute right-3 text-outline text-[20px] pointer-events-none">
                      map
                    </span>
                    <input
                      className="w-full h-12 pr-10 pl-space-md rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest shadow-sm transition-colors border border-transparent focus:border-primary-container"
                      id="customerCommune"
                      name="commune"
                      placeholder="اسم البلدية"
                      required
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="customerAddress">
                    عنوان السكن بالتفصيل <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute right-3 text-outline text-[20px] pointer-events-none">
                      home_pin
                    </span>
                    <input
                      className="w-full h-12 pr-10 pl-space-md rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest shadow-sm transition-colors border border-transparent focus:border-primary-container"
                      id="customerAddress"
                      name="address"
                      placeholder="الحي، رقم العمارة أو الفيلا، الطابق"
                      required
                      type="text"
                    />
                  </div>
                </div>

                {/* Workshop Notes Optional Field */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between" htmlFor="customerNotes">
                    <span>كاش ملاحظة للورشة؟</span>
                    <span className="text-outline font-label-sm text-[11px]">اختياري</span>
                  </label>
                  <textarea
                    className="w-full p-space-sm rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-sm transition-colors resize-none border border-transparent focus:border-primary-container"
                    id="customerNotes"
                    name="note"
                    placeholder="مثال: حبيت لون قماش بيج فاتح، أو توقيت تسليم مفضل بعد الساعة الرابعة..."
                    rows={2}
                  ></textarea>
                </div>

                {/* Mini Order Summary Box */}
                <div className="mt-space-xs bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-2 shadow-sm border border-surface-container">
                  <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                    <span>المنتج: {product.name}</span>
                    <span className="font-semibold text-on-surface">{product.price.toLocaleString('fr-DZ')} دج</span>
                  </div>
                  <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span>مصاريف التوصيل ({selectedWilaya.nameAr}):</span>
                    </span>
                    <span className="font-medium text-secondary">{deliveryFee.toLocaleString('fr-DZ')} دج</span>
                  </div>
                  <div className="h-[1px] w-full bg-outline-variant/30"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-bold">المجموع الإجمالي عند الاستلام:</span>
                    <span className="font-title-md text-title-md text-primary font-bold">{grandTotal.toLocaleString('fr-DZ')} دج</span>
                  </div>
                </div>

                {/* Primary CTA Submit Button */}
                <button
                  className="mt-space-xs w-full h-14 rounded-xl bg-primary text-on-primary font-title-md text-title-md font-bold flex items-center justify-center gap-space-xs shadow-md hover:bg-primary-container active:scale-[0.99] transition-all disabled:opacity-75 cursor-pointer"
                  disabled={isPending}
                  id="submitOrderBtn"
                  type="submit"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                      <span>جاري تسجيل الطلب...</span>
                    </div>
                  ) : (
                    <>
                      <span>أطلب درك وسلك عند الاستلام ({grandTotal.toLocaleString('fr-DZ')} دج)</span>
                      <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile Conversion (Hidden on Tablet and Desktop) */}
      <aside
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-surface/95 backdrop-blur-xl px-margin-mobile py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] border-t border-surface-container"
        id="stickyBottomBar"
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-space-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-title-md text-title-md text-primary font-bold">
                {product.price.toLocaleString('fr-DZ')} دج
              </span>
              <span className="font-label-sm text-[11px] text-outline line-through">
                {originalPrice.toLocaleString('fr-DZ')} دج
              </span>
            </div>
            <span className="font-label-sm text-[11px] text-secondary font-medium flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span>الدفع عند الاستلام (COD)</span>
            </span>
          </div>
          <button
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-title-md text-[15px] font-semibold flex items-center gap-1.5 shadow-md active:bg-primary-container active:scale-95 transition-all cursor-pointer"
            onClick={scrollToCheckout}
            type="button"
          >
            <span>أطلب الآن</span>
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
