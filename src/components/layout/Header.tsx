'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { m, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { NAV_ITEMS } from './nav-items';

/** Thanh "matcha" chạy theo tiến độ cuộn trang */
function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });
  return (
    <m.div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-linear-to-r from-matcha-500 via-matcha-400 to-matcha-300"
      style={{ scaleX: reduceMotion ? scrollYProgress : scaleX }}
    />
  );
}

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Trang chủ có hero nền xanh đậm nên header trong suốt lúc ở đầu trang; trang khác luôn có nền.
  const solid = scrolled || pathname !== '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 text-on-surface transition-[background-color,box-shadow,backdrop-filter] duration-300',
        solid
          ? 'bg-surface/90 shadow-[0_10px_30px_-15px_rgb(0_0_0/0.5)] backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link
          href="/"
          aria-label={t('home')}
          className="group shrink-0 rounded-lg transition-[rotate] duration-300 hover:-rotate-3 motion-reduce:transition-none"
        >
          <Image
            src={siteConfig.images.logo}
            alt={siteConfig.name}
            width={siteConfig.images.logoSize.width}
            height={siteConfig.images.logoSize.height}
            sizes="80px"
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav aria-label={t('main')} className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full bg-white/40 p-1 ring-1 ring-on-surface/10">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`/${locale}#${item.id}`}
                  className="block rounded-full px-4 py-2 text-sm font-medium text-on-surface-soft transition-colors hover:bg-white/40 hover:text-on-surface"
                >
                  {t(item.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher className="text-on-surface hover:bg-white/40 data-[state=open]:bg-white/40" />
          <a
            href={`/${locale}#order`}
            className="btn-fresh hidden px-5 py-2.5 md:inline-flex"
          >
            {t('order')}
          </a>
          <MobileNav />
        </div>
      </div>
      <ScrollProgress />
    </header>
  );
}
