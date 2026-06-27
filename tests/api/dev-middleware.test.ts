import { describe, expect, it } from "vitest";
import { createDevApiMiddleware } from "../../api/_lib/dev-middleware";

describe("dev api middleware", () => {
  it("routes dev-only api calls through injected handlers and does not expose server env to the browser", async () => {
    const middleware = createDevApiMiddleware({
      isDev: true,
      reportHandler: async () => ({ status: 200, body: { mode: "template" } }),
      regionRefreshHandler: async () => ({ status: 200, body: { cache: { status: "fresh" } } }),
    });

    await expect(
      middleware({
        url: "/api/report",
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      }),
    ).resolves.toEqual({
      handled: true,
      response: { status: 200, body: { mode: "template" } },
    });

    await expect(
      middleware({
        url: "/api/region-refresh",
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      }),
    ).resolves.toEqual({
      handled: true,
      response: { status: 200, body: { cache: { status: "fresh" } } },
    });
  });

  it("becomes inert outside development and never serializes process env into responses", async () => {
    const middleware = createDevApiMiddleware({
      isDev: false,
      reportHandler: async () => ({ status: 200, body: { secret: process.env.LLM_API_KEY } }),
      regionRefreshHandler: async () => ({ status: 200, body: { secret: process.env.LLM_API_KEY } }),
    });

    const result = await middleware({
      url: "/api/report",
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });

    expect(result).toEqual({ handled: false });
    expect(JSON.stringify(result)).not.toContain("LLM_API_KEY");
  });
});
