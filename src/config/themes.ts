/**
 * 5 tông màu chủ đạo của website. Bảng màu chi tiết: src/styles/globals.css (matcha) và themes.css.
 * `swatch` chỉ dùng để hiển thị ô màu xem trước trong bộ chọn tông (chế độ dev).
 */
export const THEMES = [
  { id: 'matcha', name: 'Matcha dịu (trend)', swatch: ['#dce9cf', '#74a662', '#d6b48f'] },
  { id: 'uji', name: 'Uji truyền thống', swatch: ['#d3dca4', '#7f9a3a', '#bccd7c'] },
  { id: 'matcha-butter', name: 'Matcha bơ sữa', swatch: ['#f7e9b5', '#74a662', '#f1d27a'] },
  { id: 'avocado', name: 'Xanh bơ', swatch: ['#e2ecb6', '#7ea33a', '#e2c48f'] },
  { id: 'butter', name: 'Bơ & matcha', swatch: ['#f6e6a6', '#a8932f', '#9cc27f'] }
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === 'string' && THEMES.some((t) => t.id === value);
