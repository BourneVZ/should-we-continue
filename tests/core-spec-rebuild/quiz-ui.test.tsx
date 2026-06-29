import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  DetailView,
  HomeView,
  QuizView,
  ResultView,
  getResumeQuestionIndex,
} from "@/core-spec-rebuild/CoreSpecRebuildApp";
import { QUESTIONS, getArchetype, getArchetypeDescription } from "@/core-spec-rebuild/model";
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
  it("renders the intro, dimension info, and six extended sections without similar types", () => {
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
    expect(html).toContain("维度信息");
    expect(html).toContain(archetype.intro);
    expect(html).not.toContain(getArchetypeDescription(archetype));
    expect(html).toContain("你第一反应通常先去哪");
    expect(html).toContain("你脑内最常开的预演剧情");
    expect(html).toContain("你真正在意的点是什么");
    expect(html).toContain("你最容易把自己逼到哪一步");
    expect(html).toContain("什么情况下你会明显失真");
    expect(html).toContain("别人怎么配合你更有用");
    expect(html).not.toContain("相近类型 TOP 5");
  });
});

describe("core-spec-rebuild detail ui", () => {
  it("uses direct home navigation in breadcrumb and reuses the six lower report sections", () => {
    const archetype = getArchetype("CTRL");
    const html = renderToStaticMarkup(
      <DetailView archetypeCode={archetype.code} onGoHome={() => {}} onOpenCatalog={() => {}} onOpenDetail={() => {}} />,
    );

    expect(html).toContain("返回首页");
    expect(html).toContain("全部类型");
    expect(html).toContain("类型详情");
    expect(html).toContain(archetype.punchline);
    expect(html).toContain(archetype.intro);
    expect(html).toContain("维度信息");
    expect(html).toContain("你第一反应通常先去哪");
    expect(html).toContain("别人怎么配合你更有用");
    expect(html).not.toContain("相近类型 TOP 5");
  });
});
