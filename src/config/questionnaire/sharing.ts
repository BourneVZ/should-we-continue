import { defineQuestion } from "./_shared";

export const SHARING_QUESTIONS = [
  defineQuestion({
    answerKey: "Q-FREE-OTHER-TEXT",
    moduleId: "sharing",
    questionType: "freeText",
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-FREE-PARTNER-UNDERSTAND-TEXT",
    moduleId: "sharing",
    questionType: "freeText",
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
] as const;
