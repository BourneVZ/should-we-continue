import type { ReactElement } from "react";
import type { ReportViewModel } from "@/domain/types";
import { AnalysisPage, type DeepDiveModuleEntry, type SuggestedQuestionLink } from "./AnalysisPage";
import { OverviewPage } from "./OverviewPage";
import { PartnerDiscussionPage, type PartnerDiscussionPageProps } from "./PartnerDiscussionPage";
import { SafetyPriorityScreen } from "./SafetyPriorityScreen";

interface ReportShellProps {
  activeTab: "overview" | "analysis" | "partner";
  partnerTabEnabled: boolean;
  report: ReportViewModel;
  partnerDiscussionProps?: PartnerDiscussionPageProps;
  onOpenOverview?: () => void;
  onOpenAnalysis?: () => void;
  onOpenPartnerDiscussion?: () => void;
  onReturnHome?: () => void;
  onReturnFromSafetyPriority?: () => void;
  onClearData?: () => void;
  onContinueSafely?: () => void;
  suggestedQuestionLinks?: readonly SuggestedQuestionLink[];
  deepDiveModules?: readonly DeepDiveModuleEntry[];
}

const TAB_LABELS = {
  overview: "概览",
  analysis: "深入分析",
  partner: "伴侣讨论",
} as const;

export function ReportShell({
  activeTab,
  partnerTabEnabled,
  report,
  partnerDiscussionProps,
  onOpenOverview = () => undefined,
  onOpenAnalysis = () => undefined,
  onOpenPartnerDiscussion = () => undefined,
  onReturnHome = () => undefined,
  onReturnFromSafetyPriority = () => undefined,
  onClearData = () => undefined,
  onContinueSafely = () => undefined,
  suggestedQuestionLinks = [],
  deepDiveModules = [],
}: ReportShellProps): ReactElement {
  if (report.redFlag.level === "R3" || report.redFlag.level === "R4") {
    return (
      <SafetyPriorityScreen
        level={report.redFlag.level}
        actionIds={report.redFlag.actionIds}
        onReturn={onReturnFromSafetyPriority}
        onClearData={onClearData}
        onContinueSafely={onContinueSafely}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#edf7f6_0%,#f7f4ec_40%,#f3eee4_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[34px] border border-white/80 bg-white/80 p-4 shadow-[0_20px_60px_rgba(31,56,68,0.08)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex flex-wrap gap-3">
            <button
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                activeTab === "overview" ? "bg-[#14344b] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              type="button"
              onClick={onOpenOverview}
            >
              {TAB_LABELS.overview}
            </button>
            <button
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                activeTab === "analysis" ? "bg-[#14344b] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              type="button"
              onClick={onOpenAnalysis}
            >
              {TAB_LABELS.analysis}
            </button>
            <button
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                activeTab === "partner" ? "bg-[#14344b] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              } disabled:cursor-not-allowed disabled:opacity-50`}
              disabled={!partnerTabEnabled}
              type="button"
              onClick={onOpenPartnerDiscussion}
            >
              {TAB_LABELS.partner}
            </button>
          </nav>
            <button
              className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              type="button"
              onClick={onReturnHome}
            >
              返回首页
            </button>
          </div>
        </section>

        {activeTab === "overview" ? <OverviewPage partnerPerspectiveAuthorized={false} report={report} /> : null}
        {activeTab === "analysis" ? (
          <AnalysisPage
            commonFactIds={[]}
            privateNoteSummaryVisible={false}
            report={report}
            suggestedQuestionLinks={suggestedQuestionLinks}
            deepDiveModules={deepDiveModules}
          />
        ) : null}
        {activeTab === "partner" && partnerTabEnabled && partnerDiscussionProps ? (
          <PartnerDiscussionPage {...partnerDiscussionProps} />
        ) : null}
      </div>
    </main>
  );
}
