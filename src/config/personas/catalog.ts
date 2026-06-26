import type { RedFlagLevel, SupportDimensionId } from "@/domain/types";

export interface PersonaCatalogEntry {
  personaId: string;
  groupId: "information" | "emotion" | "relationship" | "future";
  colorToken: string;
  iconId: string;
  title: string;
  summaryCopyId: string;
  coreNeedCopyId: string;
  sourceId: "SPEC-PERSONAS";
}

export interface PersonaStatusTag {
  tagId: string;
  priority: number;
  sourceId: "SPEC-PERSONAS";
}

export const PERSONA_ALLOWED_QUESTION_KEYS = [
  "Q-ROLE-FACT-CHECK",
  "Q-ROLE-PLAN-LIST",
  "Q-ROLE-CHANGE-SENSITIVITY",
  "Q-ROLE-NEED-SUPPORT",
  "Q-ROLE-EMOTION-EXPRESSION",
  "Q-ROLE-NEED-SPACE",
  "Q-ROLE-SHARED-PARTICIPATION",
  "Q-ROLE-COMMITMENT-EVIDENCE",
  "Q-ROLE-BOUNDARY-NEED",
  "Q-ROLE-LONG-TERM-REVIEW",
  "Q-ROLE-LIFE-CONTINUITY",
  "Q-ROLE-RESOURCE-CAPACITY",
] as const;

export const PERSONA_ALLOWED_DIMENSIONS: readonly SupportDimensionId[] = [
  "personalWillClaritySupport",
  "lifeDevelopmentSupport",
  "partnerCommitmentSupport",
  "familySocialSupport",
  "financialPolicySupport",
  "childcareLoadSupport",
];

export const PERSONA_CATALOG: readonly PersonaCatalogEntry[] = [
  { personaId: "P01", groupId: "information", colorToken: "teal", iconId: "compass", title: "雾灯校准师", summaryCopyId: "P01-SUMMARY", coreNeedCopyId: "P01-NEED", sourceId: "SPEC-PERSONAS" },
  { personaId: "P02", groupId: "information", colorToken: "teal", iconId: "list-checks", title: "清单抱枕", summaryCopyId: "P02-SUMMARY", coreNeedCopyId: "P02-NEED", sourceId: "SPEC-PERSONAS" },
  { personaId: "P03", groupId: "information", colorToken: "teal", iconId: "wind", title: "风向捕手", summaryCopyId: "P03-SUMMARY", coreNeedCopyId: "P03-NEED", sourceId: "SPEC-PERSONAS" },
  { personaId: "P04", groupId: "emotion", colorToken: "rose", iconId: "hand-heart", title: "软垫筑巢师", summaryCopyId: "P04-SUMMARY", coreNeedCopyId: "P04-NEED", sourceId: "SPEC-PERSONAS" },
  { personaId: "P05", groupId: "emotion", colorToken: "rose", iconId: "origami", title: "心事折纸师", summaryCopyId: "P05-SUMMARY", coreNeedCopyId: "P05-NEED", sourceId: "SPEC-PERSONAS" },
  { personaId: "P06", groupId: "emotion", colorToken: "rose", iconId: "pause-circle", title: "呼吸留白师", summaryCopyId: "P06-SUMMARY", coreNeedCopyId: "P06-NEED", sourceId: "SPEC-PERSONAS" },
  { personaId: "P07", groupId: "relationship", colorToken: "amber", iconId: "car-front", title: "副驾召唤师", summaryCopyId: "P07-SUMMARY", coreNeedCopyId: "P07-NEED", sourceId: "SPEC-PERSONAS" },
  { personaId: "P08", groupId: "relationship", colorToken: "amber", iconId: "clipboard-check", title: "承诺验收员", summaryCopyId: "P08-SUMMARY", coreNeedCopyId: "P08-NEED", sourceId: "SPEC-PERSONAS" },
  { personaId: "P09", groupId: "relationship", colorToken: "amber", iconId: "fence", title: "边界园丁", summaryCopyId: "P09-SUMMARY", coreNeedCopyId: "P09-NEED", sourceId: "SPEC-PERSONAS" },
  { personaId: "P10", groupId: "future", colorToken: "green", iconId: "clapperboard", title: "未来预告片导演", summaryCopyId: "P10-SUMMARY", coreNeedCopyId: "P10-NEED", sourceId: "SPEC-PERSONAS" },
  { personaId: "P11", groupId: "future", colorToken: "green", iconId: "sparkles", title: "火花守夜人", summaryCopyId: "P11-SUMMARY", coreNeedCopyId: "P11-NEED", sourceId: "SPEC-PERSONAS" },
  { personaId: "P12", groupId: "future", colorToken: "green", iconId: "hammer", title: "地基巡检员", summaryCopyId: "P12-SUMMARY", coreNeedCopyId: "P12-NEED", sourceId: "SPEC-PERSONAS" },
] as const;

export const PERSONA_STATUS_TAGS: readonly PersonaStatusTag[] = [
  { tagId: "S01", priority: 30, sourceId: "SPEC-PERSONAS" },
  { tagId: "S02", priority: 50, sourceId: "SPEC-PERSONAS" },
  { tagId: "S03", priority: 40, sourceId: "SPEC-PERSONAS" },
  { tagId: "S04", priority: 35, sourceId: "SPEC-PERSONAS" },
  { tagId: "S05", priority: 45, sourceId: "SPEC-PERSONAS" },
  { tagId: "S06", priority: 70, sourceId: "SPEC-PERSONAS" },
  { tagId: "S07", priority: 25, sourceId: "SPEC-PERSONAS" },
  { tagId: "S08", priority: 55, sourceId: "SPEC-PERSONAS" },
  { tagId: "S09", priority: 20, sourceId: "SPEC-PERSONAS" },
  { tagId: "S10", priority: 65, sourceId: "SPEC-PERSONAS" },
  { tagId: "S11", priority: 60, sourceId: "SPEC-PERSONAS" },
  { tagId: "S12", priority: 75, sourceId: "SPEC-PERSONAS" },
] as const;

export const PERSONA_THRESHOLDS = {
  minValidCount: 8,
  minInformativeCount: 6,
  minCandidateScore: 55,
  minConfidence: 70,
  tieWindow: 2,
  secondaryWindow: 8,
  maxStatusTags: 7,
} as const;

export const PERSONA_COMPATIBILITY: Readonly<Record<string, readonly string[]>> = {
  P01: ["P02", "P03", "P10"],
  P02: ["P01", "P08", "P12"],
  P03: ["P01", "P06", "P10"],
  P04: ["P05", "P07", "P08"],
  P05: ["P04", "P06", "P10"],
  P06: ["P03", "P05", "P11"],
  P07: ["P04", "P08", "P09"],
  P08: ["P02", "P07", "P12"],
  P09: ["P07", "P11", "P12"],
  P10: ["P01", "P03", "P11"],
  P11: ["P06", "P09", "P10"],
  P12: ["P02", "P08", "P09"],
};

export const PERSONA_SUPPRESSION: {
  redFlagLevels: readonly RedFlagLevel[];
  redFlagReason: string;
  insufficientDataReason: string;
} = {
  redFlagLevels: ["R3", "R4"],
  redFlagReason: "red_flag_R3_or_R4",
  insufficientDataReason: "insufficient_persona_data",
};

export const PERSONA_CALIBRATING_COPY_ID = "RPT-PERSONA-CALIBRATING";
