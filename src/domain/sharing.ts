import { FORBIDDEN_SHARE_CATEGORY_IDS, SHARE_CATEGORY_IDS } from "@/config/report/content";
import type { ReportViewModel, SharedDiscussionInput } from "@/domain/types";

interface BuildSharedDiscussionInputParams {
  report: ReportViewModel;
  allowedSummaryIds: readonly string[];
  sharePathConditions: boolean;
  editedNoteSummary?: string;
}

const ALLOWED_SUMMARY_SET = new Set<string>(SHARE_CATEGORY_IDS);
const FORBIDDEN_SUMMARY_SET = new Set<string>(FORBIDDEN_SHARE_CATEGORY_IDS);

export function buildSharedDiscussionInput({
  report,
  allowedSummaryIds,
  sharePathConditions,
  editedNoteSummary,
}: BuildSharedDiscussionInputParams): SharedDiscussionInput {
  if (report.redFlag.level === "R3" || report.redFlag.level === "R4") {
    throw new Error("sharing is blocked for R3/R4 reports");
  }

  const summaryIds = allowedSummaryIds.filter(
    (summaryId) =>
      summaryId !== "path_conditions" &&
      ALLOWED_SUMMARY_SET.has(summaryId) &&
      !FORBIDDEN_SUMMARY_SET.has(summaryId),
  );

  return {
    summaryIds,
    pathContinue: sharePathConditions ? [...report.pathContinue] : [],
    pathEnd: sharePathConditions ? [...report.pathEnd] : [],
    sharedNotes: editedNoteSummary ? [editedNoteSummary] : [],
  };
}
