import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'أروقة دار ديزاين | أثاث عصري فاخر بالجزائر',
  description: 'المتجر الإلكتروني الرائد للأثاث العصري المصنوع يدوياً بخشب الزان والسنديان الطبيعي. الدفع عند الاستلام مع التوصيل لكافة 58 ولاية.',
  icons: {
    icon: 'https://lh3.googleusercontent.com/aida/AEtjO1VH3vghTFcADuuueH0BsTcOKFD0qtePj9DVMNgQbPNZV3ion7mFY9I7-BQSwOLLVtSUifmLkpwWn0LnUzJgLTwJYBw8Oey_e1QOa961Zsh2Nq_O2jBuGiRfVYAyKB9a8SkYddIyuObSRTnQFHYeGI7lmmEJkNT-P6R3ftlC9RZ0qIVR_V3XACG1OtjXxqQRasYtQFFu3-Ad6dtjjcl07aaGPgJyfe5C8HlQkeg_Hi-kKL-EGewww4_ZCg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased min-h-screen flex flex-col font-arabic">
        {children}
      </body>
    </html>
  );
}
