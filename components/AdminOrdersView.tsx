'use client';

import { useState, useMemo, useTransition } from 'react';
import { Order, Product, OrderStatus } from '@prisma/client';
import { updateOrderStatus, deleteOrder } from '@/app/actions/orderActions';
import * as XLSX from 'xlsx';

type OrderWithProduct = Order & { product: Product };

interface AdminOrdersViewProps {
  initialOrders: OrderWithProduct[];
}

export default function AdminOrdersView({ initialOrders }: AdminOrdersViewProps) {
  const [orders, setOrders] = useState<OrderWithProduct[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'date' | 'price' | 'wilaya'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithProduct | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Sync state if initialOrders updates
  useMemo(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setActionError(null);
    startTransition(async () => {
      try {
        const res = await updateOrderStatus(orderId, newStatus);
        if (res.success && res.order) {
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
          );
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
          }
        } else if (res.error) {
          setActionError(res.error);
        }
      } catch (err: any) {
        setActionError(err?.message || 'حدث خطأ أثناء تحديث حالة الطلبية');
      }
    });
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذه الطلبية نهائياً؟')) return;
    setActionError(null);
    startTransition(async () => {
      try {
        const res = await deleteOrder(orderId);
        if (res.success) {
          setOrders((prev) => prev.filter((o) => o.id !== orderId));
          if (selectedOrder?.id === orderId) {
            setSelectedOrder(null);
          }
        } else if (res.error) {
          setActionError(res.error);
        }
      } catch (err: any) {
        setActionError(err?.message || 'حدث خطأ أثناء حذف الطلبية');
      }
    });
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.clientName.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.wilaya.toLowerCase().includes(q) ||
          o.product.name.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortField === 'price') {
        comparison = b.priceTotal - a.priceTotal;
      } else if (sortField === 'wilaya') {
        comparison = a.wilaya.localeCompare(b.wilaya, 'ar');
      }
      return sortAsc ? -comparison : comparison;
    });

    return result;
  }, [orders, searchQuery, statusFilter, sortField, sortAsc]);

  // Export to Excel using xlsx
  const exportToExcel = () => {
    const dataToExport = filteredOrders.map((o) => ({
      'كود الطلب': o.id,
      'اسم الزبون': o.clientName,
      'الهاتف': o.phone,
      'الولاية': o.wilaya,
      'البلدية': o.commune,
      'العنوان الكامل': o.address,
      'السلعة المطلوبة': o.product.name,
      'السعر الإجمالي (دج)': o.priceTotal,
      'الحالة': getStatusLabel(o.status),
      'ملاحظات الورشة': o.note || 'لا يوجد',
      'تاريخ الطلب': new Date(o.createdAt).toLocaleString('fr-DZ'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'الطلبيات');

    // Auto-fit column width
    const max_width = dataToExport.reduce((w, r) => Math.max(w, r['اسم الزبون'].length), 10);
    worksheet['!cols'] = [{ wch: 18 }, { wch: max_width + 4 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 30 }, { wch: 25 }, { wch: 16 }, { wch: 18 }, { wch: 25 }, { wch: 20 }];

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `طلبيات_أروقة_دار_ديزاين_${today}.xlsx`);
  };

  function getStatusLabel(status: OrderStatus) {
    switch (status) {
      case OrderStatus.PENDING:
        return 'قيد الانتظار (En attente)';
      case OrderStatus.CONFIRMED:
        return 'مقبولة (Confirmée)';
      case OrderStatus.IN_PRODUCTION:
        return 'في الورشة (En fabrication)';
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'خرجت للتوصيل (En livraison)';
      case OrderStatus.DELIVERED:
        return 'تم التسليم (Livrée)';
      case OrderStatus.CANCELLED:
        return 'ملغية (Annulée)';
      default:
        return status;
    }
  }

  function getStatusBadge(status: OrderStatus) {
    switch (status) {
      case OrderStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span>قيد الانتظار / En attente</span>
          </span>
        );
      case OrderStatus.CONFIRMED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>مقبولة / Confirmée</span>
          </span>
        );
      case OrderStatus.IN_PRODUCTION:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span>في الورشة / En fabrication</span>
          </span>
        );
      case OrderStatus.OUT_FOR_DELIVERY:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed-dim text-on-primary-fixed text-label-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>خرجت للتوصيل / En livraison</span>
          </span>
        );
      case OrderStatus.DELIVERED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>تم التسليم / Livrée</span>
          </span>
        );
      case OrderStatus.CANCELLED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-label-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            <span>ملغية / Annulée</span>
          </span>
        );
    }
  }

  // Count of today's orders
  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return orders.filter((o) => new Date(o.createdAt).toDateString() === today).length;
  }, [orders]);

  return (
    <div className="flex flex-col w-full px-3 sm:px-space-md lg:px-space-lg py-space-md space-y-space-md">
      {/* Toast Notification for Copy */}
      {copiedId && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-xs rounded-full shadow-lg flex items-center gap-space-xs animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[16px] text-secondary-fixed">check_circle</span>
          <span className="font-label-sm text-label-sm">تم نسخ كود الطلبية ({copiedId})</span>
        </div>
      )}

      {/* Action Error Alert */}
      {actionError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-error-container text-on-error-container px-space-md py-2.5 rounded-2xl shadow-xl flex items-center gap-space-xs animate-in fade-in duration-200 border border-error/20 max-w-lg">
          <span className="material-symbols-outlined text-[20px] text-error flex-shrink-0">error</span>
          <span className="font-label-sm text-label-sm font-medium">{actionError}</span>
          <button
            onClick={() => setActionError(null)}
            className="mr-2 p-1 rounded-lg hover:bg-error/10 text-on-error-container flex items-center justify-center cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Breadcrumb & Top Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-outline">
          <span className="hover:text-primary transition-colors cursor-pointer">أروقة دار ديزاين</span>
          <span className="material-symbols-outlined text-[16px] rtl:rotate-180">chevron_left</span>
          <span className="text-on-surface font-medium">إدارة الطلبيات والمبيعات</span>
          <span className="hidden sm:inline bg-surface-container-high text-on-surface-variant px-space-xs py-0.5 rounded text-label-sm font-label-sm mr-2">
            Suivi des Ventes
          </span>
        </div>

        {/* Quick Stats Ticker */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-space-md w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-xl shadow-sm text-label-md font-label-md text-on-surface border border-surface-container">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="text-outline">طلبيات مسجلة:</span>
            <span className="font-semibold text-primary">{orders.length} طلبية</span>
          </div>

          {/* Excel Export Action Button */}
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 bg-secondary text-on-secondary px-3.5 py-1.5 rounded-xl text-label-md font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span className="hidden sm:inline">تنزيل إكسل .xlsx</span>
            <span className="sm:hidden">إكسل</span>
          </button>
        </div>
      </div>

      {/* Top Controls Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-3 sm:p-space-md shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md border border-surface-container">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <div className="flex items-center bg-surface-container-low rounded-xl px-space-md py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary-container">
            <span className="material-symbols-outlined text-outline text-[20px] ml-space-sm">search</span>
            <input
              className="w-full bg-transparent border-0 outline-none text-body-md font-body-md text-on-surface placeholder:text-outline"
              id="orderSearchInput"
              placeholder="حوس على الكوموند، الزبون، ولا نيميرو تيليفون..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="text-outline hover:text-on-surface p-0.5 rounded cursor-pointer"
                onClick={() => setSearchQuery('')}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters & Sorting Group */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-space-sm">
          {/* Status Filter */}
          <div className="relative flex-1 sm:flex-initial min-w-[150px]">
            <select
              className="w-full appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md rounded-xl px-space-md py-2.5 pr-8 pl-10 cursor-pointer outline-none transition-colors hover:bg-surface-container"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">كامل الحالات (Tous les statuts)</option>
              <option value="PENDING">مازالت جديدة (En attente)</option>
              <option value="CONFIRMED">مفالدية (Confirmée)</option>
              <option value="IN_PRODUCTION">في الورشة (En fabrication)</option>
              <option value="OUT_FOR_DELIVERY">خرجت للتوصيل (En livraison)</option>
              <option value="DELIVERED">تم التسليم (Livrée)</option>
              <option value="CANCELLED">ملغية (Annulée)</option>
            </select>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
              tune
            </span>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Sort Criteria */}
          <div className="relative flex-1 sm:flex-initial min-w-[150px]">
            <select
              className="w-full appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md rounded-xl px-space-md py-2.5 pr-8 pl-9 cursor-pointer outline-none transition-colors hover:bg-surface-container"
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
            >
              <option value="date">ترتيب حسب التاريخ</option>
              <option value="price">ترتيب حسب السعر (Prix)</option>
              <option value="wilaya">ترتيب حسب الولاية (Wilaya)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
              sort
            </span>
          </div>

          {/* Order Direction Pill Toggle */}
          <button
            className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface px-space-md py-2.5 rounded-xl font-label-md text-label-md transition-colors cursor-pointer"
            onClick={() => setSortAsc(!sortAsc)}
            title="تبديل اتجاه الترتيب"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">
              {sortAsc ? 'arrow_upward' : 'arrow_downward'}
            </span>
            <span>{sortAsc ? 'تصاعدي' : 'تنازلي'}</span>
          </button>

          {/* Total Count Badge */}
          <div className="bg-primary-container/10 px-3 py-2 rounded-xl flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary-container text-[18px]">inventory_2</span>
            <span className="text-on-surface font-body-sm text-body-sm hidden sm:inline">المعروض:</span>
            <span className="font-title-md text-title-md font-bold text-primary-container">
              {filteredOrders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Orders Data Table Container */}
      <div className="hidden lg:block bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-md text-label-md">
                <th className="py-3.5 px-space-md font-semibold">كود الكوموند</th>
                <th className="py-3.5 px-space-md font-semibold">معلومات الزبون والولاية</th>
                <th className="py-3.5 px-space-md font-semibold">السلعة والكمية</th>
                <th className="py-3.5 px-space-md font-semibold">السعر الإجمالي</th>
                <th className="py-3.5 px-space-md font-semibold">التاريخ والوقت</th>
                <th className="py-3.5 px-space-md font-semibold">الحالة (Statut)</th>
                <th className="py-3.5 px-space-md font-semibold text-center">الإجراءات السريعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-body-md font-body-md text-on-surface">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-outline">
                    لا توجد طلبيات تطابق معايير البحث والفلترة.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const initialChar = order.clientName.trim().charAt(0) || 'ز';
                  const dateFormatted = new Date(order.createdAt).toLocaleDateString('ar-DZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });
                  const timeFormatted = new Date(order.createdAt).toLocaleTimeString('ar-DZ', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* Order Code */}
                      <td className="py-4 px-space-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 font-mono text-body-sm font-semibold text-primary">
                          <span>{order.id}</span>
                          <button
                            className="text-outline hover:text-on-surface transition-colors p-1 cursor-pointer"
                            onClick={() => copyCode(order.id)}
                            title="نسخ رقم الكوموند"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          </button>
                        </div>
                      </td>

                      {/* Client Info */}
                      <td className="py-4 px-space-md">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-9 h-9 rounded-full bg-surface-container-high text-primary font-bold flex items-center justify-center shrink-0 text-title-md">
                            {initialChar}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-on-surface truncate">{order.clientName}</span>
                            <div className="flex items-center gap-1.5 text-body-sm text-outline">
                              <span className="font-mono" dir="ltr">
                                {order.phone}
                              </span>
                              <span>•</span>
                              <span className="text-primary-container font-medium">{order.wilaya}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Item & Quantity */}
                      <td className="py-4 px-space-md">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[210px] text-on-surface font-medium" title={order.product.name}>
                            {order.product.name}
                          </span>
                          <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                            x1
                          </span>
                        </div>
                        <span className="text-label-sm text-outline block mt-0.5">
                          {order.product.woodType}
                        </span>
                      </td>

                      {/* Total Price */}
                      <td className="py-4 px-space-md whitespace-nowrap">
                        <span className="font-currency-md text-currency-md font-bold text-primary">
                          {order.priceTotal.toLocaleString('fr-DZ')}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline mr-1">دج</span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-space-md whitespace-nowrap">
                        <div className="flex flex-col text-body-sm font-body-sm">
                          <span className="text-on-surface font-medium">{dateFormatted}</span>
                          <span className="text-outline text-label-sm">{timeFormatted}</span>
                        </div>
                      </td>

                      {/* Order Status Select Dropdown */}
                      <td className="py-4 px-space-md whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <select
                            className="bg-surface-container-low text-on-surface font-label-sm text-label-sm rounded-lg px-2.5 py-1 cursor-pointer outline-none border border-surface-container hover:bg-surface-container transition-colors"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          >
                            <option value="PENDING">قيد الانتظار / En attente</option>
                            <option value="CONFIRMED">مقبولة / Confirmée</option>
                            <option value="IN_PRODUCTION">في الورشة / En fabrication</option>
                            <option value="OUT_FOR_DELIVERY">خرجت للتوصيل / En livraison</option>
                            <option value="DELIVERED">تم التسليم / Livrée</option>
                            <option value="CANCELLED">ملغية / Annulée</option>
                          </select>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-space-md text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface text-label-sm font-medium transition-colors cursor-pointer"
                            onClick={() => setSelectedOrder(order)}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span>تفاصيل</span>
                          </button>
                          <button
                            className="p-1.5 rounded-xl hover:bg-error-container text-outline hover:text-error transition-colors cursor-pointer"
                            onClick={() => handleDelete(order.id)}
                            title="حذف الطلبية"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-surface-container-low px-space-md py-3 flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-surface-container">
          <div className="text-body-sm font-body-sm text-outline">
            إظهار <span className="font-semibold text-on-surface">{filteredOrders.length}</span> من إجمالي{' '}
            <span className="font-semibold text-on-surface">{orders.length}</span> كوموند مسجلة
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET STACKED CARDS (< lg)                                      */}
      {/* ========================================================================= */}
      <div className="block lg:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container text-center text-outline">
            لا توجد طلبيات تطابق معايير البحث والفلترة.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const initialChar = order.clientName.trim().charAt(0) || 'ز';
            const dateFormatted = new Date(order.createdAt).toLocaleDateString('ar-DZ', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const timeFormatted = new Date(order.createdAt).toLocaleTimeString('ar-DZ', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <article
                key={`mobile-order-card-${order.id}`}
                className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container shadow-xs flex flex-col gap-3 transition-shadow hover:shadow-md"
              >
                {/* 1. Header: Order ID & Status Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-surface-container pb-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-primary">
                    <span>{order.id}</span>
                    <button
                      className="text-outline hover:text-on-surface p-1 rounded transition-colors cursor-pointer"
                      onClick={() => copyCode(order.id)}
                      title="نسخ رقم الكوموند"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* 2. Client Info with Direct Click-to-Call Link */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary font-bold flex items-center justify-center shrink-0 text-base">
                      {initialChar}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-on-surface text-base truncate">{order.clientName}</span>
                      <span className="text-xs text-outline">{order.wilaya} • {order.commune}</span>
                      <span className="text-[11px] text-outline truncate max-w-[190px]">{order.address}</span>
                    </div>
                  </div>

                  {/* Direct Dial tel: Button */}
                  <a
                    href={`tel:${order.phone}`}
                    className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-xl font-bold text-xs hover:opacity-90 shrink-0 transition-opacity active:scale-95"
                    title="اتصال مباشر بالزبون"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span dir="ltr">{order.phone}</span>
                  </a>
                </div>

                {/* 3. Product Details & Total Price */}
                <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      className="w-12 h-12 rounded-lg object-cover bg-surface-container shrink-0"
                      src={order.product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'}
                      alt={order.product.name}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-on-surface truncate">{order.product.name}</span>
                      <span className="text-[11px] text-outline truncate">{order.product.woodType}</span>
                      <span className="text-[11px] text-outline">{dateFormatted} - {timeFormatted}</span>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="text-xs text-outline block">الإجمالي:</span>
                    <span className="font-bold font-mono text-base text-primary whitespace-nowrap">
                      {order.priceTotal.toLocaleString('fr-DZ')} <span className="text-xs font-normal">دج</span>
                    </span>
                  </div>
                </div>

                {/* Special Note (if any) */}
                {order.note && (
                  <div className="bg-primary-fixed/15 px-3 py-2 rounded-xl flex items-start gap-2 text-xs text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">sticky_note_2</span>
                    <span className="italic leading-relaxed">"{order.note}"</span>
                  </div>
                )}

                {/* 4. Action Controls Bar (Quick status, Details, Delete) */}
                <div className="pt-1 flex flex-wrap items-center gap-2 border-t border-surface-container">
                  <div className="flex-1 min-w-[130px]">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="w-full bg-surface-container text-on-surface font-semibold text-xs rounded-xl px-2.5 py-2 cursor-pointer outline-none border border-surface-container-high"
                    >
                      <option value="PENDING">قيد الانتظار</option>
                      <option value="CONFIRMED">مقبولة / Confirmée</option>
                      <option value="IN_PRODUCTION">في الورشة</option>
                      <option value="OUT_FOR_DELIVERY">خرجت للتوصيل</option>
                      <option value="DELIVERED">تم التسليم</option>
                      <option value="CANCELLED">ملغية</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-primary-container text-on-primary font-bold text-xs hover:bg-primary transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>التفاصيل</span>
                  </button>

                  <button
                    onClick={() => handleDelete(order.id)}
                    className="p-2 rounded-xl bg-surface-container text-outline hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                    title="حذف الطلبية"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </article>
            );
          })
        )}

        {/* Mobile Counter Footer */}
        <div className="text-center text-xs text-outline py-2">
          إظهار <strong className="text-on-surface">{filteredOrders.length}</strong> من إجمالي{' '}
          <strong className="text-on-surface">{orders.length}</strong> كوموند مسجلة
        </div>
      </div>

      {/* Interactive Order Details Modal Overlay */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-space-lg py-4 bg-surface-container-low flex items-center justify-between border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">assignment</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      تفاصيل الكوموند
                    </h3>
                    <span className="bg-surface-container-high font-mono text-primary font-bold text-label-sm px-2.5 py-0.5 rounded-full">
                      Réf: {selectedOrder.id}
                    </span>
                  </div>
                  <p className="text-body-sm font-body-sm text-outline">
                    Détails et validation de la commande client
                  </p>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(null)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-space-lg space-y-space-md overflow-y-auto">
              {/* Client Details & Location Card */}
              <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm border border-surface-container">
                <div className="flex items-center justify-between border-b-0 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">person_pin_circle</span>
                    <h4 className="font-title-md text-title-md font-semibold text-on-surface">
                      معلومات الزبون والشحن
                    </h4>
                  </div>
                  <a
                    className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-xl text-label-md font-semibold hover:opacity-90 transition-opacity"
                    href={`tel:${selectedOrder.phone}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span dir="ltr">{selectedOrder.phone}</span>
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-body-md font-body-md">
                  <div>
                    <span className="text-outline text-body-sm block">اسم الزبون الكامل:</span>
                    <span className="font-semibold text-on-surface">{selectedOrder.clientName}</span>
                  </div>
                  <div>
                    <span className="text-outline text-body-sm block">الولاية والبلدية:</span>
                    <span className="font-semibold text-on-surface">
                      {selectedOrder.wilaya} - {selectedOrder.commune}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-outline text-body-sm block">عنوان التوصيل الدقيق:</span>
                    <span className="text-on-surface">{selectedOrder.address}</span>
                  </div>
                </div>

                {/* Special Note Callout */}
                {selectedOrder.note && (
                  <div className="bg-primary-fixed/20 p-space-sm rounded-lg flex items-start gap-2 text-body-sm font-body-sm">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                      sticky_note_2
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface">ملاحظة الزبون الخاصة:</span>
                      <span className="text-on-surface-variant italic">"{selectedOrder.note}"</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ordered Articles Section */}
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between px-1">
                  <h4 className="font-title-md text-title-md font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">chair</span>
                    <span>السلعة المطلوبة (Articles Commandés)</span>
                  </h4>
                  <span className="text-label-sm text-outline">1 قطعة مختارة</span>
                </div>
                <div className="bg-surface-container rounded-xl overflow-hidden border border-surface-container">
                  <div className="grid grid-cols-12 px-space-md py-2 text-label-md font-label-md text-outline font-semibold">
                    <div className="col-span-8">المنتج والمواصفات</div>
                    <div className="col-span-2 text-center">الكمية</div>
                    <div className="col-span-2 text-left">السعر</div>
                  </div>
                  {/* Item Row */}
                  <div className="grid grid-cols-12 items-center px-space-md py-3 bg-surface-container-lowest">
                    <div className="col-span-8 flex items-center gap-3">
                      <img
                        className="w-12 h-12 rounded-lg object-cover bg-surface-container shrink-0"
                        src={selectedOrder.product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'}
                        alt={selectedOrder.product.name}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-body-md text-on-surface truncate">
                          {selectedOrder.product.name}
                        </span>
                        <span className="text-label-sm text-outline">
                          {selectedOrder.product.woodType}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold">
                        x1
                      </span>
                    </div>
                    <div className="col-span-2 text-left font-currency-md text-currency-md font-bold text-on-surface">
                      {selectedOrder.product.price.toLocaleString('fr-DZ')} دج
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Bar inside Modal */}
              <div className="bg-surface-container-low p-space-md rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-space-md text-center sm:text-right border border-surface-container">
                <div>
                  <span className="text-label-sm font-label-sm text-outline block">السعر الإجمالي (Total):</span>
                  <span className="font-headline-md text-headline-md font-bold text-primary">
                    {selectedOrder.priceTotal.toLocaleString('fr-DZ')} دج
                  </span>
                </div>
                <div>
                  <span className="text-label-sm font-label-sm text-outline block">تاريخ الطلب:</span>
                  <span className="font-body-md text-body-md font-semibold text-on-surface">
                    {new Date(selectedOrder.createdAt).toLocaleString('ar-DZ')}
                  </span>
                </div>
                <div>
                  <span className="text-label-sm font-label-sm text-outline block mb-1">الحالة الحالية:</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="px-space-lg py-3.5 bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm border-t border-surface-container">
              <button
                className="px-space-lg py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(null)}
                type="button"
              >
                غلق (Fermer)
              </button>
              <div className="flex items-center gap-space-sm">
                {selectedOrder.status !== OrderStatus.CANCELLED && (
                  <button
                    className="px-space-md py-2.5 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md font-semibold hover:bg-error hover:text-on-error transition-colors flex items-center gap-1.5 cursor-pointer"
                    onClick={() => handleStatusChange(selectedOrder.id, OrderStatus.CANCELLED)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    <span>إلغاء الطلبية</span>
                  </button>
                )}
                {selectedOrder.status !== OrderStatus.IN_PRODUCTION && (
                  <button
                    className="px-space-md py-2.5 rounded-xl bg-tertiary text-on-tertiary font-label-md text-label-md font-semibold hover:bg-tertiary-container transition-colors flex items-center gap-1.5 cursor-pointer"
                    onClick={() => handleStatusChange(selectedOrder.id, OrderStatus.IN_PRODUCTION)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">build</span>
                    <span>إرسال للورشة</span>
                  </button>
                )}
                {selectedOrder.status !== OrderStatus.CONFIRMED && (
                  <button
                    className="px-space-lg py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold hover:bg-on-secondary-container transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
                    onClick={() => handleStatusChange(selectedOrder.id, OrderStatus.CONFIRMED)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span>فاليدي الكوموند (Accepter la commande)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
