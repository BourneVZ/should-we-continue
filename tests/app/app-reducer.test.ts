import { describe, expect, it } from "vitest";
import {
  createInitialAppState,
  reduceAppState,
} from "@/app/app-reducer";

describe("app reducer", () => {
  it("starts on the landing page before entering questionnaire flow", () => {
    const state = createInitialAppState({
      hasExistingReport: false,
      reportStale: false,
      canOpenPartnerDiscussion: false,
      redFlagLevel: "none",
    });

    expect(state.route).toBe("home");
  });

  it("blocks navigation when save has failed", () => {
    const state = reduceAppState(
      {
        ...createInitialAppState({
          hasExistingReport: false,
          reportStale: false,
          canOpenPartnerDiscussion: false,
          redFlagLevel: "none",
        }),
        route: "questionnaire",
        save: { status: "error", message: "save failed" },
      },
      { type: "NAVIGATE", route: "home" },
    );

    expect(state.route).toBe("questionnaire");
    expect(state.blockedReason).toBe("save-error");
  });

  it("routes R3/R4 directly to the safety-priority screen", () => {
    const state = reduceAppState(
      createInitialAppState({
        hasExistingReport: true,
        reportStale: false,
        canOpenPartnerDiscussion: true,
        redFlagLevel: "R4",
      }),
      { type: "COMPLETE_SAFETY_CHECK" },
    );

    expect(state.route).toBe("safety-priority");
  });

  it("requires explicit confirmation before skipping all deep dives", () => {
    const pending = reduceAppState(
      {
        ...createInitialAppState({
          hasExistingReport: false,
          reportStale: false,
          canOpenPartnerDiscussion: false,
          redFlagLevel: "none",
        }),
        route: "deep-dives",
      },
      { type: "REQUEST_SKIP_DEEP_DIVES" },
    );

    expect(pending.skipDeepDiveConfirmationOpen).toBe(true);

    const confirmed = reduceAppState(pending, { type: "CONFIRM_SKIP_DEEP_DIVES" });
    expect(confirmed.deepDiveExplicitlySkipped).toBe(true);
    expect(confirmed.route).toBe("report");
  });

  it("keeps stale reports from silently opening the old report", () => {
    const state = reduceAppState(
      createInitialAppState({
        hasExistingReport: true,
        reportStale: true,
        canOpenPartnerDiscussion: false,
        redFlagLevel: "none",
      }),
      { type: "COMPLETE_SAFETY_CHECK" },
    );

    expect(state.route).toBe("questionnaire");
    expect(state.reportStatus).toBe("stale");
  });

  it("keeps partner discussion gated until prerequisites are met", () => {
    const state = reduceAppState(
      {
        ...createInitialAppState({
          hasExistingReport: true,
          reportStale: false,
          canOpenPartnerDiscussion: false,
          redFlagLevel: "none",
        }),
        route: "report",
      },
      { type: "NAVIGATE", route: "partner-discussion" },
    );

    expect(state.route).toBe("report");
    expect(state.blockedReason).toBe("partner-discussion-locked");
  });
});
