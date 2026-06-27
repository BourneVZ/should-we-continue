import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeScreen } from "@/features/home/HomeScreen";

describe("HomeScreen", () => {
  it("renders the Chinese landing page with privacy guidance and existing-data actions", () => {
    const html = renderToStaticMarkup(
      <HomeScreen
        hasExistingData
        reportStatus="fresh"
        onStartOrResume={() => undefined}
        onOpenLatestReport={() => undefined}
        onClearData={() => undefined}
      />,
    );

    expect(html).toContain("把混乱拆成一题一题");
    expect(html).toContain("本地优先保存");
    expect(html).toContain("当前浏览器本地");
    expect(html).toContain("继续填写问卷");
    expect(html).toContain("查看当前报告");
    expect(html).toContain("清除本机数据");
    expect(html).toContain("inline-flex");
    expect(html).toContain("items-center");
    expect(html).toContain("justify-center");
    expect(html).not.toContain("window.location");
  });
});
