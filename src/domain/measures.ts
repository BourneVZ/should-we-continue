import type { MeasureMetadata } from "@/config/questionnaire/measure-metadata";
import type { AnswerValue, MeasureSummary } from "@/domain/types";

export function calculateMeasureSummaries(
  _answers: Record<string, AnswerValue>,
  metadata: readonly MeasureMetadata[],
): MeasureSummary[] {
  if (metadata.every((measure) => measure.status === "unavailable")) {
    return [];
  }

  return [];
}
