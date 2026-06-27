import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("vercel config", () => {
  it("exposes only the report and region-refresh api routes with security headers", () => {
    const filePath = path.resolve(__dirname, "../../vercel.json");
    const raw = readFileSync(filePath, "utf8");
    const config = JSON.parse(raw) as {
      routes?: Array<{ src: string; dest?: string }>;
      headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
    };

    expect(config.routes).toEqual([
      { src: "/api/report", dest: "/api/report" },
      { src: "/api/region-refresh", dest: "/api/region-refresh" },
    ]);

    const serialized = JSON.stringify(config);
    expect(serialized).toContain("X-Content-Type-Options");
    expect(serialized).toContain("Referrer-Policy");
    expect(serialized).not.toContain("LLM_API_KEY");
    expect(serialized).not.toContain("proxy");
    expect(serialized).not.toContain("analytics");
  });
});
