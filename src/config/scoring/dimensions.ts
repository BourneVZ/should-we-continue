import type { SupportDimensionId } from "@/domain/types";

export interface ScoringFactor {
  answerKey: string;
  weight: number;
  sourceId: string;
}

export interface ScoringDimension {
  dimensionId: SupportDimensionId;
  factors: readonly ScoringFactor[];
}

export const SCORING_DIMENSIONS: readonly ScoringDimension[] = [
  {
    dimensionId: "medicalSafetySupport",
    factors: [
      { answerKey: "Q-MED-PREGNANCY-CONFIRMED", weight: 15, sourceId: "SRC-NICE-NG126" },
      { answerKey: "Q-MED-INTRAUTERINE-CONFIRMED", weight: 20, sourceId: "SRC-NICE-NG126" },
      { answerKey: "Q-MED-GESTATION-ESTIMATE", weight: 10, sourceId: "SRC-NICE-NG126" },
      { answerKey: "Q-MED-CARE-PLAN", weight: 15, sourceId: "SRC-NHC-FULL-CARE" },
      { answerKey: "Q-MED-ABDOMINAL-PAIN", weight: 15, sourceId: "SRC-NICE-NG126" },
      { answerKey: "Q-MED-BLEEDING", weight: 15, sourceId: "SRC-NICE-NG126" },
      { answerKey: "Q-MED-ASSOCIATED-SYMPTOMS", weight: 10, sourceId: "SRC-NHS-ECTOPIC" },
    ],
  },
  {
    dimensionId: "mentalHealthSupport",
    factors: [
      { answerKey: "Q-MH-MOOD-LOW", weight: 20, sourceId: "SRC-ACOG-PMH-SCREENING" },
      { answerKey: "Q-MH-WORRY-HIGH", weight: 20, sourceId: "SRC-ACOG-PMH-SCREENING" },
      { answerKey: "Q-MH-FUNCTION-IMPACT", weight: 25, sourceId: "SRC-ACOG-PMH-SCREENING" },
      { answerKey: "Q-MH-SAFE-CONTACT", weight: 25, sourceId: "SRC-ACOG-PMH-SCREENING" },
      { answerKey: "Q-MH-REGRET-WORRY", weight: 10, sourceId: "SRC-ACOG-PMH-SCREENING" },
    ],
  },
  {
    dimensionId: "autonomySafetySupport",
    factors: [
      { answerKey: "Q-SAFE-FREE-ANSWER", weight: 20, sourceId: "SRC-ACOG-IPV" },
      { answerKey: "Q-SAFE-PRIVACY-RISK", weight: 15, sourceId: "SRC-ACOG-IPV" },
      { answerKey: "Q-SAFE-COERCION", weight: 25, sourceId: "SRC-ACOG-REPRO-COERCION" },
      { answerKey: "Q-PARTNER-SAFE-TO-SPEAK", weight: 20, sourceId: "SRC-ACOG-IPV" },
      { answerKey: "Q-PARTNER-CONTROL-RISK", weight: 20, sourceId: "SRC-ACOG-REPRO-COERCION" },
    ],
  },
  {
    dimensionId: "personalWillClaritySupport",
    factors: [
      { answerKey: "Q-WILL-SELF-VS-OTHERS", weight: 30, sourceId: "SRC-OTTAWA-ODSF" },
      { answerKey: "Q-WILL-INFORMATION-BLOCK", weight: 15, sourceId: "SRC-OTTAWA-ODSF" },
      { answerKey: "Q-WILL-VALUE-CONFLICT", weight: 20, sourceId: "SRC-OTTAWA-ODSF" },
      { answerKey: "Q-WILL-DECISION-TIME", weight: 20, sourceId: "SRC-OTTAWA-ODSF" },
      { answerKey: "Q-VALUE-BOUNDARIES-KNOWN", weight: 15, sourceId: "SRC-OTTAWA-ODSF" },
    ],
  },
  {
    dimensionId: "lifeDevelopmentSupport",
    factors: [
      { answerKey: "Q-LIFE-PLAN-IMPORTANCE", weight: 10, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-LIFE-CONTINUE-IMPACT", weight: 25, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-LIFE-END-IMPACT", weight: 10, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-LIFE-FREEDOM-IMPORTANCE", weight: 15, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-LIFE-IDENTITY-PREPARED", weight: 20, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-LIFE-PARTNER-SUPPORT", weight: 20, sourceId: "SPEC-SCORING-15" },
    ],
  },
  {
    dimensionId: "partnerCommitmentSupport",
    factors: [
      { answerKey: "Q-PARTNER-RESPECT-AUTONOMY", weight: 20, sourceId: "SRC-ACOG-REPRO-COERCION" },
      { answerKey: "Q-PARTNER-SAFE-TO-SPEAK", weight: 15, sourceId: "SRC-ACOG-REPRO-COERCION" },
      { answerKey: "Q-PARTNER-CONCRETE-COMMITMENT", weight: 20, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-PARTNER-PAST-RELIABILITY", weight: 15, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-PARTNER-COMMITMENT-CATEGORIES", weight: 20, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-PARTNER-CONTROL-RISK", weight: 10, sourceId: "SRC-ACOG-REPRO-COERCION" },
    ],
  },
  {
    dimensionId: "familySocialSupport",
    factors: [
      { answerKey: "Q-FAMILY-SUPPORT-SOURCES", weight: 15, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-FAMILY-SUPPORT-TYPES", weight: 15, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-FAMILY-SUPPORT-STABILITY", weight: 25, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-FAMILY-BOUNDARY-PRESSURE", weight: 20, sourceId: "SRC-ACOG-IPV" },
      { answerKey: "Q-FAMILY-REFUSAL-CONSEQUENCE", weight: 15, sourceId: "SRC-ACOG-REPRO-COERCION" },
      { answerKey: "Q-FAMILY-ACCEPT-SUPPORT", weight: 10, sourceId: "SPEC-SCORING-15" },
    ],
  },
  {
    dimensionId: "financialPolicySupport",
    factors: [
      { answerKey: "Q-FIN-INCOME-STABLE", weight: 15, sourceId: "SRC-NBS-STAT-2024" },
      { answerKey: "Q-FIN-SAVINGS-BUFFER", weight: 15, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-FIN-FIXED-COST-PRESSURE", weight: 15, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-FIN-INSURANCE-KNOWN", weight: 10, sourceId: "SRC-HZ-MEDICAL-INSURANCE" },
      { answerKey: "Q-FIN-CONTINUE-INCOME-IMPACT", weight: 15, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-FIN-POLICY-KNOWN", weight: 10, sourceId: "SRC-ZJ-POPULATION-LAW-FTU" },
      { answerKey: "Q-FIN-CONTINUE-BUDGET", weight: 10, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-FIN-END-BUDGET", weight: 10, sourceId: "SPEC-SCORING-15" },
    ],
  },
  {
    dimensionId: "childcareLoadSupport",
    factors: [
      { answerKey: "Q-CHILD-COUNT", weight: 20, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-CHILD-SPECIAL-NEEDS", weight: 20, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-CHILD-PRIMARY-CARER", weight: 20, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-CHILD-CONTINUE-CARE-IMPACT", weight: 20, sourceId: "SPEC-SCORING-15" },
      { answerKey: "Q-CHILD-END-RECOVERY-CARE", weight: 20, sourceId: "SPEC-SCORING-15" },
    ],
  },
] as const;
