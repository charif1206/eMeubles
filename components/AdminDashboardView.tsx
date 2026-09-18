'use client';

import { useState, useMemo } from 'react';
import { Order, Product, OrderStatus } from '@prisma/client';
import Link from 'next/link';

type OrderWithProduct = Order & { product: Product };

interface AdminDashboardViewProps {
  orders: OrderWithProduct[];
  productsCount: number;
}

export default function AdminDashboardView({ orders, productsCount }: AdminDashboardViewProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Filter orders by timeRange
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();

    if (timeRange === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoff.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'year') {
      cutoff.setFullYear(now.getFullYear() - 1);
    }

    return orders.filter((o) => new Date(o.createdAt) >= cutoff);
  }, [orders, timeRange]);

  // Key KPI Calculations
  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const confirmedOrders = filteredOrders.filter(
      (o) =>
        o.status === OrderStatus.CONFIRMED ||
        o.status === OrderStatus.IN_PRODUCTION ||
        o.status === OrderStatus.OUT_FOR_DELIVERY ||
        o.status === OrderStatus.DELIVERED
    );
    const deliveredOrders = filteredOrders.filter((o) => o.status === OrderStatus.DELIVERED);
    const cancelledOrders = filteredOrders.filter((o) => o.status === OrderStatus.CANCELLED);

    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.priceTotal, 0);
    const cancellationRate = totalOrders > 0 ? Math.round((cancelledOrders.length / totalOrders) * 100) : 0;

    // Top Wilayas distribution
    const wilayaMap: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const w = o.wilaya.replace(/^[0-9]+\s*-\s*/, '');
      wilayaMap[w] = (wilayaMap[w] || 0) + 1;
    });

    const topWilayas = Object.entries(wilayaMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalOrders,
      confirmedCount: confirmedOrders.length,
      deliveredCount: deliveredOrders.length,
      totalRevenue,
      cancellationRate,
      topWilayas,
    };
  }, [filteredOrders]);

  return (
    <div className="flex flex-col w-full px-3 sm:px-space-md lg:px-space-lg py-space-md space-y-space-md">
      {/* Top Header & Range Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-outline">
          <span className="hover:text-primary transition-colors cursor-pointer">أروقة دار ديزاين</span>
          <span className="material-symbols-outlined text-[16px] rtl:rotate-180">chevron_left</span>
          <span className="text-on-surface font-medium">لوحة الإحصائيات والمبيعات</span>
          <span className="hidden sm:inline bg-surface-container-high text-on-surface-variant px-space-xs py-0.5 rounded text-label-sm font-label-sm mr-2">
            Tableau de Bord & KPIs
          </span>
        </div>

        {/* Time-Range Selector Buttons */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl gap-1 border border-surface-container w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setTimeRange('week')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg font-label-md text-xs sm:text-label-md transition-all cursor-pointer text-center ${
              timeRange === 'week'
                ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            آخر أسبوع (7J)
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg font-label-md text-xs sm:text-label-md transition-all cursor-pointer text-center ${
              timeRange === 'month'
                ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            آخر شهر (30J)
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg font-label-md text-xs sm:text-label-md transition-all cursor-pointer text-center ${
              timeRange === 'year'
                ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            هذا العام
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (4 columns on lg, 2 columns on md/sm, 1 column on xs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-space-md">
        {/* Card 1: Total Revenue */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-outline">إجمالي المداخيل المحققة</span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="font-headline-lg text-headline-lg font-bold text-primary">
              {stats.totalRevenue.toLocaleString('fr-DZ')}
            </span>
            <span className="text-label-md text-outline">دج</span>
          </div>
          <span className="text-label-sm text-secondary flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>الطلبيات المؤكدة وفي مسار التسليم</span>
          </span>
        </div>

        {/* Card 2: Confirmed Orders */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-outline">الطلبيات المؤكدة</span>
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
              {stats.confirmedCount}
            </span>
            <span className="text-label-md text-outline">من أصل {stats.totalOrders}</span>
          </div>
          <span className="text-label-sm text-outline flex items-center gap-1">
            <span>نسبة القبول والمطابقة: {stats.totalOrders > 0 ? Math.round((stats.confirmedCount / stats.totalOrders) * 100) : 0}%</span>
          </span>
        </div>

        {/* Card 3: Cancellation Rate */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-outline">نسبة الإلغاء (Taux d'annulation)</span>
            <div className="w-10 h-10 rounded-xl bg-error-container text-on-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">cancel</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="font-headline-lg text-headline-lg font-bold text-error">
              {stats.cancellationRate}%
            </span>
          </div>
          <span className="text-label-sm text-outline">
            معدل منخفض وممتاز في سوق الأثاث الجزائري
          </span>
        </div>

        {/* Card 4: Catalog Products */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-outline">موديلات الكتالوج النشطة</span>
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">chair</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
              {productsCount}
            </span>
            <span className="text-label-md text-outline">موديلات معروضة</span>
          </div>
          <Link
            href="/admin/products"
            className="text-label-sm text-primary hover:underline flex items-center gap-1 font-medium"
          >
            <span>إدارة الكتالوج</span>
            <span className="material-symbols-outlined text-[14px]">arrow_left</span>
          </Link>
        </div>
      </div>

      {/* Two Columns: Top Wilayas & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* Top Wilayas Card */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col gap-space-sm">
          <div className="flex items-center justify-between border-b border-surface-container pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">map</span>
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                الولايات الأكثر طلباً (Top Wilayas)
              </h3>
            </div>
            <span className="text-label-sm text-outline">حسب النشاط</span>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {stats.topWilayas.length === 0 ? (
              <p className="text-outline text-body-sm text-center py-6">لا توجد بيانات للفترة المحددة</p>
            ) : (
              stats.topWilayas.map(([wilayaName, count], idx) => {
                const percent = Math.round((count / stats.totalOrders) * 100) || 0;
                return (
                  <div key={wilayaName} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-body-sm font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-surface-container text-primary font-bold text-[11px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-on-surface font-semibold">{wilayaName}</span>
                      </span>
                      <span className="text-outline text-label-sm font-mono">
                        {count} طلبية ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col gap-space-sm">
          <div className="flex items-center justify-between border-b border-surface-container pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">history</span>
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                أحدث الطلبيات الواردة
              </h3>
            </div>
            <Link
              href="/admin/orders"
              className="text-label-sm text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              <span>عرض كامل الطلبيات</span>
              <span className="material-symbols-outlined text-[14px]">arrow_left</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-body-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm">
                  <th className="py-2.5 px-3">كود الكوموند</th>
                  <th className="py-2.5 px-3">الزبون</th>
                  <th className="py-2.5 px-3">السلعة</th>
                  <th className="py-2.5 px-3">السعر</th>
                  <th className="py-2.5 px-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-container-low">
                    <td className="py-3 px-3 font-mono font-semibold text-primary">{ord.id}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">{ord.clientName}</span>
                        <span className="text-outline text-[11px]">{ord.wilaya}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 truncate max-w-[150px]">{ord.product.name}</td>
                    <td className="py-3 px-3 font-bold font-mono whitespace-nowrap">
                      {ord.priceTotal.toLocaleString('fr-DZ')} دج
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-label-sm px-2 py-0.5 rounded-full bg-surface-container font-medium">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
