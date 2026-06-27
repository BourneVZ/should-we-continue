import type { ReactElement } from "react";
import type { ReportViewModel } from "@/domain/types";
import {
  getActionLabel,
  getDimensionLabel,
  getDimensionLevelLabel,
  getPersonaLabel,
  getRecommendedModuleLabel,
} from "./report-copy";

interface OverviewPageProps {
  report: ReportViewModel;
  partnerPerspectiveAuthorized: boolean;
}

export function OverviewPage({ report, partnerPerspectiveAuthorized }: OverviewPageProps): ReactElement {
  const hasReportContent =
    report.dimensions.length > 0 ||
    report.priorityActionIds.length > 0 ||
    report.pathContinue.length > 0 ||
    report.pathEnd.length > 0;
  const primaryPersonaLabel = getPersonaLabel(report.persona.primaryPersonaId);
  const headline = primaryPersonaLabel
    ? `当前更接近：${primaryPersonaLabel}`
    : hasReportContent
      ? "角色仍在校准中"
      : "仍在校准中";

  return (
    <section className="space-y-6">
      <section className="overflow-hidden rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,#5b97b4,#78b7b0)] px-8 py-8 text-white shadow-[0_24px_80px_rgba(40,78,96,0.16)]">
        <p className="text-sm font-semibold tracking-[0.2em] text-white/75">个人概览</p>
        <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{headline}</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/86">
          这页只帮助你快速看清当前最需要优先处理的支持缺口，不给出去留裁决。重点是先看风险、支持和下一步该补的现实条件。
        </p>
        {partnerPerspectiveAuthorized ? (
          <div className="mt-6 inline-flex rounded-full border border-white/30 bg-white/12 px-4 py-2 text-sm">
            已接入伴侣共同讨论所需的授权内容
          </div>
        ) : null}
      </section>

      {!hasReportContent ? (
        <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
          <h3 className="text-2xl font-semibold text-slate-900">还没有可展示的报告内容</h3>
          <p className="mt-3 text-base leading-8 text-slate-700">
            当前问卷可能还未完成，或报告尚未重新生成。请先回到问卷补齐关键问题，再回来看报告。
          </p>
        </section>
      ) : null}

      {report.dimensions.length > 0 ? (
        <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
          <h3 className="text-2xl font-semibold text-slate-900">九维总览</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {report.dimensions.map((dimension) => (
              <article key={dimension.dimensionId} className="rounded-[24px] bg-slate-50 p-5">
                <h4 className="text-lg font-semibold text-slate-900">{getDimensionLabel(dimension.dimensionId)}</h4>
                <p className="mt-2 text-sm font-medium text-sky-700">
                  {getDimensionLevelLabel(dimension.displayLevel)}
                  {dimension.certaintyLevel === "low" ? " · 仍需确认" : null}
                </p>
                {dimension.recommendedModuleId ? (
                  <p className="mt-3 text-sm font-medium text-amber-800">
                    建议补充：{getRecommendedModuleLabel(dimension.recommendedModuleId)}
                  </p>
                ) : null}
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {dimension.reasonIds.length > 0
                    ? `当前结论基于 ${dimension.reasonIds.length} 条相关回答。`
                    : "当前结论仍需要更多作答来校准。"}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
        <h3 className="text-2xl font-semibold text-slate-900">优先行动</h3>
        {report.priorityActionIds.length > 0 ? (
          <ul className="mt-5 space-y-4">
            {report.priorityActionIds.slice(0, 4).map((actionId) => (
              <li key={actionId} className="rounded-[24px] bg-slate-50 px-5 py-4 text-base leading-8 text-slate-800">
                {getActionLabel(actionId)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-base leading-8 text-slate-700">
            当前没有额外的优先行动提醒，说明高优先级风险暂未触发。
          </p>
        )}
      </section>

      {report.persona.primaryPersonaId === null ? (
        <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
          <h3 className="text-2xl font-semibold text-slate-900">角色仍在校准中</h3>
          <p className="mt-3 text-base leading-8 text-slate-700">
            完成互动风格校准的 12 道题后，报告会显示主/次角色。未完成前不会把空角色当作已完成报告。
          </p>
        </section>
      ) : null}
    </section>
  );
}
