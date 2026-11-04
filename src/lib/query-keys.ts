import type { Locale, MenuFilter } from "@/types";

export const queryKeys = {
  menu: (locale: Locale, category: MenuFilter) => ["menu", locale, category] as const,
  reviews: (locale: Locale) => ["reviews", locale] as const,
  gallery: (locale: Locale) => ["gallery", locale] as const,
};
