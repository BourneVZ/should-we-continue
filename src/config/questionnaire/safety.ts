import { defineQuestion } from "./_shared";

export const SAFETY_QUESTIONS = [
  defineQuestion({
    answerKey: "Q-SAFE-FREE-ANSWER",
    moduleId: "safety",
    questionType: "singleSelect",
    optionCodes: ["safe", "unsure", "unsafe"],
    required: true,
    sensitivity: "autonomySafety",
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-SAFE-PRIVACY-RISK",
    moduleId: "safety",
    questionType: "singleSelect",
    optionCodes: ["none", "some", "high", "deferred"],
    required: true,
    sensitivity: "autonomySafety",
    sourceId: "SRC-ACOG-IPV",
  }),
  defineQuestion({
    answerKey: "Q-SAFE-COERCION",
    moduleId: "safety",
    questionType: "singleSelect",
    optionCodes: ["none", "pressure_no_fear", "pressure_or_fear", "uncertain"],
    required: true,
    sensitivity: "autonomySafety",
    sourceId: "SRC-ACOG-REPRO-COERCION",
  }),
  defineQuestion({
    answerKey: "Q-SAFE-SELF-HARM",
    moduleId: "safety",
    questionType: "singleSelect",
    optionCodes: ["safe", "passing_but_safe", "unsafe_now", "uncertain"],
    required: true,
    sensitivity: "mentalHealth",
    sourceId: "SRC-ACOG-CPG-2023",
  }),
  defineQuestion({
    answerKey: "Q-SAFE-URGENT-SYMPTOM",
    moduleId: "safety",
    questionType: "singleSelect",
    optionCodes: ["none", "mild", "severe", "uncertain"],
    required: true,
    sensitivity: "medical",
    sourceId: "SRC-CDC-UMWS",
  }),
] as const;
