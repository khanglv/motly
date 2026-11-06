import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockFetch, renderWithProviders } from "../utils";
import { Menu } from "@/components/sections/menu/Menu";
import { getMenu, isLocale, isMenuFilter } from "@/lib/data-service";
import { initialUIState, useUIStore } from "@/store/ui-store";

// Mock fetch dùng chính data-service để giống API thật
const apiFetchMock = () =>
  mockFetch((url) => {
    const locale = url.searchParams.get("locale");
    const category = url.searchParams.get("category");
    if (!isLocale(locale) || !isMenuFilter(category)) return { status: 400, body: { error: "bad" } };
    return { body: { data: getMenu(locale, category) } };
  });

describe("Menu section", () => {
  beforeEach(() => useUIStore.setState(initialUIState));
  afterEach(() => vi.unstubAllGlobals());

  it("mặc định hiện bảng tổng quan: mọi danh mục trên một màn hình", async () => {
    vi.stubGlobal("fetch", apiFetchMock());
    renderWithProviders(<Menu />);

    expect(screen.getAllByTestId("menu-skeleton").length).toBeGreaterThan(0);
    expect(await screen.findByRole("heading", { name: "Matcha Kem Muối" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tất cả" })).toHaveAttribute("aria-selected", "true");
    // Mỗi danh mục là một cột có tiêu đề và số món
    for (const name of [/^Matcha.*\d+ món$/, /^Cà phê.*\d+ món$/, /^Bánh.*\d+ món$/]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Bạc Xỉu" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Croissant Bơ" })).toBeInTheDocument();
  });

  it("bấm tab Bánh thì danh sách đổi sang món bánh", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", apiFetchMock());
    renderWithProviders(<Menu />);
    await screen.findByRole("heading", { name: "Matcha Latte" });

    await user.click(screen.getByRole("tab", { name: "Bánh" }));

    expect(await screen.findByRole("heading", { name: "Croissant Bơ" })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("heading", { name: "Matcha Latte" })).not.toBeInTheDocument());
    expect(useUIStore.getState().activeCategory).toBe("bakery");
  });

  it("hiển thị giá gọn (45k), giá đầy đủ cho trình đọc màn hình, và nhãn", async () => {
    vi.stubGlobal("fetch", apiFetchMock());
    renderWithProviders(<Menu />);
    const card = (await screen.findByRole("heading", { name: "Matcha Latte" })).closest("article")!;
    expect(within(card).getByText("45k")).toBeInTheDocument();
    expect(within(card).getByText(/45\.000\s?₫/)).toHaveClass("sr-only");
    expect(within(card).getByText("Signature")).toBeInTheDocument();
    expect(within(card).getByText("Bán chạy")).toBeInTheDocument();
  });

  it("hiển thị lỗi và thử lại được", async () => {
    const user = userEvent.setup();
    const failing = mockFetch(() => ({ status: 500, body: { error: "boom" } }));
    vi.stubGlobal("fetch", failing);
    renderWithProviders(<Menu />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Không tải được menu.");

    vi.stubGlobal("fetch", apiFetchMock());
    await user.click(within(alert).getByRole("button", { name: "Thử lại" }));
    expect(await screen.findByRole("heading", { name: "Matcha Latte" })).toBeInTheDocument();
  });
});
