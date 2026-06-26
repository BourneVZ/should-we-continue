import { describe, expect, it } from "vitest";
import { REGION_ALLOWLIST } from "@/config/region/hangzhou-bingjiang";
import {
  buildRegionCache,
  parseRegionCandidate,
} from "@/domain/region";

describe("parseRegionCandidate", () => {
  it("accepts only allowlisted HTTPS candidate fields", () => {
    const candidate = parseRegionCandidate(
      {
        fieldId: "benefit.hz.under3_annual",
        value: "3600",
        sourceUrl: "https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml",
        checkedAt: "2026-06-26",
        applicableIf: ["杭州相关条件需另行核对"],
        uncertaintyNote: "不对个人资格作承诺",
      },
      REGION_ALLOWLIST,
    );

    expect(candidate.fieldId).toBe("benefit.hz.under3_annual");
  });

  it("rejects non-allowlisted or non-HTTPS sources", () => {
    expect(() =>
      parseRegionCandidate(
        {
          fieldId: "benefit.hz.under3_annual",
          value: "3600",
          sourceUrl: "http://example.com/fake",
          checkedAt: "2026-06-26",
          applicableIf: ["bad"],
        },
        REGION_ALLOWLIST,
      ),
    ).toThrow(/allowlist/i);
  });
});

describe("buildRegionCache", () => {
  it("marks verified fields within 7 days as fresh", () => {
    const cache = buildRegionCache(
      [
        {
          fieldId: "benefit.hz.under3_annual",
          value: "3600",
          sourceUrl: "https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml",
          checkedAt: "2026-06-26",
          applicableIf: ["杭州相关条件需另行核对"],
          uncertaintyNote: "不对个人资格作承诺",
        },
      ],
      "2026-07-01",
    );

    expect(cache.status).toBe("fresh");
    expect(cache.verifiedFields).toHaveLength(1);
  });

  it("marks cached fields older than 7 days as stale instead of treating them as latest facts", () => {
    const cache = buildRegionCache(
      [
        {
          fieldId: "benefit.hz.under3_annual",
          value: "3600",
          sourceUrl: "https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml",
          checkedAt: "2026-06-26",
          applicableIf: ["杭州相关条件需另行核对"],
          uncertaintyNote: "不对个人资格作承诺",
        },
      ],
      "2026-07-05",
    );

    expect(cache.status).toBe("stale");
  });

  it("keeps conflicting values side by side instead of auto-selecting one", () => {
    const cache = buildRegionCache(
      [
        {
          fieldId: "benefit.hz.under3_annual",
          value: "3600",
          sourceUrl: "https://zfgb.hangzhou.gov.cn/15/112220253/t122220253124/529990.shtml",
          checkedAt: "2026-06-26",
          applicableIf: ["杭州相关条件需另行核对"],
          uncertaintyNote: "版本一",
        },
        {
          fieldId: "benefit.hz.under3_annual",
          value: "3000",
          sourceUrl: "https://www.nhsa.gov.cn/art/2025/5/14/art_52_16510.html",
          checkedAt: "2026-06-26",
          applicableIf: ["版本冲突"],
          uncertaintyNote: "版本二",
        },
      ],
      "2026-06-27",
    );

    expect(cache.status).toBe("conflict");
    expect(cache.verifiedFields).toHaveLength(2);
  });

  it("falls back to unavailable when refresh fails and there is no verified cache", () => {
    const cache = buildRegionCache([], "2026-06-27", { refreshFailed: true });

    expect(cache).toEqual({
      status: "unavailable",
      checkedAt: null,
      expiresAt: null,
      verifiedFields: [],
    });
  });
});
