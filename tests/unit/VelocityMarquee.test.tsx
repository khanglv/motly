import { render, screen } from "@testing-library/react";
import { domMax, LazyMotion } from "framer-motion";
import { afterEach, describe, expect, it, vi } from "vitest";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("framer-motion", async (importOriginal) => {
  const mod = await importOriginal<typeof import("framer-motion")>();
  return { ...mod, useReducedMotion: () => reduced.value };
});

import { VelocityMarquee } from "@/components/ui/VelocityMarquee";

const renderMarquee = () =>
  render(
    <LazyMotion features={domMax} strict>
      <VelocityMarquee>
        <span>Matcha Latte</span>
      </VelocityMarquee>
    </LazyMotion>,
  );

describe("VelocityMarquee", () => {
  afterEach(() => {
    reduced.value = false;
  });

  it("lặp nội dung đủ nhiều để dải phủ kín màn hình", () => {
    renderMarquee();
    expect(screen.getAllByText("Matcha Latte")).toHaveLength(4);
  });

  it("dịch chuyển dải chữ khi chuyển động được bật", () => {
    renderMarquee();
    const track = screen.getAllByText("Matcha Latte")[0].parentElement!.parentElement!;
    expect(track.style.transform).toContain("translateX");
  });

  it("đứng yên khi người dùng bật giảm chuyển động", () => {
    reduced.value = true;
    renderMarquee();
    const track = screen.getAllByText("Matcha Latte")[0].parentElement!.parentElement!;
    expect(track.style.transform).toBe("");
  });
});
