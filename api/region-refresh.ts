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
