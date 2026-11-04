import Image from 'next/image';
import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import type { Locale } from '@/types';
import { ArrowUpIcon, FacebookIcon, PhoneIcon } from '@/components/ui/icons';
import { Waves } from '@/components/ui/decor';
import decor from '@/styles/decor.module.scss';
import { NAV_ITEMS } from './nav-items';

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tLoc = await getTranslations({ locale, namespace: 'location' });
  const year = new Date().getFullYear();

  return (
    <footer
      className={clsx(
        decor.grain,
        'relative overflow-hidden bg-matcha-950 pt-24 text-matcha-100'
      )}
    >
      {/* Sóng nối từ section phía trên (matcha-100/50 trên nền cream) */}
      <Waves className="top-0 rotate-180" fill="var(--color-matcha-50)" />

      <div className="container-page relative">
        {/* Câu chào lớn + nút gọi */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-cream/10 pb-14 md:flex-row md:items-end">
          <p className="font-display text-5xl leading-[0.95] font-extrabold text-cream sm:text-7xl lg:text-8xl">
            {t('bigText')}
          </p>
          <a
            href={`tel:${siteConfig.phone}`}
            className="btn-fresh shrink-0 px-7 py-4 text-base"
          >
            <PhoneIcon width={18} height={18} />
            {siteConfig.phoneDisplay}
          </a>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Image
              src={siteConfig.images.logoLight}
              alt={siteConfig.name}
              width={siteConfig.images.logoSize.width}
              height={siteConfig.images.logoSize.height}
              sizes="10rem"
              className="h-auto w-36 -rotate-3"
            />
            <p className="max-w-xs text-sm text-matcha-300">{t('tagline')}</p>
          </div>

          <nav aria-label={tNav('main')}>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/${locale}#${item.id}`}
                    className="inline-block transition-[translate,color] hover:translate-x-1 hover:text-matcha-300 motion-reduce:transition-none"
                  >
                    {tNav(item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-2 text-sm">
            <h2 className="font-display text-sm font-bold tracking-[0.2em] text-matcha-400 uppercase">
              {t('contact')}
            </h2>
            <address className="not-italic">
              {siteConfig.address.lines[locale].map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <a
              href={`tel:${siteConfig.phone}`}
              className="block hover:text-cream hover:underline"
            >
              {siteConfig.phoneDisplay}
            </a>
            <p>
              <span className="text-matcha-400">{t('hours')}: </span>
              {siteConfig.hours.opens} – {siteConfig.hours.closes},{' '}
              {tLoc('everyday')}
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <h2 className="font-display text-sm font-bold tracking-[0.2em] text-matcha-400 uppercase">
              {t('follow')}
            </h2>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-light px-4 py-2"
            >
              <FacebookIcon width={18} height={18} />
              {t('facebook')}
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-cream/10">
        <div className="container-page flex items-center justify-between gap-4 py-5 text-xs text-matcha-300">
          <p>{t('rights', { year })}</p>
          <a
            href="#top"
            className="inline-flex items-center gap-1 hover:text-cream"
          >
            <ArrowUpIcon width={14} height={14} />
            {t('backToTop')}
          </a>
        </div>
      </div>
    </footer>
  );
}
