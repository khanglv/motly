"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./nav-items";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled ? "bg-cream/85 shadow-[0_1px_0_rgb(47_61_36/0.08)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link href="/" aria-label={t("home")} className="shrink-0 rounded-lg">
          <Image src={siteConfig.images.logo} alt={siteConfig.name} width={165} height={48} priority />
        </Link>

        <nav aria-label={t("main")} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`/${locale}#${item.id}`}
                  className="rounded-full px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-matcha-100 hover:text-matcha-900"
                >
                  {t(item.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          <a href={`/${locale}#order`} className="btn-primary hidden px-5 py-2.5 md:inline-flex">
            {t("order")}
          </a>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
