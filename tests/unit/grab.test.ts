import { describe, expect, it } from 'vitest';
import { buildGrabLinks, chooseGrabStrategy } from '@/lib/grab';
import { siteConfig } from '@/config/site';

const WEB =
  'https://food.grab.com/vn/vi/restaurant/online-delivery/5-C733R4BJRCBCJE';
const links = buildGrabLinks('5-C733R4BJRCBCJE', WEB);

const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
const IPAD =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15';
const ANDROID =
  'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36';
const MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0) AppleWebKit/537.36 Chrome/140.0 Safari/537.36';

describe('buildGrabLinks', () => {
  it('tạo deep link grab:// đúng mã cửa hàng', () => {
    expect(links.appUrl).toBe(
      'grab://open?screenType=GRABFOOD&merchantIDs=5-C733R4BJRCBCJE'
    );
  });

  it('tạo intent Android có package Grab và link trang quán dự phòng', () => {
    expect(links.androidIntentUrl).toBe(
      'intent://open?screenType=GRABFOOD&merchantIDs=5-C733R4BJRCBCJE#Intent;scheme=grab;package=com.grabtaxi.passenger;' +
        `S.browser_fallback_url=${encodeURIComponent(WEB)};end`
    );
  });
});

describe('cấu hình GrabFood', () => {
  it('link web là trang của đúng quán (Universal Link của Grab)', () => {
    const { merchantId, webUrl, webUrlIsStorePage } =
      siteConfig.delivery.grabfood;
    expect(webUrlIsStorePage).toBe(true);
    expect(webUrl).toMatch(
      /^https:\/\/food\.grab\.com\/vn\/vi\/restaurant\/[^/]+\//
    );
    expect(webUrl.endsWith(`/${merchantId}`)).toBe(true);
  });
});

describe('chooseGrabStrategy', () => {
  it('máy tính: mở trang quán ở tab mới', () => {
    expect(chooseGrabStrategy({ userAgent: MAC, isTouchDevice: false })).toBe(
      'web-new-tab'
    );
  });

  it('Android: dùng intent:// để mở app hoặc về trang web', () => {
    expect(
      chooseGrabStrategy({ userAgent: ANDROID, isTouchDevice: true })
    ).toBe('android-intent');
  });

  it('iPhone: để Safari mở link quán (Universal Link), không gọi grab://', () => {
    expect(chooseGrabStrategy({ userAgent: IPHONE, isTouchDevice: true })).toBe(
      'native-link'
    );
  });

  it('iPad (UA giống Mac nhưng màn hình cảm ứng): cũng dùng link quán', () => {
    expect(chooseGrabStrategy({ userAgent: IPAD, isTouchDevice: true })).toBe(
      'native-link'
    );
  });
});
