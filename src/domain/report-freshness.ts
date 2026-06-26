export interface ReportFreshnessInput {
  answersRevision: number;
  reportSourceRevision: number | null;
}

export interface ReportFreshnessResult {
  isStale: boolean;
  requiresRegeneration: boolean;
}

export function getReportFreshness(input: ReportFreshnessInput): ReportFreshnessResult {
  const isStale =
    input.reportSourceRevision === null || input.answersRevision !== input.reportSourceRevision;

  return {
    isStale,
    requiresRegeneration: isStale,
  };
}
