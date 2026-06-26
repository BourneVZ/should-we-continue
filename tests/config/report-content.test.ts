import { describe, expect, it } from "vitest";
import {
  FORBIDDEN_SHARE_CATEGORY_IDS,
  REPORT_CONTENT,
  SHARE_CATEGORY_IDS,
} from "@/config/report/content";

describe("report content registry", () => {
  it("keeps audited content ids for disclaimers, red flags, dimensions, paths, region, and sharing", () => {
    expect(REPORT_CONTENT["RPT-DISCLAIMER-DECISION-SUPPORT"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-DISCLAIMER-LOCAL-DATA"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-RED-FLAG-RETURN"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-OVERVIEW-INTRO"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-PERSONA-CALIBRATING"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-DIM-LIFE"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-PATH-CONTINUE"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-PATH-END"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-REGION-CARD"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-REGION-UNAVAILABLE"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-SHARE-CONSENT"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-UNSHARED-PLACEHOLDER"]).toBeDefined();
    expect(REPORT_CONTENT["RPT-COMMITMENT"]).toBeDefined();
  });

  it("uses only fixed share categories and keeps dangerous categories forbidden", () => {
    expect(SHARE_CATEGORY_IDS).toEqual([
      "medical_summary",
      "emotional_summary",
      "life_summary",
      "financial_summary",
      "partner_needs",
      "family_boundary_summary",
      "childcare_summary",
      "values_summary",
      "path_conditions",
      "edited_note_summary",
    ]);

    expect(FORBIDDEN_SHARE_CATEGORY_IDS).toEqual([
      "safety",
      "will_direction",
      "free_text_raw",
      "medical_detail",
      "measure_data",
    ]);
  });

  it("does not register recommendation, diagnosis, hotline, or raw-text leakage phrases", () => {
    const joined = Object.values(REPORT_CONTENT)
      .map((entry) => entry.template)
      .join("\n");

    expect(joined).not.toMatch(/应该继续妊娠|应该中止妊娠|诊断|热线|原始回答|逐字显示/);
  });
});
