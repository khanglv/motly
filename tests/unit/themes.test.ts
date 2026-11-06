import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { THEMES } from "@/config/themes";
import { siteConfig } from "@/config/site";

const styles = join(__dirname, "../../src/styles");
const globals = readFileSync(join(styles, "globals.css"), "utf8");
const themes = readFileSync(join(styles, "themes.css"), "utf8");

/** Lấy tên các biến --color-* trong một khối CSS */
const colorVars = (block: string) => [...block.matchAll(/(--color-[a-z0-9-]+)\s*:/g)].map((m) => m[1]).sort();

describe("tông màu", () => {
  const themeBlock = globals.slice(globals.indexOf("@theme {"), globals.indexOf("--font-display"));
  const baseVars = colorVars(themeBlock);

  it("có đúng 5 tông và tông đang dùng hợp lệ", () => {
    expect(THEMES.map((t) => t.id)).toEqual(["matcha", "uji", "mint", "hojicha", "sakura"]);
    expect(THEMES.map((t) => t.id)).toContain(siteConfig.theme);
  });

  it.each(THEMES.filter((t) => t.id !== "matcha").map((t) => t.id))(
    "tông %s ghi đè đủ các biến màu của tông mặc định",
    (id) => {
      const match = themes.match(new RegExp(`\\[data-theme='${id}'\\]\\s*\\{([^}]*)\\}`));
      expect(match, `thiếu khối [data-theme='${id}'] trong themes.css`).not.toBeNull();
      expect(colorVars(match![1])).toEqual(baseVars);
    },
  );
});
