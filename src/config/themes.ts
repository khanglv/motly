/**
 * 5 tông màu chủ đạo của website. Bảng màu chi tiết: src/styles/globals.css (matcha) và themes.css.
 * `swatch` chỉ dùng để hiển thị ô màu xem trước trong bộ chọn tông (chế độ dev).
 */
export const THEMES = [
  { id: 'matcha', name: 'Matcha dịu (trend)', swatch: ['#dce9cf', '#74a662', '#d6b48f'] },
  { id: 'uji', name: 'Uji truyền thống', swatch: ['#d3dca4', '#7f9a3a', '#bccd7c'] },
  { id: 'mint', name: 'Bạc hà', swatch: ['#ade3d3', '#26a488', '#7dd8c0'] },
  { id: 'hojicha', name: 'Hojicha', swatch: ['#e6cdad', '#b07544', '#d8b28c'] },
  { id: 'sakura', name: 'Sakura', swatch: ['#f7c7d2', '#db5577', '#f2a5b7'] }
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === 'string' && THEMES.some((t) => t.id === value);
