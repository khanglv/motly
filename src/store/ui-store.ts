import { create } from "zustand";
import type { MenuFilter } from "@/types";

export const DEFAULT_MENU_FILTER: MenuFilter = "matcha";

export interface UIState {
  /** Danh mục menu đang chọn */
  activeCategory: MenuFilter;
  setActiveCategory: (category: MenuFilter) => void;

  /** Vị trí ảnh đang mở trong lightbox, null = đóng */
  lightboxIndex: number | null;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  nextImage: (total: number) => void;
  prevImage: (total: number) => void;

  /** Menu điều hướng trên mobile */
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

export const initialUIState = {
  activeCategory: DEFAULT_MENU_FILTER,
  lightboxIndex: null,
  mobileNavOpen: false,
} satisfies Partial<UIState>;

export const useUIStore = create<UIState>()((set) => ({
  ...initialUIState,

  setActiveCategory: (activeCategory) => set({ activeCategory }),

  openLightbox: (index) => set({ lightboxIndex: index }),
  closeLightbox: () => set({ lightboxIndex: null }),
  nextImage: (total) =>
    set((s) => (s.lightboxIndex === null || total <= 0 ? s : { lightboxIndex: (s.lightboxIndex + 1) % total })),
  prevImage: (total) =>
    set((s) =>
      s.lightboxIndex === null || total <= 0 ? s : { lightboxIndex: (s.lightboxIndex - 1 + total) % total },
    ),

  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
}));
