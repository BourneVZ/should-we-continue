import { describe, expect, it } from "vitest";
import { ALL_ARCHETYPES, EXTENDED_SECTION_TITLES } from "@/core-spec-rebuild/model";
import {
  auditSentenceRecords,
  collectSectionSentences,
  formatSentenceAuditFindings,
  splitSentences,
} from "./contentAudit";

function normalizeOpening(text: string): string {
  return text.replace(/[，。！？、；：“”"'`\s]/g, "").slice(0, 10);
}

function normalizeText(text: string): string {
  return text.replace(/[，。！？、；：“”"'`（）()《》〈〉【】\[\]·,.\-…\s]/g, "");
}

function extractLongSentences(text: string): string[] {
  return text
    .split(/[。！？]/)
    .map((item) => normalizeText(item))
    .filter((item) => item.length >= 18);
}

function extractSentenceParts(text: string): string[] {
  return text
    .split(/[。！？]/)
    .map((item) => normalizeText(item))
    .filter((item) => item.length > 0);
}

function findRepeatedSentences(items: readonly { key: string; text: string }[]): string[] {
  const bucket = new Map<string, string[]>();

  for (const item of items) {
    for (const sentence of extractLongSentences(item.text)) {
      const owners = bucket.get(sentence) ?? [];
      owners.push(item.key);
      bucket.set(sentence, owners);
    }
  }

  return [...bucket.entries()]
    .filter(([, owners]) => new Set(owners).size > 1)
    .map(([sentence, owners]) => `${sentence} <- ${owners.join(", ")}`);
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

  it("does not keep the previous shared boilerplate in intros or sections", () => {
    const bannedIntroStem = "一遇到怀孕和老公谈分工带宝宝或顾及已有孩子节奏时这套模式就会上线";
    const bannedSectionStem = "消息一落地或话题转到孕周和老公怎么谈宝宝出生后谁扛已有孩子会不会受影响时你通常先盯这里";
    const bannedIntroPrefix = "当验孕棒出线老公开始谈分工或你想到宝宝和已有孩子怎么排时";
    const bannedSectionPrefix = "验孕棒一有结果老公开始问下一步或你想到家里已有孩子会不会被挤压时";

    for (const archetype of ALL_ARCHETYPES) {
      expect(normalizeText(archetype.intro)).not.toContain(bannedIntroStem);
      expect(normalizeText(archetype.intro)).not.toContain(bannedIntroPrefix);

      for (const section of archetype.sections) {
        expect(normalizeText(section.body)).not.toContain(bannedSectionStem);
        expect(normalizeText(section.body)).not.toContain(bannedSectionPrefix);
      }
    }
  });

  it("keeps long intro sentences unique across archetypes", () => {
    const repeated = findRepeatedSentences(ALL_ARCHETYPES.map((archetype) => ({ key: archetype.code, text: archetype.intro })));

    expect(repeated).toEqual([]);
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

  it("keeps exactly three sentences in every section body", () => {
    for (const archetype of ALL_ARCHETYPES) {
      for (const section of archetype.sections) {
        expect(splitSentences(section.body), `${archetype.code} ${section.title} should keep exactly three sentences`).toHaveLength(3);
      }
    }
  });

  it("keeps section openings and long sentences distinct across archetypes", () => {
    for (const title of EXTENDED_SECTION_TITLES) {
      const matchingSections = ALL_ARCHETYPES.map((archetype) => {
        const section = archetype.sections.find((item) => item.title === title);

        if (!section) {
          throw new Error(`Missing section ${title} for ${archetype.code}`);
        }

        return {
          code: archetype.code,
          opening: normalizeText(section.body).slice(0, 18),
          body: section.body,
        };
      });

      expect(new Set(matchingSections.map((item) => item.opening)).size, `${title} opening stems should be unique`).toBe(
        matchingSections.length,
      );

      const repeated = findRepeatedSentences(
        matchingSections.map((section) => ({
          key: `${section.code}:${title}`,
          text: section.body,
        })),
      );

      expect(repeated, `${title} should not repeat full long sentences across archetypes`).toEqual([]);
    }
  });

  it("passes sentence-level section audit for every sentence position", () => {
    const findings = auditSentenceRecords(collectSectionSentences(ALL_ARCHETYPES));

    expect(formatSentenceAuditFindings(findings)).toEqual([]);
  });

  it("never wraps archetype codes in backticks inside copy", () => {
    for (const archetype of ALL_ARCHETYPES) {
      expect(archetype.intro).not.toContain(`\`${archetype.code}\``);

      for (const section of archetype.sections) {
        expect(section.body).not.toContain(`\`${archetype.code}\``);
      }
    }
  });
});
