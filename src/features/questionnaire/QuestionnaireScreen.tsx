import type { ReactElement } from "react";
import type { AnswerValue, QuestionMeta } from "@/domain/types";
import { QuestionRenderer } from "./QuestionRenderer";

interface QuestionnaireScreenProps {
  title: string;
  questions: readonly QuestionMeta[];
  answers?: Partial<Record<string, AnswerValue>>;
  progressLabel: string;
  pageRangeLabel: string;
  safetyBanner?: string;
  saveStatus: "idle" | "saving" | "saved" | "error";
  onAnswerChange: (answerKey: string, value: AnswerValue) => void;
  onNext: () => void;
  onBack: () => void;
}

function getSaveStatusLabel(saveStatus: QuestionnaireScreenProps["saveStatus"]): string {
  switch (saveStatus) {
    case "saving":
      return "正在保存到本地";
    case "saved":
      return "已保存到本地";
    case "error":
      return "保存失败，当前页面已锁定风险操作";
    default:
      return "本页回答会自动保存到当前浏览器";
  }
}

export function QuestionnaireScreen({
  title,
  questions,
  answers,
  progressLabel,
  pageRangeLabel,
  safetyBanner,
  saveStatus,
  onAnswerChange,
  onNext,
  onBack,
}: QuestionnaireScreenProps): ReactElement {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ecf7f6_0%,#f8f5ed_45%,#f5efe4_100%)] px-4 py-5 text-slate-900 md:px-8 md:py-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4 flex items-center justify-between gap-3">
          <button
            className="rounded-full border border-white/80 bg-white/85 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
            type="button"
            onClick={onBack}
          >
            返回上一题
          </button>
          <div className="rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur">
            {getSaveStatusLabel(saveStatus)}
          </div>
        </header>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/80 shadow-inner">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#7ab1b7,#f2c569)] transition-all"
              style={{
                width:
                  questions.length === 0
                    ? "0%"
                    : `${Math.min(
                        100,
                        Math.max(
                          8,
                          (Number(pageRangeLabel.match(/\d+/)?.[0] ?? 1) /
                            Number(pageRangeLabel.match(/共\s*(\d+)/)?.[1] ?? 1)) *
                            100,
                        ),
                      )}%`,
              }}
            />
          </div>
          <span className="min-w-fit text-sm font-semibold text-slate-600 md:text-base">{progressLabel}</span>
        </div>

        <section className="overflow-hidden rounded-[34px] border border-[#dce7e3] bg-white/80 p-4 shadow-[0_24px_70px_rgba(31,56,68,0.08)] backdrop-blur md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex rounded-full bg-[#edf5ef] px-3.5 py-1.5 text-sm font-semibold text-[#4d6f57]">
                {pageRangeLabel}
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-[2rem]">{title}</h1>
            </div>
            {safetyBanner ? (
              <p className="max-w-xl rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                {safetyBanner}
              </p>
            ) : null}
          </div>

          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionRenderer
                key={question.id}
                question={question}
                value={answers?.[question.answerKey] ?? { status: "unanswered" }}
                onChange={(value) => onAnswerChange(question.answerKey, value)}
              />
            ))}
          </div>

          <footer className="mt-5 flex items-center justify-between gap-4">
            <p className="text-sm leading-6 text-slate-600">
              {saveStatus === "error"
                ? "请先处理保存问题，再继续下一题。"
                : "系统只在本机保存，不会自动把你的回答共享给他人。"}
            </p>
            <button
              className="rounded-full bg-[#122c3f] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(18,44,63,0.18)] transition hover:-translate-y-0.5 hover:bg-[#17364d] disabled:cursor-not-allowed disabled:bg-slate-300"
              type="button"
              disabled={saveStatus === "error"}
              onClick={onNext}
            >
              下一题
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
}
