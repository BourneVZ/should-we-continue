import { getAnswerStatus } from "@/domain/answers";
import type { AnswerValue, QuestionMeta } from "@/domain/types";

type AnsweredValue = Extract<AnswerValue, { status: "answered" }>["value"];

export interface QuestionnaireSnapshotInput {
  questions: readonly QuestionMeta[];
  answers: Record<string, AnswerValue>;
  moduleId: string;
}

export interface QuestionnaireSnapshot {
  visibleQuestions: readonly QuestionMeta[];
  pages: readonly (readonly QuestionMeta[])[];
  answeredCount: number;
  totalVisibleCount: number;
}

export interface QuestionPageValidationResult {
  ok: boolean;
  missingAnswerKeys: string[];
}

function getAnsweredValue(answers: Record<string, AnswerValue>, answerKey: string): string | null {
  const answer = answers[answerKey];
  if (answer?.status !== "answered") {
    return null;
  }
  return String(answer.value as AnsweredValue);
}

function matchesVisibleWhen(condition: string, answers: Record<string, AnswerValue>): boolean {
  const inMatch = condition.match(/^(.+?) in \{(.+)\}$/);
  if (inMatch) {
    const answerKey = inMatch[1].trim();
    const acceptedValues = inMatch[2].split(",").map((value) => value.trim());
    const value = getAnsweredValue(answers, answerKey);
    return value !== null && acceptedValues.includes(value);
  }

  const notEqualsMatch = condition.match(/^(.+?)!=(.+)$/);
  if (notEqualsMatch) {
    const answerKey = notEqualsMatch[1].trim();
    const expectedValue = notEqualsMatch[2].trim();
    const value = getAnsweredValue(answers, answerKey);
    return value !== null && value !== expectedValue;
  }

  const equalsMatch = condition.match(/^(.+?)=(.+)$/);
  if (equalsMatch) {
    const answerKey = equalsMatch[1].trim();
    const expectedValue = equalsMatch[2].trim();
    const value = getAnsweredValue(answers, answerKey);
    return value !== null && value === expectedValue;
  }

  return false;
}

function isVisible(question: QuestionMeta, answers: Record<string, AnswerValue>): boolean {
  return (question.visibleWhen ?? []).every((condition) => matchesVisibleWhen(condition, answers));
}

function chunkQuestions(questions: readonly QuestionMeta[], pageSize: number): QuestionMeta[][] {
  const pages: QuestionMeta[][] = [];
  for (let index = 0; index < questions.length; index += pageSize) {
    pages.push([...questions.slice(index, index + pageSize)]);
  }
  return pages;
}

export function getQuestionnaireSnapshot(input: QuestionnaireSnapshotInput): QuestionnaireSnapshot {
  const moduleQuestions = input.questions.filter((question) => question.moduleId === input.moduleId);
  const visibleQuestions = moduleQuestions.filter((question) => isVisible(question, input.answers));
  const pages = chunkQuestions(visibleQuestions, 1);
  const answeredCount = visibleQuestions.filter(
    (question) => getAnswerStatus(input.answers[question.answerKey]) !== "unanswered",
  ).length;

  return {
    visibleQuestions,
    pages,
    answeredCount,
    totalVisibleCount: visibleQuestions.length,
  };
}

export function validateQuestionPage(
  questions: readonly QuestionMeta[],
  answers: Record<string, AnswerValue>,
): QuestionPageValidationResult {
  const missingAnswerKeys = questions
    .filter((question) => question.required && getAnswerStatus(answers[question.answerKey]) === "unanswered")
    .map((question) => question.answerKey);

  return {
    ok: missingAnswerKeys.length === 0,
    missingAnswerKeys,
  };
}

export function isDeepDiveModuleComplete(input: QuestionnaireSnapshotInput): boolean {
  const snapshot = getQuestionnaireSnapshot(input);
  const completionQuestions = snapshot.visibleQuestions.filter(
    (question) => question.required || question.questionType !== "freeText",
  );
  const hasAnyAnswer = snapshot.visibleQuestions.some(
    (question) => getAnswerStatus(input.answers[question.answerKey]) !== "unanswered",
  );

  return (
    hasAnyAnswer &&
    completionQuestions.every(
      (question) => getAnswerStatus(input.answers[question.answerKey]) !== "unanswered",
    )
  );
}
