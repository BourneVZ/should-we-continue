import type { ReactElement, ReactNode } from "react";
import { SaveStatusGate } from "@/components/SaveStatusGate";
import type { AppState } from "@/app/app-reducer";
import { HomeScreen } from "@/features/home/HomeScreen";
import { ReportShell } from "@/features/report/ReportShell";
import type { DeepDiveModuleEntry, SuggestedQuestionLink } from "@/features/report/AnalysisPage";
import { SafetyPriorityScreen } from "@/features/report/SafetyPriorityScreen";
import type { ReportViewModel } from "@/domain/types";
import type { AppServices, AppDiagnostics } from "./services";

interface AppProps {
  state: AppState;
  report: ReportViewModel;
  services: AppServices<unknown, unknown, unknown, AppDiagnostics>;
  diagnosticsPanel?: ReactNode;
  activeReportTab?: "overview" | "analysis" | "partner";
  onCompleteSafetyCheck: () => void;
  onStartOrResume: () => void;
  onOpenLatestReport: () => void;
  onClearData: () => void;
  onReturnFromSafetyPriority: () => void;
  onContinueSafely: () => void;
  onOpenOverview: () => void;
  onOpenAnalysis: () => void;
  onOpenPartnerDiscussion: () => void;
  onReturnHome?: () => void;
  suggestedQuestionLinks?: readonly SuggestedQuestionLink[];
  deepDiveModules?: readonly DeepDiveModuleEntry[];
}

function renderRoute(
  state: AppState,
  report: ReportViewModel,
  handlers: Pick<
    AppProps,
    | "onCompleteSafetyCheck"
    | "activeReportTab"
    | "onStartOrResume"
    | "onOpenLatestReport"
    | "onClearData"
    | "onReturnFromSafetyPriority"
    | "onContinueSafely"
    | "onOpenOverview"
    | "onOpenAnalysis"
    | "onOpenPartnerDiscussion"
    | "onReturnHome"
    | "suggestedQuestionLinks"
    | "deepDiveModules"
  >,
): ReactElement {
  if (state.route === "home") {
    return (
      <HomeScreen
        hasExistingData={state.hasExistingReport}
        reportStatus={state.reportStatus}
        onStartOrResume={handlers.onStartOrResume}
        onOpenLatestReport={handlers.onOpenLatestReport}
        onClearData={handlers.onClearData}
      />
    );
  }

  if (state.route === "safety-priority") {
    return (
      <SafetyPriorityScreen
        level={report.redFlag.level}
        actionIds={report.redFlag.actionIds}
        onReturn={handlers.onReturnFromSafetyPriority}
        onClearData={handlers.onClearData}
        onContinueSafely={handlers.onContinueSafely}
      />
    );
  }

  return (
    <ReportShell
      activeTab={handlers.activeReportTab ?? "overview"}
      partnerTabEnabled={state.canOpenPartnerDiscussion}
      report={report}
      onOpenOverview={handlers.onOpenOverview}
      onOpenAnalysis={handlers.onOpenAnalysis}
      onOpenPartnerDiscussion={handlers.onOpenPartnerDiscussion}
      onReturnHome={handlers.onReturnHome}
      onReturnFromSafetyPriority={handlers.onReturnFromSafetyPriority}
      onClearData={handlers.onClearData}
      onContinueSafely={handlers.onContinueSafely}
      suggestedQuestionLinks={handlers.suggestedQuestionLinks}
      deepDiveModules={handlers.deepDiveModules}
    />
  );
}

export function App({
  state,
  report,
  services,
  diagnosticsPanel,
  activeReportTab = "overview",
  onCompleteSafetyCheck,
  onStartOrResume,
  onOpenLatestReport,
  onClearData,
  onReturnFromSafetyPriority,
  onContinueSafely,
  onOpenOverview,
  onOpenAnalysis,
  onOpenPartnerDiscussion,
  onReturnHome = () => undefined,
  suggestedQuestionLinks = [],
  deepDiveModules = [],
}: AppProps): ReactElement {
  const showsSafetySubstitute =
    (state.route === "report" || state.route === "safety-priority") &&
    (report.redFlag.level === "R3" || report.redFlag.level === "R4");
  const showDiagnostics =
    state.route === "report" &&
    !showsSafetySubstitute &&
    services.diagnostics.isDev &&
    diagnosticsPanel &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debug") === "1";

  return (
    <>
      {state.save.status === "error" ? (
        <div className="mx-auto max-w-5xl px-6 pt-6">
          <SaveStatusGate
            status={state.save.status}
            message={state.save.message}
            onRetry={() => undefined}
            riskyActions={[
              { id: "resume-later", label: "稍后继续" },
              { id: "generate-report", label: "生成报告" },
            ]}
          />
        </div>
      ) : null}
      {renderRoute(state, report, {
        onCompleteSafetyCheck,
        activeReportTab,
        onStartOrResume,
        onOpenLatestReport,
        onClearData,
        onReturnFromSafetyPriority,
        onContinueSafely,
        onOpenOverview,
        onOpenAnalysis,
        onOpenPartnerDiscussion,
        onReturnHome,
        suggestedQuestionLinks,
        deepDiveModules,
      })}
      {showDiagnostics ? <div className="mx-auto max-w-5xl px-6 pb-8">{diagnosticsPanel}</div> : null}
    </>
  );
}
