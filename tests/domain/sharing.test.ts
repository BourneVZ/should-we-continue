import { describe, expect, it } from "vitest";
import { buildSharedDiscussionInput } from "@/domain/sharing";
import { createReportViewModel } from "../fixtures/factories";

describe("buildSharedDiscussionInput", () => {
  it("defaults to no sharing when the user has not explicitly authorized anything", () => {
    const result = buildSharedDiscussionInput({
      report: createReportViewModel({
        pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }],
        pathEnd: [{ conditionId: "end-1", status: "confirmed", labelId: "RPT-PATH-END" }],
      }),
      allowedSummaryIds: [],
      sharePathConditions: false,
    });

    expect(result).toEqual({
      summaryIds: [],
      pathContinue: [],
      pathEnd: [],
      sharedNotes: [],
    });
  });

  it("keeps only allowlisted summary ids and requires separate path-condition consent", () => {
    const result = buildSharedDiscussionInput({
      report: createReportViewModel({
        pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }],
        pathEnd: [{ conditionId: "end-1", status: "confirmed", labelId: "RPT-PATH-END" }],
      }),
      allowedSummaryIds: ["medical_summary", "values_summary", "will_direction", "path_conditions"],
      sharePathConditions: false,
      editedNoteSummary: "仅分享整理后的摘要",
    });

    expect(result.summaryIds).toEqual(["medical_summary", "values_summary"]);
    expect(result.pathContinue).toEqual([]);
    expect(result.pathEnd).toEqual([]);
    expect(result.sharedNotes).toEqual(["仅分享整理后的摘要"]);
  });

  it("includes both path lists only after the separate path-condition consent is granted", () => {
    const report = createReportViewModel({
      pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }],
      pathEnd: [{ conditionId: "end-1", status: "confirmed", labelId: "RPT-PATH-END" }],
    });

    const result = buildSharedDiscussionInput({
      report,
      allowedSummaryIds: ["path_conditions"],
      sharePathConditions: true,
    });

    expect(result.pathContinue).toEqual(report.pathContinue);
    expect(result.pathEnd).toEqual(report.pathEnd);
  });

  it("blocks sharing entirely for R3 and R4 reports", () => {
    expect(() =>
      buildSharedDiscussionInput({
        report: createReportViewModel({
          redFlag: { level: "R3", actionIds: ["ACT-SOON-SAFETY"] },
        }),
        allowedSummaryIds: ["medical_summary"],
        sharePathConditions: true,
      }),
    ).toThrow(/sharing is blocked/i);
  });
});
