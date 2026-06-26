import { defineQuestion } from "./_shared";

export const CHILDCARE_QUESTIONS = [
  defineQuestion({
    answerKey: "Q-CHILD-COUNT",
    moduleId: "childcare",
    questionType: "singleSelect",
    optionCodes: ["none", "one", "two", "three_plus"],
    required: true,
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-CHILD-AGE-BANDS",
    moduleId: "childcare",
    questionType: "multiSelect",
    optionCodes: ["age0to3", "age3to6", "primary", "secondary_plus"],
    visibleWhen: ["Q-CHILD-COUNT!=none"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-CHILD-SPECIAL-NEEDS",
    moduleId: "childcare",
    questionType: "singleSelect",
    optionCodes: ["none", "mild", "clear", "uncertain"],
    visibleWhen: ["Q-CHILD-COUNT!=none"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-CHILD-PRIMARY-CARER",
    moduleId: "childcare",
    questionType: "singleSelect",
    optionCodes: ["self", "partner", "shared", "grandparents", "service", "other"],
    visibleWhen: ["Q-CHILD-COUNT!=none"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-CHILD-CONTINUE-CARE-IMPACT",
    moduleId: "childcare",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    visibleWhen: ["Q-CHILD-COUNT!=none"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
  defineQuestion({
    answerKey: "Q-CHILD-END-RECOVERY-CARE",
    moduleId: "childcare",
    questionType: "scale",
    optionCodes: ["SD", "D", "U", "A", "SA"],
    visibleWhen: ["Q-CHILD-COUNT!=none"],
    sourceId: "SPEC-QUESTIONNAIRE",
  }),
] as const;
