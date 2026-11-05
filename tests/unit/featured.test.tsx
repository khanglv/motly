import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FeaturedRecord } from "@/types";

// Dữ liệu giả lập "CMS" để kiểm tra lọc theo active / thời gian / thứ tự
const records = vi.hoisted(() => ({ list: [] as FeaturedRecord[] }));
vi.mock("@/data/featured", () => ({
  get featuredRecords() {
    return records.list;
  },
}));

import { getFeatured } from "@/lib/data-service";
import { GET } from "@/app/api/featured/route";
import { FeaturedMenu } from "@/components/sections/featured/FeaturedMenu";
import { queryKeys } from "@/lib/query-keys";
import { initialUIState, useUIStore } from "@/store/ui-store";
import { createTestQueryClient, renderWithProviders } from "../utils";

const base = (over: Partial<FeaturedRecord>): FeaturedRecord => ({
  id: "x",
  menuItemId: "matcha-latte",
  headline: { vi: "Tiêu đề", en: "Headline" },
  story: { vi: "Câu chuyện", en: "Story" },
  highlights: { vi: ["A", "B"], en: ["A", "B"] },
  theme: "matcha",
  order: 1,
  active: true,
  ...over,
});

const NOW = new Date("2026-11-04T10:00:00+07:00");

describe("getFeatured", () => {
  beforeEach(() => {
    records.list = [];
  });

  it("sắp theo order và gộp tên, giá, ảnh từ menu theo ngôn ngữ", () => {
    records.list = [
      base({ id: "b", menuItemId: "matcha-coconut", order: 2 }),
      base({ id: "a", menuItemId: "matcha-salted-cream", order: 1 }),
    ];
    const vi = getFeatured("vi", NOW);
    expect(vi.map((f) => f.id)).toEqual(["a", "b"]);
    expect(vi[0].item.name).toBe("Matcha Kem Muối");
    expect(vi[0].item.price).toBe(49000);
    expect(vi[0].image).toBe("/images/menu/matcha-salted-cream.svg");
    expect(getFeatured("en", NOW)[0]).toMatchObject({ headline: "Headline", item: { name: "Salted Cream Matcha" } });
  });

  it("bỏ mục đã tắt, chưa tới ngày, đã hết hạn, hoặc trỏ tới món không tồn tại", () => {
    records.list = [
      base({ id: "live" }),
      base({ id: "off", active: false }),
      base({ id: "future", startsAt: "2026-12-01T00:00:00+07:00" }),
      base({ id: "expired", endsAt: "2026-10-31T23:59:59+07:00" }),
      base({ id: "window", startsAt: "2026-11-01T00:00:00+07:00", endsAt: "2026-11-30T23:59:59+07:00" }),
      base({ id: "missing", menuItemId: "khong-co-mon-nay" }),
    ];
    expect(getFeatured("vi", NOW).map((f) => f.id)).toEqual(["live", "window"]);
  });

  it("dùng ảnh riêng của mục nổi bật nếu có", () => {
    records.list = [base({ image: "/images/featured/banner.jpg" })];
    expect(getFeatured("vi", NOW)[0].image).toBe("/images/featured/banner.jpg");
  });
});

describe("GET /api/featured", () => {
  beforeEach(() => {
    records.list = [base({ id: "a" })];
  });

  it("trả danh sách theo ngôn ngữ", async () => {
    const res = await GET(new Request("http://localhost/api/featured?locale=en"));
    expect(res.status).toBe(200);
    expect(((await res.json()) as { data: { headline: string }[] }).data[0].headline).toBe("Headline");
  });

  it("trả 400 khi locale sai", async () => {
    expect((await GET(new Request("http://localhost/api/featured?locale=jp"))).status).toBe(400);
  });
});

describe("FeaturedMenu", () => {
  beforeEach(() => {
    useUIStore.setState(initialUIState);
    records.list = [
      base({ id: "a", menuItemId: "matcha-salted-cream", order: 1, badge: { vi: "Signature", en: "Signature" } }),
      base({ id: "b", menuItemId: "matcha-cookie", order: 2, headline: { vi: "Ăn kèm", en: "Side" } }),
    ];
  });

  const renderWithData = () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(queryKeys.featured("vi"), getFeatured("vi", NOW));
    return renderWithProviders(<FeaturedMenu />, { queryClient });
  };

  it("hiển thị món đầu tiên, bấm danh sách thì đổi món", async () => {
    const user = userEvent.setup();
    renderWithData();

    const first = screen.getByTestId("featured-spotlight");
    expect(within(first).getByRole("heading", { name: "Matcha Kem Muối" })).toBeInTheDocument();
    expect(within(first).getByText(/49\.000/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Cookie Matcha/ }));
    expect(await screen.findByRole("heading", { name: "Cookie Matcha" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cookie Matcha/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("nút Xem trong menu chọn đúng danh mục của món", async () => {
    const user = userEvent.setup();
    renderWithData();
    await user.click(screen.getByRole("button", { name: /Cookie Matcha/ }));
    const card = (await screen.findByRole("heading", { name: "Cookie Matcha" })).closest("article")!;
    await user.click(within(card).getByRole("link", { name: "Xem trong menu" }));
    expect(useUIStore.getState().activeCategory).toBe("bakery");
  });

  it("ẩn cả section khi không có mục nào đang chạy", () => {
    records.list = [];
    const { container } = renderWithData();
    expect(container).toBeEmptyDOMElement();
  });
});
