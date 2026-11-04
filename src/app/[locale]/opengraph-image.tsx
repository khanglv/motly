import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Một Ly Café & Matcha';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Ảnh chia sẻ Facebook/Zalo. Muốn dùng ảnh chụp thật: xoá file này và đặt
// opengraph-image.jpg (1200×630) vào cùng thư mục.
// Lưu ý: Satori yêu cầu mỗi <div> có nhiều con phải có display: flex, nên text được ghép thành 1 chuỗi.
export default async function OpenGraphImage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'hero' });

  const tagline = `${t('title')} ${t('titleHighlight')}`;
  const info = `${siteConfig.address.street} · ${siteConfig.hours.opens} – ${siteConfig.hours.closes}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background:
          'linear-gradient(135deg, #0D3D1F 0%, #187538 65%, #3CAC54 100%)',
        color: '#FBF8EF'
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 28,
          letterSpacing: 8,
          color: '#A6E27F'
        }}
      >
        {'CAFÉ & MATCHA · GÒ VẤP'}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 112,
          fontWeight: 700,
          marginTop: 24
        }}
      >
        {siteConfig.shortName}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 44,
          marginTop: 16,
          color: '#A6E27F'
        }}
      >
        {tagline}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 28,
          marginTop: 48,
          color: '#CDF1B2'
        }}
      >
        {info}
      </div>
    </div>,
    size
  );
}
