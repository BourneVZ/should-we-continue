import { createRegionRefreshHandler } from "../region-refresh";
import { createReportHandler } from "../report";
import { handleRegionRefreshRequest } from "./region-refresh-handler";
import { createRegionFetcher } from "./region-fetcher";
import { handleReportRequest } from "./handlers";
import { createLlmClient, type Clock, type LlmTransportResult } from "./llm-client";
import { parseReportHttpRequest } from "./request-parsers";

interface EntryRequest {
  method: string;
  headers: Record<string, string | undefined>;
  body: string;
}

interface EntryResponse {
  status: number;
  body: unknown;
}

type FetchLikeResponse = {
  ok: boolean;
  redirected: boolean;
  url: string;
  headers: { get(name: string): string | null };
  text(): Promise<string>;
  json(): Promise<unknown>;
};

type FetchLike = (url: string, init: { method: string; headers?: Record<string, string>; body?: string }) => Promise<FetchLikeResponse>;

interface CreateRuntimeApiEntriesInput {
  env: Record<string, string | undefined>;
  now: Clock["now"];
  sleep: Clock["sleep"];
  fetchImpl: FetchLike;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function extractChatContent(payload: unknown): string {
  const record = payload as { choices?: Array<{ message?: { content?: unknown } }> };
  const firstContent = record?.choices?.[0]?.message?.content;

  if (typeof firstContent === "string") {
    return firstContent;
  }
  if (Array.isArray(firstContent)) {
    return firstContent
      .map((item) => (typeof item === "object" && item !== null && "text" in item ? String((item as { text: unknown }).text ?? "") : ""))
      .join("");
  }

  throw new Error("invalid_llm_response");
}

function createFetchTransport(fetchImpl: FetchLike) {
  return async function transport(input: {
    apiKey: string;
    baseUrl: string;
    model: string;
    prompt: string;
    maxOutputTokens: number;
  }): Promise<LlmTransportResult> {
    const startedAt = Date.now();
    const response = await fetchImpl(`${normalizeBaseUrl(input.baseUrl)}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${input.apiKey}`,
      },
      body: JSON.stringify({
        model: input.model,
        messages: [{ role: "user", content: input.prompt }],
        max_tokens: input.maxOutputTokens,
        response_format: { type: "json_object" },
        temperature: 0,
      }),
    });

    if (!response.ok) {
      throw new Error("transport_error");
    }

    return {
      text: extractChatContent(await response.json()),
      elapsedMs: Date.now() - startedAt,
    };
  };
}

export function createRuntimeApiEntries({
  env,
  now,
  sleep,
  fetchImpl,
}: CreateRuntimeApiEntriesInput): {
  reportEntry: (request: EntryRequest) => Promise<EntryResponse>;
  regionRefreshEntry: (request: EntryRequest) => Promise<EntryResponse>;
} {
  const llm = createLlmClient({
    env,
    clock: { now, sleep },
    transport: createFetchTransport(fetchImpl),
  });

  const reportEntry = createReportHandler({
    maxBytes: 100_000,
    handle: async (payload) => {
      const request = parseReportHttpRequest(payload);
      const response = await handleReportRequest(request, { llm });
      return { status: 200, body: response };
    },
  });

  const regionFetcher = createRegionFetcher({
    fetchImpl: async (url, init) => {
      const startedAt = Date.now();
      const response = await fetchImpl(url, init);
      return {
        redirected: response.redirected,
        url: response.url,
        elapsedMs: Date.now() - startedAt,
        headers: response.headers,
        text: () => response.text(),
      };
    },
  });

  const regionRefreshEntry = createRegionRefreshHandler({
    handle: async (payload) => {
      const result = await handleRegionRefreshRequest(payload, {
        existingCache: {
          status: "empty",
          checkedAt: null,
          expiresAt: null,
          verifiedFields: [],
        },
        today: new Date(now()).toISOString().slice(0, 10),
        fetchRegionPage: async (url) => {
          try {
            return await regionFetcher.fetchText(url, {
              timeoutMs: 10_000,
              maxBytes: 100_000,
            });
          } catch {
            return { ok: false as const, errorCategory: "timeout" };
          }
        },
        llm,
      });
      return {
        status: 200,
        body: result,
      };
    },
  });

  return {
    reportEntry,
    regionRefreshEntry,
  };
}
