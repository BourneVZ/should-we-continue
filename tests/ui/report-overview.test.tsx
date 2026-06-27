import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { OverviewPage } from "@/features/report/OverviewPage";
import { createReportViewModel } from "../fixtures/factories";

describe("OverviewPage", () => {
  it("renders persona/calibrating state, text-only dimensions, life highlight, and top actions", () => {
    const html = renderToStaticMarkup(
      <OverviewPage
        report={createReportViewModel({
          dimensions: [
            { dimensionId: "lifeDevelopmentSupport", displayLevel: "low", reasonIds: ["life"] },
            { dimensionId: "partnerCommitmentSupport", displayLevel: "medium", reasonIds: ["partner"] },
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

    expect(html).toContain("仍在校准中");
    expect(html).toContain("lifeDevelopmentSupport");
    expect(html).toContain("ACT-LIFE-DEVELOPMENT-PRIORITY");
    expect(html).toContain("伴侣视角已授权");
    expect(html).not.toMatch(/雷达|热力|总分/);
  });
});
