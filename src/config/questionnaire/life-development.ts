import { defineQuestion } from "./_shared";

export const LIFE_DEVELOPMENT_QUESTIONS = [
  defineQuestion({
    answerKey: "Q-LIFE-PLAN-IMPORTANCE",
    moduleId: "life",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-LIFE-CONTINUE-IMPACT",
    moduleId: "life",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-LIFE-END-IMPACT",
    moduleId: "life",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-LIFE-FREEDOM-IMPORTANCE",
    moduleId: "life",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-LIFE-IDENTITY-PREPARED",
    moduleId: "life",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-LIFE-PARTNER-SUPPORT",
    moduleId: "life",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
] as const;
