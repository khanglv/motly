import type { FeaturedRecord } from "@/types";

/**
 * Menu nổi bật (DỮ LIỆU MẪU).
 * Sau này nội dung này sẽ nhập từ CMS; chỉ cần đổi phần thân hàm getFeatured() trong
 * src/lib/data-service.ts, giao diện và API /api/featured giữ nguyên.
 *
 * - menuItemId phải trùng id một món trong src/data/menu.ts (giá, tên, ảnh lấy từ đó).
 * - Đổi `active: false` để ẩn; dùng startsAt/endsAt để chạy theo đợt khuyến mãi.
 */
export const featuredRecords: FeaturedRecord[] = [
  {
    id: "feat-salted-cream",
    menuItemId: "matcha-salted-cream",
    headline: { vi: "Món phải thử ở Một Ly", en: "The must-try at Một Ly" },
    story: {
      vi: "Matcha đánh tay mỗi ly, rót trên sữa lạnh, phủ lớp kem muối mặn nhẹ. Uống không khuấy để cảm nhận từng lớp: béo, mặn rồi chát thanh.",
      en: "Matcha whisked to order, poured over cold milk and topped with a lightly salted cream. Sip without stirring to taste every layer: creamy, salty, then gently bitter.",
    },
    highlights: {
      vi: ["Đánh tay mỗi ly", "Kem muối tự làm", "Ít ngọt được"],
      en: ["Whisked to order", "House-made salted cream", "Less sugar on request"],
    },
    badge: { vi: "Signature", en: "Signature" },
    theme: "matcha",
    order: 1,
    active: true,
  },
  {
    id: "feat-strawberry",
    menuItemId: "matcha-strawberry",
    headline: { vi: "Mới: Matcha Dâu", en: "New: Strawberry Matcha" },
    story: {
      vi: "Mứt dâu tươi chua ngọt dưới đáy ly, giữa là sữa, trên cùng là matcha. Ba màu ba vị, chụp hình cũng xinh.",
      en: "Sweet-tart fresh strawberry at the bottom, milk in the middle, matcha on top. Three layers, three flavors, very photogenic.",
    },
    highlights: {
      vi: ["Dâu tươi nấu mỗi ngày", "Ba tầng màu", "Giới hạn mùa này"],
      en: ["Strawberries cooked daily", "Three layers", "This season only"],
    },
    badge: { vi: "Mới", en: "New" },
    theme: "sakura",
    order: 2,
    active: true,
  },
  {
    id: "feat-coconut",
    menuItemId: "matcha-coconut",
    headline: { vi: "Mát lành ngày nắng", en: "For hot sunny days" },
    story: {
      vi: "Matcha kết hợp sữa dừa và nước cốt dừa, thơm béo kiểu miền Tây mà vẫn giữ vị trà rõ ràng.",
      en: "Matcha with coconut milk and coconut cream, rich and fragrant while keeping a clear tea flavor.",
    },
    highlights: {
      vi: ["Cốt dừa béo thơm", "Bán chạy", "Hợp mang đi"],
      en: ["Rich coconut cream", "Best seller", "Great to go"],
    },
    theme: "cream",
    order: 3,
    active: true,
  },
  {
    id: "feat-cookie",
    menuItemId: "matcha-cookie",
    headline: { vi: "Ăn kèm hoàn hảo", en: "The perfect side" },
    story: {
      vi: "Cookie matcha giòn rìa, mềm giữa, điểm socola trắng. Gọi kèm một ly matcha latte là đủ một buổi chiều.",
      en: "Matcha cookie, crisp at the edges, soft in the middle, with white chocolate. Pair it with a matcha latte for a perfect afternoon.",
    },
    highlights: {
      vi: ["Nướng mỗi sáng", "Socola trắng", "Combo với latte"],
      en: ["Baked every morning", "White chocolate", "Pairs with a latte"],
    },
    theme: "matcha",
    order: 4,
    active: true,
  },
];
