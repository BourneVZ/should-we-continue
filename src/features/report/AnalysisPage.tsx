import type { ReactElement } from "react";
import type { ReportViewModel } from "@/domain/types";

interface AnalysisPageProps {
  report: ReportViewModel;
  commonFactIds: readonly string[];
  privateNoteSummaryVisible: boolean;
}

export function AnalysisPage({ report, commonFactIds, privateNoteSummaryVisible }: AnalysisPageProps): ReactElement {
  return (
    <section className="flex flex-col gap-4">
      <section>
        <h2 className="text-xl font-semibold text-ink">共同事实</h2>
        <ul className="list-disc pl-6">
          {commonFactIds.map((factId) => (
            <li key={factId}>{factId}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-ink">地区卡</h2>
        {report.region.verifiedFields.map((field) => (
          <article key={field.fieldId} className="rounded-2xl border border-accentSoft p-4">
            <a href={field.sourceUrl} rel="noreferrer noopener" target="_blank">
              {field.sourceUrl}
            </a>
            <p>{field.checkedAt}</p>
            <p>{field.applicableIf.join(" / ")}</p>
          </article>
        ))}
        {report.region.status === "stale" ? <p>可能过期</p> : null}
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-ink">继续妊娠条件</h2>
          <ul className="list-disc pl-6">
            {report.pathContinue.map((item) => (
              <li key={item.conditionId}>{item.conditionId}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">终止妊娠条件</h2>
          <ul className="list-disc pl-6">
            {report.pathEnd.map((item) => (
              <li key={item.conditionId}>{item.conditionId}</li>
            ))}
          </ul>
        </section>
      </div>
      {privateNoteSummaryVisible ? <p>私人备注摘要已显示</p> : null}
    </section>
  );
}
