import type { ReactElement } from "react";
import { REGION_CONFIG, REGION_STATIC_FIELDS } from "@/config/region/hangzhou-bingjiang";
import { buildStaticRegionCache } from "@/domain/region";
import type { ReportViewModel } from "@/domain/types";
import { getPathLabel } from "./report-copy";

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
  status?: "not-started" | "in-progress" | "completed";
  onSelect: () => void;
}

interface AnalysisPageProps {
  report: ReportViewModel;
  privateNoteSummaryVisible: boolean;
  deepDiveModules?: readonly DeepDiveModuleEntry[];
  onPreparePartnerDiscussion?: () => void;
}

const REGION_FIELD_LABELS: Readonly<Record<string, string>> = {
  "leave.zj.birth.first": "浙江生育假参考",
  "leave.cn.miscarriage_under_4_months": "流产休假参考",
  "benefit.hz.under3_annual": "杭州 3 岁以下育儿补贴",
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
  return REGION_FIELD_LABELS[fieldId] ?? "地区信息参考";
}

function getRegionValue(fieldId: string, value: string): string {
  const unit = REGION_VALUE_UNITS[fieldId];
  return unit ? `${value} ${unit}` : value;
}

export function AnalysisPage({
  report,
  privateNoteSummaryVisible,
  deepDiveModules = [],
  onPreparePartnerDiscussion = () => undefined,
}: AnalysisPageProps): ReactElement {
  const openDeepDiveModules = deepDiveModules.filter((module) => module.status !== "completed");
  const lowOrInsufficientDimensions = report.dimensions.filter(
    (dimension) => dimension.displayLevel === "low" || dimension.displayLevel === "insufficient",
  );
  const pendingPathCount = [...report.pathContinue, ...report.pathEnd].filter(
    (condition) => condition.status === "pending",
  ).length;
  const region =
    report.region.verifiedFields.length > 0
      ? report.region
      : buildStaticRegionCache(REGION_STATIC_FIELDS, getTodayIsoDate(), REGION_CONFIG.cacheTtlDays);

  return (
    <section className="space-y-6">
      <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">综合分析</h2>
        <p className="mt-4 text-base leading-8 text-slate-700">
          这一页把当前结果整理成支持维度、仍待澄清的问题，以及两条路径上还没有确认完成的现实条件。
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">已覆盖维度</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{report.dimensions.length}</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">优先缺口</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{lowOrInsufficientDimensions.length}</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-500">待确认路径条件</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{pendingPathCount}</p>
          </div>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={onPreparePartnerDiscussion}
          >
            准备共同讨论页
          </button>
        </div>
      </section>

      {openDeepDiveModules.length > 0 ? (
        <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-900">可补充的深入模块</h2>
          <p className="mt-3 text-base leading-8 text-slate-700">这些模块可以补充细节，但不会阻塞当前报告。</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {openDeepDiveModules.map((module) => (
              <article key={module.moduleId} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
                <p className="mt-2 text-sm text-slate-600">约 {module.estimatedQuestions} 题</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{module.purpose}</p>
                <button
                  className="mt-4 rounded-full bg-[#14344b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1c415c]"
                  type="button"
                  onClick={module.onSelect}
                >
                  打开模块
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
            <h3 className="text-lg font-semibold text-slate-900">如果继续妊娠</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              {report.pathContinue.map((item) => (
                <li key={item.conditionId}>{getPathLabel(item)}</li>
              ))}
              {report.pathContinue.length === 0 ? <li>当前没有待确认的继续妊娠路径条件。</li> : null}
            </ul>
          </div>
          <div className="rounded-[26px] bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">如果终止妊娠</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              {report.pathEnd.map((item) => (
                <li key={item.conditionId}>{getPathLabel(item)}</li>
              ))}
              {report.pathEnd.length === 0 ? <li>当前没有待确认的终止妊娠路径条件。</li> : null}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">地区参考卡片</h2>
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
          <p className="mt-4 text-base leading-8 text-slate-700">暂时没有可展示的已核验地区卡片。</p>
        )}
        {region.status === "stale" ? (
          <p className="mt-4 rounded-[20px] bg-amber-50 px-4 py-3 text-sm text-amber-800">
            该地区信息可能已过期，使用前请重新核对。
          </p>
        ) : null}
      </section>

      {privateNoteSummaryVisible ? (
        <p className="rounded-[20px] bg-sky-50 px-4 py-3 text-sm text-sky-800">当前页面正在展示处理后的私人备注摘要。</p>
      ) : null}
    </section>
  );
}
