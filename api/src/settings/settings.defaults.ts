import type { SiteSettingsDto } from './settings.dto.js';

/** Thông tin quán ban đầu (giống src/config/site.ts bên web). Dùng khi DB chưa có dòng settings. */
export const DEFAULT_SETTINGS: SiteSettingsDto = {
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
