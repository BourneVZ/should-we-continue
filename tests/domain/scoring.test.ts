import { describe, expect, it } from "vitest";
import { SCORING_DIMENSIONS } from "@/config/scoring/dimensions";
import { calculateSupportScores, toReportDimensions } from "@/domain/scoring";
import { createAnswered } from "../fixtures/factories";

describe("calculateSupportScores", () => {
  it("maps strong medical answers to a relatively steady level", () => {
    const result = calculateSupportScores(
      {
        "Q-MED-PREGNANCY-CONFIRMED": createAnswered("confirmed"),
        "Q-MED-INTRAUTERINE-CONFIRMED": createAnswered("confirmed"),
        "Q-MED-GESTATION-ESTIMATE": createAnswered("week7to8"),
        "Q-MED-CARE-PLAN": createAnswered("booked"),
        "Q-MED-ABDOMINAL-PAIN": createAnswered("none"),
        "Q-MED-BLEEDING": createAnswered("none"),
        "Q-MED-ASSOCIATED-SYMPTOMS": createAnswered("none"),
      },
      SCORING_DIMENSIONS,
    );

    const medical = result.dimensions.find((dimension) => dimension.dimensionId === "medicalSafetySupport");
    expect(medical?.displayLevel).toBe("high");
    expect(medical?.supportScore).toBeGreaterThanOrEqual(75);
  });

  it("defaults childcare support to high when there are no existing children", () => {
    const result = calculateSupportScores(
      {
        "Q-CHILD-COUNT": createAnswered("none"),
      },
      SCORING_DIMENSIONS,
    );

    const childcare = result.dimensions.find((dimension) => dimension.dimensionId === "childcareLoadSupport");
    expect(childcare?.supportScore).toBe(100);
    expect(childcare?.displayLevel).toBe("high");
  });
});

describe("toReportDimensions", () => {
  it("strips internal supportScore values from the report-facing view", () => {
    const result = calculateSupportScores(
      {
        "Q-CHILD-COUNT": createAnswered("none"),
      },
      SCORING_DIMENSIONS,
    );

    expect(toReportDimensions(result.dimensions)).toEqual([
      {
        dimensionId: "childcareLoadSupport",
        displayLevel: "high",
        reasonIds: ["Q-CHILD-COUNT"],
      },
    ]);
  });
});
