import type { ReactElement } from "react";
import { SHARE_CATEGORY_IDS } from "@/config/report/content";
import type { ReportViewModel } from "@/domain/types";
import { getActionLabel } from "@/features/report/report-copy";

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

const SUMMARY_LABELS: Readonly<Record<string, string>> = {
  medical_summary: "医学状态摘要",
  emotional_summary: "情绪状态摘要",
  life_summary: "人生节奏摘要",
  financial_summary: "经济现实摘要",
  partner_needs: "希望伴侣如何支持",
  family_boundary_summary: "家庭边界摘要",
  childcare_summary: "照料安排摘要",
  values_summary: "价值排序摘要",
  path_conditions: "路径条件",
  edited_note_summary: "可共享备注摘要",
};

function getSummaryLabel(summaryId: string): string {
  return SUMMARY_LABELS[summaryId] ?? summaryId;
}

export function SharingScreen({
  report,
  selectedSummaryIds,
  sharePathConditions,
  editedNoteSummary,
  requireReauthorization,
  rawNotePreview: _rawNotePreview,
  onSelectionChange,
  onSharePathConditionsChange,
  onEditedNoteSummaryChange,
  onConfirm,
}: SharingScreenProps): ReactElement {
  if (report.redFlag.level === "R3" || report.redFlag.level === "R4") {
    return (
      <section className="rounded-3xl border border-danger/20 bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">当前不可共享</h2>
        <p className="mt-3 text-sm text-slate-700">当前安全等级下，共同讨论与共享功能已被关闭。</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {report.redFlag.actionIds.map((actionId) => (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700" key={actionId}>
              {getActionLabel(actionId)}
            </span>
          ))}
        </div>
        <button className="mt-6 rounded-full border px-4 py-2 text-sm" disabled type="button">
          已禁用
        </button>
      </section>
    );
  }

  const editedSummarySelected = selectedSummaryIds.includes("edited_note_summary");
  const confirmDisabled = editedSummarySelected && editedNoteSummary.trim().length === 0;

  return (
    <section className="rounded-3xl border border-accentSoft bg-white p-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">共享授权</h2>
        <p className="text-sm text-slate-700">每一项都需要你主动勾选授权；未勾选的内容默认保持私密。</p>
        {requireReauthorization ? (
          <p className="text-sm text-slate-700">报告内容有更新，需要重新确认这次共享授权。</p>
        ) : null}
      </header>

      <ul className="mt-6 grid gap-3">
        {SHARE_CATEGORY_IDS.filter((summaryId) => summaryId !== "path_conditions").map((summaryId) => (
          <li className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800" key={summaryId}>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                checked={selectedSummaryIds.includes(summaryId)}
                type="checkbox"
                onChange={() => onSelectionChange(summaryId)}
              />
              <span>
                <span className="block font-medium">{getSummaryLabel(summaryId)}</span>
                <span className="mt-1 block text-xs text-slate-500">
                  {selectedSummaryIds.includes(summaryId) ? "已授权" : "未授权"}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>

      <section className="mt-6 rounded-2xl border border-slate-200 px-4 py-4">
        <div className="font-medium text-slate-900">{getSummaryLabel("path_conditions")}</div>
        <p className="mt-1 text-sm text-slate-700">路径条件需要单独授权共享，且不会直接暴露你的原始回答。</p>
        <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-slate-800">
          <input
            checked={sharePathConditions}
            type="checkbox"
            onChange={(event) => onSharePathConditionsChange(event.target.checked)}
          />
          <span>{sharePathConditions ? "已授权共享" : "未授权"}</span>
        </label>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 px-4 py-4">
        <label className="block text-sm font-medium text-slate-900" htmlFor="edited-note-summary">
          可共享摘要
        </label>
        <p className="mt-1 text-sm text-slate-700">请先把私人备注改写成单独摘要后再共享；原始备注不会自动带入。</p>
        <textarea
          className="mt-3 min-h-24 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
          id="edited-note-summary"
          onChange={(event) => onEditedNoteSummaryChange(event.target.value)}
          value={editedNoteSummary}
        />
      </section>

      <button
        className="mt-6 rounded-full border px-4 py-2 text-sm"
        disabled={confirmDisabled}
        type="button"
        onClick={onConfirm}
      >
        {confirmDisabled ? "请先填写可共享摘要" : "确认共享"}
      </button>
    </section>
  );
}
