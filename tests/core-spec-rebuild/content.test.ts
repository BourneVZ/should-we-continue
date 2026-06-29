import { describe, expect, it } from "vitest";
import { ALL_ARCHETYPES, EXTENDED_SECTION_TITLES } from "@/core-spec-rebuild/model";

function normalizeOpening(text: string): string {
  return text.replace(/[，。！？、；：“”"'`\s]/g, "").slice(0, 10);
}

describe("core-spec-rebuild content", () => {
  it("keeps every intro within the 200-300 char homepage lead band", () => {
    for (const archetype of ALL_ARCHETYPES) {
      expect(archetype.intro.length, `${archetype.code} intro should be at least 200 chars`).toBeGreaterThanOrEqual(200);
      expect(archetype.intro.length, `${archetype.code} intro should be at most 300 chars`).toBeLessThanOrEqual(300);
    }
  });

  it("avoids repetitive openings across archetype intros", () => {
    const openings = ALL_ARCHETYPES.map((archetype) => normalizeOpening(archetype.intro));
    const uniqueOpenings = new Set(openings);

    expect(uniqueOpenings.size).toBe(openings.length);
  });

  it("keeps six extended sections for every archetype in the 100-200 char band", () => {
    for (const archetype of ALL_ARCHETYPES) {
      expect(archetype.sections.map((section) => section.title)).toEqual([...EXTENDED_SECTION_TITLES]);

      for (const section of archetype.sections) {
        expect(section.body.length, `${archetype.code} ${section.title} should be at least 100 chars`).toBeGreaterThanOrEqual(100);
        expect(section.body.length, `${archetype.code} ${section.title} should be at most 200 chars`).toBeLessThanOrEqual(200);
      }
    }
  });
});
