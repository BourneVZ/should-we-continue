import { describe, expect, it } from "vitest";
import { createRuntimeSnapshot } from "@/app/runtime-state";
import { createReportViewModel, createSharedDiscussionInput, createWorkspaceDocument } from "../fixtures/factories";

describe("runtime state", () => {
  it("hydrates initial app state and report from the saved workspace document", () => {
    const report = createReportViewModel({
      redFlag: { level: "R2", actionIds: ["ACT-CLARIFY-MEDICAL"] },
    });
    const workspace = createWorkspaceDocument({
      user: {
        answers: {},
        answersRevision: 3,
        reportView: report,
        reportSourceRevision: 3,
      },
      shared: {
        discussion: createSharedDiscussionInput({
          summaryIds: ["medical_summary"],
        }),
      },
    });

    const snapshot = createRuntimeSnapshot(workspace);

    expect(snapshot.report).toEqual(report);
    expect(snapshot.state.route).toBe("home");
    expect(snapshot.state.reportStatus).toBe("fresh");
    expect(snapshot.state.hasExistingReport).toBe(true);
    expect(snapshot.state.canOpenPartnerDiscussion).toBe(true);
    expect(snapshot.workspace.user.reportView).toEqual(report);
  });

  it("starts from an empty workspace when no persisted document exists", () => {
    const snapshot = createRuntimeSnapshot(null);

    expect(snapshot.report.redFlag.level).toBe("none");
    expect(snapshot.state.hasExistingReport).toBe(false);
    expect(snapshot.state.reportStatus).toBe("none");
    expect(snapshot.state.canOpenPartnerDiscussion).toBe(false);
    expect(snapshot.workspace.user.answersRevision).toBe(0);
  });
});
