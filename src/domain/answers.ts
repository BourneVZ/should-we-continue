import type { AnswerStatus, AnswerValue } from "@/domain/types";

export interface RequiredAnswerValidation {
  ok: boolean;
  reason?: "required-unanswered";
}

export function getAnswerStatus(answer: AnswerValue | undefined): AnswerStatus {
  return answer?.status ?? "unanswered";
}

export function validateRequiredAnswer(
  answer: AnswerValue | undefined,
  required: boolean,
): RequiredAnswerValidation {
  if (!required) {
    return { ok: true };
  }

  return getAnswerStatus(answer) === "unanswered"
    ? { ok: false, reason: "required-unanswered" }
    : { ok: true };
}

export function isAnswerComputable(answer: AnswerValue | undefined): boolean {
  return getAnswerStatus(answer) === "answered";
}
