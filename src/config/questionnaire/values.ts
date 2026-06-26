import { defineQuestion } from "./_shared";

export const VALUES_QUESTIONS = [
  defineQuestion({ answerKey: "Q-VALUE-AUTONOMY-SAFETY", moduleId: "values", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SRC-IPDAS" }),
  defineQuestion({ answerKey: "Q-VALUE-FAMILY-CONTINUITY", moduleId: "values", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SRC-IPDAS" }),
  defineQuestion({ answerKey: "Q-VALUE-SHARED-RESPONSIBILITY", moduleId: "values", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SRC-IPDAS" }),
  defineQuestion({ answerKey: "Q-VALUE-LIFE-RHYTHM", moduleId: "values", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SRC-IPDAS" }),
  defineQuestion({ answerKey: "Q-VALUE-CONTINUE-REGRET", moduleId: "values", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SRC-OTTAWA-ODSF" }),
  defineQuestion({ answerKey: "Q-VALUE-END-REGRET", moduleId: "values", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SRC-OTTAWA-ODSF" }),
  defineQuestion({ answerKey: "Q-VALUE-BOUNDARIES-KNOWN", moduleId: "values", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SRC-OTTAWA-ODSF" }),
  defineQuestion({ answerKey: "Q-VALUE-PRIORITIES", moduleId: "values", questionType: "multiSelect", optionCodes: ["autonomy", "family", "relationship", "life", "finance", "childcare", "health", "unclear"], sourceId: "SRC-IPDAS" }),
  defineQuestion({ answerKey: "Q-VALUE-FUTURE-NOTE", moduleId: "values", questionType: "freeText", sourceId: "SPEC-QUESTIONNAIRE" }),
] as const;
