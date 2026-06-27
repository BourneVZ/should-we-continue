import { describe, expect, it } from "vitest";
import { PERSONA_CATALOG } from "@/config/personas/catalog";
import { PERSONA_VISUALS } from "@/config/personas/visuals";

describe("persona visuals", () => {
  it("maps every persona id to an icon, illustration, alt text, palette, and R3/R4 suppression metadata", () => {
    expect(Object.keys(PERSONA_VISUALS)).toHaveLength(12);

    for (const persona of PERSONA_CATALOG) {
      const visual = PERSONA_VISUALS[persona.personaId];
      expect(visual.iconId.length).toBeGreaterThan(0);
      expect(visual.illustrationPath).toBe(`/personas/${persona.personaId}.svg`);
      expect(visual.alt.length).toBeGreaterThan(0);
      expect(visual.palette.length).toBeGreaterThan(0);
      expect(visual.suppressForRedFlagLevels).toEqual(["R3", "R4"]);
    }
  });
});
