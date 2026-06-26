import { describe, expect, it } from "vitest";
import { MEASURE_METADATA } from "@/config/questionnaire/measure-metadata";
import { calculateMeasureSummaries } from "@/domain/measures";

describe("calculateMeasureSummaries", () => {
  it("returns no summaries when all formal measures are unavailable", () => {
    expect(calculateMeasureSummaries({}, MEASURE_METADATA)).toEqual([]);
  });
});
