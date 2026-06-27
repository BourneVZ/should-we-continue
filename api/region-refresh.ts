import { parseRegionRefreshRequest } from "./_lib/request-parsers";

interface EntryRequest {
  method: string;
  headers: Record<string, string | undefined>;
  body: string;
}

interface EntryResponse {
  status: number;
  body: unknown;
}

interface CreateRegionRefreshHandlerInput {
  handle: (payload: ReturnType<typeof parseRegionRefreshRequest>) => Promise<EntryResponse>;
}

export function createRegionRefreshHandler({ handle }: CreateRegionRefreshHandlerInput) {
  return async function regionRefreshEntry(request: EntryRequest): Promise<EntryResponse> {
    if (request.method !== "POST") {
      return { status: 405, body: { error: "method_not_allowed" } };
    }
    const contentType = request.headers["content-type"] ?? request.headers["Content-Type"];
    if (contentType !== "application/json") {
      return { status: 415, body: { error: "unsupported_media_type" } };
    }

    try {
      const payload = parseRegionRefreshRequest(JSON.parse(request.body));
      return await handle(payload);
    } catch {
      return { status: 500, body: { error: "internal_error" } };
    }
  };
}

export default async function regionRefreshEntry(request: Request): Promise<Response> {
  const { createRuntimeApiEntries } = await import("./_lib/runtime");
  const entry = createRuntimeApiEntries({
    env: process.env as Record<string, string | undefined>,
    now: () => Date.now(),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    fetchImpl: (url, init) => fetch(url, init),
  }).regionRefreshEntry;

  const response = await entry({
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: await request.text(),
  });

  return new Response(JSON.stringify(response.body), {
    status: response.status,
    headers: { "content-type": "application/json" },
  });
}
