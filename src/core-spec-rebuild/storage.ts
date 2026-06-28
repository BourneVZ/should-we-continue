import { createEmptyAnswers } from "./scoring";
import type { QuestionAnswerMap } from "./model";

const STORAGE_KEY = "should-we-continue:core-spec-rebuild:v1";

export interface PersistedQuizState {
  answers: QuestionAnswerMap;
  currentQuestionIndex: number;
  updatedAt: string | null;
}

export interface StorageResult<T> {
  ok: boolean;
  value: T;
  error: string | null;
}

function sanitizeAnswers(input: unknown): QuestionAnswerMap {
  const empty = createEmptyAnswers();

  if (!input || typeof input !== "object") {
    return empty;
  }

  const source = input as Record<string, unknown>;

  return Object.keys(empty).reduce(
    (accumulator, questionId) => {
      const rawValue = source[questionId];
      const isValid = typeof rawValue === "number" && rawValue >= 1 && rawValue <= 5;

      return {
        ...accumulator,
        [questionId]: isValid ? rawValue : null,
      };
    },
    { ...empty },
  );
}

export function loadPersistedQuizState(): StorageResult<PersistedQuizState> {
  const fallback: PersistedQuizState = {
    answers: createEmptyAnswers(),
    currentQuestionIndex: 0,
    updatedAt: null,
  };

  if (typeof window === "undefined") {
    return { ok: true, value: fallback, error: null };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return { ok: true, value: fallback, error: null };
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const answers = sanitizeAnswers(parsed.answers);
    const currentQuestionIndex =
      typeof parsed.currentQuestionIndex === "number" && parsed.currentQuestionIndex >= 0
        ? parsed.currentQuestionIndex
        : 0;
    const updatedAt = typeof parsed.updatedAt === "string" ? parsed.updatedAt : null;

    return {
      ok: true,
      value: {
        answers,
        currentQuestionIndex,
        updatedAt,
      },
      error: null,
    };
  } catch {
    return {
      ok: false,
      value: fallback,
      error: "本机草稿读取失败，已按空白状态启动。",
    };
  }
}

export function savePersistedQuizState(state: PersistedQuizState): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return null;
  } catch {
    return "本机草稿保存失败。当前回答还在本页内存里，但不保证刷新后还在。";
  }
}

export function clearPersistedQuizState(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    return "本机草稿清除失败，请稍后再试。";
  }
}
