import { screen, within } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { messages, renderWithProviders } from "../utils";
import { siteConfig } from "@/config/site";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ locale, namespace }: { locale: "vi" | "en"; namespace: string }) =>
    createTranslator({ locale, messages: messages[locale], namespace: namespace as never }),
}));

import { Location } from "@/components/sections/Location";

describe("Location", () => {
  it("hiển thị địa chỉ, giờ mở cửa và link từ site.ts (vi)", async () => {
    renderWithProviders(await Location({ locale: "vi" }));

    const address = screen.getByText(/93 Trần Thị Nghỉ/).closest("address")!;
    expect(address).toHaveTextContent("Quận Gò Vấp, TP. Hồ Chí Minh");
    expect(screen.getByText(/Thứ Hai – Chủ Nhật/)).toHaveTextContent("08:00 – 21:30");

    const callLinks = screen.getAllByRole("link", { name: /Gọi ngay|0388 738 680/ });
    callLinks.forEach((a) => expect(a).toHaveAttribute("href", "tel:+84388738680"));

    const directions = screen.getByRole("link", { name: "Chỉ đường" });
    expect(directions).toHaveAttribute("href", siteConfig.map.directionsUrl);
    expect(directions.getAttribute("href")).toContain("destination=93%20Tr%E1%BA%A7n%20Th%E1%BB%8B%20Ngh%E1%BB%89");
    expect(directions).toHaveAttribute("rel", "noopener noreferrer");

    expect(screen.getByTitle("Bản đồ đường đến Một Ly Café & Matcha")).toHaveAttribute("loading", "lazy");
  });

  it("khối Đặt món có nút GrabFood, link Facebook, ẩn ShopeeFood khi chưa có link", async () => {
    renderWithProviders(await Location({ locale: "vi" }));
    const order = within(document.getElementById("order")!);

    const grab = order.getByRole("link", { name: /Đặt món trên GrabFood/ });
    // Chưa điền link cửa hàng: mở trang GrabFood chung và nhắc khách tìm tên quán
    expect(grab).toHaveAttribute("href", siteConfig.delivery.grabfoodFallback);
    expect(grab).toHaveAttribute("rel", "noopener noreferrer");
    expect(order.getByText(/tìm “Một Ly”/)).toBeInTheDocument();

    expect(order.getByRole("link", { name: /Nhắn tin Facebook/ })).toHaveAttribute("href", siteConfig.social.facebook);
    expect(order.queryByRole("link", { name: "ShopeeFood" })).not.toBeInTheDocument();
  });

  it("dùng bản dịch tiếng Anh", async () => {
    renderWithProviders(await Location({ locale: "en" }), { locale: "en" });
    expect(screen.getByText(/Go Vap District, Ho Chi Minh City/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get directions" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Order on GrabFood/ })).toBeInTheDocument();
  });
});
