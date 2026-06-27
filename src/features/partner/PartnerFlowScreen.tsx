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
  onStart,
  onPartnerSelectionChange,
  onPartnerEditedSummaryChange,
  onPartnerShare,
}: PartnerFlowScreenProps): ReactElement {
  if (!discussionReady) {
    return (
      <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">伴侣填写入口未开启</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">生成共同讨论页后，才会显示伴侣交接入口。</p>
      </section>
    );
  }

  const shareDisabled = partnerEditedSummary.trim().length === 0;

  return (
    <section className="space-y-6 rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
      <header className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">交给伴侣填写</h2>
        <p className="text-sm leading-7 text-slate-600">
          伴侣只会看到她主动选择共享的摘要内容，不会直接看到原始回答和未授权信息。
        </p>
      </header>

      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1">{partnerStarted ? "已开始" : "未开始"}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">{partnerCompleted ? "已完成" : "未完成"}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">
          {partnerSummaryIds.length > 0 ? "已有共享摘要" : "暂未共享摘要"}
        </span>
      </div>

      <button
        className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        type="button"
        onClick={onStart}
      >
        开始伴侣填写
      </button>

      <div className="rounded-[26px] bg-slate-50 p-6">
        <h3 className="text-lg font-semibold text-slate-900">伴侣可共享摘要</h3>
        <div className="mt-4 space-y-3">
          {partnerSelectedSummaryIds.map((summaryId) => (
            <label
              key={summaryId}
              className="flex cursor-pointer items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              <input checked type="checkbox" onChange={() => onPartnerSelectionChange(summaryId)} />
              {summaryId}
            </label>
          ))}
          {partnerSelectedSummaryIds.length === 0 ? <p className="text-sm text-slate-500">尚未选择</p> : null}
        </div>
      </div>

      <div className="rounded-[26px] bg-slate-50 p-6">
        <label className="block text-lg font-semibold text-slate-900" htmlFor="partner-summary">
          伴侣摘要
        </label>
        <textarea
          className="mt-4 min-h-28 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-900"
          id="partner-summary"
          onChange={(event) => onPartnerEditedSummaryChange(event.target.value)}
          value={partnerEditedSummary}
        />
      </div>

      <button
        className="rounded-full bg-[#14344b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#19415d] disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={shareDisabled}
        type="button"
        onClick={onPartnerShare}
      >
        分享给共同讨论页
      </button>
    </section>
  );
}
