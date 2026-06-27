export type AnswerStatus = "answered" | "uncertain" | "declined" | "unanswered";

export type PrimitiveAnswer = string | number | boolean | null;

export type AnswerValue =
  | { status: "answered"; value: PrimitiveAnswer | PrimitiveAnswer[] }
  | { status: "uncertain" }
  | { status: "declined" }
  | { status: "unanswered" };

export type QuestionAudience = "user" | "partner";
export type QuestionPhase = "core" | "deepDive" | "partnerSupport" | "personaAssessment";
export type QuestionType =
  | "singleSelect"
  | "multiSelect"
  | "scale"
  | "date"
  | "currency"
  | "freeText";
export type PrivacyLevel = "private" | "shareableByExplicitConsent" | "partnerPrivate";
export type SensitivityLevel = "none" | "medical" | "mentalHealth" | "autonomySafety" | "freeText";

export interface QuestionOption {
  code: string;
  label: string;
}

export interface QuestionMeta {
  id: string;
  answerKey: string;
  audience: QuestionAudience;
  phase: QuestionPhase;
  moduleId: string;
  questionType: QuestionType;
  title: string;
  options?: readonly QuestionOption[];
  required: boolean;
  privacy: PrivacyLevel;
  sensitivity: SensitivityLevel;
  sourceId?: string;
  visibleWhen?: readonly string[];
  scoringRefs?: readonly string[];
  redFlagRefs?: readonly string[];
  reportRefs?: readonly string[];
}

export type QuestionCatalog = Readonly<Record<string, QuestionMeta>>;

export type RedFlagLevel = "none" | "R1" | "R2" | "R3" | "R4";

export interface RedFlagResult {
  level: RedFlagLevel;
  ruleIds: readonly string[];
  actionIds: readonly string[];
  personaSuppressedReason: string | null;
  sharingBlockedReason: string | null;
}

export type SupportDimensionId =
  | "medicalSafetySupport"
  | "autonomySafetySupport"
  | "mentalHealthSupport"
  | "partnerCommitmentSupport"
  | "familySocialSupport"
  | "financialPolicySupport"
  | "lifeDevelopmentSupport"
  | "childcareLoadSupport"
  | "personalWillClaritySupport";

export type SupportLevel = "high" | "medium" | "low" | "insufficient";
export type CertaintyLevel = "high" | "medium" | "low" | "uncertain" | "deferred";

export interface DimensionScore {
  dimensionId: SupportDimensionId;
  supportScore: number;
  displayLevel: SupportLevel;
  certaintyLevel?: CertaintyLevel;
  reasonIds: readonly string[];
}

export interface ReportDimensionView {
  dimensionId: SupportDimensionId;
  displayLevel: SupportLevel;
  certaintyLevel?: CertaintyLevel;
  recommendedModuleId?: string;
  reasonIds: readonly string[];
}

export interface PathConditionView {
  conditionId: string;
  status: "confirmed" | "pending" | "deferred";
  derivedStatus?: "confirmed" | "pending";
  readingStatus?: "confirmed" | "pending" | "deferred";
  labelId: string;
}

export interface RegionFieldCandidate {
  fieldId: string;
  value: string;
  sourceUrl: string;
  checkedAt: string;
  applicableIf: readonly string[];
  uncertaintyNote?: string;
}

export interface RegionCache {
  status: "empty" | "fresh" | "stale" | "conflict" | "unavailable";
  checkedAt: string | null;
  expiresAt: string | null;
  verifiedFields: readonly RegionFieldCandidate[];
}

export interface MeasureSummary {
  measureId: string;
  version: string;
  sourceUrl: string;
  rawScore: number;
  rawScoreRange: readonly [number, number];
}

export interface PersonaResult {
  primaryPersonaId: string | null;
  secondaryPersonaId: string | null;
  candidatePersonaIds: readonly string[];
  personaConfidence: number;
  statusTagIds: readonly string[];
  suppressedReason: string | null;
}

export interface ReportPlan {
  redFlag: RedFlagResult;
  dimensions: readonly ReportDimensionView[];
  certainty: CertaintyLevel;
  priorityActionIds: readonly string[];
  pathContinue: readonly PathConditionView[];
  pathEnd: readonly PathConditionView[];
  persona: PersonaResult;
  region: RegionCache;
  measures: readonly MeasureSummary[];
}

export interface ReportViewModel {
  redFlag: Pick<RedFlagResult, "level" | "actionIds">;
  dimensions: readonly ReportDimensionView[];
  certainty: CertaintyLevel;
  priorityActionIds: readonly string[];
  pathContinue: readonly PathConditionView[];
  pathEnd: readonly PathConditionView[];
  persona: PersonaResult;
  region: RegionCache;
  measures: readonly MeasureSummary[];
}

export interface SharedDiscussionInput {
  summaryIds: readonly string[];
  pathContinue: readonly PathConditionView[];
  pathEnd: readonly PathConditionView[];
  sharedNotes: readonly string[];
}

export interface ReportRequest {
  mode: "personal" | "discussion";
  payload: ReportViewModel | SharedDiscussionInput;
}

export interface ReportResponse {
  mode: "template" | "llm-overlay";
  report: ReportViewModel;
}

export interface WorkspaceParticipant {
  answers: Record<string, AnswerValue>;
  answersRevision: number;
  reportView: ReportViewModel | null;
  reportSourceRevision: number | null;
}

export interface WorkspaceDocument {
  schemaVersion: string;
  user: WorkspaceParticipant;
  partner: WorkspaceParticipant;
  shared: {
    discussion: SharedDiscussionInput | null;
  };
  deepDive: {
    completedModuleIds: readonly string[];
    skippedAll: boolean;
  };
  regionCache: RegionCache;
}
