import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createInitialAppState } from "@/app/app-reducer";
import { App } from "@/app/App";
import { createReportViewModel } from "../fixtures/factories";

const baseHandlers = {
  onCompleteSafetyCheck: () => undefined,
  onStartOrResume: () => undefined,
  onOpenLatestReport: () => undefined,
  onClearData: () => undefined,
  onReturnFromSafetyPriority: () => undefined,
  onContinueSafely: () => undefined,
  onOpenOverview: () => undefined,
  onOpenAnalysis: () => undefined,
  onOpenPartnerDiscussion: () => undefined,
};

describe("App", () => {
  it("starts on the landing page instead of the old empty safety-gate screen", () => {
    const html = renderToStaticMarkup(
      <App
        state={createInitialAppState({
          hasExistingReport: false,
          reportStale: false,
          canOpenPartnerDiscussion: false,
          redFlagLevel: "none",
        })}
        report={createReportViewModel()}
        services={{
          repository: {},
          clock: {},
          apiClient: {},
          diagnostics: {
            isDev: false,
            configAvailable: true,
            templateFallbackActive: false,
            errorCategory: null,
            schemaStatus: "valid",
          },
        }}
        {...baseHandlers}
      />,
    );

    expect(html).toContain("把混乱拆成一题一题");
    expect(html).not.toContain("先完成安全检查");
  });

  it("renders save gate blocking risky actions when persistence failed", () => {
    const html = renderToStaticMarkup(
      <App
        state={{
          ...createInitialAppState({
            hasExistingReport: true,
            reportStale: false,
            canOpenPartnerDiscussion: false,
            redFlagLevel: "none",
          }),
          route: "report",
          save: { status: "error", message: "本地保存失败，请先重试保存后再继续。" },
        }}
        report={createReportViewModel()}
        services={{
          repository: {},
          clock: {},
          apiClient: {},
          diagnostics: {
            isDev: false,
            configAvailable: true,
            templateFallbackActive: false,
            errorCategory: null,
            schemaStatus: "valid",
          },
        }}
        {...baseHandlers}
      />,
    );

    expect(html).toContain("本地保存失败，请先重试保存后再继续。");
    expect(html).toContain("稍后继续");
    expect(html).toContain("生成报告");
    expect(html).toContain("disabled");
  });

  it("prioritizes the R3/R4 substitute page and hides diagnostics unless explicitly requested", () => {
    const safetyHtml = renderToStaticMarkup(
      <App
        state={{
          ...createInitialAppState({
            hasExistingReport: true,
            reportStale: false,
            canOpenPartnerDiscussion: false,
            redFlagLevel: "R4",
          }),
          route: "report",
        }}
        report={createReportViewModel({
          redFlag: { level: "R4", actionIds: ["ACT-URGENT-MEDICAL"] },
        })}
        services={{
          repository: {},
          clock: {},
          apiClient: {},
          diagnostics: {
            isDev: true,
            configAvailable: false,
            templateFallbackActive: true,
            errorCategory: "missing_config",
            schemaStatus: "valid",
          },
        }}
        diagnosticsPanel={<aside>开发诊断</aside>}
        {...baseHandlers}
      />,
    );

    expect(safetyHtml).toContain("ACT-URGENT-MEDICAL");
    expect(safetyHtml).not.toContain("开发诊断");

    const reportHtml = renderToStaticMarkup(
      <App
        state={{
          ...createInitialAppState({
            hasExistingReport: true,
            reportStale: false,
            canOpenPartnerDiscussion: false,
            redFlagLevel: "none",
          }),
          route: "report",
        }}
        report={createReportViewModel()}
        services={{
          repository: {},
          clock: {},
          apiClient: {},
          diagnostics: {
            isDev: true,
            configAvailable: false,
            templateFallbackActive: true,
            errorCategory: "missing_config",
            schemaStatus: "valid",
          },
        }}
        diagnosticsPanel={<aside>开发诊断</aside>}
        {...baseHandlers}
      />,
    );

    expect(reportHtml).toContain("概览");
    expect(reportHtml).not.toContain("开发诊断");
    expect(reportHtml).not.toContain("LLM_API_KEY");
  });
});
