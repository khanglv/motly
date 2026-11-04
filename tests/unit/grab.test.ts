import { describe, expect, it, vi } from "vitest";
import { buildGrabLinks, GRAB_FALLBACK_DELAY_MS, openGrab, type OpenGrabEnv } from "@/lib/grab";

const WEB = "https://food.grab.com/vn/vi/";
const links = buildGrabLinks("5-C733R4BJRCBCJE", WEB);

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148";
const ANDROID = "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36";
const MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0) AppleWebKit/537.36 Chrome/140.0 Safari/537.36";

function makeEnv(overrides: Partial<OpenGrabEnv> = {}) {
  let hiddenHandler: (() => void) | undefined;
  let timer: (() => void) | undefined;
  const env: OpenGrabEnv = {
    userAgent: IPHONE,
    isTouchDevice: true,
    navigate: vi.fn(),
    openNewTab: vi.fn(),
    isPageVisible: () => true,
    setTimeout: vi.fn((fn: () => void) => {
      timer = fn;
    }),
    onHidden: (fn) => {
      hiddenHandler = fn;
    },
    ...overrides,
  };
  return { env, runTimer: () => timer?.(), hide: () => hiddenHandler?.() };
}

describe("buildGrabLinks", () => {
  it("tạo deep link grab:// đúng mã cửa hàng", () => {
    expect(links.appUrl).toBe("grab://open?screenType=GRABFOOD&merchantIDs=5-C733R4BJRCBCJE");
  });

  it("tạo intent Android có package Grab và link web dự phòng", () => {
    expect(links.androidIntentUrl).toBe(
      "intent://open?screenType=GRABFOOD&merchantIDs=5-C733R4BJRCBCJE#Intent;scheme=grab;package=com.grabtaxi.passenger;" +
        `S.browser_fallback_url=${encodeURIComponent(WEB)};end`,
    );
  });
});

describe("openGrab", () => {
  it("máy tính: mở GrabFood web ở tab mới, không gọi grab://", () => {
    const { env } = makeEnv({ userAgent: MAC, isTouchDevice: false });
    expect(openGrab(links, env)).toBe("web-new-tab");
    expect(env.openNewTab).toHaveBeenCalledWith(WEB);
    expect(env.navigate).not.toHaveBeenCalled();
  });

  it("Android: dùng intent:// để Chrome tự mở app hoặc chuyển sang web", () => {
    const { env } = makeEnv({ userAgent: ANDROID });
    expect(openGrab(links, env)).toBe("android-intent");
    expect(env.navigate).toHaveBeenCalledWith(links.androidIntentUrl);
  });

  it("iPhone đã cài Grab: mở grab://, trang bị ẩn nên không chuyển sang web", () => {
    const { env, runTimer, hide } = makeEnv();
    expect(openGrab(links, env)).toBe("app-with-fallback");
    expect(env.navigate).toHaveBeenCalledWith(links.appUrl);
    expect(env.setTimeout).toHaveBeenCalledWith(expect.any(Function), GRAB_FALLBACK_DELAY_MS);

    hide();
    runTimer();
    expect(env.navigate).toHaveBeenCalledTimes(1);
  });

  it("iPhone chưa cài Grab: trang vẫn hiển thị thì chuyển sang GrabFood web", () => {
    const { env, runTimer } = makeEnv();
    openGrab(links, env);
    runTimer();
    expect(env.navigate).toHaveBeenLastCalledWith(WEB);
  });
});
