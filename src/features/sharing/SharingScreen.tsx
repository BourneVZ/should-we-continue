import type { ReactElement } from "react";
import { SHARE_CATEGORY_IDS } from "@/config/report/content";
import type { ReportViewModel } from "@/domain/types";

interface SharingScreenProps {
  report: ReportViewModel;
  selectedSummaryIds: readonly string[];
  sharePathConditions: boolean;
  editedNoteSummary: string;
  requireReauthorization: boolean;
  rawNotePreview?: string;
  onSelectionChange: (summaryId: string) => void;
  onSharePathConditionsChange: (nextValue: boolean) => void;
  onEditedNoteSummaryChange: (value: string) => void;
  onConfirm: () => void;
}

export function SharingScreen({
  report,
  selectedSummaryIds,
  sharePathConditions,
  editedNoteSummary,
  requireReauthorization,
  rawNotePreview: _rawNotePreview,
  onSelectionChange: _onSelectionChange,
  onSharePathConditionsChange: _onSharePathConditionsChange,
  onEditedNoteSummaryChange,
  onConfirm: _onConfirm,
}: SharingScreenProps): ReactElement {
  if (report.redFlag.level === "R3" || report.redFlag.level === "R4") {
    return (
      <section className="rounded-3xl border border-danger/20 bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">共享已禁用</h2>
        <p className="mt-3 text-sm text-slate-700">当前风险等级下不生成共同讨论材料。</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {report.redFlag.actionIds.map((actionId) => (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700" key={actionId}>
              {actionId}
            </span>
          ))}
        </div>
        <button className="mt-6 rounded-full border px-4 py-2 text-sm" disabled type="button">
          disabled
        </button>
      </section>
    );
  }

  const editedSummarySelected = selectedSummaryIds.includes("edited_note_summary");
  const confirmDisabled = editedSummarySelected && editedNoteSummary.trim().length === 0;

  return (
    <section className="rounded-3xl border border-accentSoft bg-white p-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">分享授权</h2>
        <p className="text-sm text-slate-700">每项都需要主动选择，未选即不共享。</p>
        {requireReauthorization ? <p className="text-sm text-slate-700">重新授权</p> : null}
      </header>

      <ul className="mt-6 grid gap-3">
        {SHARE_CATEGORY_IDS.filter((summaryId) => summaryId !== "path_conditions").map((summaryId) => (
          <li className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800" key={summaryId}>
            <div className="font-medium">{summaryId}</div>
            <div className="mt-1 text-xs text-slate-500">
              {selectedSummaryIds.includes(summaryId) ? "selected" : "not-selected"}
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-6 rounded-2xl border border-slate-200 px-4 py-4">
        <div className="font-medium text-slate-900">path_conditions</div>
        <p className="mt-1 text-sm text-slate-700">路径条件需要独立授权，不会直接复制原始回答。</p>
        <p className="mt-2 text-xs text-slate-500">{sharePathConditions ? "authorized" : "not-authorized"}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 px-4 py-4">
        <label className="block text-sm font-medium text-slate-900" htmlFor="edited-note-summary">
          编辑摘要
        </label>
        <p className="mt-1 text-sm text-slate-700">总体备注必须先整理成独立摘要。</p>
        <textarea
          className="mt-3 min-h-24 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
          id="edited-note-summary"
          onChange={(event) => onEditedNoteSummaryChange(event.target.value)}
          value={editedNoteSummary}
        />
      </section>

      <button className="mt-6 rounded-full border px-4 py-2 text-sm" disabled={confirmDisabled} type="button">
        {confirmDisabled ? "disabled" : "确认分享"}
      </button>
    </section>
  );
}
