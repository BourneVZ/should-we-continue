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
        onContinueToReport={() => undefined}
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

  it("changes the final action copy when some or all optional modules are completed", () => {
    const partialHtml = renderToStaticMarkup(
      <DeepDiveScreen
        recommendations={[
          { moduleId: "medical-deep", title: "就医安排补充", estimatedQuestions: 4, purpose: "补齐就医安排", status: "completed" },
          { moduleId: "mental-deep", title: "心理支持补充", estimatedQuestions: 3, purpose: "补齐支持安排", status: "not-started" },
        ]}
        personaExtra={{ moduleId: "persona-deep", title: "互动风格校准", estimatedQuestions: 12, purpose: "校准沟通偏好", status: "not-started" }}
        skipConfirmationOpen={false}
        onSelectModule={() => undefined}
        onRequestSkipAll={() => undefined}
        onConfirmSkipAll={() => undefined}
        onContinueToReport={() => undefined}
      />,
    );

    expect(partialHtml).toContain("跳过剩余");
    expect(partialHtml).not.toContain("跳过全部");

    const completeHtml = renderToStaticMarkup(
      <DeepDiveScreen
        recommendations={[
          { moduleId: "medical-deep", title: "就医安排补充", estimatedQuestions: 4, purpose: "补齐就医安排", status: "completed" },
        ]}
        personaExtra={{ moduleId: "persona-deep", title: "互动风格校准", estimatedQuestions: 12, purpose: "校准沟通偏好", status: "completed" }}
        skipConfirmationOpen={false}
        onSelectModule={() => undefined}
        onRequestSkipAll={() => undefined}
        onConfirmSkipAll={() => undefined}
        onContinueToReport={() => undefined}
      />,
    );

    expect(completeHtml).toContain("进入下一环节");
    expect(completeHtml).not.toContain("跳过全部");
  });
});
