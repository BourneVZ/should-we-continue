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
    <section className="flex flex-col gap-4 rounded-3xl border border-accentSoft bg-white p-6 shadow-sm">
      <div className="flex gap-3">
        <button type="button" onClick={onExportPersonal}>
          导出个人报告
        </button>
        <button type="button" onClick={onExportDiscussion}>
          导出共同讨论
        </button>
      </div>
      <fieldset>
        <legend>清除范围</legend>
        <label className="flex items-center gap-2">
          <input checked={selectedScope === "user"} type="radio" onChange={() => onSelectScope("user")} />
          仅用户数据
        </label>
        <label className="flex items-center gap-2">
          <input checked={selectedScope === "partner"} type="radio" onChange={() => onSelectScope("partner")} />
          仅伴侣数据
        </label>
        <label className="flex items-center gap-2">
          <input checked={selectedScope === "all"} type="radio" onChange={() => onSelectScope("all")} />
          全部本机数据
        </label>
      </fieldset>
      {confirmationRequired ? (
        <button type="button" onClick={onConfirmClear}>
          确认清除
        </button>
      ) : null}
    </section>
  );
}
