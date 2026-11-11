import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import { display, sans } from '@/styles/fonts';
import { AdminProviders } from '@/admin/AdminProviders';

export const metadata: Metadata = {
  title: { default: 'CMS', template: `%s | CMS ${siteConfig.shortName}` },
  robots: { index: false, follow: false }
};

// Trang CMS dùng thẻ <html> riêng (website dùng app/[locale]/layout.tsx)
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" data-theme={siteConfig.theme} className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-ink antialiased">
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}
