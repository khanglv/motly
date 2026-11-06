'use client';

import { useEffect, useState } from 'react';

/**
 * Trả về id của section đang nằm ở khoảng giữa màn hình (dùng để tô sáng mục menu đang xem).
 * Không có section nào trong vùng (ví dụ đang ở hero) thì trả về null.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        // Lấy section đầu tiên (theo thứ tự trên trang) đang chạm dải giữa màn hình
        setActive(ids.find((id) => visible.get(id)) ?? null);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
