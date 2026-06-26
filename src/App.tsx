import type { ReactElement } from "react";

export function App(): ReactElement {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
      <section className="rounded-3xl border border-accentSoft bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-ink">Should We Continue</h1>
        <p className="mt-4 max-w-2xl text-base text-slate-700">
          Phase 1 scaffold is active. Domain rules, questionnaire flow, and report generation will be added through
          task-driven tests.
        </p>
      </section>
    </main>
  );
}
