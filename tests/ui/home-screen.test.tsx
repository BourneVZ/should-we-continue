import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeScreen } from "@/features/home/HomeScreen";

describe("HomeScreen", () => {
  it("renders privacy guidance and the three existing-data entries without auto-navigation", () => {
    const html = renderToStaticMarkup(
      <HomeScreen
        hasExistingData
        reportStatus="fresh"
        onStartOrResume={() => undefined}
        onOpenLatestReport={() => undefined}
        onClearData={() => undefined}
      />,
    );

    expect(html).toContain("当前浏览器");
    expect(html).toContain("重新填写并更新报告");
    expect(html).toContain("查看最新报告");
    expect(html).toContain("清除本机数据");
    expect(html).not.toContain("window.location");
  });
});
