import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AnalysisPage } from "@/features/report/AnalysisPage";
import { createReportViewModel } from "../fixtures/factories";

describe("AnalysisPage", () => {
  it("renders question facts first, region source/date/conditions, stale marker, and symmetric path sections", () => {
    const html = renderToStaticMarkup(
      <AnalysisPage
        report={createReportViewModel({
          pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "continue-medical" }],
          pathEnd: [{ conditionId: "end-1", status: "confirmed", labelId: "end-medical" }],
          region: {
            status: "stale",
            checkedAt: "2026-06-20",
            expiresAt: "2026-06-27",
            verifiedFields: [
              {
                fieldId: "benefit.hz.under3_annual",
                value: "3600",
                sourceUrl: "https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml",
                checkedAt: "2026-06-20",
                applicableIf: ["需另行核对"],
              },
            ],
          },
        })}
        commonFactIds={["Q-MED-PREGNANCY-CONFIRMED", "Q-WILL-SELF-VS-OTHERS"]}
        privateNoteSummaryVisible={false}
      />,
    );

    expect(html).toContain("这次怀孕目前确认到什么程度");
    expect(html).toContain("https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml");
    expect(html).toContain("这部分信息可能已过期");
    expect(html).toContain("先确认检查、复诊与风险排查安排");
    expect(html).toContain("先确认正规就医路径、时间点与术前准备");
    expect(html).not.toContain("默认推荐");
  });

  it("shows missing fact guidance with question links when there are no derived facts yet", () => {
    const html = renderToStaticMarkup(
      <AnalysisPage
        report={createReportViewModel({
          dimensions: [],
          region: {
            status: "empty",
            checkedAt: null,
            expiresAt: null,
            verifiedFields: [],
          },
        })}
        commonFactIds={[]}
        privateNoteSummaryVisible={false}
        suggestedQuestionLinks={[
          {
            answerKey: "Q-MED-PREGNANCY-CONFIRMED",
            label: "这次怀孕目前确认到什么程度？",
            moduleLabel: "医学状态",
            onSelect: () => undefined,
          },
        ]}
      />,
    );

    expect(html).toContain("建议先补充这些问题");
    expect(html).toContain("医学状态");
    expect(html).toContain("这次怀孕目前确认到什么程度？");
    expect(html).toContain("补充这个问题");
  });

  it("shows optional deep dive module entries separately from missing fact guidance", () => {
    const html = renderToStaticMarkup(
      <AnalysisPage
        report={createReportViewModel()}
        commonFactIds={[]}
        privateNoteSummaryVisible={false}
        deepDiveModules={[
          {
            moduleId: "medical-deep",
            title: "就医安排补充",
            estimatedQuestions: 4,
            purpose: "补齐下一步就医、陪同和突发情况安排。",
            onSelect: () => undefined,
          },
        ]}
      />,
    );

    expect(html).toContain("可选深入问卷");
    expect(html).toContain("就医安排补充");
    expect(html).toContain("进入这个模块");
  });

  it("falls back to the default Hangzhou region card when no verified cache is present", () => {
    const html = renderToStaticMarkup(
      <AnalysisPage
        report={createReportViewModel({
          region: {
            status: "empty",
            checkedAt: null,
            expiresAt: null,
            verifiedFields: [],
          },
        })}
        commonFactIds={["Q-MED-PREGNANCY-CONFIRMED"]}
        privateNoteSummaryVisible={false}
      />,
    );

    expect(html).toContain("杭州 3 岁以下婴幼儿养育补助参考");
    expect(html).toContain("3600");
    expect(html).not.toContain("当前没有已验证的地区卡片");
  });

  it("uses user-facing region field labels instead of internal field ids", () => {
    const html = renderToStaticMarkup(
      <AnalysisPage
        report={createReportViewModel({
          region: {
            status: "fresh",
            checkedAt: "2026-06-26",
            expiresAt: "2026-07-03",
            verifiedFields: [
              {
                fieldId: "leave.zj.birth.first",
                value: "158",
                sourceUrl: "https://www.zjftu.org/page/zj_zgh/zj_fwdt/zgh_fwdt_zclj/2022-04-26/38096773135051971.html",
                checkedAt: "2026-06-26",
                applicableIf: ["浙江适用，需按劳动关系和单位制度确认"],
              },
            ],
          },
        })}
        commonFactIds={["Q-MED-PREGNANCY-CONFIRMED"]}
        privateNoteSummaryVisible={false}
      />,
    );

    expect(html).toContain("浙江一孩产假参考天数");
    expect(html).not.toContain("<h3 class=\"text-lg font-semibold text-slate-900\">leave.zj.birth.first</h3>");
  });
});
