import { describe, expect, it } from "vitest";

describe("test setup", () => {
  it("chạy được Vitest với jsdom", () => {
    const el = document.createElement("div");
    el.textContent = "Một Ly";
    document.body.appendChild(el);
    expect(el).toBeInTheDocument();
  });
});
