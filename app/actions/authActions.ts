'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { createSessionToken, setSessionCookie, clearSessionCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAdmin(prevState: any, formData: FormData) {
  const username = formData.get('username')?.toString().trim();
  const password = formData.get('password')?.toString();
  const remember = formData.get('remember') === 'on';

  if (!username || !password) {
    return { error: 'يرجى إدخال اسم المستخدم وكلمة المرور' };
  }

  try {
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { username },
      });
    } catch (dbErr) {
      console.warn('[AuthActions] Database unreachable during login, checking emergency/dev credentials:', (dbErr as any)?.message);
      // Emergency/offline fallback accounts matching seed.ts
      if (username === 'amine_admin' && password === 'admin123') {
        const token = createSessionToken(
          {
            userId: 'fallback_admin_id',
            username: 'amine_admin',
            role: 'ADMIN' as any,
          },
          remember
        );
        await setSessionCookie(token, remember);
        return { success: true, role: 'ADMIN' };
      } else if (username === 'confirmateur_dz' && password === 'confirmateur123') {
        const token = createSessionToken(
          {
            userId: 'fallback_confirmateur_id',
            username: 'confirmateur_dz',
            role: 'CONFIRMATEUR' as any,
          },
          remember
        );
        await setSessionCookie(token, remember);
        return { success: true, role: 'CONFIRMATEUR' };
      }
      return { error: 'تعذر الاتصال بقاعدة البيانات. في وضع عدم الاتصال، يمكنك استخدام: amine_admin / admin123' };
    }

    if (!user) {
      return { error: 'معلومات الدخول غير صحيحة' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'كلمة المرور غير مطابقة' };
    }

    const token = createSessionToken(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      remember
    );

    await setSessionCookie(token, remember);
    return { success: true, role: user.role };
  } catch (error: any) {
    console.error('Login error:', error);
    return { error: 'حدث خطأ أثناء المصادقة، يرجى المحاولة لاحقاً' };
  }
}

export async function logoutAdmin() {
  await clearSessionCookie();
  redirect('/admin/login');
}
