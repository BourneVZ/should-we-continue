import type { ReactElement } from "react";

interface RiskyAction {
  id: string;
  label: string;
}

interface SaveStatusGateProps {
  status: "idle" | "saving" | "saved" | "error";
  message?: string;
  onRetry: () => void;
  riskyActions: readonly RiskyAction[];
}

export function SaveStatusGate({
  status,
  message,
  onRetry,
  riskyActions,
}: SaveStatusGateProps): ReactElement {
  const isBlocked = status === "error";

  return (
    <section className="rounded-2xl border border-accentSoft bg-white p-4 shadow-sm">
      <div aria-live={isBlocked ? "assertive" : "polite"}>
        {status === "saving" && <p>正在保存</p>}
        {status === "saved" && <p>已保存</p>}
        {status === "error" && (
          <div>
            <p>{message ?? "保存失败"}</p>
            <button type="button" onClick={onRetry}>
              重试保存
            </button>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {riskyActions.map((action) => (
          <button key={action.id} type="button" disabled={isBlocked}>
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
