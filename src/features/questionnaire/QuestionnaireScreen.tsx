import type { ReactElement } from "react";
import type { QuestionMeta } from "@/domain/types";
import { QuestionRenderer } from "./QuestionRenderer";

interface QuestionnaireScreenProps {
  title: string;
  questions: readonly QuestionMeta[];
  progressLabel: string;
  pageRangeLabel: string;
  safetyBanner?: string;
  saveStatus: "idle" | "saving" | "saved" | "error";
  onAnswerChange: (answerKey: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function QuestionnaireScreen({
  title,
  questions,
  progressLabel,
  pageRangeLabel,
  safetyBanner,
  saveStatus,
  onAnswerChange,
  onNext,
  onBack,
}: QuestionnaireScreenProps): ReactElement {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {safetyBanner ? <p className="mt-2 text-sm text-rose-700">{safetyBanner}</p> : null}
        <p className="mt-2 text-sm text-slate-600">{progressLabel}</p>
        <p className="text-sm text-slate-600">{pageRangeLabel}</p>
      </header>
      {questions.map((question) => (
        <QuestionRenderer
          key={question.id}
          question={question}
          value={{ status: "unanswered" }}
          onChange={() => onAnswerChange(question.answerKey)}
        />
      ))}
      <footer className="flex gap-3">
        <button type="button" onClick={onBack}>
          返回修改
        </button>
        <button type="button" disabled={saveStatus === "error"}>
          稍后继续
        </button>
        <button type="button" onClick={onNext}>
          下一步
        </button>
      </footer>
    </main>
  );
}
