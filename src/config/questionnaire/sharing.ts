import { defineQuestion } from "./_shared";

export const SHARING_QUESTIONS = [
  defineQuestion({ answerKey: "Q-FREE-OTHER-TEXT", moduleId: "sharing", questionType: "freeText", sourceId: "SPEC-QUESTIONNAIRE" }),
  defineQuestion({ answerKey: "Q-FREE-PARTNER-UNDERSTAND-TEXT", moduleId: "sharing", questionType: "freeText", sourceId: "SPEC-QUESTIONNAIRE" }),
  defineQuestion({
    answerKey: "Q-SHARE-INTENT",
    moduleId: "sharing",
    questionType: "singleSelect",
    optionCodes: ["willing", "maybe_with_selection", "not_now"],
    privacy: "private",
    sensitivity: "none",
    sourceId: "SPEC-REPORT-SHARING",
  }),
] as const;
