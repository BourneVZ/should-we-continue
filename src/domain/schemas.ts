import type {
  PathConditionView,
  RegionCache,
  RegionFieldCandidate,
  ReportRequest,
  ReportResponse,
  ReportViewModel,
  SharedDiscussionInput,
  WorkspaceDocument,
  WorkspaceParticipant,
} from "@/domain/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectRecord(value: unknown, name: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`${name} must be an object`);
  }
  return value;
}

function rejectUnknownFields(record: Record<string, unknown>, allowed: readonly string[]): void {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(record)) {
    if (!allowedSet.has(key)) {
      throw new Error(`unknown field: ${key}`);
    }
  }
}

function requireField<T>(record: Record<string, unknown>, key: string): T {
  if (!(key in record)) {
    throw new Error(`missing required field: ${key}`);
  }
  return record[key] as T;
}

function expectString(value: unknown, fieldName: string): string {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }
  return value;
}

function expectNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${fieldName} must be a number`);
  }
  return value;
}

function expectStringArray(value: unknown, fieldName: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${fieldName} must be an array of strings`);
  }
  return [...value];
}

function parsePathConditionView(value: unknown): PathConditionView {
  const record = expectRecord(value, "path condition");
  rejectUnknownFields(record, ["conditionId", "status", "derivedStatus", "readingStatus", "labelId"]);

  const status = expectString(requireField(record, "status"), "path condition status");
  if (!["confirmed", "pending", "deferred"].includes(status)) {
    throw new Error("invalid enum value for path condition status");
  }
  const derivedStatus =
    record.derivedStatus === undefined
      ? status === "confirmed"
        ? "confirmed"
        : "pending"
      : expectString(record.derivedStatus, "path condition derivedStatus");
  if (!["confirmed", "pending"].includes(derivedStatus)) {
    throw new Error("invalid enum value for path condition derivedStatus");
  }
  const readingStatus =
    record.readingStatus === undefined
      ? status
      : expectString(record.readingStatus, "path condition readingStatus");
  if (!["confirmed", "pending", "deferred"].includes(readingStatus)) {
    throw new Error("invalid enum value for path condition readingStatus");
  }

  return {
    conditionId: expectString(requireField(record, "conditionId"), "conditionId"),
    status: status as PathConditionView["status"],
    derivedStatus: derivedStatus as PathConditionView["derivedStatus"],
    readingStatus: readingStatus as PathConditionView["readingStatus"],
    labelId: expectString(requireField(record, "labelId"), "labelId"),
  };
}

function parseReportDimensionView(value: unknown): ReportViewModel["dimensions"][number] {
  const record = expectRecord(value, "report dimension");
  rejectUnknownFields(record, ["dimensionId", "displayLevel", "certaintyLevel", "recommendedModuleId", "reasonIds"]);

  const displayLevel = expectString(requireField(record, "displayLevel"), "displayLevel");
  if (!["high", "medium", "low", "insufficient"].includes(displayLevel)) {
    throw new Error("invalid enum value for dimension displayLevel");
  }

  const certaintyLevel =
    record.certaintyLevel === undefined ? "medium" : expectString(record.certaintyLevel, "certaintyLevel");
  if (!["high", "medium", "low", "uncertain", "deferred"].includes(certaintyLevel)) {
    throw new Error("invalid enum value for dimension certaintyLevel");
  }

  return {
    dimensionId: expectString(requireField(record, "dimensionId"), "dimensionId") as ReportViewModel["dimensions"][number]["dimensionId"],
    displayLevel: displayLevel as ReportViewModel["dimensions"][number]["displayLevel"],
    certaintyLevel: certaintyLevel as ReportViewModel["dimensions"][number]["certaintyLevel"],
    recommendedModuleId:
      record.recommendedModuleId === undefined
        ? undefined
        : expectString(record.recommendedModuleId, "recommendedModuleId"),
    reasonIds: expectStringArray(requireField(record, "reasonIds"), "reasonIds"),
  };
}

function parseRegionCache(value: unknown): RegionCache {
  const record = expectRecord(value, "region cache");
  rejectUnknownFields(record, ["status", "checkedAt", "expiresAt", "verifiedFields"]);

  const status = expectString(requireField(record, "status"), "region status");
  if (!["empty", "fresh", "stale", "conflict", "unavailable"].includes(status)) {
    throw new Error("invalid enum value for region status");
  }

  const checkedAt = record.checkedAt;
  const expiresAt = record.expiresAt;
  const verifiedFieldsValue = requireField(record, "verifiedFields");

  if (checkedAt !== null && typeof checkedAt !== "string") {
    throw new Error("checkedAt must be a string or null");
  }
  if (expiresAt !== null && typeof expiresAt !== "string") {
    throw new Error("expiresAt must be a string or null");
  }
  if (!Array.isArray(verifiedFieldsValue)) {
    throw new Error("verifiedFields must be an array");
  }

  return {
    status: status as RegionCache["status"],
    checkedAt: checkedAt ?? null,
    expiresAt: expiresAt ?? null,
    verifiedFields: verifiedFieldsValue.map(parseRegionFieldCandidate),
  };
}

function parseReportViewModel(value: unknown): ReportViewModel {
  const record = expectRecord(value, "report");
  rejectUnknownFields(record, [
    "redFlag",
    "dimensions",
    "certainty",
    "priorityActionIds",
    "pathContinue",
    "pathEnd",
    "persona",
    "region",
    "measures",
  ]);

  const redFlagRecord = expectRecord(requireField(record, "redFlag"), "redFlag");
  rejectUnknownFields(redFlagRecord, ["level", "actionIds"]);

  const redFlagLevel = expectString(requireField(redFlagRecord, "level"), "redFlag.level");
  if (!["none", "R1", "R2", "R3", "R4"].includes(redFlagLevel)) {
    throw new Error("invalid enum value for redFlag.level");
  }

  const personaRecord = expectRecord(requireField(record, "persona"), "persona");
  rejectUnknownFields(personaRecord, [
    "primaryPersonaId",
    "secondaryPersonaId",
    "candidatePersonaIds",
    "personaConfidence",
    "statusTagIds",
    "suppressedReason",
  ]);

  return {
    redFlag: {
      level: redFlagLevel as ReportViewModel["redFlag"]["level"],
      actionIds: expectStringArray(requireField(redFlagRecord, "actionIds"), "redFlag.actionIds"),
    },
    dimensions: Array.isArray(requireField(record, "dimensions"))
      ? (record.dimensions as unknown[]).map(parseReportDimensionView)
      : (() => {
          throw new Error("dimensions must be an array");
        })(),
    certainty: expectString(requireField(record, "certainty"), "certainty") as ReportViewModel["certainty"],
    priorityActionIds: expectStringArray(requireField(record, "priorityActionIds"), "priorityActionIds"),
    pathContinue: Array.isArray(requireField(record, "pathContinue"))
      ? (record.pathContinue as unknown[]).map(parsePathConditionView)
      : (() => {
          throw new Error("pathContinue must be an array");
        })(),
    pathEnd: Array.isArray(requireField(record, "pathEnd"))
      ? (record.pathEnd as unknown[]).map(parsePathConditionView)
      : (() => {
          throw new Error("pathEnd must be an array");
        })(),
    persona: {
      primaryPersonaId:
        personaRecord.primaryPersonaId === null
          ? null
          : expectString(personaRecord.primaryPersonaId, "persona.primaryPersonaId"),
      secondaryPersonaId:
        personaRecord.secondaryPersonaId === null
          ? null
          : expectString(personaRecord.secondaryPersonaId, "persona.secondaryPersonaId"),
      candidatePersonaIds: expectStringArray(
        requireField(personaRecord, "candidatePersonaIds"),
        "persona.candidatePersonaIds",
      ),
      personaConfidence: expectNumber(
        requireField(personaRecord, "personaConfidence"),
        "persona.personaConfidence",
      ),
      statusTagIds: expectStringArray(requireField(personaRecord, "statusTagIds"), "persona.statusTagIds"),
      suppressedReason:
        personaRecord.suppressedReason === null
          ? null
          : expectString(personaRecord.suppressedReason, "persona.suppressedReason"),
    },
    region: parseRegionCache(requireField(record, "region")),
    measures: Array.isArray(requireField(record, "measures")) ? [] : (() => {
      throw new Error("measures must be an array");
    })(),
  };
}

function parseWorkspaceParticipant(value: unknown): WorkspaceParticipant {
  const record = expectRecord(value, "workspace participant");
  rejectUnknownFields(record, ["answers", "answersRevision", "reportView", "reportSourceRevision"]);

  const answers = requireField(record, "answers");
  if (!isRecord(answers)) {
    throw new Error("answers must be an object");
  }

  const reportViewValue = requireField(record, "reportView");
  const reportSourceRevision = requireField(record, "reportSourceRevision");

  if (reportSourceRevision !== null && typeof reportSourceRevision !== "number") {
    throw new Error("reportSourceRevision must be a number or null");
  }

  return {
    answers: answers as WorkspaceParticipant["answers"],
    answersRevision: expectNumber(requireField(record, "answersRevision"), "answersRevision"),
    reportView: reportViewValue === null ? null : parseReportViewModel(reportViewValue),
    reportSourceRevision: reportSourceRevision ?? null,
  };
}

export function parseRegionFieldCandidate(value: unknown): RegionFieldCandidate {
  const record = expectRecord(value, "region field candidate");
  rejectUnknownFields(record, ["fieldId", "value", "sourceUrl", "checkedAt", "applicableIf", "uncertaintyNote"]);

  return {
    fieldId: expectString(requireField(record, "fieldId"), "fieldId"),
    value: expectString(requireField(record, "value"), "value"),
    sourceUrl: expectString(requireField(record, "sourceUrl"), "sourceUrl"),
    checkedAt: expectString(requireField(record, "checkedAt"), "checkedAt"),
    applicableIf: expectStringArray(requireField(record, "applicableIf"), "applicableIf"),
    uncertaintyNote:
      record.uncertaintyNote === undefined
        ? undefined
        : expectString(record.uncertaintyNote, "uncertaintyNote"),
  };
}

export function parseSharedDiscussionInput(value: unknown): SharedDiscussionInput {
  const record = expectRecord(value, "shared discussion input");
  rejectUnknownFields(record, ["summaryIds", "pathContinue", "pathEnd", "sharedNotes"]);

  const pathContinue = requireField(record, "pathContinue");
  const pathEnd = requireField(record, "pathEnd");

  if (!Array.isArray(pathContinue) || !Array.isArray(pathEnd)) {
    throw new Error("pathContinue and pathEnd must be arrays");
  }

  return {
    summaryIds: expectStringArray(requireField(record, "summaryIds"), "summaryIds"),
    pathContinue: pathContinue.map(parsePathConditionView),
    pathEnd: pathEnd.map(parsePathConditionView),
    sharedNotes: expectStringArray(requireField(record, "sharedNotes"), "sharedNotes"),
  };
}

export function parseWorkspaceDocument(value: unknown): WorkspaceDocument {
  const record = expectRecord(value, "workspace document");
  rejectUnknownFields(record, ["schemaVersion", "user", "partner", "shared", "deepDive", "regionCache"]);

  const sharedRecord = expectRecord(requireField(record, "shared"), "shared");
  rejectUnknownFields(sharedRecord, ["discussion"]);

  const discussionValue = requireField(sharedRecord, "discussion");
  const deepDiveRecord = record.deepDive === undefined ? { completedModuleIds: [], skippedAll: false } : expectRecord(record.deepDive, "deepDive");
  rejectUnknownFields(deepDiveRecord, ["completedModuleIds", "skippedAll"]);

  const skippedAll = requireField(deepDiveRecord, "skippedAll");
  if (typeof skippedAll !== "boolean") {
    throw new Error("deepDive.skippedAll must be a boolean");
  }

  return {
    schemaVersion: expectString(requireField(record, "schemaVersion"), "schemaVersion"),
    user: parseWorkspaceParticipant(requireField(record, "user")),
    partner: parseWorkspaceParticipant(requireField(record, "partner")),
    shared: {
      discussion: discussionValue === null ? null : parseSharedDiscussionInput(discussionValue),
    },
    deepDive: {
      completedModuleIds: expectStringArray(
        requireField(deepDiveRecord, "completedModuleIds"),
        "deepDive.completedModuleIds",
      ),
      skippedAll,
    },
    regionCache: parseRegionCache(requireField(record, "regionCache")),
  };
}

export function parseReportRequest(value: unknown): ReportRequest {
  const record = expectRecord(value, "report request");
  rejectUnknownFields(record, ["mode", "payload"]);

  const mode = expectString(requireField(record, "mode"), "mode");
  if (mode !== "personal" && mode !== "discussion") {
    throw new Error("invalid enum value for mode");
  }

  return {
    mode,
    payload:
      mode === "personal"
        ? parseReportViewModel(requireField(record, "payload"))
        : parseSharedDiscussionInput(requireField(record, "payload")),
  };
}

export function parseReportResponse(value: unknown): ReportResponse {
  const record = expectRecord(value, "report response");
  rejectUnknownFields(record, ["mode", "report"]);

  const mode = expectString(requireField(record, "mode"), "mode");
  if (mode !== "template" && mode !== "llm-overlay") {
    throw new Error("invalid enum value for mode");
  }

  return {
    mode,
    report: parseReportViewModel(requireField(record, "report")),
  };
}
