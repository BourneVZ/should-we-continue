import { parseReportResponse } from "@/domain/schemas";
import type { ReportViewModel, SharedDiscussionInput } from "@/domain/types";

interface FetcherResponse {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}

interface ApiClientDependencies {
  fetcher: (url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<FetcherResponse>;
}

type ApiClientResult =
  | { ok: true; response: ReturnType<typeof parseReportResponse> }
  | { ok: false; errorCategory: "network" | "invalid_response" };

export function createApiClient({ fetcher }: ApiClientDependencies) {
  async function postReport(body: { mode: "personal" | "discussion"; payload: ReportViewModel | SharedDiscussionInput }): Promise<ApiClientResult> {
    try {
      const response = await fetcher("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      return {
        ok: true,
        response: parseReportResponse(json),
      };
    } catch {
      return {
        ok: false,
        errorCategory: "network",
      };
    }
  }

  return {
    generatePersonalReport(input: { report: ReportViewModel; workspaceSnapshot: unknown }) {
      void input.workspaceSnapshot;
      return postReport({
        mode: "personal",
        payload: input.report,
      });
    },
    generateDiscussion(input: { discussion: SharedDiscussionInput; workspaceSnapshot: unknown }) {
      void input.workspaceSnapshot;
      return postReport({
        mode: "discussion",
        payload: input.discussion,
      });
    },
  };
}
