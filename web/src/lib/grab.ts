/**
 * Link mở cửa hàng trên Grab.
 *
 * `webUrl` là trang quán trên food.grab.com. Grab khai báo đường dẫn `/<nước>/<ngôn ngữ>/restaurant/*`
 * là Universal Link (iOS, file apple-app-site-association) và App Link (Android, assetlinks.json),
 * nên khi bấm vào link này trên điện thoại đã cài Grab, hệ điều hành mở thẳng app tới trang quán;
 * chưa cài app thì mở trang web của quán.
 *
 * - iPhone / iPad / điện thoại khác: để trình duyệt tự mở link web của quán (cùng tab).
 *   Không gọi `grab://` vì khi chưa cài app, Safari hiện hộp thoại lỗi "địa chỉ không hợp lệ".
 * - Android: dùng `intent://` để Chrome mở app Grab (cả trong trình duyệt của Facebook/Zalo);
 *   chưa cài app thì Chrome chuyển sang `webUrl`.
 * - Máy tính: mở `webUrl` ở tab mới.
 */

/** Package của app Grab trên Android */
const GRAB_ANDROID_PACKAGE = 'com.grabtaxi.passenger';

export interface GrabLinks {
  /** Deep link của app (grab://), dùng bên trong intent Android */
  appUrl: string;
  androidIntentUrl: string;
  webUrl: string;
}

export function buildGrabLinks(merchantId: string, webUrl: string): GrabLinks {
  const query = `screenType=GRABFOOD&merchantIDs=${encodeURIComponent(merchantId)}`;
  return {
    appUrl: `grab://open?${query}`,
    androidIntentUrl:
      `intent://open?${query}#Intent;scheme=grab;package=${GRAB_ANDROID_PACKAGE};` +
      `S.browser_fallback_url=${encodeURIComponent(webUrl)};end`,
    webUrl
  };
}

export type GrabOpenStrategy =
  /** Máy tính: mở trang web của quán ở tab mới */
  | 'web-new-tab'
  /** Android: intent:// mở app, chưa cài thì về trang web */
  | 'android-intent'
  /** iOS và thiết bị cảm ứng khác: để trình duyệt mở link web (Universal Link mở app nếu đã cài) */
  | 'native-link';

export interface GrabDevice {
  userAgent: string;
  /** true nếu thiết bị dùng cảm ứng là chính (matchMedia('(pointer: coarse)')) */
  isTouchDevice: boolean;
}

/** Chọn cách mở Grab theo thiết bị */
export function chooseGrabStrategy({
  userAgent,
  isTouchDevice
}: GrabDevice): GrabOpenStrategy {
  if (/Android/i.test(userAgent)) return 'android-intent';
  if (!isTouchDevice) return 'web-new-tab';
  return 'native-link';
}
