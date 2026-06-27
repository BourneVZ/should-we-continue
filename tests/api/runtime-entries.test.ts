import { describe, expect, it } from "vitest";
import { createRuntimeApiEntries } from "../../api/_lib/runtime";
import { createReportViewModel } from "../fixtures/factories";

describe("runtime api entries", () => {
  it("serves report requests through the real runtime handler and degrades to template mode without llm config", async () => {
    const entries = createRuntimeApiEntries({
      env: {},
      now: () => Date.now(),
      sleep: async () => undefined,
      fetchImpl: async () => {
        throw new Error("network should not be used without config");
      },
    });

    const response = await entries.reportEntry({
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mode: "personal",
        payload: createReportViewModel(),
      }),
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ mode: "template" });
  });

  it("serves region refresh requests through the real runtime handler instead of the fixed 503 stub", async () => {
    const entries = createRuntimeApiEntries({
      env: {},
      now: () => new Date("2026-06-27T00:00:00.000Z").getTime(),
      sleep: async () => undefined,
      fetchImpl: async () => {
        throw new Error("network unavailable");
      },
    });

    const response = await entries.regionRefreshEntry({
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        regionId: "CN-ZJ-HZ-BJ",
      }),
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      cache: {
        status: "unavailable",
      },
    });
    expect(response.body).not.toEqual({ error: "dev_api_not_configured" });
  });
});
