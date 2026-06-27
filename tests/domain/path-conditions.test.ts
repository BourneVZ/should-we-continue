import { describe, expect, it } from "vitest";
import { PATH_CONDITION_CONFIG } from "@/config/scoring/path-conditions";
import { buildPathConditionChecklists } from "@/domain/path-conditions";
import { createAnswered } from "../fixtures/factories";

describe("buildPathConditionChecklists", () => {
  it("builds symmetric continue and end checklists from answer predicates", () => {
    const result = buildPathConditionChecklists(PATH_CONDITION_CONFIG, {
      "Q-MED-PREGNANCY-CONFIRMED": createAnswered("confirmed"),
      "Q-MED-INTRAUTERINE-CONFIRMED": createAnswered("confirmed"),
      "Q-MED-CARE-PLAN": createAnswered("booked"),
      "Q-SAFE-FREE-ANSWER": createAnswered("safe"),
      "Q-SAFE-COERCION": createAnswered("none"),
      "Q-PARTNER-CONTROL-RISK": createAnswered("none"),
    });

    expect(result.continuePath).toHaveLength(6);
    expect(result.endPath).toHaveLength(6);
    expect(result.continuePath.find((item) => item.conditionId === "PC-C-MEDICAL")?.derivedStatus).toBe("confirmed");
    expect(result.endPath.find((item) => item.conditionId === "PC-E-SAFETY")?.derivedStatus).toBe("confirmed");
    expect(result.endPath.find((item) => item.conditionId === "PC-E-AFTERCARE")?.derivedStatus).toBe("pending");
  });

  it("does not emit scoring values or path recommendations", () => {
    const result = buildPathConditionChecklists(PATH_CONDITION_CONFIG, {});

    expect(result).toEqual({
      continuePath: expect.arrayContaining([
        expect.objectContaining({
          conditionId: expect.any(String),
          status: "pending",
          derivedStatus: "pending",
          readingStatus: "pending",
          labelId: expect.any(String),
        }),
      ]),
      endPath: expect.arrayContaining([
        expect.objectContaining({
          conditionId: expect.any(String),
          status: "pending",
          derivedStatus: "pending",
          readingStatus: "pending",
          labelId: expect.any(String),
        }),
      ]),
    });
  });
});
