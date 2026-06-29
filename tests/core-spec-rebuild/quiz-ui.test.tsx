import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  DetailView,
  QuizView,
  ResultView,
  getResumeQuestionIndex,
} from "@/core-spec-rebuild/CoreSpecRebuildApp";
import { QUESTIONS, getArchetype } from "@/core-spec-rebuild/model";
import { createEmptyAnswers, matchArchetype } from "@/core-spec-rebuild/scoring";

describe("core-spec-rebuild quiz ui", () => {
  it("renders the simplified quiz card chrome", () => {
    const html = renderToStaticMarkup(
      <QuizView
        index={1}
        answeredCount={1}
        selectedValue={null}
        validationMessage={null}
        onExit={() => {}}
        onPrevious={() => {}}
        onChange={() => {}}
      />,
    );

    const question = QUESTIONS[1];

    expect(html).toContain(question.prompt);
    expect(html).toContain("1/30 已完成");
    expect(html).toContain("上一题");
    expect(html).not.toContain("下一题");
    expect(html).not.toContain("没有标准答案");
    expect(html).not.toContain("按“像不像你当前会进入这种模式”来选");
  });

  it("resumes from the first unanswered question after exiting mid-quiz", () => {
    const answers = createEmptyAnswers();

    answers.Q01 = 2;
    answers.Q02 = 4;

    expect(getResumeQuestionIndex(answers, 6)).toBe(2);
  });
});

describe("core-spec-rebuild result ui", () => {
  it("renders the breadcrumb, radar section, trait cards and ranked similar types", () => {
    const archetype = getArchetype("CTRL");
    const match = matchArchetype(archetype.prototype);
    const html = renderToStaticMarkup(
      <ResultView
        matched={match.primary}
        resultVector={archetype.prototype}
        rankedMatches={match.ranked}
        onGoHome={() => {}}
        onOpenDetail={() => {}}
        onRetake={() => {}}
        onBrowseAll={() => {}}
      />,
    );

    expect(html).toContain("返回首页");
    expect(html).toContain("测试结果");
    expect(html).toContain("匹配度");
    expect(html).toContain("精准命中");
    expect(html).toContain("维度雷达");
    expect(html).toContain("15 维度画像");
    expect(html).toContain("典型反应");
    expect(html).toContain("最容易翻车的地方");
    expect(html).toContain("别人怎么配合你更有用");
    expect(html).toContain("相近类型 TOP 5");
    expect(html).toContain("#1");
    expect(html).toContain("%");
  });
});

describe("core-spec-rebuild detail ui", () => {
  it("keeps the enlarged poster while restoring the lower sections", () => {
    const archetype = getArchetype("CTRL");
    const html = renderToStaticMarkup(
      <DetailView archetypeCode={archetype.code} onBack={() => {}} onOpenCatalog={() => {}} onOpenDetail={() => {}} />,
    );

    expect(html).toContain(archetype.punchline);
    expect(html).toContain("15 维度画像");
    expect(html).toContain("典型反应");
    expect(html).toContain("相近类型 TOP 5");
  });
});
