import { describe, expect, it } from "vitest";
import { buildReportPlan } from "@/domain/report-plan";
import type { DimensionScore, PathConditionView } from "@/domain/types";
import {
  createRedFlagResult,
  createRegionCache,
} from "../fixtures/factories";

function createDimension(
  dimensionId: DimensionScore["dimensionId"],
  supportScore: number,
): DimensionScore {
  return {
    dimensionId,
    supportScore,
    displayLevel: supportScore >= 75 ? "high" : supportScore >= 50 ? "medium" : supportScore >= 25 ? "low" : "insufficient",
    reasonIds: [`reason:${dimensionId}`],
  };
}

const PATH_CONTINUE: PathConditionView[] = [
  { conditionId: "continue-medical", status: "pending", labelId: "RPT-PATH-CONTINUE" },
];

const PATH_END: PathConditionView[] = [
  { conditionId: "end-medical", status: "confirmed", labelId: "RPT-PATH-END" },
];

describe("buildReportPlan", () => {
  it("returns a strict safety-first substitute plan for R4 without regular sections", () => {
    const plan = buildReportPlan({
      redFlag: createRedFlagResult({
        level: "R4",
        actionIds: ["ACT-URGENT-MEDICAL"],
        personaSuppressedReason: "offline-support-first",
        sharingBlockedReason: "offline-support-first",
      }),
      dimensions: [
        createDimension("medicalSafetySupport", 10),
        createDimension("lifeDevelopmentSupport", 20),
      ],
      certainty: "low",
      priorityActionIds: ["ACT-LIFE-DEVELOPMENT-PRIORITY"],
      pathContinue: PATH_CONTINUE,
      pathEnd: PATH_END,
      persona: {
        primaryPersonaId: "P01",
        secondaryPersonaId: "P03",
        candidatePersonaIds: ["P01", "P03"],
        personaConfidence: 86,
        statusTagIds: ["S09"],
        suppressedReason: null,
      },
      region: createRegionCache({
        status: "fresh",
        checkedAt: "2026-06-27",
        expiresAt: "2026-07-04",
        verifiedFields: [
          {
            fieldId: "benefit.hz.under3_annual",
            value: "3600",
            sourceUrl: "https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml",
            checkedAt: "2026-06-27",
            applicableIf: ["需另行核对"],
          },
        ],
      }),
      measures: [],
    });

    expect(plan.redFlag.level).toBe("R4");
    expect(plan.priorityActionIds).toEqual(["ACT-URGENT-MEDICAL"]);
    expect(plan.dimensions).toEqual([]);
    expect(plan.pathContinue).toEqual([]);
    expect(plan.pathEnd).toEqual([]);
    expect(plan.persona.primaryPersonaId).toBeNull();
    expect(plan.region.status).toBe("unavailable");
  });

  it("keeps regular dimensions, path symmetry, and region cache for non-blocking reports", () => {
    const plan = buildReportPlan({
      redFlag: createRedFlagResult({
        level: "R2",
        actionIds: ["ACT-CLARIFY-WILL"],
      }),
      dimensions: [
        createDimension("medicalSafetySupport", 60),
        createDimension("lifeDevelopmentSupport", 20),
        createDimension("partnerCommitmentSupport", 80),
      ],
      certainty: "medium",
      priorityActionIds: ["ACT-CLARIFY-WILL", "ACT-LIFE-DEVELOPMENT-PRIORITY"],
      pathContinue: PATH_CONTINUE,
      pathEnd: PATH_END,
      persona: {
        primaryPersonaId: "P10",
        secondaryPersonaId: "P11",
        candidatePersonaIds: ["P10", "P11"],
        personaConfidence: 81,
        statusTagIds: ["S07"],
        suppressedReason: null,
      },
      region: createRegionCache({
        status: "stale",
        checkedAt: "2026-06-20",
        expiresAt: "2026-06-27",
        verifiedFields: [
          {
            fieldId: "benefit.hz.under3_annual",
            value: "3600",
            sourceUrl: "https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml",
            checkedAt: "2026-06-20",
            applicableIf: ["需另行核对"],
          },
        ],
      }),
      measures: [],
    });

    expect(plan.redFlag.level).toBe("R2");
    expect(plan.dimensions.map((dimension) => dimension.dimensionId)).toEqual([
      "medicalSafetySupport",
      "lifeDevelopmentSupport",
      "partnerCommitmentSupport",
    ]);
    expect(plan.priorityActionIds).toEqual([
      "ACT-CLARIFY-WILL",
      "ACT-LIFE-DEVELOPMENT-PRIORITY",
    ]);
    expect(plan.pathContinue).toEqual(PATH_CONTINUE);
    expect(plan.pathEnd).toEqual(PATH_END);
    expect(plan.persona.primaryPersonaId).toBe("P10");
    expect(plan.region.status).toBe("stale");
  });
});
