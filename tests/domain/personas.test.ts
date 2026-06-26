import { describe, expect, it } from "vitest";
import { PERSONA_MAPPING } from "@/config/personas/mapping";
import { PERSONA_CATALOG, PERSONA_STATUS_TAGS } from "@/config/personas/catalog";
import { calculatePersonaResult } from "@/domain/personas";
import type { DimensionScore } from "@/domain/types";
import { createAnswered, createRedFlagResult } from "../fixtures/factories";

function createPersonaDimensions(
  overrides: Partial<Record<DimensionScore["dimensionId"], number>> = {},
): DimensionScore[] {
  const baseScores: Record<DimensionScore["dimensionId"], number> = {
    medicalSafetySupport: 60,
    autonomySafetySupport: 60,
    mentalHealthSupport: 60,
    partnerCommitmentSupport: 60,
    familySocialSupport: 60,
    financialPolicySupport: 60,
    lifeDevelopmentSupport: 60,
    childcareLoadSupport: 60,
    personalWillClaritySupport: 60,
  };

  return Object.entries({ ...baseScores, ...overrides }).map(([dimensionId, supportScore]) => ({
    dimensionId: dimensionId as DimensionScore["dimensionId"],
    supportScore,
    displayLevel: supportScore >= 75 ? "high" : supportScore >= 50 ? "medium" : supportScore >= 25 ? "low" : "insufficient",
    reasonIds: [dimensionId],
  }));
}

describe("calculatePersonaResult", () => {
  it("derives a primary and compatible secondary persona from heuristic answers only", () => {
    const result = calculatePersonaResult(
      {
        "Q-ROLE-FACT-CHECK": createAnswered("SA"),
        "Q-ROLE-PLAN-LIST": createAnswered("D"),
        "Q-ROLE-CHANGE-SENSITIVITY": createAnswered("SA"),
        "Q-ROLE-NEED-SUPPORT": createAnswered("D"),
        "Q-ROLE-EMOTION-EXPRESSION": createAnswered("D"),
        "Q-ROLE-NEED-SPACE": createAnswered("A"),
        "Q-ROLE-SHARED-PARTICIPATION": createAnswered("D"),
        "Q-ROLE-COMMITMENT-EVIDENCE": createAnswered("D"),
        "Q-ROLE-BOUNDARY-NEED": createAnswered("D"),
        "Q-ROLE-LONG-TERM-REVIEW": createAnswered("A"),
        "Q-ROLE-LIFE-CONTINUITY": createAnswered("D"),
        "Q-ROLE-RESOURCE-CAPACITY": createAnswered("D"),
      },
      createPersonaDimensions({ personalWillClaritySupport: 80 }),
      createRedFlagResult(),
      PERSONA_MAPPING,
      PERSONA_CATALOG,
      PERSONA_STATUS_TAGS,
    );

    expect(result.primaryPersonaId).toBe("P01");
    expect(result.secondaryPersonaId).toBe("P03");
    expect(result.candidatePersonaIds).toContain("P01");
    expect(result.candidatePersonaIds).toContain("P03");
    expect(result.personaConfidence).toBeGreaterThanOrEqual(70);
  });

  it("uses stable personaId ordering to break score ties", () => {
    const result = calculatePersonaResult(
      {
        "Q-ROLE-FACT-CHECK": createAnswered("SA"),
        "Q-ROLE-PLAN-LIST": createAnswered("D"),
        "Q-ROLE-CHANGE-SENSITIVITY": createAnswered("SA"),
        "Q-ROLE-NEED-SUPPORT": createAnswered("D"),
        "Q-ROLE-EMOTION-EXPRESSION": createAnswered("D"),
        "Q-ROLE-NEED-SPACE": createAnswered("D"),
        "Q-ROLE-SHARED-PARTICIPATION": createAnswered("D"),
        "Q-ROLE-COMMITMENT-EVIDENCE": createAnswered("D"),
        "Q-ROLE-BOUNDARY-NEED": createAnswered("D"),
        "Q-ROLE-LONG-TERM-REVIEW": createAnswered("D"),
        "Q-ROLE-LIFE-CONTINUITY": createAnswered("D"),
        "Q-ROLE-RESOURCE-CAPACITY": createAnswered("D"),
      },
      createPersonaDimensions({ personalWillClaritySupport: 100 }),
      createRedFlagResult(),
      PERSONA_MAPPING,
      PERSONA_CATALOG,
      PERSONA_STATUS_TAGS,
    );

    expect(result.primaryPersonaId).toBe("P01");
    expect(result.secondaryPersonaId).toBe("P03");
  });

  it("returns calibrating output when valid or informative persona input is insufficient", () => {
    const result = calculatePersonaResult(
      {
        "Q-ROLE-FACT-CHECK": createAnswered("SA"),
        "Q-ROLE-PLAN-LIST": createAnswered("U"),
        "Q-ROLE-CHANGE-SENSITIVITY": createAnswered("U"),
        "Q-ROLE-NEED-SUPPORT": createAnswered("A"),
        "Q-ROLE-EMOTION-EXPRESSION": createAnswered("A"),
        "Q-ROLE-NEED-SPACE": createAnswered("D"),
        "Q-ROLE-SHARED-PARTICIPATION": createAnswered("D"),
      },
      createPersonaDimensions(),
      createRedFlagResult(),
      PERSONA_MAPPING,
      PERSONA_CATALOG,
      PERSONA_STATUS_TAGS,
    );

    expect(result.primaryPersonaId).toBeNull();
    expect(result.secondaryPersonaId).toBeNull();
    expect(result.suppressedReason).toBe("insufficient_persona_data");
  });

  it("does not choose an incompatible secondary persona even when it scores highly", () => {
    const result = calculatePersonaResult(
      {
        "Q-ROLE-FACT-CHECK": createAnswered("D"),
        "Q-ROLE-PLAN-LIST": createAnswered("D"),
        "Q-ROLE-CHANGE-SENSITIVITY": createAnswered("D"),
        "Q-ROLE-NEED-SUPPORT": createAnswered("SA"),
        "Q-ROLE-EMOTION-EXPRESSION": createAnswered("D"),
        "Q-ROLE-NEED-SPACE": createAnswered("D"),
        "Q-ROLE-SHARED-PARTICIPATION": createAnswered("D"),
        "Q-ROLE-COMMITMENT-EVIDENCE": createAnswered("D"),
        "Q-ROLE-BOUNDARY-NEED": createAnswered("SA"),
        "Q-ROLE-LONG-TERM-REVIEW": createAnswered("D"),
        "Q-ROLE-LIFE-CONTINUITY": createAnswered("D"),
        "Q-ROLE-RESOURCE-CAPACITY": createAnswered("D"),
      },
      createPersonaDimensions({
        partnerCommitmentSupport: 0,
        familySocialSupport: 0,
        financialPolicySupport: 60,
        childcareLoadSupport: 60,
      }),
      createRedFlagResult(),
      PERSONA_MAPPING,
      PERSONA_CATALOG,
      PERSONA_STATUS_TAGS,
    );

    expect(result.primaryPersonaId).toBe("P04");
    expect(result.secondaryPersonaId).toBeNull();
  });

  it("suppresses personas and status tags when red flag level is R3 or R4", () => {
    const result = calculatePersonaResult(
      {
        "Q-ROLE-FACT-CHECK": createAnswered("SA"),
        "Q-ROLE-PLAN-LIST": createAnswered("SA"),
        "Q-ROLE-CHANGE-SENSITIVITY": createAnswered("SA"),
        "Q-ROLE-NEED-SUPPORT": createAnswered("SA"),
        "Q-ROLE-EMOTION-EXPRESSION": createAnswered("SA"),
        "Q-ROLE-NEED-SPACE": createAnswered("SA"),
        "Q-ROLE-SHARED-PARTICIPATION": createAnswered("SA"),
        "Q-ROLE-COMMITMENT-EVIDENCE": createAnswered("SA"),
        "Q-ROLE-BOUNDARY-NEED": createAnswered("SA"),
        "Q-ROLE-LONG-TERM-REVIEW": createAnswered("SA"),
        "Q-ROLE-LIFE-CONTINUITY": createAnswered("SA"),
        "Q-ROLE-RESOURCE-CAPACITY": createAnswered("SA"),
      },
      createPersonaDimensions(),
      createRedFlagResult({ level: "R3", personaSuppressedReason: "offline-support-first" }),
      PERSONA_MAPPING,
      PERSONA_CATALOG,
      PERSONA_STATUS_TAGS,
    );

    expect(result).toEqual({
      primaryPersonaId: null,
      secondaryPersonaId: null,
      candidatePersonaIds: [],
      personaConfidence: 0,
      statusTagIds: [],
      suppressedReason: "red_flag_R3_or_R4",
    });
  });

  it("ignores forbidden medical, direction, and path-related fields", () => {
    const baseAnswers = {
      "Q-ROLE-FACT-CHECK": createAnswered("A"),
      "Q-ROLE-PLAN-LIST": createAnswered("D"),
      "Q-ROLE-CHANGE-SENSITIVITY": createAnswered("A"),
      "Q-ROLE-NEED-SUPPORT": createAnswered("D"),
      "Q-ROLE-EMOTION-EXPRESSION": createAnswered("D"),
      "Q-ROLE-NEED-SPACE": createAnswered("A"),
      "Q-ROLE-SHARED-PARTICIPATION": createAnswered("D"),
      "Q-ROLE-COMMITMENT-EVIDENCE": createAnswered("D"),
      "Q-ROLE-BOUNDARY-NEED": createAnswered("D"),
      "Q-ROLE-LONG-TERM-REVIEW": createAnswered("A"),
      "Q-ROLE-LIFE-CONTINUITY": createAnswered("D"),
      "Q-ROLE-RESOURCE-CAPACITY": createAnswered("D"),
    };

    const cleanResult = calculatePersonaResult(
      baseAnswers,
      createPersonaDimensions({ personalWillClaritySupport: 80 }),
      createRedFlagResult(),
      PERSONA_MAPPING,
      PERSONA_CATALOG,
      PERSONA_STATUS_TAGS,
    );

    const noisyResult = calculatePersonaResult(
      {
        ...baseAnswers,
        "Q-WILL-CURRENT-DIRECTION": createAnswered("continue"),
        "Q-MED-FIRST-ULTRASOUND": createAnswered("booked"),
        "Q-FREE-NOTES": createAnswered("user private"),
      },
      createPersonaDimensions({
        medicalSafetySupport: 0,
        autonomySafetySupport: 0,
        personalWillClaritySupport: 80,
      }),
      createRedFlagResult(),
      PERSONA_MAPPING,
      PERSONA_CATALOG,
      PERSONA_STATUS_TAGS,
    );

    expect(noisyResult).toEqual(cleanResult);
  });
});
