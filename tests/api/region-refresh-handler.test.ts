import { describe, expect, it } from "vitest";
import { REGION_ALLOWLIST, REGION_CONFIG } from "@/config/region/hangzhou-bingjiang";
import { handleRegionRefreshRequest } from "../../api/_lib/region-refresh-handler";
import { createRegionCache } from "../fixtures/factories";

describe("region refresh handler", () => {
  it("refreshes only on explicit request, keeps fully evidenced candidates, caches for 7 days, and does not emit scoring fields", async () => {
    const result = await handleRegionRefreshRequest(
      { regionId: REGION_CONFIG.regionId },
      {
        existingCache: createRegionCache(),
        today: "2026-06-27",
        fetchRegionPage: async () => ({
          ok: true,
          text: "<html>source</html>",
        }),
        llm: {
          complete: async () => ({
            status: "ok",
            text: JSON.stringify({
              candidates: [
                {
                  fieldId: "benefit.hz.under3_annual",
                  value: "3600",
                  sourceUrl: REGION_ALLOWLIST[4].url,
                  checkedAt: "2026-06-27",
                  applicableIf: ["需另行核对"],
                  uncertaintyNote: "仅作参考",
                },
              ],
            }),
          }),
        },
      },
    );

    expect(result.cache.status).toBe("fresh");
    expect(result.cache.expiresAt).toBe("2026-07-04");
    expect(result.cache.verifiedFields).toHaveLength(1);
    expect(JSON.stringify(result)).not.toContain("supportScore");
    expect(JSON.stringify(result)).not.toContain("conditionId");
  });

  it("hides fact cards when refresh extraction fails schema validation and keeps unavailable fallback", async () => {
    const result = await handleRegionRefreshRequest(
      { regionId: REGION_CONFIG.regionId },
      {
        existingCache: createRegionCache(),
        today: "2026-06-27",
        fetchRegionPage: async () => ({
          ok: true,
          text: "<html>source</html>",
        }),
        llm: {
          complete: async () => ({
            status: "ok",
            text: JSON.stringify({
              candidates: [
                {
                  fieldId: "benefit.hz.under3_annual",
                  value: "",
                  sourceUrl: REGION_ALLOWLIST[4].url,
                  checkedAt: "2026-06-27",
                  applicableIf: [],
                },
              ],
            }),
          }),
        },
      },
    );

    expect(result.cache.status).toBe("unavailable");
    expect(result.cache.verifiedFields).toEqual([]);
  });

  it("keeps source conflicts side by side instead of auto-resolving them", async () => {
    const result = await handleRegionRefreshRequest(
      { regionId: REGION_CONFIG.regionId },
      {
        existingCache: createRegionCache(),
        today: "2026-06-27",
        fetchRegionPage: async () => ({
          ok: true,
          text: "<html>source</html>",
        }),
        llm: {
          complete: async () => ({
            status: "ok",
            text: JSON.stringify({
              candidates: [
                {
                  fieldId: "benefit.hz.under3_annual",
                  value: "3600",
                  sourceUrl: REGION_ALLOWLIST[4].url,
                  checkedAt: "2026-06-27",
                  applicableIf: ["版本一"],
                },
                {
                  fieldId: "benefit.hz.under3_annual",
                  value: "3000",
                  sourceUrl: REGION_ALLOWLIST[4].url,
                  checkedAt: "2026-06-27",
                  applicableIf: ["版本二"],
                },
              ],
            }),
          }),
        },
      },
    );

    expect(result.cache.status).toBe("conflict");
    expect(result.cache.verifiedFields).toHaveLength(2);
  });
});
