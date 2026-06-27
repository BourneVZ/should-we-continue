import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SaveStatusGate } from "@/components/SaveStatusGate";

describe("SaveStatusGate", () => {
  it("renders save failure messaging, retry entry, aria-live, and disabled risky actions", () => {
    const html = renderToStaticMarkup(
      <SaveStatusGate
        status="error"
        message="保存失败，请重试"
        onRetry={() => undefined}
        riskyActions={[
          { id: "leave-page", label: "稍后继续" },
          { id: "generate-report", label: "生成报告" },
        ]}
      />,
    );

    expect(html).toContain("aria-live=\"assertive\"");
    expect(html).toContain("保存失败，请重试");
    expect(html).toContain("重试保存");
    expect(html).toContain("稍后继续");
    expect(html).toContain("生成报告");
    expect(html).toContain("disabled");
  });
});
