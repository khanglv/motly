import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ClockIcon, FacebookIcon, MapPinIcon, PhoneIcon } from "@/components/ui/icons";

export async function Location({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "location" });
  const { address, hours, delivery, social, map } = siteConfig;

  const deliveryLinks = [
    { key: "grabfood", href: delivery.grabfood },
    { key: "shopeefood", href: delivery.shopeefood },
  ].filter((d) => d.href) as { key: "grabfood" | "shopeefood"; href: string }[];

  return (
    <section id="location" aria-labelledby="location-title" className="section bg-matcha-50 pb-36">
      <div className="container-page">
        <SectionHeading id="location-title" eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="flex flex-col gap-6 rounded-card bg-cream p-7 shadow-[8px_8px_0_0_var(--color-matcha-900)] ring-2 ring-matcha-900 sm:p-9">
            <dl className="space-y-6">
              <div>
                <dt className="flex items-center gap-3 font-display text-base font-bold text-matcha-900">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-matcha-400 text-matcha-950"><MapPinIcon width={18} height={18} /></span>
                  {t("address")}
                </dt>
                <dd className="mt-1 pl-12 text-ink-soft">
                  <address className="not-italic">
                    {address.lines[locale].map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-3 font-display text-base font-bold text-matcha-900">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-matcha-400 text-matcha-950"><ClockIcon width={18} height={18} /></span>
                  {t("hours")}
                </dt>
                <dd className="mt-1 pl-12 text-ink-soft">
                  {t("everyday")}: <time dateTime={hours.opens}>{hours.opens}</time> –{" "}
                  <time dateTime={hours.closes}>{hours.closes}</time>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-3 font-display text-base font-bold text-matcha-900">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-matcha-400 text-matcha-950"><PhoneIcon width={18} height={18} /></span>
                  {t("phone")}
                </dt>
                <dd className="mt-1 pl-12">
                  <a href={`tel:${siteConfig.phone}`} className="text-ink-soft hover:text-matcha-900 hover:underline">
                    {siteConfig.phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3">
              <a href={map.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MapPinIcon width={18} height={18} />
                {t("directions")}
              </a>
              <a href={`tel:${siteConfig.phone}`} className="btn-outline">
                <PhoneIcon width={18} height={18} />
                {t("call")}
              </a>
            </div>

            <div id="order" className="-mx-2 rounded-3xl bg-matcha-900 p-6 text-cream sm:-mx-3">
              <h3 className="text-2xl text-matcha-300">{t("orderTitle")}</h3>
              <p className="mt-1 text-sm text-cream/75">{t("orderDesc")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {deliveryLinks.map((d) => (
                  <a
                    key={d.key}
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-fresh px-4 py-2"
                  >
                    {t(d.key)}
                  </a>
                ))}
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="btn-fresh px-4 py-2">
                  <FacebookIcon width={16} height={16} />
                  {t("facebook")}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-h-96 overflow-hidden rounded-card shadow-[8px_8px_0_0_var(--color-matcha-400)] ring-2 ring-matcha-900">
            <iframe
              title={t("mapTitle")}
              src={map.embedUrl(locale)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-96 w-full border-0"
              allowFullScreen
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
