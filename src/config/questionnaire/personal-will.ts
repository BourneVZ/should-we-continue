import { defineQuestion } from "./_shared";

export const PERSONAL_WILL_QUESTIONS = [
  defineQuestion({
    answerKey: "Q-WILL-SELF-VS-OTHERS",
    moduleId: "will",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sensitivity: "freeText",
    sourceId: "SRC-OTTAWA-ODSF",
  }),
  defineQuestion({
    answerKey: "Q-WILL-INFORMATION-BLOCK",
    moduleId: "will",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sensitivity: "freeText",
    sourceId: "SRC-OTTAWA-ODSF",
  }),
  defineQuestion({
    answerKey: "Q-WILL-VALUE-CONFLICT",
    moduleId: "will",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sensitivity: "freeText",
    sourceId: "SRC-OTTAWA-ODSF",
  }),
  defineQuestion({
    answerKey: "Q-WILL-DECISION-TIME",
    moduleId: "will",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sensitivity: "freeText",
    sourceId: "SRC-OTTAWA-ODSF",
  }),
] as const;
