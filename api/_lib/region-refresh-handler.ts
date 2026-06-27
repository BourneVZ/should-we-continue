import { REGION_ALLOWLIST, REGION_CONFIG } from "../../src/config/region/hangzhou-bingjiang";
import { buildRegionCache, parseRegionCandidate } from "../../src/domain/region";
import { parseRegionRefreshRequest } from "./request-parsers";

interface RegionRefreshDependencies {
  existingCache: ReturnType<typeof buildRegionCache>;
  today: string;
  fetchRegionPage: (url: string) => Promise<{ ok: true; text: string } | { ok: false; errorCategory?: string }>;
  llm: {
    complete(input: { modelRole: "analysis" | "report"; prompt: string }): Promise<
      | { status: "ok"; text: string }
      | { status: "unavailable"; errorCategory: string }
      | { status: "error"; errorCategory: string }
    >;
  };
}

export async function handleRegionRefreshRequest(
  request: unknown,
  { existingCache: _existingCache, today, fetchRegionPage, llm }: RegionRefreshDependencies,
) {
  const parsedRequest = parseRegionRefreshRequest(request);
  if (parsedRequest.regionId !== REGION_CONFIG.regionId) {
    return { cache: buildRegionCache([], today, { refreshFailed: true, cacheTtlDays: REGION_CONFIG.cacheTtlDays }) };
  }

  const firstSource = await fetchRegionPage(REGION_ALLOWLIST[0].url);
  if (!firstSource.ok) {
    return { cache: buildRegionCache([], today, { refreshFailed: true, cacheTtlDays: REGION_CONFIG.cacheTtlDays }) };
  }

  const llmResult = await llm.complete({
    modelRole: "analysis",
    prompt: firstSource.text,
  });
  if (llmResult.status !== "ok") {
    return { cache: buildRegionCache([], today, { refreshFailed: true, cacheTtlDays: REGION_CONFIG.cacheTtlDays }) };
  }

  try {
    const parsed = JSON.parse(llmResult.text) as { candidates?: unknown[] };
    if (!Array.isArray(parsed.candidates)) {
      throw new Error("candidates must be an array");
    }

    const candidates = parsed.candidates.map((candidate) =>
      parseRegionCandidate(
        candidate as Parameters<typeof parseRegionCandidate>[0],
        REGION_ALLOWLIST,
      ),
    );
    return {
      cache: buildRegionCache(candidates, today, { cacheTtlDays: REGION_CONFIG.cacheTtlDays }),
    };
  } catch {
    return { cache: buildRegionCache([], today, { refreshFailed: true, cacheTtlDays: REGION_CONFIG.cacheTtlDays }) };
  }
}
