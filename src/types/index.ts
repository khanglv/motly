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
