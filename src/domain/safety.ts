import type { SafetyRule } from "@/config/scoring/safety";
import type { AnswerValue, RedFlagResult, RedFlagLevel } from "@/domain/types";
import { getAnswerStatus } from "./answers";

type AnsweredValue = Extract<AnswerValue, { status: "answered" }>["value"];

const LEVEL_RANK: Record<RedFlagLevel, number> = {
  none: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
};

function getAnsweredValue(answers: Record<string, AnswerValue>, answerKey: string): string | null {
  const answer = answers[answerKey];
  if (answer?.status !== "answered") {
    return null;
  }
  return String(answer.value as AnsweredValue);
}

function evaluateAtomicCondition(condition: string, answers: Record<string, AnswerValue>): boolean {
  const inMatch = condition.match(/^(.+?) in \{(.+)\}$/);
  if (inMatch) {
    const values = inMatch[2].split(",").map((value) => value.trim());
    const answeredValue = getAnsweredValue(answers, inMatch[1].trim());
    return answeredValue !== null && values.includes(answeredValue);
  }

  const equalsMatch = condition.match(/^(.+?)=(.+)$/);
  if (equalsMatch) {
    const answeredValue = getAnsweredValue(answers, equalsMatch[1].trim());
    return answeredValue !== null && answeredValue === equalsMatch[2].trim();
  }

  return false;
}

function evaluateCondition(condition: string, answers: Record<string, AnswerValue>): boolean {
  if (condition.includes(" || ")) {
    return condition.split(" || ").some((part) => evaluateCondition(part, answers));
  }
  if (condition.includes(" && ")) {
    return condition.split(" && ").every((part) => evaluateCondition(part, answers));
  }
  return evaluateAtomicCondition(condition.trim(), answers);
}

export function evaluateSafety(
  answers: Record<string, AnswerValue>,
  rules: readonly SafetyRule[],
): RedFlagResult {
  let highestLevel: RedFlagLevel = "none";
  let matchedRules: SafetyRule[] = [];

  for (const rule of rules) {
    const matched = rule.when.every((condition) => evaluateCondition(condition, answers));
    if (!matched) {
      continue;
    }

    if (LEVEL_RANK[rule.level] > LEVEL_RANK[highestLevel]) {
      highestLevel = rule.level;
      matchedRules = [rule];
      continue;
    }

    if (rule.level === highestLevel) {
      matchedRules.push(rule);
    }
  }

  const suppress = highestLevel === "R3" || highestLevel === "R4";

  return {
    level: highestLevel,
    ruleIds: matchedRules.map((rule) => rule.ruleId),
    actionIds: [...new Set(matchedRules.map((rule) => rule.actionId))],
    personaSuppressedReason: suppress ? "offline-support-first" : null,
    sharingBlockedReason: suppress ? "safety-priority" : null,
  };
}
