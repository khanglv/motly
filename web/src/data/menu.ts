import type { MenuItemRecord } from "@/types";

/**
 * Menu mẫu. GIÁ LÀ PLACEHOLDER, chủ quán cần xác nhận lại.
 * Ảnh: thay file trong public/images/menu và sửa trường `image`.
 */
export const menuItems: MenuItemRecord[] = [
  // ---- Matcha ----
  {
    id: "matcha-latte",
    category: "matcha",
    name: { vi: "Matcha Latte", en: "Matcha Latte" },
    description: {
      vi: "Matcha đánh mịn cùng sữa tươi, vị chát thanh và béo nhẹ.",
      en: "Smooth whisked matcha with fresh milk, gently bitter and lightly creamy.",
    },
    price: 45000,
    image: "/images/menu/matcha-latte.svg",
    tags: ["signature", "best-seller"],
  },
  {
    id: "matcha-salted-cream",
    category: "matcha",
    name: { vi: "Matcha Kem Muối", en: "Salted Cream Matcha" },
    description: {
      vi: "Lớp kem muối mặn nhẹ phủ trên matcha sữa, uống không cần khuấy.",
      en: "Matcha milk topped with a lightly salted cream cap. Sip it without stirring.",
    },
    price: 49000,
    image: "/images/menu/matcha-salted-cream.svg",
    tags: ["signature"],
  },
  {
    id: "matcha-coconut",
    category: "matcha",
    name: { vi: "Matcha Dừa", en: "Coconut Matcha" },
    description: {
      vi: "Matcha kết hợp sữa dừa và nước cốt dừa, thơm và mát.",
      en: "Matcha with coconut milk and coconut cream, fragrant and refreshing.",
    },
    price: 49000,
    image: "/images/menu/matcha-coconut.svg",
    tags: ["best-seller"],
  },
  {
    id: "matcha-strawberry",
    category: "matcha",
    name: { vi: "Matcha Dâu", en: "Strawberry Matcha" },
    description: {
      vi: "Mứt dâu tươi dưới đáy ly, sữa và matcha phía trên.",
      en: "Fresh strawberry compote at the bottom, milk and matcha on top.",
    },
    price: 52000,
    image: "/images/menu/matcha-strawberry.svg",
    tags: ["new"],
  },
  {
    id: "matcha-frappe",
    category: "matcha",
    name: { vi: "Matcha Đá Xay", en: "Matcha Frappé" },
    description: {
      vi: "Matcha xay cùng đá và sữa, thêm lớp kem tươi.",
      en: "Matcha blended with ice and milk, finished with whipped cream.",
    },
    price: 55000,
    image: "/images/menu/matcha-frappe.svg",
    tags: [],
  },
  {
    id: "matcha-pure",
    category: "matcha",
    name: { vi: "Matcha Nguyên Chất", en: "Pure Matcha" },
    description: {
      vi: "Chỉ matcha và nước, cho ai muốn vị trà nguyên bản.",
      en: "Just matcha and water, for those who love the pure tea flavor.",
    },
    price: 39000,
    image: "/images/menu/matcha-pure.svg",
    tags: [],
  },

  // ---- Cà phê ----
  {
    id: "ca-phe-sua",
    category: "coffee",
    name: { vi: "Cà Phê Sữa", en: "Vietnamese Milk Coffee" },
    description: {
      vi: "Cà phê phin đậm vị với sữa đặc, uống đá.",
      en: "Strong phin-brewed coffee with condensed milk, served iced.",
    },
    price: 25000,
    image: "/images/menu/ca-phe-sua.svg",
    tags: ["best-seller"],
  },
  {
    id: "bac-xiu",
    category: "coffee",
    name: { vi: "Bạc Xỉu", en: "Bạc Xỉu (White Coffee)" },
    description: {
      vi: "Nhiều sữa, ít cà phê, ngọt và béo.",
      en: "More milk, less coffee. Sweet and creamy.",
    },
    price: 29000,
    image: "/images/menu/bac-xiu.svg",
    tags: [],
  },
  {
    id: "americano",
    category: "coffee",
    name: { vi: "Americano", en: "Americano" },
    description: {
      vi: "Espresso pha loãng với nước, nóng hoặc đá.",
      en: "Espresso topped up with water, hot or iced.",
    },
    price: 30000,
    image: "/images/menu/americano.svg",
    tags: [],
  },
  {
    id: "cold-brew",
    category: "coffee",
    name: { vi: "Cold Brew", en: "Cold Brew" },
    description: {
      vi: "Ủ lạnh nhiều giờ, vị êm và ít đắng.",
      en: "Steeped cold for hours, smooth with low bitterness.",
    },
    price: 39000,
    image: "/images/menu/cold-brew.svg",
    tags: ["new"],
  },

  // ---- Bánh ----
  {
    id: "matcha-cookie",
    category: "bakery",
    name: { vi: "Cookie Matcha", en: "Matcha Cookie" },
    description: {
      vi: "Giòn rìa, mềm giữa, có socola trắng.",
      en: "Crisp edges, soft center, with white chocolate.",
    },
    price: 25000,
    image: "/images/menu/matcha-cookie.svg",
    tags: ["signature"],
  },
  {
    id: "matcha-castella",
    category: "bakery",
    name: { vi: "Bánh Bông Lan Castella Matcha", en: "Matcha Castella" },
    description: {
      vi: "Bánh bông lan kiểu Nhật, mềm ẩm và thơm trà.",
      en: "Japanese-style sponge cake, soft, moist and tea-scented.",
    },
    price: 35000,
    image: "/images/menu/matcha-castella.svg",
    tags: [],
  },
  {
    id: "butter-croissant",
    category: "bakery",
    name: { vi: "Croissant Bơ", en: "Butter Croissant" },
    description: {
      vi: "Vỏ giòn nhiều lớp, thơm bơ.",
      en: "Flaky, buttery layers.",
    },
    price: 32000,
    image: "/images/menu/butter-croissant.svg",
    tags: [],
  },
  {
    id: "matcha-tiramisu",
    category: "bakery",
    name: { vi: "Tiramisu Matcha", en: "Matcha Tiramisu" },
    description: {
      vi: "Kem mascarpone xen lớp bánh thấm matcha.",
      en: "Mascarpone cream layered with matcha-soaked sponge.",
    },
    price: 45000,
    image: "/images/menu/matcha-tiramisu.svg",
    tags: ["new"],
  },
];
