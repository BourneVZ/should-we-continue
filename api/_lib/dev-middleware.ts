import type { Plugin } from "vite";

interface MiddlewareRequest {
  url: string;
  method: string;
  headers: Record<string, string | undefined>;
  body: string;
}

interface MiddlewareResponse {
  status: number;
  body: unknown;
}

interface CreateDevApiMiddlewareInput {
  isDev: boolean;
  reportHandler: (request: MiddlewareRequest) => Promise<MiddlewareResponse>;
  regionRefreshHandler: (request: MiddlewareRequest) => Promise<MiddlewareResponse>;
}

export function createDevApiMiddleware({
  isDev,
  reportHandler,
  regionRefreshHandler,
}: CreateDevApiMiddlewareInput) {
  return async function devApiMiddleware(request: MiddlewareRequest): Promise<
    | { handled: false }
    | { handled: true; response: MiddlewareResponse }
  > {
    if (!isDev) {
      return { handled: false };
    }

    if (request.url === "/api/report") {
      return {
        handled: true,
        response: await reportHandler(request),
      };
    }
    if (request.url === "/api/region-refresh") {
      return {
        handled: true,
        response: await regionRefreshHandler(request),
      };
    }

    return { handled: false };
  };
}

export function createDevApiPlugin(middleware: ReturnType<typeof createDevApiMiddleware>): Plugin {
  return {
    name: "dev-api-middleware",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (url !== "/api/report" && url !== "/api/region-refresh") {
          next();
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += String(chunk);
        });
        req.on("end", async () => {
          const result = await middleware({
            url,
            method: req.method ?? "GET",
            headers: Object.fromEntries(
              Object.entries(req.headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(",") : value]),
            ),
            body,
          });

          if (!result.handled) {
            next();
            return;
          }

          res.statusCode = result.response.status;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify(result.response.body));
        });
      });
    },
  };
}
