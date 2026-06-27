import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DeepDiveScreen } from "@/features/deep-dives/DeepDiveScreen";

describe("DeepDiveScreen", () => {
  it("renders recommended modules, the persona extra module, and skip confirmation guidance", () => {
    const html = renderToStaticMarkup(
      <DeepDiveScreen
        recommendations={[
          { moduleId: "mental-health", title: "情绪与支持", estimatedQuestions: 8, purpose: "补齐支持信息", status: "not-started" },
          { moduleId: "values", title: "价值冲突", estimatedQuestions: 6, purpose: "澄清个人意愿", status: "completed" },
        ]}
        personaExtra={{ moduleId: "persona-deep", title: "角色细化", estimatedQuestions: 12, purpose: "帮助沟通偏好校准", status: "in-progress" }}
        skipConfirmationOpen
        onSelectModule={() => undefined}
        onRequestSkipAll={() => undefined}
        onConfirmSkipAll={() => undefined}
      />,
    );

    expect(html).toContain("情绪与支持");
    expect(html).toContain("角色细化");
    expect(html).toContain("未开始");
    expect(html).toContain("进行中");
    expect(html).toContain("已完成");
    expect(html).toContain("未完成不参与报告");
    expect(html).toContain("确认跳过");
  });
});
