import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { App } from "@/App";

describe("core-spec-rebuild home", () => {
  it("renders the home hero and the all-types entry", () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain("孕妈类型测试");
    expect(html).toContain("开始测试");
    expect(html).toContain("查看全部类型");
    expect(html).toContain("25 种孕妈类型");
  });
});
