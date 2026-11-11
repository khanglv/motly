import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const apiUrl = process.env.API_URL?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Ảnh upload từ CMS lên Cloudinary
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }]
  },
  // CMS (/admin) gọi API NestJS qua /cms-api để cookie đăng nhập là cookie cùng domain với web
  async rewrites() {
    return apiUrl ? [{ source: '/cms-api/:path*', destination: `${apiUrl}/:path*` }] : [];
  },
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Cache-Control', value: 'no-store' }
        ]
      }
    ];
  }
};

export default withNextIntl(nextConfig);
