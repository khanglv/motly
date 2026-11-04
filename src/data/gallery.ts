import type { GalleryImageRecord } from "@/types";

/**
 * Ảnh gallery. Khi thay ảnh thật, nhớ sửa width/height đúng tỉ lệ ảnh để không bị méo hoặc nhảy layout.
 */
export const galleryImages: GalleryImageRecord[] = [
  {
    id: "g1",
    src: "/images/gallery/gallery-01.svg",
    alt: { vi: "Ly matcha latte trên quầy", en: "A matcha latte on the counter" },
    width: 900,
    height: 1200,
  },
  {
    id: "g2",
    src: "/images/gallery/gallery-02.svg",
    alt: { vi: "Góc ngồi ngoài trời trước quán", en: "The outdoor seating corner in front of the shop" },
    width: 1200,
    height: 900,
  },
  {
    id: "g3",
    src: "/images/gallery/gallery-03.svg",
    alt: { vi: "Cookie matcha mới ra lò", en: "Freshly baked matcha cookies" },
    width: 1000,
    height: 1000,
  },
  {
    id: "g4",
    src: "/images/gallery/gallery-04.svg",
    alt: { vi: "Cà phê sữa đá", en: "Iced Vietnamese milk coffee" },
    width: 900,
    height: 1200,
  },
  {
    id: "g5",
    src: "/images/gallery/gallery-05.svg",
    alt: { vi: "Đánh matcha bằng chổi tre", en: "Whisking matcha with a bamboo whisk" },
    width: 1200,
    height: 900,
  },
  {
    id: "g6",
    src: "/images/gallery/gallery-06.svg",
    alt: { vi: "Mặt tiền quán Một Ly", en: "The Một Ly shopfront" },
    width: 1000,
    height: 1000,
  },
  {
    id: "g7",
    src: "/images/gallery/gallery-07.svg",
    alt: { vi: "Tiramisu matcha", en: "Matcha tiramisu" },
    width: 900,
    height: 1200,
  },
  {
    id: "g8",
    src: "/images/gallery/gallery-08.svg",
    alt: { vi: "Ly matcha kem muối mang đi", en: "A takeaway salted cream matcha" },
    width: 1200,
    height: 900,
  },
];
