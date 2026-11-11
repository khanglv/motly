import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createTestQueryClient, renderWithProviders } from "../utils";
import { Stars } from "@/components/ui/Stars";
import { Reviews } from "@/components/sections/reviews/Reviews";
import { getReviews } from "@/lib/data-service";
import { queryKeys } from "@/lib/query-keys";

describe("Stars", () => {
  it.each([5, 4, 1])("render %i sao đầy và nhãn cho trình đọc màn hình", (rating) => {
    render(<Stars rating={rating} label={`${rating} trên 5 sao`} />);
    const stars = screen.getByRole("img", { name: `${rating} trên 5 sao` });
    expect(stars.querySelectorAll('[data-filled="true"]')).toHaveLength(rating);
    expect(stars.querySelectorAll("svg")).toHaveLength(5);
  });

  it("giới hạn giá trị trong khoảng 0–5", () => {
    render(<Stars rating={9} label="x" />);
    expect(screen.getByRole("img").querySelectorAll('[data-filled="true"]')).toHaveLength(5);
  });
});

describe("Reviews", () => {
  it("hiển thị review đầu tiên và chuyển bằng nút tiếp theo", async () => {
    const user = userEvent.setup();
    const data = getReviews("vi");
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(queryKeys.reviews("vi"), data);

    renderWithProviders(<Reviews />, { queryClient });

    expect(screen.getByText(data[0].author)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: `${data[0].rating} trên 5 sao` })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Đánh giá tiếp theo" }));
    expect(await screen.findByText(data[1].author)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: `Xem đánh giá ${data.length}` }));
    expect(await screen.findByText(data[data.length - 1].author)).toBeInTheDocument();
  });
});
