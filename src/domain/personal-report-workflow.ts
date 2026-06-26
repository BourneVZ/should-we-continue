import type { ReportViewModel, RedFlagLevel } from "@/domain/types";

export interface PersonalReportWorkflowResult {
  stage: "needs-core" | "needs-deep-dive" | "report-stale" | "report-ready" | "safety-substitute";
  mode: "template" | "llm-overlay";
  report: ReportViewModel | null;
}

interface BuildPersonalReportWorkflowParams {
  coreComplete: boolean;
  deepDiveComplete: boolean;
  deepDiveExplicitlySkipped: boolean;
  redFlagLevel: RedFlagLevel;
  reportView: ReportViewModel;
  currentAnswersRevision: number;
  reportSourceRevision: number | null;
  llmAvailable: boolean;
}

export function buildPersonalReportWorkflow({
  coreComplete,
  deepDiveComplete,
  deepDiveExplicitlySkipped,
  redFlagLevel,
  reportView,
  currentAnswersRevision,
  reportSourceRevision,
  llmAvailable,
}: BuildPersonalReportWorkflowParams): PersonalReportWorkflowResult {
  if (!coreComplete) {
    return { stage: "needs-core", mode: "template", report: null };
  }

  if (redFlagLevel === "R3" || redFlagLevel === "R4") {
    return { stage: "safety-substitute", mode: "template", report: reportView };
  }

  if (!deepDiveComplete && !deepDiveExplicitlySkipped) {
    return { stage: "needs-deep-dive", mode: "template", report: null };
  }

  if (reportSourceRevision !== null && reportSourceRevision !== currentAnswersRevision) {
    return { stage: "report-stale", mode: "template", report: null };
  }

  return {
    stage: "report-ready",
    mode: llmAvailable ? "llm-overlay" : "template",
    report: reportView,
  };
}
