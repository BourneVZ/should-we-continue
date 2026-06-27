import type { RedFlagLevel } from "@/domain/types";

export type AppRoute =
  | "home"
  | "safety-check"
  | "questionnaire"
  | "deep-dives"
  | "report"
  | "partner-discussion"
  | "safety-priority";

export interface AppState {
  route: AppRoute;
  redFlagLevel: RedFlagLevel;
  save: { status: "idle" | "saving" | "saved" | "error"; message?: string };
  hasExistingReport: boolean;
  reportStatus: "none" | "fresh" | "stale";
  canOpenPartnerDiscussion: boolean;
  skipDeepDiveConfirmationOpen: boolean;
  deepDiveExplicitlySkipped: boolean;
  blockedReason: string | null;
}

export type AppAction =
  | { type: "COMPLETE_SAFETY_CHECK" }
  | { type: "NAVIGATE"; route: AppRoute }
  | { type: "REQUEST_SKIP_DEEP_DIVES" }
  | { type: "CONFIRM_SKIP_DEEP_DIVES" }
  | { type: "CANCEL_SKIP_DEEP_DIVES" }
  | { type: "SAVE_STARTED" }
  | { type: "SAVE_SUCCEEDED" }
  | { type: "SAVE_FAILED"; message: string };

export function createInitialAppState(input: {
  hasExistingReport: boolean;
  reportStale: boolean;
  canOpenPartnerDiscussion: boolean;
  redFlagLevel: RedFlagLevel;
}): AppState {
  return {
    route: "safety-check",
    redFlagLevel: input.redFlagLevel,
    save: { status: "idle" },
    hasExistingReport: input.hasExistingReport,
    reportStatus: input.hasExistingReport ? (input.reportStale ? "stale" : "fresh") : "none",
    canOpenPartnerDiscussion: input.canOpenPartnerDiscussion,
    skipDeepDiveConfirmationOpen: false,
    deepDiveExplicitlySkipped: false,
    blockedReason: null,
  };
}

export function reduceAppState(state: AppState, action: AppAction): AppState {
  if (action.type === "SAVE_STARTED") {
    return { ...state, save: { status: "saving" }, blockedReason: null };
  }
  if (action.type === "SAVE_SUCCEEDED") {
    return { ...state, save: { status: "saved" }, blockedReason: null };
  }
  if (action.type === "SAVE_FAILED") {
    return { ...state, save: { status: "error", message: action.message }, blockedReason: "save-error" };
  }

  if (state.save.status === "error" && action.type === "NAVIGATE") {
    return { ...state, blockedReason: "save-error" };
  }

  switch (action.type) {
    case "COMPLETE_SAFETY_CHECK":
      if (state.redFlagLevel === "R3" || state.redFlagLevel === "R4") {
        return { ...state, route: "safety-priority", blockedReason: null };
      }
      return {
        ...state,
        route: "home",
        blockedReason: null,
      };
    case "NAVIGATE":
      if (action.route === "partner-discussion" && !state.canOpenPartnerDiscussion) {
        return { ...state, blockedReason: "partner-discussion-locked" };
      }
      if (action.route === "report" && state.reportStatus === "stale") {
        return { ...state, route: "home", blockedReason: null };
      }
      return { ...state, route: action.route, blockedReason: null };
    case "REQUEST_SKIP_DEEP_DIVES":
      return { ...state, skipDeepDiveConfirmationOpen: true, blockedReason: null };
    case "CONFIRM_SKIP_DEEP_DIVES":
      return {
        ...state,
        deepDiveExplicitlySkipped: true,
        skipDeepDiveConfirmationOpen: false,
        route: "report",
        blockedReason: null,
      };
    case "CANCEL_SKIP_DEEP_DIVES":
      return { ...state, skipDeepDiveConfirmationOpen: false, blockedReason: null };
    default:
      return state;
  }
}
