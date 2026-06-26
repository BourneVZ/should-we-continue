import { describe, expect, it } from "vitest";
import { evaluateSafety } from "@/domain/safety";
import { SAFETY_RULES } from "@/config/scoring/safety";
import { createAnswered } from "../fixtures/factories";

describe("evaluateSafety", () => {
  it("returns R4 for active self-harm unsafety and suppresses persona/sharing", () => {
    const result = evaluateSafety(
      {
        "Q-SAFE-SELF-HARM": createAnswered("unsafe_now"),
      },
      SAFETY_RULES,
    );

    expect(result.level).toBe("R4");
    expect(result.actionIds).toContain("ACT-URGENT-MENTAL");
    expect(result.personaSuppressedReason).toBeTruthy();
    expect(result.sharingBlockedReason).toBeTruthy();
  });

  it("returns R4 for confirmed or possible pregnancy with severe unilateral pain", () => {
    const result = evaluateSafety(
      {
        "Q-MED-PREGNANCY-CONFIRMED": createAnswered("possible"),
        "Q-MED-ABDOMINAL-PAIN": createAnswered("severe_or_one_sided"),
      },
      SAFETY_RULES,
    );

    expect(result.level).toBe("R4");
    expect(result.ruleIds).toContain("RF-R4-SEVERE-PAIN");
  });

  it("returns R3 for coercion even when other answers look steady", () => {
    const result = evaluateSafety(
      {
        "Q-SAFE-COERCION": createAnswered("pressure_or_fear"),
        "Q-LIFE-PARTNER-SUPPORT": createAnswered("SA"),
        "Q-FIN-INCOME-STABLE": createAnswered("SA"),
      },
      SAFETY_RULES,
    );

    expect(result.level).toBe("R3");
    expect(result.actionIds).toContain("ACT-SOON-SAFETY");
  });
});
