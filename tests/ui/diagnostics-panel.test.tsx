import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DiagnosticsPanel } from "@/features/diagnostics/DiagnosticsPanel";

describe("DiagnosticsPanel", () => {
  it("shows only non-sensitive dev diagnostics fields", () => {
    const html = renderToStaticMarkup(
      <DiagnosticsPanel
        isDev={true}
        configAvailable={false}
        templateFallbackActive={true}
        errorCategory="missing_config"
        schemaStatus="valid"
        secretPreview="server-key"
        promptPreview="do not expose"
        rawModelOutput="do not expose"
        answerPreview="do not expose"
      />,
    );

    expect(html).toContain("missing_config");
    expect(html).toContain("valid");
    expect(html).toContain("模板降级");
    expect(html).not.toContain("server-key");
    expect(html).not.toContain("do not expose");
  });

  it("renders nothing in production mode", () => {
    const html = renderToStaticMarkup(
      <DiagnosticsPanel
        isDev={false}
        configAvailable={true}
        templateFallbackActive={false}
        errorCategory={null}
        schemaStatus="valid"
      />,
    );

    expect(html).toBe("");
  });
});
