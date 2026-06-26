import type { QuestionMeta } from "@/domain/types";
import { CHILDCARE_QUESTIONS } from "./childcare";
import { DEEP_DIVE_MODULE_IDS, DEEP_DIVE_QUESTIONS } from "./deep-dives";
import { FAMILY_SOCIAL_QUESTIONS } from "./family-social";
import { FINANCIAL_POLICY_QUESTIONS } from "./financial-policy";
import { LIFE_DEVELOPMENT_QUESTIONS } from "./life-development";
import { MEASURE_METADATA } from "./measure-metadata";
import { MEDICAL_QUESTIONS } from "./medical";
import { MENTAL_HEALTH_QUESTIONS } from "./mental-health";
import { PARTNER_QUESTIONS } from "./partner";
import { PERSONAL_WILL_QUESTIONS } from "./personal-will";
import { SAFETY_QUESTIONS } from "./safety";
import { SHARING_QUESTIONS } from "./sharing";
import { VALUES_QUESTIONS } from "./values";

export const CORE_MODULE_IDS = [
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
] as const;

export const QUESTION_CATALOG = [
  ...SAFETY_QUESTIONS,
  ...MEDICAL_QUESTIONS,
  ...PERSONAL_WILL_QUESTIONS,
  ...MENTAL_HEALTH_QUESTIONS,
  ...LIFE_DEVELOPMENT_QUESTIONS,
  ...PARTNER_QUESTIONS,
  ...FAMILY_SOCIAL_QUESTIONS,
  ...FINANCIAL_POLICY_QUESTIONS,
  ...CHILDCARE_QUESTIONS,
  ...VALUES_QUESTIONS,
  ...SHARING_QUESTIONS,
  ...DEEP_DIVE_QUESTIONS,
] as const satisfies readonly QuestionMeta[];

function buildByModule(): Record<string, QuestionMeta[]> {
  const map: Record<string, QuestionMeta[]> = {};
  for (const question of QUESTION_CATALOG) {
    map[question.moduleId] ??= [];
    map[question.moduleId].push(question);
  }
  return map;
}

export const QUESTION_CATALOG_BY_MODULE = buildByModule();

export { DEEP_DIVE_MODULE_IDS, MEASURE_METADATA };
