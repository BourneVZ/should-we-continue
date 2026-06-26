import type { RedFlagLevel, ReportViewModel, SharedDiscussionInput } from "@/domain/types";

export interface PartnerDiscussionWorkflowResult {
  disabledReason: string | null;
  discussionTopicIds: readonly string[];
  commitmentCategoryIds: readonly string[];
  partnerSummaryIds: readonly string[];
  userReport: ReportViewModel;
}

interface BuildPartnerDiscussionWorkflowParams {
  userReport: ReportViewModel;
  userShared: SharedDiscussionInput;
  partnerSharedSummaryIds: readonly string[];
  redFlagLevel: RedFlagLevel;
}

const DEFAULT_COMMITMENTS = [
  "medical_support",
  "financial_support",
  "boundary_support",
  "emotional_support",
] as const;

export function buildPartnerDiscussionWorkflow({
  userReport,
  userShared,
  partnerSharedSummaryIds,
  redFlagLevel,
}: BuildPartnerDiscussionWorkflowParams): PartnerDiscussionWorkflowResult {
  if (redFlagLevel === "R3" || redFlagLevel === "R4") {
    return {
      disabledReason: "red_flag_R3_or_R4",
      discussionTopicIds: [],
      commitmentCategoryIds: [],
      partnerSummaryIds: [],
      userReport,
    };
  }

  const discussionTopicIds = [
    ...userShared.summaryIds.map((summaryId) => `topic:${summaryId}`),
    ...userShared.sharedNotes.map((_note, index) => `topic:note:${index + 1}`),
  ].slice(0, 3);

  return {
    disabledReason: null,
    discussionTopicIds,
    commitmentCategoryIds: DEFAULT_COMMITMENTS.slice(0, 8),
    partnerSummaryIds: [...partnerSharedSummaryIds],
    userReport,
  };
}
