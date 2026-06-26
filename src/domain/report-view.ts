import type { ReportPlan, ReportViewModel } from "@/domain/types";

export function buildReportViewModel(plan: ReportPlan): ReportViewModel {
  return {
    redFlag: {
      level: plan.redFlag.level,
      actionIds: [...plan.redFlag.actionIds],
    },
    dimensions: [...plan.dimensions],
    certainty: plan.certainty,
    priorityActionIds: [...plan.priorityActionIds],
    pathContinue: [...plan.pathContinue],
    pathEnd: [...plan.pathEnd],
    persona: plan.persona,
    region: plan.region,
    measures: [...plan.measures],
  };
}
