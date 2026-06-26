import {
  PERSONA_ALLOWED_DIMENSIONS,
  PERSONA_ALLOWED_QUESTION_KEYS,
  PERSONA_COMPATIBILITY,
  PERSONA_STATUS_TAGS,
  PERSONA_SUPPRESSION,
  PERSONA_THRESHOLDS,
} from "@/config/personas/catalog";
import type { PersonaMappingEntry } from "@/config/personas/mapping";
import type {
  AnswerValue,
  DimensionScore,
  PersonaResult,
  RedFlagResult,
} from "@/domain/types";

const SCALE5_SCORE: Record<string, number> = {
  SD: 0,
  D: 25,
  U: 50,
  A: 75,
  SA: 100,
};

type AnsweredValue = Extract<AnswerValue, { status: "answered" }>["value"];

function getAnsweredValue(answer: AnswerValue | undefined): AnsweredValue | null {
  if (answer?.status !== "answered") {
    return null;
  }

  return answer.value as AnsweredValue;
}

function getScaleScore(answer: AnswerValue | undefined): number | null {
  const value = getAnsweredValue(answer);
  if (typeof value !== "string") {
    return null;
  }

  return SCALE5_SCORE[value] ?? null;
}

function calculateStatusTagIds(
  answers: Record<string, AnswerValue>,
  dimensions: readonly DimensionScore[],
): string[] {
  const dimensionMap = new Map(
    dimensions
      .filter((dimension) => PERSONA_ALLOWED_DIMENSIONS.includes(dimension.dimensionId))
      .map((dimension) => [dimension.dimensionId, dimension.supportScore] as const),
  );
  const answerMap = new Map(
    PERSONA_ALLOWED_QUESTION_KEYS.map((answerKey) => [answerKey, getAnsweredValue(answers[answerKey])] as const),
  );

  const hits = new Set<string>();
  const needSpace = answerMap.get("Q-ROLE-NEED-SPACE");
  const emotionExpression = answerMap.get("Q-ROLE-EMOTION-EXPRESSION");
  const needSupport = answerMap.get("Q-ROLE-NEED-SUPPORT");
  const sharedParticipation = answerMap.get("Q-ROLE-SHARED-PARTICIPATION");
  const boundaryNeed = answerMap.get("Q-ROLE-BOUNDARY-NEED");
  const longTermReview = answerMap.get("Q-ROLE-LONG-TERM-REVIEW");
  const lifeContinuity = answerMap.get("Q-ROLE-LIFE-CONTINUITY");
  const personalWill = dimensionMap.get("personalWillClaritySupport");
  const partnerCommitment = dimensionMap.get("partnerCommitmentSupport");
  const familySocial = dimensionMap.get("familySocialSupport");
  const financialPolicy = dimensionMap.get("financialPolicySupport");
  const lifeDevelopment = dimensionMap.get("lifeDevelopmentSupport");
  const childcareLoad = dimensionMap.get("childcareLoadSupport");

  if ((personalWill ?? 100) < 50 && (needSpace === "A" || needSpace === "SA")) {
    hits.add("S02");
  }
  if ((personalWill ?? 100) < 50) {
    hits.add("S03");
  }
  if ((partnerCommitment ?? 100) < 50) {
    hits.add("S04");
  }
  if ((familySocial ?? 100) < 50 || boundaryNeed === "A" || boundaryNeed === "SA") {
    hits.add("S05");
  }
  if ((needSupport === "A" || needSupport === "SA") && (emotionExpression === "A" || emotionExpression === "SA")) {
    hits.add("S06");
  }
  if ((lifeDevelopment ?? 100) < 50) {
    hits.add("S07");
  }
  if ((childcareLoad ?? 100) < 50) {
    hits.add("S08");
  }
  if ((financialPolicy ?? 100) < 50) {
    hits.add("S09");
  }
  if ((longTermReview === "A" || longTermReview === "SA") && (personalWill ?? 100) < 75) {
    hits.add("S10");
  }
  if ((partnerCommitment ?? 100) < 50 && (sharedParticipation === "A" || sharedParticipation === "SA")) {
    hits.add("S11");
  }
  if (needSpace === "A" || needSpace === "SA" || lifeContinuity === "A" || lifeContinuity === "SA") {
    hits.add("S12");
  }

  return PERSONA_STATUS_TAGS
    .filter((tag) => hits.has(tag.tagId))
    .sort((left, right) => left.priority - right.priority)
    .slice(0, PERSONA_THRESHOLDS.maxStatusTags)
    .map((tag) => tag.tagId);
}

export function calculatePersonaResult(
  answers: Record<string, AnswerValue>,
  dimensions: readonly DimensionScore[],
  redFlag: RedFlagResult,
  mapping: readonly PersonaMappingEntry[],
  _catalog: readonly { personaId: string }[],
  _statusTags: readonly { tagId: string }[] = PERSONA_STATUS_TAGS,
): PersonaResult {
  if (PERSONA_SUPPRESSION.redFlagLevels.includes(redFlag.level)) {
    return {
      primaryPersonaId: null,
      secondaryPersonaId: null,
      candidatePersonaIds: [],
      personaConfidence: 0,
      statusTagIds: [],
      suppressedReason: PERSONA_SUPPRESSION.redFlagReason,
    };
  }

  const dimensionMap = new Map(
    dimensions
      .filter((dimension) => PERSONA_ALLOWED_DIMENSIONS.includes(dimension.dimensionId))
      .map((dimension) => [dimension.dimensionId, dimension.supportScore] as const),
  );

  const validCount = PERSONA_ALLOWED_QUESTION_KEYS.filter((answerKey) => getScaleScore(answers[answerKey]) !== null).length;
  const informativeCount = PERSONA_ALLOWED_QUESTION_KEYS.filter((answerKey) => {
    const score = getScaleScore(answers[answerKey]);
    return score !== null && score !== SCALE5_SCORE.U;
  }).length;

  const scoredCandidates = mapping
    .map((entry) => {
      let weightedScore = 0;
      let totalWeight = 0;

      for (const feature of entry.features) {
        let score: number | null = null;
        if (feature.key.startsWith("gap:")) {
          const dimensionId = feature.key.slice(4) as DimensionScore["dimensionId"];
          const supportScore = dimensionMap.get(dimensionId);
          score = typeof supportScore === "number" ? 100 - supportScore : null;
        } else {
          score = getScaleScore(answers[feature.key]);
        }

        if (score === null) {
          continue;
        }

        weightedScore += score * feature.weight;
        totalWeight += feature.weight;
      }

      const score = totalWeight === 0 ? 0 : Math.round(weightedScore / totalWeight);
      return { personaId: entry.personaId, score, minimumScore: entry.minimumScore };
    })
    .filter((candidate) => candidate.score >= candidate.minimumScore)
    .sort((left, right) => right.score - left.score || left.personaId.localeCompare(right.personaId));

  const primaryCandidate = scoredCandidates[0];
  const secondCandidate = scoredCandidates[1];
  const spread = primaryCandidate ? Math.max(0, primaryCandidate.score - (secondCandidate?.score ?? 0)) : 0;
  const personaConfidence = primaryCandidate
    ? Math.min(
        100,
        Math.round((validCount / PERSONA_ALLOWED_QUESTION_KEYS.length) * 60 + (informativeCount / PERSONA_ALLOWED_QUESTION_KEYS.length) * 25 + Math.min(spread * 2, 15)),
      )
    : 0;
  const statusTagIds = calculateStatusTagIds(answers, dimensions);

  if (
    validCount < PERSONA_THRESHOLDS.minValidCount ||
    informativeCount < PERSONA_THRESHOLDS.minInformativeCount ||
    !primaryCandidate ||
    primaryCandidate.score < PERSONA_THRESHOLDS.minCandidateScore ||
    personaConfidence < PERSONA_THRESHOLDS.minConfidence
  ) {
    return {
      primaryPersonaId: null,
      secondaryPersonaId: null,
      candidatePersonaIds: scoredCandidates.map((candidate) => candidate.personaId),
      personaConfidence,
      statusTagIds,
      suppressedReason: PERSONA_SUPPRESSION.insufficientDataReason,
    };
  }

  const compatibleSet = new Set(PERSONA_COMPATIBILITY[primaryCandidate.personaId] ?? []);
  const secondaryCandidate = scoredCandidates.find(
    (candidate) =>
      candidate.personaId !== primaryCandidate.personaId &&
      compatibleSet.has(candidate.personaId) &&
      candidate.score >= PERSONA_THRESHOLDS.minCandidateScore &&
      primaryCandidate.score - candidate.score <= PERSONA_THRESHOLDS.secondaryWindow,
  );

  return {
    primaryPersonaId: primaryCandidate.personaId,
    secondaryPersonaId: secondaryCandidate?.personaId ?? null,
    candidatePersonaIds: scoredCandidates.map((candidate) => candidate.personaId),
    personaConfidence,
    statusTagIds,
    suppressedReason: null,
  };
}
