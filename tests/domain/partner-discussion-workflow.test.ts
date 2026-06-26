import { describe, expect, it } from "vitest";
import { buildPartnerDiscussionWorkflow } from "@/domain/partner-discussion-workflow";
import { createReportViewModel } from "../fixtures/factories";
import type { SharedDiscussionInput } from "@/domain/types";

const USER_SHARED: SharedDiscussionInput = {
  summaryIds: ["medical_summary", "partner_needs"],
  pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }],
  pathEnd: [{ conditionId: "end-1", status: "confirmed", labelId: "RPT-PATH-END" }],
  sharedNotes: ["用户愿意讨论承诺怎么落地"],
};

describe("buildPartnerDiscussionWorkflow", () => {
  it("builds the initial discussion material from user-authorized content only", () => {
    const result = buildPartnerDiscussionWorkflow({
      userReport: createReportViewModel(),
      userShared: USER_SHARED,
      partnerSharedSummaryIds: [],
      redFlagLevel: "R2",
    });

    expect(result.disabledReason).toBeNull();
    expect(result.discussionTopicIds).toHaveLength(3);
    expect(result.partnerSummaryIds).toEqual([]);
    expect(result.userReport.persona).toEqual(createReportViewModel().persona);
  });

  it("refreshes the discussion material after partner summaries are explicitly shared", () => {
    const result = buildPartnerDiscussionWorkflow({
      userReport: createReportViewModel(),
      userShared: USER_SHARED,
      partnerSharedSummaryIds: ["partner-summary-1"],
      redFlagLevel: "R1",
    });

    expect(result.partnerSummaryIds).toEqual(["partner-summary-1"]);
  });

  it("disables the discussion workflow when risk escalates to R3 or R4", () => {
    const result = buildPartnerDiscussionWorkflow({
      userReport: createReportViewModel({
        redFlag: { level: "R3", actionIds: ["ACT-SOON-SAFETY"] },
      }),
      userShared: USER_SHARED,
      partnerSharedSummaryIds: ["partner-summary-1"],
      redFlagLevel: "R3",
    });

    expect(result.disabledReason).toBe("red_flag_R3_or_R4");
    expect(result.discussionTopicIds).toEqual([]);
    expect(result.commitmentCategoryIds).toEqual([]);
  });
});
