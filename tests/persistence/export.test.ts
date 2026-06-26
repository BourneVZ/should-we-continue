import { describe, expect, it } from "vitest";
import {
  exportDiscussionMarkdown,
  exportPersonalMarkdown,
} from "@/persistence/export";
import { createReportViewModel } from "../fixtures/factories";
import type { SharedDiscussionInput } from "@/domain/types";

describe("exportPersonalMarkdown", () => {
  it("exports only user-visible personal report content", () => {
    const output = exportPersonalMarkdown(
      createReportViewModel({
        redFlag: { level: "R1", actionIds: ["ACT-WATCH-PRIVACY"] },
        priorityActionIds: ["ACT-WATCH-PRIVACY", "ACT-LIFE-DEVELOPMENT-PRIORITY"],
        persona: {
          primaryPersonaId: "P10",
          secondaryPersonaId: "P11",
          candidatePersonaIds: ["P10", "P11"],
          personaConfidence: 81,
          statusTagIds: ["S07"],
          suppressedReason: null,
        },
      }),
    );

    expect(output).toContain("ACT-WATCH-PRIVACY");
    expect(output).toContain("P10");
    expect(output).not.toMatch(/supportScore|weight|PHQ|GAD|free_text_raw/i);
  });
});

describe("exportDiscussionMarkdown", () => {
  it("exports only authorized discussion content and not private partner data", () => {
    const discussion: SharedDiscussionInput = {
      summaryIds: ["medical_summary", "values_summary"],
      pathContinue: [{ conditionId: "continue-1", status: "pending", labelId: "RPT-PATH-CONTINUE" }],
      pathEnd: [],
      sharedNotes: ["仅分享处理后的讨论摘要"],
    };

    const output = exportDiscussionMarkdown(discussion);

    expect(output).toContain("medical_summary");
    expect(output).toContain("仅分享处理后的讨论摘要");
    expect(output).not.toMatch(/measure_data|partner_private|free_text_raw/i);
  });
});
