import { describe, expect, it } from "vitest";
import { PATH_CONDITION_CONFIG } from "@/config/scoring/path-conditions";
import { buildPathConditionChecklists } from "@/domain/path-conditions";

describe("buildPathConditionChecklists", () => {
  it("builds symmetric continue and end checklists from static config", () => {
    const result = buildPathConditionChecklists(PATH_CONDITION_CONFIG);

    expect(result.continuePath.length).toBeGreaterThan(0);
    expect(result.endPath.length).toBeGreaterThan(0);
    expect(result.continuePath.every((item) => item.status === "pending")).toBe(true);
    expect(result.endPath.every((item) => item.status === "pending")).toBe(true);
  });

  it("does not emit scoring values or path recommendations", () => {
    const result = buildPathConditionChecklists(PATH_CONDITION_CONFIG);

    expect(result).toEqual({
      continuePath: expect.arrayContaining([
        expect.objectContaining({
          conditionId: expect.any(String),
          status: "pending",
          labelId: expect.any(String),
        }),
      ]),
      endPath: expect.arrayContaining([
        expect.objectContaining({
          conditionId: expect.any(String),
          status: "pending",
          labelId: expect.any(String),
        }),
      ]),
    });
  });
});
