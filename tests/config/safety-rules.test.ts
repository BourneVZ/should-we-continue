import { describe, expect, it } from "vitest";
import { QUESTION_CATALOG } from "@/config/questionnaire";
import { SAFETY_RULES } from "@/config/scoring/safety";

describe("safety rules configuration", () => {
  it("only references registered answer keys and action ids", () => {
    const answerKeys = new Set(QUESTION_CATALOG.map((question) => question.answerKey));

    for (const rule of SAFETY_RULES) {
      for (const answerKey of rule.answerKeys) {
        expect(answerKeys.has(answerKey)).toBe(true);
      }
      expect(rule.actionId.startsWith("ACT-")).toBe(true);
      expect(rule.ruleId.startsWith("RF-")).toBe(true);
    }
  });

  it("keeps R4 rules ahead of lower-priority rules", () => {
    const levels = SAFETY_RULES.map((rule) => rule.level);
    expect(levels.slice(0, 6).every((level) => level === "R4")).toBe(true);
    expect(levels.indexOf("R3")).toBeGreaterThan(0);
    expect(levels.indexOf("R2")).toBeGreaterThan(levels.indexOf("R3"));
    expect(levels.indexOf("R1")).toBeGreaterThan(levels.indexOf("R2"));
  });
});
