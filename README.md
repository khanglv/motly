# Một Ly Cafe's và Matcha

Website của quán (song ngữ vi/en) và trang CMS để nhập nội dung. Gồm hai project độc lập:

| Thư mục | Nội dung | Công nghệ | Host |
| --- | --- | --- | --- |
| [`web/`](web) | Website + trang CMS `/admin` | Next.js 15, React Query, Zustand, Tailwind, Radix, next-intl | Vercel |
| [`api/`](api) | API nội dung + đăng nhập CMS | NestJS 12, Prisma 7, PostgreSQL | Render (free) + Neon (database + lưu ảnh, free) |

Mỗi project có `package.json`, lockfile, `.env` và lệnh riêng. Hai bên chỉ nói chuyện qua HTTP:

```
Trình duyệt ──► web (Vercel) ──server──► api  GET /public/content   (cache, tag "content")
   │                ▲                     │
   │  /admin        └── POST /api/revalidate (khi CMS lưu)
   └──► /cms-api/* ──rewrite──► api  /auth/*, /admin/*   (cookie đăng nhập httpOnly)
```

- Web đọc nội dung từ API phía server và cache. CMS lưu xong thì API gọi `/api/revalidate` của web, trang chủ cập nhật sau vài giây.
- Chưa đặt `API_URL` hoặc API lỗi thì web dùng dữ liệu mẫu trong `web/src/data`, nên web vẫn chạy độc lập.

Yêu cầu: Node.js ≥ 22.15, pnpm, Docker (để chạy Postgres khi dev).

> Mạng có proxy kiểm tra SSL (lỗi `SELF_SIGNED_CERT_IN_CHAIN`)? Thêm `NODE_OPTIONS=--use-system-ca` trước các lệnh `pnpm build`, `prisma`. Không tắt kiểm tra SSL.

## Chạy trên máy

```bash
# 1. API + database
cd api
cp .env.example .env          # đổi JWT_SECRET, ADMIN_PASSWORD, REVALIDATE_SECRET
pnpm install
pnpm db:up                    # Postgres trong Docker (cổng 5433)
pnpm db:migrate               # tạo bảng
pnpm db:seed                  # dữ liệu mẫu + tài khoản admin
pnpm dev                      # http://localhost:4000

# 2. Web (terminal khác)
cd web
cp .env.example .env.local    # API_URL=http://localhost:4000, REVALIDATE_SECRET giống bên api
pnpm install
pnpm dev                      # http://localhost:3000 · CMS: http://localhost:3000/admin
```

Đăng nhập CMS bằng `ADMIN_EMAIL` / `ADMIN_PASSWORD` trong `api/.env`. Đổi mật khẩu trong CMS → **Tài khoản**.

## Lệnh

| | `web/` | `api/` |
| --- | --- | --- |
| Dev | `pnpm dev` | `pnpm dev` |
| Build / chạy | `pnpm build` · `pnpm start` | `pnpm build` · `pnpm start` |
| Kiểm tra | `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm test:e2e` | `pnpm typecheck` |
| Database | | `pnpm db:migrate` (tạo migration khi sửa schema) · `pnpm db:deploy` (áp dụng trên production) · `pnpm db:seed` · `pnpm db:studio` |

E2E của web luôn chạy với dữ liệu mẫu (không cần API). Lần đầu chạy: `pnpm exec playwright install chromium`.

## CMS (`/admin`)

| Trang | Sửa được |
| --- | --- |
| Menu | Thêm/sửa/xoá món, giá, ảnh, nhãn, ẩn/hiện, thứ tự trong nhóm |
| Món nổi bật | Gắn với một món, tiêu đề, câu chuyện, điểm nổi bật, nhãn, màu thẻ, hẹn ngày bắt đầu/kết thúc |
| Hình ảnh | Ảnh gallery, mô tả, thứ tự, ẩn/hiện |
| Đánh giá | Tên khách, số sao, nội dung, ngày, nguồn |
| Thông tin quán | Điện thoại, địa chỉ, giờ mở cửa, Facebook, GrabFood, ShopeeFood |
| Tài khoản | Đổi mật khẩu |

**Ảnh:** lưu trên Neon Object Storage (cùng project với database, free 5 GB). Đặt các biến `AWS_*` và `STORAGE_BUCKET` trong `api/.env` thì CMS có nút **Tải ảnh lên**: API ký một link upload hết hạn sau 5 phút, trình duyệt gửi ảnh thẳng lên Neon (khoá truy cập không ra tới trình duyệt). Chỉ nhận JPG, PNG, WebP, AVIF, GIF, tối đa 8 MB. Chưa đặt biến thì chỉ dán được link `/images/...` (ảnh có sẵn trong `web/public/images`). Neon Object Storage đang ở bản beta.

**Bảo mật:** 1 tài khoản admin, mật khẩu bcrypt, phiên JWT 7 ngày trong cookie httpOnly (SameSite=Lax, Secure khi production), giới hạn 5 lần đăng nhập/phút/IP, dữ liệu gửi lên được kiểm tra chặt (sai trường hoặc thừa trường đều bị từ chối). Trang `/admin` không cho Google index.

## Deploy

Làm theo thứ tự: database → API → web.

**1. Neon (database + lưu ảnh, free)**
1. Tạo project tại [neon.tech](https://neon.tech), region **AWS Asia Pacific (Singapore)** (vùng có Object Storage).
2. **Connection details**: chuỗi có `-pooler` trong host → `DATABASE_URL`; cùng chuỗi bỏ `-pooler` → `DIRECT_URL`. Nên đổi `sslmode=require` thành `sslmode=verify-full`.
3. Tab **Object storage** của nhánh `main` → **New bucket**, tên `motly-images`, Access **public_read** (không đổi được sau khi tạo).
4. Tạo credential có quyền `storage:read` và `storage:write` (Neon CLI: `neon credentials create --scope storage:read --scope storage:write`). Credential chỉ hiện một lần, lưu lại ngay: `token_id` → `AWS_ACCESS_KEY_ID`, `s3_secret_access_key` → `AWS_SECRET_ACCESS_KEY`.
5. Lấy endpoint của nhánh (`neon env pull` hoặc trang Object storage) → `AWS_ENDPOINT_URL_S3`, `AWS_REGION=ap-southeast-1`.
6. Link ảnh gắn với nhánh `main`: không xoá hay reset nhánh này, nếu không link ảnh cũ sẽ hỏng.

**2. Render (API, free)**
1. Tạo tài khoản tại [render.com](https://render.com) → **New → Blueprint** → chọn repo. Render đọc `render.yaml`.
2. Nhập các biến: `DATABASE_URL`, `DIRECT_URL`, `WEB_URL` (domain web), `REVALIDATE_SECRET` (chuỗi ngẫu nhiên, ví dụ `openssl rand -hex 24`), `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`. `JWT_SECRET` Render tự tạo.
3. Sau khi deploy xong, tạo tài khoản admin và dữ liệu mẫu một lần, chạy trên máy:
   ```bash
   cd api
   DIRECT_URL="<Direct connection Neon>" ADMIN_EMAIL="..." ADMIN_PASSWORD="..." pnpm db:seed
   ```
4. Gói free tự ngủ sau 15 phút không có truy cập, lần gọi đầu mất 30–50 giây. Trang chủ không bị ảnh hưởng (web có cache), chỉ lần mở CMS đầu tiên bị chậm.

**3. Vercel (web)**
1. **Add New → Project**, import repo, đặt **Root Directory** = `web`.
2. Biến môi trường: `NEXT_PUBLIC_SITE_URL` (domain chính thức), `API_URL` (URL Render, ví dụ `https://motly-api.onrender.com`), `REVALIDATE_SECRET` (giống bên Render).
3. Deploy. Gắn domain xong, gửi `https://<domain>/sitemap.xml` lên Google Search Console.

## Cấu trúc chính

**web/**

| Đường dẫn | Nội dung |
| --- | --- |
| `src/config/site.ts` | Tên quán, tông màu, logo, ảnh hero |
| `src/config/settings.ts` | Kiểu và giá trị mặc định của thông tin quán (bản thật sửa trong CMS) |
| `src/lib/content-source.ts` | Đọc nội dung từ API (cache theo tag), dự phòng bằng dữ liệu mẫu |
| `src/lib/data-service.ts` | Chọn ngôn ngữ, lọc, sắp xếp dữ liệu cho giao diện |
| `src/data/*` | Dữ liệu mẫu (dùng khi không có API và trong test) |
| `src/app/admin/*` · `src/admin/*` | Trang CMS |
| `src/app/api/revalidate` | Nhận tín hiệu làm mới cache từ API |
| `messages/vi.json` · `en.json` | Chữ trên giao diện website |
| `src/styles/` | Tailwind tokens, 5 tông màu (`themes.css`), SCSS |

**api/**

| Đường dẫn | Nội dung |
| --- | --- |
| `prisma/schema.prisma` | Bảng: Admin, MenuItem, Featured, GalleryImage, Review, SiteSettings |
| `prisma/seed.ts` · `prisma/seed-data/*.json` | Dữ liệu ban đầu + tài khoản admin |
| `src/content/` | `GET /public/content`, `GET /health`, gọi revalidate web |
| `src/admin/` | CRUD cho CMS (`/admin/menu`, `featured`, `gallery`, `reviews`, `settings`) |
| `src/auth/` | `/auth/login`, `logout`, `me`, `password` |
| `src/uploads/` | Ký link upload ảnh lên Neon Object Storage |

**Đổi tông màu:** sửa `theme` trong `web/src/config/site.ts` (`matcha`, `uji`, `matcha-butter`, `avocado`, `butter`). Khi `pnpm dev` có nút "Tông màu" góc dưới trái để xem trước.

**Sửa chữ trên giao diện:** sửa cùng key trong `web/messages/vi.json` và `en.json` (test báo lỗi nếu lệch key).
