import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SafetyPriorityScreen } from "@/features/report/SafetyPriorityScreen";

describe("SafetyPriorityScreen", () => {
  it("renders only generic offline actions and hides persona, dimensions, paths, and partner discussion", () => {
    const html = renderToStaticMarkup(
      <SafetyPriorityScreen
        level="R4"
        actionIds={["ACT-URGENT-MEDICAL"]}
        onReturn={() => undefined}
        onClearData={() => undefined}
        onContinueSafely={() => undefined}
      />,
    );

    expect(html).toContain("ACT-URGENT-MEDICAL");
    expect(html).toContain("返回");
    expect(html).toContain("清除本机数据");
    expect(html).not.toContain("伴侣讨论");
    expect(html).not.toContain("P10");
  });
});
