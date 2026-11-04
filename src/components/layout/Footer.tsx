import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/types";
import { ArrowUpIcon, FacebookIcon } from "@/components/ui/icons";
import { NAV_ITEMS } from "./nav-items";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tLoc = await getTranslations({ locale, namespace: "location" });
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-matcha-100 bg-matcha-900 text-matcha-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="inline-block rounded-2xl bg-cream px-3 py-2">
            <Image src={siteConfig.images.logo} alt={siteConfig.name} width={150} height={44} />
          </div>
          <p className="max-w-xs text-sm text-matcha-300">{t("tagline")}</p>
        </div>

        <nav aria-label={tNav("main")}>
          <ul className="space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`/${locale}#${item.id}`} className="hover:text-cream hover:underline">
                  {tNav(item.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-2 text-sm">
          <h2 className="font-sans text-xs font-medium tracking-[0.2em] text-matcha-300 uppercase">{t("contact")}</h2>
          <address className="not-italic">
            {siteConfig.address.lines[locale].map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <a href={`tel:${siteConfig.phone}`} className="block hover:text-cream hover:underline">
            {siteConfig.phoneDisplay}
          </a>
          <p>
            <span className="text-matcha-300">{t("hours")}: </span>
            {siteConfig.hours.opens} – {siteConfig.hours.closes}, {tLoc("everyday")}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <h2 className="font-sans text-xs font-medium tracking-[0.2em] text-matcha-300 uppercase">{t("follow")}</h2>
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-matcha-700 px-4 py-2 hover:bg-matcha-700"
          >
            <FacebookIcon width={18} height={18} />
            {t("facebook")}
          </a>
        </div>
      </div>

      <div className="border-t border-matcha-700/60">
        <div className="container-page flex items-center justify-between gap-4 py-5 text-xs text-matcha-300">
          <p>{t("rights", { year })}</p>
          <a href="#top" className="inline-flex items-center gap-1 hover:text-cream">
            <ArrowUpIcon width={14} height={14} />
            {t("backToTop")}
          </a>
        </div>
      </div>
    </footer>
  );
}
