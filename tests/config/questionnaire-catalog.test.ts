import { describe, expect, it } from "vitest";
import {
  CORE_MODULE_IDS,
  DEEP_DIVE_MODULE_IDS,
  QUESTION_CATALOG,
  QUESTION_CATALOG_BY_MODULE,
} from "@/config/questionnaire";
import { MEASURE_METADATA } from "@/config/questionnaire/measure-metadata";

describe("questionnaire catalog integrity", () => {
  it("exposes the 11 core modules defined by the spec", () => {
    expect(CORE_MODULE_IDS).toEqual([
      "safety",
      "medical",
      "will",
      "mental",
      "life",
      "partner",
      "family",
      "finance",
      "childcare",
      "values",
      "sharing",
    ]);
  });

  it("keeps question ids and answer keys unique across the catalog", () => {
    const ids = QUESTION_CATALOG.map((question) => question.id);
    const answerKeys = QUESTION_CATALOG.map((question) => question.answerKey);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(answerKeys).size).toBe(answerKeys.length);
  });

  it("registers key safety, medical, partner, childcare, and sharing questions", () => {
    expect(QUESTION_CATALOG_BY_MODULE.safety.some((question) => question.answerKey === "Q-SAFE-FREE-ANSWER")).toBe(
      true,
    );
    expect(
      QUESTION_CATALOG_BY_MODULE.medical.some((question) => question.answerKey === "Q-MED-INTRAUTERINE-CONFIRMED"),
    ).toBe(true);
    expect(QUESTION_CATALOG_BY_MODULE.partner.some((question) => question.answerKey === "Q-PARTNER-CONTROL-RISK")).toBe(
      true,
    );
    expect(QUESTION_CATALOG_BY_MODULE.childcare.some((question) => question.answerKey === "Q-CHILD-COUNT")).toBe(
      true,
    );
    expect(QUESTION_CATALOG_BY_MODULE.sharing.some((question) => question.answerKey === "Q-SHARE-INTENT")).toBe(true);
  });

  it("contains deep-dive module metadata and a partner-independent flow", () => {
    expect(DEEP_DIVE_MODULE_IDS).toEqual([
      "medical-deep",
      "mental-deep",
      "finance-deep",
      "partner-deep",
      "life-deep",
      "care-deep",
      "values-deep",
      "aftercare-deep",
      "safety-deep",
      "persona-deep",
      "partner-independent",
    ]);
  });

  it("marks all formal measures as unavailable and excludes raw measure items", () => {
    expect(MEASURE_METADATA.every((measure) => measure.status === "unavailable")).toBe(true);
    expect(QUESTION_CATALOG.every((question) => !question.answerKey.startsWith("MEASURE-"))).toBe(true);
  });

  it("only uses registered visibleWhen references", () => {
    const answerKeys = new Set(QUESTION_CATALOG.map((question) => question.answerKey));
    for (const question of QUESTION_CATALOG) {
      for (const token of question.visibleWhen ?? []) {
        const [rawKey] = token.split(/!=|=| in /);
        const refKey = rawKey.trim();
        if (refKey.length > 0) {
          expect(answerKeys.has(refKey)).toBe(true);
        }
      }
    }
  });
});
