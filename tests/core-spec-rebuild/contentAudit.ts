import type { ArchetypeDefinition } from "@/core-spec-rebuild/model";

export interface SentenceRecord {
  archetypeCode: string;
  sectionTitle: string;
  sentenceIndex: number;
  rawText: string;
  normalizedText: string;
}

export interface SentenceAuditFinding {
  sectionTitle: string;
  sentenceIndex: number;
  leftCode: string;
  rightCode: string;
  reasons: string[];
  left: string;
  right: string;
}

export interface SentenceAuditOptions {
  prefixLength?: number;
  suffixLength?: number;
  diceThreshold?: number;
  longestCommonSubstringThreshold?: number;
  longestCommonSubstringRatioThreshold?: number;
}

const DEFAULT_OPTIONS: Required<SentenceAuditOptions> = {
  prefixLength: 12,
  suffixLength: 12,
  diceThreshold: 0.7,
  longestCommonSubstringThreshold: 14,
  longestCommonSubstringRatioThreshold: 0.4,
};

export function normalizeSentence(text: string): string {
  return text.replace(/[，。！？、；：“”"'`（）()《》〈〉【】\[\]·,.\-…\s]/g, "");
}

export function splitSentences(text: string): string[] {
  return text
    .split(/[。！？]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function collectSectionSentences(archetypes: readonly ArchetypeDefinition[]): SentenceRecord[] {
  return archetypes.flatMap((archetype) =>
    archetype.sections.flatMap((section) =>
      splitSentences(section.body).map((sentence, sentenceIndex) => ({
        archetypeCode: archetype.code,
        sectionTitle: section.title,
        sentenceIndex,
        rawText: sentence,
        normalizedText: normalizeSentence(sentence),
      })),
    ),
  );
}

function buildTrigrams(text: string): Map<string, number> {
  const target = text.length >= 3 ? text : text.padEnd(3, "_");
  const bucket = new Map<string, number>();

  for (let index = 0; index <= target.length - 3; index += 1) {
    const trigram = target.slice(index, index + 3);
    bucket.set(trigram, (bucket.get(trigram) ?? 0) + 1);
  }

  return bucket;
}

export function calculateDiceSimilarity(left: string, right: string): number {
  if (!left.length || !right.length) {
    return 0;
  }

  const leftTrigrams = buildTrigrams(left);
  const rightTrigrams = buildTrigrams(right);
  let overlap = 0;
  let leftCount = 0;
  let rightCount = 0;

  for (const count of leftTrigrams.values()) {
    leftCount += count;
  }

  for (const count of rightTrigrams.values()) {
    rightCount += count;
  }

  for (const [token, leftTokenCount] of leftTrigrams.entries()) {
    overlap += Math.min(leftTokenCount, rightTrigrams.get(token) ?? 0);
  }

  return (2 * overlap) / (leftCount + rightCount);
}

export function calculateLongestCommonSubstring(left: string, right: string): number {
  if (!left.length || !right.length) {
    return 0;
  }

  const matrix = Array.from({ length: left.length + 1 }, () => new Array<number>(right.length + 1).fill(0));
  let longest = 0;

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      if (left[leftIndex - 1] !== right[rightIndex - 1]) {
        continue;
      }

      matrix[leftIndex][rightIndex] = matrix[leftIndex - 1][rightIndex - 1] + 1;
      longest = Math.max(longest, matrix[leftIndex][rightIndex]);
    }
  }

  return longest;
}

export function auditSentenceRecords(
  records: readonly SentenceRecord[],
  options: SentenceAuditOptions = {},
): SentenceAuditFinding[] {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const findings: SentenceAuditFinding[] = [];

  for (let leftIndex = 0; leftIndex < records.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < records.length; rightIndex += 1) {
      const left = records[leftIndex];
      const right = records[rightIndex];
      const reasons: string[] = [];

      if (left.sectionTitle !== right.sectionTitle || left.sentenceIndex !== right.sentenceIndex) {
        continue;
      }

      if (left.normalizedText === right.normalizedText) {
        reasons.push("exact");
      }

      if (left.normalizedText.slice(0, config.prefixLength) === right.normalizedText.slice(0, config.prefixLength)) {
        reasons.push(`prefix:${config.prefixLength}`);
      }

      if (left.normalizedText.slice(-config.suffixLength) === right.normalizedText.slice(-config.suffixLength)) {
        reasons.push(`suffix:${config.suffixLength}`);
      }

      const dice = calculateDiceSimilarity(left.normalizedText, right.normalizedText);
      const longestCommonSubstring = calculateLongestCommonSubstring(left.normalizedText, right.normalizedText);
      const shortestLength = Math.min(left.normalizedText.length, right.normalizedText.length);
      const longestCommonSubstringRatio = shortestLength > 0 ? longestCommonSubstring / shortestLength : 0;

      if (
        dice >= config.diceThreshold &&
        longestCommonSubstring >= config.longestCommonSubstringThreshold &&
        longestCommonSubstringRatio >= config.longestCommonSubstringRatioThreshold
      ) {
        reasons.push(
          `similarity:dice=${dice.toFixed(2)},lcs=${longestCommonSubstring},ratio=${longestCommonSubstringRatio.toFixed(2)}`,
        );
      }

      if (reasons.length > 0) {
        findings.push({
          sectionTitle: left.sectionTitle,
          sentenceIndex: left.sentenceIndex,
          leftCode: left.archetypeCode,
          rightCode: right.archetypeCode,
          reasons,
          left: left.rawText,
          right: right.rawText,
        });
      }
    }
  }

  return findings;
}

export function formatSentenceAuditFindings(findings: readonly SentenceAuditFinding[]): string[] {
  return findings.map(
    (finding) =>
      `${finding.sectionTitle} sentence ${finding.sentenceIndex + 1}: ${finding.leftCode} vs ${finding.rightCode} [${finding.reasons.join(", ")}]\nLEFT: ${finding.left}\nRIGHT: ${finding.right}`,
  );
}
