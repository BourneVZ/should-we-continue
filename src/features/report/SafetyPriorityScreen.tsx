import type { ReactElement } from "react";
import type { RedFlagLevel } from "@/domain/types";

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
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-semibold text-ink">线下支持优先</h1>
      <p className="text-sm text-slate-700">当前等级：{level}</p>
      <ul className="list-disc pl-6">
        {actionIds.map((actionId) => (
          <li key={actionId}>{actionId}</li>
        ))}
      </ul>
      <div className="flex gap-3">
        <button type="button" onClick={onReturn}>
          返回
        </button>
        <button type="button" onClick={onClearData}>
          清除本机数据
        </button>
        <button type="button" onClick={onContinueSafely}>
          安全继续
        </button>
      </div>
    </main>
  );
}
