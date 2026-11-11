import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import { display, sans } from '@/styles/fonts';
import { siteConfig } from '@/config/site';
import { Header } from '@/components/layout/Header';
import { SiteSettingsProvider } from '@/components/providers/SiteSettingsProvider';
import { getSiteSettings } from '@/lib/content-source';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { THEMES } from '@/config/themes';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { MotionProvider } from '@/components/providers/MotionProvider';

// Font tiêu đề nét tròn, hợp với logo vẽ tay; có dấu tiếng Việt.

/** Bộ chọn tông màu chỉ hiện khi dev, hoặc khi đặt NEXT_PUBLIC_THEME_PREVIEW=1 (ví dụ bản preview trên Vercel) */
const SHOW_THEME_SWITCHER =
  process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_THEME_PREVIEW === '1';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  // Màu thanh trình duyệt trên điện thoại, theo tông đang chọn
  themeColor: THEMES.find((t) => t.id === siteConfig.theme)?.swatch[0] ?? '#1b552d'
};

export async function generateMetadata({
  params
}: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t('title'), template: `%s | ${siteConfig.name}` },
    description: t('description'),
    applicationName: siteConfig.name,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        vi: '/vi',
        en: '/en',
        'x-default': '/vi'
      }
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title: t('title'),
      description: t('description'),
      url: `/${locale}`,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? ['en_US'] : ['vi_VN']
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description')
    },
    formatDetection: { telephone: false }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'nav' });
  const settings = await getSiteSettings();

  return (
    <html
      lang={locale}
      data-theme={siteConfig.theme}
      className={`${display.variable} ${sans.variable}`}
    >
      <body id="top">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-matcha-900 px-5 py-3 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t('skip')}
        </a>
        <SiteSettingsProvider settings={settings}>
        <NextIntlClientProvider>
          <QueryProvider>
            <MotionProvider>
              <Header />
              <main id="main" tabIndex={-1} className="outline-none">
                {children}
              </main>
              <Footer locale={locale} />
              <ScrollToTop />
              {SHOW_THEME_SWITCHER && <ThemeSwitcher />}
            </MotionProvider>
          </QueryProvider>
        </NextIntlClientProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
