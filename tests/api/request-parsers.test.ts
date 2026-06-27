import { describe, expect, it } from "vitest";
import {
  parseModelAnalysisResult,
  parseNarrativeOverlay,
  parseRegionRefreshRequest,
  parseReportHttpRequest,
} from "../../api/_lib/request-parsers";
import { createReportViewModel, createSharedDiscussionInput } from "../fixtures/factories";

describe("request parsers", () => {
  it("accepts minimal personal and discussion report requests", () => {
    expect(
      parseReportHttpRequest({
        mode: "personal",
        payload: createReportViewModel(),
      }),
    ).toEqual({
      mode: "personal",
      payload: createReportViewModel(),
    });

    expect(
      parseReportHttpRequest({
        mode: "discussion",
        payload: createSharedDiscussionInput(),
      }),
    ).toEqual({
      mode: "discussion",
      payload: createSharedDiscussionInput(),
    });
  });

  it("rejects unknown request mode and unknown top-level fields", () => {
    expect(() =>
      parseReportHttpRequest({
        mode: "partner",
        payload: createReportViewModel(),
      }),
    ).toThrow(/mode/i);

    expect(() =>
      parseReportHttpRequest({
        mode: "personal",
        payload: createReportViewModel(),
        extra: true,
      }),
    ).toThrow(/unknown field/i);
  });

  it("accepts only allowlisted overlay sections and rejects overlong narrative blocks as a whole", () => {
    expect(
      parseNarrativeOverlay({
        sections: [
          {
            sectionId: "overview",
            contentId: "RPT-OVERVIEW-INTRO",
            variables: {},
            narrative: "保持中性、非诊断性的摘要。",
          },
        ],
      }),
    ).toEqual({
      sections: [
        {
          sectionId: "overview",
          contentId: "RPT-OVERVIEW-INTRO",
          variables: {},
          narrative: "保持中性、非诊断性的摘要。",
        },
      ],
    });

    expect(() =>
      parseNarrativeOverlay({
        sections: [
          {
            sectionId: "freeform",
            contentId: "RPT-OVERVIEW-INTRO",
            variables: {},
            narrative: "x",
          },
        ],
      }),
    ).toThrow(/section/i);

    expect(() =>
      parseNarrativeOverlay({
        sections: [
          {
            sectionId: "overview",
            contentId: "RPT-OVERVIEW-INTRO",
            variables: {},
            narrative: "x".repeat(5001),
          },
        ],
      }),
    ).toThrow(/too long/i);
  });

  it("validates preset contradiction types and rejects unknown entries", () => {
    expect(
      parseModelAnalysisResult({
        certaintyDelta: -1,
        contradictionTypes: ["timeline_gap", "support_mismatch"],
      }),
    ).toEqual({
      certaintyDelta: -1,
      contradictionTypes: ["timeline_gap", "support_mismatch"],
    });

    expect(() =>
      parseModelAnalysisResult({
        certaintyDelta: -1,
        contradictionTypes: ["invented_fact"],
      }),
    ).toThrow(/contradiction/i);
  });

  it("requires a minimal region refresh request without client-provided URLs", () => {
    expect(parseRegionRefreshRequest({ regionId: "CN-ZJ-HZ-BJ" })).toEqual({
      regionId: "CN-ZJ-HZ-BJ",
    });

    expect(() =>
      parseRegionRefreshRequest({
        regionId: "CN-ZJ-HZ-BJ",
        url: "https://example.com",
      }),
    ).toThrow(/unknown field/i);
  });
});
