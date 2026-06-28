import type { ReactElement } from "react";
import type { RedFlagLevel } from "@/domain/types";
import { getActionLabel } from "./report-copy";

interface SafetyPriorityScreenProps {
  level: RedFlagLevel;
  actionIds: readonly string[];
  onReturn: () => void;
  onClearData: () => void;
  onContinueSafely: () => void;
}

export function SafetyPriorityScreen({
  level,
  actionIds,
  onReturn,
  onClearData,
  onContinueSafely,
}: SafetyPriorityScreenProps): ReactElement {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fbf2f1_0%,#f8f5ed_55%,#f4efe4_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-[34px] border border-rose-200 bg-white/88 p-8 shadow-[0_20px_60px_rgba(120,43,43,0.08)]">
          <p className="text-sm font-semibold tracking-[0.2em] text-rose-600">优先线下支持</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">请先处理线下安全与支持</h1>
          <p className="mt-4 text-base leading-8 text-slate-700">
            当前结果命中了较高优先级红旗。这个工具不适合继续给出趣味化总结，建议先处理现实安全、医疗或心理支持问题。
          </p>
          <div className="mt-5 inline-flex rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700">
            当前等级：{level}
          </div>
        </section>

        <section className="rounded-[34px] border border-white/80 bg-white/88 p-8 shadow-[0_20px_60px_rgba(31,56,68,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-900">建议先做的事</h2>
          <ul className="mt-5 space-y-3">
            {actionIds.map((actionId) => (
              <li key={actionId} className="rounded-[22px] bg-slate-50 px-5 py-4 text-base leading-8 text-slate-800">
                {getActionLabel(actionId)}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              type="button"
              onClick={onReturn}
            >
              返回首页
            </button>
            <button
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              type="button"
              onClick={onClearData}
            >
              清除本机数据
            </button>
            <button
              className="rounded-full bg-[#14344b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#19415d]"
              type="button"
              onClick={onContinueSafely}
            >
              在安全前提下继续
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
