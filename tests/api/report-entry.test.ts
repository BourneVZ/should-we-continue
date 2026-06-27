import { describe, expect, it } from "vitest";
import { createReportHandler } from "../../api/report";

describe("report api entry", () => {
  it("allows only POST JSON requests under the size limit and delegates to the injected handler", async () => {
    const entry = createReportHandler({
      maxBytes: 1024,
      handle: async () => ({
        status: 200,
        body: { mode: "template", report: { ok: true } },
      }),
    });

    const response = await entry({
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://app.local" },
      body: JSON.stringify({ mode: "personal", payload: {} }),
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mode: "template", report: { ok: true } });
  });

  it("rejects wrong methods, non-json requests, oversized bodies, and handler failures with generic responses", async () => {
    const entry = createReportHandler({
      maxBytes: 8,
      handle: async () => {
        throw new Error("boom");
      },
    });

    await expect(entry({ method: "GET", headers: {}, body: "" })).resolves.toMatchObject({ status: 405 });
    await expect(
      entry({
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: "",
      }),
    ).resolves.toMatchObject({ status: 415 });
    await expect(
      entry({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "0123456789",
      }),
    ).resolves.toMatchObject({ status: 413 });
    await expect(
      createReportHandler({
        maxBytes: 1024,
        handle: async () => {
          throw new Error("sensitive details");
        },
      })({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "personal", payload: {} }),
      }),
    ).resolves.toEqual({
      status: 500,
      body: { error: "internal_error" },
    });
  });
});
