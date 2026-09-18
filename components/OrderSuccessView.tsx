'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Order, Product, OrderStatus } from '@prisma/client';

interface OrderSuccessViewProps {
  order: Order & { product: Product };
}

export default function OrderSuccessView({ order }: OrderSuccessViewProps) {
  const [copied, setCopied] = useState(false);

  const copyOrderCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Determine stage active based on order status
  // PENDING -> Step 2 active
  // IN_PRODUCTION or OUT_FOR_DELIVERY -> Step 3 active
  // DELIVERED -> Step 4 active
  const isPending = order.status === OrderStatus.PENDING;
  const isConfirmed = order.status === OrderStatus.CONFIRMED;
  const inDelivery = order.status === OrderStatus.OUT_FOR_DELIVERY || order.status === OrderStatus.IN_PRODUCTION;
  const isDelivered = order.status === OrderStatus.DELIVERED;
  const isCancelled = order.status === OrderStatus.CANCELLED;

  return (
    <div className="flex flex-col w-full max-w-md lg:max-w-5xl mx-auto px-margin-mobile sm:px-6 lg:px-8 py-6 lg:py-10" dir="rtl">
      {/* Toast Notification */}
      {copied && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-xs rounded-full shadow-lg flex items-center gap-space-xs animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[16px] text-secondary-fixed">check_circle</span>
          <span className="font-label-sm text-label-sm">تم نسخ رقم الطلب بنجاح</span>
        </div>
      )}

      {/* Responsive Grid: Vertical Stack on Mobile, 2 Columns Split on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* ===================================================================== */}
        {/* RIGHT COLUMN (lg:col-span-7): Hero Congratulations & Tracking Steps  */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-6 w-full">
          {/* Hero Success Card */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container/60 flex flex-col items-center text-center space-y-space-sm relative overflow-hidden">
            {/* Subtle decorative glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary-fixed/20 pointer-events-none blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-secondary-container/20 pointer-events-none blur-xl"></div>

            {/* Pulsing Warm-Green Checkmark */}
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-secondary-fixed/40 my-space-xs">
              <span className="absolute inset-0 rounded-full bg-secondary/15 animate-ping"></span>
              <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md relative z-10">
                <span className="material-symbols-outlined text-[28px]">done_all</span>
              </div>
            </div>

            {/* Main Acknowledgement Title & Badge */}
            <div className="space-y-space-xs max-w-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                تأكيد فوري ومباشر للطلب
              </span>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile sm:text-2xl text-on-surface pt-1 leading-snug font-bold">
                يعطيك الصحة! الكوموند تاعك تسجلت بنجاح
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                شكراً لثقتكم في ورشات <span className="font-title-md text-primary font-semibold">أروقة دار ديزاين</span> للأثاث الفاخر.
              </p>
            </div>

            {/* Order Reference Pill with Tap-to-Copy Feedback */}
            <button
              className="w-full max-w-sm flex items-center justify-between bg-surface-container-low px-space-md py-space-sm rounded-xl active:scale-95 transition-all text-start group cursor-pointer border border-outline-variant/30 hover:bg-surface-container"
              id="copyOrderBtn"
              onClick={() => copyOrderCode(order.id)}
              type="button"
            >
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-outline">مرجع الطلبية الخاص بك</span>
                <span className="font-title-md text-title-md text-primary font-bold tracking-wide">{order.id}</span>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant bg-surface-container-lowest px-2.5 py-1 rounded-lg shadow-xs group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                <span className="font-label-sm text-label-sm">{copied ? 'منسوخ!' : 'نسخ'}</span>
              </div>
            </button>

            {/* Urgent Warm Notification Callout */}
            <div className="w-full bg-primary-fixed/25 rounded-xl p-space-md flex items-start gap-space-sm text-start border border-primary-fixed/40">
              <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="font-label-md text-label-md text-on-primary-fixed font-semibold">
                  مكالمة هاتفية قصيرة خلال دقائق
                </span>
                <p className="font-body-sm text-body-sm text-on-primary-fixed-variant leading-relaxed">
                  راح يعيطلك التيليفون مورا شوية من ليكيب تاعنا باه يفاليديو معاك المقاسات ووقتاش تخرج الشاحنة لـ {order.wilaya}.
                </p>
                <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 pt-0.5 font-medium">
                  <span className="material-symbols-outlined text-[14px]">vibration</span>
                  من فضلك خلي تيليفونك قريب ليك ومفتوح
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Card (تتبع مسار الطلب خطوة بخطوة) */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container/60 flex flex-col space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">timeline</span>
                <h2 className="font-title-md text-title-md sm:text-lg text-on-surface font-bold">مراحل تتبع طلبيتك</h2>
              </div>
              <span className="font-label-sm text-label-sm text-outline bg-surface-container px-2.5 py-1 rounded-full">تحديث فوري</span>
            </div>

            {/* Vertical Progressive Timeline */}
            <div className="relative flex flex-col space-y-space-md pr-2">
              {/* Step 1: Completed */}
              <div className="flex items-start gap-space-md relative">
                <div className="absolute right-4 top-8 -bottom-4 w-0.5 bg-secondary-fixed-dim"></div>
                <div className="relative z-10 w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">تم تسجيل الطلب</span>
                    <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/40 px-2 py-0.5 rounded-full font-semibold">
                      تم
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-outline">تم تأكيد المعلومات عبر الموقع وحجز القطعة مباشرة</p>
                </div>
              </div>

              {/* Step 2: Active or Completed */}
              <div className="flex items-start gap-space-md relative">
                <div className="absolute right-4 top-8 -bottom-4 w-0.5 bg-surface-container-high"></div>
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                    isConfirmed || inDelivery || isDelivered
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary-container text-on-primary animate-pulse'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isConfirmed || inDelivery || isDelivered ? 'check' : 'call'}
                  </span>
                </div>
                <div className="flex flex-col flex-1 min-w-0 bg-surface-container-low p-space-sm rounded-xl shadow-xs border border-surface-container">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">
                      مكالمة التأكيد وتفاصيل التوصيل
                    </span>
                    <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-semibold bg-primary-fixed/50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                      {isConfirmed ? 'تم التأكيد' : 'قيد الاتصال'}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 leading-snug">
                    فريق خدمة العملاء يتصل برقمك للتحقق من عنوان التوصيل الدقيق والموعد الأنسب.
                  </p>
                </div>
              </div>

              {/* Step 3: Delivery */}
              <div className="flex items-start gap-space-md relative">
                <div className="absolute right-4 top-8 -bottom-4 w-0.5 bg-surface-container-high"></div>
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    inDelivery ? 'bg-primary text-on-primary' : isDelivered ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">شحن الطلبية نحو {order.wilaya}</span>
                  <p className="font-body-sm text-body-sm text-outline">تخرج الشاحنة مع إشعار باليوم والتوقيت المحدد</p>
                </div>
              </div>

              {/* Step 4: Final Handshake */}
              <div className="flex items-start gap-space-md relative">
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isDelivered ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">handshake</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0 opacity-70">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    وصلت السلعة وتم التسليم والدفع
                  </span>
                  <p className="font-body-sm text-body-sm text-outline">تفقد السلعة بنفسك قبل تسليم المبلغ المتبقي</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* LEFT COLUMN (lg:col-span-5): Order Details, Customer Info, & Actions */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 flex flex-col space-y-6 w-full">
          {/* Order Details & Summary Card */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container/60 space-y-space-md">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md sm:text-lg text-on-surface font-bold">تفاصيل الطلبية</span>
              <span className="font-label-sm text-label-sm bg-secondary-container/40 text-on-secondary-container px-2.5 py-1 rounded-full font-semibold">
                الدفع عند الاستلام (COD)
              </span>
            </div>

            {/* Product Item Preview */}
            <div className="flex gap-space-sm items-center bg-surface-container-low p-space-sm rounded-xl border border-surface-container">
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                <img
                  alt={order.product.name}
                  className="w-full h-full object-cover"
                  src={order.product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'}
                />
              </div>
              <div className="flex flex-col flex-1 min-w-0 space-y-0.5">
                <span className="font-label-sm text-label-sm text-outline">{order.product.category}</span>
                <h3 className="font-title-md text-title-md text-on-surface truncate font-semibold">
                  {order.product.name}
                </h3>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">الكمية: 1 قطعة</span>
                  <span className="font-currency-md text-currency-md text-primary font-bold">
                    {order.product.price.toLocaleString('fr-DZ')} دج
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery & Customer Breakdown Specifications */}
            <div className="space-y-space-xs text-body-sm pt-1 divide-y divide-surface-container">
              <div className="flex justify-between items-center py-2">
                <span className="text-outline font-body-sm">المستلم:</span>
                <span className="text-on-surface font-title-md font-semibold">{order.clientName}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-outline font-body-sm">رقم الهاتف:</span>
                <span className="text-on-surface font-title-md font-mono" dir="ltr">
                  {order.phone}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-outline font-body-sm">الولاية والبلدية:</span>
                <span className="text-on-surface font-body-md text-start">{order.wilaya} - {order.commune}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-outline font-body-sm">عنوان التوصيل:</span>
                <span className="text-on-surface font-body-md text-start">{order.address}</span>
              </div>
              {order.note && (
                <div className="flex flex-col py-2 gap-1">
                  <span className="text-outline font-body-sm">ملاحظة للورشة:</span>
                  <span className="text-on-surface font-body-sm italic bg-surface-container-low p-2.5 rounded-lg border border-surface-container">
                    "{order.note}"
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-3 pt-4">
                <span className="font-title-md text-on-surface font-bold">المجموع الإجمالي عند الاستلام:</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">
                  {order.priceTotal.toLocaleString('fr-DZ')} دج
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/"
                className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-title-md text-title-md font-semibold text-center hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
              >
                رجوع للكتالوج الرئيسي
              </Link>
              <a
                href="tel:0555123456"
                className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-medium text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>اتصل بخدمة الزبائن مباشرة</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
