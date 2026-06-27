import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createInitialAppState } from "@/app/app-reducer";
import { App } from "@/app/App";
import { createReportViewModel } from "../fixtures/factories";

describe("App", () => {
  it("starts on the safety-check screen before opening the rest of the flow", () => {
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
          diagnostics: { isDev: false, configAvailable: true, templateFallbackActive: false, errorCategory: null, schemaStatus: "valid" },
        }}
      />,
    );

    expect(html).toContain("安全检查");
    expect(html).not.toContain("Should We Continue");
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
          save: { status: "error", message: "保存失败，请重试" },
        }}
        report={createReportViewModel()}
        services={{
          repository: {},
          clock: {},
          apiClient: {},
          diagnostics: { isDev: false, configAvailable: true, templateFallbackActive: false, errorCategory: null, schemaStatus: "valid" },
        }}
      />,
    );

    expect(html).toContain("保存失败，请重试");
    expect(html).toContain("稍后继续");
    expect(html).toContain("生成报告");
    expect(html).toContain("disabled");
  });

  it("prioritizes the R3/R4 substitute page and mounts diagnostics only in normal dev report mode", () => {
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
          diagnostics: { isDev: true, configAvailable: false, templateFallbackActive: true, errorCategory: "missing_config", schemaStatus: "valid" },
        }}
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
          diagnostics: { isDev: true, configAvailable: false, templateFallbackActive: true, errorCategory: "missing_config", schemaStatus: "valid" },
        }}
      />,
    );

    expect(reportHtml).toContain("概览");
    expect(reportHtml).toContain("开发诊断");
    expect(reportHtml).not.toContain("LLM_API_KEY");
  });
});
