export const LOCALES = ["vi", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Giá trị có bản dịch cho từng ngôn ngữ */
export type Localized<T = string> = Record<Locale, T>;

export const MENU_CATEGORIES = ["matcha", "coffee", "bakery"] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];
export type MenuFilter = MenuCategory | "all";
export const MENU_FILTERS: readonly MenuFilter[] = ["all", ...MENU_CATEGORIES];

export type MenuTag = "signature" | "best-seller" | "new";

/** Bản ghi gốc trong src/data (đủ hai ngôn ngữ) */
export interface MenuItemRecord {
  id: string;
  category: MenuCategory;
  name: Localized;
  description: Localized;
  /** Giá theo VND */
  price: number;
  image: string;
  tags: MenuTag[];
}

/** Món đã chọn ngôn ngữ, trả về từ API */
export interface MenuItem extends Omit<MenuItemRecord, "name" | "description"> {
  name: string;
  description: string;
}

export interface ReviewRecord {
  id: string;
  author: string;
  /** 1 – 5 */
  rating: number;
  content: Localized;
  /** ISO date, ví dụ 2026-09-12 */
  date: string;
  source: "Google" | "Facebook";
}

export interface Review extends Omit<ReviewRecord, "content"> {
  content: string;
}

export interface GalleryImageRecord {
  id: string;
  src: string;
  alt: Localized;
  width: number;
  height: number;
}

export interface GalleryImage extends Omit<GalleryImageRecord, "alt"> {
  alt: string;
}

export interface ApiList<T> {
  data: T[];
}

/* ---------- Menu nổi bật (sau này nhập từ CMS) ---------- */

export const FEATURED_THEMES = ["matcha", "sakura", "cream"] as const;
export type FeaturedTheme = (typeof FEATURED_THEMES)[number];

/**
 * Một mục "menu nổi bật". Cấu trúc này giống một collection trong CMS:
 * mỗi mục trỏ tới một món trong menu (menuItemId) và thêm nội dung quảng bá riêng.
 */
export interface FeaturedRecord {
  id: string;
  /** id của món trong src/data/menu.ts (sau này là quan hệ tới collection Menu trong CMS) */
  menuItemId: string;
  /** Tiêu đề quảng bá, ví dụ "Món phải thử mùa này" */
  headline: Localized;
  /** Đoạn mô tả dài hơn mô tả trong menu */
  story: Localized;
  /** Vài điểm nổi bật ngắn, hiển thị dạng chip */
  highlights: Localized<string[]>;
  /** Nhãn nhỏ góc ảnh, ví dụ "Mới", "Giới hạn" (không bắt buộc) */
  badge?: Localized;
  /** Ảnh riêng cho mục nổi bật; bỏ trống thì dùng ảnh của món */
  image?: string;
  theme: FeaturedTheme;
  /** Số nhỏ hiện trước */
  order: number;
  /** Tắt để ẩn mà không cần xoá */
  active: boolean;
  /** Thời gian hiển thị (ISO). Bỏ trống = không giới hạn */
  startsAt?: string;
  endsAt?: string;
}

/** Mục nổi bật đã chọn ngôn ngữ và gộp thông tin món, trả về từ API */
export interface FeaturedItem {
  id: string;
  headline: string;
  story: string;
  highlights: string[];
  badge?: string;
  image: string;
  theme: FeaturedTheme;
  item: MenuItem;
}
