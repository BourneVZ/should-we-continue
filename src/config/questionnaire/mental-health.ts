import { defineQuestion } from "./_shared";

export const MENTAL_HEALTH_QUESTIONS = [
  defineQuestion({
    answerKey: "Q-MH-MOOD-LOW",
    moduleId: "mental",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sensitivity: "mentalHealth",
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-MH-WORRY-HIGH",
    moduleId: "mental",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sensitivity: "mentalHealth",
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-MH-FUNCTION-IMPACT",
    moduleId: "mental",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sensitivity: "mentalHealth",
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-MH-SAFE-CONTACT",
    moduleId: "mental",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sensitivity: "mentalHealth",
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-MH-REGRET-WORRY",
    moduleId: "mental",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sensitivity: "mentalHealth",
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
] as const;
