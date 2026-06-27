import { describe, expect, it } from "vitest";
import { REGION_ALLOWLIST } from "@/config/region/hangzhou-bingjiang";
import { createRegionFetcher } from "../../api/_lib/region-fetcher";

describe("region fetcher", () => {
  it("fetches only allowlisted HTTPS urls with body-less GET requests", async () => {
    const calls: unknown[] = [];
    const fetcher = createRegionFetcher({
      allowlist: REGION_ALLOWLIST,
      fetchImpl: async (url, init) => {
        calls.push({ url, init });
        return {
          redirected: false,
          url,
          headers: { get: (name: string) => (name.toLowerCase() === "content-type" ? "text/html" : null) },
          text: async () => "<html>ok</html>",
        };
      },
    });

    const result = await fetcher.fetchText(REGION_ALLOWLIST[0].url, { timeoutMs: 1000, maxBytes: 1024 });
    expect(result).toEqual({ ok: true, text: "<html>ok</html>" });
    expect(calls).toEqual([
      {
        url: REGION_ALLOWLIST[0].url,
        init: { method: "GET", body: undefined },
      },
    ]);
  });

  it("rejects non-allowlisted urls, redirects to other origins, non-text responses, oversized bodies, and timeouts", async () => {
    const fetcher = createRegionFetcher({
      allowlist: REGION_ALLOWLIST,
      fetchImpl: async () => ({
        redirected: false,
        url: REGION_ALLOWLIST[0].url,
        headers: { get: () => "application/json" },
        text: async () => "{}",
      }),
    });

    await expect(fetcher.fetchText("https://example.com", { timeoutMs: 1000, maxBytes: 1024 })).resolves.toEqual({
      ok: false,
      errorCategory: "not_allowlisted",
    });

    const redirectingFetcher = createRegionFetcher({
      allowlist: REGION_ALLOWLIST,
      fetchImpl: async () => ({
        redirected: true,
        url: "https://evil.example",
        headers: { get: () => "text/html" },
        text: async () => "<html>bad</html>",
      }),
    });
    await expect(
      redirectingFetcher.fetchText(REGION_ALLOWLIST[0].url, { timeoutMs: 1000, maxBytes: 1024 }),
    ).resolves.toEqual({
      ok: false,
      errorCategory: "redirected_off_allowlist",
    });

    await expect(
      fetcher.fetchText(REGION_ALLOWLIST[0].url, { timeoutMs: 1000, maxBytes: 10 }),
    ).resolves.toEqual({
      ok: false,
      errorCategory: "non_text_response",
    });

    const textFetcher = createRegionFetcher({
      allowlist: REGION_ALLOWLIST,
      fetchImpl: async () => ({
        redirected: false,
        url: REGION_ALLOWLIST[0].url,
        headers: { get: () => "text/html" },
        text: async () => "x".repeat(50),
      }),
    });
    await expect(
      textFetcher.fetchText(REGION_ALLOWLIST[0].url, { timeoutMs: 1000, maxBytes: 10 }),
    ).resolves.toEqual({
      ok: false,
      errorCategory: "response_too_large",
    });

    const slowFetcher = createRegionFetcher({
      allowlist: REGION_ALLOWLIST,
      fetchImpl: async () => ({
        redirected: false,
        url: REGION_ALLOWLIST[0].url,
        elapsedMs: 2000,
        headers: { get: () => "text/html" },
        text: async () => "ok",
      }),
    });
    await expect(
      slowFetcher.fetchText(REGION_ALLOWLIST[0].url, { timeoutMs: 10, maxBytes: 1024 }),
    ).resolves.toEqual({
      ok: false,
      errorCategory: "timeout",
    });
  });
});
