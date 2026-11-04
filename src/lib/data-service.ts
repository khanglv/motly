import { galleryImages } from "@/data/gallery";
import { menuItems } from "@/data/menu";
import { reviews } from "@/data/reviews";
import {
  LOCALES,
  MENU_FILTERS,
  type GalleryImage,
  type Locale,
  type MenuFilter,
  type MenuItem,
  type Review,
} from "@/types";

/**
 * Lớp truy cập dữ liệu dùng chung cho Route Handlers và prefetch phía server.
 * Khi chuyển sang API/CMS thật, chỉ cần thay phần thân các hàm này.
 */

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);

export const isMenuFilter = (value: unknown): value is MenuFilter =>
  typeof value === "string" && (MENU_FILTERS as readonly string[]).includes(value);

export function getMenu(locale: Locale, category: MenuFilter = "all"): MenuItem[] {
  return menuItems
    .filter((item) => category === "all" || item.category === category)
    .map(({ name, description, ...rest }) => ({
      ...rest,
      name: name[locale],
      description: description[locale],
    }));
}

export function getReviews(locale: Locale): Review[] {
  return [...reviews]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ content, ...rest }) => ({ ...rest, content: content[locale] }));
}

export function getGallery(locale: Locale): GalleryImage[] {
  return galleryImages.map(({ alt, ...rest }) => ({ ...rest, alt: alt[locale] }));
}
