import type { ReactElement } from "react";
import type { ReportViewModel } from "@/domain/types";

interface OverviewPageProps {
  report: ReportViewModel;
  partnerPerspectiveAuthorized: boolean;
}

export function OverviewPage({ report, partnerPerspectiveAuthorized }: OverviewPageProps): ReactElement {
  return (
    <section className="flex flex-col gap-4">
      <header>
        {report.persona.primaryPersonaId ? (
          <h2 className="text-xl font-semibold text-ink">{report.persona.primaryPersonaId}</h2>
        ) : (
          <h2 className="text-xl font-semibold text-ink">仍在校准中</h2>
        )}
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {report.dimensions.map((dimension) => (
          <article key={dimension.dimensionId} className="rounded-2xl border border-accentSoft p-4">
            <h3 className="font-medium text-ink">{dimension.dimensionId}</h3>
            <p className="text-sm text-slate-700">{dimension.displayLevel}</p>
          </article>
        ))}
      </div>
      <section>
        <h3 className="font-medium text-ink">优先行动</h3>
        <ul className="list-disc pl-6">
          {report.priorityActionIds.slice(0, 3).map((actionId) => (
            <li key={actionId}>{actionId}</li>
          ))}
        </ul>
      </section>
      {partnerPerspectiveAuthorized ? <p>伴侣视角已授权</p> : null}
    </section>
  );
}
