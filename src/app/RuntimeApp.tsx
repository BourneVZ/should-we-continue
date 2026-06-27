import { useReducer, useState } from "react";
import type { ReactNode } from "react";
import { App } from "@/app/App";
import { reduceAppState } from "@/app/app-reducer";
import type { AppState } from "@/app/app-reducer";
import type { AppServices } from "@/app/services";
import { CORE_MODULE_IDS, DEEP_DIVE_MODULE_IDS, QUESTION_CATALOG } from "@/config/questionnaire";
import { getModuleLabel } from "@/config/questionnaire/_shared";
import { REGION_CONFIG, REGION_STATIC_FIELDS } from "@/config/region/hangzhou-bingjiang";
import { RECOMMENDATION_CONFIG } from "@/config/scoring/recommendations";
import { PERSONA_CATALOG, PERSONA_STATUS_TAGS } from "@/config/personas/catalog";
import { PERSONA_MAPPING } from "@/config/personas/mapping";
import { PATH_CONDITION_CONFIG } from "@/config/scoring/path-conditions";
import { SCORING_DIMENSIONS } from "@/config/scoring/dimensions";
import { SAFETY_RULES } from "@/config/scoring/safety";
import { QuestionnaireScreen } from "@/features/questionnaire/QuestionnaireScreen";
import { getAnswerStatus } from "@/domain/answers";
import { calculatePersonaResult } from "@/domain/personas";
import { buildPathConditionChecklists } from "@/domain/path-conditions";
import { getQuestionnaireSnapshot, validateQuestionPage } from "@/domain/questionnaire";
import { getDeepDiveRecommendations } from "@/domain/recommendations";
import { buildStaticRegionCache } from "@/domain/region";
import { calculateSupportScores, toReportDimensions } from "@/domain/scoring";
import { evaluateSafety } from "@/domain/safety";
import type { AnswerValue, ReportViewModel, WorkspaceDocument } from "@/domain/types";
import type { DeepDiveModuleEntry, SuggestedQuestionLink } from "@/features/report/AnalysisPage";
import { createRuntimeSnapshot } from "./runtime-state";

interface RuntimeAppProps {
  services: AppServices;
  diagnosticsPanel?: ReactNode;
}

const DIMENSION_PRIORITY_ACTIONS: Partial<Record<(typeof SCORING_DIMENSIONS)[number]["dimensionId"], string>> = {
  lifeDevelopmentSupport: "ACT-LIFE-DEVELOPMENT-PRIORITY",
  personalWillClaritySupport: "ACT-CLARIFY-WILL",
  medicalSafetySupport: "ACT-CLARIFY-MEDICAL",
  autonomySafetySupport: "ACT-CLARIFY-AUTONOMY",
  mentalHealthSupport: "ACT-CLARIFY-MENTAL",
};

function getFirstIncompleteLocation(answers: WorkspaceDocument["user"]["answers"]): {
  moduleIndex: number;
  pageIndex: number;
} {
  for (const [moduleIndex, moduleId] of CORE_MODULE_IDS.entries()) {
    const snapshot = getQuestionnaireSnapshot({
      questions: QUESTION_CATALOG,
      answers,
      moduleId,
    });

    const pageIndex = snapshot.pages.findIndex((page) =>
      page.some((question) => getAnswerStatus(answers[question.answerKey]) === "unanswered"),
    );

    if (pageIndex >= 0) {
      return { moduleIndex, pageIndex };
    }
  }

  return { moduleIndex: 0, pageIndex: 0 };
}

function getPriorityActionIds(
  safetyActionIds: readonly string[],
  dimensions: ReturnType<typeof calculateSupportScores>["dimensions"],
): string[] {
  const rankedDimensionActions = dimensions
    .filter((dimension) => dimension.displayLevel === "low" || dimension.displayLevel === "insufficient")
    .sort((left, right) => left.supportScore - right.supportScore)
    .map((dimension) => DIMENSION_PRIORITY_ACTIONS[dimension.dimensionId])
    .filter((actionId): actionId is string => typeof actionId === "string");

  return [...new Set([...safetyActionIds, ...rankedDimensionActions])].slice(0, 4);
}

export function RuntimeApp({ services, diagnosticsPanel }: RuntimeAppProps) {
  const initialSnapshot = createRuntimeSnapshot(services.repository.load());
  const [workspace, setWorkspace] = useState<WorkspaceDocument>(initialSnapshot.workspace);
  const [report, setReport] = useState<ReportViewModel>(initialSnapshot.report);
  const [appState, dispatch] = useReducer(reduceAppState, initialSnapshot.state);
  const [moduleIndex, setModuleIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "analysis" | "partner">("overview");
  const [activeDeepDiveModuleId, setActiveDeepDiveModuleId] = useState<string | null>(null);

  const hasSavedAnswers = workspace.user.answersRevision > 0;
  const hasGeneratedReport = workspace.user.reportView !== null;
  const reportNeedsRefresh =
    hasSavedAnswers &&
    (workspace.user.reportView === null ||
      (workspace.user.reportSourceRevision !== null &&
        workspace.user.reportSourceRevision !== workspace.user.answersRevision));

  const viewState: AppState = {
    ...appState,
    redFlagLevel: report.redFlag.level,
    hasExistingReport: hasSavedAnswers || hasGeneratedReport,
    reportStatus: !hasSavedAnswers && !hasGeneratedReport ? "none" : reportNeedsRefresh ? "stale" : "fresh",
    canOpenPartnerDiscussion: workspace.shared.discussion !== null,
  };

  const currentModuleId = activeDeepDiveModuleId ?? CORE_MODULE_IDS[moduleIndex] ?? CORE_MODULE_IDS[0];
  const questionnaireSnapshot = getQuestionnaireSnapshot({
    questions: QUESTION_CATALOG,
    answers: workspace.user.answers,
    moduleId: currentModuleId,
  });
  const currentPage = questionnaireSnapshot.pages[pageIndex] ?? [];

  function persistWorkspace(nextWorkspace: WorkspaceDocument, nextReport: ReportViewModel) {
    const result = services.repository.save(nextWorkspace);
    if (!result.ok) {
      dispatch({ type: "SAVE_FAILED", message: "本地保存失败，请先重试保存后再继续。" });
      return false;
    }

    setWorkspace(nextWorkspace);
    setReport(nextReport);
    dispatch({ type: "SAVE_SUCCEEDED" });
    return true;
  }

  function buildReportFromAnswers(answers: WorkspaceDocument["user"]["answers"]): ReportViewModel {
    const safety = evaluateSafety(answers, SAFETY_RULES);
    const scoring = calculateSupportScores(answers, SCORING_DIMENSIONS);
    const dimensions = toReportDimensions(scoring.dimensions);
    const pathConditions = buildPathConditionChecklists(PATH_CONDITION_CONFIG);
    const persona = calculatePersonaResult(
      answers,
      scoring.dimensions,
      safety,
      PERSONA_MAPPING,
      PERSONA_CATALOG,
      PERSONA_STATUS_TAGS,
    );

    return {
      redFlag: {
        level: safety.level,
        actionIds: safety.actionIds,
      },
      dimensions,
      certainty: dimensions.length > 0 ? "medium" : "uncertain",
      priorityActionIds: getPriorityActionIds(safety.actionIds, scoring.dimensions),
      pathContinue: pathConditions.continuePath,
      pathEnd: pathConditions.endPath,
      persona,
      region:
        workspace.regionCache.verifiedFields.length > 0
          ? workspace.regionCache
          : buildStaticRegionCache(REGION_STATIC_FIELDS, new Date().toISOString().slice(0, 10), REGION_CONFIG.cacheTtlDays),
      measures: [],
    };
  }

  async function generatePersonalReport(baseReport: ReportViewModel): Promise<ReportViewModel> {
    const result = await services.apiClient.generatePersonalReport({
      report: baseReport,
      workspaceSnapshot: {
        answersRevision: workspace.user.answersRevision,
      },
    });

    if (!result.ok) {
      return baseReport;
    }

    return result.response.report;
  }

  function navigateToQuestionnaire() {
    const nextLocation = getFirstIncompleteLocation(workspace.user.answers);
    setActiveDeepDiveModuleId(null);
    setModuleIndex(nextLocation.moduleIndex);
    setPageIndex(nextLocation.pageIndex);
    dispatch({ type: "NAVIGATE", route: "questionnaire" });
  }

  function navigateToDeepDiveModule(moduleId: string) {
    setActiveDeepDiveModuleId(moduleId);
    setPageIndex(0);
    dispatch({ type: "NAVIGATE", route: "questionnaire" });
  }

  function navigateToQuestion(answerKey: string) {
    for (const [nextModuleIndex, moduleId] of CORE_MODULE_IDS.entries()) {
      const snapshot = getQuestionnaireSnapshot({
        questions: QUESTION_CATALOG,
        answers: workspace.user.answers,
        moduleId,
      });
      const nextPageIndex = snapshot.pages.findIndex((page) =>
        page.some((question) => question.answerKey === answerKey),
      );
      if (nextPageIndex >= 0) {
        setModuleIndex(nextModuleIndex);
        setActiveDeepDiveModuleId(null);
        setPageIndex(nextPageIndex);
        dispatch({ type: "NAVIGATE", route: "questionnaire" });
        return;
      }
    }

    navigateToQuestionnaire();
  }

  function buildSuggestedQuestionLinks(): readonly SuggestedQuestionLink[] {
    const suggestions: SuggestedQuestionLink[] = [];

    for (const moduleId of CORE_MODULE_IDS) {
      const snapshot = getQuestionnaireSnapshot({
        questions: QUESTION_CATALOG,
        answers: workspace.user.answers,
        moduleId,
      });

      for (const page of snapshot.pages) {
        const question = page.find(
          (item) =>
            item.required &&
            item.questionType !== "freeText" &&
            getAnswerStatus(workspace.user.answers[item.answerKey]) === "unanswered",
        );
        if (question) {
          suggestions.push({
            answerKey: question.answerKey,
            label: question.title,
            moduleLabel: getModuleLabel(question.moduleId),
            onSelect: () => navigateToQuestion(question.answerKey),
          });
        }
        if (suggestions.length >= 5) {
          return suggestions;
        }
      }
    }

    return suggestions;
  }

  function buildDeepDiveModules(): readonly DeepDiveModuleEntry[] {
    const scoring = calculateSupportScores(workspace.user.answers, SCORING_DIMENSIONS);
    const recommendedIds = getDeepDiveRecommendations(scoring.dimensions, RECOMMENDATION_CONFIG);
    const fallbackIds = ["medical-deep", "mental-deep", "values-deep"];
    const moduleIds = [...new Set([...recommendedIds, ...fallbackIds])].filter((moduleId) =>
      DEEP_DIVE_MODULE_IDS.includes(moduleId as (typeof DEEP_DIVE_MODULE_IDS)[number]),
    );

    return moduleIds.slice(0, 4).map((moduleId) => {
      const snapshot = getQuestionnaireSnapshot({
        questions: QUESTION_CATALOG,
        answers: workspace.user.answers,
        moduleId,
      });

      return {
        moduleId,
        title: getModuleLabel(moduleId),
        estimatedQuestions: snapshot.totalVisibleCount,
        purpose: "补齐更细的现实条件、支持安排和行动清单。",
        onSelect: () => navigateToDeepDiveModule(moduleId),
      };
    });
  }

  async function ensureLatestReportAndOpen() {
    if (!hasSavedAnswers && workspace.user.reportView === null) {
      return;
    }

    if (!reportNeedsRefresh && workspace.user.reportView !== null) {
      setReport(workspace.user.reportView);
      setActiveTab("overview");
      dispatch({ type: "NAVIGATE", route: "report" });
      return;
    }

    const nextTemplateReport = buildReportFromAnswers(workspace.user.answers);
    const nextReport = await generatePersonalReport(nextTemplateReport);
    const nextWorkspace: WorkspaceDocument = {
      ...workspace,
      user: {
        ...workspace.user,
        reportView: nextReport,
        reportSourceRevision: workspace.user.answersRevision,
      },
    };

    if (!persistWorkspace(nextWorkspace, nextReport)) {
      return;
    }

    setActiveTab("overview");
    dispatch({ type: "NAVIGATE", route: "report" });
  }

  function handleAnswerChange(answerKey: string, value: AnswerValue) {
    dispatch({ type: "SAVE_STARTED" });
    const nextWorkspace: WorkspaceDocument = {
      ...workspace,
      user: {
        ...workspace.user,
        answers: {
          ...workspace.user.answers,
          [answerKey]: value,
        },
        answersRevision: workspace.user.answersRevision + 1,
        reportSourceRevision: null,
      },
      shared: {
        discussion: null,
      },
    };

    persistWorkspace(nextWorkspace, report);
  }

  async function handleNextQuestionPage() {
    const validation = validateQuestionPage(currentPage, workspace.user.answers);
    if (!validation.ok) {
      dispatch({ type: "SAVE_FAILED", message: "请先完成当前这道必答题。" });
      return;
    }

    const lastPage = pageIndex >= questionnaireSnapshot.pages.length - 1;
    const lastModule = moduleIndex >= CORE_MODULE_IDS.length - 1;
    if (activeDeepDiveModuleId && lastPage) {
      const nextTemplateReport = buildReportFromAnswers(workspace.user.answers);
      const nextReport = await generatePersonalReport(nextTemplateReport);
      const nextWorkspace: WorkspaceDocument = {
        ...workspace,
        user: {
          ...workspace.user,
          reportView: nextReport,
          reportSourceRevision: workspace.user.answersRevision,
        },
      };

      if (!persistWorkspace(nextWorkspace, nextReport)) {
        return;
      }

      setActiveTab("overview");
      setActiveDeepDiveModuleId(null);
      dispatch({ type: "NAVIGATE", route: "report" });
      return;
    }

    if (lastPage && lastModule) {
      const nextTemplateReport = buildReportFromAnswers(workspace.user.answers);
      const nextReport = await generatePersonalReport(nextTemplateReport);
      const nextWorkspace: WorkspaceDocument = {
        ...workspace,
        user: {
          ...workspace.user,
          reportView: nextReport,
          reportSourceRevision: workspace.user.answersRevision,
        },
      };

      if (!persistWorkspace(nextWorkspace, nextReport)) {
        return;
      }

      setActiveTab("overview");
      dispatch({ type: "NAVIGATE", route: "report" });
      return;
    }

    dispatch({ type: "SAVE_SUCCEEDED" });
    if (lastPage) {
      setModuleIndex((current) => current + 1);
      setPageIndex(0);
      return;
    }
    setPageIndex((current) => current + 1);
  }

  function handleBackQuestionPage() {
    if (pageIndex > 0) {
      setPageIndex((current) => current - 1);
      return;
    }

    if (activeDeepDiveModuleId) {
      setActiveDeepDiveModuleId(null);
      setActiveTab("analysis");
      dispatch({ type: "NAVIGATE", route: "report" });
      return;
    }

    if (moduleIndex > 0) {
      const previousModuleId = CORE_MODULE_IDS[moduleIndex - 1];
      const previousSnapshot = getQuestionnaireSnapshot({
        questions: QUESTION_CATALOG,
        answers: workspace.user.answers,
        moduleId: previousModuleId,
      });
      setModuleIndex((current) => current - 1);
      setPageIndex(Math.max(previousSnapshot.pages.length - 1, 0));
      return;
    }

    dispatch({ type: "NAVIGATE", route: "home" });
  }

  function handleClearData() {
    services.repository.clear("all");
    const nextSnapshot = createRuntimeSnapshot(null);
    setWorkspace(nextSnapshot.workspace);
    setReport(nextSnapshot.report);
    setModuleIndex(0);
    setPageIndex(0);
    setActiveDeepDiveModuleId(null);
    setActiveTab("overview");
    dispatch({ type: "NAVIGATE", route: "home" });
  }

  if (appState.route === "questionnaire") {
    return (
      <QuestionnaireScreen
        title={getModuleLabel(currentModuleId)}
        questions={currentPage}
        answers={workspace.user.answers}
        progressLabel={`已完成 ${questionnaireSnapshot.answeredCount} / ${questionnaireSnapshot.totalVisibleCount}`}
        pageRangeLabel={`第 ${pageIndex + 1} 题，共 ${questionnaireSnapshot.pages.length} 题`}
        saveStatus={appState.save.status}
        onAnswerChange={handleAnswerChange}
        onNext={handleNextQuestionPage}
        onBack={handleBackQuestionPage}
      />
    );
  }

  return (
    <App
      state={viewState}
      report={report}
      services={services}
      diagnosticsPanel={diagnosticsPanel}
      activeReportTab={activeTab}
      onCompleteSafetyCheck={() => dispatch({ type: "COMPLETE_SAFETY_CHECK" })}
      onStartOrResume={navigateToQuestionnaire}
      onOpenLatestReport={ensureLatestReportAndOpen}
      onClearData={handleClearData}
      onReturnFromSafetyPriority={() => dispatch({ type: "NAVIGATE", route: "home" })}
      onContinueSafely={navigateToQuestionnaire}
      onOpenOverview={() => setActiveTab("overview")}
      onOpenAnalysis={() => setActiveTab("analysis")}
      onOpenPartnerDiscussion={() => setActiveTab("partner")}
      onReturnHome={() => dispatch({ type: "NAVIGATE", route: "home" })}
      suggestedQuestionLinks={buildSuggestedQuestionLinks()}
      deepDiveModules={buildDeepDiveModules()}
    />
  );
}
