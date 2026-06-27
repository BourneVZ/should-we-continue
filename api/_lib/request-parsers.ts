import { REPORT_CONTENT } from "@/config/report/content";
import { parseReportRequest, parseRegionFieldCandidate } from "@/domain/schemas";
import type { RegionFieldCandidate, ReportRequest } from "@/domain/types";

const OVERLAY_SECTION_IDS = ["overview", "analysis", "discussion"] as const;
const CONTRADICTION_TYPES = ["timeline_gap", "support_mismatch", "priority_conflict"] as const;

type OverlaySectionId = (typeof OVERLAY_SECTION_IDS)[number];
type ContradictionType = (typeof CONTRADICTION_TYPES)[number];

export interface NarrativeOverlaySection {
  sectionId: OverlaySectionId;
  contentId: keyof typeof REPORT_CONTENT;
  variables: Record<string, unknown>;
  narrative: string;
}

export interface NarrativeOverlay {
  sections: readonly NarrativeOverlaySection[];
}

export interface ModelAnalysisResult {
  certaintyDelta: -1 | 0;
  contradictionTypes: readonly ContradictionType[];
}

export interface RegionRefreshRequest {
  regionId: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rejectUnknownFields(record: Record<string, unknown>, allowed: readonly string[]): void {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(record)) {
    if (!allowedSet.has(key)) {
      throw new Error(`unknown field: ${key}`);
    }
  }
}

function expectString(value: unknown, fieldName: string): string {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }
  return value;
}

export function parseReportHttpRequest(value: unknown): ReportRequest {
  return parseReportRequest(value);
}

export function parseNarrativeOverlay(value: unknown): NarrativeOverlay {
  if (!isRecord(value)) {
    throw new Error("overlay must be an object");
  }
  rejectUnknownFields(value, ["sections"]);
  if (!Array.isArray(value.sections)) {
    throw new Error("sections must be an array");
  }

  return {
    sections: value.sections.map((item) => {
      if (!isRecord(item)) {
        throw new Error("overlay section must be an object");
      }
      rejectUnknownFields(item, ["sectionId", "contentId", "variables", "narrative"]);

      const sectionId = expectString(item.sectionId, "sectionId");
      const contentId = expectString(item.contentId, "contentId");
      const narrative = expectString(item.narrative, "narrative");

      if (!OVERLAY_SECTION_IDS.includes(sectionId as OverlaySectionId)) {
        throw new Error("section id is not allowlisted");
      }
      if (!(contentId in REPORT_CONTENT)) {
        throw new Error("content id is not allowlisted");
      }
      if (narrative.length > 5000) {
        throw new Error("overlay narrative too long");
      }
      if (!isRecord(item.variables)) {
        throw new Error("variables must be an object");
      }

      return {
        sectionId: sectionId as OverlaySectionId,
        contentId: contentId as keyof typeof REPORT_CONTENT,
        variables: item.variables,
        narrative,
      };
    }),
  };
}

export function parseModelAnalysisResult(value: unknown): ModelAnalysisResult {
  if (!isRecord(value)) {
    throw new Error("model analysis must be an object");
  }
  rejectUnknownFields(value, ["certaintyDelta", "contradictionTypes"]);

  const certaintyDelta = value.certaintyDelta;
  if (certaintyDelta !== -1 && certaintyDelta !== 0) {
    throw new Error("certainty delta must be -1 or 0");
  }
  if (!Array.isArray(value.contradictionTypes)) {
    throw new Error("contradiction types must be an array");
  }

  const contradictionTypes = value.contradictionTypes.map((item) => {
    const contradictionType = expectString(item, "contradiction type");
    if (!CONTRADICTION_TYPES.includes(contradictionType as ContradictionType)) {
      throw new Error("unknown contradiction type");
    }
    return contradictionType as ContradictionType;
  });

  return {
    certaintyDelta,
    contradictionTypes,
  };
}

export function parseRegionCandidate(value: unknown): RegionFieldCandidate {
  return parseRegionFieldCandidate(value);
}

export function parseRegionRefreshRequest(value: unknown): RegionRefreshRequest {
  if (!isRecord(value)) {
    throw new Error("region refresh request must be an object");
  }
  rejectUnknownFields(value, ["regionId"]);

  return {
    regionId: expectString(value.regionId, "regionId"),
  };
}
