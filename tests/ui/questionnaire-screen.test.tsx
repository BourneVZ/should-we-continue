import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { QuestionnaireScreen } from "@/features/questionnaire/QuestionnaireScreen";
import type { QuestionMeta } from "@/domain/types";

const questions: QuestionMeta[] = [
  {
    id: "q1",
    answerKey: "Q-1",
    audience: "user",
    phase: "core",
    moduleId: "module-a",
    questionType: "singleSelect",
    title: "第一页题目",
    options: [{ code: "A", label: "选项A" }],
    required: true,
    privacy: "private",
    sensitivity: "none",
  },
];

describe("QuestionnaireScreen", () => {
  it("renders safety messaging before analysis language and disables defer when save failed", () => {
    const html = renderToStaticMarkup(
      <QuestionnaireScreen
        title="核心问卷"
        questions={questions}
        progressLabel="1 / 10"
        pageRangeLabel="第 1 页，共 1 页"
        safetyBanner="请先完成安全检查"
        saveStatus="error"
        onAnswerChange={() => undefined}
        onNext={() => undefined}
        onBack={() => undefined}
      />,
    );

    expect(html).toContain("请先完成安全检查");
    expect(html).toContain("1 / 10");
    expect(html).toContain("稍后继续");
    expect(html).toContain("disabled");
  });
});
