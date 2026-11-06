import type { Localized } from '@/types';
import type { ThemeId } from './themes';

/**
 * Thông tin quán. Sửa ở đây là toàn bộ website cập nhật theo.
 * LƯU Ý: địa chỉ và số điện thoại lấy từ bản tóm tắt do AI tạo, chủ quán cần kiểm tra lại.
 */

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

const mapQuery =
  '93 Trần Thị Nghỉ, Phường Hạnh Thông, Gò Vấp, Thành phố Hồ Chí Minh';

export const siteConfig = {
  name: 'Một Ly Café & Matcha',
  /**
   * Tông màu chủ đạo: 'matcha' | 'uji' | 'matcha-butter' | 'avocado' | 'butter'.
   * Xem trước các tông: chạy `pnpm dev`, dùng bộ chọn tông ở góc dưới bên trái.
   */
  theme: 'matcha' as ThemeId,
  shortName: 'Một Ly',
  url: siteUrl.replace(/\/$/, ''),

  /** Số điện thoại dạng E.164 cho link tel: */
  phone: '+84388738680',
  /** Số điện thoại hiển thị */
  phoneDisplay: '0388 738 680',

  address: {
    street: '93 Trần Thị Nghỉ',
    ward: 'Phường Hạnh Thông',
    district: 'Gò Vấp',
    city: 'Thành phố Hồ Chí Minh',
    country: 'VN',
    /** Dòng địa chỉ hiển thị theo ngôn ngữ */
    lines: {
      vi: [
        '93 Trần Thị Nghỉ, Phường Hạnh Thông (Phường 1 cũ)',
        'Quận Gò Vấp, TP. Hồ Chí Minh'
      ],
      en: [
        '93 Tran Thi Nghi St., Hanh Thong Ward (former Ward 1)',
        'Go Vap District, Ho Chi Minh City'
      ]
    } satisfies Localized<string[]>
  },

  hours: {
    opens: '08:00',
    closes: '21:30',
    /** schema.org dayOfWeek */
    days: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ]
  },

  social: {
    facebook: 'https://www.facebook.com/p/M%E1%BB%98T-LY-61577808062423/'
  },

  /** Link đặt hàng qua app. */
  delivery: {
    grabfood: {
      /**
       * Mã cửa hàng trên GrabFood, lấy từ deep link của quán:
       * grab://open?screenType=GRABFOOD&merchantIDs=5-C733R4BJRCBCJE
       * Trên điện thoại có cài Grab, nút sẽ mở thẳng app tới trang quán.
       */
      merchantId: '5-C733R4BJRCBCJE',
      /**
       * Trang web của quán trên food.grab.com, dùng cho máy tính hoặc điện thoại chưa cài Grab.
       * Chưa có link chính xác nên đang dùng trang GrabFood chung (kèm dòng nhắc tìm tên quán).
       * Khi có link dạng https://food.grab.com/vn/vi/restaurant/<ten-quan>-delivery/5-C733R4BJRCBCJE
       * thì dán vào đây và đặt webUrlIsStorePage = true để ẩn dòng nhắc.
       */
      webUrl: 'https://food.grab.com/vn/vi/',
      webUrlIsStorePage: false
    },
    /** Để trống thì nút ShopeeFood sẽ ẩn. */
    shopeefood: ''
  },

  images: {
    /** Logo nền trong suốt (tạo từ logo.jpg bằng `node scripts/process-logo.mjs`) */
    logo: '/images/logo.png',
    /** Bản logo nét màu kem, dùng trên nền xanh đậm */
    logoLight: '/images/logo-light.png',
    /** Kích thước của logo.png để next/image giữ đúng tỉ lệ */
    logoSize: { width: 640, height: 489 },
    hero: '/images/hero/hero-matcha.svg',
    about: '/images/about/about-shop.svg'
  },

  map: {
    embedUrl: (locale: string) =>
      `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&hl=${locale}&z=17&output=embed`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`
  }
} as const;

export type SiteConfig = typeof siteConfig;
