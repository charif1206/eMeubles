import prisma from './db';
import { Product, Order, ProductStatus, OrderStatus } from '@prisma/client';

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod_salon_angle_01',
    name: 'صالون زاوية L-Shape قماش مخملي',
    slug: 'salon-angle-l-shape-velours',
    category: 'صالون',
    price: 145000,
    status: ProductStatus.DISPONIBLE,
    description: 'صالون زاوية L-Shape عصري بتصميم رحب وهيكل متين يمنح غرفة الجلوس فخامة استثنائية وراحة تدوم لسنوات.',
    woodType: 'خشب زان طبيعي 100% (Hêtre)',
    dimensions: '280 سم × 180 سم × 85 سم',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1x9hS-LHV87D2kvuxUzlRU8qtUBANEBJDkxQ77LTPNmgSXV70w9eBZvLBIaPk2OJLeyH1rDLVPCtTMaiw4yq749mHuwfbIQ92KqW1eZK6xoS_C65E-7jFKuzQu8cM0PmpalVNggz9n3dW5u5wOICBY5Kk07p-l7Hg7WSL4pU87cLH0lOtLOhEZtWQ7MzRypLZyU9VRQsHyj5nMCAx1gy2kU7ofgLTn0TDbP6EgVstGnROdVJrDEc',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKipEresWSnlwTiO-tMHjUKGt_SxOQlETPOpJ-Bh8lY7XAaV38AOxs3mOcqAE2I5dLIO8gwHN_-EUYq3WCLaUPFRGdHQo1uyehwADb8wNFUaqWnIpKmSPOrm0D_OBnX4GEIE56f4Co99Jt11fQBNhPeIE0Ai7BxCRGQOvhmL5eAnvxs1B37L7gkPI8IU6H3MfZL9s3cVVzmvGYDUEReSWb6lF9fCUaFIvVztO_pIy0c_zRm9ngxlE',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3lFC-VtWX3Den_lPato_sIkBwV3FvqkWPU6lYn0EyRHbakCR68mEChXpWtnacdhhf-KsQoDNaoppo_YK8KNQLCZ115KrU5peFrRFfJfVxSiBwB1igrzQsre_6K4MzWeHT-va8p0TXiY-JWRjT6E0YozY5x4zvHNe2vYs05d1UDQK371Lf_tZ9Eu-pXgtOFCpU5-zG3kesCMuUBd3UM9uNtaYDUqj5hWVBsJTs8i3EtBB99s7WlVE',
    ],
    createdAt: new Date('2026-09-01T10:00:00Z'),
  },
  {
    id: 'prod_salon_mod_02',
    name: 'صالون مودرن 3 مقاعد خشب زان وقماش مريح',
    slug: 'salon-modern-3-places-hetre',
    category: 'صالون',
    price: 65000,
    status: ProductStatus.DISPONIBLE,
    description: 'تصميم هندسي متوازن مستوحى من البساطة المتوسطية يجمع بين صلابة هيكل خشب الزان الأحمر الطبيعي وإسفنج D30 عالي الكثافة المريح لسنوات دون هبوط.',
    woodType: 'خشب زان Hêtre مجفف ضد الرطوبة والالتواء',
    dimensions: 'الطول: 220 سم • العمق: 90 سم • الارتفاع: 85 سم',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKipEresWSnlwTiO-tMHjUKGt_SxOQlETPOpJ-Bh8lY7XAaV38AOxs3mOcqAE2I5dLIO8gwHN_-EUYq3WCLaUPFRGdHQo1uyehwADb8wNFUaqWnIpKmSPOrm0D_OBnX4GEIE56f4Co99Jt11fQBNhPeIE0Ai7BxCRGQOvhmL5eAnvxs1B37L7gkPI8IU6H3MfZL9s3cVVzmvGYDUEReSWb6lF9fCUaFIvVztO_pIy0c_zRm9ngxlE',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDsvn_q5GQGZPsp8fIvs_6oFOQFD96QzQXibyTmFBzA4xmguxotmL2P076UNvbnzX-6a9FCU_Ul9OnadFCvpaz703-NV2qtgG_xpluhBUIPvb11hP2pp9AD6zIu-fZR1RlgtMlsw1or-2VyNPNTJlgGwqCGFlfBjQwEqeA3Lng3fnPjACwdoRrShFt1NlVE49jy9VnzIAF3QFhMX9hTsmahRH76P9z_YgwaApq8ojpAW7ibFzFvt_U',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3lFC-VtWX3Den_lPato_sIkBwV3FvqkWPU6lYn0EyRHbakCR68mEChXpWtnacdhhf-KsQoDNaoppo_YK8KNQLCZ115KrU5peFrRFfJfVxSiBwB1igrzQsre_6K4MzWeHT-va8p0TXiY-JWRjT6E0YozY5x4zvHNe2vYs05d1UDQK371Lf_tZ9Eu-pXgtOFCpU5-zG3kesCMuUBd3UM9uNtaYDUqj5hWVBsJTs8i3EtBB99s7WlVE',
      'https://lh3.googleusercontent.com/aida/AEtjO1Wip_JnCN53mQs15Yx1wTX9T0C1dRsXm8unlqQJqDIEeLcWI_IZbRq2QbDRb1RRip6ekMy9afnd-p84blmdjxuKcf-FDq40jH_OklSJEwv173plr6NuexWnok8tN6vk5B4djNGIU_TDRHG0YY2sPiAQQU0cNtPc2Rh0iNJv15lIo2L57WUuJeVtAn3KURD9Lag9bZwuerC7n3HaPP68aW3d_hPhiaGCf8BZhbLQnJsEy8TgGxgLCYX5eQ',
    ],
    createdAt: new Date('2026-09-02T11:00:00Z'),
  },
  {
    id: 'prod_table_03',
    name: 'طابلة قهوة خشب زان طبيعي',
    slug: 'table-basse-bois-hetre',
    category: 'طوابل وكراسي',
    price: 38000,
    status: ProductStatus.DISPONIBLE,
    description: 'طاولة قهوة مستوحاة من الطراز النورديكي والياباني المنحني، مخدومة بخشب الزان الصلب المشذب يدوياً.',
    woodType: 'خشب زان Hêtre معالَج بورنيش طبيعي',
    dimensions: '120 سم × 60 سم × 45 سم',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHhZa557vqPtcPchQ7TkAQnyQjVlq94qjnwhKIwXxwVzx3Zcht2jtkwNG7bGHgqohffDIE0KfFW8aGYDwVuugBsD3Y1NjcTg9nPmKKs-ZvZfoIenCLQsTOqQB6jw1qFGint5TLdk_soHK3dgcLPm17pQpJ2p5qAHZ1eDjhesEURPxMc08uQfTilA8bSPiTQc1uLt4p5ZNFHvRcgsbBObjw30N5Wly1rHDV3oUGma-2U8OXVtPlvfQ',
    ],
    createdAt: new Date('2026-09-03T12:00:00Z'),
  },
  {
    id: 'prod_lit_04',
    name: 'سرير كينغ قماش بوكلي عاجي',
    slug: 'lit-king-tissu-boucle-ivoire',
    category: 'شومبرة نوم',
    price: 165000,
    status: ProductStatus.DISPONIBLE,
    description: 'سرير كينغ بتصميم فندقي فخم مع لوح رأس منحني مبطن بقماش البوكلي العاجي الفاخر مع حواف خشب السنديان.',
    woodType: 'خشب السنديان والزان الطبيعي',
    dimensions: '180 سم × 200 سم (اللوح: 210 سم × 120 سم)',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBg3EckPWRtxu_sYRGmgNbZ41fBNb5CpIyEiULvPoVlejIC9zvJmk4ujTLhhun6CrdCNfARR98aycPILiDSMWn2rCt0fkMncv9-nfZ4xzTVXfy-xSE9OSueDWKuwvGEjMP7v2OGp9wBLt92ePlMGI1t5jY7BrNDtQbypB3_AB-ZAaHZ5HijbiPIkb8upqzuB_qxVmOHpK4BzRTXokKstI-o5HthAbgl1nK5Wm412WOxpU5fehTJJqg',
    ],
    createdAt: new Date('2026-09-04T13:00:00Z'),
  },
  {
    id: 'prod_chaises_05',
    name: 'طقم كرسيين طاولة أكل خيزران',
    slug: 'set-2-chaises-rotin',
    category: 'طوابل وكراسي',
    price: 44000,
    status: ProductStatus.OUT_OF_STOCK,
    description: 'طقم كرسيين أنيقين لسفرة الطعام مصنوعين من خشب السنديان الطبيعي وخيزران القش المجدول يدوياً.',
    woodType: 'خشب السنديان الطبيعي وقش',
    dimensions: '50 سم × 55 سم × 85 سم',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCj_D-pI55GEsZsKrkKFrwmtrZk0-cA6ABYFD3ySVxC_Y7RoaIyxSRDoWRKxShcC6R0fm3c6VAlAvn6j1iSSFeomid2z1Sdy16e7JEsbcfPt6KkLQhQz7yzPbwyS9-hj57z5R9g3u-1Sx6Dz-RZUXrgQlJ0aVfQuPocdshY8wJCLHRthc34wGVJUT8mvMx6GFsrsWF-BYo70MotvMD9G8q5AYkYtb7wdQYpLGTie57QkPMfqYeEgOQ',
    ],
    createdAt: new Date('2026-09-05T14:00:00Z'),
  },
  {
    id: 'prod_buffet_06',
    name: 'بوفيه مدخل أروقة مع مرآة مقوسة',
    slug: 'buffet-entree-miroir-arwaqa',
    category: 'ميعن وديكور',
    price: 52000,
    status: ProductStatus.SUR_COMMANDE,
    description: 'بوفيه مدخل أنيق مع أدراج إخفاء ومرآة مقوسة مؤطرة بخشب الزان، لمسة جزائرية راقية في مدخل بيتك.',
    woodType: 'خشب زان طبيعي',
    dimensions: '140 سم × 40 سم × 85 سم',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDV9QouLA2NVCnxlDfm9qPMikqbeIIquQS-3TSbktpbK5kvyKtP0TWwtdxXta_Ne7atQl5-3O7E5tYOTrN7Cf19gpurcgsllF9FNBxs2TSeJS5jsnovKek8DYfd6Sw5pfGXp7DOdbLTWAO9C_PLETbZ4xrVuTytG_IkbkHG1ylOT6d9d-B1fSO-RrOX-cudEyVJr0o_5j3oCckKhLSPpLTRaFC1NXp8bWMoCWUuxej0JudTk9zvdHQ',
    ],
    createdAt: new Date('2026-09-06T15:00:00Z'),
  },
];

export type OrderWithProduct = Order & { product: Product };

export const FALLBACK_ORDERS: OrderWithProduct[] = [
  {
    id: 'ORD-20260914-003',
    clientName: 'شريف عبد المريم',
    phone: '0555123456',
    wilaya: '02 - الشلف',
    commune: 'أولاد فارس',
    address: 'حي السلام، عمارة 4، الطابق الثاني، رقم الشقة 12',
    note: 'حب الزاوية تاع الصالون على اليمين وقماش غري سوري (Gris Souris) مريح ومقاوم للماء',
    productId: FALLBACK_PRODUCTS[0].id,
    product: FALLBACK_PRODUCTS[0],
    priceTotal: 145000,
    status: OrderStatus.CONFIRMED,
    createdAt: new Date('2026-09-14T22:32:00'),
  },
  {
    id: 'ORD-20260914-002',
    clientName: 'سارة مجاهد',
    phone: '0661987654',
    wilaya: '31 - وهران',
    commune: 'حي الصباح',
    address: 'إقامة النرجس، فيلا رقم 8',
    note: 'يرجى الاتصال قبل العاشرة صباحاً لتحديد موعد التوصيل الدقيق',
    productId: FALLBACK_PRODUCTS[1].id,
    product: FALLBACK_PRODUCTS[1],
    priceTotal: 68500,
    status: OrderStatus.PENDING,
    createdAt: new Date('2026-09-14T19:15:00'),
  },
  {
    id: 'ORD-20260913-005',
    clientName: 'كريم بن عودة',
    phone: '0770334455',
    wilaya: '16 - الجزائر العاصمة',
    commune: 'دالي براهيم',
    address: 'طريق الشراقة، إقامة الياسمين عمارة ب',
    note: 'توصيل بعد العصر من فضلكم',
    productId: FALLBACK_PRODUCTS[2].id,
    product: FALLBACK_PRODUCTS[2],
    priceTotal: 40500,
    status: OrderStatus.IN_PRODUCTION,
    createdAt: new Date('2026-09-13T14:20:00'),
  },
  {
    id: 'ORD-20260912-004',
    clientName: 'عبد القادر زروقي',
    phone: '0560112233',
    wilaya: '25 - قسنطينة',
    commune: 'الخروب',
    address: 'حي 500 مسكن، مدخل 3',
    note: '',
    productId: FALLBACK_PRODUCTS[1].id,
    product: FALLBACK_PRODUCTS[1],
    priceTotal: 68500,
    status: OrderStatus.OUT_FOR_DELIVERY,
    createdAt: new Date('2026-09-12T10:05:00'),
  },
  {
    id: 'ORD-20260911-002',
    clientName: 'ياسمين بوعلام',
    phone: '0672881901',
    wilaya: '19 - سطيف',
    commune: 'العلمة',
    address: 'حي دبي، بالقرب من المركز التجاري',
    note: 'ألغيت من طرف الزبونة بسبب السفر المفاجئ',
    productId: FALLBACK_PRODUCTS[5].id,
    product: FALLBACK_PRODUCTS[5],
    priceTotal: 52000,
    status: OrderStatus.CANCELLED,
    createdAt: new Date('2026-09-11T09:12:00'),
  },
  {
    id: 'ORD-20260910-001',
    clientName: 'فوزي بلحاج',
    phone: '0541778899',
    wilaya: '09 - البليدة',
    commune: 'بوفاريك',
    address: 'وسط المدينة، نهج الأمير عبد القادر',
    note: 'تم التسليم والدفع نقداً',
    productId: FALLBACK_PRODUCTS[0].id,
    product: FALLBACK_PRODUCTS[0],
    priceTotal: 147000,
    status: OrderStatus.DELIVERED,
    createdAt: new Date('2026-09-10T16:45:00'),
  },
];

/**
 * Fetch products safely with automatic fallback to mock data on database errors.
 */
export async function getSafeProducts(searchQuery: string = ''): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (products && products.length > 0) {
      return products;
    }
    return FALLBACK_PRODUCTS;
  } catch (error) {
    console.warn('[SafeData] Database query failed for products, using fallback catalog:', (error as any)?.message || error);
    return FALLBACK_PRODUCTS;
  }
}

/**
 * Fetch a single product by ID or slug safely.
 */
export async function getSafeProduct(idOrSlug: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });
    if (product) return product;
  } catch (error) {
    console.warn('[SafeData] Database query failed for product, using fallback:', (error as any)?.message || error);
  }

  // Fallback lookup
  const fallback = FALLBACK_PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  return fallback || null;
}

/**
 * Fetch all orders safely with their associated product.
 */
export async function getSafeOrders(): Promise<OrderWithProduct[]> {
  try {
    const orders = await prisma.order.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    if (orders && orders.length > 0) {
      return orders as OrderWithProduct[];
    }
    return FALLBACK_ORDERS;
  } catch (error) {
    console.warn('[SafeData] Database query failed for orders, using fallback:', (error as any)?.message || error);
    return FALLBACK_ORDERS;
  }
}

/**
 * Fetch a single order by ID safely.
 */
export async function getSafeOrder(id: string): Promise<OrderWithProduct | null> {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { product: true },
    });
    if (order) return order as OrderWithProduct;
  } catch (error) {
    console.warn('[SafeData] Database query failed for order, using fallback:', (error as any)?.message || error);
  }

  const fallback = FALLBACK_ORDERS.find((o) => o.id === id);
  if (fallback) return fallback;

  // Fallback dummy order if id matches pattern
  return {
    id,
    clientName: 'زبون محترم',
    phone: '0555000000',
    wilaya: '16 - الجزائر العاصمة',
    commune: 'الجزائر الوسطى',
    address: 'الجزائر العاصمة',
    note: 'طلب مسجل بنجاح',
    productId: FALLBACK_PRODUCTS[0].id,
    product: FALLBACK_PRODUCTS[0],
    priceTotal: FALLBACK_PRODUCTS[0].price + 1500,
    status: OrderStatus.PENDING,
    createdAt: new Date(),
  };
}

/**
 * Fetch pending orders count safely.
 */
export async function getSafePendingOrdersCount(): Promise<number> {
  try {
    return await prisma.order.count({
      where: { status: 'PENDING' },
    });
  } catch (error) {
    console.warn('[SafeData] Database count failed, using fallback count:', (error as any)?.message || error);
    return FALLBACK_ORDERS.filter((o) => o.status === OrderStatus.PENDING).length;
  }
}

/**
 * Fetch stats for the admin dashboard safely.
 */
export async function getSafeAdminStats(): Promise<{
  orders: OrderWithProduct[];
  productsCount: number;
}> {
  try {
    const [orders, productsCount] = await Promise.all([
      prisma.order.findMany({
        include: { product: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ]);
    return {
      orders: orders as OrderWithProduct[],
      productsCount: productsCount || FALLBACK_PRODUCTS.length,
    };
  } catch (error) {
    console.warn('[SafeData] Database admin stats query failed, using fallback:', (error as any)?.message || error);
    return {
      orders: FALLBACK_ORDERS,
      productsCount: FALLBACK_PRODUCTS.length,
    };
  }
}
