import Link from 'next/link';

// Trang 404 cho đường dẫn nằm ngoài segment [locale] (rất hiếm vì middleware tự thêm locale).
export default function GlobalNotFound() {
  return (
    <html lang="vi">
      <body className="flex min-h-screen items-center justify-center bg-cream p-6 text-center">
        <div className="space-y-4">
          <h1 className="font-display text-3xl text-matcha-900">404</h1>
          <p>Không tìm thấy trang · Page not found</p>
          <Link href="/" className="btn-primary">
            Một Ly Cafe&apos;s và Matcha
          </Link>
        </div>
      </body>
    </html>
  );
}
