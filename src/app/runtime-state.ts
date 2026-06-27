import { createInitialAppState } from "@/app/app-reducer";
import { createEmptyWorkspaceDocument } from "@/persistence/local-repository";
import type { ReportViewModel, WorkspaceDocument } from "@/domain/types";

export function createEmptyReportViewModel(): ReportViewModel {
  return {
    redFlag: { level: "none", actionIds: [] },
    dimensions: [],
    certainty: "medium",
    priorityActionIds: [],
    pathContinue: [],
    pathEnd: [],
    persona: {
      primaryPersonaId: null,
      secondaryPersonaId: null,
      candidatePersonaIds: [],
      personaConfidence: 0,
      statusTagIds: [],
      suppressedReason: null,
    },
    region: {
      status: "empty",
      checkedAt: null,
      expiresAt: null,
      verifiedFields: [],
    },
    measures: [],
  };
}

export function createRuntimeSnapshot(document: WorkspaceDocument | null): {
  workspace: WorkspaceDocument;
  report: ReportViewModel;
  state: ReturnType<typeof createInitialAppState>;
} {
  const workspace = document ?? createEmptyWorkspaceDocument();
  const report = workspace.user.reportView ?? createEmptyReportViewModel();

  return {
    workspace,
    report,
    state: createInitialAppState({
      hasExistingReport: workspace.user.reportView !== null,
      reportStale:
        workspace.user.reportSourceRevision !== null &&
        workspace.user.reportSourceRevision !== workspace.user.answersRevision,
      canOpenPartnerDiscussion: workspace.shared.discussion !== null,
      redFlagLevel: report.redFlag.level,
    }),
  };
}
