import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import vi from "../../messages/vi.json";

function flatKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === "object" ? flatKeys(value as Record<string, unknown>, path) : [path];
  });
}

describe("messages", () => {
  it("vi.json và en.json có cùng bộ key", () => {
    expect(flatKeys(en).sort()).toEqual(flatKeys(vi).sort());
  });

  it("không có bản dịch rỗng", () => {
    for (const [name, file] of Object.entries({ vi, en })) {
      const empty = flatKeys(file).filter((k) => {
        const value = k.split(".").reduce<unknown>((o, p) => (o as Record<string, unknown>)[p], file);
        return typeof value !== "string" || value.trim() === "";
      });
      expect(empty, name).toEqual([]);
    }
  });
});
