import type { ReactElement } from "react";
import type { PathConditionView } from "@/domain/types";
import { getCommitmentLabel, getPathLabel, getTopicLabel } from "./report-copy";

export interface PartnerDiscussionPageProps {
  discussionTopicIds: readonly string[];
  commitmentCategoryIds: readonly string[];
  sharedPathContinue: readonly PathConditionView[];
  sharedPathEnd: readonly PathConditionView[];
  unsharedPlaceholderCount: number;
  selectedCommitmentIds: readonly string[];
  onToggleCommitment: (commitmentId: string) => void;
}

export function PartnerDiscussionPage({
  discussionTopicIds,
  commitmentCategoryIds,
  sharedPathContinue,
  sharedPathEnd,
  unsharedPlaceholderCount,
  selectedCommitmentIds,
  onToggleCommitment,
}: PartnerDiscussionPageProps): ReactElement {
  return (
    <section className="space-y-6">
      <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">共同讨论建议</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          这里只展示你已明确授权共享的内容，目的是帮助双方围绕现实安排和支持方式展开讨论。
        </p>
        <ul className="mt-5 space-y-3 text-base leading-8 text-slate-800">
          {discussionTopicIds.map((topicId) => (
            <li key={topicId} className="rounded-[22px] bg-slate-50 px-5 py-4">
              {getTopicLabel(topicId)}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">可以明确下来的支持承诺</h2>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {commitmentCategoryIds.map((commitmentId) => {
            const selected = selectedCommitmentIds.includes(commitmentId);
            return (
              <li key={commitmentId}>
                <button
                  className={`w-full rounded-[22px] border px-5 py-4 text-left text-sm leading-7 transition ${
                    selected
                      ? "border-sky-300 bg-sky-50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  type="button"
                  onClick={() => onToggleCommitment(commitmentId)}
                >
                  <div className="font-medium text-slate-900">{getCommitmentLabel(commitmentId)}</div>
                  <div className="mt-2 text-xs text-slate-500">{selected ? "当前已被选中" : "可作为讨论候选"}</div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">已授权共享的路径条件</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[26px] bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">继续妊娠侧</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              {sharedPathContinue.map((item) => (
                <li key={item.conditionId}>{getPathLabel(item)}</li>
              ))}
              {sharedPathContinue.length === 0 ? <li>此项由本人自行确认。</li> : null}
            </ul>
          </div>
          <div className="rounded-[26px] bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">终止妊娠侧</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              {sharedPathEnd.map((item) => (
                <li key={item.conditionId}>{getPathLabel(item)}</li>
              ))}
              {sharedPathEnd.length === 0 ? <li>此项由本人自行确认。</li> : null}
            </ul>
          </div>
        </div>
        {unsharedPlaceholderCount > 0 ? (
          <div className="mt-5 space-y-2 text-sm text-slate-600">
            {Array.from({ length: unsharedPlaceholderCount }, (_, index) => (
              <p key={index}>此项由本人自行确认。</p>
            ))}
          </div>
        ) : null}
      </section>
    </section>
  );
}
