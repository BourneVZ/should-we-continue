import type { ReactElement } from "react";
import type { PathConditionView } from "@/domain/types";

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
  onToggleCommitment: _onToggleCommitment,
}: PartnerDiscussionPageProps): ReactElement {
  return (
    <section className="space-y-6">
      <section className="rounded-3xl border border-accentSoft bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">共同讨论议题</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-800">
          {discussionTopicIds.map((topicId) => (
            <li key={topicId}>{topicId}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-accentSoft bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">可讨论承诺</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-800">
          {commitmentCategoryIds.map((commitmentId) => (
            <li key={commitmentId}>
              <span>{commitmentId}</span>
              <span className="ml-2 text-xs text-slate-500">
                {selectedCommitmentIds.includes(commitmentId) ? "selected" : "optional"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-accentSoft bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">已授权路径条件</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-medium text-slate-900">继续妊娠</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-800">
              {sharedPathContinue.map((item) => (
                <li key={item.conditionId}>{item.conditionId}</li>
              ))}
              {sharedPathContinue.length === 0 ? <li>此项由本人自行确认</li> : null}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-medium text-slate-900">终止妊娠</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-800">
              {sharedPathEnd.map((item) => (
                <li key={item.conditionId}>{item.conditionId}</li>
              ))}
              {sharedPathEnd.length === 0 ? <li>此项由本人自行确认</li> : null}
            </ul>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          {Array.from({ length: unsharedPlaceholderCount }, (_, index) => (
            <p key={index}>此项由本人自行确认</p>
          ))}
        </div>
      </section>
    </section>
  );
}
