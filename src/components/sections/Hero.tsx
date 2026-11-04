import Image from "next/image";
import clsx from "clsx";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/types";
import { ClockIcon, PhoneIcon } from "@/components/ui/icons";
import decor from "@/styles/decor.module.scss";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <section aria-labelledby="hero-title" className={clsx(decor.washi, "relative -mt-16 overflow-hidden pt-16 sm:-mt-20 sm:pt-20")}>
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-matcha-100/80 via-cream to-cream" aria-hidden />

      <div className="container-page grid items-center gap-12 pt-10 pb-28 md:grid-cols-[1.1fr_0.9fr] md:pt-16 md:pb-36">
        <div className="relative z-10">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 id="hero-title" className="mt-5 text-4xl leading-[1.15] font-semibold sm:text-5xl lg:text-6xl">
            {t("title")}
            <span className="mt-1 block font-normal text-matcha-700 italic">{t("titleHighlight")}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">{t("subtitle")}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#menu" className="btn-primary">
              {t("ctaMenu")}
            </a>
            <a href={`tel:${siteConfig.phone}`} className="btn-outline">
              <PhoneIcon width={18} height={18} />
              {t("ctaCall")}
            </a>
            <a href="#order" className="btn-ghost underline-offset-4 hover:underline">
              {t("ctaOrder")}
            </a>
          </div>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream/80 px-4 py-2 text-sm text-matcha-900 ring-1 ring-matcha-300/60">
            <ClockIcon width={16} height={16} />
            {t("hours", { opens: siteConfig.hours.opens, closes: siteConfig.hours.closes })}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-sm md:max-w-md">
          <span className={clsx(decor.enso, "-top-6 -left-8 h-40 w-40 sm:h-52 sm:w-52")} aria-hidden />
          <span
            className={clsx(decor.verticalKanji, "absolute top-6 -right-4 font-serif text-5xl sm:-right-10 sm:text-6xl")}
            aria-hidden
            lang="ja"
          >
            抹茶
          </span>
          <div className={clsx(decor.arch, "relative aspect-[4/5]")}>
            <Image
              src={siteConfig.images.hero}
              alt={t("imageAlt")}
              fill
              priority
              sizes="(min-width: 768px) 28rem, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className={decor.heroCurve} aria-hidden />
    </section>
  );
}
