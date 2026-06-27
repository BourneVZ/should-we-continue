import type { ReactElement } from "react";

interface HomeScreenProps {
  hasExistingData: boolean;
  reportStatus: "none" | "fresh" | "stale";
  onStartOrResume: () => void;
  onOpenLatestReport: () => void;
  onClearData: () => void;
}

export function HomeScreen({
  hasExistingData,
  reportStatus,
  onStartOrResume,
  onOpenLatestReport,
  onClearData,
}: HomeScreenProps): ReactElement {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-10">
      <section className="rounded-3xl border border-accentSoft bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-ink">Should We Continue</h1>
        <p className="mt-4 text-slate-700">
          回答默认保存在当前浏览器；同一设备的其他使用者可能看到这些内容。
        </p>
        {hasExistingData ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={onStartOrResume}>
              重新填写并更新报告
            </button>
            <button type="button" onClick={onOpenLatestReport} disabled={reportStatus === "none"}>
              查看最新报告
            </button>
            <button type="button" onClick={onClearData}>
              清除本机数据
            </button>
          </div>
        ) : (
          <button className="mt-6" type="button" onClick={onStartOrResume}>
            开始填写
          </button>
        )}
      </section>
    </main>
  );
}
