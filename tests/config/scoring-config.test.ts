import { describe, expect, it } from "vitest";
import { SCORING_DIMENSIONS } from "@/config/scoring/dimensions";

describe("scoring dimensions configuration", () => {
  it("defines the nine support dimensions", () => {
    expect(SCORING_DIMENSIONS.map((dimension) => dimension.dimensionId)).toEqual([
      "medicalSafetySupport",
      "mentalHealthSupport",
      "autonomySafetySupport",
      "personalWillClaritySupport",
      "lifeDevelopmentSupport",
      "partnerCommitmentSupport",
      "familySocialSupport",
      "financialPolicySupport",
      "childcareLoadSupport",
    ]);
  });

  it("keeps factor weights within range and requires sources", () => {
    for (const dimension of SCORING_DIMENSIONS) {
      const totalWeight = dimension.factors.reduce((sum, factor) => sum + factor.weight, 0);
      expect(totalWeight).toBeGreaterThan(0);
      for (const factor of dimension.factors) {
        expect(factor.weight).toBeGreaterThan(0);
        expect(factor.weight).toBeLessThanOrEqual(30);
        expect(factor.sourceId.length).toBeGreaterThan(0);
      }
    }
  });

  it("does not use region cache fields as scoring factors", () => {
    const factorKeys = SCORING_DIMENSIONS.flatMap((dimension) => dimension.factors.map((factor) => factor.answerKey));
    expect(factorKeys.some((key) => key.startsWith("REGION-"))).toBe(false);
  });
});
