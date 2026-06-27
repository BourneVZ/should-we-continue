import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AnalysisPage } from "@/features/report/AnalysisPage";
import { createReportViewModel } from "../fixtures/factories";

describe("AnalysisPage", () => {
  it("renders common facts first, region source/date/conditions, stale marker, and symmetric path sections", () => {
    const html = renderToStaticMarkup(
      <AnalysisPage
        report={createReportViewModel({
          pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }],
          pathEnd: [{ conditionId: "end-1", status: "confirmed", labelId: "RPT-PATH-END" }],
          region: {
            status: "stale",
            checkedAt: "2026-06-20",
            expiresAt: "2026-06-27",
            verifiedFields: [
              {
                fieldId: "benefit.hz.under3_annual",
                value: "3600",
                sourceUrl: "https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml",
                checkedAt: "2026-06-20",
                applicableIf: ["需另行核对"],
              },
            ],
          },
        })}
        commonFactIds={["reason:medical", "reason:will"]}
        privateNoteSummaryVisible={false}
      />,
    );

    expect(html).toContain("reason:medical");
    expect(html).toContain("https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml");
    expect(html).toContain("可能过期");
    expect(html).toContain("continue-1");
    expect(html).toContain("end-1");
    expect(html).not.toContain("默认推荐");
  });
});
