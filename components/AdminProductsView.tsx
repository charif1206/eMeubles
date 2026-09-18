'use client';

import { useState, useTransition } from 'react';
import { Product, ProductStatus } from '@prisma/client';
import { createProduct, updateProduct, deleteProduct, toggleProductStatus } from '@/app/actions/productActions';

interface AdminProductsViewProps {
  initialProducts: Product[];
}

export default function AdminProductsView({ initialProducts }: AdminProductsViewProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ message: string; isError: boolean } | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (productId: string, status: ProductStatus) => {
    setActionNotice(null);
    startTransition(async () => {
      try {
        const res = await toggleProductStatus(productId, status);
        if (res.success && res.product) {
          setProducts((prev) =>
            prev.map((p) => (p.id === productId ? res.product : p))
          );
          setActionNotice({ message: 'تم تحديث حالة المنتج بنجاح', isError: false });
        } else if (res.error) {
          setActionNotice({ message: res.error, isError: true });
        }
      } catch (err: any) {
        setActionNotice({ message: err?.message || 'حدث خطأ أثناء تغيير الحالة', isError: true });
      }
    });
  };

  const handleDelete = async (productId: string) => {
    setActionNotice(null);
    startTransition(async () => {
      try {
        const res = await deleteProduct(productId);
        if (res.success) {
          setProducts((prev) => prev.filter((p) => p.id !== productId));
          setDeleteConfirmId(null);
          setActionNotice({ message: 'تم حذف المنتج بنجاح', isError: false });
        } else if (res.error) {
          setActionNotice({ message: res.error, isError: true });
          setDeleteConfirmId(null);
        }
      } catch (err: any) {
        setActionNotice({ message: err?.message || 'حدث خطأ أثناء حذف المنتج', isError: true });
        setDeleteConfirmId(null);
      }
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      if (editingProduct) {
        formData.append('id', editingProduct.id);
        const res = await updateProduct(formData);
        if (res.error) {
          setErrorMessage(res.error);
        } else if (res.success && res.product) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? res.product : p))
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await createProduct(formData);
        if (res.error) {
          setErrorMessage(res.error);
        } else if (res.success && res.product) {
          setProducts((prev) => [res.product, ...prev]);
          setIsModalOpen(false);
        }
      }
    });
  };

  return (
    <div className="flex flex-col w-full px-3 sm:px-space-md lg:px-space-lg py-space-md space-y-space-md">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-space-md py-2.5 rounded-2xl shadow-xl flex items-center gap-space-xs animate-in fade-in duration-200 border max-w-lg ${
            actionNotice.isError
              ? 'bg-error-container text-on-error-container border-error/20'
              : 'bg-inverse-surface text-inverse-on-surface border-surface-variant'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[20px] flex-shrink-0 ${
              actionNotice.isError ? 'text-error' : 'text-secondary-fixed'
            }`}
          >
            {actionNotice.isError ? 'error' : 'check_circle'}
          </span>
          <span className="font-label-sm text-label-sm font-medium">{actionNotice.message}</span>
          <button
            onClick={() => setActionNotice(null)}
            className="mr-2 p-1 rounded-lg hover:bg-black/10 flex items-center justify-center cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Top Title & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-outline">
          <span className="hover:text-primary transition-colors cursor-pointer">أروقة دار ديزاين</span>
          <span className="material-symbols-outlined text-[16px] rtl:rotate-180">chevron_left</span>
          <span className="text-on-surface font-medium">كتالوج السلعة والمعروضات</span>
          <span className="hidden sm:inline bg-surface-container-high text-on-surface-variant px-space-xs py-0.5 rounded text-label-sm font-label-sm mr-2">
            Gestion des Produits
          </span>
        </div>

        {/* Desktop Add Button */}
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-xl text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP PRODUCTS TABLE (Strictly preserved for lg+)                       */}
      {/* ========================================================================= */}
      <div className="hidden lg:block bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-md text-label-md">
                <th className="py-3.5 px-space-md font-semibold">الصورة والاسم</th>
                <th className="py-3.5 px-space-md font-semibold">الصنف</th>
                <th className="py-3.5 px-space-md font-semibold">السعر</th>
                <th className="py-3.5 px-space-md font-semibold">نوع الخشب والأبعاد</th>
                <th className="py-3.5 px-space-md font-semibold">الحالة</th>
                <th className="py-3.5 px-space-md font-semibold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-body-md font-body-md text-on-surface">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                  {/* Image & Title */}
                  <td className="py-4 px-space-md">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-14 h-14 rounded-lg object-cover bg-surface-container shrink-0"
                        src={product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'}
                        alt={product.name}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-body-md text-on-surface truncate">
                          {product.name}
                        </span>
                        <span className="font-mono text-outline text-label-sm">{product.slug}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-space-md">
                    <span className="bg-surface-container-high px-2.5 py-1 rounded-full text-label-sm font-medium text-on-surface">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-space-md whitespace-nowrap">
                    <span className="font-currency-md text-currency-md font-bold text-primary">
                      {product.price.toLocaleString('fr-DZ')} دج
                    </span>
                  </td>

                  {/* Wood & Dimensions */}
                  <td className="py-4 px-space-md">
                    <div className="flex flex-col">
                      <span className="text-body-sm text-on-surface font-medium">{product.woodType}</span>
                      <span className="text-label-sm text-outline">{product.dimensions}</span>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-4 px-space-md whitespace-nowrap">
                    <select
                      value={product.status}
                      onChange={(e) => handleStatusChange(product.id, e.target.value as ProductStatus)}
                      className="bg-surface-container-low text-on-surface font-label-sm text-label-sm rounded-lg px-2.5 py-1 cursor-pointer outline-none border border-surface-container"
                    >
                      <option value="DISPONIBLE">متوفر (تسليم فوري)</option>
                      <option value="SUR_COMMANDE">خدمة على الطلب</option>
                      <option value="OUT_OF_STOCK">نفاذ الكمية</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-space-md text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 rounded-xl hover:bg-surface-container text-primary transition-colors cursor-pointer"
                        title="تعديل المنتج"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="p-1.5 rounded-xl hover:bg-error-container text-error transition-colors cursor-pointer"
                        title="حذف المنتج"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET STACKED CARDS (< lg)                                      */}
      {/* ========================================================================= */}
      <div className="block lg:hidden space-y-3">
        {products.length === 0 ? (
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container text-center text-outline">
            لا توجد منتجات مسجلة بالكتالوج.
          </div>
        ) : (
          products.map((product) => (
            <article
              key={`mobile-product-${product.id}`}
              className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container shadow-xs flex flex-col gap-3 transition-shadow hover:shadow-md"
            >
              {/* Image & Main Info */}
              <div className="flex items-start gap-3">
                <img
                  className="w-16 h-16 rounded-xl object-cover bg-surface-container shrink-0 border border-surface-container"
                  src={product.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'}
                  alt={product.name}
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="bg-surface-container-high px-2 py-0.5 rounded-full text-[11px] font-semibold text-on-surface">
                      {product.category}
                    </span>
                    <span className="font-currency-md text-base font-bold text-primary whitespace-nowrap">
                      {product.price.toLocaleString('fr-DZ')} <span className="text-xs font-normal">دج</span>
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface mt-1 line-clamp-1">
                    {product.name}
                  </h4>
                  <span className="font-mono text-outline text-[11px] truncate">{product.slug}</span>
                </div>
              </div>

              {/* Attributes Details */}
              <div className="bg-surface-container-low p-2.5 rounded-xl flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-outline">نوع الخشب:</span>
                  <span className="font-medium text-on-surface">{product.woodType}</span>
                </div>
                {product.dimensions && (
                  <div className="flex items-center justify-between">
                    <span className="text-outline">الأبعاد:</span>
                    <span className="font-medium text-on-surface">{product.dimensions}</span>
                  </div>
                )}
              </div>

              {/* Mobile Actions Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-surface-container">
                {/* Status Dropdown */}
                <div className="flex-1 min-w-[130px]">
                  <select
                    value={product.status}
                    onChange={(e) => handleStatusChange(product.id, e.target.value as ProductStatus)}
                    className="w-full bg-surface-container text-on-surface font-semibold text-xs rounded-xl px-2.5 py-2 cursor-pointer outline-none border border-surface-container-high"
                  >
                    <option value="DISPONIBLE">متوفر (تسليم فوري)</option>
                    <option value="SUR_COMMANDE">خدمة على الطلب</option>
                    <option value="OUT_OF_STOCK">نفاذ الكمية</option>
                  </select>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => openEditModal(product)}
                  className="flex items-center gap-1 py-2 px-3 rounded-xl bg-surface-container hover:bg-primary-container hover:text-on-primary text-primary font-bold text-xs transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>تعديل</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => setDeleteConfirmId(product.id)}
                  className="p-2 rounded-xl bg-surface-container text-outline hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                  title="حذف المنتج"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Floating Action Button (FAB) for Mobile Quick Add */}
      <button
        onClick={openAddModal}
        className="fixed bottom-20 left-4 z-40 lg:hidden flex items-center gap-2 bg-primary text-on-primary px-4 py-3 rounded-full shadow-2xl font-label-md font-bold hover:bg-primary-container transition-all cursor-pointer active:scale-95"
        type="button"
        aria-label="إضافة منتج جديد"
      >
        <span className="material-symbols-outlined text-[22px]">add</span>
        <span>منتج جديد</span>
      </button>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-space-lg flex flex-col items-center text-center gap-space-sm shadow-xl border border-surface-container animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">تأكيد حذف المنتج</h3>
            <p className="font-body-sm text-outline leading-relaxed">
              هل أنت متأكد من حذف هذه القطعة من الكتالوج؟ لن تظهر للزبائن بعد الآن.
            </p>
            <div className="w-full flex items-center gap-2 pt-2">
              <button
                className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md cursor-pointer"
                onClick={() => setDeleteConfirmId(null)}
                type="button"
              >
                إلغاء
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl bg-error text-on-error font-label-md text-label-md font-semibold hover:opacity-90 cursor-pointer"
                onClick={() => handleDelete(deleteConfirmId)}
                type="button"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-surface-container animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-space-lg py-4 bg-surface-container-low flex items-center justify-between border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  {editingProduct ? 'edit' : 'add_circle'}
                </span>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة قطعة أثاث جديدة'}
                </h3>
              </div>
              <button
                className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-space-lg space-y-space-sm overflow-y-auto">
              {errorMessage && (
                <div className="p-3 bg-error-container text-on-error-container rounded-lg font-label-md text-label-md">
                  {errorMessage}
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md font-semibold text-on-surface">
                  اسم السلعة / الموديل <span className="text-error">*</span>
                </label>
                <input
                  name="name"
                  defaultValue={editingProduct?.name || ''}
                  required
                  placeholder="مثال: صالون مودرن 3 مقاعد خشب زان"
                  className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/30 text-body-md"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md font-semibold text-on-surface">
                    الصنف (Catégorie) <span className="text-error">*</span>
                  </label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'صالون'}
                    className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/30 text-body-md"
                  >
                    <option value="صالون">صالون</option>
                    <option value="شومبرة نوم">شومبرة نوم</option>
                    <option value="طوابل وكراسي">طوابل وكراسي</option>
                    <option value="ميعن وديكور">ميعن وديكور</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md font-semibold text-on-surface">
                    السعر (دج) <span className="text-error">*</span>
                  </label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={editingProduct?.price || ''}
                    required
                    placeholder="مثال: 65000"
                    className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/30 text-body-md font-mono"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md font-semibold text-on-surface">
                  حالة التوفر (Statut)
                </label>
                <select
                  name="status"
                  defaultValue={editingProduct?.status || 'DISPONIBLE'}
                  className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/30 text-body-md"
                >
                  <option value="DISPONIBLE">متوفر في المخزن (تسليم فوري)</option>
                  <option value="SUR_COMMANDE">خدمة على الطلب (Sur commande)</option>
                  <option value="OUT_OF_STOCK">نفاذ الكمية (Épuisé)</option>
                </select>
              </div>

              {/* Wood Type & Dimensions */}
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md font-semibold text-on-surface">
                    نوع الخشب
                  </label>
                  <input
                    name="woodType"
                    defaultValue={editingProduct?.woodType || 'خشب زان Hêtre'}
                    placeholder="مثال: خشب زان طبيعي"
                    className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/30 text-body-md"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md font-semibold text-on-surface">
                    المقاسات
                  </label>
                  <input
                    name="dimensions"
                    defaultValue={editingProduct?.dimensions || '220 سم × 90 سم × 85 سم'}
                    placeholder="الطول × العمق × الارتفاع"
                    className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/30 text-body-md"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md font-semibold text-on-surface">
                  الوصف والمواصفات
                </label>
                <textarea
                  name="description"
                  defaultValue={editingProduct?.description || ''}
                  rows={3}
                  placeholder="وصف دقيق للموديل، خامات القماش، والإسفنج..."
                  className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/30 text-body-sm resize-none"
                />
              </div>

              {/* Image URLs */}
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center justify-between">
                  <span>روابط الصور (رابط في كل سطر)</span>
                  <span className="text-outline font-label-sm text-[11px]">رابط URL مباشر</span>
                </label>
                <textarea
                  name="images"
                  defaultValue={editingProduct?.images.join('\n') || ''}
                  rows={3}
                  placeholder="https://...&#10;https://..."
                  className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/30 text-body-sm font-mono text-left resize-none"
                  dir="ltr"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container cursor-pointer transition-colors"
                >
                  {isPending ? 'جاري الحفظ...' : editingProduct ? 'تحديث السلعة' : 'إضافة للمتجر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
