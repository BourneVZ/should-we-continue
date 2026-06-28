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
            { dimensionId: "lifeDevelopmentSupport", displayLevel: "low", certaintyLevel: "low", recommendedModuleId: "life-deep", reasonIds: ["Q-WILL-SENSE-LOSS"] },
            { dimensionId: "partnerCommitmentSupport", displayLevel: "medium", certaintyLevel: "medium", reasonIds: ["Q-PARTNER-RELIABILITY"] },
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

    expect(html).toContain("角色仍在校准中");
    expect(html).toContain("人生发展与节奏");
    expect(html).toContain("仍需确认");
    expect(html).toContain("建议补充：个人发展细化");
    expect(html).toContain("优先讨论人生发展与长期节奏");
    expect(html).toContain("已接入伴侣共同讨论所需的授权内容");
    expect(html).not.toMatch(/热力|总分/);
  });

  it("does not claim an initial report as a successful calibrated persona when persona is missing", () => {
    const html = renderToStaticMarkup(
      <OverviewPage
        report={createReportViewModel({
          dimensions: [
            { dimensionId: "medicalSafetySupport", displayLevel: "medium", certaintyLevel: "medium", reasonIds: ["Q-MED-PREGNANCY-CONFIRMED"] },
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

    expect(html).toContain("角色仍在校准中");
    expect(html).toContain("医学安全确认");
    expect(html).toContain("先补足关键医学信息");
    expect(html).not.toContain("还没有可展示的报告内容");
  });

  it("renders the calibrated persona visual when persona assessment is complete", () => {
    const html = renderToStaticMarkup(
      <OverviewPage
        report={createReportViewModel({
          dimensions: [
            { dimensionId: "personalWillClaritySupport", displayLevel: "high", certaintyLevel: "high", reasonIds: ["Q-ROLE-FACT-CHECK"] },
          ],
          persona: {
            primaryPersonaId: "P01",
            secondaryPersonaId: "P03",
            candidatePersonaIds: ["P01", "P03"],
            personaConfidence: 78,
            statusTagIds: [],
            suppressedReason: null,
          },
        })}
        partnerPerspectiveAuthorized={false}
      />,
    );

    expect(html).toContain("当前更接近：雾灯校准师");
    expect(html).toContain("/personas/P01.svg");
    expect(html).toContain("雾灯校准师的抽象插画");
    expect(html).toContain("次要参考：风向捕手");
  });
});
