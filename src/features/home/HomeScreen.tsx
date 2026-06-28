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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#e4f5f7_0%,#f7f4ec_42%,#f4efe4_100%)] text-slate-900">
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(135deg,rgba(72,148,165,0.16),rgba(244,239,228,0))]" />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-12 pt-8 md:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-700">妊娠去留梳理工具</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight text-slate-900 md:text-6xl">
              把混乱拆成一题一题，
              <br />
              帮你先看清自己真正需要什么。
            </h1>
          </div>
          <div className="hidden rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur md:block">
            本地优先保存
          </div>
        </header>

        <section className="mt-10 grid flex-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[40px] border border-white/70 bg-[#5d99b6] px-8 py-12 text-white shadow-[0_24px_80px_rgba(48,86,102,0.18)] md:px-12 md:py-16">
            <div className="absolute inset-x-0 top-0 h-20 bg-[polygon(0_0,100%_0,100%_45%,72%_62%,38%_46%,0_58%)] bg-white/12 [clip-path:polygon(0_0,100%_0,100%_45%,72%_62%,38%_46%,0_58%)]" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.22em] text-white/80">自我梳理工具</p>
              <p className="mt-6 text-3xl font-semibold leading-snug md:text-5xl">
                不替你做决定，
                <br />
                只帮你把问题看得更完整。
              </p>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/86 md:text-lg">
                通过结构化问卷梳理安全风险、医学状态、现实支持、沟通边界和接下来需要先做的事。所有回答默认仅保存在当前浏览器本地。
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  className="rounded-full bg-[#f3c869] px-8 py-4 text-base font-semibold text-slate-900 shadow-[0_18px_45px_rgba(36,63,75,0.2)] transition hover:-translate-y-0.5 hover:bg-[#f7d887]"
                  type="button"
                  onClick={onStartOrResume}
                >
                  {hasExistingData ? "继续填写问卷" : "开始填写问卷"}
                </button>
                {hasExistingData ? (
                  <button
                    className="rounded-full border border-white/40 bg-white/12 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={onOpenLatestReport}
                    disabled={reportStatus === "none"}
                  >
                    查看当前报告
                  </button>
                ) : null}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,rgba(93,153,182,0)_0%,rgba(255,255,255,0.16)_100%)]" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 [clip-path:polygon(0_100%,10%_78%,23%_84%,36%_72%,51%_80%,66%_65%,79%_75%,100%_60%,100%_100%)] bg-[#f8f3ea]" />
            <div className="pointer-events-none absolute bottom-8 left-10 h-14 w-14 rounded-full bg-[#83c08c]/70 blur-sm" />
            <div className="pointer-events-none absolute bottom-14 right-14 h-16 w-16 rounded-full bg-[#f3c869]/70 blur-sm" />
          </div>

          <aside className="space-y-5">
            <section className="rounded-[32px] border border-white/80 bg-white/88 p-7 shadow-[0_14px_50px_rgba(44,62,80,0.08)] backdrop-blur">
              <h2 className="text-lg font-semibold text-slate-900">开始前你会看到什么</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                <li>先做安全与身体状态筛查，命中高风险时会优先提示线下支持。</li>
                <li>后续按主题逐题填写，不会直接给出“该继续”或“该终止”的裁决。</li>
                <li>生成结果时，优先输出行动提醒、沟通边界和需要进一步确认的事项。</li>
              </ul>
            </section>

            <section className="rounded-[32px] border border-[#d8e8ee] bg-[#f7fbfd] p-7 shadow-[0_14px_50px_rgba(44,62,80,0.06)]">
              <h2 className="text-lg font-semibold text-slate-900">隐私提示</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                回答默认仅保存在当前浏览器本地；同一设备的其他使用者仍可能看到这些内容。若你所处环境不安全，请先确保设备与空间安全后再填写。
              </p>
              {hasExistingData ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex min-h-8 items-center justify-center rounded-full bg-sky-100 px-4 py-1 text-center text-xs font-semibold leading-5 text-sky-800">
                    当前状态：{reportStatus === "fresh" ? "报告已更新" : reportStatus === "stale" ? "报告待刷新" : "仅有草稿"}
                  </span>
                  <button
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    type="button"
                    onClick={onClearData}
                  >
                    清除本机数据
                  </button>
                </div>
              ) : null}
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
