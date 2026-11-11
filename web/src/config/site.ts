import type { ThemeId } from './themes';

/**
 * Thông tin cố định của website (tên, màu, logo, ảnh).
 * Điện thoại, địa chỉ, giờ mở cửa, Facebook, GrabFood, ShopeeFood: sửa trong CMS (/admin),
 * giá trị mặc định ở src/config/settings.ts.
 */

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const siteConfig = {
  name: "Một Ly Cafe's và Matcha",
  /**
   * Tông màu chủ đạo: 'matcha' | 'uji' | 'matcha-butter' | 'avocado' | 'butter'.
   * Xem trước các tông: chạy `pnpm dev`, dùng bộ chọn tông ở góc dưới bên trái.
   */
  theme: 'matcha' as ThemeId,
  shortName: 'Một Ly',
  url: siteUrl.replace(/\/$/, ''),

  /** Mã quốc gia (schema.org addressCountry) */
  country: 'VN',
  /** Ngày mở cửa (schema.org dayOfWeek). Giờ mở/đóng cửa sửa trong CMS. */
  openingDays: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ],

  images: {
    /** Logo nền trong suốt (tạo từ logo.jpg bằng `node scripts/process-logo.mjs`) */
    logo: '/images/logo.png',
    /** Bản logo nét màu kem, dùng trên nền xanh đậm */
    logoLight: '/images/logo-light.png',
    /** Kích thước của logo.png để next/image giữ đúng tỉ lệ */
    logoSize: { width: 640, height: 489 },
    hero: '/images/hero/hero-matcha.svg',
    about: '/images/about/about-shop.svg'
  }
} as const;

export type SiteConfig = typeof siteConfig;
