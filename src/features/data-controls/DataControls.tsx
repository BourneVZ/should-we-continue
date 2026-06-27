import type { ReactElement } from "react";

interface DataControlsProps {
  selectedScope: "user" | "partner" | "all" | null;
  confirmationRequired: boolean;
  onExportPersonal: () => void;
  onExportDiscussion: () => void;
  onSelectScope: (scope: "user" | "partner" | "all") => void;
  onConfirmClear: () => void;
}

export function DataControls({
  selectedScope,
  confirmationRequired,
  onExportPersonal,
  onExportDiscussion,
  onSelectScope,
  onConfirmClear,
}: DataControlsProps): ReactElement {
  return (
    <section className="space-y-6 rounded-[32px] border border-[#dce7e3] bg-white p-8 shadow-[0_16px_50px_rgba(31,56,68,0.08)]">
      <header className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">数据控制</h2>
        <p className="text-sm leading-7 text-slate-600">
          你可以导出当前内容，也可以按范围清除本机数据。所有操作仅针对当前浏览器本地保存的信息。
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-full bg-[#14344b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#19415d]"
          type="button"
          onClick={onExportPersonal}
        >
          导出个人报告
        </button>
        <button
          className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          type="button"
          onClick={onExportDiscussion}
        >
          导出共同讨论
        </button>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-900">清除范围</legend>
        <label className="flex cursor-pointer items-center gap-3 rounded-[20px] border border-slate-200 px-4 py-4 text-sm text-slate-700 transition hover:bg-slate-50">
          <input checked={selectedScope === "user"} type="radio" onChange={() => onSelectScope("user")} />
          仅用户数据
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-[20px] border border-slate-200 px-4 py-4 text-sm text-slate-700 transition hover:bg-slate-50">
          <input checked={selectedScope === "partner"} type="radio" onChange={() => onSelectScope("partner")} />
          仅伴侣数据
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-[20px] border border-slate-200 px-4 py-4 text-sm text-slate-700 transition hover:bg-slate-50">
          <input checked={selectedScope === "all"} type="radio" onChange={() => onSelectScope("all")} />
          全部本机数据
        </label>
      </fieldset>

      {confirmationRequired ? (
        <button
          className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          type="button"
          onClick={onConfirmClear}
        >
          确认清除
        </button>
      ) : null}
    </section>
  );
}
