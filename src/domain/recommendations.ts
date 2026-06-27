import type { RecommendationRule } from "@/config/scoring/recommendations";
import type { DimensionScore } from "@/domain/types";

export function getDeepDiveRecommendations(
  dimensions: readonly DimensionScore[],
  config: readonly RecommendationRule[],
): string[] {
  const candidates = dimensions
    .filter((dimension) => dimension.supportScore < 50 || dimension.certaintyLevel === "low")
    .flatMap((dimension) =>
      config
        .filter((rule) => rule.dimensionId === dimension.dimensionId)
        .map((rule) => {
          const gapWeight = dimension.supportScore < 25 ? 30 : dimension.supportScore < 50 ? 15 : 0;
          const certaintyWeight = dimension.certaintyLevel === "low" ? 20 : dimension.certaintyLevel === "medium" ? 5 : 0;
          return { moduleId: rule.moduleId, priority: rule.priority + gapWeight + certaintyWeight };
        }),
    )
    .sort((left, right) => right.priority - left.priority || left.moduleId.localeCompare(right.moduleId));

  return [...new Set(candidates.map((candidate) => candidate.moduleId))].slice(0, 3);
}
