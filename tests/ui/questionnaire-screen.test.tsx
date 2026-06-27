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
    title: "你现在是否能安全、独立地继续作答？",
    options: [{ code: "A", label: "可以" }],
    required: true,
    privacy: "private",
    sensitivity: "none",
  },
];

describe("QuestionnaireScreen", () => {
  it("renders Chinese progress messaging and disables next when save failed", () => {
    const html = renderToStaticMarkup(
      <QuestionnaireScreen
        title="安全与自主"
        questions={questions}
        progressLabel="已完成 1 / 10"
        pageRangeLabel="第 1 题，共 1 题"
        safetyBanner="请先确认当前环境安全，再继续填写。"
        saveStatus="error"
        onAnswerChange={() => undefined}
        onNext={() => undefined}
        onBack={() => undefined}
      />,
    );

    expect(html).toContain("请先确认当前环境安全，再继续填写。");
    expect(html).toContain("已完成 1 / 10");
    expect(html).toContain("第 1 题，共 1 题");
    expect(html).toContain("下一题");
    expect(html).toContain("disabled");
  });
});
