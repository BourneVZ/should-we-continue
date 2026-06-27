import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { OverviewPage } from "@/features/report/OverviewPage";
import { createReportViewModel } from "../fixtures/factories";

describe("OverviewPage", () => {
  it("renders calibrated state, Chinese dimensions, and top actions", () => {
    const html = renderToStaticMarkup(
      <OverviewPage
        report={createReportViewModel({
          dimensions: [
            { dimensionId: "lifeDevelopmentSupport", displayLevel: "low", reasonIds: ["Q-WILL-SENSE-LOSS"] },
            { dimensionId: "partnerCommitmentSupport", displayLevel: "medium", reasonIds: ["Q-PARTNER-RELIABILITY"] },
          ],
          priorityActionIds: ["ACT-CLARIFY-WILL", "ACT-LIFE-DEVELOPMENT-PRIORITY", "ACT-WATCH-PRIVACY"],
          persona: {
            primaryPersonaId: null,
            secondaryPersonaId: null,
            candidatePersonaIds: [],
            personaConfidence: 0,
            statusTagIds: [],
            suppressedReason: "insufficient_persona_data",
          },
        })}
        partnerPerspectiveAuthorized
      />,
    );

    expect(html).toContain("已生成初步报告");
    expect(html).toContain("人生发展与节奏");
    expect(html).toContain("优先讨论人生发展与长期节奏");
    expect(html).toContain("已接入伴侣共同讨论所需的授权内容");
    expect(html).not.toMatch(/热力|总分/);
  });

  it("still presents an initial report when persona is not calibrated yet", () => {
    const html = renderToStaticMarkup(
      <OverviewPage
        report={createReportViewModel({
          dimensions: [
            { dimensionId: "medicalSafetySupport", displayLevel: "medium", reasonIds: ["Q-MED-PREGNANCY-CONFIRMED"] },
          ],
          priorityActionIds: ["ACT-CLARIFY-MEDICAL"],
          persona: {
            primaryPersonaId: null,
            secondaryPersonaId: null,
            candidatePersonaIds: [],
            personaConfidence: 0,
            statusTagIds: [],
            suppressedReason: "insufficient_persona_data",
          },
        })}
        partnerPerspectiveAuthorized={false}
      />,
    );

    expect(html).toContain("已生成初步报告");
    expect(html).toContain("医学安全确认");
    expect(html).toContain("先补足关键医学信息");
    expect(html).not.toContain("还没有可展示的报告内容");
  });
});
