import type { RegionFieldCandidate, RegionCache } from "@/domain/types";
import type { RegionAllowlistEntry } from "@/config/region/hangzhou-bingjiang";

function isAllowlisted(fieldId: string, sourceUrl: string, allowlist: readonly RegionAllowlistEntry[]): boolean {
  return allowlist.some(
    (entry) =>
      entry.url === sourceUrl &&
      (entry.fieldIds.includes(fieldId) || entry.fieldPrefixes.some((prefix) => fieldId.startsWith(prefix))),
  );
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function parseRegionCandidate(
  input: {
    fieldId: string;
    value: string;
    sourceUrl: string;
    checkedAt: string;
    applicableIf: readonly string[];
    uncertaintyNote?: string;
  },
  allowlist: readonly RegionAllowlistEntry[],
): RegionFieldCandidate {
  if (!input.sourceUrl.startsWith("https://") || !isAllowlisted(input.fieldId, input.sourceUrl, allowlist)) {
    throw new Error("region candidate must match an allowlist HTTPS source");
  }
  if (!input.fieldId || !input.value || !input.checkedAt || input.applicableIf.length === 0) {
    throw new Error("region candidate schema is incomplete");
  }

  return {
    fieldId: input.fieldId,
    value: input.value,
    sourceUrl: input.sourceUrl,
    checkedAt: input.checkedAt,
    applicableIf: input.applicableIf,
    uncertaintyNote: input.uncertaintyNote,
  };
}

export function buildRegionCache(
  verifiedFields: readonly RegionFieldCandidate[],
  today: string,
  options: { refreshFailed?: boolean; cacheTtlDays?: number } = {},
): RegionCache {
  if (verifiedFields.length === 0) {
    return {
      status: options.refreshFailed ? "unavailable" : "empty",
      checkedAt: null,
      expiresAt: null,
      verifiedFields: [],
    };
  }

  const cacheTtlDays = options.cacheTtlDays ?? 7;
  const latestCheckedAt = verifiedFields
    .map((field) => field.checkedAt)
    .sort()
    .at(-1)!;
  const expiresAt = addDays(latestCheckedAt, cacheTtlDays);
  const hasConflict = verifiedFields.some((field, index) =>
    verifiedFields.some(
      (other, otherIndex) => index !== otherIndex && field.fieldId === other.fieldId && field.value !== other.value,
    ),
  );

  const status: RegionCache["status"] = hasConflict
    ? "conflict"
    : today > expiresAt
      ? "stale"
      : "fresh";

  return {
    status,
    checkedAt: latestCheckedAt,
    expiresAt,
    verifiedFields: [...verifiedFields],
  };
}
