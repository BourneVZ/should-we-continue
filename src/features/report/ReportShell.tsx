import type { ReactElement } from "react";
import type { ReportViewModel } from "@/domain/types";
import { SharingScreen } from "@/features/sharing/SharingScreen";
import { AnalysisPage, type DeepDiveModuleEntry } from "./AnalysisPage";
import { OverviewPage } from "./OverviewPage";
import { PartnerDiscussionPage, type PartnerDiscussionPageProps } from "./PartnerDiscussionPage";
import { SafetyPriorityScreen } from "./SafetyPriorityScreen";

interface ReportShellProps {
  activeTab: "overview" | "analysis" | "sharing" | "partner";
  partnerTabEnabled: boolean;
  report: ReportViewModel;
  partnerDiscussionProps?: PartnerDiscussionPageProps;
  sharingProps?: {
    selectedSummaryIds: readonly string[];
    sharePathConditions: boolean;
    editedNoteSummary: string;
    requireReauthorization: boolean;
    onSelectionChange: (summaryId: string) => void;
    onSharePathConditionsChange: (nextValue: boolean) => void;
    onEditedNoteSummaryChange: (value: string) => void;
    onConfirm: () => void;
  };
  onOpenOverview?: () => void;
  onOpenAnalysis?: () => void;
  onOpenPartnerDiscussion?: () => void;
  onPreparePartnerDiscussion?: () => void;
  onReturnHome?: () => void;
  onReturnFromSafetyPriority?: () => void;
  onClearData?: () => void;
  onContinueSafely?: () => void;
  deepDiveModules?: readonly DeepDiveModuleEntry[];
}

const TAB_LABELS = {
  overview: "总览",
  analysis: "深入分析",
  partner: "共同讨论",
} as const;

export function ReportShell({
  activeTab,
  partnerTabEnabled,
  report,
  partnerDiscussionProps,
  sharingProps,
  onOpenOverview = () => undefined,
  onOpenAnalysis = () => undefined,
  onOpenPartnerDiscussion = () => undefined,
  onPreparePartnerDiscussion = () => undefined,
  onReturnHome = () => undefined,
  onReturnFromSafetyPriority = () => undefined,
  onClearData = () => undefined,
  onContinueSafely = () => undefined,
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
                  activeTab === "analysis" || activeTab === "sharing"
                    ? "bg-[#14344b] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
            privateNoteSummaryVisible={false}
            report={report}
            deepDiveModules={deepDiveModules}
            onPreparePartnerDiscussion={onPreparePartnerDiscussion}
          />
        ) : null}
        {activeTab === "sharing" && sharingProps ? (
          <SharingScreen
            report={report}
            selectedSummaryIds={sharingProps.selectedSummaryIds}
            sharePathConditions={sharingProps.sharePathConditions}
            editedNoteSummary={sharingProps.editedNoteSummary}
            requireReauthorization={sharingProps.requireReauthorization}
            onSelectionChange={sharingProps.onSelectionChange}
            onSharePathConditionsChange={sharingProps.onSharePathConditionsChange}
            onEditedNoteSummaryChange={sharingProps.onEditedNoteSummaryChange}
            onConfirm={sharingProps.onConfirm}
          />
        ) : null}
        {activeTab === "partner" && partnerTabEnabled && partnerDiscussionProps ? (
          <PartnerDiscussionPage {...partnerDiscussionProps} />
        ) : null}
      </div>
    </main>
  );
}
