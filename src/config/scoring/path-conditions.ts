export interface PathConditionSeed {
  conditionId: string;
  labelId: string;
}

export interface PathConditionConfig {
  continuePath: readonly PathConditionSeed[];
  endPath: readonly PathConditionSeed[];
}

export const PATH_CONDITION_CONFIG: PathConditionConfig = {
  continuePath: [
    { conditionId: "PC-C-MEDICAL", labelId: "continue-medical" },
    { conditionId: "PC-C-PARTNER", labelId: "continue-partner" },
    { conditionId: "PC-C-FINANCE", labelId: "continue-finance" },
    { conditionId: "PC-C-CARE", labelId: "continue-care" },
    { conditionId: "PC-C-LIFE", labelId: "continue-life" },
    { conditionId: "PC-C-BOUNDARY", labelId: "continue-boundary" },
  ],
  endPath: [
    { conditionId: "PC-E-MEDICAL", labelId: "end-medical" },
    { conditionId: "PC-E-SUPPORT", labelId: "end-support" },
    { conditionId: "PC-E-SAFETY", labelId: "end-safety" },
    { conditionId: "PC-E-FINANCE", labelId: "end-finance" },
    { conditionId: "PC-E-AFTERCARE", labelId: "end-aftercare" },
    { conditionId: "PC-E-FUTURE", labelId: "end-future" },
  ],
};
