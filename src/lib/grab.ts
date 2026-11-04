/**
 * Link mở cửa hàng trên app Grab.
 *
 * - `appUrl` (grab://...) là deep link của app Grab, chỉ hoạt động trên điện thoại đã cài app.
 * - Android: dùng `intent://` để Chrome tự mở app, hoặc chuyển sang `webUrl` nếu chưa cài app.
 * - iOS / trình duyệt khác: thử `grab://`, nếu sau một lúc trang vẫn còn hiển thị (app không mở)
 *   thì chuyển sang `webUrl`.
 * - Máy tính: không có app, mở `webUrl` ở tab mới.
 */

/** Package của app Grab trên Android */
const GRAB_ANDROID_PACKAGE = "com.grabtaxi.passenger";
/** Thời gian chờ app mở trước khi chuyển sang bản web */
export const GRAB_FALLBACK_DELAY_MS = 1600;

export interface GrabLinks {
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
    webUrl,
  };
}

export interface OpenGrabEnv {
  userAgent: string;
  isTouchDevice: boolean;
  navigate: (url: string) => void;
  openNewTab: (url: string) => void;
  /** true nếu trang vẫn đang hiển thị (app chưa được mở) */
  isPageVisible: () => boolean;
  setTimeout: (fn: () => void, ms: number) => unknown;
  /** Gọi khi trang bị ẩn (app đã mở) để huỷ chuyển hướng dự phòng */
  onHidden: (fn: () => void) => void;
}

export type GrabOpenStrategy = "android-intent" | "app-with-fallback" | "web-new-tab";

/** Mở cửa hàng trên Grab theo thiết bị. Trả về cách đã dùng (để test và debug). */
export function openGrab(links: GrabLinks, env: OpenGrabEnv): GrabOpenStrategy {
  if (!env.isTouchDevice) {
    env.openNewTab(links.webUrl);
    return "web-new-tab";
  }

  if (/Android/i.test(env.userAgent)) {
    env.navigate(links.androidIntentUrl);
    return "android-intent";
  }

  let cancelled = false;
  env.onHidden(() => {
    cancelled = true;
  });
  env.setTimeout(() => {
    if (!cancelled && env.isPageVisible()) env.navigate(links.webUrl);
  }, GRAB_FALLBACK_DELAY_MS);
  env.navigate(links.appUrl);
  return "app-with-fallback";
}
