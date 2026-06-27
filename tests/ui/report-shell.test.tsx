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
    expect(html).not.toContain("姒傝");
    expect(html).not.toContain("娣卞叆鍒嗘瀽");
    expect(html).not.toContain("浼翠荆璁ㄨ");
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
          sharedPathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }],
          sharedPathEnd: [],
          unsharedPlaceholderCount: 1,
          selectedCommitmentIds: ["medical_support"],
          onToggleCommitment: () => undefined,
        }}
      />,
    );

    expect(html).toContain("topic:medical_summary");
    expect(html).toContain("medical_support");
    expect(html).toContain("continue-1");
    expect(html).not.toContain("reason:medical");
  });
});
