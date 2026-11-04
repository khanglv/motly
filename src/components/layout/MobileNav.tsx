'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useUIStore } from '@/store/ui-store';
import { siteConfig } from '@/config/site';
import { CloseIcon, MenuIcon, PhoneIcon } from '@/components/ui/icons';
import { Bubbles } from '@/components/ui/decor';
import { NAV_ITEMS } from './nav-items';

export function MobileNav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="btn p-2.5 text-cream hover:translate-y-0 hover:bg-cream/10 md:hidden"
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
                className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col overflow-hidden bg-matcha-900 p-6 text-cream shadow-soft"
                initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                transition={{
                  type: 'tween',
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <Bubbles />
                <div className="relative flex items-center justify-between">
                  <Dialog.Title className="sr-only">
                    {siteConfig.shortName}
                  </Dialog.Title>
                  <Image
                    src={siteConfig.images.logoLight}
                    alt={siteConfig.name}
                    width={siteConfig.images.logoSize.width}
                    height={siteConfig.images.logoSize.height}
                    sizes="80px"
                    className="h-14 w-auto"
                  />
                  <Dialog.Close
                    className="btn p-2.5 text-cream hover:translate-y-0 hover:bg-cream/10"
                    aria-label={t('closeMenu')}
                  >
                    <CloseIcon width={24} height={24} />
                  </Dialog.Close>
                </div>

                <nav aria-label={t('main')} className="relative mt-10">
                  <ul className="space-y-1">
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
                          className="flex items-baseline gap-3 rounded-2xl px-3 py-2.5 font-display text-4xl font-bold text-cream hover:bg-cream/10 hover:text-matcha-300"
                        >
                          <span className="font-sans text-xs font-semibold text-matcha-400">
                            0{i + 1}
                          </span>
                          {t(item.labelKey)}
                        </a>
                      </m.li>
                    ))}
                  </ul>
                </nav>

                <div className="relative mt-auto space-y-3">
                  <a
                    href={`/${locale}#order`}
                    onClick={() => setOpen(false)}
                    className="btn-fresh w-full py-3.5 text-base"
                  >
                    {t('order')}
                  </a>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="btn-outline-light w-full py-3.5 text-base"
                  >
                    <PhoneIcon width={18} height={18} />
                    {siteConfig.phoneDisplay}
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
