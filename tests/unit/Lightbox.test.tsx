import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders } from "../utils";
import { Lightbox } from "@/components/sections/gallery/Lightbox";
import { getGallery } from "@/lib/data-service";
import { initialUIState, useUIStore } from "@/store/ui-store";

const images = getGallery("vi");

describe("Lightbox", () => {
  beforeEach(() => useUIStore.setState(initialUIState));

  it("đóng khi lightboxIndex = null", () => {
    renderWithProviders(<Lightbox images={images} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("mở đúng ảnh, chuyển bằng phím mũi tên và đóng bằng nút Đóng", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Lightbox images={images} />);

    act(() => useUIStore.getState().openLightbox(0));
    const dialog = await screen.findByRole("dialog", { name: "Thư viện ảnh" });
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent(`1 / ${images.length}`);
    expect(dialog).toHaveTextContent(images[0].alt);

    await user.keyboard("{ArrowRight}");
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent(`2 / ${images.length}`);

    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByTestId("lightbox-counter")).toHaveTextContent(`${images.length} / ${images.length}`);

    await user.click(screen.getByRole("button", { name: "Đóng" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(useUIStore.getState().lightboxIndex).toBeNull();
  });

  it("đóng bằng phím Escape", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Lightbox images={images} />);
    act(() => useUIStore.getState().openLightbox(3));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
