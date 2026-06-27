import type { ReactElement } from "react";
import { SaveStatusGate } from "@/components/SaveStatusGate";
import type { AppState } from "@/app/app-reducer";
import { HomeScreen } from "@/features/home/HomeScreen";
import { DiagnosticsPanel } from "@/features/diagnostics/DiagnosticsPanel";
import { ReportShell } from "@/features/report/ReportShell";
import { SafetyPriorityScreen } from "@/features/report/SafetyPriorityScreen";
import type { ReportViewModel } from "@/domain/types";
import type { AppServices } from "./services";

interface AppProps {
  state: AppState;
  report: ReportViewModel;
  services: AppServices<
    unknown,
    unknown,
    unknown,
    {
      isDev: boolean;
      configAvailable: boolean;
      templateFallbackActive: boolean;
      errorCategory: string | null;
      schemaStatus: "valid" | "invalid";
    }
  >;
}

function renderRoute(state: AppState, report: ReportViewModel): ReactElement {
  if (state.route === "safety-check") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-6 py-10">
        <h1 className="text-2xl font-semibold text-ink">安全检查</h1>
        <p className="text-sm text-slate-700">先完成安全检查，再进入后续问卷和报告流程。</p>
      </main>
    );
  }

  if (state.route === "home") {
    return (
      <HomeScreen
        hasExistingData={state.hasExistingReport}
        reportStatus={state.reportStatus}
        onStartOrResume={() => undefined}
        onOpenLatestReport={() => undefined}
        onClearData={() => undefined}
      />
    );
  }

  if (state.route === "safety-priority") {
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

  return <ReportShell activeTab="overview" partnerTabEnabled={state.canOpenPartnerDiscussion} report={report} />;
}

export function App({ state, report, services }: AppProps): ReactElement {
  const showsSafetySubstitute =
    (state.route === "report" || state.route === "safety-priority") &&
    (report.redFlag.level === "R3" || report.redFlag.level === "R4");

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
      {renderRoute(state, report)}
      {state.route === "report" && !showsSafetySubstitute && services.diagnostics.isDev ? (
        <div className="mx-auto max-w-5xl px-6 pb-8">
          <DiagnosticsPanel
            isDev={services.diagnostics.isDev}
            configAvailable={services.diagnostics.configAvailable}
            templateFallbackActive={services.diagnostics.templateFallbackActive}
            errorCategory={services.diagnostics.errorCategory}
            schemaStatus={services.diagnostics.schemaStatus}
          />
        </div>
      ) : null}
    </>
  );
}
