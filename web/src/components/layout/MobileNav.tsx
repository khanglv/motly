'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useUIStore } from '@/store/ui-store';
import { siteConfig } from '@/config/site';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import {
  ClockIcon,
  CloseIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon
} from '@/components/ui/icons';
import type { Locale } from '@/types';
import { NAV_ITEMS } from './nav-items';

export function MobileNav() {
  const t = useTranslations('nav');
  const tHero = useTranslations('hero');
  const locale = useLocale() as Locale;
  const reduceMotion = useReducedMotion();
  const settings = useSiteSettings();
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="btn p-2.5 text-ink hover:translate-y-0 hover:bg-matcha-100 lg:hidden"
        aria-label={t('openMenu')}
      >
        <MenuIcon width={24} height={24} />
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-50 bg-matcha-950/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <m.div
                className="fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-paper px-6 pt-4 pb-6 text-ink shadow-lift"
                initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                transition={{
                  type: 'tween',
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                  <Dialog.Title className="sr-only">
                    {siteConfig.shortName}
                  </Dialog.Title>
                  <Image
                    src={siteConfig.images.logo}
                    alt={siteConfig.name}
                    width={siteConfig.images.logoSize.width}
                    height={siteConfig.images.logoSize.height}
                    sizes="80px"
                    className="h-11 w-auto"
                  />
                  <Dialog.Close
                    className="btn -mr-2 p-2.5 text-ink hover:translate-y-0 hover:bg-matcha-100"
                    aria-label={t('closeMenu')}
                  >
                    <CloseIcon width={24} height={24} />
                  </Dialog.Close>
                </div>

                <nav aria-label={t('main')} className="mt-2">
                  <ul className="divide-y divide-ink/10">
                    {NAV_ITEMS.map((item, i) => (
                      <m.li
                        key={item.id}
                        initial={reduceMotion ? false : { opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: reduceMotion ? 0 : 0.12 + i * 0.06,
                          type: 'spring',
                          stiffness: 300,
                          damping: 26
                        }}
                      >
                        <a
                          href={`/${locale}#${item.id}`}
                          onClick={() => setOpen(false)}
                          className="group flex items-center gap-4 py-4 font-display text-2xl font-semibold text-ink transition-colors hover:text-matcha-700"
                        >
                          <span className="w-6 font-sans text-xs font-semibold tabular-nums text-matcha-700">
                            0{i + 1}
                          </span>
                          <span className="flex-1">{t(item.labelKey)}</span>
                          <span
                            aria-hidden
                            className="text-lg text-ink/40 transition-transform group-hover:translate-x-1 group-hover:text-matcha-700 motion-reduce:transition-none"
                          >
                            →
                          </span>
                        </a>
                      </m.li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-auto space-y-3 pt-8">
                  <ul className="mb-5 space-y-2 text-sm text-ink-soft">
                    <li className="flex items-start gap-2.5">
                      <ClockIcon width={16} height={16} className="mt-0.5 shrink-0 text-matcha-700" />
                      {tHero('hours', {
                        opens: settings.hours.opens,
                        closes: settings.hours.closes
                      })}
                    </li>
                    <li className="flex items-start gap-2.5">
                      <MapPinIcon width={16} height={16} className="mt-0.5 shrink-0 text-matcha-700" />
                      {settings.address.lines[locale][0]}
                    </li>
                  </ul>
                  <a
                    href={`/${locale}#order`}
                    onClick={() => setOpen(false)}
                    className="btn-fresh w-full py-3 text-base"
                  >
                    {t('order')}
                  </a>
                  <a
                    href={`tel:${settings.phone}`}
                    className="btn-outline w-full py-3 text-base"
                  >
                    <PhoneIcon width={18} height={18} />
                    {settings.phoneDisplay}
                  </a>
                </div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
