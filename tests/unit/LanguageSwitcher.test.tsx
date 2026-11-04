import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../utils";

const replace = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/",
}));

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    replace.mockClear();
    window.location.hash = "";
  });

  it("hiển thị ngôn ngữ hiện tại", () => {
    renderWithProviders(<LanguageSwitcher />, { locale: "vi" });
    expect(screen.getByRole("button", { name: /Đổi ngôn ngữ, hiện tại: Tiếng Việt/ })).toBeInTheDocument();
  });

  it("chọn English thì chuyển sang locale en, giữ nguyên hash", async () => {
    const user = userEvent.setup();
    window.location.hash = "#menu";
    renderWithProviders(<LanguageSwitcher />, { locale: "vi" });

    await user.click(screen.getByRole("button", { name: /Đổi ngôn ngữ/ }));
    await user.click(await screen.findByRole("menuitemradio", { name: "English" }));

    expect(replace).toHaveBeenCalledWith("/#menu", { locale: "en", scroll: false });
  });

  it("chọn lại ngôn ngữ hiện tại thì không làm gì", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />, { locale: "en" });

    await user.click(screen.getByRole("button", { name: /Change language/ }));
    await user.click(await screen.findByRole("menuitemradio", { name: "English" }));

    expect(replace).not.toHaveBeenCalled();
  });
});
