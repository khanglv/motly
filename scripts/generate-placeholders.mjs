// Tạo ảnh SVG placeholder trong public/images.
// Chạy: node scripts/generate-placeholders.mjs
// Khi có ảnh thật, thay file tương ứng và sửa đường dẫn trong src/data/*.ts hoặc src/config/site.ts.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

const palettes = {
  matcha: { bg1: "#F3F7EE", bg2: "#CBDFBA", ink: "#33492D", drink: "#74A662" },
  coffee: { bg1: "#F8F5EC", bg2: "#E6D5BE", ink: "#4A3424", drink: "#9A6B47" },
  bakery: { bg1: "#F8F5EC", bg2: "#E4EEDB", ink: "#33492D", drink: "#D6B48F" },
  scene: { bg1: "#E4EEDB", bg2: "#8BB673", ink: "#1C2A19", drink: "#5C8A4C" },
};

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function cup({ cx, cy, s, p }) {
  // Ly nhựa mang đi đơn giản, có lớp sữa và nắp
  const w = 120 * s;
  const h = 170 * s;
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  const inset = 18 * s;
  return `
  <g>
    <ellipse cx="${cx}" cy="${bottom + 8 * s}" rx="${w * 0.55}" ry="${10 * s}" fill="${p.ink}" opacity="0.08"/>
    <path d="M ${cx - w / 2} ${top} L ${cx + w / 2} ${top} L ${cx + w / 2 - inset} ${bottom} L ${cx - w / 2 + inset} ${bottom} Z" fill="#ffffff" opacity="0.55"/>
    <path d="M ${cx - w / 2 + 5 * s} ${top + h * 0.35} L ${cx + w / 2 - 5 * s} ${top + h * 0.35} L ${cx + w / 2 - inset} ${bottom - 4 * s} L ${cx - w / 2 + inset} ${bottom - 4 * s} Z" fill="${p.drink}"/>
    <path d="M ${cx - w / 2 + 3 * s} ${top + h * 0.22} L ${cx + w / 2 - 3 * s} ${top + h * 0.22} L ${cx + w / 2 - 5 * s} ${top + h * 0.35} L ${cx - w / 2 + 5 * s} ${top + h * 0.35} Z" fill="#FBF8F1"/>
    <rect x="${cx - w / 2 - 6 * s}" y="${top - 14 * s}" width="${w + 12 * s}" height="${16 * s}" rx="${8 * s}" fill="${p.ink}" opacity="0.85"/>
    <rect x="${cx + 14 * s}" y="${top - 70 * s}" width="${8 * s}" height="${70 * s}" rx="${4 * s}" fill="${p.ink}" opacity="0.7" transform="rotate(12 ${cx + 18 * s} ${top})"/>
  </g>`;
}

function leaf({ x, y, s, color, rotate = 0 }) {
  return `<path transform="translate(${x} ${y}) rotate(${rotate}) scale(${s})" d="M0 0 C 30 -40, 80 -40, 110 0 C 80 40, 30 40, 0 0 Z M 0 0 L 110 0" fill="${color}" stroke="${color}" stroke-width="2" opacity="0.35"/>`;
}

function svg({ width, height, palette, title, subtitle }) {
  const p = palettes[palette];
  const s = Math.min(width, height) / 600;
  const cx = width / 2;
  const cy = height * 0.45;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.bg1}"/>
      <stop offset="1" stop-color="${p.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <circle cx="${width * 0.82}" cy="${height * 0.18}" r="${90 * s}" fill="#ffffff" opacity="0.35"/>
  ${leaf({ x: width * 0.08, y: height * 0.82, s: 1.4 * s, color: p.ink, rotate: -25 })}
  ${leaf({ x: width * 0.7, y: height * 0.9, s: 1 * s, color: p.ink, rotate: -50 })}
  ${cup({ cx, cy, s: s * 1.4, p })}
  <text x="50%" y="${height * 0.82}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${40 * s}" fill="${p.ink}">${escape(title)}</text>
  <text x="50%" y="${height * 0.82 + 40 * s}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${20 * s}" letter-spacing="${3 * s}" fill="${p.ink}" opacity="0.6">${escape(subtitle)}</text>
</svg>
`;
}

const files = [
  // hero & about
  { path: "hero/hero-matcha.svg", width: 1200, height: 1500, palette: "matcha", title: "Matcha Latte", subtitle: "HERO · 1200×1500" },
  { path: "about/about-shop.svg", width: 1200, height: 900, palette: "scene", title: "Một Ly · Gò Vấp", subtitle: "ABOUT · 1200×900" },
  // menu - matcha
  { path: "menu/matcha-latte.svg", palette: "matcha", title: "Matcha Latte" },
  { path: "menu/matcha-salted-cream.svg", palette: "matcha", title: "Matcha Kem Muối" },
  { path: "menu/matcha-coconut.svg", palette: "matcha", title: "Matcha Dừa" },
  { path: "menu/matcha-strawberry.svg", palette: "matcha", title: "Matcha Dâu" },
  { path: "menu/matcha-frappe.svg", palette: "matcha", title: "Matcha Đá Xay" },
  { path: "menu/matcha-pure.svg", palette: "matcha", title: "Matcha Nguyên Chất" },
  // menu - coffee
  { path: "menu/ca-phe-sua.svg", palette: "coffee", title: "Cà Phê Sữa" },
  { path: "menu/bac-xiu.svg", palette: "coffee", title: "Bạc Xỉu" },
  { path: "menu/americano.svg", palette: "coffee", title: "Americano" },
  { path: "menu/cold-brew.svg", palette: "coffee", title: "Cold Brew" },
  // menu - bakery
  { path: "menu/matcha-cookie.svg", palette: "bakery", title: "Cookie Matcha" },
  { path: "menu/matcha-castella.svg", palette: "bakery", title: "Castella Matcha" },
  { path: "menu/butter-croissant.svg", palette: "bakery", title: "Croissant Bơ" },
  { path: "menu/matcha-tiramisu.svg", palette: "bakery", title: "Tiramisu Matcha" },
  // gallery (tỉ lệ khác nhau cho lưới masonry)
  { path: "gallery/gallery-01.svg", width: 900, height: 1200, palette: "matcha", title: "Gallery 01", subtitle: "900×1200" },
  { path: "gallery/gallery-02.svg", width: 1200, height: 900, palette: "scene", title: "Gallery 02", subtitle: "1200×900" },
  { path: "gallery/gallery-03.svg", width: 1000, height: 1000, palette: "bakery", title: "Gallery 03", subtitle: "1000×1000" },
  { path: "gallery/gallery-04.svg", width: 900, height: 1200, palette: "coffee", title: "Gallery 04", subtitle: "900×1200" },
  { path: "gallery/gallery-05.svg", width: 1200, height: 900, palette: "matcha", title: "Gallery 05", subtitle: "1200×900" },
  { path: "gallery/gallery-06.svg", width: 1000, height: 1000, palette: "scene", title: "Gallery 06", subtitle: "1000×1000" },
  { path: "gallery/gallery-07.svg", width: 900, height: 1200, palette: "bakery", title: "Gallery 07", subtitle: "900×1200" },
  { path: "gallery/gallery-08.svg", width: 1200, height: 900, palette: "matcha", title: "Gallery 08", subtitle: "1200×900" },
];

for (const f of files) {
  const width = f.width ?? 800;
  const height = f.height ?? 800;
  const out = join(root, f.path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(
    out,
    svg({ width, height, palette: f.palette, title: f.title, subtitle: f.subtitle ?? `PLACEHOLDER · ${width}×${height}` }),
  );
}
console.log(`Đã tạo ${files.length} ảnh placeholder trong public/images`);
