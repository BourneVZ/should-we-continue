import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DataControls } from "@/features/data-controls/DataControls";

describe("DataControls", () => {
  it("renders export plus clear-range choices with explicit confirmation and no preview", () => {
    const html = renderToStaticMarkup(
      <DataControls
        selectedScope={null}
        confirmationRequired
        onExportPersonal={() => undefined}
        onExportDiscussion={() => undefined}
        onSelectScope={() => undefined}
        onConfirmClear={() => undefined}
      />,
    );

    expect(html).toContain("导出个人报告");
    expect(html).toContain("仅用户数据");
    expect(html).toContain("仅伴侣数据");
    expect(html).toContain("全部本机数据");
    expect(html).toContain("确认清除");
    expect(html).not.toContain("预览");
  });
});
