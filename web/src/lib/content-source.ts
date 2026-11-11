import { cache } from 'react';
import { featuredRecords } from '@/data/featured';
import { galleryImages } from '@/data/gallery';
import { menuItems } from '@/data/menu';
import { reviews } from '@/data/reviews';
import { mergeSettings, type SiteSettings } from '@/config/settings';
import type { FeaturedRecord, GalleryImageRecord, MenuItemRecord, ReviewRecord } from '@/types';

/** Tag cache của nội dung. API gọi /api/revalidate để làm mới tag này khi CMS lưu. */
export const CONTENT_TAG = 'content';
/** Dù không có ai lưu trong CMS, cache vẫn tự làm mới sau khoảng này (giây) */
const REVALIDATE_SECONDS = 3600;

export interface Content {
  menuItems: MenuItemRecord[];
  featuredRecords: FeaturedRecord[];
  galleryImages: GalleryImageRecord[];
  reviews: ReviewRecord[];
  settings: SiteSettings;
  /** "api" khi lấy từ API, "mock" khi dùng dữ liệu mẫu trong src/data */
  source: 'api' | 'mock';
}

/** Dữ liệu mẫu trong src/data (đọc lúc gọi để luôn lấy giá trị mới nhất) */
const mockContent = (): Content => ({
  menuItems,
  featuredRecords,
  galleryImages,
  reviews,
  settings: mergeSettings(null),
  source: 'mock'
});

const isList = (v: unknown) => Array.isArray(v);

/**
 * Nội dung website (chỉ gọi phía server). Có API_URL thì đọc từ API NestJS, cache theo tag;
 * không có API_URL hoặc API lỗi thì dùng dữ liệu mẫu để trang vẫn hiển thị.
 * `cache()` gộp các lần gọi trong cùng một request thành một.
 */
export const loadContent = cache(async (): Promise<Content> => {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) return mockContent();

  try {
    const res = await fetch(`${apiUrl.replace(/\/$/, '')}/public/content`, {
      next: { tags: [CONTENT_TAG], revalidate: REVALIDATE_SECONDS },
      // API free (Render) có thể đang ngủ: chờ tối đa 60 giây cho lần gọi đầu
      signal: AbortSignal.timeout(60_000)
    });
    if (!res.ok) throw new Error(`API trả về ${res.status}`);
    const json = (await res.json()) as Partial<Content>;
    if (![json.menuItems, json.featuredRecords, json.galleryImages, json.reviews].every(isList)) {
      throw new Error('API trả về dữ liệu sai cấu trúc');
    }
    return {
      menuItems: json.menuItems!,
      featuredRecords: json.featuredRecords!,
      galleryImages: json.galleryImages!,
      reviews: json.reviews!,
      settings: mergeSettings(json.settings),
      source: 'api'
    };
  } catch (error) {
    console.error('[content] Không đọc được API, dùng dữ liệu mẫu:', error);
    return mockContent();
  }
});

export const getSiteSettings = async () => (await loadContent()).settings;
