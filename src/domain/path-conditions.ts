import type { PathConditionConfig } from "@/config/scoring/path-conditions";
import type { PathConditionView } from "@/domain/types";

export function buildPathConditionChecklists(config: PathConditionConfig): {
  continuePath: PathConditionView[];
  endPath: PathConditionView[];
} {
  return {
    continuePath: config.continuePath.map((item) => ({
      conditionId: item.conditionId,
      status: "pending",
      labelId: item.labelId,
    })),
    endPath: config.endPath.map((item) => ({
      conditionId: item.conditionId,
      status: "pending",
      labelId: item.labelId,
    })),
  };
}
