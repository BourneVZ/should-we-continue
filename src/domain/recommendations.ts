import type { RecommendationRule } from "@/config/scoring/recommendations";
import type { DimensionScore } from "@/domain/types";

export function getDeepDiveRecommendations(
  dimensions: readonly DimensionScore[],
  config: readonly RecommendationRule[],
): string[] {
  const candidates = dimensions
    .filter((dimension) => dimension.supportScore < 50)
    .flatMap((dimension) =>
      config
        .filter((rule) => rule.dimensionId === dimension.dimensionId)
        .map((rule) => ({ moduleId: rule.moduleId, priority: rule.priority })),
    )
    .sort((left, right) => right.priority - left.priority || left.moduleId.localeCompare(right.moduleId));

  return [...new Set(candidates.map((candidate) => candidate.moduleId))].slice(0, 3);
}
