import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ReportShell } from "@/features/report/ReportShell";
import { createReportViewModel } from "../fixtures/factories";

describe("ReportShell", () => {
  it("swaps to safety substitute for R3/R4 and does not render the normal tab shell", () => {
    const html = renderToStaticMarkup(
      <ReportShell
        activeTab="overview"
        partnerTabEnabled={false}
        report={createReportViewModel({
          redFlag: { level: "R4", actionIds: ["ACT-URGENT-MEDICAL"] },
        })}
      />,
    );

    expect(html).toContain("ACT-URGENT-MEDICAL");
    expect(html).not.toContain("概览");
    expect(html).not.toContain("深入分析");
    expect(html).not.toContain("伴侣讨论");
  });

  it("renders the partner discussion page when the partner tab is active and enabled", () => {
    const html = renderToStaticMarkup(
      <ReportShell
        activeTab="partner"
        partnerTabEnabled={true}
        report={createReportViewModel()}
        partnerDiscussionProps={{
          discussionTopicIds: ["topic:medical_summary", "topic:partner_needs", "topic:note:1"],
          commitmentCategoryIds: ["medical_support", "emotional_support"],
          sharedPathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "continue-medical" }],
          sharedPathEnd: [],
          unsharedPlaceholderCount: 1,
          selectedCommitmentIds: ["medical_support"],
          onToggleCommitment: () => undefined,
        }}
      />,
    );

    expect(html).toContain("先把当前医学状态和就医安排说清楚");
    expect(html).toContain("陪同就医、复诊或处理突发情况");
    expect(html).toContain("先确认检查、复诊与风险排查安排");
    expect(html).not.toContain("是否已经确认怀孕");
  });

  it("exposes a return-home action from the normal report shell", () => {
    const html = renderToStaticMarkup(
      <ReportShell
        activeTab="overview"
        partnerTabEnabled={false}
        report={createReportViewModel()}
        onReturnHome={() => undefined}
      />,
    );

    expect(html).toContain("返回首页");
  });

  it("passes optional deep dive module entries into the analysis tab", () => {
    const html = renderToStaticMarkup(
      <ReportShell
        activeTab="analysis"
        partnerTabEnabled={false}
        report={createReportViewModel()}
        deepDiveModules={[
          {
            moduleId: "mental-deep",
            title: "心理支持补充",
            estimatedQuestions: 3,
            purpose: "补齐情绪支持安排。",
            onSelect: () => undefined,
          },
        ]}
      />,
    );

    expect(html).toContain("可选深入问卷");
    expect(html).toContain("心理支持补充");
  });
});
