export interface AppServices<
  Repository = unknown,
  Clock = unknown,
  ApiClient = unknown,
  Diagnostics = unknown,
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
