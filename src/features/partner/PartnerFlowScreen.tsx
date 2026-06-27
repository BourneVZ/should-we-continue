import type { ReactElement } from "react";
import type { SharedDiscussionInput } from "@/domain/types";

interface PartnerFlowScreenProps {
  discussionReady: boolean;
  partnerStarted: boolean;
  partnerCompleted: boolean;
  partnerSummaryIds: readonly string[];
  partnerSelectedSummaryIds: readonly string[];
  partnerEditedSummary: string;
  userDiscussionInput: SharedDiscussionInput | null;
  onStart: () => void;
  onPartnerSelectionChange: (summaryId: string) => void;
  onPartnerEditedSummaryChange: (value: string) => void;
  onPartnerShare: () => void;
}

export function PartnerFlowScreen({
  discussionReady,
  partnerStarted,
  partnerCompleted,
  partnerSummaryIds,
  partnerSelectedSummaryIds,
  partnerEditedSummary,
  userDiscussionInput: _userDiscussionInput,
  onStart: _onStart,
  onPartnerSelectionChange: _onPartnerSelectionChange,
  onPartnerEditedSummaryChange,
  onPartnerShare: _onPartnerShare,
}: PartnerFlowScreenProps): ReactElement {
  if (!discussionReady) {
    return (
      <section className="rounded-3xl border border-accentSoft bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">伴侣填写入口未开启</h2>
        <p className="mt-3 text-sm text-slate-700">生成共同讨论页后，才会显示伴侣交接入口。</p>
      </section>
    );
  }

  const shareDisabled = partnerEditedSummary.trim().length === 0;

  return (
    <section className="rounded-3xl border border-accentSoft bg-white p-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">交给伴侣填写</h2>
        <p className="text-sm text-slate-700">伴侣先看自己的摘要，再决定是否主动分享。</p>
      </header>

      <div className="mt-6 rounded-2xl border border-slate-200 px-4 py-4">
        <h3 className="text-sm font-medium text-slate-900">伴侣可分享摘要</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-800">
          {partnerSelectedSummaryIds.map((summaryId) => (
            <li key={summaryId}>{summaryId}</li>
          ))}
          {partnerSelectedSummaryIds.length === 0 ? <li>尚未选择</li> : null}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 px-4 py-4">
        <label className="block text-sm font-medium text-slate-900" htmlFor="partner-summary">
          伴侣摘要
        </label>
        <textarea
          className="mt-3 min-h-24 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
          id="partner-summary"
          onChange={(event) => onPartnerEditedSummaryChange(event.target.value)}
          value={partnerEditedSummary}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500">
        <span>{partnerStarted ? "started" : "not-started"}</span>
        <span>{partnerCompleted ? "completed" : "not-completed"}</span>
        <span>{partnerSummaryIds.length > 0 ? "shared" : "private"}</span>
      </div>

      <button className="mt-6 rounded-full border px-4 py-2 text-sm" disabled={shareDisabled} type="button">
        {shareDisabled ? "disabled" : "分享给共同讨论页"}
      </button>
    </section>
  );
}
