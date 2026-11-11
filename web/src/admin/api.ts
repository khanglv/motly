'use client';

/** Lỗi trả về từ API (message đã gộp thành một chuỗi dễ đọc) */
export class CmsApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

/**
 * Gọi API NestJS qua proxy /cms-api (rewrite trong next.config.ts).
 * Cookie đăng nhập httpOnly được trình duyệt tự gửi kèm.
 */
export async function cmsFetch<T = unknown>(
  path: string,
  init: { method?: string; body?: unknown } = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/cms-api${path}`, {
      method: init.method ?? 'GET',
      headers: init.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      credentials: 'same-origin',
      cache: 'no-store'
    });
  } catch {
    throw new CmsApiError('Không kết nối được API. Kiểm tra API đã chạy chưa.', 0);
  }

  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
  if (!res.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join('. ')
      : (data?.message ??
        (res.status === 404 ? 'API chưa được cấu hình (thiếu API_URL ở web)' : `Lỗi ${res.status}`));
    if (res.status === 401 && !path.startsWith('/auth/')) {
      window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new CmsApiError(message, res.status);
  }
  return data as T;
}

/* ---------- Kiểu dữ liệu trả về từ API admin ---------- */

export type Localized<T = string> = { vi: T; en: T };

export interface AdminMenuItem {
  id: string;
  category: 'matcha' | 'coffee' | 'bakery';
  name: Localized;
  description: Localized;
  price: number;
  image: string;
  tags: string[];
  order: number;
  active: boolean;
}

export interface AdminFeatured {
  id: string;
  menuItemId: string;
  headline: Localized;
  story: Localized;
  highlights: Localized<string[]>;
  badge: Localized | null;
  image: string | null;
  theme: 'matcha' | 'sakura' | 'cream';
  order: number;
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

export interface AdminGalleryImage {
  id: string;
  src: string;
  alt: Localized;
  width: number;
  height: number;
  order: number;
  active: boolean;
}

export interface AdminReview {
  id: string;
  author: string;
  rating: number;
  content: Localized;
  date: string;
  source: 'Google' | 'Facebook';
  active: boolean;
}
