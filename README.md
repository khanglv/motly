# Tech

- Sử dụng Nextjs
- Zustand, react query,
- Tailwind, radix, scss, lib animation ...
- Call api with fetch

# Chạy project

Yêu cầu: Node.js >= 20.19 (Vitest 5 / Vite 8 cần bản này) và pnpm. Copy `.env.example` thành `.env.local` nếu muốn đặt domain.

```bash
pnpm install        # cài thư viện
pnpm dev            # chạy dev tại http://localhost:3000
pnpm build          # build production
pnpm start          # chạy bản build
pnpm lint           # kiểm tra lint
pnpm typecheck      # kiểm tra TypeScript
pnpm test           # unit test (Vitest)
pnpm test:e2e       # E2E test (Playwright), lần đầu chạy: pnpm exec playwright install chromium
```

> **Lỗi `SELF_SIGNED_CERT_IN_CHAIN` khi build (không tải được Google Fonts)?** Mạng đang dùng proxy/VPN kiểm tra SSL.
> Cho Node dùng kho chứng chỉ của macOS: `NODE_OPTIONS=--use-system-ca pnpm build` (cần Node 22.15+ / 23.8+).
> Không tắt kiểm tra SSL (`NODE_TLS_REJECT_UNAUTHORIZED=0`). Trên Vercel không gặp lỗi này.

# Cấu trúc chính

| Đường dẫn                                        | Nội dung                                                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `src/config/site.ts`                             | Tên quán, địa chỉ, giờ mở cửa, SĐT, Facebook, link GrabFood/ShopeeFood, đường dẫn logo/hero |
| `src/data/menu.ts` · `reviews.ts` · `gallery.ts` | Dữ liệu menu, đánh giá, gallery (song ngữ)                                                  |
| `messages/vi.json` · `en.json`                   | Toàn bộ chữ trên giao diện                                                                  |
| `src/app/api/*`                                  | Mock API: `/api/menu?locale=&category=`, `/api/reviews?locale=`, `/api/gallery?locale=`     |
| `src/lib/data-service.ts`                        | Lớp đọc dữ liệu dùng chung cho API và prefetch phía server                                  |
| `src/components/sections/*`                      | Các section của trang                                                                       |
| `src/store/ui-store.ts`                          | Zustand: danh mục menu đang chọn, lightbox, menu mobile                                     |
| `src/styles/`                                    | Tailwind tokens (`globals.css`), SCSS (`_tokens.scss`, `decor.module.scss`)                 |
| `public/images/`                                 | Logo và ảnh placeholder, xem `public/images/README.md`                                      |

# Hướng dẫn chỉnh sửa

**Thay ảnh và logo:** xem [`public/images/README.md`](public/images/README.md). Tóm tắt: chép ảnh mới vào `public/images/...` rồi sửa đường dẫn ở `src/config/site.ts` (logo, hero, about), `src/data/menu.ts` (ảnh món) hoặc `src/data/gallery.ts` (nhớ sửa `width`/`height`).

**Sửa thông tin quán:** chỉ cần sửa `src/config/site.ts`. Header, footer, section Liên hệ, bản đồ, JSON-LD (Google) đều đọc từ file này. Điền `delivery.grabfood` / `delivery.shopeefood` thì nút đặt hàng tương ứng sẽ tự hiện.

**Sửa menu:** thêm/sửa phần tử trong `src/data/menu.ts`. Mỗi món có `name` và `description` cho cả `vi` và `en`, `price` tính bằng VND, `tags` là `signature`, `best-seller` hoặc `new`.

**Sửa chữ / thêm bản dịch:** sửa cùng một key trong cả `messages/vi.json` và `messages/en.json`. Test `tests/unit/messages.test.ts` sẽ báo lỗi nếu hai file lệch key. Thêm ngôn ngữ mới: thêm mã vào `LOCALES` trong `src/types/index.ts`, tạo `messages/<mã>.json`, thêm bản dịch trong `src/data/*` và `site.ts`.

**Chuyển sang API thật:** sửa phần thân các hàm trong `src/lib/data-service.ts` (hoặc trỏ `apiFetch` trong hooks sang URL mới). Giao diện không cần đổi.

# Deploy lên Vercel

1. Đẩy code lên GitHub/GitLab.
2. Trên [vercel.com](https://vercel.com) chọn **Add New → Project**, import repo. Vercel tự nhận Next.js và pnpm.
3. Thêm biến môi trường `NEXT_PUBLIC_SITE_URL` = domain chính thức (ví dụ `https://motly.vn`). Nếu chưa có domain có thể bỏ trống.
4. Bấm **Deploy**. Sau khi gắn domain, vào Google Search Console gửi `https://<domain>/sitemap.xml`.
