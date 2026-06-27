import { describe, expect, it } from "vitest";
import { createRegionRefreshHandler } from "../../api/region-refresh";

describe("region refresh entry", () => {
  it("accepts minimal POST json and delegates to injected refresh logic", async () => {
    const entry = createRegionRefreshHandler({
      handle: async () => ({
        status: 200,
        body: { cache: { status: "fresh" } },
      }),
    });

    const response = await entry({
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ regionId: "CN-ZJ-HZ-BJ" }),
    });

    expect(response).toEqual({
      status: 200,
      body: { cache: { status: "fresh" } },
    });
  });

  it("rejects methods, invalid json, and any client-provided url field", async () => {
    const entry = createRegionRefreshHandler({
      handle: async () => ({
        status: 200,
        body: {},
      }),
    });

    await expect(entry({ method: "GET", headers: {}, body: "" })).resolves.toMatchObject({ status: 405 });
    await expect(
      entry({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{bad",
      }),
    ).resolves.toEqual({
      status: 500,
      body: { error: "internal_error" },
    });
    await expect(
      entry({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ regionId: "CN-ZJ-HZ-BJ", url: "https://example.com" }),
      }),
    ).resolves.toEqual({
      status: 500,
      body: { error: "internal_error" },
    });
  });
});
