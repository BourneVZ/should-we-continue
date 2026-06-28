import type { ReactElement } from "react";

export interface DeepDiveModuleCard {
  moduleId: string;
  title: string;
  estimatedQuestions: number;
  purpose: string;
  status: "not-started" | "in-progress" | "completed";
}

interface DeepDiveScreenProps {
  recommendations: readonly DeepDiveModuleCard[];
  personaExtra: DeepDiveModuleCard;
  skipConfirmationOpen: boolean;
  onSelectModule: (moduleId: string) => void;
  onRequestSkipAll: () => void;
  onConfirmSkipAll: () => void;
  onContinueToReport: () => void;
}

const STATUS_LABELS: Record<DeepDiveModuleCard["status"], string> = {
  "not-started": "未开始",
  "in-progress": "进行中",
  completed: "已完成",
};

export function DeepDiveScreen({
  recommendations,
  personaExtra,
  skipConfirmationOpen,
  onSelectModule,
  onRequestSkipAll,
  onConfirmSkipAll,
  onContinueToReport,
}: DeepDiveScreenProps): ReactElement {
  const allModules = [...recommendations, personaExtra];
  const completedCount = allModules.filter((module) => module.status === "completed").length;
  const allCompleted = allModules.length > 0 && completedCount === allModules.length;
  const hasCompleted = completedCount > 0;
  const actionLabel = allCompleted ? "进入下一环节" : hasCompleted ? "跳过剩余" : "跳过全部";

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-5 px-6 py-8">
      <section className="rounded-[28px] border border-[#dce7e3] bg-white p-7 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
        <h1 className="text-2xl font-semibold text-ink">可选深入问卷</h1>
        <p className="mt-3 text-base leading-7 text-slate-700">
          这些模块用于补充更细的行动条件，不会阻塞当前初步结果。未完成不参与报告。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {allModules.map((module) => (
          <article
            key={module.moduleId}
            className="relative flex min-h-[190px] flex-col rounded-[24px] border border-accentSoft bg-slate-50 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-ink">{module.title}</h2>
              <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                {STATUS_LABELS[module.status]}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">约 {module.estimatedQuestions} 题</p>
            <p className="mt-4 flex-1 text-sm leading-7 text-slate-700">{module.purpose}</p>
            <button
              type="button"
              className="mt-5 w-fit rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white"
              onClick={() => onSelectModule(module.moduleId)}
            >
              进入这个模块
            </button>
            {module.status === "completed" ? (
              <span className="absolute bottom-5 right-5 text-sm font-semibold text-emerald-700">完成</span>
            ) : null}
          </article>
        ))}
      </section>

      <section className="rounded-[24px] border border-[#dce7e3] bg-white p-5">
        <button
          type="button"
          className="rounded-full border border-ink px-5 py-2 text-sm font-semibold"
          onClick={allCompleted ? onContinueToReport : onRequestSkipAll}
        >
          {actionLabel}
        </button>
        {skipConfirmationOpen ? (
          <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm leading-7 text-amber-950">
              未完成的深入模块不会参与报告；已完成的模块会进入下一环节。确认后将根据当前已完成内容生成最终个人报告。
            </p>
            <button
              type="button"
              className="mt-3 rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={onConfirmSkipAll}
            >
              确认跳过
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
