import type { ReactElement } from "react";
import type { ReportViewModel } from "@/domain/types";
import { AnalysisPage } from "./AnalysisPage";
import { OverviewPage } from "./OverviewPage";
import { PartnerDiscussionPage, type PartnerDiscussionPageProps } from "./PartnerDiscussionPage";
import { SafetyPriorityScreen } from "./SafetyPriorityScreen";

interface ReportShellProps {
  activeTab: "overview" | "analysis" | "partner";
  partnerTabEnabled: boolean;
  report: ReportViewModel;
  partnerDiscussionProps?: PartnerDiscussionPageProps;
}

export function ReportShell({
  activeTab,
  partnerTabEnabled,
  report,
  partnerDiscussionProps,
}: ReportShellProps): ReactElement {
  if (report.redFlag.level === "R3" || report.redFlag.level === "R4") {
    return (
      <SafetyPriorityScreen
        level={report.redFlag.level}
        actionIds={report.redFlag.actionIds}
        onReturn={() => undefined}
        onClearData={() => undefined}
        onContinueSafely={() => undefined}
      />
    );
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8">
      <nav className="flex gap-2">
        <button type="button">概览</button>
        <button type="button">深入分析</button>
        <button disabled={!partnerTabEnabled} type="button">
          伴侣讨论
        </button>
      </nav>
      {activeTab === "overview" ? <OverviewPage partnerPerspectiveAuthorized={false} report={report} /> : null}
      {activeTab === "analysis" ? (
        <AnalysisPage commonFactIds={[]} privateNoteSummaryVisible={false} report={report} />
      ) : null}
      {activeTab === "partner" && partnerTabEnabled && partnerDiscussionProps ? (
        <PartnerDiscussionPage {...partnerDiscussionProps} />
      ) : null}
    </main>
  );
}
