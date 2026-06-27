import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { QuestionRenderer } from "@/features/questionnaire/QuestionRenderer";
import type { AnswerValue, QuestionMeta } from "@/domain/types";

const baseQuestion: QuestionMeta = {
  id: "q1",
  answerKey: "Q-TEST",
  audience: "user",
  phase: "core",
  moduleId: "mod",
  questionType: "singleSelect",
  title: "测试问题",
  required: true,
  privacy: "private",
  sensitivity: "none",
  options: [
    { code: "A", label: "选项A" },
    { code: "B", label: "选项B" },
  ],
};

describe("QuestionRenderer", () => {
  it("renders labels for single, multi, scale, date, currency, and free-text inputs", () => {
    const html = renderToStaticMarkup(
      <div>
        <QuestionRenderer question={baseQuestion} value={{ status: "answered", value: "A" }} onChange={() => undefined} />
        <QuestionRenderer
          question={{ ...baseQuestion, id: "q2", answerKey: "Q-MULTI", questionType: "multiSelect" }}
          value={{ status: "answered", value: ["A"] }}
          onChange={() => undefined}
        />
        <QuestionRenderer
          question={{ ...baseQuestion, id: "q3", answerKey: "Q-SCALE", questionType: "scale" }}
          value={{ status: "answered", value: "B" }}
          onChange={() => undefined}
        />
        <QuestionRenderer
          question={{ ...baseQuestion, id: "q4", answerKey: "Q-DATE", questionType: "date", options: undefined }}
          value={{ status: "answered", value: "2026-06-27" }}
          onChange={() => undefined}
        />
        <QuestionRenderer
          question={{ ...baseQuestion, id: "q5", answerKey: "Q-CURRENCY", questionType: "currency", options: undefined }}
          value={{ status: "answered", value: 1000 }}
          onChange={() => undefined}
        />
        <QuestionRenderer
          question={{ ...baseQuestion, id: "q6", answerKey: "Q-TEXT", questionType: "freeText", options: undefined }}
          value={{ status: "unanswered" }}
          onChange={() => undefined}
        />
      </div>,
    );

    expect(html).toContain("测试问题");
    expect(html).toContain("选项A");
    expect(html).toContain("textarea");
    expect(html).toContain("type=\"date\"");
    expect(html).toContain("type=\"number\"");
  });

  it("shows required guidance and declined-answer semantics without treating decline as an error", () => {
    const html = renderToStaticMarkup(
      <QuestionRenderer
        question={baseQuestion}
        value={{ status: "declined" } satisfies AnswerValue}
        onChange={() => undefined}
      />,
    );

    expect(html).toContain("必答");
    expect(html).toContain("暂时不想回答");
    expect(html).not.toContain("错误");
  });
});
