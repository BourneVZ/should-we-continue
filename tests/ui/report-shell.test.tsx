import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ReportShell } from "@/features/report/ReportShell";
import { createReportViewModel } from "../fixtures/factories";

describe("ReportShell", () => {
  it("swaps to safety substitute for R3/R4 and does not render the normal tab shell", () => {
    const html = renderToStaticMarkup(
      <ReportShell
        activeTab="overview"
        partnerTabEnabled={false}
        report={createReportViewModel({
          redFlag: { level: "R4", actionIds: ["ACT-URGENT-MEDICAL"] },
        })}
      />,
    );

    expect(html).toContain("ACT-URGENT-MEDICAL");
    expect(html).not.toContain("概览");
    expect(html).not.toContain("深入分析");
    expect(html).not.toContain("伴侣讨论");
  });
});
