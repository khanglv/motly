'use client';

import { useEffect, useState } from 'react';

const SHOP_TIME_ZONE = 'Asia/Ho_Chi_Minh';

/** Đổi "08:00" thành số phút từ 00:00 */
const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Số phút từ 00:00 theo giờ Việt Nam tại thời điểm `date` */
export function minutesInShopTime(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SHOP_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get('hour') * 60 + get('minute');
}

/** Quán có đang mở cửa (theo giờ Việt Nam) không. Giờ mở cửa giống nhau mọi ngày. */
export function isOpenAt(date: Date, opens: string, closes: string): boolean {
  const now = minutesInShopTime(date);
  return now >= toMinutes(opens) && now < toMinutes(closes);
}

/**
 * Trạng thái mở cửa, cập nhật mỗi phút. Trả về null cho tới khi chạy trên trình duyệt
 * (tránh lệch giữa HTML server và client).
 */
export function useOpenStatus(opens: string, closes: string): boolean | null {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpenAt(new Date(), opens, closes));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [opens, closes]);

  return open;
}
