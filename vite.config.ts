import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { createDevApiMiddleware, createDevApiPlugin } from "./api/_lib/dev-middleware";

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    ...(command === "serve"
      ? [
          createDevApiPlugin(
            createDevApiMiddleware({
              isDev: true,
              reportHandler: async () => ({ status: 503, body: { error: "dev_api_not_configured" } }),
              regionRefreshHandler: async () => ({ status: 503, body: { error: "dev_api_not_configured" } }),
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
}));
