import type {
  AnswerValue,
  RedFlagResult,
  RegionCache,
  ReportViewModel,
  SharedDiscussionInput,
  WorkspaceDocument,
  WorkspaceParticipant,
} from "@/domain/types";
import { WORKSPACE_SCHEMA_VERSION } from "@/config/version";

export function createAnswered(value: string | number | boolean | null): AnswerValue {
  return { status: "answered", value };
}

export function createWorkspaceParticipant(overrides: Partial<WorkspaceParticipant> = {}): WorkspaceParticipant {
  return {
    answers: {},
    answersRevision: 0,
    reportView: null,
    reportSourceRevision: null,
    ...overrides,
  };
}

export function createRegionCache(overrides: Partial<RegionCache> = {}): RegionCache {
  return {
    status: "empty",
    checkedAt: null,
    expiresAt: null,
    verifiedFields: [],
    ...overrides,
  };
}

export function createReportViewModel(overrides: Partial<ReportViewModel> = {}): ReportViewModel {
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
    region: createRegionCache(),
    measures: [],
    ...overrides,
  };
}

export function createSharedDiscussionInput(overrides: Partial<SharedDiscussionInput> = {}): SharedDiscussionInput {
  return {
    summaryIds: [],
    pathContinue: [],
    pathEnd: [],
    sharedNotes: [],
    ...overrides,
  };
}

export function createRedFlagResult(overrides: Partial<RedFlagResult> = {}): RedFlagResult {
  return {
    level: "none",
    ruleIds: [],
    actionIds: [],
    personaSuppressedReason: null,
    sharingBlockedReason: null,
    ...overrides,
  };
}

export function createWorkspaceDocument(overrides: Partial<WorkspaceDocument> = {}): WorkspaceDocument {
  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    user: createWorkspaceParticipant(),
    partner: createWorkspaceParticipant(),
    shared: {
      discussion: null,
    },
    deepDive: {
      completedModuleIds: [],
      skippedAll: false,
    },
    regionCache: createRegionCache(),
    ...overrides,
  };
}
