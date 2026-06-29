import {
  ARCHETYPES,
  DIMENSION_IDS,
  DIMENSIONS,
  FALLBACK_ARCHETYPE,
  QUESTIONS,
  getDimension,
  getFamily,
  type ArchetypeDefinition,
  type DimensionId,
  type FamilyDefinition,
  type QuestionAnswerMap,
  type QuestionId,
  type ScoreVector,
} from "./model";

export interface MatchEntry {
  code: string;
  name: string;
  distance: number;
  similarityPercent: number;
  exactMatchCount: number;
  archetype: ArchetypeDefinition;
}

export interface MatchResult {
  primary: ArchetypeDefinition;
  family: FamilyDefinition;
  similar: readonly MatchEntry[];
  ranked: readonly MatchEntry[];
  isFallback: boolean;
  contradictionCount: number;
  distance: number;
}

const FALLBACK_DISTANCE_THRESHOLD = 1.18;
const CONTRADICTION_MINIMUM = 3;

const CONTRADICTION_PAIRS: readonly (readonly [DimensionId, DimensionId])[] = [
  ["factCheck", "delay"],
  ["controlCompensation", "delay"],
  ["selfContinuity", "motherhoodProjection"],
  ["motherhoodProjection", "rhythmDefense"],
  ["attachmentNeed", "freedomLossSensitivity"],
];

export function createEmptyAnswers(): QuestionAnswerMap {
  return QUESTIONS.reduce(
    (accumulator, question) => ({
      ...accumulator,
      [question.id]: null,
    }),
    {} as Record<QuestionId, number | null>,
  );
}

export function getAnsweredCount(answers: QuestionAnswerMap): number {
  return QUESTIONS.filter((question) => answers[question.id] !== null).length;
}

export function isQuizComplete(answers: QuestionAnswerMap): boolean {
  return getAnsweredCount(answers) === QUESTIONS.length;
}

export function getFirstUnansweredIndex(answers: QuestionAnswerMap): number {
  const index = QUESTIONS.findIndex((question) => answers[question.id] === null);

  return index === -1 ? QUESTIONS.length - 1 : index;
}

export function buildScoreVector(answers: QuestionAnswerMap): ScoreVector {
  return DIMENSION_IDS.reduce((accumulator, dimensionId) => {
    const relatedQuestions = QUESTIONS.filter((question) => question.dimensionId === dimensionId);
    const values = relatedQuestions
      .map((question) => answers[question.id])
      .filter((value): value is number => typeof value === "number");

    const average =
      values.length === 0 ? 3 : Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));

    return {
      ...accumulator,
      [dimensionId]: average,
    };
  }, {} as ScoreVector);
}

function calculateDistance(left: ScoreVector, right: ScoreVector): number {
  const squaredDistance = DIMENSION_IDS.reduce((sum, dimensionId) => {
    const delta = left[dimensionId] - right[dimensionId];
    return sum + delta * delta;
  }, 0);

  return Number(Math.sqrt(squaredDistance / DIMENSION_IDS.length).toFixed(3));
}

function countContradictions(vector: ScoreVector): number {
  return CONTRADICTION_PAIRS.filter(([left, right]) => vector[left] >= 4.3 && vector[right] >= 4.3).length;
}

export function getSimilarityPercent(distance: number): number {
  return Math.max(0, Math.min(100, Math.round((1 - distance / 4) * 100)));
}

export function countLevelMatches(left: ScoreVector, right: ScoreVector): number {
  return DIMENSION_IDS.filter((dimensionId) => getFingerprintLevel(left[dimensionId]) === getFingerprintLevel(right[dimensionId]))
    .length;
}

function buildMatchTable(vector: ScoreVector): readonly MatchEntry[] {
  return [...ARCHETYPES]
    .map((archetype) => {
      const distance = calculateDistance(vector, archetype.prototype);

      return {
        code: archetype.code,
        name: archetype.name,
        distance,
        similarityPercent: getSimilarityPercent(distance),
        exactMatchCount: countLevelMatches(vector, archetype.prototype),
        archetype,
      };
    })
    .sort((left, right) => left.distance - right.distance);
}

export function matchArchetype(vector: ScoreVector): MatchResult {
  const matchTable = buildMatchTable(vector);
  const bestMatch = matchTable[0];
  const contradictionCount = countContradictions(vector);
  const shouldFallback =
    bestMatch.distance >= FALLBACK_DISTANCE_THRESHOLD && contradictionCount >= CONTRADICTION_MINIMUM;

  if (shouldFallback) {
    return {
      primary: FALLBACK_ARCHETYPE,
      family: getFamily("fallback"),
      similar: matchTable.slice(0, 3),
      ranked: matchTable.slice(0, 5),
      isFallback: true,
      contradictionCount,
      distance: bestMatch.distance,
    };
  }

  return {
    primary: bestMatch.archetype,
    family: getFamily(bestMatch.archetype.familyId),
    similar: matchTable.slice(1, 4),
    ranked: matchTable.slice(0, 5),
    isFallback: false,
    contradictionCount,
    distance: bestMatch.distance,
  };
}

export function getFingerprintLevel(score: number): "low" | "medium" | "high" {
  if (score <= 2.4) {
    return "low";
  }
  if (score >= 3.6) {
    return "high";
  }
  return "medium";
}

export function getWhyTags(vector: ScoreVector, limit = 5): readonly string[] {
  return [...DIMENSIONS]
    .map((dimension) => ({
      label: vector[dimension.id] >= 3 ? dimension.highTag : dimension.lowTag,
      distanceFromNeutral: Math.abs(vector[dimension.id] - 3),
    }))
    .sort((left, right) => right.distanceFromNeutral - left.distanceFromNeutral)
    .slice(0, limit)
    .map((entry) => entry.label);
}

export function describeDimensionScore(dimensionId: DimensionId, score: number): string {
  const dimension = getDimension(dimensionId);

  return score >= 3 ? dimension.highTag : dimension.lowTag;
}
