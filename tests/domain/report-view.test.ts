import { describe, expect, it } from "vitest";
import { buildReportViewModel } from "@/domain/report-view";
import { createRegionCache, createRedFlagResult } from "../fixtures/factories";
import type { ReportPlan } from "@/domain/types";

describe("buildReportViewModel", () => {
  it("strips internal red-flag details while preserving visible report structure", () => {
    const plan: ReportPlan = {
      redFlag: createRedFlagResult({
        level: "R2",
        ruleIds: ["RF-R2-WILL-PRESSURE"],
        actionIds: ["ACT-CLARIFY-WILL"],
      }),
      dimensions: [
        {
          dimensionId: "lifeDevelopmentSupport",
          displayLevel: "low",
          reasonIds: ["reason:life"],
        },
      ],
      certainty: "medium",
      priorityActionIds: ["ACT-CLARIFY-WILL", "ACT-LIFE-DEVELOPMENT-PRIORITY"],
      pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }],
      pathEnd: [{ conditionId: "end-1", status: "confirmed", labelId: "RPT-PATH-END" }],
      persona: {
        primaryPersonaId: "P10",
        secondaryPersonaId: "P11",
        candidatePersonaIds: ["P10", "P11"],
        personaConfidence: 81,
        statusTagIds: ["S07"],
        suppressedReason: null,
      },
      region: createRegionCache({ status: "stale", checkedAt: "2026-06-20", expiresAt: "2026-06-27" }),
      measures: [],
    };

    const view = buildReportViewModel(plan);

    expect(view).toEqual({
      redFlag: {
        level: "R2",
        actionIds: ["ACT-CLARIFY-WILL"],
      },
      dimensions: plan.dimensions,
      certainty: "medium",
      priorityActionIds: ["ACT-CLARIFY-WILL", "ACT-LIFE-DEVELOPMENT-PRIORITY"],
      pathContinue: plan.pathContinue,
      pathEnd: plan.pathEnd,
      persona: plan.persona,
      region: plan.region,
      measures: [],
    });
    expect("ruleIds" in view.redFlag).toBe(false);
  });
});
