import type { ReportPlan } from "@/domain/types";

export function buildReportPlan(input: ReportPlan): ReportPlan {
  if (input.redFlag.level === "R3" || input.redFlag.level === "R4") {
    return {
      ...input,
      dimensions: [],
      priorityActionIds: [...input.redFlag.actionIds],
      pathContinue: [],
      pathEnd: [],
      persona: {
        primaryPersonaId: null,
        secondaryPersonaId: null,
        candidatePersonaIds: [],
        personaConfidence: 0,
        statusTagIds: [],
        suppressedReason: input.redFlag.personaSuppressedReason ?? "red_flag_R3_or_R4",
      },
      region: {
        status: "unavailable",
        checkedAt: null,
        expiresAt: null,
        verifiedFields: [],
      },
    };
  }

  return {
    ...input,
    priorityActionIds: [...input.priorityActionIds],
    pathContinue: [...input.pathContinue],
    pathEnd: [...input.pathEnd],
  };
}
