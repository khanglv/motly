import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BagIcon, BikeIcon, ChairIcon } from "@/components/ui/icons";

const FEATURES = [
  { key: "takeaway", Icon: BagIcon },
  { key: "delivery", Icon: BikeIcon },
  { key: "outdoor", Icon: ChairIcon },
] as const;

export async function About({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="container-page grid items-center gap-14 md:grid-cols-2">
        <Reveal className="order-2 md:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-soft">
            <Image
              src={siteConfig.images.about}
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal className="order-1 md:order-2" delay={0.1}>
          <SectionHeading id="about-title" eyebrow={t("eyebrow")} title={t("title")} align="left" />
          <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </div>
        </Reveal>
      </div>

      <ul className="container-page mt-16 grid gap-5 sm:grid-cols-3">
        {FEATURES.map(({ key, Icon }, i) => (
          <li key={key}>
            <Reveal delay={i * 0.08} className="h-full rounded-card bg-matcha-100/60 p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream text-matcha-700">
                <Icon width={22} height={22} />
              </span>
              <h3 className="mt-4 text-lg">{t(`features.${key}.title`)}</h3>
              <p className="mt-2 text-sm text-ink-soft">{t(`features.${key}.desc`)}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
