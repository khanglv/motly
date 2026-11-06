/**
 * 5 tông màu chủ đạo của website. Bảng màu chi tiết: src/styles/globals.css (matcha) và themes.css.
 * `swatch` chỉ dùng để hiển thị ô màu xem trước trong bộ chọn tông (chế độ dev).
 */
export const THEMES = [
  { id: 'matcha', name: 'Matcha tươi', swatch: ['#1b552d', '#3cac54', '#a6e27f'] },
  { id: 'uji', name: 'Uji truyền thống', swatch: ['#39491f', '#7f9a3a', '#bccd7c'] },
  { id: 'mint', name: 'Bạc hà', swatch: ['#16483f', '#26a488', '#7dd8c0'] },
  { id: 'hojicha', name: 'Hojicha', swatch: ['#523525', '#b07544', '#d8b28c'] },
  { id: 'sakura', name: 'Sakura', swatch: ['#6f2440', '#db5577', '#f2a5b7'] }
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === 'string' && THEMES.some((t) => t.id === value);
