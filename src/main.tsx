import React from "react";
import ReactDOM from "react-dom/client";
import { createInitialAppState } from "./app/app-reducer";
import { App } from "./app/App";
import { createAppServices } from "./app/services";
import type { ReportViewModel } from "./domain/types";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

const initialState = createInitialAppState({
  hasExistingReport: false,
  reportStale: false,
  canOpenPartnerDiscussion: false,
  redFlagLevel: "none",
});

const initialReport: ReportViewModel = {
  redFlag: { level: "none", actionIds: [] },
  dimensions: [],
  certainty: "medium",
  priorityActionIds: [],
  pathContinue: [],
  pathEnd: [],
  persona: {
    primaryPersonaId: null,
    secondaryPersonaId: null,
    candidatePersonaIds: [],
    personaConfidence: 0,
    statusTagIds: [],
    suppressedReason: null,
  },
  region: {
    status: "empty" as const,
    checkedAt: null,
    expiresAt: null,
    verifiedFields: [],
  },
  measures: [],
};

const services = createAppServices({
  repository: {},
  clock: { now: () => Date.now() },
  apiClient: {},
  diagnostics: {
    isDev: import.meta.env.DEV,
    configAvailable: false,
    templateFallbackActive: false,
    errorCategory: null,
    schemaStatus: "valid" as const,
  },
});

interface RootFallbackProps {
  children: React.ReactNode;
}

interface RootFallbackState {
  hasError: boolean;
}

class RootErrorBoundary extends React.Component<RootFallbackProps, RootFallbackState> {
  override state: RootFallbackState = { hasError: false };

  static getDerivedStateFromError(): RootFallbackState {
    return { hasError: true };
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-6 py-10">
          <h1 className="text-2xl font-semibold text-ink">页面暂时无法显示</h1>
          <p className="text-sm text-slate-700">请重试，或清除当前浏览器中的本地数据后重新开始。</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => window.location.reload()}>
              重试
            </button>
            <button type="button" onClick={() => window.localStorage.clear()}>
              清除并重新开始
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App report={initialReport} services={services} state={initialState} />
    </RootErrorBoundary>
  </React.StrictMode>,
);
