import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AnalysisPage } from "@/features/report/AnalysisPage";
import { createReportViewModel } from "../fixtures/factories";

describe("AnalysisPage", () => {
  it("renders region source/date/conditions, stale marker, and symmetric path sections", () => {
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
                applicableIf: ["manual recheck needed"],
              },
            ],
          },
        })}
        privateNoteSummaryVisible={false}
      />,
    );

    expect(html).toContain("地区参考卡片");
    expect(html).toContain("https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml");
    expect(html).toContain("该地区信息可能已过期");
    expect(html).toContain("如果继续妊娠");
    expect(html).toContain("如果终止妊娠");
    expect(html).not.toContain("This analysis is mainly based on these facts");
  });

  it("shows optional deep dive module entries", () => {
    const html = renderToStaticMarkup(
      <AnalysisPage
        report={createReportViewModel()}
        privateNoteSummaryVisible={false}
        deepDiveModules={[
          {
            moduleId: "medical-deep",
            title: "Medical follow-up",
            estimatedQuestions: 4,
            purpose: "Fill in next-step medical planning details.",
            onSelect: () => undefined,
          },
        ]}
      />,
    );

    expect(html).toContain("可补充的深入模块");
    expect(html).toContain("Medical follow-up");
    expect(html).toContain("打开模块");
  });

  it("shows partner-discussion preparation and pending path copy without the redundant overview button", () => {
    const html = renderToStaticMarkup(
      <AnalysisPage
        report={createReportViewModel({
          dimensions: [
            {
              dimensionId: "medicalSafetySupport",
              displayLevel: "medium",
              certaintyLevel: "medium",
              reasonIds: ["Q-DEEP-MED-NEXT-STEPS"],
            },
          ],
          priorityActionIds: ["ACT-CLARIFY-MEDICAL"],
          pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "continue-medical" }],
          pathEnd: [{ conditionId: "end-1", status: "pending", labelId: "end-medical" }],
        })}
        privateNoteSummaryVisible={false}
        onPreparePartnerDiscussion={() => undefined}
      />,
    );

    expect(html).toContain("综合分析");
    expect(html).toContain("准备共同讨论页");
    expect(html).toContain("待确认路径条件");
    expect(html).not.toContain("Back to Overview");
  });

  it("does not keep sending completed deep-dive modules back to the optional questionnaire list", () => {
    const html = renderToStaticMarkup(
      <AnalysisPage
        report={createReportViewModel()}
        privateNoteSummaryVisible={false}
        deepDiveModules={[
          {
            moduleId: "medical-deep",
            title: "Medical follow-up",
            estimatedQuestions: 4,
            purpose: "Fill in next-step medical planning details.",
            status: "completed",
            onSelect: () => undefined,
          },
        ]}
      />,
    );

    expect(html).not.toContain("Medical follow-up");
    expect(html).not.toContain("打开模块");
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
        privateNoteSummaryVisible={false}
      />,
    );

    expect(html).toContain("杭州 3 岁以下育儿补贴");
    expect(html).toContain("3600");
    expect(html).not.toContain("No verified regional reference card is available yet.");
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
                applicableIf: ["zhejiang policy review needed"],
              },
            ],
          },
        })}
        privateNoteSummaryVisible={false}
      />,
    );

    expect(html).toContain("浙江生育假参考");
    expect(html).not.toContain("<h3 class=\"text-lg font-semibold text-slate-900\">leave.zj.birth.first</h3>");
  });
});
