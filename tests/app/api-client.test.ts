import { describe, expect, it } from "vitest";
import { createApiClient } from "@/app/api-client";
import { createReportViewModel, createSharedDiscussionInput } from "../fixtures/factories";

describe("api client", () => {
  it("sends only manual personal or discussion report requests and strips browser-only workspace data", async () => {
    const requests: unknown[] = [];
    const client = createApiClient({
      fetcher: async (_url, init) => {
        requests.push(init?.body ? JSON.parse(String(init.body)) : null);
        return {
          ok: true,
          status: 200,
          json: async () => ({ mode: "template", report: createReportViewModel() }),
        };
      },
    });

    await client.generatePersonalReport({
      report: createReportViewModel(),
      workspaceSnapshot: {
        partnerRawAnswers: { secret: true },
        regionCache: { hidden: true },
      },
    });

    await client.generateDiscussion({
      discussion: createSharedDiscussionInput({
        summaryIds: ["medical_summary"],
        sharedNotes: ["已授权摘要"],
      }),
      workspaceSnapshot: {
        userFreeText: "未授权原文",
      },
    });

    expect(requests).toEqual([
      { mode: "personal", payload: createReportViewModel() },
      {
        mode: "discussion",
        payload: createSharedDiscussionInput({
          summaryIds: ["medical_summary"],
          sharedNotes: ["已授权摘要"],
        }),
      },
    ]);
    expect(JSON.stringify(requests)).not.toContain("secret");
    expect(JSON.stringify(requests)).not.toContain("hidden");
    expect(JSON.stringify(requests)).not.toContain("未授权原文");
  });

  it("returns a degradable error instead of throwing on network failure", async () => {
    const client = createApiClient({
      fetcher: async () => {
        throw new Error("network down");
      },
    });

    await expect(
      client.generatePersonalReport({
        report: createReportViewModel(),
        workspaceSnapshot: {},
      }),
    ).resolves.toEqual({
      ok: false,
      errorCategory: "network",
    });
  });
});
