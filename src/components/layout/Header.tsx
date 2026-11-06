'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { m, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';
import { useActiveSection } from '@/hooks/useActiveSection';
import { BikeIcon } from '@/components/ui/icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { NAV_ITEMS } from './nav-items';

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);
/** Phần tên sau "Một Ly", hiển thị dòng nhỏ dưới tên ngắn */
const NAME_SUFFIX = siteConfig.name.replace(siteConfig.shortName, '').trim();

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
      className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-linear-to-r from-matcha-500 via-matcha-400 to-accent"
      style={{ scaleX: reduceMotion ? scrollYProgress : scaleX }}
    />
  );
}

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Chiều cao header cố định (không làm xô lệch nội dung). Ở đầu trang: thanh nền giấy full chiều ngang;
  // cuộn xuống: phần nhìn thấy thu gọn thành thanh nổi bo tròn, nằm đè lên trang.
  return (
    <header className="sticky top-0 z-40 h-16 text-ink sm:h-20">
      <div
        className={clsx(
          'absolute inset-x-0 top-0 transition-[padding] duration-300 motion-reduce:transition-none',
          scrolled ? 'px-3 pt-2 sm:px-6' : 'px-0 pt-0'
        )}
      >
        <div
          className={clsx(
            'relative mx-auto overflow-hidden transition-[max-width,border-radius,background-color,box-shadow] duration-300 motion-reduce:transition-none',
            scrolled
              ? 'max-w-6xl rounded-full bg-cream/85 shadow-soft ring-1 ring-ink/5 backdrop-blur-md'
              : 'max-w-[100vw] rounded-none border-b border-ink/5 bg-cream'
          )}
        >
          <div
            className={clsx(
              'container-page flex items-center justify-between gap-4 transition-[height] duration-300 motion-reduce:transition-none',
              scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
            )}
          >
            <Link
              href="/"
              aria-label={t('home')}
              className="group flex shrink-0 items-center gap-2.5 rounded-lg"
            >
              <Image
                src={siteConfig.images.logo}
                alt={siteConfig.name}
                width={siteConfig.images.logoSize.width}
                height={siteConfig.images.logoSize.height}
                sizes="80px"
                priority
                className={clsx(
                  'w-auto transition-[height,rotate] duration-300 group-hover:-rotate-6 motion-reduce:transition-none',
                  scrolled ? 'h-10 sm:h-11' : 'h-11 sm:h-14'
                )}
              />
              <span aria-hidden className="flex flex-col leading-none">
                <span className="font-display text-lg font-extrabold text-matcha-900 sm:text-xl">
                  {siteConfig.shortName}
                </span>
                <span className="mt-0.5 hidden text-[0.7rem] font-semibold tracking-wide text-ink-soft min-[360px]:block sm:text-xs">
                  {NAME_SUFFIX}
                </span>
              </span>
            </Link>

            <nav aria-label={t('main')} className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`/${locale}#${item.id}`}
                        aria-current={isActive ? 'location' : undefined}
                        className={clsx(
                          'relative isolate block rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors',
                          isActive
                            ? 'text-matcha-900'
                            : 'text-ink-soft hover:text-ink'
                        )}
                      >
                        {isActive && (
                          <m.span
                            layoutId="nav-active-pill"
                            aria-hidden
                            className="absolute inset-0 -z-10 rounded-full bg-matcha-100 ring-1 ring-matcha-200"
                            transition={{
                              type: 'spring',
                              stiffness: 380,
                              damping: 32
                            }}
                          />
                        )}
                        {t(item.labelKey)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <LanguageSwitcher className="text-ink hover:bg-matcha-100 data-[state=open]:bg-matcha-100" />
              <a
                href={`/${locale}#order`}
                className="btn-fresh hidden px-5 py-2.5 md:inline-flex"
              >
                <BikeIcon width={18} height={18} aria-hidden />
                {t('order')}
              </a>
              <MobileNav />
            </div>
          </div>
          <ScrollProgress />
        </div>
      </div>
    </header>
  );
}
