import { defineQuestion } from "./_shared";

export const FINANCIAL_POLICY_QUESTIONS = [
  defineQuestion({ answerKey: "Q-FIN-INCOME-STABLE", moduleId: "finance", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SRC-NBS-STAT-2024" }),
  defineQuestion({ answerKey: "Q-FIN-SAVINGS-BUFFER", moduleId: "finance", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SPEC-QUESTIONNAIRE" }),
  defineQuestion({ answerKey: "Q-FIN-FIXED-COST-PRESSURE", moduleId: "finance", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SPEC-QUESTIONNAIRE" }),
  defineQuestion({ answerKey: "Q-FIN-INSURANCE-KNOWN", moduleId: "finance", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SRC-HZ-MEDICAL-INSURANCE" }),
  defineQuestion({ answerKey: "Q-FIN-CONTINUE-INCOME-IMPACT", moduleId: "finance", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SPEC-QUESTIONNAIRE" }),
  defineQuestion({ answerKey: "Q-FIN-POLICY-KNOWN", moduleId: "finance", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SRC-ZJ-POPULATION-LAW-FTU" }),
  defineQuestion({ answerKey: "Q-FIN-CONTINUE-BUDGET", moduleId: "finance", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SPEC-QUESTIONNAIRE" }),
  defineQuestion({ answerKey: "Q-FIN-END-BUDGET", moduleId: "finance", questionType: "scale", optionCodes: ["SD", "D", "U", "A", "SA"], sourceId: "SPEC-QUESTIONNAIRE" }),
] as const;
