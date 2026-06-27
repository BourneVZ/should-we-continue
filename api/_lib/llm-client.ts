export interface Clock {
  now: () => number;
  sleep: (ms: number) => Promise<void>;
}

export interface LlmTransportResult {
  text: string;
  elapsedMs: number;
}

export type LlmTransport = (input: {
  apiKey: string;
  baseUrl: string;
  model: string;
  prompt: string;
  maxOutputTokens: number;
}) => Promise<LlmTransportResult>;

export type LlmResult =
  | { status: "ok"; text: string }
  | { status: "unavailable"; errorCategory: "missing_config" }
  | { status: "error"; errorCategory: "transport" | "timeout" | "output_too_large" };

export interface LlmClient {
  complete(input: { modelRole: "analysis" | "report"; prompt: string }): Promise<LlmResult>;
}

interface CreateLlmClientInput {
  env: Record<string, string | undefined>;
  transport: LlmTransport;
  clock: Clock;
}

function getModelName(env: Record<string, string | undefined>, modelRole: "analysis" | "report"): string | undefined {
  return modelRole === "analysis" ? env.LLM_MODEL_ANALYSIS : env.LLM_MODEL_REPORT;
}

export function createLlmClient({ env, transport, clock }: CreateLlmClientInput): LlmClient {
  return {
    async complete({ modelRole, prompt }) {
      const apiKey = env.LLM_API_KEY;
      const baseUrl = env.LLM_BASE_URL;
      const model = getModelName(env, modelRole);
      const timeoutMs = Number(env.LLM_TIMEOUT_MS ?? "0");
      const maxOutputTokens = Number(env.LLM_MAX_OUTPUT_TOKENS ?? "0");

      if (!apiKey || !baseUrl || !model || !timeoutMs || !maxOutputTokens) {
        return { status: "unavailable", errorCategory: "missing_config" };
      }

      let backoffMs = 250;
      for (let attempt = 0; attempt < 4; attempt += 1) {
        try {
          const result = await transport({
            apiKey,
            baseUrl,
            model,
            prompt,
            maxOutputTokens,
          });

          if (result.elapsedMs > timeoutMs) {
            return { status: "error", errorCategory: "timeout" };
          }
          if (result.text.length > maxOutputTokens) {
            return { status: "error", errorCategory: "output_too_large" };
          }

          return {
            status: "ok",
            text: result.text,
          };
        } catch {
          if (attempt === 3) {
            return { status: "error", errorCategory: "transport" };
          }
          await clock.sleep(backoffMs);
          backoffMs *= 2;
        }
      }

      return { status: "error", errorCategory: "transport" };
    },
  };
}
