import { featuredRecords } from "@/data/featured";
import { galleryImages } from "@/data/gallery";
import { menuItems } from "@/data/menu";
import { reviews } from "@/data/reviews";
import {
  LOCALES,
  MENU_FILTERS,
  type FeaturedItem,
  type FeaturedRecord,
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

/** Mục nổi bật có đang trong thời gian hiển thị không */
function isLive(record: FeaturedRecord, now: Date) {
  if (!record.active) return false;
  if (record.startsAt && new Date(record.startsAt) > now) return false;
  if (record.endsAt && new Date(record.endsAt) < now) return false;
  return true;
}

/**
 * Menu nổi bật: lọc mục đang bật và trong thời gian chạy, sắp theo `order`,
 * gộp thông tin món (tên, giá, ảnh) từ menu. Mục trỏ tới món không tồn tại sẽ bị bỏ qua.
 */
export function getFeatured(locale: Locale, now: Date = new Date()): FeaturedItem[] {
  const menuById = new Map(getMenu(locale).map((item) => [item.id, item]));

  return featuredRecords
    .filter((record) => isLive(record, now))
    .sort((a, b) => a.order - b.order)
    .flatMap((record) => {
      const item = menuById.get(record.menuItemId);
      if (!item) return [];
      return [
        {
          id: record.id,
          headline: record.headline[locale],
          story: record.story[locale],
          highlights: record.highlights[locale],
          badge: record.badge?.[locale],
          image: record.image ?? item.image,
          theme: record.theme,
          item,
        },
      ];
    });
}
