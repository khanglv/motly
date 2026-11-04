/** Các section trên trang, dùng chung cho Header, MobileNav và Footer */
export const NAV_ITEMS = [
  { id: "about", labelKey: "about" },
  { id: "menu", labelKey: "menu" },
  { id: "gallery", labelKey: "gallery" },
  { id: "reviews", labelKey: "reviews" },
  { id: "location", labelKey: "location" },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"] | "top" | "order";
