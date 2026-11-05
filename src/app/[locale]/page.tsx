import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getFeatured, getGallery, getMenu, getReviews } from "@/lib/data-service";
import { queryKeys } from "@/lib/query-keys";
import { DEFAULT_MENU_FILTER } from "@/store/ui-store";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { About } from "@/components/sections/About";
import { FeaturedMenu } from "@/components/sections/featured/FeaturedMenu";
import { Menu } from "@/components/sections/menu/Menu";
import { Gallery } from "@/components/sections/gallery/Gallery";
import { Reviews } from "@/components/sections/reviews/Reviews";
import { Location } from "@/components/sections/Location";
import { buildCafeJsonLd, JsonLd } from "@/components/seo/JsonLd";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const tMeta = await getTranslations({ locale, namespace: "meta" });

  // Prefetch dữ liệu phía server để HTML có sẵn menu/gallery/review (tốt cho SEO, không nháy skeleton).
  // Trên client, React Query dùng lại cache này; các tab khác sẽ gọi /api/* bằng fetch.
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.menu(locale, DEFAULT_MENU_FILTER),
      queryFn: () => getMenu(locale, DEFAULT_MENU_FILTER),
    }),
    queryClient.prefetchQuery({ queryKey: queryKeys.featured(locale), queryFn: () => getFeatured(locale) }),
    queryClient.prefetchQuery({ queryKey: queryKeys.gallery(locale), queryFn: () => getGallery(locale) }),
    queryClient.prefetchQuery({ queryKey: queryKeys.reviews(locale), queryFn: () => getReviews(locale) }),
  ]);

  return (
    <>
      <JsonLd data={buildCafeJsonLd(locale, tMeta("description"))} />
      <Hero locale={locale} />
      <Marquee locale={locale} />
      <About locale={locale} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FeaturedMenu />
        <Menu />
        <Gallery />
        <Reviews />
      </HydrationBoundary>
      <Location locale={locale} />
    </>
  );
}
