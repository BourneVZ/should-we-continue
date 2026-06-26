import { describe, expect, it } from "vitest";
import { buildPersonalReportWorkflow } from "@/domain/personal-report-workflow";
import { createReportViewModel } from "../fixtures/factories";

describe("buildPersonalReportWorkflow", () => {
  it("returns a template report only after core completion and explicit deep-dive completion or skip", () => {
    const result = buildPersonalReportWorkflow({
      coreComplete: true,
      deepDiveComplete: false,
      deepDiveExplicitlySkipped: true,
      redFlagLevel: "R2",
      reportView: createReportViewModel(),
      currentAnswersRevision: 3,
      reportSourceRevision: 3,
      llmAvailable: false,
    });

    expect(result.stage).toBe("report-ready");
    expect(result.mode).toBe("template");
    expect(result.report).not.toBeNull();
  });

  it("marks the report stale after answers change", () => {
    const result = buildPersonalReportWorkflow({
      coreComplete: true,
      deepDiveComplete: true,
      deepDiveExplicitlySkipped: false,
      redFlagLevel: "R1",
      reportView: createReportViewModel(),
      currentAnswersRevision: 4,
      reportSourceRevision: 3,
      llmAvailable: false,
    });

    expect(result.stage).toBe("report-stale");
    expect(result.report).toBeNull();
  });

  it("never depends on model availability to produce a template report", () => {
    const result = buildPersonalReportWorkflow({
      coreComplete: true,
      deepDiveComplete: true,
      deepDiveExplicitlySkipped: false,
      redFlagLevel: "none",
      reportView: createReportViewModel(),
      currentAnswersRevision: 2,
      reportSourceRevision: 2,
      llmAvailable: false,
    });

    expect(result.mode).toBe("template");
    expect(result.report).not.toBeNull();
  });

  it("goes directly to the safety substitute page for R3 and R4", () => {
    const result = buildPersonalReportWorkflow({
      coreComplete: true,
      deepDiveComplete: false,
      deepDiveExplicitlySkipped: false,
      redFlagLevel: "R4",
      reportView: createReportViewModel({
        redFlag: { level: "R4", actionIds: ["ACT-URGENT-MEDICAL"] },
      }),
      currentAnswersRevision: 5,
      reportSourceRevision: 5,
      llmAvailable: true,
    });

    expect(result.stage).toBe("safety-substitute");
    expect(result.mode).toBe("template");
    expect(result.report?.redFlag.level).toBe("R4");
  });
});
