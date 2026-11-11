# Ảnh của website

Toàn bộ ảnh trong thư mục này là **placeholder** (file SVG tự tạo). Khi có ảnh thật:

1. Đặt ảnh mới vào đúng thư mục (nên dùng `.jpg` hoặc `.webp`).
2. Sửa đường dẫn ở **một chỗ duy nhất**:
   - Logo: thay `logo.jpg` rồi chạy `node scripts/process-logo.mjs`
   - Hero, about: `src/config/site.ts` (mục `images`)
   - Ảnh món: `src/data/menu.ts` (trường `image`)
   - Gallery: `src/data/gallery.ts` (trường `src`, `width`, `height`)
3. Xoá file SVG placeholder cũ nếu không dùng nữa.

Ảnh `.jpg/.webp` sẽ được Next.js tự tối ưu (resize, chuyển AVIF/WebP).

| File | Dùng ở | Kích thước khuyến nghị |
| --- | --- | --- |
| `logo.jpg` | Logo gốc của quán. Sau khi thay, chạy `node scripts/process-logo.mjs` để tạo `logo.png` (nền trong suốt), `logo-light.png` (nét kem cho nền xanh) và favicon | Vuông, ≥ 1024px, nền trắng |
| `hero/hero-matcha.svg` | Ảnh lớn ở đầu trang | 1200×1500 (dọc 4:5) |
| `about/about-shop.svg` | Section giới thiệu | 1200×900 (ngang 4:3) |
| `menu/*.svg` | Thẻ món trong menu | 800×800 (vuông 1:1) |
| `gallery/gallery-01..08.svg` | Gallery | Cạnh dài ~1600px, tỉ lệ tuỳ ý (nhớ sửa `width`/`height`) |

Favicon (`src/app/icon.png`, `apple-icon.png`) được cắt từ đầu gấu trong logo bằng script trên; nếu đổi logo khác bố cục, chỉnh vùng `head` trong `scripts/process-logo.mjs`. Ảnh chia sẻ mạng xã hội (Open Graph) được tạo tự động từ `src/app/[locale]/opengraph-image.tsx`.

Tạo lại toàn bộ placeholder: `node scripts/generate-placeholders.mjs`.
