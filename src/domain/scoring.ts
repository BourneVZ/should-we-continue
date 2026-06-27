import type { ScoringDimension } from "@/config/scoring/dimensions";
import type { AnswerValue, DimensionScore, ReportDimensionView } from "@/domain/types";
import { getAnswerStatus } from "./answers";

type AnsweredValue = Extract<AnswerValue, { status: "answered" }>["value"];

const SCALE5_SCORE: Record<string, number> = {
  SD: 0,
  D: 25,
  U: 50,
  A: 75,
  SA: 100,
};

const GENERIC_SCORE: Record<string, number> = {
  confirmed: 100,
  possible: 50,
  unknown: 50,
  booked: 100,
  plan_to_book: 70,
  none: 100,
  mild: 70,
  clear_or_persistent: 30,
  severe_or_one_sided: 0,
  small: 70,
  clear: 30,
  heavy_or_with_pain_dizziness: 0,
  mild_one: 60,
  clear_one_or_more: 0,
  week7to8: 100,
  under4: 80,
  week4to6: 90,
  week9to12: 70,
  over12: 60,
  not_confirmed: 20,
  not_yet_confirmable: 40,
};

function getAnsweredValue(answer: AnswerValue | undefined): AnsweredValue | null {
  if (answer?.status !== "answered") {
    return null;
  }
  return answer.value as AnsweredValue;
}

function toDisplayLevel(score: number): DimensionScore["displayLevel"] {
  if (score >= 75) {
    return "high";
  }
  if (score >= 50) {
    return "medium";
  }
  if (score >= 25) {
    return "low";
  }
  return "insufficient";
}

function toCertaintyLevel(answeredWeight: number, configuredWeight: number): DimensionScore["certaintyLevel"] {
  if (configuredWeight <= 0) {
    return "uncertain";
  }
  const coverage = answeredWeight / configuredWeight;
  if (coverage >= 0.85) {
    return "high";
  }
  if (coverage >= 0.6) {
    return "medium";
  }
  return "low";
}

function scoreAnswer(answerKey: string, answer: AnswerValue | undefined): number | null {
  const value = getAnsweredValue(answer);
  if (value === null) {
    return null;
  }
  if (typeof value === "string") {
    if (answerKey === "Q-CHILD-COUNT" && value === "none") {
      return 100;
    }
    if (value in SCALE5_SCORE) {
      return SCALE5_SCORE[value];
    }
    if (value in GENERIC_SCORE) {
      return GENERIC_SCORE[value];
    }
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 0;
    }
    return Math.min(100, 20 + value.length * 20);
  }

  return null;
}

export function calculateSupportScores(
  answers: Record<string, AnswerValue>,
  dimensions: readonly ScoringDimension[],
): { dimensions: DimensionScore[] } {
  const results: DimensionScore[] = [];

  for (const dimension of dimensions) {
    const configuredWeight = dimension.factors.reduce((sum, factor) => sum + factor.weight, 0);

    if (dimension.dimensionId === "childcareLoadSupport") {
      const childCountValue = getAnsweredValue(answers["Q-CHILD-COUNT"]);
      if (childCountValue === "none") {
        results.push({
          dimensionId: "childcareLoadSupport",
          supportScore: 100,
          displayLevel: "high",
          certaintyLevel: "high",
          reasonIds: ["Q-CHILD-COUNT"],
        });
        continue;
      }
    }

    let weightedScore = 0;
    let totalWeight = 0;
    const reasonIds: string[] = [];

    for (const factor of dimension.factors) {
      const score = scoreAnswer(factor.answerKey, answers[factor.answerKey]);
      if (score === null) {
        continue;
      }
      weightedScore += score * factor.weight;
      totalWeight += factor.weight;
      reasonIds.push(factor.answerKey);
    }

    if (totalWeight === 0) {
      results.push({
        dimensionId: dimension.dimensionId,
        supportScore: 0,
        displayLevel: "insufficient",
        certaintyLevel: "low",
        reasonIds,
      });
      continue;
    }

    const certaintyLevel = toCertaintyLevel(totalWeight, configuredWeight);
    const rawSupportScore = Math.round(weightedScore / totalWeight);
    const supportScore = certaintyLevel === "low" ? Math.min(rawSupportScore, 50) : rawSupportScore;
    results.push({
      dimensionId: dimension.dimensionId,
      supportScore,
      displayLevel: toDisplayLevel(supportScore),
      certaintyLevel,
      reasonIds,
    });
  }

  return { dimensions: results };
}

export function toReportDimensions(dimensions: readonly DimensionScore[]): ReportDimensionView[] {
  return dimensions.map((dimension) => ({
    dimensionId: dimension.dimensionId,
    displayLevel: dimension.displayLevel,
    certaintyLevel: dimension.certaintyLevel,
    reasonIds: dimension.reasonIds,
  }));
}
