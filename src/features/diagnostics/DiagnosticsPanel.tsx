import type { ReactElement } from "react";

interface DiagnosticsPanelProps {
  isDev: boolean;
  configAvailable: boolean;
  templateFallbackActive: boolean;
  errorCategory: string | null;
  schemaStatus: "valid" | "invalid";
  secretPreview?: string;
  promptPreview?: string;
  rawModelOutput?: string;
  answerPreview?: string;
}

export function DiagnosticsPanel({
  isDev,
  configAvailable,
  templateFallbackActive,
  errorCategory,
  schemaStatus,
  secretPreview: _secretPreview,
  promptPreview: _promptPreview,
  rawModelOutput: _rawModelOutput,
  answerPreview: _answerPreview,
}: DiagnosticsPanelProps): ReactElement | null {
  if (!isDev) {
    return null;
  }

  return (
    <aside className="rounded-3xl border border-accentSoft bg-white p-6">
      <h2 className="text-lg font-semibold text-ink">开发诊断</h2>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        <li>{configAvailable ? "配置可用" : "配置不可用"}</li>
        <li>{templateFallbackActive ? "模板降级" : "未降级"}</li>
        <li>{errorCategory ?? "no_error"}</li>
        <li>{schemaStatus}</li>
      </ul>
    </aside>
  );
}
