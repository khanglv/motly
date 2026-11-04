import { siteConfig } from "@/config/site";
import type { Locale } from "@/types";

export function buildCafeJsonLd(locale: Locale, description: string) {
  const { address, hours } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${siteConfig.url}/#cafe`,
    name: siteConfig.name,
    description,
    url: `${siteConfig.url}/${locale}`,
    image: `${siteConfig.url}${siteConfig.images.hero}`,
    logo: `${siteConfig.url}${siteConfig.images.logo}`,
    telephone: siteConfig.phone,
    priceRange: "₫",
    servesCuisine: ["Matcha", "Coffee", "Bakery"],
    acceptsReservations: false,
    inLanguage: locale,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: `${address.ward}, ${address.district}`,
      addressRegion: address.city,
      addressCountry: address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...hours.days],
        opens: hours.opens,
        closes: hours.closes,
      },
    ],
    hasMap: siteConfig.map.directionsUrl,
    sameAs: [siteConfig.social.facebook],
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
