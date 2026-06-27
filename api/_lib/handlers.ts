import { parseReportResponse } from "@/domain/schemas";
import type { ReportRequest, ReportResponse, ReportViewModel } from "@/domain/types";
import { parseModelAnalysisResult, parseNarrativeOverlay } from "./request-parsers";

interface HandlerDependencies {
  llm: {
    complete(input: { modelRole: "analysis" | "report"; prompt: string }): Promise<
      | { status: "ok"; text: string }
      | { status: "unavailable"; errorCategory: "missing_config" }
      | { status: "error"; errorCategory: string }
    >;
  };
}

const CERTAINTY_ORDER: readonly ReportViewModel["certainty"][] = ["high", "medium", "low", "uncertain", "deferred"];

function lowerCertaintyOnce(certainty: ReportViewModel["certainty"], certaintyDelta: -1 | 0): ReportViewModel["certainty"] {
  if (certaintyDelta === 0) {
    return certainty;
  }
  const index = CERTAINTY_ORDER.indexOf(certainty);
  if (index === -1) {
    return certainty;
  }
  return CERTAINTY_ORDER[Math.min(index + 1, CERTAINTY_ORDER.length - 1)];
}

function toTemplateResponse(report: ReportViewModel): ReportResponse {
  return {
    mode: "template",
    report,
  };
}

export async function handleReportRequest(request: ReportRequest, { llm }: HandlerDependencies): Promise<ReportResponse> {
  if (request.mode === "discussion") {
    return toTemplateResponse({
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
    });
  }

  const baseReport = request.payload as ReportViewModel;
  const llmResult = await llm.complete({
    modelRole: "report",
    prompt: JSON.stringify({ certainty: baseReport.certainty }),
  });

  if (llmResult.status !== "ok") {
    return toTemplateResponse(baseReport);
  }

  try {
    const parsed = JSON.parse(llmResult.text) as {
      certaintyDelta?: unknown;
      contradictionTypes?: unknown;
      overlay?: unknown;
    };

    const analysis = parseModelAnalysisResult({
      certaintyDelta: parsed.certaintyDelta ?? 0,
      contradictionTypes: parsed.contradictionTypes ?? [],
    });
    parseNarrativeOverlay(parsed.overlay ?? { sections: [] });
    parseReportResponse({
      mode: "llm-overlay",
      report: {
        ...baseReport,
        certainty: lowerCertaintyOnce(baseReport.certainty, analysis.certaintyDelta),
      },
    });

    return {
      mode: "llm-overlay",
      report: {
        ...baseReport,
        certainty: lowerCertaintyOnce(baseReport.certainty, analysis.certaintyDelta),
      },
    };
  } catch {
    return toTemplateResponse(baseReport);
  }
}
