import { defineRouting } from 'next-intl/routing';
import { LOCALES } from '@/types';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'vi',
  localePrefix: 'always',
  // Vào "/" luôn chuyển sang /vi, không tự đoán theo ngôn ngữ trình duyệt.
  // Đổi thành true nếu muốn khách nước ngoài tự vào /en.
  localeDetection: false
});
