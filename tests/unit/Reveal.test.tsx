import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("framer-motion", async (importOriginal) => {
  const mod = await importOriginal<typeof import("framer-motion")>();
  return { ...mod, useReducedMotion: () => reduced.value };
});

import { Reveal } from "@/components/ui/Reveal";

describe("Reveal", () => {
  afterEach(() => {
    reduced.value = false;
  });

  it("ẩn nội dung ban đầu để chờ animation khi cuộn tới", () => {
    render(<Reveal>Nội dung</Reveal>);
    const el = screen.getByText("Nội dung");
    expect(el).toHaveAttribute("data-reveal");
    expect(el.style.opacity).toBe("0");
  });

  it("hiện ngay, không dịch chuyển khi người dùng bật giảm chuyển động", () => {
    reduced.value = true;
    render(<Reveal>Nội dung</Reveal>);
    const el = screen.getByText("Nội dung");
    expect(el.style.opacity).not.toBe("0");
    expect(el.style.transform).toBe("");
  });
});
