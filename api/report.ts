interface EntryRequest {
  method: string;
  headers: Record<string, string | undefined>;
  body: string;
}

interface EntryResponse {
  status: number;
  body: unknown;
}

interface CreateReportHandlerInput {
  maxBytes: number;
  handle: (payload: unknown) => Promise<EntryResponse>;
}

export function createReportHandler({ maxBytes, handle }: CreateReportHandlerInput) {
  return async function reportEntry(request: EntryRequest): Promise<EntryResponse> {
    if (request.method !== "POST") {
      return { status: 405, body: { error: "method_not_allowed" } };
    }

    const contentType = request.headers["content-type"] ?? request.headers["Content-Type"];
    if (contentType !== "application/json") {
      return { status: 415, body: { error: "unsupported_media_type" } };
    }

    if (request.body.length > maxBytes) {
      return { status: 413, body: { error: "payload_too_large" } };
    }

    try {
      const payload = JSON.parse(request.body);
      return await handle(payload);
    } catch {
      return { status: 500, body: { error: "internal_error" } };
    }
  };
}

export default async function reportEntry(request: Request): Promise<Response> {
  const { createRuntimeApiEntries } = await import("./_lib/runtime");
  const entry = createRuntimeApiEntries({
    env: process.env as Record<string, string | undefined>,
    now: () => Date.now(),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    fetchImpl: (url, init) => fetch(url, init),
  }).reportEntry;

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
