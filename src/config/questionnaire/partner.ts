import { defineQuestion } from "./_shared";

export const PARTNER_QUESTIONS = [
  defineQuestion({
    answerKey: "Q-PARTNER-AWARE",
    moduleId: "partner",
    questionType: "singleSelect",
    optionCodes: ["aware", "unaware", "unsure_tell", "deferred"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-PARTNER-DIRECTION",
    moduleId: "partner",
    questionType: "singleSelect",
    optionCodes: ["lean_continue", "lean_end", "unclear", "unaware", "deferred"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-PARTNER-RESPECT-AUTONOMY",
    moduleId: "partner",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sensitivity: "autonomySafety",
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-PARTNER-SAFE-TO-SPEAK",
    moduleId: "partner",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sensitivity: "autonomySafety",
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-PARTNER-CONCRETE-COMMITMENT",
    moduleId: "partner",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-PARTNER-PAST-RELIABILITY",
    moduleId: "partner",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-PARTNER-CONTROL-RISK",
    moduleId: "partner",
    questionType: "singleSelect",
    optionCodes: ["none", "pressure_no_fear", "pressure_or_fear", "uncertain"],
    sensitivity: "autonomySafety",
    sourceId: "SRC-ACOG-REPRO-COERCION",
  }),
  defineQuestion({
    answerKey: "Q-PARTNER-COMMITMENT-CATEGORIES",
    moduleId: "partner",
    questionType: "multiSelect",
    optionCodes: ["medical", "financial", "labor", "boundary", "emotional", "long_term_parenting", "childcare", "contingency"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
] as const;
