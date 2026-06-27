import { REGION_ALLOWLIST, type RegionAllowlistEntry } from "@/config/region/hangzhou-bingjiang";

interface FetchLikeResponse {
  redirected: boolean;
  url: string;
  elapsedMs?: number;
  headers: { get(name: string): string | null };
  text(): Promise<string>;
}

type FetchImpl = (url: string, init: { method: "GET"; body: undefined }) => Promise<FetchLikeResponse>;

interface CreateRegionFetcherInput {
  allowlist?: readonly RegionAllowlistEntry[];
  fetchImpl: FetchImpl;
}

type RegionFetchResult =
  | { ok: true; text: string }
  | {
      ok: false;
      errorCategory:
        | "not_allowlisted"
        | "redirected_off_allowlist"
        | "non_text_response"
        | "response_too_large"
        | "timeout";
    };

function isAllowlistedUrl(url: string, allowlist: readonly RegionAllowlistEntry[]): boolean {
  return allowlist.some((entry) => entry.url === url);
}

export function createRegionFetcher({ allowlist = REGION_ALLOWLIST, fetchImpl }: CreateRegionFetcherInput) {
  return {
    async fetchText(url: string, options: { timeoutMs: number; maxBytes: number }): Promise<RegionFetchResult> {
      if (!url.startsWith("https://") || !isAllowlistedUrl(url, allowlist)) {
        return { ok: false, errorCategory: "not_allowlisted" };
      }

      const response = await fetchImpl(url, { method: "GET", body: undefined });
      if (response.redirected && !isAllowlistedUrl(response.url, allowlist)) {
        return { ok: false, errorCategory: "redirected_off_allowlist" };
      }
      if ((response.elapsedMs ?? 0) > options.timeoutMs) {
        return { ok: false, errorCategory: "timeout" };
      }

      const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
      if (!contentType.startsWith("text/")) {
        return { ok: false, errorCategory: "non_text_response" };
      }

      const text = await response.text();
      if (text.length > options.maxBytes) {
        return { ok: false, errorCategory: "response_too_large" };
      }

      return { ok: true, text };
    },
  };
}
