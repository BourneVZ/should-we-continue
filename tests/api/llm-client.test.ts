import { describe, expect, it } from "vitest";
import { createLlmClient } from "../../api/_lib/llm-client";

describe("llm client", () => {
  it("degrades cleanly when required server config is missing", async () => {
    const client = createLlmClient({
      env: {},
      transport: async () => {
        throw new Error("should not call transport");
      },
      clock: {
        now: () => 0,
        sleep: async () => undefined,
      },
    });

    await expect(client.complete({ modelRole: "report", prompt: "hello" })).resolves.toEqual({
      status: "unavailable",
      errorCategory: "missing_config",
    });
  });

  it("retries at most three additional times with backoff and sanitizes transport errors", async () => {
    const sleeps: number[] = [];
    let attempts = 0;
    const client = createLlmClient({
      env: {
        LLM_API_KEY: "server-key",
        LLM_BASE_URL: "https://example.test/v1",
        LLM_MODEL_REPORT: "report-model",
        LLM_TIMEOUT_MS: "5000",
        LLM_MAX_OUTPUT_TOKENS: "128",
      },
      transport: async () => {
        attempts += 1;
        throw new Error("401 leaked-key-detail");
      },
      clock: {
        now: () => 0,
        sleep: async (ms) => {
          sleeps.push(ms);
        },
      },
    });

    await expect(client.complete({ modelRole: "report", prompt: "hello" })).resolves.toEqual({
      status: "error",
      errorCategory: "transport",
    });
    expect(attempts).toBe(4);
    expect(sleeps).toEqual([250, 500, 1000]);
  });

  it("rejects timed out or overlong responses without exposing raw output", async () => {
    const timeoutClient = createLlmClient({
      env: {
        LLM_API_KEY: "server-key",
        LLM_BASE_URL: "https://example.test/v1",
        LLM_MODEL_ANALYSIS: "analysis-model",
        LLM_TIMEOUT_MS: "10",
        LLM_MAX_OUTPUT_TOKENS: "32",
      },
      transport: async () => ({
        text: "late",
        elapsedMs: 50,
      }),
      clock: {
        now: () => 0,
        sleep: async () => undefined,
      },
    });

    await expect(timeoutClient.complete({ modelRole: "analysis", prompt: "hello" })).resolves.toEqual({
      status: "error",
      errorCategory: "timeout",
    });

    const overlongClient = createLlmClient({
      env: {
        LLM_API_KEY: "server-key",
        LLM_BASE_URL: "https://example.test/v1",
        LLM_MODEL_ANALYSIS: "analysis-model",
        LLM_TIMEOUT_MS: "100",
        LLM_MAX_OUTPUT_TOKENS: "4",
      },
      transport: async () => ({
        text: "x".repeat(100),
        elapsedMs: 5,
      }),
      clock: {
        now: () => 0,
        sleep: async () => undefined,
      },
    });

    await expect(overlongClient.complete({ modelRole: "analysis", prompt: "hello" })).resolves.toEqual({
      status: "error",
      errorCategory: "output_too_large",
    });
  });
});
