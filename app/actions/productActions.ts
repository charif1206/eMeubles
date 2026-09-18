'use server';

import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { ProductStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  try {
    await requireAdmin();

    const name = formData.get('name')?.toString().trim();
    let slug = formData.get('slug')?.toString().trim();
    const category = formData.get('category')?.toString().trim();
    const price = parseFloat(formData.get('price')?.toString() || '0');
    const status = (formData.get('status')?.toString() as ProductStatus) || ProductStatus.DISPONIBLE;
    const woodType = formData.get('woodType')?.toString().trim() || 'خشب زان Hêtre';
    const dimensions = formData.get('dimensions')?.toString().trim() || '';
    const description = formData.get('description')?.toString().trim() || '';
    const imagesStr = formData.get('images')?.toString().trim() || '';

    if (!name || !price || !category) {
      return { error: 'يرجى إدخال اسم المنتج، الصنف، والسعر' };
    }

    if (!slug) {
      slug = name.toLowerCase().replace(/[\s\W-]+/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
    }

    const images = imagesStr
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        category,
        price,
        status,
        woodType,
        dimensions,
        description,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc'],
      },
    });

    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath('/admin/products');

    return { success: true, product };
  } catch (error: any) {
    console.error('Error creating product:', error);
    const isConnErr = error?.message?.includes("Can't reach database server") || error?.message?.includes('P1001');
    return {
      error: isConnErr
        ? 'تعذر الاتصال بقاعدة البيانات. السيرفر غير متاح حالياً.'
        : error.message || 'فشل إضافة المنتج',
    };
  }
}

export async function updateProduct(formData: FormData) {
  try {
    await requireAdmin();

    const id = formData.get('id')?.toString().trim();
    const name = formData.get('name')?.toString().trim();
    const slug = formData.get('slug')?.toString().trim();
    const category = formData.get('category')?.toString().trim();
    const price = parseFloat(formData.get('price')?.toString() || '0');
    const status = (formData.get('status')?.toString() as ProductStatus) || ProductStatus.DISPONIBLE;
    const woodType = formData.get('woodType')?.toString().trim();
    const dimensions = formData.get('dimensions')?.toString().trim();
    const description = formData.get('description')?.toString().trim();
    const imagesStr = formData.get('images')?.toString().trim();

    if (!id || !name || !price || !category) {
      return { error: 'يرجى إدخال جميع الحقول المطلوبة' };
    }

    const images = imagesStr
      ? imagesStr
          .split('\n')
          .map((url) => url.trim())
          .filter((url) => url.length > 0)
      : undefined;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        category,
        price,
        status,
        woodType: woodType || undefined,
        dimensions: dimensions || undefined,
        description: description || undefined,
        images: images && images.length > 0 ? images : undefined,
      },
    });

    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath(`/product/${id}`);
    revalidatePath('/admin/products');

    return { success: true, product };
  } catch (error: any) {
    console.error('Error updating product:', error);
    const isConnErr = error?.message?.includes("Can't reach database server") || error?.message?.includes('P1001');
    return {
      error: isConnErr
        ? 'تعذر الاتصال بقاعدة البيانات لتحديث المنتج.'
        : error.message || 'فشل تحديث المنتج',
    };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await requireAdmin();

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath('/admin/products');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    const isConnErr = error?.message?.includes("Can't reach database server") || error?.message?.includes('P1001');
    return {
      error: isConnErr
        ? 'تعذر الاتصال بقاعدة البيانات لحذف المنتج.'
        : error.message || 'فشل حذف المنتج',
    };
  }
}

export async function toggleProductStatus(productId: string, status: ProductStatus) {
  try {
    await requireAdmin();

    const product = await prisma.product.update({
      where: { id: productId },
      data: { status },
    });

    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath(`/product/${productId}`);
    revalidatePath('/admin/products');

    return { success: true, product };
  } catch (error: any) {
    console.error('Error toggling product status:', error);
    const isConnErr = error?.message?.includes("Can't reach database server") || error?.message?.includes('P1001');
    return {
      error: isConnErr
        ? 'تعذر تحديث حالة السلعة بسبب مشكلة في الاتصال بقاعدة البيانات.'
        : error.message || 'فشل تغيير حالة السلعة',
    };
  }
}
