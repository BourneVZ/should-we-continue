import type { SupportDimensionId } from "@/domain/types";

export interface RecommendationRule {
  dimensionId: SupportDimensionId;
  moduleId: string;
  priority: number;
}

export const RECOMMENDATION_CONFIG: readonly RecommendationRule[] = [
  { dimensionId: "autonomySafetySupport", moduleId: "safety-deep", priority: 100 },
  { dimensionId: "medicalSafetySupport", moduleId: "medical-deep", priority: 90 },
  { dimensionId: "mentalHealthSupport", moduleId: "mental-deep", priority: 80 },
  { dimensionId: "financialPolicySupport", moduleId: "finance-deep", priority: 70 },
  { dimensionId: "partnerCommitmentSupport", moduleId: "partner-deep", priority: 65 },
  { dimensionId: "lifeDevelopmentSupport", moduleId: "life-deep", priority: 60 },
  { dimensionId: "childcareLoadSupport", moduleId: "care-deep", priority: 55 },
  { dimensionId: "personalWillClaritySupport", moduleId: "values-deep", priority: 50 },
  { dimensionId: "familySocialSupport", moduleId: "aftercare-deep", priority: 45 },
] as const;
