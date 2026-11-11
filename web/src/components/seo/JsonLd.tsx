import { siteConfig } from "@/config/site";
import { defaultSettings, mapLinks, type SiteSettings } from "@/config/settings";
import type { Locale } from "@/types";

export function buildCafeJsonLd(locale: Locale, description: string, settings: SiteSettings = defaultSettings) {
  const { address, hours } = settings;
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${siteConfig.url}/#cafe`,
    name: siteConfig.name,
    description,
    url: `${siteConfig.url}/${locale}`,
    image: `${siteConfig.url}${siteConfig.images.hero}`,
    logo: `${siteConfig.url}${siteConfig.images.logo}`,
    telephone: settings.phone,
    priceRange: "₫",
    servesCuisine: ["Matcha", "Coffee", "Bakery"],
    acceptsReservations: false,
    inLanguage: locale,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: `${address.ward}, ${address.district}`,
      addressRegion: address.city,
      addressCountry: siteConfig.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...siteConfig.openingDays],
        opens: hours.opens,
        closes: hours.closes,
      },
    ],
    hasMap: mapLinks(settings, locale).directionsUrl,
    sameAs: settings.social.facebook ? [settings.social.facebook] : [],
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" để chuỗi JSON không thể đóng thẻ <script>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
