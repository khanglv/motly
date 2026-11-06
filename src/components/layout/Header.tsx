'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { m, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 bg-cream/95 text-ink backdrop-blur-md transition-shadow duration-300',
        scrolled && 'shadow-[0_10px_30px_-18px_rgb(0_0_0/0.35)]'
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
          <ul className="flex items-center gap-1 lg:gap-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`/${locale}#${item.id}`}
                  className="relative block px-3 py-2 text-[0.95rem] font-semibold text-ink-soft transition-colors after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-matcha-500 after:transition-transform hover:text-ink hover:after:scale-x-100 motion-reduce:after:transition-none"
                >
                  {t(item.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher className="text-ink hover:bg-matcha-100 data-[state=open]:bg-matcha-100" />
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
