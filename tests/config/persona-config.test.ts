import { describe, expect, it } from "vitest";
import {
  PERSONA_ALLOWED_DIMENSIONS,
  PERSONA_ALLOWED_QUESTION_KEYS,
  PERSONA_CALIBRATING_COPY_ID,
  PERSONA_CATALOG,
  PERSONA_COMPATIBILITY,
  PERSONA_STATUS_TAGS,
  PERSONA_SUPPRESSION,
  PERSONA_THRESHOLDS,
} from "@/config/personas/catalog";
import { PERSONA_MAPPING } from "@/config/personas/mapping";

describe("persona configuration", () => {
  it("defines the 12 stable personas with fixed copy and icon metadata", () => {
    expect(PERSONA_CATALOG.map((persona) => persona.personaId)).toEqual([
      "P01",
      "P02",
      "P03",
      "P04",
      "P05",
      "P06",
      "P07",
      "P08",
      "P09",
      "P10",
      "P11",
      "P12",
    ]);

    for (const persona of PERSONA_CATALOG) {
      expect(persona.groupId).toMatch(/^(information|emotion|relationship|future)$/);
      expect(persona.colorToken.length).toBeGreaterThan(0);
      expect(persona.iconId.length).toBeGreaterThan(0);
      expect(persona.title.length).toBeGreaterThan(0);
      expect(persona.summaryCopyId).toMatch(/^P\d{2}-SUMMARY$/);
      expect(persona.coreNeedCopyId).toMatch(/^P\d{2}-NEED$/);
      expect(persona.sourceId).toBe("SPEC-PERSONAS");
    }
  });

  it("keeps the allowed persona inputs on the spec whitelist only", () => {
    expect(PERSONA_ALLOWED_QUESTION_KEYS).toEqual([
      "Q-ROLE-FACT-CHECK",
      "Q-ROLE-PLAN-LIST",
      "Q-ROLE-CHANGE-SENSITIVITY",
      "Q-ROLE-NEED-SUPPORT",
      "Q-ROLE-EMOTION-EXPRESSION",
      "Q-ROLE-NEED-SPACE",
      "Q-ROLE-SHARED-PARTICIPATION",
      "Q-ROLE-COMMITMENT-EVIDENCE",
      "Q-ROLE-BOUNDARY-NEED",
      "Q-ROLE-LONG-TERM-REVIEW",
      "Q-ROLE-LIFE-CONTINUITY",
      "Q-ROLE-RESOURCE-CAPACITY",
    ]);

    expect(PERSONA_ALLOWED_DIMENSIONS).toEqual([
      "personalWillClaritySupport",
      "lifeDevelopmentSupport",
      "partnerCommitmentSupport",
      "familySocialSupport",
      "financialPolicySupport",
      "childcareLoadSupport",
    ]);
  });

  it("defines all status tags, thresholds, compatibility, and suppression boundaries", () => {
    expect(PERSONA_STATUS_TAGS.map((tag) => tag.tagId)).toEqual([
      "S01",
      "S02",
      "S03",
      "S04",
      "S05",
      "S06",
      "S07",
      "S08",
      "S09",
      "S10",
      "S11",
      "S12",
    ]);

    expect(PERSONA_THRESHOLDS).toEqual({
      minValidCount: 8,
      minInformativeCount: 6,
      minCandidateScore: 55,
      minConfidence: 70,
      tieWindow: 2,
      secondaryWindow: 8,
      maxStatusTags: 7,
    });

    expect(PERSONA_COMPATIBILITY.P01).toEqual(["P02", "P03", "P10"]);
    expect(PERSONA_COMPATIBILITY.P04).toEqual(["P05", "P07", "P08"]);
    expect(PERSONA_COMPATIBILITY.P12).toEqual(["P02", "P08", "P09"]);

    expect(PERSONA_SUPPRESSION).toEqual({
      redFlagLevels: ["R3", "R4"],
      redFlagReason: "red_flag_R3_or_R4",
      insufficientDataReason: "insufficient_persona_data",
    });
    expect(PERSONA_CALIBRATING_COPY_ID).toBe("RPT-PERSONA-CALIBRATING");
  });

  it("keeps each persona mapping tied to reviewed spec features only", () => {
    expect(PERSONA_MAPPING).toHaveLength(12);

    for (const entry of PERSONA_MAPPING) {
      const totalWeight = entry.features.reduce((sum, feature) => sum + feature.weight, 0);
      expect(totalWeight).toBe(100);
      expect(entry.minimumScore).toBe(55);
      expect(entry.features.length).toBeGreaterThanOrEqual(2);

      for (const feature of entry.features) {
        expect(feature.sourceId).toBe("SPEC-PERSONAS");
      }
    }
  });
});
