import type { ReactElement } from "react";

interface DeepDiveModuleCard {
  moduleId: string;
  title: string;
  estimatedQuestions: number;
  purpose: string;
}

interface DeepDiveScreenProps {
  recommendations: readonly DeepDiveModuleCard[];
  personaExtra: DeepDiveModuleCard;
  skipConfirmationOpen: boolean;
  onSelectModule: (moduleId: string) => void;
  onRequestSkipAll: () => void;
  onConfirmSkipAll: () => void;
}

export function DeepDiveScreen({
  recommendations,
  personaExtra,
  skipConfirmationOpen,
  onSelectModule,
  onRequestSkipAll,
  onConfirmSkipAll,
}: DeepDiveScreenProps): ReactElement {
  const allModules = [...recommendations, personaExtra];

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-8">
      <h1 className="text-2xl font-semibold text-ink">深入模块推荐</h1>
      <p className="text-sm text-slate-600">未完成不参与报告。</p>
      {allModules.map((module) => (
        <article key={module.moduleId} className="rounded-2xl border border-accentSoft p-4">
          <h2 className="font-medium text-ink">{module.title}</h2>
          <p className="text-sm text-slate-600">{module.estimatedQuestions} 题</p>
          <p className="text-sm text-slate-700">{module.purpose}</p>
          <button type="button" onClick={() => onSelectModule(module.moduleId)}>
            进入模块
          </button>
        </article>
      ))}
      <button type="button" onClick={onRequestSkipAll}>
        跳过全部
      </button>
      {skipConfirmationOpen ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <p>未完成不参与报告。</p>
          <button type="button" onClick={onConfirmSkipAll}>
            确认跳过
          </button>
        </div>
      ) : null}
    </main>
  );
}
