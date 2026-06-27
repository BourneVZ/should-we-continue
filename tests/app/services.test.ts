import { describe, expect, it } from "vitest";
import { createAppServices } from "@/app/services";

describe("app services", () => {
  it("builds the service root entirely from explicit injected dependencies", () => {
    const repository = { load: () => null, save: () => ({ ok: true }) };
    const clock = { now: () => 123, sleep: async () => undefined };
    const apiClient = { generatePersonalReport: async () => ({ ok: true }), generateDiscussion: async () => ({ ok: true }) };
    const diagnostics = { isDev: true, configAvailable: false, templateFallbackActive: true };

    const services = createAppServices({
      repository,
      clock,
      apiClient,
      diagnostics,
    });

    expect(services.repository).toBe(repository);
    expect(services.clock).toBe(clock);
    expect(services.apiClient).toBe(apiClient);
    expect(services.diagnostics).toBe(diagnostics);
  });
});
