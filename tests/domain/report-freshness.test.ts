import { describe, expect, it } from "vitest";
import { getReportFreshness } from "@/domain/report-freshness";

describe("getReportFreshness", () => {
  it("marks report artifacts as stale when answers revision changes", () => {
    expect(
      getReportFreshness({
        answersRevision: 3,
        reportSourceRevision: 2,
      }),
    ).toEqual({
      isStale: true,
      requiresRegeneration: true,
    });
  });

  it("keeps report artifacts fresh when revisions match", () => {
    expect(
      getReportFreshness({
        answersRevision: 3,
        reportSourceRevision: 3,
      }),
    ).toEqual({
      isStale: false,
      requiresRegeneration: false,
    });
  });

  it("treats missing report source revision as stale", () => {
    expect(
      getReportFreshness({
        answersRevision: 1,
        reportSourceRevision: null,
      }),
    ).toEqual({
      isStale: true,
      requiresRegeneration: true,
    });
  });
});
