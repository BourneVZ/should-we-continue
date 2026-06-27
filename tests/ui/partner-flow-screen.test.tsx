import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PartnerFlowScreen } from "@/features/partner/PartnerFlowScreen";
import { createSharedDiscussionInput } from "../fixtures/factories";

describe("PartnerFlowScreen", () => {
  it("shows the handoff only after discussion material exists and keeps user data private before partner sharing", () => {
    const html = renderToStaticMarkup(
      <PartnerFlowScreen
        discussionReady={true}
        partnerStarted={false}
        partnerCompleted={false}
        partnerSummaryIds={[]}
        partnerSelectedSummaryIds={["emotional_summary"]}
        partnerEditedSummary=""
        userDiscussionInput={createSharedDiscussionInput({
          summaryIds: ["medical_summary", "values_summary"],
          pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }],
          pathEnd: [{ conditionId: "end-1", status: "confirmed", labelId: "RPT-PATH-END" }],
          sharedNotes: ["用户原始备注不得给伴侣先看"],
        })}
        onStart={() => undefined}
        onPartnerSelectionChange={() => undefined}
        onPartnerEditedSummaryChange={() => undefined}
        onPartnerShare={() => undefined}
      />,
    );

    expect(html).toContain("交给伴侣填写");
    expect(html).toContain("伴侣先看自己的摘要");
    expect(html).toContain("emotional_summary");
    expect(html).toContain("disabled");
    expect(html).not.toContain("medical_summary");
    expect(html).not.toContain("values_summary");
    expect(html).not.toContain("continue-1");
    expect(html).not.toContain("end-1");
    expect(html).not.toContain("用户原始备注不得给伴侣先看");
    expect(html).not.toContain("角色");
    expect(html).not.toContain("原始答案");
  });

  it("hides the partner handoff entry until user-generated discussion material exists", () => {
    const html = renderToStaticMarkup(
      <PartnerFlowScreen
        discussionReady={false}
        partnerStarted={false}
        partnerCompleted={false}
        partnerSummaryIds={[]}
        partnerSelectedSummaryIds={[]}
        partnerEditedSummary=""
        userDiscussionInput={null}
        onStart={() => undefined}
        onPartnerSelectionChange={() => undefined}
        onPartnerEditedSummaryChange={() => undefined}
        onPartnerShare={() => undefined}
      />,
    );

    expect(html).not.toContain("交给伴侣填写");
    expect(html).toContain("生成共同讨论页后");
  });
});
