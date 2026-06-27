import { QUESTION_CATALOG } from "@/config/questionnaire";
import { getModuleLabel } from "@/config/questionnaire/_shared";
import { PERSONA_CATALOG } from "@/config/personas/catalog";
import type { PathConditionView, ReportDimensionView } from "@/domain/types";

const QUESTION_LABELS = new Map(QUESTION_CATALOG.map((question) => [question.answerKey, question.title] as const));

const DIMENSION_LABELS: Readonly<Record<ReportDimensionView["dimensionId"], string>> = {
  medicalSafetySupport: "医学安全确认",
  autonomySafetySupport: "自主与安全边界",
  mentalHealthSupport: "情绪与心理承托",
  partnerCommitmentSupport: "伴侣承诺可靠度",
  familySocialSupport: "家庭与外部支持",
  financialPolicySupport: "经济与政策准备",
  lifeDevelopmentSupport: "人生发展与节奏",
  childcareLoadSupport: "现有照料负荷",
  personalWillClaritySupport: "个人意愿清晰度",
};

const LEVEL_LABELS: Readonly<Record<ReportDimensionView["displayLevel"], string>> = {
  high: "支持度较高",
  medium: "支持度中等",
  low: "需要优先补强",
  insufficient: "信息仍不够",
};

const ACTION_LABELS: Readonly<Record<string, string>> = {
  "ACT-URGENT-MEDICAL": "优先处理线下医疗排查",
  "ACT-URGENT-MENTAL": "优先联系线下心理或精神科支持",
  "ACT-URGENT-SAFETY": "优先确保人身与环境安全",
  "ACT-SOON-MEDICAL": "尽快补齐就医与复诊安排",
  "ACT-SOON-MENTAL": "尽快补齐情绪支持与求助通道",
  "ACT-SOON-SAFETY": "尽快梳理安全与边界保护",
  "ACT-CLARIFY-AUTONOMY": "先厘清是否能按自己的意愿做决定",
  "ACT-CLARIFY-MEDICAL": "先补足关键医学信息",
  "ACT-CLARIFY-WILL": "先梳理你真正的意愿与顾虑",
  "ACT-CLARIFY-MENTAL": "先确认情绪负荷和求助资源",
  "ACT-WATCH-MEDICAL": "继续观察身体变化并保留就医准备",
  "ACT-WATCH-PRIVACY": "继续关注设备和隐私风险",
  "ACT-WATCH-BOUNDARY": "继续关注外界越界与边界压力",
  "ACT-WATCH-MENTAL": "继续关注情绪波动与恢复节奏",
  "ACT-LIFE-DEVELOPMENT-PRIORITY": "优先讨论人生发展与长期节奏",
};

const PATH_LABELS: Readonly<Record<string, string>> = {
  "continue-medical": "若继续妊娠，先确认检查、复诊与风险排查安排。",
  "continue-partner": "若继续妊娠，先确认伴侣支持是否具体、可执行。",
  "continue-finance": "若继续妊娠，先确认收入、缓冲和预算能否支撑。",
  "continue-care": "若继续妊娠，先确认照料、人力与生活节奏是否接得住。",
  "continue-life": "若继续妊娠，先确认个人发展节奏和现实支持是否匹配。",
  "continue-boundary": "若继续妊娠，先确认你能否在边界清晰的前提下做决定。",
  "end-medical": "若终止妊娠，先确认正规就医路径、时间点与术前准备。",
  "end-support": "若终止妊娠，先确认陪同、请假、交通或情绪支持安排。",
  "end-safety": "若终止妊娠，先确认你能安全、独立地保护隐私和边界。",
  "end-finance": "若终止妊娠，先确认医疗、恢复和后续安排成本。",
  "end-aftercare": "若终止妊娠，先确认恢复期休息、照料与支持安排。",
  "end-future": "若终止妊娠，先确认未来回看时最在意的事项和复盘节点。",
  "RPT-PATH-CONTINUE": "已授权共享的继续妊娠条件",
  "RPT-PATH-END": "已授权共享的终止妊娠条件",
};

const TOPIC_LABELS: Readonly<Record<string, string>> = {
  "topic:medical_summary": "先把当前医学状态和就医安排说清楚。",
  "topic:emotional_summary": "先把这段时间最真实的情绪负担说清楚。",
  "topic:life_summary": "先谈这件事对人生节奏和计划的影响。",
  "topic:financial_summary": "先谈现实预算与可承担范围。",
  "topic:partner_needs": "先谈你希望伴侣如何支持，而不是先表态。",
  "topic:family_boundary_summary": "先谈如何挡住外界施压与越界干预。",
  "topic:childcare_summary": "先谈现有照料安排会受什么影响。",
  "topic:values_summary": "先谈你最想守住的价值和底线。",
  "topic:note:1": "补充你主动愿意分享的第一条重点。",
  "topic:note:2": "补充你主动愿意分享的第二条重点。",
  "topic:note:3": "补充你主动愿意分享的第三条重点。",
};

const COMMITMENT_LABELS: Readonly<Record<string, string>> = {
  medical_support: "陪同就医、复诊或处理突发情况",
  financial_support: "一起承担现实支出和预算波动",
  boundary_support: "帮你挡住外界施压，保护隐私与边界",
  emotional_support: "稳定接住情绪，而不是催你马上定论",
};

const PERSONA_LABELS = new Map(PERSONA_CATALOG.map((persona) => [persona.personaId, persona.title] as const));

const RECOMMENDED_MODULE_LABELS: Readonly<Record<string, string>> = {
  "medical-deep": "医学安排细化",
  "mental-deep": "情绪支持细化",
  "finance-deep": "经济预算细化",
  "partner-deep": "伴侣承诺细化",
  "life-deep": "个人发展细化",
  "care-deep": "照料安排细化",
  "values-deep": "价值澄清细化",
  "aftercare-deep": "恢复安排细化",
  "safety-deep": "安全边界细化",
  "persona-deep": "互动风格校准",
};

export function getDimensionLabel(dimensionId: ReportDimensionView["dimensionId"]): string {
  return DIMENSION_LABELS[dimensionId];
}

export function getDimensionLevelLabel(level: ReportDimensionView["displayLevel"]): string {
  return LEVEL_LABELS[level];
}

export function getRecommendedModuleLabel(moduleId: string): string {
  return RECOMMENDED_MODULE_LABELS[moduleId] ?? getModuleLabel(moduleId);
}

export function getActionLabel(actionId: string): string {
  return ACTION_LABELS[actionId] ?? actionId;
}

export function getPathLabel(item: PathConditionView): string {
  return PATH_LABELS[item.labelId] ?? item.conditionId;
}

export function getTopicLabel(topicId: string): string {
  return TOPIC_LABELS[topicId] ?? topicId;
}

export function getCommitmentLabel(commitmentId: string): string {
  return COMMITMENT_LABELS[commitmentId] ?? commitmentId;
}

export function getReasonLabel(reasonId: string): string {
  return QUESTION_LABELS.get(reasonId) ?? reasonId;
}

export function getPersonaLabel(personaId: string | null): string | null {
  if (!personaId) {
    return null;
  }
  return PERSONA_LABELS.get(personaId) ?? personaId;
}
