import { describe, expect, it } from "vitest";
import {
  ARCHETYPES,
  DIMENSION_IDS,
  QUESTIONS,
  type DimensionId,
  type QuestionAnswerMap,
  type ScoreVector,
} from "@/core-spec-rebuild/model";
import {
  buildScoreVector,
  createEmptyAnswers,
  getFingerprintLevel,
  matchArchetype,
} from "@/core-spec-rebuild/scoring";

function buildAnswersFromVector(vector: ScoreVector): QuestionAnswerMap {
  const answers = createEmptyAnswers();

  for (const question of QUESTIONS) {
    answers[question.id] = vector[question.dimensionId];
  }

  return answers;
}

function makeVector(seed: number): ScoreVector {
  return DIMENSION_IDS.reduce(
    (accumulator, dimensionId, index) => ({
      ...accumulator,
      [dimensionId]: index % 2 === 0 ? seed : Math.max(1, Math.min(5, seed + 0.5)),
    }),
    {} as Record<DimensionId, number>,
  );
}

describe("core-spec-rebuild scoring", () => {
  it("averages two answers into one dimension score", () => {
    const answers = createEmptyAnswers();

    answers.Q01 = 5;
    answers.Q02 = 3;
    answers.Q03 = 2;
    answers.Q04 = 4;

    const vector = buildScoreVector(answers);

    expect(vector.factCheck).toBe(4);
    expect(vector.delay).toBe(3);
  });

  it("matches the nearest standard archetype when the vector is coherent", () => {
    const target = ARCHETYPES.find((archetype) => archetype.code === "CTRL");

    expect(target).toBeDefined();

    const result = matchArchetype(target!.prototype);

    expect(result.primary.code).toBe("CTRL");
    expect(result.isFallback).toBe(false);
    expect(result.similar.map((entry) => entry.code)).toContain("SCAN");
  });

  it("falls back to NOIS when the vector is both contradictory and far from standard profiles", () => {
    const vector = makeVector(3);

    vector.factCheck = 5;
    vector.delay = 5;
    vector.controlCompensation = 5;
    vector.intrusionSensitivity = 1;
    vector.riskSimulation = 1;
    vector.recoveryCatastrophizing = 1;
    vector.selfContinuity = 5;
    vector.motherhoodProjection = 5;
    vector.rhythmDefense = 5;
    vector.confirmationNeed = 1;
    vector.attachmentNeed = 5;
    vector.commitmentVerification = 1;
    vector.orderAnxiety = 1;
    vector.freedomLossSensitivity = 5;
    vector.careLoadEstimation = 1;

    const result = matchArchetype(vector);

    expect(result.primary.code).toBe("NOIS");
    expect(result.isFallback).toBe(true);
    expect(result.similar).toHaveLength(3);
  });

  it("compresses continuous scores into low, medium and high fingerprint levels", () => {
    expect(getFingerprintLevel(2.4)).toBe("low");
    expect(getFingerprintLevel(2.5)).toBe("medium");
    expect(getFingerprintLevel(3.6)).toBe("high");
  });

  it("can build a full score vector from a questionnaire answer map", () => {
    const control = ARCHETYPES.find((archetype) => archetype.code === "CTRL");

    expect(control).toBeDefined();

    const answers = buildAnswersFromVector(control!.prototype);
    const vector = buildScoreVector(answers);

    expect(vector).toEqual(control!.prototype);
  });
});
