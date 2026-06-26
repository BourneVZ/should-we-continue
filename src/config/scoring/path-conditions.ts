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
    { conditionId: "PC-CONTINUE-MEDICAL", labelId: "continue-medical" },
    { conditionId: "PC-CONTINUE-CARE", labelId: "continue-care" },
    { conditionId: "PC-CONTINUE-BOUNDARY", labelId: "continue-boundary" },
  ],
  endPath: [
    { conditionId: "PC-END-MEDICAL", labelId: "end-medical" },
    { conditionId: "PC-END-RECOVERY", labelId: "end-recovery" },
    { conditionId: "PC-END-BOUNDARY", labelId: "end-boundary" },
  ],
};
