'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/app/actions/authActions';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await loginAdmin(null, formData);
      if (res?.error) {
        setErrorMessage(res.error);
      } else if (res?.success) {
        router.push('/admin/orders');
      }
    });
  };

  return (
    <main className="flex flex-col relative w-full bg-surface min-h-screen pt-safe pb-safe" dir="rtl">
      <div className="flex flex-col w-full px-margin-mobile pb-space-xl max-w-sm mx-auto my-auto">
        {/* Header & Brand Plinth */}
        <div className="flex flex-col items-center text-center mt-space-lg mb-space-lg">
          <div className="relative w-20 h-20 bg-surface-container-lowest shadow-md rounded-xl p-space-xs flex items-center justify-center mb-space-md border border-surface-container">
            <img
              alt="شعار أروقة دار ديزاين"
              className="w-full h-full object-contain rounded-lg"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VH3vghTFcADuuueH0BsTcOKFD0qtePj9DVMNgQbPNZV3ion7mFY9I7-BQSwOLLVtSUifmLkpwWn0LnUzJgLTwJYBw8Oey_e1QOa961Zsh2Nq_O2jBuGiRfVYAyKB9a8SkYddIyuObSRTnQFHYeGI7lmmEJkNT-P6R3ftlC9RZ0qIVR_V3XACG1OtjXxqQRasYtQFFu3-Ad6dtjjcl07aaGPgJyfe5C8HlQkeg_Hi-kKL-EGewww4_ZCg"
            />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[12px]">verified_user</span>
            </div>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-space-xs tracking-tight font-bold">
            أروقة دار ديزاين
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            فضاء التسيير والإدارة | لوحة التحكم
          </p>
        </div>

        {/* Login Form Card */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md border border-surface-container">
          {errorMessage && (
            <div className="p-3 bg-error-container text-on-error-container rounded-lg font-label-md text-label-md flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="flex flex-col gap-space-xs text-right">
              <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="usernameInput">
                <span>اسم المستخدم (Username)</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">معرّف الفريق</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute right-3.5 text-on-surface-variant pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </span>
                <input
                  autoComplete="username"
                  className="w-full h-12 pr-11 pl-4 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm placeholder:text-outline-variant focus:outline-none focus:bg-surface-container-low transition-colors border border-outline-variant/40 focus:border-primary-container"
                  id="usernameInput"
                  name="username"
                  placeholder="مثال: amine_admin أو confirmateur_dz"
                  required
                  type="text"
                  defaultValue="amine_admin"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-space-xs text-right">
              <label className="font-label-md text-label-md text-on-surface flex items-center justify-between" htmlFor="passwordInput">
                <span>كلمة المرور (Password)</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute right-3.5 text-on-surface-variant pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-[20px]">key</span>
                </span>
                <input
                  autoComplete="current-password"
                  className="w-full h-12 pr-11 pl-11 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-sm placeholder:text-outline-variant focus:outline-none focus:bg-surface-container-low transition-colors border border-outline-variant/40 focus:border-primary-container"
                  id="passwordInput"
                  name="password"
                  placeholder="••••••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="admin123"
                />
                <button
                  aria-label="إظهار أو إخفاء كلمة المرور"
                  className="absolute left-3.5 text-on-surface-variant hover:text-on-surface flex items-center focus:outline-none cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between py-space-xs">
              <label className="flex items-center gap-space-xs cursor-pointer select-none">
                <input
                  defaultChecked
                  className="w-4 h-4 rounded bg-surface-container text-primary-container accent-primary-container cursor-pointer focus:ring-0"
                  id="rememberDevice"
                  name="remember"
                  type="checkbox"
                />
                <span className="font-body-sm text-body-sm text-on-surface">تذكر جلسة العمل (14 يوماً)</span>
              </label>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                جلسة مشفرة
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              className="relative w-full h-12 bg-primary-container hover:bg-primary text-on-primary font-title-md text-title-md rounded-lg shadow-md flex items-center justify-center gap-space-sm transition-all duration-200 mt-space-xs cursor-pointer disabled:opacity-75"
              disabled={isPending}
              id="submitBtn"
              type="submit"
            >
              {isPending ? (
                <>
                  <span>جاري التحقق والمصادقة...</span>
                  <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول إلى النظام</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm text-outline flex flex-col gap-1">
            <span className="font-semibold text-on-surface text-[12px]">حسابات تجريبية مهيأة:</span>
            <span className="text-[11px]">أدمين: <strong className="text-primary">amine_admin</strong> / <strong className="text-primary">admin123</strong></span>
            <span className="text-[11px]">مؤكد: <strong className="text-primary">confirmateur_dz</strong> / <strong className="text-primary">confirmateur123</strong></span>
          </div>
        </div>
      </div>
    </main>
  );
}
