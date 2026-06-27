import type { SaveResult } from "@/persistence/local-repository";
import type { ReportResponse, WorkspaceDocument } from "@/domain/types";

export interface AppRepository {
  load(): WorkspaceDocument | null;
  save(document: WorkspaceDocument): SaveResult;
  clear(scope: "user" | "partner" | "all"): void;
}

export interface AppClock {
  now(): number;
}

export interface AppApiClient {
  generatePersonalReport(input: {
    report: import("@/domain/types").ReportViewModel;
    workspaceSnapshot: unknown;
  }): Promise<{ ok: true; response: ReportResponse } | { ok: false; errorCategory: "network" | "invalid_response" }>;
  generateDiscussion(input: {
    discussion: import("@/domain/types").SharedDiscussionInput;
    workspaceSnapshot: unknown;
  }): Promise<{ ok: true; response: ReportResponse } | { ok: false; errorCategory: "network" | "invalid_response" }>;
}

export interface AppDiagnostics {
  isDev: boolean;
  configAvailable: boolean;
  templateFallbackActive: boolean;
  errorCategory: string | null;
  schemaStatus: "valid" | "invalid";
}

export interface AppServices<
  Repository = AppRepository,
  Clock = AppClock,
  ApiClient = AppApiClient,
  Diagnostics = AppDiagnostics,
> {
  repository: Repository;
  clock: Clock;
  apiClient: ApiClient;
  diagnostics: Diagnostics;
}

export function createAppServices<
  Repository,
  Clock,
  ApiClient,
  Diagnostics,
>(services: AppServices<Repository, Clock, ApiClient, Diagnostics>): AppServices<Repository, Clock, ApiClient, Diagnostics> {
  return services;
}
