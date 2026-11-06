/**
 * 5 tông màu chủ đạo của website. Bảng màu chi tiết: src/styles/globals.css (matcha) và themes.css.
 * `swatch` chỉ dùng để hiển thị ô màu xem trước trong bộ chọn tông (chế độ dev).
 */
export const THEMES = [
  { id: 'matcha', name: 'Matcha dịu (trend)', swatch: ['#eff3e4', '#74a662', '#d6b48f'] },
  { id: 'uji', name: 'Uji truyền thống', swatch: ['#f2eadb', '#3a5620', '#d9b56a'] },
  { id: 'matcha-butter', name: 'Matcha bơ sữa', swatch: ['#fbf1cf', '#55a243', '#f2cf5b'] },
  { id: 'avocado', name: 'Xanh bơ', swatch: ['#eef1c8', '#6b8c2b', '#c9996a'] },
  { id: 'butter', name: 'Bơ & matcha', swatch: ['#f9e9ad', '#a8932f', '#8cbc70'] }
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === 'string' && THEMES.some((t) => t.id === value);
