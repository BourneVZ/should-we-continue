import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { createDevApiMiddleware, createDevApiPlugin } from "./api/_lib/dev-middleware";
import { createRuntimeApiEntries } from "./api/_lib/runtime";

export default defineConfig(({ command, mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), "") } as Record<string, string | undefined>;
  const runtimeEntries =
    command === "serve"
      ? createRuntimeApiEntries({
          env,
          now: () => Date.now(),
          sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
          fetchImpl: (url, init) => fetch(url, init),
        })
      : null;
  return {
    plugins: [
      react(),
      ...(command === "serve"
        ? [
            createDevApiPlugin(
              createDevApiMiddleware({
                isDev: true,
                reportHandler: runtimeEntries!.reportEntry,
                regionRefreshHandler: runtimeEntries!.regionRefreshEntry,
              }),
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
