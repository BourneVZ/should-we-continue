import { describe, expect, it } from "vitest";
import {
  REGION_ALLOWLIST,
  REGION_CONFIG,
  REGION_STATIC_FIELDS,
} from "@/config/region/hangzhou-bingjiang";

describe("region configuration", () => {
  it("pins the MVP to Hangzhou Binjiang without scoring usage", () => {
    expect(REGION_CONFIG.regionId).toBe("CN-ZJ-HZ-BJ");
    expect(REGION_CONFIG.label).toBe("杭州滨江");
    expect(REGION_CONFIG.switchable).toBe(false);
    expect(REGION_CONFIG.cacheTtlDays).toBe(7);
  });

  it("requires every static field to keep source, date, applicability, uncertainty, and forbidden scoring use", () => {
    expect(REGION_STATIC_FIELDS.length).toBeGreaterThan(0);

    for (const field of REGION_STATIC_FIELDS) {
      expect(field.fieldId.length).toBeGreaterThan(0);
      expect(field.cardId.length).toBeGreaterThan(0);
      expect(field.sourceId.length).toBeGreaterThan(0);
      expect(field.sourceUrl.startsWith("https://")).toBe(true);
      expect(field.lastVerifiedAt).toBe("2026-06-26");
      expect(field.applicability.length).toBeGreaterThan(0);
      expect(field.uncertainty.length).toBeGreaterThan(0);
      expect(field.scoringUse).toBe("forbidden");
      expect(field.reportUse).toBe("reference_only");
    }
  });

  it("keeps only official HTTPS allowlist entries for user-triggered refresh", () => {
    expect(REGION_ALLOWLIST.map((entry) => entry.allowlistId)).toEqual([
      "WL-ZJ-LEAVE",
      "WL-CN-WOMEN-LABOR",
      "WL-HZ-ALLOWANCE",
      "WL-HZ-SERVICE-PACK",
      "WL-HZ-CHILD-BENEFIT",
    ]);

    for (const entry of REGION_ALLOWLIST) {
      expect(entry.url.startsWith("https://")).toBe(true);
      expect(entry.fieldPrefixes.length + entry.fieldIds.length).toBeGreaterThan(0);
    }
  });
});
