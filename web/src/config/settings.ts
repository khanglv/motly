import type { Locale, Localized } from '@/types';

/**
 * Thông tin quán chỉnh được trong CMS (trang /admin → Thông tin quán).
 * Web lấy bản mới nhất từ API; `defaultSettings` chỉ dùng khi chưa nối API hoặc API lỗi.
 * Giữ cùng cấu trúc với SiteSettingsDto bên api/src/settings/settings.dto.ts.
 */
export interface SiteSettings {
  /** Dạng E.164 cho link tel:, ví dụ +84388738680 */
  phone: string;
  /** Số hiển thị, ví dụ 0388 738 680 */
  phoneDisplay: string;
  address: {
    street: string;
    ward: string;
    district: string;
    city: string;
    /** Dòng địa chỉ hiển thị theo ngôn ngữ */
    lines: Localized<string[]>;
    /** Chuỗi tìm kiếm trên Google Maps (bản đồ nhúng + chỉ đường) */
    mapQuery: string;
  };
  hours: { opens: string; closes: string };
  social: { facebook: string };
  delivery: {
    grabfood: {
      /** Mã cửa hàng GrabFood, ví dụ 5-C733R4BJRCBCJE */
      merchantId: string;
      /** Trang của quán trên food.grab.com (cũng là Universal Link / App Link mở app Grab) */
      webUrl: string;
      /** false nếu webUrl là trang GrabFood chung (sẽ hiện dòng nhắc tìm tên quán) */
      webUrlIsStorePage: boolean;
    };
    /** Để trống thì nút ShopeeFood ẩn */
    shopeefood: string;
  };
}

export const defaultSettings: SiteSettings = {
  phone: '+84388738680',
  phoneDisplay: '0388 738 680',
  address: {
    street: '93 Trần Thị Nghỉ',
    ward: 'Phường Hạnh Thông',
    district: 'Gò Vấp',
    city: 'Thành phố Hồ Chí Minh',
    lines: {
      vi: ['93 Trần Thị Nghỉ, Phường Hạnh Thông (Phường 1 cũ)', 'Quận Gò Vấp, TP. Hồ Chí Minh'],
      en: ['93 Tran Thi Nghi St., Hanh Thong Ward (former Ward 1)', 'Go Vap District, Ho Chi Minh City']
    },
    mapQuery: '93 Trần Thị Nghỉ, Phường Hạnh Thông, Gò Vấp, Thành phố Hồ Chí Minh'
  },
  hours: { opens: '08:00', closes: '21:30' },
  social: { facebook: 'https://www.facebook.com/p/M%E1%BB%98T-LY-61577808062423/' },
  delivery: {
    grabfood: {
      merchantId: '5-C733R4BJRCBCJE',
      webUrl: 'https://food.grab.com/vn/vi/restaurant/online-delivery/5-C733R4BJRCBCJE',
      webUrlIsStorePage: true
    },
    shopeefood: ''
  }
};

/** Link Google Maps từ địa chỉ */
export function mapLinks(settings: SiteSettings, locale: Locale) {
  const q = encodeURIComponent(settings.address.mapQuery);
  return {
    embedUrl: `https://maps.google.com/maps?q=${q}&hl=${locale}&z=17&output=embed`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${q}`
  };
}

/** Gộp settings từ API với mặc định (API thiếu trường nào thì dùng giá trị mặc định) */
export function mergeSettings(partial: Partial<SiteSettings> | null | undefined): SiteSettings {
  if (!partial) return defaultSettings;
  return {
    ...defaultSettings,
    ...partial,
    address: { ...defaultSettings.address, ...partial.address },
    hours: { ...defaultSettings.hours, ...partial.hours },
    social: { ...defaultSettings.social, ...partial.social },
    delivery: {
      ...defaultSettings.delivery,
      ...partial.delivery,
      grabfood: { ...defaultSettings.delivery.grabfood, ...partial.delivery?.grabfood }
    }
  };
}
