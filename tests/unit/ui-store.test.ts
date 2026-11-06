import { beforeEach, describe, expect, it } from "vitest";
import { initialUIState, useUIStore } from "@/store/ui-store";

const state = () => useUIStore.getState();

describe("ui-store", () => {
  beforeEach(() => useUIStore.setState(initialUIState));

  it("mặc định xem tất cả danh mục, lightbox và menu mobile đóng", () => {
    expect(state().activeCategory).toBe("all");
    expect(state().lightboxIndex).toBeNull();
    expect(state().mobileNavOpen).toBe(false);
  });

  it("đổi danh mục", () => {
    state().setActiveCategory("bakery");
    expect(state().activeCategory).toBe("bakery");
  });

  it("mở, chuyển vòng và đóng lightbox", () => {
    state().openLightbox(2);
    state().nextImage(3);
    expect(state().lightboxIndex).toBe(0);
    state().prevImage(3);
    expect(state().lightboxIndex).toBe(2);
    state().closeLightbox();
    expect(state().lightboxIndex).toBeNull();
  });

  it("next/prev không làm gì khi lightbox đang đóng", () => {
    state().nextImage(5);
    state().prevImage(5);
    expect(state().lightboxIndex).toBeNull();
  });

  it("bật/tắt menu mobile", () => {
    state().setMobileNavOpen(true);
    expect(state().mobileNavOpen).toBe(true);
  });
});
