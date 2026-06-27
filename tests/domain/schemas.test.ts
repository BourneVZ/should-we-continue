import { describe, expect, it } from "vitest";
import { WORKSPACE_SCHEMA_VERSION } from "@/config/version";
import { createReportViewModel, createSharedDiscussionInput, createWorkspaceDocument } from "../fixtures/factories";
import {
  parseRegionFieldCandidate,
  parseReportRequest,
  parseReportResponse,
  parseSharedDiscussionInput,
  parseWorkspaceDocument,
} from "@/domain/schemas";

describe("parseWorkspaceDocument", () => {
  it("accepts a valid workspace document", () => {
    const parsed = parseWorkspaceDocument(createWorkspaceDocument());
    expect(parsed.schemaVersion).toBe(WORKSPACE_SCHEMA_VERSION);
  });

  it("rejects unknown top-level fields", () => {
    expect(() =>
      parseWorkspaceDocument({
        ...createWorkspaceDocument(),
        unexpected: true,
      }),
    ).toThrow(/unknown field: unexpected/);
  });
});

describe("parseReportRequest", () => {
  it("accepts a personal report request", () => {
    const parsed = parseReportRequest({
      mode: "personal",
      payload: createReportViewModel(),
    });

    expect(parsed.mode).toBe("personal");
  });

  it("rejects an invalid mode", () => {
    expect(() =>
      parseReportRequest({
        mode: "other",
        payload: createReportViewModel(),
      }),
    ).toThrow(/invalid enum value/i);
  });
});

describe("parseReportResponse", () => {
  it("requires a report object", () => {
    expect(() =>
      parseReportResponse({
        mode: "template",
      }),
    ).toThrow(/missing required field: report/);
  });
});

describe("parseSharedDiscussionInput", () => {
  it("accepts a valid shared discussion input", () => {
    const parsed = parseSharedDiscussionInput(createSharedDiscussionInput());
    expect(parsed.summaryIds).toEqual([]);
  });

  it("rejects unknown fields", () => {
    expect(() =>
      parseSharedDiscussionInput({
        ...createSharedDiscussionInput(),
        extra: 1,
      }),
    ).toThrow(/unknown field: extra/);
  });
});

describe("parseRegionFieldCandidate", () => {
  it("rejects a candidate with a missing required field", () => {
    expect(() =>
      parseRegionFieldCandidate({
        fieldId: "policy-window",
        value: "48h",
        sourceUrl: "https://example.com",
        checkedAt: "2026-06-26T00:00:00.000Z",
      }),
    ).toThrow(/missing required field: applicableIf/);
  });
});
