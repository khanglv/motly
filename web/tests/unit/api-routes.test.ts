// @vitest-environment node
import { describe, expect, it } from "vitest";
import { GET as getMenu } from "@/app/api/menu/route";
import { GET as getReviews } from "@/app/api/reviews/route";
import { GET as getGallery } from "@/app/api/gallery/route";
import { menuItems } from "@/data/menu";
import type { GalleryImage, MenuItem, Review } from "@/types";

const req = (path: string) => new Request(`http://localhost${path}`);

describe("GET /api/menu", () => {
  it("mặc định trả toàn bộ menu tiếng Việt", async () => {
    const res = await getMenu(req("/api/menu"));
    expect(res.status).toBe(200);
    const { data } = (await res.json()) as { data: MenuItem[] };
    expect(data).toHaveLength(menuItems.length);
    expect(data.find((i) => i.id === "matcha-salted-cream")?.name).toBe("Matcha Kem Muối");
  });

  it("lọc đúng danh mục và đúng ngôn ngữ", async () => {
    const res = await getMenu(req("/api/menu?locale=en&category=bakery"));
    const { data } = (await res.json()) as { data: MenuItem[] };
    expect(data.length).toBeGreaterThan(0);
    expect(data.every((i) => i.category === "bakery")).toBe(true);
    expect(data.find((i) => i.id === "butter-croissant")?.name).toBe("Butter Croissant");
    expect(typeof data[0].description).toBe("string");
  });

  it("có header Cache-Control", async () => {
    const res = await getMenu(req("/api/menu?category=matcha"));
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
  });

  it.each([
    ["/api/menu?locale=fr", /locale/],
    ["/api/menu?category=tea", /category/],
  ])("trả 400 khi input sai: %s", async (path, msg) => {
    const res = await getMenu(req(path));
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: string }).error).toMatch(msg);
  });
});

describe("GET /api/reviews", () => {
  it("trả review theo ngôn ngữ, mới nhất trước", async () => {
    const res = await getReviews(req("/api/reviews?locale=en"));
    const { data } = (await res.json()) as { data: Review[] };
    expect(data[0].content).toMatch(/matcha latte/i);
    const dates = data.map((r) => r.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("trả 400 khi locale sai", async () => {
    expect((await getReviews(req("/api/reviews?locale=jp"))).status).toBe(400);
  });
});

describe("GET /api/gallery", () => {
  it("trả alt đúng ngôn ngữ", async () => {
    const res = await getGallery(req("/api/gallery?locale=vi"));
    const { data } = (await res.json()) as { data: GalleryImage[] };
    expect(data[0].alt).toBe("Ly matcha latte trên quầy");
    expect(data[0]).toMatchObject({ width: expect.any(Number), height: expect.any(Number) });
  });

  it("trả 400 khi locale sai", async () => {
    expect((await getGallery(req("/api/gallery?locale=xx"))).status).toBe(400);
  });
});
