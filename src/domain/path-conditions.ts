import type { PathConditionConfig } from "@/config/scoring/path-conditions";
import type { AnswerValue, PathConditionView } from "@/domain/types";

type Answers = Record<string, AnswerValue>;
type AnsweredValue = Extract<AnswerValue, { status: "answered" }>["value"];

function getValue(answers: Answers, answerKey: string): AnsweredValue | null {
  const answer = answers[answerKey];
  return answer?.status === "answered" ? answer.value : null;
}

function isAnswered(answers: Answers, answerKey: string): boolean {
  return getValue(answers, answerKey) !== null;
}

function isOneOf(answers: Answers, answerKey: string, values: readonly string[]): boolean {
  const value = getValue(answers, answerKey);
  return typeof value === "string" && values.includes(value);
}

function selectedCount(answers: Answers, answerKey: string): number {
  const value = getValue(answers, answerKey);
  return Array.isArray(value) ? value.length : 0;
}

function hasCondition(conditionId: string, answers: Answers): boolean {
  switch (conditionId) {
    case "PC-C-MEDICAL":
      return (
        isOneOf(answers, "Q-MED-PREGNANCY-CONFIRMED", ["confirmed"]) &&
        isOneOf(answers, "Q-MED-INTRAUTERINE-CONFIRMED", ["confirmed"]) &&
        isOneOf(answers, "Q-MED-CARE-PLAN", ["booked", "plan_to_book"])
      );
    case "PC-C-PARTNER":
      return (
        isOneOf(answers, "Q-PARTNER-RESPECT-AUTONOMY", ["A", "SA"]) &&
        isOneOf(answers, "Q-PARTNER-CONCRETE-COMMITMENT", ["A", "SA"]) &&
        selectedCount(answers, "Q-PARTNER-COMMITMENT-CATEGORIES") >= 4
      );
    case "PC-C-FINANCE":
      return (
        isOneOf(answers, "Q-FIN-INCOME-STABLE", ["A", "SA"]) &&
        isOneOf(answers, "Q-FIN-SAVINGS-BUFFER", ["A", "SA"]) &&
        isOneOf(answers, "Q-FIN-CONTINUE-BUDGET", ["A", "SA"])
      );
    case "PC-C-CARE":
      return (
        isOneOf(answers, "Q-CHILD-COUNT", ["none"]) ||
        (isOneOf(answers, "Q-CHILD-CONTINUE-CARE-IMPACT", ["SD", "D", "U"]) &&
          isOneOf(answers, "Q-DEEP-CARE-NIGHT", ["arranged"]))
      );
    case "PC-C-LIFE":
      return (
        isOneOf(answers, "Q-LIFE-IDENTITY-PREPARED", ["A", "SA"]) &&
        isOneOf(answers, "Q-LIFE-PARTNER-SUPPORT", ["A", "SA"])
      );
    case "PC-C-BOUNDARY":
      return (
        isOneOf(answers, "Q-WILL-SELF-VS-OTHERS", ["A", "SA"]) &&
        isOneOf(answers, "Q-FAMILY-BOUNDARY-PRESSURE", ["SD", "D", "U"])
      );
    case "PC-E-MEDICAL":
      return (
        isOneOf(answers, "Q-MED-PREGNANCY-CONFIRMED", ["confirmed"]) &&
        isOneOf(answers, "Q-MED-CARE-PLAN", ["booked", "plan_to_book"])
      );
    case "PC-E-SUPPORT":
      return (
        isOneOf(answers, "Q-DEEP-MED-APPOINTMENT-SUPPORT", ["arranged", "partly_arranged"]) ||
        isOneOf(answers, "Q-MH-SAFE-CONTACT", ["A", "SA"])
      );
    case "PC-E-SAFETY":
      return (
        isOneOf(answers, "Q-SAFE-FREE-ANSWER", ["safe"]) &&
        isOneOf(answers, "Q-SAFE-COERCION", ["none"]) &&
        isOneOf(answers, "Q-PARTNER-CONTROL-RISK", ["none"])
      );
    case "PC-E-FINANCE":
      return (
        isOneOf(answers, "Q-FIN-END-BUDGET", ["A", "SA"]) ||
        (isAnswered(answers, "Q-DEEP-FIN-INCOME") && isAnswered(answers, "Q-DEEP-FIN-FIXED-COST"))
      );
    case "PC-E-AFTERCARE":
      return (
        isAnswered(answers, "Q-DEEP-AFTER-END-PLAN") ||
        isOneOf(answers, "Q-DEEP-CARE-RECOVERY", ["arranged", "partly_arranged"])
      );
    case "PC-E-FUTURE":
      return (
        isOneOf(answers, "Q-DEEP-VALUE-FUTURE-FERTILITY", ["clear", "partly_clear"]) ||
        selectedCount(answers, "Q-DEEP-VALUE-REVIEW") >= 2
      );
    default:
      return false;
  }
}

function toPathConditionView(item: { conditionId: string; labelId: string }, answers: Answers): PathConditionView {
  const derivedStatus = hasCondition(item.conditionId, answers) ? "confirmed" : "pending";
  return {
    conditionId: item.conditionId,
    status: derivedStatus,
    derivedStatus,
    readingStatus: derivedStatus,
    labelId: item.labelId,
  };
}

export function buildPathConditionChecklists(config: PathConditionConfig, answers: Answers = {}): {
  continuePath: PathConditionView[];
  endPath: PathConditionView[];
} {
  return {
    continuePath: config.continuePath.map((item) => toPathConditionView(item, answers)),
    endPath: config.endPath.map((item) => toPathConditionView(item, answers)),
  };
}
