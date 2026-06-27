import type { ReactElement } from "react";
import { REGION_CONFIG, REGION_STATIC_FIELDS } from "@/config/region/hangzhou-bingjiang";
import { buildStaticRegionCache } from "@/domain/region";
import type { ReportViewModel } from "@/domain/types";
import { getPathLabel, getReasonLabel } from "./report-copy";

export interface SuggestedQuestionLink {
  answerKey: string;
  label: string;
  moduleLabel: string;
  onSelect: () => void;
}

export interface DeepDiveModuleEntry {
  moduleId: string;
  title: string;
  estimatedQuestions: number;
  purpose: string;
  onSelect: () => void;
}

interface AnalysisPageProps {
  report: ReportViewModel;
  commonFactIds: readonly string[];
  privateNoteSummaryVisible: boolean;
  suggestedQuestionLinks?: readonly SuggestedQuestionLink[];
  deepDiveModules?: readonly DeepDiveModuleEntry[];
}

const REGION_FIELD_LABELS: Readonly<Record<string, string>> = {
  "leave.zj.birth.first": "浙江一孩产假参考天数",
  "leave.cn.miscarriage_under_4_months": "流产假参考天数",
  "benefit.hz.under3_annual": "杭州 3 岁以下婴幼儿养育补助参考",
};

const REGION_VALUE_UNITS: Readonly<Record<string, string>> = {
  "leave.zj.birth.first": "天",
  "leave.cn.miscarriage_under_4_months": "天",
  "benefit.hz.under3_annual": "元/年",
};

function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function getRegionFieldLabel(fieldId: string): string {
  return REGION_FIELD_LABELS[fieldId] ?? "地区参考信息";
}

function getRegionValue(fieldId: string, value: string): string {
  const unit = REGION_VALUE_UNITS[fieldId];
  return unit ? `${value} ${unit}` : value;
}

export function AnalysisPage({
  report,
  commonFactIds,
  privateNoteSummaryVisible,
  suggestedQuestionLinks = [],
  deepDiveModules = [],
}: AnalysisPageProps): ReactElement {
  const derivedFacts = report.dimensions.flatMap((dimension) => dimension.reasonIds);
  const facts = commonFactIds.length > 0 ? commonFactIds : [...new Set(derivedFacts)].slice(0, 6);
  const region =
    report.region.verifiedFields.length > 0
      ? report.region
      : buildStaticRegionCache(REGION_STATIC_FIELDS, getTodayIsoDate(), REGION_CONFIG.cacheTtlDays);

  return (
    <section className="space-y-6">
      <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">本次分析主要基于这些事实</h2>
        {facts.length > 0 ? (
          <ul className="mt-5 space-y-3 text-base leading-8 text-slate-800">
            {facts.map((factId) => (
              <li key={factId} className="rounded-[22px] bg-slate-50 px-5 py-4">
                {getReasonLabel(factId)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 space-y-4">
            <p className="text-base leading-8 text-slate-700">
              当前还没有足够多的已整理事实，继续补全问卷后会更完整。
            </p>
            {suggestedQuestionLinks.length > 0 ? (
              <div className="rounded-[24px] bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">建议先补充这些问题</h3>
                <div className="mt-4 grid gap-3">
                  {suggestedQuestionLinks.map((question) => (
                    <button
                      key={question.answerKey}
                      className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-sky-200 hover:bg-sky-50"
                      type="button"
                      onClick={question.onSelect}
                    >
                      <span className="block text-xs font-semibold text-sky-700">{question.moduleLabel}</span>
                      <span className="mt-1 block text-sm font-medium leading-6 text-slate-900">{question.label}</span>
                      <span className="mt-2 block text-xs font-semibold text-slate-500">补充这个问题</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </section>

      {deepDiveModules.length > 0 ? (
        <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-900">可选深入问卷</h2>
          <p className="mt-3 text-base leading-8 text-slate-700">
            这些模块用于补充更细的行动条件，不会阻塞当前初步报告。你可以任选一个进入，也可以先查看现有结果。
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {deepDiveModules.map((module) => (
              <article key={module.moduleId} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
                <p className="mt-2 text-sm text-slate-600">约 {module.estimatedQuestions} 题</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{module.purpose}</p>
                <button
                  className="mt-4 rounded-full bg-[#14344b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1c415c]"
                  type="button"
                  onClick={module.onSelect}
                >
                  进入这个模块
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">路径条件清单</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[26px] bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">如果继续妊娠，优先补齐这些条件</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              {report.pathContinue.map((item) => (
                <li key={item.conditionId}>{getPathLabel(item)}</li>
              ))}
              {report.pathContinue.length === 0 ? <li>当前暂无已整理的继续妊娠条件。</li> : null}
            </ul>
          </div>
          <div className="rounded-[26px] bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">如果终止妊娠，优先补齐这些条件</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              {report.pathEnd.map((item) => (
                <li key={item.conditionId}>{getPathLabel(item)}</li>
              ))}
              {report.pathEnd.length === 0 ? <li>当前暂无已整理的终止妊娠条件。</li> : null}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">地区信息卡片</h2>
        {region.verifiedFields.length > 0 ? (
          <div className="mt-5 grid gap-4">
            {region.verifiedFields.map((field) => (
              <article key={field.fieldId} className="rounded-[24px] border border-slate-200 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{getRegionFieldLabel(field.fieldId)}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">参考值：{getRegionValue(field.fieldId, field.value)}</p>
                <p className="text-sm leading-7 text-slate-700">核对日期：{field.checkedAt}</p>
                <p className="text-sm leading-7 text-slate-700">适用条件：{field.applicableIf.join(" / ")}</p>
                <a
                  className="mt-3 inline-block text-sm text-sky-700 underline"
                  href={field.sourceUrl}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  查看来源
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-base leading-8 text-slate-700">
            当前没有已验证的地区卡片，说明本地未缓存或尚未刷新成功。
          </p>
        )}
        {region.status === "stale" ? (
          <p className="mt-4 rounded-[20px] bg-amber-50 px-4 py-3 text-sm text-amber-800">
            这部分信息可能已过期，使用前请再核对一次。
          </p>
        ) : null}
      </section>

      {privateNoteSummaryVisible ? (
        <p className="rounded-[20px] bg-sky-50 px-4 py-3 text-sm text-sky-800">
          当前页已显示经你整理后的私密备注摘要。
        </p>
      ) : null}
    </section>
  );
}
