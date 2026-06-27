import { describe, expect, it } from "vitest";
import { handleReportRequest } from "../../api/_lib/handlers";
import { createReportViewModel, createSharedDiscussionInput } from "../fixtures/factories";

describe("report handler", () => {
  it("recomputes personal responses from server-visible rules and never lets model output change red flags, persona, or paths", async () => {
    const report = createReportViewModel({
      redFlag: { level: "R2", actionIds: ["ACT-CLARIFY-WILL"] },
      certainty: "high",
      persona: {
        primaryPersonaId: "P01",
        secondaryPersonaId: "P02",
        candidatePersonaIds: ["P01", "P02"],
        personaConfidence: 80,
        statusTagIds: ["S01"],
        suppressedReason: null,
      },
      pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }],
      pathEnd: [{ conditionId: "end-1", status: "confirmed", labelId: "RPT-PATH-END" }],
    });

    const response = await handleReportRequest(
      {
        mode: "personal",
        payload: report,
      },
      {
        llm: {
          complete: async () => ({
            status: "ok",
            text: JSON.stringify({
              certaintyDelta: -1,
              contradictionTypes: ["timeline_gap"],
              overlay: {
                sections: [
                  {
                    sectionId: "overview",
                    contentId: "RPT-OVERVIEW-INTRO",
                    variables: {},
                    narrative: "中性摘要",
                  },
                ],
              },
              redFlag: { level: "R4" },
              persona: { primaryPersonaId: "P99" },
              pathContinue: [],
            }),
          }),
        },
      },
    );

    expect(response.mode).toBe("llm-overlay");
    expect(response.report.redFlag.level).toBe("R2");
    expect(response.report.persona.primaryPersonaId).toBe("P01");
    expect(response.report.pathContinue).toEqual(report.pathContinue);
    expect(response.report.pathEnd).toEqual(report.pathEnd);
    expect(response.report.certainty).toBe("medium");
    expect(JSON.stringify(response)).not.toContain("server-key");
  });

  it("falls back to template mode when model config is missing or overlay validation fails", async () => {
    const templateResult = await handleReportRequest(
      {
        mode: "personal",
        payload: createReportViewModel(),
      },
      {
        llm: {
          complete: async () => ({
            status: "unavailable",
            errorCategory: "missing_config",
          }),
        },
      },
    );

    expect(templateResult.mode).toBe("template");

    const invalidOverlayResult = await handleReportRequest(
      {
        mode: "personal",
        payload: createReportViewModel(),
      },
      {
        llm: {
          complete: async () => ({
            status: "ok",
            text: "{\"overlay\":{\"sections\":[{\"sectionId\":\"bad\",\"contentId\":\"RPT-OVERVIEW-INTRO\",\"variables\":{},\"narrative\":\"x\"}]}}",
          }),
        },
      },
    );

    expect(invalidOverlayResult.mode).toBe("template");
  });

  it("accepts discussion mode only as an authorized sharing package", async () => {
    const response = await handleReportRequest(
      {
        mode: "discussion",
        payload: createSharedDiscussionInput({
          summaryIds: ["medical_summary"],
          sharedNotes: ["已授权共享摘要"],
        }),
      },
      {
        llm: {
          complete: async () => ({
            status: "unavailable",
            errorCategory: "missing_config",
          }),
        },
      },
    );

    expect(response.mode).toBe("template");
    expect(JSON.stringify(response)).not.toContain("measure_data");
    expect(JSON.stringify(response)).not.toContain("free_text_raw");
  });
});
