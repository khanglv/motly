"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useUIStore } from "@/store/ui-store";
import { siteConfig } from "@/config/site";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/icons";
import { NAV_ITEMS } from "./nav-items";

export function MobileNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="btn-ghost p-2.5 md:hidden" aria-label={t("openMenu")}>
        <MenuIcon width={22} height={22} />
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-50 bg-matcha-900/30 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <m.div
                className="fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col bg-cream p-6 shadow-soft"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-serif text-xl text-matcha-900">{siteConfig.shortName}</Dialog.Title>
                  <Dialog.Close className="btn-ghost p-2.5" aria-label={t("closeMenu")}>
                    <CloseIcon width={22} height={22} />
                  </Dialog.Close>
                </div>

                <nav aria-label={t("main")} className="mt-10">
                  <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`/${locale}#${item.id}`}
                          onClick={() => setOpen(false)}
                          className="block rounded-xl px-3 py-3 font-serif text-2xl text-matcha-900 hover:bg-matcha-100"
                        >
                          {t(item.labelKey)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-auto space-y-3">
                  <a href={`/${locale}#order`} onClick={() => setOpen(false)} className="btn-primary w-full">
                    {t("order")}
                  </a>
                  <a href={`tel:${siteConfig.phone}`} className="btn-outline w-full">
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
