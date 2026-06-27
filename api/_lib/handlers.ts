import type { ReportRequest, ReportResponse, ReportViewModel } from "../../src/domain/types";
import { buildPersonalReportPromptContext } from "./prompt-builders";
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

function lowerCertaintyOnce(
  certainty: ReportViewModel["certainty"],
  certaintyDelta: -1 | 0,
): ReportViewModel["certainty"] {
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

function buildReportPrompt(report: ReportViewModel): string {
  const context = buildPersonalReportPromptContext({ report });
  return [
    "你是一个严格遵守 JSON 输出约束的中文报告润色器。",
    "你不能修改红旗等级、路径条件、角色结果、维度结果或行动 ID，只能返回叙述层覆盖和最多一级的确定性下调。",
    "必须只输出一个 JSON 对象，不要输出 Markdown、解释文字或代码围栏。",
    "输出 schema：",
    '{',
    '  "certaintyDelta": -1 | 0,',
    '  "contradictionTypes": ["timeline_gap" | "support_mismatch" | "priority_conflict"],',
    '  "overlay": {',
    '    "sections": [',
    '      {',
    '        "sectionId": "overview" | "analysis" | "discussion",',
    '        "contentId": "RPT-OVERVIEW-INTRO" | "RPT-PATH-CONTINUE" | "RPT-PATH-END" | "RPT-COMMITMENT",',
    '        "variables": {},',
    '        "narrative": "不超过 120 字的简体中文说明"',
    "      }",
    "    ]",
    "  }",
    "}",
    "如果没有明显矛盾，请返回 certaintyDelta=0，contradictionTypes=[]，并至少提供 1 条 overview 段落。",
    `当前 certainty=${report.certainty}`,
    `可见 ID：${context.visibleIds.join(", ") || "none"}`,
    "可见事实：",
    context.visibleFacts || "none",
  ].join("\n");
}

function extractJsonCandidate(text: string): string {
  const fencedMatch = text.match(/```json\\s*([\\s\\S]*?)```/i) ?? text.match(/```\\s*([\\s\\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  return text;
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
    prompt: buildReportPrompt(baseReport),
  });

  if (llmResult.status !== "ok") {
    return toTemplateResponse(baseReport);
  }

  try {
    const parsed = JSON.parse(extractJsonCandidate(llmResult.text)) as {
      certaintyDelta?: unknown;
      contradictionTypes?: unknown;
      overlay?: unknown;
    };

    const analysis = parseModelAnalysisResult({
      certaintyDelta: parsed.certaintyDelta ?? 0,
      contradictionTypes: parsed.contradictionTypes ?? [],
    });
    parseNarrativeOverlay(parsed.overlay ?? { sections: [] });

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
