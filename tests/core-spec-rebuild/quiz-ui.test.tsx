import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  DetailView,
  HomeView,
  QuizView,
  ResultView,
  getResumeQuestionIndex,
} from "@/core-spec-rebuild/CoreSpecRebuildApp";
import { QUESTIONS, getArchetype } from "@/core-spec-rebuild/model";
import { createEmptyAnswers, matchArchetype } from "@/core-spec-rebuild/scoring";

describe("core-spec-rebuild home ui", () => {
  it("shows restart instead of continue when a completed result already exists", () => {
    const html = renderToStaticMarkup(
      <HomeView
        hasDraft
        canOpenResult
        saveMessage={null}
        onStart={() => {}}
        onOpenResult={() => {}}
        onOpenCatalog={() => {}}
        onOpenDetail={() => {}}
        onReset={() => {}}
      />,
    );

    expect(html).toContain("重新测试");
    expect(html).not.toContain("继续测试");
    expect(html).not.toContain("清空本机草稿");
  });
});

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
  it("renders breadcrumb, shared dimension info, and standalone trait sections without similar types", () => {
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
    expect(html).not.toContain("rounded-full border border-[#e1d8cd]");
    expect(html).toContain("匹配度");
    expect(html).toContain("精准命中");
    expect(html).toContain("维度信息");
    expect(html).not.toContain("维度雷达");
    expect(html).not.toContain("15 个维度一起看，只展示高低趋势，不公开原始分数。");
    expect(html).not.toContain("15 维度画像");
    expect(html).toContain("典型反应");
    expect(html).toContain("最容易翻车的地方");
    expect(html).toContain("别人怎么配合你更有用");
    expect(html).not.toContain("扩写性格特点");
    expect(html).not.toContain("相近类型 TOP 5");
    expect(html).not.toContain("乱码");
  });
});

describe("core-spec-rebuild detail ui", () => {
  it("keeps the enlarged poster while reusing the lower report sections", () => {
    const archetype = getArchetype("CTRL");
    const html = renderToStaticMarkup(
      <DetailView archetypeCode={archetype.code} onBack={() => {}} onOpenCatalog={() => {}} onOpenDetail={() => {}} />,
    );

    expect(html).toContain(archetype.punchline);
    expect(html).toContain("维度信息");
    expect(html).toContain("典型反应");
    expect(html).not.toContain("相近类型 TOP 5");
    expect(html).not.toContain("所属家族");
  });
});
