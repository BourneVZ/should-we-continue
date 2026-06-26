import { defineQuestion } from "./_shared";

export const FAMILY_SOCIAL_QUESTIONS = [
  defineQuestion({
    answerKey: "Q-FAMILY-SUPPORT-SOURCES",
    moduleId: "family",
    questionType: "singleSelect",
    optionCodes: ["none", "one", "two", "three_plus"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-FAMILY-SUPPORT-TYPES",
    moduleId: "family",
    questionType: "multiSelect",
    optionCodes: ["money", "appointment", "recovery_care", "childcare", "household", "emotional", "housing", "other"],
    visibleWhen: ["Q-FAMILY-SUPPORT-SOURCES!=none"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-FAMILY-SUPPORT-STABILITY",
    moduleId: "family",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-FAMILY-BOUNDARY-PRESSURE",
    moduleId: "family",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SRC-ACOG-IPV",
  }),
  defineQuestion({
    answerKey: "Q-FAMILY-REFUSAL-CONSEQUENCE",
    moduleId: "family",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SRC-ACOG-REPRO-COERCION",
  }),
  defineQuestion({
    answerKey: "Q-FAMILY-ACCEPT-SUPPORT",
    moduleId: "family",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
] as const;
