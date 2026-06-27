import { describe, expect, it } from "vitest";
import { RECOMMENDATION_CONFIG } from "@/config/scoring/recommendations";
import { getDeepDiveRecommendations } from "@/domain/recommendations";
import type { DimensionScore } from "@/domain/types";

function dimension(dimensionId: DimensionScore["dimensionId"], supportScore: number, displayLevel: DimensionScore["displayLevel"]): DimensionScore {
  return {
    dimensionId,
    supportScore,
    displayLevel,
    certaintyLevel: "high",
    reasonIds: [],
  };
}

describe("getDeepDiveRecommendations", () => {
  it("recommends up to three modules sorted by fixed priority for low-support dimensions", () => {
    const recommendations = getDeepDiveRecommendations(
      [
        dimension("autonomySafetySupport", 20, "insufficient"),
        dimension("medicalSafetySupport", 30, "low"),
        dimension("mentalHealthSupport", 40, "low"),
        dimension("lifeDevelopmentSupport", 45, "low"),
      ],
      RECOMMENDATION_CONFIG,
    );

    expect(recommendations).toEqual(["safety-deep", "medical-deep", "mental-deep"]);
  });

  it("returns an empty list when no dimension is below the trigger threshold", () => {
    const recommendations = getDeepDiveRecommendations(
      [dimension("childcareLoadSupport", 100, "high")],
      RECOMMENDATION_CONFIG,
    );

    expect(recommendations).toEqual([]);
  });

  it("recommends low-certainty dimensions even when support score is not low", () => {
    const recommendations = getDeepDiveRecommendations(
      [
        {
          ...dimension("medicalSafetySupport", 70, "medium"),
          certaintyLevel: "low",
        },
      ],
      RECOMMENDATION_CONFIG,
    );

    expect(recommendations).toEqual(["medical-deep"]);
  });
});
